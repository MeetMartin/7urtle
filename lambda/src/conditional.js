import {typeOf, lengthOf} from "./utils";
import {nary} from "./arity";

/**
 * isEqual :: a -> b -> boolean
 *
 * isEqual output is true if strict equality between a and b is true.
 * isEqual output is always false for comparison of objects and arrays.
 */
export const isEqual = nary(a => b => a === b);

/**
 * isNotEqual :: a -> b -> boolean
 *
 * isNotEqual output is true if strict equality between a and b is false.
 * isNotEqual output is always true for comparison of objects and arrays.
 */
export const isNotEqual = nary(a => b => a !== b);

/**
 * isTrue :: a -> boolean
 *
 * isTrue output is true if input is true.
 */
export const isTrue = isEqual(true);

/**
 * isFalse :: a -> Boolean
 *
 * isFalse output is true if input is false.
 */
export const isFalse = isEqual(false);

/**
 * isGreaterThan :: a -> b -> boolean
 *
 * isGreaterThan output is true if b is greater than a.
 */
export const isGreaterThan = nary(a => b => b > a);

/**
 * isLessThan :: a -> b -> boolean
 *
 * isLessThan output is true if b is less than a.
 */
export const isLessThan = nary(a => b => b < a);

/**
 * isAtLeast :: a -> b -> boolean
 *
 * isAtLeast output is true if b is greater or equal to a.
 */
export const isAtLeast = nary(a => b => b >= a);

/**
 * isAtMost :: a -> b -> boolean
 *
 * isAtMost output is true if b is less or equal to a.
 */
export const isAtMost = nary(a => b => b <= a);

/**
 * isTypeOf :: a -> b -> boolean
 *
 * isTypeOf output is true if b is a type of a.
 */
export const isTypeOf = nary(a => b => isEqual(typeOf(b))(a));
// is not type of, is not string...
/**
 * isString :: a -> boolean
 *
 * isString output is true if b is a string.
 */
export const isString = isTypeOf('string');

/**
 * isBoolean :: a -> boolean
 *
 * isBoolean output is true if b is a boolean.
 */
export const isBoolean = isTypeOf('boolean');

/**
 * isNull :: a -> boolean
 *
 * isNull output is true if b is a null.
 */
export const isNull = isEqual(null);

/**
 * isUndefined :: a -> boolean
 *
 * isUndefined output is true if b is an undefined.
 */
export const isUndefined = isTypeOf('undefined');

/**
 * isNumber :: a -> boolean
 *
 * isNumber output is true if b is a number.
 */
export const isNumber = isTypeOf('number');

/**
 * isObject :: a -> boolean
 *
 * isObject output is true if b is an object, array of null.
 */
export const isObject = isTypeOf('object');

/**
 * isArray :: a -> boolean
 *
 * isArray output is true if b is an array.
 */
export const isArray = Array.isArray;

/**
 * isFunction :: a -> boolean
 *
 * isFunction output is true if b is a function.
 */
export const isFunction = isTypeOf('function');

/**
 * isLength :: (string|array) -> b -> boolean
 *
 * isLength output is true if b is a length of a.
 */
export const isLength = nary(a => b => isEqual(lengthOf(b))(a));

/**
 * isNotLength :: (string|array) -> b -> boolean
 *
 * isNotLength output is true if b is not a length of a.
 */
export const isNotLength = nary(a => b => !isLength(a)(b));

/**
 * isEmpty :: (string|array) -> boolean
 *
 * isEmpty output is true if input has a length of 0.
 * isEmpty output is always false if input is an object and not an array or a string.
 */
export const isEmpty = isLength(0);

/**
 * isNotEmpty :: (string|array) -> boolean
 *
 * isNotEmpty output is true if input does not have a length of 0.
 * isNotEmpty output is always true if input is an object and not an array or a string.
 */
export const isNotEmpty = isNotLength(0);

/**
 * isZero :: a -> boolean
 *
 * isZero output is true if a is 0.
 */
export const isZero = isEqual(0);

/**
 * isNotZero :: a -> boolean
 *
 * isNotZero output is true if a is not 0.
 */
export const isNotZero = isNotEqual(0);

/**
 * isNothing :: a -> boolean
 *
 * isNothing returns true if input is null, undefined or empty string or empty array.
 */
export const isNothing = a => isNull(a) || isUndefined(a) || isEmpty(a);

/**
 * isJust :: a -> boolean
 *
 * isJust returns true if input is not null, undefined or empty string or empty array.
 */
export const isJust = a => !isNothing(a);