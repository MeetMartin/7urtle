import {SyncEffect, Either, passThrough, isJust} from "@7urtle/lambda";
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
 *
 * sendHead triggers responseHook.writeHead side effect and outputs Right(responseHook) on success.
 * sendHead triggers responseHook.writeHead side effect and outputs Left(string) on fail.
 * sendHead uses 200 as response status if no status is specified in the input response object.
 */
const sendHead = response => responseHook =>
  Either.try(() =>
    passThrough(
      responseHook => responseHook.writeHead(response.status || 200, getHeaders(response))
    )(responseHook)
  );

/**
 * sendContent :: object -> object -> Either
 *
 * sendContent triggers responseHook.end side effect and outputs Right(responseHook) on success.
 * sendContent triggers responseHook.end side effect and outputs Left(string) on fail.
 */
const sendContent = response => responseHook =>
  Either.try(() =>
    passThrough(
      responseHook => isJust(response.content) ? responseHook.end(response.content) : responseHook.end()
    )(responseHook)
  );

/**
 * streamFile :: object -> object -> Either
 *
 * streamFile triggers read data stream side effect streaming response.file and outputs Right(responseHook) on success.
 * streamFile triggers read data stream side effect streaming response.file and outputs Left(string) on fail.
 */
const streamFile = response => responseHook =>
  fs.existsSync(response.file)
    ? Either.Right(
        passThrough(
          responseHook => fs.createReadStream(response.file).pipe(responseHook)
          // TODO: catch .on("error", handler) for pipe
        )(responseHook)
      )
    : Either.Left('File does not exist.');

/**
 * sendOrStream :: object -> object -> Either
 *
 * sendOrStream outputs Either calling streamFile or sendContent depending on whether response.file is just.
 */
const sendOrStream = response => responseHook =>
  isJust(response.file)
    ? streamFile(response)(responseHook)
    : sendContent(response)(responseHook);

/**
 * ResponseEffect :: object -> object -> SyncEffect(() -> Either(object))
 *
 * ResponseEffect outputs SyncEffect which can trigger side effects responseHook.writeHead and responseHook.end outputting Right(responseHook) on success.
 * ResponseEffect outputs SyncEffect which can trigger side effects responseHook.writeHead and responseHook.end outputting Left(error) on fail.
 */
const ResponseEffect = responseHook => response =>
  SyncEffect
  .of(() =>
    Either
    .of(responseHook)
    .flatMap(sendHead(response))
    .flatMap(sendOrStream(response))
  );

export default ResponseEffect;

export {
  getHeaders,
  sendHead,
  sendContent,
  streamFile,
  sendOrStream
}