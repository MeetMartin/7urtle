import RequestEffect, * as lib from '../src/RequestEffect';
import {configuration, request} from "./mocks/configuration";
import loggerConfiguration from './mocks/loggerConfiguration';
import requestHook, {requestHookPost} from './mocks/requestHook';

test('parseJSON parses into String to JSON returning Either functor with the result', () => {
  const json = lib.parseJSON('{"a":"b"}');
  expect(json.isRight()).toBe(true);
  expect(json.value.a).toBe('b');
  expect(lib.parseJSON(':(').isLeft()).toBe(true);
});

test('logRequest uses logger for debug log of request method and url.', () => {
  const request2 = {
    ...request,
    method: 'patch',
    path: '/tortoise/heaven'
  };
  expect(lib.logRequest(request2)).toBe(request2);
  expect(loggerConfiguration.getLog()).toBe('DEBUG: Request received for PATCH /tortoise/heaven.')
});

test('getRequestObject extracts request data from input requestHook and outputs request object.', () => {
  expect(lib.getRequestObject(configuration)(requestHook)).toEqual({
    configuration: configuration,
    path: '/path',
    method: 'get',
    data: undefined
  });
  expect(lib.getRequestObject(configuration)(requestHookPost)).toEqual({
    configuration: configuration,
    path: '/',
    method: 'post',
    data: {first: "tort", second: "oise"}
  });
});

test('RequestEffect(object)(object).trigger(d -> e, f -> g) for GET requestHook returns correct request object.', done => {
  RequestEffect(requestHook)(configuration).trigger(error => error, result => {
    expect(result).toEqual({
      configuration: configuration,
      "data": undefined, "method": "get", "path": "/path"
    });
    done();
  });
});

test('RequestEffect(object)(object).trigger(d -> e, f -> g) for POST requestHook returns correct request object including data.', done => {
  requestHookPost.data = undefined;
  RequestEffect(requestHookPost)(configuration).trigger(error => error, result => {
    expect(result).toEqual({
      configuration: configuration,
      "data": {"first": "tort", "second": "oise"}, "method": "post", "path": "/"
    });
    done();
  });
});