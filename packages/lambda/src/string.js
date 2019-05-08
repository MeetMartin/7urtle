import {isEqual} from './conditional';

/**
 * trim :: string -> string
 *
 * trim output is a string without white characters around it.
 */
export const trim = string => string.trim();

/**
 * includes :: string -> string -> boolean
 *
 * includes output is true if b includes a.
 */
export const includes = substring => string => string.includes(substring);

/**
 * testRegEx :: regex -> string -> boolean
 *
 * testRegEx outputs true if string b passes regular expression a.
 */
export const testRegEx = regex => string => regex.test(string);

/**
 * substr :: number -> number -> string -> string
 * 
 * substr outputs substring based on provided string, start and limit.
 */
export const substr = limit => start => string => string.substr(start, limit);

/**
 * startsWith :: string -> string -> boolean
 * 
 * startsWith outputs true if an input string starts with provided string.
 */
export const startsWith = substring => string => string.startsWith(substring);

/**
 * endsWith :: string -> string -> boolean
 * 
 * endsWith outputs true if an input string ends with provided string.
 */
export const endsWith = substring => string => string.endsWith(substring);

/**
 * indexOf :: string -> string -> number|boolean
 * 
 * indexOf outputs position of input substring withing input string or false.
 */
export const indexOf = substring => string =>
    (result => isEqual(result)(-1) ? false: result)(string.indexOf(substring));

/**
 * lastIndexOf :: string -> string -> number|boolean
 * 
 * lastIndexOf outputs position of input substring withing input string looking from the end or it retuns false if it is not found.
 */
export const lastIndexOf = substring => string =>
    (result => isEqual(result)(-1) ? false: result)(string.lastIndexOf(substring));