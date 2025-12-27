# Crate Structure

> **Language:** [Español](../../es/arquitectura/crates.md) | English

---

The Crespi language is organized as a Cargo workspace with specialized crates for different concerns.

## Crate Dependency Graph

```
                    ┌─────────────┐
                    │ crespi-cli  │  (Binary: crespi)
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
      ┌─────────────┐ ┌─────────┐
      │ crespi-llvm │ │crespi-  │
      │ (crespic)   │ │  core   │
      └──────┬──────┘ └────┬────┘
             │             │
             ▼             │
      ┌─────────────┐      │
      │crespi-codegen│     │
      └──────┬──────┘      │
             │             │
             ▼             │
      ┌─────────────┐      │
      │crespi-runtime│◄────┴
      └──────┬──────┘
             │
             ▼
      ┌─────────────┐
      │  crespi-ffi │
      └──────┬──────┘
             │
             ▼
      ┌─────────────┐
      │crespi-builtins│
      └─────────────┘

      ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
      │ crespi-i18n │  │crespi-schema│  │crespi-langpack│
      └─────────────┘  └─────────────┘  └─────────────┘
            (Internationalization support crates)
```

---

## Core Crates

### crespi-core

**The heart of the language implementation.**

| Module | Purpose |
|--------|---------|
| `lexer/scanner.rs` | Tokenization with Automatic Semicolon Insertion (ASI) |
| `lexer/token.rs` | Token types, keyword mapping (English primary, Spanish aliases) |
| `parser/parser.rs` | Recursive descent parser with climbing precedence |
| `parser/ast.rs` | AST types (Stmt, Expr) with Span for error locations |
| `interpreter/eval.rs` | Tree-walking interpreter |
| `interpreter/environment.rs` | Lexical scoping with `Rc<RefCell<Environment>>` |
| `interpreter/builtins.rs` | 60 built-in functions |
| `interpreter/value.rs` | Interpreter runtime values (Rc-based) |
| `module/` | Module system for multi-file compilation |

**Key features:**
- Full language parsing and interpretation
- Extension method support
- Generics (duck-typed)
- Multi-file module resolution

---

### crespi-codegen

**HIR lowering and optimization shared by backends.**

| Module | Purpose |
|--------|---------|
| `hir.rs` | High-level IR types between AST and backend codegen |
| `lowering.rs` | AST → HIR conversion, variable resolution, closure analysis |
| `optimizer.rs` | HIR optimization passes (constant folding, DCE, inlining) |

**Compilation pipeline:**
```
AST → HIR (lowering) → [Optimizer]
```

**Key responsibilities:**
- Free variable analysis for closures
- Spanish → English builtin name translation
- GC context threading metadata
- Entry-point signature validation

---

### crespi-llvm

**Native code generation via LLVM (Inkwell).**

| Module | Purpose |
|--------|---------|
| `compiler.rs` | HIR → LLVM IR translation, object code emission |
| `types.rs` | Crespi → LLVM type mapping + signatures |
| `passes.rs` | LLVM optimization pipeline |

**Compilation pipeline:**
```
AST → HIR (lowering) → LLVM IR → Native Code
```

---

### crespi-runtime

**Runtime support library for compiled programs.**

| Module | Purpose |
|--------|---------|
| `value.rs` | Tagged value representation (tag + payload) used by the LLVM ABI |
| `gc.rs` | Reference counting with cycle detection |
| `builtins.rs` | C-compatible built-in functions implementation |

**Calling convention:**
- All functions receive `gc_ctx: *mut GcContext` as hidden first parameter
- Entry point creates GC context, passes to all calls, destroys on exit

See `docs/llvm/abi.md` for the current ABI.

---

### crespi-ffi

**Foreign Function Interface layer.**

Facilitates interoperability between Crespi and other languages (primarily Rust, extensible to C).

| Module | Purpose |
|--------|---------|
| `marshal.rs` | Data marshaling between Crespi values and host types |
| `lib.rs` | Utilities for defining `NativeFn` and FFI contexts |

**Key features:**
- Safe marshaling of primitives (`i32`, `f64`, `bool`, `String`)
- `FromCrespi` and `ToCrespi` traits
- C-ABI compatible function signatures

---

### crespi-builtins

**Standard Library Native Bindings.**

Contains the native wrapper functions for the standard library, bridging the FFI layer to the core runtime implementation.

| Module | Purpose |
|--------|---------|
| `lib.rs` | Registration of built-in functions (print, math, string ops) |

---

### crespi-cli

**Command-line interface for both interpreter and compiler.**

| Binary | Purpose |
|--------|---------|
| `crespi` | Interpreter with REPL |
| `crespic` | Native compiler |

**Debug modes:**
- `crespi hir <file>` - Show HIR representation
- `crespi llvm <file>` - Show LLVM IR

---

### crespi-cargo

**Cargo integration library.**

Implements the logic for analyzing Rust projects, extracting API metadata via `rustdoc`, and generating FFI bindings. Used by both the compiler (`crespic`) for automatic linking and the standalone `crespigen` tool.

---

### crespigen

**Standalone FFI binding generator.**

A CLI tool that generates Crespi bindings for Rust libraries.
- Parses `rustdoc` JSON output
- Generates Rust FFI wrapper code
- Compiles everything into a static library
- Embeds `crespi-ffi` and `crespi-runtime` sources to be self-contained

---

## External Repositories

### crespi-wasm

**WebAssembly bindings for browser execution.**
Moved to [crespi-wasm](https://github.com/crespi-lang/crespi-wasm).

### crespi-ide-support

**VS Code extension and Language Server.**
Moved to [crespi-ide-support](https://github.com/crespi-lang/crespi-ide-support).

---

## Support Crates

### crespi-i18n

**Internationalization infrastructure.**

Provides complete localization support for the Crespi language:

| Component | Purpose |
|-----------|---------|
| `langpack.rs` | Loads `.crespilang` packs for keyword/builtin/operator/type aliases |
| `bundle.rs` | FTL-based translation bundle using Mozilla Fluent |
| `locale.rs` | Locale detection and management (system locale, `CRESPI_LANG` env) |
| `locales/en/*.ftl` | English translations |
| `locales/es/*.ftl` | Spanish translations |

**Translation coverage:**
- ✅ Parser errors and labels
- ✅ Runtime errors and labels
- ✅ Lexer errors
- ✅ Module system errors (not found, circular dependency, symbol not found)
- ✅ Main error wrappers (syntax, lexer, runtime)
- ✅ Parser context strings (variable name, function name, etc.)
- ✅ CLI messages
- ✅ Builtin function errors

**Usage:**
```rust
use crespi_i18n::{t, tr};

// Simple translation
let msg = t("label-here");

// Translation with arguments
let msg = tr!("runtime-undefined-variable", name = var_name);
```

---

### crespi-langpack

**Language pack tooling.**

CLI for validating, generating, and diffing language packs against `crespi-schema`.
Pack files live in `crespi-i18n/packs/`.

---

### crespi-schema

**Language pack schema.**

Defines the canonical enums for keywords, builtins, runtime types, and operator aliases used by packs and validation.

---

## Building

```bash
# Build all crates
cargo build

# Build release (optimized)
cargo build --release

# Test all crates
cargo test

# Test specific crate
cargo test -p crespi-core
```

---

## See Also

- [Architecture Overview](overview.md)
- [Interoperability](interoperability.md)
