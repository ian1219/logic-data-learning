/* ==========================================================================
   Code editor + playground widgets (shared by lesson and playground pages)
   Uses CodeMirror 5 when available, otherwise a plain <textarea>.
   ========================================================================== */

(function (LDL) {
  "use strict";

  /**
   * Create an editor inside `host`.
   * opts: { value, lang: "js" | "sql", onChange(code), onRun() }
   * Returns { getValue(), setValue(code), focus() }.
   */
  LDL.createEditor = function (host, opts) {
    const lang = opts.lang || "js";
    const lines = (opts.value || "").split("\n").length;

    if (window.CodeMirror) {
      const cm = window.CodeMirror(host, {
        value: opts.value || "",
        mode: lang === "sql" ? "text/x-sqlite" : "javascript",
        lineNumbers: true,
        indentUnit: 2,
        tabSize: 2,
        matchBrackets: true,
        autoCloseBrackets: true,
        viewportMargin: Infinity,
        extraKeys: {
          "Ctrl-Enter": function () { if (opts.onRun) opts.onRun(); },
          "Cmd-Enter": function () { if (opts.onRun) opts.onRun(); },
          Tab: function (c) {
            if (c.somethingSelected()) c.indentSelection("add");
            else c.replaceSelection("  ", "end");
          }
        }
      });
      cm.on("change", function () { if (opts.onChange) opts.onChange(cm.getValue()); });

      // The host is usually built before it is attached to the page, so CodeMirror
      // measures 0px and draws nothing. Refresh once it is in the DOM and visible.
      setTimeout(function () { cm.refresh(); }, 0);
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(function (entries) {
          if (entries.some(function (e) { return e.isIntersecting; })) { cm.refresh(); io.disconnect(); }
        });
        io.observe(host);
      }
      return {
        getValue: function () { return cm.getValue(); },
        setValue: function (v) { cm.setValue(v); },
        focus: function () { cm.focus(); },
        refresh: function () { cm.refresh(); }
      };
    }

    // Fallback: textarea with Tab + Ctrl+Enter support.
    const ta = document.createElement("textarea");
    ta.className = "code";
    ta.spellcheck = false;
    ta.value = opts.value || "";
    ta.rows = Math.max(6, Math.min(24, lines + 1));
    ta.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        e.preventDefault();
        const s = ta.selectionStart;
        ta.value = ta.value.slice(0, s) + "  " + ta.value.slice(ta.selectionEnd);
        ta.selectionStart = ta.selectionEnd = s + 2;
        if (opts.onChange) opts.onChange(ta.value);
      } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (opts.onRun) opts.onRun();
      }
    });
    ta.addEventListener("input", function () { if (opts.onChange) opts.onChange(ta.value); });
    host.appendChild(ta);
    return {
      getValue: function () { return ta.value; },
      setValue: function (v) { ta.value = v; },
      focus: function () { ta.focus(); },
      refresh: function () {}
    };
  };

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  LDL.el = el;

  /**
   * A runnable example: editor + Run/Reset + output panel.
   * example: { title, code, lang?, note? }
   */
  LDL.createPlayground = function (example, lang) {
    lang = example.lang || lang || "js";
    const box = el("div", "playground");
    const head = el("div", "ex-head");
    head.appendChild(el("h3", "", LDL.escapeHtml(example.title || "Try it")));
    head.appendChild(el("span", "tag " + (lang === "sql" ? "tag-sql" : "tag-js"), lang === "sql" ? "SQL" : "JavaScript"));
    box.appendChild(head);
    if (example.note) box.appendChild(el("div", "ex-body", example.note));

    const editorHost = el("div", "editor-wrap");
    box.appendChild(editorHost);

    const toolbar = el("div", "toolbar");
    const runBtn = el("button", "btn btn-primary btn-sm", "&#9654; Run");
    const resetBtn = el("button", "btn btn-sm", "Reset");
    toolbar.appendChild(runBtn);
    toolbar.appendChild(resetBtn);
    toolbar.appendChild(el("span", "spacer"));
    toolbar.appendChild(el("span", "kbd-hint", "Ctrl + Enter to run &middot; edit freely"));
    box.appendChild(toolbar);

    const out = el(lang === "sql" ? "div" : "pre", "output");
    box.appendChild(out);

    if (example.explain) {
      const ex = el("details", "explain", "<summary>How it works</summary>" + example.explain);
      ex.open = true;
      box.appendChild(ex);
    }

    function run() {
      runBtn.disabled = true;
      const code = editor.getValue();
      const done = function () { runBtn.disabled = false; };
      if (lang === "sql") {
        out.innerHTML = '<p class="kbd-hint" style="margin:10px 16px">Running...</p>';
        LDL.runSQL(code).then(function (res) {
          out.innerHTML = res.error
            ? '<ul class="results"><li class="fail">SQL error: ' + LDL.escapeHtml(res.error) + "</li></ul>"
            : LDL.sqlTableHtml(res);
          done();
        });
      } else {
        LDL.runJS(code).then(function (res) {
          if (res.timeout) out.textContent = "Stopped after 5 seconds - is there an infinite loop?";
          else if (res.compileError) out.textContent = res.compileError;
          else out.textContent = res.logs.length ? res.logs.join("\n") : "(no output - use console.log to print)";
          done();
        });
      }
    }

    const editor = LDL.createEditor(editorHost, { value: example.code, lang: lang, onRun: run });
    runBtn.addEventListener("click", run);
    resetBtn.addEventListener("click", function () { editor.setValue(example.code); out.innerHTML = ""; });
    box._editor = editor;
    return box;
  };
})(window.LDL);
