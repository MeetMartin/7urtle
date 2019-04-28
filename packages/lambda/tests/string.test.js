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
  expect(λ.includes('tr')('string')).toBe(true);
  expect(λ.includes('string')('string')).toBe(true);
  expect(λ.includes('turtle')('string')).toBe(false);
});

test('testRegEx returns true if string b passes regular expression a.', () => {
  expect(λ.testRegEx(/[a-z]/)('string')).toBe(true);
  expect(λ.testRegEx(/[0-9]/)('1')).toBe(true);
  expect(λ.testRegEx(/[0-9]/)('string')).toBe(false);
});