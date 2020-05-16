import * as CodeReaderAsyncEffect from '../src/CodeReaderAsyncEffect';
import {deepInspect} from '@7urtle/lambda';
import merge from 'deepmerge';

test('getJSFilesInDirectory provides an array of all .js files in a provided path.', () => {
  expect(CodeReaderAsyncEffect.getJSFilesInDirectory('./tests/testable')).toEqual(['Case.js','core.js']);
});

test('processLineCodeState changes state to description if it finds a start of a documentation comment returning Either.', () => {
    expect(CodeReaderAsyncEffect.processLineCodeState('/**')).toEqual({state: 'DESCRIPTION', newDocumentationBlock: true});
    expect(CodeReaderAsyncEffect.processLineCodeState('const some = "code";')).toEqual({state: 'CODE'});
});

test('getDocumentationLineContents gets line of a documentation text from an input line string.', () => {
    expect(CodeReaderAsyncEffect.getDocumentationLineContents('* some description ')).toBe('some description');
    expect(CodeReaderAsyncEffect.getDocumentationLineContents('some text')).toBe('ome text');
    expect(CodeReaderAsyncEffect.getDocumentationLineContents('*')).toBe('');
});

test('positionToWhiteSpaceOrStringLength returns the position of the first white space or a string length.', () => {
    expect(CodeReaderAsyncEffect.positionToWhiteSpaceOrStringLength('@tag label')).toBe(4);
    expect(CodeReaderAsyncEffect.positionToWhiteSpaceOrStringLength('@example')).toBe(8);
});

test('getTag returns the tag name from a tag documentation.', () => {
    expect(CodeReaderAsyncEffect.getTag('@tag label')).toBe('tag');
    expect(CodeReaderAsyncEffect.getTag('@example')).toBe('example');
});

test('getTagContents returns the tag value from a tag documentation.', () => {
    expect(CodeReaderAsyncEffect.getTagContents('@tag label')).toBe('label');
    expect(CodeReaderAsyncEffect.getTagContents('@example')).toBe('true');
});

test('processTag returns documentation of a tag line.', () => {
    expect(CodeReaderAsyncEffect.processTag('true')('example')).toEqual({state: 'EXAMPLE'});
    expect(CodeReaderAsyncEffect.processTag('true')('pure')).toEqual({state: 'TAG', contents: {tags: [{pure: 'true'}]}});
    expect(CodeReaderAsyncEffect.processTag('{string} description')('param')).toEqual({state: 'TAG', contents: {tags: [{param: '{string} description'}]}});
});

test('processTextOrTag returns text or a tag depending on found content.', () => {
    expect(CodeReaderAsyncEffect.processTextOrTag('description')('some description')).toEqual({contents:{description:['some description']}});
    expect(CodeReaderAsyncEffect.processTextOrTag('example')('some example')).toEqual({contents:{example:['some example']}});
    expect(CodeReaderAsyncEffect.processTextOrTag('description')('@something else')).toEqual({state: 'TAG', contents: {tags: [{something: 'else'}]}});
    expect(CodeReaderAsyncEffect.processTextOrTag('description')('@1')).toEqual({});
    expect(CodeReaderAsyncEffect.processTextOrTag('description')('@12')).toEqual({state: 'TAG', contents: {tags: [{'12': 'true'}]}});
    expect(CodeReaderAsyncEffect.processTextOrTag('description')('1')).toEqual({});
    expect(CodeReaderAsyncEffect.processTextOrTag('description')('12')).toEqual({contents:{description:['12']}});
});

test('processLineTextState returns text or a tag depending on found content.', () => {
    expect(CodeReaderAsyncEffect.processLineTextState('example')('* some example')).toEqual({contents:{example:['some example']}});
    expect(CodeReaderAsyncEffect.processLineTextState('description')('* some description')).toEqual({contents:{description:['some description']}});
    expect(CodeReaderAsyncEffect.processLineTextState('example')('* @something else')).toEqual({state: 'TAG', contents: {tags: [{something: 'else'}]}});
    expect(CodeReaderAsyncEffect.processLineTextState('example')('*/')).toEqual({state: 'END'});
    expect(CodeReaderAsyncEffect.processLineTextState('example')('no star')).toEqual({});
});

test('processLineBasedOnState accepts the current state and returns the correct function for line processing.', () => {
    expect(CodeReaderAsyncEffect.processLineBasedOnState('CODE')).toEqual(CodeReaderAsyncEffect.processLineCodeState);
    expect(String(CodeReaderAsyncEffect.processLineBasedOnState('DESCRIPTION'))).toBe(String(CodeReaderAsyncEffect.processLineTextState('description')));
    expect(String(CodeReaderAsyncEffect.processLineBasedOnState('TAG'))).toBe(String(CodeReaderAsyncEffect.processLineTextState('description')));
    expect(String(CodeReaderAsyncEffect.processLineBasedOnState('EXAMPLE'))).toBe(String(CodeReaderAsyncEffect.processLineTextState('example')));
});

test('processLine merges proccessed lines with data from a new line.', () => {
    expect(CodeReaderAsyncEffect.processLine({
        state: 'CODE',
        contents: [],
        accumulator: {
            description: [],
            tags: [],
            example: []
        }
    }, {toString: () => '/**'})).toEqual({
        state: 'DESCRIPTION',
        contents: [],
        accumulator: {
            description: [],
            tags: [],
            example: []
        }
    });

    expect(CodeReaderAsyncEffect.processLine({
        state: 'DESCRIPTION',
        contents: [],
        accumulator: {
            description: ['line 1'],
            tags: [],
            example: []
        }
    }, {toString: () => ' * line 2'})).toEqual({
        state: 'DESCRIPTION',
        contents: [],
        accumulator: {
            description: ['line 1', 'line 2'],
            tags: [],
            example: []
        }
    });

    expect(CodeReaderAsyncEffect.processLine({
        state: 'DESCRIPTION',
        contents: [],
        accumulator: {
            description: [],
            tags: [],
            example: []
        }
    }, {toString: () => ' * @pure'})).toEqual({
        state: 'TAG',
        contents: [],
        accumulator: {
            description: [],
            tags: [{pure: 'true'}],
            example: []
        }
    });

    expect(CodeReaderAsyncEffect.processLine({
        state: 'TAG',
        contents: [],
        accumulator: {
            description: [],
            tags: [{pure: 'true'},{param: '{string} a'}],
            example: []
        }
    }, {toString: () => ' * @param {boolean} b'})).toEqual({
        state: 'TAG',
        contents: [],
        accumulator: {
            description: [],
            tags: [{pure: 'true'},{param: '{string} a'},{param: '{boolean} b'}],
            example: []
        }
    });

    expect(CodeReaderAsyncEffect.processLine({
        state: 'TAG',
        contents: [],
        accumulator: {
            description: [],
            tags: [],
            example: []
        }
    }, {toString: () => ' * @example'})).toEqual({
        state: 'EXAMPLE',
        contents: [],
        accumulator: {
            description: [],
            tags: [],
            example: []
        }
    });

    expect(CodeReaderAsyncEffect.processLine({
        state: 'EXAMPLE',
        contents: [],
        accumulator: {
            description: [],
            tags: [],
            example: ['processLineBasedOnState(\'CODE\');']
        }
    }, {toString: () => ' * // => processLineCodeState'})).toEqual({
        state: 'EXAMPLE',
        contents: [],
        accumulator: {
            description: [],
            tags: [],
            example: ['processLineBasedOnState(\'CODE\');','// => processLineCodeState']
        }
    });

    expect(CodeReaderAsyncEffect.processLine({
        state: 'EXAMPLE',
        contents: [],
        accumulator: {
            description: ['first block'],
            tags: [],
            example: []
        }
    }, {toString: () => ' */'})).toEqual({
        state: 'END',
        contents: [{
            description: ['first block'],
            tags: [],
            example: []
        }],
        accumulator: {
            description: [],
            tags: [],
            example: []
        }
    });

    expect(CodeReaderAsyncEffect.processLine({
        state: 'EXAMPLE',
        contents: [{
            description: ['first block'],
            tags: [],
            example: []
        }],
        accumulator: {
            description: ['second block'],
            tags: [],
            example: []
        }
    }, {toString: () => ' */'})).toEqual({
        state: 'END',
        contents: [{
            description: ['first block'],
            tags: [],
            example: []
        },
        {
            description: ['second block'],
            tags: [],
            example: []
        }],
        accumulator: {
            description: [],
            tags: [],
            example: []
        }
    });
});