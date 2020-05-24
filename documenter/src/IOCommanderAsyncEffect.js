import commander from 'commander';
import {AsyncEffect, isNothing} from "@7urtle/lambda";
import fs from 'fs';

/**
 * isDirectoryValid return functor AsyncEffect that throws error if directory based on an argument in commander is invalid and returns the commander.
 * 
 * @pure
 * @function
 * @HindleyMilner doestIOArgumentExist :: a -> {b} -> AsyncEffect
 * @param {string} argument 
 * @param {object} commander
 * @returns {AsyncEffect}
 * @example
 * isDirectoryValid('input')({input: './valid-directory'});
 * // => AsyncEffect
 */
const isDirectoryValid = argument => commander =>
    AsyncEffect
    .of((reject, resolve) =>
        isNothing(commander[argument])
        ? reject(`--${argument} is a required argument. Try: $ documenter --input ./your/input --output ./your/output`)
        : !fs.statSync(commander[argument]).isDirectory()
          ? reject(`--${argument} ${commander[argument]} is not a directory.`)
          : resolve(commander)
    );

/**
 * IOCommanderAsyncEffect reads and validates --input and --output values from a commandline.
 * 
 * @functor
 * @example
 * IOCommanderAsyncEffect.trigger(
 *   error => console.error(error),
 *   result => console.log(`input is ${result.input}, output is ${result.output}`)
 * );
 * // => input is ./existing-input/ , output is ./existing-output/
 */
const IOCommanderAsyncEffect =
    AsyncEffect
    .of((reject, resolve) => resolve(new commander.Command()))
    .map(a => a.version('0.0.1', '-v, --version', 'output the current version'))
    .map(a => a.option('-i, --input <input>', 'input file or directory'))
    .map(a => a.option('-o, --output <output>', 'output directory'))
    .map(a => a.parse(process.argv))
    .flatMap(isDirectoryValid('input'))
    .flatMap(isDirectoryValid('output'))
    .map(a => ({input: a.input, output: a.output}));

export default IOCommanderAsyncEffect;
export {
    isDirectoryValid,
    IOCommanderAsyncEffect
};