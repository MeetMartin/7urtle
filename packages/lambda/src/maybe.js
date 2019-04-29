import {deepInspect} from "./utils";
import {isNothing} from "./conditional";
import {identity} from "./core";

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

  ap(f) {
    return f.map(this.value);
  }

  flatMap(fn) {
    return fn(this.value);
  }

  sequence(of) {
    this.traverse(of, identity);
  }

  traverse(of, fn) {
    return fn(this.value).map(Maybe.of);
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

  ap(f) {
    return this;
  }

  flatMap(fn) {
    return this;
  }

  sequence(of) {
    return of(this);
  }

  traverse(of, fn) {
    return of(this);
  }
}