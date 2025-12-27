# Extensiones

> **Idioma:** Español | [English](../../en/guide/extensions.md)

---

Las extensiones permiten agregar nuevos metodos a tipos existentes sin modificar su definicion original. Esto es similar a la caracteristica de extensiones de Swift.

## Sintaxis Basica

Usa la palabra clave `extension` seguida del nombre del tipo:

```crespi
extension Entero {
    bloque es_par() {
        resultado yo % 2 == 0
    }
}

variable n = 10
mostrar(n.es_par())  // verdadero
```

Tambien puedes declarar una sola funcion de extension en linea:

```crespi
bloque Entero.es_impar() = yo % 2 != 0

mostrar((7).es_impar())  // verdadero
mostrar(es_impar(7))     // verdadero (llamada como funcion normal)
```

Las funciones de extension tambien se exponen como funciones normales que reciben el valor como primer argumento, lo que facilita importarlas y usarlas en DSLs.

## Metodos de Extension

Los metodos de extension funcionan como metodos normales con acceso a `yo`:

```crespi
extension Texto {
    bloque invertir() {
        variable resultado = ""
        variable i = yo.longitud() - 1
        mientras i >= 0 {
            resultado = resultado + yo.subcadena(i, i + 1)
            i = i - 1
        }
        resultado resultado
    }

    bloque repetir_n(veces) {
        variable res = ""
        variable i = 0
        mientras i < veces {
            res = res + yo
            i = i + 1
        }
        resultado res
    }
}

variable texto = "Hola"
mostrar(texto.invertir())      // "aloH"
mostrar("ab".repetir_n(3))     // "ababab"
```

---

## Tipos Soportados

Las extensiones pueden agregarse a los siguientes tipos integrados (los nombres en ingles son canonicos; el paquete de idioma puede definir alias como `Texto`):

| Nombre del Tipo | Descripcion      |
|-----------------|------------------|
| `Texto`         | Cadena de texto  |
| `Entero`        | Numero entero    |
| `Decimal`       | Numero flotante  |
| `Lista`         | Arreglo/Lista    |
| `Diccionario`   | Diccionario/Mapa |
| `Tupla`         | Tupla            |
| `Booleano`      | Booleano         |

Tambien puedes extender clases definidas por el usuario:

```crespi
tipo Punto(immutable x, immutable y)

extension Punto {
    bloque magnitud() {
        resultado raiz(yo.x * yo.x + yo.y * yo.y)
    }
}

variable p = Punto(3, 4)
mostrar(p.magnitud())  // 5.0
```

---

## Extensiones de Entero

```crespi
extension Entero {
    bloque es_positivo() {
        resultado yo > 0
    }

    bloque cuadrado() {
        resultado yo * yo
    }

    bloque factorial() {
        si yo <= 1 {
            resultado 1
        }
        resultado yo * (yo - 1).factorial()
    }
}

mostrar((5).cuadrado())     // 25
mostrar((5).factorial())    // 120
mostrar((-3).es_positivo()) // falso
```

---

## Extensiones de Decimal

```crespi
extension Decimal {
    bloque es_entero() {
        resultado yo == piso(yo)
    }

    bloque a_porcentaje() {
        resultado texto(yo * 100) + "%"
    }
}

mostrar((3.14).es_entero())    // falso
mostrar((4.0).es_entero())     // verdadero
mostrar((0.75).a_porcentaje()) // "75%"
```

---

## Extensiones de Lista

```crespi
extension Lista {
    bloque suma() {
        variable total = 0
        repetir elemento en yo {
            total = total + elemento
        }
        resultado total
    }

    bloque promedio() {
        resultado yo.suma() / yo.longitud()
    }

    bloque esta_vacia() {
        resultado yo.longitud() == 0
    }
}

variable numeros = [1, 2, 3, 4, 5]
mostrar(numeros.suma())       // 15
mostrar(numeros.promedio())   // 3
mostrar([].esta_vacia())      // verdadero
```

---

## Multiples Extensiones para el Mismo Tipo

Puedes definir multiples bloques de extension para el mismo tipo:

```crespi
extension Entero {
    bloque doble() {
        resultado yo * 2
    }
}

extension Entero {
    bloque triple() {
        resultado yo * 3
    }
}

variable n = 5
mostrar(n.doble())  // 10
mostrar(n.triple()) // 15
```

---

## Encadenamiento de Metodos

Los metodos de extension pueden encadenarse:

```crespi
extension Entero {
    bloque sumar(n) {
        resultado yo + n
    }

    bloque multiplicar(n) {
        resultado yo * n
    }
}

variable resultado = (2).sumar(3).multiplicar(4)
mostrar(resultado)  // 20
```

---

## Comportamiento de Extensiones

- Los metodos usan `yo` para acceder al valor receptor
- Las extensiones se registran en tiempo de parseo
- Multiples extensiones para el mismo tipo se combinan
- Los metodos de instancia tienen precedencia sobre los metodos de extension
- Las extensiones funcionan tanto en el interprete como en la compilacion nativa

---

## Ver Tambien

- [Clases y Objetos](clases.md)
- [Funciones](funciones.md)
- [Genericos](genericos.md)
