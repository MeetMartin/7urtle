import Router, * as lib from '../src/Router';
import {Either} from "@7urtle/lambda";
import configuration from './mocks/configuration';

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
  const postRequest = {
    path: '/post',
    method: 'get'
  };
  const rightRoute = lib.findRoute(configuration)(postRequest);
  expect(rightRoute.isRight()).toEqual(true);
  expect(rightRoute.value).toEqual({
    path: '/post',
    api: {}
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

test('catchApiException outputs the same Either or Either of 500 error call if input Either caught an exception.', () => {
  const apiResult = lib.catchApiException(configuration)(request)(Either.Right('7urtle'));
  expect(apiResult.isRight()).toEqual(true);
  expect(apiResult.value).toEqual('7urtle');
  const errorApiResult = lib.catchApiException(configuration)(request)(Either.Left('I am error :('));
  expect(errorApiResult.isRight()).toEqual(true);
  expect(errorApiResult.value.value).toEqual({
    status: 500,
    contentType: 'text/plain',
    content: 'Internal Server Error'
  });
});

test('getApiResult outputs Either of api call result.', () => {
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

test('getApiResult outputs Left of error code if api call returns Left.', () => {
  const errorRequest = {
    path: '/',
    method: 'post'
  };
  const apiResult = lib.getApiResult(configuration)(errorRequest)(Either.Right(configuration.routes[0]));
  expect(apiResult.isLeft()).toEqual(true);
  expect(apiResult.value).toEqual(500);
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

test('getResponse outputs response object.', () => {
  const response = Router.getResponse(configuration)(request);
  expect(response).toEqual({
    status: 200,
    contentType: 'text/plain',
    content: 'get path result'
  });
});

test('getResponse outputs response object for 404 api call if route is not found.', () => {
  const request404 = {
    path: '/nothing',
    method: 'get'
  };
  const response = Router.getResponse(configuration)(request404);
  expect(response).toEqual({
    status: 404,
    contentType: 'text/plain',
    content: 'Not Found'
  });
});

test('getResponse outputs response object for error api call if api call returns an error.', () => {
  const errorRequest = {
    path: '/',
    method: 'post'
  };
  const response = Router.getResponse(configuration)(errorRequest);
  expect(response).toEqual({
    status: 500,
    contentType: 'text/plain',
    content: 'Internal Server Error'
  });
});

test('getResponse outputs response object for error api call if api call throws an exception.', () => {
  const exceptionRequest = {
    path: '/',
    method: 'patch'
  };
  const response = Router.getResponse(configuration)(exceptionRequest);
  expect(response).toEqual({
    status: 500,
    contentType: 'text/plain',
    content: 'Internal Server Error'
  });
});