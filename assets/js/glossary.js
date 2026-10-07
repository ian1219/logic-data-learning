/* Glossary data: { term, aka?, definition (html), example? (code), lang? ("js"|"sql"), lesson? ("NN") } */
window.LDL = window.LDL || {};
LDL.glossary = [
  /* ---------- 01 Logic & Operators ---------- */
  { term: "Boolean", aka: "bool", definition: "A value that is either <code>true</code> or <code>false</code>. Comparisons like <code>age &gt;= 18</code> produce booleans.", example: "const isAdult = age >= 18;", lesson: "01" },
  { term: "Logical operators", aka: "AND, OR, NOT", definition: "Operators that combine booleans: <code>&amp;&amp;</code> (AND - both true), <code>||</code> (OR - at least one true) and <code>!</code> (NOT - flips the value).", example: "const freeShipping = total >= 50 || isMember;", lesson: "01" },
  { term: "De Morgan's law", definition: "Rules for negating combined conditions: <code>!(a &amp;&amp; b)</code> equals <code>!a || !b</code>, and <code>!(a || b)</code> equals <code>!a &amp;&amp; !b</code>.", example: "!(age >= 18 && hasId)  // same as: age < 18 || !hasId", lesson: "01" },
  { term: "Short-circuit evaluation", definition: "JavaScript stops evaluating <code>a &amp;&amp; b</code> as soon as <code>a</code> is false, and <code>a || b</code> as soon as <code>a</code> is true. Used for safe checks and default values.", example: "const name = input || 'Guest';", lesson: "01" },
  { term: "Truthy / falsy", definition: "How non-boolean values behave in a condition. The falsy values are <code>false, 0, -0, 0n, \"\", null, undefined, NaN</code>; everything else (including <code>[]</code> and <code>\"0\"</code>) is truthy.", example: "if ([]) console.log('runs - an empty array is truthy');", lesson: "01" },
  { term: "Modulo", aka: "remainder, %", definition: "The <code>%</code> operator gives the remainder after division. Used for even/odd checks, divisibility, last digits and wrapping around.", example: "17 % 5   // 2\nn % 2 === 0   // is n even?", lesson: "01" },
  { term: "Strict equality", aka: "===", definition: "<code>===</code> compares value <em>and</em> type without converting anything. <code>==</code> converts types first, which causes surprises like <code>0 == \"\"</code> being true.", example: "5 === '5'  // false\n5 == '5'   // true", lesson: "01" },

  /* ---------- 02 Conditionals & Loops ---------- */
  { term: "Variable", definition: "A named box that stores a value. In JavaScript use <code>const</code> when it won't be reassigned and <code>let</code> when it will.", example: "const taxRate = 0.2;\nlet total = 0;", lesson: "02" },
  { term: "Conditional", aka: "if / else, branching", definition: "Code that runs only when a condition is true. <code>if / else if / else</code> checks conditions top to bottom and runs the first match.", example: "if (score >= 90) grade = 'A';\nelse if (score >= 80) grade = 'B';\nelse grade = 'C';", lesson: "02" },
  { term: "Loop", definition: "Code that repeats. <code>for</code> is used when you know how many times, <code>while</code> when you repeat until a condition changes, and <code>for...of</code> to visit each item of a collection.", example: "for (let i = 1; i <= 3; i++) console.log(i);", lesson: "02" },
  { term: "Iteration", definition: "One pass through the body of a loop - or, more generally, the act of visiting items one by one.", lesson: "02" },
  { term: "Nested loop", definition: "A loop inside another loop. The inner loop runs completely for every iteration of the outer loop, so two loops over n items do n &times; n work.", example: "for (let r = 0; r < 3; r++)\n  for (let c = 0; c < 3; c++) console.log(r, c);", lesson: "02" },

  /* ---------- 03 Functions & Recursion ---------- */
  { term: "Function", definition: "A named, reusable block of code that takes inputs (parameters) and usually returns an output.", example: "function add(a, b) {\n  return a + b;\n}", lesson: "03" },
  { term: "Parameter", definition: "A variable listed in a function's definition that receives a value when the function is called.", example: "function greet(name) { ... }   // name is a parameter", lesson: "03" },
  { term: "Argument", definition: "The actual value passed into a function when you call it.", example: "greet('Maria');   // 'Maria' is the argument", lesson: "03" },
  { term: "Return value", definition: "The value a function sends back to its caller with <code>return</code>. A function without <code>return</code> gives back <code>undefined</code>. Printing with <code>console.log</code> is not returning.", example: "const total = add(2, 3);   // 5", lesson: "03" },
  { term: "Scope", definition: "Where a variable can be seen. <code>let</code> and <code>const</code> are block-scoped: they only exist inside the <code>{ }</code> where they are declared.", lesson: "03" },
  { term: "Closure", definition: "A function that remembers variables from the place where it was created, even after that outer function has finished.", example: "function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}", lesson: "03" },
  { term: "Callback", definition: "A function passed to another function to be called later, for example the function you give to <code>map</code> or <code>setTimeout</code>.", example: "[1, 2, 3].map(x => x * 2);   // x => x * 2 is the callback", lesson: "03" },
  { term: "Higher-order function", definition: "A function that takes a function as an argument or returns one. <code>map</code>, <code>filter</code> and <code>reduce</code> are examples.", lesson: "03" },
  { term: "Recursion", definition: "When a function calls itself on a smaller version of the same problem until it reaches a case simple enough to answer directly.", example: "function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}", lesson: "03" },
  { term: "Base case", definition: "The stopping condition of a recursive function - the input small enough to answer without another recursive call. Missing it causes a stack overflow.", lesson: "03" },
  { term: "Call stack", definition: "The list of function calls currently in progress. Each call is pushed on top; when it returns it is popped off.", lesson: "03" },
  { term: "Memoization", definition: "Caching the results of a function call so repeated calls with the same input are answered instantly instead of recomputed.", example: "const memo = new Map();\nfunction fib(n) {\n  if (n < 2) return n;\n  if (!memo.has(n)) memo.set(n, fib(n - 1) + fib(n - 2));\n  return memo.get(n);\n}", lesson: "03" },

  /* ---------- 04 Arrays ---------- */
  { term: "Array", aka: "list", definition: "An ordered collection of values stored under one name, where each value is reached by its position (index).", example: "const temps = [18, 21, 25];", lesson: "04" },
  { term: "Index", definition: "The position of an element in an array or string. Indexes start at 0, so the last index is <code>length - 1</code>.", example: "temps[0]                  // first\ntemps[temps.length - 1]   // last", lesson: "04" },
  { term: "Slice vs splice", definition: "<code>slice(start, end)</code> returns a copy of part of an array and leaves it unchanged. <code>splice(start, count, ...items)</code> removes or inserts items in the original array.", example: "a.slice(1, 3);   // copy\na.splice(1, 2);  // remove 2 items from index 1", lesson: "04" },
  { term: "Reference", aka: "aliasing", definition: "Variables hold a reference (an address) to an array or object, not the thing itself. Two variables with the same reference are aliases: changing one changes both.", example: "const b = a;        // alias\nconst c = [...a];   // copy", lesson: "04" },
  { term: "Shallow copy vs deep copy", definition: "A shallow copy (<code>[...a]</code>, <code>slice()</code>) duplicates only the outer array, so nested arrays are still shared. A deep copy (<code>structuredClone</code>) duplicates every level.", lesson: "04" },
  { term: "In place", definition: "Changing the input data directly instead of building a new copy. In-place algorithms use O(1) extra memory.", lesson: "04" },
  { term: "map / filter / reduce", definition: "Array methods that return something new: <code>map</code> transforms each element, <code>filter</code> keeps those that pass a test, <code>reduce</code> combines all elements into one value.", example: "const total = prices.reduce((sum, p) => sum + p, 0);", lesson: "04" },
  { term: "Linear scan", definition: "Walking through a collection once from start to end, keeping track of something (max, total, count). O(n).", lesson: "04" },
  { term: "Two pointers", definition: "A technique using two index variables that move through an array - often from both ends towards the middle - to find pairs or rearrange data in O(n).", example: "let left = 0, right = nums.length - 1;\nwhile (left < right) { ... }", lesson: "04" },
  { term: "Sliding window", definition: "Tracking a block of consecutive elements that moves one step at a time: add the element that enters and subtract the one that leaves, instead of recomputing the whole block.", example: "windowSum += nums[i] - nums[i - k];", lesson: "04" },
  { term: "Prefix sum", aka: "running total, cumulative sum", definition: "An array where entry <code>i</code> holds the sum of the first <code>i</code> elements. Any range sum becomes one subtraction: <code>prefix[j + 1] - prefix[i]</code>.", lesson: "04" },
  { term: "Kadane's algorithm", definition: "An O(n) method for the maximum sum of a contiguous subarray: at each element, either extend the current run or start a new one, and remember the best.", lesson: "04" },

  /* ---------- 05 Multi-dimensional Arrays ---------- */
  { term: "2D array", aka: "matrix, grid", definition: "An array of arrays, where each inner array is a row. A cell is reached with two indexes: <code>grid[row][col]</code>.", example: "const grid = Array.from({ length: 3 }, () => Array(4).fill(0));", lesson: "05" },
  { term: "Row-major order", definition: "Visiting a grid row by row, left to right - like reading a book. A cell's position in this order is <code>row * cols + col</code>.", lesson: "05" },
  { term: "Transpose", definition: "Flipping a matrix over its main diagonal so rows become columns: cell <code>(r, c)</code> moves to <code>(c, r)</code>. An r &times; c matrix becomes c &times; r.", lesson: "05" },
  { term: "Direction vectors", definition: "A list of (row change, column change) pairs used to visit a cell's neighbours in a loop instead of writing a separate check for each direction.", example: "const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];", lesson: "05" },
  { term: "Flood fill", definition: "Starting from one cell and spreading to every connected cell with the same value - how the paint-bucket tool and island counting work.", lesson: "05" },
  { term: "DFS", aka: "depth-first search", definition: "Exploring a grid or graph by going as deep as possible along one path before backtracking. Uses a stack or recursion.", lesson: "05" },
  { term: "BFS", aka: "breadth-first search", definition: "Exploring a grid or graph level by level using a queue. The first time BFS reaches a cell is via a shortest path (in steps).", lesson: "05" },

  /* ---------- 06 Strings ---------- */
  { term: "String", definition: "A sequence of characters, such as text. In JavaScript strings are written in quotes and characters are reached by index.", example: "const word = 'hello';\nword[0]   // 'h'", lesson: "06" },
  { term: "Immutable", definition: "Cannot be changed after creation. JavaScript strings are immutable: methods like <code>toUpperCase</code> return a new string instead of changing the original.", example: "let s = 'cat';\ns[0] = 'b';   // ignored - s is still 'cat'", lesson: "06" },
  { term: "Palindrome", definition: "A word, phrase or number that reads the same forwards and backwards, like <code>\"level\"</code> or <code>12321</code>.", lesson: "06" },
  { term: "Anagram", definition: "A word formed by rearranging the letters of another, such as <code>\"listen\"</code> and <code>\"silent\"</code>. Check by comparing sorted letters or letter counts.", lesson: "06" },

  /* ---------- 07 Hash Maps & Sets ---------- */
  { term: "Hash map", aka: "Map, dictionary, hash table", definition: "A structure that stores key-value pairs and finds a value by its key in O(1) on average. In JavaScript use <code>Map</code> or a plain object.", example: "const stock = new Map();\nstock.set('apple', 12);\nstock.get('apple');   // 12", lesson: "07" },
  { term: "Set", definition: "A collection of unique values with fast O(1) average lookup. Adding a duplicate does nothing.", example: "const seen = new Set([1, 2, 2, 3]);\nseen.size   // 3", lesson: "07" },
  { term: "Hash function", definition: "A function that turns a key into a number used to decide where the value is stored, so it can be found again instantly.", lesson: "07" },
  { term: "Collision", definition: "When a hash function sends two different keys to the same slot. Hash tables handle it, for example by keeping a small list in that slot.", lesson: "07" },
  { term: "Frequency count", definition: "Counting how often each value appears by using a map from value to count. The basis of many string and array interview questions.", example: "const counts = {};\nfor (const ch of text) counts[ch] = (counts[ch] || 0) + 1;", lesson: "07" },

  /* ---------- 08 Classes & OOP ---------- */
  { term: "Object", definition: "A bundle of related data (properties) and behaviour (methods). In JavaScript also written as a literal with curly braces.", example: "const user = { name: 'Ana', age: 30 };", lesson: "08" },
  { term: "Class", definition: "A blueprint for creating objects that share the same properties and methods.", example: "class Rectangle {\n  constructor(w, h) { this.w = w; this.h = h; }\n  area() { return this.w * this.h; }\n}", lesson: "08" },
  { term: "Instance", definition: "One specific object created from a class with <code>new</code>.", example: "const r = new Rectangle(3, 4);   // r is an instance", lesson: "08" },
  { term: "Constructor", definition: "The special method that runs when an instance is created with <code>new</code>, usually to set up its starting properties.", lesson: "08" },
  { term: "Encapsulation", definition: "Keeping an object's internal data private and exposing only safe methods to use it. In JavaScript, <code>#private</code> fields enforce this.", example: "class Account {\n  #balance = 0;\n  deposit(x) { if (x > 0) this.#balance += x; }\n}", lesson: "08" },
  { term: "Abstraction", definition: "Hiding complex details behind a simple interface, so users only need to know <em>what</em> something does, not <em>how</em>.", lesson: "08" },
  { term: "Inheritance", definition: "A class (child) reusing and extending another class (parent) with <code>extends</code>; the child can call the parent with <code>super</code>.", example: "class Manager extends Employee { ... }", lesson: "08" },
  { term: "Polymorphism", definition: "Different classes responding to the same method call in their own way, e.g. every shape has <code>area()</code> but each computes it differently.", lesson: "08" },
  { term: "Composition", definition: "Building objects by combining other objects (\"has-a\") instead of inheriting from them (\"is-a\"). Often more flexible than inheritance.", lesson: "08" },
  { term: "Interface", definition: "The set of methods and properties an object promises to provide. JavaScript has no interface keyword, but the idea (a shared contract) still applies.", lesson: "08" },
  { term: "SOLID", definition: "Five design principles: Single responsibility, Open/closed, Liskov substitution, Interface segregation and Dependency inversion.", lesson: "08" },

  /* ---------- 09 Searching & Sorting ---------- */
  { term: "Binary search", definition: "Finding a value in a <strong>sorted</strong> array by checking the middle and discarding half each step. O(log n).", example: "while (lo <= hi) {\n  const mid = Math.floor((lo + hi) / 2);\n  ...\n}", lesson: "09" },
  { term: "Sorting stability", aka: "stable sort", definition: "A sort is stable if items with equal keys keep their original relative order. JavaScript's <code>Array.prototype.sort</code> is stable.", lesson: "09" },
  { term: "Comparator", definition: "A function that tells a sort how to order two items: negative if <code>a</code> comes first, positive if <code>b</code> does, 0 if equal.", example: "nums.sort((a, b) => a - b);   // ascending numbers", lesson: "09" },
  { term: "Merge sort", definition: "Divide and conquer: split the array in half, sort each half, then merge the two sorted halves. Always O(n log n), stable, uses extra memory.", lesson: "09" },
  { term: "Quick sort", definition: "Pick a pivot, move smaller items to its left and larger to its right, then sort each side. O(n log n) on average, O(n<sup>2</sup>) in the worst case.", lesson: "09" },

  /* ---------- 10 Stacks, Queues & Linked Lists ---------- */
  { term: "Stack", aka: "LIFO", definition: "A last-in, first-out collection: you add (push) and remove (pop) only at the top, like a stack of plates.", example: "const stack = [];\nstack.push(1); stack.push(2);\nstack.pop();   // 2", lesson: "10" },
  { term: "Queue", aka: "FIFO", definition: "A first-in, first-out collection: add at the back, remove from the front, like a line at a counter.", lesson: "10" },
  { term: "Linked list", definition: "A chain of nodes where each node holds a value and a pointer to the next node. Inserting at the front is O(1), but reaching the k-th item is O(k).", lesson: "10" },
  { term: "Node", definition: "One building block of a linked list, tree or graph: a value plus references (pointers) to other nodes.", example: "const node = { value: 5, next: null };", lesson: "10" },
  { term: "Pointer", definition: "A reference that points to another piece of data, such as the <code>next</code> field of a linked-list node, or an index variable in the two-pointer technique.", lesson: "10" },

  /* ---------- 11 Big-O ---------- */
  { term: "Algorithm", definition: "A precise, step-by-step procedure for solving a problem.", lesson: "11" },
  { term: "Data structure", definition: "A way of organising data so it can be used efficiently - for example arrays, maps, sets, stacks, queues and trees.", lesson: "11" },
  { term: "Big-O notation", definition: "A way to describe how an algorithm's work grows as the input size <code>n</code> grows, ignoring constants. Common classes: O(1), O(log n), O(n), O(n log n), O(n<sup>2</sup>).", lesson: "11" },
  { term: "Time complexity", definition: "How the running time of an algorithm grows with input size, usually written in Big-O.", lesson: "11" },
  { term: "Space complexity", definition: "How much extra memory an algorithm needs as input size grows. In-place algorithms are O(1) space.", lesson: "11" },
  { term: "Edge case", definition: "An unusual or extreme input that often breaks code: empty input, a single element, negatives, duplicates, very large values.", lesson: "11" },

  /* ---------- 12 SQL Basics ---------- */
  { term: "SQL", aka: "Structured Query Language", definition: "The standard language for reading and changing data in relational databases.", example: "SELECT name, salary FROM employees WHERE salary > 50000;", lang: "sql", lesson: "12" },
  { term: "Table", definition: "A named set of rows that all share the same columns - like one sheet in a spreadsheet.", lesson: "12" },
  { term: "Row", aka: "record", definition: "One entry in a table, such as one customer or one order.", lesson: "12" },
  { term: "Column", aka: "field, attribute", definition: "One named property that every row in a table has, such as <code>email</code> or <code>price</code>, with a fixed data type.", lesson: "12" },
  { term: "Primary key", definition: "A column (or set of columns) whose value uniquely identifies each row in a table. It can't be NULL or repeat.", example: "CREATE TABLE customers (\n  id INTEGER PRIMARY KEY,\n  name TEXT\n);", lang: "sql", lesson: "12" },
  { term: "NULL", definition: "SQL's marker for a missing or unknown value. Comparisons with NULL are unknown, so use <code>IS NULL</code> / <code>IS NOT NULL</code> rather than <code>=</code>.", example: "SELECT * FROM customers WHERE phone IS NULL;", lang: "sql", lesson: "12" },
  { term: "Aggregate function", definition: "A function that summarises many rows into one value: <code>COUNT</code>, <code>SUM</code>, <code>AVG</code>, <code>MIN</code>, <code>MAX</code>.", example: "SELECT COUNT(*), AVG(total) FROM orders;", lang: "sql", lesson: "12" },
  { term: "GROUP BY", definition: "Splits rows into groups that share a value so aggregates are computed per group.", example: "SELECT region, SUM(total)\nFROM orders\nGROUP BY region;", lang: "sql", lesson: "12" },
  { term: "HAVING", definition: "Filters groups <em>after</em> <code>GROUP BY</code>, using aggregate values. <code>WHERE</code> filters rows before grouping.", example: "SELECT region, SUM(total) AS revenue\nFROM orders\nGROUP BY region\nHAVING SUM(total) > 10000;", lang: "sql", lesson: "12" },

  /* ---------- 13 SQL Joins & Database Design ---------- */
  { term: "Foreign key", definition: "A column that refers to the primary key of another table, linking related rows (e.g. <code>orders.customer_id</code> &rarr; <code>customers.id</code>).", example: "customer_id INTEGER REFERENCES customers(id)", lang: "sql", lesson: "13" },
  { term: "JOIN", definition: "Combines rows from two tables based on a related column. <strong>INNER JOIN</strong> keeps only matches; <strong>LEFT JOIN</strong> keeps every row from the left table (with NULLs where there's no match); <strong>FULL OUTER JOIN</strong> keeps all rows from both.", example: "SELECT c.name, o.total\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id;", lang: "sql", lesson: "13" },
  { term: "Subquery", definition: "A query nested inside another query, used as a value, a list or a temporary table.", example: "SELECT name FROM products\nWHERE price > (SELECT AVG(price) FROM products);", lang: "sql", lesson: "13" },
  { term: "CTE", aka: "common table expression, WITH", definition: "A named temporary result defined with <code>WITH</code> at the start of a query, making complex queries easier to read.", example: "WITH big AS (SELECT * FROM orders WHERE total > 500)\nSELECT COUNT(*) FROM big;", lang: "sql", lesson: "13" },
  { term: "Window function", definition: "A function that computes a value across related rows without collapsing them into one, using <code>OVER (...)</code> - e.g. ranks and running totals.", example: "SELECT name, salary,\n  RANK() OVER (ORDER BY salary DESC) AS pay_rank\nFROM employees;", lang: "sql", lesson: "13" },
  { term: "Database index", definition: "A lookup structure on one or more columns that lets the database find rows quickly without scanning the whole table, at the cost of extra storage and slower writes.", example: "CREATE INDEX idx_orders_customer ON orders(customer_id);", lang: "sql", lesson: "13" },
  { term: "Normalization", definition: "Organising tables to remove duplicated data, so each fact is stored in exactly one place (1NF, 2NF, 3NF).", lesson: "13" },
  { term: "Transaction", definition: "A group of database operations that succeed or fail together. <code>COMMIT</code> saves them; <code>ROLLBACK</code> undoes them.", example: "BEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;", lang: "sql", lesson: "13" },
  { term: "ACID", definition: "The guarantees of reliable transactions: <strong>A</strong>tomicity (all or nothing), <strong>C</strong>onsistency (rules are kept), <strong>I</strong>solation (transactions don't interfere) and <strong>D</strong>urability (committed data survives crashes).", lesson: "13" },
  { term: "OLTP vs OLAP", definition: "OLTP (online transaction processing) systems handle many small, fast reads and writes, like a shop's checkout. OLAP (online analytical processing) systems run large read-heavy queries for reports and analytics.", lesson: "13" },

  /* ---------- 14 Mock Exam ---------- */
  { term: "Dry run", aka: "trace table", definition: "Stepping through code by hand with a sample input and writing down every variable's value at each step - the best way to find logic errors and answer \"what does this print?\" questions.", lesson: "14" }
];
