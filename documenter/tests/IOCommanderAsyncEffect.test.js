import * as IOCommanderAsyncEffect from '../src/IOCommanderAsyncEffect';

import commander, {setInput, setOutput} from 'commander'; // comes from a mock

jest.mock('fs');

afterEach(() => {
    setInput('./existing-directory/');
    setOutput('./existing-directory/');
});

test('isDirectoryValid return functor AsyncEffect that throws error if directory based on an argument in commander is invalid and returns the commander.', done => {
    IOCommanderAsyncEffect.isDirectoryValid('input')(new commander.Command().parse()).trigger(
        error => {
            done.fail('isDirectoryValid should not end in error: ' + error);
        },
        result => {
            expect(result).toEqual(new commander.Command().parse());
            done();
        }
    );

    IOCommanderAsyncEffect.isDirectoryValid('input')({}).trigger(
        error => {
            expect(error).toEqual('--input is a required argument. Try: $ documenter --input ./your/input --output ./your/output');
            done();
        },
        result => {
            done.fail('isDirectoryValid should not be successful with result: ' + result);
        }
    );

    setInput('./existing-directory/core.js');
    IOCommanderAsyncEffect.isDirectoryValid('input')(new commander.Command().parse()).trigger(
        error => {
            expect(error).toEqual('--input ./existing-directory/core.js is not a directory.');
            done();
        },
        result => {
            done.fail('isDirectoryValid should not be successful with result: ' + result);
        }
    );

    setOutput('./does-not-exist');
    IOCommanderAsyncEffect.isDirectoryValid('output')(new commander.Command().parse()).trigger(
        error => {
            expect(error).toEqual('ENOENT: no such file or directory, stat \'./does-not-exist\'');
            done();
        },
        result => {
            done.fail('isDirectoryValid should not be successful with result: ' + result);
        }
    );
});

test('IOCommanderAsyncEffect reads and validates --input and --output values from a commandline.', done => {
    IOCommanderAsyncEffect.IOCommanderAsyncEffect.trigger(
        error => {
            done.fail('IOCommanderAsyncEffect should not end in error: ' + error);
        },
        result => {
            expect(result).toEqual({input: './existing-directory/', output: './existing-directory/'});
            done();
        }
    );

    setInput('./does-not-exist');
    IOCommanderAsyncEffect.IOCommanderAsyncEffect.trigger(
        error => {
            expect(error).toBe('ENOENT: no such file or directory, stat \'./does-not-exist\'');
            done();
        },
        result => {
            done.fail('IOCommanderAsyncEffect should not be successful with result: ' + result);
        }
    );

    setInput('./existing-directory/');
    setOutput('./existing-directory/core.js');
    IOCommanderAsyncEffect.IOCommanderAsyncEffect.trigger(
        error => {
            expect(error).toBe('--output ./existing-directory/core.js is not a directory.');
            done();
        },
        result => {
            done.fail('IOCommanderAsyncEffect should not be successful with result: ' + result);
        }
    );
});