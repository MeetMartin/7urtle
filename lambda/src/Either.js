import {deepInspect} from "./utils";
import {nary} from "./arity";

/**
 * Either is an excellent monad for handling error states and it is fairly similar to our monad Maybe. Either.Left
 * represents an error state and Either.Right represents a success state.
 *
 * Either.of expects a value as its input. Either.of is the same as Either.Right. You can initiate Either
 * in its error state by Either.Left.
 *
 * You can also initiate it using Either.try which expects a function as an input. It is Left if an error
 * or exception is thrown. It is Right if there are no errors or exceptions.
 *
 * Either is called Either because it allows you to branch based on an error state. You want to use Either
 * for situations when you don't know whether there might be an error. It makes the very visible that an error
 * can occur and it forces the consumer to handle the situation.
 *
 * @example
 * import {either, Either, upperCaseOf, liftA2} from '@7urtle/lambda';
 *
 * // in the example we randomly give Either a value or throw an error. Either.try() outputs an instance of Either.
 * const myEither = Either.try(() => Math.random() > 0.5 ? 'random success' : throw 'random failure');
 *
 * // you can also return Either.Left or Either.Right based on a function logic
 * const myFunction = Math.random() > 0.5 ? Either.Right('random success') : Either.Left('random failure');
 *
 * // you could access the actual value like this
 * myEither.value; // => 'random success' or 'random failure'
 *
 * // you can also inspect it by
 * myEither.inspect(); // => "Right('random success')" or Left('random failure')
 *
 * // Either.of and Either.Right both represent success states
 * Either.of('some value').inspect() === Either.Right('some value').inspect(); // => true
 *
 * // you can check if the value is Left
 * myEither.isLeft(); // => true or false
 * Either.of('abc').isLeft(); // => false
 * Either.Right('anything').isLeft(); // => false
 * Either.Left('anything').isLeft(); // => true
 * Either.try(() => throw 'error').isLeft(); // => true
 *
 * // you can check if the value is Right
 * myEither.isRight(); // => true or false
 * Either.of('abc').isRight(); // => true
 * Either.Right('anything').isRight(); // => true
 * Either.Left('anything').isRight(); // => false
 * Either.try(() => throw 'error').isRight(); // => false
 *
 * // as a functor the value inside is safely mappable (map doesn't execute over Left)
 * myEither.map(value => upperCaseOf(value));
 * myEither.inspect(); // => "Right('RANDOM SUCCESS')" or "Left('random failure')"
 *
 * // as a monad Either can be safely flat mapped with other Eithers (flatMap doesn't execute over Left)
 * Either.of(3).flatMap(a => Either.of(a + 2)).inspect(); // => 'Right(5)'
 * Either.Left(3).flatMap(a => Either.of(null)).inspect(); // => 'Left(3)'
 * Either.of(3).flatMap(a => a + 2); // => 5
 *
 * // as an applicative functor you can apply Eithers to each other especially using liftA2 or liftA3
 * const add = a => b => a + b;
 * liftA2(add)(Either.of(2))(Either.of(3)); // => Right(5)
 * Either.of(1).map(add).ap(Either.of(2)).inspect(); // => 'Right(3)'
 * Either.Left(1).map(add).ap(Either.of(2)).inspect(); // => 'Left(1)'
 * Either.of(add).ap(Either.of(1)).ap(Either.of(2)).inspect(); // => 'Right(3)'
 */
export class Either {
  constructor(x) {
    this.value = x;
  }

  static of(x) {
    return new Right(x);
  }

  static Right(x) {
    return new Right(x);
  }

  static Left(x) {
    return new Left(x);
  }

  static try(fn) {
    try {
      return new Right(fn());
    } catch(e) {
      return new Left(e.message);
    }
  }
}

class Right extends Either {
  inspect() {
    return `Right(${deepInspect(this.value)})`;
  }

  isLeft() {
    return false;
  }

  isRight() {
    return true;
  }

  map(fn) {
    return Either.of(fn(this.value));
  }

  flatMap(fn) {
    return fn(this.value);
  }

  ap(f) {
    return f.map(this.value);
  }
}

class Left extends Either {
  inspect() {
    return `Left(${deepInspect(this.value)})`;
  }

  isLeft() {
    return true;
  }

  isRight() {
    return false;
  }

  map() {
    return this;
  }

  flatMap() {
    return this;
  }

  ap() {
    return this;
  }
}

/**
 * either outputs result of a function onRight if input Either is Right or outputs result of a function onLeft if input Either is Left.
 *
 * either can be called both as a curried unary function or as a standard ternary function.
 *
 * @HindleyMilner either :: (a -> b) -> (b -> c) -> Either
 *
 * @pure
 * @param {function} onLeft
 * @param {function} onRight
 * @param {Either} functorEither
 * @return {*}
 *
 * @example
 * import {either, Either} from '@7urtle/lambda';
 *
 * either(a => 'error ' + a)(a => 'success ' + a)(Either.of('abc')); // => 'success abc'
 * either(a => 'error ' + a)(a => 'success ' + a)(Either.Left('failure')); // => 'error failure'
 * either(a => 'error ' + a)(a => 'success ' + a)(Either.try(() => throw 'failure')); // => 'error failure'
 *
 * // either can be called both as a curried unary function or as a standard ternary function
 * either(a => 'error ' + a)(a => 'success ' + a)(Either.of('abc')) === either(a => 'error ' + a, a => 'success ' + a, Either.of('abc'));
 */
export const either = nary(onLeft => onRight => functorEither =>
  functorEither.isLeft()
    ? onLeft(functorEither.value)
    : onRight(functorEither.value));