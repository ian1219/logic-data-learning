LDL.registerLesson({
  id: "06",
  title: "Strings",
  lang: "js",
  minutes: 60,
  goal: "Treat text as a row of characters you can index, slice, count and rebuild. Most \"string\" interview questions are really array, counting or two-pointer questions in disguise.",

  analogy: `
<p>Picture a <strong>necklace of letter beads</strong>. Each bead has a position (0, 1, 2...) and you can look at any bead,
count them, or copy a section. But the string is <strong>glued shut</strong>: you can't pop a bead out and swap it for another.
To "change" the necklace you thread a <em>brand-new</em> one, copying the beads you want.</p>
<p>That is a string in JavaScript: an ordered row of characters that you can read freely but never edit in place.
Once that clicks, every string method makes sense - they all hand you a <em>new</em> necklace.</p>`,

  objectives: [
    "Read characters by <strong>index</strong>, loop over a string and use <code>length</code> confidently",
    "Explain <strong>immutability</strong> and why building strings with <code>parts.join(\"\")</code> is the safe habit",
    "Use the everyday toolkit: <code>slice</code>, <code>split</code>/<code>join</code>, <code>trim</code>, <code>toLowerCase</code>, <code>includes</code>, <code>indexOf</code>",
    "Convert between characters and numbers with <code>charCodeAt</code> / <code>String.fromCharCode</code>",
    "Solve classic interview problems: palindromes, anagrams, first unique character, compression"
  ],

  realWorld: `
<ul>
  <li><strong>Validating form input:</strong> trimming spaces, checking an email has an <code>@</code>, comparing usernames case-insensitively.</li>
  <li><strong>Cleaning CSV/Excel data:</strong> splitting <code>"Lovelace, Ada"</code> into first and last name, fixing capitalisation, removing stray characters.</li>
  <li><strong>Reading log lines:</strong> pulling the date, level and message out of <code>"2026-10-07 ERROR Disk full"</code>.</li>
  <li><strong>Masking sensitive data:</strong> showing only the last 4 digits of a card or account number.</li>
  <li><strong>Interviews and exams:</strong> reverse a string, palindrome, anagram and compression are among the most-asked warm-ups.</li>
</ul>`,

  sections: [
    {
      title: "A string is a row of characters",
      html: `
<p>A <strong>string</strong> is text: a sequence of characters in quotes. Each character has a numbered position called an
<strong>index</strong>. Indexes start at <strong>0</strong>, not 1.</p>
<pre>
  const code = "SKU-42";

  index:    0     1     2     3     4     5
          +-----+-----+-----+-----+-----+-----+
          | 'S' | 'K' | 'U' | '-' | '4' | '2' |
          +-----+-----+-----+-----+-----+-----+
  length = 6        last index = length - 1 = 5
</pre>
<pre><code class="language-javascript">const code = "SKU-42";
console.log(code[0]);                 // "S"  - first character
console.log(code[code.length - 1]);   // "2"  - last character
console.log(code.at(-1));             // "2"  - .at() accepts negative indexes
console.log(code.length);             // 6

for (const ch of code) console.log(ch);   // visits S, K, U, -, 4, 2</code></pre>
<div class="callout key"><p>If you can work with arrays, you can work with strings. Index, length and loops behave the same way.</p></div>
<div class="callout warn"><p>Reading past the end does not crash: <code>code[99]</code> is <code>undefined</code>. That silent <code>undefined</code> is a common source of bugs.</p></div>`
    },
    {
      title: "Immutability: strings can't be edited in place",
      html: `
<p><strong>Immutable</strong> means "cannot be changed after it is created". You can <em>read</em> <code>name[0]</code>, but
assigning to it does nothing (or throws an error in strict mode).</p>
<pre><code class="language-javascript">let name = "maria";
name[0] = "M";                 // fails - strings are immutable (error in strict mode)
console.log(name);             // "maria"

name = "M" + name.slice(1);    // build a NEW string and re-assign the variable
console.log(name);             // "Maria"</code></pre>
<p><strong>Why it matters:</strong> every string method <em>returns a new string</em> and leaves the original alone.
If you forget to store the result, nothing happens.</p>
<pre><code class="language-javascript">let email = "  Ada@Example.COM ";
email.trim().toLowerCase();             // result thrown away!
email = email.trim().toLowerCase();     // correct: keep the new string</code></pre>
<div class="callout analogy"><p>Like the glued necklace: you can't swap a bead, but you can make a new necklace and hang it on the same hook
(the variable).</p></div>`
    },
    {
      title: "Building strings: += in a loop vs join",
      html: `
<p>Because strings are immutable, <code>result += piece</code> conceptually makes a brand-new string each time, copying
everything built so far. For <code>n</code> pieces that is <code>1 + 2 + ... + n</code> copies - roughly <strong>O(n²)</strong>
(the work grows with the square of the input).</p>
<p>The classic fix: collect the pieces in an <strong>array</strong> (cheap to add to) and <strong>join</strong> them once at the end - <strong>O(n)</strong>.</p>
<pre><code class="language-javascript">const names = ["Ada", "Grace", "Linus"];

// Pattern 1: += (fine for a few pieces)
let line = "";
for (const n of names) line += n + ";";

// Pattern 2: collect, then join once (the habit to build)
const parts = [];
for (const n of names) parts.push(n.toUpperCase());
const csv = parts.join(",");          // "ADA,GRACE,LINUS"</code></pre>
<div class="callout note"><p>Modern JavaScript engines optimise <code>+=</code> behind the scenes, so in JS the gap is often small.
In Java, C# and Python, though, <code>+=</code> in a big loop is a real slowdown and a classic interview red flag
(the fix there is <code>StringBuilder</code> / <code>"".join(...)</code>). Learn the reason - it's the same in every language.</p></div>`
    },
    {
      title: "Slicing and searching",
      html: `
<p><code>s.slice(start, end)</code> copies a piece of the string. <code>start</code> is <strong>included</strong>, <code>end</code> is
<strong>excluded</strong>, and negative numbers count from the end.</p>
<table>
  <tr><th>Code</th><th>With <code>s = "python"</code></th><th>In words</th></tr>
  <tr><td><code>s.slice(0, 2)</code></td><td><code>"py"</code></td><td>first 2 characters</td></tr>
  <tr><td><code>s.slice(1, 4)</code></td><td><code>"yth"</code></td><td>index 1 up to (not including) 4</td></tr>
  <tr><td><code>s.slice(2)</code></td><td><code>"thon"</code></td><td>from index 2 to the end</td></tr>
  <tr><td><code>s.slice(-3)</code></td><td><code>"hon"</code></td><td>last 3 characters</td></tr>
  <tr><td><code>s.indexOf("th")</code></td><td><code>2</code></td><td>where it starts (<code>-1</code> if missing)</td></tr>
  <tr><td><code>s.includes("on")</code></td><td><code>true</code></td><td>is it in there?</td></tr>
  <tr><td><code>s.startsWith("py")</code></td><td><code>true</code></td><td>does it begin with...?</td></tr>
</table>
<pre><code class="language-javascript">const card = "4111222233334444";
const masked = "*".repeat(card.length - 4) + card.slice(-4);
console.log(masked);   // "************4444"</code></pre>
<div class="callout tip"><p>Length of a slice = <code>end - start</code>. So <code>s.slice(1, 3)</code> has <strong>2</strong> characters, not 3.</p></div>`
    },
    {
      title: "Cleaning text: case, trim, split and join",
      html: `
<p>Real-world text is messy: extra spaces, MIXED case, commas in odd places. These methods clean it up:</p>
<table>
  <tr><th>Method</th><th>Example</th><th>Result</th></tr>
  <tr><td><code>trim()</code></td><td><code>"  hi  ".trim()</code></td><td><code>"hi"</code></td></tr>
  <tr><td><code>toLowerCase()</code> / <code>toUpperCase()</code></td><td><code>"HeLLo".toLowerCase()</code></td><td><code>"hello"</code></td></tr>
  <tr><td><code>split(sep)</code> - string &rarr; array</td><td><code>"a,b,c".split(",")</code></td><td><code>["a", "b", "c"]</code></td></tr>
  <tr><td><code>split(/\\s+/)</code> - split on any whitespace</td><td><code>"a   b c".split(/\\s+/)</code></td><td><code>["a", "b", "c"]</code></td></tr>
  <tr><td><code>join(sep)</code> - array &rarr; string</td><td><code>["a", "b"].join("-")</code></td><td><code>"a-b"</code></td></tr>
  <tr><td><code>replaceAll(old, new)</code></td><td><code>"0917-555-0101".replaceAll("-", "")</code></td><td><code>"09175550101"</code></td></tr>
  <tr><td><code>padStart(n, ch)</code></td><td><code>"7".padStart(3, "0")</code></td><td><code>"007"</code></td></tr>
</table>
<p><strong>Split - process - join</strong> is the workhorse pattern for word-level tasks:</p>
<pre><code class="language-javascript">const title = "the quick brown fox";
const shout = title.split(" ")              // ["the", "quick", "brown", "fox"]
  .map(w => w.toUpperCase())                // process each word
  .join(" ");                               // "THE QUICK BROWN FOX"</code></pre>
<div class="callout work"><p>Comparing user input? Always normalise first: <code>a.trim().toLowerCase() === b.trim().toLowerCase()</code>.
<code>"Ada@x.com "</code> and <code>"ada@x.com"</code> are the same person.</p></div>`
    },
    {
      title: "Characters are numbers underneath",
      html: `
<p>Computers store each character as a number called a <strong>character code</strong>. Letters are in order, so you can do maths with them.</p>
<table>
  <tr><th>Call</th><th>Result</th><th>Note</th></tr>
  <tr><td><code>"a".charCodeAt(0)</code></td><td><code>97</code></td><td><code>a..z</code> = 97..122</td></tr>
  <tr><td><code>"A".charCodeAt(0)</code></td><td><code>65</code></td><td><code>A..Z</code> = 65..90</td></tr>
  <tr><td><code>"0".charCodeAt(0)</code></td><td><code>48</code></td><td><code>0..9</code> = 48..57</td></tr>
  <tr><td><code>String.fromCharCode(98)</code></td><td><code>"b"</code></td><td>number &rarr; character</td></tr>
</table>
<pre><code class="language-javascript">// Position in the alphabet (a = 0 ... z = 25)
const pos = "d".charCodeAt(0) - 97;            // 3

// Shift a letter by k, wrapping z -> a  (Caesar cipher)
const k = 2;
const shifted = String.fromCharCode((pos + k) % 26 + 97);   // "f"</code></pre>
<div class="callout warn"><p>For negative shifts, remember lesson 01: <code>-1 % 26</code> is <code>-1</code> in JS. Use
<code>((x % 26) + 26) % 26</code> to always land in 0..25.</p></div>`
    },
    {
      title: "Four patterns that solve most string questions",
      html: `
<table>
  <tr><th>Pattern</th><th>Use it for</th><th>Sketch</th></tr>
  <tr><td><strong>Normalise first</strong></td><td>ignore case, spaces, punctuation</td><td><code>s.toLowerCase().replace(/[^a-z0-9]/g, "")</code></td></tr>
  <tr><td><strong>Two pointers</strong></td><td>palindromes, reversing</td><td>start <code>i</code> at the left, <code>j</code> at the right, walk inward</td></tr>
  <tr><td><strong>Count characters</strong></td><td>anagrams, first unique, most common</td><td><code>counts[ch] = (counts[ch] || 0) + 1</code></td></tr>
  <tr><td><strong>Run-length scan</strong></td><td>compression, longest streak</td><td>track current char + count, flush when it changes</td></tr>
</table>
<pre>
 Two pointers on "level":
   i                 j
   l   e   v   e   l        l == l  -> move both inward
       i       j
   l   e   v   e   l        e == e  -> move both inward
           ij
   l   e   v   e   l        pointers met -> palindrome!
</pre>
<div class="callout key"><p>When a string problem feels hard, ask: "Would this be easy if it were an array of characters?" Usually, yes.</p></div>`
    }
  ],

  examples: [
    {
      title: "Reading a product code character by character",
      code: `const sku = "SKU-4821-BLU";

console.log("First char:", sku[0]);
console.log("Last char :", sku[sku.length - 1]);
console.log("Length    :", sku.length);

let digits = 0;
for (const ch of sku) {
  if (ch >= "0" && ch <= "9") digits++;
}
console.log("Digits in code:", digits);`,
      explain: `
<ol>
  <li><code>sku[0]</code> reads index 0; the last index is always <code>length - 1</code> (here 11).</li>
  <li><code>for (const ch of sku)</code> hands you each character in turn, just like looping over an array.</li>
  <li><code>ch &gt;= "0" &amp;&amp; ch &lt;= "9"</code> works because digit characters are stored in order.</li>
  <li><strong>Try it:</strong> count the letters <code>A-Z</code> instead of digits.</li>
</ol>`
    },
    {
      title: "Immutability: fixing a name",
      code: `let customer = "maria santos";

try {
  customer[0] = "M";             // not allowed: strings can't be changed in place
} catch (err) {
  console.log("Error:", err.message);
}
console.log("After [0] = 'M':", customer);

customer.toUpperCase();          // returns a new string... that we throw away
console.log("After toUpperCase():", customer);

customer = customer[0].toUpperCase() + customer.slice(1);
console.log("Rebuilt:", customer);`,
      explain: `
<ol>
  <li>Assigning to an index fails - the string is "glued shut". In modern (strict-mode) JavaScript, like this page, it throws an error;
      in older sloppy-mode scripts it is <em>silently ignored</em>, which is even sneakier. Either way the string is unchanged.</li>
  <li>Calling a method without saving the result is the #1 beginner bug: the original is untouched.</li>
  <li>The fix: build a new string (<code>first letter upper + rest</code>) and re-assign the variable.</li>
  <li><strong>Try it:</strong> also capitalise the "s" of "santos" (hint: <code>split(" ")</code>).</li>
</ol>`
    },
    {
      title: "Building a CSV line: += versus join",
      code: `const products = ["Laptop", "Mouse", "Monitor", "Keyboard"];

let withPlus = "";
for (let i = 0; i < products.length; i++) {
  withPlus += products[i];
  if (i < products.length - 1) withPlus += ",";   // avoid a trailing comma
}

const withJoin = products.join(",");

console.log(withPlus);
console.log(withJoin);
console.log("Same result?", withPlus === withJoin);`,
      explain: `
<p>Both produce <code>"Laptop,Mouse,Monitor,Keyboard"</code>, but <code>join</code> is shorter, can't produce a trailing comma,
and builds the string once.</p>
<p>With <code>+=</code> you had to handle the "no comma after the last item" edge case yourself - a classic off-by-one trap.
<strong>Try it:</strong> join with <code>" | "</code> instead.</p>`
    },
    {
      title: "Slicing: mask a card and split an email",
      code: `const card = "4111222233334444";
const masked = "*".repeat(card.length - 4) + card.slice(-4);
console.log("Card :", masked);

const email = "ada.lovelace@example.com";
const at = email.indexOf("@");
console.log("User  :", email.slice(0, at));
console.log("Domain:", email.slice(at + 1));`,
      explain: `
<ol>
  <li><code>card.slice(-4)</code> takes the last 4 characters; <code>"*".repeat(12)</code> makes the stars.</li>
  <li><code>indexOf("@")</code> finds the position of the <code>@</code> (12 here).</li>
  <li><code>slice(0, at)</code> stops just <em>before</em> the <code>@</code>; <code>slice(at + 1)</code> starts just <em>after</em> it.</li>
</ol>
<table>
  <tr><th>Expression</th><th>Value</th></tr>
  <tr><td><code>at</code></td><td>12</td></tr>
  <tr><td><code>email.slice(0, 12)</code></td><td>"ada.lovelace"</td></tr>
  <tr><td><code>email.slice(13)</code></td><td>"example.com"</td></tr>
</table>`
    },
    {
      title: "Cleaning form input before comparing",
      code: `const registered = "ada@example.com";
const typed = "  Ada@Example.COM ";

console.log("Raw compare    :", typed === registered);

const clean = typed.trim().toLowerCase();
console.log("Cleaned value  :", "[" + clean + "]");
console.log("Clean compare  :", clean === registered);`,
      explain: `
<p>Users add spaces and random capitals. Comparing raw input fails even though it's the same email.</p>
<p><strong>Normalise first</strong> (<code>trim</code> + <code>toLowerCase</code>), then compare. The square brackets in the output
prove the spaces are gone. <strong>Try it:</strong> add a check that <code>clean.includes("@")</code>.</p>`
    },
    {
      title: "split and join: reformat names from a spreadsheet",
      code: `const rows = ["Lovelace, Ada", "Hopper,Grace", "  Torvalds ,  Linus "];

for (const row of rows) {
  const [last, first] = row.split(",").map(part => part.trim());
  console.log(first + " " + last);
}

const sentence = "  the   sky  is blue ";
console.log(sentence.trim().split(/\\s+/).reverse().join(" "));`,
      explain: `
<ol>
  <li><code>split(",")</code> cuts the row at the comma into an array of two parts.</li>
  <li><code>.map(part =&gt; part.trim())</code> removes stray spaces from each part - real exports are rarely tidy.</li>
  <li><code>[last, first] = ...</code> (destructuring) names the two pieces.</li>
  <li>The last line is the classic "reverse the words" question: trim, split on any whitespace, reverse, join.</li>
</ol>`
    },
    {
      title: "Characters as numbers: alphabet positions and a Caesar shift",
      code: `for (const ch of "abcxyz") {
  console.log(ch, "code", ch.charCodeAt(0), "position", ch.charCodeAt(0) - 97);
}

const shift = 3;
const parts = [];
for (const ch of "xyz") {
  const pos = ch.charCodeAt(0) - 97;
  parts.push(String.fromCharCode((pos + shift) % 26 + 97));
}
console.log("xyz shifted by 3:", parts.join(""));
console.log("-1 % 26 =", -1 % 26, " fixed:", ((-1 % 26) + 26) % 26);`,
      explain: `
<table>
  <tr><th>ch</th><th>pos</th><th>pos + 3</th><th>% 26</th><th>new char</th></tr>
  <tr><td>x</td><td>23</td><td>26</td><td>0</td><td>a</td></tr>
  <tr><td>y</td><td>24</td><td>27</td><td>1</td><td>b</td></tr>
  <tr><td>z</td><td>25</td><td>28</td><td>2</td><td>c</td></tr>
</table>
<p><code>% 26</code> wraps past "z" back to "a", like a clock. The last line shows why negative shifts need the <code>+ 26</code> fix.
<strong>Try it:</strong> set <code>shift</code> to <code>-1</code> and apply the fix.</p>`
    },
    {
      title: "Counting characters with an object",
      code: `const word = "mississippi";
const counts = {};

for (const ch of word) {
  counts[ch] = (counts[ch] || 0) + 1;
}

console.log(JSON.stringify(counts));
console.log("How many s?", counts["s"]);
console.log("How many z?", counts["z"] || 0);`,
      explain: `
<ol>
  <li><code>counts[ch] || 0</code> means "the current count, or 0 if we haven't seen this letter yet".</li>
  <li>Add 1 and store it back. After the loop: <code>{ m: 1, i: 4, s: 4, p: 2 }</code>.</li>
  <li>This one pattern solves anagrams, first-unique-character and "most common letter". You'll go deeper in lesson 07.</li>
</ol>`
    },
    {
      title: "Palindrome check with two pointers (with a trace)",
      code: `function isPal(text) {
  const s = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  let i = 0, j = s.length - 1;
  while (i < j) {
    console.log("  compare", s[i], "vs", s[j]);
    if (s[i] !== s[j]) return false;
    i++;
    j--;
  }
  return true;
}

console.log("Race car ->", isPal("Race car"));
console.log("Hello    ->", isPal("Hello"));`,
      explain: `
<ol>
  <li><strong>Normalise:</strong> lower-case and strip everything except letters and digits (<code>"racecar"</code>).</li>
  <li><strong>Two pointers:</strong> <code>i</code> starts left, <code>j</code> starts right; compare and step inward.</li>
  <li>Any mismatch means "not a palindrome" - stop early. If the pointers meet, it is one.</li>
  <li>For "Hello" it stops at the very first comparison (<code>h</code> vs <code>o</code>). That early exit is why two pointers is efficient.</li>
</ol>`
    },
    {
      title: "Run-length compression, step by step",
      code: `function compress(s) {
  if (s === "") return "";
  const parts = [];
  let current = s[0];
  let count = 1;
  for (let i = 1; i < s.length; i++) {
    if (s[i] === current) {
      count++;
    } else {
      parts.push(current + count);
      current = s[i];
      count = 1;
    }
  }
  parts.push(current + count);    // flush the final run
  return parts.join("");
}

console.log(compress("aaabcc"));
console.log(compress("WWWWBBBW"));`,
      explain: `
<table>
  <tr><th>i</th><th>s[i]</th><th>action</th><th>parts</th></tr>
  <tr><td>1, 2</td><td>a, a</td><td>same &rarr; count = 3</td><td>[]</td></tr>
  <tr><td>3</td><td>b</td><td>new char &rarr; push "a3"</td><td>["a3"]</td></tr>
  <tr><td>4</td><td>c</td><td>new char &rarr; push "b1"</td><td>["a3", "b1"]</td></tr>
  <tr><td>5</td><td>c</td><td>same &rarr; count = 2</td><td>["a3", "b1"]</td></tr>
  <tr><td>after loop</td><td>-</td><td>flush &rarr; push "c2"</td><td>["a3", "b1", "c2"]</td></tr>
</table>
<p>Forgetting the final flush is the most common bug in this problem. <strong>Try it:</strong> comment out that line and see what breaks.</p>`
    }
  ],

  pitfalls: [
    "Calling a method without saving the result: <code>name.trim();</code> changes nothing. Write <code>name = name.trim();</code>.",
    "<code>replace(\"-\", \"\")</code> only replaces the <strong>first</strong> match. Use <code>replaceAll</code> or a regex with the <code>g</code> flag.",
    "<code>split(\" \")</code> keeps empty strings for double spaces. Use <code>trim().split(/\\s+/)</code> to split on any amount of whitespace.",
    "Case sensitivity: <code>\"Ada\" === \"ada\"</code> is <code>false</code>. Normalise with <code>toLowerCase()</code> before comparing.",
    "Off-by-one in slices: <code>s.slice(1, 3)</code> has <strong>2</strong> characters - the end index is excluded.",
    "Hidden O(n²): calling <code>s.indexOf(ch)</code> or counting inside a loop over <code>s</code>. Count once into an object, then look up."
  ],

  quiz: [
    {
      q: "What does this print?",
      code: `const sku = "SKU-4821";
console.log(sku.slice(4, 6));`,
      options: ["48", "-48", "482", "4821"],
      answer: 0,
      output: "48",
      explain: "<p><code>slice(4, 6)</code> takes indexes 4 and 5 (the end is excluded). Index 4 is <code>\"4\"</code> and index 5 is <code>\"8\"</code>, giving <code>\"48\"</code>.</p>"
    },
    {
      q: "What does this print?",
      code: `let name = "maria";
name.toUpperCase();
console.log(name);`,
      options: ["MARIA", "maria", "Maria", "undefined"],
      answer: 1,
      output: "maria",
      explain: "<p>Strings are immutable. <code>toUpperCase()</code> <strong>returns</strong> a new string, but nobody stored it, so <code>name</code> is unchanged. Fix: <code>name = name.toUpperCase();</code></p>"
    },
    {
      q: "What does this print?",
      code: `console.log("a,b,,c".split(",").length);`,
      options: ["3", "4", "5", "6"],
      answer: 1,
      output: "4",
      explain: "<p>The result is <code>[\"a\", \"b\", \"\", \"c\"]</code> - there is an <strong>empty string</strong> between the two commas. When parsing CSV data you must expect these empty fields.</p>"
    },
    {
      q: "Which line correctly checks that two emails match, ignoring spaces and capital letters?",
      options: [
        "<code>a === b</code>",
        "<code>a.toLowerCase() == b</code>",
        "<code>a.trim().toLowerCase() === b.trim().toLowerCase()</code>",
        "<code>a.trim() === b.toLowerCase()</code>"
      ],
      answer: 2,
      explain: "<p>Both sides must be normalised the <strong>same way</strong>. Cleaning only one side (options B and D) still fails for inputs like <code>\" ADA@x.com\"</code> vs <code>\"Ada@X.com \"</code>.</p>"
    },
    {
      q: "What does this print?",
      code: `console.log("Hello".charCodeAt(1) - "a".charCodeAt(0));`,
      options: ["1", "4", "101", "\"e\""],
      answer: 1,
      output: "4",
      explain: "<p>Index 1 of <code>\"Hello\"</code> is <code>\"e\"</code> (code 101). <code>\"a\"</code> is 97. <code>101 - 97 = 4</code>: \"e\" is letter number 4 when counting a = 0.</p>"
    },
    {
      q: "Why is <code>parts.push(x)</code> followed by one <code>parts.join(\"\")</code> the recommended way to build a long string?",
      options: [
        "Because <code>+=</code> doesn't work on strings",
        "Because strings are immutable, so repeated <code>+=</code> can copy the growing string again and again (O(n²)); join builds it once (O(n))",
        "Because arrays use less memory than strings",
        "Because <code>join</code> automatically removes duplicates"
      ],
      answer: 1,
      explain: "<p><code>+=</code> works, but each step conceptually creates a new string containing everything so far. Joining once avoids the repeated copying. JS engines often optimise <code>+=</code>, but the habit matters in every language - and interviewers ask about it.</p>"
    },
    {
      q: "What does this print?",
      code: `const s = "banana";
console.log(s.indexOf("na") + " " + s.lastIndexOf("na"));`,
      options: ["2 4", "2 2", "1 3", "4 2"],
      answer: 0,
      output: "2 4",
      explain: "<p><code>\"na\"</code> first appears at index 2 (ba<strong>na</strong>na) and last at index 4 (bana<strong>na</strong>). <code>indexOf</code> searches from the left, <code>lastIndexOf</code> from the right.</p>"
    }
  ],

  interview: [
    { q: "Why are strings immutable in JavaScript (and Java, Python)? What are the consequences?",
      a: "<p>Immutable strings are safe to share and cache, can be used as object/map keys (their content - and hash - never changes), and are thread-safe in languages with threads. The cost: every \"modification\" creates a new string, so heavy concatenation in a loop can be O(n²). Collect pieces in an array and <code>join</code> once (<code>StringBuilder</code> in Java).</p>" },
    { q: "How do you check whether two strings are anagrams? What is the complexity?",
      a: "<p><strong>Sort:</strong> sort the characters of both and compare - O(n log n).<br><strong>Count:</strong> count characters of the first string, subtract while reading the second; every count must end at 0 - O(n) time, O(k) space for an alphabet of size k. Check the lengths first for a quick exit.</p>" },
    { q: "Reverse a string without using <code>.reverse()</code>.",
      a: "<p>Split into an array of characters, swap with two pointers (<code>i</code> from the left, <code>j</code> from the right) until they meet, then <code>join(\"\")</code>. Or loop from the last index down to 0 pushing characters into an array. Both are O(n).</p>" },
    { q: "How do you find the first non-repeating character in a string?",
      a: "<p>Two passes. Pass 1: count every character in an object/Map. Pass 2: scan the string again and return the first index whose count is 1. O(n) time. Avoid calling <code>indexOf</code>/<code>lastIndexOf</code> or counting inside the loop - that is O(n²).</p>" },
    { q: "How would you check if a sentence is a palindrome, ignoring spaces and punctuation?",
      a: "<p>Either normalise (lower-case, remove non-alphanumerics) and compare with the reverse - O(n) time and O(n) extra space - or use two pointers that skip non-alphanumeric characters and compare case-insensitively - O(n) time, O(1) extra space.</p>" },
    { q: "What does <code>\"a,b,,c\".split(\",\")</code> return, and why does it matter?",
      a: "<p><code>[\"a\", \"b\", \"\", \"c\"]</code>. An empty field appears between consecutive separators. When parsing CSV or log data you must decide whether to keep, default or filter out those empty values.</p>" }
  ],

  exercises: [
    {
      id: "initials",
      title: "initials (warm-up)",
      difficulty: "easy",
      prompt: "<p>Return the upper-case first letter of every word in a full name. Words are separated by single spaces.</p><p><code>initials(\"Ada Lovelace\") &rarr; \"AL\"</code> &nbsp; <code>initials(\"grace brewster hopper\") &rarr; \"GBH\"</code> &nbsp; <code>initials(\"linus\") &rarr; \"L\"</code></p>",
      starter: `function initials(fullName) {
  // your code here
}`,
      solution: `function initials(fullName) {
  // Split into words, keep the first character of each, glue them together
  return fullName
    .split(" ")
    .map(word => word.charAt(0).toUpperCase())
    .join("");
}`,
      hint: "Split the name on spaces into an array of words. For each word take <code>word[0]</code>, upper-case it, then <code>join(\"\")</code> the letters.",
      tests: [
        { expr: "initials(\"Ada Lovelace\")", expected: "AL" },
        { expr: "initials(\"grace brewster hopper\")", expected: "GBH" },
        { expr: "initials(\"linus\")", expected: "L" },
        { expr: "initials(\"maria de la cruz\")", expected: "MDLC" }
      ]
    },
    {
      id: "reverse-string",
      title: "reverseString without .reverse()",
      difficulty: "easy",
      prompt: "<p>Return <code>s</code> reversed <strong>without</strong> using <code>.reverse()</code>. Use two pointers or a backwards loop.</p><p><code>reverseString(\"hello\") &rarr; \"olleh\"</code> &nbsp; <code>reverseString(\"Hi there!\") &rarr; \"!ereht iH\"</code> &nbsp; <code>reverseString(\"\") &rarr; \"\"</code></p>",
      starter: `function reverseString(s) {
  // your code here
}`,
      solution: `function reverseString(s) {
  // Strings can't be edited, so copy the characters into an array first
  const chars = s.split("");
  let i = 0;                  // left pointer
  let j = chars.length - 1;   // right pointer
  while (i < j) {
    // swap the two ends, then step both pointers toward the middle
    [chars[i], chars[j]] = [chars[j], chars[i]];
    i++;
    j--;
  }
  return chars.join("");
  // Everyday one-liner (when allowed): s.split("").reverse().join("")
}`,
      hint: "Simplest: loop <code>i</code> from <code>s.length - 1</code> down to <code>0</code>, pushing <code>s[i]</code> into an array, then <code>join(\"\")</code>. Interview version: swap the two ends of an array and move inward.",
      explanation: "<p>Both approaches are O(n). The two-pointer swap is what interviewers usually want because it shows you know strings are immutable (you must copy into an array first) and it reverses \"in place\" on that array.</p>",
      forbid: [{ pattern: "\\.reverse\\s*\\(", message: "Challenge: do it without .reverse() - use two pointers or a backwards loop." }],
      tests: [
        { expr: "reverseString(\"hello\")", expected: "olleh" },
        { expr: "reverseString(\"\")", expected: "" },
        { expr: "reverseString(\"a\")", expected: "a" },
        { expr: "reverseString(\"ab\")", expected: "ba" },
        { expr: "reverseString(\"Hi there!\")", expected: "!ereht iH" }
      ]
    },
    {
      id: "count-vowels",
      title: "countVowels",
      difficulty: "easy",
      prompt: "<p>Count the vowels (<code>a e i o u</code>) in <code>s</code>. Upper- and lower-case both count.</p><p><code>countVowels(\"Hello World\") &rarr; 3</code> &nbsp; <code>countVowels(\"AEIOU aeiou\") &rarr; 10</code> &nbsp; <code>countVowels(\"rhythm\") &rarr; 0</code></p>",
      starter: `function countVowels(s) {
  // your code here
}`,
      solution: `function countVowels(s) {
  let count = 0;
  // Lower-case once so "A" and "a" are treated the same
  for (const ch of s.toLowerCase()) {
    if ("aeiou".includes(ch)) count++;   // is this character a vowel?
  }
  return count;
}`,
      hint: "Lower-case the whole string once, then loop over it and test each character with <code>\"aeiou\".includes(ch)</code>.",
      tests: [
        { expr: "countVowels(\"Hello World\")", expected: 3 },
        { expr: "countVowels(\"xyz\")", expected: 0 },
        { expr: "countVowels(\"\")", expected: 0 },
        { expr: "countVowels(\"AEIOU aeiou\")", expected: 10 },
        { expr: "countVowels(\"rhythm\")", expected: 0 }
      ]
    },
    {
      id: "is-palindrome",
      title: "isPalindrome (ignore case and punctuation)",
      difficulty: "easy",
      prompt: "<p>Return <code>true</code> if <code>s</code> reads the same forwards and backwards, ignoring upper/lower case and every character that is not a letter or digit.</p><p><code>\"A man, a plan, a canal: Panama\" &rarr; true</code> &nbsp; <code>\"race a car\" &rarr; false</code> &nbsp; <code>\"\" &rarr; true</code></p>",
      starter: `function isPalindrome(s) {
  // your code here
}`,
      solution: `function isPalindrome(s) {
  const isAlnum = ch => /[a-z0-9]/i.test(ch);   // letter or digit?
  let i = 0, j = s.length - 1;
  while (i < j) {
    if (!isAlnum(s[i])) i++;          // skip junk on the left
    else if (!isAlnum(s[j])) j--;     // skip junk on the right
    else {
      if (s[i].toLowerCase() !== s[j].toLowerCase()) return false;
      i++;
      j--;
    }
  }
  return true;   // pointers met with no mismatch
  // Simpler O(n)-space version: clean with
  // s.toLowerCase().replace(/[^a-z0-9]/g, "") and compare with its reverse.
}`,
      hint: "Step 1: clean the string - <code>s.toLowerCase().replace(/[^a-z0-9]/g, \"\")</code>. Step 2: compare characters from both ends moving inward (or compare with the reversed string).",
      explanation: "<p>The \"clean then compare\" version is easiest to write. The skip-as-you-go two-pointer version uses O(1) extra memory because it never builds a cleaned copy - a nice follow-up answer in interviews.</p>",
      tests: [
        { expr: "isPalindrome(\"A man, a plan, a canal: Panama\")", expected: true },
        { expr: "isPalindrome(\"race a car\")", expected: false },
        { expr: "isPalindrome(\"\")", expected: true },
        { expr: "isPalindrome(\".,!\")", expected: true },
        { expr: "isPalindrome(\"No 'x' in Nixon\")", expected: true },
        { expr: "isPalindrome(\"0P\")", expected: false },
        { expr: "isPalindrome(\"12321\")", expected: true }
      ]
    },
    {
      id: "reverse-words",
      title: "reverseWords",
      difficulty: "easy",
      prompt: "<p>Reverse the <strong>order</strong> of the words (not the letters). Words may be separated by any amount of whitespace; the result uses single spaces with nothing at either end.</p><p><code>\"the sky is blue\" &rarr; \"blue is sky the\"</code> &nbsp; <code>\"  hello   world \" &rarr; \"world hello\"</code> &nbsp; <code>\"\" &rarr; \"\"</code></p>",
      starter: `function reverseWords(s) {
  // your code here
}`,
      solution: `function reverseWords(s) {
  return s
    .trim()                // remove spaces at both ends
    .split(/\\s+/)          // split on ANY run of whitespace
    .filter(Boolean)       // drop the "" you get from an empty input
    .reverse()             // reverse the ORDER of the words
    .join(" ");            // glue back with single spaces
}`,
      hint: "Split - process - join: <code>trim()</code>, <code>split(/\\s+/)</code>, <code>reverse()</code>, <code>join(\" \")</code>. Test the empty string separately.",
      tests: [
        { expr: "reverseWords(\"the sky is blue\")", expected: "blue is sky the" },
        { expr: "reverseWords(\"  hello   world \")", expected: "world hello" },
        { expr: "reverseWords(\"single\")", expected: "single" },
        { expr: "reverseWords(\"\")", expected: "" },
        { expr: "reverseWords(\"a\\tb\\nc\")", expected: "c b a" }
      ]
    },
    {
      id: "capitalize-words",
      title: "capitalizeWords",
      difficulty: "easy",
      prompt: "<p>Upper-case the first character of each word and lower-case the rest - handy for tidying names in a spreadsheet. Words are separated by single spaces.</p><p><code>\"hello wORLD\" &rarr; \"Hello World\"</code> &nbsp; <code>\"python is FUN\" &rarr; \"Python Is Fun\"</code> &nbsp; <code>\"it's 2nd\" &rarr; \"It's 2nd\"</code></p>",
      starter: `function capitalizeWords(s) {
  // your code here
}`,
      solution: `function capitalizeWords(s) {
  return s
    .split(" ")
    // charAt(0) is safe on "" (returns ""), unlike w[0] which is undefined
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}`,
      hint: "For each word: <code>w.charAt(0).toUpperCase()</code> + <code>w.slice(1).toLowerCase()</code>. Use split - map - join.",
      tests: [
        { expr: "capitalizeWords(\"hello wORLD\")", expected: "Hello World" },
        { expr: "capitalizeWords(\"python is FUN\")", expected: "Python Is Fun" },
        { expr: "capitalizeWords(\"a\")", expected: "A" },
        { expr: "capitalizeWords(\"\")", expected: "" },
        { expr: "capitalizeWords(\"it's 2nd\")", expected: "It's 2nd" }
      ]
    },
    {
      id: "is-anagram",
      title: "isAnagram",
      difficulty: "medium",
      prompt: "<p>Two words are <strong>anagrams</strong> if they use exactly the same letters the same number of times. Return <code>true</code> or <code>false</code> (case-sensitive; spaces count as characters).</p><p><code>(\"listen\", \"silent\") &rarr; true</code> &nbsp; <code>(\"rat\", \"car\") &rarr; false</code> &nbsp; <code>(\"aab\", \"abb\") &rarr; false</code></p>",
      starter: `function isAnagram(a, b) {
  // your code here
}`,
      solution: `function isAnagram(a, b) {
  if (a.length !== b.length) return false;   // quick exit
  const counts = {};
  // Count every character of a...
  for (const ch of a) counts[ch] = (counts[ch] || 0) + 1;
  // ...then "spend" them while reading b
  for (const ch of b) {
    if (!counts[ch]) return false;   // missing, or already used up
    counts[ch]--;
  }
  return true;   // same length + nothing ran out = same letters
}`,
      hint: "Easy version: sort the letters of both and compare - <code>a.split(\"\").sort().join(\"\")</code>. Faster version: count letters of <code>a</code> in an object, then subtract while reading <code>b</code>.",
      explanation: "<p>Sorting is O(n log n). Counting is O(n): one pass to count, one to subtract. Why is \"same length + nothing ran out\" enough? If <code>b</code> never needed a letter <code>a</code> didn't have, and both have the same total, the counts must match exactly.</p>",
      tests: [
        { expr: "isAnagram(\"listen\", \"silent\")", expected: true },
        { expr: "isAnagram(\"rat\", \"car\")", expected: false },
        { expr: "isAnagram(\"\", \"\")", expected: true },
        { expr: "isAnagram(\"aab\", \"abb\")", expected: false },
        { expr: "isAnagram(\"abc\", \"abcd\")", expected: false },
        { expr: "isAnagram(\"Dormitory\", \"dirtyroom\")", expected: false, label: "case-sensitive" },
        { expr: "isAnagram(\"dormitory\", \"dirtyroom\")", expected: true }
      ]
    },
    {
      id: "first-unique-char",
      title: "firstUniqueChar",
      difficulty: "medium",
      prompt: "<p>Return the <strong>index</strong> of the first character that appears exactly once in <code>s</code>, or <code>-1</code> if every character repeats. Aim for O(n).</p><p><code>\"leetcode\" &rarr; 0</code> (l) &nbsp; <code>\"loveleetcode\" &rarr; 2</code> (v) &nbsp; <code>\"aabb\" &rarr; -1</code></p>",
      starter: `function firstUniqueChar(s) {
  // your code here
}`,
      solution: `function firstUniqueChar(s) {
  // Pass 1: count how often each character appears
  const counts = {};
  for (const ch of s) counts[ch] = (counts[ch] || 0) + 1;
  // Pass 2: walk in the original order; the first count of 1 wins
  for (let i = 0; i < s.length; i++) {
    if (counts[s[i]] === 1) return i;
  }
  return -1;
}`,
      hint: "Two passes over the string. First fill a counts object. Then loop with an index and return the first <code>i</code> where <code>counts[s[i]] === 1</code>.",
      explanation: "<p>Why two passes? While counting, you can't know yet whether a character will repeat later. The second pass uses the finished counts and the original order. Total work: 2n steps = O(n). Counting inside the loop instead would be O(n²).</p>",
      tests: [
        { expr: "firstUniqueChar(\"leetcode\")", expected: 0 },
        { expr: "firstUniqueChar(\"loveleetcode\")", expected: 2 },
        { expr: "firstUniqueChar(\"aabb\")", expected: -1 },
        { expr: "firstUniqueChar(\"\")", expected: -1 },
        { expr: "firstUniqueChar(\"z\")", expected: 0 },
        { expr: "firstUniqueChar(\"aabbc\")", expected: 4 }
      ]
    },
    {
      id: "compress",
      title: "compress (run-length encoding)",
      difficulty: "medium",
      prompt: "<p>Replace each run of the same character with the character followed by how many times it repeats.</p><p><code>\"aaabcc\" &rarr; \"a3b1c2\"</code> &nbsp; <code>\"abc\" &rarr; \"a1b1c1\"</code> &nbsp; <code>\"aabbaa\" &rarr; \"a2b2a2\"</code> &nbsp; <code>\"\" &rarr; \"\"</code></p>",
      starter: `function compress(s) {
  // your code here
}`,
      solution: `function compress(s) {
  if (s.length === 0) return "";
  const parts = [];
  let current = s[0];   // character of the run we're in
  let count = 1;        // how long that run is so far
  for (let i = 1; i < s.length; i++) {
    if (s[i] === current) {
      count++;                       // run continues
    } else {
      parts.push(current + count);   // run ended: save it
      current = s[i];                // start a new run
      count = 1;
    }
  }
  parts.push(current + count);   // don't forget the LAST run!
  return parts.join("");
}`,
      hint: "Keep two variables: <code>current</code> (the character) and <code>count</code>. When the next character is different, save <code>current + count</code> and restart. After the loop, save the last run too.",
      explanation: "<p>This \"run-length scan\" is O(n) and appears in many forms: longest streak of wins, grouping consecutive log entries, compressing images. The final flush after the loop is the detail most people miss. Note <code>\"aabbaa\"</code> gives two separate <code>a</code> runs - we compress consecutive runs, not total counts.</p>",
      tests: [
        { expr: "compress(\"aaabcc\")", expected: "a3b1c2" },
        { expr: "compress(\"abc\")", expected: "a1b1c1" },
        { expr: "compress(\"\")", expected: "" },
        { expr: "compress(\"a\")", expected: "a1" },
        { expr: "compress(\"aaaaaaaaaaaa\")", expected: "a12" },
        { expr: "compress(\"aabbaa\")", expected: "a2b2a2" }
      ]
    },
    {
      id: "longest-common-prefix",
      title: "longestCommonPrefix",
      difficulty: "medium",
      prompt: "<p>Return the longest starting piece (prefix) shared by <strong>all</strong> strings in the array, or <code>\"\"</code> if there is none.</p><p><code>[\"flower\", \"flow\", \"flight\"] &rarr; \"fl\"</code> &nbsp; <code>[\"INV-2026-01\", \"INV-2026-02\"] &rarr; \"INV-2026-0\"</code> &nbsp; <code>[\"dog\", \"car\"] &rarr; \"\"</code> &nbsp; <code>[] &rarr; \"\"</code></p>",
      starter: `function longestCommonPrefix(words) {
  // your code here
}`,
      solution: `function longestCommonPrefix(words) {
  if (words.length === 0) return "";
  let prefix = words[0];              // best guess: the whole first word
  for (const w of words.slice(1)) {
    // shorten the guess until this word starts with it
    while (!w.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);   // drop the last character
      if (prefix === "") return "";
    }
  }
  return prefix;
}`,
      hint: "Start with the first word as your guess. For each other word, chop the last character off the guess until <code>word.startsWith(guess)</code> is true.",
      explanation: "<p>The guess only ever gets shorter, so the total work is bounded by the number of characters - O(S) where S is the total length of all words. An alternative is to compare column by column: check character 0 of every word, then character 1, and stop at the first mismatch.</p>",
      tests: [
        { expr: "longestCommonPrefix([\"flower\", \"flow\", \"flight\"])", expected: "fl" },
        { expr: "longestCommonPrefix([\"dog\", \"racecar\", \"car\"])", expected: "" },
        { expr: "longestCommonPrefix([])", expected: "" },
        { expr: "longestCommonPrefix([\"alone\"])", expected: "alone" },
        { expr: "longestCommonPrefix([\"same\", \"same\"])", expected: "same" },
        { expr: "longestCommonPrefix([\"ab\", \"a\"])", expected: "a" },
        { expr: "longestCommonPrefix([\"\", \"abc\"])", expected: "" }
      ]
    },
    {
      id: "caesar-cipher",
      title: "caesarCipher",
      difficulty: "hard",
      prompt: "<p>Shift every letter by <code>shift</code> places in the alphabet, wrapping from z back to a, and keep its case. Non-letters stay as they are. <code>shift</code> may be negative or bigger than 26.</p><p><code>(\"abc\", 1) &rarr; \"bcd\"</code> &nbsp; <code>(\"xyz\", 3) &rarr; \"abc\"</code> &nbsp; <code>(\"Hello, World!\", 5) &rarr; \"Mjqqt, Btwqi!\"</code> &nbsp; <code>(\"bcd\", -1) &rarr; \"abc\"</code></p>",
      starter: `function caesarCipher(s, shift) {
  // your code here
}`,
      solution: `function caesarCipher(s, shift) {
  const out = [];
  for (const ch of s) {
    let base;                                  // code of "a" or "A"
    if (ch >= "a" && ch <= "z") base = 97;
    else if (ch >= "A" && ch <= "Z") base = 65;
    else { out.push(ch); continue; }           // not a letter: keep it
    const pos = ch.charCodeAt(0) - base;       // 0..25
    const moved = ((pos + shift) % 26 + 26) % 26;   // wrap; safe for negatives
    out.push(String.fromCharCode(moved + base));
  }
  return out.join("");
}`,
      hint: "For a lower-case letter: <code>pos = ch.charCodeAt(0) - 97</code>, new position <code>((pos + shift) % 26 + 26) % 26</code>, back to a letter with <code>String.fromCharCode(newPos + 97)</code>. Use 65 for capitals.",
      explanation: "<p>Three ideas combine here: characters are numbers (<code>charCodeAt</code>), <code>% 26</code> wraps around like a clock, and the extra <code>+ 26) % 26</code> fixes JavaScript's negative remainders (<code>-1 % 26</code> is <code>-1</code>). Shifting by <code>k</code> then <code>-k</code> gets you back the original - that's decryption.</p>",
      tests: [
        { expr: "caesarCipher(\"abc\", 1)", expected: "bcd" },
        { expr: "caesarCipher(\"xyz\", 3)", expected: "abc" },
        { expr: "caesarCipher(\"Hello, World!\", 5)", expected: "Mjqqt, Btwqi!" },
        { expr: "caesarCipher(\"bcd\", -1)", expected: "abc", label: "negative shift" },
        { expr: "caesarCipher(\"abc\", 27)", expected: "bcd", label: "shift larger than 26" },
        { expr: "caesarCipher(\"\", 4)", expected: "" },
        { expr: "caesarCipher(\"ABC xyz\", 26)", expected: "ABC xyz" },
        { expr: "caesarCipher(caesarCipher(\"Round Trip\", 7), -7)", expected: "Round Trip", label: "shift by k then -k restores the text" }
      ]
    }
  ],

  takeaways: [
    "A string is a row of characters: index from <strong>0</strong>, last index is <code>length - 1</code>.",
    "Strings are <strong>immutable</strong>: every method returns a new string, so always store the result.",
    "Build big strings by collecting pieces in an array and calling <code>join</code> once.",
    "<strong>Normalise first</strong> (<code>trim</code>, <code>toLowerCase</code>) before comparing user input.",
    "Most string problems are array problems: two pointers, counting with an object, or a run-length scan.",
    "<code>charCodeAt</code> turns letters into numbers, so <code>% 26</code> can wrap them around the alphabet."
  ]
});
