const curry = require('./curry')

function sum(a, b, c) {
  return a + b + c
}

function sumExtended(a, b, ...other) {
  return other.reduce((v1, v2) => v1 + v2, a + b)
}

function sumThis(a, b) {
  return a + b + (this ? this.c : NaN)
}

function sumConstructor(a, b, c) {
  this.result = a + b + c
}

function sumConstructorWithPrototype(a, b) {
  this.result = a + b + this.c
}
sumConstructorWithPrototype.prototype = { c: 5 }

const sumArrow = (a, b, c) => {
  return a + b + c
}

const sumArrowThis = (a, b) => {
  return a + b + (this ? this.c : NaN)
}

// -----

test('with limited arity', () => {
  const curried = curry(sum)

  expect(curried(1, 2, 3)).toBe(6)
  expect(typeof curried(1)(2)).toBe('function')

  expect(curried()(1, 2, 3)).toBe(6)
  expect(curried(1, 2)(3)).toBe(6)
  expect(curried(1)(2, 3)).toBe(6)
  expect(curried(1)(2)(3)).toBe(6)
  expect(curried()()(1)()(2)()(3)).toBe(6)

  expect(typeof curried(1, 2)).toBe('function')
  expect(typeof curried()(1)(2)).toBe('function')
})

test('with unlimited arity', () => {
  const curried = curry(sumExtended)

  expect(curried(1, 2)).toBe(3)
  expect(curried(1)(2)).toBe(3)
  expect(typeof curried(1)).toBe('function')

  expect(curried(1)(2, 3, 4)).toBe(10)
})

test('with arrow function', () => {
  const curried = curry(sumArrow)

  expect(curried(1, 2, 3)).toBe(6)
  expect(curried(1)(2)(3)).toBe(6)
  expect(typeof curried(1)(2)).toBe('function')
})

test('with this (non-arrow function)', () => {
  const curried = curry(sumThis)

  const obj = { c: 5 }
  obj.sum = sumThis
  obj.curried = curried

  expect(obj.sum(1, 2)).toBe(8)

  expect(obj.curried(1, 2)).toBe(8)
  expect(obj.curried(1)(2)).toBe(8)
})

test('with this (arrow function)', () => {
  const curried = curry(sumArrowThis)

  const obj = { c: 5 }
  obj.sum = sumArrowThis
  obj.curried = curried

  expect(obj.sum(1, 2)).toBeNaN()

  expect(obj.curried(1, 2)).toBeNaN()
  expect(obj.curried(1)(2)).toBeNaN()
})

test('as constructor', () => {
  const curried = curry(sumConstructor)

  expect((new curried(1, 2, 3)).result).toBe(6)
  expect((new curried(1)(2)(3)).result).toBe(6)

  expect(typeof (new curried(1)(2))).toBe('function')
})

test('as constructor with prototype', () => {
  const curried = curry(sumConstructorWithPrototype)

  expect((new sumConstructorWithPrototype(1, 2)).result).toBe(8)
  expect((new curried(1)(2)).result).toBe(8)
})

test('curry of curry', () => {
  const curried = curry(curry(sum))

  expect(curried(1)(2)(3)).toBe(6)
  expect(typeof curried(1)(2)).toBe('function')
})

