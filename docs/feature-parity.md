# Feature Parity (Interpreter vs Compiler)

This document tracks which Crespi language features are available in the interpreter and in the native compiler. It is intentionally short and practical, so it can guide gap-fixing work.

Legend: **Yes** = implemented, **Partial** = implemented but incomplete or missing checks, **No** = not supported.

## Core Language Features

| Feature | Interpreter | Compiler | Notes |
| --- | --- | --- | --- |
| Variables and constants | Yes | Yes | `var`, `let`; `let` enforces immutability for collections |
| Control flow | Yes | Yes | `if/else`, `while`, `for/in`, `break`, `continue`, `guard`, `when` |
| Functions | Yes | Yes | Named, default params, single-expression syntax |
| Async/await | Yes | Yes | Eager `Task` values; no scheduler yet |
| Lambdas and closures | Yes | Yes | Capture works |
| Classes and constructors | Yes | Yes | Primary (with `var`/`let` modifiers) + secondary constructors |
| Inheritance | Yes | Yes | `:` syntax |
| Operator overloading | Yes | Yes | All operators in the reference |
| Extensions | Yes | Yes | Swift-style extensions |
| Extension trait conformance | Yes | Yes | Default methods applied; conflicts error |
| Generics (duck-typed) | Yes | Yes | `fn [T] name()` syntax for functions; `Class[T]` for classes |
| Pattern matching (`when`) | Yes | Yes | With `default` |
| Built-in functions (61) | Yes | Yes | Unified registry |
| Top-level code | Yes | Yes | Compiler synthesizes `main()` |
| Language packs (keywords/builtins) | Yes | Yes | Normalized in the lexer |
| Traits | Yes | Yes | Conformance checks + default methods applied in interpreter/compiler |
| Multi-file imports | Yes | Yes | Module loading + explicit symbol lists supported |
| Decorators | Yes | Yes | Applied at runtime; functions/classes only |
| Nested classes | Yes | Yes | `nested` for static, `inner` for outer instance (`__outer`; `o.Inner()` now lowers via runtime helper) |
| Assignment as expression | No | No | Statements only (by design) |

## Syntax and Ergonomics

| Feature | Interpreter | Compiler | Notes |
| --- | --- | --- | --- |
| String interpolation | Yes | Yes | `$name` and `${expr}` |
| Raw/triple-quoted strings | Yes | Yes | Multiline literals |
| Null coalescing | Yes | Yes | `??` |
| Ternary operator | Yes | Yes | `cond ? a : b` |
| Automatic semicolon insertion | Yes | Yes | Lexer inserts semicolons on line breaks |
| Visibility modifiers | Yes | Yes | `public` default; `internal` = same directory; `private` = same file; `fileprivate` = file-scoped |
| Type annotations (syntax) | Yes | Yes | Parsed on vars/params/returns |
| Type checker (optional) | Partial | Partial | Separate pass; opt-in via `--check` |
| Qualified imports | Yes | Yes | `import`, `import Module { symbols }`, `import fn`, `import class` |

## Operators and Expressions

| Feature | Interpreter | Compiler | Notes |
| --- | --- | --- | --- |
| Arithmetic operators | Yes | Yes | `+`, `-`, `*`, `/`, `%` |
| Comparison operators | Yes | Yes | `<`, `>`, `<=`, `>=` |
| Equality operators | Yes | Yes | `==`, `!=` |
| Logical operators | Yes | Yes | `&&` (AND), `||` (OR) |
| Bitwise operators | Yes | Yes | `&`, `|`, `^`, `<<`, `>>`, `~` |
| Unary operators | Yes | Yes | `-`, `!`, `~` |
| Membership tests | Yes | Yes | `value in collection` |
| Compound assignment | Yes | Yes | `+=`, `-=`, `*=`, `/=`; also `i++`, `i--` as statements |
| Indexing and assignment | Yes | Yes | `obj[i]`, `obj[i] = v` |
| Property access | Yes | Yes | `obj.field`, `obj.method()` |
| Function calls | Yes | Yes | `f(x)` and `operator invoke` |

## Data Types and Literals

| Feature | Interpreter | Compiler | Notes |
| --- | --- | --- | --- |
| Integers, floats, booleans, null | Yes | Yes | `int`, `float`, `bool`, `null` |
| Strings | Yes | Yes | UTF-8 text values |
| Lists | Yes | Yes | Literals, indexing, iteration |
| Dictionaries | Yes | Yes | Text-keyed maps |
| Tuples | Yes | Yes | Tuple literals `(a, b)` |
| Class instances | Yes | Yes | Constructed by calling the class |
| Pattern destructuring | Yes | Yes | Lists/dicts/classes inside `when` |

## Functional and Runtime Behavior

| Feature | Interpreter | Compiler | Notes |
| --- | --- | --- | --- |
| Higher-order functions | Yes | Yes | Functions as values; extension function types (`String.() -> Int`) |
| Memoization | Yes | Yes | `@memoize` and `memoize()` |
| Tail-call optimization | Yes | Yes | Tail recursion optimized |
| String/list/collection helpers | Yes | Yes | Built-in functions (map/filter/etc.) |

## Modules and Resolution

| Feature | Interpreter | Compiler | Notes |
| --- | --- | --- | --- |
| Module imports | Yes | Yes | `import Foo.Bar` with optional `{ symbols }` |
| Symbol-specific imports | Yes | Yes | `import fn`, `import class`, `import Module { symbols }` |
| Module path resolution | Yes | Yes | Relative, root, and `-I` paths; snake_case → PascalCase |
| Module cycles | Yes | Yes | Tarjan SCC detection for init cycles |

## Visibility Enforcement & LSP Integration

Crespi ensures that `public`, `internal`, and `private` declarations behave the same no matter whether code runs through the interpreter, the native compiler, or the language server.

- The interpreter now runs `MultiFileInterpreter::type_check_modules` during module loading so visibility failures are reported before execution rather than at runtime. `MultiFileInterpreter` builds a per-module visibility map and resolves imports with the same `internal`/`private` rules exposed to the static type checker, keeping the REPL and scripts consistent with the compiled path.
- The compiler's module namespace builder mirrors the interpreter's visibility map; HIR lowering (`crespi-codegen::lowering`) filters symbol exports using the same `Visibility` helpers before emitting imports, and the LLVM backend/runtime enforces the resulting APIs during execution.
- The external Language Server ([crespi-ide-support](https://github.com/crespi-lang/crespi-ide-support)) uses the same visibility rules to ensure that hover, completion, and go-to-definition only surface symbols that are visible from the import site.
- Tests cover interpreter and compiler layers: `lang/crates/crespi-core/tests/module_imports.rs` validates interpreter visibility enforcement (public/internal/private imports), and `lang/crates/crespi-codegen` has parity tests for compiler visibility errors.

## Type System (Optional)

| Feature | Interpreter | Compiler | Notes |
| --- | --- | --- | --- |
| Type annotations | Yes | Yes | Variables, params, returns |
| Type inference | Partial | Partial | HM-style inference pass; optional, not default |
| Nullable types | Partial | Partial | `T?` sugar for `T | Null` in checker |
| Union types | Partial | Partial | `T | U` in checker |
| Type constraints | Partial | Partial | Numeric/Comparable/Equatable constraints |
| Inheritance-aware assignability | Partial | Partial | Subclass checks in type checker |

## Tooling and Platform

| Feature | Interpreter | Compiler | Notes |
| --- | --- | --- | --- |
| CLI REPL | Yes | No | Interpreter-only REPL and file runner |
| VSCode extension | Yes | Yes | External ([crespi-ide-support](https://github.com/crespi-lang/crespi-ide-support) repo) |
| LSP diagnostics | Partial (visibility-aware) | Partial (visibility-aware) | External ([crespi-ide-support](https://github.com/crespi-lang/crespi-ide-support) repo). Supports diagnostics, hover, go-to-definition, and completions. |
| WASM execution (web) | Yes | No | External ([crespi-wasm](https://github.com/crespi-lang/crespi-wasm) repo) |
| Language packs | Yes | Yes | Built-in Spanish pack; validator supports custom packs |

## Notes and Known Gaps

- **Type checking**: optional; only run when explicitly requested (`--check`).
- **Concurrency runtime**: async/await tasks are eager today; no scheduler, threads, or actors yet.
- **Assignment expressions**: not supported (statements only, by design).

## Verification Checklist

These commands help validate the table above:

```bash
# Interpreter + compiler behavior parity for examples
./scripts/compare-outputs.sh
# Includes multi_file entrypoint examples.

# Core interpreter tests
cd lang
cargo test -p crespi-core

# Visibility enforcement and module imports (interpreter + compiler)
cargo test -p crespi-core module_imports
cargo test -p crespi-codegen --lib

# Language pack validation
cargo run -p crespi-langpack -- validate crates/crespi-i18n/packs/spanish.crespilang
```

## Work Items (Current Gaps)

- Assignment expressions (by design)

## Subsystem Coverage Matrix

Each layer—interpreter and compiler—now shares the same visibility predicate. This section maps the visibility story to the files/tests that keep the systems aligned.

### Interpreter Pipeline

- Entry point: `lang/crates/crespi-core/src/interpreter/multi_file.rs` (`MultiFileInterpreter::type_check_modules`, `module_visibility_map`, and `is_visible`) builds the per-module visibility map before execution.
- The REPL and script runner use the map for symbol lookup, so private/internal symbols raise errors before runtime.
- Coverage: `cargo test -p crespi-core module_imports` exercises public/internal/private imports and qualified access.

### Compiler Pipeline

- The lowering phase (`lang/crates/crespi-codegen/src/lowering.rs`) mirrors the interpreter visibility map when collecting namespace exports and resolving imports.
- Compiler visibility tests in `lang/crates/crespi-codegen/src/lib.rs` assert the same private/internal restrictions.
- Coverage: `cargo test -p crespi-codegen --lib` runs visibility-focused and namespace-resolution tests, ensuring runtime/compile-time agreement.

## Appendix: Full Feature Inventory

This appendix enumerates the full language surface to keep the parity table honest.

### Syntax Summary

- Declarations: `var`, `let`, `fn`, `async fn`, `class`, `trait`, `extension`, `import`, visibility modifiers (`public`, `private`, `internal`).
- Statements: `return`, `break`, `continue`, `if/else`, `while`, `for/in`, `guard`, `when`.
- Expressions: literals, arithmetic/comparison/logical ops, `?:`, `??`, `await`, calls, indexing, property access, lambdas (`=>`), assignment, class instantiation by call.
- Patterns: list `[a, b]`, dictionary `{"name": n}`, class destructuring `Person { name: n }`.

### Keywords (Canonical + Spanish Alias)

| Category | English | Spanish Alias | Notes |
| --- | --- | --- | --- |
| Declaration | `var` | `variable` | Mutable variable |
| Declaration | `let` | `immutable` | Immutable constant |
| Declaration | `public` | `publico` | Visibility modifier |
| Declaration | `private` | `privado` | Visibility modifier |
| Declaration | `internal` | `interno` | Visibility modifier |
| Functions | `fn` | `bloque` | Function declaration |
| Functions | `async` | `asincrono` | Async function modifier |
| Functions | `await` | `esperar` | Await task value |
| Functions | `return` | `resultado` | Return from function |
| Control | `if` | `si` | Conditional |
| Control | `else` | `o` | Conditional branch |
| Control | `while` | `mientras` | Loop |
| Control | `for` | `repetir` | For-each |
| Control | `in` | `en` | Membership / iteration |
| Control | `break` | `salir` | Exit loop |
| Control | `continue` | `continuar` | Next iteration |
| Control | `guard` | `asegura` | Guard clause |
| Control | `when` | `cuando` | Pattern matching |
| Control | `is` | `es` | `when` branch |
| Control | `default` | `defecto` | `when` fallback |
| OOP | `class` | `tipo` | Class declaration |
| OOP | `nested` | `anidado` | Nested class declaration |
| OOP | `inner` | `interno` | Inner class declaration |
| OOP | `trait` | `trait` | Trait declaration |
| OOP | `extends` | `extiende` | Reserved (use `:`) |
| OOP | `implements` | `implementa` | Reserved (use `:`) |
| OOP | `this` | `yo` | Current instance |
| OOP | `super` | `super` | Superclass |
| OOP | `operator` | `operador` | Operator overloads |
| Modules | `import` | `importar` | Imports |
| Modules | `extension` | `extension` | Type extensions |
| Literals | `true` | `verdadero` | Boolean literal |
| Literals | `false` | `falso` | Boolean literal |
| Literals | `null` / `nil` | `nada` | Null literal |
| Logical | `and` | `and` | Logical AND |
| Logical | `or` | `or` | Logical OR |

### Operators and Text Aliases

| Operator | Description | Spanish Alias |
| --- | --- | --- |
| `+` | Add | `mas` |
| `-` | Subtract | `menos` |
| `*` | Multiply | `por` |
| `/` | Divide | `entre` |
| `%` | Modulo | `modulo` |
| `<` | Less than | `menorQue` |
| `>` | Greater than | `mayorQue` |
| `<=` | Less or equal | `menorOIgual` |
| `>=` | Greater or equal | `mayorOIgual` |
| `==` | Equal | `igualA` |
| `!=` | Not equal | `diferenteDe` |
| `and` / `&&` | Logical AND | `and` |
| `or` / `||` | Logical OR | `or` |
| `??` | Null coalescing | (symbol only) |
| `?:` | Ternary | (symbol only) |

### Operator Overloads (Class Level)

Supported overloads: `+`, `-`, `*`, `/`, `%`, `==`, `!`, `negate`, `compare`, `not`, `increment`, `decrement`, `get`, `set`, `contains`, `invoke`.

### Built-in Functions (60)

Aliases in parentheses refer to the Spanish language pack or English aliases.

**I/O and type conversion**
- `print` (`mostrar`)
- `read` (`leer`)
- `typeof` (`tipo_de`, alias `type_of`)
- `str` (`texto`, alias `string`)
- `int` (`entero`)
- `float` (`decimal`)

**Collections (base)**
- `length` (`longitud`, alias `len`)
- `push` (`agregar`, alias `append`)
- `pop` (`quitar`)
- `keys` (`claves`)
- `values` (`valores`)
- `contains` (`contiene`)

**Memoization**
- `memoize` (`memorizar`)

**Strings**
- `split` (`dividir`)
- `trim` (`recortar`)
- `uppercase` (`mayusculas`)
- `lowercase` (`minusculas`)
- `substring` (`subcadena`)
- `replace` (`reemplazar`)
- `starts_with` (`empieza_con`)
- `ends_with` (`termina_con`)
- `index_of` (`indice_de`)
- `join` (`unir`)

**Collections (functional)**
- `map` (`mapear`)
- `filter` (`filtrar`)
- `reduce` (`reducir`)
- `sort` (`ordenar`)
- `reverse` (`invertir`)
- `slice` (`cortar`)
- `find` (`encontrar`)
- `every` (`cada`)
- `some` (`alguno`)
- `flatten` (`aplanar`)

**Math**
- `abs` (`absoluto`)
- `sign` (`signo`)
- `sqrt` (`raiz`)
- `cbrt` (`raiz_cubica`)
- `pow` (`potencia`)
- `round` (`redondear`)
- `floor` (`piso`)
- `ceil` (`techo`)
- `truncate` (`truncar`)
- `min` (`minimo`)
- `max` (`maximo`)
- `random` (`aleatorio`)
- `random_seed` (`semilla_aleatoria`)
- `sin` (`seno`)
- `cos` (`coseno`)
- `tan` (`tangente`)
- `asin` (`aseno`)
- `acos` (`acoseno`)
- `atan` (`atangente`)
- `atan2` (`atangente2`)
- `exp` (`exponencial`)
- `ln` (`logaritmo_natural`)
- `log10` (`logaritmo10`)
- `log2` (`logaritmo2`)
- `hypot` (`hipotenusa`)
- `PI` - Mathematical constant π (3.14159...)
- `E` - Euler's number e (2.71828...)

Notes:
- `PI` and `E` are constants (not functions). Use them directly: `print(PI)` or `var area = PI * r * r`

### Grammar Cheat Sheet (Canonical English)

Generated from `docs/en/reference/grammar.md`. Run `./scripts/update-feature-parity-grammar.sh` to refresh.

<!-- BEGIN GRAMMAR EXCERPT -->
```antlr
// Generated from docs/en/reference/grammar.md (parser rules only)
grammar Crespi;

// ===== Parser rules =====

program
  : statement* EOF
  ;

statement
  : declaration
  | ifStmt
  | whenStmt
  | whileStmt
  | forStmt
  | guardStmt
  | returnStmt
  | breakStmt
  | continueStmt
  | block
  | exprStmt
  ;

declaration
  : importDecl
  | decorator* visibility? (varDecl | letDecl | functionDecl | extensionFunctionDecl | classDecl | traitDecl)
  | extensionDecl
  ;

visibility
  : 'public' | 'private' | 'internal' | 'fileprivate'
  ;

decorator
  : '@' IDENTIFIER
  ;

varDecl
  : 'var' IDENTIFIER typeAnn? ('=' expression)? semi
  ;

letDecl
  : 'let' IDENTIFIER typeAnn? '=' expression semi
  ;

functionDecl
  : 'fn' IDENTIFIER typeParams? '(' parameters? ')' returnType? (block | '=' expression semi)
  ;

extensionFunctionDecl
  : 'fn' IDENTIFIER '.' IDENTIFIER typeParams? '(' parameters? ')' returnType? (block | '=' expression semi)
  ;

operatorDecl
  : 'operator' operatorName '(' parameters? ')' returnType? (block | '=' expression semi)
  ;

constructorDecl
  : 'constructor' '(' parameters? ')' (':' constructorDelegation)? block
  ;

constructorDelegation
  : 'this' '(' arguments? ')'
  | 'super' '(' arguments? ')'
  ;

classDecl
  : 'class' IDENTIFIER typeParams? ('(' parameters? ')')? (':' parents)? classBody?
  ;

parents
  : IDENTIFIER ('(' arguments? ')')? (',' IDENTIFIER)*
  ;

classBody
  : '{' classMember* '}'
  ;

classMember
  : functionDecl
  | operatorDecl
  | constructorDecl
  | varDecl
  | letDecl
  | staticMember
  ;

staticMember
  : 'static' functionDecl
  | 'static' varDecl
  | 'static' letDecl
  | 'static' block
  ;

traitDecl
  : 'trait' IDENTIFIER typeParams? (':' parents)? '{' traitMember* '}'
  ;

traitMember
  : 'fn' IDENTIFIER '(' parameters? ')' returnType? block?
  ;

extensionDecl
  : 'extension' IDENTIFIER (':' parents)? '{' extensionMember* '}'
  ;

extensionMember
  : functionDecl
  | operatorDecl
  ;

importDecl
  : 'import' importKind? modulePath importAlias? importSymbols? semi
  ;

importKind
  : 'fn' | 'class' | 'let' | 'var'
  ;

importAlias
  : 'as' IDENTIFIER
  ;

importSymbols
  : '{' importSymbol (',' importSymbol)* '}'
  ;

importSymbol
  : IDENTIFIER importAlias?
  ;

modulePath
  : IDENTIFIER ('.' IDENTIFIER)*
  ;

parameters
  : parameter (',' parameter)*
  ;

parameter
  : IDENTIFIER typeAnn? ('=' expression)?
  ;

typeParams
  : '[' typeParam (',' typeParam)* ']'
  ;

typeParam
  : IDENTIFIER (':' typeExpr)?
  ;

typeAnn
  : ':' typeExpr
  ;

returnType
  : '->' typeExpr
  ;

ifStmt
  : 'if' expression block ('else' (ifStmt | block))?
  ;

guardStmt
  : 'guard' (guardBind | expression) 'else' blockExpr semi?
  ;

guardBind
  : 'var' IDENTIFIER '=' expression
  ;

whenStmt
  : 'when' expression '{' whenCase* defaultCase? '}'
  ;

whenCase
  : 'is' pattern '=>' block
  ;

defaultCase
  : 'default' '=>' block
  ;

whileStmt
  : 'while' expression block
  ;

forStmt
  : 'for' IDENTIFIER 'in' expression block
  ;

returnStmt
  : 'return' expression? semi
  ;

breakStmt
  : 'break' semi
  ;

continueStmt
  : 'continue' semi
  ;

exprStmt
  : expression semi
  ;

block
  : '{' statement* '}'
  ;

blockExpr
  : '{' statement* blockExprTail? '}'
  ;

blockExprTail
  : 'return' expression?
  | expression
  ;

expression
  : assignment
  ;

assignment
  : conditional (assignmentOp assignment)?
  ;

assignmentOp
  : '=' | '+=' | '-=' | '*=' | '/='
  ;

conditional
  : ifExpr
  | coalesce ('?' expression ':' expression)?
  ;

ifExpr
  : 'if' expression blockExpr 'else' blockExpr
  ;

coalesce
  : logicalOr ('??' logicalOr)*
  ;

logicalOr
  : logicalAnd (('or' | '||') logicalAnd)*
  ;

logicalAnd
  : bitwiseOr (('and' | '&&') bitwiseOr)*
  ;

bitwiseOr
  : bitwiseXor ('|' bitwiseXor)*
  ;

bitwiseXor
  : bitwiseAnd ('^' bitwiseAnd)*
  ;

bitwiseAnd
  : equality ('&' bitwiseAnd)*
  ;

equality
  : comparison (('==' | '!=') comparison)*
  ;

comparison
  : shift (('<' | '<=' | '>' | '>=' | 'in') shift)*
  ;

shift
  : term (('<<' | '>>') term)*
  ;

term
  : factor (('+' | '-') factor)*
  ;

factor
  : unary (('*' | '/' | '%') unary)*
  ;

unary
  : ('!' | '-' | '~') unary
  | call
  ;

call
  : primary callSuffix*
  ;

callSuffix
  : '(' arguments? ')'
  | '.' IDENTIFIER
  | '[' expression ']'
  | '++'
  | '--'
  ;

arguments
  : expression (',' expression)*
  ;

primary
  : literal
  | IDENTIFIER
  | 'this'
  | 'super' '.' IDENTIFIER
  | lambdaExpr
  | tupleLiteral
  | '(' expression ')'
  | arrayLiteral
  | dictLiteral
  ;

lambdaExpr
  : IDENTIFIER '=>' lambdaBody
  | '(' parameters? ')' returnType? '=>' lambdaBody
  ;

lambdaBody
  : block
  | expression
  ;

tupleLiteral
  : '(' expression ',' (expression (',' expression)*)? ','? ')'
  ;

arrayLiteral
  : '[' (expression (',' expression)*)? ']'
  ;

dictLiteral
  : '{' (dictEntry (',' dictEntry)*)? '}'
  ;

dictEntry
  : (IDENTIFIER | STRING) ':' expression
  ;

pattern
  : '_'
  | IDENTIFIER patternClass?
  | literal
  | listPattern
  | dictPattern
  ;

patternClass
  : '{' patternField (',' patternField)* '}'
  ;

patternField
  : IDENTIFIER ':' pattern
  ;

listPattern
  : '[' (pattern (',' pattern)*)? ']'
  ;

dictPattern
  : '{' (patternEntry (',' patternEntry)*)? '}'
  ;

patternEntry
  : (IDENTIFIER | STRING) ':' pattern
  ;

operatorName
  : '+' | '-' | '*' | '/' | '%'
  | '==' | '!' | '<' | '<=>'
  | 'compare' | 'negate' | 'not'
  | 'increment' | 'decrement'
  | 'get' | 'set' | 'contains' | 'invoke'
  ;

typeExpr
  : unionType
  ;

unionType
  : nullableType ('|' nullableType)*
  ;

nullableType
  : primaryType '?'?
  ;

primaryType
  : arrayType
  | dictType
  | functionType
  | tupleType
  | namedType
  ;

namedType
  : IDENTIFIER ('[' typeExpr (',' typeExpr)* ']')? ('.' '(' parameters? ')' '->' typeExpr)?
  ;

arrayType
  : '[' typeExpr ']'
  ;

dictType
  : '{' typeExpr ':' typeExpr '}'
  ;

functionType
  : '(' typeExpr (',' typeExpr)* ')' '->' typeExpr
  ;

tupleType
  : '(' typeExpr (',' typeExpr)+ ')'
  ;

semi
  : ';'?
  ;

```
<!-- END GRAMMAR EXCERPT -->
