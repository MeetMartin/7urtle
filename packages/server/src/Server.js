import {SyncEffect} from "@7urtle/lambda";
import http from "http";
import Router from "./Router";
import ResponseEffect from "./ResponseEffect";

/**
 * getRequest :: object -> object
 *
 * getRequest extracts request data from input requestHook and outputs request object.
 */
const getRequest = requestHook => ({
  path: requestHook.url,
  method: requestHook.method
});

/**
 * getResponse :: object -> object -> object
 *
 * getResponse outputs response object depending on input configuration and requestHook.
 */
const getResponse = configuration => requestHook => Router.getResponse(configuration)(getRequest(requestHook));

/**
 * onRequest :: object -> (object, object) -> Either
 *
 * onRequest outputs responseHook executing ResponseEffect side effect based on input configuration, requestHook and responseHook.
 */
const onRequest = configuration => (requestHook, responseHook) =>
  ResponseEffect(responseHook)(getResponse(configuration)(requestHook))
  .trigger();
// TODO: I am not really processing what happens if onRequest fails... probably log it...

/**
 * requestListener :: object -> Server -> Server
 */
const requestListener = configuration => Server => Server.on('request', onRequest(configuration));

const listen = configuration => Server => Server.listen(configuration.port);

/**
 * Server :: object -> SyncEffect(http.Server)
 */
const Server = configuration =>
  SyncEffect
  .of(http.createServer)
  .map(requestListener(configuration))
  .map(listen(configuration));

export default Server;

export {
  getRequest,
  getResponse,
  onRequest,
  requestListener,
  listen
};