LDL.registerLesson({
  id: "05",
  title: "Multi-dimensional Arrays",
  lang: "js",
  minutes: 75,
  goal: "Work with grids of rows and columns: create them safely, walk them in any order, find neighbours, and solve the classic matrix questions (transpose, rotate, spiral, islands).",

  analogy: `
<p>Think of a <strong>cinema seat map</strong>. To find your seat you need <em>two</em> pieces of information: the <strong>row</strong>
and the <strong>seat number</strong> in that row. "Row C, seat 7" - one number is not enough.</p>
<p>A 2D array works exactly the same way. It's a list of rows, and each row is a list of seats.
<code>seats[2][7]</code> means "row 2, seat 7". Spreadsheets (row 5, column B), chessboards (e4) and
pixel images all work like this too.</p>`,

  objectives: [
    "Create a grid correctly and explain why <code>Array(r).fill(Array(c))</code> is a bug",
    "Read and write any cell with <code>grid[row][col]</code> and find the number of rows and columns",
    "Walk a grid row by row, column by column, along diagonals and in a spiral",
    "Find a cell's neighbours using <strong>direction vectors</strong> and safe bounds checks",
    "Solve grid-map problems with <strong>DFS</strong> and <strong>BFS</strong> (flood fill, islands, shortest path)",
    "Transpose, rotate and multiply matrices, and flatten 3D data"
  ],

  realWorld: `
<ul>
  <li><strong>Spreadsheets and reports:</strong> a sales table of regions &times; months is a 2D array; row and column totals are classic loops.</li>
  <li><strong>Images:</strong> a photo is a grid of pixels (often 3D: height &times; width &times; colour). Rotating a photo is rotating a matrix.</li>
  <li><strong>Seat maps and floor plans:</strong> cinema, airline and office desk booking systems store a grid of free/taken cells.</li>
  <li><strong>Games:</strong> tic-tac-toe, chess, Minesweeper and maze games are all boards of cells with neighbours.</li>
  <li><strong>Exams:</strong> spiral order, rotate image, count islands and search a sorted matrix are interview favourites.</li>
</ul>`,

  sections: [
    {
      title: "Grids: an array of rows",
      html: `
<p>A <strong>2D array</strong> (also called a <strong>matrix</strong> or <strong>grid</strong>) is an array whose elements are themselves arrays.
Each inner array is one <strong>row</strong>. A position within a row is a <strong>column</strong>. Each box is a <strong>cell</strong>.</p>
<pre>
                 col 0  col 1  col 2  col 3
               +------+------+------+------+
grid[0] row 0  |   1  |   2  |   3  |   4  |
               +------+------+------+------+
grid[1] row 1  |   5  |   6  |   7  |   8  |
               +------+------+------+------+
grid[2] row 2  |   9  |  10  |  11  |  12  |
               +------+------+------+------+
</pre>
<pre><code class="language-javascript">const grid = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12]
];
console.log(grid[1][2]);        // 7   - row 1 first, then column 2
console.log(grid.length);       // 3   - number of rows
console.log(grid[0].length);    // 4   - number of columns
grid[2][0] = 99;                // change one cell</code></pre>
<div class="callout key"><p>Always <strong>row first, then column</strong>: <code>grid[row][col]</code>. Rows go down the page, columns go across.
If you think in x/y, that's <code>grid[y][x]</code> - the opposite of maths class.</p></div>
<table>
  <tr><th>Question</th><th>Code</th></tr>
  <tr><td>Whole row <code>r</code></td><td><code>grid[r]</code></td></tr>
  <tr><td>Whole column <code>c</code></td><td><code>grid.map(row =&gt; row[c])</code></td></tr>
  <tr><td>Is <code>(r, c)</code> inside the grid?</td><td><code>r &gt;= 0 &amp;&amp; r &lt; rows &amp;&amp; c &gt;= 0 &amp;&amp; c &lt; cols</code></td></tr>
  <tr><td>Cell's position if you count row by row</td><td><code>r * cols + c</code></td></tr>
</table>`
    },
    {
      title: "Creating a grid correctly (the aliasing trap)",
      html: `
<p>To make an empty 3 &times; 4 grid you need <strong>3 separate row arrays</strong>. The obvious one-liner gives you
one row shared three times - an <strong>aliasing</strong> bug (lesson 04).</p>
<pre><code class="language-javascript">// RIGHT: Array.from calls the arrow function once per row -&gt; a new row each time
const good = Array.from({ length: 3 }, () =&gt; Array(4).fill(0));

// WRONG: fill() evaluates its argument ONCE and puts the same row in every slot
const bad = Array(3).fill(Array(4).fill(0));
bad[0][0] = 9;   // every row now starts with 9!</code></pre>
<pre>
bad:   [ * , * , * ]            good:  [ * ,  * ,  * ]
         |   |   |                       |    |    |
         +---+---+                       v    v    v
             v                        [0..] [0..] [0..]   three separate rows
        [0, 0, 0, 0]   ONE shared row
</pre>
<div class="callout warn"><p>Copying has the same trap. <code>[...grid]</code> copies only the outer list - the rows are still shared.
Use <code>grid.map(row =&gt; [...row])</code> or <code>structuredClone(grid)</code> for a true copy.</p></div>
<div class="callout analogy"><p>The bad version is like a cinema where rows A, B and C are mirrors of the same row. Book seat A1 and B1 and C1 show as booked too.</p></div>`
    },
    {
      title: "Walking a grid: rows, columns and totals",
      html: `
<p>To visit every cell, use two nested loops. The outer loop picks a row; the inner loop walks across it.
This order is called <strong>row-major</strong> - like reading a book.</p>
<pre><code class="language-javascript">for (let r = 0; r &lt; grid.length; r++) {        // each row
  for (let c = 0; c &lt; grid[r].length; c++) {   // each column in that row
    console.log(r, c, grid[r][c]);
  }
}</code></pre>
<p>Swap the loops (columns outside, rows inside) for <strong>column-major</strong> order - like reading a newspaper column.</p>
<pre>
              Jan  Feb  Mar  | row total
     North  [ 120, 150, 130] |   400
     South  [  90, 110, 100] |   300
     ------------------------+
col total     210  260  230
</pre>
<div class="callout tip"><p>Row totals: reset a counter at the start of each row. Column totals: keep an array with one counter per column and add each cell to <code>colTotals[c]</code>.
One pass can fill both.</p></div>`
    },
    {
      title: "Diagonals, transpose and rotation",
      html: `
<p>In a square grid of size <code>n</code>, the <strong>main diagonal</strong> runs top-left to bottom-right, and the <strong>anti-diagonal</strong> runs top-right to bottom-left.</p>
<table>
  <tr><th>Move</th><th>Rule</th><th>Example cells (3 &times; 3)</th></tr>
  <tr><td>Main diagonal</td><td><code>r === c</code></td><td>(0,0) (1,1) (2,2)</td></tr>
  <tr><td>Anti-diagonal</td><td><code>r + c === n - 1</code></td><td>(0,2) (1,1) (2,0)</td></tr>
  <tr><td><strong>Transpose</strong> (flip over the main diagonal)</td><td><code>(r, c)</code> &rarr; <code>(c, r)</code></td><td>rows become columns</td></tr>
  <tr><td><strong>Rotate 90&deg; clockwise</strong></td><td><code>(r, c)</code> &rarr; <code>(c, rows - 1 - r)</code></td><td>= transpose, then reverse each row</td></tr>
</table>
<pre>
   original         transpose        rotate 90 clockwise
   1 2 3            1 4 7            7 4 1
   4 5 6    --&gt;     2 5 8    --&gt;     8 5 2
   7 8 9            3 6 9            9 6 3
                                   (each row reversed)
</pre>
<div class="callout warn"><p>Not every grid is square. Transposing or rotating a 2 &times; 3 grid gives a 3 &times; 2 grid - build the result with <code>cols</code> rows and <code>rows</code> columns.</p></div>`
    },
    {
      title: "Spiral order: four shrinking walls",
      html: `
<p>Spiral order walks the outer ring clockwise, then the next ring in, and so on. Keep four <strong>boundaries</strong>
(<code>top</code>, <code>bottom</code>, <code>left</code>, <code>right</code>) and move a wall inwards after walking each side.</p>
<pre>
  1 -&gt;  2 -&gt;  3 -&gt;  4
                    |
  5 -&gt;  6 -&gt;  7     8          1 2 3 4  (top row, then top++)
  ^                 |          8 12     (right column, then right--)
  9 &lt;- 10 &lt;- 11 &lt;- 12          11 10 9  (bottom row backwards, then bottom--)
                               5        (left column upwards, then left++)
                               6 7      (next ring)
</pre>
<div class="callout tip"><p>After walking the top row and right column, check the walls haven't crossed before walking the bottom row and left column.
Otherwise a single leftover row or column gets read twice.</p></div>`
    },
    {
      title: "Neighbours and direction vectors",
      html: `
<p>Many problems ask about a cell's <strong>neighbours</strong>. Instead of four nearly identical <code>if</code> blocks,
list the moves as <strong>direction vectors</strong> - pairs of (row change, column change) - and loop over them.</p>
<pre><code class="language-javascript">const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];   // up, down, left, right

for (const [dr, dc] of DIRS) {
  const nr = r + dr, nc = c + dc;                   // neighbour's position
  if (nr &gt;= 0 &amp;&amp; nr &lt; rows &amp;&amp; nc &gt;= 0 &amp;&amp; nc &lt; cols) {
    // (nr, nc) is safely inside the grid
  }
}</code></pre>
<pre>
 4 directions                8 directions (add diagonals)
       (-1, 0)               (-1,-1) (-1, 0) (-1,+1)
 (0,-1) [r,c] (0,+1)         ( 0,-1)  [r,c]  ( 0,+1)
       (+1, 0)               (+1,-1) (+1, 0) (+1,+1)
</pre>
<div class="callout warn"><p>Check the bounds <strong>before</strong> you index. <code>grid[-1]</code> is <code>undefined</code>, and <code>grid[-1][0]</code> crashes with a TypeError.</p></div>`
    },
    {
      title: "Grids as maps: DFS and BFS",
      html: `
<p>A grid of <code>0</code> (water / wall) and <code>1</code> (land / open) is really a <strong>map</strong>. Each open cell is a place;
its open neighbours are the places you can step to. Two classic ways to explore:</p>
<table>
  <tr><th></th><th>DFS (depth-first search)</th><th>BFS (breadth-first search)</th></tr>
  <tr><td>Tool</td><td>a <strong>stack</strong> (or recursion)</td><td>a <strong>queue</strong></td></tr>
  <tr><td>Explores</td><td>as deep as possible, then backtracks</td><td>in rings: distance 1, then 2, then 3...</td></tr>
  <tr><td>Great for</td><td>flood fill, counting regions/islands</td><td><strong>shortest path</strong> in steps</td></tr>
</table>
<pre><code class="language-javascript">// BFS skeleton - a head index avoids the slow O(n) shift()
const queue = [[startR, startC]];
seen[startR][startC] = true;
for (let head = 0; head &lt; queue.length; head++) {
  const [r, c] = queue[head];
  for (const [dr, dc] of DIRS) {
    // if neighbour is inside, open and not seen: mark seen, push to queue
  }
}</code></pre>
<div class="callout key"><p>Always mark a cell as <strong>visited</strong> when you add it. Without that, two neighbours keep adding each other forever.</p></div>
<div class="callout work"><p>The "paint bucket" tool in image editors is a flood fill. Route planners, robot vacuums and game AIs use BFS-style searches on grids.</p></div>`
    },
    {
      title: "Beyond 2D: 3D arrays and matrix multiplication",
      html: `
<p>A <strong>3D array</strong> is an array of grids: <code>cube[layer][row][col]</code>. Think of a building: floor, then row of desks, then desk.</p>
<pre>
floor 0         floor 1
[1, 2]          [5, 6]
[3, 4]          [7, 8]            building[1][0][1] = 6

flattened, floor by floor: [1, 2, 3, 4, 5, 6, 7, 8]
position = floor * (rows * cols) + row * cols + col
</pre>
<p><strong>Matrix multiplication</strong>: <code>A</code> (<code>n &times; m</code>) times <code>B</code> (<code>m &times; p</code>) gives an <code>n &times; p</code> result.
Each result cell is a row of <code>A</code> multiplied pairwise with a column of <code>B</code>, then added up.</p>
<pre>
[1 2]   [5 6]     [1*5 + 2*7   1*6 + 2*8]     [19 22]
[3 4] x [7 8]  =  [3*5 + 4*7   3*6 + 4*8]  =  [43 50]
</pre>
<div class="callout note"><p>The inner sizes must match (<code>A</code>'s columns = <code>B</code>'s rows). Three nested loops make it O(n &times; m &times; p) - O(n<sup>3</sup>) for square matrices.</p></div>`
    }
  ],

  examples: [
    {
      title: "A cinema seat map",
      code: `// "." = free, "X" = booked
const seats = [
  [".", "X", "X", "."],
  [".", ".", "X", "."],
  ["X", ".", ".", "."]
];
const rowNames = ["A", "B", "C"];

console.log("Rows:", seats.length, "| seats per row:", seats[0].length);
console.log("Is B3 booked?", seats[1][2] === "X");   // row B = 1, seat 3 = col 2

seats[2][3] = "X";                                     // book C4
let free = 0;
for (let r = 0; r < seats.length; r++) {
  console.log(rowNames[r], seats[r].join(" "));
  for (const s of seats[r]) if (s === ".") free++;
}
console.log("Free seats:", free);`,
      explain: `
<ol>
  <li>Humans say "B3"; code says <code>seats[1][2]</code> - both row and seat count from 0 in code.</li>
  <li>Booking is just writing to one cell: <code>seats[2][3] = "X"</code>.</li>
  <li>The nested loop visits every seat to count the free ones.</li>
  <li><strong>Try it:</strong> find the first row with two free seats side by side.</li>
</ol>`
    },
    {
      title: "Creating a grid: right and wrong",
      code: `const good = Array.from({ length: 3 }, () => Array(4).fill(0));
good[0][0] = 9;
console.log("good:", JSON.stringify(good));

const bad = Array(3).fill(Array(4).fill(0));
bad[0][0] = 9;
console.log("bad: ", JSON.stringify(bad));
console.log("bad[0] === bad[1]?", bad[0] === bad[1]);
console.log("good[0] === good[1]?", good[0] === good[1]);`,
      explain: `
<ol>
  <li><code>Array.from</code> runs the arrow function for each row, producing 3 different row arrays.</li>
  <li><code>fill</code> runs <code>Array(4).fill(0)</code> once and stores that same row 3 times.</li>
  <li><code>bad[0] === bad[1]</code> is <code>true</code>: same object. Changing one "row" changes all of them.</li>
  <li><strong>Try it:</strong> build the grid with two plain <code>for</code> loops and <code>push</code> - also correct.</li>
</ol>`
    },
    {
      title: "Sales table: row and column totals",
      code: `const regions = ["North", "South", "East"];
const months  = ["Jan", "Feb", "Mar"];
const sales = [
  [120, 150, 130],
  [ 90, 110, 100],
  [200, 180, 210]
];

const rowTotals = [];
const colTotals = Array(months.length).fill(0);
for (let r = 0; r < sales.length; r++) {
  let total = 0;
  for (let c = 0; c < sales[r].length; c++) {
    total += sales[r][c];          // this region's total
    colTotals[c] += sales[r][c];   // this month's total
  }
  rowTotals.push(total);
}
regions.forEach((name, r) => console.log(name, "total:", rowTotals[r]));
months.forEach((m, c) => console.log(m, "total:", colTotals[c]));`,
      explain: `
<table>
  <tr><th></th><th>Jan</th><th>Feb</th><th>Mar</th><th>Row total</th></tr>
  <tr><td>North</td><td>120</td><td>150</td><td>130</td><td>400</td></tr>
  <tr><td>South</td><td>90</td><td>110</td><td>100</td><td>300</td></tr>
  <tr><td>East</td><td>200</td><td>180</td><td>210</td><td>590</td></tr>
  <tr><td>Col total</td><td>410</td><td>440</td><td>440</td><td></td></tr>
</table>
<p>One pass fills both totals. This is exactly what a spreadsheet's SUM row and SUM column do. <strong>Try it:</strong> find the best month overall.</p>`
    },
    {
      title: "Tic-tac-toe: who won?",
      code: `const board = [
  ["X", "O", "X"],
  ["O", "X", "O"],
  ["O", "X", "X"]
];

function winner(b) {
  const n = b.length;
  const lines = [];
  for (let i = 0; i < n; i++) {
    lines.push(b[i]);                           // row i
    lines.push(b.map(row => row[i]));           // column i
  }
  lines.push(b.map((row, i) => row[i]));        // main diagonal
  lines.push(b.map((row, i) => row[n - 1 - i]));// anti-diagonal

  for (const line of lines) {
    if (line[0] !== "" && line.every(cell => cell === line[0])) return line[0];
  }
  return "nobody";
}
console.log("Winner:", winner(board));`,
      explain: `
<ol>
  <li>A board has 8 winning lines: 3 rows, 3 columns, 2 diagonals.</li>
  <li>Column <code>i</code> is <code>b.map(row =&gt; row[i])</code>; the main diagonal uses <code>row[i]</code> on row <code>i</code>, the anti-diagonal <code>row[n - 1 - i]</code>.</li>
  <li>Here the main diagonal is X, X, X - so X wins.</li>
  <li><strong>Try it:</strong> change the bottom-right cell to "O" and run again.</li>
</ol>`
    },
    {
      title: "Transpose and rotate a tiny image",
      code: `// A 3 x 4 "image" of characters
const img = [
  ["#", ".", ".", "."],
  ["#", "#", ".", "."],
  ["#", "#", "#", "."]
];
const show = g => g.forEach(row => console.log("  " + row.join(" ")));

const rows = img.length, cols = img[0].length;
const transposed = Array.from({ length: cols }, (_, c) =>
  Array.from({ length: rows }, (_, r) => img[r][c]));
const rotated = transposed.map(row => [...row].reverse());

console.log("original (3 x 4):"); show(img);
console.log("transposed (4 x 3):"); show(transposed);
console.log("rotated 90 clockwise (4 x 3):"); show(rotated);`,
      explain: `
<ol>
  <li>Transpose: cell <code>(r, c)</code> moves to <code>(c, r)</code>, so a 3 &times; 4 image becomes 4 &times; 3.</li>
  <li>Reversing each row of the transpose gives a clockwise rotation - the same trick photo apps use.</li>
  <li><code>[...row].reverse()</code> copies first, so <code>transposed</code> isn't changed.</li>
  <li><strong>Try it:</strong> rotate counter-clockwise by reversing the <em>order of the rows</em> of the transpose instead.</li>
</ol>`
    },
    {
      title: "Minesweeper: count neighbouring mines",
      code: `const field = [
  ["*", ".", ".", "."],
  [".", ".", "*", "."],
  [".", ".", ".", "."]
];
const rows = field.length, cols = field[0].length;
const DIRS8 = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

const hints = field.map((row, r) => row.map((cell, c) => {
  if (cell === "*") return "*";
  let count = 0;
  for (const [dr, dc] of DIRS8) {
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && field[nr][nc] === "*") count++;
  }
  return String(count);
}));
hints.forEach(row => console.log(row.join(" ")));`,
      explain: `
<ol>
  <li>Eight direction vectors cover every surrounding cell, diagonals included.</li>
  <li>The bounds check runs <em>before</em> <code>field[nr][nc]</code>, so edge cells never read outside the grid.</li>
  <li>Cell (0, 1) touches both mines, so it shows 2.</li>
  <li><strong>Try it:</strong> switch to 4 directions and see which numbers change.</li>
</ol>`
    },
    {
      title: "Flood fill: the paint-bucket tool (DFS)",
      code: `const canvas = [
  "..##....",
  ".#..#...",
  ".#..#.##",
  "..##..#.",
].map(line => line.split(""));

function fill(grid, sr, sc, colour) {
  const target = grid[sr][sc];
  if (target === colour) return 0;
  const stack = [[sr, sc]];
  grid[sr][sc] = colour;
  let painted = 0;
  while (stack.length > 0) {
    const [r, c] = stack.pop();
    painted++;
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && grid[nr][nc] === target) {
        grid[nr][nc] = colour;   // mark as visited by painting it
        stack.push([nr, nc]);
      }
    }
  }
  return painted;
}
console.log("Painted", fill(canvas, 1, 2, "o"), "cells");
canvas.forEach(row => console.log(row.join("")));`,
      explain: `
<ol>
  <li>Start at (1, 2), inside the ring of <code>#</code>. Remember the colour there (<code>"."</code>).</li>
  <li>Pop a cell, then push every neighbour that still has the old colour - painting it immediately so it's never pushed twice.</li>
  <li>The <code>#</code> walls stop the paint, so only the 4 cells inside the ring change.</li>
  <li><strong>Try it:</strong> start at (0, 0) instead - the paint leaks around the outside.</li>
</ol>`
    },
    {
      title: "BFS: shortest walk across an office floor",
      code: `// 0 = open floor, 1 = wall or desk
const floor = [
  [0, 0, 1, 0, 0],
  [1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 1, 0]
];
const rows = floor.length, cols = floor[0].length;
const dist = Array.from({ length: rows }, () => Array(cols).fill(-1));
const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

const queue = [[0, 0]];
dist[0][0] = 0;
for (let head = 0; head < queue.length; head++) {
  const [r, c] = queue[head];
  for (const [dr, dc] of DIRS) {
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && floor[nr][nc] === 0 && dist[nr][nc] === -1) {
      dist[nr][nc] = dist[r][c] + 1;   // one step further than where we came from
      queue.push([nr, nc]);
    }
  }
}
console.log("Steps from entrance to exit:", dist[rows - 1][cols - 1]);
dist.forEach(row => console.log(row.map(d => (d === -1 ? " #" : String(d).padStart(2))).join(" ")));`,
      explain: `
<ol>
  <li>BFS uses a queue, so cells are processed in order of distance: all 1-step cells, then all 2-step cells...</li>
  <li><code>dist</code> doubles as the "visited" marker: -1 means not reached yet.</li>
  <li>The first time BFS reaches a cell is guaranteed to be by a shortest route - here 8 steps.</li>
  <li><strong>Try it:</strong> block the cell at (2, 4) by setting it to 1. The exit becomes unreachable and its distance stays -1.</li>
</ol>`
    },
    {
      title: "Spiral order of a matrix",
      code: `const m = [
  [ 1,  2,  3,  4],
  [ 5,  6,  7,  8],
  [ 9, 10, 11, 12]
];
const out = [];
let top = 0, bottom = m.length - 1, left = 0, right = m[0].length - 1;

while (top <= bottom && left <= right) {
  for (let c = left; c <= right; c++) out.push(m[top][c]);      // top row
  top++;
  for (let r = top; r <= bottom; r++) out.push(m[r][right]);    // right column
  right--;
  if (top <= bottom) {
    for (let c = right; c >= left; c--) out.push(m[bottom][c]); // bottom row, backwards
    bottom--;
  }
  if (left <= right) {
    for (let r = bottom; r >= top; r--) out.push(m[r][left]);   // left column, upwards
    left++;
  }
}
console.log(out.join(" "));`,
      explain: `
<table>
  <tr><th>Side</th><th>Values</th><th>Then</th></tr>
  <tr><td>top row</td><td>1 2 3 4</td><td>top = 1</td></tr>
  <tr><td>right column</td><td>8 12</td><td>right = 2</td></tr>
  <tr><td>bottom row</td><td>11 10 9</td><td>bottom = 1</td></tr>
  <tr><td>left column</td><td>5</td><td>left = 1</td></tr>
  <tr><td>next ring, top row</td><td>6 7</td><td>walls cross &rarr; stop</td></tr>
</table>
<p><strong>Try it:</strong> remove the <code>if (top &lt;= bottom)</code> check and watch 7 and 6 appear twice.</p>`
    },
    {
      title: "3D data: desks across floors",
      code: `// building[floor][row][desk] = 1 if the desk is occupied
const building = [
  [[1, 0, 1], [0, 0, 1]],   // floor 0
  [[1, 1, 1], [0, 1, 0]]    // floor 1
];
const floors = building.length, rows = building[0].length, cols = building[0][0].length;

const flat = [];
for (const floor of building)
  for (const row of floor)
    for (const desk of row) flat.push(desk);
console.log("Flattened:", flat.join(","));

const f = 1, r = 0, c = 2;
const pos = f * (rows * cols) + r * cols + c;
console.log("building[1][0][2] =", building[f][r][c], "| flat[" + pos + "] =", flat[pos]);

building.forEach((floor, i) => {
  let used = 0;
  for (const row of floor) for (const d of row) used += d;
  console.log("Floor", i, "occupancy:", used, "of", rows * cols);
});`,
      explain: `
<ol>
  <li>Three nested loops - one per dimension - flatten the building floor by floor, row by row.</li>
  <li>The position formula skips whole floors (<code>rows * cols</code> each), then whole rows (<code>cols</code> each), then desks.</li>
  <li>Images work the same way: <code>pixel[y][x][channel]</code> with 3 channels for red, green and blue.</li>
  <li><strong>Try it:</strong> compute the position of <code>building[0][1][1]</code> by hand before running.</li>
</ol>`
    }
  ],

  pitfalls: [
    "<code>Array(r).fill(Array(c).fill(0))</code> shares ONE row between all rows. Use <code>Array.from({ length: r }, () =&gt; Array(c).fill(0))</code>.",
    "<code>[...grid]</code> and <code>grid.slice()</code> copy only the outer array - rows are still shared. Use <code>grid.map(row =&gt; [...row])</code> or <code>structuredClone(grid)</code>.",
    "Mixing up the order: it is <code>grid[row][col]</code> (y first, then x), not <code>grid[x][y]</code>.",
    "<code>grid[0].length</code> crashes on an empty grid <code>[]</code>. Check <code>grid.length === 0</code> first.",
    "<code>grid[-1][0]</code> throws a TypeError. Always bounds-check neighbours <em>before</em> indexing.",
    "Forgetting to mark cells as visited in DFS/BFS causes infinite loops.",
    "Summing both diagonals of an odd-sized square counts the centre cell twice.",
    "Assuming every grid is square: transpose and rotate of an <code>r &times; c</code> grid give a <code>c &times; r</code> grid.",
    "Very deep recursion on a big grid can overflow the call stack - an explicit stack or a BFS queue is safer."
  ],

  quiz: [
    {
      q: "What does this print?",
      code: `const g = Array(2).fill(Array(2).fill(0));
g[0][0] = 5;
console.log(JSON.stringify(g));`,
      options: ["[[5,0],[0,0]]", "[[5,0],[5,0]]", "[[5,5],[0,0]]", "An error"],
      answer: 1,
      output: "[[5,0],[5,0]]",
      explain: "<p><code>fill</code> put the <strong>same</strong> row object in both slots, so <code>g[0]</code> and <code>g[1]</code> are one array. Writing through <code>g[0]</code> shows up in <code>g[1]</code> as well. Create rows with <code>Array.from</code> instead.</p>"
    },
    {
      q: "What does this print?",
      code: `const grid = [[1, 2, 3], [4, 5, 6]];
console.log(grid[1][2], grid.length, grid[0].length);`,
      options: ["6 2 3", "5 3 2", "6 3 2", "2 2 3"],
      answer: 0,
      output: "6 2 3",
      explain: "<p><code>grid[1][2]</code> is row 1 (the second row), column 2 (the third value): <strong>6</strong>. There are 2 rows, and each row has 3 columns.</p>"
    },
    {
      q: "You transpose a matrix with <strong>3 rows and 5 columns</strong>. What shape is the result?",
      options: ["3 rows, 5 columns", "5 rows, 3 columns", "5 rows, 5 columns", "15 rows, 1 column"],
      answer: 1,
      explain: "<p>Transposing turns every row into a column, so the dimensions swap: 3 &times; 5 becomes <strong>5 &times; 3</strong>. Build the result with <code>cols</code> rows.</p>"
    },
    {
      q: "What is <code>[[1, 2], [3, 4]]</code> rotated 90&deg; <strong>clockwise</strong>?",
      options: ["<code>[[2, 4], [1, 3]]</code>", "<code>[[3, 1], [4, 2]]</code>", "<code>[[1, 3], [2, 4]]</code>", "<code>[[4, 3], [2, 1]]</code>"],
      answer: 1,
      explain: "<p>Transpose gives <code>[[1, 3], [2, 4]]</code>; reversing each row gives <code>[[3, 1], [4, 2]]</code>. Check: the bottom-left 3 should move to the top-left. Option C is just the transpose; option A is counter-clockwise.</p>"
    },
    {
      q: "You need the <strong>fewest steps</strong> from the entrance to the exit of a maze grid. Which approach fits best?",
      options: ["DFS with recursion", "BFS with a queue", "Sorting the cells", "A single row-major loop"],
      answer: 1,
      explain: "<p>BFS explores in rings of equal distance, so the first time it reaches the exit is via a shortest path. DFS finds <em>a</em> path, but not necessarily the shortest.</p>"
    },
    {
      q: "Using 4-directional movement (up, down, left, right), how many neighbours does a <strong>corner</strong> cell have?",
      options: ["1", "2", "3", "4"],
      answer: 1,
      explain: "<p>Two of the four directions point outside the grid, so only 2 neighbours remain. That's why every neighbour loop needs a bounds check. (With 8 directions, a corner has 3.)</p>"
    },
    {
      q: "What does this print?",
      code: `const cols = 4;
const r = 2, c = 1;
console.log(r * cols + c);`,
      options: ["6", "7", "9", "12"],
      answer: 2,
      output: "9",
      explain: "<p>Counting cells row by row, rows 0 and 1 hold 2 &times; 4 = 8 cells, then column 1 is one more step: 8 + 1 = <strong>9</strong>. This formula maps a 2D cell to a position in a flattened 1D array.</p>"
    }
  ],

  interview: [
    { q: "Why does <code>Array(3).fill(Array(3).fill(0))</code> behave strangely?",
      a: "<p><code>fill</code> evaluates its argument once and puts the <strong>same</strong> array reference in every slot. Changing <code>grid[0][0]</code> changes the one shared row, so every row appears to change. Create rows separately with <code>Array.from({ length: 3 }, () =&gt; Array(3).fill(0))</code>.</p>" },
    { q: "How do you rotate an n &times; n matrix 90&deg; clockwise in place?",
      a: "<p>Transpose it in place (swap <code>m[i][j]</code> with <code>m[j][i]</code> for <code>j &gt; i</code>), then reverse each row. O(n<sup>2</sup>) time, O(1) extra space. For counter-clockwise, transpose then reverse the order of the rows.</p>" },
    { q: "How do you search a matrix whose rows and columns are both sorted?",
      a: "<p>Start at the top-right corner. If the value is too big, move left (everything below it is bigger too); if too small, move down. Each step rules out a row or a column: O(rows + cols).</p>" },
    { q: "How do you count islands in a grid of 0s and 1s?",
      a: "<p>Scan every cell. When you find unvisited land, count a new island and flood-fill it with DFS or BFS through its 4 neighbours, marking each cell visited. Every cell is processed once: O(rows &times; cols).</p>" },
    { q: "When would you use BFS instead of DFS on a grid?",
      a: "<p>When you need the <strong>shortest path</strong> in steps: BFS reaches cells in order of distance. DFS is simpler for \"are these connected?\" and counting regions, but its first path isn't necessarily the shortest.</p>" },
    { q: "What's the cost of multiplying two n &times; n matrices with the standard algorithm?",
      a: "<p>O(n<sup>3</sup>): there are n<sup>2</sup> result cells and each needs n multiplications. The inner dimensions must match: <code>(n &times; m)</code> times <code>(m &times; p)</code> gives <code>(n &times; p)</code>.</p>" }
  ],

  exercises: [
    {
      id: "make-grid",
      title: "makeGrid",
      difficulty: "easy",
      prompt: "<p>Return a grid with <code>rows</code> rows and <code>cols</code> columns where every cell is <code>fill</code>. Each row must be a <strong>separate</strong> array - changing one cell must not change other rows.</p><p><code>makeGrid(2, 3, 0) &rarr; [[0, 0, 0], [0, 0, 0]]</code><br><code>makeGrid(1, 1, \"x\") &rarr; [[\"x\"]]</code><br><code>makeGrid(0, 5, 1) &rarr; []</code></p>",
      starter: `function makeGrid(rows, cols, fill) {
  // your code here
}`,
      solution: `function makeGrid(rows, cols, fill) {
  // Array.from runs the arrow function once per row,
  // so every row is a brand-new array (no aliasing).
  return Array.from({ length: rows }, () => Array(cols).fill(fill));
  // O(rows * cols) time and space
}`,
      hint: "<code>Array(rows).fill(someRow)</code> reuses one row object - that's the bug to avoid. Use <code>Array.from({ length: rows }, () =&gt; ...)</code>, or a <code>for</code> loop that creates and pushes a new row each time.",
      tests: [
        { expr: "makeGrid(2, 3, 0)", expected: [[0, 0, 0], [0, 0, 0]] },
        { expr: "makeGrid(1, 1, \"x\")", expected: [["x"]], label: "1 x 1" },
        { expr: "makeGrid(0, 5, 1)", expected: [], label: "zero rows -> []" },
        { expr: "makeGrid(2, 0, 1)", expected: [[], []], label: "zero columns" },
        { code: "const g = makeGrid(3, 2, 0); g[0][0] = 9; return g;", expected: [[9, 0], [0, 0], [0, 0]], label: "rows are independent (no aliasing)" }
      ]
    },
    {
      id: "line-sums",
      title: "lineSums (rows and columns)",
      difficulty: "easy",
      prompt: "<p>Return an object <code>{ rows, cols }</code> where <code>rows[r]</code> is the sum of row <code>r</code> and <code>cols[c]</code> is the sum of column <code>c</code>. The grid is rectangular. For an empty grid return <code>{ rows: [], cols: [] }</code>. Do not modify the grid.</p><p><code>lineSums([[1, 2, 3], [4, 5, 6]]) &rarr; { rows: [6, 15], cols: [5, 7, 9] }</code><br><code>lineSums([[1], [2], [3]]) &rarr; { rows: [1, 2, 3], cols: [6] }</code><br><code>lineSums([]) &rarr; { rows: [], cols: [] }</code></p>",
      starter: `function lineSums(grid) {
  // your code here
}`,
      solution: `function lineSums(grid) {
  const rows = [];
  // One running total per column, all starting at 0
  const cols = grid.length > 0 ? Array(grid[0].length).fill(0) : [];

  for (let r = 0; r < grid.length; r++) {
    let total = 0;                     // reset for each new row
    for (let c = 0; c < grid[r].length; c++) {
      total += grid[r][c];             // add to this row's total
      cols[c] += grid[r][c];           // and to this column's total
    }
    rows.push(total);
  }
  return { rows, cols };               // O(rows * cols)
}`,
      hint: "Prepare <code>cols</code> as an array of zeros with one slot per column (careful: an empty grid has no <code>grid[0]</code>). In the nested loop, add each cell both to the current row's total and to <code>cols[c]</code>.",
      tests: [
        { expr: "lineSums([[1, 2, 3], [4, 5, 6]])", expected: { rows: [6, 15], cols: [5, 7, 9] } },
        { expr: "lineSums([[7]])", expected: { rows: [7], cols: [7] }, label: "1 x 1" },
        { expr: "lineSums([])", expected: { rows: [], cols: [] }, label: "empty grid" },
        { expr: "lineSums([[1], [2], [3]])", expected: { rows: [1, 2, 3], cols: [6] }, label: "single column" },
        { expr: "lineSums([[-1, 1], [2, -5]])", expected: { rows: [0, -3], cols: [1, -4] }, label: "negatives" },
        { code: "const g = [[1, 2], [3, 4]]; lineSums(g); return g;", expected: [[1, 2], [3, 4]], label: "grid is not modified" }
      ]
    },
    {
      id: "transpose",
      title: "transpose",
      difficulty: "easy",
      prompt: "<p>Return a <strong>new</strong> matrix where rows become columns: <code>result[c][r] = m[r][c]</code>. It must work for any rectangular matrix. Do not modify <code>m</code>.</p><p><code>transpose([[1, 2, 3], [4, 5, 6]]) &rarr; [[1, 4], [2, 5], [3, 6]]</code><br><code>transpose([[1, 2], [3, 4]]) &rarr; [[1, 3], [2, 4]]</code><br><code>transpose([]) &rarr; []</code></p>",
      starter: `function transpose(m) {
  // your code here
}`,
      solution: `function transpose(m) {
  if (m.length === 0) return [];
  const rows = m.length;
  const cols = m[0].length;

  // The result is cols x rows
  const result = Array.from({ length: cols }, () => Array(rows));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result[c][r] = m[r][c];   // swap the two indexes
    }
  }
  return result;                // O(rows * cols)
}`,
      hint: "The result has <code>m[0].length</code> rows and <code>m.length</code> columns. Create it first, then copy each cell <code>(r, c)</code> to <code>(c, r)</code>.",
      explanation: "<p>The common mistake is creating a result the same shape as the input, which breaks for non-square matrices. Think of the shape first: a 2 &times; 3 input needs a 3 &times; 2 output.</p>",
      tests: [
        { expr: "transpose([[1, 2, 3], [4, 5, 6]])", expected: [[1, 4], [2, 5], [3, 6]], label: "2 x 3 becomes 3 x 2" },
        { expr: "transpose([[1, 2], [3, 4]])", expected: [[1, 3], [2, 4]], label: "square" },
        { expr: "transpose([[5]])", expected: [[5]], label: "1 x 1" },
        { expr: "transpose([[1, 2, 3]])", expected: [[1], [2], [3]], label: "single row" },
        { expr: "transpose([])", expected: [], label: "empty" },
        { code: "const m = [[1, 2], [3, 4]]; transpose(m); return m;", expected: [[1, 2], [3, 4]], label: "input is not modified" }
      ]
    },
    {
      id: "diagonal-sum",
      title: "diagonalSum",
      difficulty: "easy",
      prompt: "<p>Given a square matrix, return the sum of the main diagonal plus the anti-diagonal. If the size is odd, the centre cell is on both diagonals - count it <strong>only once</strong>. An empty matrix gives <code>0</code>.</p><pre>1 2 3\n4 5 6      1 + 5 + 9 + 3 + 7 = 25   (5 counted once)\n7 8 9</pre><p><code>diagonalSum([[1, 2], [3, 4]]) &rarr; 10</code> &nbsp; <code>diagonalSum([[5]]) &rarr; 5</code></p>",
      starter: `function diagonalSum(m) {
  // your code here
}`,
      solution: `function diagonalSum(m) {
  const n = m.length;
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += m[i][i];                 // main diagonal: column = row
    const j = n - 1 - i;              // anti-diagonal column for this row
    if (j !== i) total += m[i][j];    // skip the centre (already counted)
  }
  return total;                       // O(n) - one pass down the rows
}`,
      hint: "On row <code>i</code>, the main diagonal is at column <code>i</code> and the anti-diagonal at column <code>n - 1 - i</code>. Those are the same column only at the centre of an odd-sized matrix.",
      tests: [
        { expr: "diagonalSum([[1, 2, 3], [4, 5, 6], [7, 8, 9]])", expected: 25, label: "odd size: centre counted once" },
        { expr: "diagonalSum([[1, 2], [3, 4]])", expected: 10, label: "even size: no shared cell" },
        { expr: "diagonalSum([[5]])", expected: 5, label: "1 x 1" },
        { expr: "diagonalSum([])", expected: 0, label: "empty" },
        { expr: "diagonalSum([[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]])", expected: 8 },
        { expr: "diagonalSum([[-1, 0, 2], [0, -3, 0], [4, 0, 5]])", expected: 7, label: "negatives" }
      ]
    },
    {
      id: "rotate-90",
      title: "rotate90 (clockwise)",
      difficulty: "medium",
      prompt: "<p>Return a <strong>new</strong> matrix rotated 90&deg; clockwise (like rotating a photo). It may be rectangular: an <code>r &times; c</code> input gives a <code>c &times; r</code> result. Do not modify <code>m</code>.</p><pre>1 2 3        7 4 1\n4 5 6   -&gt;   8 5 2\n7 8 9        9 6 3</pre><p><code>rotate90([[1, 2, 3], [4, 5, 6]]) &rarr; [[4, 1], [5, 2], [6, 3]]</code> &nbsp; <code>rotate90([]) &rarr; []</code></p>",
      starter: `function rotate90(m) {
  // your code here
}`,
      solution: `function rotate90(m) {
  if (m.length === 0) return [];
  const rows = m.length;
  const cols = m[0].length;

  // Result is cols x rows
  const result = Array.from({ length: cols }, () => Array(rows));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Row r of the input becomes column (rows - 1 - r) of the output
      result[c][rows - 1 - r] = m[r][c];
    }
  }
  return result;   // O(rows * cols)
}`,
      hint: "Two routes: (1) transpose, then reverse each row of the result; or (2) place each cell directly - <code>(r, c)</code> goes to <code>(c, rows - 1 - r)</code>. Check with the corner: the bottom-left value should end up top-left.",
      explanation: "<p>Watch where the first row goes: <code>1 2 3</code> becomes the <em>last column</em>, read top to bottom. That's why the new column index is <code>rows - 1 - r</code>. Rotating four times must give back the original - a handy self-test.</p>",
      tests: [
        { expr: "rotate90([[1, 2, 3], [4, 5, 6], [7, 8, 9]])", expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] },
        { expr: "rotate90([[1, 2], [3, 4]])", expected: [[3, 1], [4, 2]] },
        { expr: "rotate90([[1, 2, 3], [4, 5, 6]])", expected: [[4, 1], [5, 2], [6, 3]], label: "rectangular 2 x 3 -> 3 x 2" },
        { expr: "rotate90([[1]])", expected: [[1]], label: "1 x 1" },
        { expr: "rotate90([])", expected: [], label: "empty" },
        { code: "const m = [[1, 2], [3, 4]]; let x = m; for (let i = 0; i < 4; i++) x = rotate90(x); return x;", expected: [[1, 2], [3, 4]], label: "four rotations = original" },
        { code: "const m = [[1, 2], [3, 4]]; rotate90(m); return m;", expected: [[1, 2], [3, 4]], label: "input is not modified" }
      ]
    },
    {
      id: "spiral-order",
      title: "spiralOrder",
      difficulty: "medium",
      prompt: "<p>Return all values of a rectangular matrix in <strong>clockwise spiral</strong> order, starting at the top-left. An empty matrix gives <code>[]</code>.</p><pre>1  2  3  4\n5  6  7  8     -&gt; [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]\n9 10 11 12</pre><p><code>spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]]) &rarr; [1, 2, 3, 6, 9, 8, 7, 4, 5]</code><br><code>spiralOrder([[1], [2], [3]]) &rarr; [1, 2, 3]</code></p>",
      starter: `function spiralOrder(m) {
  // your code here
}`,
      solution: `function spiralOrder(m) {
  const out = [];
  if (m.length === 0) return out;

  // Four walls that close in after each side is walked
  let top = 0, bottom = m.length - 1;
  let left = 0, right = m[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) out.push(m[top][c]);      // top row, left to right
    top++;
    for (let r = top; r <= bottom; r++) out.push(m[r][right]);    // right column, downwards
    right--;
    if (top <= bottom) {                                          // a row is still left?
      for (let c = right; c >= left; c--) out.push(m[bottom][c]); // bottom row, right to left
      bottom--;
    }
    if (left <= right) {                                          // a column is still left?
      for (let r = bottom; r >= top; r--) out.push(m[r][left]);   // left column, upwards
      left++;
    }
  }
  return out;   // every cell visited once: O(rows * cols)
}`,
      hint: "Keep <code>top</code>, <code>bottom</code>, <code>left</code>, <code>right</code>. Walk the top row, then the right column, then the bottom row backwards, then the left column upwards - moving one wall inwards after each. Re-check the walls before the bottom row and the left column.",
      explanation: "<p>The two extra <code>if</code> checks handle the leftover single row or single column in the middle. Without them, a 3 &times; 4 matrix prints <code>6 7</code> and then walks back over <code>7 6</code>. Test tall, wide and single-row shapes to be sure.</p>",
      tests: [
        { expr: "spiralOrder([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])", expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
        { expr: "spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]])", expected: [1, 2, 3, 6, 9, 8, 7, 4, 5], label: "square" },
        { expr: "spiralOrder([[1, 2, 3]])", expected: [1, 2, 3], label: "single row" },
        { expr: "spiralOrder([[1], [2], [3]])", expected: [1, 2, 3], label: "single column" },
        { expr: "spiralOrder([[7]])", expected: [7], label: "1 x 1" },
        { expr: "spiralOrder([])", expected: [], label: "empty" },
        { expr: "spiralOrder([[1, 2], [3, 4], [5, 6], [7, 8]])", expected: [1, 2, 4, 6, 8, 7, 5, 3], label: "tall rectangle" }
      ]
    },
    {
      id: "search-sorted-matrix",
      title: "searchSortedMatrix",
      difficulty: "medium",
      prompt: "<p>Every row is sorted left to right and every column is sorted top to bottom. Return <code>true</code> if <code>target</code> is in the matrix. Aim for O(rows + cols) - don't check every cell.</p><pre> 1  4  7 11\n 2  5  8 12     target 5  -&gt; true\n 3  6  9 16     target 15 -&gt; false\n10 13 14 17</pre><p><code>searchSortedMatrix([[1, 3, 5]], 3) &rarr; true</code> &nbsp; <code>searchSortedMatrix([], 1) &rarr; false</code></p>",
      starter: `function searchSortedMatrix(m, target) {
  // your code here
}`,
      solution: `function searchSortedMatrix(m, target) {
  if (m.length === 0 || m[0].length === 0) return false;

  // Start at the top-right corner:
  // everything to the LEFT is smaller, everything BELOW is bigger.
  let r = 0;
  let c = m[0].length - 1;
  while (r < m.length && c >= 0) {
    const value = m[r][c];
    if (value === target) return true;
    if (value > target) {
      c--;   // too big: this whole column (below here) is too big as well
    } else {
      r++;   // too small: this whole row (left of here) is too small as well
    }
  }
  return false;   // walked off the grid. O(rows + cols)
}`,
      hint: "Start at the <strong>top-right</strong> corner. If that value is bigger than the target, can the target be anywhere in this column? If it's smaller, can the target be in this row? Each comparison lets you drop a whole row or column.",
      explanation: "<p>This is the \"staircase\" search. From the top-right, one direction makes values smaller (left) and the other makes them bigger (down), so every comparison has a clear move. At most <code>rows + cols</code> steps. (Starting top-left doesn't work: both moves make values bigger.)</p>",
      tests: [
        { code: "const m = [[1, 4, 7, 11], [2, 5, 8, 12], [3, 6, 9, 16], [10, 13, 14, 17]]; return [5, 13, 1, 17, 15, 0, 20].map(t => searchSortedMatrix(m, t));", expected: [true, true, true, true, false, false, false], label: "4 x 4: hits, corners and misses" },
        { expr: "searchSortedMatrix([[1, 3, 5]], 3)", expected: true, label: "single row" },
        { expr: "searchSortedMatrix([[1], [3], [5]], 4)", expected: false, label: "single column" },
        { expr: "searchSortedMatrix([], 1)", expected: false, label: "empty matrix" },
        { expr: "searchSortedMatrix([[]], 1)", expected: false, label: "matrix with an empty row" },
        { expr: "searchSortedMatrix([[-5, -2], [-1, 0]], -2)", expected: true, label: "negatives" },
        { code: "const n = 2000; const m = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => r + c)); let hits = 0; for (let k = 0; k < 2000; k++) if (searchSortedMatrix(m, -1)) hits++; return hits;", expected: 0, maxMs: 1000, label: "O(rows + cols), not O(rows * cols)" }
      ]
    },
    {
      id: "count-islands",
      title: "countIslands",
      difficulty: "hard",
      prompt: "<p>The grid contains <code>1</code> (land) and <code>0</code> (water). An island is a group of land cells connected <strong>up, down, left or right</strong> (not diagonally). Return the number of islands. Do <strong>not</strong> modify the grid.</p><pre>1 1 0 0 0\n1 1 0 0 0      -&gt; 3\n0 0 1 0 0\n0 0 0 1 1</pre><p><code>countIslands([[1, 0, 1], [0, 1, 0], [1, 0, 1]]) &rarr; 5</code> (diagonals don't connect)<br><code>countIslands([[0, 0], [0, 0]]) &rarr; 0</code></p>",
      starter: `function countIslands(grid) {
  // your code here
}`,
      solution: `function countIslands(grid) {
  if (grid.length === 0) return 0;
  const rows = grid.length, cols = grid[0].length;

  // A separate "seen" grid so we never change the caller's data
  const seen = Array.from({ length: rows }, () => Array(cols).fill(false));
  const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  let islands = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== 1 || seen[r][c]) continue;   // water, or already counted

      // New island found! Visit all of its land with DFS (explicit stack).
      islands++;
      seen[r][c] = true;
      const stack = [[r, c]];
      while (stack.length > 0) {
        const [cr, cc] = stack.pop();
        for (const [dr, dc] of DIRS) {
          const nr = cr + dr, nc = cc + dc;
          const inside = nr >= 0 && nr < rows && nc >= 0 && nc < cols;
          if (inside && grid[nr][nc] === 1 && !seen[nr][nc]) {
            seen[nr][nc] = true;   // mark when pushing, so no cell is pushed twice
            stack.push([nr, nc]);
          }
        }
      }
    }
  }
  return islands;   // each cell handled once: O(rows * cols)
}`,
      hint: "Loop over every cell. When you hit land you haven't seen yet, add 1 to the count, then visit its whole island (DFS with a stack, or BFS with a queue), marking cells in a separate <code>seen</code> grid. Use an explicit stack rather than recursion so big islands don't overflow the call stack.",
      explanation: "<p>This is <strong>flood fill</strong>: the grid is a map where each land cell links to its land neighbours, and counting islands means counting separate connected groups. The outer loop finds a starting point; the inner search swallows the whole island so it's never counted twice. A separate <code>seen</code> grid (instead of overwriting 1s with 0s) keeps the input unchanged.</p>",
      tests: [
        { expr: "countIslands([[1, 1, 0, 0, 0], [1, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 1]])", expected: 3 },
        { expr: "countIslands([[1, 0, 1], [0, 1, 0], [1, 0, 1]])", expected: 5, label: "diagonals do not connect" },
        { expr: "countIslands([[0, 0], [0, 0]])", expected: 0, label: "all water" },
        { expr: "countIslands([[1, 1], [1, 1]])", expected: 1, label: "all land" },
        { expr: "countIslands([])", expected: 0, label: "empty grid" },
        { expr: "countIslands([[1]])", expected: 1, label: "1 x 1 land" },
        { expr: "countIslands([[1, 1, 1], [0, 0, 1], [1, 1, 1]])", expected: 1, label: "U-shaped island" },
        { code: "const g = [[1, 0], [0, 1]]; countIslands(g); return g;", expected: [[1, 0], [0, 1]], label: "grid is not modified" },
        { code: "const g = Array.from({ length: 300 }, () => Array(300).fill(1)); return countIslands(g);", expected: 1, maxMs: 2000, label: "large single island (watch recursion depth)" }
      ]
    },
    {
      id: "matrix-multiply",
      title: "matrixMultiply",
      difficulty: "medium",
      prompt: "<p>Multiply <code>A</code> (<code>n &times; m</code>) by <code>B</code> (<code>m &times; p</code>) and return the <code>n &times; p</code> result, where <code>result[i][j]</code> = sum over <code>k</code> of <code>A[i][k] * B[k][j]</code>. If the inner sizes don't match, or either matrix is empty, return <code>null</code>. Do not modify the inputs.</p><pre>[1 2]   [5 6]     [1*5+2*7  1*6+2*8]   [19 22]\n[3 4] x [7 8]  =  [3*5+4*7  3*6+4*8] = [43 50]</pre><p><code>matrixMultiply([[1, 2, 3]], [[4], [5], [6]]) &rarr; [[32]]</code><br><code>matrixMultiply([[1, 2]], [[1, 2]]) &rarr; null</code> (1 &times; 2 times 1 &times; 2 doesn't fit)</p>",
      starter: `function matrixMultiply(A, B) {
  // your code here
}`,
      solution: `function matrixMultiply(A, B) {
  // Columns of A must equal rows of B
  if (A.length === 0 || B.length === 0 || A[0].length !== B.length) return null;

  const n = A.length;      // rows in the result
  const m = B.length;      // the shared ("inner") size
  const p = B[0].length;   // columns in the result
  const result = Array.from({ length: n }, () => Array(p).fill(0));

  for (let i = 0; i < n; i++) {          // each row of A
    for (let j = 0; j < p; j++) {        // each column of B
      let sum = 0;
      for (let k = 0; k < m; k++) {      // walk along the row and down the column together
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;   // O(n * m * p)
}`,
      hint: "First check the shapes: <code>A[0].length</code> must equal <code>B.length</code>. Then use three loops: <code>i</code> over rows of A, <code>j</code> over columns of B, and <code>k</code> along the shared size, adding <code>A[i][k] * B[k][j]</code>.",
      explanation: "<p>Each result cell is a <em>dot product</em>: pair up row <code>i</code> of A with column <code>j</code> of B, multiply each pair and add. The order matters - <code>A &times; B</code> is usually not equal to <code>B &times; A</code>, and may not even be possible.</p>",
      tests: [
        { expr: "matrixMultiply([[1, 2], [3, 4]], [[5, 6], [7, 8]])", expected: [[19, 22], [43, 50]] },
        { expr: "matrixMultiply([[1, 2, 3]], [[4], [5], [6]])", expected: [[32]], label: "1x3 times 3x1 = 1x1" },
        { expr: "matrixMultiply([[4], [5]], [[1, 2]])", expected: [[4, 8], [5, 10]], label: "2x1 times 1x2 = 2x2" },
        { expr: "matrixMultiply([[1, 2], [3, 4]], [[1, 0], [0, 1]])", expected: [[1, 2], [3, 4]], label: "identity matrix" },
        { expr: "matrixMultiply([[1, 2]], [[1, 2]])", expected: null, label: "incompatible sizes -> null" },
        { expr: "matrixMultiply([], [[1]])", expected: null, label: "empty input -> null" },
        { expr: "matrixMultiply([[-1, 2]], [[3], [-4]])", expected: [[-11]], label: "negatives" },
        { code: "const A = [[1, 2], [3, 4]], B = [[5, 6], [7, 8]]; matrixMultiply(A, B); return [A, B];", expected: [[[1, 2], [3, 4]], [[5, 6], [7, 8]]], label: "inputs are not modified" }
      ]
    },
    {
      id: "flatten-3d",
      title: "flatten3D",
      difficulty: "easy",
      prompt: "<p>Flatten a 3D array <code>cube[layer][row][col]</code> into a 1D array: layer by layer, row by row, left to right. Use loops - no <code>flat()</code>. Do not modify the input.</p><p><code>flatten3D([[[1, 2], [3, 4]], [[5, 6], [7, 8]]]) &rarr; [1, 2, 3, 4, 5, 6, 7, 8]</code><br><code>flatten3D([[], [[1, 2]]]) &rarr; [1, 2]</code> (an empty layer adds nothing)<br><code>flatten3D([]) &rarr; []</code></p>",
      starter: `function flatten3D(cube) {
  // your code here
}`,
      solution: `function flatten3D(cube) {
  const out = [];
  // One loop per dimension, outermost first
  for (const layer of cube) {        // each layer (floor)
    for (const row of layer) {       // each row in that layer
      for (const value of row) {     // each value in that row
        out.push(value);
      }
    }
  }
  return out;   // O(total number of values)
}`,
      hint: "Three nested <code>for...of</code> loops: layers, then rows, then values. Push each value onto a result array. Empty layers or rows simply produce no iterations.",
      forbid: [{ pattern: "\\.flat\\(|\\.flatMap\\(", message: "Use nested loops - no flat() or flatMap()." }],
      tests: [
        { expr: "flatten3D([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])", expected: [1, 2, 3, 4, 5, 6, 7, 8] },
        { expr: "flatten3D([[[1]]])", expected: [1], label: "1 x 1 x 1" },
        { expr: "flatten3D([])", expected: [], label: "empty" },
        { expr: "flatten3D([[], [[1, 2]]])", expected: [1, 2], label: "empty layer" },
        { expr: "flatten3D([[[1, 2, 3]], [[4, 5, 6]], [[7, 8, 9]]])", expected: [1, 2, 3, 4, 5, 6, 7, 8, 9], label: "3 layers of one row" },
        { code: "const c = [[[1, 2]], [[3, 4]]]; flatten3D(c); return c;", expected: [[[1, 2]], [[3, 4]]], label: "input is not modified" }
      ]
    }
  ],

  takeaways: [
    "A 2D array is an <strong>array of rows</strong>: <code>grid[row][col]</code>, rows = <code>grid.length</code>, cols = <code>grid[0].length</code>.",
    "Create grids with <code>Array.from({ length: r }, () =&gt; Array(c).fill(0))</code> - never <code>Array(r).fill(row)</code>.",
    "Transpose swaps <code>(r, c)</code> to <code>(c, r)</code>; rotate clockwise = transpose + reverse each row.",
    "Direction vectors + a bounds check give you every neighbour safely.",
    "Grid maps are graphs: <strong>DFS</strong> for flood fill and islands, <strong>BFS</strong> for shortest paths - and always mark cells visited.",
    "Edge cases to test: empty grid, one row, one column, non-square shapes."
  ]
});
