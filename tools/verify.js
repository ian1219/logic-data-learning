#!/usr/bin/env node
/*
 * Maintainer tool - NOT needed by learners or by GitHub Pages.
 * Checks that every lesson file loads, every reference solution passes its own
 * tests, every starter does NOT already pass, and forbid-rules don't block the solution.
 *
 *   node tools/verify.js          # all lessons
 *   node tools/verify.js 04 05    # selected lessons
 *
 * Requires Node 22.5+ (uses the built-in node:sqlite for SQL lessons).
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const ctx = { window: {}, console };
ctx.window = ctx;
ctx.LDL = { lessons: {}, registerLesson(l) { ctx.LDL.lessons[l.id] = l; } };
vm.createContext(ctx);

function load(file) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), ctx, { filename: file });
}

load("lessons/index.js");
load("assets/js/sample-db.js");
const catalog = ctx.LDL.catalog;

/* ---------- JS testing (mirrors assets/js/runner.js) ---------- */

// Code runs in a separate vm context (so infinite loops can time out), so use
// realm-independent type checks instead of instanceof.
function tag(v) { return Object.prototype.toString.call(v); }
function normalize(v) { return tag(v) === "[object Set]" || tag(v) === "[object Map]" ? Array.from(v) : v; }
function deepEqual(a, b) {
  a = normalize(a); b = normalize(b);
  if (typeof a === "number" && typeof b === "number") {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    return a === b || Math.abs(a - b) < 1e-9;
  }
  if (a === b) return true;
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) return a.length === b.length && a.every((x, i) => deepEqual(x, b[i]));
  const ka = Object.keys(a), kb = Object.keys(b);
  return ka.length === kb.length && ka.every(k => Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]));
}
function sortForCompare(v) {
  v = normalize(v);
  return Array.isArray(v) ? v.slice().sort((x, y) => (JSON.stringify(x) < JSON.stringify(y) ? -1 : 1)) : v;
}
function codeOnly(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").replace(/(["'`])(?:\\.|(?!\1)[^\\])*\1/g, '""');
}
const quiet = { log() {}, error() {}, warn() {}, info() {}, table() {} };

function runJsTests(code, ex) {
  const failures = [];
  for (const t of ex.tests) {
    const body = t.code ? t.code : "return (" + t.expr + ");";
    const label = t.label || t.expr;
    let got, threw = null;
    const start = performance.now();
    try {
      const src = '(function (console) {"use strict";\n' + code + "\n;\n" + body + "\n})(quiet)";
      got = vm.runInNewContext(src, { quiet, performance, structuredClone, setTimeout, clearTimeout }, { timeout: 8000 });
    } catch (e) { threw = e; }
    if (threw && /Script execution timed out/.test(String(threw))) { failures.push(label + " -> timed out (infinite loop?)"); continue; }
    const ms = performance.now() - start;
    if (t.throws) { if (!threw) failures.push(label + " -> expected a throw"); continue; }
    if (threw) { failures.push(label + " -> threw " + threw); continue; }
    if (t.maxMs && ms > t.maxMs) { failures.push(label + " -> too slow " + Math.round(ms) + "ms"); continue; }
    const ok = t.unordered ? deepEqual(sortForCompare(got), sortForCompare(t.expected)) : deepEqual(got, t.expected);
    if (!ok) failures.push(label + " -> expected " + JSON.stringify(t.expected) + " got " + JSON.stringify(got));
  }
  return failures;
}

/* ---------- SQL testing ---------- */

let sqlite = null;
function runSql(sql) {
  if (!sqlite) {
    process.removeAllListeners("warning");
    sqlite = require("node:sqlite");
  }
  const db = new sqlite.DatabaseSync(":memory:");
  try {
    db.exec(ctx.LDL.sampleDbSql);
    const stmt = db.prepare(sql);
    if (typeof stmt.setReturnArrays === "function") {
      stmt.setReturnArrays(true);
      return stmt.all();
    }
    return stmt.all().map(r => Object.values(r));
  } finally {
    db.close();
  }
}

function sameCell(a, b) {
  if (typeof a === "bigint") a = Number(a);
  if (typeof b === "bigint") b = Number(b);
  return typeof a === "number" && typeof b === "number" ? Math.abs(a - b) < 1e-6 : a === b;
}
function rowKey(r) { return JSON.stringify(r.map(v => (typeof v === "number" ? Math.round(v * 1e6) / 1e6 : v))); }

function runSqlTests(sql, ex) {
  let got;
  try { got = runSql(sql); } catch (e) { return ["SQL error: " + e.message]; }
  const exp = ex.expected;
  if (got.length !== exp.length) return ["row count " + got.length + " != expected " + exp.length + "\n      got: " + JSON.stringify(got.slice(0, 5))];
  if (ex.ordered) {
    const bad = got.findIndex((r, i) => r.length !== exp[i].length || !r.every((v, j) => sameCell(v, exp[i][j])));
    return bad === -1 ? [] : ["row " + (bad + 1) + " differs: got " + JSON.stringify(got[bad]) + " expected " + JSON.stringify(exp[bad])];
  }
  const a = got.map(rowKey).sort(), b = exp.map(rowKey).sort();
  return a.every((k, i) => k === b[i]) ? [] : ["rows differ (unordered)\n      got: " + JSON.stringify(got.slice(0, 5))];
}

/* ---------- Main ---------- */

const only = process.argv.slice(2).map(s => s.padStart(2, "0"));
let problems = 0, exercises = 0;

for (const entry of catalog) {
  if (only.length && !only.includes(entry.id)) continue;
  const file = "lessons/" + entry.file;
  if (!fs.existsSync(path.join(ROOT, file))) { console.log(`-- ${entry.id} ${entry.title}: (missing ${file})`); problems++; continue; }
  try { load(file); } catch (e) { console.log(`XX ${entry.id}: failed to load - ${e.message}`); problems++; continue; }
  const lesson = ctx.LDL.lessons[entry.id];
  if (!lesson) { console.log(`XX ${entry.id}: file did not call registerLesson with id "${entry.id}"`); problems++; continue; }

  const lang = lesson.lang || "js";
  const ids = new Set();
  const issues = [];
  for (const ex of lesson.exercises || []) {
    exercises++;
    if (ids.has(ex.id)) issues.push(`${ex.id}: duplicate id`);
    ids.add(ex.id);
    for (const f of ["id", "title", "prompt", "starter", "solution"]) if (!ex[f]) issues.push(`${ex.id || "?"}: missing ${f}`);
    const exLang = ex.lang || lang;
    if (exLang === "sql") {
      if (!Array.isArray(ex.expected)) { issues.push(`${ex.id}: missing expected rows`); continue; }
      runSqlTests(ex.solution, ex).forEach(f => issues.push(`${ex.id}: solution fails: ${f}`));
      if (runSqlTests(ex.starter, ex).length === 0) issues.push(`${ex.id}: starter query already passes`);
    } else {
      if (!ex.tests || !ex.tests.length) { issues.push(`${ex.id}: no tests`); continue; }
      for (const rule of ex.forbid || []) {
        if (new RegExp(rule.pattern).test(codeOnly(ex.solution))) issues.push(`${ex.id}: forbid rule /${rule.pattern}/ blocks the solution`);
      }
      runJsTests(ex.solution, ex).forEach(f => issues.push(`${ex.id}: solution fails: ${f}`));
      if (runJsTests(ex.starter, ex).length === 0) issues.push(`${ex.id}: starter code already passes all tests`);
    }
  }
  for (const s of lesson.examples || []) {
    if (!s.explain && !lesson.isExam) issues.push(`example "${s.title}": missing explain`);
    if ((s.lang || lang) === "sql") {
      try { runSql(s.code); } catch (e) { issues.push(`example "${s.title}": SQL error ${e.message}`); }
    } else {
      try {
        vm.runInNewContext("(function (console) {\n" + s.code + "\n})(quiet)", { quiet, performance, structuredClone, setTimeout, clearTimeout }, { timeout: 3000 });
      } catch (e) { issues.push(`example "${s.title}": throws ${e}`); }
    }
  }

  // Learning-design content
  for (const f of ["analogy", "objectives", "realWorld", "takeaways", "quiz"]) {
    if (!lesson[f] || (Array.isArray(lesson[f]) && !lesson[f].length)) issues.push(`lesson: missing ${f}`);
  }
  (lesson.quiz || []).forEach((q, i) => {
    const where = `quiz #${i + 1}`;
    if (!q.q || !Array.isArray(q.options) || q.options.length < 2) issues.push(`${where}: needs q and 2+ options`);
    else if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) issues.push(`${where}: answer index out of range`);
    if (!q.explain) issues.push(`${where}: missing explain`);
    if (q.code && (q.lang || lang) !== "sql" && q.output !== undefined) {
      // Optional self-check: predicted output must match what the code prints.
      const logs = [];
      const cons = { log: (...a) => logs.push(a.map(x => (typeof x === "string" ? x : JSON.stringify(x))).join(" ")) };
      try { vm.runInNewContext("(function (console) {\n" + q.code + "\n})(cons)", { cons }, { timeout: 2000 }); }
      catch (e) { logs.push("THROWS " + e.message); }
      if (logs.join("\n") !== q.output) issues.push(`${where}: code prints ${JSON.stringify(logs.join("\n"))}, not ${JSON.stringify(q.output)}`);
    }
  });
  const n = (lesson.exercises || []).length;
  if (issues.length) {
    problems += issues.length;
    console.log(`XX ${entry.id} ${lesson.title} (${n} exercises)`);
    issues.forEach(i => console.log("   - " + i));
  } else {
    console.log(`OK ${entry.id} ${lesson.title} (${n} exercises, ${(lesson.examples || []).length} examples, ${(lesson.quiz || []).length} quiz)`);
  }
}

console.log(`\n${exercises} exercises checked, ${problems} problem(s).`);
process.exit(problems ? 1 : 0);
