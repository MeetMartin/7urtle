import {
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

import {getCMDInput} from './IOCommanderSyncEffect';
import {getCodeReader} from './CodeReaderAsyncEffect';
import {getDocumentationWriter} from './DocumentationWriterAsyncEffect';

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

const positionToWhiteSpaceOrStringLength = contents => (result => isEqual(result)(undefined) ? lengthOf(contents) : result)(search(' ')(contents));

const getTag = contents => substr(positionToWhiteSpaceOrStringLength(contents) -1)(1)(contents);

const getTagContents = contents => isEqual(search(' ')(contents))(undefined) ? 'true' : trim(substr(lengthOf(contents))(positionToWhiteSpaceOrStringLenght(contents))(contents));

const newCodeDocumentation = () =>
  (documentation.state = states.DESCRIPTION) &&
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

//const onFileEnd = logger => documentation => () => logger.debug(JSON.stringify(documentation));
const onFileEnd = logger => output => documentation => () =>
    logger.info(`Writing into ${output}.`)
    && getDocumentationWriter(output)(documentation).trigger(logger.error, () => logger.info('Documentation created!'));

const IOConfiguration = getCMDInput(logger);

const documentationJSON = isUndefined(IOConfiguration.input) || isUndefined(IOConfiguration.output)
    ? logger.error(`input and/or output are passed as undefined.`)
    : logger.info(`Processing directory "${IOConfiguration.input}".`)
      && getCodeReader(IOConfiguration.input)(processLine)
        .trigger(
            logger.error,
            onFileEnd(logger)(IOConfiguration.output)(documentation)
        );
