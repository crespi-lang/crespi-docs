# Generics

> **Language:** [Español](../../es/guia/genericos.md) | English

---

Crespi supports lightweight, duck-typed generics for classes and functions using square bracket syntax.

## Generic Classes

Use square brackets to declare type parameters. Use `var` or `let` to make constructor parameters into properties:

```crespi
class Box[T](var value: T) {
    fn get() -> T {
        return this.value
    }

    fn set(newValue: T) {
        this.value = newValue
    }
}

// Usage - type is inferred
var intBox = Box(42)
var strBox = Box("hello")

print(intBox.get())  // 42
print(strBox.get())  // "hello"
```

### Multiple Type Parameters

```crespi
class Pair[A, B](let first: A, let second: B) {
    fn swap() -> Pair[B, A] {
        return Pair(this.second, this.first)
    }

    fn getFirst() -> A {
        return this.first
    }

    fn getSecond() -> B {
        return this.second
    }
}

var p = Pair(1, "one")
print(p.getFirst())   // 1
print(p.getSecond())  // "one"

var swapped = p.swap()
print(swapped.getFirst())  // "one"
```

---

## Generic Functions

Functions can also have type parameters. Type parameters go **before** the function name:

```crespi
fn [T] identity(x: T) -> T {
    return x
}

print(identity(42))      // 42
print(identity("hello")) // "hello"
print(identity([1,2,3])) // [1, 2, 3]
```

### Multiple Type Parameters in Functions

```crespi
fn [T, U] transform(value: T, func: (T) -> U) -> U {
    return func(value)
}

fn [T] double(x: Int) -> Int = x * 2
fn [T] toString(x: Int) -> String = str(x)

print(transform(5, double))    // 10
print(transform(42, toString)) // "42"
```

---

## Generic Constraints

Crespi uses duck typing, so generic types aren't enforced at compile time. The code will work as long as the operations used are valid for the actual types:

```crespi
class Container[T](var items: List[T] = []) {
    fn add(item: T) {
        this.items.push(item)
    }

    fn getAll() -> List[T] {
        return this.items
    }

    fn count() -> Int {
        return this.items.length()
    }
}

// Works with any type
var numbers = Container()
numbers.add(1)
numbers.add(2)
numbers.add(3)
print(numbers.count())  // 3

var strings = Container()
strings.add("a")
strings.add("b")
print(strings.getAll())  // ["a", "b"]
```

---

## Generic Methods

Classes with type parameters can have methods that use those parameters:

```crespi
class Stack[T](var items: List[T] = []) {
    fn push(item: T) {
        this.items.push(item)
    }

    fn pop() -> T? {
        return this.items.pop()
    }

    fn peek() -> T? {
        if this.items.length() == 0 {
            return null
        }
        return this.items[this.items.length() - 1]
    }

    fn isEmpty() -> Bool {
        return this.items.length() == 0
    }
}

var stack = Stack()
stack.push(1)
stack.push(2)
stack.push(3)

print(stack.peek())  // 3
print(stack.pop())   // 3
print(stack.pop())   // 2
```

---

## Nested Generics

You can use generic types within other generic types:

```crespi
class Box[T](let value: T)

class DoubleBox[A, B](let boxA: Box[A], let boxB: Box[B]) {
    fn getFirst() -> A {
        return this.boxA.value
    }

    fn getSecond() -> B {
        return this.boxB.value
    }
}

var a = Box(10)
var b = Box("hello")
var double = DoubleBox(a, b)

print(double.getFirst())   // 10
print(double.getSecond())  // "hello"
```

---

## Why Square Brackets?

Crespi uses `[T]` instead of `<T>` to avoid ambiguity with comparison operators:

```crespi
// With angle brackets, this would be ambiguous:
// var x = Foo<Bar>(value)  -- Is this (Foo < Bar) > value ?

// Square brackets are unambiguous:
var x = Foo[Bar](value)  // Clearly a generic instantiation
```

---

## Generics Behavior

- Uses square brackets `[T, U]` to avoid ambiguity with comparison operators
- Duck-typed: type parameters are parsed but not enforced at runtime
- Works with both classes and functions
- Multiple type parameters supported
- No explicit type instantiation needed (inferred from usage)
- Generics work in both the interpreter and native compilation

---

## See Also

- [Classes and Objects](classes.md)
- [Functions](functions.md)
- [Extensions](extensions.md)
