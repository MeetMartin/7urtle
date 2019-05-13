import * as λ from '../src';

test('Case.of() outputs instance of Case.', () => {
  expect(λ.Case.of() instanceof λ.Case).toBe(true);
});

test('Case.of({}).inspect() outputs string Case(a).', () => {
  expect(λ.Case.of({_: 'unknown'}).inspect().includes('Case(function')).toBe(true);
});

test('Case.of({}).match(a) matches input a against map provided as input of Case.', () => {
  const caseExpression = λ.Case.of({
    1: 'one',
    2: 'two',
    _: 'unknown'
  });
  expect(caseExpression.match(1)).toBe('one');
  expect(caseExpression.match(3)).toBe('unknown');
  expect(λ.Case.of({}).match(1)).toBe(null);
});