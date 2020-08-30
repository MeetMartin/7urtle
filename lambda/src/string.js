import {minusOneToUndefined} from './utils';
import {nary} from "./arity";

/**
 * trim :: string -> string
 *
 * trim output is a string without white characters around it.
 */
export const trim = string => string.trim();

/**
 * testRegEx :: regex -> string -> boolean
 *
 * testRegEx outputs true if string b passes regular expression a.
 */
export const testRegEx = nary(regex => string => regex.test(string));

/**
 * substr :: number -> number -> string -> string
 * 
 * substr outputs substring based on provided string, start and limit.
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