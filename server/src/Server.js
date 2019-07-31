import {SyncEffect} from "@7urtle/lambda";
import http from "http";
import Router from "./Router";
import RequestEffect from "./RequestEffect";
import ResponseEffect from "./ResponseEffect";

/**
 * resolveResponse :: object -> object -> object
 *
 * resolveResponse creates and triggers ResponseEffect
 */
const resolveResponse = configuration => responseHook => request =>
  ResponseEffect(responseHook)(Router.getResponse(configuration)(request))
  .trigger();

/**
 * onRequest :: object -> (object, object) -> Either
 *
 * onRequest outputs responseHook executing ResponseEffect side effect based on input configuration, requestHook and responseHook.
 */
const onRequest = configuration => (reject, resolve) => (requestHook, responseHook) =>
  RequestEffect(requestHook)
  .trigger(
    error => reject(error),
    request => resolve(configuration)(responseHook)(request)

  );

/**
 * requestListener :: object -> Server -> Server
 *
 * requestListener reqisters onRequest handler to request listener and outputs Server.'
 */
const requestListener = configuration => Server =>
  Server.on('request', onRequest(configuration)(() => null, resolveResponse));
// TODO: I am not really processing what happens if onRequest fails... probably log it...

/**
 * listen :: object -> Server -> Server
 *
 * listen calls input Server listen function passing it configuration.port and outputs Server.
 */
const listen = configuration => Server => Server.listen(configuration.port);

/**
 * Server :: object -> SyncEffect(http.Server)
 *
 * Server outputs results based on configuration.
 */
const Server = configuration =>
  SyncEffect
  .of(http.createServer)
  .map(requestListener(configuration))
  .map(listen(configuration));

export default Server;

export {
  onRequest,
  requestListener,
  listen
};