import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const baseBranch = process.env.AGENT_BASE_BRANCH || "master";

function resolveCommand(command) {
  if (process.platform !== "win32") return command;
  if (command === "npm") return "npm.cmd";
  return command;
}

function quoteArg(value) {
  if (!/[\s"]/g.test(value)) return value;
  return `"${value.replace(/"/g, '\\"')}"`;
}

function run(command, args = [], options = {}) {
  const proc =
    process.platform === "win32"
      ? spawnSync(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", [command, ...args].map(quoteArg).join(" ")], {
          cwd: process.cwd(),
          encoding: "utf8",
          stdio: "pipe",
        })
      : spawnSync(resolveCommand(command), args, {
          cwd: process.cwd(),
          encoding: "utf8",
          stdio: "pipe",
        });

  if (!options.capture) {
    if (proc.stdout) process.stdout.write(proc.stdout);
    if (proc.stderr) process.stderr.write(proc.stderr);
  }

  if (!options.allowFail && proc.status !== 0) {
    const detail = proc.stderr || proc.stdout || proc.error?.message || "Comando sin salida";
    throw new Error(`Fallo al ejecutar: ${command} ${args.join(" ")}\n${detail}`);
  }

  return {
    status: proc.status ?? 1,
    stdout: proc.stdout || "",
    stderr: proc.stderr || "",
  };
}

function git(args, options = {}) {
  return run("git", args, { capture: true, ...options });
}

function getCurrentBranch() {
  return git(["rev-parse", "--abbrev-ref", "HEAD"]).stdout.trim();
}

function getTimestamp() {
  const now = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}-${p(now.getHours())}${p(now.getMinutes())}`;
}

function assertFiles() {
  const required = [
    "src/components/About.jsx",
    "src/components/Works.jsx",
    "src/constants/index.js",
    "package.json",
  ];

  const missing = required.filter((file) => !existsSync(file));
  return { ok: missing.length === 0, missing };
}

function extractArrayBlock(content, marker) {
  const start = content.indexOf(marker);
  if (start < 0) return "";
  const end = content.indexOf("\n];", start);
  if (end < 0) return "";
  return content.slice(start, end + 3);
}

function runQa() {
  console.log("\n[agent:qa] Ejecutando build...");
  run("yarn", ["run", "build"]);

  const filesCheck = assertFiles();
  if (!filesCheck.ok) {
    throw new Error(`[agent:qa] Faltan archivos requeridos: ${filesCheck.missing.join(", ")}`);
  }

  const constants = readFileSync("src/constants/index.js", "utf8");
  const requiredTokens = ["const projectsEn", "const projectsEs", "const experiencesEn", "const experiencesEs"];
  const missingTokens = requiredTokens.filter((token) => !constants.includes(token));
  if (missingTokens.length > 0) {
    throw new Error(`[agent:qa] Faltan estructuras esperadas en constants: ${missingTokens.join(", ")}`);
  }

  console.log("[agent:qa] OK");
  return {
    ok: true,
    checks: ["build", "archivos_requeridos", "estructuras_constants"],
  };
}

function runContent() {
  console.log("\n[agent:content] Validando contenido...");
  const constants = readFileSync("src/constants/index.js", "utf8");

  const enBlock = extractArrayBlock(constants, "const projectsEn = [");
  const esBlock = extractArrayBlock(constants, "const projectsEs = [");

  if (!enBlock || !esBlock) {
    throw new Error("[agent:content] No se pudieron localizar projectsEn/projectsEs");
  }

  const countProjects = (block) => (block.match(/\bsource_code_link:\s*"/g) || []).length;
  const countEn = countProjects(enBlock);
  const countEs = countProjects(esBlock);

  if (countEn === 0 || countEs === 0) {
    throw new Error("[agent:content] Debe existir al menos un proyecto en ES y EN");
  }

  const links = [...constants.matchAll(/source_code_link:\s*"([^"]+)"/g)].map((m) => m[1]);
  const badLinks = links.filter((link) => !/^https?:\/\//i.test(link));
  if (badLinks.length > 0) {
    throw new Error(`[agent:content] Hay links invalidos: ${badLinks.join(", ")}`);
  }

  const descriptions = [...constants.matchAll(/description:\s*"([^"]*)"/g)].map((m) => m[1]);
  const emptyDescriptions = descriptions.filter((text) => text.trim().length === 0).length;
  if (emptyDescriptions > 0) {
    throw new Error("[agent:content] Existen descripciones vacias en proyectos");
  }

  console.log(`[agent:content] OK (projects EN: ${countEn}, ES: ${countEs}, links: ${links.length})`);
  return {
    ok: true,
    projectsEn: countEn,
    projectsEs: countEs,
    links: links.length,
  };
}

function summarizeFiles(files) {
  const summary = [];
  const addIf = (condition, text) => {
    if (condition) summary.push(text);
  };

  addIf(files.some((f) => f.startsWith("src/components/")), "Ajustes de componentes y UI");
  addIf(files.some((f) => f === "src/constants/index.js"), "Actualizacion de contenido de CV/proyectos");
  addIf(files.some((f) => f.startsWith("src/assets/")), "Actualizacion de recursos visuales");
  addIf(files.some((f) => f === "src/index.css"), "Mejoras de estilos globales");
  addIf(files.some((f) => f === "README.md"), "Actualizacion de documentacion");

  if (summary.length === 0) summary.push("Cambios generales de mantenimiento");
  return summary;
}

function buildCommitMessage(files) {
  if (files.some((f) => f.startsWith("src/components/") || f.startsWith("src/constants/"))) {
    return "feat: update CV content and responsive behavior";
  }
  if (files.some((f) => f.endsWith(".md"))) {
    return "docs: update project documentation";
  }
  return "chore: apply repository updates";
}

function ensureBranch() {
  const current = getCurrentBranch();
  if (current !== baseBranch) return current;

  const branch = `agent/cv-update-${getTimestamp()}`;
  console.log(`\n[agent:pr] Creando branch ${branch}...`);
  run("git", ["checkout", "-b", branch]);
  return branch;
}

function ensureGhInstalled() {
  const check = run("gh", ["--version"], { capture: true, allowFail: true });
  if (check.status !== 0) {
    throw new Error("[agent:pr] GitHub CLI (gh) no esta disponible en este entorno.");
  }
}

function getExistingPrUrl() {
  const view = run("gh", ["pr", "view", "--json", "url", "--jq", ".url"], {
    capture: true,
    allowFail: true,
  });

  if (view.status !== 0) return "";
  return view.stdout.trim();
}

function createPrBody({ summary, qaReport, contentReport, changedFiles }) {
  return [
    "## Resumen",
    ...summary.map((item) => `- ${item}`),
    "",
    "## Validacion automatica",
    `- Build: OK`,
    `- QA checks: ${qaReport.checks.join(", ")}`,
    `- Proyectos EN/ES: ${contentReport.projectsEn}/${contentReport.projectsEs}`,
    `- Links validados: ${contentReport.links}`,
    "",
    "## Archivos tocados",
    ...changedFiles.slice(0, 20).map((file) => `- \`${file}\``),
  ].join("\n");
}

function createPrComment({ qaReport, contentReport }) {
  return [
    "### Reporte del agente interno (Open Code)",
    "",
    "- Estado QA: OK",
    `- Checks ejecutados: ${qaReport.checks.join(", ")}`,
    `- Proyectos validados (EN/ES): ${contentReport.projectsEn}/${contentReport.projectsEs}`,
    `- Links de proyectos validados: ${contentReport.links}`,
    "",
    "Checklist:",
    "- [x] Build exitoso",
    "- [x] Estructura de contenido validada",
    "- [x] PR generado automaticamente",
  ].join("\n");
}

function runPr(qaReport, contentReport) {
  console.log("\n[agent:pr] Preparando commit/push/PR...");
  ensureGhInstalled();

  const branch = ensureBranch();
  run("git", ["add", "-A"]);

  const staged = git(["diff", "--cached", "--name-only"]).stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (staged.length > 0) {
    const commitMessage = buildCommitMessage(staged);
    run("git", ["commit", "-m", commitMessage]);
  } else {
    console.log("[agent:pr] No hay cambios nuevos para commit; continuando con PR existente/nuevo.");
  }

  run("git", ["push", "-u", "origin", branch]);

  let prUrl = getExistingPrUrl();
  const summary = summarizeFiles(staged.length > 0 ? staged : ["(sin cambios nuevos)"]);

  if (!prUrl) {
    const title = buildCommitMessage(staged.length > 0 ? staged : ["README.md"]);
    const body = createPrBody({
      summary,
      qaReport,
      contentReport,
      changedFiles: staged,
    });

    const created = run(
      "gh",
      ["pr", "create", "--base", baseBranch, "--head", branch, "--title", title, "--body", body],
      { capture: true }
    );

    prUrl = created.stdout.trim().split("\n").find((line) => line.startsWith("http")) || "";
  }

  if (!prUrl) {
    throw new Error("[agent:pr] No fue posible obtener la URL del PR.");
  }

  const comment = createPrComment({ qaReport, contentReport });
  run("gh", ["pr", "comment", prUrl, "--body", comment]);

  console.log(`\n[agent:pr] PR listo: ${prUrl}`);
  return prUrl;
}

function execute(mode) {
  if (mode === "qa") {
    runQa();
    return;
  }

  if (mode === "content") {
    runContent();
    return;
  }

  if (mode === "pr") {
    const qa = runQa();
    const content = runContent();
    runPr(qa, content);
    return;
  }

  const qa = runQa();
  const content = runContent();
  runPr(qa, content);
}

const mode = process.argv[2] || "run";

try {
  execute(mode);
} catch (error) {
  console.error(`\n[agent] Error: ${error.message}`);
  process.exit(1);
}
