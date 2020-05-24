import createLogger from "@7urtle/logger";

import IOCommanderAsyncEffect from './IOCommanderAsyncEffect';
import {getCodeReaderAsyncEffect} from './CodeReaderAsyncEffect';
import {getDocumentationWriterAsyncEffect} from './DocumentationWriterAsyncEffect';

const logger = createLogger();

/**
 * Executes the program that reads --input and --output from commandline and generates documentation object that is save as JSON.
 */
IOCommanderAsyncEffect
.flatMap(getCodeReaderAsyncEffect)
.flatMap(getDocumentationWriterAsyncEffect)
.trigger(
  logger.error,
  configuration => logger.info(`Documentation from ${configuration.input} was successfuly saved to ${configuration.output}.`) || process.exit(0)
);