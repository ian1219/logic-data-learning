LDL.registerLesson({
  id: "14",
  title: "Mock Exam",
  lang: "js",
  minutes: 90,
  isExam: true,
  goal: "Put everything together under exam conditions: ten mixed, interview-style problems that are a step harder than the lessons. Time yourself, think out loud, and grade yourself honestly.",

  analogy: `
<p>Think of this as a <strong>dress rehearsal</strong> before opening night. Actors already know their lines; the rehearsal is where they practise
doing it all in one go, under the lights, with no script in hand. Mistakes here are cheap - and that's the point.</p>
<p>The lessons taught you the moves one at a time. The mock exam checks that you can <strong>recognise which move a problem needs</strong>,
pace yourself, and stay calm when one question fights back.</p>`,

  objectives: [
    "Solve mixed problems under a time limit without looking at the lessons",
    "Recognise the pattern behind a problem (hash map, two pointers, stack, binary search, recursion, sliding window)",
    "Start with a correct brute force, then <strong>optimise</strong> and state the Big-O",
    "Handle edge cases on purpose: empty input, one element, duplicates, negatives, \"not found\"",
    "Explain your approach out loud the way an interviewer expects"
  ],

  realWorld: `
<ul>
  <li><strong>Online assessments</strong> (HackerRank, Codility, LeetCode-style) use exactly this format: timed problems with hidden tests and speed limits.</li>
  <li><strong>Technical interviews:</strong> a 45-60 minute session usually holds 1-3 problems like these, solved while talking.</li>
  <li><strong>Logic and aptitude exams</strong> for graduate schemes and certifications reward the same pattern-spotting under time pressure.</li>
  <li><strong>At work:</strong> code reviews and incident fixes are timed problem-solving too - you weigh "correct now" against "optimal later".</li>
</ul>`,

  sections: [
    {
      title: "Exam rules",
      html: `
<ul>
  <li><strong>Time:</strong> set a timer for <strong>60 minutes</strong> (stretch goal) or <strong>90 minutes</strong> (comfortable). When it rings, stop and score what you have.</li>
  <li><strong>Closed book:</strong> no lessons, hints or solutions until the timer stops. Looking up JavaScript syntax on MDN is fine.</li>
  <li><strong>Any order:</strong> problems go roughly easy &rarr; hard, but skip around freely. Bank the easy points first.</li>
  <li><strong>Done means green:</strong> a problem counts only when <em>all</em> its tests pass, including the speed tests.</li>
  <li><strong>Afterwards:</strong> read every reference solution and explanation - even for problems you solved.</li>
</ul>
<table>
  <tr><th>Block</th><th>Problems</th><th>60-min exam</th><th>90-min exam</th></tr>
  <tr><td>Warm-up</td><td>1 - 3</td><td>10 min</td><td>15 min</td></tr>
  <tr><td>Core</td><td>4 - 7</td><td>25 min</td><td>35 min</td></tr>
  <tr><td>Stretch</td><td>8 - 10</td><td>25 min</td><td>40 min</td></tr>
</table>
<div class="callout tip"><p>Use a real timer on your phone and put it face down. Checking the clock every two minutes costs more time than it saves.</p></div>`
    },
    {
      title: "How to approach every problem",
      html: `
<p>Follow the same six steps every time. A routine keeps you calm when a problem looks scary.</p>
<ol>
  <li><strong>Understand</strong> - restate the task in one sentence. What goes in? What comes out?</li>
  <li><strong>Examples</strong> - work 2-3 small cases by hand, including an edge case (empty, one element, duplicates, negatives).</li>
  <li><strong>Brute force</strong> - say the simplest correct idea and its Big-O, even if it's slow.</li>
  <li><strong>Optimise</strong> - ask the three magic questions (below).</li>
  <li><strong>Code</strong> - small steps, clear names, return early for edge cases.</li>
  <li><strong>Test</strong> - trace one example through your code by hand, <em>then</em> press Run.</li>
</ol>
<div class="callout key"><p>The three magic optimisation questions:
<strong>(1)</strong> Can a Set or Map replace my inner loop?
<strong>(2)</strong> Is the input sorted, or can I sort it, so binary search or two pointers apply?
<strong>(3)</strong> Am I recomputing something I could remember (running total, sliding window, memoization)?</p></div>
<div class="callout work"><p>In a live interview, steps 1-4 are spoken out loud <em>before</em> you type. Interviewers grade your reasoning as much as your final code.</p></div>`
    },
    {
      title: "Spotting the pattern",
      html: `
<p>Most exam problems are a known pattern in disguise. Look for these clues in the wording:</p>
<table>
  <tr><th>If the problem says...</th><th>Reach for...</th><th>Typical Big-O</th></tr>
  <tr><td>"sorted array", "find position", "minimum value that works"</td><td>Binary search</td><td>O(log n)</td></tr>
  <tr><td>"pair that sums to", "seen before", "count occurrences", "first unique"</td><td>Hash map / Set</td><td>O(n)</td></tr>
  <tr><td>"longest / shortest substring or subarray with..."</td><td>Sliding window</td><td>O(n)</td></tr>
  <tr><td>"brackets", "undo", "most recent", "nested"</td><td>Stack</td><td>O(n)</td></tr>
  <tr><td>"all combinations / subsets / permutations"</td><td>Recursion (backtracking)</td><td>O(2<sup>n</sup>) or O(n!)</td></tr>
  <tr><td>"grid", "matrix", "rotate", "neighbours"</td><td>Nested loops over rows and columns</td><td>O(rows &times; cols)</td></tr>
  <tr><td>"digits of a number"</td><td><code>% 10</code> and <code>Math.floor(n / 10)</code></td><td>O(digits)</td></tr>
</table>
<div class="callout tip"><p>If a test has a time limit (<code>maxMs</code>), that's a strong hint that the obvious nested-loop O(n<sup>2</sup>) answer is too slow.</p></div>`
    },
    {
      title: "Scoring rubric",
      html: `
<p>Each problem is worth <strong>10 points</strong> - 100 in total:</p>
<table>
  <tr><th>Points</th><th>Criterion</th></tr>
  <tr><td>6</td><td>All tests pass (give yourself 3 if most of them pass)</td></tr>
  <tr><td>2</td><td>Optimal or near-optimal time complexity - and you can say what it is</td></tr>
  <tr><td>1</td><td>Edge cases handled deliberately, not by luck</td></tr>
  <tr><td>1</td><td>Readable: clear names, no dead code, no needless changes to the input</td></tr>
</table>
<table>
  <tr><th>Score</th><th>Verdict</th></tr>
  <tr><td>85 - 100</td><td>Interview-ready. Practise explaining your approach out loud.</td></tr>
  <tr><td>65 - 84</td><td>Solid. Revisit the lessons behind the problems you missed.</td></tr>
  <tr><td>40 - 64</td><td>Getting there. Redo the hard exercises of lessons 04, 07 and 09, then retake.</td></tr>
  <tr><td>below 40</td><td>Work through the lessons again in order, then retake in a week. That's normal - nobody aces this first time.</td></tr>
</table>`
    },
    {
      title: "Topic map",
      html: `
<p>Use this after the exam to know which lesson to revisit for each problem you missed.</p>
<table>
  <tr><th>#</th><th>Problem</th><th>Pattern</th><th>Lessons</th></tr>
  <tr><td>1</td><td>isArmstrong</td><td>digit loop</td><td>01, 02</td></tr>
  <tr><td>2</td><td>secondLargest</td><td>best-so-far, one pass</td><td>02, 04</td></tr>
  <tr><td>3</td><td>rotateMatrix</td><td>2D index mapping</td><td>05</td></tr>
  <tr><td>4</td><td>firstUniqueChar</td><td>frequency map</td><td>06, 07</td></tr>
  <tr><td>5</td><td>isBalanced</td><td>stack</td><td>10</td></tr>
  <tr><td>6</td><td>BankAccount</td><td>class, validation, errors</td><td>08</td></tr>
  <tr><td>7</td><td>twoSum</td><td>hash map lookup</td><td>07, 11</td></tr>
  <tr><td>8</td><td>searchInsert</td><td>binary search</td><td>09</td></tr>
  <tr><td>9</td><td>subsets</td><td>recursion / backtracking</td><td>03</td></tr>
  <tr><td>10</td><td>longestUniqueSubstring</td><td>sliding window</td><td>04, 11</td></tr>
</table>
<div class="callout note"><p>Retake the exam a week later. Seeing the same problems again is fine - the goal is to solve them faster and explain them more clearly.</p></div>`
    }
  ],

  examples: [],

  pitfalls: [
    "Spending 30 minutes on one problem. If you're stuck for 10, write the brute force, make it pass, and move on.",
    "Skipping edge cases: empty input, a single element, all duplicates, negative numbers, \"not found\".",
    "Changing the input when the problem asks for a new result (e.g. rotating a matrix in place when a new one is expected).",
    "Nested loops over large inputs. If a test has a time limit, an O(n<sup>2</sup>) solution is the wrong idea.",
    "Off-by-one errors in binary search: decide whether your range is <code>[lo, hi]</code> or <code>[lo, hi)</code> and stay consistent.",
    "Misreading the output format: index vs value, <code>null</code> vs <code>-1</code>, new array vs in-place."
  ],

  quiz: [
    {
      q: "A problem says: <em>\"Given a <strong>sorted</strong> array of 1 million prices, find where a new price should be inserted.\"</em> Which technique fits best?",
      options: ["Nested loops", "Binary search", "A stack", "Recursion generating all subsets"],
      answer: 1,
      explain: "<p>\"Sorted\" plus \"find a position\" is the classic signal for <strong>binary search</strong>: halve the range every step, so 1,000,000 items need only about 20 comparisons (O(log n)). A linear scan would also work but is far slower.</p>"
    },
    {
      q: "<em>\"Find two numbers in an <strong>unsorted</strong> list that add up to a target, in O(n).\"</em> What do you reach for?",
      options: ["Sort, then nested loops", "A hash map of values you've already seen", "A stack", "Binary search on the unsorted list"],
      answer: 1,
      explain: "<p>For each number <code>x</code> you need to know instantly whether <code>target - x</code> appeared earlier. A Map (or Set) answers \"have I seen this?\" in O(1), so one pass is O(n). Binary search needs sorted data, and sorting alone is already O(n log n).</p>"
    },
    {
      q: "<em>\"Return the length of the <strong>longest substring</strong> with no repeated characters.\"</em> Which pattern is this?",
      options: ["Sliding window", "Binary search", "Recursion", "Sorting"],
      answer: 0,
      explain: "<p>\"Longest/shortest <strong>contiguous</strong> piece with a property\" is the sliding-window signal. You grow the window on the right and shrink it from the left when the rule breaks; each character enters and leaves once, so it's O(n).</p>"
    },
    {
      q: "<em>\"Check whether every <code>(</code>, <code>[</code> and <code>{</code> is closed in the right order.\"</em> Which data structure?",
      options: ["Queue", "Set", "Stack", "Sorted array"],
      answer: 2,
      explain: "<p>The most recently opened bracket must be closed first - \"last in, first out\" - which is exactly what a <strong>stack</strong> does. Push openers, pop on closers and check they match.</p>"
    },
    {
      q: "What does this print?",
      code: `const arr = [1, 3, 5, 7, 9, 11];
let lo = 0, hi = arr.length - 1, steps = 0;
while (lo <= hi) {
  steps++;
  const mid = Math.floor((lo + hi) / 2);
  if (arr[mid] === 9) break;
  if (arr[mid] < 9) lo = mid + 1;
  else hi = mid - 1;
}
console.log(steps);`,
      options: ["1", "2", "3", "5"],
      answer: 1,
      output: "2",
      explain: "<p>Step 1: <code>mid = 2</code>, value 5 &lt; 9, so <code>lo = 3</code>. Step 2: <code>mid = (3 + 5) / 2 = 4</code>, value 9 - found. A linear scan would have needed 5 steps; binary search needed <strong>2</strong>.</p>"
    },
    {
      q: "You've been stuck on one problem for 12 minutes of a 60-minute exam. What's the best move?",
      options: [
        "Keep going - you're close",
        "Write a simple brute force that passes some tests, note your idea, and move on",
        "Delete everything and start over",
        "Skip all remaining hard problems"
      ],
      answer: 1,
      explain: "<p>Partial credit beats zero. A working brute force banks points, and moving on protects the time you need for problems you <em>can</em> solve. Come back at the end with fresh eyes - often the better idea arrives while you're doing something else.</p>"
    },
    {
      q: "Your solution passes every test except one labelled <em>\"100,000 numbers in O(n)\"</em>, which says <em>\"Too slow\"</em>. What is the most likely issue?",
      options: [
        "A syntax error",
        "A nested loop making it O(n<sup>2</sup>)",
        "Using <code>const</code> instead of <code>let</code>",
        "The test is broken"
      ],
      answer: 1,
      explain: "<p>Correct on small inputs but slow on big ones means the <strong>algorithm</strong> is too slow, not that it's wrong. 100,000<sup>2</sup> is 10 billion steps. Look for an inner loop you can replace with a Map/Set lookup, binary search or a sliding window.</p>"
    }
  ],

  interview: [
    { q: "Walk me through how you approach a problem you've never seen before.",
      a: "<p>I restate it and confirm the inputs, outputs and constraints. I work a few small examples by hand, including edge cases. I state a brute-force solution and its complexity, then look for something better: can a hash map remove a nested loop, does sorted input allow binary search or two pointers, can I avoid recomputing work? Then I code in small pieces and trace an example before running it.</p>" },
    { q: "Your solution is O(n<sup>2</sup>). How would you make it faster?",
      a: "<p>I find what the inner loop is searching for and make that lookup O(1) with a Set or Map - for two-sum, store each value's index and look up <code>target - x</code>. Alternatively I sort once (O(n log n)) and use two pointers or binary search, or keep a sliding window so each element enters and leaves only once.</p>" },
    { q: "How do you test your own code in an interview without a test suite?",
      a: "<p>I trace a normal example line by line, then the edges: empty input, one element, duplicates, negatives, the answer at the first and last position, and \"not found\". I pay special attention to loop boundaries, where off-by-one errors hide.</p>" },
    { q: "When would you choose recursion over iteration?",
      a: "<p>When the problem is naturally self-similar or tree-shaped: nested structures, generating subsets or permutations, divide and conquer like merge sort. I use iteration for linear work or when the depth could exceed the call stack, and I add memoization when sub-problems repeat.</p>" },
    { q: "Explain a time-versus-space trade-off from one of these problems.",
      a: "<p>In two-sum, the brute force uses O(1) extra memory but O(n<sup>2</sup>) time. A Map of seen values costs O(n) memory but cuts time to O(n). Spending memory to save time is usually the right call unless memory is very tight.</p>" },
    { q: "You realise halfway through that your approach is wrong. What do you do?",
      a: "<p>Say so out loud, explain which case breaks it, and pivot - reusing whatever still works. Interviewers value someone who catches their own bug quickly. If time is short, I finish a correct brute force first and describe the better approach in words.</p>" }
  ],

  exercises: [
    {
      id: "is-armstrong",
      title: "1. isArmstrong",
      difficulty: "easy",
      prompt: "<p>An <strong>Armstrong number</strong> equals the sum of its digits, each raised to the power of <em>how many digits it has</em>. Return <code>true</code> if the non-negative integer <code>n</code> is one. Use maths, not strings.</p><p><code>153 &rarr; true</code> (3 digits: 1<sup>3</sup> + 5<sup>3</sup> + 3<sup>3</sup> = 1 + 125 + 27 = 153) &nbsp; <code>9474 &rarr; true</code> (9<sup>4</sup> + 4<sup>4</sup> + 7<sup>4</sup> + 4<sup>4</sup>) &nbsp; <code>10 &rarr; false</code> (1<sup>2</sup> + 0<sup>2</sup> = 1) &nbsp; <code>7 &rarr; true</code></p>",
      starter: `function isArmstrong(n) {
  // your code here
}`,
      solution: `function isArmstrong(n) {
  // Pass 1: count the digits.
  let digits = 0;
  for (let t = n; t > 0; t = Math.floor(t / 10)) digits++;
  if (digits === 0) digits = 1;              // n = 0 still has one digit

  // Pass 2: add up each digit raised to that power.
  let sum = 0;
  for (let t = n; t > 0; t = Math.floor(t / 10)) {
    sum += (t % 10) ** digits;
  }
  return sum === n;
}`,
      hint: "You need two digit loops on a <em>copy</em> of n: the first counts the digits, the second adds <code>(t % 10) ** digits</code>. Then compare the sum with the original n.",
      explanation: "<p>You can't raise to the right power until you know how many digits there are, hence two passes. Working on a copy <code>t</code> keeps <code>n</code> intact for the final comparison. Time is O(d) for d digits.</p>",
      forbid: [{ pattern: "String\\(|toString|split|\\+\\s*\"\"", message: "Use digit math (% and Math.floor), not strings." }],
      tests: [
        { expr: "isArmstrong(153)", expected: true },
        { expr: "isArmstrong(9474)", expected: true },
        { expr: "isArmstrong(370)", expected: true },
        { expr: "isArmstrong(10)", expected: false },
        { expr: "isArmstrong(100)", expected: false },
        { expr: "isArmstrong(0)", expected: true, label: "0 -> true" },
        { expr: "isArmstrong(7)", expected: true, label: "every single digit is Armstrong" }
      ]
    },
    {
      id: "second-largest",
      title: "2. secondLargest",
      difficulty: "easy",
      prompt: "<p>Return the second largest <strong>distinct</strong> value in the array, or <code>null</code> if there isn't one. Do it in <strong>one pass</strong>, without sorting.</p><p><code>[3, 7, 7, 5] &rarr; 5</code> (7 is the largest, duplicates don't count twice) &nbsp; <code>[-1, -5, -3] &rarr; -3</code> &nbsp; <code>[4, 4] &rarr; null</code> &nbsp; <code>[] &rarr; null</code></p>",
      starter: `function secondLargest(arr) {
  // your code here
}`,
      solution: `function secondLargest(arr) {
  // Track the top two DISTINCT values seen so far.
  let first = -Infinity, second = -Infinity;
  for (const x of arr) {
    if (x > first) {
      second = first;            // old champion drops to second place
      first = x;
    } else if (x < first && x > second) {
      second = x;                // new runner-up (x === first is ignored)
    }
  }
  return second === -Infinity ? null : second;
}`,
      hint: "Keep two variables, <code>first</code> and <code>second</code>, both starting at <code>-Infinity</code>. A new maximum pushes the old maximum down into <code>second</code>. A value equal to <code>first</code> must be ignored. At the end, if <code>second</code> is still <code>-Infinity</code>, return null.",
      explanation: "<p>This is the best-so-far pattern with two slots. Starting at <code>-Infinity</code> means any real number beats it, so negative arrays work. One pass, O(n) time, O(1) memory - sorting would be O(n log n).</p>",
      forbid: [{ pattern: "\\.sort\\(", message: "Do it in one pass - no sorting." }],
      tests: [
        { expr: "secondLargest([3, 7, 7, 5])", expected: 5, label: "duplicates of the max are ignored" },
        { expr: "secondLargest([1, 2])", expected: 1 },
        { expr: "secondLargest([4, 4])", expected: null },
        { expr: "secondLargest([9])", expected: null },
        { expr: "secondLargest([])", expected: null },
        { expr: "secondLargest([-1, -5, -3])", expected: -3, label: "all negatives" },
        { expr: "secondLargest([10, 9, 8, 10, 9])", expected: 9 }
      ]
    },
    {
      id: "rotate-matrix",
      title: "3. rotateMatrix",
      difficulty: "medium",
      prompt: "<p>Return a <strong>new</strong> matrix: the input rotated 90&deg; <strong>clockwise</strong>. It may be rectangular - an <code>r &times; c</code> matrix becomes <code>c &times; r</code>. Don't change the input.</p><pre><code>[[1, 2],      [[3, 1],\n [3, 4]]  &rarr;   [4, 2]]\n\n[[1, 2, 3],        [[4, 1],\n [4, 5, 6]]   &rarr;    [5, 2],\n                    [6, 3]]</code></pre><p><code>rotateMatrix([[5]]) &rarr; [[5]]</code> &nbsp; <code>rotateMatrix([]) &rarr; []</code></p>",
      starter: `function rotateMatrix(matrix) {
  // your code here
}`,
      solution: `function rotateMatrix(matrix) {
  const rows = matrix.length;
  if (rows === 0) return [];
  const cols = matrix[0].length;
  const out = [];
  // New row c = old column c, read from the BOTTOM row up.
  for (let c = 0; c < cols; c++) {
    const newRow = [];
    for (let r = rows - 1; r >= 0; r--) {
      newRow.push(matrix[r][c]);
    }
    out.push(newRow);
  }
  return out;
}`,
      hint: "Look at the 2&times;3 example: the first <em>row</em> of the result <code>[4, 1]</code> is the first <em>column</em> of the input (<code>1, 4</code>) read from bottom to top. So loop over columns on the outside, and over rows <strong>backwards</strong> on the inside.",
      explanation: "<p>Rotation maps <code>matrix[r][c]</code> to <code>out[c][rows - 1 - r]</code>. Reading each column bottom-to-top builds exactly that. O(rows &times; cols) time. (Rotating a <em>square</em> matrix in place is a common follow-up: transpose, then reverse each row.)</p>",
      tests: [
        { expr: "rotateMatrix([[1, 2], [3, 4]])", expected: [[3, 1], [4, 2]] },
        { expr: "rotateMatrix([[1, 2, 3], [4, 5, 6]])", expected: [[4, 1], [5, 2], [6, 3]], label: "rectangular 2x3 -> 3x2" },
        { expr: "rotateMatrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]])", expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] },
        { expr: "rotateMatrix([[5]])", expected: [[5]] },
        { expr: "rotateMatrix([])", expected: [] },
        { expr: "rotateMatrix([[1, 2, 3]])", expected: [[1], [2], [3]], label: "single row" },
        { code: "const m = [[1, 2], [3, 4]]; rotateMatrix(m); return m;", expected: [[1, 2], [3, 4]], label: "input is not modified" }
      ]
    },
    {
      id: "first-unique-char",
      title: "4. firstUniqueChar",
      difficulty: "medium",
      prompt: "<p>Return the <strong>index</strong> of the first character that appears exactly once in <code>s</code>, or <code>-1</code> if there is none. Must be O(n) - one test uses a 200,000-character string.</p><p><code>\"leetcode\" &rarr; 0</code> (\"l\") &nbsp; <code>\"loveleetcode\" &rarr; 2</code> (\"v\") &nbsp; <code>\"aabb\" &rarr; -1</code> &nbsp; <code>\"\" &rarr; -1</code></p>",
      starter: `function firstUniqueChar(s) {
  // your code here
}`,
      solution: `function firstUniqueChar(s) {
  // Pass 1: count how often each character appears.
  const counts = new Map();
  for (const ch of s) {
    counts.set(ch, (counts.get(ch) || 0) + 1);
  }
  // Pass 2: the first character with a count of 1 wins.
  for (let i = 0; i < s.length; i++) {
    if (counts.get(s[i]) === 1) return i;
  }
  return -1;
}`,
      hint: "Two separate passes, not nested loops. First build a frequency Map (<code>char &rarr; count</code>). Then scan the string again from the start and return the first index whose count is 1.",
      explanation: "<p>Checking each character against every other one (<code>indexOf</code>/<code>lastIndexOf</code> inside a loop) is O(n<sup>2</sup>) and times out. Two linear passes with a Map are O(n). This \"count first, then decide\" shape solves a huge family of string problems.</p>",
      tests: [
        { expr: "firstUniqueChar(\"leetcode\")", expected: 0 },
        { expr: "firstUniqueChar(\"loveleetcode\")", expected: 2 },
        { expr: "firstUniqueChar(\"aabb\")", expected: -1 },
        { expr: "firstUniqueChar(\"\")", expected: -1, label: "empty string" },
        { expr: "firstUniqueChar(\"z\")", expected: 0 },
        { expr: "firstUniqueChar(\"aAa\")", expected: 1, label: "case-sensitive" },
        { code: "const s = \"ab\".repeat(100000) + \"c\"; return firstUniqueChar(s);", expected: 200000, maxMs: 500, label: "200,000 chars in O(n)" }
      ]
    },
    {
      id: "is-balanced",
      title: "5. isBalanced",
      difficulty: "medium",
      prompt: "<p>Return <code>true</code> if every bracket in <code>s</code> - <code>()</code>, <code>[]</code>, <code>{}</code> - is closed by the <strong>matching type</strong> in the <strong>correct order</strong>. Ignore all other characters.</p><p><code>\"{[a + b] * (c)}\" &rarr; true</code> &nbsp; <code>\"([)]\" &rarr; false</code> (closed in the wrong order) &nbsp; <code>\"((\" &rarr; false</code> &nbsp; <code>\"\" &rarr; true</code></p>",
      starter: `function isBalanced(s) {
  // your code here
}`,
      solution: `function isBalanced(s) {
  const opener = { ")": "(", "]": "[", "}": "{" };   // closer -> its opener
  const stack = [];
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);                                // remember it
    } else if (ch in opener) {
      // The most recent opener must match this closer.
      // pop() on an empty stack gives undefined -> mismatch -> false.
      if (stack.pop() !== opener[ch]) return false;
    }
  }
  return stack.length === 0;                         // nothing left unclosed
}`,
      hint: "Use an array as a stack. Push every opening bracket. On a closing bracket, <code>pop()</code> the last opener and check it's the matching type. At the very end the stack must be empty (otherwise something was never closed).",
      explanation: "<p>Three ways to fail, all covered: wrong type (<code>(]</code>), closing with nothing open (<code>())</code> - pop returns <code>undefined</code>), and leftovers (<code>((</code> - stack not empty). One pass, O(n) time.</p>",
      tests: [
        { expr: "isBalanced(\"{[a + b] * (c)}\")", expected: true },
        { expr: "isBalanced(\"()[]{}\")", expected: true },
        { expr: "isBalanced(\"([)]\")", expected: false, label: "wrong order" },
        { expr: "isBalanced(\"((\")", expected: false, label: "unclosed" },
        { expr: "isBalanced(\"())\")", expected: false, label: "extra closer" },
        { expr: "isBalanced(\")(\")", expected: false },
        { expr: "isBalanced(\"\")", expected: true, label: "empty string" },
        { expr: "isBalanced(\"no brackets\")", expected: true }
      ]
    },
    {
      id: "bank-account",
      title: "6. BankAccount class",
      difficulty: "medium",
      prompt: "<p>Write a class <code>BankAccount</code>:</p><ul><li><code>new BankAccount(owner, initial = 0)</code></li><li><code>deposit(amount)</code> - adds money and returns the new balance; <strong>throws</strong> an <code>Error</code> if <code>amount &lt;= 0</code></li><li><code>withdraw(amount)</code> - subtracts and returns the new balance; throws if <code>amount &lt;= 0</code> or more than the balance</li><li>getter <code>balance</code> - the current balance (read-only)</li><li><code>history()</code> - an array like <code>[\"deposit 50\", \"withdraw 20\"]</code>; failed operations are not recorded; return a <strong>copy</strong></li></ul><pre><code>const acc = new BankAccount(\"Ana\", 100);\nacc.deposit(50);    // 150\nacc.withdraw(30);   // 120\nacc.withdraw(500);  // throws Error - balance stays 120\nacc.history();      // [\"deposit 50\", \"withdraw 30\"]</code></pre>",
      starter: `class BankAccount {
  constructor(owner, initial = 0) {
    // your code here
  }
}`,
      solution: `class BankAccount {
  #balance;            // # = private field: only code inside the class can touch it
  #log = [];

  constructor(owner, initial = 0) {
    this.owner = owner;
    this.#balance = initial;
  }

  get balance() {      // getter with no setter -> read-only from outside
    return this.#balance;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Deposit must be positive");   // validate FIRST
    this.#balance += amount;
    this.#log.push("deposit " + amount);
    return this.#balance;
  }

  withdraw(amount) {
    if (amount <= 0) throw new Error("Withdrawal must be positive");
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
    this.#log.push("withdraw " + amount);
    return this.#balance;
  }

  history() {
    return [...this.#log];   // a copy, so callers can't edit our records
  }
}`,
      hint: "Store the balance and a log array in the constructor. In each method: <strong>validate first</strong> and <code>throw new Error(\"...\")</code> on bad input; only then change the balance and push a log entry. <code>get balance() { return ...; }</code> makes a read-only property. Return <code>[...log]</code> from <code>history()</code>.",
      explanation: "<p>This is <strong>encapsulation</strong>: the balance can only change through methods that enforce the rules. Validating <em>before</em> changing anything means a failed operation leaves the object untouched. Private <code>#</code> fields and returning a copy of the log stop outside code from bypassing the rules.</p>",
      tests: [
        { code: "const a = new BankAccount(\"Ana\", 100); return a.balance;", expected: 100 },
        { code: "const a = new BankAccount(\"Ana\"); return a.balance;", expected: 0, label: "default initial balance is 0" },
        { code: "const a = new BankAccount(\"Ana\"); a.deposit(50); return a.withdraw(20);", expected: 30 },
        { code: "const a = new BankAccount(\"Ana\", 10); a.withdraw(11);", throws: true, label: "withdrawing too much throws" },
        { code: "const a = new BankAccount(\"Ana\", 10); a.deposit(0);", throws: true, label: "deposit of 0 throws" },
        { code: "const a = new BankAccount(\"Ana\", 10); a.withdraw(-5);", throws: true, label: "negative withdrawal throws" },
        { code: "const a = new BankAccount(\"Ana\", 10); try { a.withdraw(99); } catch (e) {} return a.balance;", expected: 10, label: "failed withdrawal leaves balance unchanged" },
        { code: "const a = new BankAccount(\"Ana\"); a.deposit(50); a.withdraw(20); try { a.withdraw(999); } catch (e) {} return a.history();", expected: ["deposit 50", "withdraw 20"], label: "history skips failed operations" },
        { code: "const a = new BankAccount(\"Ana\"); a.deposit(5); a.history().push(\"hack\"); return a.history().length;", expected: 1, label: "history() returns a copy" }
      ]
    },
    {
      id: "two-sum",
      title: "7. twoSum",
      difficulty: "medium",
      prompt: "<p>Return the indexes <code>[i, j]</code> (with <code>i &lt; j</code>) of the two numbers that add up to <code>target</code>. An answer always exists. If several pairs work, return the one whose <code>j</code> is smallest. Must be O(n) - one test uses 100,000 numbers.</p><p><code>twoSum([2, 7, 11, 15], 9) &rarr; [0, 1]</code> (2 + 7) &nbsp; <code>twoSum([3, 2, 4], 6) &rarr; [1, 2]</code> &nbsp; <code>twoSum([3, 3], 6) &rarr; [0, 1]</code></p>",
      starter: `function twoSum(nums, target) {
  // your code here
}`,
      solution: `function twoSum(nums, target) {
  const seen = new Map();                 // value -> index where we saw it
  for (let j = 0; j < nums.length; j++) {
    const need = target - nums[j];        // the partner this number needs
    if (seen.has(need)) {
      return [seen.get(need), j];         // partner appeared earlier
    }
    if (!seen.has(nums[j])) {
      seen.set(nums[j], j);               // keep the EARLIEST index of each value
    }
  }
  return null;
}`,
      hint: "For each number <code>x</code> at index <code>j</code>, the partner you need is <code>target - x</code>. Keep a Map of values you've <em>already passed</em> (value &rarr; index). If the partner is in the Map, you're done. Check before you add <code>x</code>, so a number can't pair with itself.",
      explanation: "<p>The brute force tries every pair: O(n<sup>2</sup>) - about 5 billion checks for 100,000 numbers. The Map turns \"is the partner somewhere earlier?\" into an O(1) lookup, so one pass is O(n) time with O(n) memory. Because we scan <code>j</code> left to right and return at the first hit, we naturally get the smallest <code>j</code>.</p>",
      tests: [
        { expr: "twoSum([2, 7, 11, 15], 9)", expected: [0, 1] },
        { expr: "twoSum([3, 2, 4], 6)", expected: [1, 2], label: "don't use the same element twice" },
        { expr: "twoSum([3, 3], 6)", expected: [0, 1], label: "duplicates" },
        { expr: "twoSum([-4, 10, 1, 7], 3)", expected: [0, 3], label: "negatives" },
        { expr: "twoSum([0, 5, 0], 0)", expected: [0, 2] },
        { code: "const n = 100000; const a = []; for (let i = 0; i < n; i++) a.push(i * 2); a.push(1); return twoSum(a, 2 * (n - 1) + 1);", expected: [99999, 100000], maxMs: 300, label: "100,000 numbers in O(n)" }
      ]
    },
    {
      id: "search-insert",
      title: "8. searchInsert",
      difficulty: "medium",
      prompt: "<p>Given a <strong>sorted</strong> array of distinct numbers, return the index of <code>target</code> if it's there; otherwise the index where it <em>would</em> be inserted to keep the order. Must be O(log n) - write the binary search yourself.</p><p><code>searchInsert([1, 3, 5, 6], 5) &rarr; 2</code> (found) &nbsp; <code>searchInsert([1, 3, 5, 6], 2) &rarr; 1</code> (between 1 and 3) &nbsp; <code>searchInsert([1, 3, 5, 6], 7) &rarr; 4</code> (at the end) &nbsp; <code>searchInsert([], 3) &rarr; 0</code></p>",
      starter: `function searchInsert(arr, target) {
  // your code here
}`,
      solution: `function searchInsert(arr, target) {
  // Search range is [lo, hi). hi = arr.length allows "insert at the end".
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] < target) {
      lo = mid + 1;        // mid is too small: answer is to the right
    } else {
      hi = mid;            // mid might be the answer: keep it in range
    }
  }
  return lo;               // first index whose value is >= target
}`,
      hint: "Reframe the question: find the <strong>first index whose value is &gt;= target</strong> - that covers both \"found\" and \"insert here\". Use <code>lo = 0, hi = arr.length</code>, loop <code>while (lo &lt; hi)</code>; if <code>arr[mid] &lt; target</code> move <code>lo = mid + 1</code>, else <code>hi = mid</code>. Return <code>lo</code>.",
      explanation: "<p>Each step halves the range, so 1,000,000 items need about 20 steps. Using a half-open range <code>[lo, hi)</code> with <code>hi = arr.length</code> means \"insert at the end\" needs no special case, and the loop always ends with <code>lo === hi</code> - the answer. Mixing <code>[lo, hi]</code> and <code>[lo, hi)</code> rules is the #1 source of binary search bugs.</p>",
      forbid: [{ pattern: "indexOf|findIndex|includes|\\.find\\(|\\.filter\\(|\\.sort\\(", message: "Write the binary search yourself - no indexOf, findIndex, includes, find, filter or sort." }],
      tests: [
        { expr: "searchInsert([1, 3, 5, 6], 5)", expected: 2, label: "found" },
        { expr: "searchInsert([1, 3, 5, 6], 2)", expected: 1, label: "insert in the middle" },
        { expr: "searchInsert([1, 3, 5, 6], 7)", expected: 4, label: "insert at the end" },
        { expr: "searchInsert([1, 3, 5, 6], 0)", expected: 0, label: "insert at the start" },
        { expr: "searchInsert([], 3)", expected: 0, label: "empty array" },
        { expr: "searchInsert([4], 4)", expected: 0 },
        { expr: "searchInsert([-10, -3, 0, 8], -4)", expected: 1, label: "negatives" },
        { code: "const a = Array.from({ length: 1000000 }, (_, i) => i * 3); let s = 0; for (let k = 0; k < 20000; k++) s += searchInsert(a, k * 149 + 1); return s;", expected: 9932850000, maxMs: 400, label: "20,000 searches on 1,000,000 items" }
      ]
    },
    {
      id: "subsets",
      title: "9. subsets",
      difficulty: "hard",
      prompt: "<p>Return <strong>all subsets</strong> (the \"power set\") of an array of distinct values. Each subset keeps the elements in their original order; the subsets themselves can be in any order. An array of n items has 2<sup>n</sup> subsets.</p><p><code>subsets([1, 2]) &rarr; [[], [1], [2], [1, 2]]</code> &nbsp; <code>subsets([\"x\"]) &rarr; [[], [\"x\"]]</code> &nbsp; <code>subsets([]) &rarr; [[]]</code></p>",
      starter: `function subsets(arr) {
  // your code here
}`,
      solution: `function subsets(arr) {
  const out = [];
  const current = [];           // the subset being built right now

  function build(i) {
    if (i === arr.length) {     // base case: decided about every element
      out.push([...current]);   // store a COPY (current keeps changing)
      return;
    }
    build(i + 1);               // choice 1: leave arr[i] out
    current.push(arr[i]);
    build(i + 1);               // choice 2: put arr[i] in
    current.pop();              // undo the choice before returning
  }

  build(0);
  return out;
}`,
      hint: "For each element you make a yes/no choice: leave it out, or put it in. Write a helper <code>build(i)</code> that tries both choices and recurses to <code>i + 1</code>. When <code>i</code> reaches the end, push a <strong>copy</strong> of the current subset.",
      explanation: "<p>This is <strong>backtracking</strong>: choose, recurse, un-choose. The recursion tree has 2<sup>n</sup> leaves, one per subset, so it runs in O(n &times; 2<sup>n</sup>) including copying. Iterative alternative: start with <code>[[]]</code> and, for each element, add a copy of every existing subset with that element appended.</p>",
      tests: [
        { expr: "subsets([1, 2])", expected: [[], [1], [2], [1, 2]], unordered: true },
        { expr: "subsets([])", expected: [[]], label: "empty set has one subset: itself" },
        { expr: "subsets([\"x\"])", expected: [[], ["x"]], unordered: true },
        { expr: "subsets([1, 2, 3])", expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]], unordered: true },
        { expr: "subsets([5, 6, 7, 8, 9, 10]).length", expected: 64, label: "2^6 subsets" }
      ]
    },
    {
      id: "longest-unique-substring",
      title: "10. longestUniqueSubstring",
      difficulty: "hard",
      prompt: "<p>Return the <strong>length</strong> of the longest substring (a contiguous piece) of <code>s</code> with no repeated characters. Must be O(n) - one test uses a 300,000-character string.</p><p><code>\"abcabcbb\" &rarr; 3</code> (\"abc\") &nbsp; <code>\"bbbbb\" &rarr; 1</code> &nbsp; <code>\"pwwkew\" &rarr; 3</code> (\"wke\") &nbsp; <code>\"abba\" &rarr; 2</code> &nbsp; <code>\"\" &rarr; 0</code></p>",
      starter: `function longestUniqueSubstring(s) {
  // your code here
}`,
      solution: `function longestUniqueSubstring(s) {
  // Window = s[left..right] with no repeats.
  const lastSeen = new Map();     // char -> last index where we saw it
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    // Is ch already INSIDE the current window? Then jump left past it.
    if (lastSeen.has(ch) && lastSeen.get(ch) >= left) {
      left = lastSeen.get(ch) + 1;
    }
    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);   // window length
  }
  return best;
}`,
      hint: "Sliding window: move <code>right</code> one character at a time. Keep a Map of each character's last index. If the new character was last seen <em>inside</em> the window (index &gt;= <code>left</code>), move <code>left</code> to just after that position. Track the biggest <code>right - left + 1</code>.",
      explanation: "<p>Brute force checks every substring: O(n<sup>2</sup>) or worse. The window's edges only ever move forward, so each character is handled a constant number of times: O(n) time. The <code>&gt;= left</code> check matters - in <code>\"abba\"</code> the second <code>a</code> was seen at index 0, which is already outside the window, so <code>left</code> must not jump backwards.</p>",
      tests: [
        { expr: "longestUniqueSubstring(\"abcabcbb\")", expected: 3 },
        { expr: "longestUniqueSubstring(\"bbbbb\")", expected: 1 },
        { expr: "longestUniqueSubstring(\"pwwkew\")", expected: 3 },
        { expr: "longestUniqueSubstring(\"\")", expected: 0, label: "empty string" },
        { expr: "longestUniqueSubstring(\"a\")", expected: 1 },
        { expr: "longestUniqueSubstring(\"abba\")", expected: 2, label: "left edge must never move backwards" },
        { expr: "longestUniqueSubstring(\"dvdf\")", expected: 3 },
        { code: "const s = \"abcdefghijklmnopqrstuvwxyz\".repeat(11538) + \"ab\"; return longestUniqueSubstring(s);", expected: 26, maxMs: 500, label: "300,000 chars in O(n)" }
      ]
    }
  ],

  takeaways: [
    "Use the same routine every time: understand, examples, brute force, optimise, code, test.",
    "Wording reveals the pattern: <em>sorted</em> &rarr; binary search, <em>seen before / pair</em> &rarr; hash map, <em>longest substring</em> &rarr; sliding window, <em>brackets</em> &rarr; stack, <em>all combinations</em> &rarr; recursion.",
    "A speed test failing means the algorithm is too slow - look for the inner loop to remove.",
    "Edge cases are points: empty, single element, duplicates, negatives, not found.",
    "Stuck for 10 minutes? Bank a brute force and move on; come back later.",
    "Score yourself honestly, revisit the lessons behind your misses, and retake in a week."
  ]
});
