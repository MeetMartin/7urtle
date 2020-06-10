import {minusOneToUndefined} from './utils';
import {nary} from "./arity";

/**
 * reduce :: a -> ((a, b) -> a) -> [b] -> a
 *
 * reduce executes input reducer function that over each member of input array [b] to output single value a.
 *
 * reduce executes functions in reverse order to reduceRight.
 */
export const reduce = nary(initial => reducer => list => list.reduce(reducer, initial));

/**
 * reduceRight :: a -> ((a, b) -> a) -> [b] -> a
 *
 * reduceRight executes input reducer function that over each member of input array [b] to output single value a.
 *
 * reduceRight executes functions in reverse order to reduce.
 */
export const reduceRight = nary(initial => reducer => list => list.reduceRight(reducer, initial));

/**
 * map :: (a -> b) -> [a] -> [b]
 *
 * map executes input mapper over each member of input array [a] to output new array [b].
 */
export const map = nary(mapper => list => list.map(mapper));

/**
 * filter :: (a -> boolean) -> [a] -> [b]
 *
 * filter executes input checker over each member of input array [a] to filter and output filtered new array [b].
 */
export const filter = nary(checker => list => list.filter(checker));

/**
 * find :: (a -> boolean) -> [a] -> [b]
 *
 * find executes input checker over each member of input array [a] and outputs the first array member that matches checker or undefined.
 */
export const find = nary(checker => list => list.find(checker));

/**
 * findIndex :: (a -> boolean) -> [a] -> [b]
 *
 * findIndex executes input checker over each member of input array [a] and outputs the index of first array member that matches checker or undefined.
 */
export const findIndex = nary(checker => list => minusOneToUndefined(list.findIndex(checker)));

/**
 * join :: string -> [a] -> string
 *
 * join outputs a string created by joining input array members with input separator.
 */
export const join = nary(separator => list => list.join(separator));

/**
 * keysOf :: object -> [string]
 *
 * keysOf outputs array of string keys of input array or object.
 */
export const keysOf = Object.keys;

/**
 * entriesOf :: object -> [[string, a]]
 *
 * entriesOf outputs array of arrays of string keys and raw values of input array or object.
 */
export const entriesOf = Object.entries;

/**
 * everyOf :: (a -> boolean) -> [a] -> boolean
 *
 * everyOf outputs true if every element of input array passes input checker function as true.
 */
export const everyOf = nary(checker => list => list.every(checker));

/**
 * slice :: number -> number -> [a] -> [a]
 *
 * slice outputs selected array elements as an array based on input range.
 */
export const slice = nary(end => start => list => list.slice(start, end));

/**
 * some :: (a -> boolean) -> [a] -> boolean
 *
 * some outputs true if any element of input array passes input checker function as true.
 */
export const someOf = nary(checker => list => list.some(checker));