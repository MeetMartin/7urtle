import {AsyncEffect, Either, lowerCaseOf, isNothing} from "@7urtle/lambda";
import * as queryString from 'query-string';

/**
 * parseJSON :: String -> Either
 *
 * parseJSON parses into String to JSON returning Either functor with the result
 */
const parseJSON = data => Either.try(() => JSON.parse(data));

/**
 * getRequestObject :: object -> object
 *
 * getRequestObject extracts request data from input requestHook and outputs request object.
 */
const getRequestObject = requestHook => ({
  path: requestHook.url,
  method: lowerCaseOf(requestHook.method),
  data: isNothing(requestHook.data)
    ? undefined
    : (json =>
        json.isLeft()
          ? queryString.parse(requestHook.data)
          : json.value
    )(parseJSON(requestHook.data))
});

/**
 * RequestEffect :: object -> AsyncEffect(() -> object)
 *
 * RequestEffect(object).trigger(d -> e, f -> g) for GET requestHook returns correct request object.
 * RequestEffect(object).trigger(d -> e, f -> g) for POST requestHook returns correct request object including data.
 */
const RequestEffect = requestHook =>
  AsyncEffect.of(
    (reject, resolve) => {
      requestHook.data = '';
      requestHook.on('data',
        input => requestHook.data += input
        // consider using stream-meter https://stackoverflow.com/questions/4295782/how-to-process-post-data-in-node-js
      );
      requestHook.on('end',
        () => resolve(requestHook)
      );
    }
  )
  .map(getRequestObject);

export default RequestEffect;

export {
  getRequestObject
};