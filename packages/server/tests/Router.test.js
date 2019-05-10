import getResponse, * as lib from '../src/Router';
import {Either} from "@7urtle/lambda";

const apiRoot = {
  post() {
    return Either.Left(500);
  },
  any() {
    return Either.Right({
      status: 200,
      contentType: 'text/plain',
      content: 'any root result'
    });
  }
};

const apiPost = {};

const apiPath = {
  get() {
    return Either.Right({
      status: 200,
      contentType: 'text/plain',
      content: 'get path result'
    });
  },
  any() {
    return Either.Right({
      status: 200,
      contentType: 'text/plain',
      content: 'any path result'
    });
  }
};

const api404 = {
  any() {
    return Either.Right({
      status: 404,
      contentType: 'text/plain',
      content: 'Not Found'
    });
  }
};

const apiError = {
  any() {
    return Either.Right({
      status: 500,
      contentType: 'text/plain',
      content: 'Internal Server Error'
    });
  }
};

const configuration = {
  routes: [
    {
      path: '/',
      api: apiRoot
    },
    {
      path: '/path',
      api: apiPath
    },
    {
      path: '/post',
      api: apiPost
    }
  ],
  404: api404,
  error: apiError
};

const request = {
  path: '/path',
  method: 'get'
};

test('checkRoute outputs true if inputs path and route.path match.', () => {
  expect(lib.checkRoute('/path')(configuration.routes[1])).toEqual(true);
  expect(lib.checkRoute('/path')({path: '/paths'})).toEqual(false);
  expect(lib.checkRoute('/')({path: '/paths'})).toEqual(false);
});

test('findRoute outputs Either of route found in input configuration.routes based on input request.path or undefined if no path matches.', () => {
  const rightRoute = lib.findRoute(configuration)(request);
  expect(rightRoute.isRight()).toEqual(true);
  expect(rightRoute.value).toEqual({
    path: '/path',
    api: apiPath
  });
  const leftRoute = lib.findRoute(configuration)('/404');
  expect(leftRoute.isLeft()).toEqual(true);
  expect(leftRoute.value).toEqual(404);
});

test('getApiResultForError outputs Either of error api call result for the error status defaulting to general error api.', () => {
  const apiResult1 = lib.getApiResultForError(configuration)(request)(Either.Left(404));
  expect(apiResult1.isRight()).toEqual(true);
  expect(apiResult1.value).toEqual({
    status: 404,
    contentType: 'text/plain',
    content: 'Not Found'
  });
  const apiResult2 = lib.getApiResultForError(configuration)(request)(Either.Left(500));
  expect(apiResult2.isRight()).toEqual(true);
  expect(apiResult2.value).toEqual({
    status: 500,
    contentType: 'text/plain',
    content: 'Internal Server Error'
  });
});

test('getApiResult outputs Either of api call resul.t', () => {
  const apiResult = lib.getApiResult(configuration)(request)(Either.Right(configuration.routes[1]));
  expect(apiResult.isRight()).toEqual(true);
  expect(apiResult.value).toEqual({
    status: 200,
    contentType: 'text/plain',
    content: 'get path result'
  });
});

test('getApiResult outputs Either of api 404 error call if route is not found.', () => {
  const apiResult = lib.getApiResult(configuration)(request)(Either.Left(404));
  expect(apiResult.isRight()).toEqual(true);
  expect(apiResult.value).toEqual({
    status: 404,
    contentType: 'text/plain',
    content: 'Not Found'
  });
});

test('getApiResult outputs Either of api any call if requested method call is not found.', () => {
  const apiResult = lib.getApiResult(configuration)(request)(Either.Right(configuration.routes[0]));
  expect(apiResult.isRight()).toEqual(true);
  expect(apiResult.value).toEqual({
    status: 200,
    contentType: 'text/plain',
    content: 'any root result'
  });
});

test('getApiResult outputs Either of 404 api call if both requested method call and any call are not found.', () => {
  const apiResult = lib.getApiResult(configuration)(request)(Either.Right(configuration.routes[2]));
  expect(apiResult.isRight()).toEqual(true);
  expect(apiResult.value).toEqual({
    status: 404,
    contentType: 'text/plain',
    content: 'Not Found'
  });
});

test('catchApiError outputs Either of error api call result for the error status or original input result.', () => {
  const apiResult = lib.catchApiError(configuration)(request)(Either.Left(500));
  expect(apiResult.isRight()).toEqual(true);
  expect(apiResult.value).toEqual({
    status: 500,
    contentType: 'text/plain',
    content: 'Internal Server Error'
  });
  const apiResult2 = lib.catchApiError(configuration)(request)(Either.Right({
    status: 200,
    contentType: 'text/plain',
    content: 'any root result'
  }));
  expect(apiResult2.isRight()).toEqual(true);
  expect(apiResult2.value).toEqual({
    status: 200,
    contentType: 'text/plain',
    content: 'any root result'
  });
});