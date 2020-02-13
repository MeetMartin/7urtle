import commander from 'commander';
import {compose, Either, either, maybe, Maybe, SyncEffect} from "@7urtle/lambda";
import fs from "fs";

const IOCommanderSyncEffect =
    SyncEffect
        .of(() => new commander.Command())
        .map(a => a.version('0.0.1', '-v, --version', 'output the current version'))
        .map(a => a.option('-i, --input <input>', 'input file or directory'))
        .map(a => a.option('-o, --output <output>', 'output directory'))
        .map(a => a.parse(process.argv));

const getUndefinedIO = logger => error =>
    logger.error(`Documenter failed during initialisation with error: ${error}.`) &&
    {
        input: undefined,
        output: undefined
    };

const getFSStatus = path => Either.try(() => fs.statSync(path));
const isFile = fsStatus => fsStatus.isLeft() ? false : fsStatus.value.isFile();
const isTargetValid = compose(isFile, getFSStatus);

const getValue = target => logger => commander =>
    Maybe.of(commander[target]).isNothing()
        ? logger.error(`--${target} is required argument. Try: $ documenter --input ./your/input --output ./your/output`)
            && undefined
        : isTargetValid(commander[target])
            ? commander[target]
            : logger.error(`Only valid files are supported for --${target}.`)
                && undefined;

const getDefinedIO = logger => commander => (
    {
        input: getValue('input')(logger)(commander),
        //output: getValue('output')(logger)(commander)
    }
);

/**
 * getCMDInput takes a logger object as its input and attempts to read IO command line variables for the documenter
 * like --input ./your/input --output ./your/output. Object is then returned with these values.
 *
 * @pure
 * @HindleyMilner getCMDInput :: a -> b
 * @param {*} logger
 * @returns {*}
 */
const getCMDInput = logger =>
    either
    (getUndefinedIO(logger))
    (getDefinedIO(logger))
    (Either.try(IOCommanderSyncEffect.trigger));

export {
    getCMDInput
};