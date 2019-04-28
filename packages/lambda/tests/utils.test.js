import * as λ from '../src';

test('passThrough output is the same as input a.', () => {
  expect(λ.passThrough(() => 'b')('a')).toBe('a');
});

test('inspect output is the same as input.', () => {
  expect(λ.inspect('a')).toBe('a');
});