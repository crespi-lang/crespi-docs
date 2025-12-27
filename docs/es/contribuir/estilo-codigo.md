# Guía de Estilo de Código

> **Idioma:** Español | [English](../../en/contributing/code-style.md)

---

Esta guía cubre las convenciones de codificación para el proyecto Crespi.

## Código Rust

### Formateo

Usar `cargo fmt` para formateo automático. El proyecto usa la configuración por defecto de rustfmt.

```bash
cd lang
cargo fmt
```

### Linting

Todo el código debe pasar Clippy con warnings como errores:

```bash
cargo clippy --workspace --all-targets -- -D warnings
```

### Convenciones de Nombres

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Crates | `kebab-case` | `crespi-core` |
| Módulos | `snake_case` | `value_system` |
| Tipos | `PascalCase` | `CrespiValue` |
| Funciones | `snake_case` | `parse_expression` |
| Constantes | `SCREAMING_SNAKE_CASE` | `MAX_STACK_SIZE` |
| Variables | `snake_case` | `token_count` |

### Documentación

Documentar elementos públicos con comentarios `///`:

```rust
/// Parsea una expresión del stream de tokens.
///
/// # Argumentos
///
/// * `tokens` - El iterador de tokens
///
/// # Retorna
///
/// El nodo AST de expresión parseado, o un error.
pub fn parse_expression(tokens: &mut TokenStream) -> Result<Expr, ParseError> {
    // ...
}
```

### Manejo de Errores

- Usar `Result` para errores recuperables
- Usar operador `?` para propagación
- Crear tipos de error específicos para cada módulo
- Incluir contexto en mensajes de error

```rust
// Bueno: Error específico con contexto
Err(ParseError::UnexpectedToken {
    expected: "identifier",
    found: token.kind,
    span: token.span,
})

// Evitar: Errores de string genéricos
Err("unexpected token".into())
```

### Organización de Módulos

```rust
// 1. Imports (agrupados y ordenados)
use std::collections::HashMap;
use std::rc::Rc;

use crate::parser::Expr;
use crate::value::Value;

// 2. Constantes
const MAX_RECURSION: usize = 1000;

// 3. Tipos (structs, enums)
pub struct Interpreter { ... }

// 4. Implementaciones
impl Interpreter { ... }

// 5. Funciones
pub fn evaluate(expr: &Expr) -> Value { ... }

// 6. Tests (al final)
#[cfg(test)]
mod tests { ... }
```

---

## Código Crespi (Ejemplos y Tests)

### Palabras Clave

Usar palabras clave en español en documentación española:

```crespi
// Bueno para docs en español
variable nombre = "Alicia"
tipo Persona(let nombre, let edad)
bloque saludar() { ... }

// Evitar en docs en español
var name = "Alicia"
class Person(let name, let age)
fn greet() { ... }
```

Los ejemplos en inglés pertenecen solo a la documentación en inglés.

### Nombres de Funciones

Usar **camelCase** para nombres de funciones y métodos:

```crespi
// Bueno
bloque obtenerValor() { ... }
bloque estaVacio() { ... }
bloque calcularTotal(items) { ... }

// Evitar
bloque obtener_valor() { ... }
bloque esta_vacio() { ... }
bloque calcular_total(items) { ... }
```

### Nombres de Clases

Usar **PascalCase** para nombres de clases:

```crespi
// Bueno
tipo Persona(let nombre, let edad)
tipo ClienteHttp(let urlBase)
tipo ListaEnlazada[T]()

// Evitar
tipo persona(let nombre, let edad)
tipo cliente_http(let urlBase)
```

### Formateo

- **Indentación**: 4 espacios
- **Llaves**: Misma línea que la declaración
- **Longitud de línea**: Razonable (sin límite estricto)

```crespi
tipo Rectangulo(let ancho, let alto) {
    bloque area() {
        resultado yo.ancho * yo.alto
    }

    bloque perimetro() {
        resultado 2 * (yo.ancho + yo.alto)
    }
}
```

---

## TypeScript/JavaScript (Web y Extensión)

### Formateo

Usar Prettier con la configuración del proyecto:

```bash
npm run format
```

### Linting

ESLint con configuración del proyecto:

```bash
npm run lint
```

### Nombres

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Variables | `camelCase` | `tokenCount` |
| Funciones | `camelCase` | `parseExpression` |
| Clases | `PascalCase` | `TokenParser` |
| Constantes | `SCREAMING_SNAKE_CASE` | `MAX_TOKENS` |
| Archivos | `kebab-case` | `token-parser.ts` |

### Componentes Svelte

- Usar runes de Svelte 5 (`$state`, `$derived`, `$effect`)
- Archivos de componentes usan PascalCase: `CodeEditor.svelte`

---

## Convenciones de Git

### Nombres de Ramas

```
feature/agregar-sentencia-guard
fix/crash-parser-entrada-vacia
docs/actualizar-arquitectura
refactor/simplificar-evaluador
```

### Mensajes de Commit

Formato:
```
<tipo>: <descripción corta>

<cuerpo opcional con detalles>
```

Tipos:
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Documentación
- `refactor`: Reestructuración de código
- `test`: Agregar tests
- `chore`: Tareas de mantenimiento

Ejemplos:
```
feat: Agregar soporte para sentencia guard

- Implementar palabra clave guard para retornos tempranos
- Soportar pattern matching en condiciones guard
- Agregar 5 casos de test

fix: Prevenir stack overflow en llamadas recursivas

El intérprete ahora detecta recursión profunda y
retorna un error claro en lugar de crashear.

docs: Actualizar diagramas de arquitectura
```

---

## Hooks Pre-commit

El proyecto usa hooks pre-commit que se ejecutan automáticamente:

1. **Formateo Rust** (`cargo fmt`)
2. **Linting Rust** (`cargo clippy`)
3. **Formateo web** (`prettier`)
4. **Linting web** (`eslint`)
5. **Formateo extensión** (`prettier`)
6. **Linting extensión** (`eslint`)

Si un hook falla, corregir los problemas antes de hacer commit.

---

## Ver También

- [Guía de Contribución](CONTRIBUTING.md)
- [Visión General de la Arquitectura](../arquitectura/general.md)
