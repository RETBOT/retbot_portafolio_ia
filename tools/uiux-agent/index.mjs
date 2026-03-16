import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";

const UI_EXTENSIONS = new Set([
  ".html",
  ".css",
  ".scss",
  ".sass",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".vue",
  ".dart",
  ".swift",
  ".xaml",
]);

const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".turbo",
  ".idea",
  ".vscode",
  "coverage",
  ".uiux-agent",
]);

function timestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function detectFramework(filePath, forced = "auto") {
  if (forced && forced !== "auto") return forced;

  const ext = extname(filePath).toLowerCase();
  if (ext === ".vue") return "vue";
  if (ext === ".dart") return "flutter";
  if (ext === ".xaml") return "xaml";
  if (ext === ".swift") return "swiftui";
  if (ext === ".html") return "html";
  if (ext === ".css" || ext === ".scss" || ext === ".sass") return "css";
  return "react";
}

function discoverFiles(target, maxFiles) {
  const files = [];

  function walk(dir) {
    if (files.length >= maxFiles) return;
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (files.length >= maxFiles) break;
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        if (EXCLUDED_DIRS.has(entry.name)) continue;
        walk(fullPath);
        continue;
      }

      const ext = extname(entry.name).toLowerCase();
      if (!UI_EXTENSIONS.has(ext)) continue;

      files.push(fullPath);
    }
  }

  walk(target);
  return files;
}

function pushIssue(issues, issue) {
  issues.push({
    severity: issue.severity || "medium",
    category: issue.category || "consistency",
    file: issue.file || "unknown",
    message: issue.message,
    evidence: issue.evidence || "",
  });
}

function analyzeSpacing(filePath, content, issues) {
  const pxMatches = [...content.matchAll(/(\d+)px/g)].map((m) => Number(m[1]));
  if (pxMatches.length < 8) return;

  const offScale = pxMatches.filter((value) => value % 4 !== 0);
  if (offScale.length >= 5) {
    pushIssue(issues, {
      severity: "medium",
      category: "spacing",
      file: filePath,
      message: "Inconsistent spacing scale detected.",
      evidence: `Found ${offScale.length} px values not aligned to 4px rhythm.`,
    });
  }
}

function analyzeLayout(filePath, content, issues) {
  const absoluteCount = (content.match(/\babsolute\b/g) || []).length;
  const fixedSizes = (content.match(/\b(w|h)-\[(\d+)px\]/g) || []).length;

  if (absoluteCount > 14) {
    pushIssue(issues, {
      severity: "medium",
      category: "layout",
      file: filePath,
      message: "Heavy use of absolute positioning can break responsiveness.",
      evidence: `Detected ${absoluteCount} absolute references.`,
    });
  }

  if (fixedSizes > 12) {
    pushIssue(issues, {
      severity: "medium",
      category: "layout",
      file: filePath,
      message: "Many fixed pixel sizes detected.",
      evidence: `Detected ${fixedSizes} fixed tailwind size utilities.`,
    });
  }
}

function analyzeTypography(filePath, content, issues) {
  const headingSizes = [...content.matchAll(/text-\[(\d+)px\]/g)].map((m) => Number(m[1]));
  if (headingSizes.length >= 8) {
    const unique = new Set(headingSizes);
    if (unique.size >= 7) {
      pushIssue(issues, {
        severity: "low",
        category: "typography",
        file: filePath,
        message: "Typography scale may be inconsistent.",
        evidence: `Found ${unique.size} unique custom font-size values in this file.`,
      });
    }
  }
}

function analyzeAccessibility(filePath, content, issues) {
  const missingAlt = (content.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length;
  if (missingAlt > 0) {
    pushIssue(issues, {
      severity: "high",
      category: "accessibility",
      file: filePath,
      message: "Image elements without alt text detected.",
      evidence: `Found ${missingAlt} img tags missing alt attribute.`,
    });
  }

  const clickDiv = (content.match(/<div[^>]*onClick=/g) || []).length;
  if (clickDiv > 0) {
    pushIssue(issues, {
      severity: "high",
      category: "accessibility",
      file: filePath,
      message: "Clickable div detected. Prefer button with keyboard support.",
      evidence: `Found ${clickDiv} clickable div elements.`,
    });
  }

  const iconButtons = [...content.matchAll(/<button[^>]*>([\s\S]{0,180})<\/button>/g)]
    .filter((m) => !/aria-label=/.test(m[0]) && /<svg|<img/.test(m[1])).length;
  if (iconButtons > 0) {
    pushIssue(issues, {
      severity: "medium",
      category: "accessibility",
      file: filePath,
      message: "Icon-only button without aria-label detected.",
      evidence: `Found ${iconButtons} icon-only buttons without aria-label.`,
    });
  }
}

function analyzeConsistency(filePath, content, issues) {
  const inlineStyles = (content.match(/style=\{\{/g) || []).length;
  if (inlineStyles >= 5) {
    pushIssue(issues, {
      severity: "low",
      category: "consistency",
      file: filePath,
      message: "Many inline styles detected; consider design tokens/components.",
      evidence: `Found ${inlineStyles} inline style objects.`,
    });
  }
}

function scoreIssues(issues) {
  const severityWeight = { high: 8, medium: 4, low: 1 };
  let score = 100;
  for (const issue of issues) {
    score -= severityWeight[issue.severity] || 2;
  }

  const categories = ["layout", "spacing", "typography", "accessibility", "consistency"];
  const subScores = {};
  for (const category of categories) {
    const categoryIssues = issues.filter((issue) => issue.category === category);
    let categoryScore = 100;
    for (const issue of categoryIssues) categoryScore -= severityWeight[issue.severity] || 2;
    subScores[category] = Math.max(0, Math.min(100, categoryScore));
  }

  return {
    total: Math.max(0, Math.min(100, score)),
    subScores,
  };
}

function buildRecommendations(issues) {
  const hasCategory = (category) => issues.some((issue) => issue.category === category);
  const recommendations = [];

  if (hasCategory("accessibility")) {
    recommendations.push({
      priority: "high",
      title: "Improve semantic accessibility",
      detail: "Replace clickable divs with buttons/links, add aria-label for icon actions, and ensure all images include descriptive alt text.",
    });
  }

  if (hasCategory("spacing")) {
    recommendations.push({
      priority: "high",
      title: "Adopt a spacing system",
      detail: "Normalize spacing to a 4/8px scale and centralize spacing tokens to improve visual rhythm and consistency.",
    });
  }

  if (hasCategory("layout")) {
    recommendations.push({
      priority: "medium",
      title: "Reduce rigid layout constraints",
      detail: "Limit absolute positioning and fixed pixel dimensions in favor of responsive grid/flex rules and fluid sizing.",
    });
  }

  if (hasCategory("typography")) {
    recommendations.push({
      priority: "medium",
      title: "Stabilize typography scale",
      detail: "Use a typography system with defined heading/body levels and reduce arbitrary font-size values.",
    });
  }

  if (hasCategory("consistency")) {
    recommendations.push({
      priority: "low",
      title: "Promote reusable UI patterns",
      detail: "Move repeated inline styling into shared classes/components and design tokens.",
    });
  }

  return recommendations;
}

function buildImprovedCodeSuggestions(framework, issues) {
  const snippets = [];

  if (issues.some((issue) => issue.category === "accessibility" && issue.message.includes("Image elements"))) {
    snippets.push({
      title: "Accessible image markup",
      framework,
      code: `<img src={avatarSrc} alt="User avatar" className="w-10 h-10 object-cover rounded-full" />`,
    });
  }

  if (issues.some((issue) => issue.category === "accessibility" && issue.message.includes("Clickable div"))) {
    snippets.push({
      title: "Replace clickable div with button",
      framework,
      code: `<button type="button" onClick={handleOpen} className="rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">Open</button>`,
    });
  }

  if (issues.some((issue) => issue.category === "spacing")) {
    snippets.push({
      title: "Spacing token strategy",
      framework: "css",
      code: `:root {\n  --space-1: 4px;\n  --space-2: 8px;\n  --space-3: 12px;\n  --space-4: 16px;\n  --space-6: 24px;\n}\n\n.card {\n  padding: var(--space-4);\n  gap: var(--space-3);\n}`,
    });
  }

  return snippets;
}

function detectImageSize(filePath) {
  const ext = extname(filePath).toLowerCase();
  const buffer = readFileSync(filePath);

  if (ext === ".png" && buffer.length >= 24) {
    const pngSig = "89504e470d0a1a0a";
    if (buffer.subarray(0, 8).toString("hex") === pngSig) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }
  }

  if ((ext === ".jpg" || ext === ".jpeg") && buffer.length > 4) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      const isSOF = marker >= 0xc0 && marker <= 0xc3;
      if (isSOF) {
        const height = buffer.readUInt16BE(offset + 5);
        const width = buffer.readUInt16BE(offset + 7);
        return { width, height };
      }
      offset += 2 + length;
    }
  }

  return null;
}

function analyzeScreenshots(paths) {
  const findings = [];
  for (const path of paths) {
    try {
      if (!statSync(path).isFile()) continue;
      const size = detectImageSize(path);
      if (!size) {
        findings.push({
          file: path,
          message: "Screenshot loaded, but dimensions could not be parsed.",
        });
        continue;
      }

      const viewportType = size.width <= 480 ? "mobile" : size.width <= 1024 ? "tablet" : "desktop";
      findings.push({
        file: path,
        message: `Screenshot detected as ${viewportType} viewport (${size.width}x${size.height}).`,
      });
    } catch {
      findings.push({
        file: path,
        message: "Screenshot could not be analyzed.",
      });
    }
  }

  return findings;
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# UI/UX Agent Report");
  lines.push("");
  lines.push(`- Target: ${report.target}`);
  lines.push(`- Files analyzed: ${report.meta.filesAnalyzed}`);
  lines.push(`- Framework mode: ${report.meta.framework}`);
  lines.push(`- UX score: ${report.score.total}/100`);
  lines.push("");

  lines.push("## 1. Problems Found");
  if (report.issues.length === 0) {
    lines.push("- No critical problems detected.");
  } else {
    for (const issue of report.issues) {
      lines.push(`- [${issue.severity.toUpperCase()}] ${issue.category} - ${issue.message} (${issue.file})`);
      if (issue.evidence) lines.push(`  - Evidence: ${issue.evidence}`);
    }
  }
  lines.push("");

  lines.push("## 2. Design Recommendations");
  for (const rec of report.recommendations) {
    lines.push(`- [${rec.priority.toUpperCase()}] ${rec.title}: ${rec.detail}`);
  }
  lines.push("");

  lines.push("## 3. Improved Code Suggestions");
  if (report.improvedCode.length === 0) {
    lines.push("- No code snippets generated.");
  } else {
    for (const snippet of report.improvedCode) {
      lines.push(`- ${snippet.title} (${snippet.framework})`);
      lines.push("```txt");
      lines.push(snippet.code);
      lines.push("```");
    }
  }
  lines.push("");

  lines.push("## 4. UX Score");
  lines.push(`- Total: ${report.score.total}/100`);
  lines.push(`- Layout: ${report.score.subScores.layout}`);
  lines.push(`- Spacing: ${report.score.subScores.spacing}`);
  lines.push(`- Typography: ${report.score.subScores.typography}`);
  lines.push(`- Accessibility: ${report.score.subScores.accessibility}`);
  lines.push(`- Consistency: ${report.score.subScores.consistency}`);
  lines.push("");

  if (report.screenshots.length > 0) {
    lines.push("## 5. Screenshot Insights");
    for (const shot of report.screenshots) {
      lines.push(`- ${basename(shot.file)}: ${shot.message}`);
    }
  }

  return lines.join("\n");
}

function toPrComment(report) {
  const topIssues = report.issues.slice(0, 6);
  const lines = [];
  lines.push("### UI/UX Agent Report");
  lines.push("");
  lines.push(`- UX Score: **${report.score.total}/100**`);
  lines.push(`- Files analyzed: ${report.meta.filesAnalyzed}`);
  lines.push("");
  lines.push("Top findings:");
  if (topIssues.length === 0) {
    lines.push("- No high-impact issues detected.");
  } else {
    for (const issue of topIssues) {
      lines.push(`- [${issue.severity}] ${issue.category}: ${issue.message}`);
    }
  }
  lines.push("");
  lines.push("Top recommendations:");
  for (const rec of report.recommendations.slice(0, 4)) {
    lines.push(`- [${rec.priority}] ${rec.title}`);
  }
  return lines.join("\n");
}

export async function runUiUxAgent(options) {
  const target = resolve(options.target || process.cwd());
  const mode = options.mode || "all";
  const framework = options.framework || "auto";
  const files = discoverFiles(target, options.maxFiles || 350);
  const issues = [];

  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const fileFramework = detectFramework(file, framework);
    analyzeLayout(file, text, issues, fileFramework);
    analyzeSpacing(file, text, issues, fileFramework);
    analyzeTypography(file, text, issues, fileFramework);
    analyzeAccessibility(file, text, issues, fileFramework);
    analyzeConsistency(file, text, issues, fileFramework);
  }

  const screenshots = analyzeScreenshots(options.screenshots || []);
  const score = scoreIssues(issues);
  const recommendations = buildRecommendations(issues);
  const improvedCode = buildImprovedCodeSuggestions(framework, issues);

  const report = {
    target,
    mode,
    description: options.description || "",
    issues,
    recommendations,
    improvedCode,
    score,
    screenshots,
    meta: {
      filesAnalyzed: files.length,
      framework,
      generatedAt: new Date().toISOString(),
      outputDir: "",
    },
  };

  const outputDir = options.output
    ? resolve(options.output)
    : join(target, ".uiux-agent", "reports", timestamp());
  mkdirSync(outputDir, { recursive: true });

  const outputJson = join(outputDir, "uiux-report.json");
  const outputMd = join(outputDir, "uiux-report.md");
  const outputPr = join(outputDir, "uiux-pr-comment.md");

  report.meta.outputDir = outputDir;

  if (["json", "both"].includes(options.format || "both")) {
    writeFileSync(outputJson, JSON.stringify(report, null, 2), "utf8");
  }

  if (["md", "both"].includes(options.format || "both")) {
    writeFileSync(outputMd, toMarkdown(report), "utf8");
  }

  if (options.prComment) {
    writeFileSync(outputPr, toPrComment(report), "utf8");
  }

  return report;
}
