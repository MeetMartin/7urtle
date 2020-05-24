import createLogger from "@7urtle/logger";

import IOCommanderAsyncEffect from './IOCommanderAsyncEffect';
import CodeReaderSyncEffect from './CodeReaderAsyncEffect';
import {getDocumentationWriterAsyncEffect} from './DocumentationWriterAsyncEffect';

const logger = createLogger();

IOCommanderAsyncEffect
.flatMap(
  configuration =>
    (EitherDocumentation =>
      EitherDocumentation.isLeft()
      ? logger.error(EitherDocumentation.value)
      : getDocumentationWriterAsyncEffect(configuration.output)(EitherDocumentation.value)
    )
    (Either.try(CodeReaderSyncEffect.trigger(configuration.input)))
)
.trigger(
  logger.error,
  () => logger.info(`Documentation from ${configuration.input} was successfuly saved to ${configuration.output}.`)
);
