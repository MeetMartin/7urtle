import {isArray, isString, isObject, isFunction} from "./conditional";

/**
 * typeOf :: a -> string
 *
 * typeOf outputs type of its input a.
 */
export const typeOf = a => typeof a;

/**
 * passThrough :: function -> a -> a
 *
 * passThrough output is the same as input a.
 * passThrough executes function passed as first argument.
 */
export const passThrough = f => a => {
  f(a);
  return a;
};

/**
 * log :: a -> a
 *
 * log output is the same as input.
 * log causes side effect of console.log.
 */
export const log = passThrough(console.log);

/**
 * inspectFunction :: (a -> b) -> string
 *
 * inspectFunction outputs name of named function or its conversion to string.
 */
export const inspectFunction = f => f.name ? f.name : f.toString();

/**
 * inspectArray :: [a] -> string
 *
 * inspectArray maps over input array [a] and outputs string representing it.
 */
export const inspectArray = a => `[${a.map(deepInspect).join(', ')}]`;

/**
 * inspectString :: a -> string
 *
 * inspectString outputs string representing input.
 */
export const inspectString = a => `'${a}'`;

/**
 * inspectObject :: a -> string
 *
 * inspectObject outputs string representing input.
 */
export const inspectObject = a =>
  isFunction(a.inspect)
    ? a.inspect()
    : `{${Object.keys(a).map(k => [k, deepInspect(a[k])]).map(kv => kv.join(': ')).join(', ')}}`;

/**
 * deepInspect :: a -> string
 *
 * deepInspect runs recursively over input and outputs string representing the input.
 */
export const deepInspect = a =>
  isFunction(a)
    ? inspectFunction(a)
    : isArray(a)
      ? inspectArray(a)
      : isObject(a)
        ? inspectObject(a)
        : isString(a)
          ? inspectString(a)
          : String(a);