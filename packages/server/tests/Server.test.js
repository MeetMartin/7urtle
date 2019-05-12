import Server, * as lib from '../src/Server';
import requestHook, {requestHook404, requestHookError, requestHookException} from './mocks/requestHook';
import responseHook, {head, end, responseHookError} from './mocks/responseHook';
import configuration from './mocks/configuration';

test('getRequest extracts request data from input requestHook and outputs request object.', () => {
  expect(lib.getRequest(requestHook)).toEqual({
    path: '/path',
    method: 'get'
  });
  expect(lib.getRequest(requestHook404)).toEqual({
    path: '/404',
    method: 'post'
  });
});

test('getResponse outputs response object depending on input configuration and requestHook.', () => {
  expect(lib.getResponse(configuration)(requestHook)).toEqual({
    status: 200,
    contentType: 'text/plain',
    content: 'get path result'
  });
  expect(lib.getResponse(configuration)(requestHook404)).toEqual({
    status: 404,
    contentType: 'text/plain',
    content: 'Not Found'
  });
  expect(lib.getResponse(configuration)(requestHookError)).toEqual({
    status: 500,
    contentType: 'text/plain',
    content: 'Internal Server Error'
  });
  expect(lib.getResponse(configuration)(requestHookException)).toEqual({
    status: 500,
    contentType: 'text/plain',
    content: 'Internal Server Error'
  });
});

test('onRequest outputs responseHook executing ResponseEffect side effect based on input configuration, requestHook and responseHook.', () => {
  const result1 = lib.onRequest(configuration)(requestHook, responseHook);
  expect(result1.isRight()).toEqual(true);
  expect(result1.value).toEqual(responseHook);
  expect(head).toEqual({status: 200, headers: {'content-type': 'text/plain', 'content-length': 15}});
  expect(end).toEqual('get path result');

  const result2 = lib.onRequest(configuration)(requestHook404, responseHook);
  expect(result2.isRight()).toEqual(true);
  expect(result2.value).toEqual(responseHook);
  expect(head).toEqual({status: 404, headers: {'content-type': 'text/plain', 'content-length': 9}});
  expect(end).toEqual('Not Found');

  const result3 = lib.onRequest(configuration)(requestHook, responseHookError);
  expect(result3.isLeft()).toEqual(true);
  expect(result3.value).toEqual('I failed :(');
  expect(head).toEqual({});
  expect(end).toEqual('');
});