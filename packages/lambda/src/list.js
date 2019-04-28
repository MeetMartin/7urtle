/**
 * reduce :: a -> ((a, b) -> a) -> [b] -> a
 *
 * reduce executes input reducer function that over each member of input array [b] to output single value a.
 *
 * reduce executes functions in reverse order to reduceRight.
 */
export const reduce = initial => reducer => list => list.reduce(reducer, initial);

/**
 * reduceRight :: a -> ((a, b) -> a) -> [b] -> a
 *
 * reduceRight executes input reducer function that over each member of input array [b] to output single value a.
 *
 * reduceRight executes functions in reverse order to reduce.
 */
export const reduceRight = initial => reducer => list => list.reduceRight(reducer, initial);

/**
 * map :: (a -> b) -> [a] -> [b]
 *
 * map executes input mapper over each member of input array [a] to output new array [b].
 */
export const map = mapper => list => list.map(mapper);