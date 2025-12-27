# Code Style Guide

> **Language:** [Español](../../es/contribuir/estilo-codigo.md) | English

---

This guide covers coding conventions for the Crespi project.

## Rust Code

### Formatting

Use `cargo fmt` for automatic formatting. The project uses default rustfmt settings.

```bash
cd lang
cargo fmt
```

### Linting

All code must pass Clippy with warnings as errors:

```bash
cargo clippy --workspace --all-targets -- -D warnings
```

### Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Crates | `kebab-case` | `crespi-core` |
| Modules | `snake_case` | `value_system` |
| Types | `PascalCase` | `CrespiValue` |
| Functions | `snake_case` | `parse_expression` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_STACK_SIZE` |
| Variables | `snake_case` | `token_count` |

### Documentation

Document public items with `///` doc comments:

```rust
/// Parses an expression from the token stream.
///
/// # Arguments
///
/// * `tokens` - The token iterator
///
/// # Returns
///
/// The parsed expression AST node, or an error.
pub fn parse_expression(tokens: &mut TokenStream) -> Result<Expr, ParseError> {
    // ...
}
```

### Error Handling

- Use `Result` for recoverable errors
- Use `?` operator for propagation
- Create specific error types for each module
- Include context in error messages

```rust
// Good: Specific error with context
Err(ParseError::UnexpectedToken {
    expected: "identifier",
    found: token.kind,
    span: token.span,
})

// Avoid: Generic string errors
Err("unexpected token".into())
```

### Module Organization

```rust
// 1. Imports (grouped and sorted)
use std::collections::HashMap;
use std::rc::Rc;

use crate::parser::Expr;
use crate::value::Value;

// 2. Constants
const MAX_RECURSION: usize = 1000;

// 3. Types (structs, enums)
pub struct Interpreter { ... }

// 4. Implementations
impl Interpreter { ... }

// 5. Functions
pub fn evaluate(expr: &Expr) -> Value { ... }

// 6. Tests (at bottom)
#[cfg(test)]
mod tests { ... }
```

---

## Crespi Code (Examples and Tests)

### Keywords

Use English keywords in documentation and examples:

```crespi
// Good
var name = "Alice"
class Person(let name, let age)
fn greet() { ... }

// Avoid in English docs
variable nombre = "Alice"
tipo Persona(let nombre, let edad)
bloque saludar() { ... }
```

Spanish examples belong in Spanish documentation only.

### Function Naming

Use **camelCase** for function and method names:

```crespi
// Good
fn getValue() { ... }
fn isEmpty() { ... }
fn calculateTotal(items) { ... }

// Avoid
fn get_value() { ... }
fn is_empty() { ... }
fn calculate_total(items) { ... }
```

### Class Naming

Use **PascalCase** for class names:

```crespi
// Good
class Person(let name, let age)
class HttpClient(let baseUrl)
class LinkedList[T]()

// Avoid
class person(let name, let age)
class http_client(let baseUrl)
```

### Formatting

- **Indentation**: 4 spaces
- **Braces**: Same line as declaration
- **Line length**: Reasonable (no strict limit)

```crespi
class Rectangle(let width, let height) {
    fn area() {
        return this.width * this.height
    }

    fn perimeter() {
        return 2 * (this.width + this.height)
    }
}
```

---

## TypeScript/JavaScript (Web & Extension)

### Formatting

Use Prettier with project configuration:

```bash
npm run format
```

### Linting

ESLint with project configuration:

```bash
npm run lint
```

### Naming

| Item | Convention | Example |
|------|------------|---------|
| Variables | `camelCase` | `tokenCount` |
| Functions | `camelCase` | `parseExpression` |
| Classes | `PascalCase` | `TokenParser` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_TOKENS` |
| Files | `kebab-case` | `token-parser.ts` |

### Svelte Components

- Use Svelte 5 runes (`$state`, `$derived`, `$effect`)
- Component files use PascalCase: `CodeEditor.svelte`

---

## Git Conventions

### Branch Names

```
feature/add-guard-statement
fix/parser-crash-on-empty-input
docs/update-architecture
refactor/simplify-evaluator
```

### Commit Messages

Format:
```
<type>: <short description>

<optional body with details>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat: Add guard statement support

- Implement guard keyword for early returns
- Support pattern matching in guard conditions
- Add 5 test cases

fix: Prevent stack overflow in recursive calls

The interpreter now detects deep recursion and
returns a clear error instead of crashing.

docs: Update architecture diagrams
```

---

## Pre-commit Hooks

The project uses pre-commit hooks that run automatically:

1. **Rust formatting** (`cargo fmt`)
2. **Rust linting** (`cargo clippy`)
3. **Web formatting** (`prettier`)
4. **Web linting** (`eslint`)
5. **Extension formatting** (`prettier`)
6. **Extension linting** (`eslint`)

If a hook fails, fix the issues before committing.

---

## See Also

- [Contributing Guide](CONTRIBUTING.md)
- [Architecture Overview](../architecture/overview.md)
