import {deepInspect} from "./utils";
import {compose} from "./core";

/**
 * AsyncEffect.of() outputs instance of AsyncEffect.
 * AsyncEffect.of(() -> a).inspect() outputs string AsyncEffect(a).
 * AsyncEffect.of((a, b) -> c).trigger(d -> e, f -> g) for resolving async function resolves.
 * AsyncEffect.of((a, b) -> c).trigger(d -> e, f -> g) for rejecting async function rejects.
 * AsyncEffect.of((a, b) -> c).map(b -> c) composes function over AsyncEffect input function.
 * AsyncEffect.of((a, b) -> c).map(b -> AsyncEffect) outputs AsyncEffect(AsyncEffect).
 * AsyncEffect.of((a, b) -> c).flatMap(b -> AsyncEffect) outputs AsyncEffect.
 * AsyncEffect.of((a, b) -> c).map(a -> b).ap(AsyncEffect) provides applicative ability to apply functors to each other.
 * AsyncEffect.of(AsyncEffect -> AsyncEffect -> c).ap(AsyncEffect).ap(AsyncEffect) provides applicative interface for a functor of a function.
 * No input function is executed until trigger is called.
 */
export class AsyncEffect {
  constructor(fn) {
    this.trigger = fn;
  }

  inspect() {
    return `AsyncEffect(${deepInspect(this.trigger)})`;
  }

  static of(x) {
    return new AsyncEffect(x);
  }

  map(fn) {
    return new AsyncEffect((reject, resolve) => this.trigger(reject, compose(resolve, fn)));
  }

  flatMap(fn) {
    return new AsyncEffect((reject, resolve) => this.trigger(reject, x => fn(x).trigger(reject, resolve)));
  }

  ap(f) {
    return this.flatMap(fn => f.map(fn));
  }
}