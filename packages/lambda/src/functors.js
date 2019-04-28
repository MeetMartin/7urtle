import {deepInspect} from "./utils";
import {isNothing, isJust} from "./conditional";

/**
 * Maybe.of() outputs instance of Maybe.
 * Maybe.of(a) outputs Just for an input a that is not null or undefined.
 * Maybe.of(a) outputs Nothing for an input a that is null or undefined.
 * Maybe.of(a).isJust() of an input a outputs true for a value that is not null or undefined.
 * Maybe.of(a).isNothing() of an input a outputs true for a value that is null or undefined.
 * Maybe.of(a).map(a -> b) executes function over Maybe input a.
 * Maybe.of(a).map(a -> b) hides over null, undefined, empty string and empty array values.
 */
export class Maybe {
  isNothing() {
    return isNothing(this.value);
  }

  isJust() {
    return isJust(this.value);
  }

  constructor(x) {
    this.value = x;
  }

  inspect() {
    return this.isNothing() ? 'Nothing' : `Just(${deepInspect(this.value)})`;
  }

  // ----- Pointed Maybe
  static of(x) {
    return new Maybe(x);
  }

  // ----- Functor Maybe
  map(fn) {
    return this.isNothing() ? this : Maybe.of(fn(this.value));
  }

  // ----- Applicative Maybe
  ap(f) {
    return this.isNothing() ? this : f.map(this.value);
  }

  // ----- Monad Maybe
  chain(fn) {
    return this.map(fn).join();
  }

  join() {
    return this.isNothing() ? this : this.value;
  }

  // ----- Traversable Maybe
  sequence(of) {
    this.traverse(of, this.isNothing());
  }

  traverse(of, fn) {
    return this.isNothing() ? of(this) : fn(this.value).map(Maybe.of);
  }
}