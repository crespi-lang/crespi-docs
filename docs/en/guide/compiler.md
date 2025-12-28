# Native Compiler

> **Language:** [Español](../../es/guia/compilador.md) | English

---

The Crespi compiler (`crespic`) generates native executables from your code. It's ideal for distribution and maximum performance.

## Quick Start

```bash
# Compile a program
crespic program.crespi

# Run the generated binary
./program
```

---

## Basic Usage

### Compile

```bash
crespic my_program.crespi
```

This generates an executable with the same name as the source file (without extension).

### Type Check (Optional)

```bash
crespic --check my_program.crespi
```

Runs the static type checker before compiling. The compiler exits on type errors.

### Custom Output Name

```bash
crespic my_program.crespi -o application
./application
```

### Complete Example

```bash
# Create program
echo 'print("Hello from native code!")' > hello.crespi

# Compile
crespic hello.crespi

# Run
./hello
# Output: Hello from native code!
```

---

## CLI Reference

| Option | Description |
|--------|-------------|
| `<file>` | Source file to compile |
| `-o, --output <name>` | Output executable name |
| `--check` | Run the type checker before compiling |
| `-L <library>` | Link an external static library (can be used multiple times) |
| `-O0` | No optimization (default) |
| `-O1` | Basic optimization (includes `@inline` decorated functions) |
| `-O2` | Full optimization (auto-inlines small functions) |
| `--help` | Show help |
| `--version` | Show version |

---

## Experimental Native ABI Backend

The `native-abi` Cargo feature enables an experimental backend that lowers
typed numeric code to native ABI signatures. For now it supports `Int`,
`Double`, `Bool`, and `print()` for those types.

```bash
cargo run --bin crespic --features native-abi -- examples/simple_scripts/native_abi_demo.crespi -o /tmp/crespi_native_abi_demo
/tmp/crespi_native_abi_demo
```

---

## Supported Features

The compiler supports most language features:

- ✅ Variables and constants
- ✅ Primitive types: integers, decimals, text, booleans
- ✅ Arrays: literals, indexing, `list.length()`, `list.push()`, `list.pop()`
- ✅ Dictionaries: literals, indexing, `dict.keys()`, `dict.values()`, `dict.contains()`
- ✅ Control flow: `if`, `while`, `for...in`, `break`, `continue`
- ✅ Functions: definitions, recursion, default parameters
- ✅ Closures with variable capture
- ✅ Classes: `class`, inheritance (`:`), `super`
- ✅ Decorators: `@memoize`, `@inline`
- ✅ Built-in functions: `print()`, `read()`, `typeof()`, `str()`, `int()`, `float()`, `memoize()`; collection and string helpers are methods (for example `list.map()`, `text.trim()`, `dict.keys()`).
- ✅ Extern functions: Call native Rust/C libraries via FFI

---

## Extern Functions (FFI)

Crespi supports calling external native functions from Rust or C libraries using the `extern fn` declaration.

### 1. Declare in Crespi

```crespi
extern fn my_add(a: Int, b: Int) -> Int
extern fn my_sin(x: Double) -> Double

// Bind to a different native symbol name
#[link_name = "my_add_impl"]
extern fn my_add(a: Int, b: Int) -> Int

fn main() {
    print(my_add(10, 32))  // Output: 42
    print(my_sin(1.57))    // Output: ~1.0
}
```

### 2. Implement in Rust

```rust
// lib.rs
#[no_mangle]
pub extern "C" fn my_add(a: i64, b: i64) -> i64 {
    a + b
}

#[no_mangle]
pub extern "C" fn my_sin(x: f64) -> f64 {
    x.sin()
}
```

### 3. Build and Link

```bash
# Compile Rust library
rustc --crate-type=staticlib -o libmymath.a lib.rs

# Compile Crespi with the library
crespic program.crespi -L libmymath.a -o program

# Run
./program
```

### Type Mapping

| Crespi | Rust | Notes |
|--------|------|-------|
| `Int` | `i64` | 64-bit signed integer |
| `Double` | `f64` | 64-bit floating point |
| `Float` | `f32` | 32-bit floating point |
| `Bool` | `bool` | Boolean value |
| `Unit` | `()` | No return value |

---

## Entry Point

The compiler looks for an entry point in two ways:

### 1. Explicit `main()` function

```crespi
fn main() {
    print("Hello, World!")
}
```

### 2. Top-level code (implicit)

```crespi
// Top-level code runs automatically
print("Hello, World!")

fn helper() {
    print("This is a helper function")
}
```

In the second case, the compiler generates a synthetic `main()` function containing the top-level code.

---

## How It Works

```
Source Code (.crespi)
    ↓
Lexer/Scanner (tokenization)
    ↓
Parser (AST generation)
    ↓
Lowerer (AST → HIR)
    ↓
Compiler (HIR → LLVM IR)
    ↓
Code Generator (machine code)
    ↓
Linker (links with libcrespi_runtime.a)
    ↓
Native Executable
```

---

## Optimization Levels

The compiler supports three optimization levels:

### `-O0` (Default)

No optimization. Code is compiled directly without any transformations.

### `-O1` (Basic)

Basic optimizations including:
- Constant folding
- Function inlining for `@inline` decorated functions
- LLVM pass pipeline at `-O1` (including `alwaysinline` attributes)

```crespi
@inline
fn double(x) { return x * 2 }

fn main() {
    // At -O1, this call is replaced with: result = 21 * 2
    var result = double(21)
    print(result)
}
```

### `-O2` (Full)

Full optimizations including everything from `-O1` plus:
- Auto-inlining of small functions (≤5 statements)
- More aggressive constant propagation
- LLVM pass pipeline at `-O2` with inline hints for small functions

Small, non-recursive functions are automatically inlined even without the `@inline` decorator.

```bash
# Compile with full optimization
crespic -O2 program.crespi
```

---

## Implementation Note

The compiler codebase uses English identifiers and terminology. The Crespi language surface is English-first, with Spanish aliases provided via language packs.

---

## When to Use the Compiler

| Use Case | Recommendation |
|----------|----------------|
| Distributing applications | ✅ Compiler |
| Maximum performance | ✅ Compiler |
| Development and testing | ❌ Use [interpreter](interpreter.md) |
| Interactive REPL | ❌ Use [interpreter](interpreter.md) |

---

## See Also

- [Interpreter](interpreter.md) - Run code directly
- [Variables](variables.md) - Data types and variables
- [Classes](classes.md) - Object-oriented programming
