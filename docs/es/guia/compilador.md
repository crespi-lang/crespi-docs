# Compilador Nativo

> **Idioma:** Español | [English](../../en/guide/compiler.md)

---

El compilador de Crespi (`crespic`) genera ejecutables nativos a partir de tu código. Es ideal para distribución y máximo rendimiento.

## Inicio Rápido

```bash
# Compilar un programa
crespic programa.crespi

# Ejecutar el binario generado
./programa
```

---

## Uso Básico

### Compilar

```bash
crespic mi_programa.crespi
```

Esto genera un ejecutable con el mismo nombre que el archivo fuente (sin extensión).

### Verificar Tipos (Opcional)

```bash
crespic --check mi_programa.crespi
```

Ejecuta el verificador de tipos antes de compilar. El compilador falla si encuentra errores.

### Nombre de Salida Personalizado

```bash
crespic mi_programa.crespi -o aplicacion
./aplicacion
```

### Ejemplo Completo

```bash
# Crear programa
echo 'mostrar("Hola desde código nativo!")' > hola.crespi

# Compilar
crespic hola.crespi

# Ejecutar
./hola
# Salida: Hola desde código nativo!
```

---

## Referencia CLI

| Opción | Descripción |
|--------|-------------|
| `<archivo>` | Archivo fuente a compilar |
| `-o, --output <nombre>` | Nombre del ejecutable de salida |
| `--check` | Ejecuta el verificador de tipos antes de compilar |
| `-L <biblioteca>` | Enlazar una biblioteca estática externa (se puede usar múltiples veces) |
| `-O0` | Sin optimización (predeterminado) |
| `-O1` | Optimización básica (incluye funciones con `@inline`) |
| `-O2` | Optimización completa (auto-inline de funciones pequeñas) |
| `--help` | Mostrar ayuda |
| `--version` | Mostrar versión |

---

## Backend ABI Nativo (Experimental)

El feature `native-abi` de Cargo habilita un backend experimental que
compila código numérico tipado con firmas ABI nativas. Por ahora soporta
`Int`, `Double`, `Bool` y `print()` para esos tipos.

```bash
cargo run --bin crespic --features native-abi -- examples/simple_scripts/native_abi_demo.crespi -o /tmp/crespi_native_abi_demo
/tmp/crespi_native_abi_demo
```

---

## Características Soportadas

El compilador soporta la mayoría de características del lenguaje:

- ✅ Variables y constantes
- ✅ Tipos primitivos: enteros, decimales, texto, booleanos
- ✅ Arreglos: literales, indexación, `lista.longitud()`, `lista.agregar()`, `lista.quitar()`
- ✅ Diccionarios: literales, indexación, `diccionario.claves()`, `diccionario.valores()`, `diccionario.contiene()`
- ✅ Control de flujo: `si`, `mientras`, `repetir...en`, `salir`, `continuar`
- ✅ Funciones: definiciones, recursión, parámetros por defecto
- ✅ Closures con captura de variables
- ✅ Clases: `tipo`, herencia (`extiende`), `super`
- ✅ Decoradores: `@memorizar`, `@inline`
- ✅ Funciones integradas: `mostrar()`, `leer()`, `tipo_de()`, `texto()`, `entero()`, `decimal()`, `memorizar()`; los helpers de colecciones y texto son métodos (por ejemplo `lista.mapear()`, `texto.recortar()`, `diccionario.claves()`).
- ✅ Funciones externas: Llamar bibliotecas nativas Rust/C via FFI

---

## Funciones Externas (FFI)

Crespi permite llamar funciones nativas externas de bibliotecas Rust o C usando la declaración `externo bloque`.

### 1. Declarar en Crespi

```crespi
// Enlazar a un simbolo nativo con nombre distinto
#[link_name = "mi_suma_impl"]
externo bloque mi_suma(a: Int, b: Int) -> Int
externo bloque mi_seno(x: Double) -> Double

bloque main() {
    print(mi_suma(10, 32))  // Salida: 42
    print(mi_seno(1.57))    // Salida: ~1.0
}
```

### 2. Implementar en Rust

```rust
// lib.rs
#[no_mangle]
pub extern "C" fn mi_suma(a: i64, b: i64) -> i64 {
    a + b
}

#[no_mangle]
pub extern "C" fn mi_seno(x: f64) -> f64 {
    x.sin()
}
```

### 3. Compilar y Enlazar

```bash
# Compilar biblioteca Rust
rustc --crate-type=staticlib -o libmimath.a lib.rs

# Compilar Crespi con la biblioteca
crespic programa.crespi -L libmimath.a -o programa

# Ejecutar
./programa
```

### Mapeo de Tipos

| Crespi | Rust | Notas |
|--------|------|-------|
| `Int` | `i64` | Entero de 64 bits con signo |
| `Double` | `f64` | Punto flotante de 64 bits |
| `Float` | `f32` | Punto flotante de 32 bits |
| `Bool` | `bool` | Valor booleano |
| `Unit` | `()` | Sin valor de retorno |

---

## Punto de Entrada

El compilador busca un punto de entrada de dos formas:

### 1. Función `principal()` (explícita)

```crespi
bloque principal() {
    mostrar("Hola, Mundo!")
}
```

### 2. Código de nivel superior (implícita)

```crespi
// El código de nivel superior se ejecuta automáticamente
mostrar("Hola, Mundo!")

bloque ayuda() {
    mostrar("Esta es una función auxiliar")
}
```

En el segundo escenario, el compilador genera una función `principal()` sintética que contiene el código de nivel superior.

---

## Cómo Funciona

```
Código Fuente (.crespi)
    ↓
Lexer/Scanner (tokenización)
    ↓
Parser (generación de AST)
    ↓
Lowerer (AST → HIR)
    ↓
Compilador (HIR → LLVM IR)
    ↓
Generador de Código (código máquina)
    ↓
Enlazador (vincula con libcrespi_runtime.a)
    ↓
Ejecutable Nativo
```

---

## Niveles de Optimización

El compilador soporta tres niveles de optimización:

### `-O0` (Predeterminado)

Sin optimización. El código se compila directamente sin transformaciones.

### `-O1` (Básico)

Optimizaciones básicas incluyendo:
- Plegado de constantes
- Inline de funciones marcadas con `@inline`

```crespi
@inline
bloque doble(x) { resultado x * 2 }

bloque principal() {
    // Con -O1, esta llamada se reemplaza por: res = 21 * 2
    variable res = doble(21)
    mostrar(res)
}
```

### `-O2` (Completo)

Optimizaciones completas incluyendo todo de `-O1` más:
- Auto-inline de funciones pequeñas (≤5 sentencias)
- Propagación de constantes más agresiva

Las funciones pequeñas y no recursivas se expanden automáticamente incluso sin el decorador `@inline`.

```bash
# Compilar con optimización completa
crespic -O2 programa.crespi
```

---

## Nota de Implementación

El código del compilador usa identificadores y terminología en inglés. La superficie del lenguaje (palabras clave, funciones incorporadas) y la salida para el usuario se mantienen en español.

---

## Cuándo Usar el Compilador

| Caso de Uso | Recomendación |
|-------------|---------------|
| Distribuir aplicaciones | ✅ Compilador |
| Máximo rendimiento | ✅ Compilador |
| Aplicaciones complejas | ✅ Compilador |
| Desarrollo y pruebas | ❌ Usar [intérprete](interprete.md) |
| REPL interactivo | ❌ Usar [intérprete](interprete.md) |

---

## Véase También

- [Intérprete](interprete.md) - Ejecutar código directamente
- [Variables](variables.md) - Tipos de datos y variables
- [Clases](clases.md) - Programación orientada a objetos
