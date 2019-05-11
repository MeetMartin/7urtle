import {isEqual, isFunction, isUndefined, maybe, Maybe, Either} from "@7urtle/lambda";

/**
 * checkRoute :: string -> object -> boolean
 *
 * checkRoute outputs true if inputs path and route.path match.
 */
const checkRoute = path => route => isEqual(route.path)(path);

/**
 * findRoute :: object -> object -> (object|undefined)
 *
 * findRoute outputs route object found in input configuration.routes based on input request.path or undefined if no path matches.
 */
const findRoute = configuration => request =>
  maybe(Either.Left(404))
       (Either.Right)
       (Maybe.of(configuration.routes.find(checkRoute(request.path))));

/**
 * getApiResultForError :: object -> object -> Either -> Either
 *
 * getApiResultForError outputs Either of error api call result for the error status defaulting to general error api.
 */
const getApiResultForError = configuration => request => error =>
  !isUndefined(configuration[error.value]) && isFunction(configuration[error.value].any) // is there an api for the error?
    ? configuration[error.value].any(request) // call api for the error
    : configuration.error.any(request); // call api for general error

/**
 * catchApiException :: object -> object -> Either -> Either
 *
 * catchApiException outputs the same Either or Either of 500 error call if input Either caught an exception.
 */
const catchApiException = configuration => request => tried =>
  tried.isLeft() ? Either.Right(configuration.error.any(request)) : tried;

/**
 * getApiResult :: object -> object -> Either -> Either
 *
 * getApiResult outputs Either of api call result.
 * getApiResult outputs Either of api 404 error call if route is not found.
 * getApiResult outputs Either of api any call if requested method call is not found.
 * getApiResult outputs Either of 404 api call if both requested method call and any call are not found.
 * getApiResult outputs Left of error code if api call returns Left.
 */
const getApiResult = configuration => request => route =>
  route.isLeft() // was route not found?
    ? getApiResultForError(configuration)(request)(route)
    : isFunction(route.value.api[request.method]) // is there api call for the request method?
      ? route.value.api[request.method](request) // call api for the request method
      : isFunction(route.value.api.any) // is there api any function?
        ? route.value.api.any(request) // call api any function
        : configuration[404].any(request); // call api for 404 error

/**
 * catchApiError :: object -> object -> Either -> Either
 *
 * catchApiError outputs Either of error api call result for the error status or original input result.
 */
const catchApiError = configuration => request => result =>
  result.isLeft()
    ? getApiResultForError(configuration)(request)(result)
    : result;

/**
 * getResponse :: object -> object -> object
 *
 * getResponse outputs response object.
 * getResponse outputs response object for 404 api call if route is not found.
 * getResponse outputs response object for error api call if api call returns an error.
 * getResponse outputs response object for error api call if api call throws an exception.
 */
const getResponse = configuration => request =>
  catchApiError(configuration)(request)(
    catchApiException(configuration)(request)(
      Either.try(
        () => getApiResult(configuration)(request)(
          findRoute(configuration)(request)
        )
      )
    ).value
  ).value;

export default {getResponse};

export {
  checkRoute,
  findRoute,
  getApiResultForError,
  catchApiException,
  getApiResult,
  catchApiError
};