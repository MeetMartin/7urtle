import * as λ from '../src';

test('syncEffect.of() outputs instance of syncEffect.', () => {
  expect(λ.syncEffect.of() instanceof λ.syncEffect).toBe(true);
});

test('syncEffect.of(() -> a).inspect() outputs string syncEffect(a).', () => {
  expect(λ.syncEffect.of(() => '7turtle').inspect().includes('syncEffect(function')).toBe(true);
});

test('syncEffect.of(() -> a).trigger() executes function provided as input of syncEffect.', () => {
  expect(λ.syncEffect.of(() => '7turtle').trigger()).toBe('7turtle');
});

test('syncEffect.of(() -> a).map(b -> c) composes function over syncEffect input function.', () => {
  expect(λ.syncEffect.of(() => '7turtle').map(a => a + 's').trigger()).toBe('7turtles');
  expect(λ.syncEffect.of(() => 1).map(a => a + 1).trigger()).toBe(2);
});

test('syncEffect.of(() -> a).map(b -> syncEffect) outputs syncEffect(syncEffect).', () => {
  expect(λ.syncEffect.of(() => '7turtle').map(a => λ.syncEffect.of(() => a + 's')).trigger().trigger()).toBe('7turtles');
});

test('syncEffect.of(() -> a).flatMap(b -> syncEffect) outputs syncEffect.', () => {
  expect(λ.syncEffect.of(() => '7turtle').flatMap(a => λ.syncEffect.of(() => a + 's')).trigger()).toBe('7turtles');
});

test('syncEffect.of(() -> a).map(a -> b).ap(syncEffect) provides applicative ability to apply functors to each other.', () => {
  const add = a => b => a + b;
  expect(λ.syncEffect.of(() => 1).map(add).ap(λ.syncEffect.of(() => 2)).trigger()).toBe(3);
});

test('syncEffect.of(syncEffect -> syncEffect -> c).ap(syncEffect).ap(syncEffect) provides applicative interface for a functor of a function.', () => {
  const add = a => b => a + b;
  expect(λ.syncEffect.of(() => add).ap(λ.syncEffect.of(() => 1)).ap(λ.syncEffect.of(() => 2)).trigger()).toBe(3);
  expect(λ.syncEffect.of(() => add).ap(λ.syncEffect.of(() => undefined)).ap(λ.syncEffect.of(() => 2)).trigger()).toBe(NaN);
});

test('No input function is executed until trigger is called.', () => {
  let some = 1;
  λ.syncEffect.of(() => ++some).map(a => {some=some+a; return some;});
  expect(some).toBe(1);
  λ.syncEffect.of(() => ++some).map(a => {some=some+a; return some;}).trigger();
  expect(some).toBe(4);
  λ.syncEffect.of(() => ++some).flatMap(a => λ.syncEffect.of(() => {some=some+a; return some;}));
  expect(some).toBe(4);
  λ.syncEffect.of(() => ++some).flatMap(a => λ.syncEffect.of(() => {some=some+a; return some;})).trigger();
  expect(some).toBe(10);
  λ.syncEffect.of(() => ++some).map(a => b => a + b).ap(λ.syncEffect.of(() => ++some));
  expect(some).toBe(10);
  λ.syncEffect.of(() => ++some).map(a => b => a + b).ap(λ.syncEffect.of(() => ++some)).trigger();
  expect(some).toBe(12);
});