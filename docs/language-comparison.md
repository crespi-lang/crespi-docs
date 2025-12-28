# Crespi vs. Kotlin vs. Swift: Feature Comparison Report

**Crespi** is a modern, dynamically typed language with an optional static type checker. It blends the ergonomic syntax of **Kotlin** with the structural patterns of **Swift** and the keyword brevity of **Rust**. It runs on a dual-engine architecture: a tree-walking interpreter for development/scripting and an LLVM-based native compiler for production.

## 1. Core Syntax & Keywords

| Feature | **Crespi** | **Kotlin** | **Swift** | Analysis |
| :--- | :--- | :--- | :--- | :--- |
| **Function Decl** | `fn name(arg: T) -> T` | `fun name(arg: T): T` | `func name(_ arg: T) -> T` | Crespi uses Rust-style `fn` and `->` but follows Kotlin's simplicity (no argument labels). |
| **Variables** | `var` (mut), `let` (immut) | `var` (mut), `val` (immut) | `var` (mut), `let` (immut) | Crespi matches Swift's `let` for immutability. |
| **Generics** | `List[T]` (Square brackets) | `List<T>` (Angle brackets) | `List<T>` (Angle brackets) | Crespi uses `[]` for generics (like Python/Scala) to avoid parser ambiguities. |
| **Constructors** | `class Point(var x, let y)` | `class Point(val x, val y)` | `init(x: y:)` | Crespi follows Kotlin's "Primary Constructor" pattern with explicit `var`/`let` modifiers for properties. |
| **Extensions** | `extension Type { ... }` or `fn Type.name()` | `fun Type.method() { ... }` | `extension Type { ... }` | Crespi supports both Swift-style block extensions and Kotlin-style inline extension functions. Extension functions are automatically exposed as plain functions (`dual-dispatch`). |
| **Inheritance** | `class Dog : Animal` | `class Dog : Animal()` | `class Dog : Animal` | Crespi uses the colon syntax common to both, without the required parens of Kotlin. |

## 2. Control Flow & Pattern Matching

| Feature | **Crespi** | **Kotlin** | **Swift** | Analysis |
| :--- | :--- | :--- | :--- | :--- |
| **Conditionals** | `if`, `guard` | `if` (expression) | `if`, `guard` | Crespi includes Swift's `guard` statement, which Kotlin lacks natively (requires `?: return`). |
| **Matching** | `when` (expression) | `when` (expression) | `switch` | Crespi uses Kotlin's `when` keyword but supports Swift-like structural destructuring (e.g., `is [a, b] =>`). |
| **Loops** | `for x in list`, `while` | `for (x in list)`, `while` | `for x in list`, `while` | Identical `for..in` paradigm across all three. |
| **Ranges** | (In loops via iterators) | `1..10`, `1 until 10` | `1...10`, `1..<10` | Crespi currently relies on collection iteration; standard ranges are less syntactic. |

## 3. Type System & Null Safety

| Feature | **Crespi** | **Kotlin** | **Swift** | Analysis |
| :--- | :--- | :--- | :--- | :--- |
| **Typing** | Dynamic (Optional Checker) | Static (Strong) | Static (Strong) | Crespi is dynamic at runtime, with an opt-in static checker. |
| **Type Inference** | Hindley-Milner style (Checker) | Flow-sensitive | Bidirectional | Crespi's optional checker uses constraint-based type inference with type variable unification. |
| **Null Safety** | `T?`, `??` (Coalesce) | `T?`, `?:` (Elvis) | `T?`, `??` (Coalesce) | Crespi uses Swift's `??` operator instead of Kotlin's `?:`. |
| **Union Types** | `Int \| String` | (Smart casts / `Any`) | (Enums / `Result`) | Crespi supports ad-hoc union types (`|`) natively, a feature neither Kotlin nor Swift has directly (they use sealed classes/enums). |
| **Type Aliases** | `type UserId = Int` | `typealias` | `typealias` | Crespi supports type aliases for semantic clarity without runtime overhead. |
| **Immutability** | `let` (deep for collections) | `val` (shallow) | `let` (shallow) | Crespi enforces stricter immutability: `let`-bound collections cannot be mutated via `.push()`, `.pop()`, etc. |
| **Traits/Interfaces**| `trait` | `interface` | `protocol` | Crespi's `trait` is functionally equivalent to Kotlin interfaces and Swift protocols (supporting default implementations). |

## 4. Memory Management & Runtime

This is where the languages diverge most significantly.

| Feature | **Crespi** | **Kotlin** | **Swift** | Analysis |
| :--- | :--- | :--- | :--- | :--- |
| **Strategy** | RefCounting + Cycle Detection | Tracing GC (JVM/Native) | ARC (Manual Weak Refs) | Crespi occupies a middle ground: deterministic cleanup like Swift, but with automatic cycle handling unlike Swift. |
| **Cycle Handling** | **Automatic** (Mark-and-Sweep backup) | Automatic (Tracing GC) | **Manual** (`weak`, `unowned`) | Crespi relieves the developer from thinking about reference cycles, a common pain point in Swift. |
| **Runtime Overhead** | Moderate (Ref manipulation + Cycle check) | Variable (Stop-the-world potential) | Low (Deterministic, but hidden costs) | Crespi's runtime is lighter than a JVM but heavier than pure C++ due to the cycle detector. |
| **Backing** | LLVM (AOT) | JVM Bytecode / LLVM | LLVM | Crespi uses LLVM for native codegen. |

**Deep Dive: Crespi's GC approach**
Crespi implements a **Reference Counting** system augmented with a **Cycle Detector**. Every object header tracks its reference count. When a count hits zero, it is freed immediately (like Swift). However, to solve the "island of isolation" problem (A points to B, B points to A), Crespi's runtime periodically scans the heap (starting from roots) to detect and reclaim unreachable cyclic graphs. This allows Crespi to support closures and complex data structures without forcing the user to learn `weak` or `unowned` semantics.

## 5. Unique/Distinctive Features

*   **Language Packs (i18n)**: Crespi has built-in support for localized keywords (e.g., Spanish `si` instead of `if`), a feature absent in Kotlin and Swift.
*   **Internationalized Extension Targets**: Extensions in Crespi can target localized type aliases (e.g., `extension Texto { ... }` or `fn Entero.isOdd()`). This allows library authors to write APIs that feel native to the user's language.
*   **Dual Engine**: Crespi explicitly maintains parity between an Interpreter (for REPL/Web) and a Native Compiler. Kotlin has multiple backends but is primarily compiler-driven; Swift is natively compiled.
*   **Decorator System**: Crespi supports Python/JS-style decorators (`@memoize`) natively. Kotlin uses Annotations (`@Target`) which are metadata, whereas Crespi decorators can wrap behavior at runtime.
*   **Ad-Hoc Union Types**: `fn parse(x) -> Int | Error` is a first-class citizen in Crespi. Swift requires `enum` wrappers; Kotlin requires sealed classes or `Any`.
*   **Static Class Members**: Crespi supports `static` fields, methods, and initialization blocks within classes. Static blocks execute during class definition, enabling complex initialization logic.
*   **Extension Functions**: Beyond Swift-style `extension Type { ... }` blocks, Crespi also supports Kotlin-style inline extension functions via `fn Type.method()` syntax. These are automatically exposed as plain functions for library compatibility (dual-dispatch).

## 6. Missing Features (Gaps vs. Kotlin/Swift)

*   **Concurrency**: Kotlin has **Coroutines** (suspend functions), Swift has **Async/Await** (Actors). Crespi now has `async`/`await`, but still lacks a true concurrency runtime (scheduler, threads, or actors).
*   **Properties**: Kotlin and Swift have sophisticated property observers (`get`/`set`, `willSet`, `didSet`). Crespi has basic fields and methods.
*   **Advanced Generics**: Swift supports recursive protocol constraints and opaque types (`some View`). Crespi's generics are currently simpler, focusing on container parameterization.

## 6.1 Recently Added Features

The following features have been added to close gaps with Kotlin/Swift:

*   **`async`/`await` Syntax**: Async functions now return `Task` values, and `await` unwraps them (eager execution; no scheduler yet).
*   **`fileprivate` Visibility**: Swift-style file-scoped visibility modifier now available (`fileprivate fn helper()`).
*   **Increment/Decrement Operators**: `i++` and `i--` as postfix statement-only operators (equivalent to `i += 1` and `i -= 1`).
*   **Generic Function Syntax**: Type parameters now come after `fn`: `fn [T] identity(x: T) -> T` (instead of `fn identity[T]()`).
*   **Primary Constructor Property Modifiers**: Explicit `var`/`let` required for constructor parameters to become properties: `class Point(let x: Int, var y: Int)`. Parameters without modifiers are constructor-only arguments.
*   **Extension Function Types**: Lambda parameter types can specify a receiver: `fn apply(block: String.() -> Int)` and `fn map(transform: T.(Int) -> U)`.

## 7. Compiler Optimization Roadmap

### Current State
Crespi's compiler (`crespi-llvm`) lowers High-Level IR (HIR) to LLVM IR. The HIR optimizer still handles constant folding, dead code elimination, and inlining (`-O1/-O2`), while LLVM's pass pipeline will provide low-level optimizations (instruction selection, register allocation, scheduling).

### Lessons from Kotlin & Swift
*   **Swift's SIL (Swift Intermediate Language)**: Swift uses a high-level IR to perform domain-specific optimizations *before* lowering to LLVM. Key optimizations include:
    *   **Definite Initialization**: Ensuring all variables are initialized before use (Crespi does this in the resolver, but could be more robust).
    *   **ARC Optimization**: Removing redundant retain/release pairs. Crespi's cycle detector could benefit from static analysis to elide refcounting for stack-local variables.
    *   **Generic Specialization**: Creating specialized versions of generic functions for specific types to avoid boxing overhead.
*   **Kotlin's Inline Functions**: Kotlin aggressively inlines lambdas to avoid allocation overhead. This is crucial for higher-order functions like `map` and `filter`.

### Recommended Improvements for Crespi
1.  **HIR Optimization Pass**: Introduce or expand transformation passes on the HIR *before* LLVM lowering.
    *   **Constant Folding**: Pre-calculate constant expressions (e.g., `1 + 2` -> `3`).
    *   **Dead Code Elimination**: Remove unreachable branches early.
2.  **Inlining Support**: Implement an `@inline` decorator and logic to substitute function bodies at call sites, specifically for closures used in control flow.
3.  **Specialized Generics**: currently, Crespi generics are duck-typed/erased. Generating specialized machine code for `List[Int]` vs `List[Float]` would significantly improve numeric performance.
4.  **Escape Analysis**: Analyze closure captures to allocate environments on the stack instead of the heap when they don't escape the function scope.

## 8. Generics & Metaprogramming

### Generics
*   **Swift**: Highly sophisticated system with conditional conformances (e.g., `Array<T>` is `Equatable` only if `T` is `Equatable`), recursive protocol constraints, and opaque types (`some View`). Generics are reified at runtime or specialized at compile time.
*   **Kotlin**: Supports reified type parameters only in inline functions. Standard generics are erased at runtime (similar to Java), but the frontend (FIR) performs advanced flow-sensitive typing (smart casts).
*   **Crespi**: Currently uses a "duck-typed" generics system. `List[T]` is syntactically parsed, but `T` is effectively `Any` at runtime. The compiler does not yet generate specialized machine code for `List[Int]` vs `List[String]`.

### Metaprogramming
*   **Swift**: Macros (compiler plugins) allow syntactic transformations at compile time. Property wrappers (`@State`, `@Published`) provide behavior injection for fields.
*   **Kotlin**: Compiler plugins (KSP/Kapt) allow code generation. Delegated properties (`by lazy`) provide a mechanism similar to Swift's property wrappers but are part of the language core.
*   **Crespi**: Supports **Decorators** (`@memoize`) which are applied at *runtime* in the interpreter and lowered to wrappers in the compiler. This is closer to Python's dynamic decorators than Swift's macros.

## 9. Concurrency

This is the most significant functional gap between Crespi and its peers.

*   **Swift**: **Structured Concurrency**. First-class `async`/`await` syntax, `Task` groups, and **Actors** for data isolation. The runtime manages a thread pool, and the compiler enforces thread safety via `Sendable` checks.
*   **Kotlin**: **Coroutines**. Lightweight threads (suspend functions) that multiplex over system threads. Supports `async`/`await patterns and `Flow` for streams.
*   **Crespi**: **Eager async/await (single-threaded)**.
    *   **Current State**: `async`/`await` is available, but async functions execute immediately and return completed `Task` values. There is still no scheduler, threads, or actors.
    *   **Runtime Hooks**: The GC implementation (`gc.rs`) mentions "atomic reference counting hooks" for future threading support, but the current `GcContext` is fundamentally single-threaded.

## 10. Error Handling & Diagnostics

| Feature | **Crespi** | **Kotlin** | **Swift** | Analysis |
| :--- | :--- | :--- | :--- | :--- |
| **Paradigm** | Union Types / Result | Unchecked Exceptions | `throws` / `try` (Result-like) | Crespi treats errors as values, whereas Kotlin/Swift use more traditional exception models (though Swift's is technically a typed Result sugar). |
| **Syntax** | `Int \| Error` | `throw Exception()` | `throw Error`, `try` | Crespi avoids the "hidden control flow" of exceptions by making errors part of the return type. |
| **Diagnostics** | i18n-aware (Fluent) | English-centric | English-centric | Crespi is uniquely designed to provide compiler errors in the user's native language. |

## 11. FFI & Interoperability

*   **Swift**: **Clang Importer**. Swift can directly import C and Objective-C headers. The compiler automatically maps C types to Swift types.
*   **Kotlin**: **cinterop (Native)** / **JNI (JVM)**. Kotlin/Native uses a tool to generate "interop klibs" from C headers.
*   **Crespi**: **Native Runtime Registry + Marshaling Traits**.
    *   **Runtime Registry**: Crespi supports calling Rust-defined functions via a `NativeFn` registry in the runtime (`crespi-runtime`). These functions must follow the `extern "C"` ABI.
    *   **Marshaling Layer**: The `crespi-ffi` crate provides `FromCrespi` and `ToCrespi` traits for automatic type conversion between Crespi values and Rust types. Supported types include primitives (`i32`, `i64`, `f64`, `bool`, `String`), collections (`Vec<T>`, `HashMap<String, T>`), and `Option<T>`.
    *   **Native Function Signature**: `extern "C" fn(&mut GcContext, *const CrespiValue, usize) -> CrespiValue`
    *   **Automation**: Unlike Swift/Kotlin, Crespi does not yet have a tool to auto-generate bindings from `.h` files. However, the marshaling traits significantly reduce boilerplate for common use cases.

## 12. Ecosystem & Tooling

*   **Swift**: **Swift Package Manager (SPM)**. Integrated into the compiler. Highly mature ecosystem centered around Apple platforms but expanding to Server/Linux.
*   **Kotlin**: **Gradle**. Extremely powerful but complex build system. Multiplatform (KMP) support is a major strength.
*   **Crespi**: **Early Stage**.
    *   **Build System**: Currently relies on `cargo` (for the compiler itself) and simple shell scripts for project management. No native "Crespi Package Manager" yet.
    *   **Standard Library**: 60+ built-in functions compiled as a separate static library (`crespi-builtins`), including math, string manipulation, functional collection methods, and I/O. All functions have English and Spanish aliases.
    *   **Tooling**: Strong VSCode integration via a dedicated LSP in a separate repository (`crespi-ide-support`), providing hover, go-to-definition, completions, and diagnostic support.
    *   **Web**: First-class WASM support allows the interpreter to run directly in browsers with full IntelliSense (via `crespi-wasm` repo).

## 13. Reflection & Introspection

*   **Swift**: **Mirror API**. Provides read-only introspection of types and values. Swift also has strong compile-time type information but limited runtime manipulation compared to Java.
*   **Kotlin**: **Full Reflection**. Built on JVM reflection, providing deep access to properties, methods, and annotations at runtime.
*   **Crespi**: **Basic Introspection**.
    *   **Built-in**: `typeof(x)` returns a string representation of the type.
*   **Dynamic**: Crespi is dynamic by default; the optional checker adds static guarantees without changing the runtime model. It still lacks a formal "Reflection" library for modifying behavior at runtime.

## 14. Type System Nuances

### Variance (Generics)
*   **Kotlin**: **Declaration-site variance** (`out`/`in` keywords).
*   **Swift**: Uses generics without explicit variance keywords but handles it through subtyping and protocol requirements.
*   **Crespi**: **Implicit/Erased**. Crespi does not currently enforce variance. Generics are closer to "syntax sugar" for the type checker, and the runtime treats them as `Any`.

### Enums vs. Union Types
*   **Kotlin/Swift**: Heavy reliance on **Enums** (Sum Types) for modeling state and errors.
*   **Crespi**: Reliance on **Ad-hoc Union Types** (`A | B`). Crespi does not have a formal `enum` keyword; it achieves the same goals through union types and class hierarchies.

## 15. Target Platforms & Portability

| Platform | **Crespi** | **Kotlin** | **Swift** |
| :--- | :--- | :--- | :--- |
| **Mobile (iOS/Android)**| No (Planned) | **Primary** (KMP) | **Primary** (iOS) |
| **Web (Browser)** | **Yes** (External Repo) | Yes (JS/WASM) | Experimental (WASM) |
| **Server/Desktop** | **Yes** (Native) | **Primary** (JVM) | **Primary** (Linux/macOS) |
| **Embedded** | No | Yes (Native) | Yes (Embedded Swift) |

## 16. Philosophy & Design Goals

*   **Swift**: "Safe, Fast, Expressive." Focuses on performance (LLVM), safety (ARC/Exclusivity), and ABI stability.
*   **Kotlin**: "Pragmatic, Concise, Safe." Focuses on interoperability (JVM), developer productivity, and multiplatform sharing.
*   **Crespi**: **"Accessible, Modern, Consistent."**
    *   **i18n first**: Breaking the "English-only" barrier of programming.
    *   **Dual Engine**: Providing the same language experience for both high-speed native execution and low-overhead scripting/web use.
    *   **Hybrid Safety**: Merging the structural safety of Swift (`guard`, strict init) with the ergonomic flexibility of Kotlin.

## Summary

**Crespi** positions itself as a "best-of-breed" language:

1.  **Ergonomics**: It takes the concise `fn` and `let` from functional languages (Rust/Swift).
2.  **Structure**: It adopts Kotlin's primary constructors and `when` expression.
3.  **Safety**: It adopts Swift's `guard` and strict initialization, but automates memory management further than Swift by handling cycles.
4.  **Innovation**: It adds native **Union Types**, **Language Packs**, and **Internationalized Extensions**, differentiating it from its predecessors.

Crespi is less mature regarding concurrency and memory model tooling compared to the battle-tested JVM (Kotlin) or ARC (Swift) ecosystems, but its syntax is a modern, cohesive blend of both.
