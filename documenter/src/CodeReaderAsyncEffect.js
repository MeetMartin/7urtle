import {AsyncEffect, Either, either, identity, filter, endsWith, reduce, trim, Case, isEqual, lowerCaseOf,
    startsWith, lengthOf, substr, search, concat} from "@7urtle/lambda";
import readline from "readline";
import readlines from 'gen-readlines';
import fs from "fs";

const states = {
    //ERROR: 'ERROR',
    CODE: 'CODE',
    START: 'START',
    DESCRIPTION: 'DESCRIPTION',
    TAG: 'TAG',
    EXAMPLE: 'EXAMPLE',
    END: 'END'
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
            ? {state: states.END}
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
        [states.CODE, processLineCodeState],
        [states.START, processLineTextState('description')],
        [states.DESCRIPTION, processLineTextState('description')],
        [states.TAG, processLineTextState('description')],
        [states.EXAMPLE, processLineTextState('example')],
        [states.END, processLineCodeState],
    ])
    .match(state);

const concatContentItem = label => processedLines => newData =>
    (newData.contents && newData.contents[label])
    ? concat(newData.contents[label])(processedLines.accumulator[label])
    : processedLines.accumulator[label]

const mergeDocumentationContents = processedLines => newData =>
    (isEqual(newData.state)(states.END))
    ? ({ // at the end of every code we move documentation to contents array and clear accumulator
        ...processedLines,
        state: states.END,
        contents: concat(processedLines.accumulator)(processedLines.contents),
        accumulator: {
            description: [],
            tags: [],
            example: []
        }
    })
    : ({ // with new lines of documentation we add them to accumulator
        ...processedLines,
        state: (newData.state) ? newData.state : processedLines.state,
        accumulator: {
            description: concatContentItem('description')(processedLines)(newData),
            tags: concatContentItem('tags')(processedLines)(newData),
            example: concatContentItem('example')(processedLines)(newData)
        }
    });

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
        contents: [],
        accumulator: [{
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