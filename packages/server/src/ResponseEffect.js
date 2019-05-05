import {SyncEffect, Either, passThrough} from "@7urtle/lambda";

const getHeaders = response => ({
  'content-type': response.contentType || 'text/plain',
  'content-length': Buffer.byteLength(response.content)
});

const sendHead = response => responseHook =>
  Either.try(() =>
    passThrough(
      responseHook => responseHook.writeHead(response.status || 200, getHeaders(response))
    )(responseHook)
  );

const sendContent = response => responseHook =>
  Either.try(() =>
    responseHook.end(response.content)
  );

/**
 * ResponseEffect :: object -> object -> SyncEffect(() -> Either(object))
 */
const ResponseEffect = responseHook => response =>
  SyncEffect
  .of(() =>
    Either
    .of(responseHook)
    .flatMap(sendHead(response))
    .flatMap(sendContent(response))
  );

export default ResponseEffect;

export {
  getHeaders,
  sendHead,
  sendContent
}