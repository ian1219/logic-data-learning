LDL.registerLesson({
  id: "11",
  title: "Big-O Complexity",
  lang: "js",
  minutes: 75,
  goal: "Predict how your code slows down as the data grows - and turn slow O(n²) or exponential solutions into fast O(n) ones. This is the question behind every \"can you do better?\" in an interview.",

  analogy: `
<p>You need a file from an office with 1,000 lockers. <strong>Option A:</strong> open every locker until you find it - with
twice as many lockers, it takes twice as long. <strong>Option B:</strong> look it up in the index at the front desk - it
takes the same time whether there are 1,000 lockers or 1,000,000.</p>
<p>Now imagine a party where <strong>everyone shakes hands with everyone</strong>. 10 guests make 45 handshakes; 1,000 guests make
almost half a million. That is the difference between O(n), O(1) and O(n&sup2;). Big-O is simply a way to describe
<strong>how the work grows</strong> when the input grows - not how many seconds it takes on your laptop today.</p>`,

  objectives: [
    "Explain what Big-O measures and why we drop constants and smaller terms",
    "Recognise O(1), O(log n), O(n), O(n log n), O(n&sup2;) and O(2<sup>n</sup>) from the shape of the code",
    "Count loops - including <strong>hidden loops</strong> like <code>includes</code> - to find the Big-O of a snippet",
    "Describe <strong>space complexity</strong>, amortized cost and best / average / worst case",
    "Optimise O(n&sup2;) code to O(n) with Sets, Maps, running values and prefix sums"
  ],

  realWorld: `
<ul>
  <li><strong>"The report was fine last year, now it times out":</strong> an O(n&sup2;) loop that was OK at 1,000 rows explodes at 100,000.</li>
  <li><strong>Code reviews:</strong> "this <code>includes</code> inside a <code>for</code> is O(n&sup2;) - use a <code>Set</code>" is one of the most common review comments.</li>
  <li><strong>Databases:</strong> a query without an index scans every row (O(n)); with an index it is a tree lookup (O(log n)).</li>
  <li><strong>Spreadsheets:</strong> thousands of <code>VLOOKUP</code>s over a huge sheet are slow for the same reason - each one is a linear search.</li>
  <li><strong>Interviews and exams:</strong> "what is the time complexity?" and "can you make it faster?" follow almost every coding question.</li>
</ul>`,

  sections: [
    {
      title: "What Big-O measures",
      html: `
<p><strong>What:</strong> Big-O describes how the <strong>number of steps</strong> grows as the input size <code>n</code> grows.
<code>n</code> is usually the length of the array or string.</p>
<p><strong>Why:</strong> seconds depend on your computer; steps do not. Big-O lets you compare two solutions on paper,
before you run anything.</p>
<pre><code class="language-javascript">function total(prices) {
  let sum = 0;                    // 1 step
  for (const p of prices) {       // runs n times
    sum += p;                     //   1 step each time
  }
  return sum;                     // 1 step
}
// steps = n + 2  -&gt;  O(n): "grows in step with n"</code></pre>
<table>
  <tr><th>n (prices)</th><th>steps</th></tr>
  <tr><td>10</td><td>12</td></tr>
  <tr><td>1,000</td><td>1,002</td></tr>
  <tr><td>1,000,000</td><td>1,000,002</td></tr>
</table>
<div class="callout key"><p>Big-O asks one question: <strong>if the data gets 10 times bigger, how much more work is it?</strong> O(n): 10&times;. O(n&sup2;): 100&times;. O(log n): just a few more steps. O(1): no more.</p></div>`
    },
    {
      title: "The simplification rules",
      html: `
<p>We only care about the <strong>shape</strong> of the growth for big n, so we simplify:</p>
<table>
  <tr><th>Rule</th><th>Example</th><th>Result</th></tr>
  <tr><td><strong>Drop constants</strong></td><td><code>3n + 5</code> steps</td><td>O(n)</td></tr>
  <tr><td><strong>Keep only the biggest term</strong></td><td><code>n&sup2; + n + 100</code></td><td>O(n&sup2;)</td></tr>
  <tr><td><strong>Loops one after another add</strong></td><td>loop over n, then loop over n</td><td>O(n + n) = O(n)</td></tr>
  <tr><td><strong>Loops inside loops multiply</strong></td><td>loop over n, inside it loop over n</td><td>O(n &times; n) = O(n&sup2;)</td></tr>
  <tr><td><strong>Different inputs keep different letters</strong></td><td>loop over <code>a</code>, then over <code>b</code></td><td>O(a + b)</td></tr>
</table>
<div class="callout tip"><p>Why drop the small terms? At n = 1,000,000, <code>n&sup2;</code> is 10<sup>12</sup> while <code>n</code> is only 10<sup>6</sup> - the smaller term is a rounding error.</p></div>`
    },
    {
      title: "The common classes (memorise this table)",
      html: `
<table>
  <tr><th>Big-O</th><th>Name</th><th>Typical code</th><th>Operations for n = 1,000,000</th><th>Time at ~10<sup>8</sup> ops/s</th></tr>
  <tr><td>O(1)</td><td>constant</td><td><code>arr[i]</code>, <code>set.has(x)</code>, <code>map.get(k)</code>, <code>push</code></td><td>1</td><td>instant</td></tr>
  <tr><td>O(log n)</td><td>logarithmic</td><td>binary search, "halve it each step"</td><td>~20</td><td>instant</td></tr>
  <tr><td>O(n)</td><td>linear</td><td>one loop over the data</td><td>1,000,000</td><td>~0.01 s</td></tr>
  <tr><td>O(n log n)</td><td>linearithmic</td><td>good sorting (<code>arr.sort</code>, merge sort)</td><td>~20,000,000</td><td>~0.2 s</td></tr>
  <tr><td>O(n&sup2;)</td><td>quadratic</td><td>loop inside a loop, every pair</td><td>1,000,000,000,000</td><td>~3 hours</td></tr>
  <tr><td>O(2<sup>n</sup>)</td><td>exponential</td><td>every subset, naive recursive Fibonacci</td><td>a number with 301,030 digits</td><td>never (n = 60 is already centuries)</td></tr>
</table>
<p>How they grow side by side:</p>
<pre>
n          log n     n log n        n^2               2^n
10         3         33             100               1,024
100        7         664            10,000            1.3 x 10^30
1,000      10        9,966          1,000,000         way too big
1,000,000  20        ~20,000,000    10^12             way too big
</pre>
<div class="callout analogy"><p>O(log n) is like looking up a word in a dictionary, O(n) is reading the whole book, O(n&sup2;) is comparing every page with every other page.</p></div>`
    },
    {
      title: "How to count loops",
      html: `
<table>
  <tr><th>Code shape</th><th>Big-O</th><th>Why</th></tr>
  <tr><td>no loop, fixed number of steps</td><td>O(1)</td><td>same work for any n</td></tr>
  <tr><td><code>for (let i = 0; i &lt; n; i++)</code></td><td>O(n)</td><td>n iterations</td></tr>
  <tr><td>two loops one <em>after</em> the other</td><td>O(n)</td><td>n + n = 2n &rarr; drop the 2</td></tr>
  <tr><td>a loop <em>inside</em> a loop, both to n</td><td>O(n&sup2;)</td><td>n &times; n</td></tr>
  <tr><td>inner loop starts at <code>j = i + 1</code></td><td>O(n&sup2;)</td><td>n(n-1)/2 is still about n&sup2;/2</td></tr>
  <tr><td><code>while (n &gt; 1) n = Math.floor(n / 2)</code></td><td>O(log n)</td><td>halving: 1,000,000 &rarr; 1 in 20 steps</td></tr>
  <tr><td><code>for (let i = 1; i &lt; n; i *= 2)</code></td><td>O(log n)</td><td>doubling up to n = halving down from n</td></tr>
  <tr><td>a loop to n with a halving loop inside</td><td>O(n log n)</td><td>n &times; log n</td></tr>
  <tr><td>a function that calls itself <strong>twice</strong> with n - 1</td><td>O(2<sup>n</sup>)</td><td>the call tree doubles each level</td></tr>
</table>
<div class="callout warn"><p><strong>Hidden loops count too!</strong> <code>arr.includes(x)</code>, <code>indexOf</code>, <code>find</code>, <code>filter</code>,
<code>slice</code>, <code>[...arr]</code>, <code>arr.shift()</code> and <code>splice</code> all walk the array: O(n) each.
An <code>includes</code> inside a <code>for</code> loop is O(n&sup2;).</p></div>
<pre><code class="language-javascript">// Looks like one loop, is actually two nested loops:
for (const id of orderIds) {
  if (cancelledIds.includes(id)) count++;   // includes = a loop!
}</code></pre>`
    },
    {
      title: "Space complexity: memory counts too",
      html: `
<p><strong>Space complexity</strong> is the <strong>extra memory</strong> an algorithm needs on top of its input.</p>
<table>
  <tr><th>Code</th><th>Extra space</th></tr>
  <tr><td>a few counters or pointers (<code>let i, sum, best</code>)</td><td>O(1)</td></tr>
  <tr><td>a copy of the array, or a <code>Set</code> / <code>Map</code> of its items</td><td>O(n)</td></tr>
  <tr><td>an n &times; n table (e.g. distances between every pair of cities)</td><td>O(n&sup2;)</td></tr>
  <tr><td>recursion d calls deep</td><td>O(d) for the call stack</td></tr>
</table>
<p>The classic trade-off is <strong>spend memory to save time</strong>:</p>
<pre><code class="language-javascript">// O(n^2) time, O(1) space
for (let i = 0; i &lt; a.length; i++)
  for (let j = i + 1; j &lt; a.length; j++)
    if (a[i] === a[j]) return true;

// O(n) time, O(n) space - a Set remembers what we've seen
const seen = new Set();
for (const x of a) { if (seen.has(x)) return true; seen.add(x); }</code></pre>
<div class="callout work"><p>Memory is usually cheap and time is usually precious - but not always. On a phone, in a database or with billions of rows, O(n) extra memory can matter. Say the trade-off out loud in interviews.</p></div>`
    },
    {
      title: "Best, average, worst - and \"amortized\"",
      html: `
<p>The same algorithm can be fast or slow depending on the input:</p>
<table>
  <tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th></tr>
  <tr><td>Linear search</td><td>O(1) (first item)</td><td>O(n)</td><td>O(n) (missing)</td></tr>
  <tr><td>Binary search</td><td>O(1) (middle item)</td><td>O(log n)</td><td>O(log n)</td></tr>
  <tr><td>Insertion sort</td><td>O(n) (already sorted)</td><td>O(n&sup2;)</td><td>O(n&sup2;) (reversed)</td></tr>
  <tr><td>Quick sort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n&sup2;) (bad pivots)</td></tr>
  <tr><td><code>Map</code> / <code>Set</code> lookup</td><td>O(1)</td><td>O(1)</td><td>O(n) (rare collisions)</td></tr>
</table>
<p>When people say "Big-O" without more detail, they usually mean the <strong>worst case</strong>.</p>
<p><strong>Amortized O(1):</strong> an array keeps some spare room. When it is full, <code>push</code> allocates a block about twice as big and copies
everything (O(n) - expensive). But because the size doubles, that happens rarely: n pushes cause fewer than 2n copies in total.
Spread over all pushes, each one costs O(1) <em>on average</em>.</p>
<div class="callout analogy"><p>Like moving to a bigger flat whenever yours is full: moving day is painful, but if each new flat is twice as big, you move so rarely that the cost per year is small.</p></div>`
    },
    {
      title: "The optimisation toolbox: O(n²) to O(n)",
      html: `
<p>Most slow solutions repeat the same work inside a loop. Find the repeated work and remember it instead:</p>
<table>
  <tr><th>Slow pattern</th><th>Fast replacement</th><th>Exercise</th></tr>
  <tr><td>"for each item, scan the rest for a match"</td><td>remember what you've seen in a <code>Set</code> / <code>Map</code></td><td>containsDuplicate, pairSumExists</td></tr>
  <tr><td>"for each day, look back for the minimum"</td><td>keep a <strong>running</strong> minimum</td><td>maxProfit</td></tr>
  <tr><td>"for each query, add up a range"</td><td><strong>prefix sums</strong> built once</td><td>rangeSums</td></tr>
  <tr><td>recomputing the same recursive calls</td><td>a bottom-up loop or memoization</td><td>fibFast</td></tr>
  <tr><td>looping to add 1..n</td><td>a math formula</td><td>sumToN, missingNumber</td></tr>
  <tr><td>counting every candidate</td><td>a clever invariant (Boyer-Moore voting)</td><td>majorityElement</td></tr>
</table>
<pre><code class="language-javascript">// Before: O(n^2) - for each day, scan all earlier days
// After:  O(n)   - carry the answer forward
let minSoFar = Infinity, best = 0;
for (const price of prices) {
  minSoFar = Math.min(minSoFar, price);
  best = Math.max(best, price - minSoFar);
}</code></pre>
<div class="callout tip"><p>Ask yourself: <em>"What is my inner loop searching for? Could I have remembered it from earlier?"</em> That one question solves most \"make it faster\" problems.</p></div>`
    },
    {
      title: "How to spot it in an exam",
      html: `
<table>
  <tr><th>You see...</th><th>Answer</th></tr>
  <tr><td>no loop, no recursion</td><td>O(1)</td></tr>
  <tr><td>the problem is cut in half each step</td><td>O(log n)</td></tr>
  <tr><td>one pass (or a fixed number of passes) over the data</td><td>O(n)</td></tr>
  <tr><td>sorting, or "for each item, do a log n thing"</td><td>O(n log n)</td></tr>
  <tr><td>every pair of items is compared</td><td>O(n&sup2;)</td></tr>
  <tr><td>three nested loops over the data</td><td>O(n&sup3;)</td></tr>
  <tr><td>every subset / combination is tried</td><td>O(2<sup>n</sup>)</td></tr>
  <tr><td>every ordering (permutation) is tried</td><td>O(n!)</td></tr>
</table>
<p><strong>Quick recipe:</strong></p>
<ol>
  <li>Find the loops (including hidden ones like <code>includes</code> and <code>sort</code>).</li>
  <li>Nested? Multiply. One after another? Add.</li>
  <li>Keep the biggest term, drop the constants.</li>
</ol>
<div class="callout note"><p>Input size limits in exam problems are a hint: n &le; 20 often allows O(2<sup>n</sup>), n &le; 5,000 allows O(n&sup2;), and n up to 10<sup>5</sup>-10<sup>6</sup> needs O(n) or O(n log n).</p></div>`
    }
  ],

  examples: [
    {
      title: "Count the steps for growing n",
      code: `for (const n of [10, 100, 1000]) {
  let logSteps = 0, linSteps = 0, quadSteps = 0;

  for (let m = n; m > 1; m = Math.floor(m / 2)) logSteps++;   // O(log n)
  for (let i = 0; i < n; i++) linSteps++;                        // O(n)
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) quadSteps++;                     // O(n^2)

  console.log("n=" + n + "  log n: " + logSteps + "  n: " + linSteps + "  n^2: " + quadSteps);
}`,
      explain: `
<table>
  <tr><th>n</th><th>log n</th><th>n</th><th>n&sup2;</th></tr>
  <tr><td>10</td><td>3</td><td>10</td><td>100</td></tr>
  <tr><td>100</td><td>6</td><td>100</td><td>10,000</td></tr>
  <tr><td>1000</td><td>9</td><td>1,000</td><td>1,000,000</td></tr>
</table>
<p>Each time n grows 10&times;, the n&sup2; column grows <strong>100&times;</strong>, while log n adds just ~3 steps.
<strong>Try it:</strong> add 10000 to the list - the quadratic loop alone does 100 million steps.</p>`
    },
    {
      title: "Party handshakes: why every pair is O(n²)",
      code: `function handshakes(guests) {
  let count = 0;
  for (let i = 0; i < guests; i++) {
    for (let j = i + 1; j < guests; j++) {
      count++;          // guest i shakes hands with guest j
    }
  }
  return count;
}

for (const n of [5, 10, 100, 1000]) {
  console.log(n + " guests -> " + handshakes(n) + " handshakes (formula n(n-1)/2 = " + n * (n - 1) / 2 + ")");
}`,
      explain: `
<ol>
  <li>The inner loop starts at <code>i + 1</code> so each pair is counted once - it still does about n&sup2;/2 steps.</li>
  <li>Dropping the constant 1/2 gives <strong>O(n&sup2;)</strong>.</li>
  <li>Notice the formula gives the same answer in <strong>one</strong> step - O(1). Maths beats loops!</li>
  <li><strong>Try it:</strong> how many handshakes for 10,000 guests? (About 50 million.)</li>
</ol>`
    },
    {
      title: "Time it: O(n²) vs O(n) duplicate check",
      code: `function hasDupSlow(a) {               // compare every pair: O(n^2)
  for (let i = 0; i < a.length; i++)
    for (let j = i + 1; j < a.length; j++)
      if (a[i] === a[j]) return true;
  return false;
}
function hasDupFast(a) {               // remember what we've seen: O(n)
  const seen = new Set();
  for (const x of a) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}

for (const n of [1000, 2000, 4000]) {
  const ids = Array.from({ length: n }, (_, i) => 100000 + i);   // unique IDs = worst case
  let t = performance.now(); hasDupSlow(ids); const slow = performance.now() - t;
  t = performance.now(); hasDupFast(ids); const fast = performance.now() - t;
  console.log("n=" + n + "  slow: " + slow.toFixed(2) + " ms   fast: " + fast.toFixed(2) + " ms");
}`,
      explain: `
<ol>
  <li>We use unique IDs so neither function can stop early - the worst case.</li>
  <li>Doubling n roughly <strong>quadruples</strong> the slow time but only <strong>doubles</strong> the fast time (tiny timings are noisy, so look at the trend).</li>
  <li><strong>Try it:</strong> add 8000 to the list and see the slow column jump again.</li>
</ol>`
    },
    {
      title: "Halving: how many times until 1?",
      code: `for (const n of [8, 1000, 1000000, 1000000000]) {
  let m = n, steps = 0;
  while (m > 1) {
    m = Math.floor(m / 2);   // throw away half
    steps++;
  }
  console.log(n + " -> 1 in " + steps + " halvings");
}`,
      explain: `
<table>
  <tr><th>n</th><th>halvings</th></tr>
  <tr><td>8</td><td>3 (8 &rarr; 4 &rarr; 2 &rarr; 1)</td></tr>
  <tr><td>1,000,000</td><td>19</td></tr>
  <tr><td>1,000,000,000</td><td>29</td></tr>
</table>
<p>A <strong>billion</strong> items need under 30 halvings. That is why binary search and database indexes (O(log n)) feel instant.</p>`
    },
    {
      title: "Exponential vs linear Fibonacci: count the calls",
      code: `let calls = 0;
function fibSlow(n) {
  calls++;
  return n < 2 ? n : fibSlow(n - 1) + fibSlow(n - 2);   // two calls each time
}
function fibFast(n) {
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) [a, b] = [b, a + b];        // one loop
  return a;
}

for (const n of [10, 20, 25]) {
  calls = 0;
  const value = fibSlow(n);
  console.log("fib(" + n + ") = " + value + ": slow made " + calls + " calls, fast made " + n + " loop steps");
}
console.log("fib(78) instantly:", fibFast(78));`,
      explain: `
<ol>
  <li><code>fibSlow</code> calls itself twice, and recomputes the same values again and again: fib(25) takes about 240,000 calls.</li>
  <li>Each +5 on n multiplies the calls by about 11 - that is exponential growth.</li>
  <li><code>fibFast</code> keeps just the last two numbers: 25 steps for fib(25), O(n).</li>
  <li><strong>Try it:</strong> run <code>fibSlow(35)</code> and feel the wait (about 30 million calls).</li>
</ol>`
    },
    {
      title: "The hidden loop: includes() vs Set.has()",
      code: `const n = 10000;
const allOrders = Array.from({ length: n }, (_, i) => 500000 + i);
const shipped = allOrders.filter(id => id % 3 === 0);

let t = performance.now();
let late = 0;
for (const id of allOrders) if (!shipped.includes(id)) late++;     // includes = loop inside loop
console.log("includes in a loop: " + (performance.now() - t).toFixed(1) + " ms, late = " + late);

t = performance.now();
const shippedSet = new Set(shipped);                                 // build once: O(n)
late = 0;
for (const id of allOrders) if (!shippedSet.has(id)) late++;       // O(1) lookup
console.log("Set.has in a loop:  " + (performance.now() - t).toFixed(1) + " ms, late = " + late);`,
      explain: `
<ol>
  <li>Same answer both times - only the speed differs.</li>
  <li><code>shipped.includes(id)</code> scans up to 3,333 items for each of 10,000 orders: ~30 million checks, O(n&sup2;).</li>
  <li>The <code>Set</code> costs one pass to build, then each lookup is O(1): O(n) total.</li>
  <li><strong>Try it:</strong> double <code>n</code> - the first time roughly quadruples, the second roughly doubles.</li>
</ol>`
    },
    {
      title: "Amortized push: how often does an array really grow?",
      code: `// Simulate a dynamic array that doubles its capacity when full
let capacity = 1, size = 0, copies = 0, resizes = 0;
const n = 1000000;

for (let i = 0; i < n; i++) {
  if (size === capacity) {      // full: allocate double, copy everything
    copies += size;
    capacity *= 2;
    resizes++;
  }
  size++;
}
console.log(n + " pushes caused " + resizes + " resizes and " + copies + " copies");
console.log("Average copies per push: " + (copies / n).toFixed(2) + " -> amortized O(1)");`,
      explain: `
<ol>
  <li>Only 20 resizes for a million pushes, because capacity doubles each time.</li>
  <li>Total copies (1 + 2 + 4 + ... ) stay below 2n, so the average cost per push is about 1 - constant.</li>
  <li><strong>Try it:</strong> change <code>capacity *= 2</code> to <code>capacity += 10</code>. Copies explode to billions: growing by a fixed amount makes push O(n).</li>
</ol>`
    },
    {
      title: "Prefix sums: answer many range questions fast (daily sales)",
      code: `const dailySales = [120, 80, 150, 90, 200, 170, 60];   // Mon..Sun

// Build once: prefix[i] = total of the first i days
const prefix = [0];
for (const s of dailySales) prefix.push(prefix[prefix.length - 1] + s);
console.log("prefix:", prefix.join(", "));

// Each question is now ONE subtraction
function salesBetween(from, to) {          // inclusive day indexes
  return prefix[to + 1] - prefix[from];
}
console.log("Mon-Wed:", salesBetween(0, 2));
console.log("Wed-Fri:", salesBetween(2, 4));
console.log("Whole week:", salesBetween(0, 6));`,
      explain: `
<table>
  <tr><th>Question</th><th>Calculation</th><th>Answer</th></tr>
  <tr><td>Mon-Wed (0..2)</td><td>prefix[3] - prefix[0] = 350 - 0</td><td>350</td></tr>
  <tr><td>Wed-Fri (2..4)</td><td>prefix[5] - prefix[2] = 640 - 200</td><td>440</td></tr>
</table>
<p>Without prefix sums, each question loops over its range: O(n) per query. With them: O(n) once, then <strong>O(1)</strong> per query.
<strong>Try it:</strong> ask for Thu-Sun.</p>`
    },
    {
      title: "Before and after: best stock profit",
      code: `const prices = [310, 295, 302, 280, 290, 335, 320, 300];

// Before: try every buy day with every later sell day - O(n^2)
let best = 0, checks = 0;
for (let i = 0; i < prices.length; i++)
  for (let j = i + 1; j < prices.length; j++) {
    checks++;
    best = Math.max(best, prices[j] - prices[i]);
  }
console.log("slow: profit " + best + " after " + checks + " checks");

// After: one pass, remembering the cheapest price so far - O(n)
let minSoFar = Infinity, best2 = 0, steps = 0;
for (const p of prices) {
  steps++;
  minSoFar = Math.min(minSoFar, p);
  best2 = Math.max(best2, p - minSoFar);
}
console.log("fast: profit " + best2 + " after " + steps + " steps");`,
      explain: `
<ol>
  <li>Both find the same answer: buy at 280, sell at 335, profit 55.</li>
  <li>The slow version does 28 checks for 8 days (n(n-1)/2); for a year of minute-by-minute prices it would do ~10<sup>10</sup>.</li>
  <li>The fast version asks "what is the best I could do selling <em>today</em>?" - it only needs the cheapest earlier price, which it carries forward.</li>
</ol>`
    }
  ],

  pitfalls: [
    "<code>includes</code>, <code>indexOf</code>, <code>find</code>, <code>filter</code>, <code>slice</code>, <code>shift</code>, <code>splice</code> and <code>[...arr]</code> are <strong>O(n)</strong>. Inside a loop they make the whole thing O(n&sup2;).",
    "Two loops one <em>after</em> another are O(n), not O(n&sup2;). Only <strong>nesting</strong> multiplies.",
    "O(n + m) is not the same as O(n) when the two inputs can have very different sizes - keep both letters.",
    "Big-O hides constants: for tiny inputs an O(n&sup2;) solution can be faster than an O(n log n) one. It describes growth, not exact speed.",
    "<code>sort()</code> is O(n log n), not O(n). \"Sort, then one pass\" is O(n log n) overall.",
    "Recursion uses memory: d nested calls need O(d) stack space, even if you never create an array.",
    "Numbers above <code>Number.MAX_SAFE_INTEGER</code> (about 9 &times; 10<sup>15</sup>) lose precision - fib(79) and beyond need <code>BigInt</code>."
  ],

  quiz: [
    {
      q: "What is the time complexity of this snippet?",
      code: `for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    total += grid[i][j];
  }
}`,
      options: ["O(n)", "O(n log n)", "O(n&sup2;)", "O(2<sup>n</sup>)"],
      answer: 2,
      explain: "<p>The inner loop runs n times for <em>each</em> of the n outer steps: n &times; n = n&sup2;. Nested loops over the same data multiply.</p>"
    },
    {
      q: "And this one? (Two loops, one after the other.)",
      code: `for (const p of prices) sum += p;
for (const p of prices) if (p > max) max = p;`,
      options: ["O(1)", "O(n)", "O(n&sup2;)", "O(2n&sup2;)"],
      answer: 1,
      explain: "<p>Sequential loops <strong>add</strong>: n + n = 2n, and we drop the constant 2. Still O(n).</p>"
    },
    {
      q: "What does this print?",
      code: `let n = 1000, steps = 0;
while (n > 1) {
  n = Math.floor(n / 2);
  steps++;
}
console.log(steps);`,
      options: ["9", "10", "500", "1000"],
      answer: 0,
      output: "9",
      explain: "<p>1000 &rarr; 500 &rarr; 250 &rarr; 125 &rarr; 62 &rarr; 31 &rarr; 15 &rarr; 7 &rarr; 3 &rarr; 1: <strong>9</strong> halvings. Halving loops are O(log n) - log&#8322;(1000) is just under 10.</p>"
    },
    {
      q: "What does this print?",
      code: `let count = 0;
const n = 5;
for (let i = 0; i < n; i++)
  for (let j = i + 1; j < n; j++)
    count++;
console.log(count);`,
      options: ["5", "10", "20", "25"],
      answer: 1,
      output: "10",
      explain: "<p>The inner loop runs 4 + 3 + 2 + 1 + 0 = <strong>10</strong> times, which is n(n-1)/2. Even with the shortcut, that is still O(n&sup2;).</p>"
    },
    {
      q: "What is the Big-O of this code, where <code>blocked</code> is an array of size n?",
      code: `for (const user of users) {           // n users
  if (blocked.includes(user)) hide(user);
}`,
      options: ["O(n)", "O(n log n)", "O(n&sup2;)", "O(1)"],
      answer: 2,
      explain: "<p><code>includes</code> is a hidden loop over <code>blocked</code>, so it is a loop inside a loop: O(n&sup2;). Turning <code>blocked</code> into a <code>Set</code> makes each check O(1) and the whole thing O(n).</p>"
    },
    {
      q: "Simplify <code>O(3n&sup2; + 50n + 1000)</code>.",
      options: ["O(3n&sup2;)", "O(n&sup2; + n)", "O(n&sup2;)", "O(1000)"],
      answer: 2,
      explain: "<p>Keep only the biggest term (<code>3n&sup2;</code>) and drop its constant: <strong>O(n&sup2;)</strong>.</p>"
    },
    {
      q: "Your duplicate check compares every pair and times out on 200,000 rows. What is the standard fix?",
      options: [
        "Run the same loops on a faster computer",
        "Store values you have seen in a <code>Set</code> and check it as you go",
        "Use <code>indexOf</code> instead of the inner loop",
        "Loop backwards instead of forwards"
      ],
      answer: 1,
      explain: "<p>A <code>Set</code> answers \"seen before?\" in O(1), so one pass is enough: O(n) time for O(n) memory. <code>indexOf</code> is just the inner loop in disguise, and a faster machine can't save O(n&sup2;) at this size.</p>"
    }
  ],

  interview: [
    { q: "What does Big-O notation describe?",
      a: "<p>How an algorithm's running time (or memory) <strong>grows</strong> as the input size n grows, ignoring constants and smaller terms. It usually describes the worst case, and lets you compare solutions without running them.</p>" },
    { q: "What is the time complexity of a loop that doubles <code>i</code> until it reaches n?",
      a: "<p>O(log n). The number of doublings needed to reach n is log&#8322;(n) - about 20 for one million.</p>" },
    { q: "Your solution is O(n&sup2;). How would you make it faster?",
      a: "<p>Find the repeated work - usually the inner loop is a <em>search</em>. Replace it with an O(1) lookup in a <code>Set</code>/<code>Map</code>, a running value, a precomputed prefix sum, or two pointers on sorted data. That typically gives O(n) or O(n log n), paying O(n) extra memory.</p>" },
    { q: "Why is <code>arr.push</code> called \"amortized O(1)\"?",
      a: "<p>Occasionally the array is full and must be copied into a block about twice as big - an O(n) step. Because the capacity doubles, the total copy work for n pushes is under 2n, so the average cost per push is constant.</p>" },
    { q: "What is the complexity of naive recursive Fibonacci, and how do you fix it?",
      a: "<p>Exponential, O(2<sup>n</sup>) (more precisely about 1.6<sup>n</sup>), because each call makes two more and the same values are recomputed many times. Memoize (O(n) time and space) or loop with two variables (O(n) time, O(1) space).</p>" },
    { q: "Is O(2n) different from O(n)? What about O(n + n&sup2;)?",
      a: "<p>O(2n) = O(n), because constants are dropped. O(n + n&sup2;) = O(n&sup2;), because only the biggest term matters for large n.</p>" }
  ],

  exercises: [
    {
      id: "sum-to-n",
      title: "sumToN in O(1) (warm-up)",
      difficulty: "easy",
      prompt: `<p>Return <code>1 + 2 + ... + n</code> for a whole number <code>n &gt;= 0</code>. The obvious version loops:</p>
<pre><code class="language-javascript">// O(n): 100 million additions for n = 100,000,000
let total = 0;
for (let i = 1; i &lt;= n; i++) total += i;
return total;</code></pre>
<p>Write an <strong>O(1)</strong> version - no loop at all.</p>
<p><code>sumToN(4) &rarr; 10</code> &nbsp; <code>sumToN(100) &rarr; 5050</code> &nbsp; <code>sumToN(0) &rarr; 0</code></p>`,
      starter: `function sumToN(n) {
  // your code here
}`,
      solution: `function sumToN(n) {
  // Pair the numbers: 1 + n, 2 + (n - 1), ... each pair adds to n + 1,
  // and there are n / 2 pairs. One calculation, whatever n is: O(1).
  return (n * (n + 1)) / 2;
}`,
      hint: "Write 1..n forwards and backwards under each other: every column adds up to n + 1, and there are n columns - that is twice the answer.",
      forbid: [{ pattern: "\\b(for|while)\\b|\\.reduce\\(", message: "No loops (or reduce) - use the formula." }],
      tests: [
        { expr: "sumToN(4)", expected: 10 },
        { expr: "sumToN(100)", expected: 5050 },
        { expr: "sumToN(1)", expected: 1 },
        { expr: "sumToN(0)", expected: 0, label: "n = 0" },
        {
          label: "20 calls with n near 100,000,000 under 200 ms",
          code: "let ok = true; for (let k = 0; k < 20; k++) { const m = 100000000 - k; if (sumToN(m) !== m * (m + 1) / 2) ok = false; } return ok;",
          expected: true, maxMs: 200
        }
      ]
    },
    {
      id: "classify",
      title: "classify the snippets",
      difficulty: "easy",
      prompt: `<p>Return an object mapping each snippet name to its time complexity. Use <strong>exactly</strong> one of these strings:
<code>"O(1)"</code>, <code>"O(log n)"</code>, <code>"O(n)"</code>, <code>"O(n log n)"</code>, <code>"O(n^2)"</code>, <code>"O(2^n)"</code>.
<code>n</code> is <code>arr.length</code> (or the number passed in).</p>
<pre><code class="language-javascript">// constant
return arr[0] + arr[arr.length - 1];

// singleLoop
let s = 0;
for (let i = 0; i &lt; n; i++) s += arr[i];

// twoLoops
for (let i = 0; i &lt; n; i++) total += arr[i];
for (let i = 0; i &lt; n; i++) if (arr[i] &gt; max) max = arr[i];

// nestedLoop
for (let i = 0; i &lt; n; i++)
  for (let j = 0; j &lt; n; j++) count += arr[i] * arr[j];

// triangleLoop
for (let i = 0; i &lt; n; i++)
  for (let j = i + 1; j &lt; n; j++) if (arr[i] === arr[j]) dup = true;

// halvingLoop
while (n &gt; 1) { n = Math.floor(n / 2); steps++; }

// loopThenSort
for (let i = 0; i &lt; n; i++) arr[i] = arr[i] * 2;
arr.sort((a, b) =&gt; a - b);

// loopWithDoubling
for (let i = 0; i &lt; n; i++)
  for (let j = 1; j &lt; n; j *= 2) work++;

// allSubsets
function f(n) { if (n === 0) return 1; return f(n - 1) + f(n - 1); }</code></pre>
<p>Example of the format: <code>classify().singleLoop &rarr; "O(n)"</code>. Spelling and spaces must match exactly (<code>"O(n log n)"</code>, not <code>"O(nlogn)"</code>).</p>`,
      starter: `function classify() {
  // your code here - replace every "?" with one of the allowed strings
  return {
    constant: "?",
    singleLoop: "?",
    twoLoops: "?",
    nestedLoop: "?",
    triangleLoop: "?",
    halvingLoop: "?",
    loopThenSort: "?",
    loopWithDoubling: "?",
    allSubsets: "?"
  };
}`,
      solution: `function classify() {
  return {
    constant: "O(1)",            // fixed number of steps
    singleLoop: "O(n)",          // one pass
    twoLoops: "O(n)",            // n + n = 2n -> drop the constant
    nestedLoop: "O(n^2)",        // n * n
    triangleLoop: "O(n^2)",      // n(n-1)/2 is still quadratic
    halvingLoop: "O(log n)",     // halving reaches 1 after log2(n) steps
    loopThenSort: "O(n log n)",  // n + n log n -> keep the bigger term
    loopWithDoubling: "O(n log n)", // n outer steps * log n inner steps
    allSubsets: "O(2^n)"         // two recursive calls per level
  };
}`,
      hint: "Go snippet by snippet: no loop = O(1); one loop = O(n); loops one after another ADD (keep the biggest); loops inside loops MULTIPLY; halving or doubling a counter = log n; a sort is n log n; a function that calls itself twice with n - 1 = 2^n.",
      explanation: "<p>The tricky ones: <code>twoLoops</code> is O(n) because n + n = 2n and constants are dropped. <code>triangleLoop</code> does n(n-1)/2 steps - still quadratic. <code>loopThenSort</code> is n + n log n, and the bigger term wins. <code>loopWithDoubling</code> runs a log n loop n times.</p>",
      tests: [
        { expr: "classify().constant", expected: "O(1)" },
        { expr: "classify().singleLoop", expected: "O(n)" },
        { expr: "classify().twoLoops", expected: "O(n)", label: "twoLoops (sequential loops add, constants drop)" },
        { expr: "classify().nestedLoop", expected: "O(n^2)" },
        { expr: "classify().triangleLoop", expected: "O(n^2)", label: "triangleLoop (j starts at i + 1)" },
        { expr: "classify().halvingLoop", expected: "O(log n)" },
        { expr: "classify().loopThenSort", expected: "O(n log n)" },
        { expr: "classify().loopWithDoubling", expected: "O(n log n)" },
        { expr: "classify().allSubsets", expected: "O(2^n)" }
      ]
    },
    {
      id: "contains-duplicate",
      title: "containsDuplicate in O(n)",
      difficulty: "easy",
      prompt: `<p>Return <code>true</code> if any value appears at least twice. The slow version compares every pair:</p>
<pre><code class="language-javascript">// O(n^2) - too slow for 200,000 items
for (let i = 0; i &lt; nums.length; i++)
  for (let j = i + 1; j &lt; nums.length; j++)
    if (nums[i] === nums[j]) return true;
return false;</code></pre>
<p>Write an <strong>O(n)</strong> version.</p>
<p><code>containsDuplicate([1, 2, 3, 1]) &rarr; true</code> &nbsp; <code>containsDuplicate([1, 2, 3, 4]) &rarr; false</code> &nbsp; <code>containsDuplicate([]) &rarr; false</code></p><p>The tests use 200,000 items with a time limit, so the slow version will not pass.</p>`,
      starter: `function containsDuplicate(nums) {
  // your code here
}`,
      solution: `function containsDuplicate(nums) {
  // Trade memory for time: a Set answers "seen before?" in O(1).
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;  // O(n) time, O(n) space
}`,
      hint: "Create const seen = new Set(). For each x: if seen.has(x) return true, otherwise seen.add(x). After the loop return false. (One-liner alternative: new Set(nums).size !== nums.length.)",
      explanation: "<p>The slow version's inner loop asks \"have I seen this value before?\" by scanning. A <code>Set</code> answers that question in O(1), so one pass is enough: O(n) time, paid for with O(n) memory.</p>",
      tests: [
        { expr: "containsDuplicate([1, 2, 3, 1])", expected: true },
        { expr: "containsDuplicate([1, 2, 3, 4])", expected: false },
        { expr: "containsDuplicate([])", expected: false, label: "empty array" },
        { expr: "containsDuplicate([7])", expected: false, label: "single element" },
        { expr: "containsDuplicate([-1, 0, -1])", expected: true, label: "negatives" },
        {
          label: "200,000 distinct items under 1000 ms",
          code: "const a = Array.from({ length: 200000 }, (_, i) => i * 3 - 100000); return containsDuplicate(a);",
          expected: false, maxMs: 1000
        },
        {
          label: "200,000 items, duplicate at the very end, under 1000 ms",
          code: "const a = Array.from({ length: 200000 }, (_, i) => i); a.push(199999); return containsDuplicate(a);",
          expected: true, maxMs: 1000
        }
      ]
    },
    {
      id: "pair-sum-exists",
      title: "pairSumExists in O(n)",
      difficulty: "easy",
      prompt: `<p>Return <code>true</code> if two <strong>different positions</strong> <code>i ≠ j</code> have <code>nums[i] + nums[j] === target</code>. The array is <strong>not</strong> sorted. Slow version:</p>
<pre><code class="language-javascript">// O(n^2)
for (let i = 0; i &lt; nums.length; i++)
  for (let j = i + 1; j &lt; nums.length; j++)
    if (nums[i] + nums[j] === target) return true;
return false;</code></pre>
<p>Write an <strong>O(n)</strong> version.</p>
<p><code>pairSumExists([2, 7, 11, 15], 9) &rarr; true</code> (2 + 7) &nbsp; <code>pairSumExists([5], 10) &rarr; false</code> (can't reuse 5) &nbsp; <code>pairSumExists([5, 5], 10) &rarr; true</code></p>`,
      starter: `function pairSumExists(nums, target) {
  // your code here
}`,
      solution: `function pairSumExists(nums, target) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(target - x)) return true;  // its partner appeared earlier
    seen.add(x);                            // add AFTER checking: no self-pairing
  }
  return false;  // O(n) time, O(n) space
}`,
      hint: "For each x, the partner you need is target - x. Keep a Set of the values seen EARLIER: if it already has target - x, return true. Only then add x - adding first would let x pair with itself.",
      explanation: "<p>This is the famous \"two sum\" interview question. The trick is to flip the question from \"which pairs add up?\" (every pair: O(n&sup2;)) to \"have I already seen the partner I need?\" (one Set lookup: O(1)).</p>",
      tests: [
        { expr: "pairSumExists([2, 7, 11, 15], 9)", expected: true },
        { expr: "pairSumExists([1, 2, 3], 7)", expected: false },
        { expr: "pairSumExists([], 0)", expected: false, label: "empty array" },
        { expr: "pairSumExists([5], 10)", expected: false, label: "can't use the same element twice" },
        { expr: "pairSumExists([5, 5], 10)", expected: true, label: "duplicates" },
        { expr: "pairSumExists([-3, 4, 1], -2)", expected: true, label: "negatives" },
        {
          label: "200,000 items, no pair, under 1000 ms",
          code: "const a = Array.from({ length: 200000 }, (_, i) => i); return pairSumExists(a, -1);",
          expected: false, maxMs: 1000
        }
      ]
    },
    {
      id: "fib-fast",
      title: "fibFast in O(n)",
      difficulty: "easy",
      prompt: `<p>Return the n-th Fibonacci number (<code>fib(0) = 0, fib(1) = 1</code>) for <code>0 ≤ n ≤ 78</code> (the largest that fits exactly in a JS number). The textbook version is <strong>exponential</strong>:</p>
<pre><code class="language-javascript">// O(2^n) - fib(78) would take thousands of years
function fib(n) { return n &lt; 2 ? n : fib(n - 1) + fib(n - 2); }</code></pre>
<p>Write an <strong>O(n)</strong> version.</p>
<p><code>fibFast(10) &rarr; 55</code> &nbsp; <code>fibFast(50) &rarr; 12586269025</code> &nbsp; <code>fibFast(78) &rarr; 8944394323791464</code></p><p>Note: the naive version will freeze the test runner (it stops after 5 seconds) - that is the point!</p>`,
      starter: `function fibFast(n) {
  // your code here
}`,
      solution: `function fibFast(n) {
  // Bottom-up: only the last two values are ever needed.
  let a = 0, b = 1;               // fib(0), fib(1)
  for (let i = 0; i < n; i++) {
    [a, b] = [b, a + b];
  }
  return a;  // O(n) time, O(1) space
}`,
      hint: "Keep two variables: a = fib(0) = 0 and b = fib(1) = 1. Loop n times, each time moving forward one step: [a, b] = [b, a + b]. At the end, a is fib(n).",
      tests: [
        { expr: "fibFast(0)", expected: 0 },
        { expr: "fibFast(1)", expected: 1 },
        { expr: "fibFast(2)", expected: 1 },
        { expr: "fibFast(10)", expected: 55 },
        { expr: "fibFast(50)", expected: 12586269025, maxMs: 500, label: "fibFast(50) quickly" },
        { expr: "fibFast(78)", expected: 8944394323791464, maxMs: 500, label: "fibFast(78) quickly" }
      ]
    },
    {
      id: "max-profit",
      title: "maxProfit (one pass)",
      difficulty: "medium",
      prompt: `<p><code>prices[i]</code> is a stock price on day <code>i</code>. Buy once, then sell once on a <strong>later</strong> day. Return the maximum profit, or <code>0</code> if no profit is possible. Slow version:</p>
<pre><code class="language-javascript">// O(n^2): try every buy day with every later sell day
let best = 0;
for (let i = 0; i &lt; prices.length; i++)
  for (let j = i + 1; j &lt; prices.length; j++)
    best = Math.max(best, prices[j] - prices[i]);
return best;</code></pre>
<p>Write a <strong>single-pass O(n)</strong> version.</p>
<p><code>maxProfit([7, 1, 5, 3, 6, 4]) &rarr; 5</code> (buy at 1, sell at 6) &nbsp; <code>maxProfit([7, 6, 4, 3, 1]) &rarr; 0</code> (prices only fall) &nbsp; <code>maxProfit([2, 4, 1, 7]) &rarr; 6</code></p>`,
      starter: `function maxProfit(prices) {
  // your code here
}`,
      solution: `function maxProfit(prices) {
  let minSoFar = Infinity, best = 0;
  for (const p of prices) {
    if (p < minSoFar) minSoFar = p;              // cheapest day to buy so far
    else if (p - minSoFar > best) best = p - minSoFar;  // sell today?
  }
  return best;  // O(n) time, O(1) space
}`,
      hint: "Walk through the prices once. Keep minSoFar (the cheapest price seen so far) and best (the best profit so far). For each price: update minSoFar, then check price - minSoFar against best.",
      explanation: "<p>For a sell day, the best buy day is simply the cheapest <em>earlier</em> day - and you can carry that minimum forward instead of searching for it each time. \"Carry a running value\" turns many O(n&sup2;) loops into O(n).</p>",
      tests: [
        { expr: "maxProfit([7, 1, 5, 3, 6, 4])", expected: 5 },
        { expr: "maxProfit([7, 6, 4, 3, 1])", expected: 0, label: "falling prices" },
        { expr: "maxProfit([])", expected: 0, label: "empty array" },
        { expr: "maxProfit([5])", expected: 0, label: "single day" },
        { expr: "maxProfit([2, 4, 1, 7])", expected: 6, label: "new minimum later" },
        { expr: "maxProfit([3, 3, 3])", expected: 0, label: "flat prices" },
        {
          label: "200,000 falling prices under 1000 ms",
          code: "const a = Array.from({ length: 200000 }, (_, i) => 200000 - i); return maxProfit(a);",
          expected: 0, maxMs: 1000
        },
        {
          label: "200,000 rising prices under 1000 ms",
          code: "const a = Array.from({ length: 200000 }, (_, i) => i); return maxProfit(a);",
          expected: 199999, maxMs: 1000
        }
      ]
    },
    {
      id: "missing-number",
      title: "missingNumber",
      difficulty: "medium",
      prompt: `<p><code>nums</code> contains <code>n</code> distinct numbers taken from <code>0, 1, ..., n</code> - exactly one is missing. Return it. Slow version:</p>
<pre><code class="language-javascript">// O(n^2): includes() is itself a loop
for (let x = 0; x &lt;= nums.length; x++)
  if (!nums.includes(x)) return x;</code></pre>
<p>Write an <strong>O(n) time, O(1) extra space</strong> version (no Set needed).</p>
<p><code>missingNumber([3, 0, 1]) &rarr; 2</code> &nbsp; <code>missingNumber([0, 1]) &rarr; 2</code> &nbsp; <code>missingNumber([1]) &rarr; 0</code></p>`,
      starter: `function missingNumber(nums) {
  // your code here
}`,
      solution: `function missingNumber(nums) {
  // Gauss: 0 + 1 + ... + n = n(n + 1) / 2. Whatever is missing from the sum is the answer.
  const n = nums.length;
  let sum = 0;
  for (const x of nums) sum += x;
  return (n * (n + 1)) / 2 - sum;  // O(n) time, O(1) space
  // XOR alternative: xor all indexes 0..n and all values; pairs cancel, the missing one remains.
}`,
      hint: "The numbers 0..n add up to n * (n + 1) / 2, where n = nums.length. Add up the numbers you were given; the difference is the missing one.",
      explanation: "<p>Young Gauss supposedly added 1..100 in seconds by pairing 1+100, 2+99, ... = 50 &times; 101. Here the formula gives the expected total in O(1), and one pass gives the actual total. The XOR trick (<code>x ^ x = 0</code>) works too and can never overflow in languages with fixed-size integers.</p>",
      forbid: [{ pattern: "\\.(includes|indexOf)\\(", message: "includes / indexOf inside a loop is O(n^2) - use the sum formula or XOR." }],
      tests: [
        { expr: "missingNumber([3, 0, 1])", expected: 2 },
        { expr: "missingNumber([0, 1])", expected: 2, label: "missing the last (n)" },
        { expr: "missingNumber([1])", expected: 0, label: "missing zero" },
        { expr: "missingNumber([0])", expected: 1, label: "single element" },
        { expr: "missingNumber([])", expected: 0, label: "empty array: 0 is missing" },
        { expr: "missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1])", expected: 8 },
        {
          label: "200,000 numbers under 1000 ms",
          code: `const a = [];
for (let i = 200000; i >= 0; i--) if (i !== 123456) a.push(i);
return missingNumber(a);`,
          expected: 123456, maxMs: 1000
        }
      ]
    },
    {
      id: "count-pairs-with-diff",
      title: "countPairsWithDiff",
      difficulty: "medium",
      prompt: `<p>Count index pairs <code>i &lt; j</code> with <code>Math.abs(nums[i] - nums[j]) === k</code> (<code>k ≥ 0</code>). Duplicates form separate pairs. Slow version:</p>
<pre><code class="language-javascript">// O(n^2)
let count = 0;
for (let i = 0; i &lt; nums.length; i++)
  for (let j = i + 1; j &lt; nums.length; j++)
    if (Math.abs(nums[i] - nums[j]) === k) count++;
return count;</code></pre>
<p>Write an <strong>O(n)</strong> version. <code>countPairsWithDiff([1, 5, 3, 4, 2], 2) → 3</code></p>
<p><code>countPairsWithDiff([1, 5, 3, 4, 2], 2) &rarr; 3</code> (1-3, 3-5, 2-4) &nbsp; <code>countPairsWithDiff([1, 1, 1, 2], 1) &rarr; 3</code> &nbsp; <code>countPairsWithDiff([1, 1, 1, 2], 0) &rarr; 3</code></p>`,
      starter: `function countPairsWithDiff(nums, k) {
  // your code here
}`,
      solution: `function countPairsWithDiff(nums, k) {
  // For each x, count EARLIER values equal to x - k or x + k (a Map of frequencies).
  const freq = new Map();
  let pairs = 0;
  for (const x of nums) {
    if (k === 0) {
      pairs += freq.get(x) || 0;                         // x - 0 and x + 0 are the same value
    } else {
      pairs += (freq.get(x - k) || 0) + (freq.get(x + k) || 0);
    }
    freq.set(x, (freq.get(x) || 0) + 1);
  }
  return pairs;  // O(n) time, O(n) space
}`,
      hint: "Walk left to right with a Map value -> how many times you've seen it so far. Each new x pairs with every earlier x - k and every earlier x + k, so add their counts. Careful: when k === 0, x - k and x + k are the same value - add its count only once. Then record x in the Map.",
      explanation: "<p>Counting with a Map handles duplicates naturally: if 1 has appeared 3 times, a new 2 forms 3 pairs at once. Each item does two O(1) lookups, so the whole thing is O(n).</p>",
      tests: [
        { expr: "countPairsWithDiff([1, 5, 3, 4, 2], 2)", expected: 3 },
        { expr: "countPairsWithDiff([1, 1, 1, 2], 1)", expected: 3, label: "duplicates" },
        { expr: "countPairsWithDiff([1, 1, 1, 2], 0)", expected: 3, label: "k = 0" },
        { expr: "countPairsWithDiff([], 1)", expected: 0, label: "empty array" },
        { expr: "countPairsWithDiff([4], 0)", expected: 0, label: "single element" },
        { expr: "countPairsWithDiff([-1, 1, -3], 2)", expected: 2, label: "negatives" },
        {
          label: "200,000 consecutive numbers, k = 1, under 1000 ms",
          code: "const a = Array.from({ length: 200000 }, (_, i) => i); return countPairsWithDiff(a, 1);",
          expected: 199999, maxMs: 1000
        },
        {
          label: "200,000 equal numbers, k = 0, under 1000 ms",
          code: "const a = new Array(200000).fill(5); return countPairsWithDiff(a, 0);",
          expected: 19999900000, maxMs: 1000
        }
      ]
    },
    {
      id: "range-sums",
      title: "rangeSums with prefix sums",
      difficulty: "medium",
      prompt: `<p>For each query <code>[l, r]</code> (inclusive indexes) return <code>nums[l] + ... + nums[r]</code>. Slow version:</p>
<pre><code class="language-javascript">// O(n * q): every query re-adds its whole range
return queries.map(([l, r]) =&gt; {
  let s = 0;
  for (let i = l; i &lt;= r; i++) s += nums[i];
  return s;
});</code></pre>
<p>Write an <strong>O(n + q)</strong> version. <code>rangeSums([1, 2, 3, 4, 5], [[0, 4], [1, 3], [2, 2]]) → [15, 9, 3]</code></p>
<p><code>rangeSums([-2, 5, -1, 3], [[0, 3], [0, 0], [2, 3]]) &rarr; [5, -2, 2]</code> &nbsp; <code>rangeSums([1, 2, 3], []) &rarr; []</code></p>`,
      starter: `function rangeSums(nums, queries) {
  // your code here
}`,
      solution: `function rangeSums(nums, queries) {
  // prefix[i] = sum of the first i items, so sum(l..r) = prefix[r + 1] - prefix[l]
  const prefix = [0];
  for (let i = 0; i < nums.length; i++) prefix.push(prefix[i] + nums[i]);
  return queries.map(([l, r]) => prefix[r + 1] - prefix[l]);
  // O(n) to build, O(1) per query
}`,
      hint: "Build prefix once: prefix[0] = 0 and prefix[i + 1] = prefix[i] + nums[i]. The sum from l to r is then prefix[r + 1] - prefix[l]. Use queries.map to answer each one in a single subtraction.",
      explanation: "<p>Prefix sums are the go-to trick for \"many questions about ranges\": sales between two dates, points between two levels, rows between two timestamps. O(n) preparation, then every question costs O(1).</p>",
      tests: [
        { expr: "rangeSums([1, 2, 3, 4, 5], [[0, 4], [1, 3], [2, 2]])", expected: [15, 9, 3] },
        { expr: "rangeSums([1, 2, 3], [])", expected: [], label: "no queries" },
        { expr: "rangeSums([7], [[0, 0]])", expected: [7], label: "single element" },
        { expr: "rangeSums([-2, 5, -1, 3], [[0, 3], [0, 0], [2, 3]])", expected: [5, -2, 2], label: "negatives" },
        { code: "const a = [1, 2, 3]; rangeSums(a, [[0, 2]]); return a;", expected: [1, 2, 3], label: "input is not mutated" },
        {
          label: "200,000 numbers x 200,000 full-range queries under 1000 ms",
          code: `const n = 200000;
const a = new Array(n).fill(1);
const q = Array.from({ length: n }, (_, i) => [i % 10, n - 1]);
const r = rangeSums(a, q);
return r.length === n && r[0] === n && r[9] === n - 9 && r[n - 1] === n - 9;`,
          expected: true, maxMs: 1000
        }
      ]
    },
    {
      id: "majority-element",
      title: "majorityElement (Boyer-Moore)",
      difficulty: "hard",
      prompt: `<p>The array always has a value that appears <strong>more than n / 2</strong> times. Return it in <strong>O(n) time and O(1) extra space</strong> - so no Map, Set or sorting. Slow version:</p>
<pre><code class="language-javascript">// O(n^2): count every candidate
for (const x of nums) {
  let c = 0;
  for (const y of nums) if (y === x) c++;
  if (c &gt; nums.length / 2) return x;
}</code></pre>
<p><code>majorityElement([3, 2, 3]) &rarr; 3</code> &nbsp; <code>majorityElement([2, 2, 1, 1, 1, 2, 2]) &rarr; 2</code> &nbsp; <code>majorityElement([7]) &rarr; 7</code></p>`,
      starter: `function majorityElement(nums) {
  // your code here
}`,
      solution: `function majorityElement(nums) {
  // Boyer-Moore voting: pair off different values; the majority can't be cancelled out.
  let candidate = null, count = 0;
  for (const x of nums) {
    if (count === 0) candidate = x;   // start a new candidate
    count += x === candidate ? 1 : -1;
  }
  return candidate;  // O(n) time, O(1) space
}`,
      hint: "Keep a candidate and a count, starting at count = 0. For each x: if count is 0, make x the candidate. Then add 1 if x equals the candidate, otherwise subtract 1. The candidate left at the end is the answer.",
      explanation: "<p>Think of every non-majority element \"cancelling\" one majority element. Because the majority has more than half of the votes, it always survives the cancelling.</p>",
      forbid: [
        { pattern: "new\\s+(Map|Set|Array)|\\.(sort|toSorted)\\(|\\{\\s*\\}\\s*[;,)]", message: "O(1) extra space: no Map, Set, counting object or sorting. Try Boyer-Moore voting." }
      ],
      tests: [
        { expr: "majorityElement([3, 2, 3])", expected: 3 },
        { expr: "majorityElement([2, 2, 1, 1, 1, 2, 2])", expected: 2 },
        { expr: "majorityElement([7])", expected: 7, label: "single element" },
        { expr: "majorityElement([-1, -1, 5])", expected: -1, label: "negatives" },
        { expr: "majorityElement([1, 9, 9, 1, 9])", expected: 9, label: "majority not first" },
        {
          label: "200,001 items under 1000 ms",
          code: `const a = [];
for (let i = 0; i < 100000; i++) a.push(i, 4);
a.push(4);
return majorityElement(a);`,
          expected: 4, maxMs: 1000
        }
      ]
    },
    {
      id: "product-except-self",
      title: "productExceptSelf (no division)",
      difficulty: "hard",
      prompt: `<p>Return an array where <code>out[i]</code> is the product of every element <strong>except</strong> <code>nums[i]</code>. <strong>Do not use division</strong> (it breaks with zeros anyway). Slow version:</p>
<pre><code class="language-javascript">// O(n^2)
return nums.map((_, i) =&gt; {
  let p = 1;
  for (let j = 0; j &lt; nums.length; j++) if (j !== i) p *= nums[j];
  return p;
});</code></pre>
<p>Write an <strong>O(n)</strong> version. <code>productExceptSelf([1, 2, 3, 4]) → [24, 12, 8, 6]</code></p>
<p><code>productExceptSelf([1, 2, 3, 4]) &rarr; [24, 12, 8, 6]</code> &nbsp; <code>productExceptSelf([-1, 1, 0, -3, 3]) &rarr; [0, 0, 9, 0, 0]</code> &nbsp; <code>productExceptSelf([5, 2]) &rarr; [2, 5]</code></p>`,
      starter: `function productExceptSelf(nums) {
  // your code here
}`,
      solution: `function productExceptSelf(nums) {
  const n = nums.length;
  const out = new Array(n);
  // Pass 1: out[i] = product of everything LEFT of i
  let left = 1;
  for (let i = 0; i < n; i++) {
    out[i] = left;
    left *= nums[i];
  }
  // Pass 2: multiply in the product of everything RIGHT of i
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    out[i] *= right;
    right *= nums[i];
  }
  return out;  // O(n) time, O(1) extra besides the output
}`,
      hint: "out[i] = (product of everything to the LEFT of i) x (product of everything to the RIGHT of i). First pass, left to right: out[i] = running left product, then multiply it by nums[i]. Second pass, right to left: multiply out[i] by a running right product.",
      explanation: "<p>This is the prefix-sum idea with multiplication: prefix products from the left and suffix products from the right. Two passes = O(n), and zeros are handled for free because nothing is ever divided.</p>",
      forbid: [{ pattern: "/|Math\\.pow|\\*\\*\\s*-", message: "No division - use prefix and suffix products." }],
      tests: [
        { expr: "productExceptSelf([1, 2, 3, 4])", expected: [24, 12, 8, 6] },
        { expr: "productExceptSelf([-1, 1, 0, -3, 3])", expected: [0, 0, 9, 0, 0], label: "one zero" },
        { expr: "productExceptSelf([0, 4, 0])", expected: [0, 0, 0], label: "two zeros" },
        { expr: "productExceptSelf([5, 2])", expected: [2, 5], label: "two elements" },
        { expr: "productExceptSelf([-2, -3, 4])", expected: [-12, -8, 6], label: "negatives" },
        { code: "const a = [1, 2, 3]; productExceptSelf(a); return a;", expected: [1, 2, 3], label: "input is not mutated" },
        {
          label: "200,000 items under 1000 ms",
          code: `const a = Array.from({ length: 200000 }, (_, i) => (i % 2 === 0 ? 1 : -1));
const r = productExceptSelf(a);
return r.length === a.length && r.every((v, i) => v === a[i]);`,
          expected: true, maxMs: 1000
        }
      ]
    }
  ],

  takeaways: [
    "Big-O describes how work <strong>grows</strong> with n: drop constants, keep the biggest term.",
    "Sequential loops <strong>add</strong> (O(n)); nested loops <strong>multiply</strong> (O(n&sup2;)); halving is O(log n).",
    "Hidden loops count: <code>includes</code>, <code>indexOf</code>, <code>slice</code>, <code>shift</code> are O(n) each; <code>sort</code> is O(n log n).",
    "At n = 1,000,000: O(n log n) takes a fraction of a second, O(n&sup2;) takes hours.",
    "Most O(n&sup2;) &rarr; O(n) fixes remember something: a <code>Set</code>/<code>Map</code>, a running min/max, or prefix sums.",
    "Space matters too: trading O(n) memory for speed is usually worth it - say so in interviews."
  ]
});
