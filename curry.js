
/*
 * Create a function that accepts curried arguments.
 *
 * A function with a signature "sum(a, b)" can be called in the
 * following way: "sum(a)(b)".
 *
 * Several considerations have to be made:
 *
 * 1. Currying a function with rest arguments.
 * 2. Currying an arrow function.
 * 3. Calling the curried function as member function.
 * 4. Calling the curried function as constructor.
 */
function curry(fun) {

  function wrapper() {
    let accumulator = Array.from(arguments)

    const that = this
    const calledAsConstructor = new.target

    function recurry() {
      accumulator = accumulator.concat(Array.from(arguments))

      if (accumulator.length >= fun.length) {
        // in case of arrow "this" keyword will be omitted.
        const result = fun.apply(that, accumulator)

        return calledAsConstructor ? that : result
      }
      else {
        return recurry
      }
    }

    return recurry()
  }

  wrapper.prototype = fun.prototype

  /*
   * In case of "curry of curry", the outer will resolve immediately,
   * but the inner will remain and work properly.
   *
   * Therefore it seems like "wrapper.length" could be zero, but I am not sure.
   */

  return wrapper
}

module.exports = curry

