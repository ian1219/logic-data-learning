LDL.registerLesson({
  id: "12",
  title: "SQL Basics",
  lang: "sql",
  minutes: 75,
  goal: "Learn to ask a database precise questions: pick columns, filter rows, sort, and summarise with groups - and handle NULL the way exams and interviewers expect.",

  analogy: `
<p>Think of a database as an <strong>Excel workbook</strong>. Each <strong>table</strong> is a sheet, each <strong>row</strong> is one record
(one employee, one order) and each <strong>column</strong> is one field (name, salary). The difference: instead of clicking
filters and dragging pivot tables, you <em>write down</em> what you want in one sentence - and the database does the clicking.</p>
<table>
  <tr><th>In Excel you would...</th><th>In SQL you write...</th></tr>
  <tr><td>hide columns you don't need</td><td><code>SELECT name, salary</code></td></tr>
  <tr><td>use the filter dropdown</td><td><code>WHERE salary &gt; 100000</code></td></tr>
  <tr><td>sort A &rarr; Z / largest first</td><td><code>ORDER BY salary DESC</code></td></tr>
  <tr><td>build a pivot table</td><td><code>GROUP BY department_id</code> + <code>COUNT(*)</code></td></tr>
</table>`,

  objectives: [
    "<strong>Read</strong> a table diagram and explain rows, columns, primary keys and foreign keys",
    "<strong>Write</strong> <code>SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT</code> queries that return exactly the rows you need",
    "<strong>Combine</strong> conditions with AND / OR / NOT, IN, BETWEEN, LIKE and IS NULL",
    "<strong>Summarise</strong> data with COUNT, SUM, AVG, MIN, MAX, GROUP BY and HAVING",
    "<strong>Predict</strong> how NULL behaves (three-valued logic) and avoid the classic traps"
  ],

  realWorld: `
<ul>
  <li><strong>Monthly reports:</strong> "total sales per region this month" is one GROUP BY query.</li>
  <li><strong>HR dashboards:</strong> headcount and average salary per department.</li>
  <li><strong>Data quality checks:</strong> "which records are missing an email?" (<code>IS NULL</code>).</li>
  <li><strong>Analyst work:</strong> anything you do with filters and pivots in Excel, but on millions of rows.</li>
  <li><strong>Exams and interviews:</strong> SQL rounds almost always start with WHERE, GROUP BY and HAVING questions.</li>
</ul>`,

  sections: [
    {
      title: "Meet the sample database",
      html: `
<p>Every query in lessons 12 and 13 runs on a small, made-up company database right here in your browser.
Each run starts from a <strong>fresh copy</strong>, so you can't break anything. Experiment freely!</p>
<p>A few terms first:</p>
<ul>
  <li><strong>Table</strong> - a grid of data about one kind of thing (employees, orders).</li>
  <li><strong>Primary key (PK)</strong> - a column that uniquely identifies each row, usually <code>id</code>. Like an employee badge number.</li>
  <li><strong>Foreign key (FK)</strong> - a column that points to a primary key in another table. <code>employees.department_id</code> says "this person works in department 2".</li>
</ul>
<pre>
  departments                 employees                          customers
 +---------------+           +-------------------+              +---------------+
 | id         PK |&lt;-----+    | id             PK |&lt;--+          | id         PK |
 | name          |      +----| department_id  FK |   | manager  | name          |
 | location      |           | manager_id     FK |---+ (self)   | email         |
 +---------------+           | name, email       |              | city          |
                             | salary            |              | signup_date   |
                             | hire_date         |              +---------------+
                             +-------------------+                      ^
                                       ^                                |
                                       | employee_id (sales rep)        | customer_id
                                       |          orders                |
                                       |    +-------------------+       |
                                       +----| employee_id    FK |       |
                                            | customer_id    FK |-------+
                                            | id             PK |&lt;---+
                                            | order_date        |    |
                                            | status            |    | order_id
                                            +-------------------+    |
  products                    order_items                            |
 +---------------+           +--------------------+                  |
 | id         PK |&lt;----------| product_id  PK, FK |                  |
 | name          |           | order_id    PK, FK |------------------+
 | category      |           | quantity           |
 | price         |           | unit_price         |
 +---------------+           +--------------------+

 Arrows go from a foreign key (FK) to the primary key (PK) it points at.
</pre>
<table>
  <tr><th>Table</th><th>Rows</th><th>Good to know</th></tr>
  <tr><td><code>departments</code></td><td>6</td><td>Engineering, Sales, Marketing, Finance, HR, Legal. <strong>Legal has no employees.</strong></td></tr>
  <tr><td><code>employees</code></td><td>15</td><td>Leo Hall has <strong>no department</strong>; Oscar Young has <strong>no salary</strong>; Ivy Taylor has <strong>no email</strong>; Alice Chen (the CEO) has no manager.</td></tr>
  <tr><td><code>customers</code></td><td>10</td><td>Wayne Enterprises has no city; two customers share the email <code>contact@acme.com</code>.</td></tr>
  <tr><td><code>products</code></td><td>10</td><td>3 categories: Electronics, Furniture, Stationery.</td></tr>
  <tr><td><code>orders</code></td><td>12</td><td><code>status</code> is <code>'pending'</code>, <code>'shipped'</code> or <code>'cancelled'</code>.</td></tr>
  <tr><td><code>order_items</code></td><td>22</td><td>One row per product in an order. Line total = <code>quantity * unit_price</code>.</td></tr>
</table>
<div class="callout tip"><p>The "missing" values are there on purpose. Real data is messy, and interview questions love these edge cases.</p></div>`
    },
    {
      title: "SELECT and FROM: choose your columns",
      html: `
<p><strong>What:</strong> <code>SELECT</code> lists the columns you want; <code>FROM</code> says which table.
<strong>Why:</strong> tables often have dozens of columns - you only want a few.</p>
<pre><code class="language-sql">SELECT name, salary          -- the columns, separated by commas
FROM employees;              -- the table. The ; ends the statement.</code></pre>
<table>
  <tr><th>name</th><th>salary</th></tr>
  <tr><td>Alice Chen</td><td>150000</td></tr>
  <tr><td>Bob Smith</td><td>120000</td></tr>
  <tr><td>...</td><td>... (15 rows)</td></tr>
</table>
<p>You can also <strong>calculate</strong> new columns and name them with <code>AS</code> (an <strong>alias</strong>):</p>
<pre><code class="language-sql">SELECT name, ROUND(salary / 12.0, 2) AS monthly_pay
FROM employees;</code></pre>
<ul>
  <li><code>SELECT *</code> means "all columns" - handy for exploring, but name your columns in real reports.</li>
  <li>Text values use <strong>single quotes</strong>: <code>'London'</code>. SQL keywords are not case-sensitive: <code>select</code> = <code>SELECT</code>.</li>
  <li><code>--</code> starts a comment, just like <code>//</code> in JavaScript.</li>
</ul>
<div class="callout warn"><p><strong>Integer division:</strong> <code>salary / 12</code> with whole numbers drops the decimals (95000 / 12 = 7916, not 7916.67).
Divide by <code>12.0</code> to get a decimal result.</p></div>`
    },
    {
      title: "WHERE: filter the rows",
      html: `
<p><strong>What:</strong> <code>WHERE</code> keeps only the rows where a condition is <strong>true</strong> - exactly like an Excel filter.
<strong>How:</strong> it's lesson 01's boolean logic, written in words.</p>
<pre><code class="language-sql">SELECT name, department_id, salary
FROM employees
WHERE department_id = 1 AND salary &gt; 100000;</code></pre>
<table>
  <tr><th>name</th><th>department_id</th><th>salary</th></tr>
  <tr><td>Alice Chen</td><td>1</td><td>150000</td></tr>
  <tr><td>Bob Smith</td><td>1</td><td>120000</td></tr>
  <tr><td>Dan Brown</td><td>1</td><td>130000</td></tr>
</table>
<p>Your toolbox for conditions:</p>
<table>
  <tr><th>You want...</th><th>SQL</th><th>JavaScript equivalent</th></tr>
  <tr><td>equal / not equal</td><td><code>city = 'London'</code> / <code>city &lt;&gt; 'London'</code></td><td><code>===</code> / <code>!==</code></td></tr>
  <tr><td>both conditions</td><td><code>a AND b</code></td><td><code>a &amp;&amp; b</code></td></tr>
  <tr><td>at least one</td><td><code>a OR b</code></td><td><code>a || b</code></td></tr>
  <tr><td>the opposite</td><td><code>NOT a</code></td><td><code>!a</code></td></tr>
  <tr><td>one of a list</td><td><code>department_id IN (2, 3)</code></td><td><code>[2, 3].includes(x)</code></td></tr>
  <tr><td>a range (inclusive)</td><td><code>price BETWEEN 50 AND 300</code></td><td><code>50 &lt;= p &amp;&amp; p &lt;= 300</code></td></tr>
  <tr><td>a text pattern</td><td><code>name LIKE 'S%'</code></td><td><code>name.startsWith("S")</code></td></tr>
  <tr><td>a missing value</td><td><code>email IS NULL</code></td><td><code>email === null</code></td></tr>
</table>
<p>In <code>LIKE</code>, <code>%</code> means "any text (even none)" and <code>_</code> means "exactly one character".
So <code>'%son'</code> = ends with "son", <code>'%an%'</code> = contains "an".</p>
<div class="callout warn"><p><strong>AND runs before OR</strong> (like <code>&amp;&amp;</code> before <code>||</code>).
<code>WHERE dept = 2 OR dept = 3 AND salary &gt; 80000</code> means <code>dept = 2 OR (dept = 3 AND salary &gt; 80000)</code>.
When you mix them, <strong>always add parentheses</strong>.</p></div>
<div class="callout note"><p>In SQLite, <code>LIKE</code> ignores upper/lower case for English letters. PostgreSQL's <code>LIKE</code> is case-sensitive (it has <code>ILIKE</code> for case-insensitive).</p></div>`
    },
    {
      title: "NULL: the 'unknown' value",
      html: `
<p><strong>What:</strong> <code>NULL</code> means <strong>"we don't know"</strong>. It is not zero and not an empty string.
Oscar's salary is NULL: maybe it's 50000, maybe 200000 - nobody has entered it yet.</p>
<p><strong>Why it matters:</strong> any comparison with an unknown value gives an unknown answer.
Is Oscar's salary <code>&gt; 100000</code>? Unknown. So SQL has <strong>three</strong> truth values: TRUE, FALSE and UNKNOWN.</p>
<div class="callout key"><p><code>WHERE</code> keeps a row only when the condition is <strong>TRUE</strong>. FALSE and UNKNOWN rows are both dropped.</p></div>
<table>
  <tr><th>A</th><th>B</th><th>A AND B</th><th>A OR B</th><th>NOT A</th></tr>
  <tr><td>TRUE</td><td>UNKNOWN</td><td>UNKNOWN</td><td><strong>TRUE</strong></td><td>FALSE</td></tr>
  <tr><td>FALSE</td><td>UNKNOWN</td><td><strong>FALSE</strong></td><td>UNKNOWN</td><td>TRUE</td></tr>
  <tr><td>UNKNOWN</td><td>UNKNOWN</td><td>UNKNOWN</td><td>UNKNOWN</td><td>UNKNOWN</td></tr>
</table>
<p>Easy way to remember: FALSE AND <em>anything</em> is FALSE; TRUE OR <em>anything</em> is TRUE (lesson 01's short-circuit idea).
Everything else with UNKNOWN stays UNKNOWN.</p>
<table>
  <tr><th>Expression</th><th>Result</th></tr>
  <tr><td><code>NULL = NULL</code></td><td>NULL (unknown) - <strong>not</strong> true!</td></tr>
  <tr><td><code>NULL + 100</code></td><td>NULL</td></tr>
  <tr><td><code>salary IS NULL</code></td><td>TRUE for Oscar - the right way to test</td></tr>
  <tr><td><code>COALESCE(salary, 0)</code></td><td>0 for Oscar - "use the first value that isn't NULL"</td></tr>
</table>
<div class="callout analogy"><p>Two people whose birthdays you don't know - do they share a birthday? You can't say yes. That's why <code>NULL = NULL</code> isn't TRUE.</p></div>`
    },
    {
      title: "ORDER BY, LIMIT and DISTINCT",
      html: `
<p><strong>ORDER BY</strong> sorts the result. <code>ASC</code> (smallest first) is the default; <code>DESC</code> is largest first.
Add more columns to break ties.</p>
<pre><code class="language-sql">SELECT name, salary
FROM employees
ORDER BY salary DESC, name     -- highest salary first; same salary -&gt; alphabetical
LIMIT 5;                       -- keep only the first 5 rows</code></pre>
<table>
  <tr><th>name</th><th>salary</th></tr>
  <tr><td>Alice Chen</td><td>150000</td></tr>
  <tr><td>Dan Brown</td><td>130000</td></tr>
  <tr><td>Bob Smith</td><td>120000</td></tr>
  <tr><td>Eve Adams</td><td>110000</td></tr>
  <tr><td>Jack White</td><td>105000</td></tr>
</table>
<p><strong>DISTINCT</strong> removes duplicate rows: <code>SELECT DISTINCT city FROM customers</code> lists each city once
(like Excel's "Remove duplicates").</p>
<div class="callout warn"><p>Without <code>ORDER BY</code>, the row order is <strong>not guaranteed</strong>. If order matters, ask for it.
In SQLite, NULLs come <em>first</em> when sorting ascending (PostgreSQL puts them last).</p></div>
<div class="callout note"><p>"Top N" syntax differs: <code>LIMIT 5</code> (SQLite, PostgreSQL, MySQL), <code>TOP 5</code> (SQL Server), <code>FETCH FIRST 5 ROWS ONLY</code> (Oracle, standard).</p></div>`
    },
    {
      title: "CASE: if/else inside a query",
      html: `
<p><strong>What:</strong> <code>CASE</code> creates a column whose value depends on conditions - like Excel's <code>IF()</code> or <code>IFS()</code>.
<strong>How:</strong> the <em>first</em> matching <code>WHEN</code> wins; <code>ELSE</code> catches the rest.</p>
<pre><code class="language-sql">SELECT name, price,
       CASE
         WHEN price &gt;= 400 THEN 'Premium'
         WHEN price &gt;= 50  THEN 'Standard'   -- only reached if price &lt; 400
         ELSE 'Budget'
       END AS tier
FROM products;</code></pre>
<table>
  <tr><th>name</th><th>price</th><th>tier</th></tr>
  <tr><td>Laptop</td><td>1200</td><td>Premium</td></tr>
  <tr><td>Monitor</td><td>300</td><td>Standard</td></tr>
  <tr><td>Lamp</td><td>40</td><td>Budget</td></tr>
</table>
<div class="callout tip"><p>If a column can be NULL, check <code>WHEN col IS NULL</code> <strong>first</strong> - otherwise NULLs fall through to <code>ELSE</code>.</p></div>`
    },
    {
      title: "Aggregate functions: many rows in, one value out",
      html: `
<p><strong>What:</strong> an <strong>aggregate</strong> squashes a column of values into one number - like Excel's SUM, AVERAGE, COUNT at the bottom of a column.</p>
<table>
  <tr><th>Function</th><th>Gives you</th><th>What about NULLs?</th></tr>
  <tr><td><code>COUNT(*)</code></td><td>number of rows</td><td>counts every row</td></tr>
  <tr><td><code>COUNT(col)</code></td><td>number of non-NULL values</td><td>skips NULLs</td></tr>
  <tr><td><code>COUNT(DISTINCT col)</code></td><td>number of different values</td><td>skips NULLs</td></tr>
  <tr><td><code>SUM(col)</code> / <code>AVG(col)</code></td><td>total / average</td><td>skip NULLs</td></tr>
  <tr><td><code>MIN(col)</code> / <code>MAX(col)</code></td><td>smallest / largest</td><td>skip NULLs</td></tr>
</table>
<pre><code class="language-sql">SELECT COUNT(*) AS all_rows, COUNT(salary) AS with_salary, ROUND(AVG(salary), 2) AS avg_salary
FROM employees;</code></pre>
<table>
  <tr><th>all_rows</th><th>with_salary</th><th>avg_salary</th></tr>
  <tr><td>15</td><td>14</td><td>93714.29</td></tr>
</table>
<div class="callout key"><p><code>COUNT(*)</code> = 15 rows, but <code>COUNT(salary)</code> = 14, because Oscar's salary is NULL.
And AVG divides the total by <strong>14</strong>, not 15.</p></div>`
    },
    {
      title: "GROUP BY and HAVING: the pivot table",
      html: `
<p><strong>What:</strong> <code>GROUP BY</code> splits rows into buckets with the same value, then runs the aggregates <em>once per bucket</em>.
<strong>Why:</strong> "headcount per department", "sales per month", "orders per status" - most reports look like this.</p>
<pre>
 employees (department_id, salary)       GROUP BY department_id           one row per group
 1  150000                                bucket 1: 150000, 120000,         1 | 5 people | avg 123750
 1  120000      ------------------&gt;                 95000, 130000, NULL
 2  110000                                bucket 2: 110000, 70000, ...      2 | 4 people | avg  81000
 2   70000                                ...                              ...
 NULL 60000                               bucket NULL: 60000                NULL | 1    | avg  60000
</pre>
<pre><code class="language-sql">SELECT department_id, COUNT(*) AS headcount
FROM employees
GROUP BY department_id
HAVING COUNT(*) &gt;= 3;          -- keep only the big groups</code></pre>
<table>
  <tr><th>department_id</th><th>headcount</th></tr>
  <tr><td>1</td><td>5</td></tr>
  <tr><td>2</td><td>4</td></tr>
</table>
<h3>WHERE vs HAVING</h3>
<table>
  <tr><th></th><th>WHERE</th><th>HAVING</th></tr>
  <tr><td>Filters...</td><td>single rows</td><td>whole groups</td></tr>
  <tr><td>Runs...</td><td>before grouping</td><td>after grouping</td></tr>
  <tr><td>Can use COUNT/SUM/AVG?</td><td>No</td><td>Yes</td></tr>
  <tr><td>Example</td><td><code>WHERE salary &gt; 50000</code></td><td><code>HAVING COUNT(*) &gt;= 3</code></td></tr>
</table>
<div class="callout analogy"><p>In an Excel pivot table, <strong>WHERE</strong> is the filter you apply to the source data <em>before</em> the pivot;
<strong>HAVING</strong> is the filter on the pivot's totals <em>after</em> it's built.</p></div>
<div class="callout warn"><p><strong>The GROUP BY rule:</strong> every column in SELECT must be either in GROUP BY or inside an aggregate.
<code>SELECT department_id, name, COUNT(*) ... GROUP BY department_id</code> is an error in most databases - which of the 5 names should it show?
SQLite allows it and picks one at random. Don't rely on that.</p></div>`
    },
    {
      title: "The order SQL actually runs in",
      html: `
<p>You <em>write</em> SELECT first, but the database <strong>runs</strong> the clauses in a different order.
Knowing it explains almost every "why doesn't this work?" moment.</p>
<pre>
  1. FROM       pick the table(s)                     15 employees
  2. WHERE      filter rows                           drop rows that fail the test
  3. GROUP BY   make buckets                          one bucket per department
  4. HAVING     filter buckets                        drop small groups
  5. SELECT     compute the output columns + aliases  name AS employee, COUNT(*) ...
  6. DISTINCT   remove duplicate rows
  7. ORDER BY   sort                                  can use SELECT aliases
  8. LIMIT      keep the first N
</pre>
<ul>
  <li>WHERE can't use <code>COUNT(*)</code>: groups don't exist yet (step 2 vs step 3). Use HAVING.</li>
  <li>WHERE can't use a SELECT alias in standard SQL: SELECT hasn't run yet.</li>
  <li>ORDER BY <em>can</em> use aliases: it runs after SELECT.</li>
  <li>LIMIT runs last, so <code>ORDER BY salary DESC LIMIT 3</code> really is the top 3.</li>
</ul>
<div class="callout tip"><p>Memory hook: <strong>F</strong>rom <strong>W</strong>here <strong>G</strong>roup <strong>H</strong>aving <strong>S</strong>elect <strong>O</strong>rder <strong>L</strong>imit -
"<strong>F</strong>riendly <strong>W</strong>orkers <strong>G</strong>o <strong>H</strong>ome <strong>S</strong>afely <strong>O</strong>n <strong>L</strong>eave".</p></div>`
    },
    {
      title: "Cheat sheet",
      html: `
<table>
  <tr><th>Task</th><th>Pattern</th></tr>
  <tr><td>All columns</td><td><code>SELECT * FROM t;</code></td></tr>
  <tr><td>Top N</td><td><code>ORDER BY col DESC LIMIT N</code></td></tr>
  <tr><td>Unique values</td><td><code>SELECT DISTINCT col FROM t</code></td></tr>
  <tr><td>Count per category</td><td><code>SELECT cat, COUNT(*) FROM t GROUP BY cat</code></td></tr>
  <tr><td>Groups above a threshold</td><td><code>GROUP BY cat HAVING COUNT(*) &gt; 5</code></td></tr>
  <tr><td>Find missing values</td><td><code>WHERE col IS NULL</code></td></tr>
  <tr><td>Replace NULL</td><td><code>COALESCE(col, 'n/a')</code></td></tr>
  <tr><td>Round</td><td><code>ROUND(AVG(col), 2)</code></td></tr>
  <tr><td>Glue text together</td><td><code>first || ' ' || last</code> (SQLite, PostgreSQL); <code>CONCAT()</code> in MySQL</td></tr>
  <tr><td>Year or month of a date</td><td><code>strftime('%Y', d)</code>, <code>strftime('%Y-%m', d)</code> (SQLite); <code>EXTRACT(YEAR FROM d)</code> elsewhere</td></tr>
  <tr><td>Decimal division</td><td><code>total * 1.0 / n</code></td></tr>
  <tr><td>Count rows matching a condition</td><td><code>SUM(CASE WHEN cond THEN 1 ELSE 0 END)</code></td></tr>
</table>`
    }
  ],

  examples: [
    {
      title: "Look around: a whole table",
      code: `SELECT * FROM departments;`,
      explain: `
<p><code>SELECT *</code> returns every column, <code>FROM departments</code> picks the table. You get all 6 rows.</p>
<p><strong>Try it:</strong> replace <code>departments</code> with <code>employees</code>, <code>products</code> or <code>orders</code> to explore the other tables.
Spot the NULLs in <code>employees</code>!</p>`
    },
    {
      title: "Choose columns and calculate a new one",
      code: `SELECT name,
       salary,
       ROUND(salary / 12.0, 2) AS monthly,       -- decimal division
       salary / 12             AS int_monthly    -- whole-number division!
FROM employees
WHERE id <= 4;`,
      explain: `
<ol>
  <li><strong>FROM</strong> employees, <strong>WHERE</strong> keeps ids 1-4.</li>
  <li><strong>SELECT</strong> computes two versions of the monthly salary and names them with <code>AS</code>.</li>
</ol>
<table>
  <tr><th>name</th><th>salary</th><th>monthly</th><th>int_monthly</th></tr>
  <tr><td>Carol Diaz</td><td>95000</td><td>7916.67</td><td>7916</td></tr>
</table>
<p>Integer / integer drops the decimals. <strong>Try it:</strong> add a column <code>salary * 1.1 AS after_raise</code>.</p>`
    },
    {
      title: "WHERE with AND",
      code: `SELECT name, department_id, salary
FROM employees
WHERE department_id = 1          -- Engineering
  AND salary > 100000
ORDER BY salary DESC;`,
      explain: `
<table>
  <tr><th>Step</th><th>Rows</th></tr>
  <tr><td>FROM employees</td><td>15</td></tr>
  <tr><td>WHERE department_id = 1</td><td>5 (Engineering)</td></tr>
  <tr><td>... AND salary &gt; 100000</td><td>3 (Carol has 95000, Oscar has NULL)</td></tr>
</table>
<p>Oscar disappears because <code>NULL &gt; 100000</code> is UNKNOWN, not TRUE.
<strong>Try it:</strong> change <code>AND</code> to <code>OR</code> and count the rows. Why so many more?</p>`
    },
    {
      title: "IN and BETWEEN together",
      code: `SELECT name, category, price
FROM products
WHERE category IN ('Electronics', 'Furniture')
  AND price BETWEEN 40 AND 300           -- includes 40 and 300
ORDER BY price;`,
      explain: `
<p><code>IN (...)</code> is a short way to write several ORs. <code>BETWEEN</code> includes both ends, so the Lamp (40) and the Monitor (300) are kept.</p>
<table>
  <tr><th>name</th><th>category</th><th>price</th></tr>
  <tr><td>Lamp</td><td>Furniture</td><td>40</td></tr>
  <tr><td>Keyboard</td><td>Electronics</td><td>50</td></tr>
  <tr><td>Chair</td><td>Furniture</td><td>250</td></tr>
  <tr><td>Monitor</td><td>Electronics</td><td>300</td></tr>
</table>
<p><strong>Try it:</strong> use <code>NOT IN</code> instead of <code>IN</code> - only Stationery is left to check.</p>`
    },
    {
      title: "NULL is not equal to anything - not even NULL",
      code: `SELECT name,
       salary,
       salary = NULL        AS eq_null,       -- always NULL (unknown)
       salary IS NULL       AS is_null,       -- 1 (true) or 0 (false)
       COALESCE(salary, 0)  AS salary_or_zero
FROM employees
WHERE id IN (14, 15);`,
      explain: `
<table>
  <tr><th>name</th><th>salary</th><th>eq_null</th><th>is_null</th><th>salary_or_zero</th></tr>
  <tr><td>Nina Scott</td><td>72000</td><td>NULL</td><td>0</td><td>72000</td></tr>
  <tr><td>Oscar Young</td><td>NULL</td><td>NULL</td><td>1</td><td>0</td></tr>
</table>
<p><code>= NULL</code> gives NULL for <em>both</em> rows - it can never be TRUE. <code>IS NULL</code> is the correct test. SQLite shows TRUE/FALSE as 1/0.</p>
<p><strong>Try it:</strong> run <code>SELECT name FROM employees WHERE email = NULL;</code> (0 rows), then with <code>IS NULL</code>.</p>`
    },
    {
      title: "CASE: put products into price tiers",
      code: `SELECT name,
       price,
       CASE
         WHEN price >= 400 THEN 'Premium'
         WHEN price >= 50  THEN 'Standard'
         ELSE 'Budget'
       END AS tier
FROM products
ORDER BY price DESC;`,
      explain: `
<p>For each row, CASE tests the WHENs <strong>top to bottom</strong> and stops at the first TRUE one.
A 300 Monitor fails <code>&gt;= 400</code>, passes <code>&gt;= 50</code> &rarr; <code>'Standard'</code>.</p>
<p><strong>Try it:</strong> swap the order of the two WHEN lines. Now everything 50+ becomes Standard - order matters!</p>`
    },
    {
      title: "COUNT(*) vs COUNT(column) vs COUNT(DISTINCT)",
      code: `SELECT COUNT(*)                      AS all_rows,
       COUNT(salary)                 AS with_salary,
       COUNT(email)                  AS with_email,
       COUNT(DISTINCT department_id) AS departments_used,
       SUM(salary)                   AS payroll
FROM employees;`,
      explain: `
<table>
  <tr><th>all_rows</th><th>with_salary</th><th>with_email</th><th>departments_used</th><th>payroll</th></tr>
  <tr><td>15</td><td>14</td><td>14</td><td>5</td><td>1312000</td></tr>
</table>
<ul>
  <li>Oscar has no salary and Ivy has no email, so those counts are 14.</li>
  <li>Only 5 distinct departments are used (Legal has nobody; Leo's NULL isn't counted).</li>
</ul>
<p><strong>Try it:</strong> add <code>ROUND(AVG(salary), 2)</code> and check it equals 1312000 / 14.</p>`
    },
    {
      title: "GROUP BY: a pivot table of products",
      code: `SELECT category,
       COUNT(*)             AS products,
       MIN(price)           AS cheapest,
       MAX(price)           AS priciest,
       ROUND(AVG(price), 2) AS avg_price
FROM products
GROUP BY category
ORDER BY avg_price DESC;`,
      explain: `
<p>10 product rows go in, <strong>3 group rows</strong> come out - one per category:</p>
<table>
  <tr><th>category</th><th>products</th><th>cheapest</th><th>priciest</th><th>avg_price</th></tr>
  <tr><td>Electronics</td><td>4</td><td>25</td><td>1200</td><td>393.75</td></tr>
  <tr><td>Furniture</td><td>3</td><td>40</td><td>450</td><td>246.67</td></tr>
  <tr><td>Stationery</td><td>3</td><td>4.5</td><td>120</td><td>45.67</td></tr>
</table>
<p><strong>Try it:</strong> add <code>HAVING COUNT(*) &gt; 3</code> before ORDER BY - only Electronics survives.</p>`
    },
    {
      title: "WHERE and HAVING in one query",
      code: `SELECT department_id,
       COUNT(*)              AS headcount,
       ROUND(AVG(salary), 2) AS avg_salary
FROM employees
WHERE hire_date >= '2017-01-01'     -- 1) row filter: recent hires only
GROUP BY department_id              -- 2) bucket them
HAVING COUNT(*) >= 2                -- 3) group filter: at least 2 recent hires
ORDER BY headcount DESC, department_id;`,
      explain: `
<ol>
  <li><strong>WHERE</strong> removes people hired before 2017 (Alice, Bob, Eve) - rows, before grouping.</li>
  <li><strong>GROUP BY</strong> makes one bucket per department.</li>
  <li><strong>HAVING</strong> removes buckets with fewer than 2 people (HR, and Leo's NULL group).</li>
</ol>
<table>
  <tr><th>department_id</th><th>headcount</th><th>avg_salary</th></tr>
  <tr><td>1</td><td>3</td><td>112500</td></tr>
  <tr><td>2</td><td>3</td><td>71333.33</td></tr>
  <tr><td>4</td><td>2</td><td>105000</td></tr>
  <tr><td>3</td><td>2</td><td>77500</td></tr>
</table>
<p>Engineering's average is over 2 salaries (Carol, Dan) because Oscar's is NULL.
<strong>Try it:</strong> move <code>COUNT(*) &gt;= 2</code> into the WHERE clause and read the error message.</p>`
    },
    {
      title: "Conditional counting: a monthly status report",
      code: `SELECT strftime('%Y-%m', order_date)                    AS month,
       COUNT(*)                                          AS orders,
       SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END)  AS shipped,
       SUM(CASE WHEN status <> 'shipped' THEN 1 ELSE 0 END) AS not_shipped
FROM orders
GROUP BY month
ORDER BY month;`,
      explain: `
<p>This is the SQL version of a pivot table with statuses as columns - a very common report at work.</p>
<ul>
  <li><code>strftime('%Y-%m', order_date)</code> turns <code>'2024-02-18'</code> into <code>'2024-02'</code>, so we group by month.</li>
  <li><code>CASE ... THEN 1 ELSE 0</code> turns each row into a 1 or 0; <code>SUM</code> adds them up = a count of matching rows.</li>
</ul>
<p><strong>Try it:</strong> add a column counting <code>'cancelled'</code> orders.</p>`
    }
  ],

  pitfalls: [
    "<code>WHERE email = NULL</code> returns nothing. Use <code>IS NULL</code> / <code>IS NOT NULL</code>.",
    "<code>NOT IN</code> silently skips NULLs: <code>department_id NOT IN (1, 2)</code> does <strong>not</strong> return Leo (NULL department). And if the list itself contains a NULL, you get <strong>no rows at all</strong>.",
    "Aggregates in WHERE are an error: <code>WHERE COUNT(*) &gt; 3</code>. Filter groups with <code>HAVING</code>.",
    "<code>COUNT(*)</code> counts rows; <code>COUNT(col)</code> skips NULLs. <code>AVG(col)</code> divides by the non-NULL count.",
    "Integer division: <code>7 / 2</code> is <code>3</code> in SQLite, PostgreSQL and SQL Server. Use <code>7 / 2.0</code> or <code>* 1.0</code>.",
    "Mixing AND and OR without parentheses: AND is evaluated first.",
    "Text goes in <strong>single</strong> quotes (<code>'London'</code>). Double quotes are for column/table names.",
    "Selecting a column that is neither grouped nor aggregated works in SQLite but fails in most other databases.",
    "Never rely on row order without <code>ORDER BY</code>."
  ],

  quiz: [
    {
      q: "The employees table has 15 rows. Oscar's salary is NULL. What does this return?",
      code: `SELECT COUNT(*), COUNT(salary) FROM employees;`,
      options: ["15, 15", "15, 14", "14, 14", "14, 15"],
      answer: 1,
      explain: "<p><code>COUNT(*)</code> counts <strong>rows</strong> (15). <code>COUNT(salary)</code> counts <strong>non-NULL values</strong> in that column, so Oscar is skipped (14).</p>"
    },
    {
      q: "How many rows does this return?",
      code: `SELECT name FROM employees WHERE email = NULL;`,
      options: ["0", "1 (Ivy Taylor)", "14", "An error"],
      answer: 0,
      explain: "<p><code>email = NULL</code> is UNKNOWN for every row - even Ivy's, whose email really is NULL. WHERE keeps only TRUE rows, so you get <strong>0 rows</strong>. Write <code>email IS NULL</code> instead.</p>"
    },
    {
      q: "Which query lists departments with <strong>more than 3</strong> employees?",
      options: [
        "<code>SELECT department_id FROM employees WHERE COUNT(*) &gt; 3 GROUP BY department_id</code>",
        "<code>SELECT department_id FROM employees GROUP BY department_id HAVING COUNT(*) &gt; 3</code>",
        "<code>SELECT department_id FROM employees HAVING COUNT(*) &gt; 3</code>",
        "<code>SELECT department_id, COUNT(*) &gt; 3 FROM employees</code>"
      ],
      answer: 1,
      explain: "<p>A condition on an aggregate (<code>COUNT(*)</code>) belongs in <strong>HAVING</strong>, after <strong>GROUP BY</strong>. WHERE runs before groups exist, so option A is an error. Option C has no GROUP BY, so it treats the whole table as one group.</p>"
    },
    {
      q: "Sales (department 2) has 4 employees. In Marketing (department 3), Henry earns 90000 and Ivy 65000. How many rows?",
      code: `SELECT name FROM employees
WHERE department_id = 2 OR department_id = 3 AND salary > 80000;`,
      options: ["1", "2", "5", "6"],
      answer: 2,
      explain: "<p>AND runs before OR, so this means <code>dept = 2 OR (dept = 3 AND salary &gt; 80000)</code>: all 4 Sales people plus Henry = <strong>5</strong>. If you meant \"Sales or Marketing, earning over 80000\", write <code>(dept = 2 OR dept = 3) AND salary &gt; 80000</code>.</p>"
    },
    {
      q: "Departments 1 and 2 have 9 employees in total, and Leo has <strong>no department</strong> (NULL). Of the 15 employees, how many does this return?",
      code: `SELECT COUNT(*) FROM employees WHERE department_id NOT IN (1, 2);`,
      options: ["4", "5", "6", "15"],
      answer: 1,
      explain: "<p>15 - 9 = 6 people are outside departments 1 and 2, but for Leo <code>NULL NOT IN (1, 2)</code> is UNKNOWN, so he's dropped. The answer is <strong>5</strong>. To include him: <code>... OR department_id IS NULL</code>.</p>"
    },
    {
      q: "What does this return?",
      code: `SELECT AVG(x) FROM (SELECT 100 AS x UNION ALL SELECT NULL UNION ALL SELECT 200);`,
      options: ["100", "150", "NULL", "300"],
      answer: 1,
      explain: "<p>AVG <strong>ignores NULLs</strong>: (100 + 200) / 2 = 150. It does not treat NULL as 0 (that would give 100). Use <code>AVG(COALESCE(x, 0))</code> if you really want missing values counted as zero.</p>"
    },
    {
      q: "In which order does the database logically run these clauses?",
      options: [
        "SELECT &rarr; FROM &rarr; WHERE &rarr; GROUP BY &rarr; HAVING &rarr; ORDER BY",
        "FROM &rarr; WHERE &rarr; GROUP BY &rarr; HAVING &rarr; SELECT &rarr; ORDER BY",
        "FROM &rarr; SELECT &rarr; WHERE &rarr; ORDER BY &rarr; GROUP BY &rarr; HAVING",
        "FROM &rarr; GROUP BY &rarr; WHERE &rarr; SELECT &rarr; HAVING &rarr; ORDER BY"
      ],
      answer: 1,
      explain: "<p>Rows are fetched (FROM), filtered (WHERE), grouped (GROUP BY), groups filtered (HAVING), columns computed (SELECT), then sorted (ORDER BY) and cut (LIMIT). That's why ORDER BY can use SELECT aliases but WHERE can't.</p>"
    }
  ],

  interview: [
    { q: "What is the difference between WHERE and HAVING?",
      a: "<p>WHERE filters individual rows <em>before</em> grouping and can't use aggregates. HAVING filters groups <em>after</em> GROUP BY and can use aggregates like <code>COUNT(*)</code>. A query can use both: WHERE to pick the rows, HAVING to pick the groups.</p>" },
    { q: "In what order is a SELECT statement logically executed?",
      a: "<p><code>FROM &rarr; WHERE &rarr; GROUP BY &rarr; HAVING &rarr; SELECT &rarr; DISTINCT &rarr; ORDER BY &rarr; LIMIT</code>. That's why WHERE can't see SELECT aliases but ORDER BY can.</p>" },
    { q: "What's the difference between <code>COUNT(*)</code>, <code>COUNT(col)</code> and <code>COUNT(DISTINCT col)</code>?",
      a: "<p><code>COUNT(*)</code> counts rows. <code>COUNT(col)</code> counts non-NULL values. <code>COUNT(DISTINCT col)</code> counts different non-NULL values. On our employees table: 15, 14 (salary) and 5 (department_id).</p>" },
    { q: "Why does <code>WHERE x = NULL</code> return no rows?",
      a: "<p>NULL means unknown, so any comparison with it is UNKNOWN, not TRUE - and WHERE keeps only TRUE rows. SQL uses three-valued logic. Use <code>IS NULL</code> / <code>IS NOT NULL</code>.</p>" },
    { q: "What is the difference between DISTINCT and GROUP BY?",
      a: "<p>Both produce unique combinations: <code>SELECT DISTINCT city</code> equals <code>SELECT city ... GROUP BY city</code>. Use GROUP BY when you also need aggregates per group; DISTINCT just removes duplicates.</p>" },
    { q: "How do you count how many rows match a condition, per group, in one query?",
      a: "<p>Conditional aggregation: <code>SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END)</code> (or <code>COUNT(CASE WHEN ... THEN 1 END)</code>, since COUNT skips the NULL from a missing ELSE). It's how you build pivot-style reports in SQL.</p>" }
  ],

  exercises: [
    {
      id: "department-list",
      title: "Warm-up: list the departments",
      difficulty: "easy",
      prompt: "<p>Your new manager asks: <em>\"What departments do we have, and where are they?\"</em></p><p>Columns: <code>name, location</code> from <code>departments</code>. Order by <code>name</code> (A &rarr; Z).</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT name, location      -- only the columns we were asked for
FROM departments
ORDER BY name;             -- ASC (A to Z) is the default`,
      hint: "Three parts: <code>SELECT</code> the two columns, <code>FROM departments</code>, then <code>ORDER BY name</code>.",
      expected: [
        ["Engineering", "Berlin"], ["Finance", "New York"], ["HR", "Berlin"],
        ["Legal", "New York"], ["Marketing", "London"], ["Sales", "London"]
      ],
      ordered: true
    },
    {
      id: "furniture-prices",
      title: "Warm-up: furniture price list",
      difficulty: "easy",
      prompt: "<p>The office manager is furnishing a new room and wants the furniture price list, cheapest first.</p><p>Columns: <code>name, price</code> for products whose <code>category</code> is <code>'Furniture'</code>. Order by <code>price</code> ascending.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT name, price
FROM products
WHERE category = 'Furniture'   -- text values go in single quotes
ORDER BY price;`,
      hint: "Filter with <code>WHERE category = 'Furniture'</code> (single quotes around text).",
      expected: [["Lamp", 40], ["Chair", 250], ["Desk", 450]],
      ordered: true
    },
    {
      id: "high-earners",
      title: "High earners",
      difficulty: "easy",
      prompt: "<p>Finance is reviewing senior pay and wants everyone earning <strong>at least 100000</strong>.</p><p>Columns: <code>name, salary</code>. Order by <code>salary</code> descending; if two people earn the same, order them by <code>name</code>.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT name, salary
FROM employees
WHERE salary >= 100000          -- "at least" means >=
ORDER BY salary DESC, name;     -- name breaks ties`,
      hint: "\"At least\" means <code>&gt;=</code>. You can sort by two columns: <code>ORDER BY salary DESC, name</code>.",
      explanation: "<p>Jack White and Kate Green both earn 105000 - the second sort key (<code>name</code>) decides who comes first. Without it, their order is not guaranteed.</p>",
      expected: [
        ["Alice Chen", 150000],
        ["Dan Brown", 130000],
        ["Bob Smith", 120000],
        ["Eve Adams", 110000],
        ["Jack White", 105000],
        ["Kate Green", 105000]
      ],
      ordered: true
    },
    {
      id: "recent-sales-marketing",
      title: "Recent hires in Sales or Marketing",
      difficulty: "easy",
      prompt: "<p>HR is planning onboarding check-ins for recent hires in <strong>Sales (department 2) or Marketing (department 3)</strong> who joined on or after <code>'2020-01-01'</code>.</p><p>Columns: <code>name, department_id, hire_date</code>. Order by <code>hire_date</code> (oldest first).</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT name, department_id, hire_date
FROM employees
WHERE department_id IN (2, 3)        -- same as (department_id = 2 OR department_id = 3)
  AND hire_date >= '2020-01-01'      -- 'YYYY-MM-DD' text compares correctly
ORDER BY hire_date;`,
      hint: "Use <code>department_id IN (2, 3)</code> joined with <code>AND</code> to the date test. If you use OR instead of IN, wrap it in parentheses!",
      explanation: "<p>Writing <code>department_id = 2 OR department_id = 3 AND hire_date &gt;= ...</code> without parentheses is a bug: AND binds first, so <em>all</em> of Sales (including Eve, hired 2016) would slip through. <code>IN</code> avoids the problem entirely.</p>",
      expected: [
        ["Frank Moore", 2, "2020-02-14"],
        ["Grace Lee", 2, "2021-06-30"],
        ["Ivy Taylor", 3, "2022-01-17"],
        ["Nina Scott", 2, "2023-07-01"]
      ],
      ordered: true
    },
    {
      id: "hired-2018-2019",
      title: "Hired in 2018 or 2019",
      difficulty: "easy",
      prompt: "<p>For a 5-year work anniversary campaign, HR needs everyone hired between <code>'2018-01-01'</code> and <code>'2019-12-31'</code>, both days included.</p><p>Columns: <code>name, hire_date</code>. Order by <code>hire_date</code>.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT name, hire_date
FROM employees
WHERE hire_date BETWEEN '2018-01-01' AND '2019-12-31'   -- inclusive on both ends
ORDER BY hire_date;`,
      hint: "<code>BETWEEN low AND high</code> includes both ends - perfect for date ranges.",
      expected: [
        ["Carol Diaz", "2018-01-10"],
        ["Jack White", "2018-04-23"],
        ["Dan Brown", "2019-05-20"],
        ["Mia King", "2019-10-10"]
      ],
      ordered: true
    },
    {
      id: "like-patterns",
      title: "Pattern matching with LIKE",
      difficulty: "easy",
      prompt: "<p>A sales rep remembers a customer \"whose name starts with S\" and another \"somewhere in San-something\". Find customers whose <code>name</code> starts with <code>S</code> <strong>or</strong> whose <code>city</code> starts with <code>San </code> (\"San\" followed by a space).</p><p>Columns: <code>name, city</code>. Order by <code>name</code>.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT name, city
FROM customers
WHERE name LIKE 'S%'          -- % = any text (even none)
   OR city LIKE 'San %'       -- 'San ' then anything
ORDER BY name;`,
      hint: "<code>%</code> matches any text, so <code>'S%'</code> means \"starts with S\". Combine two LIKE tests with OR.",
      expected: [
        ["Hooli", "San Francisco"],
        ["Soylent", "Berlin"],
        ["Stark Industries", "New York"],
        ["Tyrell", "San Francisco"]
      ],
      ordered: true
    },
    {
      id: "missing-data",
      title: "Find incomplete records",
      difficulty: "easy",
      prompt: "<p>Data-quality check: HR wants to fix employee records where <code>department_id</code>, <code>email</code> <strong>or</strong> <code>salary</code> is missing (NULL).</p><p>Columns: <code>name</code>. Order by <code>name</code>.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT name
FROM employees
WHERE department_id IS NULL     -- "= NULL" would never match
   OR email IS NULL
   OR salary IS NULL
ORDER BY name;`,
      hint: "<code>= NULL</code> never matches anything. Use <code>IS NULL</code> three times, joined with OR.",
      expected: [["Ivy Taylor"], ["Leo Hall"], ["Oscar Young"]],
      ordered: true
    },
    {
      id: "distinct-cities",
      title: "Distinct customer cities",
      difficulty: "easy",
      prompt: "<p>Marketing wants to know which cities our customers are in, to plan events. List each city <strong>once</strong>, and leave out customers with no city.</p><p>Columns: <code>city</code>. Order by <code>city</code>.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT DISTINCT city          -- each city once
FROM customers
WHERE city IS NOT NULL        -- drop Wayne Enterprises' missing city
ORDER BY city;`,
      hint: "<code>SELECT DISTINCT</code> removes duplicate rows. Then filter out the NULL city with <code>IS NOT NULL</code>.",
      expected: [["Berlin"], ["London"], ["New York"], ["San Francisco"]],
      ordered: true
    },
    {
      id: "top-3-products",
      title: "Three most expensive products",
      difficulty: "easy",
      prompt: "<p>The sales team wants to feature our 3 most expensive products on the homepage.</p><p>Columns: <code>name, price</code>. Order by <code>price</code> descending.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT name, price
FROM products
ORDER BY price DESC
LIMIT 3;                -- LIMIT runs last, after sorting`,
      hint: "Sort from most to least expensive, then keep only the first 3 rows with <code>LIMIT</code>.",
      expected: [["Laptop", 1200], ["Desk", 450], ["Monitor", 300]],
      ordered: true
    },
    {
      id: "salary-bands",
      title: "Salary bands with CASE",
      difficulty: "medium",
      prompt: `<p>HR is preparing a pay-band report. Label every employee:</p>
<ul>
  <li><code>'Unknown'</code> if salary is NULL</li>
  <li><code>'High'</code> if salary &gt;= 120000</li>
  <li><code>'Mid'</code> if salary &gt;= 80000</li>
  <li><code>'Low'</code> otherwise</li>
</ul>
<p>Columns: <code>name, band</code>. Order by employee <code>id</code>.</p>`,
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT name,
       CASE
         WHEN salary IS NULL   THEN 'Unknown'   -- handle NULL first
         WHEN salary >= 120000 THEN 'High'      -- first matching WHEN wins,
         WHEN salary >= 80000  THEN 'Mid'       -- so no upper bound is needed here
         ELSE 'Low'
       END AS band
FROM employees
ORDER BY id;`,
      hint: "<code>CASE WHEN ... THEN ... WHEN ... THEN ... ELSE ... END AS band</code>. Put the NULL test first and the WHENs from highest to lowest.",
      explanation: "<p>For Oscar, <code>salary &gt;= 120000</code> is UNKNOWN, which CASE treats as \"not matched\". Without the <code>IS NULL</code> line he would fall through to ELSE and be labelled <code>'Low'</code> - wrong and misleading in a pay report.</p>",
      expected: [
        ["Alice Chen", "High"], ["Bob Smith", "High"], ["Carol Diaz", "Mid"], ["Dan Brown", "High"],
        ["Eve Adams", "Mid"], ["Frank Moore", "Low"], ["Grace Lee", "Low"], ["Henry Wilson", "Mid"],
        ["Ivy Taylor", "Low"], ["Jack White", "Mid"], ["Kate Green", "Mid"], ["Leo Hall", "Low"],
        ["Mia King", "Low"], ["Nina Scott", "Low"], ["Oscar Young", "Unknown"]
      ],
      ordered: true
    },
    {
      id: "company-stats",
      title: "Company salary statistics",
      difficulty: "medium",
      prompt: "<p>The CFO wants a one-line summary of payroll. Return <strong>one row</strong> with: the total number of employees, how many have a salary, the lowest salary, the highest salary and the average salary rounded to 2 decimals.</p><p>Columns: <code>total_employees, salaried, min_salary, max_salary, avg_salary</code>.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT COUNT(*)              AS total_employees,   -- every row
       COUNT(salary)         AS salaried,          -- non-NULL salaries only
       MIN(salary)           AS min_salary,
       MAX(salary)           AS max_salary,
       ROUND(AVG(salary), 2) AS avg_salary         -- AVG ignores NULLs
FROM employees;`,
      hint: "No GROUP BY needed - aggregates without GROUP BY treat the whole table as one group. Note that <code>COUNT(*)</code> and <code>COUNT(salary)</code> differ here.",
      explanation: "<p>The average is 1,312,000 / <strong>14</strong> = 93714.29, not / 15, because AVG skips Oscar's NULL salary. If the CFO wanted missing salaries counted as 0, you'd write <code>AVG(COALESCE(salary, 0))</code> - but that's rarely what you want.</p>",
      expected: [[15, 14, 60000, 150000, 93714.29]],
      ordered: true
    },
    {
      id: "department-headcount",
      title: "Headcount and average salary per department",
      difficulty: "medium",
      prompt: "<p>HR's monthly dashboard needs, for each <code>department_id</code> in the employees table, the number of employees and their average salary rounded to 2 decimals. Include the NULL group (employees without a department).</p><p>Columns: <code>department_id, headcount, avg_salary</code>. Order by <code>department_id</code> (SQLite puts NULL first).</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT department_id,
       COUNT(*)              AS headcount,
       ROUND(AVG(salary), 2) AS avg_salary
FROM employees
GROUP BY department_id          -- NULLs form one group of their own
ORDER BY department_id;`,
      hint: "<code>GROUP BY department_id</code> makes one row per department; then use <code>COUNT(*)</code> and <code>ROUND(AVG(salary), 2)</code> in SELECT.",
      explanation: "<p>Engineering has 5 people, but its average (123750) is over the 4 known salaries. Also note GROUP BY puts all NULL department_ids into <strong>one</strong> group, even though <code>NULL = NULL</code> isn't true in WHERE.</p>",
      expected: [
        [null, 1, 60000],
        [1, 5, 123750],
        [2, 4, 81000],
        [3, 2, 77500],
        [4, 2, 105000],
        [5, 1, 68000]
      ],
      ordered: true
    },
    {
      id: "big-departments",
      title: "Departments with at least 3 employees",
      difficulty: "medium",
      prompt: "<p>Management wants to know which departments are big enough (3 or more people) to need a team lead. Ignore employees without a department.</p><p>Columns: <code>department_id, headcount</code>. Order by <code>headcount</code> descending, then <code>department_id</code>.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT department_id, COUNT(*) AS headcount
FROM employees
WHERE department_id IS NOT NULL    -- row filter goes in WHERE
GROUP BY department_id
HAVING COUNT(*) >= 3               -- group filter goes in HAVING
ORDER BY headcount DESC, department_id;`,
      hint: "Two filters: \"has a department\" is about single rows (WHERE); \"3 or more people\" is about groups (HAVING).",
      explanation: "<p>This query uses both filters in their right places. Putting <code>COUNT(*) &gt;= 3</code> in WHERE is an error, because WHERE runs before groups exist.</p>",
      expected: [[1, 5], [2, 4]],
      ordered: true
    },
    {
      id: "large-orders",
      title: "Orders worth more than 1000",
      difficulty: "hard",
      prompt: "<p>The finance team flags large orders for extra checks. Using <code>order_items</code>, compute each order's total (the sum of <code>quantity * unit_price</code> over its lines) and keep only orders whose total is <strong>greater than 1000</strong>.</p><p>Columns: <code>order_id, total</code>. Order by <code>total</code> descending.</p>",
      starter: "-- Write your query here\nSELECT ",
      solution: `SELECT order_id,
       SUM(quantity * unit_price) AS total     -- line totals, added up per order
FROM order_items
GROUP BY order_id
HAVING SUM(quantity * unit_price) > 1000   -- portable: repeat the expression
ORDER BY total DESC;                        -- ORDER BY can use the alias`,
      hint: "You can aggregate an expression: <code>SUM(quantity * unit_price)</code>. Group by <code>order_id</code>, then filter the groups with HAVING.",
      explanation: "<p>Each order has 1-3 lines in <code>order_items</code>. GROUP BY collapses them into one row per order, and HAVING keeps the big ones. SQLite also accepts <code>HAVING total &gt; 1000</code>, but repeating the expression works in every database.</p>",
      expected: [[8, 4500], [1, 2450], [5, 1200], [6, 1160], [2, 1050]],
      ordered: true
    }
  ],

  takeaways: [
    "<code>SELECT</code> picks columns, <code>WHERE</code> picks rows, <code>ORDER BY</code> sorts, <code>LIMIT</code> cuts.",
    "<code>NULL</code> means unknown: compare it with <code>IS NULL</code>, never <code>= NULL</code>.",
    "<code>COUNT(*)</code> counts rows; <code>COUNT(col)</code>, <code>SUM</code> and <code>AVG</code> skip NULLs.",
    "<code>GROUP BY</code> is a pivot table: one output row per group.",
    "<strong>WHERE</strong> filters rows before grouping; <strong>HAVING</strong> filters groups after.",
    "Logical order: FROM &rarr; WHERE &rarr; GROUP BY &rarr; HAVING &rarr; SELECT &rarr; ORDER BY &rarr; LIMIT."
  ]
});
