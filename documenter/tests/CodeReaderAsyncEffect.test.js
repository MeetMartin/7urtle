import * as CodeReaderSyncEffect from '../src/CodeReaderSyncEffect';

test('getNameFromLine returns the name of class or a function from a line of source file.', () => {
    expect(CodeReaderSyncEffect.getNameFromLine(6)('const lambda = something => ({});')).toBe('lambda');
});

test('processLineNameState returns object with a new state and the name and type of a documented function based on a source file line.', () => {
    expect(CodeReaderSyncEffect.processLineNameState('const lambda = something => ({});')).toEqual({state: 'END', contents: {name: 'lambda', type: 'expression'}});
    expect(CodeReaderSyncEffect.processLineNameState(' export const lambda = something => ({});')).toEqual({state: 'END', contents: {name: 'lambda', type: 'expression'}});
    expect(CodeReaderSyncEffect.processLineNameState('     const lambda = something => ({}); ')).toEqual({state: 'END', contents: {name: 'lambda', type: 'expression'}});
    expect(CodeReaderSyncEffect.processLineNameState('function namedFunction (something) {return something};')).toEqual({state: 'END', contents: {name: 'namedFunction', type: 'function'}});
    expect(CodeReaderSyncEffect.processLineNameState('class myClass {}')).toEqual({state: 'END', contents: {name: 'myClass', type: 'class'}});
    expect(CodeReaderSyncEffect.processLineNameState('let something = 1;')).toEqual({state: 'END', contents: {name: 'unknown', type: 'unknown'}});
});

test('processLineCodeState changes state to description if it finds a start of a documentation comment returning Either.', () => {
    expect(CodeReaderSyncEffect.processLineCodeState('/**')).toEqual({state: 'DESCRIPTION', newDocumentationBlock: true});
    expect(CodeReaderSyncEffect.processLineCodeState('const some = "code";')).toEqual({state: 'CODE'});
});

test('getDocumentationLineContents gets line of a documentation text from an input line string.', () => {
    expect(CodeReaderSyncEffect.getDocumentationLineContents('* some description ')).toBe('some description');
    expect(CodeReaderSyncEffect.getDocumentationLineContents('some text')).toBe('ome text');
    expect(CodeReaderSyncEffect.getDocumentationLineContents('*')).toBe('');
});

test('positionToWhiteSpaceOrStringLength returns the position of the first white space or a string length.', () => {
    expect(CodeReaderSyncEffect.positionToWhiteSpaceOrStringLength('@tag label')).toBe(4);
    expect(CodeReaderSyncEffect.positionToWhiteSpaceOrStringLength('@example')).toBe(8);
});

test('getTag returns the tag name from a tag documentation.', () => {
    expect(CodeReaderSyncEffect.getTag('@tag label')).toBe('tag');
    expect(CodeReaderSyncEffect.getTag('@example')).toBe('example');
});

test('getTagContents returns the tag value from a tag documentation.', () => {
    expect(CodeReaderSyncEffect.getTagContents('@tag label')).toBe('label');
    expect(CodeReaderSyncEffect.getTagContents('@example')).toBe('true');
});

test('processTag returns documentation of a tag line.', () => {
    expect(CodeReaderSyncEffect.processTag('true')('example')).toEqual({state: 'EXAMPLE'});
    expect(CodeReaderSyncEffect.processTag('true')('pure')).toEqual({state: 'TAG', contents: {tags: [{pure: 'true'}]}});
    expect(CodeReaderSyncEffect.processTag('{string} description')('param')).toEqual({state: 'TAG', contents: {tags: [{param: '{string} description'}]}});
});

test('processTextOrTag returns text or a tag depending on found content.', () => {
    expect(CodeReaderSyncEffect.processTextOrTag('description')('some description')).toEqual({contents:{description:['some description']}});
    expect(CodeReaderSyncEffect.processTextOrTag('example')('some example')).toEqual({contents:{example:['some example']}});
    expect(CodeReaderSyncEffect.processTextOrTag('description')('@something else')).toEqual({state: 'TAG', contents: {tags: [{something: 'else'}]}});
    expect(CodeReaderSyncEffect.processTextOrTag('description')('@1')).toEqual({});
    expect(CodeReaderSyncEffect.processTextOrTag('description')('@12')).toEqual({state: 'TAG', contents: {tags: [{'12': 'true'}]}});
    expect(CodeReaderSyncEffect.processTextOrTag('description')('1')).toEqual({});
    expect(CodeReaderSyncEffect.processTextOrTag('description')('12')).toEqual({contents:{description:['12']}});
});

test('processLineTextState returns text or a tag depending on found content.', () => {
    expect(CodeReaderSyncEffect.processLineTextState('example')('* some example')).toEqual({contents:{example:['some example']}});
    expect(CodeReaderSyncEffect.processLineTextState('description')('* some description')).toEqual({contents:{description:['some description']}});
    expect(CodeReaderSyncEffect.processLineTextState('example')('* @something else')).toEqual({state: 'TAG', contents: {tags: [{something: 'else'}]}});
    expect(CodeReaderSyncEffect.processLineTextState('example')('*/')).toEqual({state: 'NAME'});
    expect(CodeReaderSyncEffect.processLineTextState('example')('no star')).toEqual({});
});

test('processLineBasedOnState accepts the current state and returns the correct function for line processing.', () => {
    expect(String(CodeReaderSyncEffect.processLineBasedOnState('CODE'))).toBe(String(CodeReaderSyncEffect.processLineCodeState));
    expect(String(CodeReaderSyncEffect.processLineBasedOnState('DESCRIPTION'))).toBe(String(CodeReaderSyncEffect.processLineTextState('description')));
    expect(String(CodeReaderSyncEffect.processLineBasedOnState('TAG'))).toBe(String(CodeReaderSyncEffect.processLineTextState('description')));
    expect(String(CodeReaderSyncEffect.processLineBasedOnState('EXAMPLE'))).toBe(String(CodeReaderSyncEffect.processLineTextState('example')));
    expect(String(CodeReaderSyncEffect.processLineBasedOnState('NAME'))).toBe(String(CodeReaderSyncEffect.processLineNameState));
    expect(String(CodeReaderSyncEffect.processLineBasedOnState('END'))).toBe(String(CodeReaderSyncEffect.processLineCodeState));
});

test('concatContentItem concatenates items for object contents of accumulator.', () => {
    expect(CodeReaderSyncEffect.concatContentItem('item')({accumulator: {item: 'a'}})({contents:{item: 'b'}})).toBe('ab');
});

test('mergeDocumentationContents merges processedLines and new data from a new source line.', () => {
    expect(CodeReaderSyncEffect.mergeDocumentationContents({
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

    expect(CodeReaderSyncEffect.mergeDocumentationContents({
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
    expect(CodeReaderSyncEffect.processLine({
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

    expect(CodeReaderSyncEffect.processLine({
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

    expect(CodeReaderSyncEffect.processLine({
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

    expect(CodeReaderSyncEffect.processLine({
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

    expect(CodeReaderSyncEffect.processLine({
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

    expect(CodeReaderSyncEffect.processLine({
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

    expect(CodeReaderSyncEffect.processLine({
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

    expect(CodeReaderSyncEffect.processLine({
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
    expect(CodeReaderSyncEffect.processLine({
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

test('JSFilesInADirectorySyncEffect provides an array of all .js files in a provided path.', () => {
    expect(CodeReaderSyncEffect.JSFilesInADirectorySyncEffect.trigger('./tests/testable')).toEqual(['./tests/testable/Case.js','./tests/testable/core.js']);
    expect(CodeReaderSyncEffect.JSFilesInADirectorySyncEffect.trigger('./tests/testable/')).toEqual(['./tests/testable/Case.js','./tests/testable/core.js']);
    expect(() => CodeReaderSyncEffect.JSFilesInADirectorySyncEffect.trigger('./i-dont-exist')).toThrow('ENOENT: no such file or directory, scandir \'./i-dont-exist/\'');
});

test('FileLinesGeneratorSyncEffect returns a SyncEffect Functor of a generator that provides all lines of a file.', () => {
    expect(CodeReaderSyncEffect.FileLinesGeneratorSyncEffect.trigger('./tests/testable/core.js').next().done).toBe(false);
    expect(CodeReaderSyncEffect.FileLinesGeneratorSyncEffect.trigger('./i-dont-exist').next().done).toBe(true);
});

test('processOneFile recursively reads one file and returns an object with processed documentation.', () => {
    function* generator(){
        yield 'some code';
    };
    expect(CodeReaderSyncEffect.processOneFile({
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

test('CodeReaderSyncEffect returns a SyncEffect functor that provides an object of documentation of all .js files in a given path.', () => {
    expect(typeof CodeReaderSyncEffect.CodeReaderSyncEffect.trigger('./tests/testable')).toBe('object');
});