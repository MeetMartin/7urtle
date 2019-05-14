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

test('contact outputs concatenated inputs of strings, arrays and objects or outputs undefined for other types.', () => {
  expect(λ.concat('cd')('ab')).toBe('abcd');
  expect(λ.concat([3, 4])([1, 2])).toEqual([1, 2, 3, 4]);
  expect(λ.concat({here: 'there'})({hi: 'hello'})).toEqual({hi: 'hello', here: 'there'});
  expect(λ.concat({here: {here: 'there'}})({hi: 'hello'})).toEqual({hi: 'hello', here: {here: 'there'}});
  expect(λ.concat('cd')(1)).toBe(undefined);
});

test('includes output is true if b includes a.', () => {
  expect(λ.includes('rt')('7urtle')).toBe(true);
  expect(λ.includes('7urtle')('7urtle')).toBe(true);
  expect(λ.includes('turtle')('7urtle')).toBe(false);
  expect(λ.includes(1)([1, 2, 3])).toBe(true);
  expect(λ.includes(4)([1, 2, 3])).toBe(false);
});

test('indexOf outputs position of input a withing input b or undefined if it is not found.', () => {
  expect(λ.indexOf('7')('7urtle')).toBe(0);
  expect(λ.indexOf(7)('7urtle')).toBe(0);
  expect(λ.indexOf('urtle')('7urtle')).toBe(1);
  expect(λ.indexOf('rt')('7urtle')).toBe(2);
  expect(λ.indexOf(2)([1, 2, 3])).toBe(1);
  expect(λ.indexOf('8')('7urtle')).toBe(undefined);
  expect(λ.indexOf(4)([1, 2, 3])).toBe(undefined);
  expect(λ.indexOf('a')('aa')).toBe(0);
});

test('lastIndexOf outputs position of input a withing input b looking from the end or it retuns undefined if it is not found.', () => {
  expect(λ.lastIndexOf('7')('7urtle')).toBe(0);
  expect(λ.lastIndexOf(7)('7urtle')).toBe(0);
  expect(λ.lastIndexOf('urtle')('7urtle')).toBe(1);
  expect(λ.lastIndexOf('rt')('7urtle')).toBe(2);
  expect(λ.lastIndexOf('8')('7urtle')).toBe(undefined);
  expect(λ.lastIndexOf(2)([1, 2, 3, 2])).toBe(3);
  expect(λ.lastIndexOf(4)([1, 2, 3])).toBe(undefined);
  expect(λ.lastIndexOf('a')('aa')).toBe(1);
});