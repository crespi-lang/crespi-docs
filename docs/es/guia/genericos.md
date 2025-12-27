# Genericos

> **Idioma:** Español | [English](../../en/guide/generics.md)

---

Crespi soporta genericos ligeros con tipado dinamico para clases y funciones usando sintaxis de corchetes.

## Clases Genericas

Usa corchetes para declarar parametros de tipo:

```crespi
tipo Caja[T](valor) {
    bloque obtener() {
        resultado yo.valor
    }

    bloque establecer(nuevo_valor) {
        yo.valor = nuevo_valor
    }
}

// Uso - el tipo se infiere
variable caja_entero = Caja(42)
variable caja_texto = Caja("hola")

mostrar(caja_entero.obtener())  // 42
mostrar(caja_texto.obtener())   // "hola"
```

### Multiples Parametros de Tipo

```crespi
tipo Par[A, B](primero, segundo) {
    bloque intercambiar() {
        resultado Par(yo.segundo, yo.primero)
    }

    bloque obtener_primero() {
        resultado yo.primero
    }

    bloque obtener_segundo() {
        resultado yo.segundo
    }
}

variable p = Par(1, "uno")
mostrar(p.obtener_primero())   // 1
mostrar(p.obtener_segundo())   // "uno"

variable intercambiado = p.intercambiar()
mostrar(intercambiado.obtener_primero())  // "uno"
```

---

## Funciones Genericas

Las funciones tambien pueden tener parametros de tipo. Los parametros de tipo van **antes** del nombre de la funcion:

```crespi
bloque [T] identidad(x) {
    resultado x
}

mostrar(identidad(42))      // 42
mostrar(identidad("hola"))  // "hola"
mostrar(identidad([1,2,3])) // [1, 2, 3]
```

### Multiples Parametros de Tipo en Funciones

```crespi
bloque [T, U] transformar(valor, funcion) {
    resultado funcion(valor)
}

fn [T] doble(x) = x * 2
fn [T] a_texto(x) = texto(x)

mostrar(transformar(5, doble))     // 10
mostrar(transformar(42, a_texto))  // "42"
```

---

## Restricciones Genericas

Crespi usa tipado dinamico, asi que los tipos genericos no se verifican en tiempo de compilacion. El codigo funcionara mientras las operaciones usadas sean validas para los tipos reales:

```crespi
tipo Contenedor[T](items = []) {
    bloque agregar(item) {
        yo.items.agregar(item)
    }

    bloque obtener_todos() {
        resultado yo.items
    }

    bloque contar() {
        resultado yo.items.longitud()
    }
}

// Funciona con cualquier tipo
variable numeros = Contenedor()
numeros.agregar(1)
numeros.agregar(2)
numeros.agregar(3)
mostrar(numeros.contar())  // 3

variable textos = Contenedor()
textos.agregar("a")
textos.agregar("b")
mostrar(textos.obtener_todos())  // ["a", "b"]
```

---

## Metodos Genericos

Las clases con parametros de tipo pueden tener metodos que usen esos parametros:

```crespi
tipo Pila[T](items = []) {
    bloque apilar(item) {
        yo.items.agregar(item)
    }

    bloque desapilar() {
        resultado yo.items.quitar()
    }

    bloque tope() {
        si yo.items.longitud() == 0 {
            resultado nada
        }
        resultado yo.items[yo.items.longitud() - 1]
    }

    bloque esta_vacia() {
        resultado yo.items.longitud() == 0
    }
}

variable pila = Pila()
pila.apilar(1)
pila.apilar(2)
pila.apilar(3)

mostrar(pila.tope())      // 3
mostrar(pila.desapilar()) // 3
mostrar(pila.desapilar()) // 2
```

---

## Genericos Anidados

Puedes usar tipos genericos dentro de otros tipos genericos:

```crespi
tipo Caja[T](valor)

tipo CajaDoble[A, B](caja_a, caja_b) {
    bloque obtener_primero() {
        resultado yo.caja_a.valor
    }

    bloque obtener_segundo() {
        resultado yo.caja_b.valor
    }
}

variable a = Caja(10)
variable b = Caja("hola")
variable doble = CajaDoble(a, b)

mostrar(doble.obtener_primero())  // 10
mostrar(doble.obtener_segundo())  // "hola"
```

---

## Por Que Corchetes?

Crespi usa `[T]` en lugar de `<T>` para evitar ambiguedad con operadores de comparacion:

```crespi
// Con angulos, esto seria ambiguo:
// variable x = Foo<Bar>(valor)  -- Es esto (Foo < Bar) > valor ?

// Los corchetes son inequivocos:
variable x = Foo[Bar](valor)  // Claramente una instanciacion generica
```

---

## Comportamiento de Genericos

- Usa corchetes `[T, U]` para evitar ambiguedad con operadores de comparacion
- Tipado dinamico: los parametros de tipo se parsean pero no se verifican en tiempo de ejecucion
- Funciona con clases y funciones
- Soporta multiples parametros de tipo
- No necesita instanciacion explicita de tipo (se infiere del uso)
- Los genericos funcionan tanto en el interprete como en la compilacion nativa

---

## Ver Tambien

- [Clases y Objetos](clases.md)
- [Funciones](funciones.md)
- [Extensiones](extensiones.md)
