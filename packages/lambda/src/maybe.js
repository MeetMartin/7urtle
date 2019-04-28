import {deepInspect} from "./utils";
import {isNothing, isJust} from "./conditional";
import {identity} from "./core";

/**
 * Maybe.of() outputs instance of Maybe.
 * Maybe.of(a) outputs Just for an input a that is not null or undefined.
 * Maybe.of(a) outputs Nothing for an input a that is null or undefined.
 * Maybe.of(a).isJust() of an input a outputs true for a value that is not null or undefined.
 * Maybe.of(a).isNothing() of an input a outputs true for a value that is null or undefined.
 * Maybe.of(a).map(a -> b) executes function over Maybe input a.
 * Maybe.of(a).map(a -> Just) outputs Just(Just)
 * Maybe.of(a).map(a -> b) hides over null, undefined, empty string and empty array values.
 * Maybe.of(a).flatMap(a -> b) executes function over Maybe input a returns its raw value through flatten.
 * Maybe.of(a).flatMap(a -> b) hides over null, undefined, empty string and empty array values.
 */
export class Maybe {
  constructor(x) {
    this.value = x;
  }

  static of(x) {
    return new Maybe(x);
  }

  inspect() {
    return this.isNothing() ? 'Nothing' : `Just(${deepInspect(this.value)})`;
  }

  isNothing() {
    return isNothing(this.value);
  }

  isJust() {
    return isJust(this.value);
  }

  map(fn) {
    return this.isNothing() ? this : Maybe.of(fn(this.value));
  }

  ap(f) {
    return this.isNothing() ? this : f.map(this.value);
  }

  flatMap(fn) {
    return this.map(fn).flatten();
  }

  flatten() {
    return this.isNothing() ? this : this.value;
  }

  sequence(of) {
    this.traverse(of, identity);
  }

  traverse(of, fn) {
    return this.isNothing ? of(this) : fn(this.value).map(Maybe.of);
  }
}