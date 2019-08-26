import {
  SyncEffect,
  Either,
  either,
  Maybe,
  Case,
  trim,
  identity,
  compose,
  startsWith,
  lengthOf,
  substr, isEqual
} from "@7urtle/lambda";
import createLogger from "@7urtle/logger";
import commander from 'commander';
import fs from 'fs';
import readline from 'readline';
import path from 'path';

const logger = createLogger();

const program =
  SyncEffect
  .of(() => new commander.Command())
  .map(a => a.version('0.0.1', '-v, --version', 'output the current version'))
  .map(a => a.option('-i, --input <input>', 'input file or directory'))
  .map(a => a.option('-o, --output <output>', 'output directory'))
  .map(a => a.parse(process.argv));

const commanderFailed = logger => error => logger.error(`Documenter failed during initialisation with error: ${error}.`);

const getFSStatus = path => Either.try(() => fs.statSync(path));
const isFile = fsStatus => fsStatus.isLeft() ? false : fsStatus.value.isFile();

const states = {
  ERROR: 'ERROR',
  CODE: 'CODE',
  DESCRIPTION: 'DESCRIPTION',
  TAG: 'TAG',
  EXAMPLE: 'EXAMPLE'
};

let documentation = {
  state: states.CODE,
  contents: {
    description: [],
    tags: {},
    example: []
  }
};

const getDocumentationLineContents = line =>
  (length => length > 1 ? trim(substr(length)(1)(line)) : '')
  (lengthOf(line));

const processLineCodeState = line =>
  isEqual('/**')(line)
    ? documentation.state = states.DESCRIPTION
    : false;

const processLineDescriptionState = line =>
  startsWith('*')(line)
    ? isEqual('*/')(line)
        ? documentation.state = states.CODE
        : (contents => lengthOf(contents) > 1 ? documentation.contents.description.push(contents) : false)
          (getDocumentationLineContents(line))
    : documentation.state = states.ERROR;

const processLineBasedOnState = state =>
  Case
  .of([
    [states.ERROR, identity],
    [states.CODE, processLineCodeState],
    [states.DESCRIPTION, processLineDescriptionState]
  ])
  .match(state);

const processLine = line => processLineBasedOnState(documentation.state)(trim(line));

const onFileEnd = logger => documentation => () => logger.debug(JSON.stringify(documentation));

const lineReader = path =>
  readline
  .createInterface({input: fs.createReadStream(path)})
  .on('line', processLine)
  .on('close', onFileEnd(logger)(documentation));

const lineReaderWithExceptionProcessing = logger => path => {
  logger.info(`Processing file "${path}".`);
  return either
  (error => logger.error(`There was an error processing file "${path}" with exception: "${error}".`))
  (identity)
  (Either.try(() => lineReader(path)));
};

const getInput = logger => program =>
  (input =>
    input.isNothing()
      ? logger.error('Input is required argument. Try: $ documenter --input ./your/directory')
      : compose(isFile, getFSStatus)(input.value)
        ? lineReaderWithExceptionProcessing(logger)(input.value)
        : logger.error('Only files are supported.')
  )(Maybe.of(program.input));

either
(commanderFailed(logger))
(getInput(logger))
(Either.try(program.trigger));
