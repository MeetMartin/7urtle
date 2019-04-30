import {compose} from "./core";
import {deepInspect} from "./utils";

/**
 * syncEffect.of() outputs instance of syncEffect.
 * syncEffect.of(() -> a).inspect() outputs string syncEffect(a).
 * syncEffect.of(() -> a).trigger() executes function provided as input of syncEffect.
 * syncEffect.of(() -> a).map(b -> c) composes function over syncEffect input function.
 * syncEffect.of(() -> a).map(b -> syncEffect) outputs syncEffect(syncEffect).
 * syncEffect.of(() -> a).flatMap(b -> syncEffect) outputs syncEffect.
 * syncEffect.of(() -> a).map(a -> b).ap(syncEffect) provides applicative ability to apply functors to each other.
 * syncEffect.of(syncEffect -> syncEffect -> c).ap(syncEffect).ap(syncEffect) provides applicative interface for a functor of a function.
 * No input function is executed until trigger is called.
 */
export class syncEffect {
  constructor(fn) {
    this.trigger = fn;
  }

  inspect() {
    return `syncEffect(${deepInspect(this.trigger)})`;
  }

  static of(x) {
    return new syncEffect(x);
  }

  map(fn) {
    return new syncEffect(compose(fn, this.trigger));
  }

  flatMap(fn) {
    return new syncEffect(() => {
      return this.map(fn).trigger().trigger();
    })
  }

  ap(f) {
    return this.flatMap(fn => f.map(fn));
  }
}