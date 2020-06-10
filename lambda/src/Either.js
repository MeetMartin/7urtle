import {deepInspect} from "./utils";
import {nary} from "./arity";

/**
 * Either.of() outputs instance of Either.
 * Either.of(a) outputs instance of Right holding its input value.
 * Either.Right(a) outputs instance of Right holding its input value.
 * Either.Left(a) outputs instance of Left holding its input value.
 * Either.of(a).inspect() outputs string Right(a).
 * Either.Right(a).inspect() outputs string Right(a).
 * Either.Left(a).inspect() outputs string Left(a).
 * Either.of(a).isRight() always outputs true.
 * Either.Left(a).isLeft() outputs false if Either is Left.
 * Either.try(a -> b) outputs Right(b) if no error is thrown.
 * Either.try(a -> b) outputs Left(e.message) if error is thrown.
 * Either.of(a).map(a -> b) executes function over Either input a.
 * Either.of(a).map(a -> Right) outputs Right(Right).
 * Either.Left(a).map(a -> b) does not execute provided function and retains Left input value.
 * Either.of(a).flatMap(a -> b) executes function over Either input a returns its raw value through flatten.
 * Either.Left(a).flatMap(a -> b) does not execute provided function and retains Left input value.
 * Either.of(Either -> Either -> c).ap(Either).ap(Either) provides applicative interface.
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
 * either :: (a -> b) -> (b -> c) -> Either
 *
 * either outputs result of a function onRight if input Either is Right or outputs result of a function onLeft if input Either is Left.
 */
export const either = nary(onLeft => onRight => functorEither =>
  functorEither.isLeft()
    ? onLeft(functorEither.value)
    : onRight(functorEither.value));