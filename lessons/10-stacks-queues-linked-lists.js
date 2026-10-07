LDL.registerLesson({
  id: "10",
  title: "Stacks, Queues & Linked Lists",
  lang: "js",
  minutes: 60,
  goal: "Master the three classic \"line-up\" data structures: know which order each one hands items back in, what every operation costs, and which interview problems each one unlocks.",

  analogy: `
<p>A <strong>stack</strong> is a pile of plates: you put a clean plate on <em>top</em> and you take from the <em>top</em>. The last plate in is the first one out.
A <strong>queue</strong> is the line at a coffee shop: new people join at the <em>back</em>, and the person at the <em>front</em> is served first. Fair and in order.</p>
<p>A <strong>linked list</strong> is a treasure hunt: each clue tells you where the next clue is hidden. You can't jump straight to clue 7 -
you follow the chain from the start. But adding a new clue in the middle is easy: just change where one clue points.</p>`,

  objectives: [
    "Explain <strong>LIFO</strong> (stack) and <strong>FIFO</strong> (queue) and pick the right one for a problem",
    "Build a stack with an array and an O(1) queue with a <strong>head index</strong> (and explain why <code>shift()</code> is slow)",
    "Solve classic stack problems: <strong>balanced brackets</strong>, <strong>postfix evaluation</strong>, undo",
    "Draw, traverse, insert into, delete from and <strong>reverse</strong> a linked list",
    "Use <strong>fast/slow pointers</strong> to find the middle node and detect cycles (Floyd's algorithm)",
    "Compare arrays and linked lists using a Big-O table"
  ],

  realWorld: `
<ul>
  <li><strong>Undo / redo:</strong> every text editor, Photoshop and Excel keep a stack of your recent actions.</li>
  <li><strong>Browser history:</strong> the Back button pops the last page off a stack.</li>
  <li><strong>The call stack:</strong> every error trace you read ("at foo, at bar, at main") is a printout of the call stack.</li>
  <li><strong>Job and message queues:</strong> print queues, email sending, background jobs and customer support tickets are handled first-come, first-served.</li>
  <li><strong>Rate limiting:</strong> "max 100 requests per minute" is a queue of recent timestamps.</li>
</ul>`,

  sections: [
    {
      title: "Stacks: last in, first out",
      html: `
<p><strong>What:</strong> a <strong>stack</strong> is a collection where you can only add and remove at one end, called the <strong>top</strong>.
This rule is called <strong>LIFO</strong> - Last In, First Out.</p>
<table>
  <tr><th>Operation</th><th>Meaning</th><th>JS array</th><th>Cost</th></tr>
  <tr><td><code>push(x)</code></td><td>put x on top</td><td><code>arr.push(x)</code></td><td>O(1)</td></tr>
  <tr><td><code>pop()</code></td><td>remove and return the top</td><td><code>arr.pop()</code></td><td>O(1)</td></tr>
  <tr><td><code>peek()</code></td><td>look at the top without removing</td><td><code>arr[arr.length - 1]</code></td><td>O(1)</td></tr>
  <tr><td><code>isEmpty()</code></td><td>is there anything left?</td><td><code>arr.length === 0</code></td><td>O(1)</td></tr>
</table>
<pre>
 push(1)   push(2)   push(3)   pop() -&gt; 3   peek() -&gt; 2
                     | 3 |
           | 2 |     | 2 |     | 2 |         | 2 |   &lt;- top
 | 1 |     | 1 |     | 1 |     | 1 |         | 1 |
 +---+     +---+     +---+     +---+         +---+
</pre>
<p><strong>Why:</strong> whenever the <em>most recent</em> thing must be handled first, a stack is the natural fit.</p>
<div class="callout key"><p>A JavaScript array <em>is</em> a perfectly good stack - just only use <code>push</code>, <code>pop</code> and the last element.</p></div>`
    },
    {
      title: "Where stacks show up",
      html: `
<p>Once you see the LIFO pattern, you'll spot it everywhere:</p>
<ul>
  <li><strong>Undo:</strong> each action is pushed; "undo" pops the most recent one.</li>
  <li><strong>Matching brackets:</strong> the most recent <code>(</code> must be closed first.</li>
  <li><strong>Function calls:</strong> when <code>main</code> calls <code>a</code> and <code>a</code> calls <code>b</code>, <code>b</code> must finish before <code>a</code> can continue.</li>
</ul>
<pre>
 The call stack while b() runs:

   | b() |   &lt;- running now; returns first
   | a() |   &lt;- waiting for b
   | main|   &lt;- waiting for a
   +-----+
</pre>
<div class="callout work"><p>This is why an error trace lists functions in that order, and why infinite recursion crashes with
<strong>"Maximum call stack size exceeded"</strong> (a "stack overflow") - the pile of waiting calls grew too tall.</p></div>`
    },
    {
      title: "Queues: first in, first out",
      html: `
<p><strong>What:</strong> a <strong>queue</strong> adds at the <strong>back</strong> (<code>enqueue</code>) and removes from the <strong>front</strong> (<code>dequeue</code>).
This rule is <strong>FIFO</strong> - First In, First Out.</p>
<pre>
 enqueue A, B, C:      front -&gt; [ A | B | C ] &lt;- back
 dequeue() -&gt; A:       front -&gt; [ B | C ]     &lt;- back
 enqueue D:            front -&gt; [ B | C | D ] &lt;- back
</pre>
<p><strong>Why:</strong> when things must be handled <em>in arrival order</em> - fairness. Print jobs, support tickets, orders in a kitchen,
and visiting a tree level by level (breadth-first search).</p>
<div class="callout analogy"><p>The coffee shop line again: nobody wants the person who just arrived to be served first. That would be a stack - and a riot.</p></div>`
    },
    {
      title: "Why shift() is a trap - and the head-index fix",
      html: `
<p>The obvious queue is an array with <code>push</code> to add and <code>shift()</code> to remove the front. It works, but <code>shift()</code> has to
<strong>move every remaining element</strong> one slot to the left. That is <strong>O(n)</strong> per dequeue, so emptying a queue of n items costs O(n<sup>2</sup>).</p>
<pre>
 shift() on [A, B, C, D, E]:
   remove A, then B moves to 0, C to 1, D to 2, E to 3   (n - 1 moves!)
</pre>
<p><strong>Fix:</strong> don't move the data - move a <strong>bookmark</strong>. Keep a <code>head</code> index that points at the current front.</p>
<pre><code class="language-javascript">class Queue {
  #items = [];
  #head = 0;                               // index of the front item

  enqueue(x) { this.#items.push(x); }      // O(1): add at the back

  dequeue() {                              // O(1): just move the bookmark
    if (this.size === 0) throw new Error("Queue is empty");
    const front = this.#items[this.#head];
    this.#items[this.#head] = undefined;   // free the slot for garbage collection
    this.#head++;
    return front;
  }

  get size() { return this.#items.length - this.#head; }
}</code></pre>
<pre>
 items: [ -, -, C, D, E ]       size = 5 - 2 = 3
                ^
               head = 2  (A and B already served)
</pre>
<div class="callout tip"><p>For small queues (a few hundred items) <code>shift()</code> is fine in practice. In interviews and hot loops, mention its O(n) cost and use a head index.</p></div>`
    },
    {
      title: "Linked lists: nodes and pointers",
      html: `
<p><strong>What:</strong> a <strong>linked list</strong> is a chain of <strong>nodes</strong>. Each node holds a <code>value</code> and a <code>next</code> <strong>pointer</strong>
(a reference to the next node). The last node points to <code>null</code>. The list only needs to remember the first node, the <strong>head</strong>.</p>
<pre>
  head                                      tail
   |                                         |
   v                                         v
 +----+----+     +----+----+     +----+----+
 | 10 |  o-+----&gt;| 20 |  o-+----&gt;| 30 |null|
 +----+----+     +----+----+     +----+----+
  value next
</pre>
<pre><code class="language-javascript">class ListNode {
  constructor(value, next = null) {
    this.value = value;   // the data
    this.next = next;     // the arrow to the next node (or null)
  }
}

// Build 10 -&gt; 20 -&gt; 30 by hand
const head = new ListNode(10, new ListNode(20, new ListNode(30)));

// Traverse: follow the arrows until you fall off the end
for (let node = head; node !== null; node = node.next) {
  console.log(node.value);
}</code></pre>
<p><strong>Why:</strong> unlike an array, a linked list never has to shift elements. Adding or removing a node is just re-pointing an arrow - O(1) once you're at the right spot.</p>
<div class="callout analogy"><p>Train carriages: each carriage is hooked to the next one. To add a carriage in the middle, unhook, insert, re-hook. Nobody else moves.</p></div>`
    },
    {
      title: "Insert, delete and reverse",
      html: `
<p>Every linked-list operation is about <strong>changing arrows in the right order</strong>.</p>
<p><strong>Insert</strong> <code>B</code> after node <code>A</code>:</p>
<pre>
 before:  A ---------&gt; C           1. B.next = A.next     (B -&gt; C)
 after:   A ---&gt; B ---&gt; C          2. A.next = B          (A -&gt; B)
</pre>
<p><strong>Delete</strong> the node after <code>A</code>:</p>
<pre>
 before:  A ---&gt; B ---&gt; C          A.next = A.next.next   (skip over B)
 after:   A ----------&gt; C
</pre>
<p><strong>Reverse</strong> the whole list in place, with three pointers:</p>
<pre><code class="language-javascript">let prev = null;
let curr = head;
while (curr !== null) {
  const next = curr.next;   // 1. remember the rest of the list
  curr.next = prev;         // 2. flip this node's arrow backwards
  prev = curr;              // 3. step both pointers forward
  curr = next;
}
head = prev;                // prev is the old tail = the new head</code></pre>
<pre>
 start:   null   1 -&gt; 2 -&gt; 3 -&gt; null
 step 1:  null &lt;- 1    2 -&gt; 3 -&gt; null
 step 2:  null &lt;- 1 &lt;- 2    3 -&gt; null
 step 3:  null &lt;- 1 &lt;- 2 &lt;- 3          head = 3
</pre>
<div class="callout warn"><p>Always save <code>curr.next</code> <strong>before</strong> overwriting it - otherwise you lose the rest of the list forever.</p></div>`
    },
    {
      title: "Fast and slow pointers",
      html: `
<p>A powerful linked-list trick: walk two pointers at different speeds. <code>slow</code> moves 1 step, <code>fast</code> moves 2 steps.</p>
<ul>
  <li><strong>Find the middle:</strong> when <code>fast</code> reaches the end, <code>slow</code> is halfway.</li>
  <li><strong>Detect a cycle</strong> (<strong>Floyd's tortoise and hare</strong>): if the list loops back on itself, <code>fast</code> laps <code>slow</code> and they land on the same node. If there's no loop, <code>fast</code> reaches <code>null</code>.</li>
</ul>
<pre>
 1 -&gt; 2 -&gt; 3 -&gt; 4 -&gt; 5 -&gt; null
 step 0: slow=1 fast=1
 step 1: slow=2 fast=3
 step 2: slow=3 fast=5   fast.next is null -&gt; stop. middle = 3
</pre>
<pre><code class="language-javascript">let slow = head, fast = head;
while (fast !== null &amp;&amp; fast.next !== null) {
  slow = slow.next;
  fast = fast.next.next;
  if (slow === fast) return true;   // cycle!
}
return false;                       // fast hit the end: no cycle</code></pre>
<div class="callout analogy"><p>Two runners on a circular track: the faster one will always catch up and lap the slower one. On a straight road, the fast one just reaches the finish.</p></div>`
    },
    {
      title: "Big-O cheat sheet and when to use which",
      html: `
<table>
  <tr><th>Operation</th><th>Array</th><th>Linked list</th><th>Stack</th><th>Queue (head index)</th></tr>
  <tr><td>Read item <em>i</em></td><td>O(1)</td><td>O(n)</td><td>-</td><td>-</td></tr>
  <tr><td>Search for a value</td><td>O(n)</td><td>O(n)</td><td>-</td><td>-</td></tr>
  <tr><td>Add/remove at the <strong>end</strong></td><td>O(1)</td><td>add O(1) with tail; remove O(n)*</td><td>push / pop O(1)</td><td>enqueue O(1)</td></tr>
  <tr><td>Add/remove at the <strong>front</strong></td><td>O(n)</td><td>O(1)</td><td>-</td><td>dequeue O(1)</td></tr>
  <tr><td>Insert/delete in the middle (node in hand)</td><td>O(n)</td><td>O(1)</td><td>-</td><td>-</td></tr>
</table>
<p>* Removing the tail of a <em>singly</em> linked list needs the node before it, so you must walk there. A <strong>doubly</strong> linked list (nodes also have <code>prev</code>) makes it O(1).</p>
<table>
  <tr><th>Clue in the problem</th><th>Reach for</th></tr>
  <tr><td>"undo", "most recent", "matching", "nested", "go back"</td><td>Stack</td></tr>
  <tr><td>"in order of arrival", "first come first served", "level by level", "last N seconds"</td><td>Queue</td></tr>
  <tr><td>Lots of inserts/deletes at the front or middle, no need to jump to index <em>i</em></td><td>Linked list</td></tr>
  <tr><td>Fast access by position, sorting, tight loops</td><td>Array</td></tr>
</table>
<div class="callout key"><p>Stacks and queues are about <strong>order</strong> (which item comes out next). Arrays and linked lists are about <strong>storage</strong> (how items sit in memory). You can build a stack or queue on top of either.</p></div>`
    }
  ],

  examples: [
    {
      title: "A stack step by step: undo history",
      code: `const history = [];             // our stack of actions

history.push("type 'Hello'");
history.push("make bold");
history.push("change font");
console.log("Stack:", history.join(" | "));

console.log("Undo:", history.pop());
console.log("Undo:", history.pop());
console.log("Next to undo:", history[history.length - 1]);
console.log("Actions left:", history.length);`,
      explain: `
<table>
  <tr><th>Step</th><th>Stack after (top on the right)</th></tr>
  <tr><td>push x3</td><td>type 'Hello' | make bold | change font</td></tr>
  <tr><td>pop()</td><td>type 'Hello' | make bold &nbsp; (returned "change font")</td></tr>
  <tr><td>pop()</td><td>type 'Hello' &nbsp; (returned "make bold")</td></tr>
  <tr><td>peek</td><td>type 'Hello' (not removed)</td></tr>
</table>
<p>The <strong>last</strong> action is undone <strong>first</strong> - that's LIFO. <strong>Try it:</strong> push a new action after the two undos and print the stack.</p>`
    },
    {
      title: "Undo and redo with two stacks",
      code: `const undoStack = [];
const redoStack = [];
let text = "";

function type(word) {
  undoStack.push(text);   // save the old state
  redoStack.length = 0;   // new typing clears the redo history
  text += word;
}
function undo() {
  if (undoStack.length === 0) return;
  redoStack.push(text);
  text = undoStack.pop();
}
function redo() {
  if (redoStack.length === 0) return;
  undoStack.push(text);
  text = redoStack.pop();
}

type("Hello"); type(" big"); type(" world");
console.log("Typed: ", JSON.stringify(text));
undo(); console.log("Undo:  ", JSON.stringify(text));
undo(); console.log("Undo:  ", JSON.stringify(text));
redo(); console.log("Redo:  ", JSON.stringify(text));
type("!"); console.log("Typed: ", JSON.stringify(text), "| redo left:", redoStack.length);`,
      explain: `
<ol>
  <li>Before every change we <strong>push the old text</strong> onto <code>undoStack</code>.</li>
  <li><code>undo()</code> moves the current text to <code>redoStack</code> and pops the previous version back.</li>
  <li><code>redo()</code> does the mirror image. Typing something new clears the redo stack - just like real editors.</li>
</ol>
<pre>
 after 3 types:  undo = ["", "Hello", "Hello big"]     redo = []
 after undo x2:  undo = [""]                            redo = ["Hello big world", "Hello big"]
 after redo:     undo = ["", "Hello"]                   redo = ["Hello big world"]
</pre>
<p><strong>Try it:</strong> call <code>redo()</code> three times in a row - why does nothing break?</p>`
    },
    {
      title: "The call stack in action",
      code: `let depth = 0;
function log(msg) {
  console.log("  ".repeat(depth) + msg);
}

function chargeCard() {
  depth++; log("chargeCard: start");
  log("chargeCard: done");
  depth--;
}
function checkout() {
  depth++; log("checkout: start");
  chargeCard();
  log("checkout: back from chargeCard");
  depth--;
}

log("main: start");
checkout();
log("main: end");`,
      explain: `
<p>Each function call is <strong>pushed</strong> onto the call stack and <strong>popped</strong> when it returns. The indentation shows how tall the stack is.</p>
<pre>
 main          main          main          main
               checkout      checkout      (checkout returned)
                             chargeCard
                             (running)
</pre>
<p>The function called <strong>last</strong> (<code>chargeCard</code>) finishes <strong>first</strong>. <strong>Try it:</strong> add a third function called from <code>chargeCard</code>.</p>`
    },
    {
      title: "A fair queue: the coffee shop line",
      code: `const line = [];
let head = 0;                      // index of the next customer to serve

function join(name) { line.push(name); }
function serve() {
  if (head === line.length) return "nobody waiting";
  return line[head++];             // read the front, then move the bookmark
}
function waiting() { return line.length - head; }

join("Ana"); join("Ben"); join("Cy");
console.log("Serving:", serve(), "| waiting:", waiting());
join("Dee");
console.log("Serving:", serve(), "| waiting:", waiting());
console.log("Serving:", serve(), "| waiting:", waiting());
console.log("Serving:", serve(), "| waiting:", waiting());
console.log("Serving:", serve());`,
      explain: `
<table>
  <tr><th>Step</th><th>line</th><th>head</th><th>served</th></tr>
  <tr><td>join x3</td><td>[Ana, Ben, Cy]</td><td>0</td><td>-</td></tr>
  <tr><td>serve()</td><td>[Ana, Ben, Cy]</td><td>1</td><td>Ana</td></tr>
  <tr><td>join Dee</td><td>[Ana, Ben, Cy, Dee]</td><td>1</td><td>-</td></tr>
  <tr><td>serve() x3</td><td>[Ana, Ben, Cy, Dee]</td><td>4</td><td>Ben, Cy, Dee</td></tr>
</table>
<p>We never remove anything from the array - we just move <code>head</code>. That's why every operation is O(1).
<strong>Try it:</strong> rewrite <code>serve</code> using <code>line.shift()</code> and notice you no longer need <code>head</code> (but each call is now O(n)).</p>`
    },
    {
      title: "Measure it: shift() vs a head index",
      code: `function timeIt(label, fn) {
  const t0 = Date.now();
  const result = fn();
  console.log(label, (Date.now() - t0) + " ms", "(served " + result + ")");
}
const N = 20000;

timeIt("head index:", () => {
  const q = [];
  let head = 0;
  for (let i = 0; i < N; i++) q.push(i);
  let served = 0;
  while (head < q.length) { head++; served++; }
  return served;
});

timeIt("shift():   ", () => {
  const q = [];
  for (let i = 0; i < N; i++) q.push(i);
  let served = 0;
  while (q.length > 0) { q.shift(); served++; }
  return served;
});`,
      explain: `
<p>Both serve the same 20,000 customers. The head-index version does a constant amount of work per customer.
<code>shift()</code> may have to slide the remaining items each time.</p>
<div class="callout note"><p>Modern engines optimise <code>shift()</code> in some cases, so your numbers may be close for small N. The O(n) cost is real in general - and it's what interviewers want you to know.</p></div>
<p><strong>Try it:</strong> raise <code>N</code> to 50000 and compare how each time grows.</p>`
    },
    {
      title: "Balanced brackets with a stack",
      code: `function isBalanced(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else if (ch in pairs) {
      const top = stack.pop();
      if (top !== pairs[ch]) return false;   // wrong closer (or nothing open)
    }
  }
  return stack.length === 0;                 // anything left open?
}

for (const s of ["{[()]}", "([)]", "((", "if (a[0]) { go(); }"]) {
  console.log(s.padEnd(22), isBalanced(s));
}`,
      explain: `
<p>Trace for <code>"{[()]}"</code>:</p>
<table>
  <tr><th>char</th><th>action</th><th>stack after</th></tr>
  <tr><td>{</td><td>push</td><td>{</td></tr>
  <tr><td>[</td><td>push</td><td>{ [</td></tr>
  <tr><td>(</td><td>push</td><td>{ [ (</td></tr>
  <tr><td>)</td><td>pop "(" - matches</td><td>{ [</td></tr>
  <tr><td>]</td><td>pop "[" - matches</td><td>{</td></tr>
  <tr><td>}</td><td>pop "{" - matches</td><td>(empty) &rarr; true</td></tr>
</table>
<p>For <code>"([)]"</code>, the <code>)</code> pops <code>[</code> - mismatch, so false. <strong>Try it:</strong> add angle brackets <code>&lt; &gt;</code> to <code>pairs</code>.</p>`
    },
    {
      title: "Evaluate a postfix expression",
      code: `function evaluatePostfix(expr) {
  const stack = [];
  for (const token of expr.split(" ")) {
    if ("+-*/".includes(token)) {
      const right = stack.pop();     // popped FIRST = right-hand side
      const left = stack.pop();
      let result;
      if (token === "+") result = left + right;
      if (token === "-") result = left - right;
      if (token === "*") result = left * right;
      if (token === "/") result = left / right;
      console.log("  " + left + " " + token + " " + right + " = " + result, " stack:", stack.concat(result).join(","));
      stack.push(result);
    } else {
      stack.push(Number(token));
    }
  }
  return stack.pop();
}

console.log("3 4 + 2 *   ->", evaluatePostfix("3 4 + 2 *"));
console.log("10 2 8 * + 3 - ->", evaluatePostfix("10 2 8 * + 3 -"));`,
      explain: `
<p><strong>Postfix</strong> (Reverse Polish Notation) puts the operator <em>after</em> its two numbers: <code>3 4 +</code> means <code>3 + 4</code>.
No brackets are ever needed, which is why calculators and compilers like it.</p>
<table>
  <tr><th>token</th><th>stack after</th></tr>
  <tr><td>3</td><td>3</td></tr>
  <tr><td>4</td><td>3, 4</td></tr>
  <tr><td>+</td><td>7</td></tr>
  <tr><td>2</td><td>7, 2</td></tr>
  <tr><td>*</td><td>14</td></tr>
</table>
<p><strong>Try it:</strong> what is <code>"5 2 -"</code>? If you got -3, you popped the operands in the wrong order.</p>`
    },
    {
      title: "A linked list of train carriages",
      code: `class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}
function show(head) {
  const parts = [];
  for (let node = head; node !== null; node = node.next) parts.push(node.value);
  return parts.join(" -> ") + " -> null";
}

// Build: Engine -> Dining -> Sleeper
let head = new ListNode("Engine", new ListNode("Dining", new ListNode("Sleeper")));
console.log("Train:   ", show(head));

// Insert "Cargo" after "Engine"
const cargo = new ListNode("Cargo");
cargo.next = head.next;      // 1. Cargo hooks onto Dining
head.next = cargo;           // 2. Engine hooks onto Cargo
console.log("Inserted:", show(head));

// Delete the carriage after "Cargo" (Dining)
cargo.next = cargo.next.next;
console.log("Deleted: ", show(head));

// Add at the front: O(1)
head = new ListNode("Snowplough", head);
console.log("Front:   ", show(head));`,
      explain: `
<pre>
 start:     Engine -&gt; Dining -&gt; Sleeper
 insert:    Engine -&gt; Cargo -&gt; Dining -&gt; Sleeper
 delete:    Engine -&gt; Cargo ----------&gt; Sleeper
 prepend:   Snowplough -&gt; Engine -&gt; Cargo -&gt; Sleeper
</pre>
<p>Each change touched <strong>one or two arrows</strong> - no carriages were moved. With an array, inserting near the front would shift every later element.</p>
<p><strong>Try it:</strong> swap the two insert lines (set <code>head.next</code> first). What goes missing, and why?</p>`
    },
    {
      title: "Reverse a linked list, one arrow at a time",
      code: `class ListNode {
  constructor(value, next = null) { this.value = value; this.next = next; }
}
function show(head) {
  const parts = [];
  for (let n = head; n !== null; n = n.next) parts.push(n.value);
  return parts.join(" -> ") + " -> null";
}

let head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4))));
console.log("before:", show(head));

let prev = null;
let curr = head;
let step = 1;
while (curr !== null) {
  const next = curr.next;   // save the rest
  curr.next = prev;         // flip the arrow
  prev = curr;              // move forward
  curr = next;
  console.log("step " + step++ + ": reversed part =", show(prev));
}
head = prev;
console.log("after: ", show(head));`,
      explain: `
<p>Each loop iteration flips <strong>one arrow</strong>. <code>prev</code> is the head of the part already reversed; <code>curr</code> is the part still to do.</p>
<table>
  <tr><th>step</th><th>prev (reversed)</th><th>curr (to do)</th></tr>
  <tr><td>0</td><td>null</td><td>1 -&gt; 2 -&gt; 3 -&gt; 4</td></tr>
  <tr><td>1</td><td>1</td><td>2 -&gt; 3 -&gt; 4</td></tr>
  <tr><td>2</td><td>2 -&gt; 1</td><td>3 -&gt; 4</td></tr>
  <tr><td>3</td><td>3 -&gt; 2 -&gt; 1</td><td>4</td></tr>
  <tr><td>4</td><td>4 -&gt; 3 -&gt; 2 -&gt; 1</td><td>null &rarr; done</td></tr>
</table>
<p>This is one of the most-asked interview questions. O(n) time, O(1) extra memory. <strong>Try it:</strong> reverse a list with one node, and with zero nodes (<code>head = null</code>).</p>`
    },
    {
      title: "Floyd's tortoise and hare",
      code: `class ListNode {
  constructor(value, next = null) { this.value = value; this.next = next; }
}
function hasCycle(head) {
  let slow = head, fast = head, steps = 0;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    steps++;
    if (slow === fast) {
      console.log("  met at node", slow.value, "after", steps, "steps");
      return true;
    }
  }
  console.log("  fast reached the end after", steps, "steps");
  return false;
}

// Straight list: 1 -> 2 -> 3 -> 4 -> 5
const straight = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));
console.log("straight list has cycle?", hasCycle(straight));

// Looped list: 1 -> 2 -> 3 -> 4 -> 5 -> back to 3
const a = new ListNode(1), b = new ListNode(2), c = new ListNode(3), d = new ListNode(4), e = new ListNode(5);
a.next = b; b.next = c; c.next = d; d.next = e; e.next = c;
console.log("looped list has cycle?", hasCycle(a));`,
      explain: `
<pre>
 1 -&gt; 2 -&gt; 3 -&gt; 4 -&gt; 5
           ^         |
           +---------+
</pre>
<table>
  <tr><th>step</th><th>slow</th><th>fast</th></tr>
  <tr><td>0</td><td>1</td><td>1</td></tr>
  <tr><td>1</td><td>2</td><td>3</td></tr>
  <tr><td>2</td><td>3</td><td>5</td></tr>
  <tr><td>3</td><td>4</td><td>4 &rarr; same node: cycle!</td></tr>
</table>
<p>Inside a loop the hare gains one node per step, so it <em>must</em> catch the tortoise. O(n) time and only two pointers of memory.
<strong>Try it:</strong> make <code>e.next = a</code> (a loop back to the start) and count the steps.</p>`
    }
  ],

  pitfalls: [
    "Calling <code>pop()</code> on an empty JS array returns <code>undefined</code> silently. In your own Stack/Queue class, <strong>throw an error</strong> so bugs surface early.",
    "Using <code>shift()</code> as a queue in a big loop is O(n) per call. Use a head index (or two stacks).",
    "Postfix: the <strong>first</strong> value you pop is the <em>right</em> operand. <code>\"5 2 -\"</code> is <code>5 - 2 = 3</code>, not <code>2 - 5</code>.",
    "Linked lists: save <code>curr.next</code> <strong>before</strong> overwriting it, or you lose the rest of the list.",
    "Forgetting to update <code>head</code> / <code>tail</code> when removing the first or last node, or after reversing. Test the 0-node and 1-node cases.",
    "In fast/slow loops, check <code>fast !== null &amp;&amp; fast.next !== null</code> - in that order - or <code>fast.next.next</code> crashes on short lists.",
    "Brackets: a string can fail in two ways - a closer with no matching opener, <em>and</em> openers left over at the end. Check both."
  ],

  quiz: [
    {
      q: "What does this print?",
      code: `const stack = [];
stack.push("A");
stack.push("B");
stack.push("C");
stack.pop();
stack.push("D");
console.log(stack.pop(), stack.length);`,
      options: ["C 3", "D 2", "A 2", "D 3"],
      answer: 1,
      output: "D 2",
      explain: "<p>After the pushes: A, B, C. <code>pop()</code> removes C. Push D: A, B, D. The last <code>pop()</code> returns <strong>D</strong> (last in, first out), leaving A, B - length <strong>2</strong>.</p>"
    },
    {
      q: "What does this print?",
      code: `const q = [];
let head = 0;
q.push("Ana"); q.push("Ben"); q.push("Cy");
head++;
q.push("Dee");
console.log(q[head], q.length - head);`,
      options: ["Ana 4", "Ben 3", "Dee 3", "Ben 4"],
      answer: 1,
      output: "Ben 3",
      explain: "<p><code>head++</code> \"serves\" Ana by moving the bookmark to index 1, so the front is now <strong>Ben</strong>. Size is <code>4 - 1 = 3</code> (Ben, Cy, Dee).</p>"
    },
    {
      q: "Which structure best fits an editor's <strong>Undo</strong> button?",
      options: ["Queue - undo the oldest action first", "Stack - undo the most recent action first", "Linked list - because it is faster", "Sorted array"],
      answer: 1,
      explain: "<p>Undo reverses your <strong>latest</strong> action first: last in, first out. That's a <strong>stack</strong>. A queue would undo your very first edit of the day!</p>"
    },
    {
      q: "Why is using <code>arr.shift()</code> to dequeue considered slow?",
      options: [
        "It removes from the end instead of the front",
        "It has to move every remaining element one position left - O(n)",
        "It copies the whole array to a new one every time - O(n<sup>2</sup>)",
        "It is not slow; it is O(1)"
      ],
      answer: 1,
      explain: "<p>After removing index 0, every other element must slide down to keep indexes 0, 1, 2... contiguous. That's <strong>O(n)</strong> per call. A head index avoids moving anything.</p>"
    },
    {
      q: "What does this print?",
      code: `class ListNode {
  constructor(value, next = null) { this.value = value; this.next = next; }
}
const head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4))));
head.next = head.next.next;
const out = [];
for (let n = head; n !== null; n = n.next) out.push(n.value);
console.log(out.join("-"));`,
      options: ["1-2-3-4", "1-3-4", "2-3-4", "1-2-4"],
      answer: 1,
      output: "1-3-4",
      explain: "<p><code>head.next = head.next.next</code> makes node 1 point straight to node 3, <strong>skipping</strong> node 2. That's how you delete the node after a given node in O(1).</p>"
    },
    {
      q: "Which operation is O(1) for a linked list but O(n) for an array?",
      options: ["Reading the element at index i", "Adding a new element at the front", "Searching for a value", "Finding the length when you don't track it"],
      answer: 1,
      explain: "<p>Adding at the front of a linked list is just <code>head = new ListNode(x, head)</code>. An array must shift every element right to make room at index 0. Reading index <em>i</em> is the opposite: O(1) for arrays, O(n) for linked lists.</p>"
    },
    {
      q: "In Floyd's cycle detection, what does it mean if <code>slow</code> and <code>fast</code> point to the same node?",
      options: [
        "The list is empty",
        "We've found the middle of the list",
        "The list has a cycle",
        "The list is sorted"
      ],
      answer: 2,
      explain: "<p>On a straight list the fast pointer simply reaches <code>null</code> and the two never meet. They can only meet if the fast one <strong>laps</strong> the slow one - which requires a loop.</p>"
    }
  ],

  interview: [
    { q: "Stack vs queue - what's the difference and when would you use each?",
      a: "<p>A <strong>stack</strong> is LIFO: the last item added is the first removed. Use it for undo/redo, browser back, the function call stack, bracket matching, expression evaluation and depth-first search. A <strong>queue</strong> is FIFO: the first item added is the first removed. Use it for job/print queues, message buffers, rate limiting and breadth-first search.</p>" },
    { q: "Array vs linked list - what are the trade-offs?",
      a: "<p><strong>Array:</strong> O(1) access by index and contiguous memory (cache-friendly), but inserting or deleting at the front/middle is O(n) because elements shift. <strong>Linked list:</strong> O(1) insert/delete at the head or next to a node you already hold, and it grows without resizing - but access by index is O(n), each node costs extra memory for the pointer, and cache locality is poor.</p>" },
    { q: "How do you detect a cycle in a linked list using O(1) memory?",
      a: "<p><strong>Floyd's tortoise and hare:</strong> move <code>slow</code> one step and <code>fast</code> two steps at a time. If <code>fast</code> reaches <code>null</code>, there is no cycle. If <code>slow === fast</code> at any point, there is one. O(n) time, O(1) space. (A <code>Set</code> of visited nodes also works but uses O(n) memory.)</p>" },
    { q: "How do you reverse a singly linked list?",
      a: "<p>Iterate with three pointers <code>prev</code>, <code>curr</code>, <code>next</code>: save <code>curr.next</code>, point <code>curr.next</code> to <code>prev</code>, then advance <code>prev</code> and <code>curr</code>. When <code>curr</code> is <code>null</code>, <code>prev</code> is the new head. O(n) time, O(1) space.</p>" },
    { q: "How can you implement a queue using two stacks?",
      a: "<p>Push new items onto an <code>in</code> stack. To dequeue, if the <code>out</code> stack is empty, pop everything from <code>in</code> onto <code>out</code> (which reverses the order), then pop from <code>out</code>. Each item moves at most twice, so operations are <strong>amortised O(1)</strong>.</p>" },
    { q: "How do you find the middle of a linked list in one pass?",
      a: "<p>Fast and slow pointers: <code>fast</code> moves two steps for each one step of <code>slow</code>. When <code>fast</code> reaches the end, <code>slow</code> is at the middle. No need to count the length first.</p>" }
  ],

  exercises: [
    {
      id: "undo-typing",
      title: "Warm-up: undo with a stack",
      difficulty: "easy",
      prompt: "<p>You get a list of actions typed into a tiny editor. Each action is either a single word to add, or the string <code>\"UNDO\"</code>, which removes the most recently added word that is still there. Return the remaining words joined with spaces.</p><pre>applyActions([\"Hello\", \"big\", \"UNDO\", \"world\"])   // \"Hello world\"\napplyActions([\"a\", \"b\", \"UNDO\", \"UNDO\"])           // \"\"\napplyActions([\"UNDO\", \"hi\"])                       // \"hi\"  (nothing to undo is fine)</pre>",
      starter: `function applyActions(actions) {
  // your code here
}`,
      solution: `function applyActions(actions) {
  const words = [];                 // a stack: the end is the top
  for (const action of actions) {
    if (action === "UNDO") {
      words.pop();                  // remove the most recent word (no-op if empty)
    } else {
      words.push(action);           // add a word on top
    }
  }
  return words.join(" ");
}`,
      hint: "Keep an array as a stack. A word means <code>push</code>, <code>\"UNDO\"</code> means <code>pop</code>. Finish with <code>join(\" \")</code>.",
      tests: [
        { expr: "applyActions([\"Hello\", \"big\", \"UNDO\", \"world\"])", expected: "Hello world" },
        { expr: "applyActions([\"a\", \"b\", \"UNDO\", \"UNDO\"])", expected: "" },
        { label: "undo on empty is ignored", expr: "applyActions([\"UNDO\", \"hi\"])", expected: "hi" },
        { expr: "applyActions([])", expected: "" },
        { expr: "applyActions([\"x\", \"y\", \"z\"])", expected: "x y z" },
        { expr: "applyActions([\"a\", \"UNDO\", \"b\", \"c\", \"UNDO\", \"d\"])", expected: "b d" }
      ]
    },
    {
      id: "stack-class",
      title: "Stack class",
      difficulty: "easy",
      prompt: "<p>Build your own <code>Stack</code> on top of an array.</p><ul><li><code>push(x)</code> - add on top</li><li><code>pop()</code> - remove and return the top; <strong>throw</strong> an error if empty</li><li><code>peek()</code> - return the top without removing it; throw if empty</li><li><code>isEmpty()</code> - true/false</li><li><code>get size</code> - how many items</li></ul><pre>const s = new Stack();\ns.push(1); s.push(2); s.push(3);\ns.peek();   // 3\ns.pop();    // 3\ns.size;     // 2\nnew Stack().pop();   // throws</pre>",
      starter: `class Stack {
  #items = [];

  push(x) {
    // your code here
  }

  pop() {
    // your code here
  }

  peek() {
    // your code here
  }

  isEmpty() {
    // your code here
  }

  get size() {
    // your code here
  }
}`,
      solution: `class Stack {
  #items = [];   // private array; the END of the array is the top

  push(x) {
    this.#items.push(x);
  }

  pop() {
    // Fail loudly instead of silently returning undefined
    if (this.isEmpty()) throw new Error("pop from empty stack");
    return this.#items.pop();
  }

  peek() {
    if (this.isEmpty()) throw new Error("peek at empty stack");
    return this.#items[this.#items.length - 1];
  }

  isEmpty() {
    return this.#items.length === 0;
  }

  get size() {
    return this.#items.length;
  }
}`,
      hint: "Use the <strong>end</strong> of the array as the top - <code>push</code> and <code>pop</code> are O(1) there. The top item is <code>this.#items[this.#items.length - 1]</code>.",
      tests: [
        { label: "new stack is empty", code: "const s = new Stack(); return [s.isEmpty(), s.size];", expected: [true, 0] },
        { label: "LIFO order", code: "const s = new Stack(); s.push(1); s.push(2); s.push(3); return [s.pop(), s.pop(), s.pop()];", expected: [3, 2, 1] },
        { label: "peek does not remove", code: "const s = new Stack(); s.push('a'); s.push('b'); return [s.peek(), s.size];", expected: ["b", 2] },
        { label: "size after pushes and pops", code: "const s = new Stack(); s.push(1); s.push(2); s.pop(); return [s.size, s.isEmpty()];", expected: [1, false] },
        { label: "pop on empty throws", code: "new Stack().pop();", throws: true },
        { label: "peek on empty throws", code: "new Stack().peek();", throws: true },
        { label: "empty again after popping everything", code: "const s = new Stack(); s.push(1); s.pop(); return s.isEmpty();", expected: true }
      ]
    },
    {
      id: "queue-class",
      title: "Queue class (O(1) dequeue)",
      difficulty: "medium",
      prompt: "<p>Build a FIFO <code>Queue</code> where <strong>every</strong> operation is O(1). Don't use <code>shift()</code> - keep a head index (or an object with head/tail counters).</p><ul><li><code>enqueue(x)</code> - join at the back</li><li><code>dequeue()</code> - remove and return the front; throw if empty</li><li><code>peek()</code> - front without removing; throw if empty</li><li><code>isEmpty()</code>, <code>get size</code></li></ul><pre>const q = new Queue();\nq.enqueue(\"Ana\"); q.enqueue(\"Ben\"); q.enqueue(\"Cy\");\nq.dequeue();   // \"Ana\"\nq.peek();      // \"Ben\"\nq.size;        // 2</pre>",
      starter: `class Queue {
  constructor() {
    // your code here
  }

  enqueue(x) {
    // your code here
  }

  dequeue() {
    // your code here
  }

  peek() {
    // your code here
  }

  isEmpty() {
    // your code here
  }

  get size() {
    // your code here
  }
}`,
      solution: `class Queue {
  constructor() {
    this.items = {};   // slot number -> value
    this.head = 0;     // slot of the front item
    this.tail = 0;     // slot where the next item will go
  }

  enqueue(x) {
    this.items[this.tail] = x;
    this.tail++;
  }

  dequeue() {
    if (this.isEmpty()) throw new Error("dequeue from empty queue");
    const front = this.items[this.head];
    delete this.items[this.head];   // free the memory
    this.head++;                    // move the bookmark - nothing shifts
    return front;
  }

  peek() {
    if (this.isEmpty()) throw new Error("peek at empty queue");
    return this.items[this.head];
  }

  isEmpty() {
    return this.size === 0;
  }

  get size() {
    return this.tail - this.head;
  }
}`,
      hint: "Track two numbers: <code>head</code> (where the front is) and <code>tail</code> (where the next item goes). Enqueue writes at <code>tail</code> and increments it; dequeue reads at <code>head</code> and increments it. Size is <code>tail - head</code>.",
      explanation: "<p>The trick is to <strong>move a bookmark instead of moving the data</strong>. Both counters only ever go up, so each operation does a fixed amount of work - O(1) - no matter how long the queue is. The speed test with 200,000 items would crawl with <code>shift()</code> in many environments.</p>",
      forbid: [{ pattern: "\\.shift\\(|\\.splice\\(", message: "shift() and splice() are O(n). Use a head index instead." }],
      tests: [
        { label: "new queue is empty", code: "const q = new Queue(); return [q.isEmpty(), q.size];", expected: [true, 0] },
        { label: "FIFO order", code: "const q = new Queue(); q.enqueue(1); q.enqueue(2); q.enqueue(3); return [q.dequeue(), q.dequeue(), q.dequeue()];", expected: [1, 2, 3] },
        { label: "peek does not remove", code: "const q = new Queue(); q.enqueue('a'); q.enqueue('b'); return [q.peek(), q.size];", expected: ["a", 2] },
        { label: "interleaved operations", code: "const q = new Queue(); q.enqueue(1); q.enqueue(2); q.dequeue(); q.enqueue(3); return [q.dequeue(), q.dequeue(), q.isEmpty()];", expected: [2, 3, true] },
        { label: "dequeue on empty throws", code: "new Queue().dequeue();", throws: true },
        { label: "peek on empty throws", code: "new Queue().peek();", throws: true },
        { label: "dequeue after draining throws", code: "const q = new Queue(); q.enqueue(1); q.dequeue(); q.dequeue();", throws: true },
        { label: "200,000 items stay fast", code: "const q = new Queue(); for (let i = 0; i < 200000; i++) q.enqueue(i); let s = 0; for (let i = 0; i < 200000; i++) s += q.dequeue(); return [s, q.isEmpty()];", expected: [19999900000, true], maxMs: 1500 }
      ]
    },
    {
      id: "reverse-with-stack",
      title: "reverseString with a stack",
      difficulty: "easy",
      prompt: "<p>Reverse a string by pushing every character onto a stack, then popping them all off. Don't use <code>reverse()</code>.</p><pre>reverseString(\"hello\")   // \"olleh\"\nreverseString(\"ab cd\")   // \"dc ba\"\nreverseString(\"\")        // \"\"</pre>",
      starter: `function reverseString(s) {
  // your code here
}`,
      solution: `function reverseString(s) {
  const stack = [];
  for (const ch of s) stack.push(ch);   // h, e, l, l, o  (o on top)

  let out = "";
  while (stack.length > 0) {
    out += stack.pop();                 // o, l, l, e, h  - LIFO reverses the order
  }
  return out;
}`,
      hint: "Loop over the characters and <code>push</code> each one. Then <code>while (stack.length &gt; 0)</code> add <code>stack.pop()</code> to a result string.",
      explanation: "<p>Pushing then popping <strong>always reverses order</strong> - that's LIFO in its purest form. The same idea reverses a list of words, a linked list (with extra memory) or checks palindromes.</p>",
      forbid: [{ pattern: "\\.reverse\\(", message: "Use a stack, not reverse()." }],
      tests: [
        { expr: "reverseString(\"hello\")", expected: "olleh" },
        { expr: "reverseString(\"\")", expected: "" },
        { expr: "reverseString(\"a\")", expected: "a" },
        { expr: "reverseString(\"racecar\")", expected: "racecar" },
        { expr: "reverseString(\"ab cd\")", expected: "dc ba" }
      ]
    },
    {
      id: "is-balanced",
      title: "Balanced brackets",
      difficulty: "medium",
      prompt: "<p>Return <code>true</code> if every <code>(</code>, <code>[</code> and <code>{</code> is closed by the matching bracket <strong>in the right order</strong>. Ignore all other characters.</p><pre>isBalanced(\"([]{})\")               // true\nisBalanced(\"([)]\")                 // false - closed in the wrong order\nisBalanced(\"((\")                   // false - never closed\nisBalanced(\"))\")                   // false - nothing to close\nisBalanced(\"f(a[0]) { return x; }\") // true</pre>",
      starter: `function isBalanced(s) {
  // your code here
}`,
      solution: `function isBalanced(s) {
  // For each closer, which opener must be on top of the stack?
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];

  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);                         // remember the opener
    } else if (ch in pairs) {
      // A closer must match the MOST RECENT unclosed opener.
      // If the stack is empty, pop() gives undefined, which won't match either.
      if (stack.pop() !== pairs[ch]) return false;
    }
    // any other character: ignore it
  }
  return stack.length === 0;                  // leftover openers = unbalanced
}`,
      hint: "Push every opener. When you see a closer, pop the top and check it's the matching opener. At the very end the stack must be empty.",
      explanation: "<p>The most recently opened bracket must be the first one closed - exactly LIFO. There are two ways to fail: a closer that doesn't match the top (or arrives when nothing is open), and openers still left at the end. A lookup object like <code>pairs</code> keeps the code short and easy to extend.</p>",
      tests: [
        { expr: "isBalanced(\"([]{})\")", expected: true },
        { expr: "isBalanced(\"([)]\")", expected: false },
        { expr: "isBalanced(\"((\")", expected: false },
        { expr: "isBalanced(\"))\")", expected: false },
        { expr: "isBalanced(\"\")", expected: true },
        { expr: "isBalanced(\"{[()()]}\")", expected: true },
        { expr: "isBalanced(\"f(a[0]) { return x; }\")", expected: true },
        { expr: "isBalanced(\"(]\")", expected: false },
        { expr: "isBalanced(\"no brackets\")", expected: true }
      ]
    },
    {
      id: "evaluate-postfix",
      title: "Evaluate postfix (RPN)",
      difficulty: "medium",
      prompt: "<p>Evaluate a <strong>postfix</strong> (Reverse Polish Notation) expression: each operator comes <em>after</em> its two operands, and tokens are separated by spaces. Operators: <code>+ - * /</code>. Division truncates toward zero (<code>Math.trunc</code>).</p><pre>evaluatePostfix(\"3 4 + 2 *\")          // 14   = (3 + 4) * 2\nevaluatePostfix(\"5 1 2 + 4 * + 3 -\")  // 14   = 5 + (1 + 2) * 4 - 3\nevaluatePostfix(\"7 -2 /\")             // -3  (truncated toward zero)</pre><p>Throw an error if an operator doesn't have two operands, or if more than one value is left at the end.</p>",
      starter: `function evaluatePostfix(expr) {
  // your code here
}`,
      solution: `function evaluatePostfix(expr) {
  const stack = [];
  // A lookup table of operations keeps the main loop tiny
  const ops = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => Math.trunc(a / b)
  };

  for (const token of expr.trim().split(/\\s+/)) {
    if (token in ops) {
      if (stack.length < 2) throw new Error("not enough operands for " + token);
      const b = stack.pop();   // the RIGHT operand comes off first
      const a = stack.pop();   // then the left one
      stack.push(ops[token](a, b));
    } else {
      stack.push(Number(token));   // a number: just store it
    }
  }

  if (stack.length !== 1) throw new Error("invalid expression");
  return stack[0];
}`,
      hint: "Numbers go onto the stack. An operator pops two values - careful: the <strong>first</strong> pop is the <em>right</em> operand - computes, and pushes the result back. At the end exactly one value should remain.",
      explanation: "<p>Postfix needs no brackets and no precedence rules: the stack automatically holds the partial results in the right order. This is how many calculators and the JVM/bytecode interpreters work. The classic bug is popping <code>a</code> before <code>b</code>, which makes <code>\"5 2 -\"</code> return -3.</p>",
      tests: [
        { expr: "evaluatePostfix(\"3 4 + 2 *\")", expected: 14 },
        { expr: "evaluatePostfix(\"5 1 2 + 4 * + 3 -\")", expected: 14 },
        { label: "order matters for -", expr: "evaluatePostfix(\"5 2 -\")", expected: 3 },
        { label: "order matters for /", expr: "evaluatePostfix(\"20 4 /\")", expected: 5 },
        { label: "division truncates toward zero", expr: "evaluatePostfix(\"7 -2 /\")", expected: -3 },
        { label: "single number", expr: "evaluatePostfix(\"42\")", expected: 42 },
        { expr: "evaluatePostfix(\"2 3 4 * +\")", expected: 14 },
        { label: "missing operand throws", code: "evaluatePostfix(\"1 +\");", throws: true },
        { label: "leftover values throw", code: "evaluatePostfix(\"1 2\");", throws: true }
      ]
    },
    {
      id: "linked-list-class",
      title: "LinkedList class",
      difficulty: "medium",
      prompt: "<p>Build a singly linked list that tracks <code>head</code>, <code>tail</code> and <code>length</code>. <code>ListNode</code> is provided.</p><ul><li><code>append(value)</code> - add at the end in O(1) (that's what <code>tail</code> is for)</li><li><code>prepend(value)</code> - add at the front in O(1)</li><li><code>toArray()</code> - values from head to tail</li><li><code>contains(value)</code> - <code>true</code>/<code>false</code></li><li><code>remove(value)</code> - remove the <strong>first</strong> node with that value; return <code>true</code> if removed, <code>false</code> if not found</li><li><code>reverse()</code> - reverse the list in place</li><li><code>get size</code></li></ul><pre>const l = new LinkedList();\nl.append(1); l.append(2); l.prepend(0);\nl.toArray();     // [0, 1, 2]\nl.remove(1);     // true  -&gt; [0, 2]\nl.reverse();     // [2, 0]\nl.append(9);     // [2, 0, 9]  (tail must be correct after reverse!)</pre>",
      starter: `class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value) {
    // your code here
  }

  prepend(value) {
    // your code here
  }

  toArray() {
    // your code here
  }

  contains(value) {
    // your code here
  }

  remove(value) {
    // your code here
  }

  reverse() {
    // your code here
  }

  get size() {
    // your code here
  }
}`,
      solution: `class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value) {
    const node = new ListNode(value);
    if (this.tail === null) {
      this.head = node;          // empty list: the new node is also the head
    } else {
      this.tail.next = node;     // hook it after the current tail
    }
    this.tail = node;
    this.length++;
  }

  prepend(value) {
    this.head = new ListNode(value, this.head);   // new node points at old head
    if (this.tail === null) this.tail = this.head; // list was empty
    this.length++;
  }

  toArray() {
    const out = [];
    for (let node = this.head; node !== null; node = node.next) out.push(node.value);
    return out;
  }

  contains(value) {
    for (let node = this.head; node !== null; node = node.next) {
      if (node.value === value) return true;
    }
    return false;
  }

  remove(value) {
    // Walk with two pointers so we can re-link around the removed node
    let prev = null;
    let curr = this.head;
    while (curr !== null && curr.value !== value) {
      prev = curr;
      curr = curr.next;
    }
    if (curr === null) return false;            // not found

    if (prev === null) this.head = curr.next;   // removing the head
    else prev.next = curr.next;                 // skip over curr

    if (curr === this.tail) this.tail = prev;   // removing the tail
    this.length--;
    return true;
  }

  reverse() {
    let prev = null;
    let curr = this.head;
    this.tail = this.head;                      // the old head becomes the tail
    while (curr !== null) {
      const next = curr.next;                   // 1. save the rest
      curr.next = prev;                         // 2. flip the arrow
      prev = curr;                              // 3. step forward
      curr = next;
    }
    this.head = prev;                           // the old tail is the new head
  }

  get size() {
    return this.length;
  }
}`,
      hint: "For <code>remove</code>, walk with two pointers <code>prev</code> and <code>curr</code>. Handle the special cases: removing the <strong>head</strong> (<code>prev</code> is null) and removing the <strong>tail</strong> (update <code>this.tail</code>). For <code>reverse</code>, remember that the old head becomes the new tail.",
      explanation: "<p>Most linked-list bugs live in the edge cases: empty list, one node, first node, last node. The tests check that <code>head</code> and <code>tail</code> stay correct after removing the tail, removing the only node and reversing - because a stale <code>tail</code> makes the next <code>append</code> attach to a node that's no longer at the end.</p>",
      tests: [
        { label: "empty list", code: "const l = new LinkedList(); return [l.toArray(), l.size];", expected: [[], 0] },
        { label: "append keeps order", code: "const l = new LinkedList(); l.append(1); l.append(2); l.append(3); return l.toArray();", expected: [1, 2, 3] },
        { label: "prepend adds to the front", code: "const l = new LinkedList(); l.append(1); l.prepend(0); l.append(2); return [l.toArray(), l.size];", expected: [[0, 1, 2], 3] },
        { label: "prepend on empty sets tail", code: "const l = new LinkedList(); l.prepend(5); l.append(6); return [l.toArray(), l.tail.value];", expected: [[5, 6], 6] },
        { label: "contains", code: "const l = new LinkedList(); l.append('a'); l.append('b'); return [l.contains('b'), l.contains('z')];", expected: [true, false] },
        { label: "remove from the middle", code: "const l = new LinkedList(); [1, 2, 3].forEach(function (x) { l.append(x); }); return [l.remove(2), l.toArray(), l.size];", expected: [true, [1, 3], 2] },
        { label: "remove the head", code: "const l = new LinkedList(); [1, 2, 3].forEach(function (x) { l.append(x); }); l.remove(1); return [l.toArray(), l.head.value];", expected: [[2, 3], 2] },
        { label: "remove the tail, then append", code: "const l = new LinkedList(); [1, 2, 3].forEach(function (x) { l.append(x); }); l.remove(3); l.append(4); return l.toArray();", expected: [1, 2, 4] },
        { label: "remove only the first match", code: "const l = new LinkedList(); [1, 2, 1].forEach(function (x) { l.append(x); }); l.remove(1); return l.toArray();", expected: [2, 1] },
        { label: "remove missing returns false", code: "const l = new LinkedList(); l.append(1); return [l.remove(9), l.size];", expected: [false, 1] },
        { label: "remove the only node", code: "const l = new LinkedList(); l.append(1); l.remove(1); l.append(2); return [l.toArray(), l.head === l.tail];", expected: [[2], true] },
        { label: "reverse", code: "const l = new LinkedList(); [1, 2, 3, 4].forEach(function (x) { l.append(x); }); l.reverse(); return l.toArray();", expected: [4, 3, 2, 1] },
        { label: "append after reverse uses the new tail", code: "const l = new LinkedList(); [1, 2, 3].forEach(function (x) { l.append(x); }); l.reverse(); l.append(0); return l.toArray();", expected: [3, 2, 1, 0] },
        { label: "reverse an empty list", code: "const l = new LinkedList(); l.reverse(); return l.toArray();", expected: [] }
      ]
    },
    {
      id: "middle-node",
      title: "Middle of a linked list",
      difficulty: "medium",
      prompt: "<p>Given the <code>head</code> of a linked list, return the <strong>value</strong> of the middle node in <strong>one pass</strong>. If there are two middle nodes, return the <strong>second</strong> one. Return <code>null</code> for an empty list.</p><pre>middleNode(fromArray([1, 2, 3, 4, 5]))   // 3\nmiddleNode(fromArray([1, 2, 3, 4]))      // 3  (second of the two middles)\nmiddleNode(null)                         // null</pre><p><code>ListNode</code> and a helper <code>fromArray</code> are provided.</p>",
      starter: `class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

// Helper: fromArray([1, 2, 3]) -> head of 1 -> 2 -> 3
function fromArray(values) {
  let head = null;
  for (let i = values.length - 1; i >= 0; i--) head = new ListNode(values[i], head);
  return head;
}

function middleNode(head) {
  // your code here
}`,
      solution: `class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

function fromArray(values) {
  let head = null;
  for (let i = values.length - 1; i >= 0; i--) head = new ListNode(values[i], head);
  return head;
}

function middleNode(head) {
  if (head === null) return null;
  let slow = head;   // moves 1 step
  let fast = head;   // moves 2 steps
  // When fast runs off the end, slow has covered half the distance
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow.value;
}`,
      hint: "Fast and slow pointers, both starting at <code>head</code>. Loop while <code>fast !== null &amp;&amp; fast.next !== null</code>; each round move <code>slow</code> one step and <code>fast</code> two.",
      explanation: "<p>Because <code>fast</code> travels twice as far, <code>slow</code> is at the halfway point when <code>fast</code> finishes. For 4 nodes: slow goes 1&rarr;2&rarr;3 while fast goes 1&rarr;3&rarr;null, giving the <em>second</em> middle. One pass, O(1) extra memory.</p>",
      forbid: [{ pattern: "\\.push\\(|length\\s*/|toArray", message: "Do it in one pass with two pointers - no copying into an array or counting first." }],
      tests: [
        { label: "odd length", expr: "middleNode(fromArray([1, 2, 3, 4, 5]))", expected: 3 },
        { label: "even length -> second middle", expr: "middleNode(fromArray([1, 2, 3, 4]))", expected: 3 },
        { label: "single node", expr: "middleNode(fromArray([7]))", expected: 7 },
        { label: "two nodes", expr: "middleNode(fromArray([1, 2]))", expected: 2 },
        { label: "empty list", expr: "middleNode(null)", expected: null },
        { label: "longer list", expr: "middleNode(fromArray([10, 20, 30, 40, 50, 60, 70]))", expected: 40 }
      ]
    },
    {
      id: "has-cycle",
      title: "Detect a cycle (Floyd)",
      difficulty: "hard",
      prompt: "<p>Return <code>true</code> if the linked list starting at <code>head</code> contains a <strong>cycle</strong> - some node's <code>next</code> points back to an earlier node, so walking the list would never end.</p><pre>1 -&gt; 2 -&gt; 3 -&gt; 4          hasCycle -&gt; false\n1 -&gt; 2 -&gt; 3 -&gt; 4\n     ^         |          hasCycle -&gt; true\n     +---------+</pre><p>Use <strong>O(1) extra memory</strong> - Floyd's tortoise and hare. No <code>Set</code>/<code>Map</code>, and don't modify the nodes.</p>",
      starter: `class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

function hasCycle(head) {
  // your code here
}`,
      solution: `class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

function hasCycle(head) {
  let slow = head;   // the tortoise
  let fast = head;   // the hare
  while (fast !== null && fast.next !== null) {
    slow = slow.next;          // 1 step
    fast = fast.next.next;     // 2 steps
    if (slow === fast) return true;   // the hare lapped the tortoise: loop!
  }
  return false;                // the hare reached the end: no loop
}`,
      hint: "Same loop shape as finding the middle node, plus one check: after moving, if <code>slow === fast</code> (the same node object, not just the same value) there is a cycle.",
      explanation: "<p>On a straight list, <code>fast</code> hits <code>null</code> and we stop. Inside a loop, the gap between the hare and the tortoise shrinks by one node every step, so they must meet within one lap. O(n) time, O(1) space. Note we compare <strong>nodes</strong> (<code>slow === fast</code>), not values - lists can contain duplicate values without having a cycle.</p>",
      forbid: [{ pattern: "new\\s+(Set|Map|WeakSet|WeakMap)|visited", message: "Use O(1) memory - two pointers, no visited collection or flags." }],
      tests: [
        { label: "empty list", expr: "hasCycle(null)", expected: false },
        { label: "single node, no cycle", expr: "hasCycle(new ListNode(1))", expected: false },
        { label: "single node pointing to itself", code: "const a = new ListNode(1); a.next = a; return hasCycle(a);", expected: true },
        { label: "straight list", code: "const head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4)))); return hasCycle(head);", expected: false },
        { label: "tail points back to node 2", code: "const a = new ListNode(1), b = new ListNode(2), c = new ListNode(3), d = new ListNode(4); a.next = b; b.next = c; c.next = d; d.next = b; return hasCycle(a);", expected: true },
        { label: "two nodes in a loop", code: "const a = new ListNode(1), b = new ListNode(2); a.next = b; b.next = a; return hasCycle(a);", expected: true },
        { label: "duplicate values are not a cycle", code: "const head = new ListNode(1, new ListNode(1, new ListNode(1))); return hasCycle(head);", expected: false },
        { label: "long list with a loop at the end", code: "const head = new ListNode(0); let n = head; for (let i = 1; i < 10000; i++) { n.next = new ListNode(i); n = n.next; } n.next = head; return hasCycle(head);", expected: true }
      ]
    },
    {
      id: "hot-potato",
      title: "Hot potato (queue simulation)",
      difficulty: "medium",
      prompt: "<p>Children stand in a circle passing a hot potato. Each round, the potato is passed <code>num</code> times - model this as moving the front person to the back of a queue <code>num</code> times. Then the person holding it (now at the front) is <strong>out</strong>. Repeat until one person is left and return their name.</p><pre>hotPotato([\"Bill\", \"David\", \"Susan\", \"Jane\", \"Kent\", \"Brad\"], 7)  // \"Susan\"\nhotPotato([\"A\", \"B\", \"C\"], 0)   // \"C\"  (front is out every round)\nhotPotato([\"Solo\"], 3)          // \"Solo\"</pre><p>Don't change the input array.</p>",
      starter: `function hotPotato(names, num) {
  // your code here
}`,
      solution: `function hotPotato(names, num) {
  // Queue with a head index: items[head] is the person at the front.
  const items = names.slice();   // copy, so the caller's array is untouched
  let head = 0;

  while (items.length - head > 1) {      // more than one person left
    for (let i = 0; i < num; i++) {
      items.push(items[head]);           // pass: front person goes to the back
      head++;
    }
    head++;                              // the person holding the potato is out
  }
  return items[head];
}`,
      hint: "Model the circle as a queue. \"Pass\" = dequeue the front person and enqueue them again at the back. \"Out\" = dequeue and don't put them back. Stop when the queue has one person.",
      explanation: "<p>A circle is just a queue where people rejoin at the back - the same <strong>round-robin</strong> pattern operating systems use to give each program a turn on the CPU. Using a head index keeps every pass O(1); with <code>shift()</code> each pass would be O(n).</p>",
      tests: [
        { expr: "hotPotato([\"Bill\", \"David\", \"Susan\", \"Jane\", \"Kent\", \"Brad\"], 7)", expected: "Susan" },
        { label: "only one person", expr: "hotPotato([\"Solo\"], 3)", expected: "Solo" },
        { label: "num = 0 removes the front each time", expr: "hotPotato([\"A\", \"B\", \"C\"], 0)", expected: "C" },
        { label: "num = 1", expr: "hotPotato([\"A\", \"B\", \"C\", \"D\"], 1)", expected: "A" },
        { label: "does not modify the input", code: "const names = ['A', 'B', 'C']; hotPotato(names, 2); return names;", expected: ["A", "B", "C"] }
      ]
    },
    {
      id: "recent-counter",
      title: "RecentCounter (sliding time window)",
      difficulty: "medium",
      prompt: "<p>Build <code>RecentCounter</code>. <code>ping(t)</code> records a request at time <code>t</code> (in milliseconds) and returns how many requests happened in the last 3000 ms - the inclusive range <code>[t - 3000, t]</code>. Each call uses a strictly larger <code>t</code> than the one before.</p><pre>const rc = new RecentCounter();\nrc.ping(1);      // 1   window [-2999, 1]   -&gt; {1}\nrc.ping(100);    // 2   window [-2900, 100] -&gt; {1, 100}\nrc.ping(3001);   // 3   window [1, 3001]    -&gt; {1, 100, 3001}\nrc.ping(3002);   // 3   window [2, 3002]    -&gt; {100, 3001, 3002}</pre><p>This is the core of a <strong>rate limiter</strong>. Make each ping amortised O(1): no <code>filter</code> over the whole history, no <code>shift()</code>.</p>",
      starter: `class RecentCounter {
  constructor() {
    // your code here
  }

  ping(t) {
    // your code here
  }
}`,
      solution: `class RecentCounter {
  constructor() {
    this.times = [];   // a queue of ping times, oldest at the front
    this.head = 0;     // index of the oldest ping still inside the window
  }

  ping(t) {
    this.times.push(t);   // newest ping joins at the back
    // Old pings are always at the FRONT (times only increase), so drop them there
    while (this.times[this.head] < t - 3000) {
      this.head++;
    }
    return this.times.length - this.head;   // pings still in the window
  }
}`,
      hint: "Times only go up, so the oldest pings are always at the <strong>front</strong> of a queue. On each ping, add <code>t</code> at the back, then advance a <code>head</code> index past every time smaller than <code>t - 3000</code>. The answer is the queue size.",
      explanation: "<p>Each ping is added once and skipped over at most once, so the total work over n pings is O(n) - <strong>amortised O(1)</strong> per ping. This \"sliding window over a queue\" pattern powers API rate limits (\"100 requests per minute\") and moving averages on dashboards.</p>",
      forbid: [{ pattern: "\\.shift\\(|\\.filter\\(|\\.splice\\(", message: "Use a queue with a head index - no shift, filter or splice." }],
      tests: [
        { label: "classic example", code: "const rc = new RecentCounter(); return [rc.ping(1), rc.ping(100), rc.ping(3001), rc.ping(3002)];", expected: [1, 2, 3, 3] },
        { label: "first ping", code: "return new RecentCounter().ping(5000);", expected: 1 },
        { label: "window boundary is inclusive", code: "const rc = new RecentCounter(); rc.ping(1000); return rc.ping(4000);", expected: 2 },
        { label: "everything expires", code: "const rc = new RecentCounter(); rc.ping(1); rc.ping(2); rc.ping(3); return rc.ping(10000);", expected: 1 },
        { label: "separate counters are independent", code: "const a = new RecentCounter(), b = new RecentCounter(); a.ping(1); a.ping(2); return b.ping(3);", expected: 1 },
        { label: "100,000 pings stay fast", code: "const rc = new RecentCounter(); let last = 0; for (let t = 1; t <= 100000; t++) last = rc.ping(t * 10); return last;", expected: 301, maxMs: 1500 }
      ]
    }
  ],

  takeaways: [
    "<strong>Stack = LIFO</strong> (pile of plates): <code>push</code>/<code>pop</code> at the end of an array, both O(1). Think undo, brackets, call stack.",
    "<strong>Queue = FIFO</strong> (coffee line): use a <strong>head index</strong> for O(1) dequeue - <code>shift()</code> is O(n).",
    "A <strong>linked list</strong> is nodes joined by <code>next</code> pointers: O(1) insert/delete by re-pointing arrows, but O(n) to reach index <em>i</em>.",
    "When re-linking nodes, <strong>save <code>next</code> first</strong> and always test the empty, one-node, head and tail cases.",
    "<strong>Fast/slow pointers</strong> find the middle in one pass and detect cycles in O(1) memory (Floyd).",
    "Pick by the clue: \"most recent\" &rarr; stack, \"in arrival order\" &rarr; queue, \"lots of inserts at the front\" &rarr; linked list."
  ]
});
