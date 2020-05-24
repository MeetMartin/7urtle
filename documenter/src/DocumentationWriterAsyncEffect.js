import {AsyncEffect, Either, either, identity} from "@7urtle/lambda";
import fs from "fs";

/**
 * getDocumentationWriterAsyncEffect takes output path and documentation object to return AsyncEffect functorß
 * of a documentation writer.
 *
 * @pure
 * @HindleyMilner getDocumentationWriter :: a -> {b} -> {c}
 * @param string path
 * @param {object} documentation
 * @returns {AsyncEffect}
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