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

test('functorMap maps function over inputted functor outputting resulting functor.', () => {
  class Functor {
    constructor(x) {
      this.value = x;
    }
    static of(x) {
      return new Functor(x);
    }
    map(fn) {
      return Functor.of(fn(this.value));
    }
    flatMap(fn) {
      return fn(this.value);
    }
  }
  expect(λ.functorMap(a => a + 's')(Functor.of('7urtle')).value).toBe('7urtles');
});

test('functorFlatMap flatMaps function outputting functor over inputted functor outputting resulting functor.', () => {
  class Functor {
    constructor(x) {
      this.value = x;
    }
    static of(x) {
      return new Functor(x);
    }
    map(fn) {
      return Functor.of(fn(this.value));
    }
    flatMap(fn) {
      return fn(this.value);
    }
  }
  expect(λ.functorFlatMap(a => Functor.of(a + 's'))(Functor.of('7urtle')).value).toBe('7urtles');
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

test('contact outputs concatenated inputs of strings, arrays and objects or outputs false for other types.', () => {
  expect(λ.concat('cd')('ab')).toBe('abcd');
  expect(λ.deepInspect(λ.concat([3, 4])([1, 2]))).toBe('[1, 2, 3, 4]');
  expect(λ.deepInspect(λ.concat({here: 'there'})({hi: 'hello'}))).toBe(`{hi: 'hello', here: 'there'}`);
  expect(λ.deepInspect(λ.concat({here: {here: 'there'}})({hi: 'hello'}))).toBe(`{hi: 'hello', here: {here: 'there'}}`);
});