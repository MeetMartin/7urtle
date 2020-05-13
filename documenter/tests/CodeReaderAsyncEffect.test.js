import * as CodeReaderAsyncEffect from '../src/CodeReaderAsyncEffect';
import {Either} from '@7urtle/lambda';

test('getJSFilesInDirectory provides an array of all .js files in a provided path.', () => {
  expect(CodeReaderAsyncEffect.getJSFilesInDirectory('./tests/testable')).toEqual(['Case.js','core.js']);
});

test('processLineCodeState changes state to description if it finds a start of a documentation comment returning Either.', () => {
    expect(CodeReaderAsyncEffect.processLineCodeState('anything') instanceof Either).toBe(true);
    expect(CodeReaderAsyncEffect.processLineCodeState('/**').value).toEqual({state: 'DESCRIPTION'});
    expect(CodeReaderAsyncEffect.processLineCodeState('const some = "code";').value).toEqual({state: 'CODE'});
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

test('processTag returns Either of documentation of a tag line.', () => {
    expect(CodeReaderAsyncEffect.processTag('true')('example') instanceof Either).toBe(true);
    expect(CodeReaderAsyncEffect.processTag('true')('example').value).toEqual({state: 'EXAMPLE'});
    expect(CodeReaderAsyncEffect.processTag('true')('pure').value).toEqual({state: 'TAG', contents: {tags: {pure: 'true'}}});
    expect(CodeReaderAsyncEffect.processTag('{string} description')('param').value).toEqual({state: 'TAG', contents: {tags: {param: '{string} description'}}});
});

test('processTextOrTag returns Either of text or a tag depending on found content.', () => {
    expect(CodeReaderAsyncEffect.processTextOrTag('description')('some description') instanceof Either).toBe(true);
    expect(CodeReaderAsyncEffect.processTextOrTag('description')('some description').value).toEqual({contents:{description:['some description']}});
    expect(CodeReaderAsyncEffect.processTextOrTag('example')('some example').value).toEqual({contents:{example:['some example']}});
    expect(CodeReaderAsyncEffect.processTextOrTag('description')('@something else').value).toEqual({state: 'TAG', contents: {tags: {something: 'else'}}});
    expect(CodeReaderAsyncEffect.processTextOrTag('description')('@1').value).toEqual({});
    expect(CodeReaderAsyncEffect.processTextOrTag('description')('@12').value).toEqual({state: 'TAG', contents: {tags: {'12': 'true'}}});
    expect(CodeReaderAsyncEffect.processTextOrTag('description')('1').value).toEqual({});
    expect(CodeReaderAsyncEffect.processTextOrTag('description')('12').value).toEqual({contents:{description:['12']}});
});

test('processLineTextState returns Either of text or a tag depending on found content.', () => {
    expect(CodeReaderAsyncEffect.processLineTextState('example')('* some example') instanceof Either).toBe(true);
    expect(CodeReaderAsyncEffect.processLineTextState('example')('* some example').value).toEqual({contents:{example:['some example']}});
    expect(CodeReaderAsyncEffect.processLineTextState('description')('* some description').value).toEqual({contents:{description:['some description']}});
    expect(CodeReaderAsyncEffect.processLineTextState('example')('* @something else').value).toEqual({state: 'TAG', contents: {tags: {something: 'else'}}});
    expect(CodeReaderAsyncEffect.processLineTextState('example')('*/').value).toEqual({state: 'CODE'});
    expect(CodeReaderAsyncEffect.processLineTextState('example')('no star').value).toEqual({});
});