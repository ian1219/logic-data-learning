LDL.registerLesson({
  id: "02",
  title: "Conditionals & Loops",
  lang: "js",
  minutes: 60,
  goal: "Control the flow of your program: decide which code runs (if / switch) and how many times it runs (for / while). Most logic-round questions are just a loop with a clever condition inside.",

  analogy: `
<p>Think of a <strong>recipe</strong>. Some steps are <em>decisions</em>: "<strong>if</strong> the dough is sticky, add flour, <strong>otherwise</strong> keep kneading".
Other steps are <em>repetition</em>: "stir <strong>10 times</strong>" or "bake <strong>until</strong> golden brown".</p>
<p>Conditionals are the "if" steps. Loops are the "repeat" steps - either a fixed number of times (<code>for</code>) or until something changes (<code>while</code>).
With just these two ideas you can describe any process, from payroll to a FizzBuzz interview question.</p>`,

  objectives: [
    "Choose between paths with <code>if / else if / else</code>, <code>switch</code> and the ternary <code>? :</code>",
    "Repeat work with <code>for</code>, <code>while</code> and <code>do...while</code>, and pick the right one",
    "Loop over arrays with <code>for...of</code> and over objects with <code>for...in</code>",
    "Control a loop with <code>break</code> and <code>continue</code>",
    "Apply the classic loop patterns: accumulator, counter, best-so-far, building strings",
    "Solve exam favourites: FizzBuzz, primes, reversing digits, star patterns"
  ],

  realWorld: `
<ul>
  <li><strong>Business rules:</strong> discount tiers, tax bands, shipping zones - all <code>if / else if</code> chains.</li>
  <li><strong>Reports:</strong> "total sales this month", "how many orders were late" - an accumulator and a counter in a loop.</li>
  <li><strong>Data cleaning:</strong> loop over 10,000 rows, <code>continue</code> past blank ones, fix the rest.</li>
  <li><strong>Status handling:</strong> turning an order status code into a message is a textbook <code>switch</code>.</li>
  <li><strong>Interviews and logic exams:</strong> FizzBuzz, prime checks, palindromes and star patterns are asked constantly.</li>
</ul>`,

  sections: [
    {
      title: "Making decisions with if / else if / else",
      html: `
<p>An <code>if</code> statement runs a block of code <strong>only when</strong> a condition is true.
Add <code>else if</code> for more options and <code>else</code> as the "none of the above" case.</p>
<pre><code class="language-javascript">const age = 15;

if (age &lt; 12) {
  console.log("Child ticket");
} else if (age &lt; 65) {
  console.log("Adult ticket");     // runs: 15 is not &lt; 12, but is &lt; 65
} else {
  console.log("Senior ticket");
}</code></pre>
<p>JavaScript checks the conditions <strong>top to bottom</strong> and runs the <strong>first</strong> one that is true. The rest are skipped.</p>
<div class="callout key"><p>Order matters. Put the most specific (or highest) case first. If you check <code>score &gt;= 60</code> before <code>score &gt;= 90</code>, nobody ever gets an A.</p></div>`
    },
    {
      title: "switch and the ternary operator",
      html: `
<p>When you compare <strong>one value</strong> against many exact options, <code>switch</code> reads more cleanly than a long <code>if</code> chain.</p>
<pre><code class="language-javascript">switch (status) {
  case "paid":
    message = "Thanks for your order";
    break;                 // stop here
  case "shipped":
  case "delivered":        // two cases share one block
    message = "On its way or arrived";
    break;
  default:                 // like a final else
    message = "Unknown status";
}</code></pre>
<div class="callout warn"><p>Without <code>break</code>, JavaScript <strong>falls through</strong> and keeps running the next case's code too. Forgetting it is a classic bug.</p></div>
<p>The <strong>ternary operator</strong> <code>condition ? valueIfTrue : valueIfFalse</code> is a one-line <code>if/else</code> that produces a value:</p>
<pre><code class="language-javascript">const label = score &gt;= 50 ? "pass" : "fail";</code></pre>
<div class="callout tip"><p>Use the ternary for picking a <em>value</em>. For running several statements, a normal <code>if</code> is clearer.</p></div>`
    },
    {
      title: "Loops: for, while, do...while",
      html: `
<p>A <strong>loop</strong> repeats a block of code. Each repetition is called an <strong>iteration</strong>.</p>
<table>
  <tr><th>Loop</th><th>Use it when...</th><th>Example</th></tr>
  <tr><td><code>for</code></td><td>you know how many times</td><td>"for each of the 12 months"</td></tr>
  <tr><td><code>while</code></td><td>you repeat <em>until</em> something changes</td><td>"while savings &lt; goal"</td></tr>
  <tr><td><code>do...while</code></td><td>the body must run <strong>at least once</strong></td><td>"ask for a PIN, repeat while wrong"</td></tr>
</table>
<pre><code class="language-javascript">for (let i = 1; i &lt;= 3; i++) {   // start; keep going while; step
  console.log("Lap", i);          // Lap 1, Lap 2, Lap 3
}

let balance = 100;
while (balance &lt; 150) {          // checked BEFORE each iteration
  balance += 20;
}                                 // balance is now 160</code></pre>
<div class="callout warn"><p>Every <code>while</code> loop must change something its condition depends on. Otherwise the condition stays true forever: an <strong>infinite loop</strong>.</p></div>`
    },
    {
      title: "for...of, for...in, break and continue",
      html: `
<p>Two shortcut loops save you from managing an index yourself:</p>
<table>
  <tr><th>Loop</th><th>Gives you</th><th>On <code>["tea", "cake"]</code></th><th>Use for</th></tr>
  <tr><td><code>for (const x of list)</code></td><td>the <strong>values</strong></td><td><code>"tea"</code>, <code>"cake"</code></td><td>arrays, strings, Map, Set</td></tr>
  <tr><td><code>for (const k in obj)</code></td><td>the <strong>keys</strong> (as strings)</td><td><code>"0"</code>, <code>"1"</code></td><td>plain objects</td></tr>
</table>
<div class="callout tip"><p>Memory hook: <strong>of</strong> for arrays (items <em>of</em> a list), <strong>in</strong> for objects (keys <em>in</em> an object).</p></div>
<p>Two keywords change a loop's flow:</p>
<ul>
  <li><code>break</code> - <strong>leave the loop now</strong>. Great once you've found what you were searching for.</li>
  <li><code>continue</code> - <strong>skip the rest of this iteration</strong> and jump to the next one. Great for ignoring bad data.</li>
</ul>
<pre><code class="language-javascript">for (const order of orders) {
  if (order.cancelled) continue;   // ignore cancelled orders
  if (order.total &gt; 1000) break;   // stop at the first big one
  process(order);
}</code></pre>`
    },
    {
      title: "Loop patterns you will use forever",
      html: `
<p>Most loops you'll ever write follow one of a handful of patterns. Learn them by name:</p>
<table>
  <tr><th>Pattern</th><th>Question it answers</th><th>Skeleton</th></tr>
  <tr><td><strong>Accumulator</strong></td><td>"What is the total?"</td><td><code>let total = 0; for (const x of xs) total += x;</code></td></tr>
  <tr><td><strong>Counter</strong></td><td>"How many match?"</td><td><code>let count = 0; for (...) if (cond) count++;</code></td></tr>
  <tr><td><strong>Best so far</strong></td><td>"Which is biggest?"</td><td><code>let best = xs[0]; for (...) if (x &gt; best) best = x;</code></td></tr>
  <tr><td><strong>Search</strong></td><td>"Is there one?"</td><td><code>for (...) if (cond) { found = x; break; }</code></td></tr>
  <tr><td><strong>Build a result</strong></td><td>"Give me a new list"</td><td><code>const out = []; for (...) out.push(...);</code></td></tr>
  <tr><td><strong>Digit loop</strong></td><td>"Work on each digit"</td><td><code>while (n &gt; 0) { d = n % 10; n = Math.floor(n / 10); }</code></td></tr>
</table>
<div class="callout note"><p>For a <em>product</em> (like factorial) the accumulator starts at <code>1</code>, not <code>0</code> - anything times 0 is 0.</p></div>`
    },
    {
      title: "Nested loops and text patterns",
      html: `
<p>A <strong>nested loop</strong> is a loop inside a loop. The inner loop runs <strong>completely</strong> for every single turn of the outer loop -
like a clock: the minute hand goes round 60 times for every turn of the hour hand.</p>
<pre><code class="language-javascript">const lines = [];
for (let row = 1; row &lt;= 3; row++) {     // outer: one turn per row
  let line = "";
  for (let col = 1; col &lt;= row; col++) { // inner: row stars
    line += "*";
  }
  lines.push(line);
}
console.log(lines.join("\\n"));           // *  /  **  /  ***</code></pre>
<div class="callout tip"><p>Build pattern lines in an array and finish with <code>join("\\n")</code>. You get a testable string with no stray newline at the end.</p></div>
<div class="callout key"><p>Two nested loops over <code>n</code> items do <code>n &times; n</code> steps - O(n<sup>2</sup>). Fine for 1,000 items, painfully slow for 1,000,000.</p></div>`
    },
    {
      title: "Primes and the square-root trick",
      html: `
<p>A <strong>prime</strong> is a whole number above 1 that divides evenly only by 1 and itself: 2, 3, 5, 7, 11...</p>
<p>To test <code>n</code> you only need to try divisors up to <strong>&radic;n</strong>. Why? Divisors come in pairs: 36 = 4 &times; 9 = 6 &times; 6.
One of each pair is always &le; &radic;36 = 6, so if nothing up to 6 divides 36, nothing above will either.</p>
<pre><code class="language-javascript">function isPrime(n) {
  if (n &lt; 2) return false;               // 0, 1 and negatives are not prime
  for (let d = 2; d * d &lt;= n; d++) {     // d * d &lt;= n  means  d &lt;= sqrt(n)
    if (n % d === 0) return false;        // found a divisor: stop early
  }
  return true;
}</code></pre>
<div class="callout work"><p>For 1,000,003 this tries about 1,000 divisors instead of a million. That kind of "do less work" thinking is exactly what interviewers look for.</p></div>`
    }
  ],

  examples: [
    {
      title: "Ticket prices with if / else if / else",
      code: `function ticketPrice(age) {
  if (age < 3) {
    return 0;          // babies go free
  } else if (age < 12) {
    return 8;          // child
  } else if (age < 65) {
    return 15;         // adult
  } else {
    return 10;         // senior
  }
}

for (const age of [1, 7, 30, 70]) {
  console.log("Age", age, "pays $" + ticketPrice(age));
}`,
      explain: `
<ol>
  <li>For age 30: <code>30 &lt; 3</code> false, <code>30 &lt; 12</code> false, <code>30 &lt; 65</code> <strong>true</strong> &rarr; returns 15. The <code>else</code> is never looked at.</li>
  <li>Because each <code>else if</code> only runs when the ones above failed, we don't need to write <code>age &gt;= 12 &amp;&amp; age &lt; 65</code>.</li>
  <li><strong>Try it:</strong> add a "student" band for ages 18-25 paying $11. Where in the chain must it go?</li>
</ol>`
    },
    {
      title: "Order status messages with switch",
      code: `function statusMessage(status) {
  switch (status) {
    case "pending":
      return "We have received your order.";
    case "shipped":
    case "out-for-delivery":
      return "Your parcel is on its way.";
    case "delivered":
      return "Delivered. Enjoy!";
    default:
      return "Unknown status: " + status;
  }
}

for (const s of ["pending", "shipped", "out-for-delivery", "delivered", "lost"]) {
  console.log(s, "->", statusMessage(s));
}`,
      explain: `
<ol>
  <li><code>switch</code> compares <code>status</code> with each <code>case</code> using <code>===</code>.</li>
  <li><code>"shipped"</code> has no code of its own, so it falls through to the next case - two statuses share one message on purpose.</li>
  <li>Here <code>return</code> leaves the function, so no <code>break</code> is needed. Without <code>return</code>, you'd need <code>break</code> after each case.</li>
  <li><strong>Try it:</strong> add a <code>"cancelled"</code> case.</li>
</ol>`
    },
    {
      title: "Ternary: one-line labels",
      code: `const scores = { Ana: 82, Ben: 47, Chen: 50, Dina: 91 };

for (const name in scores) {
  const score = scores[name];
  const result = score >= 50 ? "PASS" : "FAIL";
  const star = score >= 90 ? " *" : "";
  console.log(name + ": " + score + " " + result + star);
}`,
      explain: `
<ol>
  <li><code>score &gt;= 50 ? "PASS" : "FAIL"</code> reads as "is score at least 50? then PASS, otherwise FAIL".</li>
  <li><code>for...in</code> gives us each <strong>key</strong> (the name); we look up the value with <code>scores[name]</code>.</li>
  <li>Chen scores exactly 50 and passes - boundaries are where bugs hide, so always test them.</li>
  <li><strong>Try it:</strong> change the pass mark to 60 and predict who fails.</li>
</ol>`
    },
    {
      title: "Accumulator: total of a shopping cart",
      code: `const cart = [
  { item: "Notebook", price: 4.5, qty: 3 },
  { item: "Pen", price: 1.2, qty: 10 },
  { item: "Backpack", price: 35, qty: 1 }
];

let total = 0;                 // 1) start the accumulator
for (const line of cart) {
  const lineTotal = line.price * line.qty;
  total += lineTotal;          // 2) add to it every iteration
  console.log(line.item, "x" + line.qty, "=", lineTotal.toFixed(2));
}
console.log("Cart total:", total.toFixed(2));   // 3) use it after the loop`,
      explain: `
<table>
  <tr><th>Iteration</th><th>lineTotal</th><th>total after</th></tr>
  <tr><td>Notebook</td><td>13.5</td><td>13.5</td></tr>
  <tr><td>Pen</td><td>12</td><td>25.5</td></tr>
  <tr><td>Backpack</td><td>35</td><td>60.5</td></tr>
</table>
<p>The accumulator lives <strong>outside</strong> the loop so it survives between iterations. <code>toFixed(2)</code> formats money with 2 decimals.
<strong>Try it:</strong> add a counter that counts items with <code>qty &gt; 1</code>.</p>`
    },
    {
      title: "while: how many months to reach a savings goal?",
      code: `let savings = 500;
const monthlyDeposit = 250;
const goal = 2000;
let months = 0;

while (savings < goal) {
  savings += monthlyDeposit;
  months++;
}
console.log("Goal reached after", months, "months with $" + savings);`,
      explain: `
<ol>
  <li>We don't know in advance how many months it takes - that's the sign to use <code>while</code>.</li>
  <li>Each iteration moves <code>savings</code> closer to the goal, so the loop is guaranteed to end.</li>
  <li>Trace: 500 &rarr; 750 &rarr; 1000 &rarr; 1250 &rarr; 1500 &rarr; 1750 &rarr; 2000 (6 months), then <code>2000 &lt; 2000</code> is false and the loop stops.</li>
  <li><strong>Try it:</strong> add 1% interest each month with <code>savings *= 1.01</code>.</li>
</ol>`
    },
    {
      title: "do...while: retry until it works",
      code: `// Pretend these are the PINs a user types, one per attempt
const attempts = ["1111", "4321", "1234", "9999"];
const correctPin = "1234";
let tries = 0;
let entered;

do {
  entered = attempts[tries];
  tries++;
  console.log("Attempt", tries + ":", entered, entered === correctPin ? "OK" : "wrong");
} while (entered !== correctPin && tries < 3);

console.log(entered === correctPin ? "Unlocked" : "Locked out");`,
      explain: `
<ol>
  <li>The body runs <strong>first</strong>, then the condition is checked. You always need at least one attempt, so <code>do...while</code> fits.</li>
  <li>The loop stops when the PIN is right <strong>or</strong> after 3 tries - two exit conditions joined with <code>&amp;&amp;</code>.</li>
  <li><strong>Try it:</strong> move <code>"1234"</code> to the end of the array. What is printed now?</li>
</ol>`
    },
    {
      title: "break and continue: cleaning order data",
      code: `const orders = [
  { id: 101, total: 40, status: "ok" },
  { id: 102, total: 0, status: "cancelled" },
  { id: 103, total: 75, status: "ok" },
  { id: 104, total: 1200, status: "ok" },
  { id: 105, total: 60, status: "ok" }
];

let revenue = 0;
for (const order of orders) {
  if (order.status === "cancelled") {
    console.log("Skipping cancelled order", order.id);
    continue;                       // jump straight to the next order
  }
  if (order.total > 1000) {
    console.log("Order", order.id, "needs manual review - stopping");
    break;                          // leave the loop completely
  }
  revenue += order.total;
}
console.log("Revenue before review:", revenue);`,
      explain: `
<ol>
  <li>Order 102: <code>continue</code> skips the rest of the body - it is never added to revenue.</li>
  <li>Order 104: <code>break</code> exits the loop, so order 105 is never even looked at.</li>
  <li>Revenue = 40 + 75 = 115.</li>
  <li><strong>Try it:</strong> replace <code>break</code> with <code>continue</code>. Now order 105 is counted too.</li>
</ol>`
    },
    {
      title: "Digit loop: reverse a number with maths only",
      code: `let n = 1234;
let reversed = 0;

while (n > 0) {
  const lastDigit = n % 10;              // peel off the last digit
  reversed = reversed * 10 + lastDigit;  // shift left and append it
  n = Math.floor(n / 10);                // drop the last digit
  console.log("n =", n, " reversed =", reversed);
}`,
      explain: `
<table>
  <tr><th>n before</th><th>lastDigit</th><th>reversed</th><th>n after</th></tr>
  <tr><td>1234</td><td>4</td><td>4</td><td>123</td></tr>
  <tr><td>123</td><td>3</td><td>43</td><td>12</td></tr>
  <tr><td>12</td><td>2</td><td>432</td><td>1</td></tr>
  <tr><td>1</td><td>1</td><td>4321</td><td>0 &rarr; stop</td></tr>
</table>
<p>Multiplying by 10 shifts every digit one place left, making room for the new last digit. This is the key step in the reverse-number and palindrome exercises.</p>`
    },
    {
      title: "Nested loops: star triangle and times table",
      code: `// 1) Right triangle of stars, built as one string
const lines = [];
for (let row = 1; row <= 4; row++) {
  lines.push("*".repeat(row));
}
console.log(lines.join("\\n"));

// 2) A 4 x 4 multiplication table
for (let i = 1; i <= 4; i++) {
  let rowText = "";
  for (let j = 1; j <= 4; j++) {
    rowText += String(i * j).padStart(4);
  }
  console.log(rowText);
}`,
      explain: `
<ol>
  <li>The triangle needs only one loop because <code>"*".repeat(row)</code> does the inner work for us.</li>
  <li>In the table, for <strong>each</strong> <code>i</code> the inner loop runs <code>j = 1..4</code> fully: 4 &times; 4 = 16 multiplications.</li>
  <li><code>padStart(4)</code> pads each number to 4 characters so the columns line up.</li>
  <li><strong>Try it:</strong> make the triangle upside down by counting <code>row</code> down from 4 to 1.</li>
</ol>`
    },
    {
      title: "Interview classic: primes up to 50",
      code: `function isPrime(n) {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) return false;   // a divisor exists -> not prime
  }
  return true;                        // loop finished with no divisor
}

const primes = [];
for (let n = 1; n <= 50; n++) {
  if (isPrime(n)) primes.push(n);
}
console.log("Primes up to 50:", primes.join(", "));
console.log("How many?", primes.length);`,
      explain: `
<ol>
  <li>For 49: try d = 2..7 (since 7 &times; 7 = 49). At d = 7, <code>49 % 7 === 0</code> &rarr; not prime.</li>
  <li>For 47: d goes 2..6 (7 &times; 7 = 49 &gt; 47 stops the loop) and nothing divides it &rarr; prime.</li>
  <li><code>return false</code> inside the loop acts like <code>break</code>: we stop as soon as we know the answer.</li>
  <li><strong>Try it:</strong> count how many primes there are below 1,000 (answer: 168).</li>
</ol>`
    }
  ],

  pitfalls: [
    "<strong>Off-by-one:</strong> <code>i &lt; n</code> stops at <code>n - 1</code>. For \"1 to n inclusive\" write <code>for (let i = 1; i &lt;= n; i++)</code>.",
    "In FizzBuzz-style problems check the <strong>most specific</strong> case (<code>% 15</code>) first, or 15 will become \"Fizz\".",
    "A <code>while</code> loop must change something its condition depends on - otherwise it never ends.",
    "Forgetting <code>break</code> in a <code>switch</code> makes execution fall through into the next case.",
    "<code>for...in</code> on an array gives <strong>string</strong> indexes (<code>\"0\" + 1</code> is <code>\"01\"</code>). Use <code>for...of</code> for arrays.",
    "<code>0</code>, <code>1</code> and negative numbers are <strong>not</strong> prime.",
    "Digit loops like <code>while (n &gt; 0)</code> never run for negative numbers - work on <code>Math.abs(n)</code> and put the sign back at the end.",
    "Return values from functions instead of <code>console.log</code>-ing them - only returned values can be tested and reused."
  ],

  quiz: [
    {
      q: "What does this print?",
      code: `let total = 0;
for (let i = 1; i <= 4; i++) {
  total += i;
}
console.log(total);`,
      options: ["4", "6", "10", "15"],
      answer: 2,
      output: "10",
      explain: "<p>This is the accumulator pattern: 0 + 1 + 2 + 3 + 4 = <strong>10</strong>. The loop includes 4 because the condition is <code>&lt;=</code>. With <code>&lt; 4</code> it would stop at 3 and print 6.</p>"
    },
    {
      q: "How many times does the body of <code>for (let i = 0; i &lt; 5; i++)</code> run?",
      options: ["4", "5", "6", "It depends on the body"],
      answer: 1,
      explain: "<p><code>i</code> takes the values 0, 1, 2, 3, 4 - that's <strong>5</strong> iterations. Starting at 0 and using <code>&lt; n</code> always gives exactly <code>n</code> iterations, which is why it's the standard way to loop over an array's indexes.</p>"
    },
    {
      q: "What does this print?",
      code: `const level = 2;
let msg = "";
switch (level) {
  case 1: msg += "A";
  case 2: msg += "B";
  case 3: msg += "C"; break;
  default: msg += "D";
}
console.log(msg);`,
      options: ["B", "BC", "BCD", "ABC"],
      answer: 1,
      output: "BC",
      explain: "<p>The switch jumps to <code>case 2</code> and adds \"B\". There's no <code>break</code>, so it <strong>falls through</strong> into case 3 and adds \"C\", then hits <code>break</code>. Fall-through is why every case usually ends with <code>break</code>.</p>"
    },
    {
      q: "What does this print?",
      code: `let out = "";
for (let i = 1; i <= 6; i++) {
  if (i === 3) continue;
  if (i === 5) break;
  out += i;
}
console.log(out);`,
      options: ["12456", "1245", "124", "12"],
      answer: 2,
      output: "124",
      explain: "<p>i = 1, 2 are added. At 3, <code>continue</code> skips the add. 4 is added. At 5, <code>break</code> ends the loop, so 5 and 6 never happen. Result: <strong>\"124\"</strong>.</p>"
    },
    {
      q: "What does this print?",
      code: `for (const i in ["x", "y"]) {
  console.log(i + 1);
}`,
      options: ["1 then 2", "01 then 11", "x1 then y1", "An error"],
      answer: 1,
      output: "01\n11",
      explain: "<p><code>for...in</code> gives the <strong>keys</strong> of the array, and keys are <strong>strings</strong>: <code>\"0\"</code> and <code>\"1\"</code>. <code>\"0\" + 1</code> joins text, giving <code>\"01\"</code>. Use <code>for...of</code> for values, or a classic <code>for</code> for numeric indexes.</p>"
    },
    {
      q: "A login screen must ask for a password and keep asking while it's wrong. Which loop fits best?",
      options: ["<code>for</code>", "<code>do...while</code>", "<code>for...in</code>", "<code>switch</code>"],
      answer: 1,
      explain: "<p>You must ask <strong>at least once</strong> before you can check anything, and you don't know how many attempts it will take. <code>do...while</code> runs the body first and checks afterwards - a perfect match.</p>"
    },
    {
      q: "What does this print?",
      code: `let count = 0;
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 4; col++) {
    count++;
  }
}
console.log(count);`,
      options: ["7", "12", "3", "4"],
      answer: 1,
      output: "12",
      explain: "<p>The inner loop runs 4 times for <strong>each</strong> of the 3 outer iterations: 3 &times; 4 = <strong>12</strong>. Nested loops multiply - which is why they become slow on big inputs.</p>"
    }
  ],

  interview: [
    { q: "What is the difference between <code>break</code> and <code>continue</code>?",
      a: "<p><code>break</code> leaves the loop entirely. <code>continue</code> skips the rest of the current iteration and moves on to the next one. Use <code>break</code> when you've found what you need, <code>continue</code> to ignore items you don't want.</p>" },
    { q: "When would you use <code>do...while</code> instead of <code>while</code>?",
      a: "<p>When the body must run at least once before the condition can be checked - for example \"show the menu, repeat while the user hasn't chosen Exit\".</p>" },
    { q: "Why does a prime check only need to go up to the square root of <code>n</code>?",
      a: "<p>Divisors come in pairs <code>a &times; b = n</code>. If both were bigger than &radic;n, their product would be bigger than n. So one of every pair is &le; &radic;n, and checking up to there is enough. That turns O(n) into O(&radic;n).</p>" },
    { q: "How do you reverse an integer without converting it to a string?",
      a: "<p>Repeatedly take the last digit and append it: <code>rev = rev * 10 + n % 10; n = Math.floor(n / 10);</code> until <code>n</code> is 0. Handle a negative sign separately.</p>" },
    { q: "Walk me through FizzBuzz and the most common mistake.",
      a: "<p>Loop from 1 to n. If divisible by 15 output FizzBuzz, else if by 3 Fizz, else if by 5 Buzz, else the number. The classic bug is checking 3 before 15, which makes 15 print \"Fizz\" - the most specific condition must come first.</p>" },
    { q: "What is the time complexity of two nested loops over <code>n</code> items?",
      a: "<p>O(n<sup>2</sup>): the inner loop runs n times for each of n outer iterations. Fine for n = 1,000, far too slow for n = 1,000,000. A common follow-up is removing the inner loop with a Set or Map (lesson 07).</p>" }
  ],

  exercises: [
    {
      id: "grade-letter",
      title: "gradeLetter",
      difficulty: "easy",
      prompt: "<p>Turn an exam score (0-100) into a letter grade: <strong>90+</strong> &rarr; <code>\"A\"</code>, <strong>80+</strong> &rarr; <code>\"B\"</code>, <strong>70+</strong> &rarr; <code>\"C\"</code>, <strong>60+</strong> &rarr; <code>\"D\"</code>, anything lower &rarr; <code>\"F\"</code>.</p><p><code>gradeLetter(95) &rarr; \"A\"</code> &nbsp; <code>gradeLetter(85) &rarr; \"B\"</code> &nbsp; <code>gradeLetter(90) &rarr; \"A\"</code> &nbsp; <code>gradeLetter(42) &rarr; \"F\"</code></p>",
      starter: `function gradeLetter(score) {
  // your code here
}`,
      solution: `function gradeLetter(score) {
  // Check the highest band first. Each else-if only runs
  // when every condition above it was false.
  if (score >= 90) return "A";
  else if (score >= 80) return "B";
  else if (score >= 70) return "C";
  else if (score >= 60) return "D";
  return "F";   // nothing matched
}`,
      hint: "Start with <code>if (score &gt;= 90) return \"A\";</code>. Once you know the score is not 90+, a plain <code>score &gt;= 80</code> is enough for a B - you don't need an upper limit.",
      tests: [
        { expr: "gradeLetter(95)", expected: "A" },
        { expr: "gradeLetter(90)", expected: "A", label: "boundary 90 is an A" },
        { expr: "gradeLetter(89)", expected: "B" },
        { expr: "gradeLetter(70)", expected: "C" },
        { expr: "gradeLetter(60)", expected: "D" },
        { expr: "gradeLetter(59)", expected: "F" },
        { expr: "gradeLetter(0)", expected: "F" }
      ]
    },
    {
      id: "sum-to-n",
      title: "sumToN",
      difficulty: "easy",
      prompt: "<p>Return <code>1 + 2 + ... + n</code> using a loop. If <code>n</code> is 0 or negative, return <code>0</code>.</p><p><code>sumToN(5) &rarr; 15</code> (1+2+3+4+5) &nbsp; <code>sumToN(1) &rarr; 1</code> &nbsp; <code>sumToN(0) &rarr; 0</code></p>",
      starter: `function sumToN(n) {
  // your code here
}`,
      solution: `function sumToN(n) {
  let total = 0;                    // accumulator starts empty
  for (let i = 1; i <= n; i++) {    // <= so that n itself is included
    total += i;
  }
  return total;                     // if n <= 0 the loop never runs -> 0
}`,
      hint: "Accumulator pattern: <code>let total = 0</code>, then a <code>for</code> loop from 1 up to <strong>and including</strong> n that adds <code>i</code>. Negative n needs no special code - the loop simply won't run.",
      explanation: "<p>Bonus: the young Gauss noticed 1 + 100 = 2 + 99 = ... so the sum is <code>n * (n + 1) / 2</code> - an O(1) formula. Interviewers love this follow-up.</p>",
      tests: [
        { expr: "sumToN(5)", expected: 15 },
        { expr: "sumToN(1)", expected: 1 },
        { expr: "sumToN(100)", expected: 5050 },
        { expr: "sumToN(0)", expected: 0 },
        { expr: "sumToN(-4)", expected: 0, label: "negative n -> 0" }
      ]
    },
    {
      id: "factorial-iterative",
      title: "factorial (iterative)",
      difficulty: "easy",
      prompt: "<p>Return <code>n!</code> (\"n factorial\") = <code>1 &times; 2 &times; ... &times; n</code>, using a loop. By definition <code>0! = 1</code>.</p><p><code>factorial(5) &rarr; 120</code> &nbsp; <code>factorial(1) &rarr; 1</code> &nbsp; <code>factorial(0) &rarr; 1</code></p>",
      starter: `function factorial(n) {
  // your code here
}`,
      solution: `function factorial(n) {
  let result = 1;                   // multiplying: start at 1, not 0
  for (let i = 2; i <= n; i++) {    // multiplying by 1 changes nothing, so start at 2
    result *= i;
  }
  return result;                    // for n = 0 or 1 the loop never runs -> 1
}`,
      hint: "Same shape as sumToN, but multiply instead of add. What starting value makes <code>factorial(0)</code> come out as 1 without any special case?",
      tests: [
        { expr: "factorial(0)", expected: 1 },
        { expr: "factorial(1)", expected: 1 },
        { expr: "factorial(5)", expected: 120 },
        { expr: "factorial(10)", expected: 3628800 }
      ]
    },
    {
      id: "fizzbuzz-array",
      title: "fizzBuzz array",
      difficulty: "easy",
      prompt: "<p>Return an array of strings for every number from 1 to n (inclusive): <code>\"FizzBuzz\"</code> if divisible by 3 and 5, <code>\"Fizz\"</code> if by 3, <code>\"Buzz\"</code> if by 5, otherwise the number as a string.</p><p><code>fizzBuzz(5) &rarr; [\"1\", \"2\", \"Fizz\", \"4\", \"Buzz\"]</code> &nbsp; <code>fizzBuzz(1) &rarr; [\"1\"]</code> &nbsp; <code>fizzBuzz(0) &rarr; []</code></p>",
      starter: `function fizzBuzz(n) {
  // your code here
}`,
      solution: `function fizzBuzz(n) {
  const out = [];                        // build-a-result pattern
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) out.push("FizzBuzz");   // most specific first!
    else if (i % 3 === 0) out.push("Fizz");
    else if (i % 5 === 0) out.push("Buzz");
    else out.push(String(i));                 // numbers become strings
  }
  return out;
}`,
      hint: "Create an empty array, loop i from 1 to n, push exactly one string per i. Test <code>i % 15</code> before <code>% 3</code> and <code>% 5</code>, and use <code>String(i)</code> for plain numbers.",
      explanation: "<p>Divisible by 3 <em>and</em> 5 is the same as divisible by 15, because 3 and 5 share no factors. Checking it first stops 15 from being caught by the \"Fizz\" branch.</p>",
      tests: [
        { expr: "fizzBuzz(0)", expected: [], label: "n = 0 -> empty array" },
        { expr: "fizzBuzz(1)", expected: ["1"] },
        { expr: "fizzBuzz(5)", expected: ["1", "2", "Fizz", "4", "Buzz"] },
        { expr: "fizzBuzz(15)[14]", expected: "FizzBuzz", label: "15th item is FizzBuzz" },
        { expr: "fizzBuzz(15).length", expected: 15 }
      ]
    },
    {
      id: "multiplication-row",
      title: "multiplicationRow",
      difficulty: "easy",
      prompt: "<p>Return one row of the times table for <code>n</code>: <code>[n&times;1, n&times;2, ..., n&times;upTo]</code>. If <code>upTo</code> is less than 1, return <code>[]</code>.</p><p><code>multiplicationRow(3, 5) &rarr; [3, 6, 9, 12, 15]</code> &nbsp; <code>multiplicationRow(7, 1) &rarr; [7]</code> &nbsp; <code>multiplicationRow(5, 0) &rarr; []</code></p>",
      starter: `function multiplicationRow(n, upTo) {
  // your code here
}`,
      solution: `function multiplicationRow(n, upTo) {
  const row = [];
  for (let i = 1; i <= upTo; i++) {
    row.push(n * i);       // n x 1, n x 2, ...
  }
  return row;              // upTo < 1 -> loop never runs -> []
}`,
      hint: "Empty array, loop <code>i</code> from 1 to <code>upTo</code>, push <code>n * i</code>.",
      tests: [
        { expr: "multiplicationRow(3, 5)", expected: [3, 6, 9, 12, 15] },
        { expr: "multiplicationRow(7, 1)", expected: [7] },
        { expr: "multiplicationRow(0, 3)", expected: [0, 0, 0] },
        { expr: "multiplicationRow(-2, 3)", expected: [-2, -4, -6] },
        { expr: "multiplicationRow(5, 0)", expected: [] }
      ]
    },
    {
      id: "right-triangle",
      title: "rightTriangle pattern",
      difficulty: "medium",
      prompt: "<p>Return a right triangle of <code>*</code> with <code>n</code> rows as <strong>one string</strong>. Row 1 has 1 star, row 2 has 2, and so on. Join rows with <code>\"\\n\"</code> and don't add a newline at the end. For <code>n &lt;= 0</code> return <code>\"\"</code>.</p><pre><code>rightTriangle(3)  &rarr;  \"*\\n**\\n***\"  which displays as\n*\n**\n***</code></pre><p><code>rightTriangle(1) &rarr; \"*\"</code> &nbsp; <code>rightTriangle(0) &rarr; \"\"</code></p>",
      starter: `function rightTriangle(n) {
  // your code here
}`,
      solution: `function rightTriangle(n) {
  const lines = [];
  for (let row = 1; row <= n; row++) {        // outer loop: one turn per row
    let line = "";
    for (let col = 1; col <= row; col++) {    // inner loop: 'row' stars
      line += "*";
    }
    lines.push(line);
  }
  return lines.join("\\n");   // join puts "\\n" only BETWEEN rows
}`,
      hint: "Collect each row in an array. Row number <code>row</code> needs <code>row</code> stars (a nested loop, or <code>\"*\".repeat(row)</code>). Finish with <code>lines.join(\"\\n\")</code> - it automatically avoids a trailing newline.",
      explanation: "<p>Building lines in an array and joining once is cleaner than adding <code>\"\\n\"</code> yourself and then trimming the last one. It is also faster for big outputs, because strings are not copied over and over.</p>",
      tests: [
        { expr: "rightTriangle(3)", expected: "*\n**\n***" },
        { expr: "rightTriangle(1)", expected: "*" },
        { expr: "rightTriangle(0)", expected: "" },
        { expr: "rightTriangle(5).split(\"\\n\").length", expected: 5, label: "5 rows" },
        { expr: "rightTriangle(5).endsWith(\"*****\")", expected: true, label: "last row has 5 stars, no trailing newline" }
      ]
    },
    {
      id: "reverse-number",
      title: "reverseNumber",
      difficulty: "medium",
      prompt: "<p>Reverse the digits of a whole number <strong>without converting it to a string</strong>. Keep the sign.</p><p><code>reverseNumber(1234) &rarr; 4321</code> &nbsp; <code>reverseNumber(-560) &rarr; -65</code> &nbsp; <code>reverseNumber(1000) &rarr; 1</code> &nbsp; <code>reverseNumber(0) &rarr; 0</code></p>",
      starter: `function reverseNumber(n) {
  // your code here
}`,
      solution: `function reverseNumber(n) {
  const sign = n < 0 ? -1 : 1;   // remember the sign...
  n = Math.abs(n);               // ...and work with the positive value
  let rev = 0;
  while (n > 0) {
    rev = rev * 10 + (n % 10);   // shift left, append the last digit
    n = Math.floor(n / 10);      // drop the last digit
  }
  return sign * rev;             // put the sign back
}`,
      hint: "Three steps: (1) save the sign and use <code>Math.abs(n)</code>; (2) digit loop: <code>rev = rev * 10 + n % 10</code>, then <code>n = Math.floor(n / 10)</code>; (3) multiply by the sign. See the \"reverse a number\" live example for a full trace.",
      explanation: "<p>Each pass moves one digit from the end of <code>n</code> to the end of <code>rev</code>. Trailing zeros vanish naturally: for 1000, <code>rev</code> stays 0 while the three zeros are peeled off, then becomes <code>1</code>. Runs in O(d) where d is the number of digits.</p>",
      forbid: [{ pattern: "String\\(|toString|split|reverse\\(|join|\\+\\s*\"\"", message: "Solve it with math only - no converting to a string." }],
      tests: [
        { expr: "reverseNumber(1234)", expected: 4321 },
        { expr: "reverseNumber(-560)", expected: -65 },
        { expr: "reverseNumber(0)", expected: 0 },
        { expr: "reverseNumber(7)", expected: 7 },
        { expr: "reverseNumber(1000)", expected: 1, label: "trailing zeros disappear" },
        { expr: "reverseNumber(-12)", expected: -21 }
      ]
    },
    {
      id: "palindrome-number",
      title: "isPalindromeNumber",
      difficulty: "medium",
      prompt: "<p>A <strong>palindrome</strong> reads the same forwards and backwards. Return <code>true</code> if the integer is one. Negative numbers are <strong>not</strong> palindromes (the <code>-</code> is only at the front). No strings.</p><p><code>121 &rarr; true</code> &nbsp; <code>123 &rarr; false</code> &nbsp; <code>-121 &rarr; false</code> &nbsp; <code>10 &rarr; false</code></p>",
      starter: `function isPalindromeNumber(n) {
  // your code here
}`,
      solution: `function isPalindromeNumber(n) {
  if (n < 0) return false;        // "-121" backwards is "121-"
  const original = n;             // keep a copy: the loop destroys n
  let rev = 0;
  while (n > 0) {
    rev = rev * 10 + (n % 10);
    n = Math.floor(n / 10);
  }
  return rev === original;        // same both ways?
}`,
      hint: "Reuse the reverse-number idea. Save the original value first (the loop shrinks <code>n</code> to 0), reverse it, then compare. Handle negatives before the loop.",
      explanation: "<p>The comparison <code>rev === original</code> already is a boolean, so return it directly. <code>10</code> reverses to <code>1</code>, which is why it isn't a palindrome.</p>",
      forbid: [{ pattern: "String\\(|toString|split|reverse\\(|join|\\+\\s*\"\"", message: "Solve it with math only - no converting to a string." }],
      tests: [
        { expr: "isPalindromeNumber(121)", expected: true },
        { expr: "isPalindromeNumber(123)", expected: false },
        { expr: "isPalindromeNumber(-121)", expected: false },
        { expr: "isPalindromeNumber(0)", expected: true },
        { expr: "isPalindromeNumber(7)", expected: true },
        { expr: "isPalindromeNumber(1221)", expected: true },
        { expr: "isPalindromeNumber(10)", expected: false }
      ]
    },
    {
      id: "count-primes",
      title: "countPrimes",
      difficulty: "hard",
      prompt: "<p>Return how many prime numbers are <code>&lt;= n</code>. Numbers below 2 are not prime. Your solution must handle <code>n = 200000</code> quickly.</p><p><code>countPrimes(10) &rarr; 4</code> (2, 3, 5, 7) &nbsp; <code>countPrimes(2) &rarr; 1</code> &nbsp; <code>countPrimes(1) &rarr; 0</code> &nbsp; <code>countPrimes(100) &rarr; 25</code></p>",
      starter: `function countPrimes(n) {
  // your code here
}`,
      solution: `function countPrimes(n) {
  // Sieve of Eratosthenes: cross out multiples of each prime.
  if (n < 2) return 0;
  const isPrime = new Array(n + 1).fill(true);   // assume all prime
  isPrime[0] = isPrime[1] = false;
  for (let i = 2; i * i <= n; i++) {
    if (!isPrime[i]) continue;                   // already crossed out
    for (let j = i * i; j <= n; j += i) {        // smaller multiples were done earlier
      isPrime[j] = false;
    }
  }
  let count = 0;                                 // counter pattern
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) count++;
  }
  return count;
}`,
      hint: "Simplest fast-enough plan: write a helper <code>isPrime(k)</code> that tries divisors only while <code>d * d &lt;= k</code> (see the primes section), then loop k from 2 to n and count. Want more speed? Look up the Sieve of Eratosthenes.",
      explanation: "<p>Two good answers:</p><ul><li><strong>Helper + square-root trick:</strong> O(n&radic;n) - passes comfortably.</li><li><strong>Sieve of Eratosthenes:</strong> start with \"everything is prime\", then for each prime <code>i</code> cross out <code>i&times;i, i&times;i+i, ...</code>. Each number is crossed out only a few times: O(n log log n).</li></ul><p>A plain loop trying every divisor up to <code>k</code> is O(n<sup>2</sup>) and will be too slow.</p>",
      tests: [
        { expr: "countPrimes(10)", expected: 4 },
        { expr: "countPrimes(2)", expected: 1, label: "n is inclusive" },
        { expr: "countPrimes(1)", expected: 0 },
        { expr: "countPrimes(0)", expected: 0 },
        { expr: "countPrimes(-5)", expected: 0 },
        { expr: "countPrimes(100)", expected: 25 },
        { expr: "countPrimes(200000)", expected: 17984, maxMs: 1500, label: "countPrimes(200000) is fast" }
      ]
    },
    {
      id: "fibonacci-array",
      title: "fibonacci array",
      difficulty: "medium",
      prompt: "<p>Return the first <code>n</code> Fibonacci numbers. The sequence starts <code>0, 1</code> and each next number is the sum of the previous two: 0, 1, 1, 2, 3, 5, 8, 13...</p><p><code>fibonacci(7) &rarr; [0, 1, 1, 2, 3, 5, 8]</code> &nbsp; <code>fibonacci(2) &rarr; [0, 1]</code> &nbsp; <code>fibonacci(1) &rarr; [0]</code> &nbsp; <code>fibonacci(0) &rarr; []</code></p>",
      starter: `function fibonacci(n) {
  // your code here
}`,
      solution: `function fibonacci(n) {
  const out = [];
  let a = 0, b = 1;            // the two most recent numbers
  for (let i = 0; i < n; i++) {
    out.push(a);
    [a, b] = [b, a + b];       // slide forward: a takes b's value, b becomes the sum
  }
  return out;
}`,
      hint: "Keep two variables, <code>a = 0</code> and <code>b = 1</code>. Repeat n times: push <code>a</code>, then move both forward (new a = old b, new b = old a + old b). Careful: update them together or with a temporary variable.",
      explanation: "<p><code>[a, b] = [b, a + b]</code> (destructuring) computes the right side first, then assigns both - no temporary variable needed. Because we push before updating, <code>n = 0</code> and <code>n = 1</code> work without special cases.</p>",
      tests: [
        { expr: "fibonacci(0)", expected: [] },
        { expr: "fibonacci(1)", expected: [0] },
        { expr: "fibonacci(2)", expected: [0, 1] },
        { expr: "fibonacci(7)", expected: [0, 1, 1, 2, 3, 5, 8] },
        { expr: "fibonacci(12)[11]", expected: 89 }
      ]
    }
  ],

  takeaways: [
    "<code>if / else if / else</code> runs the <strong>first</strong> true branch only - put the most specific case first.",
    "<code>switch</code> compares one value to many constants; end each case with <code>break</code> (or <code>return</code>).",
    "<code>for</code> when you know the count, <code>while</code> to repeat until something changes, <code>do...while</code> for at least once.",
    "<code>for...of</code> for array values, <code>for...in</code> for object keys; <code>break</code> leaves, <code>continue</code> skips.",
    "Learn the patterns by name: accumulator, counter, best-so-far, build-a-result, digit loop.",
    "Nested loops multiply work (O(n<sup>2</sup>)); a prime check only needs divisors up to &radic;n."
  ]
});
