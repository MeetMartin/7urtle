import http from "http";
import {compose, isEqual, isNumber, identity} from "@7urtle/lambda";
import RequestEffect from "./RequestEffect";
import ResponseEffect from "./ResponseEffect";
import Router from "./Router";

/**
 * getServer :: object -> http.Server
 *
 * getServer uses configuration object to start server with listeners for request and error
 */
const getServer = configuration =>
  http
  .createServer()
  .on('request', configuration.listeners.request)
  .on('error', configuration.listeners.error)
  .listen(configuration.options.port, configuration.listeners.listening);

/**
 * addListeners :: object -> object
 *
 * addListeners adds listener functions for request, error, and listening to provided configuration if not predefined.
 */
const addListeners = configuration => ({
  listeners: {
    request: requestListener(configuration),
    error: errorListener(configuration),
    listening: listeningListener(configuration),
    ...configuration.listeners
  },
  ...configuration
});

/**
 * listeningListener :: object -> () -> string
 *
 * listeningListener uses logger provided in input configuration object to log listening event.
 */
const listeningListener = configuration => () =>
  configuration.logger.info(`Server is listening on port ${configuration.options.port}.`);

/**
 * errorListener :: object -> object|string -> string
 *
 * errorListener uses logger provided in input configuration object to log error listening event error object.
 */
const errorListener = configuration => error =>
  isEqual(error.code)('EADDRINUSE')
    ? configuration.logger.error(`Port ${configuration.options.port} is already in use. Server cannot start.`)
    : configuration.logger.error(error.message || error.code || error);

/**
 * respondToError :: object -> object -> number|any -> {}
 *
 * respondToError responds using ResponseHook to errors rejected during request processing.
 */
const respondToError = responseHook => configuration => error =>
  isNumber(error)
    ? configuration.logger.error(`Server request API processing failed with status: ${error}.`)
    && respondWithApiError(configuration)(responseHook)(error)
    : configuration.logger.error(`Server request processing failed with error: '${error}'.`)
    && respondWithApiError(configuration)(responseHook)(500);

/**
 * respondWithApiError :: object -> object -> number -> {}
 *
 * respondWithApiError triggers AsyncEffect of apiError for input status and logs potential error.
 */
const respondWithApiError = configuration => responseHook => status =>
  configuration.apiError.any({
    configuration: configuration,
    status: status
  })
  .flatMap(ResponseEffect(responseHook))
  .trigger(
    error => configuration.logger.error(error),
    identity
  );

/**
 * requestListener :: object -> (object, object) -> {}
 *
 * requestListener uses configuration to resolve request from requestHook by sending response using responseHook.
 */
const requestListener = configuration => (requestHook, responseHook) =>
  RequestEffect(requestHook)(configuration)
  .flatMap(Router.getApiEffect)
  .flatMap(ResponseEffect(responseHook))
  .trigger(
    respondToError(responseHook)(configuration),
    identity
  );

/**
 * create :: object -> http.Server
 *
 * create adds listeners to configuration and creates a listening http.Server.
 */
const create = compose(getServer, addListeners);

export default {create};

export {
  getServer,
  addListeners,
  listeningListener,
  errorListener,
  respondToError,
  respondWithApiError,
  requestListener
}