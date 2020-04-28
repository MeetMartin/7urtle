import {
    AsyncEffect,
    Either,
    either,
    identity,
    filter,
    endsWith,
    reduce,
    trim,
    Case,
    isEqual,
    lowerCaseOf, startsWith, lengthOf, substr, search
} from "@7urtle/lambda";
import readline from "readline";
import fs from "fs";

const states = {
    ERROR: 'ERROR',
    CODE: 'CODE',
    DESCRIPTION: 'DESCRIPTION',
    TAG: 'TAG',
    EXAMPLE: 'EXAMPLE'
};

/*const documentation = {
    state: states.CODE,
    files: [{
        file: '',
        contents: [{
            description: [],
            tags: {},
            example: []
        }]
    }]
};*/
const documentation = {
    state: states.CODE,
    contents: [{
        description: [],
        tags: {},
        example: []
    }]
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

const getJSFilesInDirectory = path =>
    filter
    (endsWith('.js'))
    (fs.readdirSync(path));

const readOneFile = path =>
    AsyncEffect.of(
        async (reject, resolve) =>
            either
            (error => reject(`There was an error processing file "${path}" with exception: "${error}".`))
            (identity)
            (Either.try(() => lineReader(path)(processLine)(resolve)))
    );

const lineReader = path => processLine => resolve =>
    readline
        .createInterface({input: fs.createReadStream(path)})
        .on('line', processLine)
        .on('close', resolve);

/**
 * getCodeReader takes as its input path to a file and a function to process each line and then
 * attempts to process a file using the supplied processLine function
 *
 * @pure
 * @HindleyMilner getCodeReader :: {a} -> b -> (c-d) -> {e}
 * @param string path
 * @returns AsyncEffect
 */
const getCodeReader = path =>
    reduce
    ({
        state: states.CODE,
        files: []
    })
    ((documentation, file) => documentation.files.push(
            {
                file: path + file,
                contents: readOneFile(path + file)
            }
        )
    )
    (getJSFilesInDirectory(path));

export {
    getCodeReader
};