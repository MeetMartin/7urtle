import Server, * as lib from '../src/Server';
import requestHook, {requestHook404, requestHookError, requestHookException} from './mocks/requestHook';
import responseHook, {head, end, responseHookError} from './mocks/responseHook';
import configuration from './mocks/configuration';
import request from 'supertest';

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

test('requestListener reqisters onRequest handler to request listener and outputs Server.', () => {
  expect(
    lib.requestListener(configuration)({on: (eventName, callback) => eventName + ': ' + callback.toString()})
      .startsWith('request: function (requestHook, responseHook)')
  ).toEqual(true);
});

test('listen calls input Server listen function passing it configuration.port and outputs Server.', () => {
  expect(lib.listen(configuration)({listen: port => 'port: ' + port})).toEqual('port: 333');
});


test('Server outputs results based on configuration.', async () => {
  configuration.port = 333;
  const app = Server(configuration).trigger();

  const response1 = await request(app).get('/');
  expect(response1.status).toEqual(200);
  expect(response1.headers['content-type']).toEqual('text/plain');
  expect(response1.text).toEqual('any root result');

  const response2 = await request(app).get('/anything');
  expect(response2.status).toEqual(404);
  expect(response1.headers['content-type']).toEqual('text/plain');
  expect(response2.text).toEqual('Not Found');

  const response3 = await request(app).post('/');
  expect(response3.status).toEqual(500);
  expect(response3.headers['content-type']).toEqual('text/plain');
  expect(response3.text).toEqual('Internal Server Error');

  const response4 = await request(app).patch('/');
  expect(response4.status).toEqual(500);
  expect(response4.headers['content-type']).toEqual('text/plain');
  expect(response4.text).toEqual('Internal Server Error');

  const response5 = await request(app).get('/file');
  expect(response5.status).toEqual(200);
  expect(response5.headers['content-type']).toEqual('text/html');
  expect(response5.text).toEqual('<html>hello world!</html>');
});