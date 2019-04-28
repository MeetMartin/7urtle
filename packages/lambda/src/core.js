/**
 * identity :: a -> a
 *
 * identity output is the same as input.
 */
export const identity = a => a;

/**
 * compose :: [(a -> b)] -> a -> (a -> c)
 *
 * compose output is a function composition
 * where each function receives input and hands over its output to the next function.
 *
 * compose executes function in reverse order to pipe.
 *
 * compose(f,g)(x) is equivalent to f(g(x)).
 */
export const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

/**
 * pipe :: [(a -> b)] -> a -> (a -> c)
 *
 * pipe output is a function composition
 * where each function receives input and hands over its output to the next function.
 *
 * pipe executes function in reverse order to compose.
 *
 * pipe(f,g)(x) is equivalent to g(f(x)).
 */
export const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);