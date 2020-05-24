import {AsyncEffect} from "@7urtle/lambda";
import fs from "fs";

/**
 * getDocumentationWriterAsyncEffect takes configuration object to return AsyncEffect functor
 * of a documentation writer.
 *
 * @pure
 * @HindleyMilner getDocumentationWriter :: a -> {b} -> {AsyncEffect}
 * @param {object} configuration
 * @returns {AsyncEffect}
 * @example
 * getDocumentationWriterAsyncEffect(configuration).trigger(
 *   error => console.error(error),
 *   result => console.info('Documentation is saved')
 * );
 * // => 'Documentation is saved'
 */
const getDocumentationWriterAsyncEffect = configuration =>
    AsyncEffect.of(
        async (reject, resolve) =>
            fs.writeFile(
                configuration.output + "documentation.json",
                JSON.stringify(configuration.documentation),
                'utf8',
                error => error
                    ? reject(`There was an error writing into "${configuration.output}documentation.json" with exception: "${error}".`)
                    : resolve(configuration)
            )
    );

export {
    getDocumentationWriterAsyncEffect
};