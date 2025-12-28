# Interoperabilidad con Rust

> **Idioma:** Español | [English](../../en/reference/rust-interop.md)

---

Crespi proporciona integración transparente con bibliotecas de Rust, permitiéndote aprovechar todo el ecosistema de Rust desde tus programas Crespi. Esto se logra a través de la herramienta `crespigen`, que genera automáticamente bindings FFI para cualquier crate de Rust.

## Descripción General

El sistema de interoperabilidad con Rust funciona de la siguiente manera:

1. Analiza la API pública de un crate de Rust usando rustdoc JSON
2. Genera funciones wrapper que sirven de puente entre el sistema de valores de Crespi y los tipos nativos de Rust
3. Produce un archivo facade de Crespi (`.crespi`) con definiciones de clases y funciones
4. Compila todo en una biblioteca estática que se enlaza con tu programa Crespi

## Inicio Rápido

### 1. Crear la Estructura del Proyecto

```
mi_proyecto/
├── main.crespi          # Tu programa Crespi
├── Cargo.toml           # Dependencias de Rust
└── src/
    └── lib.rs           # (Opcional) Tu código de biblioteca Rust
```

### 2. Configurar Cargo.toml

Para usar crates existentes de crates.io:

```toml
[package]
name = "mi_proyecto"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["rlib"]

[workspace]

[dependencies]
# Añade cualquier crate de Rust
regex = "1.10"
```

Para una biblioteca local:

```toml
[package]
name = "mi_lib_matematica"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["rlib"]

[workspace]
```

> **Nota:** La sección vacía `[workspace]` es necesaria para evitar problemas de herencia del workspace de Cargo.

### 3. Escribir Código Rust (Opcional)

Si estás creando tu propia biblioteca:

```rust
// src/lib.rs

/// Un punto 2D
#[derive(Clone)]
pub struct Punto {
    pub x: f64,
    pub y: f64,
}

impl Punto {
    pub fn new(x: f64, y: f64) -> Self {
        Punto { x, y }
    }

    pub fn distancia(&self, otro: &Punto) -> f64 {
        ((otro.x - self.x).powi(2) + (otro.y - self.y).powi(2)).sqrt()
    }
}

pub fn sumar(a: i64, b: i64) -> i64 {
    a + b
}

pub fn punto_medio(p1: &Punto, p2: &Punto) -> Punto {
    Punto {
        x: (p1.x + p2.x) / 2.0,
        y: (p1.y + p2.y) / 2.0,
    }
}
```

### 4. Generar Bindings

```bash
crespigen mi_proyecto/
```

Esto genera:
- `mi_proyecto/target/crespi-gen/bindings.crespi` - Archivo facade de Crespi
- `mi_proyecto/target/crespi-gen/target/release/lib_crespi_bindings.a` - Biblioteca estática

### 5. Usar en Crespi

```crespi
// main.crespi

bloque main() {
    // Las funciones primitivas funcionan directamente
    variable suma = sumar(10, 20)
    mostrar(suma)  // 30

    // Los structs se convierten en clases
    variable p1 = Punto(0.0, 0.0)
    variable p2 = Punto(3.0, 4.0)

    // Los métodos funcionan naturalmente
    variable dist = p1.distancia(p2)
    mostrar(dist)  // 5.0

    // Funciones libres con parámetros struct
    variable medio = punto_medio(p1, p2)
    mostrar(medio.x())  // 1.5
    mostrar(medio.y())  // 2.0
}
```

## Mapeo de Tipos

### Tipos Primitivos (FFI Directa)

Los tipos primitivos se pasan directamente sin sobrecarga de conversión.

| Tipo Rust | Tipo Crespi | Notas |
|-----------|-------------|-------|
| `i64`, `isize` | `Int` | Entero con signo de 64 bits |
| `i32` | `Int32` | Entero con signo de 32 bits |
| `i16` | `Int16` | Entero con signo de 16 bits |
| `i8` | `Int8` | Entero con signo de 8 bits |
| `u64`, `usize` | `UInt` | Entero sin signo de 64 bits |
| `u32` | `UInt32` | Entero sin signo de 32 bits |
| `u16` | `UInt16` | Entero sin signo de 16 bits |
| `u8` | `UInt8` | Entero sin signo de 8 bits |
| `f64` | `Double` | Punto flotante de 64 bits |
| `f32` | `Float` | Punto flotante de 32 bits |
| `bool` | `Bool` | Mapeo directo |
| `()` | `Unit` | Tipo void/unit |

### Tipos Complejos (Generación de Wrappers)

Los tipos complejos requieren funciones wrapper para el marshaling.

| Tipo Rust | Tipo Crespi | Notas |
|-----------|-------------|-------|
| `String`, `&str` | `String` | Conversión automática |
| `Vec<T>` | `List[T]` | Lista con tipo de elemento |
| `HashMap<K, V>` | `Dict[K, V]` | Mapeo de diccionario |
| `Option<T>` | `T?` | Tipo nullable |
| `Result<T, E>` | `T?` | Los errores se convierten en null |
| `struct` personalizado | `tipo` | Tipo auto-generado |
| `enum` personalizado | `tipo` | Constructores de variantes |

Si un tipo de Rust no se puede mapear, crespi-cargo usa `Any` para mantener el item disponible.

### Punteros Inteligentes

Los punteros inteligentes se desenvuelven automáticamente a su tipo interno.

| Tipo Rust | Tipo Crespi |
|-----------|-------------|
| `Box<T>` | `T` |
| `Rc<T>` | `T` |
| `Arc<T>` | `T` |
| `Cow<T>` | `T` |

## Bindings Generados

### Mapeo de Structs

Los structs de Rust se convierten en clases de Crespi con:

- **Constructor**: Usa los nombres de los campos como parámetros
- **Getters de campos**: Métodos que devuelven valores de campos
- **Métodos**: Métodos de instancia de los bloques `impl`
- **Structs tupla**: Los campos posicionales se exponen como `field0`, `field1`, ...

**Rust:**
```rust
pub struct Persona {
    pub nombre: String,
    pub edad: i32,
}

impl Persona {
    pub fn new(nombre: String, edad: i32) -> Self {
        Persona { nombre, edad }
    }

    pub fn saludar(&self) -> String {
        format!("Hola, soy {} y tengo {} años", self.nombre, self.edad)
    }
}
```

**Crespi Generado:**
```crespi
tipo Persona {
    privado variable _ptr: Any

    bloque init(nombre: String, edad: Int) {
        yo._ptr = __crespi_Persona_new(nombre, edad)
    }

    bloque nombre() -> String {
        resultado __crespi_Persona_get_nombre(yo._ptr)
    }

    bloque edad() -> Int {
        resultado __crespi_Persona_get_edad(yo._ptr)
    }

    bloque saludar() -> String {
        resultado __crespi_Persona_saludar(yo._ptr)
    }
}
```

### Funciones Libres

Las funciones libres se envuelven con el mismo nombre:

**Rust:**
```rust
pub fn calcular_area(ancho: f64, alto: f64) -> f64 {
    ancho * alto
}
```

**Crespi Generado:**
```crespi
externo bloque __crespi_calcular_area(ancho: Double, alto: Double) -> Double

bloque calcular_area(ancho: Double, alto: Double) -> Double {
    resultado __crespi_calcular_area(ancho, alto)
}
```

### Mapeo de Enums

Los enums de Rust se convierten en clases con constructores estáticos para cada variante. Las
variantes tupla usan parámetros posicionales como `field0`, `field1`, etc.

**Rust:**
```rust
pub enum Color {
    Rojo,
    Verde,
    Azul,
    Rgb(u8, u8, u8),
}
```

**Crespi Generado:**
```crespi
tipo Color {
    privado variable _tag: Int
    privado variable _data: Any

    bloque Rojo() -> Color { ... }
    bloque Verde() -> Color { ... }
    bloque Azul() -> Color { ... }
    bloque Rgb(r: Int, g: Int, b: Int) -> Color { ... }

    bloque es_rojo() -> Bool { resultado yo._tag == 0 }
    bloque es_verde() -> Bool { resultado yo._tag == 1 }
    bloque es_azul() -> Bool { resultado yo._tag == 2 }
    bloque es_rgb() -> Bool { resultado yo._tag == 3 }
}
```

## Comando crespigen

### Uso

```bash
crespigen [OPCIONES] <DIRECTORIO_PROYECTO>
```

### Argumentos

| Argumento | Descripción |
|-----------|-------------|
| `<DIRECTORIO_PROYECTO>` | Ruta al proyecto Rust (directorio que contiene Cargo.toml) |

### Opciones

| Opción | Descripción |
|--------|-------------|
| `-o, --output <DIR>` | Directorio de salida para los bindings generados (por defecto: `<proyecto>/target/crespi-gen`) |
| `--no-build` | Solo generar bindings, no compilar |
| `-h, --help` | Mostrar ayuda |
| `-V, --version` | Mostrar versión |

### Archivos de Salida

Después de ejecutar `crespigen`, encontrarás:

```
mi_proyecto/
└── target/
    └── crespi-gen/
        ├── Cargo.toml           # Manifiesto del crate wrapper
        ├── src/
        │   └── lib.rs           # Wrappers de Rust generados
        ├── bindings.crespi      # Archivo facade de Crespi
        └── target/
            └── release/
                └── lib_crespi_bindings.a  # Biblioteca estática
```

## Requisitos

### Rust Nightly

La herramienta `crespigen` requiere Rust nightly para la salida JSON de rustdoc:

```bash
# Instalar nightly
rustup install nightly

# Hacer nightly disponible
rustup default nightly
# O usar el flag +nightly
cargo +nightly ...
```

### Configuración de PATH

Asegúrate de que `cargo` esté disponible en tu PATH. Añade a tu configuración de shell:

```bash
# ~/.zshrc o ~/.bashrc
export PATH="$HOME/.cargo/bin:$PATH"
```

## Cómo Funciona

### Arquitectura

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Crate Rust    │────▶│  crespigen   │────▶│  bindings.crespi│
│   (Cargo.toml)  │     │              │     │  lib_crespi_*.a │
└─────────────────┘     └──────────────┘     └─────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
               ┌────▼────┐       ┌──────▼──────┐
               │ rustdoc │       │ Embebidos   │
               │  JSON   │       │ crespi-ffi  │
               │         │       │ crespi-runtime
               └─────────┘       └─────────────┘
```

### Flujo del Proceso

1. **Generación de JSON Rustdoc**: `crespigen` ejecuta `cargo +nightly doc` con salida JSON para extraer la API pública
2. **Parseo de API**: El JSON de rustdoc se parsea para descubrir funciones, structs, enums y métodos
3. **Mapeo de Tipos**: Los tipos de Rust se mapean a tipos de Crespi
4. **Generación de Wrappers**: Se generan funciones wrapper de Rust que:
   - Aceptan argumentos `CrespiValue`
   - Convierten valores a tipos nativos de Rust
   - Llaman a las funciones originales
   - Convierten resultados de vuelta a `CrespiValue`
5. **Generación de Facade**: Se genera un archivo `.crespi` con:
   - Declaraciones `externo bloque` para las funciones FFI
   - Definiciones de tipo para structs
   - Funciones wrapper para API ergonómica
6. **Compilación**: El crate wrapper se compila a biblioteca estática

### Punteros Opacos

Los structs personalizados se manejan como punteros opacos:

- Las instancias de struct se encapsulan en Box y se almacenan como punteros raw en `CrespiValue`
- Los métodos reciben el puntero, lo desreferencian y llaman al método
- Los valores de retorno que son structs se encapsulan y devuelven como punteros opacos

Este enfoque:
- Evita copiar structs grandes
- Preserva la semántica de propiedad de Rust
- Permite llamar métodos en instancias

## Limitaciones

### Limitaciones Actuales

#### Totalmente Soportado
- Tipos numéricos primitivos (enteros con/sin signo, `f32`/`f64`, `bool`) en funciones y campos de struct
- Structs con campos primitivos únicamente
- Métodos con receptor `&self`
- Métodos que toman referencias `&StructType` como parámetros
- Métodos que devuelven `Self` u otros tipos struct
- Funciones libres con parámetros primitivos
- Funciones libres con parámetros `&StructType`

#### Aún No Soportado (Planificado)

| Característica | Problema | Alternativa |
|----------------|----------|-------------|
| **Métodos factory estáticos** | Métodos sin `&self` (ej. `Point::origin()`) se generan incorrectamente como métodos de instancia | Usa constructores con valores por defecto: `Point(0.0, 0.0)` en lugar de `Point::origin()` |
| **Campos struct que contienen otros structs** | Campos como `center: Point` en un struct `Circle` fallan al serializar | Usa campos primitivos: `cx: f64, cy: f64` en lugar de `center: Point` |
| **Métodos que toman structs como propiedad** | `fn move_to(self, center: Point)` espera valor propio, no referencia | Usa referencias: `fn move_to(&self, center: &Point)` |
| **Marshaling de enums** | Los valores de enums aún se tratan como punteros opacos en llamadas FFI | Usa funciones wrapper que devuelvan primitivos/structs cuando sea posible |
| **Genéricos** | Funciones y structs genéricos tienen soporte limitado | Usa tipos concretos en APIs públicas |
| **Traits** | Los objetos trait (`dyn Trait`) se tratan como `Any` opaco | Evita objetos trait en fronteras FFI |
| **Tiempos de vida** | Las referencias con lifetimes explícitos pueden no funcionar | Usa tipos propios o `&T` sin lifetimes explícitos |
| **Async** | Crespi soporta `asincrono`/`esperar`, pero no hay interop con `async fn` de Rust | Expone wrappers síncronos o usa APIs síncronas |
| **Callbacks** | Pasar funciones Crespi a Rust no está soportado | Diseña APIs sin callbacks |
| **Retornos String/Vec** | Tipos de retorno complejos necesitan serialización | Actualmente limitado - usa primitivos cuando sea posible |

### Recomendaciones de Diseño

1. **Usa tipos concretos** en APIs públicas cuando sea posible
2. **Prefiere métodos `&self`** sobre métodos que consumen `self`
3. **Devuelve `Result` u `Option`** para operaciones que pueden fallar
4. **Deriva `Clone`** para structs que necesiten ser copiados
5. **Mantén las APIs públicas simples** - la complejidad interna está bien

### Helper de Tokio

`crespi-tokio` ofrece un wrapper bloqueante sobre Tokio pensado para Crespi. Expone
`sleep_ms`, `join_sleep_ms`, `race_sleep_ms`, y un wrapper `Runtime` que puedes usar vía `crespi-cargo`.

```crespi
externo bloque sleep_ms(ms: Int)
externo bloque join_sleep_ms(a: Int, b: Int) -> Int

sleep_ms(50)
mostrar(join_sleep_ms(10, 30))
```

## Ejemplos

### Usando una Biblioteca de crates.io

```toml
# Cargo.toml
[package]
name = "ejemplo_regex"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["rlib"]

[workspace]

[dependencies]
regex = "1.10"
```

```crespi
// main.crespi
bloque main() {
    variable patron = Regex("[0-9]+")

    si patron.is_match("abc123") {
        mostrar("¡Se encontraron dígitos!")
    }

    variable coincidencias = patron.find_all("a1b2c3")
    para m en coincidencias {
        mostrar(m)  // "1", "2", "3"
    }
}
```

### Biblioteca Matemática Local

```rust
// src/lib.rs
pub fn factorial(n: i64) -> i64 {
    if n <= 1 { 1 } else { n * factorial(n - 1) }
}

pub fn fibonacci(n: i64) -> i64 {
    if n <= 1 { n } else { fibonacci(n - 1) + fibonacci(n - 2) }
}

pub struct Complejo {
    pub real: f64,
    pub imag: f64,
}

impl Complejo {
    pub fn new(real: f64, imag: f64) -> Self {
        Complejo { real, imag }
    }

    pub fn magnitud(&self) -> f64 {
        (self.real * self.real + self.imag * self.imag).sqrt()
    }

    pub fn sumar(&self, otro: &Complejo) -> Complejo {
        Complejo {
            real: self.real + otro.real,
            imag: self.imag + otro.imag,
        }
    }
}
```

```crespi
// main.crespi
bloque main() {
    // Usando funciones libres
    mostrar(factorial(10))    // 3628800
    mostrar(fibonacci(10))    // 55

    // Usando la clase Complejo
    variable c1 = Complejo(3.0, 4.0)
    variable c2 = Complejo(1.0, 2.0)

    mostrar(c1.magnitud())   // 5.0

    variable suma = c1.sumar(c2)
    mostrar(suma.real())     // 4.0
    mostrar(suma.imag())     // 6.0
}
```

## Solución de Problemas

### "Se requiere Rust Nightly"

```
Error: cargo +nightly failed
```

**Solución:** Instala y configura Rust nightly:
```bash
rustup install nightly
rustup default nightly
```

### "El paquete cree que está en un workspace"

```
Error: current package believes it's in a workspace when it's not
```

**Solución:** Añade una sección `[workspace]` vacía a tu Cargo.toml:
```toml
[workspace]
```

### "El tipo X no implementa FromCrespi"

Esto ocurre cuando el generador intenta usar un tipo que no puede ser convertido automáticamente.

**Solución:** Asegúrate de que tus structs usen tipos de campo soportados, o reporta un issue para el tipo no soportado.

### Funciones Faltantes en los Bindings Generados

Solo las funciones e items `pub` se incluyen en los bindings generados.

**Solución:** Marca como `pub` los items que quieras exponer a Crespi.

## Ver También

- [Referencia de Tipos](tipos.md) - Sistema de tipos de Crespi
- [Referencia de Funciones](funciones.md) - Funciones incorporadas
- [Referencia de Palabras Clave](palabras-clave.md) - Palabras clave del lenguaje incluyendo `externo`
