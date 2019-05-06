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
export const includes = what => string => string.includes(what);

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
export const startsWith = what => string => string.startsWith(what);