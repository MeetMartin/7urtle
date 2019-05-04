import request from 'supertest';
import server from '../src/server';

let app;

afterEach(() => {
  app.close();
});

// TODO: test what happens if port is blocked

test('Server works even without passing configuration or routes.', async () => {
  app = server.start()();

  const response1 = await request(app).get('/');
  expect(response1.status).toEqual(404);
  expect(response1.headers['content-type']).toEqual('text/plain');
  expect(response1.text).toEqual('Not Found\n');

  const response2 = await request(app).get('/anything');
  expect(response2.status).toEqual(404);
  expect(response1.headers['content-type']).toEqual('text/plain');
  expect(response2.text).toEqual('Not Found\n');
});