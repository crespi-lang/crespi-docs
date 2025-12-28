# Architecture Overview

> **Language:** [Espanol](../../es/arquitectura/general.md) | English

---

Crespi is a multilingual programming language (via language packs) implemented in Rust. It features a tree-walking interpreter for development and an LLVM-based native compiler for production.

## High-Level Architecture

```
+---------------------------------------------------------------------------+
|                           Source Code                                      |
|                        (.crespi files)                                     |
+---------------------------------------------------------------------------+
                                  |
                                  v
+---------------------------------------------------------------------------+
|                         Lexer/Scanner                                      |
|              (Tokenization with ASI, keyword mapping)                      |
|                   English -> Token <- Spanish                              |
+---------------------------------------------------------------------------+
                                  |
                                  v
+---------------------------------------------------------------------------+
|                            Parser                                          |
|           (Recursive descent with climbing precedence)                     |
|                         Produces AST                                       |
+---------------------------------------------------------------------------+
                                  |
                    +-------------+-------------+
                    v                           v
+---------------------------+     +-----------------------------------+
|       Interpreter         |     |         Native Compiler            |
|   (Tree-walking eval)     |     |                                    |
|                           |     |    +-------------------------+    |
|  +---------------------+  |     |    |   HIR (High-level IR)   |    |
|  |    Environment      |  |     |    |  (Lowering from AST)    |    |
|  |  (Lexical scoping)  |  |     |    +-------------------------+    |
|  +---------------------+  |     |                |                   |
|                           |     |                v                   |
|  +---------------------+  |     |    +-------------------------+    |
|  |   Value (Rc-based)  |  |     |    |       LLVM IR          |    |
|  |   Interpreter types |  |     |    |   (Code generation)     |    |
|  +---------------------+  |     |    +-------------------------+    |
+---------------------------+     |                |                   |
            |                     |                v                   |
            v                     |    +-------------------------+    |
+---------------------------+     |    |    Native Executable    |    |
|        Output             |     |    |    (+ crespi-runtime)   |    |
+---------------------------+     |    +-------------------------+    |
                                  +-----------------------------------+
```

---

## Key Design Decisions

### 1. English-First Multilingual Support

The language core uses **English as the canonical form**:
- English keywords (`var`, `class`, `fn`, `this`) are primary
- Spanish keywords (`variable`, `tipo`, `bloque`, `yo`) are aliases defined in the lexer
- All internal code, compiler passes, and runtime use English identifiers
- Spanish translation happens at the lexer level (token -> same TokenKind)

This ensures:
- Consistent internal representation
- Easy addition of more languages in the future
- No runtime overhead for language switching

#### Language Pack Workflow

- `crespi-schema` defines the source-of-truth lists for keywords, builtins, runtime type aliases, and operator aliases.
- `crespi-langpack` validates `.crespilang` files against the schema (validate/diff).
- `crespi-i18n` loads packs and provides forward/reverse maps.
- The lexer uses the reverse maps to normalize localized keywords/operators/builtins into English tokens and identifiers.

### 2. Value Model (Tagged Values)

The LLVM backend uses a tagged value struct (tag + payload) for dynamic
values and native machine types for statically known primitives. See
`docs/llvm/abi.md` for the current ABI.

### 3. Reference Counting with Cycle Detection

The runtime uses **reference counting** with cycle detection:
- Each heap object has a reference count
- Cycles detected via mark-sweep when counts don't reach zero
- Closure environments properly tracked for captures

### 4. Two Execution Modes

| Mode | Binary | Use Case |
|------|--------|----------|
| Interpreter | `crespi` | Development, REPL, debugging |
| Compiler | `crespic` | Production, performance-critical |

Both modes support the full language feature set.

### 5. Duck-Typed Generics

Generics use **square bracket syntax** to avoid ambiguity:
```crespi
class Box[T](let value)    // Not <T> to avoid comparison operator ambiguity
```

Type parameters are parsed but not enforced at runtime (duck typing).

### 6. Interpreter/Compiler Parity

- Both modes rely on English canonical names after lexing.
- Builtins must be implemented in `crespi-core` (interpreter) and `crespi-runtime` (compiled), plus registered in codegen (`lowering.rs`, `compiler.rs`).
- When adding keywords/operators/builtins, update `crespi-schema`, language packs, and the reference docs together.
- Constants `PI` and `E` are inlined as float literals during compilation (not function calls).

---

## Data Flow

### Interpretation Flow

```
Source -> Lexer -> Parser -> AST -> Interpreter -> Value
                                     |
                              Environment (scopes)
```

### Compilation Flow

```
Source -> Lexer -> Parser -> AST -> HIR (lowering) -> LLVM IR -> Object Code
                                      |                              |
                            Variable resolution              Link with runtime
                            Free variable analysis                   |
                            Builtin translation              Native Executable
```

---

## Module System

Inspired by Swift, the module system supports:

```crespi
import Helpers                  // Entire module
import Math.Vector              // Nested module
import Helper { double, Point } // Explicit symbols
import class Math.Point         // Specific class
import fn Utils.format          // Specific function
```

**Resolution order:**
1. Relative to importing file
2. Source root
3. Additional `-I` search paths

**File naming:**
- `snake_case.crespi` -> `PascalCase` module name
- Directories create nested modules

---

## See Also

- [Crate Structure](crates.md) - Description of each crate
