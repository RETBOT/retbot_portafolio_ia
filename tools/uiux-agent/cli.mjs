#!/usr/bin/env node
import { resolve } from "node:path";
import { existsSync } from "node:fs";
import { runUiUxAgent } from "./index.mjs";

function parseArgs(argv) {
  const args = {
    target: process.cwd(),
    mode: "all",
    framework: "auto",
    screenshots: [],
    description: "",
    output: "",
    format: "both",
    maxFiles: 350,
    prComment: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--target" && next) {
      args.target = resolve(next);
      i += 1;
      continue;
    }

    if (arg === "--mode" && next) {
      args.mode = next;
      i += 1;
      continue;
    }

    if (arg === "--framework" && next) {
      args.framework = next;
      i += 1;
      continue;
    }

    if (arg === "--screenshot" && next) {
      args.screenshots.push(resolve(next));
      i += 1;
      continue;
    }

    if (arg === "--description" && next) {
      args.description = next;
      i += 1;
      continue;
    }

    if (arg === "--output" && next) {
      args.output = resolve(next);
      i += 1;
      continue;
    }

    if (arg === "--format" && next) {
      args.format = next;
      i += 1;
      continue;
    }

    if (arg === "--max-files" && next) {
      args.maxFiles = Number(next) || 350;
      i += 1;
      continue;
    }

    if (arg === "--pr-comment") {
      args.prComment = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      args.help = true;
      continue;
    }
  }

  return args;
}

function showHelp() {
  const text = [
    "UI/UX AI Agent (Global)",
    "",
    "Usage:",
    "  node tools/uiux-agent/cli.mjs --target <path> [options]",
    "",
    "Options:",
    "  --target <path>       Project path to analyze (default: current directory)",
    "  --mode <mode>         analyze | recommend | improve | score | all",
    "  --framework <name>    auto | react | html | vue | angular | flutter | xaml | swiftui | tailwind",
    "  --screenshot <path>   Add screenshot path (repeatable)",
    "  --description <text>  Component/screen context",
    "  --output <path>       Output folder for reports",
    "  --format <value>      json | md | both",
    "  --max-files <n>       Max files to analyze (default: 350)",
    "  --pr-comment          Generate PR comment markdown",
    "  --help                Show this help",
  ];

  console.log(text.join("\n"));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    showHelp();
    return;
  }

  if (!existsSync(args.target)) {
    throw new Error(`Target path does not exist: ${args.target}`);
  }

  const result = await runUiUxAgent(args);
  console.log("\nUI/UX Agent completed.");
  console.log(`- Target: ${result.target}`);
  console.log(`- Files analyzed: ${result.meta.filesAnalyzed}`);
  console.log(`- Issues: ${result.issues.length}`);
  console.log(`- UX score: ${result.score.total}/100`);
  console.log(`- Report folder: ${result.meta.outputDir}`);
}

main().catch((error) => {
  console.error(`\n[uiux-agent] Error: ${error.message}`);
  process.exit(1);
});
