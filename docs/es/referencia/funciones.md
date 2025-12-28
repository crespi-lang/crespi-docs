# Funciones Integradas

> **Idioma:** Español | [English](../../en/reference/functions.md)

---

Crespi incluye funciones integradas disponibles globalmente. Los nombres en inglés son canónicos; los paquetes de idioma proveen alias localizados que se normalizan durante el escaneo.

Los helpers de colecciones y texto se exponen como **métodos** sobre el receptor (por ejemplo `lista.longitud()`, `texto.recortar()`, `diccionario.claves()`), no como funciones globales.

## Tabla de Referencia

### Funciones Base (Globales)

| Función | Inglés (canónico) | Parámetros | Retorno | Descripción |
|---------|-------------------|------------|---------|-------------|
| `mostrar` | `print` | valor | `nada` | Imprime un valor en la salida |
| `leer` | `read` | - | `texto` | Lee una línea de la entrada |
| `tipo_de` | `typeof` | valor | `texto` | Obtiene el nombre del tipo |
| `texto` | `str` | valor | `texto` | Convierte a texto |
| `entero` | `int` | valor | `entero` | Convierte a entero |
| `decimal` | `float` | valor | `decimal` | Convierte a decimal |
| `memorizar` | `memoize` | función | `función` | Crea función memorizada |
| `inline` | `inline` | función | `función` | Sugiere al compilador inyectar código (no-op en intérprete) |

### Métodos Primitivos (Colecciones y Texto)

| Método | Inglés (canónico) | Receptor | Parámetros | Retorno | Descripción |
|--------|-------------------|----------|------------|---------|-------------|
| `longitud` / `len` | `length` | texto/lista/tupla/diccionario | - | `entero` | Obtiene la longitud |
| `agregar` | `push` | lista | valor | `nada` | Añade al final de la lista |
| `quitar` | `pop` | lista | - | valor | Elimina y retorna el último |
| `claves` | `keys` | diccionario | - | `lista` | Obtiene las claves |
| `valores` | `values` | diccionario | - | `lista` | Obtiene los valores |
| `contiene` | `contains` | texto/lista/diccionario | valor | `booleano` | Verifica si contiene |

### Funciones Matemáticas

| Función | Inglés (canónico) | Parámetros | Retorno | Descripción |
|---------|-------------------|------------|---------|-------------|
| `absoluto` | `abs` | número | `número` | Valor absoluto |
| `signo` | `sign` | número | `entero` | Signo de un número (-1, 0, 1) |
| `raiz` | `sqrt` | número | `decimal` | Raíz cuadrada |
| `raiz_cubica` | `cbrt` | número | `decimal` | Raíz cúbica |
| `potencia` | `pow` | base, exp | `decimal` | Potencia |
| `redondear` | `round` | número | `entero` | Redondea al entero más cercano |
| `piso` | `floor` | número | `entero` | Redondea hacia abajo |
| `techo` | `ceil` | número | `entero` | Redondea hacia arriba |
| `truncar` | `truncate` | número | `entero` | Trunca hacia cero |
| `minimo` | `min` | lista o número, número | `número` | Valor mínimo |
| `maximo` | `max` | lista o número, número | `número` | Valor máximo |
| `aleatorio` | `random` | - | `decimal` | Número aleatorio (0.0–1.0) |
| `semilla_aleatoria` | `random_seed` | semilla | `nada` | Fija la semilla del RNG para resultados deterministas |
| `seno` | `sin` | número | `decimal` | Seno (radianes) |
| `coseno` | `cos` | número | `decimal` | Coseno (radianes) |
| `tangente` | `tan` | número | `decimal` | Tangente (radianes) |
| `aseno` | `asin` | número | `decimal` | Arcoseno |
| `acoseno` | `acos` | número | `decimal` | Arcocoseno |
| `atangente` | `atan` | número | `decimal` | Arcotangente |
| `atangente2` | `atan2` | y, x | `decimal` | Arcotangente de dos argumentos |
| `exponencial` | `exp` | número | `decimal` | e^x |
| `logaritmo_natural` | `ln` | número | `decimal` | Logaritmo natural |
| `logaritmo10` | `log10` | número | `decimal` | Logaritmo base 10 |
| `logaritmo2` | `log2` | número | `decimal` | Logaritmo base 2 |
| `hipotenusa` | `hypot` | x, y | `decimal` | sqrt(x^2 + y^2) |
| `pi` | `pi` | - | `decimal` | Constante π (llamar como `pi()`) |
| `e` | `e` | - | `decimal` | Número de Euler (llamar como `e()`) |

### Métodos de Texto

| Función | Inglés (canónico) | Parámetros | Retorno | Descripción |
|---------|-------------------|------------|---------|-------------|
| `dividir` | `split` | delimitador | `lista` | Divide el texto por delimitador |
| `recortar` | `trim` | - | `texto` | Recorta espacios |
| `mayusculas` | `uppercase` | - | `texto` | Texto en mayúsculas |
| `minusculas` | `lowercase` | - | `texto` | Texto en minúsculas |
| `subcadena` | `substring` | inicio, fin? | `texto` | Toma una porción por índice |
| `reemplazar` | `replace` | anterior, nuevo | `texto` | Reemplaza todas las coincidencias |
| `empieza_con` | `starts_with` | prefijo | `booleano` | Verifica prefijo |
| `termina_con` | `ends_with` | sufijo | `booleano` | Verifica sufijo |
| `indice_de` | `index_of` | subcadena | `entero` | Índice o -1 |
| `unir` | `join` | separador | `texto` | Une lista en texto (en listas) |

### Métodos de Colecciones

| Función | Inglés (canónico) | Parámetros | Retorno | Descripción |
|---------|-------------------|------------|---------|-------------|
| `mapear` | `map` | función | `lista` | Mapea elementos |
| `filtrar` | `filter` | función | `lista` | Filtra elementos |
| `reducir` | `reduce` | función, inicial? | valor | Reduce a un valor |
| `ordenar` | `sort` | comparador? | `lista` | Ordena lista |
| `invertir` | `reverse` | - | `lista` | Invierte el orden |
| `cortar` | `slice` | inicio, fin? | `lista` | Corta un segmento |
| `encontrar` | `find` | función | valor | Primer match o nada |
| `cada` | `every` | función | `booleano` | Todos cumplen |
| `alguno` | `some` | función | `booleano` | Alguno cumple |
| `aplanar` | `flatten` | - | `lista` | Aplana un nivel |

---

## Entrada/Salida

### `mostrar(valor)`

Imprime un valor en la salida estándar.

**Parámetros:**
- `valor` - Cualquier valor a mostrar

**Retorna:** `nada`

```crespi
mostrar("Hola, Mundo!")     // Hola, Mundo!
mostrar(42)                  // 42
mostrar(3.14)                // 3.14
mostrar(verdadero)           // verdadero
mostrar([1, 2, 3])           // [1, 2, 3]
mostrar({"a": 1})            // {a: 1}
```

### `leer()`

Lee una línea de texto desde la entrada estándar.

**Parámetros:** Ninguno

**Retorna:** `texto` - La línea leída (sin salto de línea final)

```crespi
mostrar("¿Cómo te llamas?")
variable nombre = leer()
mostrar("Hola, " + nombre + "!")

// Entrada: Ana
// Salida: Hola, Ana!
```

---

## Tipos y Conversiones

### `tipo_de(valor)`

Obtiene el nombre del tipo de un valor como texto.

**Parámetros:**
- `valor` - Cualquier valor

**Retorna:** `texto` - Nombre del tipo

| Valor | Resultado |
|-------|-----------|
| `42` | `"entero"` |
| `3.14` | `"decimal"` |
| `"hola"` | `"texto"` |
| `verdadero` | `"booleano"` |
| `nada` | `"nada"` |
| `[1, 2]` | `"lista"` |
| `{"a": 1}` | `"diccionario"` |
| función | `"funcion"` |
| instancia | `"instancia"` |
| tarea | `"tarea"` |

```crespi
mostrar(tipo_de(42))           // entero
mostrar(tipo_de("hola"))       // texto
mostrar(tipo_de([1, 2, 3]))    // lista

bloque suma(a, b) { resultado a + b }
mostrar(tipo_de(suma))         // funcion
```

### `texto(valor)`

Convierte cualquier valor a su representación de texto.

**Parámetros:**
- `valor` - Cualquier valor

**Retorna:** `texto`

```crespi
mostrar(texto(42))              // "42"
mostrar(texto(3.14))            // "3.14"
mostrar(texto(verdadero))       // "verdadero"
mostrar(texto([1, 2, 3]))       // "[1, 2, 3]"

// Útil para concatenación
variable edad = 25
mostrar("Tengo " + texto(edad) + " años")
```

### `entero(valor)`

Convierte un valor a entero.

**Parámetros:**
- `valor` - Valor a convertir (`texto`, `decimal`, `entero`, `booleano`)

**Retorna:** `entero`

**Errores:** Si la conversión no es posible

Los textos deben ser números válidos (sin caracteres extra).

```crespi
mostrar(entero("42"))           // 42
mostrar(entero(3.7))            // 3 (trunca)
mostrar(entero(verdadero))      // 1
mostrar(entero(falso))          // 0

// Error
// entero("abc")  // Error: No se puede convertir 'abc' a entero
```

### `decimal(valor)`

Convierte un valor a número decimal (punto flotante).

**Parámetros:**
- `valor` - Valor a convertir (`texto`, `decimal`, `entero`)

**Retorna:** `decimal`

**Errores:** Si la conversión no es posible

Los textos deben ser números válidos (sin caracteres extra).

```crespi
mostrar(decimal("3.14"))        // 3.14
mostrar(decimal(42))            // 42.0
mostrar(decimal("42"))          // 42.0

// Error
// decimal("abc")  // Error: No se puede convertir 'abc' a decimal
```

---

## Colecciones

### `colección.longitud()`

Obtiene la cantidad de elementos en una colección.

Para textos, cuenta caracteres Unicode (no bytes). Las cadenas ASCII usan una ruta rápida.
`subcadena()` e `indice_de()` también usan índices de caracteres.
En inglés, la forma canónica es `length` (también `len`).

**Receptor:** `lista`, `diccionario`, `tupla` o `texto`

**Retorna:** `entero` - Número de elementos

**Errores:** Si el tipo no es soportado

```crespi
mostrar([1, 2, 3, 4, 5].longitud())     // 5
mostrar("Hola".longitud())              // 4
mostrar({"a": 1, "b": 2}.longitud())    // 2
mostrar([].len())                        // 0
```

### `lista.agregar(valor)`

Añade un elemento al final de una lista. Modifica la lista original.

**Receptor:** `lista`

**Parámetros:**
- `valor` - El valor a añadir

**Retorna:** `nada`

**Errores:** Si el receptor no es una lista

```crespi
variable numeros = [1, 2, 3]
numeros.agregar(4)
numeros.agregar(5)
mostrar(numeros)   // [1, 2, 3, 4, 5]

variable mixta = []
mixta.agregar("texto")
mixta.agregar(42)
mixta.agregar(verdadero)
mostrar(mixta)     // [texto, 42, verdadero]
```

### `lista.quitar()`

Elimina y retorna el último elemento de una lista. Modifica la lista original.

**Receptor:** `lista`

**Retorna:** El elemento eliminado

**Errores:** Si la lista está vacía o el receptor no es una lista

```crespi
variable numeros = [1, 2, 3, 4, 5]
variable ultimo = numeros.quitar()
mostrar(ultimo)    // 5
mostrar(numeros)   // [1, 2, 3, 4]

// Simular una pila (stack)
variable pila = []
pila.agregar("primero")
pila.agregar("segundo")
mostrar(pila.quitar())   // segundo
mostrar(pila.quitar())   // primero
```

### `diccionario.claves()`

Obtiene todas las claves de un diccionario como una lista.

**Receptor:** `diccionario`

**Retorna:** `lista` de `texto` - Las claves

**Errores:** Si el argumento no es un diccionario

```crespi
variable persona = {
    "nombre": "Ana",
    "edad": 25,
    "ciudad": "Madrid"
}

variable k = persona.claves()
mostrar(k)   // [nombre, edad, ciudad]

// Iterar sobre claves
repetir clave en persona.claves() {
    mostrar(clave + ": " + texto(persona[clave]))
}
```

### `diccionario.valores()`

Obtiene todos los valores de un diccionario como una lista.

**Receptor:** `diccionario`

**Retorna:** `lista` - Los valores

**Errores:** Si el argumento no es un diccionario

```crespi
variable notas = {
    "matematicas": 85,
    "fisica": 90,
    "quimica": 78
}

variable v = notas.valores()
mostrar(v)   // [85, 90, 78]

// Calcular promedio
variable suma = 0
repetir nota en notas.valores() {
    suma += nota
}
variable promedio = suma / notas.longitud()
mostrar(promedio)  // 84
```

### `colección.contiene(valor)`

Verifica si una colección contiene un valor.

**Receptor:** `lista`, `diccionario`, o `texto`

**Parámetros:**
- `valor` - El valor a buscar (para diccionarios, busca en claves)

**Retorna:** `booleano`

**Errores:** Si el tipo de colección no es soportado

```crespi
// En listas
variable numeros = [1, 2, 3, 4, 5]
mostrar(numeros.contiene(3))      // verdadero
mostrar(numeros.contiene(10))     // falso

// En diccionarios (busca en claves)
variable persona = {"nombre": "Ana", "edad": 25}
mostrar(persona.contiene("nombre"))  // verdadero
mostrar(persona.contiene("altura"))  // falso

// En texto (busca subcadena)
variable mensaje = "Hola Mundo"
mostrar(mensaje.contiene("Mundo"))   // verdadero
mostrar(mensaje.contiene("Adios"))   // falso
```

---

## Funciones Avanzadas

### `memorizar(función)`

Crea una versión memorizada de una función. La función memorizada guarda en caché los resultados para evitar cálculos repetidos.

**Parámetros:**
- `función` - La función a memorizar

**Retorna:** Una nueva función con caché

**Errores:** Si el argumento no es una función

```crespi
// Fibonacci sin memorización (lento para números grandes)
bloque fib(n) {
    si n <= 1 {
        resultado n
    }
    resultado fib(n - 1) + fib(n - 2)
}

// Fibonacci con memorización (rápido)
variable fib_memo = memorizar(fib)

mostrar(fib_memo(40))  // Rápido gracias al caché
```

### Decorador `@memorizar`

También puedes usar el decorador `@memorizar` para aplicar memorización automáticamente:

```crespi
@memorizar
bloque fibonacci(n) {
    si n <= 1 {
        resultado n
    }
    resultado fibonacci(n - 1) + fibonacci(n - 2)
}

mostrar(fibonacci(50))  // Eficiente gracias a memorización
```

---

## Sugerencias del Compilador

### `inline(función)`

Sugiere al compilador nativo que el cuerpo de la función debe ser inyectado directamente en el lugar de la llamada (inlining). Esto no tiene efecto en el intérprete, pero puede mejorar el rendimiento en código compilado para funciones pequeñas y frecuentes.

**Parámetros:**
- `función` - La función a inyectar

**Retorna:** La función misma

### Decorador `@inline`

La forma estándar de usar esta característica es mediante el decorador:

```crespi
@inline
bloque sumar(a, b) {
    resultado a + b
}

// En código compilado, esta llamada se reemplaza por la instrucción de suma directamente
variable suma = sumar(10, 20)
```

---

## Funciones Matemáticas

Las funciones matemáticas aceptan enteros o decimales. `minimo`/`maximo` aceptan una lista o dos números. `pi()` y `e()` devuelven constantes (en el intérprete también se pueden usar `PI`/`E`).

```crespi
mostrar(raiz(9))            // 3
mostrar(minimo([3, 1, 2]))  // 1
mostrar(pi())               // 3.14159...
```

## Métodos de Texto

Los índices de texto son por carácter. `subcadena()` e `indice_de()` usan índices de caracteres.

```crespi
mostrar("hola".subcadena(1, 3))    // "ol"
mostrar("cafe".indice_de("fe"))    // 2
mostrar("cafe".empieza_con("ca"))  // verdadero
```

## Métodos de Colecciones

Los métodos de colecciones reciben una función o lambda. `reducir()` acepta un valor inicial opcional y `ordenar()` acepta un comparador opcional.

```crespi
variable numeros = [1, 2, 3, 4]
mostrar(numeros.mapear(n => n * 2))         // [2, 4, 6, 8]
mostrar(numeros.filtrar(n => n % 2 == 0))   // [2, 4]
mostrar(numeros.reducir((a, b) => a + b, 0)) // 10
```

---

## Ejemplos Prácticos

### Validación de Entrada

```crespi
bloque leer_numero() {
    mostrar("Ingresa un número:")
    variable entrada = leer()
    resultado entero(entrada)
}

bloque leer_opcion(opciones) {
    variable opcion = leer()
    si opciones.contiene(opcion) {
        resultado opcion
    } o {
        mostrar("Opción no válida")
        resultado nada
    }
}
```

### Procesamiento de Listas

```crespi
bloque sumar_lista(lista) {
    variable total = 0
    repetir n en lista {
        total += n
    }
    resultado total
}

bloque filtrar_pares(lista) {
    variable resultado_lista = []
    repetir n en lista {
        si n % 2 == 0 {
            resultado_lista.agregar(n)
        }
    }
    resultado resultado_lista
}

variable numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
mostrar(sumar_lista(numeros))        // 55
mostrar(filtrar_pares(numeros))      // [2, 4, 6, 8, 10]
```

### Trabajo con Diccionarios

```crespi
bloque invertir_diccionario(dict) {
    variable invertido = {}
    repetir clave en dict.claves() {
        variable valor = dict[clave]
        invertido[texto(valor)] = clave
    }
    resultado invertido
}

variable idiomas = {"es": "Español", "en": "English"}
mostrar(invertir_diccionario(idiomas))
// {"Español": "es", "English": "en"}
```

---

## Ver También

- [Tipos de Datos](tipos.md)
- [Palabras Clave](palabras-clave.md)
- [Operadores](operadores.md)
