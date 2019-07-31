import {deepInspect} from "./utils";
import {isNothing} from "./conditional";

/**
 * Maybe.of() outputs instance of Maybe.
 * Maybe.of(a).inspect() outputs string Just(a) or Nothing.
 * Maybe.of(a) outputs Nothing for an input that is null, undefined, an empty string or an empty array.
 * Maybe.of(a) outputs Just for an input a that is not Nothing.
 * Maybe.of(a) outputs Nothing for an input a that is null or undefined.
 * Maybe.of(a).isJust() of an input a outputs true for a value that is Just.
 * Maybe.of(a).isNothing() of an input a outputs true for a value that is Nothing.
 * Maybe.of(a).map(a -> b) executes function over Maybe input a.
 * Maybe.of(a).map(a -> Just) outputs Just(Just).
 * Maybe.of(a).map(a -> b) does not execute over Nothing.
 * Maybe.of(a).flatMap(a -> b) executes function over Maybe input a returns its raw value.
 * Maybe.of(a).flatMap(a -> b) does not execute over Nothing.
 * Maybe.of(a).map(a -> b).ap(Maybe) provides applicative ability to apply functors to each other.
 * Maybe.of(Maybe -> Maybe -> c).ap(Maybe).ap(Maybe) provides applicative interface for a functor of a function.
 */
export class Maybe {
  constructor(x) {
    this.value = x;
  }

  static of(x) {
    return isNothing(x) ? new Nothing(x) : new Just(x) ;
  }
}

class Just extends Maybe {
  inspect() {
    return `Just(${deepInspect(this.value)})`;
  }

  isNothing() {
    return false;
  }

  isJust() {
    return true;
  }

  map(fn) {
    return Maybe.of(fn(this.value));
  }

  flatMap(fn) {
    return fn(this.value);
  }

  ap(f) {
    return f.map(this.value);
  }
}

class Nothing extends Maybe {
  inspect () {
    return 'Nothing';
  }

  isNothing() {
    return true
  }

  isJust() {
    return false;
  }

  map(fn) {
    return this;
  }

  flatMap(fn) {
    return this;
  }

  ap(f) {
    return this;
  }
}

/**
 * maybe :: a -> (b -> c) -> Maybe
 *
 * maybe outputs result of a function onJust if input Maybe is Just or outputs input error if input Maybe is Nothing.
 */
export const maybe = error => onJust => functorMaybe =>
  functorMaybe.isNothing()
    ? error
    : onJust(functorMaybe.value);