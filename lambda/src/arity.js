/**
 * nary takes input of a curried function and allows it to be called both as curried and n-ary.
 *
 * @pure
 * @function
 * @HindleyMilner nary :: function a -> function b
 * @param {function} fn
 * @returns {function}
 */
export const nary = fn =>
    (...args) => args.length === 0
        ? fn()
        : args.reduce((accumulator, current) => accumulator(current), fn);