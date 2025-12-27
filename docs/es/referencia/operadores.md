# Operadores

> **Idioma:** Español | [English](../../en/reference/operators.md)

---

Crespi soporta operadores en forma simbólica y textual. Ambas formas son equivalentes y pueden mezclarse libremente.

## Operadores Aritméticos

| Símbolo | Palabra | Descripción | Ejemplo |
|---------|---------|-------------|---------|
| `+` | `mas` | Suma | `5 + 3` o `5 mas 3` |
| `-` | `menos` | Resta | `10 - 4` o `10 menos 4` |
| `*` | `por` | Multiplicación | `6 * 7` o `6 por 7` |
| `/` | `entre` | División | `20 / 4` o `20 entre 4` |
| `%` | `modulo` | Módulo (resto) | `17 % 5` o `17 modulo 5` |

### Ejemplos

```crespi
variable a = 10
variable b = 3

mostrar(a + b)       // 13
mostrar(a mas b)     // 13 (equivalente)

mostrar(a - b)       // 7
mostrar(a menos b)   // 7 (equivalente)

mostrar(a * b)       // 30
mostrar(a por b)     // 30 (equivalente)

mostrar(a / b)       // 3 (división entera si ambos son enteros)
mostrar(a entre b)   // 3 (equivalente)

mostrar(a % b)       // 1
mostrar(a modulo b)  // 1 (equivalente)
```

### División

La división entre enteros produce un entero (división entera). Para obtener un decimal, al menos uno de los operandos debe ser decimal:

```crespi
mostrar(10 / 3)      // 3 (división entera)
mostrar(10.0 / 3)    // 3.333... (división decimal)
mostrar(10 / 3.0)    // 3.333... (división decimal)
```

---

## Operadores de Comparación

| Símbolo | Palabra | Descripción | Ejemplo |
|---------|---------|-------------|---------|
| `<` | `menorQue` | Menor que | `3 < 5` o `3 menorQue 5` |
| `>` | `mayorQue` | Mayor que | `5 > 3` o `5 mayorQue 3` |
| `<=` | `menorOIgual` | Menor o igual | `3 <= 3` o `3 menorOIgual 3` |
| `>=` | `mayorOIgual` | Mayor o igual | `5 >= 5` o `5 mayorOIgual 5` |
| `==` | `igualA` | Igual a | `5 == 5` o `5 igualA 5` |
| `!=` | `diferenteDe` | Diferente de | `3 != 5` o `3 diferenteDe 5` |

### Ejemplos

```crespi
variable x = 10
variable y = 5

// Comparaciones numéricas
mostrar(x > y)           // verdadero
mostrar(x mayorQue y)    // verdadero (equivalente)

mostrar(x < y)           // falso
mostrar(x menorQue y)    // falso (equivalente)

mostrar(x >= 10)         // verdadero
mostrar(x mayorOIgual 10) // verdadero (equivalente)

mostrar(x == y)          // falso
mostrar(x igualA y)      // falso (equivalente)

mostrar(x != y)          // verdadero
mostrar(x diferenteDe y) // verdadero (equivalente)
```

### Comparación de Texto

```crespi
variable nombre = "Ana"

mostrar(nombre == "Ana")      // verdadero
mostrar(nombre igualA "Ana")  // verdadero

mostrar(nombre != "Luis")     // verdadero
```

---

## Operadores Lógicos

| Símbolo | Palabra | Descripción | Ejemplo |
|---------|---------|-------------|---------|
| `&&` | `and` | Y lógico | `verdadero and falso` |
| `\|\|` | `or` | O lógico | `verdadero or falso` |
| `!` | `no` | Negación | `!verdadero` o `no verdadero` |
| `??` | - | Coalescencia nula (usa la derecha si la izquierda es `nada`) | `nada ?? 5` |

### Cortocircuito

Los operadores `and`, `or` y `??` usan evaluación de cortocircuito:
- `and`: Si el primer operando es `falso`, no evalúa el segundo
- `or`: Si el primer operando es `verdadero`, no evalúa el segundo
- `??`: Si el primer operando no es `nada`, no evalúa el segundo

### Ejemplos

```crespi
// AND - ambos deben ser verdaderos
mostrar(verdadero and verdadero)   // verdadero
mostrar(verdadero and falso)       // falso
mostrar(falso and verdadero)       // falso

// OR - al menos uno debe ser verdadero
mostrar(verdadero or falso)        // verdadero
mostrar(falso or falso)            // falso

// NOT - invierte el valor
mostrar(!verdadero)                // falso
mostrar(!falso)                    // verdadero
mostrar(no verdadero)              // falso (equivalente)

// COALESCENCIA NULA - valor por defecto cuando es nada
mostrar(nada ?? 5)                 // 5
mostrar(0 ?? 5)                    // 0
```

---

## Operadores de Bits

| Símbolo | Descripción | Ejemplo |
|---------|-------------|---------|
| `&` | AND de bits | `5 & 3` (= 1) |
| `\|` | OR de bits | `5 \| 3` (= 7) |
| `^` | XOR de bits | `5 ^ 3` (= 6) |
| `<<` | Desplazamiento izquierda | `1 << 4` (= 16) |
| `>>` | Desplazamiento derecha | `16 >> 2` (= 4) |
| `~` | NOT de bits (complemento a uno) | `~0` (= -1) |

Los operadores de bits solo funcionan con números enteros.

### Ejemplos

```crespi
// AND de bits - bits que son 1 en ambos
mostrar(5 & 3)    // 1  (101 & 011 = 001)

// OR de bits - bits que son 1 en cualquiera
mostrar(5 | 3)    // 7  (101 | 011 = 111)

// XOR de bits - bits que difieren
mostrar(5 ^ 3)    // 6  (101 ^ 011 = 110)

// Desplazamiento izquierda - multiplica por 2^n
mostrar(1 << 4)   // 16 (1 corrido 4 = 10000)

// Desplazamiento derecha - divide por 2^n
mostrar(16 >> 2)  // 4  (10000 corrido 2 = 100)

// NOT de bits - invierte todos los bits
mostrar(~0)       // -1
mostrar(~~5)      // 5  (doble negación devuelve el original)
```

---

## Operador Condicional

El operador ternario elige entre dos valores segun una condicion:

```crespi
variable edad = 20
variable estado = edad >= 18 ? "adulto" : "menor"
mostrar(estado)
```

Forma alternativa (requiere bloques `{}` y sin parentesis en la condicion):

```crespi
variable estado = si edad >= 18 { "adulto" } o { "menor" }
```

Las expresiones de bloque son obligatorias en las ramas. La ultima instruccion es el resultado:

```crespi
variable estado = si edad >= 18 {
    variable etiqueta = "adulto"
    etiqueta
} o {
    "menor"
}
```

---

## Guardia (`asegura`)

`asegura` obliga un retorno temprano si la condicion es falsa. El bloque `o { ... }`
es un bloque de expresion y su ultima instruccion es el valor retornado.

```crespi
bloque dividir(a, b) {
    asegura b != 0 o { "division por cero" }
    resultado a / b
}
```

Estilo guard-let: vincula un valor solo si no es `nada`:

```crespi
bloque sumar_uno(valor) {
    asegura variable x = valor o { "nada" }
    resultado x + 1
}
```

// Combinaciones
variable edad = 25
variable estudiante = verdadero

si edad >= 18 && estudiante {
    mostrar("Adulto estudiante")
}

si edad < 18 || estudiante {
    mostrar("Menor o estudiante")
}
```

---

## Operadores de Incremento y Decremento

Crespi soporta los operadores de incremento (`++`) y decremento (`--`) postfijos. Estos son operadores de nivel de sentencia que modifican una variable.

| Operador | Descripción | Ejemplo |
|----------|-------------|---------|
| `++` | Incremento postfijo | `i++` (equivale a `i += 1`) |
| `--` | Decremento postfijo | `i--` (equivale a `i -= 1`) |

```crespi
variable i = 0
i++
mostrar(i) // 1
i--
mostrar(i) // 0
```

---

## Operadores de Asignación

| Operador | Descripción | Equivalente |
|----------|-------------|-------------|
| `=` | Asignación | - |
| `+=` | Suma y asigna | `x = x + valor` |
| `-=` | Resta y asigna | `x = x - valor` |
| `*=` | Multiplica y asigna | `x = x * valor` |
| `/=` | Divide y asigna | `x = x / valor` |

### Ejemplos

```crespi
variable x = 10

x += 5     // x = 15
x -= 3     // x = 12
x *= 2     // x = 24
x /= 4     // x = 6

mostrar(x)  // 6
```

---

## Operador Unario Negativo

El operador `-` puede usarse para negar un número:

```crespi
variable positivo = 5
variable negativo = -positivo

mostrar(negativo)    // -5
mostrar(-10)         // -10
mostrar(--5)         // 5 (doble negación)
```

---

## Operadores de Acceso

### Acceso a Índice `[]`

Accede a elementos de listas y diccionarios:

```crespi
variable lista = [10, 20, 30]
mostrar(lista[0])     // 10
mostrar(lista[2])     // 30
mostrar(lista[-1])    // 30 (último elemento)

variable dict = {"nombre": "Ana", "edad": 25}
mostrar(dict["nombre"])  // Ana
```

### Acceso a Propiedad `.`

Accede a propiedades y métodos de objetos:

```crespi
tipo Punto(immutable x, immutable y) {
}

variable p = Punto(3, 4)
mostrar(p.x)    // 3
mostrar(p.y)    // 4
```

### Llamada a Función `()`

Invoca una función con argumentos:

```crespi
bloque suma(a, b) {
    resultado a + b
}

mostrar(suma(3, 5))   // 8
mostrar(suma(1, 2))   // 3
```

---

## Precedencia de Operadores

De menor a mayor precedencia:

| Nivel | Operadores | Asociatividad |
|-------|------------|---------------|
| 1 | `??` (coalescencia nula) | Izquierda |
| 2 | `or`, `\|\|` | Izquierda |
| 3 | `and`, `&&` | Izquierda |
| 4 | `|` (OR de bits) | Izquierda |
| 5 | `^` (XOR de bits) | Izquierda |
| 6 | `&` (AND de bits) | Izquierda |
| 7 | `==`, `!=`, `igualA`, `diferenteDe` | Izquierda |
| 8 | `<`, `>`, `<=`, `>=`, `in`, `menorQue`, etc. | Izquierda |
| 9 | `<<`, `>>` (desplazamiento) | Izquierda |
| 10 | `+`, `-`, `mas`, `menos` | Izquierda |
| 11 | `*`, `/`, `%`, `por`, `entre`, `modulo` | Izquierda |
| 12 | `!`, `no`, `-` (unario), `~` (NOT de bits) | Derecha |
| 13 | `.`, `[]`, `()`, `++`, `--` | Izquierda |

### Ejemplos de Precedencia

```crespi
// Multiplicación antes que suma
mostrar(2 + 3 * 4)     // 14, no 20

// Paréntesis para cambiar orden
mostrar((2 + 3) * 4)   // 20

// AND antes que OR
mostrar(verdadero || falso && falso)  // verdadero
// Equivale a: verdadero || (falso && falso)

// Comparación antes que lógicos
mostrar(5 > 3 && 2 < 4)  // verdadero
// Equivale a: (5 > 3) && (2 < 4)
```

---

## Concatenación de Texto

El operador `+` también concatena textos:

```crespi
variable saludo = "Hola, " + "Mundo"
mostrar(saludo)    // Hola, Mundo

variable nombre = "Ana"
mostrar("Bienvenida, " + nombre + "!")  // Bienvenida, Ana!
```

Para concatenar números con texto, usa la función `texto()`:

```crespi
variable edad = 25
mostrar("Tengo " + texto(edad) + " años")  // Tengo 25 años
```

---

## Ver También

- [Palabras Clave](palabras-clave.md)
- [Tipos de Datos](tipos.md)
- [Funciones Integradas](funciones.md)
