/* ==========================================================================
   Code runners
   - JavaScript runs inside a Web Worker (created from a Blob) so an infinite
     loop can be stopped without freezing the page.
   - SQL runs on a real SQLite database compiled to WebAssembly (sql.js),
     loaded on demand from a CDN and seeded with assets/js/sample-db.js.
   ========================================================================== */

(function (LDL) {
  "use strict";

  const TIMEOUT_MS = 5000;

  /* ---------- Worker source (kept as a function so it is readable) ---------- */

  function workerMain() {
    function show(v, depth) {
      depth = depth || 0;
      if (depth > 4) return "...";
      if (v === undefined) return "undefined";
      if (v === null) return "null";
      if (typeof v === "string") return depth === 0 ? v : JSON.stringify(v);
      if (typeof v === "number" || typeof v === "boolean" || typeof v === "bigint") return String(v);
      if (typeof v === "function") return v.name ? "[Function " + v.name + "]" : "[Function]";
      if (Array.isArray(v)) return "[" + v.map(function (x) { return show(x, depth + 1); }).join(", ") + "]";
      if (v instanceof Map) {
        return "Map(" + v.size + ") {" + Array.from(v).map(function (kv) {
          return show(kv[0], depth + 1) + " => " + show(kv[1], depth + 1);
        }).join(", ") + "}";
      }
      if (v instanceof Set) return "Set(" + v.size + ") {" + Array.from(v).map(function (x) { return show(x, depth + 1); }).join(", ") + "}";
      if (v instanceof Error) return v.name + ": " + v.message;
      const name = v.constructor && v.constructor !== Object ? v.constructor.name + " " : "";
      return name + "{" + Object.keys(v).map(function (k) { return k + ": " + show(v[k], depth + 1); }).join(", ") + "}";
    }

    // Value shown inside test messages: strings keep their quotes.
    function repr(v) { return typeof v === "string" ? JSON.stringify(v) : show(v, 1); }

    function normalize(v) {
      if (v instanceof Set) return Array.from(v);
      if (v instanceof Map) return Array.from(v);
      return v;
    }

    function deepEqual(a, b) {
      a = normalize(a); b = normalize(b);
      if (typeof a === "number" && typeof b === "number") {
        if (Number.isNaN(a) && Number.isNaN(b)) return true;
        return a === b || Math.abs(a - b) < 1e-9;
      }
      if (a === b) return true;
      if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
      if (Array.isArray(a) !== Array.isArray(b)) return false;
      if (Array.isArray(a)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
        return true;
      }
      const ka = Object.keys(a), kb = Object.keys(b);
      if (ka.length !== kb.length) return false;
      return ka.every(function (k) { return Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]); });
    }

    function sortForCompare(v) {
      v = normalize(v);
      if (!Array.isArray(v)) return v;
      return v.slice().sort(function (x, y) {
        const sx = JSON.stringify(x), sy = JSON.stringify(y);
        return sx < sy ? -1 : sx > sy ? 1 : 0;
      });
    }

    let logs = [];
    const fakeConsole = {
      log: function () { logs.push(Array.prototype.map.call(arguments, function (a) { return show(a); }).join(" ")); },
      error: function () { logs.push("Error: " + Array.prototype.map.call(arguments, function (a) { return show(a); }).join(" ")); },
      warn: function () { logs.push("Warning: " + Array.prototype.map.call(arguments, function (a) { return show(a); }).join(" ")); },
      table: function (t) { logs.push(show(t)); }
    };
    fakeConsole.info = fakeConsole.log;

    function compile(code, body) {
      // `console` is passed in so learners' console.log goes to our panel.
      return new Function("console", '"use strict";\n' + code + "\n;\n" + body);
    }

    self.onmessage = function (e) {
      const msg = e.data;
      logs = [];

      if (msg.kind === "run") {
        try {
          compile(msg.code, "")(fakeConsole);
        } catch (err) {
          logs.push((err && err.name ? err.name : "Error") + ": " + (err && err.message ? err.message : err));
        }
        self.postMessage({ logs: logs });
        return;
      }

      // kind === "test"
      try {
        compile(msg.code, "");  // syntax check once
      } catch (err) {
        self.postMessage({ logs: logs, compileError: err.name + ": " + err.message });
        return;
      }

      const results = msg.tests.map(function (t) {
        const label = t.label || t.expr || "test";
        const body = t.code ? t.code : "return (" + t.expr + ");";
        const start = performance.now();
        let got, threw = null;
        try {
          got = compile(msg.code, body)(fakeConsole);
        } catch (err) {
          threw = err;
        }
        const ms = performance.now() - start;

        if (t.throws) {
          if (threw) return { label: label, pass: true };
          return { label: label, pass: false, detail: "Expected an error to be thrown, but got " + repr(got) };
        }
        if (threw) {
          return { label: label, pass: false, detail: (threw.name || "Error") + ": " + (threw.message || threw) };
        }
        if (t.maxMs && ms > t.maxMs) {
          return { label: label, pass: false, detail: "Too slow: took " + Math.round(ms) + " ms (limit " + t.maxMs + " ms). Look for a faster algorithm." };
        }
        const ok = t.unordered ? deepEqual(sortForCompare(got), sortForCompare(t.expected)) : deepEqual(got, t.expected);
        if (ok) return { label: label, pass: true };
        return { label: label, pass: false, detail: "Expected " + repr(t.expected) + "\n     Got " + repr(got) };
      });

      self.postMessage({ logs: logs, results: results });
    };
  }

  let workerUrl = null;
  function workerSource() {
    if (!workerUrl) {
      const src = "(" + workerMain.toString() + ")();";
      workerUrl = URL.createObjectURL(new Blob([src], { type: "text/javascript" }));
    }
    return workerUrl;
  }

  function runInWorker(message) {
    return new Promise(function (resolve) {
      let worker;
      try {
        worker = new Worker(workerSource());
      } catch (e) {
        resolve({ logs: [], compileError: "Your browser blocked the code runner (" + e.message + "). Try serving the site over http, e.g. GitHub Pages." });
        return;
      }
      const timer = setTimeout(function () {
        worker.terminate();
        resolve({ logs: [], timeout: true });
      }, TIMEOUT_MS);
      worker.onmessage = function (e) {
        clearTimeout(timer);
        worker.terminate();
        resolve(e.data);
      };
      worker.onerror = function (e) {
        clearTimeout(timer);
        worker.terminate();
        resolve({ logs: [], compileError: e.message || "Unknown error" });
      };
      worker.postMessage(message);
    });
  }

  /** Strip comments and strings so "forbid" rules don't trigger on them. */
  function codeOnly(code) {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "")
      .replace(/(["'`])(?:\\.|(?!\1)[^\\])*\1/g, '""');
  }

  LDL.runJS = function (code) {
    return runInWorker({ kind: "run", code: code });
  };

  LDL.testJS = function (code, exercise) {
    const violations = (exercise.forbid || []).filter(function (rule) {
      return new RegExp(rule.pattern).test(codeOnly(code));
    });
    if (violations.length) {
      return Promise.resolve({
        logs: [],
        results: violations.map(function (v) { return { label: "Rule", pass: false, detail: v.message }; })
      });
    }
    return runInWorker({ kind: "test", code: code, tests: exercise.tests });
  };

  /* ---------- SQL (sql.js) ---------- */

  const SQLJS_BASE = "https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/";
  let sqlReady = null;

  function loadSql() {
    if (!sqlReady) {
      sqlReady = LDL.loadScript(SQLJS_BASE + "sql-wasm.js").then(function () {
        return window.initSqlJs({ locateFile: function (f) { return SQLJS_BASE + f; } });
      });
      sqlReady.catch(function () { sqlReady = null; });
    }
    return sqlReady;
  }

  /** Run SQL against a fresh copy of the sample database. Returns the last result set. */
  LDL.runSQL = function (sql) {
    return loadSql().then(function (SQL) {
      const db = new SQL.Database();
      try {
        db.run(LDL.sampleDbSql || "");
        const res = db.exec(sql);
        const last = res.length ? res[res.length - 1] : { columns: [], values: [] };
        return { columns: last.columns, rows: last.values };
      } catch (err) {
        return { error: err.message || String(err) };
      } finally {
        db.close();
      }
    }, function () {
      return { error: "Could not load the SQL engine. Check your internet connection (sql.js is loaded from a CDN)." };
    });
  };

  function sameCell(a, b) {
    if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) < 1e-6;
    return a === b;
  }

  function sameRow(a, b) {
    return a.length === b.length && a.every(function (v, i) { return sameCell(v, b[i]); });
  }

  function rowKey(r) { return JSON.stringify(r.map(function (v) { return typeof v === "number" ? Math.round(v * 1e6) / 1e6 : v; })); }

  LDL.testSQL = function (sql, exercise) {
    return LDL.runSQL(sql).then(function (res) {
      if (res.error) return { result: res, results: [{ label: "Query", pass: false, detail: "SQL error: " + res.error }] };
      const expected = exercise.expected;
      const got = res.rows;
      const checks = [];

      const colsOk = !expected.length || !got.length || got[0].length === expected[0].length;
      checks.push(colsOk
        ? { label: "Column count", pass: true }
        : { label: "Column count", pass: false, detail: "Expected " + expected[0].length + " columns, got " + got[0].length });

      checks.push(got.length === expected.length
        ? { label: "Row count = " + expected.length, pass: true }
        : { label: "Row count", pass: false, detail: "Expected " + expected.length + " rows, got " + got.length });

      let rowsOk;
      if (exercise.ordered) {
        rowsOk = got.length === expected.length && got.every(function (r, i) { return sameRow(r, expected[i]); });
      } else {
        const a = got.map(rowKey).sort(), b = expected.map(rowKey).sort();
        rowsOk = a.length === b.length && a.every(function (k, i) { return k === b[i]; });
      }
      let detail = "";
      if (!rowsOk) {
        const firstBad = exercise.ordered
          ? got.findIndex(function (r, i) { return !expected[i] || !sameRow(r, expected[i]); })
          : -1;
        detail = (firstBad >= 0 ? "First difference at row " + (firstBad + 1) + ".\n" : "") +
          "Expected (first rows): " + JSON.stringify(expected.slice(0, 4)) +
          "\n     Got (first rows): " + JSON.stringify(got.slice(0, 4));
      }
      checks.push(rowsOk
        ? { label: exercise.ordered ? "Rows match (in order)" : "Rows match", pass: true }
        : { label: exercise.ordered ? "Rows match (in order)" : "Rows match", pass: false, detail: detail });

      return { result: res, results: checks };
    });
  };

  /** Render a SQL result as an HTML table. */
  LDL.sqlTableHtml = function (res, maxRows) {
    maxRows = maxRows || 50;
    if (!res || !res.columns || !res.columns.length) return '<p class="kbd-hint" style="margin:10px 16px">Query ran - no rows returned.</p>';
    const esc = LDL.escapeHtml;
    const rows = res.rows.slice(0, maxRows).map(function (r) {
      return "<tr>" + r.map(function (v) {
        return v === null ? '<td class="null">NULL</td>' : "<td>" + esc(v) + "</td>";
      }).join("") + "</tr>";
    }).join("");
    const more = res.rows.length > maxRows ? '<tr><td colspan="' + res.columns.length + '">... ' + (res.rows.length - maxRows) + " more rows</td></tr>" : "";
    return '<table class="sql-table"><thead><tr>' +
      res.columns.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") +
      "</tr></thead><tbody>" + rows + more + "</tbody></table>";
  };
})(window.LDL);
