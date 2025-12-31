# std.functional

> **Language:** [Espanol](../../../es/referencia/std/functional.md) | English

---

Functional programming utilities including memoization and compiler hints.

## Importing

```crespi
import std.functional { memoize, inline }
```

Or use directly without import (globally available).

---

## Quick Reference

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `memoize(fn)` | `fn: Function` | `Function` | Wrap with cache |
| `inline(fn)` | `fn: Function` | `Function` | Hint for inlining |

---

## Functions

### `memoize(fn)`

Creates a memoized version of a function. The memoized function caches results based on arguments, avoiding redundant calculations.

**Parameters:**
- `fn: Function` - The function to memoize

**Returns:** A new function with caching

**Example:**

```crespi
// Fibonacci without memoization (slow for large n)
fn fib(n: Int) -> Int {
    if n <= 1 { return n }
    return fib(n - 1) + fib(n - 2)
}

// Create memoized version
var fib_fast = memoize(fib)

print(fib_fast(40))  // Fast! Returns 102334155
```

### `@memoize` Decorator

The recommended way to use memoization is via the decorator syntax:

```crespi
@memoize
fn fibonacci(n: Int) -> Int {
    if n <= 1 { return n }
    return fibonacci(n - 1) + fibonacci(n - 2)
}

print(fibonacci(50))  // Efficient thanks to caching
```

### How It Works

The cache uses the function arguments as keys:

```crespi
@memoize
fn expensive(x: Int, y: Int) -> Int {
    print("Computing...")
    return x * y
}

print(expensive(3, 4))  // "Computing..." then 12
print(expensive(3, 4))  // 12 (cached, no "Computing...")
print(expensive(5, 6))  // "Computing..." then 30 (new args)
```

### Use Cases

**Recursive algorithms:**

```crespi
@memoize
fn count_ways(n: Int) -> Int {
    if n < 0 { return 0 }
    if n == 0 { return 1 }
    return count_ways(n - 1) + count_ways(n - 2) + count_ways(n - 3)
}

print(count_ways(30))  // Fast with memoization
```

**Expensive computations:**

```crespi
@memoize
fn fetch_user_data(user_id: Int) {
    // Simulated expensive operation
    print("Fetching data for user $user_id...")
    return ["id": user_id, "name": "User $user_id"]
}

// First call fetches
var data1 = fetch_user_data(42)

// Second call uses cache
var data2 = fetch_user_data(42)  // No fetch, returns cached
```

### Limitations

- Cache grows unbounded (no eviction)
- Arguments must be hashable (primitives, strings)
- Side effects still occur on first call only

---

### `inline(fn)`

Hints to the native compiler that a function should be inlined at call sites.

**Note:** This is a no-op in the interpreter. It only affects compiled code.

**Parameters:**
- `fn: Function` - The function to inline

**Returns:** The function itself

### `@inline` Decorator

The recommended way to use this feature:

```crespi
@inline
fn add(a: Int, b: Int) -> Int {
    return a + b
}

// In compiled code, the call is replaced with the addition directly
var sum = add(10, 20)
```

### When to Use `@inline`

Use for small, frequently called functions where the overhead of a function call is significant:

```crespi
@inline
fn square(x: Int) -> Int {
    return x * x
}

@inline
fn is_even(n: Int) -> Bool {
    return n % 2 == 0
}

// These will be inlined in compiled code
var result = square(5)  // Becomes: 5 * 5
var even = is_even(4)   // Becomes: 4 % 2 == 0
```

### When NOT to Use `@inline`

- Large functions (increases code size)
- Recursive functions (can't inline recursion)
- Functions called rarely

---

## Combining Decorators

You can use multiple decorators together:

```crespi
@memoize
fn factorial(n: Int) -> Int {
    if n <= 1 { return 1 }
    return n * factorial(n - 1)
}

// Note: @inline and @memoize together doesn't make sense
// because memoize wraps the function, defeating inlining
```

---

## Practical Examples

### Dynamic Programming

```crespi
// Longest Common Subsequence
@memoize
fn lcs(s1: String, s2: String, i: Int, j: Int) -> Int {
    if i == 0 or j == 0 {
        return 0
    }

    if s1.substring(i - 1, i) == s2.substring(j - 1, j) {
        return 1 + lcs(s1, s2, i - 1, j - 1)
    }

    return max(lcs(s1, s2, i - 1, j), lcs(s1, s2, i, j - 1))
}

var result = lcs("ABCDGH", "AEDFHR", 6, 6)
print(result)  // 3 (ADH)
```

### Coin Change Problem

```crespi
@memoize
fn min_coins(coins: [Int], amount: Int) -> Int {
    if amount == 0 { return 0 }
    if amount < 0 { return 999999 }

    var best = 999999
    for coin in coins {
        var result = min_coins(coins, amount - coin)
        if result + 1 < best {
            best = result + 1
        }
    }
    return best
}

var coins = [1, 5, 10, 25]
print(min_coins(coins, 63))  // 6 (25+25+10+1+1+1)
```

### Helper Inlining

```crespi
@inline
fn clamp(value: Int, min_val: Int, max_val: Int) -> Int {
    if value < min_val { return min_val }
    if value > max_val { return max_val }
    return value
}

@inline
fn lerp(a: Float, b: Float, t: Float) -> Float {
    return a + (b - a) * t
}

// These small helpers are good candidates for inlining
var clamped = clamp(150, 0, 100)  // 100
var interpolated = lerp(0.0, 100.0, 0.5)  // 50.0
```

---

## See Also

- [Standard Library](index.md) - All modules
- [Functions](../../../en/guide/functions.md) - Function syntax
