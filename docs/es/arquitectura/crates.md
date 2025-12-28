# Estructura de Crates

> **Idioma:** Español | [English](../../en/architecture/crates.md)

---

El lenguaje Crespi está organizado como un workspace de Cargo con crates especializados para diferentes responsabilidades.

## Grafo de Dependencias de Crates

```
                    ┌─────────────┐
                    │ crespi-cli  │  (Binarios: crespi, crespic)
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
      ┌─────────────┐ ┌─────────┐ ┌─────────────┐
      │ crespi-llvm │ │ crespi- │ │crespi-rust- │
      │             │ │  core   │ │    ffi      │
      └──────┬──────┘ └────┬────┘ └─────────────┘
             │             │
             ▼             │
      ┌─────────────┐      │
      │  crespi-hir │      │
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
            (Crates de soporte para internacionalización)

      ┌─────────────┐  ┌─────────────┐
      │  crespi-lsp │  │crespi-lsp-  │
      │  (binario)  │  │    core     │
      └─────────────┘  └─────────────┘
            (Crates del Protocolo de Servidor de Lenguaje)
```

---

## Crates Principales

### crespi-core

**El corazón de la implementación del lenguaje.**

| Módulo | Propósito |
|--------|-----------|
| `lexer/scanner.rs` | Tokenización con Inserción Automática de Punto y Coma (ASI) |
| `lexer/token.rs` | Tipos de token, mapeo de palabras clave (inglés primario, español alias) |
| `parser/parser.rs` | Parser de descenso recursivo con precedencia ascendente |
| `parser/ast.rs` | Tipos AST (Stmt, Expr) con Span para ubicación de errores |
| `interpreter/eval.rs` | Intérprete tree-walking |
| `interpreter/environment.rs` | Ámbito léxico con `Rc<RefCell<Environment>>` |
| `interpreter/builtins.rs` | 60 funciones integradas |
| `interpreter/value.rs` | Valores del runtime del intérprete (basados en Rc) |
| `module/` | Sistema de módulos para compilación multi-archivo |

**Características principales:**
- Parsing e interpretación completa del lenguaje
- Soporte para métodos de extensión
- Genéricos (duck-typed)
- Resolución de módulos multi-archivo

---

### crespi-hir

**HIR (Representación Intermedia de Alto Nivel) - reducción y optimización compartidas por backends.**

| Módulo | Propósito |
|--------|-----------|
| `hir.rs` | Tipos de IR de alto nivel entre AST y el backend |
| `lowering.rs` | Conversión AST → HIR, resolución de variables, análisis de closures |
| `optimizer.rs` | Pasadas de optimización sobre HIR (constant folding, DCE, inlining) |

**Pipeline de compilación:**
```
AST → HIR (reducción) → [Optimizador]
```

**Responsabilidades principales:**
- Análisis de variables libres para closures
- Traducción de nombres de builtins español → inglés
- Metadatos de contexto GC
- Validación de firma de punto de entrada

---

### crespi-llvm

**Generación de código nativo vía LLVM (Inkwell).**

| Módulo | Propósito |
|--------|-----------|
| `compiler.rs` | Traducción HIR → LLVM IR, emisión de código objeto |
| `types.rs` | Mapeo de tipos y firmas Crespi → LLVM |
| `passes.rs` | Pipeline de optimización LLVM |

**Pipeline de compilación:**
```
AST → HIR (reducción) → LLVM IR → Código Nativo
```

---

### crespi-runtime

**Biblioteca de soporte en tiempo de ejecución para programas compilados.**

| Módulo | Propósito |
|--------|-----------|
| `value.rs` | Representación con etiquetas (tag + payload) usada por LLVM |
| `gc.rs` | Conteo de referencias con detección de ciclos |
| `builtins.rs` | Funciones integradas compatibles con C |

**Convención de llamada:**
- Todas las funciones reciben `gc_ctx: *mut GcContext` como primer parámetro oculto
- El punto de entrada crea el contexto GC, lo pasa a todas las llamadas, lo destruye al salir

Ver `docs/llvm/abi.md` para la ABI actual.

---

### crespi-ffi

**Capa de Interfaz de Funciones Foráneas.**

Facilita la interoperabilidad entre Crespi y otros lenguajes (principalmente Rust, extensible a C).

| Módulo | Propósito |
|--------|-----------|
| `marshal.rs` | Marshaling de datos entre valores Crespi y tipos del host |
| `lib.rs` | Utilidades para definir `NativeFn` y contextos FFI |

**Características principales:**
- Marshaling seguro de primitivos (`i32`, `f64`, `bool`, `String`)
- Traits `FromCrespi` y `ToCrespi`
- Firmas de función compatibles con C-ABI

---

### crespi-tokio

**Crate auxiliar de Tokio para Crespi.**

Proporciona un wrapper bloqueante sobre Tokio pensado para uso vía FFI de Crespi (helpers de sleep, utilidades simples de race/join, y un wrapper de `Runtime`).

---

### crespi-builtins

**Bindings Nativos de la Biblioteca Estándar.**

Contiene las funciones wrapper nativas para la biblioteca estándar, uniendo la capa FFI con la implementación del runtime.

| Módulo | Propósito |
|--------|-----------|
| `lib.rs` | Registro de funciones integradas (print, math, string ops) |

---

### crespi-cli

**Interfaz de línea de comandos para intérprete y compilador.**

| Binario | Propósito |
|---------|-----------|
| `crespi` | Intérprete con REPL |
| `crespic` | Compilador nativo |

**Modos de depuración:**
- `crespi hir <archivo>` - Mostrar representación HIR
- `crespi llvm <archivo>` - Mostrar LLVM IR

---

### crespi-rust-ffi

**Biblioteca de generación de bindings FFI para Rust.**

Implementa la lógica para analizar proyectos Rust, extraer metadatos de API vía `rustdoc`, y generar bindings FFI. Usado tanto por el compilador (`crespic`) para enlazado automático como por la herramienta independiente `crespi-bindgen`.

---

### crespi-bindgen

**Generador de bindings FFI independiente.**

Una herramienta CLI que genera bindings de Crespi para bibliotecas Rust.
- Analiza la salida JSON de `rustdoc`
- Genera código wrapper FFI en Rust
- Compila todo en una biblioteca estática
- Embebe los fuentes de `crespi-ffi` y `crespi-runtime` para ser autocontenido

---

### cargo-crespi

**Subcomando de Cargo para proyectos Crespi.**

Proporciona los comandos `cargo crespi build`, `cargo crespi run`, y `cargo crespi check` para proyectos Crespi basados en Cargo con integración FFI de Rust.

---

## Crates LSP

### crespi-lsp

**Binario del Protocolo de Servidor de Lenguaje.**

El servidor LSP binario que proporciona soporte IDE vía el Protocolo de Servidor de Lenguaje. Usa `tower-lsp` para la implementación del protocolo.

**Características:**
- Diagnósticos (errores de sintaxis, errores de tipos)
- Ir a definición
- Información al pasar el cursor (hover)
- Autocompletado

---

### crespi-lsp-core

**Biblioteca core de análisis LSP.**

Infraestructura de análisis reutilizable para características IDE. Separada del binario para permitir:
- Servidor LSP nativo (`crespi-lsp`)
- Bindings WASM para entornos web (`crespi-wasm`)

| Módulo | Propósito |
|--------|-----------|
| `analysis.rs` | Análisis de documentos y caché |
| `symbol_table.rs` | Resolución y búsqueda de símbolos |
| `visitor.rs` | Visitor AST para análisis |
| `position.rs` | Utilidades de posición en código fuente |

---

## Crate WASM

### crespi-wasm

**Bindings WebAssembly para ejecución en navegador.**

Proporciona bindings WASM para ejecutar Crespi en entornos web. Usado por la plataforma `crespi-learn` para tutoriales y desafíos interactivos.

**Características:**
- Ejecución del intérprete en navegador
- Características tipo LSP vía `crespi-lsp-core`
- Diagnósticos y autocompletado para editores web

---

## Crates de Soporte

### crespi-i18n

**Infraestructura de internacionalización.**

Proporciona soporte completo de localización para el lenguaje Crespi:

| Componente | Propósito |
|------------|-----------|
| `langpack.rs` | Carga paquetes `.crespilang` para alias de palabras clave/builtins/operadores/tipos |
| `bundle.rs` | Bundle de traducciones basado en FTL usando Mozilla Fluent |
| `locale.rs` | Detección y gestión de locale (locale del sistema, variable `CRESPI_LANG`) |
| `locales/en/*.ftl` | Traducciones en inglés |
| `locales/es/*.ftl` | Traducciones en español |

**Cobertura de traducciones:**
- ✅ Errores y etiquetas del parser
- ✅ Errores y etiquetas del runtime
- ✅ Errores del lexer
- ✅ Errores del sistema de módulos (no encontrado, dependencia circular, símbolo no encontrado)
- ✅ Envoltorios de errores principales (sintaxis, léxico, ejecución)
- ✅ Cadenas de contexto del parser (nombre de variable, nombre de función, etc.)
- ✅ Mensajes del CLI
- ✅ Errores de funciones integradas

**Uso:**
```rust
use crespi_i18n::{t, tr};

// Traducción simple
let msg = t("label-here");

// Traducción con argumentos
let msg = tr!("runtime-undefined-variable", name = var_name);
```

---

### crespi-langpack

**Herramientas de paquetes de idioma.**

CLI para validar, generar y comparar paquetes de idioma contra `crespi-schema`.
Los packs viven en `crespi-i18n/packs/`.

---

### crespi-schema

**Esquema de paquetes de idioma.**

Define los enums canónicos para palabras clave, builtins, tipos en tiempo de ejecución y alias de operadores usados por los packs y la validación.

---

## Repositorios Externos

### crespi-docs

**Sitio web de documentación.**
Vive en [crespi-docs](https://github.com/crespi-lang/crespi-docs).

### crespi-ide-support

**Extensión VS Code.**
Vive en [crespi-ide-support](https://github.com/crespi-lang/crespi-ide-support).

---

## Compilación

```bash
# Compilar todos los crates
cargo build

# Compilación release (optimizada)
cargo build --release

# Ejecutar tests
cargo test

# Test de crate específico
cargo test -p crespi-core
```

---

## Ver También

- [Visión General de la Arquitectura](general.md)
