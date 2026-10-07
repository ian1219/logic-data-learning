LDL.registerLesson({
  id: "07",
  title: "Hash Maps & Sets",
  lang: "js",
  minutes: 60,
  goal: "Trade a little memory for a lot of speed. A hash map turns \"search the whole list\" into \"jump straight to it\" - the single most useful trick in coding interviews.",

  analogy: `
<p>Think of a <strong>coat check</strong> at a theatre. You hand over your coat and get ticket <strong>#47</strong>. When you come back,
the attendant doesn't search every coat on every rail - they walk straight to hook 47. Finding your coat takes the
same time whether there are 10 coats or 10,000.</p>
<p>A <strong>hash map</strong> works the same way: a <em>key</em> (your ticket) leads directly to a <em>value</em> (your coat).
A <strong>set</strong> is the guest list at the door: it only answers "is this name on the list?" - instantly.</p>`,

  objectives: [
    "Explain what a <strong>hash map</strong> and a <strong>set</strong> are and why lookups are O(1) on average",
    "Use <code>Map</code>, <code>Set</code> and plain objects: add, read, check, delete, loop and count",
    "Apply <strong>set operations</strong> (union, intersection, difference) to real lists",
    "Recognise the four hash patterns: <strong>frequency counting</strong>, <strong>seen-set</strong>, <strong>complement lookup</strong> and <strong>grouping</strong>",
    "Turn an O(n²) nested-loop search into an O(n) one-pass solution",
    "Describe how a <strong>database index</strong> uses the same idea"
  ],

  realWorld: `
<ul>
  <li><strong>Counting events in logs:</strong> how many errors per service, page views per URL, logins per user.</li>
  <li><strong>Deduplicating customer lists:</strong> merging two email lists without sending anyone the newsletter twice.</li>
  <li><strong>Caching:</strong> remember the result for a product ID so you don't call a slow API or database again.</li>
  <li><strong>Database indexes and joins:</strong> an index on <code>email</code> lets the database find a row without scanning the whole table.</li>
  <li><strong>Interviews:</strong> two-sum, group anagrams and "find the duplicate" are asked constantly - all hash-map problems.</li>
</ul>`,

  sections: [
    {
      title: "The problem: searching a list is slow",
      html: `
<p>To check whether a value is in an <strong>array</strong>, JavaScript must look at the items one by one until it finds it.
That is <strong>O(n)</strong>: twice the data, twice the work.</p>
<pre><code class="language-javascript">const blocked = ["spam@x.com", "bot@y.com", /* ...100,000 more */];
blocked.includes("ada@example.com");   // may check every single item</code></pre>
<p>Do that inside a loop over another big list and you get <strong>O(n²)</strong> - 100,000 &times; 100,000 = 10 billion steps.
That's the kind of code that takes minutes instead of milliseconds.</p>
<table>
  <tr><th>Question</th><th>Array</th><th>Set / Map</th></tr>
  <tr><td>Is <code>x</code> in here?</td><td><code>arr.includes(x)</code> - O(n)</td><td><code>set.has(x)</code> - O(1)</td></tr>
  <tr><td>What is the value for key <code>k</code>?</td><td>loop and compare - O(n)</td><td><code>map.get(k)</code> - O(1)</td></tr>
  <tr><td>Add an item</td><td><code>push</code> - O(1)</td><td><code>set.add(x)</code> / <code>map.set(k, v)</code> - O(1)</td></tr>
  <tr><td>Remove an item</td><td><code>splice</code> - O(n)</td><td><code>delete</code> - O(1)</td></tr>
</table>
<div class="callout key"><p><strong>O(1)</strong> ("constant time") means the cost doesn't grow with the size of the data. That's the superpower of hashing.</p></div>`
    },
    {
      title: "Map: key → value",
      html: `
<p>A <strong>Map</strong> stores pairs: a <strong>key</strong> you look things up by, and the <strong>value</strong> attached to it.
Think of your phone contacts: name (key) → number (value).</p>
<pre><code class="language-javascript">const phone = new Map();
phone.set("Ada", "0917-555-0101");     // add or update
phone.set("Grace", "0917-555-0102");

phone.get("Ada");        // "0917-555-0101"
phone.get("Linus");      // undefined - not there
phone.has("Grace");      // true
phone.delete("Grace");   // remove
phone.size;              // 1

for (const [name, num] of phone) console.log(name, num);</code></pre>
<p>A <strong>plain object</strong> <code>{}</code> can do the same job for string keys, and you'll see both everywhere:</p>
<table>
  <tr><th>Task</th><th><code>Map</code></th><th>Plain object</th></tr>
  <tr><td>Create</td><td><code>new Map()</code></td><td><code>{}</code></td></tr>
  <tr><td>Set</td><td><code>m.set(k, v)</code></td><td><code>o[k] = v</code></td></tr>
  <tr><td>Get, with a default</td><td><code>m.get(k) ?? 0</code></td><td><code>o[k] ?? 0</code></td></tr>
  <tr><td>Has key?</td><td><code>m.has(k)</code></td><td><code>k in o</code></td></tr>
  <tr><td>Count up</td><td><code>m.set(k, (m.get(k) || 0) + 1)</code></td><td><code>o[k] = (o[k] || 0) + 1</code></td></tr>
  <tr><td>Size</td><td><code>m.size</code></td><td><code>Object.keys(o).length</code></td></tr>
  <tr><td>Loop</td><td><code>for (const [k, v] of m)</code></td><td><code>for (const [k, v] of Object.entries(o))</code></td></tr>
</table>
<div class="callout tip"><p>Use a <strong>plain object</strong> for simple string-keyed records and JSON. Use a <strong>Map</strong> when keys are numbers or objects,
come from users, or you add/remove often. Python's <code>dict</code>, <code>Counter</code> and <code>defaultdict</code> are the same ideas.</p></div>`
    },
    {
      title: "How hashing works (the coat check, inside)",
      html: `
<p>A <strong>hash function</strong> turns a key into a number. That number (modulo the table size) picks a
<strong>bucket</strong> - a slot in an internal array. To look up a key, hash it again and go straight to that bucket.</p>
<pre>
   key          hash(key) % 8        buckets (internal array)
  "apple"   ->        3              [0]
  "kiwi"    ->        6              [1]
  "pear"    ->        3              [2]
                                     [3] -> ("apple", 5) -> ("pear", 2)   &lt;- collision
                                     [4]
                                     [5]
                                     [6] -> ("kiwi", 9)
                                     [7]
</pre>
<ul>
  <li>A <strong>collision</strong> is when two keys land in the same bucket. That's normal; the bucket just holds a short list.</li>
  <li>When the table gets crowded, it <strong>resizes</strong> (more buckets) so lists stay short.</li>
  <li>That's why we say <strong>O(1) on average</strong>: in the rare worst case, everything collides and lookup becomes O(n).</li>
</ul>
<div class="callout note"><p>You never write the hash function yourself in JS - <code>Map</code>, <code>Set</code> and objects do it for you. You just need to know <em>why</em> it's fast.</p></div>`
    },
    {
      title: "What can be a key?",
      html: `
<p>Keys must stay the same after you store them, or they'd hash to a different bucket. Python enforces this by allowing only
<strong>hashable</strong> (immutable) keys. JavaScript has its own rules:</p>
<table>
  <tr><th>Container</th><th>Keys are...</th><th>Gotcha</th></tr>
  <tr><td>Plain object</td><td>always converted to <strong>strings</strong></td><td><code>o[1]</code> and <code>o["1"]</code> are the same key</td></tr>
  <tr><td><code>Map</code> / <code>Set</code></td><td>any value, kept as-is</td><td>objects and arrays are compared by <strong>reference</strong>, not content</td></tr>
</table>
<pre><code class="language-javascript">const seen = new Set();
seen.add([1, 2]);
seen.has([1, 2]);            // false! a different array that looks the same

seen.add([1, 2].join(","));  // store a string key "1,2" instead
seen.has("1,2");             // true</code></pre>
<div class="callout warn"><p>Need to use a pair, a point or a sorted word as a key? Turn it into a <strong>string</strong> first (<code>"3,4"</code>, <code>"aet"</code>).</p></div>`
    },
    {
      title: "Sets and set operations",
      html: `
<p>A <strong>Set</strong> is a collection of <strong>unique</strong> values. Adding something twice keeps one copy. Its main job: fast "is it in here?"</p>
<pre><code class="language-javascript">const tags = new Set(["sale", "new", "sale"]);
tags.size;            // 2 - duplicates disappear
tags.add("clearance");
tags.has("new");      // true
const unique = [...new Set([3, 1, 3, 2])];   // [3, 1, 2] - the dedupe one-liner</code></pre>
<table>
  <tr><th>Operation</th><th>Meaning</th><th>JavaScript</th><th>SQL cousin</th></tr>
  <tr><td>Union A ∪ B</td><td>in A <strong>or</strong> B</td><td><code>new Set([...a, ...b])</code></td><td><code>UNION</code></td></tr>
  <tr><td>Intersection A ∩ B</td><td>in A <strong>and</strong> B</td><td><code>[...a].filter(x =&gt; b.has(x))</code></td><td><code>INTERSECT</code> / inner join</td></tr>
  <tr><td>Difference A − B</td><td>in A but <strong>not</strong> B</td><td><code>[...a].filter(x =&gt; !b.has(x))</code></td><td><code>EXCEPT</code></td></tr>
  <tr><td>Remove duplicates</td><td>unique values</td><td><code>[...new Set(arr)]</code></td><td><code>SELECT DISTINCT</code></td></tr>
</table>
<div class="callout analogy"><p>Lesson 01 strikes again: intersection is <strong>AND</strong>, union is <strong>OR</strong>, difference is <strong>AND NOT</strong>.</p></div>
<div class="callout tip"><p>Newer browsers also offer <code>a.union(b)</code>, <code>a.intersection(b)</code> and <code>a.difference(b)</code> built in.</p></div>`
    },
    {
      title: "The four hash-map patterns",
      html: `
<table>
  <tr><th>Pattern</th><th>Question it answers</th><th>Core line</th></tr>
  <tr><td><strong>Frequency counting</strong></td><td>"How many of each?"</td><td><code>counts[x] = (counts[x] || 0) + 1</code></td></tr>
  <tr><td><strong>Seen-set</strong></td><td>"Have I met this before?"</td><td><code>if (seen.has(x)) ...; seen.add(x)</code></td></tr>
  <tr><td><strong>Complement lookup</strong></td><td>"Is the partner I need already here?"</td><td><code>if (map.has(target - x)) ...</code></td></tr>
  <tr><td><strong>Grouping by key</strong></td><td>"Which items belong together?"</td><td><code>map.get(key).push(item)</code></td></tr>
</table>
<p>Example - <strong>two-sum</strong> with complement lookup. Which two prices add up to a 100 gift card?</p>
<pre><code class="language-javascript">const prices = [35, 20, 80, 65];
const seenAt = new Map();                  // price -> index
for (let i = 0; i &lt; prices.length; i++) {
  const need = 100 - prices[i];            // the partner we're looking for
  if (seenAt.has(need)) console.log(seenAt.get(need), i);   // 0 3  (35 + 65)
  seenAt.set(prices[i], i);
}</code></pre>
<div class="callout key"><p>Whenever you see a nested loop that <em>searches</em> for something, ask: "Could I remember what I've seen in a Set or Map instead?"
That one question turns most O(n²) answers into O(n).</p></div>`
    },
    {
      title: "Link to databases: indexes are lookup tables",
      html: `
<p>A database <strong>index</strong> is the same idea at scale. Without one, this query reads <em>every</em> row (a "full table scan", O(n)):</p>
<pre><code class="language-sql">SELECT * FROM customers WHERE email = 'ada@example.com';</code></pre>
<p>With an index on <code>email</code>, the database jumps (almost) straight to the matching row.</p>
<ul>
  <li><strong>Hash index:</strong> O(1) exact matches (<code>=</code>), just like a <code>Map</code>. Useless for ranges.</li>
  <li><strong>B-tree index</strong> (the usual default): O(log n), kept <em>sorted</em>, so it also helps <code>&lt;</code>, <code>BETWEEN</code> and <code>ORDER BY</code>.</li>
  <li><strong>Hash join:</strong> to join two tables, the database often builds a hash map of one table's key, then probes it while scanning the other - exactly the two-sum pattern.</li>
</ul>
<div class="callout work"><p>Same trade-off as in your code: indexes cost extra storage and make writes a little slower, in exchange for much faster reads.
You'll use them in lesson 13.</p></div>`
    }
  ],

  examples: [
    {
      title: "Phone contacts with a Map",
      code: `const contacts = new Map();
contacts.set("Ada Lovelace", "0917-555-0101");
contacts.set("Grace Hopper", "0917-555-0102");
contacts.set("Linus Torvalds", "0917-555-0103");

console.log("Grace:", contacts.get("Grace Hopper"));
console.log("Has Alan?", contacts.has("Alan Turing"));

contacts.set("Ada Lovelace", "0917-555-9999");   // same key = update
contacts.delete("Linus Torvalds");
console.log("Size now:", contacts.size);

for (const [name, phone] of contacts) {
  console.log(" -", name, phone);
}`,
      explain: `
<ol>
  <li><code>set(key, value)</code> adds a pair; setting an <strong>existing</strong> key replaces its value (keys are unique).</li>
  <li><code>get</code> returns the value, or <code>undefined</code> if the key is missing. <code>has</code> answers yes/no.</li>
  <li>Looping a Map gives <code>[key, value]</code> pairs in the order they were first inserted.</li>
  <li><strong>Try it:</strong> print <code>contacts.get("Linus Torvalds")</code> after the delete.</li>
</ol>`
    },
    {
      title: "Counting log levels (frequency counting)",
      code: `const logLines = [
  "2026-10-07 09:00 INFO  user login",
  "2026-10-07 09:01 ERROR payment timeout",
  "2026-10-07 09:02 INFO  page view",
  "2026-10-07 09:03 WARN  slow query",
  "2026-10-07 09:04 ERROR payment timeout",
  "2026-10-07 09:05 INFO  user logout"
];

const counts = {};
for (const line of logLines) {
  const level = line.split(/\\s+/)[2];       // 3rd word is the level
  counts[level] = (counts[level] || 0) + 1;
}

for (const [level, n] of Object.entries(counts)) {
  console.log(level.padEnd(6), n);
}`,
      explain: `
<table>
  <tr><th>line</th><th>level</th><th>counts after</th></tr>
  <tr><td>1</td><td>INFO</td><td>{ INFO: 1 }</td></tr>
  <tr><td>2</td><td>ERROR</td><td>{ INFO: 1, ERROR: 1 }</td></tr>
  <tr><td>3</td><td>INFO</td><td>{ INFO: 2, ERROR: 1 }</td></tr>
  <tr><td>...</td><td>...</td><td>...</td></tr>
</table>
<p><code>counts[level] || 0</code> means "current count, or 0 if this level is new". One pass, O(n) - no matter how many log lines.
<strong>Try it:</strong> count by message instead of level.</p>`
    },
    {
      title: "Array.includes vs Set.has - feel the difference",
      code: `const n = 10000;
const ids = [];
for (let i = 0; i < n; i++) ids.push("CUST-" + i);
const idSet = new Set(ids);

let t = Date.now();
let found = 0;
for (let i = 0; i < n; i++) if (ids.includes("CUST-" + i)) found++;
console.log("array.includes:", Date.now() - t, "ms, found", found);

t = Date.now();
found = 0;
for (let i = 0; i < n; i++) if (idSet.has("CUST-" + i)) found++;
console.log("set.has       :", Date.now() - t, "ms, found", found);`,
      explain: `
<ol>
  <li>The array version scans the list for each lookup: about n &times; n / 2 = 50 million comparisons.</li>
  <li>The Set version jumps straight to the bucket: about n = 10,000 lookups in total.</li>
  <li>Exact timings depend on your machine, but the gap grows fast as <code>n</code> grows.</li>
  <li><strong>Try it:</strong> double <code>n</code> to 20000. The array time roughly <em>quadruples</em>; the Set time roughly doubles.</li>
</ol>`
    },
    {
      title: "Deduplicating a mailing list",
      code: `const signups = [
  "ada@example.com",
  "Grace@Example.com",
  "ada@example.com ",
  "linus@example.com",
  "grace@example.com"
];

const unique = new Set();
for (const email of signups) {
  unique.add(email.trim().toLowerCase());   // normalise first!
}

console.log("Raw signups :", signups.length);
console.log("Unique      :", unique.size);
console.log([...unique].join(", "));`,
      explain: `
<ol>
  <li>A Set keeps only one copy of each value, so <code>add</code>-ing a duplicate does nothing.</li>
  <li>Without <code>trim().toLowerCase()</code>, <code>"Grace@Example.com"</code> and <code>"grace@example.com"</code> would count as different people.</li>
  <li><code>[...unique]</code> spreads the Set back into an array.</li>
  <li><strong>Try it:</strong> remove the normalising and see the count go up.</li>
</ol>`
    },
    {
      title: "Set operations: course enrollments",
      code: `const sql = new Set(["Ana", "Ben", "Cara", "Dev"]);
const js = new Set(["Cara", "Dev", "Eli"]);

const both = [...sql].filter(name => js.has(name));
const either = [...new Set([...sql, ...js])];
const onlySql = [...sql].filter(name => !js.has(name));

console.log("Both courses  :", both.join(", "));
console.log("Either course :", either.join(", "));
console.log("Only SQL      :", onlySql.join(", "));`,
      explain: `
<table>
  <tr><th>Operation</th><th>Logic</th><th>Result</th></tr>
  <tr><td>Intersection</td><td>in SQL <strong>AND</strong> in JS</td><td>Cara, Dev</td></tr>
  <tr><td>Union</td><td>in SQL <strong>OR</strong> in JS</td><td>Ana, Ben, Cara, Dev, Eli</td></tr>
  <tr><td>Difference</td><td>in SQL <strong>AND NOT</strong> in JS</td><td>Ana, Ben</td></tr>
</table>
<p>Each <code>filter</code> calls <code>has</code> (O(1)), so the whole thing is O(n + m). <strong>Try it:</strong> find students taking only JS.</p>`
    },
    {
      title: "Grouping orders by customer",
      code: `const orders = [
  { id: "ORD-1", customer: "Ana", total: 120 },
  { id: "ORD-2", customer: "Ben", total: 45 },
  { id: "ORD-3", customer: "Ana", total: 80 },
  { id: "ORD-4", customer: "Cara", total: 200 },
  { id: "ORD-5", customer: "Ben", total: 15 }
];

const byCustomer = new Map();
for (const o of orders) {
  if (!byCustomer.has(o.customer)) byCustomer.set(o.customer, []);
  byCustomer.get(o.customer).push(o);
}

for (const [name, list] of byCustomer) {
  const sum = list.reduce((acc, o) => acc + o.total, 0);
  console.log(name, "-", list.length, "orders, total", sum);
}`,
      explain: `
<ol>
  <li>For each order, make sure the customer has a list (create an empty one the first time).</li>
  <li>Push the order into that customer's list.</li>
  <li>Then summarise each group. This is exactly what SQL's <code>GROUP BY customer</code> does with <code>COUNT(*)</code> and <code>SUM(total)</code>.</li>
</ol>`
    },
    {
      title: "Two-sum: which prices match the gift card?",
      code: `function findPair(prices, budget) {
  const seenAt = new Map();               // price -> index
  for (let i = 0; i < prices.length; i++) {
    const need = budget - prices[i];
    console.log("  i=" + i, "price", prices[i], "need", need, "seen?", seenAt.has(need));
    if (seenAt.has(need)) return [seenAt.get(need), i];
    seenAt.set(prices[i], i);
  }
  return null;
}

const prices = [35, 20, 80, 65];
const pair = findPair(prices, 100);
console.log("Pair of indexes:", pair.join(" & "));
console.log("Prices:", prices[pair[0]], "+", prices[pair[1]]);`,
      explain: `
<table>
  <tr><th>i</th><th>price</th><th>need</th><th>in map?</th><th>map after</th></tr>
  <tr><td>0</td><td>35</td><td>65</td><td>no</td><td>{35:0}</td></tr>
  <tr><td>1</td><td>20</td><td>80</td><td>no</td><td>{35:0, 20:1}</td></tr>
  <tr><td>2</td><td>80</td><td>20</td><td><strong>yes</strong> &rarr; [1, 2]</td><td>-</td></tr>
</table>
<p>Instead of trying every pair (O(n²)), each price asks one O(1) question: "is my partner already here?".
We check <em>before</em> storing so a price can't pair with itself. <strong>Try it:</strong> use a budget of 145.</p>`
    },
    {
      title: "Spot the first duplicate transaction (seen-set)",
      code: `const txIds = ["TX-101", "TX-102", "TX-103", "TX-102", "TX-104", "TX-101"];

const seen = new Set();
let firstDup = null;
for (const id of txIds) {
  if (seen.has(id)) {
    firstDup = id;
    break;                 // stop at the first repeat
  }
  seen.add(id);
}
console.log("First duplicate:", firstDup);
console.log("Checked before stopping:", seen.size + 1, "of", txIds.length);`,
      explain: `
<ol>
  <li>Before adding each ID, ask the Set "have I seen this already?".</li>
  <li><code>TX-102</code> is the first ID we meet a second time, so we stop there - even though <code>TX-101</code> also repeats later.</li>
  <li>Payment systems use this exact check to block double charges.</li>
</ol>`
    },
    {
      title: "Keys gotchas: strings vs numbers, references vs content",
      code: `const obj = {};
obj[1] = "number one";
obj["1"] = "string one";
console.log("Object keys:", Object.keys(obj).length, "->", obj[1]);

const map = new Map();
map.set(1, "number one");
map.set("1", "string one");
console.log("Map size:", map.size);

const points = new Set();
points.add([3, 4]);
console.log("Has [3, 4]?", points.has([3, 4]));
points.add("3,4");
console.log("Has \\"3,4\\"?", points.has("3,4"));`,
      explain: `
<ol>
  <li>Object keys are always strings, so <code>1</code> and <code>"1"</code> collide - the second write overwrites the first.</li>
  <li>A Map keeps them apart: size 2.</li>
  <li>Arrays are compared by <strong>reference</strong>: the <code>[3, 4]</code> you look up is a different array from the one you stored.</li>
  <li>Fix: use a string key like <code>"3,4"</code>.</li>
</ol>`
    },
    {
      title: "Caching slow results (memoization)",
      code: `let apiCalls = 0;
function slowPriceLookup(sku) {
  apiCalls++;                          // pretend this is a slow API call
  return sku.length * 10;
}

const cache = new Map();
function getPrice(sku) {
  if (cache.has(sku)) return cache.get(sku);   // fast path
  const price = slowPriceLookup(sku);
  cache.set(sku, price);
  return price;
}

const requests = ["SKU-1", "SKU-22", "SKU-1", "SKU-1", "SKU-22", "SKU-333"];
for (const sku of requests) getPrice(sku);
console.log("Requests:", requests.length, "| real API calls:", apiCalls);`,
      explain: `
<ol>
  <li>Before doing slow work, check the cache. If the answer is there, return it instantly.</li>
  <li>Otherwise compute it, store it, and return it.</li>
  <li>6 requests but only 3 real calls - one per <em>distinct</em> SKU. Web apps, browsers and databases all cache like this.</li>
  <li><strong>Try it:</strong> add 10 more <code>"SKU-1"</code> requests; <code>apiCalls</code> stays at 3.</li>
</ol>`
    }
  ],

  pitfalls: [
    "Hidden O(n²): <code>arr.includes(x)</code> or <code>indexOf</code> inside a loop. Build a <code>Set</code> once, then use <code>has</code>.",
    "Plain-object keys are always strings: <code>o[1]</code> and <code>o[\"1\"]</code> are the same key. A <code>Map</code> keeps them separate.",
    "<code>Map</code> and <code>Set</code> compare arrays and objects by <strong>reference</strong>. Use a string key such as <code>\"3,4\"</code> or a sorted word.",
    "<code>if (counts[x])</code> is false when the count is <code>0</code>. Use <code>x in counts</code> or <code>map.has(x)</code> to test whether a key exists.",
    "Hash maps aren't sorted. If the output must be in order, sort it explicitly at the end.",
    "<code>JSON.stringify(new Map(...))</code> prints <code>{}</code>. Convert first with <code>Object.fromEntries(map)</code>."
  ],

  quiz: [
    {
      q: "What does this print?",
      code: `const tags = new Set(["sale", "new", "sale", "hot"]);
console.log(tags.size);`,
      options: ["2", "3", "4", "An error"],
      answer: 1,
      output: "3",
      explain: "<p>A Set keeps only <strong>unique</strong> values. The second <code>\"sale\"</code> is ignored, leaving sale, new and hot.</p>"
    },
    {
      q: "What does this print?",
      code: `const o = {};
o[1] = "first";
o["1"] = "second";
console.log(Object.keys(o).length + " " + o[1]);`,
      options: ["2 first", "1 second", "1 first", "2 second"],
      answer: 1,
      output: "1 second",
      explain: "<p>Object keys are converted to strings, so <code>1</code> becomes <code>\"1\"</code> - it's the <strong>same key</strong>. The second assignment overwrites the first. A <code>Map</code> would keep both.</p>"
    },
    {
      q: "What does this print?",
      code: `const visited = new Set();
visited.add([2, 3]);
console.log(visited.has([2, 3]));`,
      options: ["true", "false", "undefined", "An error"],
      answer: 1,
      output: "false",
      explain: "<p>Each <code>[2, 3]</code> literal creates a <strong>new</strong> array. Sets compare objects by reference (\"is it the very same object?\"), not by content. Store a string like <code>\"2,3\"</code> instead.</p>"
    },
    {
      q: "On average, how long does <code>map.has(key)</code> take as the map grows from 1,000 to 1,000,000 entries?",
      options: [
        "About 1,000 times longer - O(n)",
        "About the same - O(1) on average",
        "About twice as long - O(log n)",
        "It depends on the length of the key's name only"
      ],
      answer: 1,
      explain: "<p>The hash function sends the key straight to its bucket, so lookup cost doesn't depend on how many entries exist. It's O(1) <em>on average</em>; heavy collisions could make it worse, but good hash tables resize to prevent that.</p>"
    },
    {
      q: "You need to count how many times each word appears. Which code is correct?",
      options: [
        "<code>counts[w] = counts[w] + 1;</code>",
        "<code>counts[w] = (counts[w] || 0) + 1;</code>",
        "<code>counts[w]++ || 0;</code>",
        "<code>counts.push(w);</code>"
      ],
      answer: 1,
      explain: "<p>The first time a word appears, <code>counts[w]</code> is <code>undefined</code>, and <code>undefined + 1</code> is <code>NaN</code> (option A). <code>|| 0</code> supplies a starting value of 0. Option C also starts from <code>undefined</code> and produces <code>NaN</code>.</p>"
    },
    {
      q: "What does this print?",
      code: `const a = new Set([1, 2, 3, 4]);
const b = new Set([3, 4, 5]);
const result = [...a].filter(x => !b.has(x));
console.log(result.join(","));`,
      options: ["3,4", "1,2", "1,2,5", "5"],
      answer: 1,
      output: "1,2",
      explain: "<p>Keep items of <code>a</code> that are <strong>not</strong> in <code>b</code>: that's the <strong>difference</strong> A − B. 3 and 4 are removed, leaving 1 and 2. (5 is only in <code>b</code>, so it never appears.)</p>"
    },
    {
      q: "Your <code>SELECT ... WHERE email = ?</code> query is slow on a 5-million-row table. What is the hash-map-style fix?",
      options: [
        "Add an index on the <code>email</code> column",
        "Sort the table by id",
        "Use <code>SELECT DISTINCT</code>",
        "Split the query into two queries"
      ],
      answer: 0,
      explain: "<p>Without an index the database scans every row (O(n)). An index is a lookup structure (hash or B-tree) on <code>email</code>, so the database can jump to the matching row - the same idea as <code>map.get(email)</code>.</p>"
    }
  ],

  interview: [
    { q: "Why is hash map lookup O(1) on average but O(n) in the worst case?",
      a: "<p>The hash function sends a key directly to a bucket, so lookup cost doesn't depend on the number of items. If many keys collide in one bucket (a poor hash function or a deliberate attack), that bucket becomes a long list to scan - O(n). Good hash functions plus resizing keep buckets short.</p>" },
    { q: "Solve two-sum in better than O(n²).",
      a: "<p>One pass with a map from value → index. For each <code>x</code> at index <code>i</code>, check whether <code>target - x</code> is already in the map; if yes, return both indices, otherwise store <code>x → i</code>. O(n) time, O(n) space. Sorting + two pointers is O(n log n) but loses the original indices.</p>" },
    { q: "When would you use a <code>Map</code> instead of a plain object in JavaScript?",
      a: "<p>When keys are not strings (numbers, objects), when keys come from users (no collisions with built-in names like <code>\"__proto__\"</code> or <code>\"constructor\"</code>), when you need <code>.size</code>, or when you add and delete keys often.</p>" },
    { q: "How do you find duplicates in a huge list efficiently?",
      a: "<p>Stream through it with a seen-set: if <code>seen.has(x)</code> you found a duplicate, else <code>seen.add(x)</code>. O(n) time, O(n) memory. If memory is tight, sort first (O(n log n), little extra memory) and compare neighbours.</p>" },
    { q: "How would you group anagrams together?",
      a: "<p>Give every word a <strong>key</strong> that is the same for all its anagrams - its letters sorted (<code>\"eat\" → \"aet\"</code>) or a 26-letter count string. Use a map from key → list of words. O(n · k log k) for n words of length k.</p>" },
    { q: "How does a database index relate to a hash map?",
      a: "<p>Both are extra structures that trade space (and slower writes) for fast lookups. A hash index gives O(1) equality lookups like a <code>Map</code>; a B-tree index gives O(log n) lookups and also supports ranges and ordering. A hash join builds a hash map of one table and probes it with the other.</p>" }
  ],

  exercises: [
    {
      id: "unique-values",
      title: "uniqueValues (warm-up)",
      difficulty: "easy",
      prompt: "<p>Return a new array with duplicates removed, keeping the <strong>first</strong> time each value appears, in the original order.</p><p><code>[3, 1, 3, 2, 1] &rarr; [3, 1, 2]</code> &nbsp; <code>[\"ada\", \"bob\", \"ada\"] &rarr; [\"ada\", \"bob\"]</code> &nbsp; <code>[] &rarr; []</code></p>",
      starter: `function uniqueValues(arr) {
  // your code here
}`,
      solution: `function uniqueValues(arr) {
  // A Set ignores repeats and remembers insertion order;
  // spreading it back gives an array of first occurrences.
  return [...new Set(arr)];
}`,
      hint: "A <code>Set</code> only keeps one copy of each value and remembers the order you added them. <code>[...set]</code> turns it back into an array.",
      tests: [
        { expr: "uniqueValues([3, 1, 3, 2, 1])", expected: [3, 1, 2] },
        { expr: "uniqueValues([\"ada\", \"bob\", \"ada\"])", expected: ["ada", "bob"] },
        { expr: "uniqueValues([])", expected: [] },
        { expr: "uniqueValues([7, 7, 7])", expected: [7] },
        { expr: "uniqueValues([1, \"1\", 1])", expected: [1, "1"], label: "1 and \"1\" are different values" }
      ]
    },
    {
      id: "char-frequency",
      title: "charFrequency",
      difficulty: "easy",
      prompt: "<p>Return a <strong>plain object</strong> mapping each character of <code>s</code> to how many times it appears (case-sensitive; spaces count too).</p><p><code>\"hello\" &rarr; { h: 1, e: 1, l: 2, o: 1 }</code> &nbsp; <code>\"aaa\" &rarr; { a: 3 }</code> &nbsp; <code>\"\" &rarr; {}</code></p>",
      starter: `function charFrequency(s) {
  // your code here
}`,
      solution: `function charFrequency(s) {
  const counts = {};
  for (const ch of s) {
    // current count (or 0 if new) plus one
    counts[ch] = (counts[ch] || 0) + 1;
  }
  return counts;
}`,
      hint: "Start with <code>{}</code>. For each character: <code>counts[ch] = (counts[ch] || 0) + 1</code>.",
      tests: [
        { expr: "charFrequency(\"hello\")", expected: { h: 1, e: 1, l: 2, o: 1 } },
        { expr: "charFrequency(\"\")", expected: {} },
        { expr: "charFrequency(\"aaa\")", expected: { a: 3 } },
        { expr: "charFrequency(\"Aa a\")", expected: { A: 1, a: 2, " ": 1 } }
      ]
    },
    {
      id: "has-duplicates",
      title: "hasDuplicates",
      difficulty: "easy",
      prompt: "<p>Return <code>true</code> if any value appears more than once in <code>arr</code>. It must handle 100,000 items quickly - no nested loops.</p><p><code>[1, 2, 3, 1] &rarr; true</code> &nbsp; <code>[1, 2, 3] &rarr; false</code> &nbsp; <code>[] &rarr; false</code></p>",
      starter: `function hasDuplicates(arr) {
  // your code here
}`,
      solution: `function hasDuplicates(arr) {
  const seen = new Set();
  for (const x of arr) {
    if (seen.has(x)) return true;   // met it before -> duplicate
    seen.add(x);
  }
  return false;
  // One-liner: return new Set(arr).size !== arr.length;
}`,
      hint: "Keep a <code>Set</code> of values you've already seen. Or compare <code>new Set(arr).size</code> with <code>arr.length</code> - if the Set is smaller, something was dropped as a duplicate.",
      tests: [
        { expr: "hasDuplicates([1, 2, 3, 1])", expected: true },
        { expr: "hasDuplicates([1, 2, 3])", expected: false },
        { expr: "hasDuplicates([])", expected: false },
        { expr: "hasDuplicates([\"a\", \"b\", \"a\"])", expected: true },
        { expr: "hasDuplicates([1, \"1\"])", expected: false, label: "1 and \"1\" are different values" },
        { label: "100,000 unique numbers (must be fast)", code: "const a = []; for (let i = 0; i < 100000; i++) a.push(i); return hasDuplicates(a);", expected: false, maxMs: 500 }
      ]
    },
    {
      id: "two-sum",
      title: "twoSum",
      difficulty: "medium",
      prompt: "<p>Return the indexes <code>[i, j]</code> (with <code>i &lt; j</code>) of the two numbers in <code>nums</code> that add up to <code>target</code>, or <code>null</code> if no pair exists. Assume at most one valid pair. Aim for O(n) with a Map.</p><p><code>([2, 7, 11, 15], 9) &rarr; [0, 1]</code> &nbsp; <code>([3, 2, 4], 6) &rarr; [1, 2]</code> &nbsp; <code>([1, 2, 3], 100) &rarr; null</code></p>",
      starter: `function twoSum(nums, target) {
  // your code here
}`,
      solution: `function twoSum(nums, target) {
  const indexOf = new Map();             // value -> index where we saw it
  for (let j = 0; j < nums.length; j++) {
    const need = target - nums[j];       // the partner we're looking for
    if (indexOf.has(need)) {
      return [indexOf.get(need), j];     // partner seen earlier -> done
    }
    indexOf.set(nums[j], j);             // store AFTER checking (no self-pairs)
  }
  return null;
}`,
      hint: "For each number <code>x</code>, the partner you need is <code>target - x</code>. Keep a <code>Map</code> from value to index. Check for the partner first, <em>then</em> store the current number.",
      explanation: "<p>The brute-force answer tries every pair: O(n²). The Map version asks one O(1) question per number - \"is my partner already here?\" - so it's O(n). Storing <em>after</em> checking is what stops <code>[3, 2, 4]</code> with target 6 from pairing the 3 with itself.</p>",
      tests: [
        { expr: "twoSum([2, 7, 11, 15], 9)", expected: [0, 1] },
        { expr: "twoSum([3, 2, 4], 6)", expected: [1, 2], label: "don't use the same element twice" },
        { expr: "twoSum([3, 3], 6)", expected: [0, 1] },
        { expr: "twoSum([-1, -2, -3, -4], -7)", expected: [2, 3] },
        { expr: "twoSum([1, 2, 3], 100)", expected: null },
        { expr: "twoSum([], 0)", expected: null },
        { label: "100,000 numbers, pair at the very end (must be O(n))", code: "const a = []; for (let i = 0; i < 100000; i++) a.push(i * 2); return twoSum(a, 2 * 99998 + 2 * 99999);", expected: [99998, 99999], maxMs: 500 }
      ]
    },
    {
      id: "first-repeated",
      title: "firstRepeated",
      difficulty: "medium",
      prompt: "<p>Reading left to right, return the first value you see for the <strong>second</strong> time, or <code>null</code> if all values are unique.</p><p><code>[2, 5, 1, 2, 3, 5] &rarr; 2</code> &nbsp; <code>[2, 1, 3, 5, 3, 2] &rarr; 3</code> (3 repeats before 2 does) &nbsp; <code>[1, 2, 3] &rarr; null</code></p>",
      starter: `function firstRepeated(arr) {
  // your code here
}`,
      solution: `function firstRepeated(arr) {
  const seen = new Set();
  for (const x of arr) {
    if (seen.has(x)) return x;   // first value we meet a second time
    seen.add(x);
  }
  return null;
}`,
      hint: "Walk through the array with a <code>Set</code>. The moment you meet a value that's already in the Set, return it.",
      explanation: "<p>Note the subtle wording: it's the first value whose <em>second</em> appearance comes earliest, not the first value that has any duplicate. In <code>[2, 1, 3, 5, 3, 2]</code>, 2 appears first, but 3 is the first to repeat. The seen-set naturally gets this right in O(n).</p>",
      tests: [
        { expr: "firstRepeated([2, 5, 1, 2, 3, 5])", expected: 2 },
        { expr: "firstRepeated([2, 1, 3, 5, 3, 2])", expected: 3 },
        { expr: "firstRepeated([1, 2, 3])", expected: null },
        { expr: "firstRepeated([])", expected: null },
        { expr: "firstRepeated([\"a\", \"b\", \"b\", \"a\"])", expected: "b" },
        { label: "100,000 values, repeat at the end (must be fast)", code: "const a = []; for (let i = 0; i < 100000; i++) a.push(i); a.push(99999); return firstRepeated(a);", expected: 99999, maxMs: 500 }
      ]
    },
    {
      id: "intersection",
      title: "intersection of two arrays",
      difficulty: "medium",
      prompt: "<p>Return the numbers that appear in <strong>both</strong> arrays, each listed once, sorted from smallest to largest.</p><p><code>([1, 2, 2, 1], [2, 2]) &rarr; [2]</code> &nbsp; <code>([4, 9, 5], [9, 4, 9, 8, 4]) &rarr; [4, 9]</code> &nbsp; <code>([1, 2], [3, 4]) &rarr; []</code></p>",
      starter: `function intersection(a, b) {
  // your code here
}`,
      solution: `function intersection(a, b) {
  const inB = new Set(b);                              // O(1) lookups into b
  const common = new Set(a.filter(x => inB.has(x)));   // in both; Set drops repeats
  return [...common].sort((x, y) => x - y);            // numeric sort
}`,
      hint: "Put <code>b</code> into a <code>Set</code>. Filter <code>a</code> with <code>has</code>, remove repeats with another <code>Set</code>, then sort with <code>(x, y) =&gt; x - y</code>.",
      explanation: "<p><code>a.filter(x =&gt; b.includes(x))</code> looks right but is O(n &times; m) - it fails the 100,000-item test. Building a Set first makes each check O(1), so the whole thing is O(n + m) plus sorting the result. Watch the sort: without a compare function, <code>[10, 2, 33].sort()</code> sorts as text and gives <code>[10, 2, 33]</code>.</p>",
      tests: [
        { expr: "intersection([1, 2, 2, 1], [2, 2])", expected: [2] },
        { expr: "intersection([4, 9, 5], [9, 4, 9, 8, 4])", expected: [4, 9] },
        { expr: "intersection([1, 2], [3, 4])", expected: [] },
        { expr: "intersection([], [1])", expected: [] },
        { expr: "intersection([10, 2, 33], [33, 2, 10])", expected: [2, 10, 33], label: "numeric sort, not text sort" },
        { label: "100,000 x 100,000 elements (must be fast)", code: "const a = [], b = []; for (let i = 0; i < 100000; i++) { a.push(i); b.push(i + 50000); } const r = intersection(a, b); return [r.length, r[0], r[r.length - 1]];", expected: [50000, 50000, 99999], maxMs: 1000 }
      ]
    },
    {
      id: "word-count",
      title: "wordCount",
      difficulty: "medium",
      prompt: "<p>Count how many times each word appears. A word is a run of letters <code>a-z</code>, ignoring case (lower-case everything); every other character separates words. Return a <strong>plain object</strong>.</p><p><code>\"The cat and the hat.\" &rarr; { the: 2, cat: 1, and: 1, hat: 1 }</code> &nbsp; <code>\"Go, go, GO!\" &rarr; { go: 3 }</code> &nbsp; <code>\"\" &rarr; {}</code></p>",
      starter: `function wordCount(text) {
  // your code here
}`,
      solution: `function wordCount(text) {
  // 1) normalise case  2) pull out the words  3) frequency-count them
  const words = text.toLowerCase().match(/[a-z]+/g) || [];   // match gives null if none
  const counts = {};
  for (const w of words) counts[w] = (counts[w] || 0) + 1;
  return counts;
}`,
      hint: "<code>text.toLowerCase().match(/[a-z]+/g)</code> gives you an array of words (or <code>null</code> when there are none - use <code>|| []</code>). Then count them exactly like characters.",
      explanation: "<p>This is \"normalise, extract, count\" - the same pipeline behind word clouds, search-term reports and log summaries. The regex <code>/[a-z]+/g</code> means \"one or more letters, every match\", so punctuation and digits act as separators.</p>",
      tests: [
        { expr: "wordCount(\"The cat and the hat.\")", expected: { the: 2, cat: 1, and: 1, hat: 1 } },
        { expr: "wordCount(\"\")", expected: {} },
        { expr: "wordCount(\"... !!! 123\")", expected: {}, label: "no words at all" },
        { expr: "wordCount(\"Go, go, GO!\")", expected: { go: 3 } },
        { expr: "wordCount(\"one\\ntwo  two\\tthree-three-three\")", expected: { one: 1, two: 2, three: 3 } }
      ]
    },
    {
      id: "most-frequent-word",
      title: "mostFrequentWord",
      difficulty: "medium",
      prompt: "<p>Return the most frequent word (same word rules as <code>wordCount</code>: letters <code>a-z</code>, lower-cased). If words tie, return the one that appears <strong>first</strong> in the text. Return <code>null</code> if there are no words.</p><p><code>\"Apple banana apple\" &rarr; \"apple\"</code> &nbsp; <code>\"b a b a c\" &rarr; \"b\"</code> (tie, b came first) &nbsp; <code>\"\" &rarr; null</code></p>",
      starter: `function mostFrequentWord(text) {
  // your code here
}`,
      solution: `function mostFrequentWord(text) {
  const words = text.toLowerCase().match(/[a-z]+/g) || [];
  // A Map remembers the order keys were first added
  const counts = new Map();
  for (const w of words) counts.set(w, (counts.get(w) || 0) + 1);

  let best = null, bestCount = 0;
  for (const [w, c] of counts) {
    if (c > bestCount) {   // strictly greater: ties keep the earlier word
      best = w;
      bestCount = c;
    }
  }
  return best;
}`,
      hint: "Count into a <code>Map</code> (it loops in first-seen order). Then track the best word so far, replacing it only when a count is <em>strictly</em> greater.",
      explanation: "<p>Two O(n) passes: count, then find the max. The tie rule comes for free: the Map visits words in the order they first appeared, and using <code>&gt;</code> instead of <code>&gt;=</code> means a later word with an equal count never replaces an earlier one.</p>",
      tests: [
        { expr: "mostFrequentWord(\"b a b a c\")", expected: "b", label: "tie -> first in text" },
        { expr: "mostFrequentWord(\"Apple banana apple\")", expected: "apple" },
        { expr: "mostFrequentWord(\"one\")", expected: "one" },
        { expr: "mostFrequentWord(\"\")", expected: null },
        { expr: "mostFrequentWord(\"x y z z y y\")", expected: "y" }
      ]
    },
    {
      id: "is-isomorphic",
      title: "isIsomorphic",
      difficulty: "medium",
      prompt: "<p>Two strings are <em>isomorphic</em> if you can get <code>t</code> by consistently replacing characters of <code>s</code>: each character always maps to the same character, and no two different characters map to the same one.</p><p><code>(\"egg\", \"add\") &rarr; true</code> (e&rarr;a, g&rarr;d) &nbsp; <code>(\"foo\", \"bar\") &rarr; false</code> &nbsp; <code>(\"badc\", \"baba\") &rarr; false</code></p>",
      starter: `function isIsomorphic(s, t) {
  // your code here
}`,
      solution: `function isIsomorphic(s, t) {
  if (s.length !== t.length) return false;
  const sToT = new Map();   // what each s-char turns into
  const tToS = new Map();   // which s-char produced each t-char
  for (let i = 0; i < s.length; i++) {
    const a = s[i], b = t[i];
    if (sToT.has(a) && sToT.get(a) !== b) return false;   // a changed its mind
    if (tToS.has(b) && tToS.get(b) !== a) return false;   // b already taken
    sToT.set(a, b);
    tToS.set(b, a);
  }
  return true;
}`,
      hint: "Use <strong>two</strong> Maps: one from <code>s</code> to <code>t</code> and one from <code>t</code> to <code>s</code>. At every position, check both are consistent.",
      explanation: "<p>One map isn't enough. For <code>\"badc\"</code> &rarr; <code>\"baba\"</code>, the s&rarr;t map looks fine (b&rarr;b, a&rarr;a, d&rarr;b, c&rarr;a), but both <code>b</code> and <code>d</code> map to <code>b</code>. The reverse map catches that. This \"two-way mapping\" pattern also solves \"word pattern\" questions.</p>",
      tests: [
        { expr: "isIsomorphic(\"egg\", \"add\")", expected: true },
        { expr: "isIsomorphic(\"foo\", \"bar\")", expected: false },
        { expr: "isIsomorphic(\"paper\", \"title\")", expected: true },
        { expr: "isIsomorphic(\"badc\", \"baba\")", expected: false, label: "two letters can't map to the same one" },
        { expr: "isIsomorphic(\"\", \"\")", expected: true },
        { expr: "isIsomorphic(\"ab\", \"abc\")", expected: false }
      ]
    },
    {
      id: "group-anagrams",
      title: "groupAnagrams",
      difficulty: "hard",
      prompt: "<p>Group words that are anagrams of each other. To make the answer predictable: sort the words <strong>inside</strong> each group alphabetically, then sort the groups by their first word.</p><p><code>[\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"] &rarr; [[\"ate\", \"eat\", \"tea\"], [\"bat\"], [\"nat\", \"tan\"]]</code></p><p><code>[\"a\"] &rarr; [[\"a\"]]</code> &nbsp; <code>[] &rarr; []</code></p>",
      starter: `function groupAnagrams(words) {
  // your code here
}`,
      solution: `function groupAnagrams(words) {
  const groups = new Map();   // signature -> list of words
  for (const w of words) {
    // Anagrams share the same sorted letters: "eat", "tea" -> "aet"
    const key = w.split("").sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  // Make the output predictable: sort inside groups, then sort the groups
  const result = [...groups.values()].map(g => g.sort());
  return result.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
}`,
      hint: "Anagrams become identical when you sort their letters. Use that sorted string as a <code>Map</code> key and push each word into its group. Sort everything at the end.",
      explanation: "<p>This is the <strong>grouping by key</strong> pattern: invent a key that is identical for items that belong together. Cost: O(n &middot; k log k) for n words of length k. A faster key is a letter-count string like <code>\"1#0#0#...\"</code>, which takes O(k) to build.</p>",
      tests: [
        { expr: "groupAnagrams([\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"])", expected: [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]] },
        { expr: "groupAnagrams([])", expected: [] },
        { expr: "groupAnagrams([\"a\"])", expected: [["a"]] },
        { expr: "groupAnagrams([\"\", \"\"])", expected: [["", ""]] },
        { expr: "groupAnagrams([\"abc\", \"def\", \"cba\", \"fed\", \"xyz\"])", expected: [["abc", "cba"], ["def", "fed"], ["xyz"]] }
      ]
    },
    {
      id: "longest-consecutive",
      title: "longestConsecutive",
      difficulty: "hard",
      prompt: "<p>Given an <strong>unsorted</strong> array of whole numbers, return the length of the longest run of consecutive values (they can be anywhere in the array). Duplicates don't make a run longer. Aim for O(n).</p><p><code>[100, 4, 200, 1, 3, 2] &rarr; 4</code> (1, 2, 3, 4) &nbsp; <code>[1, 2, 2, 3] &rarr; 3</code> &nbsp; <code>[] &rarr; 0</code></p>",
      starter: `function longestConsecutive(nums) {
  // your code here
}`,
      solution: `function longestConsecutive(nums) {
  const set = new Set(nums);   // O(1) "is this number present?"
  let best = 0;
  for (const x of set) {
    if (set.has(x - 1)) continue;   // x is in the middle of a run - skip
    // x starts a run: count upward
    let length = 1;
    while (set.has(x + length)) length++;
    if (length > best) best = length;
  }
  return best;
}`,
      hint: "Put the numbers in a <code>Set</code>. A number <em>starts</em> a run only if <code>x - 1</code> is not in the Set. From each start, count upward with <code>has(x + 1)</code>, <code>has(x + 2)</code>...",
      explanation: "<p>Sorting first works too (O(n log n)). The Set trick is the classic O(n) answer: because we only start counting at the beginning of a run, each number is visited by the inner <code>while</code> at most once overall. Without the <code>x - 1</code> check, every number would start its own count and you'd be back to O(n²).</p>",
      tests: [
        { expr: "longestConsecutive([100, 4, 200, 1, 3, 2])", expected: 4 },
        { expr: "longestConsecutive([])", expected: 0 },
        { expr: "longestConsecutive([7])", expected: 1 },
        { expr: "longestConsecutive([1, 2, 2, 3])", expected: 3, label: "duplicates don't count twice" },
        { expr: "longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])", expected: 9 },
        { expr: "longestConsecutive([-2, -1, 0, 5])", expected: 3 },
        { label: "100,000 shuffled numbers (must be fast)", code: "const a = []; for (let i = 0; i < 100000; i++) a.push((i * 7919) % 100000); return longestConsecutive(a);", expected: 100000, maxMs: 1000 }
      ]
    }
  ],

  takeaways: [
    "A <strong>hash map</strong> (<code>Map</code> / object) links keys to values; a <strong>Set</strong> stores unique values. Both look things up in O(1) on average.",
    "The four patterns: <strong>count</strong> frequencies, keep a <strong>seen-set</strong>, look up the <strong>complement</strong>, <strong>group by key</strong>.",
    "A nested loop that searches is a red flag - remember what you've seen in a Set/Map to go from O(n²) to O(n).",
    "Object keys become strings; Map/Set compare arrays and objects by reference - use string keys like <code>\"3,4\"</code>.",
    "Union = OR, intersection = AND, difference = AND NOT; <code>[...new Set(arr)]</code> removes duplicates.",
    "A database index is a lookup table for a column: the same space-for-speed trade as a hash map."
  ]
});
