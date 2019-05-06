import * as λ from '../src';

test('trim output is a string without white characters around it.', () => {
  expect(λ.trim(' a ')).toBe('a');
  expect(λ.trim(' a \n ')).toBe('a');
});

test('trim output is a string without white characters around it.', () => {
  expect(λ.trim(' a ')).toBe('a');
  expect(λ.trim(' a \n ')).toBe('a');
});

test('includes output is true if b includes a.', () => {
  expect(λ.includes('rt')('7urtle')).toBe(true);
  expect(λ.includes('7urtle')('7urtle')).toBe(true);
  expect(λ.includes('turtle')('7urtle')).toBe(false);
});

test('testRegEx outputs true if string b passes regular expression a.', () => {
  expect(λ.testRegEx(/[a-z]/)('7urtle')).toBe(true);
  expect(λ.testRegEx(/[0-9]/)('1')).toBe(true);
  expect(λ.testRegEx(/[0-9]/)('abc')).toBe(false);
});

test('substr outputs substring based on provided string, start and limit.', () => {
  expect(λ.substr(3)(1)('7urtle')).toBe('urt');
  expect(λ.substr(1)(0)('7urtle')).toBe('7');
  expect(λ.substr(1)(-1)('7urtle')).toBe('e');
  expect(λ.substr(1)(1)('7urtle')).not.toBe('7');
});

test('startsWith outputs true if an input string starts with provided string.', () => {
  expect(λ.startsWith('7')('7urtle')).toBe(true);
  expect(λ.startsWith('7urtl')('7urtle')).toBe(true);
  expect(λ.startsWith('8urtl')('7urtle')).toBe(false);
});