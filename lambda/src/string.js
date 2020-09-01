import {minusOneToUndefined} from './utils';
import {nary} from "./arity";

/**
 * trim output is a string without white characters around it.
 *
 * @HindleyMilner trim :: string -> string
 *
 * @pure
 * @param {string} string
 * @return {string}
 *
 * @example
 * import {trim} from '@7urtle/lambda';
 *
 * trim(' a \n '); // => 'a'
 */
export const trim = string => string.trim();

/**
 * testRegEx outputs true if string b passes regular expression a.
 *
 * testRegEx can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner testRegEx :: regex -> string -> boolean
 *
 * @pure
 * @param {regex} regex
 * @param {string} string
 * @return {boolean}
 *
 * @example
 * import {testRegEx} from '@7urtle/lambda';
 *
 * testRegEx(/[a-z]/)('7urtle'); // => true
 * testRegEx(/[0-9]/)('1'); // => true
 * testRegEx(/[0-9]/)('abc'); // => false
 *
 * // testRegEx can be called both as a curried unary function or as a standard binary function
 * testRegEx(/[a-z]/)('7urtle') === testRegEx(/[a-z]/, '7urtle');
 */
export const testRegEx = nary(regex => string => regex.test(string));

/**
 * substr outputs substring based on provided string, start and limit.
 *
 * substr can be called both as a curried unary function or as a standard ternary function.
 *
 * @HindleyMilner substr :: number -> number -> string -> string
 *
 * @pure
 * @param {number} limit
 * @param {number} start
 * @param {string} string
 * @return {string}
 *
 * @example
 * import {substr} from '@7urtle/lambda';
 *
 * substr(3)(1)('7urtle'); // => 'urt'
 * substr(1)(0)('7urtle'); // => '7'
 * substr(1)(-1)('7urtle'); // => 'e'
 *
 * // substr can be called both as a curried unary function or as a standard ternary function
 * substr(3)(1)('7urtle') === substr(3, 1, '7urtle');
 */
export const substr = nary(limit => start => string => string.substr(start, limit));

// TODO: last letter, first letter, beginning, end

/**
 * startsWith :: string -> string -> boolean
 * 
 * startsWith outputs true if an input string starts with provided string.
 */
export const startsWith = nary(substring => string => string.startsWith(substring));

/**
 * endsWith :: string -> string -> boolean
 * 
 * endsWith outputs true if an input string ends with provided string.
 */
export const endsWith = nary(substring => string => string.endsWith(substring));

/**
 * repeat :: number -> string -> string
 * 
 * repeat outputs new string repeating input string inputed count of times.
 */
export const repeat = nary(count => string => string.repeat(count));

/**
 * replace :: string -> string -> string -> string
 * 
 * replace outputs new string replacing input substring with input replacement string in input string.
 */
export const replace = nary(replacement => substring => string => string.replace(substring, replacement));

/**
 * search :: string/regex -> string -> number
 * 
 * search outputs position of input substring or regular expression withing input string or undefined if it is not found.
 */
export const search = nary(substring => string => minusOneToUndefined(string.search(substring)));

/**
 * split :: string -> string -> array
 * 
 * split outputs and array of an input string split by the input substring.
 */
export const split = nary(substring => string => string.split(substring));

/**
 * lowerCaseOf :: string -> string
 * 
 * lowerCaseOf ouputs the lower case version of input string.
 */
export const lowerCaseOf = string => string.toLowerCase();

/**
 * upperCaseOf :: string -> string
 * 
 * upperCaseOf ouputs the upper case version of input string.
 */
export const upperCaseOf = string => string.toUpperCase();