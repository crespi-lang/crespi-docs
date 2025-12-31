# std.collections

> **Idioma:** Espanol | [English](../../../en/reference/std/collections.md)

---

Metodos de manipulacion de colecciones para listas, diccionarios y tuplas. Todos los metodos se llaman sobre un receptor de coleccion usando notacion de punto.

## Importacion

```crespi
importar std.collections { longitud, mapear, filtrar, reducir }
```

O usar directamente sin importar (disponible globalmente).

---

## Referencia Rapida

### Operaciones Basicas

| Metodo | Alias Ingles | Receptor | Parametros | Retorna | Descripcion |
|--------|--------------|----------|------------|---------|-------------|
| `c.longitud()` | `length` | cualquiera | - | `Int` | Obtener longitud |
| `lista.agregar(v)` | `push` | lista | `v: Any` | `Unit` | Agregar a lista |
| `lista.quitar()` | `pop` | lista | - | `Any` | Quitar ultimo |
| `dict.claves()` | `keys` | dict | - | `[String]` | Obtener claves |
| `dict.valores()` | `values` | dict | - | `[Any]` | Obtener valores |
| `c.contiene(v)` | `contains` | cualquiera | `v: Any` | `Bool` | Verificar contenido |

### Operaciones Funcionales

| Metodo | Alias Ingles | Receptor | Parametros | Retorna | Descripcion |
|--------|--------------|----------|------------|---------|-------------|
| `lista.mapear(fn)` | `map` | lista | `fn: (T) -> U` | `[U]` | Transformar cada uno |
| `lista.filtrar(fn)` | `filter` | lista | `fn: (T) -> Bool` | `[T]` | Mantener coincidentes |
| `lista.reducir(fn, init?)` | `reduce` | lista | `fn: (A, T) -> A` | `A` | Agregar |
| `lista.ordenar(cmp?)` | `sort` | lista | `cmp?: (T, T) -> Int` | `[T]` | Ordenar |
| `lista.invertir()` | `reverse` | lista | - | `[T]` | Invertir orden |
| `lista.cortar(inicio, fin?)` | `slice` | lista | `inicio, fin?: Int` | `[T]` | Extraer rango |
| `lista.encontrar(fn)` | `find` | lista | `fn: (T) -> Bool` | `T?` | Primera coincidencia |
| `lista.cada(fn)` | `every` | lista | `fn: (T) -> Bool` | `Bool` | Todos coinciden |
| `lista.alguno(fn)` | `some` | lista | `fn: (T) -> Bool` | `Bool` | Alguno coincide |
| `lista.aplanar()` | `flatten` | lista | - | `[T]` | Aplanar un nivel |

---

## Operaciones Basicas

### `c.longitud()`

Obtiene el numero de elementos en una coleccion. `len()` es un alias.

**Funciona en:** lista, dict, tupla, texto

```crespi
mostrar([1, 2, 3].longitud())       // 3
mostrar(["a": 1, "b": 2].longitud())  // 2
mostrar((1, 2, 3).longitud())       // 3
mostrar("Hola".longitud())          // 4
mostrar([].len())                    // 0
```

---

### `lista.agregar(valor)`

Agrega un elemento al final de una lista. **Modifica la lista original.**

```crespi
variable numeros = [1, 2, 3]
numeros.agregar(4)
numeros.agregar(5)
mostrar(numeros)  // [1, 2, 3, 4, 5]

// Construir una lista dinamicamente
variable resultado = []
para i en 1..5 {
    resultado.agregar(i * i)
}
mostrar(resultado)  // [1, 4, 9, 16]
```

---

### `lista.quitar()`

Quita y retorna el ultimo elemento. **Modifica la lista original.**

**Errores:** Lanza error si la lista esta vacia.

```crespi
variable pila = [1, 2, 3]
variable ultimo = pila.quitar()
mostrar(ultimo)  // 3
mostrar(pila)    // [1, 2]

// Operaciones de pila
variable ops = ["a", "b", "c"]
mientras ops.longitud() > 0 {
    mostrar(ops.quitar())
}
// Imprime: c, b, a
```

---

### `dict.claves()` / `dict.valores()`

Obtiene todas las claves o valores de un diccionario como lista.

```crespi
variable persona = ["nombre": "Ana", "edad": 25, "ciudad": "Madrid"]

mostrar(persona.claves())    // [nombre, edad, ciudad]
mostrar(persona.valores())   // [Ana, 25, Madrid]

// Iterar sobre entradas
para clave en persona.claves() {
    mostrar("$clave: ${persona[clave]}")
}
```

---

### `c.contiene(valor)`

Verifica si una coleccion contiene un valor.

- **Listas:** Verifica si el valor esta en la lista
- **Dicts:** Verifica si el valor es una **clave** (no un valor)
- **Textos:** Verifica si existe la subcadena

```crespi
variable nums = [1, 2, 3, 4, 5]
mostrar(nums.contiene(3))    // true
mostrar(nums.contiene(10))   // false

variable dict = ["a": 1, "b": 2]
mostrar(dict.contiene("a"))  // true (verifica claves)
mostrar(dict.contiene("c"))  // false

variable texto = "Hola Mundo"
mostrar(texto.contiene("Mundo"))  // true
```

---

## Operaciones Funcionales

### `lista.mapear(fn)`

Aplica una funcion a cada elemento, retornando una nueva lista.

```crespi
variable nums = [1, 2, 3, 4]

// Duplicar cada numero
mostrar(nums.mapear { n -> n * 2 })  // [2, 4, 6, 8]

// Convertir a textos
mostrar(nums.mapear { n -> texto(n) })  // ["1", "2", "3", "4"]

// Con funcion nombrada
funcion cuadrado(n: Int) -> Int { retornar n * n }
mostrar(nums.mapear(cuadrado))  // [1, 4, 9, 16]
```

---

### `lista.filtrar(fn)`

Mantiene solo elementos donde el predicado retorna verdadero.

```crespi
variable nums = [1, 2, 3, 4, 5, 6]

// Mantener numeros pares
mostrar(nums.filtrar { n -> n % 2 == 0 })  // [2, 4, 6]

// Mantener numeros mayores que 3
mostrar(nums.filtrar { n -> n > 3 })  // [4, 5, 6]

// Eliminar textos vacios
variable palabras = ["hola", "", "mundo", ""]
mostrar(palabras.filtrar { w -> w.longitud() > 0 })  // [hola, mundo]
```

---

### `lista.reducir(fn, inicial?)`

Reduce una lista a un solo valor aplicando una funcion acumulativamente.

**Parametros:**
- `fn: (acumulador, actual) -> acumulador` - Funcion reductora
- `inicial?` - Valor inicial opcional (usa primer elemento si se omite)

```crespi
variable nums = [1, 2, 3, 4, 5]

// Suma
mostrar(nums.reducir({ a, b -> a + b }, 0))  // 15

// Producto
mostrar(nums.reducir({ a, b -> a * b }, 1))  // 120

// Maximo (sin inicial)
mostrar(nums.reducir { a, b -> si a > b { a } sino { b } })  // 5

// Construir texto
variable palabras = ["Hola", "Mundo"]
mostrar(palabras.reducir { a, b -> a + " " + b })  // "Hola Mundo"
```

---

### `lista.ordenar(comparador?)`

Ordena una lista. Opcionalmente proporcionar una funcion comparadora.

**Comparador:** `(a, b) -> Int`
- Retorna negativo si `a < b`
- Retorna cero si `a == b`
- Retorna positivo si `a > b`

```crespi
variable nums = [3, 1, 4, 1, 5]
mostrar(nums.ordenar())  // [1, 1, 3, 4, 5]

// Orden descendente
mostrar(nums.ordenar { a, b -> b - a })  // [5, 4, 3, 1, 1]

// Ordenar textos
variable palabras = ["banana", "manzana", "cereza"]
mostrar(palabras.ordenar())  // [banana, cereza, manzana]

// Ordenar por longitud
mostrar(palabras.ordenar { a, b -> a.longitud() - b.longitud() })
```

---

### `lista.invertir()`

Retorna una nueva lista con elementos en orden inverso.

```crespi
variable nums = [1, 2, 3, 4, 5]
mostrar(nums.invertir())  // [5, 4, 3, 2, 1]
```

---

### `lista.cortar(inicio, fin?)`

Extrae una porcion de la lista desde `inicio` (inclusivo) hasta `fin` (exclusivo).

```crespi
variable nums = [0, 1, 2, 3, 4, 5]

mostrar(nums.cortar(2, 5))  // [2, 3, 4]
mostrar(nums.cortar(3))     // [3, 4, 5]
mostrar(nums.cortar(0, 2))  // [0, 1]
```

---

### `lista.encontrar(fn)`

Retorna el primer elemento que coincide con el predicado, o `nulo` si ninguno.

```crespi
variable nums = [1, 2, 3, 4, 5]

mostrar(nums.encontrar { n -> n > 3 })   // 4
mostrar(nums.encontrar { n -> n > 10 })  // null
```

---

### `lista.cada(fn)` / `lista.alguno(fn)`

Verifica si todos/alguno de los elementos satisfacen un predicado.

```crespi
variable nums = [2, 4, 6, 8]

// Todos pares?
mostrar(nums.cada { n -> n % 2 == 0 })  // true

// Alguno mayor que 5?
mostrar(nums.alguno { n -> n > 5 })  // true
```

---

### `lista.aplanar()`

Aplana listas anidadas un nivel.

```crespi
variable anidado = [[1, 2], [3, 4], [5]]
mostrar(anidado.aplanar())  // [1, 2, 3, 4, 5]
```

---

## Encadenar Metodos

Los metodos se pueden encadenar para transformaciones poderosas:

```crespi
variable datos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Obtener suma de cuadrados de numeros pares
variable resultado = datos
    .filtrar { n -> n % 2 == 0 }           // [2, 4, 6, 8, 10]
    .mapear { n -> n * n }                  // [4, 16, 36, 64, 100]
    .reducir({ a, b -> a + b }, 0)          // 220

mostrar(resultado)  // 220
```

---

## Ver Tambien

- [std.string](string.md) - Metodos de texto incluyendo `unir`
- [Tipos de Datos](../tipos.md) - Tipos List, Dict, Tuple
- [Biblioteca Estandar](index.md) - Todos los modulos
