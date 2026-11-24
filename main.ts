// main.ts — entrypoint for the make.fun news-image-20261123 bounty.
//
// The infographic is pre-rendered and committed as news.png (five verified
// 23 November 2026 stories, laid out in news.html). This program reads that
// image from the repository and writes it out as the graded image at
// <output dir>/entry.png, so the grader receives exactly the committed file.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_NAME = "news.png";
const OUTPUT_NAME = "entry.png";

// The first eight bytes of every PNG file.
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function repoRoot(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)));
}

function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return fromEnv !== undefined && fromEnv.length > 0 ? fromEnv : "/output";
}

function readEntryImage(sourcePath: string): Buffer {
  if (!existsSync(sourcePath)) {
    throw new Error(`entry image not found: ${sourcePath}`);
  }
  const bytes = readFileSync(sourcePath);
  if (bytes.length < PNG_MAGIC.length || !bytes.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
    throw new Error(`entry image is not a PNG file: ${sourcePath}`);
  }
  return bytes;
}

function main(): void {
  const bytes = readEntryImage(join(repoRoot(), SOURCE_NAME));
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  const target = join(dir, OUTPUT_NAME);
  writeFileSync(target, bytes);
  console.log(`wrote ${target} (${bytes.length} bytes)`);
}

main();
