import {
    Either,
    either,
    Case,
    trim,
    identity,
    startsWith,
    lengthOf,
    search,
    substr,
    isEqual,
    lowerCaseOf,
    isUndefined,
} from "@7urtle/lambda";
import createLogger from "@7urtle/logger";

import fs from 'fs';
import readline from 'readline';

import {getCMDInput} from './IOCommanderSyncEffect';

const logger = createLogger();

const states = {
  ERROR: 'ERROR',
  CODE: 'CODE',
  DESCRIPTION: 'DESCRIPTION',
  TAG: 'TAG',
  EXAMPLE: 'EXAMPLE'
};

let documentation = {
  state: states.CODE,
  contents: [{
    description: [],
    tags: {},
    example: []
  }],
  counter: 0
};

const getDocumentationLineContents = line =>
  (length => length > 1 ? trim(substr(length)(1)(line)) : '')
  (lengthOf(line));

const processLineCodeState = line =>
  isEqual('/**')(line)
    ? newCodeDocumentation()
    : false;

const positionToWhiteSpaceOrStringLenght = contents => (result => isEqual(result)(undefined) ? lengthOf(contents) : result)(search(' ')(contents));

const getTag = contents => substr(positionToWhiteSpaceOrStringLenght(contents) -1)(1)(contents);

const getTagContents = contents => isEqual(search(' ')(contents))(undefined) ? 'true' : trim(substr(lengthOf(contents))(positionToWhiteSpaceOrStringLenght(contents))(contents));

const newCodeDocumentation = () =>
  (documentation.state = states.DESCRIPTION) &&
  ++documentation.counter &&
  documentation.contents.push({
    description: [],
    tags: {},
    example: []
  });

const processTag = tagContents => tag =>
  isEqual(lowerCaseOf(tag))('example')
    ? (documentation.state = states.EXAMPLE)
    : (documentation.state = states.TAG) && (documentation.contents[documentation.counter].tags[tag] = tagContents)

//const createArrayIfNotArrayAndPush = contents => target => isArray(target) ? target.push(contents) : (target = []) && target.push(contents);

const processDescriptionOrTag = contents =>
  startsWith('@')(contents)
    //? (lengthOf(contents) > 2 ? documentation.contents[documentation.counter].tags[getTag(contents)] = getTagContents(contents) : false)
    ? (lengthOf(contents) > 2 ? processTag(getTagContents(contents))(getTag(contents)) : false)
    : lengthOf(contents) > 1 ? documentation.contents[documentation.counter].description.push(contents) : false;
    //: lengthOf(contents) > 1 ? createArrayIfNotArrayAndPush(contents)(documentation.contents[documentation.counter].description) : false;

const processLineDescriptionState = line =>
  startsWith('*')(line)
    ? isEqual('*/')(line)
        ? documentation.state = states.CODE
        : processDescriptionOrTag(getDocumentationLineContents(line))
    : documentation.state = states.ERROR;

const processExampleOrTag = contents =>
    startsWith('@')(contents)
      ? (lengthOf(contents) > 2 ? processTag(getTagContents(contents))(getTag(contents)) : false)
      : lengthOf(contents) > 1 ? documentation.contents[documentation.counter].example.push(contents) : false;

const processLineExampleState = line =>
  startsWith('*')(line)
    ? isEqual('*/')(line)
        ? documentation.state = states.CODE
        : processExampleOrTag(getDocumentationLineContents(line))
    : documentation.state = states.ERROR;

const processLineBasedOnState = state =>
  Case
  .of([
    [states.ERROR, identity],
    [states.CODE, processLineCodeState],
    [states.DESCRIPTION, processLineDescriptionState],
    [states.TAG, processLineDescriptionState],
    [states.EXAMPLE, processLineExampleState]
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

const IOConfiguration = getCMDInput(logger);

const documentationJSON = isUndefined(IOConfiguration.input) // || isUndefined(IOConfiguration.output)
  ? false
  : lineReaderWithExceptionProcessing(logger)(IOConfiguration.input);
