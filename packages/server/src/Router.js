import {isEqual, isFunction, isUndefined, maybe, Maybe, Either, endsWith, startsWith, substr, lengthOf} from "@7urtle/lambda";

/**
 * checkRoute :: string -> object -> boolean
 *
 * checkRoute outputs true if inputs path and route.path match.
 * checkRoute supports /* routes.
 */
const checkRoute = path => route =>
  endsWith('/*')(route.path)
    ? startsWith(substr(lengthOf(route.path) -2)(0)(route.path))(path)
    : isEqual(route.path)(path);

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
const catchApiException = configuration => request => result =>
  result.isLeft()
    ? configuration.logger.error(result.value) && Either.Right(configuration.error.any(request))
    : result;

/**
 * emptyContent :: Either -> Either
 *
 * emptyContent outputs Either of result with empty file and content based on input Either.
 */
const emptyContent = resultEither => resultEither.map(result => ({
  ...result,
  contentLength: result.contentLength || Buffer.byteLength(result.content),
  file: '',
  content: ''
}));

/**
 * getApiResult :: object -> object -> Either -> Either
 *
 * getApiResult outputs Either of api call result.
 * getApiResult if head is not api call it outputs Either of api call for get or any with empty file and content result or 404 result if neither are found.
 * getApiResult outputs Either of api 404 error call if route is not found.
 * getApiResult outputs Either of api any call if requested method call is not found.
 * getApiResult outputs Either of 404 api call if both requested method call and any call are not found.
 * getApiResult outputs Left of error code if api call returns Left.
 */
const getApiResult = configuration => request => route =>
  route.isLeft() // was route not found?
    ? getApiResultForError(configuration)(request)(route) // get api result for error
    : isFunction(route.value.api[request.method]) // is there api call for the request method?
      ? route.value.api[request.method](request) // call api for the request method
      : isEqual(request.method)('head') // is request method HEAD?
        ? isFunction(route.value.api.get) // can I use get instead of head
          ? emptyContent(route.value.api.get(request)) // use get instead of head
          : isFunction(route.value.api.any) // can I used any instead of head
            ? emptyContent(route.value.api.any(request)) // use any instead of head
            : emptyContent(configuration[404].any(request)) // call api for 404 error
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
    ? configuration.logger.error(result.value) && getApiResultForError(configuration)(request)(result)
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
  catchApiError(configuration)(request)( // we convert left api call result into error api call result
    catchApiException(configuration)(request)( // we convert thrown exception into 500 error api call result
      Either.try( // we use Either.try to catch thrown exceptions
        () => getApiResult(configuration)(request)( // we call api associated with the found route
          findRoute(configuration)(request) // first we find the right route or left 404
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
  emptyContent,
  getApiResult,
  catchApiError
};