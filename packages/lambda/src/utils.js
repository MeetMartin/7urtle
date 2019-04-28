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
 * inspect :: a -> a
 *
 * inspect output is the same as input.
 * inspect causes side effect of console.log.
 */
export const inspect = passThrough(console.log);