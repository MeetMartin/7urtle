import {filter, endsWith, reduce, trim, Case, isEqual, lowerCaseOf, map,
    startsWith, lengthOf, substr, search, concat, SyncEffect, AsyncEffect} from "@7urtle/lambda";
import readlines from 'gen-readlines';
import fs from "fs";

const states = {
    CODE: 'CODE',
    START: 'START',
    DESCRIPTION: 'DESCRIPTION',
    TAG: 'TAG',
    EXAMPLE: 'EXAMPLE',
    NAME: 'NAME',
    END: 'END'
};

/**
 * getNameFromLine returns the name of class or a function from a line of source file.
 * 
 * @pure
 * @function
 * @HindleyMilner getNameFromLine :: a -> b
 * @param {number} length
 * @param {string} line
 * @returns {string}
 * @example
 * getNameFromLine(6)('const lambda = a => b => a + b');
 * // => lambda
 */
const getNameFromLine = length => line =>
    (
        contents => substr(search(' ')(contents))(0)(contents)
    )(substr(lengthOf(line))(length)(line));

/**
 * processLineNameState returns object with a new state and the name and type of a documented function based on a source file line.
 * 
 * @pure
 * @function
 * @HindleyMilner processLineNameState :: a -> {b}
 * @param {string} line
 * @returns {object}
 * @example
 * processLineNameState('const lambda = a => b => a + b');
 * // => {state:'END', contents: {name: 'lambda', type: 'function'}}
 */
const processLineNameState = line =>
    (line =>
        (line =>
            startsWith('const ')(line)
            ? endsWith(' = {')(line)
              ? {
                    state: states.END,
                    contents: {
                        name: getNameFromLine(6)(line),
                        type: 'object'
                    }
                }
              : {
                    state: states.END,
                    contents: {
                        name: getNameFromLine(6)(line),
                        type: 'expression'
                    }
                }
            : startsWith('class ')(line)
            ? {
                state: states.END,
                contents: {
                    name: getNameFromLine(6)(line),
                    type: 'class'
                }
            }
            : startsWith('function ')(line)
            ? {
                state: states.END,
                contents: {
                    name: getNameFromLine(9)(line),
                    type: 'function'
                }
            }
            : {
                state: states.END,
                contents: {
                    name: 'unknown',
                    type: 'unknown'
                }
            }
        )
        (startsWith('export ')(line) ? substr(lengthOf(line))(7)(line) : line)
    )
    (trim(line));

/**
 * getDocumentationLineContents gets line of a documentation text from an input line string.
 * 
 * @pure
 * @function
 * @HindleyMilner getDocumentationLineContents :: a -> b
 * @param {string} line
 * @returns {string} 
 * @example
 * getDocumentationLineContents('* some description ')
 * // => some description
 */
const getDocumentationLineContents = line =>
    (length => length > 1 ? (substr(length)(2)(line)) : '')
    (lengthOf(line));

/**
 * processLineCodeState changes state to description if it finds a start of a documentation comment returning Either.
 * 
 * @pure
 * @function
 * @HindleyMilner processLineCodeState :: a -> {b}
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
 * @function
 * @HindleyMilner positionToWhiteSpaceOrStringLength :: a -> b
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
 * @function
 * @HindleyMilner getTag :: a -> b
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
 * @function
 * @HindleyMilner getTagContents :: a -> b
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
 * @function
 * @HindleyMilner processTag :: a -> b -> {c}
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
 * @function
 * @HindleyMilner processTextOrTag :: a -> {b}
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
        //: lengthOf(contents) > 1 ? {contents:{[type]:[contents]}} : {};
        : lengthOf(contents) > 1
            ? {contents:{[type]:[contents]}}
            : isEqual(type)('example') ? {contents:{[type]:[contents]}} : {};

/**
 * processLineTextState returns text or a tag depending on found content.
 * 
 * @pure
 * @function
 * @HindleyMilner processLineTextState :: a -> {b}
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
            ? {state: states.NAME}
            : processTextOrTag(type)(getDocumentationLineContents(line))
        : {} // lines not starting with a star are ignored

/**
 * processLineBasedOnState accepts the current state and returns the correct function for line processing.
 * 
 * @pure
 * @function
 * @HindleyMilner processLineBasedOnState :: a -> (b -> c)
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
        [states.NAME, processLineNameState],
        [states.END, processLineCodeState],
    ])
    .match(state);

/**
 * concatContentItem concatenates items for object contents of accumulator.
 * 
 * @pure
 * @function
 * @HindleyMilner concatContentItem :: a -> {b} -> {c} -> {d}
 * @param {string} label
 * @param {object} processedLines
 * @param {object} newData
 * @returns {any}
 * @example
 * concatContentItem('item')({accumulator:{item: 'a'}})({contents:{item: 'b'}});
 * // => 'ab'
 */
const concatContentItem = label => processedLines => newData =>
    (newData.contents && newData.contents[label])
    ? concat(newData.contents[label])(processedLines.accumulator[label])
    : processedLines.accumulator[label];

/**
 * mergeDocumentationContents merges processedLines and new data from a new source line.
 * 
 * @pure
 * @function
 * @HindleyMilner mergeDocumentationContents :: {a} -> {b} -> {a}
 * @param {object} processedLines 
 * @param {object} newData
 * @returns {object}
 * @example
 * mergeDocumentationContents({
 *      state: 'DESCRIPTION',
 *      contents: [],
 *      accumulator: {
 *          description: ['line 1'],
 *          tags: [],
 *          example: []
 *      }
 *  })({
 *      state: 'DESCRIPTION',
 *      contents: {
 *          description: ['line 2']
 *      }
 *  });
 * 
 * // => {
 *      state: 'DESCRIPTION',
 *      contents: [],
 *      accumulator: {
 *          description: ['line 1', 'line 2'],
 *          tags: [],
 *          example: []
 *      }
 *  }
 */
const mergeDocumentationContents = processedLines => newData =>
    (isEqual(newData.state)(states.END))
    ? ({ // at the end of every code we move documentation to contents array and clear accumulator
        ...processedLines,
        state: states.END,
        contents: [
            ...processedLines.contents,
            {
                ...processedLines.accumulator,
                name: newData.contents.name,
                type: newData.contents.type
            }
        ],
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
 * @function
 * @HindleyMilner processLine :: {a} -> b -> {a}
 * @param {object} processedLines 
 * @param {string} line
 * @returns {object}
 * @example
 * processLine({
 *      state: 'DESCRIPTION',
 *      contents: [],
 *      accumulator: {
 *          description: ['line 1'],
 *          tags: [],
 *          example: []
 *      }
 *   }, {toString: () => 'some description'});
 * // =>
 * {
 *   state: 'DESCRIPTION',
 *   contents: [],
 *   accumulator: {
 *     description: ['line 1', 'line 2'],
 *     tags: [],
 *     example: []
 *   }
 * }
 */
const processLine = (processedLines, line) =>
    mergeDocumentationContents(processedLines)(processLineBasedOnState(processedLines.state)(trim(line.toString())));

/**
 * getJSFilesInADirectoryAsyncEffect returns a AsyncEffect functor that provides a configuration object
 * with input, output, and an array of all .js files in a given path.
 * 
 * @pure
 * @HindleyMilner getJSFilesInADirectoryAsyncEffect :: {a} -> {AsyncEffect}
 * @param {object} configuration
 * @returns {AsyncEffect}
 * @example
 * getJSFilesInADirectoryAsyncEffect({input: './input/', output: './output/'}).trigger(
 *   error => console.error(error),
 *   result => console.log(result) // ==> {input: './input/', output: './output/', files: ['./input/Case.js','./input/core.js']}
 * )
 */
const getJSFilesInADirectoryAsyncEffect = configuration =>
    AsyncEffect
    .of((reject, resolve) =>
        (path =>
            resolve({
                input: path,
                output: endsWith('/')(configuration.output) ? configuration.output : configuration.output + '/',
                files: map(file => path + file)
                          (filter(endsWith('.js'))
                          (fs.readdirSync(path)))
            })
        )(endsWith('/')(configuration.input) ? configuration.input : configuration.input + '/')
    );

/**
 * FileLinesGeneratorSyncEffect returns a SyncEffect Functor of a generator that provides all lines of a file.
 * 
 * @pure
 * @functor {SyncEffect}
 * @example
 * FileLinesGeneratorSyncEffect.trigger('./tests/testable/core.js');
 * // => Generator {}
 */
const FileLinesGeneratorSyncEffect = SyncEffect.of(path => fs.existsSync(path) ? readlines.fromFile(path) : function* (){}());

/**
 * processOneFile recursively reads one file and returns an object with processed documentation.
 * @pure
 * @function
 * @HindleyMilner processOneFile :: {a} -> {b} -> {a}
 * @param {object} documentation
 * @param {object} documentation
 * @returns {object}
 * @example
 * processOneFile({
 *      state: 'CODE',
 *      contents: [],
 *      accumulator: {
 *          description: [],
 *          tags: [],
 *          example: []
 *      }
 * })(['line']);
 */
const processOneFile = documentation => generator =>
    (item =>
        item.done
        ? documentation
        : processOneFile(processLine(documentation, item.value))(generator)
    )
    (generator.next());

/**
 * getCodeReaderAsyncEffect returns a AsyncEffect functor that provides an object of configuration
 * and documentation of all .js files in a given input path.
 *
 * @pure
 * @HindleyMilner getCodeReaderAsyncEffect :: {a} -> {AsyncEffect}
 * @param {object} configuration
 * @returns {AsyncEffect}
 * @example
 * getCodeReaderAsyncEffect({input: './input/', output: './output/'}).trigger(
 *   error => console.error(error),
 *   result => console.log(result)
 *   // ==> {
 *      input: './input/', output: './output/',
 *      files: ['./input/Case.js','./input/core.js'],
 *      documentation: {...}
 *   }
 * )
 */
const getCodeReaderAsyncEffect = configuration =>
    getJSFilesInADirectoryAsyncEffect(configuration)
    .map(configurationWithFiles => ({
        ...configurationWithFiles,
        documentation: reduce
            ([])
            ((documentation, file) => [
                ...documentation,
                {
                    file: file,
                    contents: processOneFile({
                        state: 'CODE',
                        contents: [],
                        accumulator: {
                            description: [],
                            tags: [],
                            example: []
                        }
                    })(FileLinesGeneratorSyncEffect.trigger(file)).contents
                }
            ])
            (configurationWithFiles.files)
    }));

export {
    processLineCodeState,
    getDocumentationLineContents,
    positionToWhiteSpaceOrStringLength,
    getTag,
    getTagContents,
    processTag,
    processTextOrTag,
    processLineTextState,
    processLineBasedOnState,
    processLine,
    processLineNameState,
    getNameFromLine,
    concatContentItem,
    mergeDocumentationContents,
    getJSFilesInADirectoryAsyncEffect,
    FileLinesGeneratorSyncEffect,
    processOneFile,
    getCodeReaderAsyncEffect
};