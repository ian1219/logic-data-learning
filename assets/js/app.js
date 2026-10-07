/* ==========================================================================
   Logic & Data Learning Kit - core (registry, progress, header, helpers)
   Plain JavaScript, no build step. Works on GitHub Pages and from file://.
   ========================================================================== */

window.LDL = window.LDL || {};

(function (LDL) {
  "use strict";

  /* ---------- Lesson registry ---------- */

  LDL.lessons = LDL.lessons || {};

  /** Called by every lessons/NN-*.js file. */
  LDL.registerLesson = function (lesson) {
    LDL.lessons[lesson.id] = lesson;
  };

  /** Load a script once; resolves when executed. */
  const loaded = {};
  LDL.loadScript = function (src) {
    if (!loaded[src]) {
      loaded[src] = new Promise(function (resolve, reject) {
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        s.onerror = function () { reject(new Error("Could not load " + src)); };
        document.head.appendChild(s);
      });
    }
    return loaded[src];
  };

  LDL.loadLesson = function (id) {
    const entry = LDL.catalog.find(function (c) { return c.id === id; });
    if (!entry) return Promise.reject(new Error("Unknown lesson " + id));
    if (LDL.lessons[id]) return Promise.resolve(LDL.lessons[id]);
    return LDL.loadScript("lessons/" + entry.file).then(function () { return LDL.lessons[id]; });
  };

  LDL.loadAllLessons = function () {
    return Promise.all(LDL.catalog.map(function (c) {
      return LDL.loadLesson(c.id).catch(function () { return null; });
    }));
  };

  /* ---------- Safe storage (private windows can throw) ---------- */

  LDL.store = {
    get: function (key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    },
    remove: function (key) {
      try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
    }
  };

  /* ---------- Progress ---------- */

  const PROGRESS_KEY = "ldl-progress-v1";

  LDL.progress = {
    all: function () { return LDL.store.get(PROGRESS_KEY, {}); },
    isDone: function (lessonId, exId) {
      const p = this.all();
      return !!(p[lessonId] && p[lessonId][exId]);
    },
    markDone: function (lessonId, exId) {
      const p = this.all();
      p[lessonId] = p[lessonId] || {};
      p[lessonId][exId] = Date.now();
      LDL.store.set(PROGRESS_KEY, p);
      LDL.activity.record();
    },
    countDone: function (lesson) {
      const p = this.all()[lesson.id] || {};
      return (lesson.exercises || []).filter(function (ex) { return p[ex.id]; }).length;
    },
    reset: function () {
      LDL.store.remove(PROGRESS_KEY);
      LDL.store.remove(QUIZ_KEY);
      LDL.store.remove(ACTIVITY_KEY);
      try {
        Object.keys(localStorage)
          .filter(function (k) { return k.indexOf("ldl-code:") === 0; })
          .forEach(function (k) { localStorage.removeItem(k); });
      } catch (e) { /* ignore */ }
    }
  };

  /* ---------- Quiz answers ---------- */

  const QUIZ_KEY = "ldl-quiz-v1";

  LDL.quizProgress = {
    all: function () { return LDL.store.get(QUIZ_KEY, {}); },
    get: function (lessonId, i) {
      const q = this.all()[lessonId] || {};
      return q[i];  // undefined | { choice, correct }
    },
    set: function (lessonId, i, choice, correct) {
      const all = this.all();
      all[lessonId] = all[lessonId] || {};
      const before = all[lessonId][i];
      // XP is never taken away: once correct, it stays counted.
      all[lessonId][i] = { choice: choice, correct: correct || !!(before && before.correct) };
      LDL.store.set(QUIZ_KEY, all);
      LDL.activity.record();
    },
    countCorrect: function (lesson) {
      const q = this.all()[lesson.id] || {};
      return Object.keys(q).filter(function (k) { return q[k].correct; }).length;
    }
  };

  /* ---------- Daily streak ---------- */

  const ACTIVITY_KEY = "ldl-activity-v1";

  function dayString(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  LDL.activity = {
    record: function () {
      const days = LDL.store.get(ACTIVITY_KEY, []);
      const today = dayString(new Date());
      if (days[days.length - 1] !== today) {
        days.push(today);
        LDL.store.set(ACTIVITY_KEY, days.slice(-400));
      }
    },
    streak: function () {
      const days = new Set(LDL.store.get(ACTIVITY_KEY, []));
      const d = new Date();
      if (!days.has(dayString(d))) d.setDate(d.getDate() - 1);  // streak survives until end of today
      let n = 0;
      while (days.has(dayString(d))) { n++; d.setDate(d.getDate() - 1); }
      return n;
    }
  };

  /* ---------- XP & levels ---------- */

  LDL.XP_EXERCISE = 10;
  LDL.XP_QUIZ = 5;
  const LEVELS = [
    [0, "Beginner"], [50, "Curious Coder"], [150, "Logic Learner"], [300, "Problem Solver"],
    [500, "Data Wrangler"], [750, "Algorithm Ace"], [1000, "Interview Ready"]
  ];

  LDL.xp = function () {
    let xp = 0;
    const p = LDL.progress.all();
    Object.keys(p).forEach(function (l) { xp += Object.keys(p[l]).length * LDL.XP_EXERCISE; });
    const q = LDL.quizProgress.all();
    Object.keys(q).forEach(function (l) {
      Object.keys(q[l]).forEach(function (i) { if (q[l][i].correct) xp += LDL.XP_QUIZ; });
    });
    return xp;
  };

  LDL.level = function (xp) {
    let idx = 0;
    LEVELS.forEach(function (lv, i) { if (xp >= lv[0]) idx = i; });
    const next = LEVELS[idx + 1];
    return {
      number: idx + 1,
      name: LEVELS[idx][1],
      floor: LEVELS[idx][0],
      next: next ? next[0] : null,
      nextName: next ? next[1] : null
    };
  };

  /** Update the XP chip in the header (if present). */
  LDL.refreshXp = function (gained) {
    const chip = document.getElementById("xp-chip");
    if (!chip) return;
    const xp = LDL.xp(), lv = LDL.level(xp), streak = LDL.activity.streak();
    chip.innerHTML = '<span title="Daily streak">&#128293; ' + streak + "</span>" +
      '<span title="' + LDL.escapeHtml(lv.name) + '">&#11088; ' + xp + " XP</span>";
    if (gained) {
      const pop = document.createElement("span");
      pop.className = "xp-pop";
      pop.textContent = "+" + gained + " XP";
      chip.appendChild(pop);
      setTimeout(function () { pop.remove(); }, 1400);
    }
  };

  /** Small celebration burst - pure CSS/JS, no library. */
  LDL.celebrate = function (anchor) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = anchor ? anchor.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    const colors = ["#4f46e5", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4"];
    for (let i = 0; i < 28; i++) {
      const p = document.createElement("span");
      p.className = "confetti";
      p.style.left = (rect.left + rect.width / 2) + "px";
      p.style.top = (rect.top + rect.height / 2) + "px";
      p.style.background = colors[i % colors.length];
      const angle = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 110;
      p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      p.style.setProperty("--dy", (Math.sin(angle) * dist - 40) + "px");
      p.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
      document.body.appendChild(p);
      setTimeout(function () { p.remove(); }, 1000);
    }
  };

  LDL.drafts = {
    key: function (lessonId, exId) { return "ldl-code:" + lessonId + ":" + exId; },
    get: function (lessonId, exId) { return LDL.store.get(this.key(lessonId, exId), null); },
    set: function (lessonId, exId, code) { LDL.store.set(this.key(lessonId, exId), code); },
    clear: function (lessonId, exId) { LDL.store.remove(this.key(lessonId, exId)); }
  };

  /* ---------- Theme ---------- */

  const THEME_KEY = "ldl-theme";

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    const hl = document.getElementById("hljs-theme");
    if (hl) {
      const dark = currentIsDark();
      hl.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/" +
        (dark ? "github-dark" : "github") + ".min.css";
    }
  }

  function currentIsDark() {
    const t = document.documentElement.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  LDL.toggleTheme = function () {
    const next = currentIsDark() ? "light" : "dark";
    LDL.store.set(THEME_KEY, next);
    applyTheme(next);
  };

  applyTheme(LDL.store.get(THEME_KEY, null));

  /* ---------- Header & footer ---------- */

  const NAV = [
    ["index.html", "Lessons"],
    ["study-plan.html", "Study Plans"],
    ["problem-solving.html", "Problem Solving"],
    ["cheatsheet.html", "Cheat Sheet"],
    ["glossary.html", "Glossary"],
    ["playground.html", "Playground"]
  ];

  LDL.renderChrome = function () {
    const page = (location.pathname.split("/").pop() || "index.html");
    const header = document.getElementById("site-header");
    if (header) {
      header.className = "topbar";
      header.innerHTML =
        '<div class="topbar-inner">' +
        '<a class="brand" href="index.html"><span class="brand-logo">{ }</span><span class="brand-text">Logic &amp; Data Learning Kit</span></a>' +
        '<nav class="nav">' +
        NAV.map(function (n) {
          const active = page === n[0] || (page === "lesson.html" && n[0] === "index.html");
          return '<a href="' + n[0] + '"' + (active ? ' class="active"' : "") + ">" + n[1] + "</a>";
        }).join("") +
        "</nav>" +
        '<a class="xp-chip" id="xp-chip" href="index.html#progress" title="Your streak and XP"></a>' +
        '<button class="icon-btn" id="theme-toggle" title="Toggle dark mode" aria-label="Toggle dark mode">&#9680;</button>' +
        "</div>";
      document.getElementById("theme-toggle").addEventListener("click", LDL.toggleTheme);
      LDL.refreshXp();
    }
    const footer = document.getElementById("site-footer");
    if (footer) {
      footer.className = "footer";
      footer.innerHTML =
        "Logic &amp; Data Learning Kit &middot; free and open source &middot; " +
        "progress is saved in your browser only";
    }
  };

  /* ---------- Small helpers ---------- */

  LDL.escapeHtml = function (s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };

  LDL.highlightAll = function (root) {
    if (!window.hljs) return;
    // Only blocks that declare a language - ASCII diagrams stay uncoloured.
    (root || document).querySelectorAll('pre code[class*="language-"]').forEach(function (el) {
      if (!el.dataset.highlighted) window.hljs.highlightElement(el);
    });
  };

  document.addEventListener("DOMContentLoaded", LDL.renderChrome);
})(window.LDL);
