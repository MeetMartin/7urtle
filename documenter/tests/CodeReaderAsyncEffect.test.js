import * as CodeReaderAsyncEffect from '../src/CodeReaderAsyncEffect';

jest.mock('fs');
jest.mock('gen-readlines');

test('getNameFromLine returns the name of class or a function from a line of source file.', () => {
    expect(CodeReaderAsyncEffect.getNameFromLine(6)('const lambda = something => ({});')).toBe('lambda');
});

test('processLineNameState returns object with a new state and the name and type of a documented function based on a source file line.', () => {
    expect(CodeReaderAsyncEffect.processLineNameState('const lambda = something => ({});')).toEqual({state: 'END', contents: {name: 'lambda', type: 'expression'}});
    expect(CodeReaderAsyncEffect.processLineNameState(' export const lambda = something => ({});')).toEqual({state: 'END', contents: {name: 'lambda', type: 'expression'}});
    expect(CodeReaderAsyncEffect.processLineNameState('const something = {')).toEqual({state: 'END', contents: {name: 'something', type: 'object'}});
    expect(CodeReaderAsyncEffect.processLineNameState('     const lambda = something => ({}); ')).toEqual({state: 'END', contents: {name: 'lambda', type: 'expression'}});
    expect(CodeReaderAsyncEffect.processLineNameState('function namedFunction (something) {return something};')).toEqual({state: 'END', contents: {name: 'namedFunction', type: 'function'}});
    expect(CodeReaderAsyncEffect.processLineNameState('class myClass {}')).toEqual({state: 'END', contents: {name: 'myClass', type: 'class'}});
    expect(CodeReaderAsyncEffect.processLineNameState('let something = 1;')).toEqual({state: 'END', contents: {name: 'unknown', type: 'unknown'}});
});

test('processLineCodeState changes state to description if it finds a start of a docs comment returning Either.', () => {
    expect(CodeReaderAsyncEffect.processLineCodeState('/**')).toEqual({state: 'DESCRIPTION', newDocumentationBlock: true});
    expect(CodeReaderAsyncEffect.processLineCodeState('const some = "code";')).toEqual({state: 'CODE'});
});

test('getDocumentationLineContents gets line of a docs text from an input line string.', () => {
    expect(CodeReaderAsyncEffect.getDocumentationLineContents('* some description ')).toBe('some description ');
    expect(CodeReaderAsyncEffect.getDocumentationLineContents('some text')).toBe('me text');
    expect(CodeReaderAsyncEffect.getDocumentationLineContents('*')).toBe('');
});

test('positionToWhiteSpaceOrStringLength returns the position of the first white space or a string length.', () => {
    expect(CodeReaderAsyncEffect.positionToWhiteSpaceOrStringLength('@tag label')).toBe(4);
    expect(CodeReaderAsyncEffect.positionToWhiteSpaceOrStringLength('@example')).toBe(8);
});

test('getTag returns the tag name from a tag docs.', () => {
    expect(CodeReaderAsyncEffect.getTag('@tag label')).toBe('tag');
    expect(CodeReaderAsyncEffect.getTag('@example')).toBe('example');
});

test('getTagContents returns the tag value from a tag docs.', () => {
    expect(CodeReaderAsyncEffect.getTagContents('@tag label')).toBe('label');
    expect(CodeReaderAsyncEffect.getTagContents('@example')).toBe('true');
});

test('processTag returns docs of a tag line.', () => {
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
    expect(CodeReaderAsyncEffect.processTextOrTag('example')('1')).toEqual({contents:{example:['1']}});
    expect(CodeReaderAsyncEffect.processTextOrTag('example')('')).toEqual({contents:{example:['']}});
    expect(CodeReaderAsyncEffect.processTextOrTag('description')('12')).toEqual({contents:{description:['12']}});
});

test('processLineTextState returns text or a tag depending on found content.', () => {
    expect(CodeReaderAsyncEffect.processLineTextState('example')('* some example')).toEqual({contents:{example:['some example']}});
    expect(CodeReaderAsyncEffect.processLineTextState('example')('*')).toEqual({contents:{example:['']}});
    expect(CodeReaderAsyncEffect.processLineTextState('example')('*    some code')).toEqual({contents:{example:['   some code']}});
    expect(CodeReaderAsyncEffect.processLineTextState('description')('* some description')).toEqual({contents:{description:['some description']}});
    expect(CodeReaderAsyncEffect.processLineTextState('example')('* @something else')).toEqual({state: 'TAG', contents: {tags: [{something: 'else'}]}});
    expect(CodeReaderAsyncEffect.processLineTextState('example')('*/')).toEqual({state: 'NAME'});
    expect(CodeReaderAsyncEffect.processLineTextState('example')('no star')).toEqual({});
});

test('processLineBasedOnState accepts the current state and returns the correct function for line processing.', () => {
    expect(String(CodeReaderAsyncEffect.processLineBasedOnState('CODE'))).toBe(String(CodeReaderAsyncEffect.processLineCodeState));
    expect(String(CodeReaderAsyncEffect.processLineBasedOnState('DESCRIPTION'))).toBe(String(CodeReaderAsyncEffect.processLineTextState('description')));
    expect(String(CodeReaderAsyncEffect.processLineBasedOnState('TAG'))).toBe(String(CodeReaderAsyncEffect.processLineTextState('description')));
    expect(String(CodeReaderAsyncEffect.processLineBasedOnState('EXAMPLE'))).toBe(String(CodeReaderAsyncEffect.processLineTextState('example')));
    expect(String(CodeReaderAsyncEffect.processLineBasedOnState('NAME'))).toBe(String(CodeReaderAsyncEffect.processLineNameState));
    expect(String(CodeReaderAsyncEffect.processLineBasedOnState('END'))).toBe(String(CodeReaderAsyncEffect.processLineCodeState));
});

test('concatContentItem concatenates items for object contents of accumulator.', () => {
    expect(CodeReaderAsyncEffect.concatContentItem('item')({accumulator: {item: 'a'}})({contents:{item: 'b'}})).toBe('ab');
});

test('mergeDocumentationContents merges processedLines and new data from a new source line.', () => {
    expect(CodeReaderAsyncEffect.mergeDocumentationContents({
        state: 'DESCRIPTION',
        contents: [],
        accumulator: {
            description: ['line 1'],
            tags: [],
            example: []
        }
    })({
        state: 'DESCRIPTION',
        contents: {
            description: ['line 2']
        }
    }))
    .toEqual({
        state: 'DESCRIPTION',
        contents: [],
        accumulator: {
            description: ['line 1', 'line 2'],
            tags: [],
            example: []
        }
    });

    expect(CodeReaderAsyncEffect.mergeDocumentationContents({
        state: 'NAME',
        contents: [{
            name: 'firstFunction',
            type: 'function',
            description: ['first block'],
            tags: [],
            example: []
        }],
        accumulator: {
            description: ['second block'],
            tags: [],
            example: []
        }
    })({
        state: 'END',
        contents: {
            name: 'lambda',
            type: 'function'
        }
    }))
    .toEqual({
        state: 'END',
        contents: [{
            name: 'firstFunction',
            type: 'function',
            description: ['first block'],
            tags: [],
            example: []
        },
        {
            name: 'lambda',
            type: 'function',
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
        state: 'NAME',
        contents: [],
        accumulator: {
            description: ['first block'],
            tags: [],
            example: []
        }
    });

    expect(CodeReaderAsyncEffect.processLine({
        state: 'NAME',
        contents: [{
            name: 'firstFunction',
            type: 'expression',
            description: ['first block'],
            tags: [],
            example: []
        }],
        accumulator: {
            description: ['second block'],
            tags: [],
            example: []
        }
    }, {toString: () => ' const lambda = a => a;'})).toEqual({
        state: 'END',
        contents: [{
            name: 'firstFunction',
            type: 'expression',
            description: ['first block'],
            tags: [],
            example: []
        },
        {
            name: 'lambda',
            type: 'expression',
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

test('processLine merges proccessed lines with data from a new line.', () => {
    expect(CodeReaderAsyncEffect.processLine({
        state: 'DESCRIPTION',
        contents: [],
        accumulator: {
            description: ['line 1'],
            tags: [],
            example: []
        }
    }, {toString: () => ' * line 2'}))
    .toEqual({
        state: 'DESCRIPTION',
        contents: [],
        accumulator: {
            description: ['line 1', 'line 2'],
            tags: [],
            example: []
        }
    });
});

test('getJSFilesInADirectoryAsyncEffect returns a AsyncEffect functor that provides a configuration object with input, output, and an array of all .js files in a given path.', done => {
    CodeReaderAsyncEffect.getJSFilesInADirectoryAsyncEffect({input: './existing-directory/', output: './existing-directory/'}).trigger(
        error => {
            done.fail('getJSFilesInADirectoryAsyncEffect should not end in error: ' + error);
        },
        result => {
            expect(result).toEqual({input: './existing-directory/', output: './existing-directory/', files: ['./existing-directory/Case.js','./existing-directory/core.js']});
            done();
        }
    );
    CodeReaderAsyncEffect.getJSFilesInADirectoryAsyncEffect({input: './existing-directory', output: './existing-directory'}).trigger(
        error => {
            done.fail('getJSFilesInADirectoryAsyncEffect should not end in error: ' + error);
        },
        result => {
            expect(result).toEqual({input: './existing-directory/', output: './existing-directory/', files: ['./existing-directory/Case.js','./existing-directory/core.js']});
            done();
        }
    );
    CodeReaderAsyncEffect.getJSFilesInADirectoryAsyncEffect({input: './i-dont-exist/', output: './i-dont-exist/'}).trigger(
        error => {
            expect(error).toBe('ENOENT: no such file or directory, scandir \'./i-dont-exist/\'');
            done();
        },
        result => {
            done.fail('getJSFilesInADirectoryAsyncEffect should not be successful with result: ' + result);
        }
    );
});

test('FileLinesGeneratorSyncEffect returns a SyncEffect Functor of a generator that provides all lines of a file.', () => {
    expect(CodeReaderAsyncEffect.FileLinesGeneratorSyncEffect.trigger('./existing-directory/core.js').next().done).toBe(false);
    expect(CodeReaderAsyncEffect.FileLinesGeneratorSyncEffect.trigger('./i-dont-exist').next().done).toBe(true);
});

test('processOneFile recursively reads one file and returns an object with processed docs.', () => {
    function* generator(){
        yield 'some code';
    };
    expect(CodeReaderAsyncEffect.processOneFile({
        state: 'CODE',
        contents: [],
        accumulator: {
            description: [],
            tags: [],
            example: []
        }
    })(generator())).toEqual({
        state: 'CODE',
        contents: [],
        accumulator: {
            description: [],
            tags: [],
            example: []
        }
    });
});

test('getCodeReaderAsyncEffect returns a AsyncEffect functor that provides an object of configuration and docs of all .js files in a given input path.', done => {
    CodeReaderAsyncEffect.getCodeReaderAsyncEffect({input: './existing-directory/', output: './existing-directory/'}).trigger(
        error => {
            done.fail('getCodeReaderAsyncEffect should not end in error: ' + error);
        },
        result => {
            expect(result.input).toBe('./existing-directory/');
            expect(result.output).toBe('./existing-directory/');
            expect(result.files).toEqual(['./existing-directory/Case.js','./existing-directory/core.js']);
            expect(result.documentation.length).toBe(2);
            done();
        }
    );
});