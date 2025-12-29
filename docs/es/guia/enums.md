# Enums y Tipos Algebraicos de Datos

> **Idioma:** Español | [English](../../en/guide/enums.md)

---

Crespi proporciona enums al estilo Swift con valores asociados, permitiendo el modelado seguro de máquinas de estado, manejo de protocolos y tipos algebraicos de datos. Los enums se integran perfectamente con el emparejamiento de patrones para el manejo exhaustivo de casos.

## Enums Básicos

Los enums más simples son enumeraciones simples sin valores asociados. Usa la palabra clave `caso` para declarar variantes:

```crespi
enumerado Direccion {
    caso Norte, Sur, Este, Oeste
}

variable dir = Direccion.Norte

cuando dir {
    es Norte => { mostrar("Yendo al norte") }
    es Sur => { mostrar("Yendo al sur") }
    es Este => { mostrar("Yendo al este") }
    es Oeste => { mostrar("Yendo al oeste") }
    defecto => { mostrar("Dirección desconocida") }
}
```

Las variantes también pueden declararse en líneas separadas:

```crespi
enumerado Estado {
    caso Activo
    caso Inactivo
    caso Pendiente
}
```

### Características Clave

- **Palabra clave `caso`**: Requerida antes de cada declaración de variante
- **Separadas por comas**: Múltiples variantes pueden aparecer en una línea separadas por comas
- **Nomenclatura PascalCase**: Las variantes usan PascalCase (ej., `Norte`, `Alguno`, `Ok`)
- **Notación de punto**: Accede a variantes usando `NombreEnum.NombreVariante`
- **Visibilidad**: Los enums admiten modificadores `publico`, `privado`, `interno`

---

## Iterando Sobre Casos con `todosCasos`

Los enums simples (aquellos sin valores asociados) automáticamente proporcionan una propiedad `todosCasos` que devuelve una lista de todas las variantes en orden de declaración:

```crespi
enumerado Direccion {
    caso Norte, Sur, Este, Oeste
}

// Iterar sobre todos los casos
repetir dir en Direccion.todosCasos {
    mostrar(dir)
}
// Salida:
// Direccion.Norte
// Direccion.Sur
// Direccion.Este
// Direccion.Oeste

// Obtener el conteo de casos
mostrar(longitud(Direccion.todosCasos))  // 4
```

### Restricciones

`todosCasos` solo está disponible para enums donde **todas las variantes no tienen valores asociados**:

```crespi
enumerado Opcion[T] {
    caso Alguno(T)
    caso Ninguno
}

// ERROR: todosCasos no está disponible para enum 'Opcion' porque tiene variantes con valores asociados
// variable casos = Opcion.todosCasos
```

---

## Enums con Valores Asociados

Las variantes pueden transportar datos usando valores asociados posicionales o nombrados:

### Valores Asociados Posicionales

```crespi
enumerado Opcion[T] {
    caso Alguno(T)
    caso Ninguno
}

variable valor = Opcion.Alguno(42)
variable vacio = Opcion.Ninguno

cuando valor {
    es Alguno(v) => { mostrar("Valor: " + texto(v)) }
    es Ninguno => { mostrar("Sin valor") }
    defecto => { mostrar("Desconocido") }
}
```

### Valores Asociados Nombrados

Los campos nombrados proporcionan mejor documentación y permiten construcción flexible:

```crespi
enumerado Mensaje {
    caso Salir
    caso Mover(x: Entero, y: Entero)
    caso Escribir(texto: Texto)
    caso CambiarColor(r: Entero, g: Entero, b: Entero)
}

// Construcción con argumentos nombrados
variable msg1 = Mensaje.Mover(10, 20)
variable msg2 = Mensaje.Escribir("Hola")
variable msg3 = Mensaje.CambiarColor(255, 0, 0)

cuando msg1 {
    es Mover(x, y) => {
        mostrar("Mover a posición (" + texto(x) + ", " + texto(y) + ")")
    }
    es Escribir(texto) => {
        mostrar("Escribir mensaje: " + texto)
    }
    es CambiarColor(r, g, b) => {
        mostrar("Cambiar color a RGB(" + texto(r) + ", " + texto(g) + ", " + texto(b) + ")")
    }
    es Salir => {
        mostrar("Salir")
    }
    defecto => {
        mostrar("Mensaje desconocido")
    }
}
```

---

## Enums Genéricos

Los enums pueden tener parámetros de tipo usando sintaxis de corchetes:

```crespi
enumerado Resultado[T, E] {
    caso Ok(T)
    caso Error(E)
}

bloque dividir(a: Entero, b: Entero) -> Resultado[Entero, Texto] {
    si b == 0 {
        resultado Resultado.Error("División por cero")
    }
    resultado Resultado.Ok(a / b)
}

variable resultado = dividir(10, 2)

cuando resultado {
    es Ok(valor) => {
        mostrar("Resultado: " + texto(valor))
    }
    es Error(msg) => {
        mostrar("Error: " + msg)
    }
    defecto => {
        mostrar("Desconocido")
    }
}
```

### Inferencia de Tipos

Los argumentos de tipo se infieren del uso:

```crespi
variable alguno = Opcion.Alguno(42)  // Inferido como Opcion[Entero]
variable ninguno = Opcion.Ninguno     // Inferido del contexto
```

---

## Métodos en Enums

Los enums pueden tener métodos declarados dentro de su cuerpo:

```crespi
enumerado Opcion[T] {
    caso Alguno(T)
    caso Ninguno

    bloque esAlguno() -> Booleano {
        cuando yo {
            es Alguno(_) => { resultado verdadero }
            es Ninguno => { resultado falso }
            defecto => { resultado falso }
        }
    }

    bloque esNinguno() -> Booleano {
        cuando yo {
            es Alguno(_) => { resultado falso }
            es Ninguno => { resultado verdadero }
            defecto => { resultado falso }
        }
    }

    bloque desenvolverO(valorPorDefecto: T) -> T {
        cuando yo {
            es Alguno(valor) => { resultado valor }
            es Ninguno => { resultado valorPorDefecto }
            defecto => { resultado valorPorDefecto }
        }
    }
}

variable alguno = Opcion.Alguno(42)
variable ninguno = Opcion.Ninguno

mostrar(alguno.esAlguno())         // verdadero
mostrar(ninguno.esAlguno())        // falso
mostrar(alguno.desenvolverO(0))    // 42
mostrar(ninguno.desenvolverO(99))  // 99
```

### Métodos con Emparejamiento de Patrones

Los métodos pueden usar `cuando yo` para emparejar el valor enum:

```crespi
enumerado Forma {
    caso Circulo(radio: Decimal)
    caso Rectangulo(ancho: Decimal, alto: Decimal)
    caso Triangulo(base: Decimal, altura: Decimal)

    bloque area() -> Decimal {
        cuando yo {
            es Circulo(r) => {
                resultado 3.14159 * r * r
            }
            es Rectangulo(a, al) => {
                resultado a * al
            }
            es Triangulo(b, al) => {
                resultado 0.5 * b * al
            }
            defecto => {
                resultado 0.0
            }
        }
    }

    bloque escalar(factor: Decimal) -> Forma {
        cuando yo {
            es Circulo(r) => {
                resultado Forma.Circulo(r * factor)
            }
            es Rectangulo(a, al) => {
                resultado Forma.Rectangulo(a * factor, al * factor)
            }
            es Triangulo(b, al) => {
                resultado Forma.Triangulo(b * factor, al * factor)
            }
            defecto => {
                resultado yo
            }
        }
    }
}

variable circulo = Forma.Circulo(5.0)
mostrar(circulo.area())              // ~78.54
mostrar(circulo.escalar(2.0).area()) // ~314.16
```

---

## Enums Recursivos

Usa la palabra clave `indirecto` para tipos enum recursivos:

```crespi
indirecto enumerado Arbol[T] {
    caso Vacio
    caso Nodo(valor: T, izquierda: Arbol[T], derecha: Arbol[T])

    bloque tamaño() -> Entero {
        cuando yo {
            es Vacio => { resultado 0 }
            es Nodo(_, izq, der) => {
                resultado 1 + izq.tamaño() + der.tamaño()
            }
            defecto => { resultado 0 }
        }
    }
}

// Construir un árbol:
//       5
//      / \
//     3   7
//    /
//   1
variable arbol = Arbol.Nodo(
    5,
    Arbol.Nodo(3, Arbol.Nodo(1, Arbol.Vacio, Arbol.Vacio), Arbol.Vacio),
    Arbol.Nodo(7, Arbol.Vacio, Arbol.Vacio)
)

mostrar(arbol.tamaño())  // 4
```

### Listas Enlazadas

```crespi
indirecto enumerado Lista[T] {
    caso Nulo
    caso Cons(cabeza: T, cola: Lista[T])

    bloque longitud() -> Entero {
        cuando yo {
            es Nulo => { resultado 0 }
            es Cons(_, cola) => { resultado 1 + cola.longitud() }
            defecto => { resultado 0 }
        }
    }
}

variable lista = Lista.Cons(1, Lista.Cons(2, Lista.Cons(3, Lista.Nulo)))
mostrar(lista.longitud())  // 3
```

---

## Patrones Comunes

### Máquinas de Estado

```crespi
enumerado EstadoConexion {
    caso Desconectado
    caso Conectando
    caso Conectado(idSesion: Texto)
    caso Error(mensaje: Texto)
}

tipo Conexion {
    constructor() {
        yo.estado = EstadoConexion.Desconectado
    }

    bloque conectar(id: Texto) {
        yo.estado = EstadoConexion.Conectando
        // ... lógica de conexión ...
        yo.estado = EstadoConexion.Conectado(id)
    }

    bloque obtenerEstado() -> Texto {
        cuando yo.estado {
            es Desconectado => { resultado "No conectado" }
            es Conectando => { resultado "Conectando..." }
            es Conectado(id) => { resultado "Conectado: " + id }
            es Error(msg) => { resultado "Error: " + msg }
            defecto => { resultado "Desconocido" }
        }
    }
}
```

### Tipo Opción

```crespi
enumerado Opcion[T] {
    caso Alguno(T)
    caso Ninguno

    bloque mapear(f) -> Opcion {
        cuando yo {
            es Alguno(valor) => { resultado Opcion.Alguno(f(valor)) }
            es Ninguno => { resultado Opcion.Ninguno }
            defecto => { resultado Opcion.Ninguno }
        }
    }
}

variable valor = Opcion.Alguno(5)
variable duplicado = valor.mapear(x => x * 2)  // Opcion.Alguno(10)
```

### Tipo Resultado

```crespi
enumerado Resultado[T, E] {
    caso Ok(T)
    caso Error(E)

    bloque esOk() -> Booleano {
        cuando yo {
            es Ok(_) => { resultado verdadero }
            es Error(_) => { resultado falso }
            defecto => { resultado falso }
        }
    }

    bloque desenvolver() -> T {
        cuando yo {
            es Ok(valor) => { resultado valor }
            es Error(msg) => {
                lanzar ErrorEjecucion("desenvolver en Error: " + texto(msg))
            }
            defecto => {
                lanzar ErrorEjecucion("desenvolver en Resultado inválido")
            }
        }
    }
}

bloque analizarNumero(s: Texto) -> Resultado[Entero, Texto] {
    variable n = entero(s)
    si tipode(n) == "Entero" {
        resultado Resultado.Ok(n)
    }
    resultado Resultado.Error("Número inválido: " + s)
}
```

---

## Integración con Otras Características

### Enums en Clases

```crespi
enumerado Estado {
    caso Activo
    caso Inactivo
}

tipo Usuario(nombre, estado) {
    bloque estaActivo() -> Booleano {
        cuando yo.estado {
            es Activo => { resultado verdadero }
            defecto => { resultado falso }
        }
    }
}

variable usuario = Usuario("Alicia", Estado.Activo)
mostrar(usuario.estaActivo())  // verdadero
```

### Enums en Colecciones

```crespi
enumerado Color {
    caso Rojo, Verde, Azul
}

variable colores = [Color.Rojo, Color.Verde, Color.Azul]

repetir color en colores {
    cuando color {
        es Rojo => { mostrar("rojo") }
        es Verde => { mostrar("verde") }
        es Azul => { mostrar("azul") }
        defecto => { mostrar("desconocido") }
    }
}

// O iterar usando todosCasos
repetir color en Color.todosCasos {
    mostrar(color)
}
```

### Enums con Extensiones

```crespi
enumerado Direccion {
    caso Norte, Sur, Este, Oeste
}

extension Direccion {
    bloque opuesto() -> Direccion {
        cuando yo {
            es Norte => { resultado Direccion.Sur }
            es Sur => { resultado Direccion.Norte }
            es Este => { resultado Direccion.Oeste }
            es Oeste => { resultado Direccion.Este }
            defecto => { resultado yo }
        }
    }
}

variable dir = Direccion.Norte
mostrar(dir.opuesto())  // Direccion.Sur
```

---

## Soporte de Idioma Español

Los enums admiten alias en español mediante el paquete de idioma. El código anterior usa palabras clave en español:

- `enumerado` - enum
- `indirecto` - indirect
- `caso` - case
- `cuando` - when
- `es` - is
- `defecto` - default
- `yo` - this
- `bloque` - fn
- `resultado` - return
- `mostrar` - print
- `texto` - str
- `verdadero` - true
- `falso` - false

También puedes usar las palabras clave en inglés:

```crespi
enum Direction {
    case North, South
}

indirect enum Tree[T] {
    case Empty
    case Node(value: T, left: Tree[T], right: Tree[T])
}
```

---

## Ver También

- [Emparejamiento de Patrones](emparejamiento-patrones.md) - Guía detallada de emparejamiento de patrones
- [Control de Flujo](control-flujo.md) - Emparejamiento de patrones con `cuando`
- [Clases](clases.md) - Programación orientada a objetos
- [Genéricos](genericos.md) - Parámetros de tipo
- [Extensiones](extensiones.md) - Agregar métodos a tipos
