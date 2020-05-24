import {getDocumentationWriterAsyncEffect} from '../src/DocumentationWriterAsyncEffect';

import {setWriteFileSuccess} from 'fs'; // comes from a mock

jest.mock('fs');

test('getDocumentationWriterAsyncEffect takes output path and documentation object to return AsyncEffect functor of a documentation writer.', done => {
    getDocumentationWriterAsyncEffect('./existing-directory/')({ a: 'b'}).trigger(
        error => {
            done.fail('getDocumentationWriterAsyncEffect should not end in error: ' + error);
        },
        result => {
            expect(result).toEqual({ a: 'b'});
            done();
        }
    );
    setWriteFileSuccess(false);
    getDocumentationWriterAsyncEffect('./existing-directory/')({}).trigger(
        error => {
            expect(error).toBe('There was an error writing into "./existing-directory/documentation.json" with exception: "Unknown error occured.".');
            done();
        },
        result => {
            done.fail('getDocumentationWriterAsyncEffect should not be successful with result: ' + result);
        }
    );
});