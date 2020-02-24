import commander from 'commander';
import {compose, Either, either, identity, Maybe, SyncEffect} from "@7urtle/lambda";
import fs from 'fs';

const IOCommanderSyncEffect =
    SyncEffect
        .of(() => new commander.Command())
        .map(a => a.version('0.0.1', '-v, --version', 'output the current version'))
        .map(a => a.option('-i, --input <input>', 'input file or directory'))
        .map(a => a.option('-o, --output <output>', 'output directory'))
        .map(a => a.parse(process.argv));

const createDirectories = targetPath => fs.mkdirSync(targetPath, { recursive: true });

const getUndefinedIO = logger => error =>
    logger.error(`Documenter failed during initialisation with error: ${error}.`) &&
    {
        input: undefined,
        output: undefined
    };

const getFSStatus = targetPath => Either.try(() => fs.statSync(targetPath));
const isFile = fsStatus => fsStatus.isLeft() ? false : fsStatus.value.isFile();
const isInputValid = compose(isFile, getFSStatus);

const validateInput = logger => input =>
    isInputValid(input)
        ? input
        : logger.error(`Only existing output directories are supported for --output.`)
          && undefined;

const validateOutput = logger => output =>
    fs.existsSync(output)
        ? output
        : logger.error(`Only valid files are supported for --input.`)
          && undefined;
        /*: either
          (error => logger.error(`There was an issue trying to create the output directory: ${error}.`) && undefined)
          (identity)
          (logger.info(`Creating output directory ${output}.`) && Either.try(createDirectories(output)));
// TODO: use https://stackoverflow.com/questions/21194934/how-to-create-a-directory-if-it-doesnt-exist-using-node-js/54137611#54137611
*/

const getValue = target => logger => commander =>
    Maybe.of(commander[target]).isNothing()
        ? logger.error(`--${target} is required argument. Try: $ documenter --input ./your/input --output ./your/output`)
          && undefined
        : commander[target];

const getDefinedIO = logger => commander => (
    {
        input: validateInput(logger)(getValue('input')(logger)(commander)),
        output: validateOutput(logger)(getValue('output')(logger)(commander))
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