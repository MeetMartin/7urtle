import Server, * as lib from '../src/Server';
import {requestHookPost} from './mocks/requestHook';
import responseHook from './mocks/responseHook';
import configuration from './mocks/configuration';
import request from 'supertest';

test('onRequest triggers function for resolving request once request object is created.', done => {
  lib.onRequest(configuration)(() => null, a => b => request => {
    expect(request).toEqual({"data": {"first": "tort", "second": "oise"}, "method": "post", "path": "/"});
    done();
  })(requestHookPost, responseHook);
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