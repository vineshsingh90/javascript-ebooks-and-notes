A versatile implementation of the well-known curry function.

Simple example:
```js
const sum = curry((a, b) => a + b)

console.log(sum(1)(2)) // 3
```

Call as member function:
```js
const sum = curry(function(a, b) { return a + b + this.c })

const obj = {
  c: 3,
  fun: sum,
}

console.log(obj.fun(1)(2)) // 6
```

Call as constructor:
```js
const sum = curry(function(a, b) { this.result = a + b })

console.log((new sum(1)(2)).result) // 3
```
