import {AsyncEffect, Either, either, identity, isJust} from "@7urtle/lambda";
import {sendContent, streamFile} from "../../server/src/ResponseEffect";
import readline from "readline";
import fs from "fs";

const lineReaderWithExceptionProcessing = logger => path => {
    logger.info(`Processing file "${path}".`);
    return either
    (error => logger.error(`There was an error processing file "${path}" with exception: "${error}".`))
    (identity)
    (Either.try(() => lineReader(path)));
};

const lineReader = path => resolve =>
    readline
        .createInterface({input: fs.createReadStream(path)})
        .on('line', processLine)
        .on('close', resolve);

const getCodeReader = logger => path => {
    AsyncEffect.of(
        async (reject, resolve) =>
            either
            (error => reject(`There was an error processing file "${path}" with exception: "${error}".`))
            (identity)
            (Either.try(() => lineReader(path)))
    );
};