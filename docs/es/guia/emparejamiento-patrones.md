# Emparejamiento de Patrones

> **Idioma:** Español | [English](../../en/guide/pattern-matching.md)

---

El emparejamiento de patrones es una característica poderosa que permite emparejar valores contra patrones y extraer datos. Crespi usa la declaración `cuando` para el emparejamiento de patrones, que se integra perfectamente con enums, tipos y estructuras de datos.

## Sintaxis Básica

La declaración `cuando` empareja un valor contra patrones usando cláusulas `es`:

```crespi
cuando valor {
    es P{ atron1 -> { /* código */ }
    es P{ atron2 -> { /* código */ }
    defecto -> { /* respaldo */ }
}
```

---

## Emparejando Variantes de Enum

El uso más común del emparejamiento de patrones es con enums:

```crespi
enumerado Estado {
    caso Activo
    caso Inactivo
    caso Pendiente
}

variable estado = Estado.Activo

cuando estado {
    es A{ ctivo -> { mostrar("Activo") }
    es I{ nactivo -> { mostrar("Inactivo") }
    es P{ endiente -> { mostrar("Pendiente") }
    defecto -> { mostrar("Desconocido") }
}
```

### Emparejando Variantes Sin Nombres Calificados

Dentro de una declaración `cuando`, puedes usar nombres de variantes sin el prefijo del enum:

```crespi
enumerado Direccion {
    caso Norte, Sur, Este, Oeste
}

variable dir = Direccion.Norte

// No necesitas "Direccion.Norte", solo usa "Norte"
cuando dir {
    es N{ orte -> { mostrar("Yendo al norte") }
    es S{ ur -> { mostrar("Yendo al sur") }
    es E{ ste -> { mostrar("Yendo al este") }
    es O{ este -> { mostrar("Yendo al oeste") }
    defecto -> { mostrar("Desconocido") }
}
```

---

## Desestructuración de Valores Asociados

El emparejamiento de patrones te permite extraer valores de variantes de enum:

### Desestructuración Posicional

```crespi
enumerado Opcion[T] {
    caso Alguno(T)
    caso Ninguno
}

variable valor = Opcion.Alguno(42)

cuando valor {
    es Alguno{ v -> { mostrar("Valor: " + texto(v)) }
    es N{ inguno -> { mostrar("Sin valor") }
    defecto -> { mostrar("Desconocido") }
}
```

### Desestructuración de Campos Nombrados

```crespi
enumerado Forma {
    caso Circulo(radio: Decimal)
    caso Rectangulo(ancho: Decimal, alto: Decimal)
}

variable forma = Forma.Rectangulo(10.0, 20.0)

cuando forma {
    es Circulo{ r -> {
        mostrar("Círculo con radio " + texto(r))
    }
    es Rectangulo{ a, al -> {
        mostrar("Rectángulo: " + texto(a) + " x " + texto(al))
    }
    defecto -> {
        mostrar("Forma desconocida")
    }
}
```

### Múltiples Valores Asociados

```crespi
enumerado Mensaje {
    caso Mover(x: Entero, y: Entero)
    caso CambiarColor(r: Entero, g: Entero, b: Entero)
}

variable msg = Mensaje.CambiarColor(255, 128, 0)

cuando msg {
    es Mover{ x, y -> {
        mostrar("Mover a (" + texto(x) + ", " + texto(y) + ")")
    }
    es CambiarColor{ r, g, b -> {
        mostrar("RGB(" + texto(r) + ", " + texto(g) + ", " + texto(b) + ")")
    }
    defecto -> {
        mostrar("Mensaje desconocido")
    }
}
```

---

## Patrones Comodín

Usa `_` para emparejar sin vincular:

### Ignorar Valor Completo

```crespi
enumerado Opcion[T] {
    caso Alguno(T)
    caso Ninguno
}

bloque tieneValor(opt: Opcion) -> Booleano {
    cuando opt {
        es Alguno{ _ -> { resultado verdadero }
        es N{ inguno -> { resultado falso }
        defecto -> { resultado falso }
    }
}
```

### Comodines Parciales

Ignorar campos específicos mientras vinculas otros:

```crespi
enumerado Forma {
    caso Circulo(radio: Decimal)
    caso Rectangulo(ancho: Decimal, alto: Decimal)
    caso Triangulo(base: Decimal, altura: Decimal)
}

variable rect = Forma.Rectangulo(10.0, 20.0)

cuando rect {
    es Circulo{ _ -> { mostrar("Es un círculo (radio ignorado)") }
    es Rectangulo{ a, _ -> { mostrar("Ancho del rectángulo: " + texto(a)) }
    es Triangulo{ _, al -> { mostrar("Altura del triángulo: " + texto(al)) }
    defecto -> { mostrar("Forma desconocida") }
}
```

---

## Patrones Anidados

Maneja estructuras de enum anidadas con declaraciones `cuando` secuenciales:

```crespi
enumerado Opcion[T] {
    caso Alguno(T)
    caso Ninguno
}

enumerado Resultado[T, E] {
    caso Ok(T)
    caso Error(E)
}

variable anidado = Opcion.Alguno(Resultado.Ok(42))

cuando anidado {
    es Alguno{ resultado -> {
        cuando resultado {
            es Ok{ valor -> { mostrar("Valor: " + texto(valor)) }
            es Error{ msg -> { mostrar("Error: " + msg) }
            defecto -> { mostrar("Resultado desconocido") }
        }
    }
    es N{ inguno -> { mostrar("Sin valor") }
    defecto -> { mostrar("Desconocido") }
}
```

---

## La Rama `defecto`

La rama `defecto` maneja cualquier patrón no emparejado explícitamente:

```crespi
enumerado Color {
    caso Rojo, Verde, Azul
}

variable color = Color.Rojo

// Sin defecto, el compilador requeriría todas las variantes
cuando color {
    es R{ ojo -> { mostrar("rojo") }
    defecto -> { mostrar("no rojo") }  // Maneja Verde, Azul
}
```

### Exhaustividad

Sin una rama `defecto`, el compilador verifica que todas las variantes del enum se manejen:

```crespi
enumerado Estado {
    caso Activo
    caso Inactivo
}

variable estado = Estado.Activo

// Error: Falta caso para 'Inactivo'
// cuando estado {
//     es A{ ctivo -> { mostrar("activo") }
// }

// Válido con defecto
cuando estado {
    es A{ ctivo -> { mostrar("activo") }
    defecto -> { mostrar("no activo") }
}
```

---

## Emparejamiento de Patrones en Métodos

Los métodos de enum comúnmente usan `cuando yo` para emparejar la instancia actual:

```crespi
enumerado Temperatura {
    caso Celsius(Decimal)
    caso Fahrenheit(Decimal)
    caso Kelvin(Decimal)

    bloque aKelvin() -> Decimal {
        cuando yo {
            es Celsius{ c -> {
                resultado c + 273.15
            }
            es Fahrenheit{ f -> {
                resultado (f - 32.0) * 5.0 / 9.0 + 273.15
            }
            es Kelvin{ k -> {
                resultado k
            }
            defecto -> {
                resultado 0.0
            }
        }
    }

    bloque estaCongelado() -> Booleano {
        variable kelvin = yo.aKelvin()
        resultado kelvin <= 273.15
    }
}

variable temp = Temperatura.Celsius(0.0)
mostrar(temp.aKelvin())       // 273.15
mostrar(temp.estaCongelado()) // verdadero
```

---

## Emparejamiento de Patrones con Enums Genéricos

Los enums genéricos funcionan perfectamente con el emparejamiento de patrones:

```crespi
enumerado Resultado[T, E] {
    caso Ok(T)
    caso Error(E)

    bloque mapear(f) -> Resultado {
        cuando yo {
            es Ok{ valor -> { resultado Resultado.Ok(f(valor)) }
            es Error{ e -> { resultado Resultado.Error(e) }
            defecto -> { resultado yo }
        }
    }
}

bloque dividir(a: Entero, b: Entero) -> Resultado[Entero, Texto] {
    si b == 0 {
        resultado Resultado.Error("División por cero")
    }
    resultado Resultado.Ok(a / b)
}

variable resultado = dividir(10, 2)

cuando resultado {
    es Ok{ valor -> { mostrar("Resultado: " + texto(valor)) }
    es Error{ msg -> { mostrar("Error: " + msg) }
    defecto -> { mostrar("Desconocido") }
}
```

---

## Mejores Prácticas

### 1. Preferir Emparejamiento Exhaustivo

Cuando sea posible, empareja todas las variantes explícitamente en lugar de usar `defecto`:

```crespi
enumerado Estado {
    caso Activo, Inactivo
}

// Bueno: Todos los casos explícitos
cuando estado {
    es A{ ctivo -> { /* ... */ }
    es I{ nactivo -> { /* ... */ }
    defecto -> { /* requerido por ahora */ }
}
```

### 2. Usar Comodines para Valores No Usados

No vincules valores que no usarás:

```crespi
// Bueno: Usar _ para valores no usados
cuando opt {
    es Alguno{ _ -> { mostrar("tiene valor") }
    es N{ inguno -> { mostrar("vacío") }
    defecto -> { /* ... */ }
}

// Vinculación innecesaria
cuando opt {
    es Alguno{ sinUsar -> { mostrar("tiene valor") }  // variable sin usar
    es N{ inguno -> { mostrar("vacío") }
    defecto -> { /* ... */ }
}
```

### 3. Manejar Estructuras Anidadas Claramente

Para enums profundamente anidados, usa declaraciones `cuando` secuenciales con nombres de variables claros:

```crespi
cuando opcionExterna {
    es Alguno{ resultado -> {
        cuando resultado {
            es Ok{ datos -> {
                cuando datos {
                    es Valido{ valor -> { /* usar valor */ }
                    defecto -> { /* ... */ }
                }
            }
            defecto -> { /* ... */ }
        }
    }
    defecto -> { /* ... */ }
}
```

---

## Ver También

- [Enums](enums.md) - Tipos enum y valores asociados
- [Control de Flujo](control-flujo.md) - Otras construcciones de control de flujo
