LDL.registerLesson({
  id: "03",
  title: "Functions & Recursion",
  lang: "js",
  minutes: 80,
  goal: "Package logic into small, reusable, testable functions - and learn to solve a big problem by solving a smaller copy of the same problem (recursion).",

  analogy: `
<p>A function is like a <strong>coffee machine</strong>. You put things in (beans, water, the size you pressed) - those are the <strong>arguments</strong>.
It does its job inside, and hands you back one thing - a cup of coffee, the <strong>return value</strong>. You don't need to know how it works inside to use it,
and you can use the same machine a thousand times.</p>
<p><strong>Recursion</strong> is like a set of <strong>Russian nesting dolls</strong>. To count the dolls, you open the outer one and count "1 + however many are inside".
You repeat that on the smaller doll, and so on, until you reach the tiny solid doll that doesn't open - the <strong>base case</strong>.</p>`,

  objectives: [
    "Write functions as declarations, expressions and arrow functions, and know how they differ",
    "Use parameters, default values, rest (<code>...args</code>) and spread, and explain <code>return</code> vs <code>console.log</code>",
    "Predict which variables a piece of code can see (scope, <code>let</code>/<code>const</code>/<code>var</code>, hoisting)",
    "Create a <strong>closure</strong> that keeps private state, like a counter",
    "Pass functions to <code>map</code>, <code>filter</code>, <code>reduce</code> and <code>sort</code>",
    "Write recursive functions with a clear base case, trace the call stack, and speed them up with memoization"
  ],

  realWorld: `
<ul>
  <li><strong>Reusable business logic:</strong> one <code>calculateTax(amount, region)</code> used by checkout, invoices and reports.</li>
  <li><strong>Data transformation:</strong> <code>orders.filter(...).map(...).reduce(...)</code> is how JavaScript code builds reports and dashboards.</li>
  <li><strong>Sorting tables:</strong> every "sort by salary, then by name" button uses a comparator function.</li>
  <li><strong>Nested data:</strong> folder trees, org charts, menus and JSON from APIs are walked with recursion.</li>
  <li><strong>Interviews:</strong> closures, <code>this</code>/hoisting questions, recursive factorial/Fibonacci and memoization are staples.</li>
</ul>`,

  sections: [
    {
      title: "What is a function and why bother?",
      html: `
<p>A <strong>function</strong> is a named, reusable block of code. You <strong>define</strong> it once, then <strong>call</strong> it as often as you like.</p>
<pre><code class="language-javascript">function priceWithTax(price, rate) {   // define: name + inputs
  return price * (1 + rate);           // the result handed back
}

priceWithTax(100, 0.2);   // call it -&gt; 120
priceWithTax(50, 0.2);    // reuse it -&gt; 60</code></pre>
<p><strong>Why?</strong> Write the logic once, fix bugs in one place, give it a readable name, and test it on its own.</p>
<p>JavaScript has three common ways to write a function:</p>
<table>
  <tr><th>Style</th><th>Syntax</th><th>Callable before its line?</th></tr>
  <tr><td>Declaration</td><td><code>function double(x) { return x * 2; }</code></td><td>yes (hoisted)</td></tr>
  <tr><td>Expression</td><td><code>const double = function (x) { return x * 2; };</code></td><td>no</td></tr>
  <tr><td>Arrow</td><td><code>const double = (x) =&gt; x * 2;</code></td><td>no</td></tr>
</table>
<div class="callout tip"><p>A one-expression arrow function returns its value automatically. With curly braces you must write <code>return</code>:
<code>(x) =&gt; { x * 2 }</code> returns <code>undefined</code>.</p></div>`
    },
    {
      title: "Parameters, arguments, defaults, rest and spread",
      html: `
<p><strong>Parameters</strong> are the names in the definition. <strong>Arguments</strong> are the actual values you pass when calling.</p>
<pre><code class="language-javascript">function greet(name = "Guest") {   // name is a parameter with a default
  return "Hello, " + name;
}
greet("Ana");   // "Ana" is the argument -&gt; "Hello, Ana"
greet();        // no argument -&gt; default used -&gt; "Hello, Guest"</code></pre>
<table>
  <tr><th>Feature</th><th>Looks like</th><th>What it does</th></tr>
  <tr><td>Default parameter</td><td><code>(rate = 0.2)</code></td><td>used when the argument is missing / <code>undefined</code></td></tr>
  <tr><td>Rest parameter</td><td><code>(...nums)</code></td><td>collects any number of arguments into an <strong>array</strong></td></tr>
  <tr><td>Spread</td><td><code>Math.max(...scores)</code></td><td>unpacks an array into separate arguments</td></tr>
</table>
<div class="callout analogy"><p>Rest and spread are the same three dots doing opposite jobs: <strong>rest packs</strong> loose items into a box, <strong>spread unpacks</strong> a box onto the table.</p></div>`
    },
    {
      title: "return vs console.log",
      html: `
<p>This is the number-one beginner confusion, so let's be precise:</p>
<ul>
  <li><code>console.log(x)</code> <strong>shows</strong> <code>x</code> to a human on the screen. The program can't use it afterwards.</li>
  <li><code>return x</code> <strong>gives</strong> <code>x</code> back to the code that called the function, and <strong>ends</strong> the function immediately.</li>
</ul>
<pre><code class="language-javascript">function logTotal(a, b) { console.log(a + b); }   // shows 5, returns undefined
function getTotal(a, b) { return a + b; }         // returns 5

const x = logTotal(2, 3);   // x is undefined
const y = getTotal(2, 3);   // y is 5 - you can keep calculating with it</code></pre>
<div class="callout key"><p>A function with no <code>return</code> gives back <code>undefined</code>. If your tests say "Got undefined", you probably forgot to return.</p></div>`
    },
    {
      title: "Scope: who can see which variable?",
      html: `
<p><strong>Scope</strong> is the region of code where a variable exists. JavaScript looks for a name in the current block first, then walks
<strong>outwards</strong> through the enclosing functions, then the global level.</p>
<table>
  <tr><th>Keyword</th><th>Scope</th><th>Can reassign?</th><th>Used before its line</th></tr>
  <tr><td><code>const</code></td><td>the nearest <code>{ }</code> block</td><td>no</td><td>error</td></tr>
  <tr><td><code>let</code></td><td>the nearest <code>{ }</code> block</td><td>yes</td><td>error</td></tr>
  <tr><td><code>var</code></td><td>the whole function</td><td>yes</td><td><code>undefined</code> (hoisted)</td></tr>
</table>
<pre><code class="language-javascript">function demo() {
  if (true) {
    let inside = 1;     // only exists inside these braces
    var leaky = 2;      // var ignores the braces
  }
  // inside -&gt; ReferenceError,  leaky -&gt; 2
}</code></pre>
<p><strong>Hoisting</strong> means JavaScript registers declarations before running the code. That's why a <code>function</code> declaration can be called above the line where it is written.</p>
<div class="callout tip"><p>Default to <code>const</code>. Use <code>let</code> only when the value must change. Avoid <code>var</code> in new code.</p></div>`
    },
    {
      title: "Closures: functions that remember",
      html: `
<p>When a function is created inside another function, it keeps access to the outer function's variables - <strong>even after the outer function has finished</strong>.
That combination of a function and the variables it remembers is a <strong>closure</strong>.</p>
<pre><code class="language-javascript">function makeCounter() {
  let count = 0;              // private - nothing outside can touch it directly
  return () =&gt; {
    count++;                  // the arrow still "sees" count
    return count;
  };
}
const nextTicket = makeCounter();
nextTicket();  // 1
nextTicket();  // 2  - count survived between calls</code></pre>
<div class="callout analogy"><p>A closure is like a backpack: when the inner function leaves home, it takes the outer variables with it in its backpack.</p></div>
<div class="callout work"><p>Closures power private state, ID generators, event handlers, caches and "function factories" like <code>makeDiscount(0.1)</code>.</p></div>`
    },
    {
      title: "Pure and higher-order functions",
      html: `
<p>A <strong>pure function</strong> always returns the same output for the same input and changes nothing outside itself. Pure functions are easy to test and safe to reuse.</p>
<p>A <strong>higher-order function</strong> takes another function as an argument (or returns one). Arrays have several built in:</p>
<table>
  <tr><th>Method</th><th>Question it answers</th><th>Example</th><th>Result</th></tr>
  <tr><td><code>map</code></td><td>transform every item</td><td><code>[1, 2, 3].map(x =&gt; x * 2)</code></td><td><code>[2, 4, 6]</code></td></tr>
  <tr><td><code>filter</code></td><td>keep matching items</td><td><code>[5, -2, 8].filter(x =&gt; x &gt; 0)</code></td><td><code>[5, 8]</code></td></tr>
  <tr><td><code>reduce</code></td><td>combine into one value</td><td><code>[1, 2, 3].reduce((sum, x) =&gt; sum + x, 0)</code></td><td><code>6</code></td></tr>
  <tr><td><code>sort</code></td><td>put in order</td><td><code>[10, 9, 1].sort((a, b) =&gt; a - b)</code></td><td><code>[1, 9, 10]</code></td></tr>
</table>
<p>A sort <strong>comparator</strong> <code>(a, b) =&gt; ...</code> returns a <strong>negative</strong> number if <code>a</code> should come first, <strong>positive</strong> if <code>b</code> should, and <code>0</code> for a tie.</p>
<div class="callout warn"><p>Without a comparator, <code>sort</code> compares as <strong>text</strong>: <code>[10, 9, 1].sort()</code> gives <code>[1, 10, 9]</code>. It also changes the original array - copy first with <code>[...arr]</code>.</p></div>`
    },
    {
      title: "Recursion: a function that calls itself",
      html: `
<p><strong>Recursion</strong> solves a problem by solving a <em>smaller version of the same problem</em>. Every recursive function has two parts:</p>
<ol>
  <li><strong>Base case</strong> - an input so small you know the answer immediately. This is where it stops.</li>
  <li><strong>Recursive case</strong> - call yourself on a <strong>smaller</strong> input and use that answer.</li>
</ol>
<pre><code class="language-javascript">function factorial(n) {
  if (n &lt;= 1) return 1;            // base case
  return n * factorial(n - 1);     // recursive case: n shrinks each time
}</code></pre>
<table>
  <tr><th>Problem</th><th>Base case</th><th>Recursive case</th></tr>
  <tr><td>sum of an array</td><td>empty &rarr; 0</td><td>first item + sum of the rest</td></tr>
  <tr><td>palindrome</td><td>0 or 1 letters &rarr; true</td><td>ends match AND middle is a palindrome</td></tr>
  <tr><td>flatten nested array</td><td>not an array &rarr; keep the item</td><td>flatten each inner array</td></tr>
</table>
<div class="callout tip"><p>The secret is to <strong>trust the recursive call</strong>. Assume <code>factorial(n - 1)</code> already works and ask only: "how do I use it to get <code>factorial(n)</code>?"</p></div>`
    },
    {
      title: "The call stack and memoization",
      html: `
<p>Each call waits for the call it made to finish. Waiting calls pile up on the <strong>call stack</strong>, then unwind in reverse order:</p>
<pre><code class="language-javascript">factorial(4)
  4 * factorial(3)
        3 * factorial(2)
              2 * factorial(1)
                    return 1          &lt;- base case: start unwinding
              return 2 * 1 = 2
        return 3 * 2 = 6
  return 4 * 6 = 24</code></pre>
<div class="callout warn"><p>The stack has a limit (around 10,000 calls). A missing base case, or one you never reach, throws
<code>RangeError: Maximum call stack size exceeded</code> - a <strong>stack overflow</strong>.</p></div>
<p><strong>Memoization</strong> means caching answers so each sub-problem is solved only once. Naive recursive Fibonacci recomputes the same values
millions of times (O(2<sup>n</sup>)). With a cache it is O(n):</p>
<pre><code class="language-javascript">function fib(n, memo = new Map()) {
  if (n &lt; 2) return n;
  if (memo.has(n)) return memo.get(n);          // already solved? reuse it
  const value = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, value);                           // remember for next time
  return value;
}</code></pre>`
    }
  ],

  examples: [
    {
      title: "Your first function: price with tax",
      code: `function priceWithTax(price, taxRate) {
  const tax = price * taxRate;
  return price + tax;
}

console.log("Laptop:", priceWithTax(1000, 0.2));
console.log("Book:  ", priceWithTax(20, 0.05));

// The returned value can be used in further calculations
const total = priceWithTax(1000, 0.2) + priceWithTax(20, 0.05);
console.log("Basket total:", total);`,
      explain: `
<ol>
  <li><code>price</code> and <code>taxRate</code> are <strong>parameters</strong>; <code>1000</code> and <code>0.2</code> are the <strong>arguments</strong> for the first call.</li>
  <li><code>return</code> hands the result back, so we can add two calls together.</li>
  <li><code>tax</code> only exists inside the function - it's a local variable.</li>
  <li><strong>Try it:</strong> give <code>taxRate</code> a default of <code>0.2</code> and call <code>priceWithTax(50)</code>.</li>
</ol>`
    },
    {
      title: "Three ways to write the same function",
      code: `console.log(fullNameA("Ada", "Lovelace"));   // works: declarations are hoisted

function fullNameA(first, last) {
  return first + " " + last;
}

const fullNameB = function (first, last) {
  return first + " " + last;
};

const fullNameC = (first, last) => first + " " + last;

console.log(fullNameB("Alan", "Turing"));
console.log(fullNameC("Grace", "Hopper"));`,
      explain: `
<ol>
  <li>All three do the same job. Only the <strong>declaration</strong> can be called before its line (hoisting).</li>
  <li>The arrow version has no braces, so its single expression is returned automatically.</li>
  <li><strong>Try it:</strong> move the <code>fullNameC</code> call above its definition and read the error.</li>
</ol>`
    },
    {
      title: "Default parameters, rest and spread",
      code: `function shippingCost(weightKg, express = false) {
  const base = weightKg * 2;
  return express ? base * 2 : base;
}
console.log("Standard 3kg:", shippingCost(3));
console.log("Express 3kg: ", shippingCost(3, true));

function average(...scores) {        // rest: any number of arguments -> array
  if (scores.length === 0) return 0;
  let sum = 0;
  for (const s of scores) sum += s;
  return sum / scores.length;
}
console.log("Average:", average(70, 85, 90));

const results = [64, 99, 78];
console.log("Best:", Math.max(...results));   // spread: array -> separate arguments`,
      explain: `
<ol>
  <li><code>express = false</code> is used whenever the caller leaves it out.</li>
  <li><code>...scores</code> packs <code>70, 85, 90</code> into the array <code>[70, 85, 90]</code>.</li>
  <li><code>Math.max(...results)</code> unpacks the array into <code>Math.max(64, 99, 78)</code>.</li>
  <li><strong>Try it:</strong> call <code>average()</code> with no arguments - why is the length check important?</li>
</ol>`
    },
    {
      title: "return vs console.log",
      code: `function showDouble(x) {
  console.log("showDouble prints", x * 2);
}
function getDouble(x) {
  return x * 2;
}

const a = showDouble(5);
const b = getDouble(5);
console.log("a =", a);
console.log("b =", b);
console.log("b + 1 =", b + 1);`,
      explain: `
<table>
  <tr><th>Call</th><th>Prints?</th><th>Gives back</th></tr>
  <tr><td><code>showDouble(5)</code></td><td>yes</td><td><code>undefined</code></td></tr>
  <tr><td><code>getDouble(5)</code></td><td>no</td><td><code>10</code></td></tr>
</table>
<p>Only the returned value can be stored and reused. That's why exercises always ask you to <strong>return</strong>.</p>`
    },
    {
      title: "Scope: block vs function",
      code: `const company = "Acme";             // global: visible everywhere below

function report() {
  const dept = "Sales";             // local to report()
  if (true) {
    let quarter = "Q1";             // only inside this if-block
    var year = 2025;                // var leaks to the whole function
    console.log(company, dept, quarter, year);
  }
  console.log("after the block: year =", year);
  console.log("quarter visible?", typeof quarter !== "undefined");
}
report();`,
      explain: `
<ol>
  <li>Inside the block, every name is found by looking outwards: block &rarr; function &rarr; global.</li>
  <li>After the block, <code>year</code> (a <code>var</code>) still exists, but <code>quarter</code> (a <code>let</code>) is gone.</li>
  <li><code>typeof</code> is used because reading a missing variable directly would throw.</li>
  <li><strong>Try it:</strong> change <code>var year</code> to <code>let year</code>. What happens to the second log?</li>
</ol>`
    },
    {
      title: "Closure: an invoice number generator",
      code: `function makeInvoiceNumbers(prefix) {
  let next = 1;                       // private state
  return function () {
    const id = prefix + "-" + String(next).padStart(4, "0");
    next++;
    return id;
  };
}

const ukInvoices = makeInvoiceNumbers("UK");
const usInvoices = makeInvoiceNumbers("US");

console.log(ukInvoices());
console.log(ukInvoices());
console.log(usInvoices());
console.log(ukInvoices());`,
      explain: `
<ol>
  <li>Each call to <code>makeInvoiceNumbers</code> creates a <strong>new</strong> <code>next</code> variable.</li>
  <li>The returned function remembers its own <code>next</code> and <code>prefix</code> - that's the closure.</li>
  <li>UK and US counters are independent: UK-0001, UK-0002, US-0001, UK-0003.</li>
  <li><strong>Try it:</strong> notice nobody outside can reset <code>next</code> - add a second returned function if you want that ability.</li>
</ol>`
    },
    {
      title: "map, filter and reduce on real orders",
      code: `const orders = [
  { customer: "Ana", total: 120, paid: true },
  { customer: "Ben", total: 45, paid: false },
  { customer: "Chen", total: 300, paid: true },
  { customer: "Dina", total: 80, paid: true }
];

const paid = orders.filter(o => o.paid);                 // keep paid ones
const totals = paid.map(o => o.total);                    // just the numbers
const revenue = totals.reduce((sum, t) => sum + t, 0);    // add them up

console.log("Paid customers:", paid.map(o => o.customer).join(", "));
console.log("Totals:", totals.join(", "));
console.log("Revenue:", revenue);`,
      explain: `
<ol>
  <li><code>filter</code> keeps orders where the function returns <code>true</code> &rarr; Ana, Chen, Dina.</li>
  <li><code>map</code> turns each order into its total &rarr; [120, 300, 80].</li>
  <li><code>reduce</code> starts at <code>0</code> and folds each total into the running sum &rarr; 500.</li>
  <li><strong>Try it:</strong> chain all three in one expression: <code>orders.filter(...).map(...).reduce(...)</code>.</li>
</ol>`
    },
    {
      title: "Sorting with a comparator",
      code: `const staff = [
  { name: "Zoe", dept: "IT", salary: 5200 },
  { name: "Adam", dept: "HR", salary: 4100 },
  { name: "Mia", dept: "IT", salary: 5200 },
  { name: "Liam", dept: "Sales", salary: 3900 }
];

// Highest salary first; ties broken alphabetically by name
const ranked = [...staff].sort((a, b) => {
  if (a.salary !== b.salary) return b.salary - a.salary;
  return a.name.localeCompare(b.name);
});

for (const p of ranked) console.log(p.salary, p.name);
console.log("Original first:", staff[0].name);   // unchanged thanks to [...staff]`,
      explain: `
<ol>
  <li><code>b.salary - a.salary</code> is negative when <code>a</code> earns more, so <code>a</code> comes first: <strong>descending</strong>.</li>
  <li>When salaries tie, <code>localeCompare</code> orders names A-Z (Mia before Zoe).</li>
  <li><code>[...staff]</code> copies the array, because <code>sort</code> changes the array it is called on.</li>
  <li><strong>Try it:</strong> sort by department first, then by salary.</li>
</ol>`
    },
    {
      title: "Watch recursion on the call stack",
      code: `function factorial(n, depth = 0) {
  const indent = "  ".repeat(depth);
  console.log(indent + "factorial(" + n + ") called");
  if (n <= 1) {
    console.log(indent + "base case -> 1");
    return 1;
  }
  const result = n * factorial(n - 1, depth + 1);
  console.log(indent + "factorial(" + n + ") returns " + result);
  return result;
}

console.log("Answer:", factorial(4));`,
      explain: `
<ol>
  <li>Calls go <strong>down</strong> (more indentation) until <code>n</code> reaches 1, the base case.</li>
  <li>Then the answers come back <strong>up</strong>: 1 &rarr; 2 &rarr; 6 &rarr; 24, each waiting call finishing its multiplication.</li>
  <li><code>depth</code> is only there to indent the output, so you can see the stack.</li>
  <li><strong>Try it:</strong> remove the base case and run it - you'll get a stack overflow.</li>
</ol>`
    },
    {
      title: "Recursion on nested data + memoization speed-up",
      code: `// 1) Recursion fits nested data: total size of a folder tree
const folder = {
  name: "root", size: 2,
  children: [
    { name: "docs", size: 5, children: [{ name: "cv.pdf", size: 3, children: [] }] },
    { name: "photo.jpg", size: 8, children: [] }
  ]
};
function totalSize(node) {
  let sum = node.size;
  for (const child of node.children) sum += totalSize(child);   // same problem, smaller
  return sum;
}
console.log("Total size:", totalSize(folder));

// 2) Memoization: count the work done by naive vs cached Fibonacci
let calls = 0;
function slowFib(n) { calls++; return n < 2 ? n : slowFib(n - 1) + slowFib(n - 2); }
slowFib(25);
console.log("Naive fib(25) calls:", calls);

calls = 0;
function fastFib(n, memo = new Map()) {
  calls++;
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const v = fastFib(n - 1, memo) + fastFib(n - 2, memo);
  memo.set(n, v);
  return v;
}
console.log("fastFib(25) =", fastFib(25), "with", calls, "calls");`,
      explain: `
<ol>
  <li><code>totalSize</code>: a node's size plus the total size of each child. Leaves (no children) are the natural base case: 2 + 5 + 3 + 8 = 18.</li>
  <li>Naive <code>slowFib(25)</code> makes about 240,000 calls because it recomputes the same values over and over.</li>
  <li><code>fastFib</code> stores each answer in a <code>Map</code> and makes fewer than 50 calls.</li>
  <li><strong>Try it:</strong> raise both to 30 and compare the call counts again.</li>
</ol>`
    }
  ],

  pitfalls: [
    "Forgetting <code>return</code>: the caller receives <code>undefined</code>. Arrow functions with braces need an explicit <code>return</code> too.",
    "Logging instead of returning: <code>console.log</code> is for humans, <code>return</code> is for code.",
    "A recursive function with no base case (or one it never reaches) causes <code>RangeError: Maximum call stack size exceeded</code>.",
    "Each recursive call must work on a <strong>smaller</strong> input - <code>f(n)</code> calling <code>f(n)</code> never ends.",
    "Passing vs calling: <code>arr.map(double)</code> passes the function; <code>arr.map(double())</code> calls it once and passes its result.",
    "<code>sort()</code> without a comparator sorts numbers as text, and it <strong>changes</strong> the original array.",
    "Default parameters only apply for <code>undefined</code> - passing <code>null</code> or <code>0</code> does not trigger them.",
    "Changing an argument inside a helper (e.g. <code>arr.push</code>) surprises the caller. Return a new value instead."
  ],

  quiz: [
    {
      q: "What does this print?",
      code: `function add(a, b) {
  a + b;
}
console.log("Result: " + add(2, 3));`,
      options: ["Result: 5", "Result: undefined", "Result: NaN", "An error"],
      answer: 1,
      output: "Result: undefined",
      explain: "<p>The function calculates <code>a + b</code> but never <strong>returns</strong> it, so the value is thrown away and the call gives back <code>undefined</code>. Add <code>return</code> in front of <code>a + b</code> to fix it.</p>"
    },
    {
      q: "What does this print?",
      code: `function greet(name = "Guest") {
  return "Hi " + name;
}
console.log(greet(undefined));
console.log(greet(null));`,
      options: ["Hi Guest / Hi Guest", "Hi Guest / Hi null", "Hi undefined / Hi null", "Hi Guest / Hi"],
      answer: 1,
      output: "Hi Guest\nHi null",
      explain: "<p>Defaults are used only when the argument is <code>undefined</code> (missing). <code>null</code> is a real value meaning \"deliberately empty\", so it is used as-is and printed as <code>null</code>.</p>"
    },
    {
      q: "What does this print?",
      code: `function makeCounter() {
  let n = 0;
  return () => ++n;
}
const a = makeCounter();
const b = makeCounter();
a();
a();
console.log(a(), b());`,
      options: ["3 3", "3 1", "1 1", "2 1"],
      answer: 1,
      output: "3 1",
      explain: "<p>Each call to <code>makeCounter</code> creates its <strong>own</strong> <code>n</code>. Counter <code>a</code> was called twice before, so the third call gives 3. Counter <code>b</code> has its own fresh <code>n</code> and gives 1. That separate, remembered state is a closure.</p>"
    },
    {
      q: "What does this print?",
      code: `console.log([10, 9, 1].sort().join(","));`,
      options: ["1,9,10", "10,9,1", "1,10,9", "9,10,1"],
      answer: 2,
      output: "1,10,9",
      explain: "<p>Without a comparator, <code>sort</code> converts items to text and sorts alphabetically: <code>\"1\" &lt; \"10\" &lt; \"9\"</code> (just like \"a\" &lt; \"ab\" &lt; \"b\"). For numbers always pass <code>(a, b) =&gt; a - b</code>.</p>"
    },
    {
      q: "What does this print?",
      code: `function sum(n) {
  if (n === 0) return 0;
  return n + sum(n - 1);
}
console.log(sum(4));`,
      options: ["4", "10", "24", "Stack overflow"],
      answer: 1,
      output: "10",
      explain: "<p>Unwind it: <code>sum(4) = 4 + sum(3) = 4 + 3 + sum(2) = 4 + 3 + 2 + 1 + sum(0)</code>, and <code>sum(0)</code> is the base case 0. Total: <strong>10</strong>. It would multiply to 24 only if the code used <code>*</code>.</p>"
    },
    {
      q: "A recursive function throws <em>\"Maximum call stack size exceeded\"</em>. What is the most likely cause?",
      options: [
        "A syntax error in the function",
        "The base case is missing or never reached",
        "The function returns a string",
        "The function uses <code>const</code> instead of <code>let</code>"
      ],
      answer: 1,
      explain: "<p>Every call adds a frame to the call stack. If the input never shrinks to the base case, calls pile up until the stack runs out of room. Check that (1) a base case exists and (2) each call moves closer to it.</p>"
    },
    {
      q: "Which call can safely appear <strong>above</strong> the line where the function is defined?",
      options: [
        "<code>function total() {...}</code> (declaration)",
        "<code>const total = function () {...}</code> (expression)",
        "<code>const total = () =&gt; {...}</code> (arrow)",
        "None of them"
      ],
      answer: 0,
      explain: "<p>Function <strong>declarations</strong> are hoisted completely, so they can be called earlier in the file. Expressions and arrows are stored in <code>const</code> variables, which can't be used before their line.</p>"
    }
  ],

  interview: [
    { q: "What is the difference between a parameter and an argument?",
      a: "<p>A parameter is the variable name in the function definition (<code>function f(x)</code>). An argument is the actual value supplied when you call it (<code>f(5)</code>).</p>" },
    { q: "What is a closure? Give a practical use.",
      a: "<p>A closure is a function together with the variables from the scope where it was created; it keeps access to them after the outer function returns. Uses: private state (counters, ID generators), function factories like <code>makeDiscount(0.1)</code>, event handlers that remember data, and memoization caches.</p>" },
    { q: "What is hoisting?",
      a: "<p>Before running code, JavaScript registers declarations. <code>function</code> declarations are fully hoisted, so you can call them earlier in the file. <code>var</code> is hoisted but starts as <code>undefined</code>. <code>let</code>/<code>const</code> exist but can't be touched before their line (the \"temporal dead zone\") - doing so throws a ReferenceError.</p>" },
    { q: "What two parts does every recursive function need?",
      a: "<p>A <strong>base case</strong> that returns without recursing, and a <strong>recursive case</strong> that calls itself on a strictly smaller input. Without them the calls never stop and the call stack overflows.</p>" },
    { q: "Recursion or iteration - which would you choose?",
      a: "<p>Anything recursive can be written with a loop (plus an explicit stack if needed). I use recursion when the data or problem is tree-shaped - nested arrays, folders, org charts, divide and conquer - because the code mirrors the structure. I use loops for simple linear work and when depth could exceed the stack limit.</p>" },
    { q: "How does memoization speed up recursive Fibonacci?",
      a: "<p>Naive <code>fib(n)</code> recomputes the same sub-results exponentially many times: O(2<sup>n</sup>). Storing each <code>fib(k)</code> in a Map means each value is computed once: O(n) time, at the cost of O(n) memory.</p>" }
  ],

  exercises: [
    {
      id: "price-with-tax",
      title: "Warm-up: priceWithTax (default parameter)",
      difficulty: "easy",
      prompt: "<p>Return the price including tax: <code>price + price &times; taxRate</code>. If no tax rate is given, use <strong>0.1</strong> (10%).</p><p><code>priceWithTax(100) &rarr; 110</code> &nbsp; <code>priceWithTax(50, 0.2) &rarr; 60</code> &nbsp; <code>priceWithTax(80, 0) &rarr; 80</code></p>",
      starter: `function priceWithTax(price, taxRate) {
  // your code here
}`,
      solution: `function priceWithTax(price, taxRate = 0.1) {   // default used when taxRate is missing
  return price + price * taxRate;
}`,
      hint: "Give the parameter a default right in the signature: <code>function priceWithTax(price, taxRate = 0.1)</code>. Then just return the formula.",
      tests: [
        { expr: "priceWithTax(100)", expected: 110, label: "default rate 0.1" },
        { expr: "priceWithTax(50, 0.2)", expected: 60 },
        { expr: "priceWithTax(80, 0)", expected: 80, label: "a rate of 0 is respected (not replaced by the default)" },
        { expr: "priceWithTax(0)", expected: 0 }
      ]
    },
    {
      id: "sum-all",
      title: "Warm-up: sumAll (rest parameter)",
      difficulty: "easy",
      prompt: "<p>Accept <strong>any number</strong> of numbers and return their sum. With no arguments, return <code>0</code>.</p><p><code>sumAll(1, 2, 3) &rarr; 6</code> &nbsp; <code>sumAll(10) &rarr; 10</code> &nbsp; <code>sumAll() &rarr; 0</code></p>",
      starter: `function sumAll() {
  // your code here
}`,
      solution: `function sumAll(...nums) {     // rest: all arguments packed into an array
  let total = 0;
  for (const n of nums) total += n;
  return total;
}`,
      hint: "Change the signature to <code>function sumAll(...nums)</code>. Now <code>nums</code> is a normal array you can loop over with an accumulator.",
      tests: [
        { expr: "sumAll(1, 2, 3)", expected: 6 },
        { expr: "sumAll(10)", expected: 10 },
        { expr: "sumAll()", expected: 0, label: "no arguments -> 0" },
        { expr: "sumAll(-5, 5, -10)", expected: -10 },
        { expr: "sumAll(...[4, 4, 4])", expected: 12, label: "works with spread" }
      ]
    },
    {
      id: "apply-n-times",
      title: "applyNTimes",
      difficulty: "easy",
      prompt: "<p>Apply function <code>f</code> to <code>x</code> exactly <code>n</code> times, feeding each result back in, and return the final value. <code>n = 0</code> returns <code>x</code> unchanged.</p><p><code>applyNTimes(x =&gt; x * 2, 3, 1) &rarr; 8</code> (1 &rarr; 2 &rarr; 4 &rarr; 8) &nbsp; <code>applyNTimes(s =&gt; s + \"!\", 2, \"hi\") &rarr; \"hi!!\"</code> &nbsp; <code>applyNTimes(f, 0, 5) &rarr; 5</code></p>",
      starter: `function applyNTimes(f, n, x) {
  // your code here
}`,
      solution: `function applyNTimes(f, n, x) {
  let result = x;
  for (let i = 0; i < n; i++) {
    result = f(result);     // each output becomes the next input
  }
  return result;
}`,
      hint: "<code>f</code> is just a variable holding a function - call it like <code>f(value)</code>. Keep a running <code>result</code> and replace it with <code>f(result)</code> n times.",
      tests: [
        { expr: "applyNTimes(x => x * 2, 3, 1)", expected: 8 },
        { expr: "applyNTimes(x => x + 10, 0, 5)", expected: 5, label: "n = 0 returns x" },
        { expr: "applyNTimes(x => x - 1, 1, 0)", expected: -1 },
        { expr: "applyNTimes(s => s + \"!\", 3, \"hi\")", expected: "hi!!!" }
      ]
    },
    {
      id: "compose",
      title: "compose",
      difficulty: "medium",
      prompt: "<p>Return a <strong>new function</strong> that applies the given functions <strong>right to left</strong>: <code>compose(f, g, h)(x)</code> equals <code>f(g(h(x)))</code>. With no functions, return a function that gives back its input unchanged.</p><p><code>compose(x =&gt; x + 1, x =&gt; x * 2)(5) &rarr; 11</code> (double first: 10, then add 1) &nbsp; <code>compose(x =&gt; x * 2, x =&gt; x + 1)(5) &rarr; 12</code> &nbsp; <code>compose()(42) &rarr; 42</code></p>",
      starter: `function compose(...fns) {
  // your code here
}`,
      solution: `function compose(...fns) {
  // Return a function; it remembers fns thanks to a closure.
  return function (x) {
    let value = x;
    for (let i = fns.length - 1; i >= 0; i--) {   // last function runs first
      value = fns[i](value);
    }
    return value;
  };
  // One-liner alternative: return x => fns.reduceRight((acc, fn) => fn(acc), x);
}`,
      hint: "You must <strong>return a function</strong>, e.g. <code>return function (x) { ... }</code>. Inside it, loop over <code>fns</code> from the <em>last</em> index down to 0, replacing the value with <code>fns[i](value)</code>.",
      explanation: "<p>This combines three ideas from the lesson: a <strong>rest parameter</strong> collects the functions, a <strong>closure</strong> lets the returned function remember them, and the loop is the <strong>accumulator</strong> pattern with a function call instead of <code>+</code>. With zero functions the loop doesn't run, so you get the input back for free.</p>",
      tests: [
        { expr: "compose(x => x + 1, x => x * 2)(5)", expected: 11, label: "f(g(x)): double first, then add 1" },
        { expr: "compose(x => x * 2, x => x + 1)(5)", expected: 12, label: "order matters" },
        { expr: "compose(s => s.toUpperCase(), s => s + \"!\", s => s.trim())(\"  hi \")", expected: "HI!" },
        { expr: "compose(Math.abs)(-7)", expected: 7, label: "single function" },
        { expr: "compose()(42)", expected: 42, label: "no functions -> identity" }
      ]
    },
    {
      id: "sort-by-length",
      title: "sortByLength",
      difficulty: "easy",
      prompt: "<p>Return a <strong>new</strong> array of words sorted from shortest to longest. Words of equal length keep their original order. Don't change the input array.</p><p><code>sortByLength([\"banana\", \"kiwi\", \"fig\"]) &rarr; [\"fig\", \"kiwi\", \"banana\"]</code> &nbsp; <code>sortByLength([\"bb\", \"a\", \"cc\"]) &rarr; [\"a\", \"bb\", \"cc\"]</code> &nbsp; <code>sortByLength([]) &rarr; []</code></p>",
      starter: `function sortByLength(words) {
  // your code here
}`,
      solution: `function sortByLength(words) {
  // 1) [...words] copies the array, because sort() changes what it sorts.
  // 2) The comparator returns negative when a is shorter -> a goes first.
  //    Array sort is stable, so equal lengths keep their original order.
  return [...words].sort((a, b) => a.length - b.length);
}`,
      hint: "Copy first with <code>[...words]</code>, then call <code>.sort((a, b) =&gt; ...)</code>. Return a negative number when <code>a</code> is shorter: <code>a.length - b.length</code> does exactly that.",
      explanation: "<p>The comparator contract: negative &rarr; <code>a</code> first, positive &rarr; <code>b</code> first, zero &rarr; keep order. Subtracting lengths gives all three cases in one expression. Sorting is O(n log n).</p>",
      tests: [
        { expr: "sortByLength([\"banana\", \"kiwi\", \"fig\"])", expected: ["fig", "kiwi", "banana"] },
        { expr: "sortByLength([])", expected: [] },
        { expr: "sortByLength([\"solo\"])", expected: ["solo"] },
        { expr: "sortByLength([\"bb\", \"a\", \"cc\", \"d\"])", expected: ["a", "d", "bb", "cc"], label: "ties keep original order" },
        { code: "const w = [\"ccc\", \"a\", \"bb\"]; sortByLength(w); return w;", expected: ["ccc", "a", "bb"], label: "input array is not modified" }
      ]
    },
    {
      id: "make-counter",
      title: "makeCounter (closure)",
      difficulty: "medium",
      prompt: "<p>Return an object with three methods that share a <strong>private</strong> count starting at <code>start</code> (default <code>0</code>):</p><ul><li><code>increment()</code> adds 1 and returns the new value</li><li><code>decrement()</code> subtracts 1 and returns the new value</li><li><code>reset()</code> goes back to <code>start</code> and returns it</li></ul><pre><code>const c = makeCounter(5);\nc.increment();  // 6\nc.increment();  // 7\nc.reset();      // 5</code></pre><p>Two counters must not share state, and the count must not be readable as a property (<code>c.count</code> is <code>undefined</code>).</p>",
      starter: `function makeCounter(start = 0) {
  // your code here
}`,
      solution: `function makeCounter(start = 0) {
  let count = start;            // private: lives in the closure, not on the object
  return {
    increment: () => ++count,   // ++count adds 1 THEN returns the new value
    decrement: () => --count,
    reset: () => {
      count = start;
      return count;
    }
  };
}`,
      hint: "Declare <code>let count = start;</code> inside <code>makeCounter</code>, then <code>return { increment: () =&gt; ..., decrement: ..., reset: ... }</code>. The arrows can read and change <code>count</code>, but it isn't a property of the object.",
      explanation: "<p>Every call to <code>makeCounter</code> runs the body again, creating a fresh <code>count</code> - so counters are independent. The returned arrow functions close over that variable. This \"private variable + public methods\" shape is the module pattern, used long before JavaScript had classes.</p>",
      tests: [
        { code: "const c = makeCounter(); c.increment(); c.increment(); return c.increment();", expected: 3 },
        { code: "const c = makeCounter(10); return c.decrement();", expected: 9, label: "custom start" },
        { code: "const c = makeCounter(5); c.increment(); c.increment(); return c.reset();", expected: 5, label: "reset returns start" },
        { code: "const c = makeCounter(); c.decrement(); return c.decrement();", expected: -2, label: "can go negative" },
        { code: "const a = makeCounter(), b = makeCounter(); a.increment(); a.increment(); return [a.increment(), b.increment()];", expected: [3, 1], label: "counters are independent" },
        { code: "const c = makeCounter(); c.increment(); return c.count;", expected: undefined, label: "count is private (not a property)" }
      ]
    },
    {
      id: "factorial-recursive",
      title: "factorial (recursive)",
      difficulty: "easy",
      prompt: "<p>Return <code>n!</code> using <strong>recursion</strong> - no loops. Remember <code>0! = 1</code> and <code>1! = 1</code>.</p><p><code>factorial(5) &rarr; 120</code> &nbsp; <code>factorial(1) &rarr; 1</code> &nbsp; <code>factorial(0) &rarr; 1</code></p>",
      starter: `function factorial(n) {
  // your code here
}`,
      solution: `function factorial(n) {
  if (n <= 1) return 1;          // base case: 0! and 1! are both 1
  return n * factorial(n - 1);   // recursive case: n! = n x (n-1)!
}`,
      hint: "Two lines. Base case: if <code>n &lt;= 1</code> return 1. Recursive case: return <code>n * factorial(n - 1)</code>. Trust that the smaller call works.",
      forbid: [{ pattern: "\\bfor\\b|\\bwhile\\b|\\breduce\\b", message: "Use recursion - no loops or reduce." }],
      tests: [
        { expr: "factorial(0)", expected: 1 },
        { expr: "factorial(1)", expected: 1 },
        { expr: "factorial(5)", expected: 120 },
        { expr: "factorial(12)", expected: 479001600 }
      ]
    },
    {
      id: "sum-array-recursive",
      title: "sumArray (recursive)",
      difficulty: "easy",
      prompt: "<p>Return the sum of an array of numbers using <strong>recursion</strong> - no loops, no <code>reduce</code>. An empty array sums to <code>0</code>.</p><p><code>sumArray([1, 2, 3]) &rarr; 6</code> &nbsp; <code>sumArray([42]) &rarr; 42</code> &nbsp; <code>sumArray([]) &rarr; 0</code></p>",
      starter: `function sumArray(arr) {
  // your code here
}`,
      solution: `function sumArray(arr, i = 0) {
  if (i >= arr.length) return 0;          // base case: no items left
  return arr[i] + sumArray(arr, i + 1);   // this item + sum of the rest
}`,
      hint: "Think: sum = first item + sum of the rest. Base case: an empty array returns 0. Easiest version: <code>arr[0] + sumArray(arr.slice(1))</code>. Faster version: add an index parameter <code>i = 0</code> instead of slicing.",
      explanation: "<p><code>arr[0] + sumArray(arr.slice(1))</code> is correct, but <code>slice</code> copies the rest of the array on every call - O(n<sup>2</sup>) work overall. Passing an index <code>i</code> (with default 0, so callers don't notice) keeps it O(n).</p>",
      forbid: [{ pattern: "\\bfor\\b|\\bwhile\\b|\\breduce\\b|forEach", message: "Use recursion - no loops, forEach or reduce." }],
      tests: [
        { expr: "sumArray([1, 2, 3])", expected: 6 },
        { expr: "sumArray([])", expected: 0, label: "empty array -> 0" },
        { expr: "sumArray([42])", expected: 42 },
        { expr: "sumArray([-5, 5, -10])", expected: -10 },
        { expr: "sumArray([0.1, 0.2])", expected: 0.3 }
      ]
    },
    {
      id: "power-recursive",
      title: "power (fast recursion)",
      difficulty: "medium",
      prompt: "<p>Return <code>base</code> raised to a non-negative whole number <code>exp</code>, using recursion. Don't use <code>**</code> or <code>Math.pow</code>.</p><p><code>power(2, 10) &rarr; 1024</code> &nbsp; <code>power(-2, 3) &rarr; -8</code> &nbsp; <code>power(5, 0) &rarr; 1</code></p><p>Interview bonus: make it O(log exp) using <code>b<sup>10</sup> = (b<sup>5</sup>)<sup>2</sup></code>. A test uses <code>exp = 5000</code>.</p>",
      starter: `function power(base, exp) {
  // your code here
}`,
      solution: `function power(base, exp) {
  if (exp === 0) return 1;                        // base case: b^0 = 1
  const half = power(base, Math.floor(exp / 2));  // solve half the problem ONCE
  if (exp % 2 === 0) return half * half;          // even: b^10 = b^5 * b^5
  return half * half * base;                      // odd:  b^11 = b^5 * b^5 * b
}`,
      hint: "Simple version: <code>base * power(base, exp - 1)</code> with base case <code>exp === 0</code> &rarr; 1. Fast version: compute <code>half = power(base, Math.floor(exp / 2))</code> once, then return <code>half * half</code> (times one extra <code>base</code> if exp is odd).",
      explanation: "<p>The simple version makes <code>exp</code> calls - 5,000 nested calls is close to the stack limit. Halving the exponent each time needs only about log<sub>2</sub>(5000) &asymp; 13 calls. This trick, <strong>fast exponentiation</strong>, is a classic divide-and-conquer interview answer. Note: store <code>half</code> in a variable - calling <code>power(...)</code> twice would undo the speed-up.</p>",
      forbid: [{ pattern: "\\*\\*|Math\\.pow|\\bfor\\b|\\bwhile\\b", message: "Use recursion - no **, Math.pow or loops." }],
      tests: [
        { expr: "power(2, 10)", expected: 1024 },
        { expr: "power(5, 0)", expected: 1, label: "anything to the 0 is 1" },
        { expr: "power(7, 1)", expected: 7 },
        { expr: "power(-2, 3)", expected: -8, label: "negative base, odd exponent" },
        { expr: "power(-3, 2)", expected: 9 },
        { expr: "power(1.5, 2)", expected: 2.25 },
        { expr: "power(1, 5000)", expected: 1, label: "large exponent does not overflow the stack" }
      ]
    },
    {
      id: "is-palindrome-recursive",
      title: "isPalindrome (recursive)",
      difficulty: "medium",
      prompt: "<p>Return <code>true</code> if string <code>s</code> reads the same forwards and backwards, using <strong>recursion</strong> (no loops, no <code>reverse</code>). Compare characters exactly - <code>\"A\"</code> and <code>\"a\"</code> are different.</p><p><code>\"racecar\" &rarr; true</code> &nbsp; <code>\"abba\" &rarr; true</code> &nbsp; <code>\"abca\" &rarr; false</code> &nbsp; <code>\"\" &rarr; true</code></p>",
      starter: `function isPalindrome(s) {
  // your code here
}`,
      solution: `function isPalindrome(s, lo = 0, hi = s.length - 1) {
  if (lo >= hi) return true;               // base case: 0 or 1 characters left
  if (s[lo] !== s[hi]) return false;       // outer pair differs -> not a palindrome
  return isPalindrome(s, lo + 1, hi - 1);  // outer pair matches -> check the inside
}`,
      hint: "Compare the first and last characters. If they differ, return false. If they match, the answer is whether the <em>middle</em> (<code>s.slice(1, -1)</code>) is a palindrome. Base case: length 0 or 1 &rarr; true.",
      explanation: "<p>Trace <code>\"racecar\"</code>: r=r &rarr; a=a &rarr; c=c &rarr; \"e\" (1 char) &rarr; true. Using two indexes <code>lo</code>/<code>hi</code> instead of <code>slice</code> avoids copying the string on every call, making it O(n) instead of O(n<sup>2</sup>).</p>",
      forbid: [{ pattern: "\\bfor\\b|\\bwhile\\b|reverse", message: "Use recursion - no loops or reverse()." }],
      tests: [
        { expr: "isPalindrome(\"racecar\")", expected: true },
        { expr: "isPalindrome(\"abba\")", expected: true, label: "even length" },
        { expr: "isPalindrome(\"abca\")", expected: false },
        { expr: "isPalindrome(\"\")", expected: true, label: "empty string" },
        { expr: "isPalindrome(\"x\")", expected: true },
        { expr: "isPalindrome(\"ab\")", expected: false },
        { expr: "isPalindrome(\"Abba\")", expected: false, label: "case-sensitive" }
      ]
    },
    {
      id: "flatten",
      title: "flatten (recursive)",
      difficulty: "hard",
      prompt: "<p>Flatten an array nested to <strong>any depth</strong> into one flat array, keeping the order. Don't use <code>.flat()</code>.</p><p><code>flatten([1, [2, [3, [4]], 5]]) &rarr; [1, 2, 3, 4, 5]</code> &nbsp; <code>flatten([[\"a\"], \"b\"]) &rarr; [\"a\", \"b\"]</code> &nbsp; <code>flatten([[], [[]]]) &rarr; []</code></p>",
      starter: `function flatten(arr) {
  // your code here
}`,
      solution: `function flatten(arr) {
  const out = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      // An inner array is the same problem, just smaller: flatten it,
      // then spread its values into our result.
      out.push(...flatten(item));
    } else {
      out.push(item);             // base case: a plain value is already flat
    }
  }
  return out;
}`,
      hint: "Loop over the items. Use <code>Array.isArray(item)</code> to decide: a plain value gets pushed as-is; an array gets flattened <em>recursively</em> and all its values are pushed (<code>out.push(...flatten(item))</code>).",
      explanation: "<p>You can't know the depth in advance, so plain nested loops won't work - recursion handles any depth naturally. Each value is visited once: O(total number of values). The same \"if it's a container, recurse; otherwise handle it\" shape walks folder trees, JSON and menus.</p>",
      forbid: [{ pattern: "\\.flat\\(|\\.flatMap\\(|toString|join", message: "Write the recursion yourself - no flat, flatMap or string tricks." }],
      tests: [
        { expr: "flatten([1, [2, [3, [4]], 5]])", expected: [1, 2, 3, 4, 5] },
        { expr: "flatten([])", expected: [] },
        { expr: "flatten([1, 2, 3])", expected: [1, 2, 3], label: "already flat" },
        { expr: "flatten([[], [[]], [[[]]]])", expected: [], label: "only empty arrays" },
        { expr: "flatten([[\"a\"], [[\"b\", [\"c\"]]], \"d\"])", expected: ["a", "b", "c", "d"] },
        { expr: "flatten([[[[[[[[[[7]]]]]]]]]])", expected: [7], label: "deep nesting" }
      ]
    },
    {
      id: "fib-memo",
      title: "fib with memoization",
      difficulty: "hard",
      prompt: "<p>Return the <code>n</code>-th Fibonacci number <strong>recursively</strong> (<code>fib(0) = 0</code>, <code>fib(1) = 1</code>, <code>fib(n) = fib(n-1) + fib(n-2)</code>), using memoization so that <code>fib(78)</code> returns instantly.</p><p><code>fib(2) &rarr; 1</code> &nbsp; <code>fib(10) &rarr; 55</code> &nbsp; <code>fib(30) &rarr; 832040</code></p>",
      starter: `function fib(n, memo = new Map()) {
  // your code here
}`,
      solution: `function fib(n, memo = new Map()) {
  if (n < 2) return n;                    // base cases: fib(0)=0, fib(1)=1
  if (memo.has(n)) return memo.get(n);    // solved before? reuse the answer
  const value = fib(n - 1, memo) + fib(n - 2, memo);   // share ONE memo
  memo.set(n, value);                     // remember it for later calls
  return value;
}`,
      hint: "Three steps: (1) base case <code>n &lt; 2</code> returns n; (2) if <code>memo.has(n)</code>, return <code>memo.get(n)</code>; (3) otherwise compute <code>fib(n - 1, memo) + fib(n - 2, memo)</code>, store it with <code>memo.set</code>, and return it. Pass the <strong>same</strong> memo down.",
      explanation: "<p>Without the cache, <code>fib(78)</code> would make about 10<sup>16</sup> calls - longer than you'd live. With it, each <code>n</code> from 2 to 78 is computed once: O(n) time and O(n) memory. Forgetting to pass <code>memo</code> to the recursive calls is the classic bug - each call would get a new empty Map and nothing would be reused. (78 is used because larger Fibonacci numbers exceed the precision of a JavaScript number.)</p>",
      forbid: [{ pattern: "\\bfor\\b|\\bwhile\\b", message: "Keep it recursive - the point is memoization, not a loop." }],
      tests: [
        { expr: "fib(0)", expected: 0 },
        { expr: "fib(1)", expected: 1 },
        { expr: "fib(2)", expected: 1 },
        { expr: "fib(10)", expected: 55 },
        { expr: "fib(30)", expected: 832040, maxMs: 100 },
        { expr: "fib(78)", expected: 8944394323791464, maxMs: 100, label: "fib(78) is fast (largest exact Fibonacci number in a JS Number)" }
      ]
    }
  ],

  takeaways: [
    "A function takes <strong>arguments</strong>, does one job and <strong>returns</strong> a value - <code>console.log</code> only displays.",
    "Defaults fill in missing arguments; <code>...rest</code> packs arguments into an array; <code>...spread</code> unpacks one.",
    "Prefer <code>const</code>/<code>let</code> (block scope); a <strong>closure</strong> lets an inner function remember outer variables.",
    "<code>map</code> transforms, <code>filter</code> keeps, <code>reduce</code> combines, <code>sort</code> needs a comparator for numbers.",
    "Recursion = <strong>base case</strong> + <strong>smaller recursive call</strong>; no base case means stack overflow.",
    "Memoization caches sub-results: naive Fibonacci O(2<sup>n</sup>) becomes O(n)."
  ]
});
