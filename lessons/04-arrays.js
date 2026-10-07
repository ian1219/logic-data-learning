LDL.registerLesson({
  id: "04",
  title: "Arrays",
  lang: "js",
  minutes: 75,
  goal: "Store lists of values, read and change them with confidence, and recognise the handful of patterns (scan, two pointers, sliding window, prefix sums) that crack most array exam questions.",

  analogy: `
<p>Picture a row of <strong>numbered lockers</strong> in a school corridor. Each locker holds one thing, and each has a number painted on
the door - starting at <strong>0</strong>, not 1. If you know the number, you walk straight to it. No searching needed.</p>
<p>Now imagine a new student must get locker 0, and everyone has to <em>shuffle one locker to the right</em> to make room.
That's slow! Adding at the <strong>end</strong> of the row is easy; squeezing in at the <strong>front</strong> is painful.
That one picture explains most of what you need to know about arrays.</p>`,

  objectives: [
    "Create arrays and read any element by its <strong>index</strong> (including the last one)",
    "Choose between <code>push</code>/<code>pop</code>, <code>shift</code>/<code>unshift</code>, <code>slice</code> and <code>splice</code> - and know what each <strong>costs</strong>",
    "Loop over arrays with <code>for</code>, <code>for...of</code> and <code>map</code>/<code>filter</code>/<code>reduce</code>",
    "Explain the difference between a <strong>reference</strong> and a <strong>copy</strong>, and avoid aliasing bugs",
    "Solve classic questions with <strong>two pointers</strong>, a <strong>sliding window</strong>, <strong>prefix sums</strong> and <strong>Kadane's algorithm</strong>"
  ],

  realWorld: `
<ul>
  <li><strong>API data:</strong> almost every web API returns a JSON list - orders, users, products - which arrives as an array.</li>
  <li><strong>Reports and dashboards:</strong> "best sales week", "running total", "7-day moving average" are sliding windows and prefix sums.</li>
  <li><strong>Spreadsheets:</strong> a column of figures is an array; SUM, MAX and AVERAGE are simple array scans.</li>
  <li><strong>Time series:</strong> daily temperatures, stock prices, step counts - all arrays indexed by day.</li>
  <li><strong>Coding exams:</strong> arrays are the single most common topic in technical interviews and online assessments.</li>
</ul>`,

  sections: [
    {
      title: "What is an array?",
      html: `
<p>An <strong>array</strong> is an ordered list of values stored under one name. Each value is an <strong>element</strong>.
Each element has a position number called its <strong>index</strong>. Indexes start at <code>0</code>.</p>
<pre>
index:      0     1     2     3     4
         +-----+-----+-----+-----+-----+
temps -&gt; | 18  | 21  | 25  | 19  | 23  |
         +-----+-----+-----+-----+-----+
temps.length = 5        last index = temps.length - 1 = 4
</pre>
<pre><code class="language-javascript">const temps = [18, 21, 25, 19, 23];   // daily temperatures

console.log(temps[0]);                  // 18  - first element
console.log(temps[temps.length - 1]);   // 23  - last element
console.log(temps.at(-1));              // 23  - last element (modern shortcut)
temps[2] = 26;                          // change an element</code></pre>
<div class="callout warn"><p><code>temps[-1]</code> is <code>undefined</code>, not the last element. Plain square brackets do not count from the end - use <code>temps.at(-1)</code>.
Reading past the end (<code>temps[99]</code>) also gives <code>undefined</code> instead of an error, so bugs can hide quietly.</p></div>
<div class="callout key"><p>Index = "how many steps from the start". The first element is 0 steps away, so its index is 0.</p></div>`
    },
    {
      title: "Adding, removing and copying - and what it costs",
      html: `
<p>Every operation has a <strong>cost</strong>: how much work grows as the array grows. We write it in <strong>Big-O</strong> notation.
<strong>O(1)</strong> means "instant, whatever the size". <strong>O(n)</strong> means "work grows with the number of elements <code>n</code>".</p>
<table>
  <tr><th>Operation</th><th>Example</th><th>Cost</th><th>Why</th></tr>
  <tr><td>Read / write by index</td><td><code>a[i]</code>, <code>a[i] = x</code></td><td>O(1)</td><td>jump straight to the locker</td></tr>
  <tr><td>Add / remove at the <strong>end</strong></td><td><code>a.push(x)</code>, <code>a.pop()</code></td><td>O(1)</td><td>nobody has to move</td></tr>
  <tr><td>Add / remove at the <strong>front</strong></td><td><code>a.unshift(x)</code>, <code>a.shift()</code></td><td>O(n)</td><td>everyone shuffles one place</td></tr>
  <tr><td>Insert / delete in the middle</td><td><code>a.splice(i, 1)</code></td><td>O(n)</td><td>everything after <code>i</code> moves</td></tr>
  <tr><td>Search by value</td><td><code>a.includes(x)</code>, <code>a.indexOf(x)</code></td><td>O(n)</td><td>may have to check every element</td></tr>
  <tr><td>Copy a range</td><td><code>a.slice(i, j)</code>, <code>[...a]</code></td><td>O(k)</td><td>k = elements copied</td></tr>
  <tr><td>Sort</td><td><code>a.sort((x, y) =&gt; x - y)</code></td><td>O(n log n)</td><td>see lesson 09</td></tr>
</table>
<p><strong>slice vs splice</strong> - one letter apart, very different jobs:</p>
<pre><code class="language-javascript">const playlist = ["Intro", "Song A", "Song B", "Song C"];

const middle = playlist.slice(1, 3);    // ["Song A", "Song B"] - a COPY, playlist unchanged
const removed = playlist.splice(1, 2);  // removes 2 items from index 1 - playlist CHANGES
console.log(playlist);                  // ["Intro", "Song C"]</code></pre>
<div class="callout tip"><p>Memory trick: s<strong>p</strong>lice has a <strong>p</strong> for "<strong>p</strong>ermanent" - it changes the original. <code>slice(a, b)</code> returns <code>b - a</code> elements and never changes anything.</p></div>`
    },
    {
      title: "Looping: for, for...of, map, filter, reduce",
      html: `
<p>To <strong>iterate</strong> means to visit each element in turn. Pick the loop that matches what you need:</p>
<pre><code class="language-javascript">const sales = [120, 90, 200];

for (let i = 0; i &lt; sales.length; i++) { }   // need the index? (two pointers, windows)
for (const s of sales) { }                    // values only - cleanest to read
for (const [i, s] of sales.entries()) { }     // both index and value</code></pre>
<p>Three methods do most everyday work and return something new instead of changing the original:</p>
<table>
  <tr><th>Method</th><th>What it does</th><th>Example</th><th>Result</th></tr>
  <tr><td><code>map</code></td><td>transform every element</td><td><code>[1, 2, 3].map(x =&gt; x * 2)</code></td><td><code>[2, 4, 6]</code></td></tr>
  <tr><td><code>filter</code></td><td>keep the elements that pass a test</td><td><code>[5, 12, 8].filter(x =&gt; x &gt; 6)</code></td><td><code>[12, 8]</code></td></tr>
  <tr><td><code>reduce</code></td><td>combine everything into one value</td><td><code>[1, 2, 3].reduce((sum, x) =&gt; sum + x, 0)</code></td><td><code>6</code></td></tr>
</table>
<div class="callout warn"><p>Don't use <code>for...in</code> on arrays - it gives you the indexes as <em>strings</em> (<code>"0"</code>, <code>"1"</code>). And always give <code>reduce</code> a starting value: <code>[].reduce((s, x) =&gt; s + x)</code> throws an error.</p></div>`
    },
    {
      title: "Reference vs copy (the aliasing trap)",
      html: `
<p>A variable does not hold the array itself. It holds a <strong>reference</strong> - an address saying where the array lives.
Copying the variable copies the address, not the array. Two names for one array is called <strong>aliasing</strong>.</p>
<pre><code class="language-javascript">const cart = ["milk", "bread"];
const sameCart = cart;        // alias: same array, two names
sameCart.push("eggs");        // cart now has eggs too!

const newCart = [...cart];    // a real copy (also cart.slice())
newCart.push("jam");          // cart is unaffected</code></pre>
<pre>
cart -----+                        newCart --&gt; ["milk", "bread", "eggs", "jam"]
          +--&gt; ["milk", "bread", "eggs"]
sameCart -+
</pre>
<div class="callout analogy"><p>Giving someone your <strong>house address</strong> is not giving them a new house. If they paint the door, your door changes.
A copy (<code>[...cart]</code>) is like building an identical house next door.</p></div>
<div class="callout work"><p>Functions receive references too. If your function does <code>arr.push(...)</code> or <code>arr.sort()</code>, the caller's data changes.
When a task says "return a new array", copy first. For nested arrays, use <code>structuredClone(arr)</code> (lesson 05).</p></div>`
    },
    {
      title: "Pattern 1: linear scan and two pointers",
      html: `
<p>A <strong>linear scan</strong> walks the array once, keeping a "best so far" value. It finds max, min, totals and counts in O(n).</p>
<pre><code class="language-javascript">let best = nums[0];                 // start with a real element, not 0
for (const x of nums) {
  if (x &gt; best) best = x;           // a new champion
}</code></pre>
<p><strong>Two pointers</strong> means two index variables that move towards each other (or in the same direction).
On a <strong>sorted</strong> array, each step lets you throw away one end:</p>
<pre>
target = 43       L -&gt;                           &lt;- R
               [  5,  12,  18,  25,  33,  40 ]
sum too small? move L right (bigger numbers)
sum too big?   move R left  (smaller numbers)
</pre>
<div class="callout tip"><p>Two pointers also reverse an array in place: swap <code>a[L]</code> and <code>a[R]</code>, then move both inwards until they meet. O(n) time, no extra array.</p></div>`
    },
    {
      title: "Pattern 2: sliding window and prefix sums",
      html: `
<p>A <strong>sliding window</strong> is a block of <code>k</code> neighbouring elements that slides one step at a time.
Instead of re-adding all <code>k</code> values, add the one that <em>enters</em> and subtract the one that <em>leaves</em>.</p>
<pre>
sales (k = 3):  [120,  90, 200, 150,  80 ]
                 [-------------]                 120 + 90 + 200        = 410
                       [-------------]           410 - 120 + 150       = 440
                             [-------------]     440 - 90  + 80        = 430
</pre>
<p>A <strong>prefix sum</strong> array stores running totals. <code>prefix[i]</code> = sum of the first <code>i</code> elements.
Build it once, then any range total is one subtraction.</p>
<pre>
revenue =    [30, 45, 25, 60, 50]
prefix  = [0, 30, 75, 100, 160, 210]
sum of revenue[1..3] = prefix[4] - prefix[1] = 160 - 30 = 130
</pre>
<div class="callout key"><p>Window: "best block of size k" in O(n) instead of O(n &times; k). Prefix sums: "many range totals" in O(1) each after O(n) setup.</p></div>`
    },
    {
      title: "Pattern 3: write pointer and Kadane",
      html: `
<p>A <strong>write pointer</strong> (also called slow/fast pointers) rewrites an array <strong>in place</strong> - without creating a new one.
One index reads every element; a second index marks where the next "keeper" goes.</p>
<pre><code class="language-javascript">// keep only non-zero values, in place
let write = 0;
for (const x of nums) {
  if (x !== 0) nums[write++] = x;   // copy the keeper forward
}</code></pre>
<p><strong>Kadane's algorithm</strong> finds the largest sum of any <strong>contiguous</strong> run (a subarray with no gaps).
At each element ask one question: <em>"Is it better to extend the run I have, or start fresh here?"</em></p>
<pre><code class="language-javascript">let current = nums[0], best = nums[0];
for (let i = 1; i &lt; nums.length; i++) {
  current = Math.max(nums[i], current + nums[i]);  // extend or restart
  best = Math.max(best, current);                  // remember the record
}</code></pre>
<div class="callout analogy"><p>You're carrying a backpack of money along a road of gains and losses. If the backpack's total goes negative, drop it and start fresh - old debt can only hurt you.</p></div>`
    }
  ],

  examples: [
    {
      title: "Reading a week of temperatures",
      code: `const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const temps = [18, 21, 25, 19, 23];

console.log("Days recorded:", temps.length);
console.log("First day:", days[0], temps[0]);
console.log("Last day:", days[days.length - 1], temps[temps.length - 1]);
console.log("Last via at(-1):", temps.at(-1));
console.log("temps[-1] is", temps[-1], "- brackets don't count backwards");
console.log("Midweek (slice 1..3):", temps.slice(1, 4));`,
      explain: `
<ol>
  <li>Two arrays share the same index: <code>days[i]</code> and <code>temps[i]</code> describe the same day. This is called <strong>parallel arrays</strong>.</li>
  <li>The last index is always <code>length - 1</code>; <code>at(-1)</code> is a shortcut.</li>
  <li><code>slice(1, 4)</code> takes indexes 1, 2, 3 - the end index is <em>not</em> included.</li>
  <li><strong>Try it:</strong> print the weekend by adding <code>"Sat"</code> and <code>"Sun"</code> with <code>push</code>.</li>
</ol>`
    },
    {
      title: "slice vs splice on a playlist",
      code: `const playlist = ["Intro", "Song A", "Song B", "Song C", "Outro"];

const preview = playlist.slice(1, 3);
console.log("slice copy:", preview, "| playlist still has", playlist.length, "songs");

const removed = playlist.splice(1, 2);
console.log("splice removed:", removed, "| playlist now:", playlist);

playlist.splice(1, 0, "New Single");   // insert, remove nothing
console.log("after insert:", playlist);`,
      explain: `
<ol>
  <li><code>slice(1, 3)</code> copies indexes 1 and 2. The playlist is untouched.</li>
  <li><code>splice(1, 2)</code> <em>removes</em> 2 songs starting at index 1 and returns them.</li>
  <li><code>splice(1, 0, "New Single")</code> removes 0 and inserts 1 - this is how you insert in the middle.</li>
  <li><strong>Try it:</strong> replace "Song C" with "Remix" using one <code>splice</code> call.</li>
</ol>`
    },
    {
      title: "push/pop vs shift/unshift: a queue at the counter",
      code: `const queue = ["Ana", "Ben"];

queue.push("Cara");             // joins at the back - O(1)
console.log("after push:", queue);

const served = queue.shift();   // leaves from the front - O(n)
console.log("served:", served, "| waiting:", queue);

queue.unshift("VIP");           // jumps to the front - O(n)
console.log("after unshift:", queue);

const last = queue.pop();       // leaves from the back - O(1)
console.log("left the line:", last, "| waiting:", queue);`,
      explain: `
<table>
  <tr><th>Method</th><th>End</th><th>Action</th><th>Cost</th></tr>
  <tr><td><code>push</code></td><td>back</td><td>add</td><td>O(1)</td></tr>
  <tr><td><code>pop</code></td><td>back</td><td>remove</td><td>O(1)</td></tr>
  <tr><td><code>unshift</code></td><td>front</td><td>add</td><td>O(n)</td></tr>
  <tr><td><code>shift</code></td><td>front</td><td>remove</td><td>O(n)</td></tr>
</table>
<p>For small arrays you won't notice. For 100,000 items inside a loop, <code>shift</code> can make your program hundreds of times slower.</p>`
    },
    {
      title: "The aliasing trap with a shopping cart",
      code: `const cart = ["milk", "bread"];
const alias = cart;
const copy = [...cart];

alias.push("eggs");
copy.push("jam");

console.log("cart: ", cart);
console.log("alias:", alias);
console.log("copy: ", copy);
console.log("cart === alias?", cart === alias);
console.log("cart === copy? ", cart === copy);
console.log("[1, 2] === [1, 2]?", [1, 2] === [1, 2]);`,
      explain: `
<ol>
  <li><code>alias</code> points to the same array, so pushing "eggs" through it changes <code>cart</code>.</li>
  <li><code>copy</code> is a separate array, so "jam" only appears there.</li>
  <li><code>===</code> on arrays asks "same array object?", not "same contents?". That's why <code>[1, 2] === [1, 2]</code> is <code>false</code>.</li>
  <li><strong>Try it:</strong> change <code>const copy = [...cart]</code> to <code>const copy = cart</code> and watch "jam" appear everywhere.</li>
</ol>`
    },
    {
      title: "A mini sales report with map, filter and reduce",
      code: `const orders = [
  { id: 1, amount: 120, region: "North" },
  { id: 2, amount: 45,  region: "South" },
  { id: 3, amount: 300, region: "North" },
  { id: 4, amount: 80,  region: "East" }
];

const amounts = orders.map(o => o.amount);
const bigOrders = orders.filter(o => o.amount >= 100);
const total = orders.reduce((sum, o) => sum + o.amount, 0);

console.log("Amounts:", amounts);
console.log("Big order ids:", bigOrders.map(o => o.id));
console.log("Total revenue:", total);
console.log("Average order:", total / orders.length);`,
      explain: `
<ol>
  <li><code>map</code> pulls out one field from every order.</li>
  <li><code>filter</code> keeps orders of 100 or more.</li>
  <li><code>reduce</code> starts at 0 and adds each amount: 0 &rarr; 120 &rarr; 165 &rarr; 465 &rarr; 545.</li>
  <li><strong>Try it:</strong> compute the total for the "North" region only by chaining <code>filter</code> then <code>reduce</code>.</li>
</ol>`
    },
    {
      title: "Linear scan: which day had the most steps?",
      code: `const days  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const steps = [6200, 8100, 7400, 9800, 5300, 9800, 7000];

let bestIndex = 0;
for (let i = 1; i < steps.length; i++) {
  if (steps[i] > steps[bestIndex]) bestIndex = i;   // strictly greater keeps the first record
}
console.log("Best day:", days[bestIndex], "with", steps[bestIndex], "steps");

let total = 0;
for (const s of steps) total += s;
console.log("Weekly total:", total, "| daily average:", Math.round(total / steps.length));`,
      explain: `
<table>
  <tr><th>i</th><th>steps[i]</th><th>best so far</th></tr>
  <tr><td>0</td><td>6200</td><td>6200 (Mon)</td></tr>
  <tr><td>1</td><td>8100</td><td>8100 (Tue)</td></tr>
  <tr><td>2</td><td>7400</td><td>8100</td></tr>
  <tr><td>3</td><td>9800</td><td>9800 (Thu)</td></tr>
  <tr><td>4-6</td><td>5300, 9800, 7000</td><td>9800 (Thu) - Sat ties but is not greater</td></tr>
</table>
<p>Storing the <strong>index</strong> of the best (not just the value) lets you report <em>which</em> day it was. <strong>Try it:</strong> change <code>&gt;</code> to <code>&gt;=</code> - which day wins now?</p>`
    },
    {
      title: "Two pointers: two gifts that use the whole budget",
      code: `const prices = [5, 12, 18, 25, 33, 40];   // sorted!
const budget = 43;

let left = 0, right = prices.length - 1;
while (left < right) {
  const sum = prices[left] + prices[right];
  console.log("try", prices[left], "+", prices[right], "=", sum);
  if (sum === budget) {
    console.log("Found:", prices[left], "and", prices[right]);
    break;
  }
  if (sum < budget) left++;    // need more: move to a bigger price
  else right--;                // too much: move to a smaller price
}`,
      explain: `
<table>
  <tr><th>L</th><th>R</th><th>sum</th><th>decision</th></tr>
  <tr><td>5</td><td>40</td><td>45</td><td>too big &rarr; R left</td></tr>
  <tr><td>5</td><td>33</td><td>38</td><td>too small &rarr; L right</td></tr>
  <tr><td>12</td><td>33</td><td>45</td><td>too big &rarr; R left</td></tr>
  <tr><td>12</td><td>25</td><td>37</td><td>too small &rarr; L right</td></tr>
  <tr><td>18</td><td>25</td><td>43</td><td>found!</td></tr>
</table>
<p>5 checks instead of all 15 pairs. It only works because the list is <strong>sorted</strong>. <strong>Try it:</strong> set the budget to 100 and watch the pointers cross.</p>`
    },
    {
      title: "Sliding window: best 3-day sales streak",
      code: `const sales = [120, 90, 200, 150, 80, 170, 210];
const k = 3;

let windowSum = 0;
for (let i = 0; i < k; i++) windowSum += sales[i];   // first window
let best = windowSum, bestStart = 0;

for (let i = k; i < sales.length; i++) {
  windowSum += sales[i] - sales[i - k];              // add new day, drop old day
  console.log("days", i - k + 1, "to", i, "->", windowSum);
  if (windowSum > best) { best = windowSum; bestStart = i - k + 1; }
}
console.log("Best streak starts on day", bestStart, "with total", best);`,
      explain: `
<table>
  <tr><th>Window (indexes)</th><th>Calculation</th><th>Sum</th></tr>
  <tr><td>0-2</td><td>120 + 90 + 200</td><td>410</td></tr>
  <tr><td>1-3</td><td>410 - 120 + 150</td><td>440</td></tr>
  <tr><td>2-4</td><td>440 - 90 + 80</td><td>430</td></tr>
  <tr><td>3-5</td><td>430 - 200 + 170</td><td>400</td></tr>
  <tr><td>4-6</td><td>400 - 150 + 210</td><td><strong>460</strong></td></tr>
</table>
<p>Each step costs 2 operations, no matter how big <code>k</code> is. <strong>Try it:</strong> change <code>k</code> to 2 and predict the best streak first.</p>`
    },
    {
      title: "Prefix sums: quarterly revenue in one subtraction",
      code: `const revenue = [30, 45, 25, 60, 50, 40];   // thousands, Jan..Jun

const prefix = [0];
for (const r of revenue) prefix.push(prefix[prefix.length - 1] + r);
console.log("prefix:", prefix);

function rangeTotal(i, j) {           // months i..j inclusive
  return prefix[j + 1] - prefix[i];
}
console.log("Q1 (Jan-Mar):", rangeTotal(0, 2));
console.log("Q2 (Apr-Jun):", rangeTotal(3, 5));
console.log("Feb-May:", rangeTotal(1, 4));`,
      explain: `
<ol>
  <li><code>prefix</code> has one extra slot: <code>[0, 30, 75, 100, 160, 210, 250]</code>.</li>
  <li>Q1 = <code>prefix[3] - prefix[0]</code> = 100 - 0 = 100.</li>
  <li>Feb-May = <code>prefix[5] - prefix[1]</code> = 210 - 30 = 180.</li>
  <li>After the O(n) build, every question is O(1). <strong>Try it:</strong> add a question for the whole half-year.</li>
</ol>`
    },
    {
      title: "Kadane: the most profitable stretch of days",
      code: `const profit = [-3, 4, -1, 2, -6, 5, 1, -2];

let current = profit[0], best = profit[0];
let start = 0, bestStart = 0, bestEnd = 0;

for (let i = 1; i < profit.length; i++) {
  if (profit[i] > current + profit[i]) {   // starting fresh is better
    current = profit[i];
    start = i;
  } else {
    current += profit[i];                  // extend the run
  }
  if (current > best) { best = current; bestStart = start; bestEnd = i; }
}
console.log("Best total:", best, "from day", bestStart, "to day", bestEnd);
console.log("Those days:", profit.slice(bestStart, bestEnd + 1));`,
      explain: `
<table>
  <tr><th>i</th><th>value</th><th>current</th><th>best</th></tr>
  <tr><td>0</td><td>-3</td><td>-3</td><td>-3</td></tr>
  <tr><td>1</td><td>4</td><td>4 (restart)</td><td>4</td></tr>
  <tr><td>2</td><td>-1</td><td>3</td><td>4</td></tr>
  <tr><td>3</td><td>2</td><td>5</td><td>5</td></tr>
  <tr><td>4</td><td>-6</td><td>-1</td><td>5</td></tr>
  <tr><td>5</td><td>5</td><td>5 (restart)</td><td>5</td></tr>
  <tr><td>6</td><td>1</td><td>6</td><td><strong>6</strong></td></tr>
  <tr><td>7</td><td>-2</td><td>4</td><td>6</td></tr>
</table>
<p>One pass, O(n). <strong>Try it:</strong> make every value negative - Kadane correctly returns the least-bad single day.</p>`
    }
  ],

  pitfalls: [
    "<strong>Off-by-one:</strong> the last index is <code>a.length - 1</code>. A loop with <code>i &lt;= a.length</code> reads one past the end and gets <code>undefined</code>.",
    "<code>a[-1]</code> is <code>undefined</code>, not the last element. Use <code>a[a.length - 1]</code> or <code>a.at(-1)</code>.",
    "<strong>Empty input:</strong> <code>[][0]</code> is <code>undefined</code> and <code>Math.max()</code> is <code>-Infinity</code>. Decide what to return for <code>[]</code> before anything else.",
    "Starting a running max at <code>0</code> fails when every value is negative. Start with <code>a[0]</code>.",
    "<code>b = a</code> does <strong>not</strong> copy. Use <code>[...a]</code> or <code>a.slice()</code>.",
    "<code>[10, 9, 1].sort()</code> gives <code>[1, 10, 9]</code> - it sorts as text. Use <code>sort((x, y) =&gt; x - y)</code>, and remember it changes the original.",
    "Calling <code>shift</code>, <code>unshift</code> or <code>splice</code> inside a loop quietly turns O(n) into O(n<sup>2</sup>)."
  ],

  quiz: [
    {
      q: "What does this print?",
      code: `const a = [10, 20, 30];
const b = a;
b.push(40);
console.log(a.length);`,
      options: ["3", "4", "undefined", "An error"],
      answer: 1,
      output: "4",
      explain: "<p><code>b = a</code> copies the <strong>reference</strong>, not the array. Both names point at the same array, so pushing through <code>b</code> also grows <code>a</code> to 4 elements.</p>"
    },
    {
      q: "What does this print?",
      code: `const temps = [18, 21, 25, 19];
console.log(temps[temps.length - 1]);
console.log(temps.slice(1, 3).join(","));`,
      options: ["19 then 21,25", "25 then 21,25,19", "19 then 18,21", "undefined then 21,25"],
      answer: 0,
      output: "19\n21,25",
      explain: "<p>The last index is <code>length - 1 = 3</code>, which holds 19. <code>slice(1, 3)</code> takes indexes 1 and 2 (the end is excluded): 21 and 25.</p>"
    },
    {
      q: "What does this print?",
      code: `const a = [1, 2, 3, 4, 5];
const removed = a.splice(1, 2);
console.log(a.join(",") + " | " + removed.join(","));`,
      options: ["1,2,3,4,5 | 2,3", "1,4,5 | 2,3", "1,2,5 | 3,4", "4,5 | 1,2,3"],
      answer: 1,
      output: "1,4,5 | 2,3",
      explain: "<p><code>splice(1, 2)</code> removes <strong>2 elements starting at index 1</strong> (the 2 and the 3) from the original array and returns them. Unlike <code>slice</code>, it changes <code>a</code>.</p>"
    },
    {
      q: "Which operation is <strong>O(n)</strong> on an array of n elements?",
      options: ["<code>a.push(x)</code>", "<code>a.pop()</code>", "<code>a.shift()</code>", "<code>a[5]</code>"],
      answer: 2,
      explain: "<p><code>shift</code> removes the first element, so every other element must move one place left. The others touch only one slot at the end or a known index, so they're O(1).</p>"
    },
    {
      q: "You need the highest total sales over any <strong>7 consecutive days</strong> in a year of data. Which pattern fits best?",
      options: ["Two pointers from both ends", "Sliding window", "Sorting first", "Binary search"],
      answer: 1,
      explain: "<p>\"Consecutive\" + \"fixed size\" = sliding window. Keep a running 7-day total, add the new day and subtract the day that left: O(n) instead of O(n &times; 7). Sorting would destroy the day order.</p>"
    },
    {
      q: "What does this print?",
      code: `const nums = [3, 1, 4, 1, 5];
const prefix = [0];
for (const x of nums) prefix.push(prefix[prefix.length - 1] + x);
console.log(prefix[4] - prefix[1]);`,
      options: ["5", "6", "9", "14"],
      answer: 1,
      output: "6",
      explain: "<p><code>prefix</code> is <code>[0, 3, 4, 8, 9, 14]</code>. <code>prefix[4] - prefix[1]</code> = 9 - 3 = 6, which is <code>nums[1] + nums[2] + nums[3]</code> = 1 + 4 + 1.</p>"
    },
    {
      q: "Which line makes a real copy, so changing it won't affect <code>original</code>?",
      options: ["<code>const c = original;</code>", "<code>const c = [...original];</code>", "<code>const c = original.sort();</code>", "<code>const c = original.reverse();</code>"],
      answer: 1,
      explain: "<p>Spread (<code>[...original]</code>) builds a brand-new array. Plain assignment creates an alias, and <code>sort()</code>/<code>reverse()</code> change the original <em>and</em> return that same array.</p>"
    }
  ],

  interview: [
    { q: "Why is <code>push</code> O(1) but <code>unshift</code> O(n)?",
      a: "<p><code>push</code> writes into the next free slot at the end - nothing else moves. <code>unshift</code> puts a value at index 0, so every existing element must shift one place right. (Occasionally <code>push</code> must grow the storage, but averaged over many pushes it's still O(1) - called <em>amortised</em> O(1).)</p>" },
    { q: "Find two numbers in a sorted array that add up to a target using O(1) extra space.",
      a: "<p>Two pointers: <code>L = 0</code>, <code>R = n - 1</code>. If the sum is too small, move <code>L</code> right; if too big, move <code>R</code> left; stop when it matches or the pointers meet. O(n) time. (If the array is unsorted, use a hash set instead - lesson 07.)</p>" },
    { q: "What's the difference between <code>b = a</code>, <code>b = [...a]</code> and <code>b = structuredClone(a)</code>?",
      a: "<p><code>b = a</code>: one array, two names. <code>[...a]</code>: a new outer array, but any nested arrays/objects are still shared (a <em>shallow</em> copy). <code>structuredClone</code>: copies every level (a <em>deep</em> copy).</p>" },
    { q: "How would you answer thousands of \"sum from day i to day j\" queries quickly?",
      a: "<p>Build a prefix-sum array once in O(n). Each query is then <code>prefix[j + 1] - prefix[i]</code> in O(1). Total: O(n + q) instead of O(n &times; q).</p>" },
    { q: "Explain Kadane's algorithm in one sentence. What's its complexity?",
      a: "<p>For each element, the best subarray ending there is either the element alone or the element plus the best subarray ending just before it; track the largest such value. O(n) time, O(1) space.</p>" },
    { q: "Remove duplicates from a sorted array in place. Why does \"sorted\" matter?",
      a: "<p>In a sorted array, duplicates sit next to each other, so you only compare with the last kept value. Use a write pointer: read every element, copy it forward only when it differs from the last written one. O(n) time, O(1) extra space.</p>" }
  ],

  exercises: [
    {
      id: "find-max",
      title: "findMax without Math.max",
      difficulty: "easy",
      prompt: "<p>Return the largest value in <code>nums</code> <strong>without</strong> using <code>Math.max</code>, <code>sort</code> or <code>reduce</code>. Return <code>null</code> for an empty array. Do not modify <code>nums</code>.</p><p><code>findMax([3, 9, 2]) &rarr; 9</code> &nbsp; <code>findMax([-5, -2, -8]) &rarr; -2</code> &nbsp; <code>findMax([7]) &rarr; 7</code> &nbsp; <code>findMax([]) &rarr; null</code></p>",
      starter: `function findMax(nums) {
  // your code here
}`,
      solution: `function findMax(nums) {
  // Handle the empty case first - there is no answer to give
  if (nums.length === 0) return null;

  // "King of the hill": the first element is champion until beaten
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > best) best = nums[i];
  }
  return best;   // O(n) time, O(1) extra space
}`,
      hint: "Start <code>best</code> at <code>nums[0]</code> (not 0 - think about all-negative arrays). Then loop from index 1 and replace <code>best</code> whenever you see something bigger. Check for an empty array before anything else.",
      forbid: [{ pattern: "Math\\.max|\\.sort\\(|\\.reduce\\(", message: "Don't use Math.max, sort or reduce - scan the array yourself." }],
      tests: [
        { expr: "findMax([3, 9, 2])", expected: 9 },
        { expr: "findMax([-5, -2, -8])", expected: -2, label: "all negatives (did you start best at 0?)" },
        { expr: "findMax([7])", expected: 7, label: "single element" },
        { expr: "findMax([])", expected: null, label: "empty array -> null" },
        { expr: "findMax([4, 4, 1])", expected: 4 },
        { code: "const a = [1, 5, 3]; findMax(a); return a;", expected: [1, 5, 3], label: "input is not modified" }
      ]
    },
    {
      id: "reverse-in-place",
      title: "reverseInPlace",
      difficulty: "easy",
      prompt: "<p>Reverse <code>nums</code> <strong>in place</strong> using two pointers - no <code>reverse()</code>, no new array. The function returns nothing; the caller's array itself must change.</p><p><code>[1, 2, 3, 4]</code> becomes <code>[4, 3, 2, 1]</code><br><code>[1, 2, 3, 4, 5]</code> becomes <code>[5, 4, 3, 2, 1]</code> (the middle stays put)<br><code>[]</code> stays <code>[]</code></p>",
      starter: `function reverseInPlace(nums) {
  // your code here
}`,
      solution: `function reverseInPlace(nums) {
  // One pointer at each end; swap, then step both inwards
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {          // stop when they meet in the middle
    const temp = nums[left];
    nums[left] = nums[right];
    nums[right] = temp;
    left++;
    right--;
  }
  // No return: we changed the caller's array directly. O(n) time, O(1) space.
}`,
      hint: "Put <code>left</code> at 0 and <code>right</code> at the last index. Swap those two elements, then move <code>left</code> forward and <code>right</code> back. Keep going while <code>left &lt; right</code>.",
      explanation: "<p>Each swap fixes two positions at once, so you only need about n/2 swaps. Because you never create a new array, the extra memory is O(1) - this is what \"in place\" means.</p>",
      forbid: [{ pattern: "\\.reverse\\(|\\.toReversed\\(", message: "Don't use reverse() - swap the elements yourself." }],
      tests: [
        { code: "const a = [1, 2, 3, 4]; reverseInPlace(a); return a;", expected: [4, 3, 2, 1], label: "even length, changed in place" },
        { code: "const a = [1, 2, 3, 4, 5]; reverseInPlace(a); return a;", expected: [5, 4, 3, 2, 1], label: "odd length" },
        { code: "const a = []; reverseInPlace(a); return a;", expected: [], label: "empty array" },
        { code: "const a = [9]; reverseInPlace(a); return a;", expected: [9], label: "single element" },
        { code: "const a = [1, 2]; const b = a; reverseInPlace(a); return b === a && b[0] === 2;", expected: true, label: "same array object (not a copy)" }
      ]
    },
    {
      id: "second-largest",
      title: "secondLargest",
      difficulty: "easy",
      prompt: "<p>Return the second largest <strong>distinct</strong> value, or <code>null</code> if there isn't one. Do it in one pass, without sorting. Do not modify <code>nums</code>.</p><p><code>[4, 1, 7, 3] &rarr; 4</code> &nbsp; <code>[5, 5, 3] &rarr; 3</code> (the two 5s count once) &nbsp; <code>[2, 2] &rarr; null</code> &nbsp; <code>[] &rarr; null</code></p>",
      starter: `function secondLargest(nums) {
  // your code here
}`,
      solution: `function secondLargest(nums) {
  // Track gold and silver medals as we walk the array
  let first = null;    // largest seen so far
  let second = null;   // second largest DISTINCT value so far
  for (const x of nums) {
    if (first === null || x > first) {
      second = first;  // old champion drops to second place
      first = x;
    } else if (x !== first && (second === null || x > second)) {
      second = x;      // beats silver but not gold (and isn't a tie with gold)
    }
  }
  return second;       // O(n) time, O(1) space
}`,
      hint: "Keep two variables, <code>first</code> and <code>second</code>, both starting as <code>null</code>. When a new maximum arrives, the old maximum moves down to <code>second</code>. Skip values equal to <code>first</code>.",
      explanation: "<p>Sorting would work but costs O(n log n). Tracking the top two in one pass is O(n). The trap is duplicates: <code>[5, 5, 3]</code> must give 3, so a value equal to <code>first</code> must not become <code>second</code>.</p>",
      forbid: [{ pattern: "\\.sort\\(|\\.toSorted\\(", message: "Solve it in one pass - no sorting." }],
      tests: [
        { expr: "secondLargest([4, 1, 7, 3])", expected: 4 },
        { expr: "secondLargest([5, 5, 3])", expected: 3, label: "duplicates of the max don't count twice" },
        { expr: "secondLargest([2, 2])", expected: null, label: "no second distinct value" },
        { expr: "secondLargest([])", expected: null, label: "empty array" },
        { expr: "secondLargest([8])", expected: null, label: "single element" },
        { expr: "secondLargest([-1, -7, -3])", expected: -3, label: "negatives" },
        { expr: "secondLargest([1, 2])", expected: 1 },
        { code: "const a = [3, 9, 9, 1]; secondLargest(a); return a;", expected: [3, 9, 9, 1], label: "input is not modified" }
      ]
    },
    {
      id: "remove-duplicates-sorted",
      title: "removeDuplicatesSorted (in place)",
      difficulty: "medium",
      prompt: "<p><code>nums</code> is sorted. Remove duplicates <strong>in place</strong> so the first <code>k</code> slots hold the unique values in order, and return <code>k</code>. Whatever is left after slot <code>k</code> doesn't matter. Use O(1) extra space.</p><p><code>[1, 1, 2, 3, 3, 3] &rarr; 3</code> (array starts with <code>[1, 2, 3]</code>)<br><code>[2, 2, 2] &rarr; 1</code> (starts with <code>[2]</code>)<br><code>[] &rarr; 0</code></p>",
      starter: `function removeDuplicatesSorted(nums) {
  // your code here
}`,
      solution: `function removeDuplicatesSorted(nums) {
  if (nums.length === 0) return 0;

  // nums[0] is always kept, so the next keeper goes into slot 1
  let write = 1;
  for (let read = 1; read < nums.length; read++) {
    // Sorted => a new value is simply one that differs from the last one kept
    if (nums[read] !== nums[write - 1]) {
      nums[write] = nums[read];
      write++;
    }
  }
  return write;   // number of unique values. O(n) time, O(1) space.
}`,
      hint: "Use two indexes: <code>read</code> visits every element; <code>write</code> is where the next unique value goes. Compare <code>nums[read]</code> with <code>nums[write - 1]</code> (the last value you kept).",
      explanation: "<p>This is the <strong>read/write pointer</strong> pattern. <code>read</code> always moves; <code>write</code> moves only when something is worth keeping. Because the array is sorted, duplicates are neighbours, so one comparison per element is enough.</p><pre>[1, 1, 2, 3, 3]   read=2 finds 2 -&gt; write it to slot 1 -&gt; [1, 2, 2, 3, 3]\n                  read=3 finds 3 -&gt; write it to slot 2 -&gt; [1, 2, 3, 3, 3], k = 3</pre>",
      tests: [
        { code: "const a = [1, 1, 2, 3, 3, 3]; const k = removeDuplicatesSorted(a); return [k, a.slice(0, k)];", expected: [3, [1, 2, 3]] },
        { code: "const a = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]; const k = removeDuplicatesSorted(a); return [k, a.slice(0, k)];", expected: [5, [0, 1, 2, 3, 4]] },
        { expr: "removeDuplicatesSorted([])", expected: 0, label: "empty array -> 0" },
        { code: "const a = [5]; const k = removeDuplicatesSorted(a); return [k, a.slice(0, k)];", expected: [1, [5]], label: "single element" },
        { code: "const a = [2, 2, 2]; const k = removeDuplicatesSorted(a); return [k, a.slice(0, k)];", expected: [1, [2]], label: "all the same" },
        { code: "const a = [-3, -3, -1, 0]; const k = removeDuplicatesSorted(a); return [k, a.slice(0, k)];", expected: [3, [-3, -1, 0]], label: "negatives" }
      ]
    },
    {
      id: "rotate-right",
      title: "rotateRight",
      difficulty: "medium",
      prompt: "<p>Return a <strong>new array</strong> rotated right by <code>k</code> steps: the last element wraps around to the front, <code>k</code> times. <code>k</code> may be larger than the length. Do not modify <code>nums</code>.</p><p><code>rotateRight([1, 2, 3, 4, 5], 2) &rarr; [4, 5, 1, 2, 3]</code><br><code>rotateRight([1, 2, 3], 4) &rarr; [3, 1, 2]</code> (4 steps = 1 step)<br><code>rotateRight([], 3) &rarr; []</code></p>",
      starter: `function rotateRight(nums, k) {
  // your code here
}`,
      solution: `function rotateRight(nums, k) {
  const n = nums.length;
  if (n === 0) return [];

  // Rotating n times brings us back to the start, so only k % n steps matter
  k = k % n;

  // Last k elements go first, then everything before them
  return nums.slice(n - k).concat(nums.slice(0, n - k));   // O(n)
}`,
      hint: "Rotating by the length gives the same array, so first reduce <code>k</code> with <code>k % n</code>. Then the answer is \"the last <code>k</code> elements\" followed by \"the rest\" - two <code>slice</code> calls.",
      explanation: "<p><code>%</code> (from lesson 01) handles the wrap-around: a carousel of 3 items rotated 4 times ends up where 1 rotation would. Using <code>slice</code> guarantees you return a new array and leave the input alone.</p>",
      tests: [
        { expr: "rotateRight([1, 2, 3, 4, 5], 2)", expected: [4, 5, 1, 2, 3] },
        { expr: "rotateRight([1, 2, 3], 4)", expected: [3, 1, 2], label: "k larger than length (use k % n)" },
        { expr: "rotateRight([1, 2, 3], 0)", expected: [1, 2, 3], label: "k = 0" },
        { expr: "rotateRight([1, 2, 3], 3)", expected: [1, 2, 3], label: "a full turn" },
        { expr: "rotateRight([], 3)", expected: [], label: "empty array" },
        { expr: "rotateRight([7], 5)", expected: [7], label: "single element" },
        { code: "const a = [1, 2, 3]; const r = rotateRight(a, 1); return [a, r !== a];", expected: [[1, 2, 3], true], label: "returns a new array, input unchanged" }
      ]
    },
    {
      id: "move-zeros",
      title: "moveZerosToEnd (in place)",
      difficulty: "medium",
      prompt: "<p>Move every <code>0</code> to the end <strong>in place</strong>, keeping the other values in their original order. Don't create a new array.</p><p><code>[0, 1, 0, 3, 12]</code> becomes <code>[1, 3, 12, 0, 0]</code><br><code>[4, 0, -2, 0, 5]</code> becomes <code>[4, -2, 5, 0, 0]</code><br><code>[1, 2]</code> stays <code>[1, 2]</code></p>",
      starter: `function moveZerosToEnd(nums) {
  // your code here
}`,
      solution: `function moveZerosToEnd(nums) {
  // Step 1: copy every non-zero forward, in order
  let write = 0;
  for (const x of nums) {
    if (x !== 0) {
      nums[write] = x;
      write++;
    }
  }
  // Step 2: everything after the last non-zero must be a zero
  for (let i = write; i < nums.length; i++) {
    nums[i] = 0;
  }
  // O(n) time, O(1) extra space
}`,
      hint: "Keep a <code>write</code> index starting at 0. Each non-zero value goes to <code>nums[write]</code> and <code>write</code> moves on. When the loop ends, fill from <code>write</code> to the end with zeros.",
      explanation: "<p>Same write-pointer idea as removing duplicates. Using <code>splice</code> to delete each zero and <code>push</code> it back would also work, but each <code>splice</code> is O(n), making the whole thing O(n<sup>2</sup>).</p>",
      tests: [
        { code: "const a = [0, 1, 0, 3, 12]; moveZerosToEnd(a); return a;", expected: [1, 3, 12, 0, 0] },
        { code: "const a = []; moveZerosToEnd(a); return a;", expected: [], label: "empty array" },
        { code: "const a = [0]; moveZerosToEnd(a); return a;", expected: [0], label: "single zero" },
        { code: "const a = [1, 2]; moveZerosToEnd(a); return a;", expected: [1, 2], label: "no zeros" },
        { code: "const a = [0, 0, 1]; moveZerosToEnd(a); return a;", expected: [1, 0, 0] },
        { code: "const a = [4, 0, -2, 0, 5]; moveZerosToEnd(a); return a;", expected: [4, -2, 5, 0, 0], label: "negatives keep their order" }
      ]
    },
    {
      id: "two-sum-sorted",
      title: "twoSumSorted (two pointers)",
      difficulty: "medium",
      prompt: "<p><code>nums</code> is sorted from smallest to largest. Return <code>[i, j]</code> with <code>i &lt; j</code> and <code>nums[i] + nums[j] === target</code>, or <code>null</code> if no pair exists. Use two pointers: O(n) time, O(1) extra space. Do not modify <code>nums</code>.</p><p><code>twoSumSorted([1, 3, 4, 6, 8, 11], 10) &rarr; [2, 3]</code> (4 + 6)<br><code>twoSumSorted([-4, -1, 0, 3, 7], -5) &rarr; [0, 1]</code><br><code>twoSumSorted([1, 2], 7) &rarr; null</code></p>",
      starter: `function twoSumSorted(nums, target) {
  // your code here
}`,
      solution: `function twoSumSorted(nums, target) {
  let left = 0;                  // smallest value
  let right = nums.length - 1;   // largest value
  while (left < right) {         // left < right: never use the same element twice
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) {
      left++;    // too small: the only way to grow the sum is a bigger left value
    } else {
      right--;   // too big: the only way to shrink it is a smaller right value
    }
  }
  return null;   // pointers met - no pair. O(n) time, O(1) space.
}`,
      hint: "Start with one pointer at each end. If the sum is too small, which pointer can make it bigger? (Moving <code>right</code> left only makes it smaller.) Stop when the pointers meet.",
      explanation: "<p>Checking every pair is O(n<sup>2</sup>). Sorting gives us a superpower: when <code>nums[left] + nums[right]</code> is too small, <code>nums[left]</code> can't pair with <em>anything</em> (right is already the biggest), so we discard it. Each step discards one element, giving O(n).</p>",
      tests: [
        { expr: "twoSumSorted([1, 3, 4, 6, 8, 11], 10)", expected: [2, 3] },
        { expr: "twoSumSorted([1, 2], 3)", expected: [0, 1] },
        { expr: "twoSumSorted([1, 2], 7)", expected: null, label: "no pair -> null" },
        { expr: "twoSumSorted([], 5)", expected: null, label: "empty array" },
        { expr: "twoSumSorted([5], 10)", expected: null, label: "can't use the same element twice" },
        { expr: "twoSumSorted([-4, -1, 0, 3, 7], -5)", expected: [0, 1], label: "negatives" },
        { code: "const a = [1, 3, 4, 6]; twoSumSorted(a, 7); return a;", expected: [1, 3, 4, 6], label: "input is not modified" }
      ]
    },
    {
      id: "max-window-sum",
      title: "maxWindowSum (sliding window)",
      difficulty: "medium",
      prompt: "<p>Return the largest sum of any <code>k</code> <strong>consecutive</strong> elements, in O(n). Return <code>null</code> if <code>k &lt;= 0</code> or <code>k &gt; nums.length</code>. Do not modify <code>nums</code>.</p><p><code>maxWindowSum([2, 1, 5, 1, 3, 2], 3) &rarr; 9</code> (5 + 1 + 3)<br><code>maxWindowSum([-1, -2, -3], 2) &rarr; -3</code> (-1 + -2)<br><code>maxWindowSum([1, 2], 3) &rarr; null</code></p>",
      starter: `function maxWindowSum(nums, k) {
  // your code here
}`,
      solution: `function maxWindowSum(nums, k) {
  // Guard against impossible window sizes
  if (k <= 0 || k > nums.length) return null;

  // Sum the very first window
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  let best = windowSum;

  // Slide: add the element entering on the right, subtract the one leaving on the left
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    if (windowSum > best) best = windowSum;
  }
  return best;   // O(n) time, O(1) space
}`,
      hint: "First add up <code>nums[0..k-1]</code>. Then for each new index <code>i</code> from <code>k</code> onward: add <code>nums[i]</code>, subtract <code>nums[i - k]</code>, and update the best. Start <code>best</code> at the first window's sum, not 0.",
      explanation: "<p>Re-summing every window costs O(n &times; k) - with a year of data and k = 30, that's ~11,000 additions instead of ~365. The sliding window reuses the previous total, so each step is O(1).</p><pre>[2, 1, 5, 1, 3, 2]  k=3\n 8 -&gt; 8-2+1=7 -&gt; 7-1+3=9 -&gt; 9-5+2=6      best = 9</pre>",
      tests: [
        { expr: "maxWindowSum([2, 1, 5, 1, 3, 2], 3)", expected: 9 },
        { expr: "maxWindowSum([-1, -2, -3], 2)", expected: -3, label: "all negatives" },
        { expr: "maxWindowSum([4, 2], 2)", expected: 6, label: "window = whole array" },
        { expr: "maxWindowSum([7], 1)", expected: 7, label: "single element" },
        { expr: "maxWindowSum([1, 2], 3)", expected: null, label: "k > length -> null" },
        { expr: "maxWindowSum([1, 2], 0)", expected: null, label: "k = 0 -> null" },
        { expr: "maxWindowSum([], 1)", expected: null, label: "empty array" },
        { code: "const a = Array.from({ length: 200000 }, (_, i) => i % 100); return maxWindowSum(a, 1000);", expected: 49500, maxMs: 500, label: "large input runs in O(n)" },
        { code: "const a = [2, 1, 5]; maxWindowSum(a, 2); return a;", expected: [2, 1, 5], label: "input is not modified" }
      ]
    },
    {
      id: "range-sums",
      title: "rangeSums (prefix sums)",
      difficulty: "medium",
      prompt: "<p><code>queries</code> is a list of <code>[i, j]</code> pairs (inclusive, <code>i &lt;= j</code>). Return an array with the sum of <code>nums[i..j]</code> for each query. Build a prefix-sum array once so each query is O(1). Do not modify <code>nums</code>.</p><p><code>rangeSums([3, 1, 4, 1, 5], [[0, 0], [1, 3], [0, 4]]) &rarr; [3, 6, 14]</code><br><code>rangeSums([-2, 5, -1], [[0, 2], [2, 2]]) &rarr; [2, -1]</code><br><code>rangeSums([3, 1, 4], []) &rarr; []</code></p>",
      starter: `function rangeSums(nums, queries) {
  // your code here
}`,
      solution: `function rangeSums(nums, queries) {
  // prefix[i] = sum of the first i elements (prefix[0] = 0, nothing added yet)
  const prefix = [0];
  for (const x of nums) {
    prefix.push(prefix[prefix.length - 1] + x);
  }

  // sum(i..j) = (sum of first j+1) - (sum of first i)
  const answers = [];
  for (const [i, j] of queries) {
    answers.push(prefix[j + 1] - prefix[i]);
  }
  return answers;   // O(n) build + O(1) per query
}`,
      hint: "Make <code>prefix</code> one longer than <code>nums</code>, starting with <code>0</code>; each next entry is the previous entry plus the next number. Then the sum from <code>i</code> to <code>j</code> is <code>prefix[j + 1] - prefix[i]</code>.",
      explanation: "<p>Summing each range with a loop costs O(n) per query - 50,000 queries on 50,000 numbers would be 2.5 billion additions. With prefix sums it's 50,000 subtractions. The leading <code>0</code> avoids a special case for ranges that start at index 0.</p>",
      tests: [
        { expr: "rangeSums([3, 1, 4, 1, 5], [[0, 0], [1, 3], [0, 4]])", expected: [3, 6, 14] },
        { expr: "rangeSums([3, 1, 4], [])", expected: [], label: "no queries -> []" },
        { expr: "rangeSums([-2, 5, -1], [[0, 2], [2, 2]])", expected: [2, -1], label: "negatives" },
        { expr: "rangeSums([7], [[0, 0]])", expected: [7], label: "single element" },
        { code: "const a = Array.from({ length: 50000 }, (_, i) => i); const q = Array.from({ length: 50000 }, () => [0, 49999]); return rangeSums(a, q)[49999];", expected: 1249975000, maxMs: 500, label: "many queries stay fast" },
        { code: "const a = [3, 1, 4, 1, 5]; rangeSums(a, [[1, 2]]); return a;", expected: [3, 1, 4, 1, 5], label: "input is not modified" }
      ]
    },
    {
      id: "max-subarray",
      title: "maxSubarray (Kadane)",
      difficulty: "hard",
      prompt: "<p>Return the largest sum of any <strong>non-empty contiguous</strong> subarray (a run of neighbouring elements), in O(n). Return <code>null</code> for an empty array. Do not modify <code>nums</code>.</p><p><code>maxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) &rarr; 6</code> (from <code>[4, -1, 2, 1]</code>)<br><code>maxSubarray([-3, -1, -2]) &rarr; -1</code> (best single element)<br><code>maxSubarray([1, 2, 3]) &rarr; 6</code> (whole array)</p>",
      starter: `function maxSubarray(nums) {
  // your code here
}`,
      solution: `function maxSubarray(nums) {
  if (nums.length === 0) return null;

  // current = best sum of a run that ENDS at the current index
  // best    = best sum seen anywhere so far
  let current = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    // Extend the previous run, or start a new run here - whichever is larger
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;   // O(n) time, O(1) space
}`,
      hint: "Walk the array keeping <code>current</code> = the best sum of a run that <em>ends here</em>. At each element choose: <code>nums[i]</code> alone, or <code>current + nums[i]</code>. Separately remember the biggest <code>current</code> ever seen. Start both at <code>nums[0]</code> so all-negative arrays work.",
      explanation: "<p>Brute force tries every start and end: O(n<sup>2</sup>). Kadane's insight: if the run so far has a negative total, it can only drag down whatever comes next, so drop it and restart. One pass is enough.</p><pre>value:    -2   1  -3   4  -1   2   1  -5   4\ncurrent:  -2   1  -2   4   3   5   6   1   5\nbest:     -2   1   1   4   4   5   6   6   6</pre>",
      tests: [
        { expr: "maxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4])", expected: 6 },
        { expr: "maxSubarray([-3, -1, -2])", expected: -1, label: "all negatives: the largest single value" },
        { expr: "maxSubarray([5])", expected: 5, label: "single element" },
        { expr: "maxSubarray([1, 2, 3])", expected: 6, label: "whole array" },
        { expr: "maxSubarray([])", expected: null, label: "empty array -> null" },
        { expr: "maxSubarray([5, -9, 6, -2, 3])", expected: 7 },
        { code: "const a = Array.from({ length: 200000 }, (_, i) => (i % 2 ? -1 : 2)); return maxSubarray(a);", expected: 100001, maxMs: 500, label: "large input runs in O(n)" },
        { code: "const a = [2, -1, 2]; maxSubarray(a); return a;", expected: [2, -1, 2], label: "input is not modified" }
      ]
    }
  ],

  takeaways: [
    "Indexes start at <strong>0</strong>; the last one is <code>length - 1</code> (or use <code>at(-1)</code>).",
    "<code>push</code>/<code>pop</code> at the end are O(1); <code>shift</code>/<code>unshift</code>/<code>splice</code> are O(n). <code>slice</code> copies, <code>splice</code> changes.",
    "<code>b = a</code> makes an <strong>alias</strong>, not a copy - use <code>[...a]</code> when you need a separate array.",
    "Sorted array + pair question &rarr; <strong>two pointers</strong>. Consecutive block of size k &rarr; <strong>sliding window</strong>.",
    "Many range totals &rarr; <strong>prefix sums</strong>. Best contiguous run &rarr; <strong>Kadane</strong>.",
    "Always ask: empty array? one element? all negatives? Should the input stay unchanged?"
  ]
});
