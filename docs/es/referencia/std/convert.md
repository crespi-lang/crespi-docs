# std.convert

> **Idioma:** Espanol | [English](../../../en/reference/std/convert.md)

---

Funciones de conversion de tipos e introspeccion.

## Importacion

```crespi
importar std.convert { texto, entero, decimal, tipo_de }
```

O usar directamente sin importar (disponible globalmente).

---

## Referencia Rapida

| Funcion | Alias Ingles | Parametros | Retorna | Descripcion |
|---------|--------------|------------|---------|-------------|
| `texto` | `str` | `valor: Any` | `String` | Convertir a texto |
| `entero` | `int` | `valor: Any` | `Int` | Convertir a entero |
| `decimal` | `float` | `valor: Any` | `Float` | Convertir a decimal |
| `tipo_de` | `typeof` | `valor: Any` | `String` | Obtener nombre del tipo |

---

## Funciones

### `texto(valor)`

Convierte cualquier valor a su representacion de texto.

**Alias:** `string(valor)`, `str(valor)`

**Parametros:**
- `valor: Any` - Cualquier valor a convertir

**Retorna:** `String`

**Ejemplos:**

```crespi
mostrar(texto(42))              // "42"
mostrar(texto(3.14))            // "3.14"
mostrar(texto(verdadero))       // "true"
mostrar(texto(falso))           // "false"
mostrar(texto(nulo))            // "null"
mostrar(texto([1, 2, 3]))       // "[1, 2, 3]"
mostrar(texto(["a": 1]))        // "{a: 1}"
```

**Uso comun - concatenacion de texto:**

```crespi
variable edad = 25
mostrar("Tengo " + texto(edad) + " anios")
// Tengo 25 anios

// O con interpolacion de texto (conversion automatica)
mostrar("Tengo $edad anios")
```

---

### `entero(valor)`

Convierte un valor a entero.

**Parametros:**
- `valor: Any` - String, float, int o bool

**Retorna:** `Int`

**Errores:** Lanza error si la conversion no es posible

**Reglas de conversion:**

| Tipo de Entrada | Resultado |
|-----------------|-----------|
| `String` | Parsear como entero (debe ser texto numerico valido) |
| `Float` | Truncar hacia cero |
| `Int` | Retornar tal cual |
| `Bool` | `verdadero` -> `1`, `falso` -> `0` |

**Ejemplos:**

```crespi
mostrar(entero("42"))           // 42
mostrar(entero("-17"))          // -17
mostrar(entero(3.7))            // 3 (trunca)
mostrar(entero(-3.7))           // -3 (trunca hacia cero)
mostrar(entero(verdadero))      // 1
mostrar(entero(falso))          // 0

// Casos de error
// entero("abc")     // Error: No se puede convertir 'abc' a entero
// entero("3.14")    // Error: Formato de entero invalido
```

---

### `decimal(valor)`

Convierte un valor a numero de punto flotante.

**Parametros:**
- `valor: Any` - String, float o int

**Retorna:** `Float`

**Errores:** Lanza error si la conversion no es posible

**Ejemplos:**

```crespi
mostrar(decimal("3.14"))        // 3.14
mostrar(decimal("42"))          // 42.0
mostrar(decimal(42))            // 42.0
mostrar(decimal(-17))           // -17.0

// Notacion cientifica
mostrar(decimal("1.5e3"))       // 1500.0

// Casos de error
// decimal("abc")   // Error: No se puede convertir 'abc' a decimal
```

---

### `tipo_de(valor)`

Obtiene el nombre del tipo de un valor como texto.

**Alias:** `type_of(valor)`, `typeof(valor)`

**Parametros:**
- `valor: Any` - Cualquier valor

**Retorna:** `String` - El nombre del tipo

**Nombres de tipo:**

| Valor | Resultado |
|-------|-----------|
| `42` | `"int"` |
| `3.14` | `"float"` |
| `"hola"` | `"string"` |
| `verdadero`/`falso` | `"bool"` |
| `nulo` | `"null"` |
| `[1, 2]` | `"list"` |
| `["a": 1]` | `"dict"` |
| `(1, 2)` | `"tuple"` |
| funcion | `"function"` |
| instancia de clase | `"NombreClase"` |
| valor enum | `"NombreEnum"` |
| tarea | `"task"` |

**Ejemplos:**

```crespi
mostrar(tipo_de(42))           // int
mostrar(tipo_de(3.14))         // float
mostrar(tipo_de("hola"))       // string
mostrar(tipo_de(verdadero))    // bool
mostrar(tipo_de(nulo))         // null
mostrar(tipo_de([1, 2, 3]))    // list
mostrar(tipo_de(["a": 1]))     // dict

funcion sumar(a, b) { retornar a + b }
mostrar(tipo_de(sumar))        // function

clase Persona(constante nombre: String)
variable p = Persona("Ana")
mostrar(tipo_de(p))            // Persona
```

**Verificacion de tipo:**

```crespi
funcion procesar(valor) {
    cuando tipo_de(valor) {
        caso "int" -> mostrar("Entero: $valor")
        caso "string" -> mostrar("Texto: $valor")
        caso "list" -> mostrar("Lista con ${valor.longitud()} elementos")
        defecto -> mostrar("Tipo desconocido")
    }
}

procesar(42)         // Entero: 42
procesar("hola")     // Texto: hola
procesar([1, 2, 3])  // Lista con 3 elementos
```

---

## Ver Tambien

- [std.io](io.md) - Entrada/salida para leer entrada del usuario
- [Tipos de Datos](../tipos.md) - Sistema de tipos de Crespi
- [Biblioteca Estandar](index.md) - Todos los modulos
