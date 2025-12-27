# Classes and Objects

> **Language:** [Español](../../es/guia/clases.md) | English

---

Crespi supports object-oriented programming with classes, inheritance, and methods.

## Defining a Class

Use `class` to define a class:

```crespi
class Person(var name: String, var age: Int) {
    fn introduce() {
        print("I am " + this.name + ", " + str(this.age) + " years old")
    }
}
```

### Creating Instances

Create objects by calling the class directly:

```crespi
var ana = Person("Ana", 25)
var luis = Person("Luis", 30)

ana.introduce()   // I am Ana, 25 years old
luis.introduce()  // I am Luis, 30 years old
```

---

## The Constructor: `constructor`

The `constructor` method is called automatically when creating an instance:

```crespi
class Rectangle {
    constructor(width: Int, height: Int) {
        this.width = width
        this.height = height
        print("Rectangle created: " + str(width) + "x" + str(height))
    }
}

var rect = Rectangle(10, 5)
// Output: Rectangle created: 10x5
```

Primary constructors can be declared in the class header (Kotlin-style). Use `var` or `let` to make
parameters into instance properties:

- `var`: Creates a **mutable** property that can be modified after construction
- `let`: Creates an **immutable** property that cannot be changed after construction
- No modifier: The parameter is only used for construction, not stored as a property

```crespi
class Point(let x: Int, let y: Int) {
}

var p = Point(3, 4)
print(p.x)  // 3
print(p.y)  // 4
// p.x = 10  // Error: cannot modify immutable property
```

Use `var` when you need mutable properties:

```crespi
class Counter(var value: Int) {
}

var c = Counter(0)
c.value = 10  // OK: var properties are mutable
```

Additional constructors can delegate to the primary one:

```crespi
class Point(let x: Int, let y: Int) {
    constructor(tuple: (Int, Int)) : this(tuple[0], tuple[1])
}
```

### Constructor Without Parameters

```crespi
class Counter(var value: Int = 0) {
    fn increment() {
        this.value += 1
    }

    fn get() -> Int {
        return this.value
    }
}

var c = Counter()
c.increment()
c.increment()
print(c.get())  // 2
```

---

## The `this` Reference

`this` references the current instance:

```crespi
class Circle(var radius: Float) {
    fn area() -> Float {
        return 3.14159 * this.radius * this.radius
    }

    fn perimeter() -> Float {
        return 2 * 3.14159 * this.radius
    }

    fn scale(factor: Float) {
        this.radius = this.radius * factor
    }
}

var circle = Circle(5.0)
print(circle.area())       // 78.53975
print(circle.perimeter())  // 31.4159

circle.scale(2.0)
print(circle.radius)       // 10
```

---

## Static Members and Blocks

Use `static` to define class-level fields, methods, and initialization blocks. Static members are
accessed on the class itself, not on instances.

```crespi
class Config {
    static let version = "1.0"
    static var counter = 0

    static fn bump() {
        Config.counter = Config.counter + 1
    }

    static {
        Config.bump()
    }
}

print(Config.version)  // "1.0"
print(Config.counter)  // 1
```

---

## Nested and Inner Classes

Use `nested class` for static nested types and `inner class` when you need access to the outer
instance. Inner class instances store the outer instance in `this.__outer`.

```crespi
class Outer(var value) {
    nested class StaticLabel {
        fn label() {
            return "static"
        }
    }

    inner class InnerValue {
        fn outerValue() {
            return this.__outer.value
        }
    }

    fn makeInner() {
        return this.InnerValue()
    }
}

var s = Outer.StaticLabel()
var o = Outer(10)
var i = o.makeInner()
print(i.outerValue())  // 10
```

You can also construct an inner class explicitly by passing the outer instance first:

```crespi
var o = Outer(10)
var i = Outer.InnerValue(o)
```

Outside the class, use the explicit outer-argument form so the compiler can resolve the class
unambiguously.

When you already have an instance, you can also call `o.InnerValue()` (inner classes only).

### Instantiating Inner Classes from Outer Instances

When you call `o.InnerValue()` on an existing outer instance, the compiler uses the same runtime helper
as the interpreter to pass `o` along as the hidden `this.__outer` reference. This keeps
`o.InnerValue()` behavior consistent between interpreted and compiled code, so the outer
instance is always captured automatically.

---

## Properties

### Accessing Properties

```crespi
class Point(let x: Int, let y: Int) {
}

var p = Point(3, 4)
print(p.x)  // 3
print(p.y)  // 4
```

### Modifying Properties

Use `var` for mutable properties:

```crespi
class Point(var x: Int, var y: Int) {
}

var p = Point(0, 0)
p.x = 10
p.y = 20
print(p.x)  // 10
print(p.y)  // 20
```

### Dynamic Properties

You can add properties after creation:

```crespi
class Object(var name: String = "object") {
}

var obj = Object()
obj.color = "red"       // New property
obj.size = "large"      // Another property

print(obj.color)  // red
print(obj.size)   // large
```

---

## Methods

### Methods with Return

```crespi
class Calculator(var memory: Int = 0) {
    fn add(a: Int, b: Int) -> Int {
        return a + b
    }

    fn store(value: Int) {
        this.memory = value
    }

    fn recall() -> Int {
        return this.memory
    }
}

var calc = Calculator()
print(calc.add(5, 3))  // 8

calc.store(100)
print(calc.recall())   // 100
```

### Methods that Modify State

```crespi
class BankAccount(var balance: Float) {
    fn deposit(amount: Float) {
        this.balance += amount
    }

    fn withdraw(amount: Float) -> Bool {
        if amount > this.balance {
            print("Insufficient funds")
            return false
        }
        this.balance -= amount
        return true
    }

    fn check() -> Float {
        return this.balance
    }
}

var account = BankAccount(1000.0)
account.deposit(500.0)
print(account.check())  // 1500

account.withdraw(200.0)
print(account.check())  // 1300
```

---

## Inheritance

Use `:` to inherit from another class:

```crespi
class Animal(var name: String) {
    fn speak() {
        print(this.name + " makes a sound")
    }
}

class Dog(var name: String, var breed: String) : Animal(name) {
    fn speak() {
        print(this.name + " barks")
    }
}

class Cat(var name: String) : Animal(name) {
    fn speak() {
        print(this.name + " meows")
    }
}

var fido = Dog("Fido", "Labrador")
var michi = Cat("Michi")

fido.speak()   // Fido barks
michi.speak()  // Michi meows
```

---

## The `super` Keyword

`super` allows accessing parent class methods:

### In the Constructor

```crespi
class Vehicle(var brand: String, var model: String) {
    fn describe() -> String {
        return this.brand + " " + this.model
    }
}

class Car(var brand: String, var model: String, var doors: Int) : Vehicle(brand, model) {
    fn describe() -> String {
        var base = super.describe()  // Call parent method
        return base + " (" + str(this.doors) + " doors)"
    }
}

var car = Car("Toyota", "Corolla", 4)
print(car.describe())  // Toyota Corolla (4 doors)
```

### In Methods

```crespi
class Employee(var name: String, var salary: Float) {
    fn calculateBonus() -> Float {
        return this.salary * 0.10
    }
}

class Manager(var name: String, var salary: Float, var department: String) : Employee(name, salary) {
    fn calculateBonus() -> Float {
        var baseBonus = super.calculateBonus()  // 10%
        return baseBonus * 2  // Managers: 20%
    }
}

var emp = Employee("Ana", 30000.0)
var mgr = Manager("Carlos", 50000.0, "Sales")

print(emp.calculateBonus())  // 3000
print(mgr.calculateBonus())  // 10000
```

---

## Polymorphism

Objects of different classes can be treated uniformly:

```crespi
class Shape {
    fn area() -> Float {
        return 0.0
    }
}

class Square(var side: Float) : Shape {
    fn area() -> Float {
        return this.side * this.side
    }
}

class Circle(var radius: Float) : Shape {
    fn area() -> Float {
        return 3.14159 * this.radius * this.radius
    }
}

// Function that works with any shape
fn totalArea(shapes: List[Shape]) -> Float {
    var total = 0.0

    for shape in shapes {
        total += shape.area()
    }

    return total
}

var shapes = [
    Square(5.0),
    Circle(3.0)
]

print(totalArea(shapes))  // 53.27431
```

---

## Methods with Short Syntax

You can use single-expression syntax in methods:

```crespi
class Math {
    fn square(x: Int) -> Int = x * x
    fn cube(x: Int) -> Int = x * x * x
    fn double(x: Int) -> Int = x * 2
    fn average(a: Int, b: Int) -> Int = (a + b) / 2
}

var m = Math()
print(m.square(4))      // 16
print(m.cube(3))        // 27
print(m.average(10, 20)) // 15
```

---

## Common Patterns

### Builder

```crespi
class PersonBuilder(var name: String = "", var age: Int = 0, var city: String = "") {
    fn withName(name: String) -> PersonBuilder {
        this.name = name
        return this
    }

    fn withAge(age: Int) -> PersonBuilder {
        this.age = age
        return this
    }

    fn withCity(city: String) -> PersonBuilder {
        this.city = city
        return this
    }

    fn build() -> Dict[String, Any] {
        return {
            "name": this.name,
            "age": this.age,
            "city": this.city
        }
    }
}

var person = PersonBuilder()
    .withName("Ana")
    .withAge(25)
    .withCity("Madrid")
    .build()

print(person)
```

### Composition

```crespi
class Engine(var power: Int, var running: Bool = false) {
    fn start() {
        this.running = true
        print("Engine started")
    }

    fn stop() {
        this.running = false
        print("Engine stopped")
    }
}

class Car {
    constructor(brand: String, enginePower: Int) {
        this.brand = brand
        this.engine = Engine(enginePower)  // Composition
    }

    fn start() {
        print("Starting " + this.brand)
        this.engine.start()
    }

    fn stop() {
        this.engine.stop()
        print(this.brand + " stopped")
    }
}

var car = Car("Toyota", 150)
car.start()
// Starting Toyota
// Engine started
```

---

## Traits

Traits define shared behavior that classes can implement. They're similar to interfaces but can have default implementations.

### Defining a Trait

```crespi
trait Describable {
    fn describe() -> String
}
```

### Implementing a Trait

Use `:` to implement traits (same syntax as inheritance):

```crespi
class Person(var name: String, var age: Int) : Describable {
    fn describe() -> String {
        return "Person: " + this.name + ", " + str(this.age) + " years old"
    }
}

var p = Person("Ana", 25)
print(p.describe())  // Person: Ana, 25 years old
```

### Default Implementations

Traits can provide default implementations:

```crespi
trait Greetable {
    fn greet() {
        print("Hello, I am " + this.name)
    }
}

class Student(var name: String) : Greetable {
    // Uses default greet() implementation
}

var s = Student("Luis")
s.greet()  // Hello, I am Luis
```

### Trait Inheritance

Traits can extend other traits:

```crespi
trait Walkable {
    fn walk()
}

trait Runner : Walkable {
    fn run()
}

// Classes implementing Runner must implement both walk() and run()
class Athlete(var name: String) : Runner {
    fn walk() {
        print(this.name + " is walking")
    }
    
    fn run() {
        print(this.name + " is running")
    }
}
```

### Multiple Traits

Classes can implement multiple traits:

```crespi
trait Printable {
    fn toPrint() -> String
}

trait Comparable {
    fn compare(other: Any) -> Int
}

class Value(var n: Int) : Printable, Comparable {
    fn toPrint() -> String {
        return "Value(" + str(this.n) + ")"
    }

    fn compare(other: Any) -> Int {
        return this.n - other.n
    }
}
```

### Class Inheritance with Traits

When inheriting from a class and implementing traits, the class comes first:

```crespi
class Animal(var name: String) {
    fn speak() {
        print(this.name + " makes a sound")
    }
}

trait Flyable {
    fn fly()
}

class Bird(var name: String) : Animal(name), Flyable {
    fn fly() {
        print(this.name + " is flying")
    }
}

var b = Bird("Tweety")
b.speak()  // Tweety makes a sound
b.fly()    // Tweety is flying
```

---

## See Also

- [Functions](functions.md)
- [Extensions](extensions.md)
- [Advanced Features](advanced.md)
- [Keywords](../reference/keywords.md)
