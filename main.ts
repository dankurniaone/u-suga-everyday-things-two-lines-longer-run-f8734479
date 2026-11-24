// Everyday Things, Two Lines, Longer Run — make.fun entry
// Writes a two-line explanation of a traffic jam to /output/entry.txt:
// line 1 explains it to a 10-year-old through one vivid analogy,
// line 2 says honestly what that analogy maps and what it leaves out.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE_1 =
  "A traffic jam is like a straw full of peas: every car is a pea stuck behind the one in front, waiting its turn to slide out the end.";
const LINE_2 =
  "The pea part fits because cars move one after another and nobody can overtake, but it leaves out that peas never honk, get bored, or choose a different road.";

const entry = `${LINE_1}\n${LINE_2}`;

function fail(message: string): never {
  console.error(`gate failed: ${message}`);
  process.exit(1);
}

// Gate: UTF-8 text, 1 to 400 characters, not only white space, two lines.
// Pure ASCII keeps bytes equal to characters (ties break on fewer bytes).
if (!/^[\x00-\x7F]*$/.test(entry)) {
  fail("entry is not pure ASCII");
}
if (Buffer.byteLength(entry, "utf8") > 400) {
  fail(`entry is ${Buffer.byteLength(entry, "utf8")} bytes, must be at most 400`);
}
if (entry.length < 1 || entry.length > 400) {
  fail(`entry is ${entry.length} characters, must be 1 to 400`);
}
if (entry.trim().length === 0) {
  fail("entry is only white space");
}
const lines = entry.split("\n");
if (lines.length !== 2) {
  fail(`entry has ${lines.length} lines, must be exactly 2`);
}
for (const [index, line] of lines.entries()) {
  if (line.trim().length === 0) {
    fail(`line ${index + 1} is empty`);
  }
  if (line !== line.trim()) {
    fail(`line ${index + 1} has leading or trailing white space`);
  }
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", entry, "utf8");

// Round-trip check: what the grader reads must be exactly what we wrote.
const roundTrip = readFileSync("/output/entry.txt", "utf8");
if (roundTrip !== entry) {
  fail("round-trip mismatch between written and read-back entry");
}

console.log(`wrote /output/entry.txt (${entry.length} characters, ${lines.length} lines)`);
console.log(entry);
