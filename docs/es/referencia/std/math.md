# std.math

> **Idioma:** Espanol | [English](../../../en/reference/std/math.md)

---

Funciones matematicas y constantes.

## Importacion

```crespi
importar std.math { raiz, potencia, seno, coseno, PI }
```

O usar directamente sin importar (disponible globalmente).

---

## Referencia Rapida

### Constantes

| Constante | Valor | Descripcion |
|-----------|-------|-------------|
| `PI` | 3.14159... | Constante matematica pi |
| `E` | 2.71828... | Numero de Euler |

### Funciones Basicas

| Funcion | Alias Espanol | Parametros | Retorna | Descripcion |
|---------|---------------|------------|---------|-------------|
| `abs(x)` | `absoluto` | `x: Number` | `Number` | Valor absoluto |
| `sign(x)` | `signo` | `x: Number` | `Int` | Signo (-1, 0, 1) |
| `sqrt(x)` | `raiz` | `x: Number` | `Float` | Raiz cuadrada |
| `cbrt(x)` | `raiz_cubica` | `x: Number` | `Float` | Raiz cubica |
| `pow(base, exp)` | `potencia` | `base, exp: Number` | `Float` | Potencia |
| `min(a, b?)` | `minimo` | `a, b: Number` o `lista` | `Number` | Minimo |
| `max(a, b?)` | `maximo` | `a, b: Number` o `lista` | `Number` | Maximo |

### Redondeo

| Funcion | Alias Espanol | Parametros | Retorna | Descripcion |
|---------|---------------|------------|---------|-------------|
| `round(x)` | `redondear` | `x: Number` | `Int` | Redondear al mas cercano |
| `floor(x)` | `piso` | `x: Number` | `Int` | Redondear abajo |
| `ceil(x)` | `techo` | `x: Number` | `Int` | Redondear arriba |
| `truncate(x)` | `truncar` | `x: Number` | `Int` | Redondear hacia cero |

### Trigonometria

| Funcion | Alias Espanol | Parametros | Retorna | Descripcion |
|---------|---------------|------------|---------|-------------|
| `sin(x)` | `seno` | `x: Number` | `Float` | Seno (radianes) |
| `cos(x)` | `coseno` | `x: Number` | `Float` | Coseno (radianes) |
| `tan(x)` | `tangente` | `x: Number` | `Float` | Tangente (radianes) |
| `asin(x)` | `aseno` | `x: Number` | `Float` | Arcoseno |
| `acos(x)` | `acoseno` | `x: Number` | `Float` | Arcocoseno |
| `atan(x)` | `atangente` | `x: Number` | `Float` | Arcotangente |
| `atan2(y, x)` | `atangente2` | `y, x: Number` | `Float` | Arcotangente de dos argumentos |

### Exponencial y Logaritmico

| Funcion | Alias Espanol | Parametros | Retorna | Descripcion |
|---------|---------------|------------|---------|-------------|
| `exp(x)` | `exponencial` | `x: Number` | `Float` | e^x |
| `ln(x)` | `logaritmo_natural` | `x: Number` | `Float` | Logaritmo natural |
| `log10(x)` | `logaritmo10` | `x: Number` | `Float` | Logaritmo base-10 |
| `log2(x)` | `logaritmo2` | `x: Number` | `Float` | Logaritmo base-2 |
| `hypot(x, y)` | `hipotenusa` | `x, y: Number` | `Float` | sqrt(x^2 + y^2) |

### Aleatorio

| Funcion | Alias Espanol | Parametros | Retorna | Descripcion |
|---------|---------------|------------|---------|-------------|
| `random()` | `aleatorio` | - | `Float` | Aleatorio 0.0 a 1.0 |
| `random_seed(seed)` | `semilla_aleatoria` | `seed: Int` | `Unit` | Inicializar generador |

---

## Constantes

### `PI`

La constante matematica pi (razon de circunferencia a diametro).

```crespi
mostrar(PI)  // 3.141592653589793

variable radio = 5.0
variable circunferencia = 2 * PI * radio
variable area = PI * radio * radio
mostrar("Circunferencia: $circunferencia")  // 31.41592...
mostrar("Area: $area")                       // 78.53981...
```

### `E`

Numero de Euler (base del logaritmo natural).

```crespi
mostrar(E)  // 2.718281828459045

// Interes compuesto: A = P * e^(rt)
variable principal = 1000.0
variable tasa = 0.05
variable tiempo = 10.0
variable monto = principal * potencia(E, tasa * tiempo)
mostrar("Monto: $monto")  // 1648.72...
```

---

## Funciones Basicas

### `absoluto(x)` / `abs(x)`

Retorna el valor absoluto de un numero.

```crespi
mostrar(absoluto(-5))      // 5
mostrar(absoluto(5))       // 5
mostrar(absoluto(-3.14))   // 3.14
```

### `raiz(x)` / `sqrt(x)`

Retorna la raiz cuadrada de un numero.

```crespi
mostrar(raiz(16))    // 4.0
mostrar(raiz(2))     // 1.4142135...
```

### `potencia(base, exp)` / `pow(base, exp)`

Eleva base a la potencia de exp.

```crespi
mostrar(potencia(2, 10))   // 1024.0
mostrar(potencia(3, 3))    // 27.0
mostrar(potencia(16, 0.5)) // 4.0 (igual que raiz)
```

### `minimo(a, b?)` / `maximo(a, b?)`

Retorna el minimo/maximo de dos valores o una lista.

```crespi
// Dos valores
mostrar(minimo(5, 3))       // 3
mostrar(maximo(5, 3))       // 5

// Lista
mostrar(minimo([4, 1, 7, 2]))  // 1
mostrar(maximo([4, 1, 7, 2]))  // 7
```

---

## Funciones de Redondeo

### `redondear(x)` / `round(x)`

Redondea al entero mas cercano.

```crespi
mostrar(redondear(3.4))   // 3
mostrar(redondear(3.5))   // 4
mostrar(redondear(3.6))   // 4
```

### `piso(x)` / `floor(x)`

Redondea hacia abajo (hacia infinito negativo).

```crespi
mostrar(piso(3.7))   // 3
mostrar(piso(-3.2))  // -4
```

### `techo(x)` / `ceil(x)`

Redondea hacia arriba (hacia infinito positivo).

```crespi
mostrar(techo(3.2))    // 4
mostrar(techo(-3.7))   // -3
```

---

## Funciones Trigonometricas

Todas las funciones trigonometricas trabajan con radianes.

### `seno(x)`, `coseno(x)`, `tangente(x)`

```crespi
mostrar(seno(0))           // 0.0
mostrar(seno(PI / 2))      // 1.0
mostrar(coseno(0))         // 1.0
mostrar(coseno(PI))        // -1.0
mostrar(tangente(PI / 4))  // 1.0
```

---

## Ejemplos Practicos

### Distancia Entre Puntos

```crespi
funcion distancia(x1: Float, y1: Float, x2: Float, y2: Float) -> Float {
    retornar hipotenusa(x2 - x1, y2 - y1)
}

mostrar(distancia(0, 0, 3, 4))  // 5.0
```

### Grados a Radianes

```crespi
funcion grados_a_radianes(grados: Float) -> Float {
    retornar grados * PI / 180
}

funcion radianes_a_grados(radianes: Float) -> Float {
    retornar radianes * 180 / PI
}

mostrar(grados_a_radianes(90))   // 1.5707... (PI/2)
mostrar(radianes_a_grados(PI))   // 180.0
```

### Formula Cuadratica

```crespi
funcion resolver_cuadratica(a: Float, b: Float, c: Float) -> (Float, Float) {
    variable discriminante = b * b - 4 * a * c
    variable sq = raiz(discriminante)
    variable x1 = (-b + sq) / (2 * a)
    variable x2 = (-b - sq) / (2 * a)
    retornar (x1, x2)
}

variable (r1, r2) = resolver_cuadratica(1, -5, 6)
mostrar("x = $r1 o x = $r2")  // x = 3 o x = 2
```

---

## Ver Tambien

- [Biblioteca Estandar](index.md) - Todos los modulos
- [Operadores](../operadores.md) - Operadores aritmeticos
