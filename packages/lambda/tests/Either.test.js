import * as λ from '../src';

test('Either.of() outputs instance of Either.', () => {
  expect(λ.Either.of(3) instanceof λ.Either).toBe(true);
});

test('Either.of(a) outputs instance of Right holding its input value.', () => {
  expect(λ.Either.of(3).inspect()).toBe('Right(3)');
});

test('Either.Right(a) outputs instance of Right holding its input value.', () => {
  expect(λ.Either.Right(3).inspect()).toBe('Right(3)');
});

test('Either.Left(a) outputs instance of Left holding its input value.', () => {
  expect(λ.Either.Left('I am an error.').inspect()).toBe('Left(\'I am an error.\')');
});

test('Either.of(a).inspect() outputs string Right(a).', () => {
  expect(λ.Either.of(3).inspect()).toBe('Right(3)');
});

test('Either.Right(a).inspect() outputs string Right(a).', () => {
  expect(λ.Either.Right(3).inspect()).toBe('Right(3)');
});

test('Either.Left(a).inspect() outputs string Left(a).', () => {
  expect(λ.Either.Left('I am an error.').inspect()).toBe('Left(\'I am an error.\')');
});

test('Either.of(a).isRight() always outputs true.', () => {
  expect(λ.Either.of(3).isRight()).toBe(true);
  expect(λ.Either.of(3).isLeft()).toBe(false);
});

test('Either.Left(a).isLeft() outputs false if Either is Left.', () => {
  expect(λ.Either.Left('I am an error.').isLeft()).toBe(true);
  expect(λ.Either.Left('I am an error.').isRight()).toBe(false);
});

test('Either.try(a -> b) outputs Right(b) if no error is thrown.', () => {
  const iReturnValue = () => '7urtle';
  expect(λ.Either.try(iReturnValue).inspect()).toBe('Right(\'7urtle\')');
  expect(λ.Either.try(iReturnValue).isRight()).toBe(true);
  expect(λ.Either.try(iReturnValue).isLeft()).toBe(false);
});

test('Either.try(a -> b) outputs Left(e.message) if error is thrown.', () => {
  const iThrowError = () => throw new Error('I am an error.');
  expect(λ.Either.try(iThrowError).inspect()).toBe('Left(\'I am an error.\')');
  expect(λ.Either.try(iThrowError).isLeft()).toBe(true);
  expect(λ.Either.try(iThrowError).isRight()).toBe(false);
});

test('Either.of(a).map(a -> b) executes function over Either input a.', () => {
  expect(λ.Either.of(3).map(a => a + 2).inspect()).toBe('Right(5)');
});

test('Either.of(a).map(a -> Right) outputs Right(Right).', () => {
  expect(λ.Either.of(3).map(a => λ.Either.of(a + 2)).inspect()).toBe('Right(Right(5))');
});

test('Either.Left(a).map(a -> b) does not execute provided function and retains Left input value.', () => {
  expect(λ.Either.Left('I am an error.').map(a => a + '7turtle').inspect()).toBe('Left(\'I am an error.\')');
});

test('Either.of(a).flatMap(a -> b) executes function over Either input a returns its raw value.', () => {
  expect(λ.Either.of(λ.Either.of(3).flatMap(a => a + 2)).inspect()).toBe('Right(5)');
  expect(λ.Either.of(3).flatMap(() => λ.Either.Left('I am an error.')).inspect()).toBe('Left(\'I am an error.\')');
  expect(λ.Either.of(3).flatMap(a => a + 2)).toBe(5);
});

test('Either.Left(a).flatMap(a -> b) does not execute provided function and retains Left input value.', () => {
  expect(λ.Either.Left('I am an error.').flatMap(a => a + '7turtle').inspect()).toBe('Left(\'I am an error.\')');
});

test('Either.of(a).map(a -> b).ap(Either) provides applicative ability to apply functors to each other.', () => {
  const add = a => b => a + b;
  expect(λ.Either.of(1).map(add).ap(λ.Either.of(2)).inspect()).toBe('Right(3)');
  expect(λ.Either.of(1).map(add).ap(λ.Either.Left('I am an error.')).inspect()).toBe('Left(\'I am an error.\')');
  expect(λ.Either.Left('I am an error.').map(add).ap(λ.Either.of(2)).inspect()).toBe('Left(\'I am an error.\')');
});

test('Either.of(Either -> Either -> c).ap(Either).ap(Either) provides applicative interface for a functor of a function.', () => {
  const add = a => b => a + b;
  expect(λ.Either.of(add).ap(λ.Either.of(1)).ap(λ.Either.of(2)).inspect()).toBe('Right(3)');
  expect(λ.Either.of(add).ap(λ.Either.Left('I am an error.')).ap(λ.Either.of(2)).inspect()).toBe('Left(\'I am an error.\')');
  expect(λ.Either.Left('I am an error.').ap(λ.Either.of(1)).ap(λ.Either.of(2)).inspect()).toBe('Left(\'I am an error.\')');
});