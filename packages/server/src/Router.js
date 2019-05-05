import {isEqual, isFunction, isUndefined} from "@7urtle/lambda";

const checkRoute = path => route => isEqual(route.path)(path);

const findRoute = configuration => path => configuration.routes.find(checkRoute(path));

const verifyRouteIsFound = configuration => route => isUndefined(route) ? configuration[404] : route;

const getRoute = configuration => request => verifyRouteIsFound(configuration)(findRoute(configuration)(request.path));

const anyOr404 = configuration => request => route =>
  isFunction(route.any) ? route.any(request) : configuration[404].any(request);

const getApi = configuration => request => route =>
  isFunction(route[request.method]) ? route[request.method](request) : anyOr404(configuration)(request)(route);

const getResponse = configuration => request => getApi(configuration)(request)(getRoute(configuration)(request)).value;

export default {getResponse};