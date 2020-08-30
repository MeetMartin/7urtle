import {reduce, reduceRight} from './list';
import {isString, isArray, isObject} from './conditional';
import {minusOneToUndefined, passThrough} from './utils';
import {nary} from "./arity";

/**
 * identity is a function that simply passes its input to its output without changing it.
 *
 * @HindleyMilner identity :: a -> a
 *
 * @pure
 * @param {*} anything
 * @return {*}
 *
 * @example
 * import {identity} from '@7urtle/lambda';
 *
 * identity('anything');
 * // => anything
 */
export const identity = anything => anything;

/**
 * compose is a right-to-left function composition
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
 * @param {*} anything
 * @return {*}
 *
 * @example
 * import {compose} from '@7urtle/lambda';
 *
 * const addA = a => a + 'A';
 * const addB = a => a + 'B';
 * const addAB = compose(addA, addB);
 *
 * addAB('Order: ');
 * // => Order: BA
 */
export const compose = (...fns) => anything => reduceRight(anything)((v, f) => f(v))(fns);

/**
 * pipe output is a left-to-right function composition
 * where each function receives input and hands over its output to the next function.
 *
 * pipe executes functions in reverse order to compose.
 *
 * pipe(f,g)(x) is equivalent to g(f(x)).
 *
 * @HindleyMilner pipe :: [(a -> b)] -> a -> (a -> b)
 *
 * @pure
 * @param {function} fns
 * @param {*} anything
 * @return {*}
 *
 * @example
 * import {pipe} from '@7urtle/lambda';
 *
 * const addA = a => a + 'A';
 * const addB = a => a + 'B';
 * const addAB = pipe(addA, addB);
 *
 * addAB('Order: ');
 * // => Order: AB
 */
export const pipe = (...fns) => anything => reduce(anything)((v, f) => f(v))(fns);

/**
 * functorMap maps function over inputted functor outputting resulting functor.
 *
 * You should use functorMap when you want to work with functors using functions
 * and functional composition rather than calling maps.
 *
 * The function can be called both as unary functorMap(fn)(functor) and binary functorMap(fn, functor).
 *
 * @HindleyMilner functorMap :: (a -> b) -> Functor -> Functor
 *
 * @param {function} fn
 * @param {functor} functor
 * @return {functor}
 *
 * @example
 * import {functorMap, Maybe, upperCaseOf} from '@7urtle/lambda';
 *
 * functorMap(upperCaseOf)(Maybe.of('something')); // => Just('SOMETHING')
 *
 * Maybe.of('something').map(upperCaseOf).value === functorMap(upperCaseOf)(Maybe.of('something'));
 *
 * functorMap(upperCaseOf)(Maybe.of('something')) === functorMap(upperCaseOf, Maybe.of('something'));
 */
export const functorMap = nary(fn => functor => functor.map(fn));

/**
 * functorFlatMap maps function over inputted functor outputting resulting flattened functor.
 *
 * You should use functorFlatMap when you want to work with functors using functions
 * and functional composition rather than calling flatMaps.
 *
 * The function can be called both as unary functorFlatMap(fn)(functor) and binary functorFlatMap(fn, functor).
 *
 * @HindleyMilner functorFlatMap :: (a -> Functor) -> Functor -> Functor
 *
 * @param {function} fn
 * @param {functor} functor
 * @return {functor}
 *
 * @example
 * import {functorFlatMap, functorMap, Maybe, upperCaseOf} from '@7urtle/lambda';
 *
 * const maybePlus2 = number => Maybe.of(number + 2);
 *
 * functorFlatMap(maybePlus2)(Maybe.of(3)); // => Just(5)
 * functorMap(maybePlus2)(Maybe.of(3)); // => Just(Just(5))
 *
 * Maybe.of(3).flatMap(maybePlus2).value === functorFlatMap(maybePlus2)(Maybe.of(3));
 *
 * functorFlatMap(maybePlus2)(Maybe.of(3)) === functorFlatMap(maybePlus2, Maybe.of(3));
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