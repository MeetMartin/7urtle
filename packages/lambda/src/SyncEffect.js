import {deepInspect} from "./utils";

/**
 * SyncEffect.of() outputs instance of SyncEffect.
 * SyncEffect.wrap(a) is equal to SyncEffect.of(() -> a).
 * SyncEffect.of(() -> a).inspect() outputs string SyncEffect(a).
 * SyncEffect.of(() -> a).trigger() executes function provided as input of SyncEffect.
 * SyncEffect.of(() -> a).map(b -> c) composes function over SyncEffect input function.
 * SyncEffect.of(() -> a).map(b -> SyncEffect) outputs SyncEffect(SyncEffect).
 * SyncEffect.of(() -> a).flatMap(b -> SyncEffect) outputs SyncEffect.
 * SyncEffect.of(() -> a).map(a -> b).ap(SyncEffect) provides applicative ability to apply functors to each other.
 * SyncEffect.of(SyncEffect -> SyncEffect -> c).ap(SyncEffect).ap(SyncEffect) provides applicative interface for a functor of a function.
 * No input function is executed until trigger is called.
 */
export class SyncEffect {
  constructor(fn) {
    this.trigger = fn;
  }

  inspect() {
    return `SyncEffect(${deepInspect(this.trigger)})`;
  }

  static of(x) {
    return new SyncEffect(x);
  }

  static wrap(x) {
    return new SyncEffect(() => x);
  }

  map(fn) {
    return new SyncEffect(a => fn(this.trigger(a)));
  }

  flatMap(fn) {
    return new SyncEffect(() => {
      return this.map(fn).trigger().trigger();
    })
  }

  ap(f) {
    return this.flatMap(fn => f.map(fn));
  }
}