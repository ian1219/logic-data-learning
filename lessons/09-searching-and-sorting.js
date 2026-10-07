LDL.registerLesson({
  id: "09",
  title: "Searching & Sorting",
  lang: "js",
  minutes: 90,
  goal: "Find things fast and put things in order. Binary search and the classic sorts are the most-asked whiteboard questions - and they train you to reason about loops, indexes and speed.",

  analogy: `
<p>Play "guess my number between 1 and 100". A beginner guesses 1, 2, 3, 4... and may need 100 tries. A smart player
always guesses the <strong>middle</strong>: "50?" - "higher" - "75?" - "lower" - "62?"... Every answer throws away half
of the remaining numbers, so you <strong>never need more than 7 guesses</strong>. That is binary search.</p>
<p>Sorting is like arranging a hand of playing cards. You can pick up one card at a time and slide it into place
(insertion sort), split the deck with a friend, sort both halves and merge them (merge sort), or pick a "middle" card and
throw smaller ones left and bigger ones right (quick sort). Same result, very different amounts of work.</p>`,

  objectives: [
    "Write <strong>linear search</strong> and explain when it is the only option",
    "Write <strong>binary search</strong> (loop and recursive) and trace <code>lo</code> / <code>mid</code> / <code>hi</code> by hand",
    "Find the <strong>first occurrence</strong> of a value in sorted data with duplicates",
    "Implement bubble, selection, insertion, merge and quick sort - and compare their speed",
    "Explain <strong>stability</strong> and sort records by several keys with a JavaScript comparator",
    "Avoid the <code>[10, 9, 1].sort()</code> trap and in-place mutation bugs"
  ],

  realWorld: `
<ul>
  <li><strong>Search boxes and autocomplete:</strong> looking up a customer ID or product code in a sorted list or index.</li>
  <li><strong>Reports and leaderboards:</strong> "top 10 sales reps by revenue, ties by name" is a multi-key sort.</li>
  <li><strong>Database indexes:</strong> an index keeps data sorted (as a B-tree) so queries can binary-search instead of scanning millions of rows.</li>
  <li><strong>Debugging with <code>git bisect</code>:</strong> binary search over commits to find the one that broke the build.</li>
  <li><strong>Exams and interviews:</strong> "trace this sort", "what is the array after pass 2?" and "write binary search" are classics.</li>
</ul>`,

  sections: [
    {
      title: "Linear search: check every item",
      html: `
<p><strong>What:</strong> <strong>linear search</strong> looks at the items one by one, from left to right, until it finds the target.</p>
<p><strong>Why:</strong> it works on <em>any</em> list - sorted or not. When the data is unsorted, it is your only option.</p>
<pre><code class="language-javascript">function linearSearch(arr, target) {
  for (let i = 0; i &lt; arr.length; i++) {
    if (arr[i] === target) return i;  // found it: return the position
  }
  return -1;                          // looked everywhere: not there
}

linearSearch([42, 17, 8, 99], 8);    // 2
linearSearch([42, 17, 8, 99], 5);    // -1</code></pre>
<p>The <strong>worst case</strong> (target missing or last) checks all <code>n</code> items. We say it takes <strong>O(n)</strong> time:
double the data, double the work. (Lesson 11 explains this "Big-O" notation in detail.)</p>
<div class="callout note"><p><code>arr.indexOf(x)</code>, <code>arr.includes(x)</code> and <code>arr.find(...)</code> are linear searches built into JavaScript. Handy - but they are still O(n).</p></div>`
    },
    {
      title: "Binary search: halve the problem every step",
      html: `
<p><strong>What:</strong> <strong>binary search</strong> works on <strong>sorted</strong> data. It looks at the middle item and decides which half
<em>cannot</em> contain the target, then throws that half away.</p>
<p><strong>How:</strong> keep two markers, <code>lo</code> (start of the range still possible) and <code>hi</code> (end of it).</p>
<pre><code class="language-javascript">function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;          // the whole array is possible
  while (lo &lt;= hi) {                         // range not empty yet
    const mid = Math.floor((lo + hi) / 2);   // middle position
    if (arr[mid] === target) return mid;     // lucky: found it
    if (arr[mid] &lt; target) lo = mid + 1;     // too small: keep the RIGHT half
    else hi = mid - 1;                       // too big: keep the LEFT half
  }
  return -1;                                 // range is empty: not there
}</code></pre>
<p><strong>Example:</strong> find <code>23</code> in <code>[2, 5, 8, 12, 16, 23, 38, 56, 72, 91]</code> (indexes 0-9).</p>
<table>
  <tr><th>Step</th><th>lo</th><th>hi</th><th>mid</th><th>arr[mid]</th><th>Decision</th></tr>
  <tr><td>1</td><td>0</td><td>9</td><td>4</td><td>16</td><td>16 &lt; 23 &rarr; go right: <code>lo = 5</code></td></tr>
  <tr><td>2</td><td>5</td><td>9</td><td>7</td><td>56</td><td>56 &gt; 23 &rarr; go left: <code>hi = 6</code></td></tr>
  <tr><td>3</td><td>5</td><td>6</td><td>5</td><td>23</td><td>found at index <strong>5</strong></td></tr>
</table>
<p>3 comparisons instead of 6. With 1,000,000 items: about <strong>20</strong> instead of 1,000,000.</p>
<div class="callout key"><p>Binary search only works on <strong>sorted</strong> data. On unsorted data it does not crash - it silently gives wrong answers.</p></div>`
    },
    {
      title: "Binary search variants: first occurrence",
      html: `
<p>With duplicates, plain binary search returns <em>some</em> matching index, not necessarily the first one.
Exams often ask for the <strong>leftmost</strong> one (e.g. "the first log entry at 09:00").</p>
<p><strong>Trick:</strong> when you find the target, write it down and keep searching to the <strong>left</strong>.</p>
<pre><code class="language-javascript">let answer = -1;
while (lo &lt;= hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (arr[mid] === target) { answer = mid; hi = mid - 1; }  // remember, go left
  else if (arr[mid] &lt; target) lo = mid + 1;
  else hi = mid - 1;
}
return answer;</code></pre>
<table>
  <tr><th>Step</th><th>lo</th><th>hi</th><th>mid</th><th>arr[mid] in <code>[1, 2, 2, 2, 3]</code>, target 2</th><th>answer</th></tr>
  <tr><td>1</td><td>0</td><td>4</td><td>2</td><td>2 = target &rarr; go left</td><td>2</td></tr>
  <tr><td>2</td><td>0</td><td>1</td><td>0</td><td>1 &lt; 2 &rarr; go right</td><td>2</td></tr>
  <tr><td>3</td><td>1</td><td>1</td><td>1</td><td>2 = target &rarr; go left</td><td><strong>1</strong></td></tr>
</table>
<div class="callout warn"><p>Forgetting the <code>+ 1</code> / <code>- 1</code> when moving <code>lo</code> or <code>hi</code> is the #1 binary search bug: the range never shrinks and the loop runs forever.</p></div>`
    },
    {
      title: "Sorting in JavaScript (and its big trap)",
      html: `
<p><strong>Why sort?</strong> Sorted data makes many questions easy: binary search, "top 10", finding duplicates (they end up next to each other), merging lists.</p>
<p>JavaScript has a built-in <code>arr.sort()</code>. But <strong>without a comparator it compares items as text</strong>:</p>
<pre><code class="language-javascript">[10, 9, 1, 100].sort();                 // [1, 10, 100, 9]   - "10" comes before "9" alphabetically!
[10, 9, 1, 100].sort((a, b) =&gt; a - b);  // [1, 9, 10, 100]   - ascending
[10, 9, 1, 100].sort((a, b) =&gt; b - a);  // [100, 10, 9, 1]   - descending</code></pre>
<p>A <strong>comparator</strong> is a function <code>(a, b)</code> that returns:</p>
<table>
  <tr><th>Return value</th><th>Meaning</th></tr>
  <tr><td>negative</td><td><code>a</code> goes first</td></tr>
  <tr><td>positive</td><td><code>b</code> goes first</td></tr>
  <tr><td>0</td><td>they are equal - keep their current order</td></tr>
</table>
<div class="callout warn"><p><code>sort()</code> changes the original array (it sorts <strong>in place</strong>). To keep the original, copy first: <code>[...arr].sort(...)</code> or use <code>arr.toSorted(...)</code>.</p></div>`
    },
    {
      title: "The simple sorts: bubble, selection, insertion",
      html: `
<p>These three are slow on big data (O(n&sup2;): double the data, four times the work) but they are easy to trace, so exams love them.</p>
<p><strong>Bubble sort</strong> - walk through the array and swap any neighbours that are in the wrong order. After each pass the
largest remaining item has "bubbled" to the end. Stop when a pass makes no swaps.</p>
<table>
  <tr><th>Pass</th><th>Array after the pass</th><th>Swaps</th></tr>
  <tr><td>start</td><td><code>[5, 1, 4, 2, 8]</code></td><td></td></tr>
  <tr><td>1</td><td><code>[1, 4, 2, 5, 8]</code></td><td>3</td></tr>
  <tr><td>2</td><td><code>[1, 2, 4, 5, 8]</code></td><td>1</td></tr>
  <tr><td>3</td><td><code>[1, 2, 4, 5, 8]</code></td><td>0 &rarr; stop early</td></tr>
</table>
<p><strong>Selection sort</strong> - find the smallest item and swap it to the front; then the smallest of the rest into position 1; and so on.</p>
<table>
  <tr><th>i</th><th>Smallest of <code>arr[i..]</code></th><th>Array after the swap</th></tr>
  <tr><td>start</td><td></td><td><code>[64, 25, 12, 22, 11]</code></td></tr>
  <tr><td>0</td><td>11</td><td><code>[11, 25, 12, 22, 64]</code></td></tr>
  <tr><td>1</td><td>12</td><td><code>[11, 12, 25, 22, 64]</code></td></tr>
  <tr><td>2</td><td>22</td><td><code>[11, 12, 22, 25, 64]</code></td></tr>
  <tr><td>3</td><td>25</td><td><code>[11, 12, 22, 25, 64]</code> (done)</td></tr>
</table>
<p><strong>Insertion sort</strong> - the playing-cards method: take the next item and shift bigger items one step right until its slot appears.</p>
<pre><code class="language-javascript">for (let i = 1; i &lt; a.length; i++) {
  const key = a[i];                 // the "card" we pick up
  let j = i - 1;
  while (j &gt;= 0 &amp;&amp; a[j] &gt; key) {   // bigger cards shift right
    a[j + 1] = a[j];
    j--;
  }
  a[j + 1] = key;                   // drop the card into the gap
}</code></pre>
<table>
  <tr><th>Insert</th><th>Array after inserting</th></tr>
  <tr><td>start</td><td><code>[5, 2, 4, 6, 1, 3]</code></td></tr>
  <tr><td>2</td><td><code>[2, 5, 4, 6, 1, 3]</code></td></tr>
  <tr><td>4</td><td><code>[2, 4, 5, 6, 1, 3]</code></td></tr>
  <tr><td>6</td><td><code>[2, 4, 5, 6, 1, 3]</code> (already in place)</td></tr>
  <tr><td>1</td><td><code>[1, 2, 4, 5, 6, 3]</code></td></tr>
  <tr><td>3</td><td><code>[1, 2, 3, 4, 5, 6]</code></td></tr>
</table>
<div class="callout tip"><p>Insertion sort is <strong>very fast on nearly sorted data</strong> (almost no shifting). Real-world sorts such as Timsort use it for small chunks.</p></div>`
    },
    {
      title: "Merge sort: divide, conquer, merge",
      html: `
<p><strong>What:</strong> split the array in half, sort each half (by calling merge sort again - <strong>recursion</strong>), then <strong>merge</strong> the two sorted halves.</p>
<p><strong>Merging</strong> two sorted lists is easy: compare the two front items, take the smaller one, repeat. Like merging two sorted piles of exam papers.</p>
<pre>
[38, 27, 43, 3, 9, 82, 10]
[38, 27, 43]          [3, 9, 82, 10]          split
[38] [27, 43]         [3, 9] [82, 10]         split
[38] [27] [43]        [3] [9] [82] [10]       one item = already sorted
[38] [27, 43]         [3, 9] [10, 82]         merge
[27, 38, 43]          [3, 9, 10, 82]          merge
[3, 9, 10, 27, 38, 43, 82]                    merge
</pre>
<p><strong>Why it is fast:</strong> halving gives about log&#8322;(n) levels (20 for a million items), and each level does n units of merge work.
Total: <strong>O(n log n)</strong>, every time. The cost: it needs extra memory for the merged arrays.</p>
<div class="callout analogy"><p>A teacher with 200 exam papers gives half to an assistant. Each sorts their pile (maybe splitting again), then they merge the two piles by repeatedly taking the lower name off the top.</p></div>`
    },
    {
      title: "Quick sort: partition around a pivot",
      html: `
<p><strong>What:</strong> pick one item as the <strong>pivot</strong>. Put smaller items to its left and bigger items to its right
(<strong>partitioning</strong>). The pivot is now in its final place. Repeat on both sides.</p>
<pre>
[10, 80, 30, 90, 40, 50, 70]        pivot = 90 (middle item)
less = [10, 80, 30, 40, 50, 70]    equal = [90]    greater = []
  sort less:  pivot = 40 (its middle item)
  less = [10, 30]   equal = [40]   greater = [80, 50, 70]
    sort greater: pivot = 50 ... and so on
result: [10, 30, 40, 50, 70, 80, 90]
</pre>
<pre><code class="language-javascript">function quickSort(arr) {
  if (arr.length &lt;= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const less = arr.filter(x =&gt; x &lt; pivot);
  const equal = arr.filter(x =&gt; x === pivot);
  const greater = arr.filter(x =&gt; x &gt; pivot);
  return [...quickSort(less), ...equal, ...quickSort(greater)];
}</code></pre>
<p>On average quick sort is O(n log n) and very fast in practice. But if the pivot is always the smallest or largest item
(e.g. "always take the first item" on already-sorted data), every split is lopsided and it degrades to <strong>O(n&sup2;)</strong>.</p>
<div class="callout tip"><p>Choose the <strong>middle</strong> or a <strong>random</strong> item as the pivot. Bonus idea - <strong>quickselect</strong>: to find the k-th smallest, partition once and continue only into the side that contains position k.</p></div>`
    },
    {
      title: "Stability and the comparison table",
      html: `
<p>A sort is <strong>stable</strong> if items that are "equal" keep their original order.</p>
<pre>
input, sort by score:  [Ann 90, Bob 85, Cid 90]
stable:                [Bob 85, Ann 90, Cid 90]   Ann stays before Cid
unstable may give:     [Bob 85, Cid 90, Ann 90]
</pre>
<p>It matters when your data already has a meaningful order (e.g. sorted by date) and you sort by something else. JavaScript's
<code>sort</code> is guaranteed stable since ES2019. To sort by several keys at once, chain them with <code>||</code>:</p>
<pre><code class="language-javascript">// score high-&gt;low; if scores tie (difference 0), compare names A-&gt;Z
rows.sort((a, b) =&gt; b.score - a.score || a.name.localeCompare(b.name));</code></pre>
<table>
  <tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Extra memory</th><th>Stable?</th></tr>
  <tr><td>Linear search</td><td>O(1)</td><td>O(n)</td><td>O(n)</td><td>O(1)</td><td>-</td></tr>
  <tr><td>Binary search</td><td>O(1)</td><td>O(log n)</td><td>O(log n)</td><td>O(1)</td><td>-</td></tr>
  <tr><td>Bubble sort</td><td>O(n)</td><td>O(n&sup2;)</td><td>O(n&sup2;)</td><td>O(1)</td><td>Yes</td></tr>
  <tr><td>Selection sort</td><td>O(n&sup2;)</td><td>O(n&sup2;)</td><td>O(n&sup2;)</td><td>O(1)</td><td>No</td></tr>
  <tr><td>Insertion sort</td><td>O(n)</td><td>O(n&sup2;)</td><td>O(n&sup2;)</td><td>O(1)</td><td>Yes</td></tr>
  <tr><td>Merge sort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>Yes</td></tr>
  <tr><td>Quick sort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n&sup2;)</td><td>O(log n)</td><td>No (usual version)</td></tr>
  <tr><td>JS <code>arr.sort</code> (Timsort in V8)</td><td>O(n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>Yes</td></tr>
</table>
<div class="callout work"><p>At work you will almost always call the built-in sort with a comparator. Knowing the algorithms helps you
answer exam questions, explain why a report is slow, and pick the right tool (e.g. insertion sort for nearly sorted streams).</p></div>`
    }
  ],

  examples: [
    {
      title: "Linear search: find an employee by ID",
      code: `const employees = [
  { id: 1042, name: "Priya" },
  { id: 2210, name: "Marcus" },
  { id: 1777, name: "Elena" },
  { id: 3051, name: "Tom" }
];

function findById(list, id) {
  let checks = 0;
  for (let i = 0; i < list.length; i++) {
    checks++;
    if (list[i].id === id) {
      console.log("Found", list[i].name, "after", checks, "checks");
      return i;
    }
  }
  console.log("Not found after", checks, "checks");
  return -1;
}

findById(employees, 1777);
findById(employees, 9999);`,
      explain: `
<ol>
  <li>The list is not sorted by ID, so we must check items one by one.</li>
  <li>Elena is third, so it takes 3 checks. A missing ID costs a check of <strong>every</strong> item - the worst case.</li>
  <li><strong>Try it:</strong> search for <code>1042</code> (best case: 1 check).</li>
</ol>`
    },
    {
      title: "Binary search with a trace (sorted exam scores)",
      code: `const scores = [41, 55, 62, 68, 70, 74, 79, 83, 88, 95];
const target = 79;

let lo = 0, hi = scores.length - 1, step = 0;
while (lo <= hi) {
  step++;
  const mid = Math.floor((lo + hi) / 2);
  console.log("step " + step + ": lo=" + lo + " hi=" + hi + " mid=" + mid + " value=" + scores[mid]);
  if (scores[mid] === target) {
    console.log("Found " + target + " at index " + mid);
    break;
  }
  if (scores[mid] < target) lo = mid + 1;
  else hi = mid - 1;
}`,
      explain: `
<table>
  <tr><th>Step</th><th>lo</th><th>hi</th><th>mid</th><th>value</th><th>Decision</th></tr>
  <tr><td>1</td><td>0</td><td>9</td><td>4</td><td>70</td><td>70 &lt; 79 &rarr; lo = 5</td></tr>
  <tr><td>2</td><td>5</td><td>9</td><td>7</td><td>83</td><td>83 &gt; 79 &rarr; hi = 6</td></tr>
  <tr><td>3</td><td>5</td><td>6</td><td>5</td><td>74</td><td>74 &lt; 79 &rarr; lo = 6</td></tr>
  <tr><td>4</td><td>6</td><td>6</td><td>6</td><td>79</td><td>found</td></tr>
</table>
<p><strong>Try it:</strong> set <code>target = 60</code> (not in the list) and watch <code>lo</code> pass <code>hi</code> so the loop ends.</p>`
    },
    {
      title: "The guessing game: 1 to 100 in at most 7 guesses",
      code: `const secret = 73;
let lo = 1, hi = 100, guesses = 0;

while (lo <= hi) {
  const guess = Math.floor((lo + hi) / 2);
  guesses++;
  if (guess === secret) {
    console.log("Guess " + guesses + ": " + guess + " - correct!");
    break;
  }
  if (guess < secret) {
    console.log("Guess " + guesses + ": " + guess + " - higher");
    lo = guess + 1;
  } else {
    console.log("Guess " + guesses + ": " + guess + " - lower");
    hi = guess - 1;
  }
}`,
      explain: `
<ol>
  <li>Each guess is the middle of the numbers still possible, so each answer removes half of them.</li>
  <li>100 &rarr; 50 &rarr; 25 &rarr; 12 &rarr; 6 &rarr; 3 &rarr; 1: at most <strong>7</strong> guesses for any secret.</li>
  <li><strong>Try it:</strong> change <code>hi</code> to <code>1000000</code> and any secret - you will never need more than 20 guesses.</li>
</ol>`
    },
    {
      title: "See the growth: linear vs binary comparisons",
      code: `function countLinear(arr, target) {
  let c = 0;
  for (let i = 0; i < arr.length; i++) { c++; if (arr[i] === target) break; }
  return c;
}
function countBinary(arr, target) {
  let c = 0, lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    c++;
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) break;
    if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return c;
}

for (const n of [10, 1000, 100000, 1000000]) {
  const data = Array.from({ length: n }, (_, i) => i);
  const target = n - 1;   // worst-ish case: the last item
  console.log("n = " + n + ": linear " + countLinear(data, target) + " checks, binary " + countBinary(data, target) + " checks");
}`,
      explain: `
<p>Linear search grows <strong>in step with</strong> n. Binary search grows by about <strong>1 extra check each time n doubles</strong>.</p>
<table>
  <tr><th>n</th><th>linear</th><th>binary</th></tr>
  <tr><td>10</td><td>10</td><td>4</td></tr>
  <tr><td>1,000,000</td><td>1,000,000</td><td>20</td></tr>
</table>
<p><strong>Try it:</strong> search for <code>0</code> instead - linear wins that one with 1 check (best case).</p>`
    },
    {
      title: "The default sort() trap and comparators (product prices)",
      code: `const prices = [10, 9, 1, 100, 25];

console.log("default:   ", prices.slice().sort());
console.log("ascending: ", prices.slice().sort((a, b) => a - b));
console.log("descending:", prices.slice().sort((a, b) => b - a));
console.log("original untouched:", prices);

const names = ["bob", "Alice", "carol", "Dave"];
console.log("names default:     ", names.slice().sort());
console.log("names localeCompare:", names.slice().sort((a, b) => a.localeCompare(b)));`,
      explain: `
<ol>
  <li>Without a comparator, numbers are turned into text, and <code>"100"</code> comes before <code>"25"</code> because <code>"1" &lt; "2"</code>.</li>
  <li><code>a - b</code> is negative when <code>a</code> is smaller, so smaller items go first.</li>
  <li><code>slice()</code> copies the array, so <code>prices</code> itself is not changed.</li>
  <li>Default text sort also puts ALL capital letters before lower case (Alice, Dave, bob, carol). <code>localeCompare</code> sorts like a dictionary.</li>
</ol>`
    },
    {
      title: "Bubble sort, pass by pass",
      code: `const arr = [5, 1, 4, 2, 8];
console.log("start: ", arr.join(", "));

for (let end = arr.length - 1; end > 0; end--) {
  let swaps = 0;
  for (let j = 0; j < end; j++) {
    if (arr[j] > arr[j + 1]) {
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];   // swap neighbours
      swaps++;
    }
  }
  console.log("pass:  ", arr.join(", "), " (" + swaps + " swaps)");
  if (swaps === 0) { console.log("No swaps - already sorted, stop early."); break; }
}`,
      explain: `
<table>
  <tr><th>Pass</th><th>Array after</th><th>What happened</th></tr>
  <tr><td>1</td><td>1, 4, 2, 5, 8</td><td>5 bubbled past 1, 4, 2; 8 is the largest so it stays last</td></tr>
  <tr><td>2</td><td>1, 2, 4, 5, 8</td><td>4 swapped with 2</td></tr>
  <tr><td>3</td><td>1, 2, 4, 5, 8</td><td>no swaps &rarr; stop</td></tr>
</table>
<p><strong>Try it:</strong> start from <code>[8, 5, 4, 2, 1]</code> (reversed) and count the swaps - that is the worst case.</p>`
    },
    {
      title: "Insertion sort on nearly sorted timestamps",
      code: `// Log events arrive almost in time order - one is late
const times = ["09:00", "09:05", "09:12", "09:07", "09:20", "09:31"];
let shifts = 0;

for (let i = 1; i < times.length; i++) {
  const key = times[i];
  let j = i - 1;
  while (j >= 0 && times[j] > key) {
    times[j + 1] = times[j];   // shift the later time right
    j--;
    shifts++;
  }
  times[j + 1] = key;
}
console.log(times.join(" "));
console.log("Total shifts:", shifts);`,
      explain: `
<ol>
  <li>Strings like <code>"09:07"</code> compare correctly as text because they have the same format.</li>
  <li>Only <code>"09:07"</code> is out of place, so the whole sort needs just <strong>1 shift</strong>.</li>
  <li>That is why insertion sort is the best choice for nearly sorted data: close to O(n).</li>
  <li><strong>Try it:</strong> reverse the array first and see how many shifts it needs.</li>
</ol>`
    },
    {
      title: "Merge sort with an indented trace",
      code: `function mergeSort(items, depth) {
  const pad = "  ".repeat(depth);
  if (items.length <= 1) return items;
  const mid = Math.floor(items.length / 2);
  console.log(pad + "split " + items.join(",") + " -> " + items.slice(0, mid).join(",") + " | " + items.slice(mid).join(","));
  const left = mergeSort(items.slice(0, mid), depth + 1);
  const right = mergeSort(items.slice(mid), depth + 1);
  const merged = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    merged.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  const result = merged.concat(left.slice(i), right.slice(j));
  console.log(pad + "merge -> " + result.join(","));
  return result;
}

mergeSort([38, 27, 43, 3, 9, 82, 10], 0);`,
      explain: `
<ol>
  <li>Indentation shows the recursion depth: deeper lines are smaller sub-problems.</li>
  <li>Single items are returned straight away (base case) - they are already sorted.</li>
  <li>Each merge compares the fronts of two sorted lists and takes the smaller one.</li>
  <li><strong>Try it:</strong> add a counter for comparisons and test 8, 16, 32 items - it grows like n log n.</li>
</ol>`
    },
    {
      title: "Quick sort: watch the pivots",
      code: `function quickSort(items, depth) {
  if (items.length <= 1) return items;
  const pivot = items[Math.floor(items.length / 2)];
  const less = items.filter(x => x < pivot);
  const equal = items.filter(x => x === pivot);
  const greater = items.filter(x => x > pivot);
  console.log("  ".repeat(depth) + "pivot " + pivot + ": [" + less.join(",") + "] [" + equal.join(",") + "] [" + greater.join(",") + "]");
  return quickSort(less, depth + 1).concat(equal, quickSort(greater, depth + 1));
}

console.log("result:", quickSort([10, 80, 30, 90, 40, 50, 70], 0).join(", "));`,
      explain: `
<ol>
  <li>Each line shows one partition: everything smaller than the pivot, the pivot (and its duplicates), everything bigger.</li>
  <li>After partitioning, the pivot never moves again - it is in its final place.</li>
  <li><strong>Try it:</strong> change the pivot to <code>items[0]</code> and sort <code>[1, 2, 3, 4, 5, 6, 7]</code>. Every split is lopsided - that is the O(n&sup2;) worst case.</li>
</ol>`
    },
    {
      title: "Leaderboard: multi-key, stable sort of employee records",
      code: `const sales = [
  { name: "Zoe",   region: "North", revenue: 9000 },
  { name: "Amir",  region: "South", revenue: 12000 },
  { name: "Bea",   region: "North", revenue: 9000 },
  { name: "Carlos",region: "South", revenue: 7000 }
];

// Revenue high -> low; ties broken by name A -> Z
const board = [...sales].sort((a, b) => b.revenue - a.revenue || a.name.localeCompare(b.name));
board.forEach((r, i) => console.log((i + 1) + ". " + r.name + " " + r.revenue));

// Stability: sort by region only - people keep their original order inside each region
const byRegion = [...sales].sort((a, b) => a.region.localeCompare(b.region));
console.log("By region:", byRegion.map(r => r.region + "/" + r.name).join(", "));`,
      explain: `
<ol>
  <li><code>b.revenue - a.revenue</code> puts bigger revenue first. When it is <code>0</code> (a tie), <code>||</code> moves on to the name comparison.</li>
  <li><code>[...sales]</code> copies the array, so the original order is kept for the second sort.</li>
  <li>Sorting by region keeps Zoe before Bea (their original order) because JS sort is <strong>stable</strong>.</li>
  <li><strong>Try it:</strong> add a third key (region) as another <code>||</code> step.</li>
</ol>`
    }
  ],

  pitfalls: [
    "<code>[10, 9, 1].sort()</code> gives <code>[1, 10, 9]</code> - without a comparator JavaScript sorts numbers as <strong>text</strong>. Use <code>(a, b) =&gt; a - b</code>.",
    "<code>sort()</code> changes the original array <strong>and</strong> returns it. Copy first (<code>[...arr].sort(...)</code> or <code>arr.toSorted(...)</code>) when the caller's data must stay the same.",
    "Binary search on <strong>unsorted</strong> data silently returns wrong answers. Sort first (or use linear search).",
    "Forgetting <code>+ 1</code> / <code>- 1</code> when moving <code>lo</code> / <code>hi</code> causes infinite loops. Mixing <code>while (lo &lt; hi)</code> and <code>while (lo &lt;= hi)</code> templates causes off-by-one bugs.",
    "<code>(lo + hi) / 2</code> is a decimal in JavaScript - wrap it in <code>Math.floor</code>. (In Java/C, <code>lo + hi</code> can overflow; write <code>lo + (hi - lo) / 2</code>.)",
    "In the merge step use <code>&lt;=</code> (take from the left half on ties) or merge sort stops being stable.",
    "Quick sort with the first item as pivot is O(n&sup2;) - and recurses very deeply - on already sorted input."
  ],

  quiz: [
    {
      q: "What does this print?",
      code: `const nums = [10, 9, 1, 100];
console.log(nums.sort().join(","));`,
      options: ["1,9,10,100", "1,10,100,9", "100,10,9,1", "10,9,1,100"],
      answer: 1,
      output: "1,10,100,9",
      explain: "<p>Without a comparator, <code>sort()</code> compares items as <strong>text</strong>. <code>\"10\"</code> and <code>\"100\"</code> start with <code>\"1\"</code>, so they come before <code>\"9\"</code>. Fix: <code>sort((a, b) =&gt; a - b)</code>.</p>"
    },
    {
      q: "A sorted list has 1,000,000 customer IDs. About how many comparisons does binary search need in the worst case?",
      options: ["About 20", "About 1,000", "About 500,000", "About 1,000,000"],
      answer: 0,
      explain: "<p>Each comparison halves the range: 1,000,000 &rarr; 500,000 &rarr; ... &rarr; 1 takes about 20 halvings, because 2<sup>20</sup> &asymp; 1,000,000.</p>"
    },
    {
      q: "How many loop steps does this binary search take?",
      code: `const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
let lo = 0, hi = arr.length - 1, steps = 0;
while (lo <= hi) {
  steps++;
  const mid = Math.floor((lo + hi) / 2);
  if (arr[mid] === 7) break;
  if (arr[mid] < 7) lo = mid + 1; else hi = mid - 1;
}
console.log(steps);`,
      options: ["1", "3", "4", "7"],
      answer: 2,
      output: "4",
      explain: "<p>Trace it: mid=7 (value 8) &rarr; hi=6; mid=3 (value 4) &rarr; lo=4; mid=5 (value 6) &rarr; lo=6; mid=6 (value 7) &rarr; found. That is <strong>4</strong> steps.</p>"
    },
    {
      q: "What is the array after the <strong>first pass</strong> of bubble sort?",
      code: `const a = [4, 3, 2, 1];
for (let j = 0; j < a.length - 1; j++) {
  if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
}
console.log(a.join(","));`,
      options: ["1,2,3,4", "3,4,2,1", "3,2,1,4", "1,4,3,2"],
      answer: 2,
      output: "3,2,1,4",
      explain: "<p>One pass carries the largest item (4) all the way to the end by swapping neighbours: 3,4,2,1 &rarr; 3,2,4,1 &rarr; 3,2,1,4. The rest is not sorted yet.</p>"
    },
    {
      q: "New orders arrive <strong>almost</strong> in order - only a few are slightly late. Which simple sort is the best fit?",
      options: ["Selection sort", "Insertion sort", "Quick sort with the first item as pivot", "Bubble sort without early stop"],
      answer: 1,
      explain: "<p>Insertion sort only shifts items that are out of place, so nearly sorted data costs close to O(n). Selection sort always does ~n&sup2;/2 comparisons, and first-item quick sort hits its worst case on sorted data.</p>"
    },
    {
      q: "Which sort is <strong>always</strong> O(n log n) and <strong>stable</strong>?",
      options: ["Quick sort", "Selection sort", "Merge sort", "Bubble sort"],
      answer: 2,
      explain: "<p>Merge sort always splits evenly (log n levels) and merges in O(n) per level. With <code>&lt;=</code> in the merge it keeps equal items in order. Quick sort can hit O(n&sup2;); selection and bubble are O(n&sup2;).</p>"
    },
    {
      q: "What does this print?",
      code: `const team = [{ n: "Ann", s: 90 }, { n: "Bob", s: 85 }, { n: "Cid", s: 90 }];
const r = [...team].sort((a, b) => b.s - a.s);
console.log(r.map(x => x.n).join(" "));`,
      options: ["Ann Cid Bob", "Cid Ann Bob", "Bob Ann Cid", "Ann Bob Cid"],
      answer: 0,
      output: "Ann Cid Bob",
      explain: "<p>Highest score first. Ann and Cid tie on 90, and because JavaScript's sort is <strong>stable</strong>, Ann stays before Cid (their original order). Bob (85) comes last.</p>"
    }
  ],

  interview: [
    { q: "Why does binary search need sorted data, and how fast is it?",
      a: "<p>Comparing with the middle tells you which half <em>cannot</em> contain the target - only true when the data is ordered. The range halves each step, so it takes about log&#8322;(n) steps: <strong>O(log n)</strong>. A million items &rarr; about 20 comparisons.</p>" },
    { q: "Merge sort or quick sort - which would you choose?",
      a: "<p>Merge sort: guaranteed O(n log n) and stable, but needs O(n) extra memory; great for linked lists and huge files. Quick sort: usually faster in practice (in place, cache friendly) but O(n&sup2;) in the worst case and not stable; use a random or middle pivot to avoid the worst case.</p>" },
    { q: "What does \"stable sort\" mean? Give an example where it matters.",
      a: "<p>Equal items keep their original relative order. Example: a list of transactions sorted by date, then sorted by customer - a stable sort keeps each customer's transactions in date order.</p>" },
    { q: "What does <code>[10, 9, 1].sort()</code> return in JavaScript, and why?",
      a: "<p><code>[1, 10, 9]</code>. Without a comparator, items are converted to strings and compared character by character, so <code>\"10\" &lt; \"9\"</code>. Use <code>arr.sort((a, b) =&gt; a - b)</code>.</p>" },
    { q: "When is insertion sort a good choice even though it is O(n&sup2;)?",
      a: "<p>For small arrays and nearly sorted data: it runs in O(n + number of out-of-place pairs), uses O(1) memory, is stable and has tiny overhead. Timsort uses it for short runs.</p>" },
    { q: "How do you find the k-th smallest element faster than sorting?",
      a: "<p><strong>Quickselect:</strong> partition around a pivot like quick sort, then continue only into the side that contains position k-1. Work is n + n/2 + n/4 + ... &asymp; 2n, so O(n) on average. A heap of size k gives O(n log k).</p>" }
  ],

  exercises: [
    {
      id: "is-sorted",
      title: "isSorted (warm-up)",
      difficulty: "easy",
      prompt: "<p>Return <code>true</code> if the numbers are in <strong>ascending</strong> order (equal neighbours are fine), otherwise <code>false</code>. Binary search needs this to be true!</p><p><code>isSorted([1, 2, 2, 5]) &rarr; true</code> &nbsp; <code>isSorted([3, 1, 2]) &rarr; false</code> &nbsp; <code>isSorted([]) &rarr; true</code></p>",
      starter: `function isSorted(arr) {
  // your code here
}`,
      solution: `function isSorted(arr) {
  // Compare each item with the one after it.
  // One pair in the wrong order is enough to say "not sorted".
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;  // no bad pair found (also true for 0 or 1 items)
}`,
      hint: "Loop i from 0 to arr.length - 2 and compare arr[i] with arr[i + 1]. If any pair is in the wrong order, return false straight away. If the loop finishes, return true.",
      forbid: [{ pattern: "\\.(sort|toSorted)\\(", message: "Check the neighbours with a loop - sorting a copy just to compare is O(n log n)." }],
      tests: [
        { expr: "isSorted([1, 2, 2, 5])", expected: true },
        { expr: "isSorted([3, 1, 2])", expected: false },
        { expr: "isSorted([])", expected: true, label: "empty array" },
        { expr: "isSorted([42])", expected: true, label: "single element" },
        { expr: "isSorted([-5, -2, 0, 3])", expected: true, label: "negatives" },
        { expr: "isSorted([1, 2, 3, 5, 4])", expected: false, label: "only the last pair is wrong" },
        { expr: "isSorted([9, 10, 100])", expected: true, label: "numeric, not text order" }
      ]
    },
    {
      id: "linear-search",
      title: "linearSearch",
      difficulty: "easy",
      prompt: "<p>Return the index of the <strong>first</strong> item equal to <code>target</code>, or <code>-1</code> if it is not in the array. Write the loop yourself.</p><p><code>linearSearch([4, 2, 7, 2], 2) &rarr; 1</code> (the first 2) &nbsp; <code>linearSearch([4, 2, 7], 4) &rarr; 0</code> &nbsp; <code>linearSearch([4, 2, 7], 5) &rarr; -1</code></p>",
      starter: `function linearSearch(arr, target) {
  // your code here
}`,
      solution: `function linearSearch(arr, target) {
  // O(n): check every item until we find it
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
      hint: "Loop i from 0 to arr.length - 1. As soon as arr[i] === target, return i. If the loop finishes without returning, the target is missing: return -1 after the loop.",
      forbid: [{ pattern: "\\.(indexOf|lastIndexOf|includes|find|findIndex|findLast|findLastIndex)\\(", message: "Write the loop yourself - no indexOf / includes / find." }],
      tests: [
        { expr: "linearSearch([4, 2, 7, 2], 2)", expected: 1 },
        { expr: "linearSearch([4, 2, 7], 4)", expected: 0 },
        { expr: "linearSearch([4, 2, 7], 7)", expected: 2 },
        { expr: "linearSearch([4, 2, 7], 5)", expected: -1 },
        { expr: "linearSearch([], 1)", expected: -1, label: "empty array" },
        { expr: "linearSearch([-3, -1, 0], -1)", expected: 1, label: "negatives" }
      ]
    },
    {
      id: "binary-search",
      title: "binarySearch (iterative)",
      difficulty: "easy",
      prompt: "<p><code>arr</code> is sorted ascending with <strong>no duplicates</strong>. Return the index of <code>target</code>, or <code>-1</code>. Use a loop that halves the range each step (O(log n)).</p><p><code>binarySearch([2, 5, 8, 12, 16, 23], 16) &rarr; 4</code> &nbsp; <code>binarySearch([2, 5, 8], 2) &rarr; 0</code> &nbsp; <code>binarySearch([2, 5, 8], 7) &rarr; -1</code></p><p>A hidden test counts how many items you read on a 1,000,000-item array, so a plain scan will not pass.</p>",
      starter: `function binarySearch(arr, target) {
  // your code here
}`,
      solution: `function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;   // target is in the right half
    else hi = mid - 1;                     // target is in the left half
  }
  return -1;  // O(log n) time, O(1) space
}`,
      hint: "Start with lo = 0 and hi = arr.length - 1. While lo <= hi: mid = Math.floor((lo + hi) / 2). Equal: return mid. arr[mid] < target: lo = mid + 1. Otherwise: hi = mid - 1. After the loop return -1.",
      explanation: "<p>The <code>+ 1</code> and <code>- 1</code> matter: <code>mid</code> has already been checked, so the new range must exclude it. Otherwise the range can stop shrinking and the loop never ends.</p>",
      forbid: [{ pattern: "\\.(indexOf|lastIndexOf|includes|find|findIndex|findLast|findLastIndex)\\(", message: "Implement binary search yourself - no indexOf / includes / find." }],
      tests: [
        { expr: "binarySearch([2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23)", expected: 5 },
        { expr: "binarySearch([2, 5, 8, 12, 16, 23], 2)", expected: 0, label: "first element" },
        { expr: "binarySearch([2, 5, 8, 12, 16, 23], 23)", expected: 5, label: "last element" },
        { expr: "binarySearch([2, 5, 8, 12, 16, 23], 7)", expected: -1, label: "missing (between values)" },
        { expr: "binarySearch([2, 5, 8], 100)", expected: -1, label: "missing (too big)" },
        { expr: "binarySearch([], 3)", expected: -1, label: "empty array" },
        { expr: "binarySearch([7], 7)", expected: 0, label: "single element" },
        { expr: "binarySearch([-9, -4, 0, 3], -4)", expected: 1, label: "negatives" },
        {
          label: "uses O(log n) reads on 1,000,000 items (at most 80 array reads)",
          code: `const data = Array.from({ length: 1000000 }, (_, i) => i * 2);
let reads = 0;
const spy = new Proxy(data, { get(t, k) { if (typeof k === "string" && String(Number(k)) === k) reads++; return t[k]; } });
const idx = binarySearch(spy, 777776);
return idx === 388888 && reads <= 80;`,
          expected: true
        }
      ]
    },
    {
      id: "binary-search-recursive",
      title: "binarySearchRecursive",
      difficulty: "medium",
      prompt: "<p>Same job as <code>binarySearch</code>, but <strong>recursive</strong>: the function calls itself on the smaller half. No loops allowed. The default parameters <code>lo</code> and <code>hi</code> describe the range still being searched.</p><p><code>binarySearchRecursive([1, 3, 5, 7], 7) &rarr; 3</code> &nbsp; <code>binarySearchRecursive([1, 3, 5, 7], 4) &rarr; -1</code> &nbsp; <code>binarySearchRecursive([], 4) &rarr; -1</code></p>",
      starter: `function binarySearchRecursive(arr, target, lo = 0, hi = arr.length - 1) {
  // your code here
}`,
      solution: `function binarySearchRecursive(arr, target, lo = 0, hi = arr.length - 1) {
  if (lo > hi) return -1;                       // base case: empty range
  const mid = Math.floor((lo + hi) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, hi);
  return binarySearchRecursive(arr, target, lo, mid - 1);
  // O(log n) time, O(log n) call-stack space
}`,
      hint: "Base case first: if lo > hi the range is empty, return -1. Otherwise compute mid; if it matches return mid; else return binarySearchRecursive(arr, target, mid + 1, hi) or (arr, target, lo, mid - 1). Don't forget the word return in front of the recursive call.",
      explanation: "<p>Every recursive solution needs a <strong>base case</strong> (stop condition) and a step that makes the problem <strong>smaller</strong>. Here the range halves each call, so the call stack is only about log&#8322;(n) deep - roughly 20 calls for a million items.</p>",
      forbid: [
        { pattern: "\\b(for|while)\\b", message: "Use recursion instead of a loop." },
        { pattern: "\\.(indexOf|lastIndexOf|includes|find|findIndex)\\(", message: "Implement the search yourself - no indexOf / includes / find." }
      ],
      tests: [
        { expr: "binarySearchRecursive([1, 3, 5, 7], 7)", expected: 3 },
        { expr: "binarySearchRecursive([1, 3, 5, 7], 1)", expected: 0 },
        { expr: "binarySearchRecursive([1, 3, 5, 7], 4)", expected: -1 },
        { expr: "binarySearchRecursive([], 4)", expected: -1, label: "empty array" },
        { expr: "binarySearchRecursive([4], 4)", expected: 0, label: "single element" },
        { expr: "binarySearchRecursive([-10, -5, 0, 5, 10], -10)", expected: 0, label: "negatives" },
        {
          label: "uses O(log n) reads on 1,000,000 items (at most 80 array reads)",
          code: `const data = Array.from({ length: 1000000 }, (_, i) => i);
let reads = 0;
const spy = new Proxy(data, { get(t, k) { if (typeof k === "string" && String(Number(k)) === k) reads++; return t[k]; } });
return binarySearchRecursive(spy, 123457) === 123457 && reads <= 80;`,
          expected: true
        }
      ]
    },
    {
      id: "first-occurrence",
      title: "firstOccurrence (leftmost index)",
      difficulty: "medium",
      prompt: "<p><code>arr</code> is sorted ascending and may contain <strong>duplicates</strong>. Return the <strong>leftmost</strong> index of <code>target</code>, or <code>-1</code>. It must stay O(log n) even if every item equals the target.</p><p><code>firstOccurrence([1, 2, 2, 2, 3], 2) &rarr; 1</code> &nbsp; <code>firstOccurrence([5, 5, 5, 5], 5) &rarr; 0</code> &nbsp; <code>firstOccurrence([1, 2, 3], 4) &rarr; -1</code></p>",
      starter: `function firstOccurrence(arr, target) {
  // your code here
}`,
      solution: `function firstOccurrence(arr, target) {
  let lo = 0, hi = arr.length - 1, answer = -1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) {
      answer = mid;     // remember it...
      hi = mid - 1;     // ...but keep looking to the left
    } else if (arr[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return answer;  // O(log n)
}`,
      hint: "Use normal binary search plus a variable answer = -1. When arr[mid] === target, set answer = mid and continue in the LEFT half (hi = mid - 1). Don't walk left one step at a time - that is O(n) when everything is equal.",
      explanation: "<p>This \"remember and keep going\" pattern answers many questions: last occurrence (go right instead), count of a value (last - first + 1), and \"first day the stock went above X\".</p>",
      forbid: [{ pattern: "\\.(indexOf|lastIndexOf|includes|find|findIndex|findLast|findLastIndex)\\(", message: "Implement the search yourself - no indexOf / includes / find." }],
      tests: [
        { expr: "firstOccurrence([1, 2, 2, 2, 3], 2)", expected: 1 },
        { expr: "firstOccurrence([5, 5, 5, 5], 5)", expected: 0, label: "all duplicates" },
        { expr: "firstOccurrence([1, 2, 3, 4, 4], 4)", expected: 3 },
        { expr: "firstOccurrence([1, 2, 3], 4)", expected: -1, label: "missing" },
        { expr: "firstOccurrence([], 1)", expected: -1, label: "empty array" },
        { expr: "firstOccurrence([-2, -2, 0, 0, 0, 9], 0)", expected: 2, label: "negatives" },
        {
          label: "O(log n) when all 1,000,000 values are equal (at most 80 array reads)",
          code: `const data = new Array(1000000).fill(7);
let reads = 0;
const spy = new Proxy(data, { get(t, k) { if (typeof k === "string" && String(Number(k)) === k) reads++; return t[k]; } });
return firstOccurrence(spy, 7) === 0 && reads <= 80;`,
          expected: true
        }
      ]
    },
    {
      id: "bubble-sort",
      title: "bubbleSort",
      difficulty: "easy",
      prompt: "<p>Sort numbers ascending with <strong>bubble sort</strong>: repeatedly swap neighbours that are in the wrong order. Return a <strong>new array</strong> (do not change the input), and stop early when a pass makes no swaps. No built-in <code>sort</code>.</p><p><code>bubbleSort([5, 1, 4, 2, 8]) &rarr; [1, 2, 4, 5, 8]</code> &nbsp; <code>bubbleSort([10, 9, 1, 100]) &rarr; [1, 9, 10, 100]</code> &nbsp; <code>bubbleSort([]) &rarr; []</code></p>",
      starter: `function bubbleSort(arr) {
  // your code here
}`,
      solution: `function bubbleSort(arr) {
  const a = arr.slice();                 // copy: don't mutate the input
  for (let end = a.length - 1; end > 0; end--) {
    let swapped = false;
    for (let j = 0; j < end; j++) {
      if (a[j] > a[j + 1]) {             // strict > keeps it stable
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break;                 // already sorted: O(n) best case
  }
  return a;  // O(n^2) worst case, O(1) extra besides the copy
}`,
      hint: "Copy first: const a = arr.slice(). Outer loop: end goes from a.length - 1 down to 1. Inner loop: j from 0 to end - 1, swap a[j] and a[j + 1] if a[j] > a[j + 1] (use strictly >, so equal items never swap). Track a swapped flag and break if it stays false.",
      forbid: [{ pattern: "\\.(sort|toSorted)\\(", message: "Write bubble sort by hand - no built-in sort." }],
      tests: [
        { expr: "bubbleSort([5, 1, 4, 2, 8])", expected: [1, 2, 4, 5, 8] },
        { expr: "bubbleSort([])", expected: [], label: "empty array" },
        { expr: "bubbleSort([42])", expected: [42], label: "single element" },
        { expr: "bubbleSort([3, 1, 3, 2, 1])", expected: [1, 1, 2, 3, 3], label: "duplicates" },
        { expr: "bubbleSort([0, -5, 3, -1])", expected: [-5, -1, 0, 3], label: "negatives" },
        { expr: "bubbleSort([1, 2, 3, 4])", expected: [1, 2, 3, 4], label: "already sorted" },
        { expr: "bubbleSort([4, 3, 2, 1])", expected: [1, 2, 3, 4], label: "reversed" },
        { expr: "bubbleSort([10, 9, 1, 100])", expected: [1, 9, 10, 100], label: "numeric, not string order" },
        { code: "const a = [3, 1, 2]; bubbleSort(a); return a;", expected: [3, 1, 2], label: "input is not mutated" },
        {
          label: "stable: equal keys keep their order",
          code: `class Item { constructor(k, t) { this.k = k; this.t = t; } valueOf() { return this.k; } }
const items = [new Item(2, "a"), new Item(1, "b"), new Item(2, "c"), new Item(1, "d")];
return bubbleSort(items).map(x => x.t).join("");`,
          expected: "bdac"
        }
      ]
    },
    {
      id: "selection-sort",
      title: "selectionSort",
      difficulty: "easy",
      prompt: "<p>Sort ascending with <strong>selection sort</strong>: for each position <code>i</code>, find the smallest item from <code>i</code> to the end and swap it into position <code>i</code>. Return a <strong>new array</strong>. No built-in <code>sort</code>.</p><p><code>selectionSort([64, 25, 12, 22, 11]) &rarr; [11, 12, 22, 25, 64]</code> &nbsp; <code>selectionSort([2, 2, 1, 1]) &rarr; [1, 1, 2, 2]</code> &nbsp; <code>selectionSort([7]) &rarr; [7]</code></p>",
      starter: `function selectionSort(arr) {
  // your code here
}`,
      solution: `function selectionSort(arr) {
  const a = arr.slice();
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIdx]) minIdx = j;  // find the smallest in a[i..]
    }
    if (minIdx !== i) [a[i], a[minIdx]] = [a[minIdx], a[i]];
  }
  return a;  // always O(n^2) comparisons, at most n-1 swaps
}`,
      hint: "Copy with slice(). For each i, set minIdx = i, then loop j from i + 1 to the end and update minIdx when a[j] < a[minIdx]. After the inner loop, swap a[i] and a[minIdx].",
      forbid: [{ pattern: "\\.(sort|toSorted)\\(", message: "Write selection sort by hand - no built-in sort." }, { pattern: "Math\\.min", message: "Find the minimum with your own loop (you need its index anyway)." }],
      tests: [
        { expr: "selectionSort([64, 25, 12, 22, 11])", expected: [11, 12, 22, 25, 64] },
        { expr: "selectionSort([])", expected: [], label: "empty array" },
        { expr: "selectionSort([7])", expected: [7], label: "single element" },
        { expr: "selectionSort([2, 2, 1, 1])", expected: [1, 1, 2, 2], label: "duplicates" },
        { expr: "selectionSort([-1, -10, 5, 0])", expected: [-10, -1, 0, 5], label: "negatives" },
        { expr: "selectionSort([1, 2, 3])", expected: [1, 2, 3], label: "already sorted" },
        { expr: "selectionSort([9, 7, 5, 3, 1])", expected: [1, 3, 5, 7, 9], label: "reversed" },
        { code: "const a = [3, 1, 2]; selectionSort(a); return a;", expected: [3, 1, 2], label: "input is not mutated" }
      ]
    },
    {
      id: "insertion-sort",
      title: "insertionSort",
      difficulty: "medium",
      prompt: "<p>Sort ascending with <strong>insertion sort</strong>: take each item in turn and shift bigger items one place right until its slot appears. Return a <strong>new array</strong>. It must be <strong>stable</strong> (equal items keep their order). No built-in <code>sort</code>.</p><p><code>insertionSort([5, 2, 4, 6, 1, 3]) &rarr; [1, 2, 3, 4, 5, 6]</code> &nbsp; <code>insertionSort([3, 3, 1, 3]) &rarr; [1, 3, 3, 3]</code> &nbsp; <code>insertionSort([]) &rarr; []</code></p>",
      starter: `function insertionSort(arr) {
  // your code here
}`,
      solution: `function insertionSort(arr) {
  const a = arr.slice();
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {  // strict > : equal items are not passed (stable)
      a[j + 1] = a[j];               // shift right
      j--;
    }
    a[j + 1] = key;
  }
  return a;  // O(n^2) worst, O(n) on sorted input
}`,
      hint: "Copy with slice(). For i from 1: save key = a[i], set j = i - 1, and while j >= 0 && a[j] > key, move a[j] to a[j + 1] and j--. Finally a[j + 1] = key. Using > (not >=) is what keeps it stable.",
      explanation: "<p>The sorted part grows from the left, like cards in your hand. On nearly sorted input the inner <code>while</code> barely runs, so the sort is close to O(n) - a big advantage over selection sort.</p>",
      forbid: [{ pattern: "\\.(sort|toSorted)\\(", message: "Write insertion sort by hand - no built-in sort." }],
      tests: [
        { expr: "insertionSort([5, 2, 4, 6, 1, 3])", expected: [1, 2, 3, 4, 5, 6] },
        { expr: "insertionSort([])", expected: [], label: "empty array" },
        { expr: "insertionSort([1])", expected: [1], label: "single element" },
        { expr: "insertionSort([3, 3, 1, 3])", expected: [1, 3, 3, 3], label: "duplicates" },
        { expr: "insertionSort([0, -2, -2, 8, -7])", expected: [-7, -2, -2, 0, 8], label: "negatives" },
        { expr: "insertionSort([1, 2, 3, 4, 5])", expected: [1, 2, 3, 4, 5], label: "already sorted" },
        { expr: "insertionSort([5, 4, 3, 2, 1])", expected: [1, 2, 3, 4, 5], label: "reversed" },
        { code: "const a = [2, 1]; insertionSort(a); return a;", expected: [2, 1], label: "input is not mutated" },
        {
          label: "stable: equal keys keep their order",
          code: `class Item { constructor(k, t) { this.k = k; this.t = t; } valueOf() { return this.k; } }
const items = [new Item(3, "a"), new Item(1, "b"), new Item(3, "c"), new Item(1, "d"), new Item(2, "e")];
return insertionSort(items).map(x => x.t).join("");`,
          expected: "bdeac"
        }
      ]
    },
    {
      id: "merge-sorted-arrays",
      title: "mergeSortedArrays",
      difficulty: "medium",
      prompt: "<p>You get two arrays, each already sorted ascending. Return <strong>one new sorted array</strong> containing all their items, using two pointers (O(n + m)). On ties, take from <code>a</code> first. No <code>sort</code>.</p><p><code>mergeSortedArrays([1, 4, 9], [2, 4, 10, 12]) &rarr; [1, 2, 4, 4, 9, 10, 12]</code> &nbsp; <code>mergeSortedArrays([], [1, 2]) &rarr; [1, 2]</code> &nbsp; <code>mergeSortedArrays([5, 6], [1, 2]) &rarr; [1, 2, 5, 6]</code></p>",
      starter: `function mergeSortedArrays(a, b) {
  // your code here
}`,
      solution: `function mergeSortedArrays(a, b) {
  const out = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    // <= takes from a on ties, which keeps merge sort stable
    if (a[i] <= b[j]) out.push(a[i++]);
    else out.push(b[j++]);
  }
  // one side is used up - copy the rest of the other
  while (i < a.length) out.push(a[i++]);
  while (j < b.length) out.push(b[j++]);
  return out;  // O(n + m)
}`,
      hint: "Use i for a and j for b, both starting at 0. While both have items left, push the smaller of a[i] and b[j] (use <= so a wins ties) and move that pointer. Then push whatever is left in a, then whatever is left in b.",
      explanation: "<p>This is the heart of merge sort, and a classic on its own (merging two sorted reports, two sorted log files...). Each item is looked at once, so it is linear time.</p>",
      forbid: [{ pattern: "\\.(sort|toSorted)\\(", message: "Merge with two pointers - no built-in sort." }],
      tests: [
        { expr: "mergeSortedArrays([1, 4, 9], [2, 4, 10, 12])", expected: [1, 2, 4, 4, 9, 10, 12] },
        { expr: "mergeSortedArrays([], [1, 2])", expected: [1, 2], label: "first empty" },
        { expr: "mergeSortedArrays([1, 2], [])", expected: [1, 2], label: "second empty" },
        { expr: "mergeSortedArrays([], [])", expected: [], label: "both empty" },
        { expr: "mergeSortedArrays([-5, 0], [-6, -5, 7])", expected: [-6, -5, -5, 0, 7], label: "negatives and duplicates" },
        { expr: "mergeSortedArrays([5, 6], [1, 2])", expected: [1, 2, 5, 6], label: "no overlap" },
        { code: "const a = [1, 3], b = [2]; mergeSortedArrays(a, b); return [a, b];", expected: [[1, 3], [2]], label: "inputs are not mutated" },
        {
          label: "200,000 items merged in linear time",
          code: `const a = Array.from({ length: 100000 }, (_, i) => i * 2);
const b = Array.from({ length: 100000 }, (_, i) => i * 2 + 1);
const m = mergeSortedArrays(a, b);
return m.length === 200000 && m[0] === 0 && m[199999] === 199999 && m[12345] === 12345;`,
          expected: true,
          maxMs: 1000
        }
      ]
    },
    {
      id: "merge-sort",
      title: "mergeSort",
      difficulty: "medium",
      prompt: "<p>Sort ascending with <strong>merge sort</strong>: split the array in half, sort each half with a recursive call, then merge the two sorted halves. Return a <strong>new array</strong>. It must be <strong>stable</strong> and O(n log n). No built-in <code>sort</code>.</p><p><code>mergeSort([38, 27, 43, 3, 9, 82, 10]) &rarr; [3, 9, 10, 27, 38, 43, 82]</code> &nbsp; <code>mergeSort([4, 1, 4, 1, 4]) &rarr; [1, 1, 4, 4, 4]</code> &nbsp; <code>mergeSort([5]) &rarr; [5]</code> (a new array)</p>",
      starter: `function mergeSort(arr) {
  // your code here
}`,
      solution: `function mergeSort(arr) {
  if (arr.length <= 1) return arr.slice();      // base case (still a copy)
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) out.push(left[i++]);  // <= keeps it stable
    else out.push(right[j++]);
  }
  while (i < left.length) out.push(left[i++]);
  while (j < right.length) out.push(right[j++]);
  return out;  // O(n log n) time, O(n) extra space
}`,
      hint: "Base case: if arr.length <= 1 return arr.slice(). Otherwise mid = Math.floor(arr.length / 2); left = mergeSort(arr.slice(0, mid)); right = mergeSort(arr.slice(mid)); then merge them exactly like mergeSortedArrays (<= on ties).",
      explanation: "<p>The array is halved about log&#8322;(n) times, and every level of halving does n units of merge work, so the total is O(n log n) no matter what the input looks like. The price is O(n) extra memory for the merged copies.</p>",
      forbid: [{ pattern: "\\.(sort|toSorted)\\(", message: "Write merge sort by hand - no built-in sort." }],
      tests: [
        { expr: "mergeSort([38, 27, 43, 3, 9, 82, 10])", expected: [3, 9, 10, 27, 38, 43, 82] },
        { expr: "mergeSort([])", expected: [], label: "empty array" },
        { expr: "mergeSort([5])", expected: [5], label: "single element" },
        { expr: "mergeSort([4, 1, 4, 1, 4])", expected: [1, 1, 4, 4, 4], label: "duplicates" },
        { expr: "mergeSort([3, -3, 0, -100, 100])", expected: [-100, -3, 0, 3, 100], label: "negatives" },
        { expr: "mergeSort([1, 2, 3, 4, 5, 6])", expected: [1, 2, 3, 4, 5, 6], label: "already sorted" },
        { expr: "mergeSort([6, 5, 4, 3, 2, 1])", expected: [1, 2, 3, 4, 5, 6], label: "reversed" },
        { code: "const a = [3, 1, 2]; mergeSort(a); return a;", expected: [3, 1, 2], label: "input is not mutated" },
        { code: "const a = [9]; return mergeSort(a) !== a;", expected: true, label: "returns a new array even for 1 item" },
        {
          label: "stable: equal keys keep their order",
          code: `class Item { constructor(k, t) { this.k = k; this.t = t; } valueOf() { return this.k; } }
const items = [new Item(2, "a"), new Item(1, "b"), new Item(2, "c"), new Item(1, "d"), new Item(0, "e"), new Item(2, "f")];
return mergeSort(items).map(x => x.t).join("");`,
          expected: "ebdacf"
        },
        {
          label: "100,000 random numbers (O(n log n))",
          code: `let s = 7;
const a = Array.from({ length: 100000 }, () => (s = (s * 16807) % 2147483647) % 2001 - 1000);
return JSON.stringify(mergeSort(a)) === JSON.stringify(a.slice().sort((x, y) => x - y));`,
          expected: true,
          maxMs: 1500
        }
      ]
    },
    {
      id: "quick-sort",
      title: "quickSort",
      difficulty: "hard",
      prompt: "<p>Sort ascending with <strong>quick sort</strong>: choose a pivot, split the items into smaller / equal / greater groups, sort the smaller and greater groups recursively, and join the three. Return a <strong>new array</strong>. Pick the pivot so that already-sorted input does not become O(n&sup2;). No built-in <code>sort</code>.</p><p><code>quickSort([10, 80, 30, 90, 40, 50, 70]) &rarr; [10, 30, 40, 50, 70, 80, 90]</code> &nbsp; <code>quickSort([5, 5, 5, 5]) &rarr; [5, 5, 5, 5]</code> &nbsp; <code>quickSort([]) &rarr; []</code></p>",
      starter: `function quickSort(arr) {
  // your code here
}`,
      solution: `function quickSort(arr) {
  if (arr.length <= 1) return arr.slice();
  const pivot = arr[Math.floor(arr.length / 2)];  // middle pivot: safe on sorted input
  const less = [], equal = [], greater = [];
  for (const x of arr) {
    if (x < pivot) less.push(x);
    else if (x > pivot) greater.push(x);
    else equal.push(x);            // grouping equals handles many duplicates well
  }
  return quickSort(less).concat(equal, quickSort(greater));
  // O(n log n) average, O(n^2) worst; this version uses O(n) extra space
}`,
      hint: "If length <= 1 return a copy. pivot = arr[Math.floor(arr.length / 2)] (the middle item, not the first). One loop pushes each item into less, equal or greater. Return quickSort(less).concat(equal, quickSort(greater)).",
      explanation: "<p>With the first item as pivot, sorted input puts everything into one side every time: n levels of recursion and n&sup2;/2 comparisons (and possibly a stack overflow). The middle item splits sorted data perfectly, and a random pivot makes bad splits very unlikely for any input.</p>",
      forbid: [{ pattern: "\\.(sort|toSorted)\\(", message: "Write quick sort by hand - no built-in sort." }],
      tests: [
        { expr: "quickSort([10, 80, 30, 90, 40, 50, 70])", expected: [10, 30, 40, 50, 70, 80, 90] },
        { expr: "quickSort([])", expected: [], label: "empty array" },
        { expr: "quickSort([1])", expected: [1], label: "single element" },
        { expr: "quickSort([5, 5, 5, 5])", expected: [5, 5, 5, 5], label: "all duplicates" },
        { expr: "quickSort([2, -8, 0, -8, 3])", expected: [-8, -8, 0, 2, 3], label: "negatives and duplicates" },
        { expr: "quickSort([1, 2, 3, 4, 5])", expected: [1, 2, 3, 4, 5], label: "already sorted" },
        { expr: "quickSort([5, 4, 3, 2, 1])", expected: [1, 2, 3, 4, 5], label: "reversed" },
        { code: "const a = [3, 1, 2]; quickSort(a); return a;", expected: [3, 1, 2], label: "input is not mutated" },
        {
          label: "20,000 already-sorted items (bad pivot choice overflows or crawls)",
          code: `const a = Array.from({ length: 20000 }, (_, i) => i);
const r = quickSort(a);
return r.length === 20000 && r[0] === 0 && r[19999] === 19999;`,
          expected: true,
          maxMs: 1500
        },
        {
          label: "100,000 random numbers",
          code: `let s = 11;
const a = Array.from({ length: 100000 }, () => (s = (s * 16807) % 2147483647) % 100000 - 50000);
return JSON.stringify(quickSort(a)) === JSON.stringify(a.slice().sort((x, y) => x - y));`,
          expected: true,
          maxMs: 1500
        }
      ]
    },
    {
      id: "kth-smallest",
      title: "kthSmallest",
      difficulty: "hard",
      prompt: "<p>Return the <strong>k-th smallest</strong> value in an unsorted array (<code>k</code> starts at 1, and <code>1 &le; k &le; arr.length</code>). Duplicates count separately. Do not modify the input.</p><p><code>kthSmallest([7, 10, 4, 3, 20, 15], 3) &rarr; 7</code> &nbsp; <code>kthSmallest([7, 10, 4, 3, 20, 15], 1) &rarr; 3</code> &nbsp; <code>kthSmallest([2, 1, 2, 1, 2], 3) &rarr; 2</code></p><p>Sorting a copy works (O(n log n)). Challenge: use <strong>quickselect</strong> for O(n) on average.</p>",
      starter: `function kthSmallest(arr, k) {
  // your code here
}`,
      solution: `function kthSmallest(arr, k) {
  // Quickselect: partition like quick sort, but recurse into ONE side only.
  let items = arr;            // never mutated: we always build new arrays
  let idx = k - 1;            // 0-based position we want
  while (true) {
    const pivot = items[Math.floor(items.length / 2)];
    const less = [], equal = [], greater = [];
    for (const x of items) {
      if (x < pivot) less.push(x);
      else if (x > pivot) greater.push(x);
      else equal.push(x);
    }
    if (idx < less.length) {
      items = less;
    } else if (idx < less.length + equal.length) {
      return pivot;
    } else {
      idx -= less.length + equal.length;
      items = greater;
    }
  }
  // O(n) average (n + n/2 + n/4 + ...), O(n^2) worst case
}`,
      hint: "Easy route: const c = [...arr].sort((a, b) => a - b); return c[k - 1]. Quickselect route: split around a pivot into less / equal / greater. If k - 1 < less.length, continue in less; if it falls inside equal, the pivot is the answer; otherwise continue in greater with k reduced by less.length + equal.length.",
      explanation: "<p>Quickselect does the partition step of quick sort but throws away the side that cannot contain the answer. The work is n + n/2 + n/4 + ... &asymp; 2n on average, so O(n). Watch out for the default <code>sort()</code> trap if you sort: without <code>(a, b) =&gt; a - b</code>, 100 comes before 9.</p>",
      tests: [
        { expr: "kthSmallest([7, 10, 4, 3, 20, 15], 3)", expected: 7 },
        { expr: "kthSmallest([7, 10, 4, 3, 20, 15], 1)", expected: 3, label: "k = 1 (minimum)" },
        { expr: "kthSmallest([7, 10, 4, 3, 20, 15], 6)", expected: 20, label: "k = n (maximum)" },
        { expr: "kthSmallest([42], 1)", expected: 42, label: "single element" },
        { expr: "kthSmallest([2, 1, 2, 1, 2], 3)", expected: 2, label: "duplicates count separately" },
        { expr: "kthSmallest([-1, -7, 3, 0], 2)", expected: -1, label: "negatives" },
        { expr: "kthSmallest([100, 9, 10, 1], 2)", expected: 9, label: "numeric, not string order" },
        { code: "const a = [5, 3, 1, 4]; kthSmallest(a, 2); return a;", expected: [5, 3, 1, 4], label: "input is not mutated" },
        {
          label: "200,000 items",
          code: `const a = Array.from({ length: 200000 }, (_, i) => (i * 7919) % 200000);
return kthSmallest(a, 123456);`,
          expected: 123455,
          maxMs: 1500
        }
      ]
    },
    {
      id: "sort-by",
      title: "sortBy multiple keys",
      difficulty: "medium",
      prompt: "<p><code>records</code> is an array of <code>{ name, score }</code> objects. Return a <strong>new array</strong> sorted by <code>score</code> from high to low; when scores tie, by <code>name</code> A &rarr; Z. Here you <em>may</em> use the built-in <code>sort</code> - with a proper comparator, on a copy.</p><p><code>[{Zoe, 90}, {Amy, 90}, {Bob, 95}] &rarr; Bob, Amy, Zoe</code> &nbsp; <code>[{Cy, 9}, {Al, 10}, {Bo, 100}] &rarr; scores 100, 10, 9</code> &nbsp; <code>[] &rarr; []</code></p>",
      starter: `function sortBy(records) {
  // your code here
}`,
      solution: `function sortBy(records) {
  // [...records] copies, so the caller's array keeps its order.
  // b.score - a.score sorts high->low; when it is 0 the || falls through to the name.
  return [...records].sort((a, b) =>
    b.score - a.score || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  // O(n log n)
}`,
      hint: "return [...records].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)); - the first part orders by score (high first). When it is 0, || falls through to the name comparison.",
      explanation: "<p>This is exactly how leaderboards and reports are sorted at work. Chain as many keys as you need with <code>||</code>. Always copy first: <code>sort()</code> changes the array it is called on.</p>",
      tests: [
        {
          code: `return sortBy([{ name: "Zoe", score: 90 }, { name: "Amy", score: 90 }, { name: "Bob", score: 95 }]).map(r => r.name);`,
          expected: ["Bob", "Amy", "Zoe"], label: "score desc, then name asc"
        },
        {
          code: `return sortBy([{ name: "Cy", score: 9 }, { name: "Al", score: 10 }, { name: "Bo", score: 100 }]).map(r => r.score);`,
          expected: [100, 10, 9], label: "numeric scores, not string order"
        },
        {
          code: `return sortBy([{ name: "Dan", score: -5 }, { name: "Eve", score: 0 }, { name: "Ann", score: -5 }]).map(r => r.name);`,
          expected: ["Eve", "Ann", "Dan"], label: "negative scores and ties"
        },
        { expr: "sortBy([])", expected: [], label: "empty array" },
        { expr: "sortBy([{ name: \"Solo\", score: 1 }])", expected: [{ name: "Solo", score: 1 }], label: "single record" },
        {
          code: `const recs = [{ name: "B", score: 1 }, { name: "A", score: 2 }];
sortBy(recs);
return recs.map(r => r.name);`,
          expected: ["B", "A"], label: "input is not mutated"
        }
      ]
    }
  ],

  takeaways: [
    "<strong>Linear search</strong> works on anything but is O(n); <strong>binary search</strong> needs sorted data and is O(log n) - about 20 steps for a million items.",
    "Binary search = <code>lo</code>, <code>hi</code>, <code>mid</code>; always move past <code>mid</code> (<code>+ 1</code> / <code>- 1</code>). For the first occurrence, remember the match and keep going left.",
    "Bubble, selection and insertion sort are O(n&sup2;); insertion sort is great on nearly sorted data.",
    "Merge sort is always O(n log n) and stable; quick sort is usually fastest but needs a good pivot.",
    "In JavaScript always pass a comparator: <code>(a, b) =&gt; a - b</code>, chain keys with <code>||</code>, and copy before sorting."
  ]
});
