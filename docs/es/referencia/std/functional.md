# std.functional

> **Idioma:** Espanol | [English](../../../en/reference/std/functional.md)

---

Utilidades de programacion funcional incluyendo memorizacion y sugerencias de compilador.

## Importacion

```crespi
importar std.functional { memorizar, inline }
```

O usar directamente sin importar (disponible globalmente).

---

## Referencia Rapida

| Funcion | Parametros | Retorna | Descripcion |
|---------|------------|---------|-------------|
| `memorizar(fn)` | `fn: Function` | `Function` | Envolver con cache |
| `inline(fn)` | `fn: Function` | `Function` | Sugerencia para inlining |

---

## Funciones

### `memorizar(fn)`

Crea una version memorizada de una funcion. La funcion memorizada cachea resultados basados en argumentos, evitando calculos redundantes.

**Parametros:**
- `fn: Function` - La funcion a memorizar

**Retorna:** Una nueva funcion con cache

**Ejemplo:**

```crespi
// Fibonacci sin memorizacion (lento para n grande)
funcion fib(n: Int) -> Int {
    si n <= 1 { retornar n }
    retornar fib(n - 1) + fib(n - 2)
}

// Crear version memorizada
variable fib_rapido = memorizar(fib)

mostrar(fib_rapido(40))  // Rapido! Retorna 102334155
```

### Decorador `@memorizar`

La forma recomendada de usar memorizacion es mediante la sintaxis de decorador:

```crespi
@memorizar
funcion fibonacci(n: Int) -> Int {
    si n <= 1 { retornar n }
    retornar fibonacci(n - 1) + fibonacci(n - 2)
}

mostrar(fibonacci(50))  // Eficiente gracias al cache
```

### Como Funciona

El cache usa los argumentos de la funcion como claves:

```crespi
@memorizar
funcion costoso(x: Int, y: Int) -> Int {
    mostrar("Calculando...")
    retornar x * y
}

mostrar(costoso(3, 4))  // "Calculando..." luego 12
mostrar(costoso(3, 4))  // 12 (cacheado, sin "Calculando...")
mostrar(costoso(5, 6))  // "Calculando..." luego 30 (nuevos args)
```

### Casos de Uso

**Algoritmos recursivos:**

```crespi
@memorizar
funcion contar_formas(n: Int) -> Int {
    si n < 0 { retornar 0 }
    si n == 0 { retornar 1 }
    retornar contar_formas(n - 1) + contar_formas(n - 2) + contar_formas(n - 3)
}

mostrar(contar_formas(30))  // Rapido con memorizacion
```

**Calculos costosos:**

```crespi
@memorizar
funcion obtener_datos_usuario(id_usuario: Int) {
    // Operacion costosa simulada
    mostrar("Obteniendo datos del usuario $id_usuario...")
    retornar ["id": id_usuario, "nombre": "Usuario $id_usuario"]
}

// Primera llamada obtiene
variable datos1 = obtener_datos_usuario(42)

// Segunda llamada usa cache
variable datos2 = obtener_datos_usuario(42)  // Sin obtener, retorna cacheado
```

### Limitaciones

- El cache crece sin limite (sin desalojo)
- Los argumentos deben ser hasheables (primitivos, textos)
- Los efectos secundarios solo ocurren en la primera llamada

---

### `inline(fn)`

Sugiere al compilador nativo que una funcion deberia ser inlined en los puntos de llamada.

**Nota:** Esto es un no-op en el interprete. Solo afecta codigo compilado.

**Parametros:**
- `fn: Function` - La funcion a inlinear

**Retorna:** La funcion misma

### Decorador `@inline`

La forma recomendada de usar esta caracteristica:

```crespi
@inline
funcion sumar(a: Int, b: Int) -> Int {
    retornar a + b
}

// En codigo compilado, la llamada se reemplaza con la suma directamente
variable suma = sumar(10, 20)
```

### Cuando Usar `@inline`

Usar para funciones pequenas, llamadas frecuentemente donde la sobrecarga de una llamada de funcion es significativa:

```crespi
@inline
funcion cuadrado(x: Int) -> Int {
    retornar x * x
}

@inline
funcion es_par(n: Int) -> Bool {
    retornar n % 2 == 0
}

// Estos seran inlined en codigo compilado
variable resultado = cuadrado(5)  // Se convierte en: 5 * 5
variable par = es_par(4)          // Se convierte en: 4 % 2 == 0
```

### Cuando NO Usar `@inline`

- Funciones grandes (aumenta tamano del codigo)
- Funciones recursivas (no se puede inlinear recursion)
- Funciones llamadas raramente

---

## Combinando Decoradores

Puedes usar multiples decoradores juntos:

```crespi
@memorizar
funcion factorial(n: Int) -> Int {
    si n <= 1 { retornar 1 }
    retornar n * factorial(n - 1)
}

// Nota: @inline y @memorizar juntos no tiene sentido
// porque memorizar envuelve la funcion, derrotando el inlining
```

---

## Ejemplos Practicos

### Programacion Dinamica

```crespi
// Subsecuencia Comun Mas Larga
@memorizar
funcion lcs(s1: String, s2: String, i: Int, j: Int) -> Int {
    si i == 0 o j == 0 {
        retornar 0
    }

    si s1.subcadena(i - 1, i) == s2.subcadena(j - 1, j) {
        retornar 1 + lcs(s1, s2, i - 1, j - 1)
    }

    retornar maximo(lcs(s1, s2, i - 1, j), lcs(s1, s2, i, j - 1))
}

variable resultado = lcs("ABCDGH", "AEDFHR", 6, 6)
mostrar(resultado)  // 3 (ADH)
```

### Problema de Cambio de Monedas

```crespi
@memorizar
funcion min_monedas(monedas: [Int], monto: Int) -> Int {
    si monto == 0 { retornar 0 }
    si monto < 0 { retornar 999999 }

    variable mejor = 999999
    para moneda en monedas {
        variable resultado = min_monedas(monedas, monto - moneda)
        si resultado + 1 < mejor {
            mejor = resultado + 1
        }
    }
    retornar mejor
}

variable monedas = [1, 5, 10, 25]
mostrar(min_monedas(monedas, 63))  // 6 (25+25+10+1+1+1)
```

### Inlining de Helpers

```crespi
@inline
funcion limitar(valor: Int, min_val: Int, max_val: Int) -> Int {
    si valor < min_val { retornar min_val }
    si valor > max_val { retornar max_val }
    retornar valor
}

@inline
funcion interpolar(a: Float, b: Float, t: Float) -> Float {
    retornar a + (b - a) * t
}

// Estos helpers pequenos son buenos candidatos para inlining
variable limitado = limitar(150, 0, 100)  // 100
variable interpolado = interpolar(0.0, 100.0, 0.5)  // 50.0
```

---

## Ver Tambien

- [Biblioteca Estandar](index.md) - Todos los modulos
- [Funciones](../../../es/guia/funciones.md) - Sintaxis de funciones
