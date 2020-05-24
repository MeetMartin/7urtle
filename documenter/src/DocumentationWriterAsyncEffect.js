import {AsyncEffect} from "@7urtle/lambda";
import fs from "fs";

/**
 * getDocumentationWriterAsyncEffect takes output path and documentation object to return AsyncEffect functorß
 * of a documentation writer.
 *
 * @pure
 * @HindleyMilner getDocumentationWriter :: a -> {b} -> {AsyncEffect}
 * @param string path
 * @param {object} documentation
 * @returns {AsyncEffect}
 * @example
 * getDocumentationWriterAsyncEffect('./existing-output/')(documentation).trigger(
 *   error => console.error(error),
 *   result => console.info('Documentation is saved')
 * );
 * // => 'Documentation is saved'
 */
const getDocumentationWriterAsyncEffect = path => documentation =>
    AsyncEffect.of(
        async (reject, resolve) =>
            fs.writeFile(
                path + "documentation.json",
                JSON.stringify(documentation),
                'utf8',
                error => error
                    ? reject(`There was an error writing into "${path}documentation.json" with exception: "${error}".`)
                    : resolve(documentation)
            )
    );

export {
    getDocumentationWriterAsyncEffect
};