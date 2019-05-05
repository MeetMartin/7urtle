import {SyncEffect} from "@7urtle/lambda";
import http from "http";
import Router from "./Router";
import ResponseEffect from "./ResponseEffect";

const getRequest = requestHook => ({
  path: requestHook.url,
  method: requestHook.method
});

const getResponse = configuration => requestHook => Router.getResponse(configuration)(getRequest(requestHook));

const onRequest = configuration => (requestHook, responseHook) =>
  ResponseEffect(responseHook)(getResponse(configuration)(requestHook))
  .trigger();

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