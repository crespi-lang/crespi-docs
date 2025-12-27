# Características Avanzadas

> **Idioma:** Español | [English](../../en/guide/advanced.md)

---

Este capítulo cubre las características avanzadas de Crespi: memorización, optimización de recursión de cola, y más.

## Memorización

La memorización almacena en caché los resultados de funciones para evitar cálculos repetidos.

### El Decorador `@memorizar`

Aplica memorización automática a una función:

```crespi
@memorizar
bloque fibonacci(n) {
    si n <= 1 {
        resultado n
    }
    resultado fibonacci(n - 1) + fibonacci(n - 2)
}

mostrar(fibonacci(40))  // Rápido gracias al caché
```

### Sin Memorización (Lento)

Sin memorización, Fibonacci calcula los mismos valores muchas veces:

```crespi
// Sin @memorizar - muy lento para n grandes
bloque fib_lento(n) {
    si n <= 1 {
        resultado n
    }
    resultado fib_lento(n - 1) + fib_lento(n - 2)
}

// fib_lento(40) tomaría mucho tiempo
```

### La Función `memorizar()`

También puedes usar la función `memorizar()` directamente:

```crespi
bloque factorial(n) {
    si n <= 1 {
        resultado 1
    }
    resultado n * factorial(n - 1)
}

variable factorial_memo = memorizar(factorial)

mostrar(factorial_memo(100))  // Usa caché
mostrar(factorial_memo(100))  // Recupera del caché instantáneamente
```

### Cuándo Usar Memorización

- Funciones recursivas con subproblemas repetidos
- Funciones puras (sin efectos secundarios)
- Cálculos costosos con los mismos argumentos

```crespi
// Buen ejemplo: cálculo costoso, argumentos repetidos
@memorizar
bloque calcular_ruta(origen, destino) {
    // Simulación de cálculo costoso
    resultado origen + " -> " + destino
}

// Mal ejemplo: función con efectos secundarios
// No usar @memorizar aquí
bloque obtener_hora() {
    // Esto retornaría siempre el mismo valor cacheado
    resultado "hora actual"
}
```

### Con Sintaxis Corta

```crespi
@memorizar
bloque cuadrado(n) = n * n

@memorizar
bloque cubo(n) = n * n * n

mostrar(cuadrado(1000))  // Calculado
mostrar(cuadrado(1000))  // Del caché
```

---

## Expansión de Funciones (Inlining)

La expansión de funciones (inlining) reemplaza las llamadas a funciones con el cuerpo de la función, eliminando la sobrecarga de llamada.

### El Decorador `@inline`

Marca funciones para expandir en tiempo de compilación:

```crespi
@inline
bloque doble(x) {
    resultado x * 2
}

bloque principal() {
    // El compilador reemplaza esto por: res = 21 * 2
    variable res = doble(21)
    mostrar(res)
}
```

### Cuándo Usar `@inline`

- Funciones utilitarias pequeñas llamadas frecuentemente
- Funciones en bucles de alto rendimiento
- Getters/setters simples

```crespi
@inline
bloque cuadrado(n) = n * n

@inline
bloque esPositivo(n) = n > 0

// Buenos candidatos: pequeñas, llamadas frecuentemente
repetir i en rango(1000000) {
    si esPositivo(i) {
        total = total + cuadrado(i)
    }
}
```

### Limitaciones

- Las funciones recursivas nunca se expanden (causaría expansión infinita)
- Las funciones con closures no se expanden
- El decorador no tiene efecto en el intérprete (comportamiento en tiempo de ejecución sin cambios)

### Auto-Inlining (con -O2)

Con nivel de optimización `-O2`, el compilador expande automáticamente funciones pequeñas (≤5 sentencias) incluso sin el decorador:

```crespi
// Esta función se expande automáticamente con -O2
bloque suma(a, b) {
    resultado a + b
}
```

Ver [Documentación del Compilador](compilador.md#niveles-de-optimización) para más detalles.

---

## Optimización de Recursión de Cola (TCO)

Crespi optimiza automáticamente las funciones recursivas de cola, permitiendo recursión profunda sin desbordamiento de pila.

### ¿Qué es Recursión de Cola?

Una llamada recursiva es "de cola" cuando es la última operación de la función:

```crespi
// Recursión de cola - optimizable
bloque factorial_cola(n, acum = 1) {
    si n <= 1 {
        resultado acum
    }
    resultado factorial_cola(n - 1, n * acum)  // Última operación
}

// NO es recursión de cola
bloque factorial_normal(n) {
    si n <= 1 {
        resultado 1
    }
    resultado n * factorial_normal(n - 1)  // Multiplicación después
}
```

### Beneficios del TCO

```crespi
// Sin TCO, esto causaría desbordamiento de pila
// Con TCO, funciona para valores muy grandes

bloque suma_hasta(n, acum = 0) {
    si n <= 0 {
        resultado acum
    }
    resultado suma_hasta(n - 1, acum + n)
}

mostrar(suma_hasta(10000))  // 50005000 - Funciona gracias a TCO
```

### Convertir a Recursión de Cola

Patrón general: usar un acumulador:

```crespi
// Fibonacci con acumuladores (TCO)
bloque fibonacci_cola(n, a = 0, b = 1) {
    si n == 0 {
        resultado a
    }
    si n == 1 {
        resultado b
    }
    resultado fibonacci_cola(n - 1, b, a + b)
}

mostrar(fibonacci_cola(50))  // Rápido y eficiente
```

### Ejemplos de Conversión

**Longitud de lista:**

```crespi
// Normal
bloque longitud_normal(lista) {
    si lista.longitud() == 0 {
        resultado 0
    }
    resultado 1 + longitud_normal(lista)  // No es cola
}

// Con TCO
bloque longitud_cola(lista, acum = 0) {
    si lista.longitud() == 0 {
        resultado acum
    }
    // Simular "resto de lista" - en Crespi hay que iterar
    resultado acum + lista.longitud()  // Simplificado
}
```

**Potencia:**

```crespi
// Normal
bloque potencia(base, exp) {
    si exp == 0 {
        resultado 1
    }
    resultado base * potencia(base, exp - 1)  // No es cola
}

// Con TCO
bloque potencia_cola(base, exp, acum = 1) {
    si exp == 0 {
        resultado acum
    }
    resultado potencia_cola(base, exp - 1, acum * base)  // Es cola
}

mostrar(potencia_cola(2, 20))  // 1048576
```

---

## Funciones de Expresión Única

Sintaxis compacta para funciones simples:

```crespi
// Forma estándar
bloque doble(x) {
    resultado x * 2
}

// Expresión única (equivalente)
bloque doble(x) = x * 2
```

### Múltiples Parámetros

```crespi
bloque suma(a, b) = a + b
bloque promedio(a, b) = (a + b) / 2
bloque maximo(a, b) = si a > b { a } o { b }

// Para lógica compleja, usa la forma estándar
bloque maximo(a, b) {
    si a > b {
        resultado a
    }
    resultado b
}
```

### En Clases

```crespi
tipo Vector(let x, let y) {
    bloque magnitud() = (yo.x * yo.x + yo.y * yo.y)
    bloque escalar(factor) = Vector(yo.x * factor, yo.y * factor)
}
```

### Con Decoradores

```crespi
@memorizar
bloque cuadrado(n) = n * n

@memorizar
bloque fibonacci(n) = si n <= 1 { n } o { fibonacci(n-1) + fibonacci(n-2) }
// Nota: esto no funcionaría, usa la forma estándar para recursión
```

---

## Inserción Automática de Punto y Coma (ASI)

Crespi inserta automáticamente punto y coma al final de las líneas cuando es apropiado.

### Cuándo Funciona

```crespi
// Los puntos y coma son opcionales al final de línea
variable x = 10
variable y = 20
mostrar(x + y)

// Equivalente a:
variable x = 10;
variable y = 20;
mostrar(x + y);
```

### Cuándo Usar Punto y Coma Explícito

Para múltiples sentencias en una línea:

```crespi
variable a = 1; variable b = 2; mostrar(a + b)
```

### Casos Especiales

Las llaves de apertura deben estar en la misma línea:

```crespi
// Correcto
si condicion {
    // código
}

// Podría causar problemas
si condicion
{
    // código
}
```

---

## Closures Avanzados

### Estado Encapsulado

```crespi
bloque crear_modulo() {
    variable _privado = 0

    bloque incrementar() {
        _privado += 1
    }

    bloque obtener() {
        resultado _privado
    }

    bloque establecer(valor) {
        _privado = valor
    }

    resultado {
        "incrementar": incrementar,
        "obtener": obtener,
        "establecer": establecer
    }
}

variable modulo = crear_modulo()
modulo["incrementar"]()
modulo["incrementar"]()
mostrar(modulo["obtener"]())  // 2
```

### Currying

```crespi
bloque curry_suma(a) {
    bloque sumar_b(b) {
        resultado a + b
    }
    resultado sumar_b
}

variable suma_5 = curry_suma(5)
mostrar(suma_5(3))   // 8
mostrar(suma_5(10))  // 15
```

### Memoización Manual

```crespi
bloque crear_cache(funcion) {
    variable cache = {}

    bloque cached(arg) {
        variable clave = texto(arg)

        si cache.contiene(clave) {
            resultado cache[clave]
        }

        variable resultado_val = funcion(arg)
        cache[clave] = resultado_val
        resultado resultado_val
    }

    resultado cached
}

bloque calculo_costoso(n) {
    // Simular cálculo costoso
    resultado n * n
}

variable calculo_cached = crear_cache(calculo_costoso)
mostrar(calculo_cached(100))  // Calcula
mostrar(calculo_cached(100))  // Del caché
```

---

## Funciones de Orden Superior

### Composición de Funciones

```crespi
bloque componer(f, g) {
    bloque compuesta(x) {
        resultado f(g(x))
    }
    resultado compuesta
}

bloque doble(x) = x * 2
bloque incrementar(x) = x + 1

variable doble_e_incrementar = componer(incrementar, doble)
mostrar(doble_e_incrementar(5))  // 11 (5*2 + 1)

variable incrementar_y_doble = componer(doble, incrementar)
mostrar(incrementar_y_doble(5))  // 12 ((5+1) * 2)
```

### Aplicación Parcial

```crespi
bloque parcial(fn, primer_arg) {
    bloque aplicada(segundo_arg) {
        resultado fn(primer_arg, segundo_arg)
    }
    resultado aplicada
}

bloque potencia(base, exp) {
    variable r = 1
    variable i = 0
    mientras i < exp {
        r = r * base
        i += 1
    }
    resultado r
}

variable cuadrado = parcial(potencia, 2)  // base = 2
mostrar(cuadrado(3))  // 2^3 = 8
mostrar(cuadrado(4))  // 2^4 = 16
```

### Pipeline

```crespi
bloque pipe(valor, funciones) {
    variable resultado_val = valor

    repetir fn en funciones {
        resultado_val = fn(resultado_val)
    }

    resultado resultado_val
}

bloque doble(x) = x * 2
bloque incrementar(x) = x + 1
bloque cuadrado(x) = x * x

variable resultado = pipe(3, [doble, incrementar, cuadrado])
mostrar(resultado)  // ((3*2)+1)^2 = 49
```

---

## Patrones de Diseño

### Iterador Personalizado

```crespi
bloque crear_rango(inicio, fin) {
    variable actual = inicio

    bloque tiene_siguiente() {
        resultado actual < fin
    }

    bloque siguiente() {
        variable valor = actual
        actual += 1
        resultado valor
    }

    resultado {
        "tiene_siguiente": tiene_siguiente,
        "siguiente": siguiente
    }
}

variable rango = crear_rango(1, 5)

mientras rango["tiene_siguiente"]() {
    mostrar(rango["siguiente"]())
}
// 1, 2, 3, 4
```

### Observer (Simplificado)

```crespi
bloque crear_observable() {
    variable _observadores = []
    variable _valor = nada

    bloque suscribir(observador) {
        _observadores.agregar(observador)
    }

    bloque notificar() {
        repetir obs en _observadores {
            obs(_valor)
        }
    }

    bloque establecer(nuevo_valor) {
        _valor = nuevo_valor
        notificar()
    }

    bloque obtener() {
        resultado _valor
    }

    resultado {
        "suscribir": suscribir,
        "establecer": establecer,
        "obtener": obtener
    }
}

variable estado = crear_observable()

estado["suscribir"](bloque(valor) {
    mostrar("Observador 1: " + texto(valor))
})

estado["suscribir"](bloque(valor) {
    mostrar("Observador 2: " + texto(valor))
})

estado["establecer"](42)
// Observador 1: 42
// Observador 2: 42
```

---

## Ver También

- [Funciones](funciones.md)
- [Clases y Objetos](clases.md)
- [Referencia de Funciones](../referencia/funciones.md)
