import * as λ from '../src';

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

test('endsWith outputs true if an input string ends with provided string.', () => {
  expect(λ.endsWith('e')('7urtle')).toBe(true);
  expect(λ.endsWith('urtle')('7urtle')).toBe(true);
  expect(λ.endsWith('urtls')('7urtle')).toBe(false);
});

test('indexOf outputs position of input substring withing input string or false.', () => {
  expect(λ.indexOf('7')('7urtle')).toBe(0);
  expect(λ.indexOf(7)('7urtle')).toBe(0);
  expect(λ.indexOf('urtle')('7urtle')).toBe(1);
  expect(λ.indexOf('rt')('7urtle')).toBe(2);
  expect(λ.indexOf('8')('7urtle')).toBe(false);
  expect(λ.indexOf('a')('aa')).toBe(0);
});

test('lastIndexOf outputs position of input substring withing input string looking from the end or it retuns false if it is not found.', () => {
  expect(λ.lastIndexOf('7')('7urtle')).toBe(0);
  expect(λ.lastIndexOf(7)('7urtle')).toBe(0);
  expect(λ.lastIndexOf('urtle')('7urtle')).toBe(1);
  expect(λ.lastIndexOf('rt')('7urtle')).toBe(2);
  expect(λ.lastIndexOf('8')('7urtle')).toBe(false);
  expect(λ.lastIndexOf('a')('aa')).toBe(1);
});

test('repeat outputs new string repeating input string inputed count of times.', () => {
  expect(λ.repeat(2)('7urtle')).toBe('7urtle7urtle');
  expect(λ.repeat(1)('7urtle')).toBe('7urtle');
  expect(λ.repeat(0)('7urtle')).toBe('');
});

test('replace outputs new string replacing input substring with input replacement string in input string.', () => {
  expect(λ.replace('8')('7')('7urtle')).toBe('8urtle');
  expect(λ.replace('7')('')('7urtle')).toBe('77urtle');
  expect(λ.replace('')('7')('7urtle')).toBe('urtle');
  expect(λ.replace('8')('9')('7urtle')).toBe('7urtle');
});