import * as λ from '../src';

test('typeOf outputs type of its input a.', () => {
  expect(λ.typeOf('7turtle')).toBe('string');
});

test('passThrough output is the same as input a.', () => {
  expect(λ.passThrough(() => 'b')('a')).toBe('a');
});

test('log output is the same as input.', () => {
  expect(λ.log('a')).toBe('a');
});

test('inspectFunction outputs name of named function or its conversion to string.', () => {
  function namedFunction() {
    return null;
  }
  expect(λ.inspectFunction(() => 'b').includes('function')).toBe(true);
  expect(λ.inspectFunction(namedFunction)).toBe('namedFunction');
});

test('inspectArray maps over input array [a] and outputs string representing it.', () => {
  function namedFunction() {
    return null;
  }
  expect(λ.inspectArray([1, 'a'])).toBe('[1, \'a\']');
  expect(λ.inspectArray([namedFunction, 'a'])).toBe('[namedFunction, \'a\']');
});

test('inspectString outputs string representing input.', () => {
  expect(λ.inspectString('a')).toBe('\'a\'');
});

test('inspectObject outputs string representing input.', () => {
  expect(λ.inspectObject({a: 'b'})).toBe('{a: \'b\'}');
  expect(λ.inspectObject({inspect: () => 'inspected'})).toBe('inspected');
});

test('deepInspect outputs inspectObject if input is an object.', () => {
  expect(λ.deepInspect({a: 'b'})).toBe(λ.inspectObject({a: 'b'}));
  expect(λ.deepInspect({inspect: () => 'inspected'})).toBe(λ.inspectObject({inspect: () => 'inspected'}));
});

test('deepInspect outputs inspectFunction if input is a function.', () => {
  function namedFunction() {
    return null;
  }
  expect(λ.deepInspect(() => 'b')).toBe(λ.inspectFunction(() => 'b'));
  expect(λ.deepInspect(namedFunction)).toBe(λ.inspectFunction(namedFunction));
});

test('deepInspect outputs inspectArray if input is an array.', () => {
  function namedFunction() {
    return null;
  }
  expect(λ.deepInspect([1, 'a'])).toBe(λ.inspectArray([1, 'a']));
  expect(λ.deepInspect([namedFunction, 'a'])).toBe(λ.inspectArray([namedFunction, 'a']));
});

test('deepInspect outputs inspectString if input is a string.', () => {
  expect(λ.deepInspect('a')).toBe(λ.inspectString('a'));
});

test('deepInspect outputs string if input is not an object, function, array or a string.', () => {
  expect(λ.deepInspect(1)).toBe('1');
});