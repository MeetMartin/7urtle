import {reduce, reduceRight} from './list';
import {isString, isArray, isObject} from './conditional';
import {minusOneToUndefined, passThrough} from './utils';
import {nary} from "./arity";

/**
 * identity simply passes its input to its output.
 *
 * @HindleyMilner identity :: a -> a
 *
 * @pure
 * @param {*} a
 * @return {a}
 *
 * @example
 * identity('anything');
 * // => anything
 */
export const identity = a => a;

/**
 * pipe output is a right-to-left function composition
 * where each function receives input and hands over its output to the next function.
 *
 * compose executes functions in reverse order to pipe.
 *
 * compose(f,g)(x) is equivalent to f(g(x)).
 *
 * @HindleyMilner compose :: [(a -> b)] -> a -> (a -> b)
 *
 * @pure
 * @param {function} fns
 * @param {*} a
 * @return {*}
 *
 * @example
 * const addA = a => a + 'A';
 * const addB = a => a + 'B';
 * const addAB = compose(addB, addA);
 *
 * addAB('Order: ');
 * // => Order: AB
 */
export const compose = (...fns) => a => reduceRight(a)((v, f) => f(v))(fns);

/**
 * pipe :: [(a -> b)] -> a -> (a -> b)
 *
 * pipe output is a left-to-right function composition
 * where each function receives input and hands over its output to the next function.
 *
 * pipe executes functions in reverse order to compose.
 *
 * pipe(f,g)(x) is equivalent to g(f(x)).
 */
export const pipe = (...fns) => a => reduce(a)((v, f) => f(v))(fns);

/**
 * functorMap :: (a -> b) -> Functor -> Functor
 *
 * functorMap maps function over inputted functor outputting resulting functor.
 */
export const functorMap = nary(fn => functor => functor.map(fn));

/**
 * functorFlatMap :: (a -> Functor) -> Functor -> Functor
 *
 * functorFlatMap flatMaps function outputting functor over inputted functor outputting resulting functor.
 */
export const functorFlatMap = nary(fn => functor => functor.flatMap(fn));

/**
 * liftA2 (a -> b -> c) -> Applicative a -> Applicative b -> Applicative c
 *
 * liftA2 provides point-free way of writing calls over applicative functors and functions with arity 2.
 */
export const liftA2 = nary(fn => ap1 => ap2 => ap1.map(fn).ap(ap2));

/**
 * liftA3 (a -> b -> c -> d) -> Applicative a -> Applicative b -> Applicative c -> Applicative d
 *
 * liftA3 provides point-free way of writing calls over applicative functors and functions with arity 3.
 */
export const liftA3 = nary(fn => ap1 => ap2 => ap3 => ap1.map(fn).ap(ap2).ap(ap3));

/**
 * concat :: a -> a|boolean
 * 
 * contact outputs concatenated inputs of strings, arrays and objects or outputs undefined for other types.
 */
export const concat = nary(a => b =>
  isString(b) || isArray(b)
    ? b.concat(a)
    : isObject(b)
      ? {...b, ...a}
      : undefined);

/**
 * includes :: a -> b -> boolean
 *
 * includes output is true if b includes a.
 */
export const includes = nary(a => b => b.includes(a));

/**
 * indexOf :: a -> b -> number
 * 
 * indexOf outputs position of input a within input b or undefined if it is not found.
 */
export const indexOf = nary(a => b => minusOneToUndefined(b.indexOf(a)));

/**
 * lastIndexOf :: a -> b -> number
 * 
 * lastIndexOf outputs position of input a withing input b looking from the end or it retuns undefined if it is not found.
 */
export const lastIndexOf = nary(a => b => minusOneToUndefined(b.lastIndexOf(a)));

/**
 * memoize :: object -> (a -> b) -> a -> b
 *
 * memoize uses input memory to save output of input function and then uses it to lookup result on a repeated run
 */
export const memoize = nary(memory => fn => a =>
  a in memory ? memory[a] : (passThrough(b => memory[a] = b))(fn(a)));