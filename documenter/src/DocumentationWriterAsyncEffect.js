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
 * @HindleyMilner getDocumentationWriter :: a -> {b} -> {c}
 * @param string path
 * @param {*} documentation
 * @returns AsyncEffect
 */
const getDocumentationWriter = path => documentation =>
    AsyncEffect.of(
        async (reject, resolve) =>
            either
            (error => reject(`There was an error writing into "${path}documentation.json" with exception: "${error}".`))
            (identity)
            (Either.try(() => resolve(fs.writeFile(path+"documentation.json", JSON.stringify(documentation), reject))))
    );

export {
    getDocumentationWriter
};