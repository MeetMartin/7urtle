/**
 * trim :: string -> string
 *
 * trim output is a string without white characters around it.
 */
export const trim = a => a.trim();

/**
 * includes :: string -> string -> boolean
 *
 * includes output is true if b includes a.
 */
export const includes = a => b => b.includes(a);

/**
 * testRegEx :: regex -> string -> boolean
 *
 * testRegEx returns true if string b passes regular expression a.
 */
export const testRegEx = a => b => a.test(b);