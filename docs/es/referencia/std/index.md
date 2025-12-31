# Biblioteca Estandar

> **Idioma:** Espanol | [English](../../../en/reference/std/index.md)

---

La biblioteca estandar de Crespi esta organizada en seis modulos. Todas las funciones tambien estan disponibles globalmente, pero importar desde los modulos `std.*` proporciona mejor organizacion y descubrimiento.

## Modulos

| Modulo | Descripcion | Funciones |
|--------|-------------|-----------|
| [std.io](io.md) | Entrada/Salida | `mostrar`, `leer` |
| [std.convert](convert.md) | Conversiones de tipo | `texto`, `entero`, `decimal`, `tipo_de` |
| [std.math](math.md) | Matematicas | 25 funciones + constantes `PI`, `E` |
| [std.string](string.md) | Manipulacion de texto | 10 metodos |
| [std.collections](collections.md) | Operaciones de colecciones | 16 metodos |
| [std.functional](functional.md) | Programacion funcional | `memorizar`, `inline` |

---

## Importacion

### Importacion Selectiva

```crespi
importar std.math { raiz, PI }
importar std.string { recortar, mayusculas }

variable radio = 5.0
variable area = PI * radio * radio
mostrar("Area: " + texto(area))
```

### Alias de Modulo

```crespi
importar std.math como m

variable resultado = m.raiz(16) + m.potencia(2, 10)
mostrar(resultado)  // 1028
```

### Acceso Calificado (Sin Importar)

```crespi
variable largo = std.collections.longitud([1, 2, 3])
mostrar(largo)  // 3
```

---

## Acceso Global

Todas las funciones de la biblioteca estandar tambien estan disponibles globalmente sin importaciones:

```crespi
// Sin importar necesario
mostrar("Hola!")
variable x = raiz(16)
variable nums = [1, 2, 3].mapear { n -> n * 2 }
```

---

## Referencia Rapida

### Entrada/Salida

| Funcion | Descripcion |
|---------|-------------|
| `mostrar(valor)` | Imprimir a stdout |
| `leer()` | Leer linea de stdin |

### Conversiones

| Funcion | Descripcion |
|---------|-------------|
| `texto(valor)` | Convertir a texto |
| `entero(valor)` | Convertir a entero |
| `decimal(valor)` | Convertir a decimal |
| `tipo_de(valor)` | Obtener nombre del tipo |

### Matematicas

| Funcion | Descripcion |
|---------|-------------|
| `absoluto(x)` | Valor absoluto |
| `raiz(x)` | Raiz cuadrada |
| `potencia(base, exp)` | Potencia |
| `redondear(x)` | Redondear al mas cercano |
| `piso(x)` / `techo(x)` | Redondear abajo/arriba |
| `seno(x)` / `coseno(x)` / `tangente(x)` | Trigonometria |
| `exponencial(x)` / `logaritmo_natural(x)` | Exponencial/logaritmo |
| `aleatorio()` | Aleatorio 0.0-1.0 |
| `PI` / `E` | Constantes |

### Texto (Metodos)

| Metodo | Descripcion |
|--------|-------------|
| `s.dividir(delim)` | Dividir texto |
| `s.recortar()` | Quitar espacios |
| `s.mayusculas()` / `s.minusculas()` | Conversion de mayusculas |
| `s.subcadena(inicio, fin?)` | Extraer subcadena |
| `s.reemplazar(viejo, nuevo)` | Reemplazar todo |
| `s.empieza_con(prefijo)` / `s.termina_con(sufijo)` | Verificar prefijo/sufijo |

### Colecciones (Metodos)

| Metodo | Descripcion |
|--------|-------------|
| `c.longitud()` | Obtener longitud |
| `lista.agregar(v)` / `lista.quitar()` | Agregar/quitar |
| `dict.claves()` / `dict.valores()` | Acceso a diccionario |
| `c.contiene(v)` | Verificar contenido |
| `lista.mapear(fn)` / `lista.filtrar(fn)` | Transformar |
| `lista.reducir(fn, init?)` | Agregar |
| `lista.ordenar(cmp?)` / `lista.invertir()` | Ordenar |

### Funcional

| Funcion | Descripcion |
|---------|-------------|
| `memorizar(fn)` | Cachear resultados de funcion |
| `@memorizar` | Forma de decorador |
| `@inline` | Sugerencia de inlining para compilador |

---

## Ver Tambien

- [Funciones Integradas](../funciones.md) - Referencia plana completa
- [Tipos de Datos](../tipos.md)
- [Palabras Clave](../palabras-clave.md)
