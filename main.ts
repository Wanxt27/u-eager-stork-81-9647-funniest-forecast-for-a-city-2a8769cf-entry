// Funniest Forecast for a City That Isn't — make.fun entry.
// Writes one line, the weather forecast for the invented city of
// Mizzleford, to /output/entry.txt. Node 22, standard library only.
import { createHash } from "node:crypto";
import {
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");
const MAX_CHARS = 120;

// The forecast: a flat bulletin that breaks on its own fog. Mizzleford
// does not exist; its postman is having a worse day than its weather.
const FORECAST =
  "Mizzleford: thick fog, 12°C; the postman delivered yesterday's weather by mistake and refuses to take it back.";

function checkLine(text: string): void {
  if (typeof text !== "string") {
    throw new Error("forecast must be a string");
  }
  if (text.length < 1 || text.length > MAX_CHARS) {
    throw new Error(
      `forecast must be 1-${MAX_CHARS} characters, got ${text.length}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("forecast must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("forecast must be exactly one line");
  }
}

function main(): void {
  checkLine(FORECAST);
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, FORECAST, "utf8");
  // Read back and re-check so a bad write can never slip through.
  const written = readFileSync(OUT_FILE, "utf8");
  checkLine(written);
  if (written !== FORECAST) {
    throw new Error("written forecast does not match the intended line");
  }
  // No trailing newline, no extra bytes: the file must be exactly the
  // forecast's UTF-8 encoding, nothing more.
  const fileBytes = statSync(OUT_FILE).size;
  const textBytes = Buffer.byteLength(written, "utf8");
  if (fileBytes !== textBytes) {
    throw new Error(
      `entry file is ${fileBytes} bytes, expected ${textBytes}`,
    );
  }
  const digest = createHash("sha256").update(written, "utf8").digest("hex");
  console.log(`wrote ${written.length} characters to ${OUT_FILE}`);
  console.log(`sha256 ${digest}`);
}

main();
