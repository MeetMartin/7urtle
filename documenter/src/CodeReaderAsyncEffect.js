import {AsyncEffect, Either, either, identity} from "@7urtle/lambda";
import readline from "readline";
import fs from "fs";

const lineReader = path => processLine => resolve =>
    readline
        .createInterface({input: fs.createReadStream(path)})
        .on('line', processLine)
        .on('close', resolve);

/**
 * getCodeReader takes as its input path to a file and a function to process each line and then
 * attempts to process a file using the supplied processLine function
 *
 * @pure
 * @HindleyMilner getCodeReader :: {a} -> b -> (c-d) -> {e}
 * @param string path
 * @param function processLine
 * @returns AsyncEffect
 */
const getCodeReader = path => processLine =>
    AsyncEffect.of(
        async (reject, resolve) =>
            either
            (error => reject(`There was an error processing file "${path}" with exception: "${error}".`))
            (identity)
            (Either.try(() => lineReader(path)(processLine)(resolve)))
    );

export {
    getCodeReader
};