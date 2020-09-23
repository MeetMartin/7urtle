import {passThrough, isJust, Either, either, identity, AsyncEffect} from "@7urtle/lambda";
import fs from "fs";

/**
 * getHeaders :: object -> object
 *
 * getHeaders creates headers object out of response object.
 * getHeaders uses text/plain content type if content-type is not specified.
 */
const getHeaders = response => ({
  'content-type': response.contentType || 'text/plain',
  'content-length': response.contentLength || Buffer.byteLength(response.content)
});

/**
 * sendHead :: object -> object -> Either
 */
const sendHead = responseHook => response =>
  either
  (error => passThrough(response => response.configuration.logger.error(error))(response))
  (identity)
  (Either.try(() =>
    passThrough(
      response => responseHook.writeHead(response.status || 200, getHeaders(response))
    )(response)
  ));

/**
 * sendContent :: object -> object -> Either
 *
 * sendContent triggers responseHook.end side effect and outputs Success(responseHook) on success.
 * sendContent triggers responseHook.end side effect and outputs Failure(string) on fail.
 */
const sendContent = responseHook => response =>
  Either.try(() =>
    passThrough(
      response => isJust(response.content) ? responseHook.end(response.content) : responseHook.end()
    )(response)
  );

/**
 * streamFile :: object -> object -> (a -> b, c -> d) -> {}
 *
 * streamFile triggers read data stream side effect streaming response.file and outputs Success(responseHook) on success.
 * streamFile triggers read data stream side effect streaming response.file and outputs Failure(string) on fail.
 */
const streamFile = responseHook => response => (reject, resolve) =>
  fs.existsSync(response.file)
    ?
    fs
    .createReadStream(response.file)
    .on('error', reject)
    .on('close', () => resolve(response))
    .pipe(responseHook)
    : reject(new Error('Response file does not exist.'));

/**
 * sendOrStream :: object -> object -> object
 *
 * sendOrStream outputs Either calling streamFile or sendContent depending on whether response.file is just.
 */
const sendOrStream = responseHook => response =>
  AsyncEffect.of(
    async (reject, resolve) =>
      isJust(response.file)
        ? streamFile(responseHook)(response)(reject, resolve)
        : either(reject)(resolve)(sendContent(responseHook)(response))
  );

/**
 * ResponseEffect :: object -> object -> AsyncEffect
 */
const ResponseEffect = responseHook => response => {
  sendHead(responseHook)(response);
  return sendOrStream(responseHook)(response);
};

export default ResponseEffect;

export {
  getHeaders,
  sendHead,
  sendContent,
  streamFile,
  sendOrStream
};