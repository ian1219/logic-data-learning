/* Sample company database used by the SQL lessons (12, 13) and the playground.
   Every query runs on a FRESH copy, so learners can't break it.

   Deliberate "interview traps" in the data:
   - Leo Hall has no department        (employees.department_id IS NULL)
   - Oscar Young has no salary yet     (employees.salary IS NULL)
   - Ivy Taylor has no email           (employees.email IS NULL)
   - Alice Chen has no manager         (top of the hierarchy)
   - Dan Brown earns more than his manager Bob Smith
   - Salary ties: Jack White = Kate Green, Grace Lee = Nina Scott
   - The Legal department has no employees
   - Soylent, Tyrell and Wayne Enterprises never placed an order
   - Two customers share the email contact@acme.com (duplicates)
   - The Whiteboard product was never ordered
   - Wayne Enterprises has no city
*/
window.LDL = window.LDL || {};

LDL.sampleDbSql = `
PRAGMA foreign_keys = ON;

CREATE TABLE departments (
  id        INTEGER PRIMARY KEY,
  name      TEXT    NOT NULL UNIQUE,
  location  TEXT    NOT NULL
);

CREATE TABLE employees (
  id             INTEGER PRIMARY KEY,
  name           TEXT    NOT NULL,
  email          TEXT,
  department_id  INTEGER REFERENCES departments(id),
  manager_id     INTEGER REFERENCES employees(id),
  salary         INTEGER,
  hire_date      TEXT    NOT NULL
);

CREATE TABLE customers (
  id           INTEGER PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  city         TEXT,
  signup_date  TEXT NOT NULL
);

CREATE TABLE products (
  id        INTEGER PRIMARY KEY,
  name      TEXT NOT NULL,
  category  TEXT NOT NULL,
  price     REAL NOT NULL
);

CREATE TABLE orders (
  id           INTEGER PRIMARY KEY,
  customer_id  INTEGER NOT NULL REFERENCES customers(id),
  employee_id  INTEGER NOT NULL REFERENCES employees(id),
  order_date   TEXT    NOT NULL,
  status       TEXT    NOT NULL CHECK (status IN ('pending', 'shipped', 'cancelled'))
);

CREATE TABLE order_items (
  order_id    INTEGER NOT NULL REFERENCES orders(id),
  product_id  INTEGER NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit_price  REAL    NOT NULL,
  PRIMARY KEY (order_id, product_id)
);

INSERT INTO departments (id, name, location) VALUES
  (1, 'Engineering', 'Berlin'),
  (2, 'Sales',       'London'),
  (3, 'Marketing',   'London'),
  (4, 'Finance',     'New York'),
  (5, 'HR',          'Berlin'),
  (6, 'Legal',       'New York');

INSERT INTO employees (id, name, email, department_id, manager_id, salary, hire_date) VALUES
  (1,  'Alice Chen',   'alice@corp.com', 1,    NULL, 150000, '2015-03-01'),
  (2,  'Bob Smith',    'bob@corp.com',   1,    1,    120000, '2016-07-15'),
  (3,  'Carol Diaz',   'carol@corp.com', 1,    2,     95000, '2018-01-10'),
  (4,  'Dan Brown',    'dan@corp.com',   1,    2,    130000, '2019-05-20'),
  (5,  'Eve Adams',    'eve@corp.com',   2,    1,    110000, '2016-11-01'),
  (6,  'Frank Moore',  'frank@corp.com', 2,    5,     70000, '2020-02-14'),
  (7,  'Grace Lee',    'grace@corp.com', 2,    5,     72000, '2021-06-30'),
  (8,  'Henry Wilson', 'henry@corp.com', 3,    1,     90000, '2017-09-05'),
  (9,  'Ivy Taylor',   NULL,             3,    8,     65000, '2022-01-17'),
  (10, 'Jack White',   'jack@corp.com',  4,    1,    105000, '2018-04-23'),
  (11, 'Kate Green',   'kate@corp.com',  4,    10,   105000, '2020-08-11'),
  (12, 'Leo Hall',     'leo@corp.com',   NULL, 1,     60000, '2023-03-01'),
  (13, 'Mia King',     'mia@corp.com',   5,    1,     68000, '2019-10-10'),
  (14, 'Nina Scott',   'nina@corp.com',  2,    5,     72000, '2023-07-01'),
  (15, 'Oscar Young',  'oscar@corp.com', 1,    2,      NULL, '2024-01-15');

INSERT INTO customers (id, name, email, city, signup_date) VALUES
  (1,  'Acme Corp',         'contact@acme.com',   'London',        '2021-01-05'),
  (2,  'Globex',            'info@globex.com',    'Berlin',        '2021-03-12'),
  (3,  'Initech',           'hello@initech.com',  'New York',      '2021-06-20'),
  (4,  'Umbrella',          'sales@umbrella.com', 'London',        '2022-02-01'),
  (5,  'Hooli',             'team@hooli.com',     'San Francisco', '2022-05-17'),
  (6,  'Stark Industries',  'tony@stark.com',     'New York',      '2022-09-09'),
  (7,  'Wayne Enterprises', 'bruce@wayne.com',    NULL,            '2023-01-23'),
  (8,  'Acme Corporation',  'contact@acme.com',   'London',        '2023-04-02'),
  (9,  'Soylent',           'info@soylent.com',   'Berlin',        '2023-08-15'),
  (10, 'Tyrell',            'eye@tyrell.com',     'San Francisco', '2024-02-29');

INSERT INTO products (id, name, category, price) VALUES
  (1,  'Laptop',     'Electronics', 1200.0),
  (2,  'Monitor',    'Electronics',  300.0),
  (3,  'Keyboard',   'Electronics',   50.0),
  (4,  'Mouse',      'Electronics',   25.0),
  (5,  'Desk',       'Furniture',    450.0),
  (6,  'Chair',      'Furniture',    250.0),
  (7,  'Lamp',       'Furniture',     40.0),
  (8,  'Notebook',   'Stationery',     4.5),
  (9,  'Pen Pack',   'Stationery',    12.5),
  (10, 'Whiteboard', 'Stationery',   120.0);

INSERT INTO orders (id, customer_id, employee_id, order_date, status) VALUES
  (1,  1, 5,  '2024-01-05', 'shipped'),
  (2,  2, 6,  '2024-01-12', 'shipped'),
  (3,  1, 6,  '2024-02-03', 'shipped'),
  (4,  3, 7,  '2024-02-18', 'cancelled'),
  (5,  4, 5,  '2024-03-01', 'shipped'),
  (6,  5, 14, '2024-03-15', 'shipped'),
  (7,  2, 7,  '2024-04-02', 'pending'),
  (8,  6, 6,  '2024-04-20', 'shipped'),
  (9,  1, 14, '2024-05-05', 'pending'),
  (10, 8, 5,  '2024-05-18', 'shipped'),
  (11, 3, 6,  '2024-06-01', 'shipped'),
  (12, 6, 7,  '2024-06-10', 'shipped');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 2, 1200.0), (1, 4, 2, 25.0),
  (2, 2, 3, 300.0),  (2, 3, 3, 50.0),
  (3, 8, 20, 4.5),   (3, 9, 10, 12.5),
  (4, 5, 1, 450.0),  (4, 6, 2, 250.0),
  (5, 1, 1, 1200.0),
  (6, 6, 4, 250.0),  (6, 7, 4, 40.0),
  (7, 3, 5, 50.0),   (7, 4, 5, 25.0),
  (8, 1, 3, 1200.0), (8, 2, 3, 300.0),
  (9, 5, 2, 450.0),
  (10, 8, 50, 4.5),
  (11, 2, 1, 300.0), (11, 7, 2, 40.0),
  (12, 6, 1, 250.0), (12, 3, 2, 50.0), (12, 9, 4, 12.5);
`;

/* Human-readable schema, used for display (e.g. a schema panel in the playground). */
LDL.sampleDbSchema = [
  { table: "departments", rows: 6,
    columns: ["id INTEGER PK", "name TEXT", "location TEXT"],
    description: "Company departments. Legal has no employees." },
  { table: "employees", rows: 15,
    columns: ["id INTEGER PK", "name TEXT", "email TEXT (nullable)", "department_id INTEGER FK -> departments.id (nullable)",
              "manager_id INTEGER FK -> employees.id (nullable)", "salary INTEGER (nullable)", "hire_date TEXT 'YYYY-MM-DD'"],
    description: "Staff. manager_id points back into the same table (self-reference). Some NULLs on purpose." },
  { table: "customers", rows: 10,
    columns: ["id INTEGER PK", "name TEXT", "email TEXT", "city TEXT (nullable)", "signup_date TEXT 'YYYY-MM-DD'"],
    description: "Client companies. Two share an email; three never ordered." },
  { table: "products", rows: 10,
    columns: ["id INTEGER PK", "name TEXT", "category TEXT", "price REAL"],
    description: "Catalogue of items for sale." },
  { table: "orders", rows: 12,
    columns: ["id INTEGER PK", "customer_id INTEGER FK -> customers.id", "employee_id INTEGER FK -> employees.id (sales rep)",
              "order_date TEXT 'YYYY-MM-DD'", "status TEXT ('pending' | 'shipped' | 'cancelled')"],
    description: "Order headers - one row per order." },
  { table: "order_items", rows: 22,
    columns: ["order_id INTEGER PK, FK -> orders.id", "product_id INTEGER PK, FK -> products.id", "quantity INTEGER", "unit_price REAL"],
    description: "Order lines - composite primary key (order_id, product_id). Line total = quantity * unit_price." }
];
