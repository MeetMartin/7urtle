import {upperCaseOf} from "@7urtle/lambda";

let savedLog = null;

const logMessage = message => savedLog = message;

const library = {
  log: logMessage,
  info: logMessage,
  debug: logMessage,
  warn: logMessage,
  error: logMessage
};

const loggerConfiguration = {
  library: library,
  decorator: level => input => upperCaseOf(level) + ': ' + input,
  getLog: () => savedLog
};

export default loggerConfiguration;