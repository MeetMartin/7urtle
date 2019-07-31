import {isTrue, passThrough, compose, upperCaseOf} from "@7urtle/lambda";

const createLogger = configuration => getLogger({
  ...defaultConfiguration,
  ...configuration
});

const defaultDecorator = level => input =>
  new Date().toLocaleString() + '; ' + upperCaseOf(level) + ': ' + input;

const defaultConfiguration = {
  levels: {
    log: true,
    debug: true,
    info: true,
    warn: true,
    error: true
  },
  library: console,
  decorator: defaultDecorator
};

const getLogger = configuration => ({
  log: log(configuration)('log'),
  debug: log(configuration)('debug'),
  info: log(configuration)('info'),
  warn: log(configuration)('warn'),
  error: log(configuration)('error')
});

const log = configuration => level =>
  isTrue(configuration.levels[level])
    ? passThrough(compose(configuration.library[level], configuration.decorator(level)))
    : getNull;

const getNull = () => null;

export default createLogger;

export {
  defaultDecorator,
  getLogger,
  log,
  getNull
};