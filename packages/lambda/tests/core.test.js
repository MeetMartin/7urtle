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

test('pipe executes function in reverse order to compose.', () => {
  const f = a => a + 'f';
  const g = a => a + 'g';
  expect(λ.pipe(g, f)('a')).toBe(λ.compose(f, g)('a'));
});