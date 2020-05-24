import {isUndefined} from "@7urtle/lambda";
import createLogger from "@7urtle/logger";

import {getCMDInput} from './IOCommanderSyncEffect';
import CodeReaderSyncEffect from './CodeReaderSyncEffect';
import {getDocumentationWriter} from './DocumentationWriterAsyncEffect';

const logger = createLogger();

// Execution starts here
const IOConfiguration = getCMDInput(logger);

const documentationJSON = isUndefined(IOConfiguration.input) || isUndefined(IOConfiguration.output)
    ? logger.error(`input and/or output are passed as undefined.`)
    : logger.info(`Processing directory "${IOConfiguration.input}".`)
      && getCodeReader(IOConfiguration.input)(processLine)
        .trigger(
            logger.error,
            onFileEnd(logger)(IOConfiguration.output)(documentation)
        );
