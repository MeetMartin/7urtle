import ResponseEffect, * as lib from '../src/ResponseEffect';
import {configuration, response} from "./mocks/configuration";
import responseHook, {end, head, responseHookError} from './mocks/responseHook';
import loggerConfiguration from './mocks/loggerConfiguration';
import RequestEffect from "../src/RequestEffect";
import requestHook from "./mocks/requestHook";

test('getHeaders creates headers object out of response object.', () => {
  expect(lib.getHeaders(response)).toEqual({'content-type': 'text/plain', 'content-length': 9});
  const response2 = {
    ...response,
    contentType: 'application/json',
    contentLength: 7
  };
  expect(lib.getHeaders(response2)).toEqual({'content-type': 'application/json', 'content-length': 7});
});

test('getHeaders uses text/plain content type if content-type is not specified.', () => {
  const response2 = {
    content: 'Success'
  };
  expect(lib.getHeaders(response2)).toEqual({'content-type': 'text/plain', 'content-length': 7});
});

test('sendHead triggers responseHook.writeHead side effect and outputs unchanged response on success.', () => {
  const result = lib.sendHead(responseHook)(response);
  expect(result).toEqual(response);
  expect(head).toEqual({status: 404, headers: {'content-type': 'text/plain', 'content-length': 9}});
});

test('sendHead triggers responseHook.writeHead side effect and outputs unchanged response on fail.', () => {
  const result = lib.sendHead(responseHookError)(response);
  expect(result).toEqual(response);
  expect(loggerConfiguration.getLog()).toBe('ERROR: I failed :(');
});

test('sendHead uses 200 as response status if no status is specified in the input response object.', () => {
  const response2 = {
    contentType: 'text/plain',
    content: 'Not Found'
  };
  const result = lib.sendHead(responseHook)(response2);
  expect(result).toEqual(response2);
  expect(head).toEqual({status: 200, headers: {'content-type': 'text/plain', 'content-length': 9}});
});

test('sendContent triggers responseHook.end side effect and outputs Right(responseHook) on success.', () => {
  const result = lib.sendContent(responseHook)(response);
  expect(result.isRight()).toEqual(true);
  expect(result.value).toEqual(response);
  expect(end).toEqual('Not Found');
});

test('sendContent triggers responseHook.end side effect and outputs Left(string) on fail.', () => {
  const result = lib.sendContent(responseHookError)(response);
  expect(result.isLeft()).toEqual(true);
  expect(result.value).toEqual('I failed :(');
});

test('streamFile triggers read data stream side effect streaming response.file on success.', () => {
  const response = {
    file: './tests/mocks/static.html'
  };
  let responded = null;
  const resolve = a => responded = a;
  lib.streamFile(responseHook)(response)(resolve, resolve);
  //expect(responded).toEqual(response);
  // TODO: figure out how to test streaming for success and error
});

/*test('sendOrStream outputs Either calling streamFile or sendContent depending on whether response.file is just.', () => {
  const result = lib.sendOrStream(response)(responseHook);
  expect(result.isRight()).toEqual(true);
  expect(result.value).toEqual(responseHook);
  expect(end).toEqual('Not Found');

  const response2 = {
    file: './idontexist.html'
  };
  const result2 = lib.sendOrStream(response2)(responseHook);
  expect(result2.isLeft()).toEqual(true);
  expect(result2.value).toEqual('File does not exist.');

  const response3 = {
    file: '',
    content: 'Not Found Again'
  };
  const result3 = lib.sendOrStream(response3)(responseHook);
  expect(result3.isRight()).toEqual(true);
  expect(result3.value).toEqual(responseHook);
  expect(end).toEqual('Not Found Again');
});

test('ResponseEffect outputs AsyncEffect which can trigger side effects responseHook.writeHead and responseHook.end on success.', done => {
  ResponseEffect(requestHook)(response).trigger(error => error, result => {
    expect(result).toEqual(response);
    expect(head).toEqual({status: 404, headers: {'content-type': 'text/plain', 'content-length': 9}});
    expect(end).toEqual('Not Found');
    done();
  });
});

test('ResponseEffect outputs AsyncEffect which can trigger side effects responseHook.writeHead and responseHook.end on fail.', done => {
  ResponseEffect(responseHookError)(response).trigger(error => error, result => {
    expect(result).toEqual(response);
    expect(head).toEqual({});
    expect(end).toEqual('');
    expect(loggerConfiguration.getLog()).toBe('ERROR: I failed :(');
    done();
  });
});*/