LDL.registerLesson({
  id: "13",
  title: "SQL Joins & Database Design",
  lang: "sql",
  minutes: 120,
  goal: "Combine tables with JOINs, answer 'what's missing?' questions, rank rows with window functions, and understand how good databases are designed. This is where most SQL interview questions live.",

  analogy: `
<p>If you've ever used <strong>VLOOKUP</strong> or <strong>XLOOKUP</strong> in Excel, you already understand JOINs. Your orders sheet has a
<em>customer ID</em>; to show the customer's <em>name</em> you look that ID up in the customers sheet. A <strong>JOIN</strong> does that lookup
for every row at once.</p>
<p>An <strong>INNER JOIN</strong> is a lookup that throws away rows with no match. A <strong>LEFT JOIN</strong> keeps them and shows a blank -
like VLOOKUP's <code>#N/A</code>. And a <strong>window function</strong> is like adding a "running total" or "rank" column next to your data:
it calculates across rows but, unlike a pivot table, <strong>keeps every row</strong>.</p>`,

  objectives: [
    "<strong>Join</strong> two or more tables with INNER JOIN, LEFT JOIN and self joins, and predict how many rows come back",
    "<strong>Find what's missing</strong> with anti-joins (LEFT JOIN ... IS NULL, NOT EXISTS)",
    "<strong>Break</strong> complex questions into steps with subqueries and CTEs (<code>WITH</code>)",
    "<strong>Rank</strong> and accumulate with window functions: ROW_NUMBER, RANK, DENSE_RANK, running totals",
    "<strong>Solve</strong> the classic interview queries: 2nd highest salary, top N per group, duplicates and more",
    "<strong>Explain</strong> keys, normalization (1NF-3NF), indexes, transactions and ACID"
  ],

  realWorld: `
<ul>
  <li><strong>Reports that span tables:</strong> "revenue per customer" needs customers + orders + order_items joined together.</li>
  <li><strong>Churn and gaps:</strong> "customers who signed up but never ordered", "products nobody buys" - anti-joins.</li>
  <li><strong>Rankings and dashboards:</strong> top 3 sales reps per region, month-over-month growth, running totals.</li>
  <li><strong>Data quality:</strong> finding duplicate customers or orphan records before a migration.</li>
  <li><strong>Interviews:</strong> "second highest salary", "employees earning more than their manager" and "top N per group" are asked constantly.</li>
</ul>`,

  sections: [
    {
      title: "Why data is split into tables",
      html: `
<p><strong>What:</strong> a well-designed database stores each fact <strong>once</strong>. The department name "Engineering" lives in
<code>departments</code>; each employee row only stores <code>department_id = 1</code>.</p>
<p><strong>Why:</strong> if you typed "Engineering" on 500 employee rows and the department was renamed, you'd have to change 500 rows - and you'd miss some.
Store it once, point to it many times.</p>
<table>
  <tr><th colspan="3">employees (part)</th><th></th><th colspan="2">departments</th></tr>
  <tr><th>id</th><th>name</th><th>department_id</th><th></th><th>id</th><th>name</th></tr>
  <tr><td>1</td><td>Alice Chen</td><td>1</td><td>&rarr;</td><td>1</td><td>Engineering</td></tr>
  <tr><td>5</td><td>Eve Adams</td><td>2</td><td>&rarr;</td><td>2</td><td>Sales</td></tr>
  <tr><td>12</td><td>Leo Hall</td><td>NULL</td><td>&rarr;</td><td colspan="2">(no match)</td></tr>
</table>
<p><strong>How:</strong> a <strong>JOIN</strong> puts the pieces back together by matching the foreign key to the primary key:</p>
<pre><code class="language-sql">SELECT e.name, d.name AS department
FROM employees e                              -- "e" is a short alias for employees
JOIN departments d ON d.id = e.department_id; -- the matching rule</code></pre>
<div class="callout tip"><p>Always use <strong>table aliases</strong> (<code>e</code>, <code>d</code>) and prefix columns (<code>e.name</code>, <code>d.name</code>).
Both tables have a <code>name</code> column - without the prefix the database can't tell which one you mean.</p></div>`
    },
    {
      title: "INNER JOIN vs LEFT JOIN",
      html: `
<p><strong>INNER JOIN</strong> (or just <code>JOIN</code>) keeps only rows that have a match on <strong>both</strong> sides.
<strong>LEFT JOIN</strong> keeps <strong>every</strong> row from the left table; where there's no match, the right side's columns are NULL.</p>
<pre>
                A = left table          B = right table
                  _________        _________
                 /         \\      /         \\
                /   A only  \\____/  B only   \\
               |            |both|            |
                \\           /----\\           /
                 \\_________/      \\_________/

                 A only  |  A and B  |  B only
                ---------+-----------+---------
  INNER JOIN             |   #####   |              only the matches
  LEFT JOIN       #####  |   #####   |              all of A; B columns NULL if no match
  RIGHT JOIN             |   #####   |  #####       all of B (= LEFT JOIN with tables swapped)
  FULL JOIN       #####  |   #####   |  #####       everything from both sides
  LEFT ANTI-JOIN  #####  |           |              A rows with NO match (next section)
</pre>
<p>Which rows survive when we join <code>employees</code> and <code>departments</code>?</p>
<table>
  <tr><th>Query</th><th>14 matched employees</th><th>Leo (no dept)</th><th>Legal (no staff)</th><th>Rows</th></tr>
  <tr><td><code>employees e JOIN departments d</code></td><td>yes</td><td>no</td><td>no</td><td><strong>14</strong></td></tr>
  <tr><td><code>employees e LEFT JOIN departments d</code></td><td>yes</td><td>yes, department = NULL</td><td>no</td><td><strong>15</strong></td></tr>
  <tr><td><code>departments d LEFT JOIN employees e</code></td><td>yes</td><td>no</td><td>yes, employee = NULL</td><td><strong>15</strong></td></tr>
  <tr><td><code>FULL OUTER JOIN</code></td><td>yes</td><td>yes</td><td>yes</td><td><strong>16</strong></td></tr>
  <tr><td><code>CROSS JOIN</code> (no ON)</td><td colspan="3">every employee paired with every department</td><td><strong>15 &times; 6 = 90</strong></td></tr>
</table>
<p>Here's the Legal row from <code>departments d LEFT JOIN employees e</code>:</p>
<table>
  <tr><th>department</th><th>employee</th></tr>
  <tr><td>HR</td><td>Mia King</td></tr>
  <tr><td>Legal</td><td class="null">NULL</td></tr>
  <tr><td>Marketing</td><td>Henry Wilson</td></tr>
</table>
<div class="callout key"><p>The table written <strong>first</strong> (left of <code>LEFT JOIN</code>) is the one whose rows are all kept. Ask yourself: "<em>which list must be complete?</em>" and put it on the left.</p></div>
<div class="callout note"><p><strong>RIGHT JOIN</strong> and <strong>FULL JOIN</strong> exist in standard SQL, PostgreSQL and SQL Server, but older SQLite (before 3.39) and MySQL (no FULL JOIN) lack them.
You can always rewrite a RIGHT JOIN as a LEFT JOIN with the tables swapped. The exercises here only use INNER and LEFT.</p></div>
<div class="callout warn"><p><strong>Rows multiply on one-to-many joins.</strong> Customers joined to orders gives one row per <em>order</em>: Acme Corp appears 3 times.
Keep that in mind before you SUM or COUNT.</p></div>`
    },
    {
      title: "Self joins: a table joined to itself",
      html: `
<p><strong>What:</strong> <code>employees.manager_id</code> points to another row in the <em>same</em> table. To show each person's manager's name,
join <code>employees</code> to itself using two different aliases.</p>
<pre><code class="language-sql">SELECT e.name AS employee, m.name AS manager
FROM employees e                                -- e = the employee
LEFT JOIN employees m ON m.id = e.manager_id;   -- m = the same table, playing "manager"</code></pre>
<table>
  <tr><th>employee</th><th>manager</th></tr>
  <tr><td>Alice Chen</td><td class="null">NULL</td></tr>
  <tr><td>Bob Smith</td><td>Alice Chen</td></tr>
  <tr><td>Carol Diaz</td><td>Bob Smith</td></tr>
  <tr><td>...</td><td>...</td></tr>
</table>
<div class="callout analogy"><p>Photocopy the employee list. On copy 1 you look up the person; on copy 2 you look up their boss by <code>manager_id</code>.
<code>e</code> and <code>m</code> are the two photocopies.</p></div>
<p>We used LEFT JOIN so Alice (the CEO, no manager) stays in the list. With an INNER JOIN she would vanish.</p>`
    },
    {
      title: "Anti-joins: finding what's missing",
      html: `
<p>"Customers who never ordered", "departments with no employees", "products never sold" - all the same question:
<strong>rows in A with no match in B</strong>. Three ways to write it:</p>
<pre><code class="language-sql">-- 1. LEFT JOIN, then keep the rows where the right side found nothing
SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;

-- 2. NOT EXISTS: "there is no order for this customer" (clearest, NULL-safe)
SELECT c.name
FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);

-- 3. NOT IN: works here, but dangerous if the subquery can return NULL
SELECT name FROM customers
WHERE id NOT IN (SELECT customer_id FROM orders);</code></pre>
<table>
  <tr><th>name</th></tr>
  <tr><td>Soylent</td></tr>
  <tr><td>Tyrell</td></tr>
  <tr><td>Wayne Enterprises</td></tr>
</table>
<div class="callout warn"><p><strong>The NOT IN trap:</strong> <code>x NOT IN (1, 2, NULL)</code> means <code>x &lt;&gt; 1 AND x &lt;&gt; 2 AND x &lt;&gt; NULL</code>.
The last part is UNKNOWN, so the whole condition is never TRUE - you get <strong>zero rows</strong> (lesson 12's three-valued logic). Prefer NOT EXISTS.</p></div>
<div class="callout work"><p>Anti-joins power churn reports ("signed up, never bought"), reconciliation ("invoices with no payment") and clean-up jobs ("orphan records").</p></div>`
    },
    {
      title: "Subqueries and correlated subqueries",
      html: `
<p>A <strong>subquery</strong> is a query inside another query, in brackets. The inner one runs first and hands its answer to the outer one.</p>
<pre><code class="language-sql">-- Who earns more than the company average?
SELECT name, salary
FROM employees
WHERE salary &gt; (SELECT AVG(salary) FROM employees);   -- inner query = 93714.29</code></pre>
<table>
  <tr><th>Kind</th><th>Returns</th><th>Example</th></tr>
  <tr><td>Scalar subquery</td><td>one value</td><td><code>WHERE salary &gt; (SELECT AVG(salary) FROM employees)</code></td></tr>
  <tr><td>List subquery</td><td>one column</td><td><code>WHERE department_id IN (SELECT id FROM departments WHERE location = 'London')</code></td></tr>
  <tr><td>Derived table</td><td>a whole table</td><td><code>FROM (SELECT ... GROUP BY ...) AS t</code></td></tr>
  <tr><td><strong>Correlated</strong></td><td>a value <em>per outer row</em></td><td>see below</td></tr>
</table>
<p>A <strong>correlated</strong> subquery uses a column from the outer row, so it's (conceptually) re-run for every row:</p>
<pre><code class="language-sql">-- Who earns more than THEIR OWN department's average?
SELECT e.name, e.department_id, e.salary
FROM employees e
WHERE e.salary &gt; (SELECT AVG(x.salary)
                  FROM employees x
                  WHERE x.department_id = e.department_id);   -- e = the outer row</code></pre>
<div class="callout analogy"><p>A correlated subquery is like a function called inside a loop: <em>for each employee</em>, compute the average of <em>their</em> department, then compare.</p></div>
<div class="callout tip"><p>Correlated subqueries can be slow on big tables (O(n<sup>2</sup>) in the worst case). A window function or a join to a pre-aggregated CTE is often faster.</p></div>`
    },
    {
      title: "CTEs: build a query step by step",
      html: `
<p><strong>What:</strong> a <strong>Common Table Expression</strong> (<code>WITH name AS (...)</code>) gives a subquery a name, so you can use it like a table.
<strong>Why:</strong> long queries become a readable list of steps - like putting intermediate results in helper columns or sheets in Excel.</p>
<pre><code class="language-sql">WITH order_totals AS (                         -- step 1: one row per order
  SELECT order_id, SUM(quantity * unit_price) AS total
  FROM order_items
  GROUP BY order_id
),
big_orders AS (                                -- step 2: can use step 1
  SELECT * FROM order_totals WHERE total &gt; 2000
)
SELECT o.id, o.order_date, b.total             -- final step
FROM big_orders b
JOIN orders o ON o.id = b.order_id;</code></pre>
<table>
  <tr><th>id</th><th>order_date</th><th>total</th></tr>
  <tr><td>1</td><td>2024-01-05</td><td>2450</td></tr>
  <tr><td>8</td><td>2024-04-20</td><td>4500</td></tr>
</table>
<div class="callout tip"><p>When a question feels too big, write the CTEs one at a time and run each one on its own (<code>SELECT * FROM order_totals</code>) before adding the next.</p></div>
<p><code>WITH RECURSIVE</code> can even walk a hierarchy, such as the chain of managers - SQL's version of recursion (lesson 03). See the "Org chart" example.</p>`
    },
    {
      title: "Window functions: calculations that keep every row",
      html: `
<p><strong>GROUP BY</strong> collapses rows into one per group. A <strong>window function</strong> calculates across a set of rows (the "window")
but <strong>keeps every row</strong> and just adds a column.</p>
<pre><code class="language-sql">function_name() OVER (PARTITION BY group_column ORDER BY sort_column)</code></pre>
<ul>
  <li><code>PARTITION BY</code> = "start again for each group" (like GROUP BY, but rows are not squashed).</li>
  <li><code>ORDER BY</code> inside <code>OVER</code> = the order used for ranking or running totals.</li>
</ul>
<pre><code class="language-sql">SELECT name, department_id, salary,
       ROUND(AVG(salary) OVER (PARTITION BY department_id), 2) AS dept_avg
FROM employees WHERE department_id IN (2, 3);</code></pre>
<table>
  <tr><th>name</th><th>department_id</th><th>salary</th><th>dept_avg</th></tr>
  <tr><td>Eve Adams</td><td>2</td><td>110000</td><td>81000</td></tr>
  <tr><td>Grace Lee</td><td>2</td><td>72000</td><td>81000</td></tr>
  <tr><td>Nina Scott</td><td>2</td><td>72000</td><td>81000</td></tr>
  <tr><td>Frank Moore</td><td>2</td><td>70000</td><td>81000</td></tr>
  <tr><td>Henry Wilson</td><td>3</td><td>90000</td><td>77500</td></tr>
  <tr><td>Ivy Taylor</td><td>3</td><td>65000</td><td>77500</td></tr>
</table>
<p>The three ranking functions differ only in how they treat <strong>ties</strong>:</p>
<table>
  <tr><th>salary</th><th>ROW_NUMBER()</th><th>RANK()</th><th>DENSE_RANK()</th></tr>
  <tr><td>150000</td><td>1</td><td>1</td><td>1</td></tr>
  <tr><td>130000</td><td>2</td><td>2</td><td>2</td></tr>
  <tr><td>105000</td><td>3</td><td>3</td><td>3</td></tr>
  <tr><td>105000</td><td>4</td><td>3</td><td>3</td></tr>
  <tr><td>95000</td><td>5</td><td><strong>5</strong> (skips 4)</td><td><strong>4</strong> (no gap)</td></tr>
</table>
<table>
  <tr><th>Function</th><th>Use it for</th></tr>
  <tr><td><code>ROW_NUMBER()</code></td><td>exactly N rows per group; keeping one row out of duplicates</td></tr>
  <tr><td><code>RANK()</code> / <code>DENSE_RANK()</code></td><td>league tables; "Nth highest value" (DENSE_RANK)</td></tr>
  <tr><td><code>SUM(x) OVER (ORDER BY date)</code></td><td>running total</td></tr>
  <tr><td><code>LAG(x)</code> / <code>LEAD(x)</code></td><td>previous / next row's value (month-over-month change)</td></tr>
</table>
<div class="callout warn"><p>Window functions run <strong>after</strong> WHERE and HAVING, so you can't write <code>WHERE ROW_NUMBER() ... &lt;= 2</code>.
Compute the rank in a CTE, then filter it in the outer query.</p></div>
<div class="callout analogy"><p>A running total is the Excel formula <code>=SUM($B$2:B2)</code> dragged down a column. <code>SUM(x) OVER (ORDER BY date)</code> is that, in one line.</p></div>`
    },
    {
      title: "Classic interview queries",
      html: `
<p>These come up again and again. Each one is an exercise below.</p>
<table>
  <tr><th>Question</th><th>Pattern</th></tr>
  <tr><td>Second highest salary</td><td><code>SELECT MAX(salary) FROM employees WHERE salary &lt; (SELECT MAX(salary) FROM employees)</code></td></tr>
  <tr><td>Top N per group</td><td><code>ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC)</code> in a CTE, then <code>WHERE rn &lt;= N</code></td></tr>
  <tr><td>Earns more than their manager</td><td>self join: <code>employees e JOIN employees m ON m.id = e.manager_id WHERE e.salary &gt; m.salary</code></td></tr>
  <tr><td>Departments with no employees</td><td><code>departments LEFT JOIN employees ... WHERE e.id IS NULL</code></td></tr>
  <tr><td>Customers who never ordered</td><td><code>WHERE NOT EXISTS (SELECT 1 FROM orders WHERE customer_id = c.id)</code></td></tr>
  <tr><td>Running total</td><td><code>SUM(total) OVER (ORDER BY order_date)</code></td></tr>
  <tr><td>Find duplicates</td><td><code>GROUP BY email HAVING COUNT(*) &gt; 1</code></td></tr>
  <tr><td>Above the group average</td><td>correlated subquery, or <code>AVG(salary) OVER (PARTITION BY dept)</code></td></tr>
</table>
<div class="callout tip"><p>In an interview, say your plan out loud first: "I'll join A to B, filter X, then group by Y." Interviewers score your reasoning, not just the final query.</p></div>`
    },
    {
      title: "Design: keys and relationships",
      html: `
<table>
  <tr><th>Term</th><th>Plain English</th><th>In our database</th></tr>
  <tr><td><strong>Primary key</strong> (PK)</td><td>the column that uniquely identifies a row; never NULL, never repeated</td><td><code>employees.id</code></td></tr>
  <tr><td><strong>Composite key</strong></td><td>a PK made of two or more columns together</td><td><code>order_items (order_id, product_id)</code></td></tr>
  <tr><td><strong>Foreign key</strong> (FK)</td><td>a column that must match a PK somewhere else ("referential integrity")</td><td><code>orders.customer_id</code> &rarr; <code>customers.id</code></td></tr>
  <tr><td>Natural vs surrogate key</td><td>a real-world value (email) vs a generated number (id). Surrogate ids never change, so they make safer PKs.</td><td>every table uses an <code>id</code></td></tr>
  <tr><td>UNIQUE / NOT NULL / CHECK</td><td>rules the database enforces for you</td><td><code>departments.name UNIQUE</code>, <code>CHECK (quantity &gt; 0)</code></td></tr>
</table>
<p>Kinds of relationships:</p>
<ul>
  <li><strong>One-to-many:</strong> one department, many employees. The FK goes on the "many" side (<code>employees.department_id</code>).</li>
  <li><strong>Many-to-many:</strong> an order has many products; a product is in many orders. You need a <strong>junction table</strong> in between: <code>order_items</code>.</li>
  <li><strong>Self-referencing:</strong> an employee's manager is another employee (<code>manager_id</code>).</li>
</ul>
<div class="callout warn"><p>Our <code>customers.email</code> has no UNIQUE constraint - that's how two customers ended up sharing <code>contact@acme.com</code>.
Constraints are your first line of defence against bad data.</p></div>`
    },
    {
      title: "Design: normalization (1NF, 2NF, 3NF)",
      html: `
<p><strong>Normalization</strong> means organising tables so each fact is stored once, which prevents data from contradicting itself.
Let's fix a messy, spreadsheet-style table step by step.</p>
<p><strong>Before</strong> - everything in one sheet:</p>
<table>
  <tr><th>order_id</th><th>customer</th><th>customer_city</th><th>products</th><th>rep</th><th>rep_dept</th></tr>
  <tr><td>1</td><td>Acme Corp</td><td>London</td><td>Laptop x2, Mouse x2</td><td>Eve</td><td>Sales</td></tr>
  <tr><td>3</td><td>Acme Corp</td><td>London</td><td>Notebook x20</td><td>Frank</td><td>Sales</td></tr>
</table>
<p><strong>1NF - one value per cell.</strong> "Laptop x2, Mouse x2" is a list squeezed into one cell. Give each product its own row:</p>
<table>
  <tr><th>order_id</th><th>product</th><th>qty</th><th>customer</th><th>customer_city</th><th>rep</th><th>rep_dept</th></tr>
  <tr><td>1</td><td>Laptop</td><td>2</td><td>Acme Corp</td><td>London</td><td>Eve</td><td>Sales</td></tr>
  <tr><td>1</td><td>Mouse</td><td>2</td><td>Acme Corp</td><td>London</td><td>Eve</td><td>Sales</td></tr>
  <tr><td>3</td><td>Notebook</td><td>20</td><td>Acme Corp</td><td>London</td><td>Frank</td><td>Sales</td></tr>
</table>
<p><strong>2NF - depend on the whole key.</strong> The key is now (order_id, product). But customer and rep depend only on <code>order_id</code> - half the key -
so they repeat on every line. Split them out:</p>
<pre>
 orders(order_id, customer, customer_city, rep, rep_dept)     order_items(order_id, product, qty)
</pre>
<p><strong>3NF - depend on nothing but the key.</strong> In <code>orders</code>, <code>customer_city</code> depends on the <em>customer</em>, not the order
(order &rarr; customer &rarr; city). Same for rep &rarr; rep_dept. Give them their own tables:</p>
<pre>
 customers(id, name, city)              employees(id, name, department_id)
 orders(id, customer_id, employee_id, order_date)
 order_items(order_id, product_id, quantity)
</pre>
<p><strong>After:</strong> that's exactly our sample database. Acme's city is stored once - change it in one place and every order "sees" it.</p>
<div class="callout key"><p>Memory hook: every column depends on "<strong>the key</strong> (1NF), <strong>the whole key</strong> (2NF), and <strong>nothing but the key</strong> (3NF)".</p></div>
<div class="callout note"><p><strong>Denormalization</strong> (duplicating data on purpose) is sometimes chosen for faster reporting.
And <code>order_items.unit_price</code> is <em>not</em> a duplicate of <code>products.price</code>: it records the price <em>at the time of sale</em>, a different fact.</p></div>`
    },
    {
      title: "Design: indexes",
      html: `
<p><strong>Problem:</strong> without help, <code>WHERE email = 'x'</code> reads every row - O(n). Fine for 10 rows, painful for 10 million.</p>
<p><strong>Solution:</strong> an <strong>index</strong> is a separate, sorted copy of one or more columns with pointers back to the rows - like the index at the back of a book.</p>
<table>
  <tr><th>Index type</th><th>Works like</th><th>Good for</th></tr>
  <tr><td>B-tree (the default)</td><td>a sorted list + <a href="lesson.html?id=09">binary search</a> (lesson 09): O(log n)</td><td><code>=</code>, <code>&lt;</code>, <code>BETWEEN</code>, <code>ORDER BY</code>, <code>LIKE 'abc%'</code></td></tr>
  <tr><td>Hash index</td><td>a <a href="lesson.html?id=07">hash map</a> (lesson 07): O(1)</td><td>only exact <code>=</code> lookups</td></tr>
</table>
<pre><code class="language-sql">CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE UNIQUE INDEX idx_customers_email ON customers(email);   -- also blocks duplicates
EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 1; -- SQLite: is the index used?</code></pre>
<ul>
  <li>Primary keys get an index automatically. <strong>Index your foreign keys</strong> - you join on them all the time.</li>
  <li>Indexes speed up reads but slow down INSERT/UPDATE/DELETE (every index must be updated) and take space.</li>
  <li>A composite index on <code>(last_name, first_name)</code> helps searches on <code>last_name</code>, but not on <code>first_name</code> alone - like a phone book.</li>
  <li>Functions on the column (<code>WHERE UPPER(email) = ...</code>) or a leading wildcard (<code>LIKE '%abc'</code>) usually stop the index from being used.</li>
</ul>`
    },
    {
      title: "Design: transactions, ACID, OLTP vs OLAP",
      html: `
<p>A <strong>transaction</strong> groups several statements into one all-or-nothing unit. The classic example is a bank transfer:</p>
<pre><code class="language-sql">BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;   -- take 100 from account 1
UPDATE accounts SET balance = balance + 100 WHERE id = 2;   -- give 100 to account 2
COMMIT;      -- make both permanent (or ROLLBACK; to undo both)</code></pre>
<p>If the power fails between the two UPDATEs, the database undoes the first one. Money never disappears. That guarantee is called <strong>ACID</strong>:</p>
<table>
  <tr><th>Letter</th><th>Property</th><th>Plain English</th></tr>
  <tr><td>A</td><td>Atomicity</td><td>all statements happen, or none do</td></tr>
  <tr><td>C</td><td>Consistency</td><td>rules (PK, FK, CHECK) hold before and after</td></tr>
  <tr><td>I</td><td>Isolation</td><td>people working at the same time don't see each other's half-finished changes</td></tr>
  <tr><td>D</td><td>Durability</td><td>once committed, it survives a crash</td></tr>
</table>
<div class="callout work"><p><strong>OLTP vs OLAP:</strong> OLTP (online transaction processing) = lots of small, fast reads and writes on normalized tables - a shop's checkout.
OLAP (online analytical processing) = a few huge read-only summaries over denormalized data - the monthly sales dashboard in a data warehouse.</p></div>`
    }
  ],

  examples: [
    {
      title: "INNER JOIN: employees with their department",
      code: `SELECT e.name, d.name AS department, d.location
FROM employees e
JOIN departments d ON d.id = e.department_id
ORDER BY d.name, e.name;`,
      explain: `
<ol>
  <li><strong>FROM ... JOIN</strong> pairs each employee with the department whose <code>id</code> equals their <code>department_id</code>.</li>
  <li>Leo's <code>department_id</code> is NULL, which matches nothing, so the INNER JOIN drops him.</li>
</ol>
<table>
  <tr><th>Step</th><th>Rows</th></tr>
  <tr><td>employees</td><td>15</td></tr>
  <tr><td>after JOIN departments</td><td>14 (Leo gone; Legal never appears)</td></tr>
</table>
<p><strong>Try it:</strong> change <code>JOIN</code> to <code>LEFT JOIN</code>. Leo comes back with NULL department and location.</p>`
    },
    {
      title: "LEFT JOIN: every department, even empty ones",
      code: `SELECT d.name AS department, e.name AS employee
FROM departments d
LEFT JOIN employees e ON e.department_id = d.id
ORDER BY d.name, e.name;`,
      explain: `
<p>Now <code>departments</code> is on the left, so all 6 departments are kept. Legal has no match, so its employee column is NULL:</p>
<table>
  <tr><th>department</th><th>employee</th></tr>
  <tr><td>HR</td><td>Mia King</td></tr>
  <tr><td>Legal</td><td>NULL</td></tr>
  <tr><td>Marketing</td><td>Henry Wilson</td></tr>
</table>
<p>14 matched rows + 1 Legal row = 15 rows. <strong>Try it:</strong> add <code>WHERE e.id IS NULL</code> to see only the empty department - that's an anti-join.</p>`
    },
    {
      title: "Self join: who reports to whom",
      code: `SELECT e.name AS employee,
       m.name AS manager            -- NULL for the CEO
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id
ORDER BY e.id;`,
      explain: `
<p>The same table appears twice: <code>e</code> is the employee, <code>m</code> is "the employee whose id is my manager_id".</p>
<table>
  <tr><th>employee</th><th>manager</th></tr>
  <tr><td>Alice Chen</td><td>NULL</td></tr>
  <tr><td>Bob Smith</td><td>Alice Chen</td></tr>
  <tr><td>Carol Diaz</td><td>Bob Smith</td></tr>
</table>
<p><strong>Try it:</strong> add <code>e.salary, m.salary</code> to the SELECT and <code>WHERE e.salary &gt; m.salary</code>. Who earns more than their boss?</p>`
    },
    {
      title: "Joining four tables: order lines with names",
      code: `SELECT o.id AS order_id,
       c.name AS customer,
       p.name AS product,
       i.quantity,
       i.quantity * i.unit_price AS line_total
FROM orders o
JOIN customers c   ON c.id = o.customer_id
JOIN order_items i ON i.order_id = o.id
JOIN products p    ON p.id = i.product_id
WHERE o.id IN (1, 3)
ORDER BY o.id, p.name;`,
      explain: `
<p>Each JOIN adds one more lookup. Read it as a chain: order &rarr; its customer, order &rarr; its lines, line &rarr; its product.</p>
<table>
  <tr><th>order_id</th><th>customer</th><th>product</th><th>quantity</th><th>line_total</th></tr>
  <tr><td>1</td><td>Acme Corp</td><td>Laptop</td><td>2</td><td>2400</td></tr>
  <tr><td>1</td><td>Acme Corp</td><td>Mouse</td><td>2</td><td>50</td></tr>
  <tr><td>3</td><td>Acme Corp</td><td>Notebook</td><td>20</td><td>90</td></tr>
  <tr><td>3</td><td>Acme Corp</td><td>Pen Pack</td><td>10</td><td>125</td></tr>
</table>
<p>2 orders became 4 rows - one per order line. <strong>Try it:</strong> remove the WHERE to see all 22 lines.</p>`
    },
    {
      title: "Anti-join: products nobody has bought",
      code: `SELECT p.name, p.price
FROM products p
WHERE NOT EXISTS (
  SELECT 1                          -- the value doesn't matter, only "is there a row?"
  FROM order_items i
  WHERE i.product_id = p.id
);`,
      explain: `
<p>For each product, the subquery asks "is there any order line for this product?". <code>NOT EXISTS</code> keeps the products where the answer is no.
Result: just the <strong>Whiteboard</strong>.</p>
<p><strong>Try it:</strong> rewrite it as <code>LEFT JOIN order_items i ON i.product_id = p.id WHERE i.order_id IS NULL</code> - same answer.</p>`
    },
    {
      title: "Subquery: who earns more than the company average?",
      code: `SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)   -- runs first: 93714.29
ORDER BY salary DESC;`,
      explain: `
<ol>
  <li>The inner query runs once and returns a single number: 93714.29.</li>
  <li>The outer query becomes <code>WHERE salary &gt; 93714.29</code> and returns 7 people, down to Carol Diaz (95000).</li>
</ol>
<p>You can't write <code>WHERE salary &gt; AVG(salary)</code> directly - aggregates aren't allowed in WHERE. The subquery gets around that.
<strong>Try it:</strong> change <code>AVG</code> to <code>MAX</code> and <code>&gt;</code> to <code>=</code> to find the top earner.</p>`
    },
    {
      title: "CTE: monthly revenue in two readable steps",
      code: `WITH shipped_lines AS (               -- step 1: one row per shipped order line
  SELECT strftime('%Y-%m', o.order_date) AS month,
         i.quantity * i.unit_price      AS amount
  FROM orders o
  JOIN order_items i ON i.order_id = o.id
  WHERE o.status = 'shipped'
)
SELECT month, SUM(amount) AS revenue     -- step 2: add up per month
FROM shipped_lines
GROUP BY month
ORDER BY month;`,
      explain: `
<p>Step 1 builds a simple helper table; step 2 summarises it. Each step is easy to read and test on its own.</p>
<table>
  <tr><th>month</th><th>revenue</th></tr>
  <tr><td>2024-01</td><td>3500</td></tr>
  <tr><td>2024-02</td><td>215</td></tr>
  <tr><td>2024-03</td><td>2360</td></tr>
  <tr><td>...</td><td>...</td></tr>
</table>
<p><strong>Try it:</strong> replace the final query with <code>SELECT * FROM shipped_lines</code> to see step 1's rows.</p>`
    },
    {
      title: "ROW_NUMBER vs RANK vs DENSE_RANK",
      code: `SELECT name, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC, name) AS row_num,  -- name breaks ties
       RANK()       OVER (ORDER BY salary DESC) AS rnk,
       DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rnk
FROM employees
WHERE salary IS NOT NULL
ORDER BY salary DESC, name;`,
      explain: `
<p>Look at the ties: Jack and Kate (105000), Grace and Nina (72000).</p>
<table>
  <tr><th>name</th><th>salary</th><th>row_num</th><th>rnk</th><th>dense_rnk</th></tr>
  <tr><td>Jack White</td><td>105000</td><td>5</td><td>5</td><td>5</td></tr>
  <tr><td>Kate Green</td><td>105000</td><td>6</td><td>5</td><td>5</td></tr>
  <tr><td>Carol Diaz</td><td>95000</td><td>7</td><td>7</td><td>6</td></tr>
</table>
<p>ROW_NUMBER never repeats; RANK repeats and then <strong>skips</strong>; DENSE_RANK repeats <strong>without gaps</strong>.
<strong>Try it:</strong> add <code>PARTITION BY department_id</code> inside each <code>OVER (...)</code> to rank within departments.</p>`
    },
    {
      title: "Running total and month-over-month change",
      code: `WITH monthly AS (
  SELECT strftime('%Y-%m', o.order_date)  AS month,
         SUM(i.quantity * i.unit_price)   AS revenue
  FROM orders o
  JOIN order_items i ON i.order_id = o.id
  WHERE o.status = 'shipped'
  GROUP BY month
)
SELECT month,
       revenue,
       SUM(revenue) OVER (ORDER BY month)            AS running_total,
       revenue - LAG(revenue) OVER (ORDER BY month)  AS change_vs_prev
FROM monthly
ORDER BY month;`,
      explain: `
<table>
  <tr><th>month</th><th>revenue</th><th>running_total</th><th>change_vs_prev</th></tr>
  <tr><td>2024-01</td><td>3500</td><td>3500</td><td>NULL</td></tr>
  <tr><td>2024-02</td><td>215</td><td>3715</td><td>-3285</td></tr>
  <tr><td>2024-03</td><td>2360</td><td>6075</td><td>2145</td></tr>
</table>
<ul>
  <li><code>SUM(revenue) OVER (ORDER BY month)</code> adds up everything from the first month to the current one.</li>
  <li><code>LAG(revenue)</code> fetches the previous row's value; the first month has none, so it's NULL.</li>
</ul>
<p>This is the classic "growth" table on a sales dashboard. <strong>Try it:</strong> use <code>LEAD</code> instead of <code>LAG</code>.</p>`
    },
    {
      title: "Org chart with a recursive CTE",
      code: `WITH RECURSIVE chain(id, name, level, path) AS (
  SELECT id, name, 0, name
  FROM employees
  WHERE manager_id IS NULL                 -- start: the CEO
  UNION ALL
  SELECT e.id, e.name, c.level + 1, c.path || ' > ' || e.name
  FROM employees e
  JOIN chain c ON e.manager_id = c.id      -- repeat: people whose manager is already in the chain
)
SELECT level, path FROM chain ORDER BY path;`,
      explain: `
<p>A recursive CTE has two parts glued by <code>UNION ALL</code>: a <strong>starting point</strong> (Alice, level 0) and a <strong>step</strong> that finds the next level down.
It repeats the step until no new rows appear - just like recursion with a base case.</p>
<table>
  <tr><th>level</th><th>path</th></tr>
  <tr><td>0</td><td>Alice Chen</td></tr>
  <tr><td>1</td><td>Alice Chen &gt; Bob Smith</td></tr>
  <tr><td>2</td><td>Alice Chen &gt; Bob Smith &gt; Carol Diaz</td></tr>
</table>
<p><strong>Try it:</strong> start from Eve Adams instead (<code>WHERE id = 5</code>) to see only her team.</p>`
    }
  ],

  pitfalls: [
    "Forgetting the ON condition (or matching the wrong columns) pairs every row with every row - row counts explode.",
    "A condition on the right-hand table in <code>WHERE</code> after a LEFT JOIN silently turns it into an INNER JOIN. Put it in the <code>ON</code> clause instead.",
    "<code>NOT IN (subquery)</code> returns no rows if the subquery yields any NULL. Prefer <code>NOT EXISTS</code>.",
    "<code>COUNT(*)</code> after a LEFT JOIN counts the NULL-filled row as 1. Use <code>COUNT(right_table.id)</code> to get 0.",
    "Joining one-to-many and then summing can double-count. Aggregate in a CTE first, then join.",
    "Ambiguous columns: when both tables have <code>name</code> or <code>id</code>, always prefix with the table alias.",
    "You can't filter on a window function in WHERE - compute it in a CTE and filter outside.",
    "\"Second highest\" with <code>LIMIT 1 OFFSET 1</code> breaks on ties unless you use <code>DISTINCT</code>.",
    "Every extra index slows down writes - index what you search and join on, not everything."
  ],

  quiz: [
    {
      q: "There are 15 employees. Leo Hall has no department (NULL). How many rows does this return?",
      code: `SELECT e.name, d.name
FROM employees e
JOIN departments d ON d.id = e.department_id;`,
      options: ["13", "14", "15", "90"],
      answer: 1,
      explain: "<p>An INNER JOIN keeps only rows with a match. Leo's NULL department matches nothing, so he's dropped: 15 - 1 = <strong>14</strong>. (90 would be a CROSS JOIN: 15 &times; 6.)</p>"
    },
    {
      q: "There are 10 customers and 12 orders. 3 customers never ordered; every order belongs to a customer. How many rows?",
      code: `SELECT c.name, o.id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;`,
      options: ["10", "12", "15", "22"],
      answer: 2,
      explain: "<p>Each of the 12 orders gives one row (customers with several orders repeat), and LEFT JOIN adds one NULL-filled row for each of the 3 customers with no orders: 12 + 3 = <strong>15</strong>.</p>"
    },
    {
      q: "Which query lists customers who have <strong>never</strong> placed an order?",
      options: [
        "<code>SELECT c.name FROM customers c JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL</code>",
        "<code>SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL</code>",
        "<code>SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NOT NULL</code>",
        "<code>SELECT c.name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)</code>"
      ],
      answer: 1,
      explain: "<p>The LEFT JOIN keeps every customer; those with no order have NULL in <code>o.id</code>, and <code>WHERE o.id IS NULL</code> keeps exactly them. Option A can never work: an INNER JOIN has already removed the unmatched customers. C and D find customers who <em>did</em> order.</p>"
    },
    {
      q: "Legal has no employees. What does <code>COUNT(*)</code> show for Legal here?",
      code: `SELECT d.name, COUNT(*)
FROM departments d
LEFT JOIN employees e ON e.department_id = d.id
GROUP BY d.name;`,
      options: ["0", "1", "NULL", "Legal is not in the result"],
      answer: 1,
      explain: "<p>The LEFT JOIN creates one row for Legal (with NULL employee columns), and <code>COUNT(*)</code> counts rows, so it says <strong>1</strong>. Use <code>COUNT(e.id)</code>: it skips NULLs and correctly gives 0.</p>"
    },
    {
      q: "What is the DENSE_RANK of the salary 80?",
      code: `SELECT s, DENSE_RANK() OVER (ORDER BY s DESC) AS dr
FROM (SELECT 100 AS s UNION ALL SELECT 90 UNION ALL SELECT 90 UNION ALL SELECT 80);`,
      options: ["2", "3", "4", "5"],
      answer: 1,
      explain: "<p>Ranks are 100 &rarr; 1, both 90s &rarr; 2, then 80 &rarr; <strong>3</strong>: DENSE_RANK leaves no gap. <code>RANK()</code> would give 80 the rank 4, because two rows share rank 2.</p>"
    },
    {
      q: "A contacts table has a column <code>phones</code> containing values like <code>'555-1234, 555-9876'</code>. Which rule does this break?",
      options: ["1NF", "2NF", "3NF", "None - it's fine"],
      answer: 0,
      explain: "<p>First Normal Form requires <strong>one value per cell</strong>. A comma-separated list can't be searched, joined or validated properly. Fix it with a separate <code>contact_phones(contact_id, phone)</code> table.</p>"
    },
    {
      q: "During a bank transfer the server crashes after money left account A but before it reached account B. Which ACID property makes sure the debit is undone?",
      options: ["Atomicity", "Consistency", "Isolation", "Durability"],
      answer: 0,
      explain: "<p><strong>Atomicity</strong> = all or nothing. The transaction was never committed, so on restart the database rolls back the half-done work. Durability is the opposite promise: once something <em>is</em> committed, it survives crashes.</p>"
    }
  ],

  interview: [
    { q: "What is the difference between INNER JOIN and LEFT JOIN?",
      a: "<p>INNER JOIN keeps only rows that match on both sides. LEFT JOIN keeps every row from the left table and fills the right side with NULL when there's no match. Here: <code>employees JOIN departments</code> gives 14 rows; <code>employees LEFT JOIN departments</code> gives 15 (Leo with a NULL department).</p>" },
    { q: "How do you find the second highest salary?",
      a: "<p><code>SELECT MAX(salary) FROM employees WHERE salary &lt; (SELECT MAX(salary) FROM employees);</code> Alternatives: <code>DENSE_RANK() OVER (ORDER BY salary DESC) = 2</code> in a CTE, or <code>SELECT DISTINCT salary ... ORDER BY salary DESC LIMIT 1 OFFSET 1</code>. Mention ties and what happens if there is no second value.</p>" },
    { q: "Explain ROW_NUMBER, RANK and DENSE_RANK.",
      a: "<p>All three number rows in a given order. ROW_NUMBER always gives 1, 2, 3, 4. RANK gives ties the same number and then skips (1, 2, 2, 4). DENSE_RANK gives ties the same number with no gap (1, 2, 2, 3).</p>" },
    { q: "What is a correlated subquery, and how else could you write it?",
      a: "<p>A subquery that refers to the outer query's current row, so it's logically run once per row - e.g. comparing each employee to their own department's average. Alternatives: join to a CTE that pre-computes <code>AVG(salary) ... GROUP BY department_id</code>, or use <code>AVG(salary) OVER (PARTITION BY department_id)</code>.</p>" },
    { q: "Explain 1NF, 2NF and 3NF.",
      a: "<p>1NF: one value per cell, no repeating groups. 2NF: every non-key column depends on the <em>whole</em> primary key (matters for composite keys). 3NF: non-key columns depend only on the key, not on other non-key columns. \"The key, the whole key, and nothing but the key.\"</p>" },
    { q: "What is an index, and when would you not add one?",
      a: "<p>A sorted helper structure (usually a B-tree) that turns full scans (O(n)) into fast lookups (O(log n)). Skip it on tiny tables, on columns you rarely filter or join on, or on write-heavy tables where the extra cost of updating the index outweighs faster reads.</p>" }
  ],

  exercises: [
    {
      id: "orders-with-customers",
      title: "Warm-up: orders with customer names",
      difficulty: "easy",
      prompt: "<p>The support team sees only customer ids in the order list - they want names. Show every order with the name of the customer who placed it.</p><p>Columns: <code>order_id, order_date, customer</code>. Order by order id.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT o.id         AS order_id,
       o.order_date,
       c.name       AS customer
FROM orders o
JOIN customers c ON c.id = o.customer_id   -- look up each order's customer
ORDER BY o.id;`,
      hint: "Start <code>FROM orders o</code> and <code>JOIN customers c ON c.id = o.customer_id</code>. Both tables have an <code>id</code> - prefix it.",
      expected: [
        [1, "2024-01-05", "Acme Corp"], [2, "2024-01-12", "Globex"], [3, "2024-02-03", "Acme Corp"],
        [4, "2024-02-18", "Initech"], [5, "2024-03-01", "Umbrella"], [6, "2024-03-15", "Hooli"],
        [7, "2024-04-02", "Globex"], [8, "2024-04-20", "Stark Industries"], [9, "2024-05-05", "Acme Corp"],
        [10, "2024-05-18", "Acme Corporation"], [11, "2024-06-01", "Initech"], [12, "2024-06-10", "Stark Industries"]
      ],
      ordered: true
    },
    {
      id: "employee-departments",
      title: "Employees with their department",
      difficulty: "easy",
      prompt: "<p>HR is printing a staff directory. Show each employee's name with their department's name. Employees without a department should <strong>not</strong> appear.</p><p>Columns: <code>employee_name, department_name</code>. Order by employee name.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT e.name AS employee_name,
       d.name AS department_name
FROM employees e
JOIN departments d ON d.id = e.department_id     -- INNER JOIN drops Leo (NULL FK)
ORDER BY e.name;`,
      hint: "<code>FROM employees e JOIN departments d ON d.id = e.department_id</code>. Both tables have a <code>name</code> column - prefix them and give them aliases.",
      expected: [
        ["Alice Chen", "Engineering"], ["Bob Smith", "Engineering"], ["Carol Diaz", "Engineering"],
        ["Dan Brown", "Engineering"], ["Eve Adams", "Sales"], ["Frank Moore", "Sales"], ["Grace Lee", "Sales"],
        ["Henry Wilson", "Marketing"], ["Ivy Taylor", "Marketing"], ["Jack White", "Finance"],
        ["Kate Green", "Finance"], ["Mia King", "HR"], ["Nina Scott", "Sales"], ["Oscar Young", "Engineering"]
      ],
      ordered: true
    },
    {
      id: "more-than-manager",
      title: "Employees who earn more than their manager",
      difficulty: "medium",
      prompt: "<p>A pay-equity review wants to know: does anyone earn <strong>more</strong> than their own manager?</p><p>Columns: <code>employee, employee_salary, manager, manager_salary</code>. Any order.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT e.name   AS employee,
       e.salary AS employee_salary,
       m.name   AS manager,
       m.salary AS manager_salary
FROM employees e
JOIN employees m ON m.id = e.manager_id    -- self join: m is the manager's row
WHERE e.salary > m.salary;`,
      hint: "Join <code>employees</code> to itself: <code>employees e JOIN employees m ON m.id = e.manager_id</code>. Then compare <code>e.salary</code> with <code>m.salary</code>.",
      explanation: "<p>The self join puts each employee and their manager on the same row, so comparing them is a simple WHERE. An INNER JOIN is fine here: Alice has no manager, so she can't out-earn one.</p>",
      expected: [["Dan Brown", 130000, "Bob Smith", 120000]],
      ordered: false
    },
    {
      id: "empty-departments",
      title: "Departments with no employees",
      difficulty: "easy",
      prompt: "<p>Facilities is reassigning office space. Which departments have <strong>no</strong> employees at all?</p><p>Columns: <code>name</code>. Any order.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT d.name
FROM departments d
LEFT JOIN employees e ON e.department_id = d.id   -- keep every department
WHERE e.id IS NULL;                               -- ...that found no employee`,
      hint: "LEFT JOIN from <code>departments</code> to <code>employees</code>, then keep only the rows where the employee side is NULL.",
      expected: [["Legal"]],
      ordered: false
    },
    {
      id: "never-ordered",
      title: "Customers who never ordered",
      difficulty: "easy",
      prompt: "<p>Marketing wants to send a \"first order discount\" to customers who signed up but have <strong>never</strong> placed an order (of any status).</p><p>Columns: <code>name</code>. Order by <code>name</code>.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT c.name
FROM customers c
WHERE NOT EXISTS (                                   -- "no order exists for this customer"
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
)
ORDER BY c.name;`,
      hint: "Use <code>NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)</code>, or a LEFT JOIN + <code>WHERE o.id IS NULL</code>.",
      expected: [["Soylent"], ["Tyrell"], ["Wayne Enterprises"]],
      ordered: true
    },
    {
      id: "headcount-all-departments",
      title: "Headcount for every department (including empty ones)",
      difficulty: "medium",
      prompt: "<p>HR's dashboard must list <strong>every</strong> department with its number of employees - a department with nobody must show <code>0</code>, not disappear.</p><p>Columns: <code>department, headcount</code>. Order by <code>headcount</code> descending, then department name.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT d.name      AS department,
       COUNT(e.id)  AS headcount       -- COUNT(*) would give Legal 1, not 0!
FROM departments d
LEFT JOIN employees e ON e.department_id = d.id
GROUP BY d.id, d.name
ORDER BY headcount DESC, d.name;`,
      hint: "Start from <code>departments</code> and LEFT JOIN <code>employees</code> so Legal stays. Then think carefully: <code>COUNT(*)</code> or <code>COUNT(e.id)</code>?",
      explanation: "<p>For Legal, the LEFT JOIN produces one row whose employee columns are all NULL. <code>COUNT(*)</code> counts that row (1); <code>COUNT(e.id)</code> skips the NULL and correctly gives 0. This exact trap is a favourite in SQL interviews.</p>",
      expected: [["Engineering", 5], ["Sales", 4], ["Finance", 2], ["Marketing", 2], ["HR", 1], ["Legal", 0]],
      ordered: true
    },
    {
      id: "second-highest-salary",
      title: "Second highest salary",
      difficulty: "medium",
      prompt: "<p>The most famous SQL interview question: return the second highest <strong>distinct</strong> salary in the company as a single value.</p><p>Columns: <code>second_highest</code>.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);   -- the highest one below the top`,
      hint: "The second highest is the <em>maximum</em> of all salaries that are <em>below</em> the overall maximum. Use a subquery for the overall maximum.",
      explanation: "<p>Two other answers interviewers accept: <code>SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1</code> (the DISTINCT matters if the top salary is shared), or a CTE with <code>DENSE_RANK() OVER (ORDER BY salary DESC)</code> filtered to 2. The MAX version returns NULL rather than no rows when there is no second value - a nice detail to mention.</p>",
      expected: [[130000]],
      ordered: true
    },
    {
      id: "above-department-average",
      title: "Paid above their department average",
      difficulty: "medium",
      prompt: "<p>For performance reviews, managers want to see who earns <strong>more than the average salary of their own department</strong>.</p><p>Columns: <code>name, department_id, salary</code>. Order by <code>department_id</code>, then <code>salary</code> descending.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT e.name, e.department_id, e.salary
FROM employees e
WHERE e.salary > (
  SELECT AVG(x.salary)                    -- correlated: re-evaluated per employee
  FROM employees x
  WHERE x.department_id = e.department_id -- "my" department
)
ORDER BY e.department_id, e.salary DESC;`,
      hint: "Use a correlated subquery: inside it, alias the table differently (<code>x</code>) and filter <code>x.department_id = e.department_id</code>, where <code>e</code> is the outer row.",
      explanation: "<p>Leo (no department) drops out: <code>x.department_id = NULL</code> matches nothing, so the average is NULL and the comparison is UNKNOWN. Finance has two equal salaries (105000), so nobody there is strictly above average. A window-function version: compute <code>AVG(salary) OVER (PARTITION BY department_id)</code> in a CTE, then filter.</p>",
      expected: [
        ["Alice Chen", 1, 150000],
        ["Dan Brown", 1, 130000],
        ["Eve Adams", 2, 110000],
        ["Henry Wilson", 3, 90000]
      ],
      ordered: true
    },
    {
      id: "customer-revenue",
      title: "Revenue per customer (CTE)",
      difficulty: "hard",
      prompt: "<p>Sales leadership wants a \"best customers\" table. For <strong>shipped</strong> orders only, show each customer's number of orders and total revenue (sum of <code>quantity * unit_price</code> over all their order lines). Customers with no shipped orders are not listed.</p><p>Columns: <code>customer, orders, revenue</code>. Order by <code>revenue</code> descending.</p>",
      starter: "-- Write your query here\nWITH order_totals AS (\n  \n)\nSELECT ",
      solution: `WITH order_totals AS (                 -- step 1: one row per order
  SELECT order_id, SUM(quantity * unit_price) AS total
  FROM order_items
  GROUP BY order_id
)
SELECT c.name       AS customer,         -- step 2: one row per customer
       COUNT(*)     AS orders,           -- safe: one row per order now
       SUM(t.total) AS revenue
FROM customers c
JOIN orders o       ON o.customer_id = c.id
JOIN order_totals t ON t.order_id = o.id
WHERE o.status = 'shipped'
GROUP BY c.id, c.name
ORDER BY revenue DESC;`,
      hint: "First total each order in a CTE (<code>GROUP BY order_id</code>). Then join customers &rarr; orders &rarr; that CTE, keep shipped orders and group by customer.",
      explanation: "<p>Pre-aggregating avoids the classic double-counting bug: if you join customers &rarr; orders &rarr; order_items directly and use <code>COUNT(*)</code>, an order with 3 lines counts as 3 orders. (<code>COUNT(DISTINCT o.id)</code> would also fix it.) Grouping by <code>c.id</code> as well as the name keeps two different customers with the same name apart.</p>",
      expected: [
        ["Stark Industries", 2, 4900],
        ["Acme Corp", 2, 2665],
        ["Umbrella", 1, 1200],
        ["Hooli", 1, 1160],
        ["Globex", 1, 1050],
        ["Initech", 1, 380],
        ["Acme Corporation", 1, 225]
      ],
      ordered: true
    },
    {
      id: "top-2-per-department",
      title: "Top 2 earners per department",
      difficulty: "hard",
      prompt: "<p>Each department head is asked to nominate their 2 highest-paid people for a leadership programme. For each department, return its <strong>2 highest-paid</strong> employees (exactly 2 when available; if salaries tie, the alphabetically first name wins). Ignore employees with no department or no salary.</p><p>Columns: <code>department, name, salary</code> (department = department name). Order by department name, then <code>salary</code> descending, then <code>name</code>.</p>",
      starter: "-- Write your query here\nWITH ranked AS (\n  \n)\nSELECT ",
      solution: `WITH ranked AS (
  SELECT d.name AS department,
         e.name,
         e.salary,
         ROW_NUMBER() OVER (
           PARTITION BY e.department_id          -- restart numbering per department
           ORDER BY e.salary DESC, e.name        -- name breaks ties
         ) AS rn
  FROM employees e
  JOIN departments d ON d.id = e.department_id
  WHERE e.salary IS NOT NULL
)
SELECT department, name, salary
FROM ranked
WHERE rn <= 2                                     -- filter AFTER the window is computed
ORDER BY department, salary DESC, name;`,
      hint: "Inside a CTE, number the rows with <code>ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC, name)</code>. Outside, keep <code>rn &lt;= 2</code>.",
      explanation: "<p>This is <em>the</em> \"top N per group\" pattern. Sales has a tie at 72000 (Grace, Nina); ROW_NUMBER with the name tie-breaker keeps exactly 2 rows. With <code>RANK() &lt;= 2</code> you would get 3 Sales rows - which might be what the business wants, so ask!</p>",
      expected: [
        ["Engineering", "Alice Chen", 150000],
        ["Engineering", "Dan Brown", 130000],
        ["Finance", "Jack White", 105000],
        ["Finance", "Kate Green", 105000],
        ["HR", "Mia King", 68000],
        ["Marketing", "Henry Wilson", 90000],
        ["Marketing", "Ivy Taylor", 65000],
        ["Sales", "Eve Adams", 110000],
        ["Sales", "Grace Lee", 72000]
      ],
      ordered: true
    },
    {
      id: "rank-vs-dense-rank",
      title: "RANK vs DENSE_RANK",
      difficulty: "medium",
      prompt: "<p>HR wants a salary league table that shows both ranking styles side by side. Rank all employees who have a salary from highest to lowest paid using <code>RANK()</code> and <code>DENSE_RANK()</code>.</p><p>Columns: <code>name, salary, salary_rank, dense_salary_rank</code>. Order by <code>salary</code> descending, then <code>name</code>.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT name,
       salary,
       RANK()       OVER (ORDER BY salary DESC) AS salary_rank,        -- 1,2,3,4,5,5,7...
       DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_salary_rank   -- 1,2,3,4,5,5,6...
FROM employees
WHERE salary IS NOT NULL
ORDER BY salary DESC, name;`,
      hint: "<code>RANK() OVER (ORDER BY salary DESC)</code>. The ORDER BY inside OVER controls the ranking; the final ORDER BY controls how the result is displayed.",
      explanation: "<p>After the 105000 tie, RANK jumps to 7 (two people took places 5 and 6) while DENSE_RANK continues at 6. Use DENSE_RANK for \"Nth highest distinct value\" questions.</p>",
      expected: [
        ["Alice Chen", 150000, 1, 1],
        ["Dan Brown", 130000, 2, 2],
        ["Bob Smith", 120000, 3, 3],
        ["Eve Adams", 110000, 4, 4],
        ["Jack White", 105000, 5, 5],
        ["Kate Green", 105000, 5, 5],
        ["Carol Diaz", 95000, 7, 6],
        ["Henry Wilson", 90000, 8, 7],
        ["Grace Lee", 72000, 9, 8],
        ["Nina Scott", 72000, 9, 8],
        ["Frank Moore", 70000, 11, 9],
        ["Mia King", 68000, 12, 10],
        ["Ivy Taylor", 65000, 13, 11],
        ["Leo Hall", 60000, 14, 12]
      ],
      ordered: true
    },
    {
      id: "running-total",
      title: "Running total of shipped orders",
      difficulty: "hard",
      prompt: "<p>Finance wants to watch revenue build up over the year. For <strong>shipped</strong> orders, show each order's total (sum of <code>quantity * unit_price</code>) and the running total of revenue up to that order.</p><p>Columns: <code>order_id, order_date, order_total, running_total</code>. Order by <code>order_date</code>.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `WITH order_totals AS (                           -- step 1: one row per shipped order
  SELECT o.id AS order_id,
         o.order_date,
         SUM(i.quantity * i.unit_price) AS order_total
  FROM orders o
  JOIN order_items i ON i.order_id = o.id
  WHERE o.status = 'shipped'
  GROUP BY o.id, o.order_date
)
SELECT order_id,                                  -- step 2: add the running total
       order_date,
       order_total,
       SUM(order_total) OVER (ORDER BY order_date) AS running_total
FROM order_totals
ORDER BY order_date;`,
      hint: "Compute each order's total first (a CTE with GROUP BY), then add <code>SUM(order_total) OVER (ORDER BY order_date)</code>.",
      explanation: "<p>The window sums every row from the first date up to the current one, like dragging <code>=SUM($C$2:C2)</code> down in Excel. If two orders shared a date, the default frame would give them the same running total; add <code>ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> to make it strictly row by row.</p>",
      expected: [
        [1, "2024-01-05", 2450, 2450],
        [2, "2024-01-12", 1050, 3500],
        [3, "2024-02-03", 215, 3715],
        [5, "2024-03-01", 1200, 4915],
        [6, "2024-03-15", 1160, 6075],
        [8, "2024-04-20", 4500, 10575],
        [10, "2024-05-18", 225, 10800],
        [11, "2024-06-01", 380, 11180],
        [12, "2024-06-10", 400, 11580]
      ],
      ordered: true
    },
    {
      id: "duplicate-emails",
      title: "Duplicate customer emails",
      difficulty: "easy",
      prompt: "<p>Before migrating to a new CRM, the data team must find email addresses used by <strong>more than one</strong> customer, and how many customers share each.</p><p>Columns: <code>email, customers</code>. Any order.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT email, COUNT(*) AS customers
FROM customers
GROUP BY email              -- one group per email address
HAVING COUNT(*) > 1;        -- keep only the shared ones`,
      hint: "Group by the column that <em>should</em> be unique, then keep the groups with <code>COUNT(*) &gt; 1</code>.",
      explanation: "<p>To see the full duplicate rows side by side, self-join: <code>customers a JOIN customers b ON a.email = b.email AND a.id &lt; b.id</code>. A <code>UNIQUE</code> constraint on <code>email</code> would have prevented the duplicate in the first place.</p>",
      expected: [["contact@acme.com", 2]],
      ordered: false
    }
  ],

  takeaways: [
    "<strong>INNER JOIN</strong> keeps matches only; <strong>LEFT JOIN</strong> keeps every left row and fills gaps with NULL.",
    "\"What's missing?\" = anti-join: <code>LEFT JOIN ... WHERE right.id IS NULL</code> or <code>NOT EXISTS</code>.",
    "Break big questions into steps with <strong>CTEs</strong> (<code>WITH</code>).",
    "<strong>Window functions</strong> add rankings and running totals without collapsing rows; filter them in an outer query.",
    "Good design stores each fact once (<strong>normalization</strong>), enforces it with <strong>keys</strong>, and speeds it up with <strong>indexes</strong>.",
    "<strong>Transactions</strong> make multi-step changes all-or-nothing (ACID)."
  ]
});
