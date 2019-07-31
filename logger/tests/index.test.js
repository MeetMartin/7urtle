import createLogger from '../src/index';

test('Logger works without configuration.', () => {
  const logger = createLogger();

  expect(logger.log('hello world')).toEqual('hello world');
  expect(logger.info('hello world')).toEqual('hello world');
  expect(logger.debug('hello world')).toEqual('hello world');
  expect(logger.warn('hello world')).toEqual('hello world');
  expect(logger.error('hello world')).toEqual('hello world');
});