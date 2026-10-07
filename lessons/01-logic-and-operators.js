LDL.registerLesson({
  id: "01",
  title: "Logic & Operators",
  lang: "js",
  minutes: 45,
  goal: "Learn to think in true and false. Every program, database query and logic exam question is built from these small yes/no decisions.",

  analogy: `
<p>Imagine a nightclub bouncer with a checklist: <em>"Are you 18 or older <strong>AND</strong> do you have an ID?"</em>
If both answers are yes, you get in. If either is no, you don't.</p>
<p>That bouncer is doing exactly what a computer does all day: asking yes/no questions and combining the answers with
<strong>AND</strong>, <strong>OR</strong> and <strong>NOT</strong>. Learn these three words well and you can describe almost any rule.</p>`,

  objectives: [
    "Explain what a <strong>boolean</strong> is and where true/false values come from",
    "Combine conditions with <code>&amp;&amp;</code> (AND), <code>||</code> (OR) and <code>!</code> (NOT)",
    "Fill in a <strong>truth table</strong> and simplify conditions with De Morgan's law",
    "Use <code>%</code> (remainder) to test even/odd, divisibility and digits",
    "Avoid the classic traps: <code>==</code> vs <code>===</code>, truthy/falsy values, floating point"
  ],

  realWorld: `
<ul>
  <li><strong>Business rules:</strong> "free shipping if the order is over $50 <em>or</em> the customer is a member".</li>
  <li><strong>Access control:</strong> "can approve if manager <em>and not</em> the person who submitted it".</li>
  <li><strong>Data filters:</strong> every Excel filter and SQL <code>WHERE</code> clause is boolean logic.</li>
  <li><strong>Logic exams:</strong> truth tables, "which statement must be true" puzzles and FizzBuzz all test this lesson.</li>
</ul>`,

  sections: [
    {
      title: "Booleans: the yes/no type",
      html: `
<p>A <strong>boolean</strong> is a value that can only be <code>true</code> or <code>false</code>. Nothing else.
You rarely type them directly - you usually get them by <strong>comparing</strong> things:</p>
<pre><code class="language-javascript">const age = 20;

console.log(age >= 18);   // true   - "is age at least 18?"
console.log(age === 30);  // false  - "is age exactly 30?"
console.log(age !== 30);  // true   - "is age NOT 30?"</code></pre>
<table>
  <tr><th>Comparison</th><th>Meaning</th><th>Example</th><th>Result</th></tr>
  <tr><td><code>===</code></td><td>is equal to</td><td><code>5 === 5</code></td><td>true</td></tr>
  <tr><td><code>!==</code></td><td>is not equal to</td><td><code>5 !== 3</code></td><td>true</td></tr>
  <tr><td><code>&gt;</code> / <code>&lt;</code></td><td>greater / less than</td><td><code>10 &gt; 3</code></td><td>true</td></tr>
  <tr><td><code>&gt;=</code> / <code>&lt;=</code></td><td>greater / less than or equal</td><td><code>18 &gt;= 18</code></td><td>true</td></tr>
</table>
<div class="callout key"><p>A comparison is a <strong>question</strong>. The computer answers it with <code>true</code> or <code>false</code>.</p></div>`
    },
    {
      title: "AND, OR, NOT - combining questions",
      html: `
<p>Real rules have more than one condition. We glue conditions together with three operators:</p>
<table>
  <tr><th>Word</th><th>JavaScript</th><th>SQL</th><th>True when...</th><th>Everyday example</th></tr>
  <tr><td><strong>AND</strong></td><td><code>a &amp;&amp; b</code></td><td><code>a AND b</code></td><td><strong>both</strong> are true</td><td>"has ticket AND has ID"</td></tr>
  <tr><td><strong>OR</strong></td><td><code>a || b</code></td><td><code>a OR b</code></td><td><strong>at least one</strong> is true</td><td>"pay by card OR cash"</td></tr>
  <tr><td><strong>NOT</strong></td><td><code>!a</code></td><td><code>NOT a</code></td><td>flips true &harr; false</td><td>"NOT raining"</td></tr>
</table>
<pre><code class="language-javascript">const hasTicket = true;
const hasId = false;

console.log(hasTicket &amp;&amp; hasId);  // false - AND needs both
console.log(hasTicket || hasId);  // true  - OR needs just one
console.log(!hasId);              // true  - NOT flips false to true</code></pre>
<div class="callout tip"><p>Read <code>&amp;&amp;</code> out loud as "and", <code>||</code> as "or", and <code>!</code> as "not". Code becomes a sentence:
<code>isMember || total &gt; 50</code> = "is a member <em>or</em> total is over 50".</p></div>`
    },
    {
      title: "Truth tables",
      html: `
<p>A <strong>truth table</strong> lists every possible combination of inputs and the result. With two inputs there are only
4 combinations, so you can always check a condition by hand. Logic exams love these.</p>
<table>
  <tr><th>A</th><th>B</th><th>A &amp;&amp; B</th><th>A || B</th><th>!A</th><th>A XOR B</th></tr>
  <tr><td>T</td><td>T</td><td>T</td><td>T</td><td>F</td><td>F</td></tr>
  <tr><td>T</td><td>F</td><td>F</td><td>T</td><td>F</td><td>T</td></tr>
  <tr><td>F</td><td>T</td><td>F</td><td>T</td><td>T</td><td>T</td></tr>
  <tr><td>F</td><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td></tr>
</table>
<p><strong>How to remember:</strong></p>
<ul>
  <li><strong>AND</strong> is strict: a single <em>false</em> ruins it (only one T row).</li>
  <li><strong>OR</strong> is generous: a single <em>true</em> is enough (only one F row).</li>
  <li><strong>XOR</strong> ("exclusive or") means <em>exactly one</em> - like "soup <em>or</em> salad" on a set menu: one, not both.
      In JavaScript, for booleans, <code>a !== b</code> works as XOR.</li>
</ul>`
    },
    {
      title: "De Morgan's law - flipping a condition",
      html: `
<p>Sometimes you need the <strong>opposite</strong> of a condition. De Morgan's law tells you how:</p>
<pre><code class="language-javascript">!(a &amp;&amp; b)  ===  !a || !b     // NOT (A and B)  =  (not A) or (not B)
!(a || b)  ===  !a &amp;&amp; !b     // NOT (A or B)   =  (not A) and (not B)</code></pre>
<p><strong>Rule of thumb:</strong> push the <code>!</code> inside, flip each part, and swap <code>&amp;&amp;</code> &harr; <code>||</code>.</p>
<div class="callout analogy"><p>"It's <strong>not</strong> true that I'm rich <strong>and</strong> famous" means "I'm not rich, <strong>or</strong> I'm not famous" (or neither).
It does <em>not</em> mean "I'm neither rich nor famous".</p></div>
<p>Worked example - who is <strong>refused</strong> entry at the club?</p>
<pre><code class="language-javascript">// Allowed:  age >= 18 &amp;&amp; hasId
// Refused:  !(age >= 18 &amp;&amp; hasId)
//        =  age &lt; 18 || !hasId        // under 18, OR no ID</code></pre>`
    },
    {
      title: "Short-circuit: JavaScript stops early",
      html: `
<p>JavaScript is lazy in a helpful way. With <code>a &amp;&amp; b</code>, if <code>a</code> is false the answer must be false, so
<code>b</code> is <strong>never even checked</strong>. With <code>a || b</code>, if <code>a</code> is true, <code>b</code> is skipped.</p>
<pre><code class="language-javascript">const user = null;

// Safe: if user is null, user.isAdmin is never evaluated (no crash)
if (user !== null &amp;&amp; user.isAdmin) { console.log("Welcome admin"); }

// Default values: use "Guest" when name is empty
const name = "" || "Guest";   // "Guest"</code></pre>
<div class="callout work"><p>You'll see <code>value || defaultValue</code> and <code>obj &amp;&amp; obj.property</code> constantly in real codebases.
Modern JS also has <code>obj?.property</code> and <code>value ?? defaultValue</code> for the same jobs.</p></div>`
    },
    {
      title: "The % operator (remainder)",
      html: `
<p><code>a % b</code> gives the <strong>remainder</strong> after dividing <code>a</code> by <code>b</code>. Think of sharing sweets:
17 sweets among 5 friends = 3 each, with <strong>2 left over</strong>, so <code>17 % 5</code> is <code>2</code>.</p>
<table>
  <tr><th>Question</th><th>Code</th><th>Why it works</th></tr>
  <tr><td>Is <code>n</code> even?</td><td><code>n % 2 === 0</code></td><td>even numbers leave nothing over when halved</td></tr>
  <tr><td>Is <code>n</code> divisible by <code>k</code>?</td><td><code>n % k === 0</code></td><td>no remainder = divides exactly</td></tr>
  <tr><td>Last digit of <code>n</code></td><td><code>n % 10</code></td><td>4721 &divide; 10 leaves 1</td></tr>
  <tr><td>Remove last digit</td><td><code>Math.floor(n / 10)</code></td><td>4721 &rarr; 472</td></tr>
  <tr><td>Wrap around (clock, carousel)</td><td><code>(i + 1) % length</code></td><td>after the last item, go back to 0</td></tr>
</table>
<div class="callout warn"><p>In JavaScript <code>-7 % 2</code> is <code>-1</code>, not <code>1</code>. To test "odd", use <code>n % 2 !== 0</code> rather than <code>n % 2 === 1</code>.</p></div>`
    },
    {
      title: "Truthy and falsy values",
      html: `
<p>In an <code>if</code>, JavaScript accepts <em>any</em> value, not just booleans. It treats these <strong>8 values as false</strong> ("falsy"):</p>
<pre><code class="language-javascript">false   0   -0   0n   ""   null   undefined   NaN</code></pre>
<p><strong>Everything else is truthy</strong> - including some surprises: <code>"0"</code>, <code>"false"</code>, <code>[]</code> and <code>{}</code>.</p>
<pre><code class="language-javascript">const cart = [];
if (cart) console.log("runs! an empty array is truthy");
if (cart.length === 0) console.log("this is the right way to check for empty");</code></pre>
<div class="callout note"><p>SQL has a third value, <code>NULL</code> (unknown), which makes logic "three-valued". You'll meet it in lesson 12.</p></div>`
    }
  ],

  examples: [
    {
      title: "Comparisons produce booleans",
      code: `const price = 120;
const budget = 100;

console.log("Over budget?", price > budget);
console.log("Exactly 100?", price === 100);
console.log("Not 100?", price !== 100);

const canAfford = price <= budget;
console.log("canAfford is a", typeof canAfford, "=", canAfford);`,
      explain: `
<ol>
  <li>Each comparison is a question; JavaScript answers with <code>true</code> or <code>false</code>.</li>
  <li>You can store the answer in a variable (<code>canAfford</code>) - its type is <code>"boolean"</code>.</li>
  <li><strong>Try it:</strong> change <code>budget</code> to <code>200</code> and predict each line before running.</li>
</ol>`
    },
    {
      title: "A real business rule: free shipping",
      code: `function freeShipping(orderTotal, isMember) {
  // Rule: free if the order is at least $50 OR the customer is a member
  return orderTotal >= 50 || isMember;
}

console.log("$80, not member:", freeShipping(80, false));
console.log("$20, member:    ", freeShipping(20, true));
console.log("$20, not member:", freeShipping(20, false));`,
      explain: `
<p>The English rule translates almost word-for-word into code: "at least 50" &rarr; <code>&gt;= 50</code>, "or" &rarr; <code>||</code>.</p>
<p>Only the last customer pays shipping, because <em>both</em> sides of the OR are false.
<strong>Try it:</strong> change the rule to "at least $50 <em>and</em> a member" by swapping <code>||</code> for <code>&amp;&amp;</code>.</p>`
    },
    {
      title: "Generate a truth table automatically",
      code: `for (const a of [true, false]) {
  for (const b of [true, false]) {
    console.log(
      "A=" + a, "B=" + b,
      "| AND:", a && b,
      " OR:", a || b,
      " XOR:", a !== b
    );
  }
}`,
      explain: `
<p>Two nested loops visit all 4 combinations of <code>a</code> and <code>b</code>, and we print each operator's result.
Compare the output with the truth table above - they match. This is a great trick to <strong>check your own logic</strong> during practice.</p>`
    },
    {
      title: "Prove De Morgan's law by brute force",
      code: `let allMatch = true;

for (const a of [true, false]) {
  for (const b of [true, false]) {
    const left = !(a && b);
    const right = !a || !b;
    console.log(a, b, "->", left, right);
    if (left !== right) allMatch = false;
  }
}
console.log("De Morgan holds for every case:", allMatch);`,
      explain: `
<p>Because there are only 4 cases, we can simply <strong>test all of them</strong>. If the left and right side agree every
time, the two expressions are equivalent. Programmers use this "try every case" idea to verify tricky conditions.</p>`
    },
    {
      title: "Short-circuit keeps you safe",
      code: `function greet(user) {
  // Without the first check, user.name would crash when user is null
  if (user !== null && user.name) {
    return "Hello, " + user.name;
  }
  return "Hello, guest";
}

console.log(greet({ name: "Maria" }));
console.log(greet(null));

const nickname = "";
console.log("Display:", nickname || "Anonymous");`,
      explain: `
<ol>
  <li>For <code>greet(null)</code>, <code>user !== null</code> is false, so <code>&amp;&amp;</code> stops and never touches <code>user.name</code>.</li>
  <li><code>nickname || "Anonymous"</code>: the empty string is falsy, so OR moves on and returns <code>"Anonymous"</code>.</li>
</ol>`
    },
    {
      title: "Remainder tricks: even, odd, divisible",
      code: `for (let n = 1; n <= 10; n++) {
  const parity = n % 2 === 0 ? "even" : "odd";
  const by3 = n % 3 === 0 ? "divisible by 3" : "";
  console.log(n, parity, by3);
}`,
      explain: `
<p><code>n % 2</code> is 0 for even numbers and 1 for odd ones. <code>n % 3 === 0</code> picks out 3, 6, 9.</p>
<p>The <code>condition ? valueIfTrue : valueIfFalse</code> form is called the <strong>ternary operator</strong> - a one-line <code>if/else</code>.</p>`
    },
    {
      title: "Pull a number apart digit by digit",
      code: `let n = 4721;
const digits = [];

while (n > 0) {
  digits.push(n % 10);      // 1) grab the last digit
  n = Math.floor(n / 10);   // 2) chop it off
}
console.log("Digits (last to first):", digits);`,
      explain: `
<table>
  <tr><th>n</th><th>n % 10</th><th>Math.floor(n / 10)</th></tr>
  <tr><td>4721</td><td>1</td><td>472</td></tr>
  <tr><td>472</td><td>2</td><td>47</td></tr>
  <tr><td>47</td><td>7</td><td>4</td></tr>
  <tr><td>4</td><td>4</td><td>0 &rarr; loop stops</td></tr>
</table>
<p>This "take the last digit, then drop it" loop appears in many exam questions: sum of digits, reverse a number, palindrome numbers.</p>`
    },
    {
      title: "Truthy or falsy? (surprises included)",
      code: `const values = [0, 1, "", "hello", "0", "false", [], {}, null, undefined, NaN];

for (const v of values) {
  console.log(JSON.stringify(v), "->", v ? "truthy" : "falsy");
}`,
      explain: `
<p>Notice <code>"0"</code>, <code>"false"</code>, <code>[]</code> and <code>{}</code> are <strong>truthy</strong>: a non-empty string is truthy
whatever it says, and arrays/objects are always truthy. (<code>JSON.stringify</code> prints <code>NaN</code> and <code>undefined</code> oddly - that's fine.)</p>`
    },
    {
      title: "Why === beats ==",
      code: `console.log('5 == "5"  ->', 5 == "5");     // loose: converts types first
console.log('5 === "5" ->', 5 === "5");    // strict: types must match too
console.log('0 == ""   ->', 0 == "");
console.log('0 === ""  ->', 0 === "");
console.log("0.1 + 0.2 =", 0.1 + 0.2);
console.log("close enough?", Math.abs(0.1 + 0.2 - 0.3) < 1e-9);`,
      explain: `
<p><code>==</code> quietly converts types, which causes bugs (<code>0 == ""</code> is <code>true</code>!). Always use <code>===</code> and <code>!==</code>.</p>
<p>Decimals are stored in binary, so <code>0.1 + 0.2</code> isn't exactly <code>0.3</code>. Compare decimals with a tiny tolerance instead.</p>`
    }
  ],

  pitfalls: [
    "<code>=</code> <strong>assigns</strong>, <code>===</code> <strong>compares</strong>. <code>if (x = 5)</code> sets x to 5 and is always truthy.",
    "<code>if (x === 1 || 2)</code> is <strong>always true</strong>, because <code>2</code> on its own is truthy. Write <code>x === 1 || x === 2</code> or <code>[1, 2].includes(x)</code>.",
    "<code>1 &lt; x &lt; 10</code> does not work like maths in JavaScript. Write <code>1 &lt; x &amp;&amp; x &lt; 10</code>.",
    "An empty array <code>[]</code> is truthy. Check <code>arr.length === 0</code>.",
    "<code>0.1 + 0.2 === 0.3</code> is false. Compare decimals with <code>Math.abs(a - b) &lt; 1e-9</code>.",
    "Leap years are <strong>not</strong> just <code>year % 4 === 0</code> - 1900 was not a leap year (see the exercise)."
  ],

  quiz: [
    {
      q: "What does this print?",
      code: `const a = true;
const b = false;
console.log(a && !b);`,
      options: ["true", "false", "undefined", "An error"],
      answer: 0,
      output: "true",
      explain: "<p><code>!b</code> flips false to <strong>true</strong>, so it becomes <code>true &amp;&amp; true</code>, which is <code>true</code>.</p>"
    },
    {
      q: "Free coffee if you are a member <em>or</em> you have 10 stamps. Which code is correct?",
      options: [
        "<code>isMember &amp;&amp; stamps &gt;= 10</code>",
        "<code>isMember || stamps &gt;= 10</code>",
        "<code>!isMember || stamps &gt;= 10</code>",
        "<code>isMember || stamps = 10</code>"
      ],
      answer: 1,
      explain: "<p>\"Or\" maps to <code>||</code>, and \"10 stamps\" means at least 10 (<code>&gt;= 10</code>). Option D uses <code>=</code>, which assigns instead of comparing.</p>"
    },
    {
      q: "Using De Morgan's law, <code>!(isWeekend || isHoliday)</code> is the same as...",
      options: [
        "<code>!isWeekend || !isHoliday</code>",
        "<code>isWeekend &amp;&amp; isHoliday</code>",
        "<code>!isWeekend &amp;&amp; !isHoliday</code>",
        "<code>!isWeekend || isHoliday</code>"
      ],
      answer: 2,
      explain: "<p>Push the NOT inside, flip each part and swap OR to AND: \"not (weekend or holiday)\" = \"not weekend <strong>and</strong> not holiday\" - a normal working day.</p>"
    },
    {
      q: "What does this print?",
      code: `console.log(17 % 5);`,
      options: ["3", "3.4", "2", "5"],
      answer: 2,
      output: "2",
      explain: "<p>17 &divide; 5 = 3 with <strong>2 left over</strong>. <code>%</code> returns the leftover.</p>"
    },
    {
      q: "Which value is <strong>truthy</strong>?",
      options: ["<code>0</code>", "<code>\"\"</code>", "<code>\"0\"</code>", "<code>null</code>"],
      answer: 2,
      explain: "<p><code>\"0\"</code> is a non-empty string (it contains the character 0), and every non-empty string is truthy. The others are all on the falsy list.</p>"
    },
    {
      q: "What does this print?",
      code: `const items = [];
console.log(items ? "has items" : "empty");`,
      options: ["has items", "empty", "undefined", "An error"],
      answer: 0,
      output: "has items",
      explain: "<p>Surprise! An empty array is still an object, so it's <strong>truthy</strong>. To test for empty, use <code>items.length === 0</code>.</p>"
    }
  ],

  interview: [
    { q: "What is short-circuit evaluation and why is it useful?",
      a: "<p>The second operand is only evaluated if needed: <code>a &amp;&amp; b</code> skips <code>b</code> when <code>a</code> is false, and <code>a || b</code> skips <code>b</code> when <code>a</code> is true. It prevents errors (<code>user &amp;&amp; user.name</code>), provides defaults (<code>name || \"Guest\"</code>) and avoids unnecessary work.</p>" },
    { q: "Rewrite <code>!(age &gt;= 18 &amp;&amp; hasId)</code> without the outer NOT.",
      a: "<p><code>age &lt; 18 || !hasId</code>. By De Morgan's law, NOT (A and B) = (not A) or (not B), and the opposite of <code>&gt;=</code> is <code>&lt;</code>.</p>" },
    { q: "What is the difference between <code>==</code> and <code>===</code>?",
      a: "<p><code>==</code> converts both sides to a common type before comparing, so <code>\"5\" == 5</code> is true. <code>===</code> also requires the same type, so it's predictable. Teams use <code>===</code> by default.</p>" },
    { q: "How can you tell if a number is a power of 2 using only logic/math?",
      a: "<p>Keep dividing by 2 while it's even; a power of 2 ends at exactly 1. The bitwise trick is <code>n &gt; 0 &amp;&amp; (n &amp; (n - 1)) === 0</code>, because a power of 2 has a single 1-bit.</p>" },
    { q: "How do you swap two variables without a temporary variable?",
      a: "<p>Destructuring: <code>[a, b] = [b, a]</code>. Classic integer trick: <code>a = a + b; b = a - b; a = a - b;</code> (or the same with XOR <code>^</code>).</p>" }
  ],

  exercises: [
    {
      id: "is-even",
      title: "isEven",
      difficulty: "easy",
      prompt: "<p>Return <code>true</code> if <code>n</code> is even, otherwise <code>false</code>.</p><p><code>isEven(4) &rarr; true</code> &nbsp; <code>isEven(7) &rarr; false</code> &nbsp; <code>isEven(0) &rarr; true</code></p>",
      starter: `function isEven(n) {
  // your code here
}`,
      solution: `function isEven(n) {
  // Even numbers leave no remainder when divided by 2
  return n % 2 === 0;
}`,
      hint: "What is the remainder when an even number is divided by 2? Use the % operator.",
      explanation: "<p>The comparison <code>n % 2 === 0</code> already produces <code>true</code>/<code>false</code>, so return it directly - no <code>if</code> needed.</p>",
      tests: [
        { expr: "isEven(4)", expected: true },
        { expr: "isEven(7)", expected: false },
        { expr: "isEven(0)", expected: true },
        { expr: "isEven(-2)", expected: true },
        { expr: "isEven(-3)", expected: false }
      ]
    },
    {
      id: "can-vote",
      title: "canVote",
      difficulty: "easy",
      prompt: "<p>A person can vote if they are <strong>at least 18</strong>, a <strong>citizen</strong>, <strong>and</strong> <strong>registered</strong>. Return true or false.</p><p><code>canVote(18, true, true) &rarr; true</code> &nbsp; <code>canVote(17, true, true) &rarr; false</code></p>",
      starter: `function canVote(age, isCitizen, isRegistered) {
  // your code here
}`,
      solution: `function canVote(age, isCitizen, isRegistered) {
  // All three conditions must hold, so chain them with AND
  return age >= 18 && isCitizen && isRegistered;
}`,
      hint: "Three conditions that must all be true - join them with &&.",
      tests: [
        { expr: "canVote(18, true, true)", expected: true },
        { expr: "canVote(17, true, true)", expected: false },
        { expr: "canVote(30, false, true)", expected: false },
        { expr: "canVote(30, true, false)", expected: false }
      ]
    },
    {
      id: "in-range",
      title: "isInRange",
      difficulty: "easy",
      prompt: "<p>Return <code>true</code> if <code>x</code> is between <code>low</code> and <code>high</code>, <strong>including</strong> both ends.</p><p><code>isInRange(5, 1, 10) &rarr; true</code> &nbsp; <code>isInRange(10, 1, 10) &rarr; true</code> &nbsp; <code>isInRange(11, 1, 10) &rarr; false</code></p>",
      starter: `function isInRange(x, low, high) {
  // your code here
}`,
      solution: `function isInRange(x, low, high) {
  // JS has no chained comparison: low <= x <= high would be WRONG
  return low <= x && x <= high;
}`,
      hint: "<code>low &lt;= x &lt;= high</code> does not work in JavaScript. Use two comparisons joined by &&.",
      tests: [
        { expr: "isInRange(5, 1, 10)", expected: true },
        { expr: "isInRange(1, 1, 10)", expected: true },
        { expr: "isInRange(10, 1, 10)", expected: true },
        { expr: "isInRange(11, 1, 10)", expected: false },
        { expr: "isInRange(0, 1, 10)", expected: false }
      ]
    },
    {
      id: "xor",
      title: "xor without the ^ operator",
      difficulty: "easy",
      prompt: "<p>Return <code>true</code> when <strong>exactly one</strong> of <code>a</code>, <code>b</code> is true. Use only <code>&amp;&amp;</code>, <code>||</code> and <code>!</code>.</p><p><code>xor(true, false) &rarr; true</code> &nbsp; <code>xor(true, true) &rarr; false</code></p>",
      starter: `function xor(a, b) {
  // your code here
}`,
      solution: `function xor(a, b) {
  // "at least one" AND "not both"
  return (a || b) && !(a && b);
}`,
      hint: "XOR means: at least one is true (OR), but not both (NOT AND).",
      forbid: [{ pattern: "\\^|!==|!=", message: "Build it from &&, || and ! only (no ^, != or !==)." }],
      tests: [
        { expr: "xor(true, false)", expected: true },
        { expr: "xor(false, true)", expected: true },
        { expr: "xor(true, true)", expected: false },
        { expr: "xor(false, false)", expected: false }
      ]
    },
    {
      id: "leap-year",
      title: "isLeapYear",
      difficulty: "medium",
      prompt: "<p>A year is a leap year if it is divisible by 4, <strong>except</strong> years divisible by 100, <strong>unless</strong> they are also divisible by 400.</p><p><code>2024 &rarr; true</code> &nbsp; <code>2023 &rarr; false</code> &nbsp; <code>1900 &rarr; false</code> &nbsp; <code>2000 &rarr; true</code></p>",
      starter: `function isLeapYear(year) {
  // your code here
}`,
      solution: `function isLeapYear(year) {
  // Two ways to qualify:
  //  1) divisible by 4 but not by 100   (e.g. 2024)
  //  2) divisible by 400                (e.g. 2000)
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}`,
      hint: "There are two ways to be a leap year: (divisible by 4 AND not by 100) OR (divisible by 400).",
      explanation: "<p>Turning wordy rules (\"except... unless...\") into AND/OR is a classic exam skill. Write each \"way to qualify\" in brackets, then join them with OR.</p>",
      tests: [
        { expr: "isLeapYear(2024)", expected: true },
        { expr: "isLeapYear(2023)", expected: false },
        { expr: "isLeapYear(1900)", expected: false },
        { expr: "isLeapYear(2000)", expected: true },
        { expr: "isLeapYear(2100)", expected: false }
      ]
    },
    {
      id: "fizzbuzz-word",
      title: "fizzBuzzWord",
      difficulty: "medium",
      prompt: "<p>The most famous interview warm-up. Return <code>\"FizzBuzz\"</code> if <code>n</code> is divisible by 3 <strong>and</strong> 5, <code>\"Fizz\"</code> if only by 3, <code>\"Buzz\"</code> if only by 5, otherwise the number as a string.</p><p><code>3 &rarr; \"Fizz\"</code> &nbsp; <code>10 &rarr; \"Buzz\"</code> &nbsp; <code>15 &rarr; \"FizzBuzz\"</code> &nbsp; <code>7 &rarr; \"7\"</code></p>",
      starter: `function fizzBuzzWord(n) {
  // your code here
}`,
      solution: `function fizzBuzzWord(n) {
  // Check the MOST specific case first!
  if (n % 15 === 0) return "FizzBuzz";   // divisible by 3 and 5
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return String(n);
}`,
      hint: "Order matters. If you check 3 first, 15 will return \"Fizz\" and never reach the FizzBuzz check.",
      tests: [
        { expr: "fizzBuzzWord(1)", expected: "1" },
        { expr: "fizzBuzzWord(3)", expected: "Fizz" },
        { expr: "fizzBuzzWord(5)", expected: "Buzz" },
        { expr: "fizzBuzzWord(15)", expected: "FizzBuzz" },
        { expr: "fizzBuzzWord(30)", expected: "FizzBuzz" },
        { expr: "fizzBuzzWord(7)", expected: "7" }
      ]
    },
    {
      id: "sum-of-digits",
      title: "sumOfDigits",
      difficulty: "medium",
      prompt: "<p>Add up the digits of a non-negative whole number using <code>%</code> and division - <strong>no strings</strong>.</p><p><code>sumOfDigits(4721) &rarr; 14</code> (4 + 7 + 2 + 1) &nbsp; <code>sumOfDigits(0) &rarr; 0</code></p>",
      starter: `function sumOfDigits(n) {
  // your code here
}`,
      solution: `function sumOfDigits(n) {
  let total = 0;
  while (n > 0) {
    total += n % 10;          // add the last digit
    n = Math.floor(n / 10);   // drop the last digit
  }
  return total;
}`,
      hint: "Use the digit loop from the live examples: while n > 0, add n % 10 then set n = Math.floor(n / 10).",
      forbid: [{ pattern: "String\\(|toString|split|\\+\\s*\"\"", message: "Solve it with math only - no converting to a string." }],
      tests: [
        { expr: "sumOfDigits(4721)", expected: 14 },
        { expr: "sumOfDigits(0)", expected: 0 },
        { expr: "sumOfDigits(9)", expected: 9 },
        { expr: "sumOfDigits(1000001)", expected: 2 }
      ]
    },
    {
      id: "max-of-three",
      title: "maxOfThree without Math.max",
      difficulty: "medium",
      prompt: "<p>Return the largest of three numbers <strong>without</strong> using <code>Math.max</code> or sorting.</p><p><code>maxOfThree(3, 9, 4) &rarr; 9</code> &nbsp; <code>maxOfThree(-5, -1, -9) &rarr; -1</code></p>",
      starter: `function maxOfThree(a, b, c) {
  // your code here
}`,
      solution: `function maxOfThree(a, b, c) {
  // "King of the hill": assume a wins, then let challengers replace it
  let largest = a;
  if (b > largest) largest = b;
  if (c > largest) largest = c;
  return largest;
}`,
      hint: "Start by assuming the first number is the biggest, then compare the others against it one by one.",
      explanation: "<p>This \"keep the best so far\" pattern scales to any number of values - it's exactly how you'll find the maximum of an array in lesson 04.</p>",
      forbid: [{ pattern: "Math\\.max|\\.sort\\(", message: "Don't use Math.max or sort - compare the values yourself." }],
      tests: [
        { expr: "maxOfThree(1, 2, 3)", expected: 3 },
        { expr: "maxOfThree(3, 2, 1)", expected: 3 },
        { expr: "maxOfThree(2, 3, 1)", expected: 3 },
        { expr: "maxOfThree(-5, -1, -9)", expected: -1 },
        { expr: "maxOfThree(4, 4, 4)", expected: 4 }
      ]
    }
  ],

  takeaways: [
    "A <strong>boolean</strong> is just <code>true</code> or <code>false</code>; comparisons like <code>age &gt;= 18</code> create them.",
    "<strong>AND</strong> (<code>&amp;&amp;</code>) needs both, <strong>OR</strong> (<code>||</code>) needs one, <strong>NOT</strong> (<code>!</code>) flips.",
    "<strong>De Morgan:</strong> to negate, flip each part and swap AND &harr; OR.",
    "<code>%</code> gives the remainder: even/odd, divisibility, last digit, wrap-around.",
    "Always use <code>===</code>; remember <code>[]</code> and <code>\"0\"</code> are truthy."
  ]
});
