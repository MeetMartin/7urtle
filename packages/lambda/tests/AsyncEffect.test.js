import * as λ from '../src';

const resolving = async (reject, resolve) => setTimeout(() => resolve('7urtle'), 10);
const rejecting = async (reject, resolve) => setTimeout(() => reject('I am an error.'), 10);

test('AsyncEffect.of() outputs instance of AsyncEffect.', () => {
  expect(λ.AsyncEffect.of() instanceof λ.AsyncEffect).toBe(true);
});

test('AsyncEffect.of(() -> a).inspect() outputs string AsyncEffect(a).', () => {
  expect(λ.AsyncEffect.of(() => '7turtle').inspect().includes('AsyncEffect(function')).toBe(true);
});

test('AsyncEffect.of((a, b) -> c).trigger(d -> e, f -> g) for resolving async function resolves.', done => {
  λ.AsyncEffect.of(resolving).trigger(error => error, result => {
    expect(result).toBe('7urtle');
    done();
  });
});

test('AsyncEffect.of((a, b) -> c).trigger(d -> e, f -> g) for rejecting async function rejects.', done => {
  λ.AsyncEffect.of(rejecting).trigger(error => {
    expect(error).toBe('I am an error.');
    done();
  }, result => result);
});

test('AsyncEffect.of((a, b) -> c).map(b -> c) composes function over AsyncEffect input function.', done => {
  λ.AsyncEffect.of(resolving).map(a => a + 's').trigger(error => error, result => {
    expect(result).toBe('7urtles');
    done();
  });
});

test('AsyncEffect.of((a, b) -> c).map(b -> AsyncEffect) outputs AsyncEffect(AsyncEffect).', done => {
  λ.AsyncEffect.of(resolving).map(() => λ.AsyncEffect.of(resolving)).trigger(error => error, result => {
    expect(result instanceof λ.AsyncEffect).toBe(true);
    done();
  });
});

test('AsyncEffect.of((a, b) -> c).flatMap(b -> AsyncEffect) outputs AsyncEffect.', done => {
  λ.AsyncEffect.of(resolving).flatMap(a => λ.AsyncEffect.of((reject, resolve) => resolve(a + 's'))).trigger(error => error, result => {
    expect(result).toBe('7urtles');
    done();
  });
});

test('AsyncEffect.of((a, b) -> c).map(a -> b).ap(AsyncEffect) provides applicative ability to apply functors to each other.', done => {
  const add = a => b => a + b;
  const resolving = async (reject, resolve) => setTimeout(() => resolve(1), 10);
  λ.AsyncEffect.of(resolving).map(add).ap(λ.AsyncEffect.of(resolving)).trigger(error => error, result => {
    expect(result).toBe(2);
    done();
  });
});

test('AsyncEffect.of(AsyncEffect -> AsyncEffect -> c).ap(AsyncEffect).ap(AsyncEffect) provides applicative interface for a functor of a function.', done => {
  const add = a => b => a + b;
  const resolving = async (reject, resolve) => setTimeout(() => resolve(1), 10);
  λ.AsyncEffect.of((reject, resolve) => resolve(add)).ap(λ.AsyncEffect.of(resolving)).ap(λ.AsyncEffect.of(resolving)).trigger(error => error, result => {
    expect(result).toBe(2);
    done();
  });
});

test('No input function is executed until trigger is called.', done => {
  let some = 1;
  const resolving = async (reject, resolve) => setTimeout(() => resolve(++some), 10);
  λ.AsyncEffect.of(resolving);
  expect(some).toBe(1);
  λ.AsyncEffect.of(resolving).trigger(error => error, result => {
      expect(some).toBe(2);
      expect(result).toBe(2);
      done();
    });
});