/* ==========================================================================
   Lesson page: lesson.html?id=04
   ========================================================================== */

(function (LDL) {
  "use strict";

  const el = function () { return LDL.el.apply(null, arguments); };
  const esc = function (s) { return LDL.escapeHtml(s); };

  function slugify(s) {
    return String(s).toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function langOf(lesson, item) {
    return (item && item.lang) || lesson.lang || "js";
  }

  /* ---------- Exercise widget ---------- */

  function renderExercise(lesson, ex, index, onPass) {
    const lang = langOf(lesson, ex);
    const box = el("div", "exercise");
    box.id = "ex-" + ex.id;
    const done = LDL.progress.isDone(lesson.id, ex.id);
    if (done) box.classList.add("passed");

    const head = el("div", "ex-head");
    head.appendChild(el("h3", "", (index + 1) + ". " + esc(ex.title)));
    if (ex.difficulty) head.appendChild(el("span", "tag tag-" + ex.difficulty, ex.difficulty));
    const status = el("span", "ex-status" + (done ? " pass" : ""), done ? "&#10003; Solved" : "");
    head.appendChild(status);
    box.appendChild(head);

    box.appendChild(el("div", "ex-body", ex.prompt));

    const editorHost = el("div", "editor-wrap");
    box.appendChild(editorHost);

    const toolbar = el("div", "toolbar");
    const checkBtn = el("button", "btn btn-primary btn-sm", "&#10003; Check");
    const runBtn = el("button", "btn btn-sm", "&#9654; Run");
    const hintBtn = el("button", "btn btn-sm", "Hint");
    const solBtn = el("button", "btn btn-sm", "Solution");
    const resetBtn = el("button", "btn btn-sm", "Reset");
    toolbar.appendChild(checkBtn);
    toolbar.appendChild(runBtn);
    if (ex.hint) toolbar.appendChild(hintBtn);
    toolbar.appendChild(solBtn);
    toolbar.appendChild(resetBtn);
    toolbar.appendChild(el("span", "spacer"));
    toolbar.appendChild(el("span", "kbd-hint", "Ctrl + Enter to check &middot; your code is auto-saved"));
    box.appendChild(toolbar);

    const hintBox = el("div", "hint-box", "<strong>Hint:</strong> " + (ex.hint || ""));
    hintBox.hidden = true;
    box.appendChild(hintBox);

    const solBox = el("div", "solution-box");
    solBox.hidden = true;
    box.appendChild(solBox);

    const output = el(lang === "sql" ? "div" : "pre", "output");
    const results = el("ul", "results");
    box.appendChild(results);
    box.appendChild(output);

    const saved = LDL.drafts.get(lesson.id, ex.id);
    const editor = LDL.createEditor(editorHost, {
      value: saved !== null ? saved : ex.starter,
      lang: lang,
      onChange: function (code) { LDL.drafts.set(lesson.id, ex.id, code); },
      onRun: check
    });

    function showResults(list) {
      results.innerHTML = list.map(function (r) {
        return '<li class="' + (r.pass ? "pass" : "fail") + '">' +
          (r.pass ? "PASS " : "FAIL ") + esc(r.label) +
          (r.detail ? '<span class="detail">' + esc(r.detail) + "</span>" : "") + "</li>";
      }).join("");
    }

    function markPassed() {
      const firstTime = !LDL.progress.isDone(lesson.id, ex.id);
      box.classList.add("passed");
      status.className = "ex-status pass";
      status.innerHTML = "&#10003; Solved";
      LDL.progress.markDone(lesson.id, ex.id);
      if (firstTime) {
        LDL.celebrate(checkBtn);
        LDL.refreshXp(LDL.XP_EXERCISE);
      }
      onPass();
    }

    function check() {
      checkBtn.disabled = true;
      const code = editor.getValue();
      results.innerHTML = '<li class="info">Running tests...</li>';
      output.innerHTML = "";

      const p = lang === "sql" ? LDL.testSQL(code, ex) : LDL.testJS(code, ex);
      p.then(function (res) {
        checkBtn.disabled = false;
        if (res.timeout) {
          results.innerHTML = '<li class="fail">Stopped after 5 seconds - check for an infinite loop or a very slow algorithm.</li>';
          return;
        }
        if (res.compileError) {
          results.innerHTML = '<li class="fail">Your code has an error<span class="detail">' + esc(res.compileError) + "</span></li>";
          return;
        }
        const list = res.results || [];
        const passed = list.filter(function (r) { return r.pass; }).length;
        showResults(list);
        const all = passed === list.length && list.length > 0;
        const cheers = ["Great job!", "Nailed it!", "Excellent work!", "You're on fire!", "Clean solution!"];
        const msg = all ? cheers[Math.floor(Math.random() * cheers.length)]
          : passed === 0 ? "Not yet - read the first failing check below, it tells you what was expected."
          : "Almost there! Fix the failing checks below.";
        results.insertAdjacentHTML("afterbegin",
          '<li class="' + (all ? "pass" : "info") + '"><strong>' + passed + " / " + list.length +
          " checks passed - " + msg + "</strong></li>");
        if (lang === "sql" && res.result && !res.result.error) output.innerHTML = LDL.sqlTableHtml(res.result, 20);
        else if (res.logs && res.logs.length) output.textContent = res.logs.slice(0, 200).join("\n");
        if (all) markPassed();
      });
    }

    function run() {
      const code = editor.getValue();
      if (lang === "sql") {
        LDL.runSQL(code).then(function (res) {
          results.innerHTML = res.error ? '<li class="fail">SQL error: ' + esc(res.error) + "</li>" : "";
          output.innerHTML = res.error ? "" : LDL.sqlTableHtml(res);
        });
      } else {
        LDL.runJS(code).then(function (res) {
          results.innerHTML = "";
          if (res.timeout) output.textContent = "Stopped after 5 seconds - is there an infinite loop?";
          else if (res.compileError) output.textContent = res.compileError;
          else output.textContent = res.logs.length ? res.logs.join("\n") : "(no output - add console.log(...) to print, or press Check to run the tests)";
        });
      }
    }

    checkBtn.addEventListener("click", check);
    runBtn.addEventListener("click", run);
    hintBtn.addEventListener("click", function () { hintBox.hidden = !hintBox.hidden; });
    resetBtn.addEventListener("click", function () {
      if (!confirm("Reset this exercise to the starter code? Your changes will be lost.")) return;
      editor.setValue(ex.starter);
      LDL.drafts.clear(lesson.id, ex.id);
      results.innerHTML = "";
      output.innerHTML = "";
    });
    solBtn.addEventListener("click", function () {
      if (!solBox.hidden) { solBox.hidden = true; return; }
      if (!LDL.progress.isDone(lesson.id, ex.id) &&
          !confirm("Give it a real try first - you learn the most by struggling a little.\n\nShow the solution anyway?")) return;
      solBox.innerHTML = '<pre><code class="language-' + (lang === "sql" ? "sql" : "javascript") + '">' + esc(ex.solution) + "</code></pre>" +
        (ex.explanation ? '<div class="ex-body" style="padding:0 0 10px">' + ex.explanation + "</div>" : "");
      solBox.hidden = false;
      LDL.highlightAll(solBox);
    });

    return box;
  }

  /* ---------- Quiz widget ---------- */

  function renderQuiz(lesson) {
    const sec = el("section", "section");
    sec.id = "quiz";
    const lang = lesson.lang === "sql" ? "sql" : "javascript";
    const quiz = lesson.quiz;
    sec.innerHTML = "<h2>Quick quiz</h2><p>Check your understanding before the exercises. " +
      "Wrong answers are fine - the explanation is where the learning happens.</p>" +
      '<div class="quiz-score"><strong id="quiz-score"></strong>' +
      '<button class="btn btn-sm" id="quiz-retry">Try the quiz again</button></div>';

    function updateScore() {
      const c = LDL.quizProgress.countCorrect(lesson);
      sec.querySelector("#quiz-score").textContent = "Score: " + c + " / " + quiz.length;
      document.dispatchEvent(new Event("ldl:progress"));
    }

    quiz.forEach(function (item, i) {
      const card = el("div", "quiz-card");
      card.innerHTML =
        '<div class="q-num">Question ' + (i + 1) + " of " + quiz.length + "</div>" +
        '<div class="q-text">' + item.q + "</div>" +
        (item.code ? '<pre><code class="language-' + lang + '">' + esc(item.code) + "</code></pre>" : "") +
        '<div class="options"></div><div class="q-feedback" hidden></div>';
      const opts = card.querySelector(".options");
      const fb = card.querySelector(".q-feedback");
      const buttons = item.options.map(function (o, j) {
        const b = el("button", "option", '<span class="letter">' + "ABCDEF"[j] + "</span><span>" + o + "</span>");
        b.type = "button";
        b.addEventListener("click", function () { choose(j, true); });
        opts.appendChild(b);
        return b;
      });

      function choose(j, live) {
        const correct = j === item.answer;
        buttons.forEach(function (b, k) {
          b.disabled = true;
          if (k === item.answer) b.classList.add("correct");
          else if (k === j) b.classList.add("wrong");
        });
        fb.hidden = false;
        fb.className = "q-feedback " + (correct ? "good" : "bad");
        fb.innerHTML = "<p><strong>" + (correct ? "Correct!" : "Not quite.") + "</strong></p>" + (item.explain || "");
        if (live) {
          const before = LDL.quizProgress.get(lesson.id, i);
          LDL.quizProgress.set(lesson.id, i, j, correct);
          if (correct && !(before && before.correct)) {
            LDL.refreshXp(LDL.XP_QUIZ);
          }
          updateScore();
        }
      }

      const saved = LDL.quizProgress.get(lesson.id, i);
      if (saved) choose(saved.choice, false);
      card._reset = function () {
        buttons.forEach(function (b) { b.disabled = false; b.classList.remove("correct", "wrong"); });
        fb.hidden = true;
      };
      sec.appendChild(card);
    });

    sec.querySelector("#quiz-retry").addEventListener("click", function () {
      // Keep earned XP; just let the learner answer again.
      sec.querySelectorAll(".quiz-card").forEach(function (c) { c._reset(); });
      sec.scrollIntoView();
    });
    updateScore();
    return sec;
  }

  /* ---------- Sidebar ----------
     Layout (top to bottom):
       1. Progress card  - which lesson, how far along
       2. Three steps    - Learn / Practise / Review, in study order
       3. Lesson switcher - previous / next + "jump to lesson" dropdown
     The current section is highlighted while scrolling. */

  const PRACTICE_IDS = ["examples", "quiz", "exercises"];
  const REVIEW_IDS = ["pitfalls", "interview", "wrap-up"];

  function buildSidebar(side, lesson, toc, prev, next) {
    const exercises = lesson.exercises || [];
    const label = {};
    toc.forEach(function (t) { label[t[0]] = t[1]; });
    const learn = toc.filter(function (t) { return PRACTICE_IDS.indexOf(t[0]) === -1 && REVIEW_IDS.indexOf(t[0]) === -1; });
    const has = function (id) { return Object.prototype.hasOwnProperty.call(label, id); };

    function link(id, text, extra) {
      return '<li><a class="side-link" data-target="' + id + '" href="#' + id + '">' +
        "<span>" + esc(text) + "</span>" + (extra ? '<span class="side-count">' + extra + "</span>" : "") + "</a></li>";
    }

    function step(n, title, hint, body) {
      return '<details class="side-step"' + (n === 1 ? " open" : "") + ">" +
        '<summary class="side-step-head"><span class="step-n">' + n + "</span>" +
        '<span class="step-text"><strong>' + title + "</strong><small>" + hint + "</small></span>" +
        '<span class="step-chev" aria-hidden="true"></span></summary>' +
        '<ul class="side-list">' + body + "</ul></details>";
    }

    const exerciseList = exercises.map(function (ex, i) {
      return '<li><a class="side-ex" data-ex="' + esc(ex.id) + '" data-target="ex-' + esc(ex.id) + '" href="#ex-' + esc(ex.id) + '">' +
        '<span class="ex-dot" aria-hidden="true">' + (i + 1) + "</span>" +
        '<span class="ex-name">' + esc(ex.title) + "</span>" +
        (ex.difficulty ? '<span class="diff diff-' + ex.difficulty + '" title="' + ex.difficulty + '"></span>' : "") +
        "</a></li>";
    }).join("");

    const practice =
      (has("examples") ? link("examples", "Live examples", (lesson.examples || []).length) : "") +
      (has("quiz") ? link("quiz", "Quick quiz", (lesson.quiz || []).length + " Q") : "") +
      '<li><details class="side-ex-group" open><summary>' +
        '<a class="side-link" data-target="exercises" href="#exercises"><span>Exercises</span>' +
        '<span class="side-count" id="side-ex-count"></span></a></summary>' +
        '<ul class="side-ex-list">' + exerciseList + "</ul>" +
        '<div class="diff-legend"><span><i class="diff diff-easy"></i>easy</span>' +
        '<span><i class="diff diff-medium"></i>medium</span><span><i class="diff diff-hard"></i>hard</span></div>' +
        "</details></li>";

    const review = REVIEW_IDS.filter(has).map(function (id) { return link(id, label[id]); }).join("");

    const narrow = window.matchMedia && window.matchMedia("(max-width: 900px)").matches;
    side.innerHTML =
      '<details class="side-details"' + (narrow ? "" : " open") + '><summary>Lesson contents</summary>' +

      '<div class="side-card">' +
        '<div class="side-card-top"><span class="side-num">Lesson ' + esc(lesson.id) + "</span>" +
        '<span class="side-of">of ' + LDL.catalog.length + "</span></div>" +
        '<div class="side-title">' + esc(lesson.title) + "</div>" +
        '<div class="side-bar"><div class="side-bar-fill" id="side-bar-fill"></div></div>' +
        '<div class="side-stats"><span id="side-solved"></span><span id="side-quiz"></span></div>' +
      "</div>" +

      '<nav class="side-nav" aria-label="Lesson sections">' +
        step(1, "Learn", "Read the ideas", learn.map(function (t) { return link(t[0], t[1]); }).join("")) +
        step(2, "Practise", "Try it yourself", practice) +
        (review ? step(3, "Review", "Lock it in", review) : "") +
      "</nav>" +

      '<div class="side-switch">' +
        '<span class="side-switch-label" id="picker-label">Jump to lesson</span>' +
        '<div class="picker">' +
          '<button type="button" class="picker-btn" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="picker-label picker-current">' +
            '<span class="picker-badge">' + esc(lesson.id) + "</span>" +
            '<span class="picker-current" id="picker-current">' + esc(lesson.title) + "</span>" +
            '<span class="step-chev" aria-hidden="true"></span>' +
          "</button>" +
          '<div class="picker-panel" role="listbox" aria-labelledby="picker-label" hidden></div>' +
        "</div>" +
        '<div class="side-prevnext">' +
          (prev ? '<a class="btn btn-sm" href="lesson.html?id=' + prev.id + '" title="' + esc(prev.title) + '">&larr; Prev</a>' : '<span class="btn btn-sm" aria-disabled="true">&larr; Prev</span>') +
          (next ? '<a class="btn btn-sm" href="lesson.html?id=' + next.id + '" title="' + esc(next.title) + '">Next &rarr;</a>' : '<a class="btn btn-sm" href="index.html">All lessons</a>') +
        "</div>" +
      "</div>" +
      "</details>";

    setupLessonPicker(side.querySelector(".picker"), lesson);

    // On phones the whole sidebar is a collapsible panel; close it after picking a link.
    side.querySelectorAll("a[href^='#']").forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 900px)").matches) side.querySelector(".side-details").open = false;
      });
    });

    function refreshCounts() {
      const done = LDL.progress.countDone(lesson);
      const quizTotal = (lesson.quiz || []).length;
      const quizRight = LDL.quizProgress.countCorrect(lesson);
      // Overall progress mixes exercises and quiz answers.
      const total = exercises.length + quizTotal;
      const pct = total ? Math.round(100 * (done + quizRight) / total) : 0;
      side.querySelector("#side-bar-fill").style.width = pct + "%";
      side.querySelector("#side-solved").innerHTML = "&#9989; " + done + "/" + exercises.length + " solved";
      side.querySelector("#side-quiz").innerHTML = quizTotal ? "&#10067; " + quizRight + "/" + quizTotal + " quiz" : "";
      side.querySelector("#side-ex-count").textContent = done + "/" + exercises.length;
      side.querySelectorAll("[data-ex]").forEach(function (a) {
        const isDone = LDL.progress.isDone(lesson.id, a.dataset.ex);
        a.classList.toggle("done", isDone);
        a.querySelector(".ex-dot").innerHTML = isDone ? "&#10003;" : String(Array.prototype.indexOf.call(side.querySelectorAll("[data-ex]"), a) + 1);
      });
    }
    document.addEventListener("ldl:progress", refreshCounts);
    refreshCounts();

    setupScrollSpy(side);
  }

  /** Custom "jump to lesson" picker: grouped list with progress, keyboard friendly. */
  function setupLessonPicker(picker, lesson) {
    const btn = picker.querySelector(".picker-btn");
    const panel = picker.querySelector(".picker-panel");

    function status(c) {
      const l = LDL.lessons[c.id];
      if (!l) return "";
      const total = (l.exercises || []).length, done = LDL.progress.countDone(l);
      if (total && done === total) return '<span class="picker-status done" title="Completed">&#10003;</span>';
      if (done) return '<span class="picker-status">' + done + "/" + total + "</span>";
      return "";
    }

    function render() {
      let html = "", group = null;
      LDL.catalog.forEach(function (c) {
        if (c.group !== group) {
          group = c.group;
          html += '<div class="picker-group">' + esc(group || "") + "</div>";
        }
        const current = c.id === lesson.id;
        html += '<a role="option" class="picker-item' + (current ? " current" : "") + '"' +
          ' aria-selected="' + current + '" href="lesson.html?id=' + c.id + '">' +
          '<span class="picker-badge">' + c.id + "</span>" +
          '<span class="picker-name">' + esc(c.title) + "</span>" +
          (current) +
          "</a>";
      });
      panel.innerHTML = html;
    }

    function items() { return Array.prototype.slice.call(panel.querySelectorAll(".picker-item")); }

    // The sidebar scrolls, which would clip an absolutely positioned panel,
    // so the panel is fixed to the viewport and placed above or below the button.
    function place() {
      const r = btn.getBoundingClientRect();
      const above = r.top - 70, below = window.innerHeight - r.bottom - 12;
      const up = above > below;
      const space = Math.max(160, (up ? above : below) - 8);
      panel.style.left = Math.max(8, r.left) + "px";
      panel.style.width = Math.max(r.width, 220) + "px";
      panel.style.maxHeight = Math.min(440, space) + "px";
      panel.style.top = up ? "" : (r.bottom + 6) + "px";
      panel.style.bottom = up ? (window.innerHeight - r.top + 6) + "px" : "";
    }

    function open() {
      render();
      panel.hidden = false;
      place();
      btn.setAttribute("aria-expanded", "true");
      picker.classList.add("open");
      const cur = panel.querySelector(".current");
      if (cur) { panel.scrollTop = cur.offsetTop - panel.clientHeight / 2; cur.focus(); }
      // Load the other lessons in the background to show their progress.
      LDL.loadAllLessons().then(function () { if (!panel.hidden) { render(); const c = panel.querySelector(".current"); if (c) c.focus(); } });
    }

    function close(focusButton) {
      panel.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      picker.classList.remove("open");
      if (focusButton) btn.focus();
    }

    btn.addEventListener("click", function () { panel.hidden ? open() : close(false); });

    document.addEventListener("click", function (e) {
      if (!panel.hidden && !picker.contains(e.target)) close(false);
    });
    window.addEventListener("resize", function () { if (!panel.hidden) place(); });
    window.addEventListener("scroll", function () { if (!panel.hidden) close(false); }, { passive: true });
    picker.closest(".sidebar").addEventListener("scroll", function () { if (!panel.hidden) place(); }, { passive: true });

    picker.addEventListener("keydown", function (e) {
      if (panel.hidden) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); open(); }
        return;
      }
      const list = items(), i = list.indexOf(document.activeElement);
      if (e.key === "Escape") { e.preventDefault(); close(true); }
      else if (e.key === "ArrowDown") { e.preventDefault(); (list[i + 1] || list[0]).focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); (list[i - 1] || list[list.length - 1]).focus(); }
      else if (e.key === "Home") { e.preventDefault(); list[0].focus(); }
      else if (e.key === "End") { e.preventDefault(); list[list.length - 1].focus(); }
      else if (e.key === "Tab") { close(false); }
    });
  }

  /** Highlight the sidebar link for the part of the page currently being read. */
  function setupScrollSpy(side) {
    const links = Array.prototype.slice.call(side.querySelectorAll("[data-target]"));
    const targets = links.map(function (a) { return document.getElementById(a.dataset.target); });
    let current = null, ticking = false;

    function update() {
      ticking = false;
      const line = 110;  // just below the sticky header
      // Pick the section whose heading is closest above the reading line.
      // (Sidebar order differs from page order, so compare positions, not list order.)
      let active = null, best = -Infinity;
      targets.forEach(function (t, i) {
        if (!t) return;
        const top = t.getBoundingClientRect().top;
        if (top <= line && top >= best) { best = top; active = links[i]; }
      });
      if (active === current) return;
      if (current) current.classList.remove("active");
      current = active;
      if (!current) return;
      current.classList.add("active");
      // Accordion: open the step you're reading, fold the others away.
      const step = current.closest(".side-step");
      side.querySelectorAll(".side-step").forEach(function (s) { s.open = s === step; });
      // Keep the active link visible inside the sidebar without moving the page.
      const box = side.getBoundingClientRect(), r = current.getBoundingClientRect();
      if (side.scrollHeight > side.clientHeight && (r.top < box.top + 40 || r.bottom > box.bottom - 40)) {
        side.scrollTop += r.top - box.top - box.height / 3;
      }
    }

    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Page ---------- */

  function renderLesson(lesson) {
    const root = document.getElementById("lesson-root");
    const idx = LDL.catalog.findIndex(function (c) { return c.id === lesson.id; });
    const prev = LDL.catalog[idx - 1], next = LDL.catalog[idx + 1];
    const lang = lesson.lang || "js";
    document.title = lesson.id + " " + lesson.title + " - Logic & Data Learning Kit";

    const layout = el("div", "lesson-layout");
    const side = el("aside", "sidebar");
    const main = el("main", "");
    layout.appendChild(side);
    layout.appendChild(main);
    root.innerHTML = "";
    root.appendChild(layout);

    // Header
    const header = el("header", "lesson-header");
    header.innerHTML =
      '<div class="num">Lesson ' + esc(lesson.id) + "</div>" +
      "<h1>" + esc(lesson.title) + "</h1>" +
      '<p class="goal">' + lesson.goal + "</p>" +
      '<p><span class="tag ' + (lang === "sql" ? "tag-sql" : "tag-js") + '">' + (lang === "sql" ? "SQL" : "JavaScript") + "</span> " +
      (lesson.minutes ? '<span class="tag">~' + lesson.minutes + " min</span> " : "") +
      '<span class="tag" id="lesson-progress"></span></p>';
    main.appendChild(header);

    const toc = [];

    // Intro: analogy, objectives, where it's used at work
    if (lesson.analogy || lesson.objectives || lesson.realWorld) {
      toc.push(["start-here", "Start here"]);
      const intro = el("section", "section");
      intro.id = "start-here";
      intro.innerHTML = "<h2>Start here</h2>" +
        (lesson.analogy ? '<div class="callout analogy">' + lesson.analogy + "</div>" : "") +
        '<div class="intro-grid">' +
        (lesson.objectives ? '<div class="card"><p class="card-title">By the end you will be able to</p><ul class="objectives">' +
          lesson.objectives.map(function (o) { return "<li>" + o + "</li>"; }).join("") + "</ul></div>" : "") +
        (lesson.realWorld ? '<div class="card"><p class="card-title">Where you will use this</p>' + lesson.realWorld + "</div>" : "") +
        "</div>";
      main.appendChild(intro);
    }

    (lesson.sections || []).forEach(function (s) {
      const id = slugify(s.title);
      toc.push([id, s.title]);
      const sec = el("section", "section");
      sec.id = id;
      sec.innerHTML = "<h2>" + esc(s.title) + "</h2>" + s.html;
      main.appendChild(sec);
    });

    if (lesson.examples && lesson.examples.length) {
      toc.push(["examples", "Live examples"]);
      const sec = el("section", "section");
      sec.id = "examples";
      sec.innerHTML = "<h2>Live examples</h2><p>Read the code, <strong>guess the output</strong>, then press <strong>Run</strong> to check. " +
        "Then change something and run it again - you can't break anything, and <strong>Reset</strong> brings the original back.</p>";
      lesson.examples.forEach(function (ex) { sec.appendChild(LDL.createPlayground(ex, lang)); });
      main.appendChild(sec);
    }

    if (lesson.pitfalls && lesson.pitfalls.length) {
      toc.push(["pitfalls", "Common pitfalls"]);
      const sec = el("section", "section");
      sec.id = "pitfalls";
      sec.innerHTML = '<h2>Common pitfalls</h2><ul class="pitfalls">' +
        lesson.pitfalls.map(function (p) { return "<li>" + p + "</li>"; }).join("") + "</ul>";
      main.appendChild(sec);
    }

    if (lesson.quiz && lesson.quiz.length) {
      toc.push(["quiz", "Quick quiz"]);
      main.appendChild(renderQuiz(lesson));
    }

    const exSec = el("section", "section");
    exSec.id = "exercises";
    toc.push(["exercises", "Exercises"]);
    exSec.innerHTML = "<h2>Exercises</h2><p>Write your answer, then press <strong>Check</strong> to run the automatic tests. " +
      (lang === "sql"
        ? "Queries run against the <a href=\"playground.html#sql\">sample company database</a> (a real SQLite engine in your browser)."
        : "Use <code>console.log()</code> and <strong>Run</strong> to debug.") + "</p>";
    main.appendChild(exSec);

    function updateProgress() {
      const n = LDL.progress.countDone(lesson);
      const total = (lesson.exercises || []).length;
      document.getElementById("lesson-progress").textContent = n + " / " + total + " solved";
      const banner = document.getElementById("complete-banner");
      if (banner) {
        const nextLink = next
          ? '<a class="btn btn-primary" href="lesson.html?id=' + next.id + '">Next: ' + esc(next.id + " " + next.title) + " &rarr;</a>"
          : '<a class="btn btn-primary" href="cheatsheet.html">Review the cheat sheet &rarr;</a>';
        banner.innerHTML = n === total && total > 0
          ? "<h3>&#127881; Lesson complete!</h3><p>You solved every exercise. Take a 5-minute break - your brain stores it while you rest.</p>" + nextLink
          : "<h3>" + n + " of " + total + " exercises solved</h3><p>Keep going - every exercise you solve is a pattern you'll recognise in the exam.</p>" +
            '<a class="btn" href="#exercises">Back to the exercises</a>';
      }
      document.dispatchEvent(new Event("ldl:progress"));
    }

    (lesson.exercises || []).forEach(function (ex, i) {
      exSec.appendChild(renderExercise(lesson, ex, i, updateProgress));
    });

    if (lesson.interview && lesson.interview.length) {
      toc.push(["interview", "Interview questions"]);
      const sec = el("section", "section");
      sec.id = "interview";
      sec.innerHTML = "<h2>Interview questions</h2><p>Say your answer <strong>out loud</strong> first (like in a real interview), then open the card to compare.</p>" +
        lesson.interview.map(function (q) {
          return '<details class="qa"><summary>' + q.q + "</summary>" + q.a + "</details>";
        }).join("");
      main.appendChild(sec);
    }

    toc.push(["wrap-up", "Key takeaways"]);
    const wrap = el("section", "section");
    wrap.id = "wrap-up";
    wrap.innerHTML = "<h2>Key takeaways</h2>" +
      (lesson.takeaways && lesson.takeaways.length
        ? '<ol class="takeaways">' + lesson.takeaways.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ol>"
        : "") +
      '<div class="complete-banner" id="complete-banner"></div>';
    main.appendChild(wrap);

    // Prev / next
    const nav = el("nav", "lesson-nav");
    nav.innerHTML =
      (prev ? '<a class="btn" href="lesson.html?id=' + prev.id + '">&larr; ' + esc(prev.id + " " + prev.title) + "</a>" : "<span></span>") +
      (next ? '<a class="btn btn-primary" href="lesson.html?id=' + next.id + '">' + esc(next.id + " " + next.title) + " &rarr;</a>" : '<a class="btn btn-primary" href="index.html">Back to all lessons</a>');
    main.appendChild(nav);

    buildSidebar(side, lesson, toc, prev, next);
    updateProgress();
    LDL.highlightAll(main);

    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const id = (new URLSearchParams(location.search).get("id") || "01").padStart(2, "0");
    const root = document.getElementById("lesson-root");
    LDL.loadLesson(id).then(function (lesson) {
      if (!lesson) throw new Error("Lesson " + id + " is not available yet.");
      renderLesson(lesson);
    }).catch(function (err) {
      root.innerHTML = '<div class="card"><h2 style="margin-top:0">Lesson not found</h2><p>' + esc(err.message) +
        '</p><a class="btn btn-primary" href="index.html">Back to lessons</a></div>';
    });
  });
})(window.LDL);
