import {AsyncEffect, Either, either, identity, filter, endsWith, reduce, trim, Case, isEqual, lowerCaseOf,
    startsWith, lengthOf, substr, search, concat, deepInspect} from "@7urtle/lambda";
import readline from "readline";
import readlines from 'gen-readlines';
import merge from 'deepmerge';
import fs from "fs";

const states = {
    //ERROR: 'ERROR',
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

/**
 * getDocumentationLineContents gets line of a documentation text from an input line string.
 * 
 * @pure
 * @param {string} line
 * @returns {string} 
 * @example
 * getDocumentationLineContents('* some description ')
 * // => some description
 */
const getDocumentationLineContents = line =>
    (length => length > 1 ? trim(substr(length)(1)(line)) : '')
    (lengthOf(line));

/**
 * processLineCodeState changes state to description if it finds a start of a documentation comment returning Either.
 * 
 * @pure
 * @param {string} line 
 * @returns {object}
 * @example
 * processLineCodeState('/**');
 * // => {state: DESCRIPTION}
 */
const processLineCodeState = line =>
    isEqual('/**')(line)
        ? {state: states.DESCRIPTION, newDocumentationBlock: true}
        : {state: states.CODE};

/**
 * positionToWhiteSpaceOrStringLength returns the position of the first white space or a string length.
 * 
 * @pure
 * @param {string} contents
 * @returns {number}
 * @example
 * positionToWhiteSpaceOrStringLength('@tag label');
 * // => 4
 */
const positionToWhiteSpaceOrStringLength = contents => (result => isEqual(result)(undefined) ? lengthOf(contents) : result)(search(' ')(contents));

/**
 * getTag returns the tag name from a tag documentation.
 * 
 * @pure
 * @param {string} contents
 * @returns {string}
 * @example
 * getTag('@tag label')
 * // => tag
 */
const getTag = contents => substr(positionToWhiteSpaceOrStringLength(contents) -1)(1)(contents);

/**
 * getTagContents returns the tag value from a tag documentation.
 * 
 * @pure
 * @param {string} contents
 * @returns {string}
 * @example
 * getTagContents('@tag label')
 * // => label
 * getTagContents('@example')
 * // => true
 */
const getTagContents = contents => isEqual(search(' ')(contents))(undefined) ? 'true' : trim(substr(lengthOf(contents))(positionToWhiteSpaceOrStringLength(contents))(contents));

/**
 * processTag returns documentation of a tag line.
 * 
 * @pure
 * @param {string} tagContents 
 * @param {string} tag
 * @returns {object}
 * @example
 * processTag('tag')('label');
 * // => {
 *   state: "TAG",
 *     contents: {
 *       tags: [{
 *         something: "else"
 *       }]
 *    }
 * }
 */
const processTag = tagContents => tag =>
    isEqual(lowerCaseOf(tag))('example')
        ? {state: states.EXAMPLE}
        : {
            state: states.TAG,
            contents: {
                tags: [{
                    [tag]: tagContents
                }]
            }
        };

/**
 * processExampleOrTag returns text or a tag depending on found content.
 * 
 * @pure
 * @param {string} contents
 * @returns {object}
 * @example
 * processTextOrTag('example')('some example')
 * // => {
 *   contents: {
 *     example: ['some example']
 *   }
 * }
 * 
 * processTextOrTag('example')(('@something else')
 * // => {
 *   state: "TAG",
 *     contents: {
 *       tags: {
 *         something: "else"
 *       }
 *    }
 * }
 */
const processTextOrTag = type => contents =>
    startsWith('@')(contents)
        ? (lengthOf(contents) > 2 ? processTag(getTagContents(contents))(getTag(contents)) : {})
        : lengthOf(contents) > 1 ? {contents:{[type]:[contents]}} : {};

/**
 * processLineTextState returns text or a tag depending on found content.
 * 
 * @pure
 * @param {string} contents
 * @returns {object}
 * @example
 * processLineTextState('example')('* some example')
 * // => {
 *   contents: {
 *     example: ['some example']
 *   }
 * }
 * 
 * processLineTextState('example')('* @something else')
 * // => {
 *   state: "TAG",
 *     contents: {
 *       tags: {
 *         something: "else"
 *       }
 *    }
 * }
 */
const processLineTextState = type => line =>
    startsWith('*')(line)
        ? isEqual('*/')(line)
            ? {state: states.CODE}
            : processTextOrTag(type)(getDocumentationLineContents(line))
        : {} // lines not starting with a star are ignored

/**
 * processLineBasedOnState accepts the current state and returns the correct function for line processing.
 * 
 * @pure
 * @param {string} state 
 * @returns {function}
 * 
 * @example
 * processLineBasedOnState('CODE');
 * // => processLineCodeState
 */
const processLineBasedOnState = state =>
    Case
    .of([
        //[states.ERROR, identity],
        [states.CODE, processLineCodeState],
        [states.DESCRIPTION, processLineTextState('description')],
        [states.TAG, processLineTextState('description')],
        [states.EXAMPLE, processLineTextState('example')]
    ])
    .match(state);

const mergeContentItem = label => processedLines => newData =>
    (newData.contents && newData.contents[label])
    ? concat(newData.contents[label])(processedLines.contents[processedLines.numberOfDocumentatonBlocks -1][label])
    : processedLines.contents[processedLines.numberOfDocumentatonBlocks -1][label];

/*const mergeData = processedLines => newData =>
    ({
        ...processedLines,
        state: (newData.state) ? newData.state : processedLines.state,
        contents: {
            ...processedLines.contents,
            [processedLines.numberOfDocumentatonBlocks -1]: {
                description: mergeContentItem('description')(processedLines)(newData),
                tags: mergeContentItem('tags')(processedLines)(newData),
                example: mergeContentItem('example')(processedLines)(newData)
            }
        }
    });*/
const mergeData = processedLines => newData =>
    ({
        ...processedLines,
        state: (newData.state) ? newData.state : processedLines.state,
        accumulator: {
            ...processedLines.accumulator,
            ...newData.contents
        }
    });

const updateNumberOfDocumentatonBlocks = processedLines => newData =>
    ({
        ...processedLines,
        numberOfDocumentatonBlocks: newData.newDocumentationBlock ? ++processedLines.numberOfDocumentatonBlocks : processedLines.numberOfDocumentatonBlocks,
        accumulator: {
            description: [],
            tags: [],
            example: []
        }
    });

const mergeDocumentationContents = processedLines => newData =>
    mergeData(updateNumberOfDocumentatonBlocks(processedLines)(newData))(newData);
    
//const processLine = line => processLineBasedOnState(documentation.state)(trim(line));
/**
 * processLine merges proccessed lines with data from a new line.
 * 
 * @pure
 * @param {object} processedLines 
 * @param {EventListenerObject} line
 * @returns {object}
 * @example
 * processLine({state: 'CODE'})({toString: () => 'some description'});
 * // =>
 * {
 *   state: 'DESCRIPTION',
 *   contents: [{
 *     description: ['some description'],
 *     tags: {},
 *     example: []
 *   }]
 * }
 */
const processLine = (processedLines, line) =>
    mergeDocumentationContents(processedLines)(processLineBasedOnState(processedLines.state)(trim(line.toString())));

/**
 * getJSFilesInDirectory provides an array of all .js files in a provided path.
 * 
 * @impure
 * @param {string} path path to a directory
 * @returns {array}
 * @example
 * getJSFilesInDirectory('./tests/testable') 
 * // => ['Case.js','core.js']
 */
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

const processOneFile = path =>
    reduce
    ({
        state: states.CODE,
        numberOfDocumentatonBlocks: 0,
        contents: [{
            description: [],
            tags: [],
            example: []
        }]
    })
    (processLine)
    (readlines.fromFile(path))

/**
 * getCodeReader takes as its input path to a file and a function to process each line and then
 * attempts to process a file using the supplied processLine function
 *
 * @pure
 * @HindleyMilner getCodeReader :: {a} -> b -> (c-d) -> {e}
 * @param {string} path
 * @returns {AsyncEffect}
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
    getCodeReader,
    getJSFilesInDirectory,
    readOneFile,
    processLineCodeState,
    getDocumentationLineContents,
    positionToWhiteSpaceOrStringLength,
    getTag,
    getTagContents,
    processTag,
    processTextOrTag,
    processLineTextState,
    processLineBasedOnState,
    processLine
};