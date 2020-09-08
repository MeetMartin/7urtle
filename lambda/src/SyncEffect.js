import {deepInspect} from "./utils";

/**
 * SyncEffect is a monad that allows you to safely work with synchronous side effects in JavaScript.
 *
 * SyncEffect expects as its input a function.
 *
 * SyncEffect is evaluated lazily and nothing is executed until a trigger function is called. It does not have any inner error/exception handling
 * mechanism for the effects of the trigger. Consider using the monads Maybe and Either for managing
 * the results of the trigger.
 *
 * @example
 * import {SyncEffect, log, upperCaseOf, liftA2} from '@7urtle/lambda';
 *
 * // we create SyncEffect that expects a number from 0 to 1
 * // and based on that, it returns a value or throws an error
 * const mySyncEffect = SyncEffect.of(value => value > 0.5 ? 'random success' : throw 'random failure');
 *
 * // when you are ready, you can call trigger to trigger the side effect
 * // nothing is executed until the trigger is called
 * mySyncEffect.trigger(Math.random());
 * // => returns 'random success' or throws 'random failure' depending on Math.random() value
 *
 * // you can inspect SyncEffect by
 * mySyncEffect.inspect(); // => "SyncEffect(function...
 *
 * // as a functor the value inside is safely mappable
 * // map doesn't execute in case of an error and nothing executes until a trigger is called
 * mySyncEffect
 * .map(value => upperCaseOf(value))
 * .trigger(Math.random());
 * // => returns 'random success' or throws 'random failure' depending on Math.random() value
 *
 * // as a monad SyncEffect can be safely flat mapped with other SyncEffects
 * // flatMap doesn't execute in case of an error and nothing executes until a trigger is called
 * SyncEffect.of(() => '7turtle').flatMap(a => SyncEffect.of(() => a + 's')).trigger();
 * // => '7urtles'
 * SyncEffect.of(() => throw 'error').flatMap(a => SyncEffect.of(() => a + 's')).trigger();
 * // => throws 'error'
 *
 * // as an applicative functor you can apply SyncEffects to each other especially using liftA2 or liftA3
 * const add = a => b => a + b;
 * liftA2(add)(SyncEffect.of(() => 1)(SyncEffect.of(() => 2)).trigger(); // => 3
 * SyncEffect.of(() => add).ap(SyncEffect.of(() => 1)).ap(SyncEffect.of(() => 2)).trigger(); // => 3
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