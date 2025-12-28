# Tipos de Datos

> **Idioma:** Español | [English](../../en/reference/types.md)

---

Crespi es **dinámico en tiempo de ejecución** con un **comprobador estático opcional** que usa inferencia de tipos. Los tipos solo se validan cuando activas el checker (por ejemplo con `--check`).

## Anotaciones de Tipo

Crespi soporta anotaciones de tipo con sintaxis estilo Rust. Cuando ejecutas el checker, los tipos se infieren del contexto.

### Anotaciones de Tipo en Variables

```crespi
// Con tipo explícito
variable nombre: String = "Alicia"
variable edad: Int = 25
variable activo: Bool = verdadero

// Inferencia de tipo (cuando se ejecuta el checker)
variable contador = 42       // Inferido: Int
variable pi = 3.14           // Inferido: Float
variable lista = [1, 2, 3]   // Inferido: List[Int]

Las listas con elementos de tipos mezclados se infieren como `List[Any]`.

Con el checker activo, el tipo inferido o anotado de una variable debe mantenerse consistente. Sin el checker, puedes reasignar cualquier tipo en tiempo de ejecución.
```

### Anotaciones de Tipo en Funciones

```crespi
// Función completamente tipada
bloque suma(a: Int, b: Int) -> Int {
    resultado a + b
}

// Con valores por defecto
bloque saludar(nombre: String = "Mundo") -> String {
    resultado "Hola, " + nombre
}

// Función genérica con restricciones
bloque [T: Numeric] maximo(a: T, b: T) -> T {
    si a > b { resultado a }
    resultado b
}
```

### Tipos Nullables

```crespi
// Anotación de tipo nullable con ?
variable resultado: String? = nada

// Operador de coalescencia nula
variable valor = resultado ?? "defecto"
```

### Tipos Unión

```crespi
// Anotación de tipo unión con |
bloque parsear(entrada: String) -> Int | Error {
    // Puede devolver Int o Error
}
```
Los tipos unión son **insensibles al orden** en el verificador estático, así que
`Int | String` y `String | Int` se consideran el mismo tipo.
Los valores de un tipo miembro son asignables a la unión (por ejemplo, `Int`
se puede usar donde se espera `Int | String`).

### Anotaciones de Tipo en Clases

```crespi
tipo Punto(immutable x: Int, immutable y: Int) {
    bloque distancia() -> Float {
        resultado raiz(decimal(yo.x * yo.x + yo.y * yo.y))
    }
}
```

### Tipos Genéricos

```crespi
tipo Contenedor[T](immutable valor: T) {
    bloque obtener() -> T {
        resultado yo.valor
    }
}
```

---

## Tabla de Tipos

### Tipos Estáticos (para anotaciones)

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `Int` | Entero de 64 bits con signo (por defecto) | `42` |
| `Int32`, `Int16`, `Int8` | Enteros con signo de ancho específico | `100: Int32` |
| `UInt`, `UInt32`, `UInt16`, `UInt8` | Enteros sin signo | `50: UInt` |
| `Double` | Punto flotante de 64 bits (por defecto) | `3.14` |
| `Float` | Punto flotante de 32 bits | `3.14: Float` |
| `String` | Cadena de texto UTF-8 | `"Hola"` |
| `Bool` | Valor booleano | `verdadero` |
| `Null` | Ausencia de valor | `nada` |
| `Unit` | Sin valor (como void) | `bloque f() -> Unit` |
| `Any` | Tipo superior (acepta cualquier cosa) | `variable x: Any` |
| `Never` | Tipo inferior (sin valores) | `bloque fallo() -> Never` |
| `List[T]` | Arreglo dinámico de tipo T | `[1, 2]: List[Int]` |
| `(T1, T2)` | Tupla de tamaño fijo | `(1, "a"): (Int, String)` |
| `Dict[K, V]` | Mapa de claves a valores | `{"a": 1}: Dict[String, Int]` |
| `Task[T]` | Tarea asincrona que produce un valor de tipo T | `Task[Int]` |

### Nombres de Tipo en Tiempo de Ejecución (de `tipo_de()`)

| Nombre | Valores |
|--------|---------|
| `"entero"` | Todos los enteros con/sin signo |
| `"decimal"` | `Double` y `Float` |
| `"texto"` | `String` |
| `"booleano"` | `Bool` |
| `"nada"` | `Null` |
| `"lista"` | `List[T]` |
| `"tupla"` | `(T1, T2)` |
| `"diccionario"` | `Dict[K, V]` |
| `"funcion"` | Funciones y lambdas |
| `"instancia"` | Instancias de clase |
| `"tarea"` | `Task[T]` |

---

## Tareas asincronas

Las funciones asincronas devuelven `Task[T]`. Las tareas son ansiosas: la funcion se ejecuta
de inmediato y el resultado se envuelve. Usa `esperar` para obtener el valor.

```crespi
asincrono bloque calcular() -> Int { resultado 10 }
variable tarea: Task[Int] = calcular()
variable valor = esperar tarea
```

---

## Tipos Numéricos

Crespi utiliza tipos numéricos de ancho explícito y sigue la convención de Swift para los nombres de punto flotante.

### Enteros

| Tipo | Ancho | Rango |
|------|-------|-------|
| `Int` | 64 bits | -9.22e18 a 9.22e18 |
| `Int32` | 32 bits | -2.14e9 a 2.14e9 |
| `Int16` | 16 bits | -32,768 a 32,767 |
| `Int8` | 8 bits | -128 a 127 |
| `UInt` | 64 bits | 0 a 1.84e19 |
| `UInt32` | 32 bits | 0 a 4.29e9 |
| `UInt16` | 16 bits | 0 a 65,535 |
| `UInt8` | 8 bits | 0 a 255 |

### Punto Flotante

| Tipo | Ancho | Descripción |
|------|-------|-------------|
| `Double` | 64 bits | Tipo decimal por defecto (IEEE 754) |
| `Float` | 32 bits | Decimal de precisión simple |

### Tipado Estricto

Crespi **no realiza** coerción numérica implícita. Debes usar funciones o métodos de conversión explícitos si deseas asignar un `Int32` a un `Int`, o un `Int` a un `Double`.

```crespi
variable i: Int = 42
variable d: Double = i.toDouble() // OK
// variable d2: Double = i        // Error: Desajuste de tipo
```

---

## Tipos Primitivos

### `entero`

Números enteros con signo de 64 bits. Rango: -9,223,372,036,854,775,808 a 9,223,372,036,854,775,807.

```crespi
variable edad = 25
variable negativo = -100
variable cero = 0
variable grande = 9223372036854775807

mostrar(tipo_de(edad))  // entero
```

**Operaciones:**
- Aritméticas: `+`, `-`, `*`, `/`, `%`
- Comparación: `<`, `>`, `<=`, `>=`, `==`, `!=`

### `decimal`

Números de punto flotante de 64 bits (IEEE 754 double precision).

```crespi
variable pi = 3.14159
variable temperatura = -5.5
variable cientifico = 1.5e10  // Notación científica: 1.5 × 10¹⁰

mostrar(tipo_de(pi))  // decimal
```

**Nota sobre división:**
```crespi
mostrar(10 / 3)     // 3 (división entera)
mostrar(10.0 / 3)   // 3.333... (división decimal)
mostrar(10 / 3.0)   // 3.333...
```

### `texto`

Cadenas de caracteres inmutables codificadas en UTF-8.

```crespi
variable saludo = "Hola, Mundo"
variable multilinea = "Línea 1
Línea 2"
variable con_escape = "Dice: \"Hola\""
variable con_tabs = "Col1\tCol2"

mostrar(tipo_de(saludo))      // texto
mostrar(saludo.longitud())     // 11
```

**Secuencias de escape:**
| Secuencia | Significado |
|-----------|-------------|
| `\\` | Barra invertida |
| `\"` | Comilla doble |
| `\n` | Nueva línea |
| `\t` | Tabulador |
| `\r` | Retorno de carro |
| `\$` | Signo de dolar literal |

**Interpolacion de texto:**
```crespi
variable nombre = "Ana"
variable total = 3
mostrar("Hola, $nombre")            // Hola, Ana
mostrar("Total: ${total + 1}")      // Total: 4
```

**Texto crudo (comillas triples):**
```crespi
variable multilinea = """Linea 1
Linea 2"""

variable precio = 5
mostrar("""Costo: $$${precio}""")   // Costo: $5
```

**Operaciones:**
```crespi
// Concatenación
variable completo = "Hola" + " " + "Mundo"

// Acceso a caracteres (iteración)
repetir letra en "ABC" {
    mostrar(letra)  // A, B, C
}

// Búsqueda
mostrar("Hola Mundo".contiene("Mundo"))  // verdadero
```

### `booleano`

Valores lógicos: `verdadero` o `falso`.

```crespi
variable activo = verdadero
variable terminado = falso

mostrar(tipo_de(activo))  // booleano
```

**Conversión a booleano (truthiness):**

| Tipo | Valor Falso | Valor Verdadero |
|------|-------------|-----------------|
| `booleano` | `falso` | `verdadero` |
| `entero` | `0` | Cualquier otro |
| `decimal` | `0.0` | Cualquier otro |
| `texto` | `""` (vacío) | No vacío |
| `lista` | `[]` (vacía) | No vacía |
| `tupla` | (sin literal vacío) | Siempre verdadero |
| `nada` | Siempre | - |

```crespi
// En condiciones
si 1 { mostrar("verdadero") }     // Se ejecuta
si 0 { mostrar("no se ve") }      // No se ejecuta
si "hola" { mostrar("si") }       // Se ejecuta
si "" { mostrar("no") }           // No se ejecuta
```

### `nada`

Representa la ausencia de valor. Similar a `null` o `nil` en otros lenguajes.

```crespi
variable resultado = nada

bloque buscar(lista, objetivo) {
    repetir item en lista {
        si item == objetivo {
            resultado item
        }
    }
    resultado nada
}

variable encontrado = buscar([1, 2, 3], 5)
si encontrado == nada {
    mostrar("No encontrado")
}
```

---

## Tipos de Colección

### `lista`

Arreglo dinámico que puede contener elementos de cualquier tipo.

```crespi
// Creación
variable vacia = []
variable numeros = [1, 2, 3, 4, 5]
variable mixta = [1, "dos", verdadero, nada]

mostrar(tipo_de(numeros))  // lista
```

**Acceso a elementos:**
```crespi
variable lista = [10, 20, 30, 40, 50]

// Índices positivos (desde el inicio)
mostrar(lista[0])   // 10 (primer elemento)
mostrar(lista[2])   // 30

// Índices negativos (desde el final)
mostrar(lista[-1])  // 50 (último elemento)
mostrar(lista[-2])  // 40
```

**Modificación:**
```crespi
variable lista = [1, 2, 3]

// Modificar elemento
lista[0] = 100
mostrar(lista)  // [100, 2, 3]

// Añadir al final
lista.agregar(4)
mostrar(lista)  // [100, 2, 3, 4]

// Quitar del final
variable ultimo = lista.quitar()
mostrar(ultimo)  // 4
mostrar(lista)   // [100, 2, 3]
```

**Iteración:**
```crespi
variable colores = ["rojo", "verde", "azul"]

repetir color en colores {
    mostrar(color)
}
```

### `tupla`

Colección ordenada de tamaño fijo. Las tuplas usan paréntesis con comas y una tupla
de un solo elemento requiere coma final.

```crespi
variable punto = (3, 4)
variable unico = (1,)

mostrar(tipo_de(punto))     // tupla
mostrar(punto.longitud())    // 2
mostrar(punto[0])           // 3
mostrar(punto[-1])          // 4
```

### `diccionario`

Mapa de claves texto a valores de cualquier tipo.

```crespi
// Creación
variable vacio = {}
variable persona = {
    "nombre": "Ana",
    "edad": 25,
    "activa": verdadero
}

mostrar(tipo_de(persona))  // diccionario
```

**Acceso a valores:**
```crespi
variable dict = {"a": 1, "b": 2, "c": 3}

mostrar(dict["a"])    // 1
mostrar(dict["b"])    // 2
```

**Modificación:**
```crespi
variable config = {"tema": "oscuro"}

// Modificar valor existente
config["tema"] = "claro"

// Añadir nueva clave
config["idioma"] = "es"

mostrar(config)  // {tema: claro, idioma: es}
```

**Iteración:**
```crespi
variable notas = {"mate": 90, "fisica": 85, "quimica": 78}

// Iterar sobre claves
repetir materia en notas.claves() {
    mostrar(materia + ": " + texto(notas[materia]))
}

// Obtener valores
variable vals = notas.valores()
mostrar(vals)  // [90, 85, 78]
```

---

## Tipos Invocables

### `funcion`

Funciones definidas por el usuario.

```crespi
// Declaración estándar
bloque suma(a, b) {
    resultado a + b
}

// Sintaxis corta (expresión única)
bloque doble(x) = x * 2

// Con valores por defecto
bloque saludar(nombre = "Mundo") {
    mostrar("Hola, " + nombre)
}

mostrar(tipo_de(suma))  // funcion
```

**Funciones como valores:**
```crespi
// Asignar a variable
variable operacion = suma
mostrar(operacion(3, 4))  // 7

// Pasar como argumento
bloque aplicar(funcion, valor) {
    resultado funcion(valor)
}
mostrar(aplicar(doble, 5))  // 10

// Retornar función
bloque crear_multiplicador(factor) {
    bloque multiplicar(x) {
        resultado x * factor
    }
    resultado multiplicar
}
variable triple = crear_multiplicador(3)
mostrar(triple(4))  // 12
```

### `clase`

Definición de un tipo con constructor y métodos.

```crespi
tipo Contador(variable valor = 0) {
    bloque incrementar() {
        yo.valor += 1
    }

    bloque obtener() {
        resultado yo.valor
    }
}

mostrar(tipo_de(Contador))  // clase
```

### `instancia`

Objeto creado a partir de una clase.

```crespi
tipo Punto(immutable x, immutable y) {
}

variable p = Punto(3, 4)
mostrar(tipo_de(p))  // instancia

// Acceso a propiedades
mostrar(p.x)  // 3
mostrar(p.y)  // 4
```

---

## Verificación de Tipos

Usa `tipo_de()` para verificar el tipo de un valor:

```crespi
bloque es_numero(valor) {
    variable t = tipo_de(valor)
    resultado t == "entero" || t == "decimal"
}

bloque es_coleccion(valor) {
    variable t = tipo_de(valor)
    resultado t == "lista" || t == "diccionario"
}

mostrar(es_numero(42))         // verdadero
mostrar(es_numero(3.14))       // verdadero
mostrar(es_numero("42"))       // falso

mostrar(es_coleccion([1,2]))   // verdadero
mostrar(es_coleccion({"a":1})) // verdadero
```

---

## Conversión de Tipos

| Función | Tipos Aceptados | Resultado |
|---------|-----------------|-----------|
| `texto()` | Cualquiera | `texto` |
| `entero()` | `texto`, `decimal`, `entero`, `booleano` | `entero` |
| `decimal()` | `texto`, `decimal`, `entero` | `decimal` |

```crespi
// A texto
mostrar(texto(42))           // "42"
mostrar(texto(3.14))         // "3.14"
mostrar(texto(verdadero))    // "verdadero"
mostrar(texto([1, 2]))       // "[1, 2]"

// A entero
mostrar(entero("42"))        // 42
mostrar(entero(3.7))         // 3 (trunca)
mostrar(entero(verdadero))   // 1
mostrar(entero(falso))       // 0

// A decimal
mostrar(decimal("3.14"))     // 3.14
mostrar(decimal(42))         // 42.0
```

---

## Ver También

- [Palabras Clave](palabras-clave.md)
- [Operadores](operadores.md)
- [Funciones Integradas](funciones.md)
