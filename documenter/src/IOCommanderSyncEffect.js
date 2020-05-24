import commander from 'commander';
import {SyncEffect, isNothing} from "@7urtle/lambda";
import fs from 'fs';

/**
 * isDirectoryValid return functor SyncEffect that throws error if directory based on an argument in commander is invalid and returns the commander.
 * 
 * @pure
 * @function
 * @HindleyMilner doestIOArgumentExist :: a -> {b} -> SyncEffect
 * @param {string} argument 
 * @param {object} commander
 * @returns {SyncEffect}
 * @example
 * isDirectoryValid('input')({input: './valid-directory'});
 * // => SyncEffect
 */
const isDirectoryValid = argument => commander =>
    SyncEffect
    .of(() => {
        if(isNothing(commander[argument])) throw `--${argument} is a required argument. Try: $ documenter --input ./your/input --output ./your/output`;
        if(!fs.statSync(commander[argument]).isDirectory()) throw `--${argument} ${commander[argument]} is not a directory.`;
        return commander;
    });

/**
 * IOCommanderSyncEffect reads and validates --input and --output values from a commandline.
 * 
 * @functor
 * @example
 * IOCommanderSyncEffect.trigger();
 * // => Command{input: './tests/input/', output: './output'}
 */
const IOCommanderSyncEffect =
    SyncEffect
    .of(() => new commander.Command())
    .map(a => a.version('0.0.1', '-v, --version', 'output the current version'))
    .map(a => a.option('-i, --input <input>', 'input file or directory'))
    .map(a => a.option('-o, --output <output>', 'output directory'))
    .map(a => a.parse(process.argv))
    .flatMap(isDirectoryValid('input'))
    .flatMap(isDirectoryValid('output'));

export default IOCommanderSyncEffect;
export {
    isDirectoryValid,
    IOCommanderSyncEffect
};