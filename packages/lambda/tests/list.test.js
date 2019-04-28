import * as λ from '../src';

test('reduce executes input reducer function that over each member of input array [b] to output single value a.', () => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const list = ['a', 'b', 'c'];
  expect(λ.reduce('start')(reducer)(list)).toBe('startabc');
});

test('reduceRight executes input reducer function that over each member of input array [b] to output single value a.', () => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const list = ['a', 'b', 'c'];
  expect(λ.reduceRight('start')(reducer)(list)).toBe('startcba');
});

test('reduceRight executes functions in reverse order to reduce.', () => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const list = ['a', 'b', 'c'];
  const reversedList = ['c', 'b', 'a'];
  expect(λ.reduceRight('start')(reducer)(list)).toBe(λ.reduce('start')(reducer)(reversedList));
});

test('map executes input mapper over each member of input array [a] to output new array [b].', () => {
  const mapper = a => a + 'm';
  const list = ['a', 'b', 'c'];
  expect(λ.map(mapper)(list)).toEqual(['am', 'bm', 'cm']);
});