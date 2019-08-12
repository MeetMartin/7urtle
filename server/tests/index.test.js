import request from 'supertest';
import Server, {apiFile} from '../src/index';
import {configuration} from './mocks/configuration';
import http from "http";

// TODO: test content-length and other headers

let app = null;

afterEach(() => {
  if(app instanceof http.Server) {
    app.close();
    app = null;
  }
});

test('Server works even without passing configuration or routes.', async () => {
  app = Server.start();

  const response1 = await request(app).get('/');
  expect(response1.status).toEqual(404);
  expect(response1.headers['content-type']).toEqual('text/plain');
  expect(response1.text).toEqual('Not Found');

  const response2 = await request(app).get('/anything');
  expect(response2.status).toEqual(404);
  expect(response1.headers['content-type']).toEqual('text/plain');
  expect(response2.text).toEqual('Not Found');
});

test('Server outputs results based on configuration.', async () => {
  app = Server.start(configuration);

  const response = await request(app).get('/');
  expect(response.status).toEqual(200);
  expect(response.headers['content-type']).toEqual('text/plain');
  expect(response.text).toEqual('any root result');
});

test('Server outputs not found based on routing.', async () => {
  app = Server.start(configuration);

  const response = await request(app).get('/anything');
  expect(response.status).toEqual(404);
  expect(response.headers['content-type']).toEqual('text/plain');
  expect(response.text).toEqual('Not Found');
});

test('Server outputs result for post based on routing.', async () => {
  app = Server.start(configuration);

  const response = await request(app).post('/');
  expect(response.status).toEqual(501);
  expect(response.headers['content-type']).toEqual('text/plain');
  expect(response.text).toEqual('Not Implemented');
});

test('Server outputs result for file request based on routing.', async () => {
  const configuration2 = configuration;
  configuration2.routes.push({
    path: '/static.html',
    api: apiFile('./tests/mocks/static.html')
  });

  app = Server.start(configuration2);

  const response = await request(app).get('/static.html');
  expect(response.status).toEqual(200);
  expect(response.headers['content-type']).toEqual('text/html');
  expect(response.text).toEqual('<html>hello world!</html>');
});

test('Server outputs result for file head request based on routing.', async () => {
  const configuration2 = configuration;
  configuration2.routes.push({
    path: '/static.html',
    api: apiFile('./tests/mocks/static.html')
  });

  app = Server.start(configuration2);

  const response = await request(app).head('/static.html');
  expect(response.status).toEqual(200);
  expect(response.headers['content-type']).toEqual('text/html');
  expect(response.headers['content-length']).toEqual('25');
  expect(response.text).toEqual(undefined);
});

test('Server outputs result for head based on routing.', async () => {
  app = Server.start(configuration);

  const response = await request(app).head('/');
  expect(response.status).toEqual(200);
  expect(response.headers['content-type']).toEqual('text/plain');
  expect(response.headers['content-length']).toEqual('15');
  expect(response.text).toEqual(undefined);
});

test('Server outputs result based on star routing.', async () => {
  app = Server.start(configuration);

  const response = await request(app).get('/star/anything');
  expect(response.status).toEqual(200);
  expect(response.headers['content-type']).toEqual('text/plain');
  expect(response.text).toEqual('I am a star');
});

test('Server outputs result for post form request based on routing.', async () => {
  app = Server.start(configuration);

  const response = await request(app).post('/post').send('animal1=turtle&animal2=tortoise');
  expect(response.status).toEqual(200);
  expect(response.headers['content-type']).toEqual('application/json');
  expect(response.text).toEqual('{"animal1":"turtle","animal2":"tortoise"}');
});

test('Server outputs result for post json request based on routing.', async () => {
  app = Server.start(configuration);

  const response = await request(app).post('/post').send('{"animal1":"turtle","animal2":"tortoise"}');
  expect(response.status).toEqual(200);
  expect(response.headers['content-type']).toEqual('application/json');
  expect(response.text).toEqual('{"animal1":"turtle","animal2":"tortoise"}');
});

test('Server outputs result for error api if error is thrown unexpectedly in async api.', async () => {
  app = Server.start(configuration);

  const response = await request(app).patch('/');
  expect(response.status).toEqual(500);
  expect(response.headers['content-type']).toEqual('text/plain');
  expect(response.text).toEqual('Internal Server Error');
});