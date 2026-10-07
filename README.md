# Logic & Data Learning Kit

**Programming core fundamentals — learn it, practise it, pass the exam.**

A free, interactive website for learning the logic behind programming and databases:
logic, loops, functions, classes, arrays, multi-dimensional arrays, data structures,
algorithms, Big-O and SQL. Every lesson has explanations, live code examples and
**auto-graded exercises that run in the browser**.

Built with **plain HTML, CSS and JavaScript**: no build step, no server, no sign-up.
It is designed to be hosted for free on **GitHub Pages**.

### Who it's for

- **Interview candidates** preparing for logical, technical or SQL exams
- **Working professionals** who want a quick refresher on the fundamentals
- **Mentors and teams** who need a ready-made training kit

---

## Features

- 14 lessons, from boolean logic to window functions, plus a timed mock exam
- **Plain-English teaching:** every lesson opens with a real-life analogy, clear goals and
  "where you'll use this at work", then explains each idea step by step with tips and warnings
- **Lots of live examples:** each one runs in the browser and comes with a "How it works" walkthrough
  and a "Try it" suggestion
- **Quick quizzes:** "what does this print?" questions with instant feedback and explanations
- **Auto-graded exercises** with **Run** and **Check**, hints, model solutions and explanations
- **Motivation built in:** XP, levels, a daily streak and a small celebration for every solved exercise
- **Interview prep:** interview questions with model answers and key takeaways in every lesson
- Real SQLite running in the browser (via [sql.js](https://sql.js.org)) with a sample company database
- Study plans (4-week beginner, 2-week interview sprint, 1-week refresher), a problem-solving guide,
  a printable cheat sheet and a searchable plain-English glossary
- Progress and code drafts are saved automatically in the learner's browser
- Dark mode and mobile-friendly layout

## Curriculum

| #  | Lesson | Topics |
|----|--------|--------|
| 01 | Logic & Operators | Boolean logic, truth tables, De Morgan, modulo tricks |
| 02 | Conditionals & Loops | if/else, switch, for/while, nested loops, patterns, primes |
| 03 | Functions & Recursion | Scope, closures, higher-order functions, recursion, memoization |
| 04 | Arrays | Two pointers, sliding window, prefix sums, Kadane |
| 05 | Multi-dimensional Arrays | Matrices, transpose, rotate, spiral, islands |
| 06 | Strings | Palindromes, anagrams, compression, efficient string building |
| 07 | Hash Maps & Sets | Frequency counting, two-sum, grouping, O(1) lookups |
| 08 | Classes & OOP | 4 pillars, inheritance, polymorphism, composition, SOLID |
| 09 | Searching & Sorting | Binary search, bubble/selection/insertion/merge/quick sort |
| 10 | Stacks, Queues & Linked Lists | LIFO/FIFO, bracket matching, list reversal, cycle detection |
| 11 | Big-O Complexity | Analysing and optimising algorithms |
| 12 | SQL Basics | SELECT, WHERE, GROUP BY, HAVING, NULL logic |
| 13 | SQL Joins & Database Design | JOINs, subqueries, CTEs, window functions, normalization, indexes, ACID |
| 14 | Mock Exam | Mixed interview-style problems |

---

## Publish on GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/logic-data-learning/`.

The `.nojekyll` file tells GitHub Pages to serve the files as they are.

## Run it locally

You can open `index.html` directly. If your browser blocks the code runner on `file://`,
serve the folder instead:

```bash
npx serve .
# or
python -m http.server 8000
```

Then open <http://localhost:8000> (or the port shown).

> The page needs internet access for the code editor (CodeMirror), syntax highlighting
> and the SQL engine, which load from public CDNs. Lessons and JavaScript exercises
> still work without the editor; it falls back to a plain text box.

---

## Project structure

```
index.html              Home page: curriculum and progress
lesson.html             Renders any lesson: lesson.html?id=04
playground.html         Free-form JavaScript and SQL scratchpad
study-plan.html         Study tracks
problem-solving.html    Problem-solving method and logic puzzles
cheatsheet.html         One-page exam review
glossary.html           Searchable plain-English glossary (data in assets/js/glossary.js)
assets/css/style.css    All styles (light and dark themes)
assets/js/app.js        Lesson registry, progress storage, header, theme
assets/js/runner.js     Runs JS in a sandboxed Web Worker; runs SQL with sql.js
assets/js/editor.js     Code editor and playground widgets
assets/js/lesson-page.js  Lesson page renderer and exercise checker
assets/js/sample-db.js  Sample company database (SQL)
lessons/index.js        Lesson catalog (order and titles)
lessons/NN-*.js         One file per lesson: content, examples, exercises, tests
tools/verify.js         Maintainer check (Node), not used by the website
```

## Add or edit a lesson

Each lesson is a single JavaScript file that calls `LDL.registerLesson({...})`.
Use `lessons/01-logic-and-operators.js` as the template:

```js
LDL.registerLesson({
  id: "15", title: "My Topic", lang: "js", minutes: 40,
  goal: "One sentence on what the learner will be able to do.",
  analogy: "<p>A real-life comparison that makes the idea click.</p>",
  objectives: ["Explain ...", "Write ..."],
  realWorld: "<ul><li>Where this shows up at work or in exams</li></ul>",
  sections:  [{ title: "Core idea", html: "<p>...</p><div class=\"callout tip\"><p>...</p></div>" }],
  examples:  [{ title: "Demo", code: "console.log(1 + 1);", explain: "<p>How it works...</p>" }],
  pitfalls:  ["..."],
  quiz: [{ q: "What does this print?", code: "console.log(2 + 2);", output: "4",
           options: ["4", "22"], answer: 0, explain: "<p>Why...</p>" }],
  interview: [{ q: "Question?", a: "<p>Answer.</p>" }],
  takeaways: ["One-line key point"],
  exercises: [{
    id: "double", title: "double", difficulty: "easy",
    prompt: "<p>Return n * 2.</p>",
    starter: "function double(n) {\n  // your code here\n}",
    solution: "function double(n) {\n  return n * 2;\n}",
    hint: "Multiply.",
    tests: [{ expr: "double(2)", expected: 4 }]
  }]
});
```

Callout boxes available inside any HTML: `callout tip`, `note`, `warn`, `analogy`, `work`, `key`.
Then add the file to `lessons/index.js`. SQL exercises use `lang: "sql"`, plus
`expected` (an array of result rows) and `ordered: true|false` in place of `tests`.

Before committing, check that every reference solution passes its tests
(Node 22.5 or newer):

```bash
node tools/verify.js
```

## License

Free to use for learning and teaching.
