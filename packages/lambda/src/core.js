import {reduce, reduceRight} from "./list";

/**
 * identity :: a -> a
 *
 * identity output is the same as input.
 */
export const identity = a => a;

/**
 * compose :: [(a -> b)] -> a -> (a -> b)
 *
 * compose output is a function composition
 * where each function receives input and hands over its output to the next function.
 *
 * compose executes functions in reverse order to pipe.
 *
 * compose(f,g)(x) is equivalent to f(g(x)).
 */
export const compose = (...fns) => a => reduceRight(a)((v, f) => f(v))(fns);

/**
 * pipe :: [(a -> b)] -> a -> (a -> b)
 *
 * pipe output is a function composition
 * where each function receives input and hands over its output to the next function.
 *
 * pipe executes functions in reverse order to compose.
 *
 * pipe(f,g)(x) is equivalent to g(f(x)).
 */
export const pipe = (...fns) => a => reduce(a)((v, f) => f(v))(fns);

/**
 * liftA2 (a -> b -> c) -> Applicative a -> Applicative b -> Applicative c
 *
 * liftA2 provides point-free way of writing calls over applicative functors and functions with arity 2.
 */
export const liftA2 = fn => ap1 => ap2 => ap1.map(fn).ap(ap2);

/**
 * liftA3 (a -> b -> c -> d) -> Applicative a -> Applicative b -> Applicative c -> Applicative d
 *
 * liftA3 provides point-free way of writing calls over applicative functors and functions with arity 3.
 */
export const liftA3 = fn => ap1 => ap2 => ap3 => ap1.map(fn).ap(ap2).ap(ap3);