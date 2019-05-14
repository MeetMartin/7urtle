import request from 'supertest';
import server, {apiFile} from '../src/index';
import configuration from './mocks/configuration';

// TODO: test what happens if port is blocked
// TODO: test content-length and other headers

test('Server works even without passing configuration or routes.', async () => {
  const app = server.start();

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
  configuration.port = 334;
  configuration.routes.push({
    path: '/static.html',
    api: apiFile('./tests/mocks/static.html')
  });
  const app = server.start(configuration);

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

  const response5 = await request(app).get('/static.html');
  expect(response5.status).toEqual(200);
  expect(response5.headers['content-type']).toEqual('text/html');
  expect(response5.text).toEqual('<html>hello world!</html>');
});