LDL.registerLesson({
  id: "08",
  title: "Classes & OOP",
  lang: "js",
  minutes: 60,
  goal: "Learn to model real things - customers, products, bank accounts - as objects that keep their data and their behaviour together, and explain the four pillars of OOP in one sentence each.",

  analogy: `
<p>Think of a <strong>cookie cutter</strong>. The cutter itself is not a cookie - it is the <em>shape</em> every cookie will have.
Press it into dough as many times as you like and you get many cookies: same shape, but each one can have its own icing.</p>
<p>In code, the cutter is a <strong>class</strong> and each cookie is an <strong>object</strong>. A <code>Customer</code> class describes what
every customer has (a name, an email) and can do (place an order). Then <code>new Customer("Ana")</code> and
<code>new Customer("Ben")</code> are two real customers built from that one blueprint.</p>`,

  objectives: [
    "Write a <strong>class</strong> with a <code>constructor</code>, fields and methods, and create objects from it with <code>new</code>",
    "Explain what <code>this</code> refers to and when to use <code>static</code> members",
    "Protect data with <code>#private</code> fields, getters and setters (<strong>encapsulation</strong>)",
    "Reuse and extend code with <code>extends</code>, <code>super</code> and method overriding (<strong>inheritance</strong> and <strong>polymorphism</strong>)",
    "Choose between <strong>composition</strong> and inheritance, and summarise <strong>SOLID</strong> in one line per letter"
  ],

  realWorld: `
<ul>
  <li><strong>Business apps:</strong> <code>Customer</code>, <code>Order</code>, <code>Invoice</code> and <code>Employee</code> classes are the heart of most company software.</li>
  <li><strong>UI frameworks:</strong> buttons, forms and pages are components - objects with their own state and methods.</li>
  <li><strong>Built-in JavaScript:</strong> <code>Date</code>, <code>Map</code>, <code>Set</code>, <code>Error</code> and <code>Promise</code> are all classes you already use with <code>new</code>.</li>
  <li><strong>Error handling:</strong> custom errors like <code>class ValidationError extends Error</code> use inheritance.</li>
  <li><strong>Interviews:</strong> "explain the 4 pillars", "composition vs inheritance" and "design a parking lot" are standard questions.</li>
</ul>`,

  sections: [
    {
      title: "Classes and objects",
      html: `
<p><strong>What:</strong> a <strong>class</strong> is a blueprint. An <strong>object</strong> (also called an <strong>instance</strong>) is one real thing built from it.</p>
<p><strong>Why:</strong> without classes, a customer's data lives in one place and the code that works on it lives somewhere else.
A class keeps them together, so each object "knows" its own data and what it can do.</p>
<p><strong>How:</strong></p>
<pre><code class="language-javascript">class Product {                       // the blueprint
  constructor(name, price) {          // runs once for every new Product
    this.name = name;                 // field: data stored on the object
    this.price = price;
  }
  priceWithTax(rate) {                // method: something the object can do
    return this.price * (1 + rate);
  }
}

const laptop = new Product("Laptop", 1000);   // an object
const mouse  = new Product("Mouse", 25);      // another object
console.log(laptop.priceWithTax(0.2));        // 1200</code></pre>
<table>
  <tr><th>Word</th><th>Meaning</th><th>In the code above</th></tr>
  <tr><td>Class</td><td>The blueprint / type</td><td><code>Product</code></td></tr>
  <tr><td>Object / instance</td><td>A thing built from the class</td><td><code>laptop</code>, <code>mouse</code></td></tr>
  <tr><td>Field (property)</td><td>A piece of data on the object</td><td><code>name</code>, <code>price</code></td></tr>
  <tr><td>Method</td><td>A function that belongs to the class</td><td><code>priceWithTax</code></td></tr>
  <tr><td><code>new</code></td><td>Builds a new object and runs the constructor</td><td><code>new Product(...)</code></td></tr>
</table>
<div class="callout key"><p>One class, many objects. Each object has its <strong>own</strong> data but <strong>shares</strong> the same methods.</p></div>`
    },
    {
      title: "The constructor and this",
      html: `
<p>The <strong>constructor</strong> is a special method that sets up a new object. <code>new</code> calls it for you automatically.</p>
<p>Inside a class, <strong><code>this</code></strong> means "the object we are working on right now". When you call
<code>laptop.priceWithTax(0.2)</code>, <code>this</code> is <code>laptop</code>. When you call <code>mouse.priceWithTax(0.2)</code>, <code>this</code> is <code>mouse</code>.</p>
<pre>
 new Product("Laptop", 1000)
        |
        v
 1. create an empty object  {}
 2. run constructor with this = that object
        this.name  = "Laptop"
        this.price = 1000
 3. hand back the object    { name: "Laptop", price: 1000 }
</pre>
<div class="callout analogy"><p><code>this</code> is like the word "my" on a form. "My name" means something different depending on who fills in the form.</p></div>
<div class="callout warn"><p>Inside methods, always write <code>this.price</code>, not just <code>price</code>. Forgetting <code>this.</code> is the number one beginner bug.</p></div>`
    },
    {
      title: "Static members: belonging to the class itself",
      html: `
<p>Normal fields belong to <strong>each object</strong>. A <strong>static</strong> field or method belongs to the <strong>class</strong> - there is only one copy, shared by everyone.</p>
<pre><code class="language-javascript">class Ticket {
  static issued = 0;                  // one counter for the whole class

  constructor(customer) {
    Ticket.issued++;                  // use the class name, not this
    this.number = Ticket.issued;      // each ticket gets its own number
    this.customer = customer;
  }

  static reset() {                    // called on the class: Ticket.reset()
    Ticket.issued = 0;
  }
}

new Ticket("Ana");                    // number 1
new Ticket("Ben");                    // number 2
console.log(Ticket.issued);           // 2</code></pre>
<table>
  <tr><th>Kind</th><th>Written as</th><th>How many copies?</th><th>Used as</th></tr>
  <tr><td>Instance field</td><td><code>this.number = ...</code></td><td>one per object</td><td><code>ticket.number</code></td></tr>
  <tr><td>Static field</td><td><code>static issued = 0;</code></td><td>one for the class</td><td><code>Ticket.issued</code></td></tr>
  <tr><td>Static method</td><td><code>static reset() {}</code></td><td>one for the class</td><td><code>Ticket.reset()</code></td></tr>
</table>
<div class="callout work"><p>You already use static methods: <code>Math.max()</code>, <code>Array.from()</code>, <code>Date.now()</code>, <code>Number.isInteger()</code>. They are utilities that don't need an object.</p></div>`
    },
    {
      title: "Pillar 1 - Encapsulation: protect your data",
      html: `
<p><strong>Encapsulation</strong> means keeping an object's data <em>inside</em> it and only allowing changes through its methods, which can check the rules.</p>
<p>In JavaScript, a field whose name starts with <code>#</code> is <strong>private</strong>: code outside the class cannot read or change it at all.
A <strong>getter</strong> (<code>get</code>) lets outsiders <em>read</em> a value like a normal property; a <strong>setter</strong> (<code>set</code>) lets you <em>validate</em> before storing.</p>
<pre><code class="language-javascript">class BankAccount {
  #balance = 0;                        // private: hidden from outside

  deposit(amount) {
    if (amount &lt;= 0) throw new Error("Amount must be positive");
    this.#balance += amount;           // the ONLY way money goes in
  }

  get balance() {                      // read it like a field: acct.balance
    return this.#balance;
  }
}

const acct = new BankAccount();
acct.deposit(100);
console.log(acct.balance);   // 100
acct.balance = 1000000;      // ignored (or TypeError in strict mode) - no setter!
// acct.#balance             // SyntaxError - private means private</code></pre>
<div class="callout analogy"><p>A cash machine is encapsulated. You can't open the safe and grab notes - you use the buttons, and the machine checks your PIN and balance first.</p></div>
<div class="callout tip"><p>Getters are read with <strong>no parentheses</strong>: <code>acct.balance</code>, not <code>acct.balance()</code>.</p></div>`
    },
    {
      title: "Pillar 2 - Abstraction: show what, hide how",
      html: `
<p><strong>Abstraction</strong> means giving users a simple set of methods and hiding the messy details behind them.
You call <code>mailer.send(to, text)</code> and don't need to know how emails travel across the internet.</p>
<pre><code class="language-javascript">class ReportService {
  // Public, simple: this is all other code needs to know about
  monthlyReport(month) {
    const rows = this.#loadSales(month);
    return this.#format(rows);
  }

  // Private helpers: the "how", hidden away
  #loadSales(month) { return [{ item: "Laptop", total: 3000 }]; }
  #format(rows) { return rows.map(r =&gt; r.item + ": " + r.total).join("\\n"); }
}</code></pre>
<div class="callout analogy"><p>Driving a car is abstraction: steering wheel, pedals, gear stick. The engine, fuel injection and gearbox are hidden under the bonnet.</p></div>
<div class="callout note"><p>Encapsulation and abstraction are close cousins. Encapsulation is about <strong>protecting data</strong>; abstraction is about <strong>hiding complexity</strong> behind a simple interface.</p></div>`
    },
    {
      title: "Pillar 3 - Inheritance: extends and super",
      html: `
<p><strong>Inheritance</strong> lets a <strong>child class</strong> reuse everything from a <strong>parent class</strong> and add or change parts. It models an <strong>"is-a"</strong> relationship: a Manager <em>is an</em> Employee.</p>
<pre><code class="language-javascript">class Employee {
  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }
  annualPay() { return this.salary * 12; }
}

class Manager extends Employee {        // Manager IS-A Employee
  constructor(name, salary, bonus) {
    super(name, salary);                // 1. let the parent set name + salary
    this.bonus = bonus;                 // 2. then add the extra field
  }
  annualPay() {                         // override: same name, new behaviour
    return super.annualPay() + this.bonus;  // reuse the parent's version
  }
}

const boss = new Manager("Bo", 5000, 10000);
console.log(boss.annualPay());          // 70000
console.log(boss instanceof Employee);  // true</code></pre>
<table>
  <tr><th>Keyword</th><th>What it does</th></tr>
  <tr><td><code>extends</code></td><td>Makes a child class of a parent</td></tr>
  <tr><td><code>super(...)</code></td><td>Calls the parent's constructor. Must come <strong>before</strong> any use of <code>this</code>.</td></tr>
  <tr><td><code>super.method()</code></td><td>Calls the parent's version of a method you overrode</td></tr>
  <tr><td><code>instanceof</code></td><td>Asks "was this object built from this class, or a child of it?"</td></tr>
</table>
<pre>
        Employee            (name, salary, annualPay)
        /      \\
   Manager    Intern        each inherits everything above
</pre>
<div class="callout warn"><p>In a child constructor, using <code>this</code> before calling <code>super()</code> throws a <code>ReferenceError</code>.</p></div>`
    },
    {
      title: "Pillar 4 - Polymorphism: same call, different behaviour",
      html: `
<p><strong>Polymorphism</strong> ("many forms") means different classes can answer the <strong>same method call</strong> in their own way.
Your code just calls <code>pay()</code> and each object does the right thing - no <code>if</code>/<code>else</code> on the type needed.</p>
<pre><code class="language-javascript">class Payment      { pay(amount) { return "Paying " + amount; } }
class CardPayment  extends Payment { pay(amount) { return "Card charged " + amount; } }
class CashPayment  extends Payment { pay(amount) { return "Cash received " + amount; } }

const payments = [new CardPayment(), new CashPayment()];
for (const p of payments) {
  console.log(p.pay(50));      // each class answers differently
}</code></pre>
<div class="callout analogy"><p>Say "speak!" to a dog, a cat and a parrot. Same command, three different sounds. You don't need to know which animal it is first.</p></div>
<div class="callout key"><p>Adding a new payment type means adding a new class - the loop above doesn't change at all. That's the <strong>Open/Closed</strong> principle in action.</p></div>`
    },
    {
      title: "toString and checking equality",
      html: `
<p>By default, printing an object as text gives <code>"[object Object]"</code>. Add a <code>toString()</code> method to control how it looks.</p>
<p>Also: <code>===</code> on two objects checks if they are the <strong>very same object</strong> (identity), not whether they hold the same values.
JavaScript has no way to change what <code>===</code> means, so write an <code>equals()</code> method.</p>
<pre><code class="language-javascript">class Money {
  constructor(amount, currency) { this.amount = amount; this.currency = currency; }
  toString() { return this.amount + " " + this.currency; }
  equals(other) {
    return other instanceof Money &amp;&amp;
           this.amount === other.amount &amp;&amp; this.currency === other.currency;
  }
}
const a = new Money(10, "USD");
const b = new Money(10, "USD");
console.log("Total: " + a);    // "Total: 10 USD" - toString used automatically
console.log(a === b);          // false - two different objects
console.log(a.equals(b));      // true  - same values</code></pre>
<pre>
  a ---&gt; { amount: 10, currency: "USD" }      two separate boxes
  b ---&gt; { amount: 10, currency: "USD" }      in memory, so a !== b
</pre>`
    },
    {
      title: "Composition vs inheritance",
      html: `
<p><strong>Composition</strong> means building an object out of other objects. It models a <strong>"has-a"</strong> relationship: an Order <em>has</em> line items; a Car <em>has an</em> Engine.</p>
<pre><code class="language-javascript">class Engine { start() { return "vroom"; } }

class Car {
  constructor(engine) { this.engine = engine; }   // Car HAS-A Engine
  start() { return "Car: " + this.engine.start(); } // delegate the work
}

new Car(new Engine()).start();   // "Car: vroom"</code></pre>
<table>
  <tr><th></th><th>Inheritance ("is-a")</th><th>Composition ("has-a")</th></tr>
  <tr><td>Example</td><td><code>Manager extends Employee</code></td><td><code>Order</code> has <code>LineItem</code>s</td></tr>
  <tr><td>Coupling</td><td>Tight: the child depends on parent details</td><td>Loose: parts talk through public methods</td></tr>
  <tr><td>Swap parts later?</td><td>No - fixed when you write the class</td><td>Yes - pass in a different part</td></tr>
  <tr><td>When</td><td>Only for true "is-a" subtypes</td><td><strong>Default choice</strong></td></tr>
</table>
<div class="callout tip"><p>Quick test: say it out loud. "A Manager <em>is an</em> Employee" sounds right - inheritance. "A Car <em>is an</em> Engine" sounds wrong; "a Car <em>has an</em> Engine" sounds right - composition.</p></div>`
    },
    {
      title: "SOLID in one table",
      html: `
<p><strong>SOLID</strong> is five design guidelines for classes that are easy to change. You don't need to recite essays - one clear line each is perfect for interviews.</p>
<table>
  <tr><th>Letter</th><th>Principle</th><th>In one line</th><th>Smell when broken</th></tr>
  <tr><td>S</td><td>Single Responsibility</td><td>A class should have one job (one reason to change).</td><td><code>Invoice</code> that also sends emails and writes PDFs</td></tr>
  <tr><td>O</td><td>Open/Closed</td><td>Open for extension, closed for modification - add new classes rather than edit old ones.</td><td>A growing <code>if (type === ...)</code> chain</td></tr>
  <tr><td>L</td><td>Liskov Substitution</td><td>A child must work anywhere its parent is expected.</td><td><code>Square extends Rectangle</code> breaking <code>setWidth</code></td></tr>
  <tr><td>I</td><td>Interface Segregation</td><td>Many small, focused interfaces beat one giant one.</td><td>A <code>Printer</code> forced to implement <code>fax()</code></td></tr>
  <tr><td>D</td><td>Dependency Inversion</td><td>Depend on abstractions, and pass dependencies in.</td><td><code>new MySqlDatabase()</code> hard-coded inside a class</td></tr>
</table>
<div class="callout key"><p>The common thread: small classes with clear jobs, connected through simple interfaces, so a change in one place doesn't ripple everywhere.</p></div>`
    }
  ],

  examples: [
    {
      title: "Your first class: Product",
      code: `class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
  priceWithTax(rate) {
    return this.price * (1 + rate);
  }
}

const laptop = new Product("Laptop", 1000);
const mouse = new Product("Mouse", 25);

console.log(laptop.name, "costs", laptop.price);
console.log("With 20% tax:", laptop.priceWithTax(0.2));
console.log(mouse.name, "with tax:", mouse.priceWithTax(0.2));`,
      explain: `
<ol>
  <li><code>new Product("Laptop", 1000)</code> creates an object and runs the constructor with <code>this</code> = that new object.</li>
  <li>The constructor copies the arguments into fields: <code>this.name</code>, <code>this.price</code>.</li>
  <li><code>laptop.priceWithTax(0.2)</code> runs the method with <code>this</code> = <code>laptop</code>, so it uses 1000.</li>
</ol>
<table>
  <tr><th>Object</th><th>name</th><th>price</th><th>priceWithTax(0.2)</th></tr>
  <tr><td>laptop</td><td>"Laptop"</td><td>1000</td><td>1200</td></tr>
  <tr><td>mouse</td><td>"Mouse"</td><td>25</td><td>30</td></tr>
</table>
<p><strong>Try it:</strong> add a third product and a method <code>isExpensive()</code> that returns <code>this.price &gt; 500</code>.</p>`
    },
    {
      title: "Many objects, one blueprint",
      code: `class Customer {
  constructor(name, city) {
    this.name = name;
    this.city = city;
    this.orders = 0;
  }
  placeOrder() {
    this.orders++;
    return this.name + " now has " + this.orders + " order(s)";
  }
}

const ana = new Customer("Ana", "Lisbon");
const ben = new Customer("Ben", "Manila");

console.log(ana.placeOrder());
console.log(ana.placeOrder());
console.log(ben.placeOrder());
console.log("Same method shared?", ana.placeOrder === ben.placeOrder);
console.log("Same object?", ana === ben);`,
      explain: `
<ol>
  <li>Each customer has <strong>its own</strong> <code>orders</code> counter - Ana's orders don't affect Ben's.</li>
  <li>But the <code>placeOrder</code> method is <strong>shared</strong>: there is only one copy, stored on the class.</li>
</ol>
<pre>
 after the calls:
   ana: { name: "Ana", city: "Lisbon", orders: 2 }
   ben: { name: "Ben", city: "Manila", orders: 1 }
</pre>
<p><strong>Try it:</strong> create an array of three customers and loop over it calling <code>placeOrder()</code> on each.</p>`
    },
    {
      title: "static: a ticket number dispenser",
      code: `class Ticket {
  static issued = 0;

  constructor(customer) {
    Ticket.issued++;
    this.number = Ticket.issued;
    this.customer = customer;
  }

  static fromEmail(email) {
    // A "factory": another way to build a Ticket
    return new Ticket(email.split("@")[0]);
  }
}

const t1 = new Ticket("Ana");
const t2 = new Ticket("Ben");
const t3 = Ticket.fromEmail("carla@shop.com");

console.log(t1.customer, "#" + t1.number);
console.log(t2.customer, "#" + t2.number);
console.log(t3.customer, "#" + t3.number);
console.log("Tickets issued:", Ticket.issued);`,
      explain: `
<table>
  <tr><th>Step</th><th>Ticket.issued</th><th>new ticket</th></tr>
  <tr><td>new Ticket("Ana")</td><td>1</td><td>Ana #1</td></tr>
  <tr><td>new Ticket("Ben")</td><td>2</td><td>Ben #2</td></tr>
  <tr><td>Ticket.fromEmail(...)</td><td>3</td><td>carla #3</td></tr>
</table>
<p><code>issued</code> lives on the <strong>class</strong>, so every ticket sees the same counter. <code>fromEmail</code> is a <strong>static factory</strong> - called on the class, not on a ticket.</p>
<p><strong>Try it:</strong> what happens if you write <code>this.issued++</code> instead of <code>Ticket.issued++</code>? (Each ticket gets its own broken counter.)</p>`
    },
    {
      title: "Encapsulation: a safe BankAccount",
      code: `class BankAccount {
  #balance = 0;

  constructor(owner) {
    this.owner = owner;
  }
  deposit(amount) {
    if (amount <= 0) throw new Error("Deposit must be positive");
    this.#balance += amount;
  }
  withdraw(amount) {
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
  }
  get balance() {
    return this.#balance;
  }
}

const acct = new BankAccount("Ana");
acct.deposit(100);
acct.withdraw(30);
console.log(acct.owner, "has", acct.balance);

try { acct.withdraw(500); } catch (e) { console.log("Refused:", e.message); }
try { acct.deposit(-5); } catch (e) { console.log("Refused:", e.message); }
try { acct.balance = 1000000; } catch (e) { console.log("Refused: no setter"); }

console.log("Balance is still", acct.balance);
console.log("Visible fields:", Object.keys(acct));`,
      explain: `
<ol>
  <li><code>#balance</code> is private: <code>Object.keys</code> only shows <code>owner</code>.</li>
  <li>Every change goes through <code>deposit</code>/<code>withdraw</code>, which <strong>enforce the rules</strong> by throwing errors.</li>
  <li><code>get balance()</code> allows reading but there is no <code>set</code>, so nobody can just overwrite it.</li>
</ol>
<table>
  <tr><th>Call</th><th>#balance after</th></tr>
  <tr><td>deposit(100)</td><td>100</td></tr>
  <tr><td>withdraw(30)</td><td>70</td></tr>
  <tr><td>withdraw(500)</td><td>70 (refused)</td></tr>
  <tr><td>deposit(-5)</td><td>70 (refused)</td></tr>
</table>
<p><strong>Try it:</strong> add a <code>transferTo(otherAccount, amount)</code> method that reuses <code>withdraw</code> and <code>deposit</code>.</p>`
    },
    {
      title: "Getters and setters with validation",
      code: `class Employee {
  #email = "";

  constructor(name, email) {
    this.name = name;
    this.email = email;          // goes through the setter below
  }
  get email() {
    return this.#email;
  }
  set email(value) {
    if (!value.includes("@")) throw new Error("Invalid email: " + value);
    this.#email = value.trim().toLowerCase();
  }
  get initials() {               // computed - not stored anywhere
    return this.name.split(" ").map(w => w[0]).join("");
  }
}

const e = new Employee("Maria Lopez", "  Maria@Corp.COM ");
console.log(e.email, "|", e.initials);

try { e.email = "not-an-email"; } catch (err) { console.log(err.message); }
console.log("Email unchanged:", e.email);`,
      explain: `
<ol>
  <li>Even the constructor uses <code>this.email = email</code>, so the <strong>setter</strong> cleans and validates it in one place.</li>
  <li><code>initials</code> is a getter with no stored field - it is <strong>computed</strong> every time you read it.</li>
  <li>A bad value throws before <code>#email</code> changes, so the object never holds invalid data.</li>
</ol>
<p><strong>Try it:</strong> add a <code>get domain()</code> that returns the part after the <code>@</code>.</p>`
    },
    {
      title: "Inheritance: Employee and Manager",
      code: `class Employee {
  constructor(name, monthly) {
    this.name = name;
    this.monthly = monthly;
  }
  annualPay() {
    return this.monthly * 12;
  }
  describe() {
    return this.name + " earns " + this.annualPay() + " a year";
  }
}

class Manager extends Employee {
  constructor(name, monthly, bonus) {
    super(name, monthly);
    this.bonus = bonus;
  }
  annualPay() {
    return super.annualPay() + this.bonus;
  }
}

const dev = new Employee("Ana", 4000);
const boss = new Manager("Bo", 5000, 10000);

console.log(dev.describe());
console.log(boss.describe());
console.log("boss is a Manager?", boss instanceof Manager);
console.log("boss is an Employee?", boss instanceof Employee);
console.log("dev is a Manager?", dev instanceof Manager);`,
      explain: `
<ol>
  <li><code>Manager</code> never defines <code>describe()</code> - it <strong>inherits</strong> it from <code>Employee</code>.</li>
  <li>Inside <code>describe()</code>, <code>this.annualPay()</code> runs the <strong>Manager's</strong> override when <code>this</code> is a manager.</li>
  <li><code>super.annualPay()</code> reuses the parent's formula (5000 x 12 = 60000), then adds the bonus.</li>
</ol>
<pre>
 boss.describe()
   -&gt; Employee.describe      (inherited)
      -&gt; this.annualPay()    this = boss, so Manager.annualPay
         -&gt; super.annualPay() = 60000
         + bonus             = 70000
</pre>
<p><strong>Try it:</strong> add an <code>Intern</code> class whose <code>annualPay()</code> is only 6 months of pay.</p>`
    },
    {
      title: "Polymorphism: one loop, many payment types",
      code: `class Payment {
  constructor(amount) { this.amount = amount; }
  fee() { return 0; }
  total() { return this.amount + this.fee(); }
}
class CardPayment extends Payment {
  fee() { return this.amount * 0.03; }     // 3% card fee
}
class BankTransfer extends Payment {
  fee() { return 1.5; }                    // flat fee
}
class CashPayment extends Payment {}      // uses the default: no fee

const payments = [new CardPayment(100), new BankTransfer(100), new CashPayment(100)];

let grandTotal = 0;
for (const p of payments) {
  console.log(p.constructor.name.padEnd(13), "fee:", p.fee(), " total:", p.total());
  grandTotal += p.total();
}
console.log("Grand total:", grandTotal);`,
      explain: `
<p>The loop calls <code>p.total()</code> without ever asking "which kind of payment is this?". Each class supplies its own <code>fee()</code>.</p>
<table>
  <tr><th>Class</th><th>fee()</th><th>total()</th></tr>
  <tr><td>CardPayment</td><td>3</td><td>103</td></tr>
  <tr><td>BankTransfer</td><td>1.5</td><td>101.5</td></tr>
  <tr><td>CashPayment</td><td>0 (inherited)</td><td>100</td></tr>
</table>
<p><strong>Try it:</strong> add a <code>CryptoPayment</code> with a 5% fee. Notice you don't touch the loop at all.</p>`
    },
    {
      title: "toString and equals: a Money class",
      code: `class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }
  add(other) {
    if (other.currency !== this.currency) throw new Error("Currency mismatch");
    return new Money(this.amount + other.amount, this.currency);
  }
  equals(other) {
    return other instanceof Money &&
      this.amount === other.amount && this.currency === other.currency;
  }
  toString() {
    return this.amount.toFixed(2) + " " + this.currency;
  }
}

const price = new Money(10, "USD");
const sameAgain = new Money(10, "USD");
const shipping = new Money(4.5, "USD");

console.log("Total: " + price.add(shipping));
console.log("price === sameAgain:", price === sameAgain);
console.log("price.equals(sameAgain):", price.equals(sameAgain));
console.log("Plain object:", String({ amount: 10 }));`,
      explain: `
<ol>
  <li><code>"Total: " + money</code> calls <code>toString()</code> automatically - compare with the plain object that prints <code>[object Object]</code>.</li>
  <li><code>===</code> is <code>false</code> because they are two separate objects; <code>equals()</code> compares the <strong>values</strong>.</li>
  <li><code>add()</code> returns a <strong>new</strong> Money instead of changing the old one - a safe habit for money and dates.</li>
</ol>
<p><strong>Try it:</strong> add <code>new Money(5, "EUR")</code> to <code>price</code> and catch the error.</p>`
    },
    {
      title: "Composition: an Order has LineItems",
      code: `class LineItem {
  constructor(product, unitPrice, qty) {
    this.product = product;
    this.unitPrice = unitPrice;
    this.qty = qty;
  }
  subtotal() {
    return this.unitPrice * this.qty;
  }
}

class Order {
  constructor(customer) {
    this.customer = customer;
    this.items = [];             // Order HAS many LineItems
  }
  add(product, unitPrice, qty) {
    this.items.push(new LineItem(product, unitPrice, qty));
    return this;                 // allows chaining .add().add()
  }
  total() {
    return this.items.reduce((sum, item) => sum + item.subtotal(), 0);
  }
}

const order = new Order("Ana")
  .add("Keyboard", 45, 2)
  .add("Monitor", 180, 1);

for (const item of order.items) {
  console.log(item.product, "x" + item.qty, "=", item.subtotal());
}
console.log(order.customer + "'s total:", order.total());`,
      explain: `
<pre>
 Order (customer: "Ana")
   items:
     [0] LineItem  Keyboard  45 x 2 = 90
     [1] LineItem  Monitor  180 x 1 = 180
                              total = 270
</pre>
<p>An Order is <strong>not</strong> a kind of LineItem, it <strong>has</strong> them - so composition is the right fit.
<code>Order.total()</code> <strong>delegates</strong>: it asks each item for its own subtotal.</p>
<p><strong>Try it:</strong> add a <code>removeProduct(name)</code> method using <code>filter</code>.</p>`
    },
    {
      title: "Where did this go? (a classic bug)",
      code: `class Counter {
  constructor() { this.clicks = 0; }
  click() {
    this.clicks++;
    return this.clicks;
  }
}

const c = new Counter();
console.log("Normal call:", c.click());

const loose = c.click;             // method taken away from its object
try {
  loose();                         // this is now undefined
} catch (e) {
  console.log("Detached call failed:", e.name);
}

const bound = c.click.bind(c);     // fix 1: bind this permanently
console.log("Bound call:", bound());

const arrow = () => c.click();     // fix 2: wrap in an arrow function
console.log("Arrow call:", arrow());`,
      explain: `
<ol>
  <li><code>this</code> is decided by <strong>how a method is called</strong>: <code>c.click()</code> sets <code>this</code> to <code>c</code>.</li>
  <li><code>loose()</code> is called with nothing before the dot, so inside the class <code>this</code> is <code>undefined</code> and <code>this.clicks</code> crashes.</li>
  <li><code>bind(c)</code> or an arrow function wrapper keeps the connection. You'll meet this when passing methods to event handlers or <code>setTimeout</code>.</li>
</ol>`
    }
  ],

  pitfalls: [
    "Forgetting <code>this.</code> inside methods: <code>return price * 2</code> gives a <code>ReferenceError</code>. Write <code>this.price</code>.",
    "Forgetting <code>new</code>: <code>Product(\"Pen\", 2)</code> throws <code>TypeError: Class constructor Product cannot be invoked without 'new'</code>.",
    "Using <code>this</code> in a child constructor <strong>before</strong> <code>super()</code> throws a <code>ReferenceError</code>. Call <code>super(...)</code> first.",
    "Updating a static counter with <code>this.count++</code> creates a separate field on each object. Use <code>ClassName.count++</code>.",
    "Comparing objects with <code>===</code> checks identity, not contents. Two equal-looking objects are not <code>===</code>. Write an <code>equals()</code> method.",
    "Detaching a method (<code>const f = obj.method; f();</code>) loses <code>this</code>. Use <code>obj.method.bind(obj)</code> or an arrow function.",
    "Using inheritance just to reuse code. If \"X is a Y\" sounds wrong, use composition instead."
  ],

  quiz: [
    {
      q: "What does this print?",
      code: `class Visitor {
  static count = 0;
  constructor(name) {
    this.name = name;
    Visitor.count++;
  }
}
new Visitor("Ana");
new Visitor("Ben");
new Visitor("Cy");
console.log(Visitor.count);`,
      options: ["0", "1", "3", "undefined"],
      answer: 2,
      output: "3",
      explain: "<p><code>count</code> is <strong>static</strong>, so there is a single counter shared by the whole class. Each <code>new Visitor</code> adds one: 3.</p>"
    },
    {
      q: "A <code>BankAccount</code> keeps <code>#balance</code> private and only changes it through <code>deposit()</code> and <code>withdraw()</code>, which check the rules. Which pillar is this?",
      options: ["Inheritance", "Encapsulation", "Polymorphism", "Composition"],
      answer: 1,
      explain: "<p><strong>Encapsulation</strong>: data is hidden inside the object and can only change through its methods. Composition isn't one of the four pillars - it's a design technique.</p>"
    },
    {
      q: "What does this print?",
      code: `class Animal {
  speak() { return "..."; }
  intro() { return "I say " + this.speak(); }
}
class Dog extends Animal {
  speak() { return "Woof"; }
}
console.log(new Dog().intro());`,
      options: ["I say ...", "I say Woof", "Woof", "An error - Dog has no intro()"],
      answer: 1,
      output: "I say Woof",
      explain: "<p><code>Dog</code> inherits <code>intro()</code>. Inside it, <code>this</code> is the dog, so <code>this.speak()</code> runs the <strong>overridden</strong> <code>Dog.speak</code>. That's polymorphism.</p>"
    },
    {
      q: "Which <code>Manager</code> constructor is correct?",
      options: [
        "<code>constructor(n, s, b) { this.bonus = b; super(n, s); }</code>",
        "<code>constructor(n, s, b) { super(n, s); this.bonus = b; }</code>",
        "<code>constructor(n, s, b) { Employee(n, s); this.bonus = b; }</code>",
        "<code>constructor(n, s, b) { this.bonus = b; }</code>"
      ],
      answer: 1,
      explain: "<p>A child constructor must call <code>super(...)</code> <strong>before</strong> touching <code>this</code>. Option A uses <code>this</code> too early, C can't call a class without <code>new</code>, and D never calls the parent at all - all three crash.</p>"
    },
    {
      q: "What does this print?",
      code: `class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  equals(o) { return this.x === o.x && this.y === o.y; }
}
const a = new Point(1, 2);
const b = new Point(1, 2);
console.log(a === b, a.equals(b));`,
      options: ["true true", "false true", "false false", "true false"],
      answer: 1,
      output: "false true",
      explain: "<p><code>a</code> and <code>b</code> are two <strong>different objects</strong> in memory, so <code>===</code> is false. <code>equals()</code> compares the values inside, which match.</p>"
    },
    {
      q: "You are modelling a <code>Car</code> and its <code>Engine</code>. What is the best relationship?",
      options: [
        "<code>class Car extends Engine</code> - inheritance",
        "<code>class Engine extends Car</code> - inheritance",
        "A <code>Car</code> holds an <code>engine</code> field - composition",
        "Copy the engine methods into Car"
      ],
      answer: 2,
      explain: "<p>A car <strong>has an</strong> engine; it is not a kind of engine. \"Has-a\" means <strong>composition</strong>. Bonus: you can swap in an <code>ElectricMotor</code> later without changing <code>Car</code>.</p>"
    },
    {
      q: "What does this print?",
      code: `class Order {
  constructor() { this.items = []; }
  add(x) { this.items.push(x); return this; }
  get size() { return this.items.length; }
}
const o = new Order().add("pen").add("ink");
console.log(o.size);`,
      options: ["0", "2", "undefined", "An error - size needs ()"],
      answer: 1,
      output: "2",
      explain: "<p><code>add</code> returns <code>this</code>, so calls can be <strong>chained</strong>. <code>size</code> is a <strong>getter</strong>, read without parentheses, and returns 2.</p>"
    }
  ],

  interview: [
    { q: "What is the difference between a class and an object?",
      a: "<p>A <strong>class</strong> is a blueprint that defines fields and methods. An <strong>object</strong> is a concrete instance created from it with <code>new</code>, holding its own field values. One class, many objects.</p>" },
    { q: "Explain the four pillars of OOP in one line each.",
      a: "<ul><li><strong>Encapsulation:</strong> keep data and the methods that use it together, and hide the internal state.</li><li><strong>Abstraction:</strong> expose what an object does, hide how it does it.</li><li><strong>Inheritance:</strong> a child class reuses and extends a parent class (\"is-a\").</li><li><strong>Polymorphism:</strong> the same method call behaves differently depending on the object's class.</li></ul>" },
    { q: "Composition vs inheritance - which do you prefer and why?",
      a: "<p>Inheritance models <strong>is-a</strong> (<code>Manager extends Employee</code>); composition models <strong>has-a</strong> (a <code>Car</code> holds an <code>Engine</code>). I prefer composition by default: looser coupling, parts can be swapped or tested in isolation, and no fragile deep hierarchies. I use inheritance only for true subtypes that respect Liskov substitution.</p>" },
    { q: "What does SOLID stand for?",
      a: "<p><strong>S</strong>ingle responsibility - one reason to change. <strong>O</strong>pen/closed - extend without modifying. <strong>L</strong>iskov substitution - a subclass works wherever its parent does. <strong>I</strong>nterface segregation - small focused interfaces. <strong>D</strong>ependency inversion - depend on abstractions and inject dependencies.</p>" },
    { q: "What is the difference between overriding and overloading?",
      a: "<p><strong>Overriding:</strong> a subclass redefines a parent method with the same name, chosen at runtime (polymorphism). <strong>Overloading:</strong> several methods with the same name but different parameter lists. JavaScript doesn't support overloading directly - you check the arguments inside one method or use default parameters.</p>" },
    { q: "What is a static method and when would you use one?",
      a: "<p>A static method belongs to the class, not to any object: you call <code>ClassName.method()</code> and it has no access to instance fields. Use it for factories (<code>Array.from</code>, <code>Ticket.fromEmail</code>) and utilities that don't need object state (<code>Math.max</code>).</p>" }
  ],

  exercises: [
    {
      id: "dog-speak",
      title: "Warm-up: a Dog class",
      difficulty: "easy",
      prompt: "<p>Your very first class. Complete <code>Dog</code> so that:</p><ul><li>the constructor stores <code>name</code> and <code>breed</code> as fields</li><li><code>speak()</code> returns <code>\"&lt;name&gt; says Woof!\"</code></li><li><code>describe()</code> returns <code>\"&lt;name&gt; is a &lt;breed&gt;\"</code></li></ul><pre>const rex = new Dog(\"Rex\", \"Beagle\");\nrex.speak();     // \"Rex says Woof!\"\nrex.describe();  // \"Rex is a Beagle\"</pre>",
      starter: `class Dog {
  constructor(name, breed) {
    // your code here
  }

  speak() {
    // your code here
  }

  describe() {
    // your code here
  }
}`,
      solution: `class Dog {
  constructor(name, breed) {
    // Save the arguments on the object so methods can use them later
    this.name = name;
    this.breed = breed;
  }

  speak() {
    return this.name + " says Woof!";
  }

  describe() {
    return this.name + " is a " + this.breed;
  }
}`,
      hint: "In the constructor write <code>this.name = name;</code>. In the methods, read it back with <code>this.name</code>.",
      tests: [
        { label: "fields are stored", code: "const d = new Dog('Rex', 'Beagle'); return [d.name, d.breed];", expected: ["Rex", "Beagle"] },
        { label: "speak", expr: "new Dog('Rex', 'Beagle').speak()", expected: "Rex says Woof!" },
        { label: "describe", expr: "new Dog('Luna', 'Poodle').describe()", expected: "Luna is a Poodle" },
        { label: "two dogs are independent", code: "const a = new Dog('A', 'x'), b = new Dog('B', 'y'); return [a.speak(), b.speak()];", expected: ["A says Woof!", "B says Woof!"] }
      ]
    },
    {
      id: "rectangle",
      title: "Rectangle class",
      difficulty: "easy",
      prompt: "<p>Complete the <code>Rectangle</code> class: store <code>width</code> and <code>height</code> as fields, and implement three methods.</p><pre>const r = new Rectangle(3, 4);\nr.area();       // 12   (width x height)\nr.perimeter();  // 14   (all four sides added up)\nr.isSquare();   // false\nnew Rectangle(5, 5).isSquare();  // true</pre>",
      starter: `class Rectangle {
  constructor(width, height) {
    // your code here
  }

  area() {
    // your code here
  }

  perimeter() {
    // your code here
  }

  isSquare() {
    // your code here
  }
}`,
      solution: `class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }

  perimeter() {
    // two widths + two heights
    return 2 * (this.width + this.height);
  }

  isSquare() {
    // a comparison already gives true/false - return it directly
    return this.width === this.height;
  }
}`,
      hint: "Save the arguments with <code>this.width = width</code>, then use <code>this.width</code> and <code>this.height</code> in each method. Perimeter is <code>2 * (width + height)</code>.",
      tests: [
        { label: "fields are stored", code: "const r = new Rectangle(3, 4); return [r.width, r.height];", expected: [3, 4] },
        { label: "area of 3x4", expr: "new Rectangle(3, 4).area()", expected: 12 },
        { label: "perimeter of 3x4", expr: "new Rectangle(3, 4).perimeter()", expected: 14 },
        { label: "3x4 is not a square", expr: "new Rectangle(3, 4).isSquare()", expected: false },
        { label: "5x5 is a square", expr: "new Rectangle(5, 5).isSquare()", expected: true },
        { label: "objects are independent", code: "const a = new Rectangle(1, 2); const b = new Rectangle(10, 20); return [a.area(), b.area()];", expected: [2, 200] }
      ]
    },
    {
      id: "counter-static",
      title: "Counter with a static field",
      difficulty: "easy",
      prompt: "<p>Every time a <code>Counter</code> is created, increase the <strong>static</strong> field <code>Counter.count</code> and give the new object an <code>id</code> equal to its creation number.</p><p>Also implement <code>static howMany()</code> returning the count.</p><pre>const a = new Counter();   // a.id === 1\nconst b = new Counter();   // b.id === 2\nCounter.howMany();         // 2</pre>",
      starter: `class Counter {
  static count = 0;

  constructor() {
    // your code here
  }

  static howMany() {
    // your code here
  }
}`,
      solution: `class Counter {
  static count = 0;   // one shared counter for the whole class

  constructor() {
    // Use the class name: this.count++ would create a field on the object instead
    Counter.count++;
    this.id = Counter.count;   // this object's own number
  }

  static howMany() {
    return Counter.count;
  }
}`,
      hint: "Inside the constructor write <code>Counter.count++</code> (not <code>this.count++</code>), then copy the new value into <code>this.id</code>.",
      explanation: "<p><code>count</code> lives on the class and is shared; <code>id</code> lives on each object. This is exactly how ticket numbers, invoice numbers and order IDs are often generated.</p>",
      tests: [
        { label: "starts at 0", expr: "Counter.howMany()", expected: 0 },
        { label: "three objects -> 3", code: "new Counter(); new Counter(); new Counter(); return Counter.howMany();", expected: 3 },
        { label: "ids are 1, 2, 3", code: "const a = new Counter(), b = new Counter(), c = new Counter(); return [a.id, b.id, c.id];", expected: [1, 2, 3] },
        { label: "count lives on the class, not the object", code: "const a = new Counter(); return Object.prototype.hasOwnProperty.call(a, 'count');", expected: false },
        { label: "Counter.count is updated", code: "new Counter(); new Counter(); return Counter.count;", expected: 2 }
      ]
    },
    {
      id: "bank-account",
      title: "BankAccount (encapsulation)",
      difficulty: "medium",
      prompt: "<p>Build a <code>BankAccount</code> whose balance is stored in a <strong>private</strong> field <code>#balance</code>.</p><ul><li><code>constructor(owner, balance = 0)</code> - throw an <code>Error</code> if the starting balance is negative.</li><li><code>get balance()</code> - read-only (no setter).</li><li><code>deposit(amount)</code> - add and return the new balance; throw if <code>amount &lt;= 0</code>.</li><li><code>withdraw(amount)</code> - subtract and return the new balance; throw if <code>amount &lt;= 0</code> or if there isn't enough money.</li></ul><pre>const a = new BankAccount(\"Ann\", 100);\na.deposit(50);    // 150\na.withdraw(30);   // 120\na.balance;        // 120\na.withdraw(500);  // throws Error(\"insufficient funds\")</pre>",
      starter: `class BankAccount {
  #balance;

  constructor(owner, balance = 0) {
    // your code here
  }

  get balance() {
    // your code here
  }

  deposit(amount) {
    // your code here
  }

  withdraw(amount) {
    // your code here
  }
}`,
      solution: `class BankAccount {
  #balance;   // private: only code inside this class can touch it

  constructor(owner, balance = 0) {
    // Check the rule BEFORE storing anything
    if (balance < 0) throw new RangeError("starting balance cannot be negative");
    this.owner = owner;
    this.#balance = balance;
  }

  // Getter only -> outside code can read the balance but never assign it
  get balance() {
    return this.#balance;
  }

  deposit(amount) {
    if (amount <= 0) throw new RangeError("deposit must be positive");
    this.#balance += amount;
    return this.#balance;
  }

  withdraw(amount) {
    if (amount <= 0) throw new RangeError("withdrawal must be positive");
    if (amount > this.#balance) throw new Error("insufficient funds");
    this.#balance -= amount;
    return this.#balance;
  }
}`,
      hint: "Pattern for every method: <strong>check first, then change</strong>. E.g. <code>if (amount &lt;= 0) throw new Error(\"...\");</code> then <code>this.#balance += amount;</code>. Don't add a <code>set balance</code>.",
      explanation: "<p>Because <code>#balance</code> is private and there is no setter, the <em>only</em> way to change the money is through <code>deposit</code>/<code>withdraw</code>, which enforce the rules. That is encapsulation - the object protects itself from invalid states. Validating <em>before</em> changing state also means a failed call leaves the balance untouched.</p>",
      tests: [
        { label: "owner and starting balance", code: "const a = new BankAccount('Ann', 100); return [a.owner, a.balance];", expected: ["Ann", 100] },
        { label: "default balance is 0", expr: "new BankAccount('Ann').balance", expected: 0 },
        { label: "deposit increases balance", code: "const a = new BankAccount('Ann', 100); a.deposit(50); return a.balance;", expected: 150 },
        { label: "deposit returns new balance", expr: "new BankAccount('Ann', 100).deposit(25)", expected: 125 },
        { label: "withdraw decreases balance", code: "const a = new BankAccount('Ann', 100); return a.withdraw(30);", expected: 70 },
        { label: "withdraw everything is allowed", code: "const a = new BankAccount('Ann', 100); a.withdraw(100); return a.balance;", expected: 0 },
        { label: "negative starting balance throws", code: "new BankAccount('Ann', -1);", throws: true },
        { label: "deposit of 0 throws", code: "new BankAccount('Ann', 10).deposit(0);", throws: true },
        { label: "negative deposit throws", code: "new BankAccount('Ann', 10).deposit(-5);", throws: true },
        { label: "negative withdrawal throws", code: "new BankAccount('Ann', 10).withdraw(-5);", throws: true },
        { label: "insufficient funds throws", code: "new BankAccount('Ann', 10).withdraw(11);", throws: true },
        { label: "failed withdrawal leaves balance unchanged", code: "const a = new BankAccount('Ann', 10); try { a.withdraw(50); } catch (e) {} return a.balance;", expected: 10 },
        { label: "balance is read-only", code: "const a = new BankAccount('Ann', 100); try { a.balance = 999999; } catch (e) {} return a.balance;", expected: 100 },
        { label: "balance is not a public field", code: "const a = new BankAccount('Ann', 100); return Object.keys(a).some(function (k) { return /balance/i.test(k); });", expected: false }
      ]
    },
    {
      id: "temperature",
      title: "Temperature with get / set",
      difficulty: "medium",
      prompt: "<p>Store the temperature privately in Celsius, but let people read <strong>and write</strong> it in either unit:</p><ul><li><code>get celsius()</code> / <code>set celsius(c)</code></li><li><code>get fahrenheit()</code> / <code>set fahrenheit(f)</code> - formula: <code>F = C * 9 / 5 + 32</code></li><li>Anything below absolute zero (-273.15 C) must throw a <code>RangeError</code> - including in the constructor.</li><li><code>toString()</code> returns e.g. <code>\"25C\"</code>.</li></ul><pre>const t = new Temperature(100);\nt.fahrenheit;        // 212\nt.fahrenheit = 32;   // set in F...\nt.celsius;           // 0   ...read in C\nString(t);           // \"0C\"\nt.celsius = -300;    // throws RangeError</pre>",
      starter: `class Temperature {
  #celsius;

  constructor(celsius) {
    // your code here
  }

  get celsius() {
    // your code here
  }

  set celsius(c) {
    // your code here
  }

  get fahrenheit() {
    // your code here
  }

  set fahrenheit(f) {
    // your code here
  }

  toString() {
    // your code here
  }
}`,
      solution: `class Temperature {
  #celsius;   // the single source of truth, always in Celsius

  constructor(celsius) {
    this.celsius = celsius;   // goes through the setter, so it is validated too
  }

  get celsius() {
    return this.#celsius;
  }

  set celsius(c) {
    // All validation lives here, in ONE place
    if (c < -273.15) throw new RangeError("below absolute zero");
    this.#celsius = c;
  }

  get fahrenheit() {
    return this.#celsius * 9 / 5 + 32;
  }

  set fahrenheit(f) {
    // Convert to Celsius, then reuse the Celsius setter (and its validation)
    this.celsius = (f - 32) * 5 / 9;
  }

  toString() {
    return this.#celsius + "C";
  }
}`,
      hint: "Put the absolute-zero check in <code>set celsius</code> only. Then make the constructor do <code>this.celsius = celsius</code>, and <code>set fahrenheit</code> do <code>this.celsius = (f - 32) * 5 / 9</code> - both get validated for free.",
      explanation: "<p>Storing one unit and <strong>computing</strong> the other means the two values can never disagree. Routing every write through one setter is the \"single place for the rule\" idea - if the rule changes, you edit one line.</p>",
      tests: [
        { label: "read celsius", expr: "new Temperature(25).celsius", expected: 25 },
        { label: "100C is 212F", expr: "new Temperature(100).fahrenheit", expected: 212 },
        { label: "set fahrenheit updates celsius", code: "const t = new Temperature(0); t.fahrenheit = 212; return t.celsius;", expected: 100 },
        { label: "set celsius updates fahrenheit", code: "const t = new Temperature(0); t.celsius = -40; return t.fahrenheit;", expected: -40 },
        { label: "toString", code: "return String(new Temperature(25));", expected: "25C" },
        { label: "constructor rejects below absolute zero", code: "new Temperature(-300);", throws: true },
        { label: "setter rejects below absolute zero", code: "const t = new Temperature(0); t.celsius = -274;", throws: true },
        { label: "fahrenheit setter validates too", code: "const t = new Temperature(0); t.fahrenheit = -500;", throws: true },
        { label: "absolute zero itself is fine", expr: "new Temperature(-273.15).celsius", expected: -273.15 }
      ]
    },
    {
      id: "shapes-polymorphism",
      title: "Shapes: inheritance + polymorphism",
      difficulty: "medium",
      prompt: "<p><code>Shape</code> is the parent class. <code>Circle</code> and <code>Square</code> <strong>extend</strong> it and override <code>area()</code>.</p><ul><li><code>describe()</code> (written once, in <code>Shape</code>) returns <code>\"&lt;ClassName&gt; with area &lt;area to 2 decimals&gt;\"</code>.</li><li><code>totalArea(shapes)</code> adds up the areas of any mix of shapes - <strong>without</strong> checking their types.</li></ul><pre>new Square(2).describe();   // \"Square with area 4.00\"\nnew Circle(1).describe();   // \"Circle with area 3.14\"\ntotalArea([new Square(2), new Square(3)]);  // 13\nnew Circle(1) instanceof Shape;             // true</pre>",
      starter: `class Shape {
  area() {
    throw new Error("subclasses must implement area()");
  }

  describe() {
    // your code here  (hint: this.constructor.name)
  }
}

class Circle extends Shape {
  constructor(radius) {
    // your code here
  }

  area() {
    // your code here
  }
}

class Square extends Shape {
  constructor(side) {
    // your code here
  }

  area() {
    // your code here
  }
}

function totalArea(shapes) {
  // your code here
}`,
      solution: `class Shape {
  area() {
    // The parent doesn't know HOW to compute an area - children must override this
    throw new Error("subclasses must implement area()");
  }

  describe() {
    // this.area() runs the CHILD's version - that's polymorphism
    return this.constructor.name + " with area " + this.area().toFixed(2);
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();               // always call super() first in a child constructor
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius ** 2;
  }
}

class Square extends Shape {
  constructor(side) {
    super();
    this.side = side;
  }

  area() {
    return this.side ** 2;
  }
}

function totalArea(shapes) {
  // No type checks: every shape knows its own area
  return shapes.reduce((sum, shape) => sum + shape.area(), 0);
}`,
      hint: "Each child constructor needs <code>super();</code> before <code>this.radius = radius;</code>. For <code>describe</code>, <code>this.constructor.name</code> gives the class name and <code>.toFixed(2)</code> formats the number.",
      explanation: "<p><code>describe()</code> is written <strong>once</strong> in the parent but works for every shape, because <code>this.area()</code> picks the right version at runtime. <code>totalArea</code> never needs <code>if (shape instanceof Circle)</code> - add a <code>Triangle</code> class tomorrow and it just works (Open/Closed principle).</p>",
      forbid: [{ pattern: "instanceof", message: "Let polymorphism do the work - no instanceof checks needed." }],
      tests: [
        { label: "Square area", expr: "new Square(3).area()", expected: 9 },
        { label: "Circle area", expr: "new Circle(1).area()", expected: Math.PI },
        { label: "Circle is a Shape", code: "return new Circle(2) instanceof Shape;", expected: true },
        { label: "Square is a Shape", code: "return new Square(2) instanceof Shape;", expected: true },
        { label: "describe a Square", expr: "new Square(2).describe()", expected: "Square with area 4.00" },
        { label: "describe a Circle", expr: "new Circle(1).describe()", expected: "Circle with area 3.14" },
        { label: "totalArea of squares", expr: "totalArea([new Square(2), new Square(3)])", expected: 13 },
        { label: "totalArea of a mix", expr: "totalArea([new Circle(1), new Square(1)])", expected: Math.PI + 1 },
        { label: "totalArea of nothing", expr: "totalArea([])", expected: 0 },
        { label: "base Shape.area still throws", code: "new Shape().area();", throws: true }
      ]
    },
    {
      id: "point-equals",
      title: "Point: equals, toString, distanceTo",
      difficulty: "medium",
      prompt: "<p>Build a <code>Point</code> class with:</p><ul><li><code>equals(other)</code> - <code>true</code> when <code>other</code> is a <code>Point</code> with the same <code>x</code> and <code>y</code>; <code>false</code> for anything else (including <code>null</code> or a plain object).</li><li><code>distanceTo(other)</code> - straight-line (Euclidean) distance.</li><li><code>toString()</code> - <code>\"Point(1, 2)\"</code>.</li><li><code>static origin()</code> - returns a new <code>Point(0, 0)</code>.</li></ul><pre>new Point(1, 2).equals(new Point(1, 2));      // true\nnew Point(0, 0).distanceTo(new Point(3, 4));  // 5\nString(new Point(1, 2));                      // \"Point(1, 2)\"\nPoint.origin();                               // Point(0, 0)</pre>",
      starter: `class Point {
  constructor(x, y) {
    // your code here
  }

  equals(other) {
    // your code here
  }

  distanceTo(other) {
    // your code here
  }

  toString() {
    // your code here
  }

  static origin() {
    // your code here
  }
}`,
      solution: `class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equals(other) {
    // === on objects only checks identity, so compare the fields ourselves.
    // instanceof also rejects null and plain objects safely.
    return other instanceof Point && this.x === other.x && this.y === other.y;
  }

  distanceTo(other) {
    // Pythagoras: sqrt(dx^2 + dy^2). Math.hypot does exactly that.
    return Math.hypot(this.x - other.x, this.y - other.y);
  }

  toString() {
    return "Point(" + this.x + ", " + this.y + ")";
  }

  static origin() {
    // A static "factory" - called on the class: Point.origin()
    return new Point(0, 0);
  }
}`,
      hint: "Start <code>equals</code> with <code>other instanceof Point &amp;&amp; ...</code> so <code>null</code> is rejected before you read <code>other.x</code>. For distance: <code>Math.hypot(dx, dy)</code>.",
      explanation: "<p>Value objects such as <code>Point</code>, <code>Money</code> or <code>DateRange</code> almost always need an <code>equals</code> method because <code>===</code> compares identity. The <code>instanceof</code> guard also short-circuits, so <code>other.x</code> is never read when <code>other</code> is <code>null</code>.</p>",
      tests: [
        { label: "equal points", expr: "new Point(1, 2).equals(new Point(1, 2))", expected: true },
        { label: "different points", expr: "new Point(1, 2).equals(new Point(2, 1))", expected: false },
        { label: "two separate objects are not ===", expr: "new Point(1, 2) === new Point(1, 2)", expected: false },
        { label: "equals(null) is false", expr: "new Point(0, 0).equals(null)", expected: false },
        { label: "equals a plain object is false", expr: "new Point(1, 2).equals({ x: 1, y: 2 })", expected: false },
        { label: "3-4-5 triangle", expr: "new Point(0, 0).distanceTo(new Point(3, 4))", expected: 5 },
        { label: "distance to itself", code: "const p = new Point(7, -2); return p.distanceTo(p);", expected: 0 },
        { label: "toString", code: "return String(new Point(1, 2));", expected: "Point(1, 2)" },
        { label: "static origin", code: "const o = Point.origin(); return [o instanceof Point, o.x, o.y];", expected: [true, 0, 0] }
      ]
    },
    {
      id: "employee-manager",
      title: "Employee / Manager with super",
      difficulty: "medium",
      prompt: "<p><code>Employee(name, monthlySalary)</code> has <code>getAnnualSalary()</code> (12 x monthly) and <code>toString()</code> like <code>\"Ana (Employee)\"</code>.</p><p><code>Manager</code> <strong>extends</strong> <code>Employee</code>, takes an extra <code>bonus</code>, and earns the employee's annual salary <strong>plus</strong> the bonus. Its <code>toString()</code> should give <code>\"Bo (Manager)\"</code>. Reuse the parent code with <code>super</code> - don't copy the formula.</p><pre>new Employee(\"Ana\", 1000).getAnnualSalary();     // 12000\nnew Manager(\"Bo\", 2000, 5000).getAnnualSalary(); // 29000\nString(new Manager(\"Bo\", 2000, 500));            // \"Bo (Manager)\"</pre>",
      starter: `class Employee {
  constructor(name, monthlySalary) {
    // your code here
  }

  getAnnualSalary() {
    // your code here
  }

  toString() {
    // your code here
  }
}

class Manager extends Employee {
  constructor(name, monthlySalary, bonus) {
    // your code here
  }

  getAnnualSalary() {
    // your code here
  }
}`,
      solution: `class Employee {
  constructor(name, monthlySalary) {
    this.name = name;
    this.monthlySalary = monthlySalary;
  }

  getAnnualSalary() {
    return this.monthlySalary * 12;
  }

  toString() {
    // this.constructor.name is "Employee" or "Manager" - works for children too
    return this.name + " (" + this.constructor.name + ")";
  }
}

class Manager extends Employee {
  constructor(name, monthlySalary, bonus) {
    super(name, monthlySalary);   // let the parent set name and salary
    this.bonus = bonus;           // then add what's new
  }

  getAnnualSalary() {
    // Reuse the parent's formula, then add the bonus
    return super.getAnnualSalary() + this.bonus;
  }
}`,
      hint: "In <code>Manager</code>: the constructor starts with <code>super(name, monthlySalary)</code>; the override returns <code>super.getAnnualSalary() + this.bonus</code>. For <code>toString</code>, <code>this.constructor.name</code> gives the class name.",
      explanation: "<p>Using <code>this.constructor.name</code> in the parent means <code>Manager</code> doesn't need its own <code>toString</code> at all. And calling <code>super.getAnnualSalary()</code> instead of re-writing <code>monthlySalary * 12</code> means a future change to the base formula (say, 13 payments a year) automatically reaches managers too.</p>",
      tests: [
        { label: "employee annual salary", expr: "new Employee('Ana', 1000).getAnnualSalary()", expected: 12000 },
        { label: "manager annual salary includes bonus", expr: "new Manager('Bo', 2000, 5000).getAnnualSalary()", expected: 29000 },
        { label: "manager keeps parent fields", code: "const m = new Manager('Bo', 2000, 500); return [m.name, m.monthlySalary, m.bonus];", expected: ["Bo", 2000, 500] },
        { label: "a Manager is an Employee", code: "return new Manager('Bo', 1, 1) instanceof Employee;", expected: true },
        { label: "Employee toString", code: "return String(new Employee('Ana', 1000));", expected: "Ana (Employee)" },
        { label: "Manager toString", code: "return String(new Manager('Bo', 2000, 500));", expected: "Bo (Manager)" },
        { label: "polymorphic payroll", code: "const staff = [new Employee('A', 100), new Manager('B', 100, 50)]; return staff.reduce(function (s, e) { return s + e.getAnnualSalary(); }, 0);", expected: 2450 }
      ]
    },
    {
      id: "inventory-composition",
      title: "Inventory (composition)",
      difficulty: "hard",
      prompt: "<p>An <code>Inventory</code> <strong>has</strong> many <code>Item</code>s (composition, not inheritance). <code>Item</code> is provided.</p><ul><li><code>addItem(item)</code> - if an item with the same name already exists, increase its quantity instead of adding a duplicate.</li><li><code>removeItem(name, quantity)</code> - with no <code>quantity</code>, remove the item completely; otherwise reduce it, and remove it when it reaches 0. Throw if the name is unknown or if <code>quantity</code> is more than in stock.</li><li><code>quantityOf(name)</code> - stock for that name (0 if absent).</li><li><code>totalValue()</code> - sum of <code>price * quantity</code> over all items.</li><li><code>get size</code> - number of different item names.</li></ul><pre>const inv = new Inventory();\ninv.addItem(new Item(\"pen\", 2, 10));\ninv.addItem(new Item(\"pen\", 2, 5));    // merges: 15 pens\ninv.addItem(new Item(\"book\", 15, 2));\ninv.size;                // 2\ninv.totalValue();        // 15*2 + 2*15 = 60\ninv.removeItem(\"pen\", 5);\ninv.quantityOf(\"pen\");   // 10</pre>",
      starter: `class Item {
  // Provided - nothing to do here.
  constructor(name, price, quantity = 1) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
}

class Inventory {
  constructor() {
    // your code here  (a Map of name -> Item works well)
  }

  addItem(item) {
    // your code here
  }

  removeItem(name, quantity) {
    // your code here
  }

  quantityOf(name) {
    // your code here
  }

  totalValue() {
    // your code here
  }

  get size() {
    // your code here
  }
}`,
      solution: `class Item {
  constructor(name, price, quantity = 1) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
}

class Inventory {
  constructor() {
    // Inventory HAS-A collection of Items, looked up by name in O(1)
    this.items = new Map();
  }

  addItem(item) {
    const existing = this.items.get(item.name);
    if (existing) {
      existing.quantity += item.quantity;   // same product: just top up stock
    } else {
      // store a copy so later changes to the caller's object don't leak in
      this.items.set(item.name, new Item(item.name, item.price, item.quantity));
    }
  }

  removeItem(name, quantity) {
    const item = this.items.get(name);
    if (!item) throw new Error("unknown item: " + name);

    if (quantity === undefined) {           // no quantity -> remove it all
      this.items.delete(name);
      return;
    }
    if (quantity > item.quantity) throw new RangeError("not enough stock");

    item.quantity -= quantity;
    if (item.quantity === 0) this.items.delete(name);   // tidy up empty items
  }

  quantityOf(name) {
    const item = this.items.get(name);
    return item ? item.quantity : 0;
  }

  totalValue() {
    let total = 0;
    for (const item of this.items.values()) {
      total += item.price * item.quantity;
    }
    return total;
  }

  get size() {
    return this.items.size;
  }
}`,
      hint: "Keep <code>this.items = new Map()</code> from name to <code>Item</code>. Almost every method then starts with <code>const item = this.items.get(name);</code> and checks whether it exists.",
      explanation: "<p>The Inventory doesn't <em>extend</em> Item - an inventory is not a kind of item. It <strong>holds</strong> items and <strong>delegates</strong> to them (<code>item.price * item.quantity</code>). The <code>Map</code> gives O(1) lookups by name, and all the stock rules live in one class, so the rest of the app can't put the stock into an impossible state.</p>",
      tests: [
        { label: "empty inventory", code: "const inv = new Inventory(); return [inv.size, inv.totalValue()];", expected: [0, 0] },
        { label: "add two items", code: "const inv = new Inventory(); inv.addItem(new Item('pen', 2, 10)); inv.addItem(new Item('book', 15, 2)); return [inv.size, inv.totalValue()];", expected: [2, 50] },
        { label: "same name merges quantity", code: "const inv = new Inventory(); inv.addItem(new Item('pen', 2, 10)); inv.addItem(new Item('pen', 2, 5)); return [inv.size, inv.quantityOf('pen')];", expected: [1, 15] },
        { label: "quantityOf missing is 0", expr: "new Inventory().quantityOf('ghost')", expected: 0 },
        { label: "remove completely", code: "const inv = new Inventory(); inv.addItem(new Item('pen', 2, 10)); inv.removeItem('pen'); return [inv.size, inv.quantityOf('pen')];", expected: [0, 0] },
        { label: "remove some", code: "const inv = new Inventory(); inv.addItem(new Item('pen', 2, 10)); inv.removeItem('pen', 3); return [inv.quantityOf('pen'), inv.totalValue()];", expected: [7, 14] },
        { label: "removing to zero deletes the item", code: "const inv = new Inventory(); inv.addItem(new Item('pen', 2, 3)); inv.removeItem('pen', 3); return inv.size;", expected: 0 },
        { label: "unknown name throws", code: "new Inventory().removeItem('ghost');", throws: true },
        { label: "removing too many throws", code: "const inv = new Inventory(); inv.addItem(new Item('pen', 2, 3)); inv.removeItem('pen', 4);", throws: true },
        { label: "failed removal keeps stock", code: "const inv = new Inventory(); inv.addItem(new Item('pen', 2, 3)); try { inv.removeItem('pen', 4); } catch (e) {} return inv.quantityOf('pen');", expected: 3 }
      ]
    }
  ],

  takeaways: [
    "A <strong>class</strong> is the blueprint; <code>new</code> builds <strong>objects</strong> from it. <code>this</code> is the object a method was called on.",
    "<strong>static</strong> members belong to the class (one shared copy); normal fields belong to each object.",
    "<strong>Encapsulation:</strong> hide data with <code>#private</code> fields and change it only through methods that check the rules.",
    "<strong>Inheritance</strong> (<code>extends</code>/<code>super</code>) is \"is-a\"; <strong>composition</strong> (an object holding others) is \"has-a\" - prefer composition.",
    "<strong>Polymorphism:</strong> call the same method on different objects and each responds its own way - no type checks needed.",
    "<code>===</code> on objects compares identity; write <code>equals()</code> and <code>toString()</code> for value-like classes."
  ]
});
