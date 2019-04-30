import * as λ from '../src';

test('identity output is the same as input.', () => {
  expect(λ.identity('a')).toBe('a');
});

test('compose(f,g)(x) is equivalent to f(g(x)).', () => {
  const f = a => a + 'f';
  const g = a => a + 'g';
  expect(λ.compose(f, g)('a')).toBe(f(g('a')));
  expect(λ.compose(f, g)('a')).not.toBe(g(f('a')));
});

test('pipe(f,g)(x) is equivalent to g(f(x)).', () => {
  const f = a => a + 'f';
  const g = a => a + 'g';
  expect(λ.pipe(f, g)('a')).toBe(g(f('a')));
  expect(λ.pipe(f, g)('a')).not.toBe(f(g('a')));
});

test('pipe executes functions in reverse order to compose.', () => {
  const f = a => a + 'f';
  const g = a => a + 'g';
  expect(λ.pipe(g, f)('a')).toBe(λ.compose(f, g)('a'));
});

test('liftA2 provides point-free way of writing calls over applicative functors and functions with arity 2.', () => {
  const add = a => b => a + b;
  class Applicative {
    constructor(x) {
      this.value = x;
    }
    static of(x) {
      return new Applicative(x);
    }
    map(fn) {
      return Applicative.of(fn(this.value));
    }
    ap(f) {
      return f.map(this.value);
    }
  }
  expect(λ.liftA2(add)(Applicative.of(1))(Applicative.of(2)).value).toBe(3);
});

test('liftA3 provides point-free way of writing calls over applicative functors and functions with arity 3.', () => {
  const add3 = a => b => c => a + b + c;
  class Applicative {
    constructor(x) {
      this.value = x;
    }
    static of(x) {
      return new Applicative(x);
    }
    map(fn) {
      return Applicative.of(fn(this.value));
    }
    ap(f) {
      return f.map(this.value);
    }
  }
  expect(λ.liftA3(add3)(Applicative.of(1))(Applicative.of(2))(Applicative.of(3)).value).toBe(6);
});