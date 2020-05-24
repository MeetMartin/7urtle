import * as IOCommanderSyncEffect from '../src/IOCommanderSyncEffect';

import commander, {setInput, setOutput} from 'commander'; // comes from a mock

jest.mock('fs');

afterEach(() => {
    setInput('./existing-directory/');
    setOutput('./existing-directory/');
});

test('isDirectoryValid return functor SyncEffect that throws error if directory based on an argument in commander is invalid and returns the commander.', () => {
    expect(IOCommanderSyncEffect.isDirectoryValid('input')({}).trigger)
    .toThrow('--input is a required argument. Try: $ documenter --input ./your/input --output ./your/output');
    expect(IOCommanderSyncEffect.isDirectoryValid('input')(new commander.Command().parse()).trigger()).toEqual(new commander.Command().parse());

    setInput('./existing-directory/core.js');
    expect(IOCommanderSyncEffect.isDirectoryValid('input')(new commander.Command().parse()).trigger)
    .toThrow('--input ./existing-directory/core.js is not a directory.');

    setOutput('./does-not-exist')
    expect(IOCommanderSyncEffect.isDirectoryValid('output')(new commander.Command().parse()).trigger)
    .toThrow('ENOENT: no such file or directory, stat \'./does-not-exist\'');
});

test('IOCommanderSyncEffect reads and validates --input and --output values from a commandline.', () => {
    expect(IOCommanderSyncEffect.IOCommanderSyncEffect.trigger()).toEqual({input: './existing-directory/', output: './existing-directory/'});
    setInput('./does-not-exist');
    expect(IOCommanderSyncEffect.IOCommanderSyncEffect.trigger)
    .toThrow('ENOENT: no such file or directory, stat \'./does-not-exist\'');
    setInput('./existing-directory/');
    setOutput('./existing-directory/core.js')
    expect(IOCommanderSyncEffect.IOCommanderSyncEffect.trigger)
    .toThrow('--output ./existing-directory/core.js is not a directory.');
});