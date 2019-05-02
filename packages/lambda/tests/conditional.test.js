import * as λ from '../src';

test('isEqual output is true if strict equality between a and b is true.', () => {
  expect(λ.isEqual('something')('something')).toBe(true);
  expect(λ.isEqual('something')('something else')).toBe(false);
});

test('isEqual output is always false for comparison of objects and arrays.', () => {
  expect(λ.isEqual({})({})).toBe(false);
  expect(λ.isEqual([])([])).toBe(false);
});

test('isNotEqual output is true if strict equality between a and b is false.', () => {
  expect(λ.isNotEqual('something')('something else')).toBe(true);
  expect(λ.isNotEqual('something')('something')).toBe(false);
});

test('isNotEqual output is always true for comparison of objects and arrays.', () => {
  expect(λ.isNotEqual({})({})).toBe(true);
  expect(λ.isNotEqual([])([])).toBe(true);
});

test('isTrue output is true if input is true.', () => {
  expect(λ.isTrue(true)).toBe(true);
  expect(λ.isTrue(false)).toBe(false);
});

test('isFalse output is true if input is false.', () => {
  expect(λ.isFalse(false)).toBe(true);
  expect(λ.isFalse(true)).toBe(false);
});

test('isGreaterThan output is true if b is greater than a.', () => {
  expect(λ.isGreaterThan(1)(2)).toBe(true);
  expect(λ.isGreaterThan(2)(1)).toBe(false);
});

test('isLessThan output is true if b is less than a.', () => {
  expect(λ.isLessThan(2)(1)).toBe(true);
  expect(λ.isLessThan(1)(2)).toBe(false);
});

test('isAtLeast output is true if b is greater or equal to a.', () => {
  expect(λ.isAtLeast(1)(2)).toBe(true);
  expect(λ.isAtLeast(2)(2)).toBe(true);
  expect(λ.isAtLeast(2)(1)).toBe(false);
});

test('isAtMost output is true if b is less or equal to a.', () => {
  expect(λ.isAtMost(2)(1)).toBe(true);
  expect(λ.isAtMost(2)(2)).toBe(true);
  expect(λ.isAtMost(1)(2)).toBe(false);
});

test('isTypeOf output is true if b is a type of a.', () => {
  expect(λ.isTypeOf('number')(1)).toBe(true);
  expect(λ.isTypeOf('string')(1)).toBe(false);
});

test('isString output is true if b is a string.', () => {
  expect(λ.isString('string')).toBe(true);
  expect(λ.isString(1)).toBe(false);
});

test('isBoolean output is true if b is a boolean.', () => {
  expect(λ.isBoolean(true)).toBe(true);
  expect(λ.isBoolean(1)).toBe(false);
});

test('isNull output is true if b is a null.', () => {
  expect(λ.isNull(null)).toBe(true);
  expect(λ.isNull(1)).toBe(false);
});

test('isUndefined output is true if b is an undefined.', () => {
  expect(λ.isUndefined(undefined)).toBe(true);
  expect(λ.isUndefined(1)).toBe(false);
});

test('isNumber output is true if b is a number.', () => {
  expect(λ.isNumber(1)).toBe(true);
  expect(λ.isNumber('string')).toBe(false);
});

test('isObject output is true if b is an object, array of null.', () => {
  expect(λ.isObject({})).toBe(true);
  expect(λ.isObject([])).toBe(true);
  expect(λ.isObject(null)).toBe(true);
  expect(λ.isObject(1)).toBe(false);
});

test('isArray output is true if b is an array.', () => {
  expect(λ.isArray([])).toBe(true);
  expect(λ.isArray({})).toBe(false);
});

test('isFunction output is true if b is a function.', () => {
  const someObject = {inspect: () => 'inspected'};
  expect(λ.isFunction(() => null)).toBe(true);
  expect(λ.isFunction(someObject.inspect)).toBe(true);
  expect(λ.isFunction(1)).toBe(false);
});

test('isLength output is true if b is a length of a.', () => {
  expect(λ.isLength(3)('abc')).toBe(true);
  expect(λ.isLength(3)([1,2,3])).toBe(true);
  expect(λ.isLength(1)('abc')).toBe(false);
  expect(λ.isLength(1)([1,2,3])).toBe(false);
});

test('isNotLength output is true if b is not a length of a.', () => {
  expect(λ.isNotLength(1)('abc')).toBe(true);
  expect(λ.isNotLength(1)([1,2,3])).toBe(true);
  expect(λ.isNotLength(3)('abc')).toBe(false);
  expect(λ.isNotLength(3)([1,2,3])).toBe(false);
});

test('isEmpty output is true if input has a length of 0.', () => {
  expect(λ.isEmpty('')).toBe(true);
  expect(λ.isEmpty([])).toBe(true);
  expect(λ.isEmpty('abc')).toBe(false);
  expect(λ.isEmpty([1,2,3])).toBe(false);
});

test('isEmpty output is always false if input is an object and not an array or a string.', () => {
  expect(λ.isEmpty({})).toBe(false);
});

test('isNotEmpty output is true if input does not have a length of 0.', () => {
  expect(λ.isNotEmpty('abc')).toBe(true);
  expect(λ.isNotEmpty([1,2,3])).toBe(true);
  expect(λ.isNotEmpty('')).toBe(false);
  expect(λ.isNotEmpty([])).toBe(false);
});

test('isNotEmpty output is always true if input is an object and not an array or a string.', () => {
  expect(λ.isNotEmpty({})).toBe(true);
});

test('isZero output is true if a is 0.', () => {
  expect(λ.isZero(0)).toBe(true);
  expect(λ.isZero(1)).toBe(false);
  expect(λ.isZero('7urtle')).toBe(false);
});

test('isNotZero output is true if a is not 0.', () => {
  expect(λ.isNotZero(1)).toBe(true);
  expect(λ.isNotZero('7urtle')).toBe(true);
  expect(λ.isNotZero(0)).toBe(false);
});

test('isNothing returns true if input is null, undefined or empty string or empty array.', () => {
  expect(λ.isNothing(null)).toBe(true);
  expect(λ.isNothing(undefined)).toBe(true);
  expect(λ.isNothing('')).toBe(true);
  expect(λ.isNothing([])).toBe(true);
  expect(λ.isNothing(1)).toBe(false);
  expect(λ.isNothing('7urtle')).toBe(false);
  expect(λ.isNothing([1, 2])).toBe(false);
});

test('isJust returns true if input is not null, undefined or empty string or empty array.', () => {
  expect(λ.isJust(1)).toBe(true);
  expect(λ.isJust('7urtle')).toBe(true);
  expect(λ.isJust([1, 2])).toBe(true);
  expect(λ.isJust(null)).toBe(false);
  expect(λ.isJust(undefined)).toBe(false);
  expect(λ.isJust('')).toBe(false);
  expect(λ.isJust([])).toBe(false);
});