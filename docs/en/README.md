# Crespi - Documentation

> **Language:** [Espanol](../es/README.md) | English

---

Crespi is a multilingual programming language (via language packs) with English as the primary syntax and Spanish available as the first language pack, designed to make programming more accessible to Spanish speakers and other language communities.

## Type System

Crespi is **statically typed** with Hindley-Milner style type inference. Type annotations are optional because the type checker can infer types from context. The language provides two execution modes with different strictness levels:

- **Compiler (`crespic`)**: Strict mode - type errors block compilation
- **Interpreter (`crespi`)**: Relaxed mode - type errors appear as warnings, execution continues

This dual approach allows beginners to learn incrementally while ensuring production code is type-safe.

## Contents

### Getting Started

- [Quick Start](quick-start.md) - Your first program in Crespi

### Language Reference

- [Keywords](reference/keywords.md) - All reserved words
- [Operators](reference/operators.md) - Arithmetic, comparison, and logical operators
- [Built-in Functions](reference/functions.md) - Default available functions
- [Data Types](reference/types.md) - Crespi's type system
- [Grammar (ANTLR4)](reference/grammar.md) - Reference grammar

### Execution

- [Interpreter](guide/interpreter.md) - Run code directly
- [Compiler](guide/compiler.md) - Compile to native executable
- [Feature Parity](../feature-parity.md) - Interpreter vs compiler support matrix

### Architecture

- [Overview](architecture/overview.md) - High-level architecture
- [Crate Structure](architecture/crates.md) - Rust crate organization

### Contributing

- [Contributing Guide](contributing/CONTRIBUTING.md) - How to contribute
- [Code Style](contributing/code-style.md) - Coding standards

### Language Guide

- [Variables and Constants](guide/variables.md)
- [Control Flow](guide/control-flow.md)
- [Functions](guide/functions.md)
- [Lists and Dictionaries](guide/collections.md)
- [Classes and Objects](guide/classes.md)
- [Advanced Features](guide/advanced.md)

---

## Key Features

### Multilingual Syntax

English is canonical; language packs provide localized aliases. Spanish is the first language pack, with the architecture designed to support additional languages in the future. See the Spanish docs for localized examples.

```crespi
// English (primary)
var name = "Ana"
let PI = 3.14159

if name == "Ana" {
    print("Hello, Ana!")
}
```

### Readable Operators

Crespi allows using operators in symbolic or textual form:

```crespi
// Symbolic form
var sum = 5 + 3

// Textual form (Spanish operators)
var sumText = 5 mas 3
```

### Object-Oriented Programming

```crespi
class Person(let name, let age) {
    fn greet() {
        print("Hello, I'm " + this.name)
    }
}

var ana = Person("Ana", 25)
ana.greet()
```

### First-Class Functions

```crespi
fn double(x) {
    return x * 2
}

fn apply(func, value) {
    return func(value)
}

print(apply(double, 5))  // 10
```

---

## Installation

### Requirements

- Rust 1.70+
- Cargo

### Build from Source

```bash
git clone https://github.com/user/crespi-lang.git
cd crespi-lang
cargo build --release
```

### Run

```bash
# Interactive REPL
cargo run

# Run a file
cargo run -- program.crespi
```

---

## Resources

- [Examples](https://github.com/crespi-lang/crespi-lang/tree/main/examples) - Example programs
- [IDE Support](https://github.com/crespi-lang/crespi-ide-support) - VS Code extension and LSP
- [WASM Runtime](https://github.com/crespi-lang/crespi-wasm) - WebAssembly bindings
- [Web Platform](https://crespilang.izantech.app) - Learn in the browser
