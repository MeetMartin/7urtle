import request from 'supertest';
import http from "http";
import Server, * as lib from '../src/Server';
import loggerConfiguration from './mocks/loggerConfiguration';
import {configuration, configurationWithListeners} from './mocks/configuration';
import responseHook, {end, head} from './mocks/responseHook';
import requestHook from "./mocks/requestHook";
import createLogger from "@7urtle/logger";

let server = null;
let server2 = null;

afterEach(() => {
  if(server instanceof http.Server) {
    server.close();
    server = null;
  }
  if(server2 instanceof http.Server) {
    server2.close();
    server2 = null;
  }
});

test('getServer outputs http.Server instance.', () => {
  server = lib.getServer(configurationWithListeners);

  expect(server instanceof http.Server).toEqual(true);
});

test('getServer listens.', done => {
  const configuration2 = {
    ...configurationWithListeners,
    listeners: {
      ...configurationWithListeners.listeners,
      listening: () => {
        done();
      }
    }
  };
  server = lib.getServer(configuration2);
  request(server).get('/');
});

test('getServer listens for requests.', async () => {
  server = lib.getServer(configurationWithListeners);

  const response = await request(server).get('/');
  expect(response.text).toEqual('Turtles are awesome!');
});

test('getServer listens for errors.', done => {
  const configuration2 = {
    ...configurationWithListeners,
    listeners: {
      ...configurationWithListeners.listeners,
      error: error => {
        expect(error.code).toBe('EADDRINUSE');
        done();
      }
    }
  };
  server = lib.getServer(configuration2);
  request(server).get('/');
  server2 = lib.getServer(configuration2);
  request(server2).get('/');
});

test('create adds listeners to configuration and creates a listening http.Server.', async () => {
  const configuration2 = {
    options: {
      port: 3000
    },
    apiError: configuration.apiError,
    logger: createLogger(loggerConfiguration),
    routes: configuration.routes
  };

  server = Server.create(configuration2);
  expect(server instanceof http.Server).toEqual(true);

  const response = await request(server).get('/');
  expect(response.status).toEqual(200);
  expect(response.headers['content-type']).toEqual('text/plain');
  expect(response.text).toEqual('any root result');
});

test('addListeners adds listener functions for request, error, and listening to provided configuration if not predefined.', () => {
  const configuration2 = lib.addListeners({});
  expect(
    configuration2.listeners &&
    configuration2.listeners.request &&
    configuration2.listeners.error &&
    configuration2.listeners.listening
  ).toBeTruthy();

  const configuration3 = lib.addListeners(configuration);
  expect(
    configuration3.listeners &&
    configuration3.listeners.request &&
    configuration3.listeners.error &&
    configuration3.listeners.listening
  ).toBeTruthy();
  expect(configuration3.listeners.listening()).toBe('Server is listening on port 3000.');
});

test('listeningListener uses logger provided in input configuration object to log listening event.', () => {
  expect(lib.listeningListener(configuration)()).toBe('Server is listening on port 3000.');
  expect(loggerConfiguration.getLog()).toBe('INFO: Server is listening on port 3000.');
});

test('errorListener uses logger provided in input configuration object to log error listening event error object.', () => {
  expect(lib.errorListener(configuration)('I am sad :(')).toBe('I am sad :(');
  expect(loggerConfiguration.getLog()).toBe('ERROR: I am sad :(');
  expect(lib.errorListener(configuration)(new Error('I am bad :('))).toBe('I am bad :(');
  expect(loggerConfiguration.getLog()).toBe('ERROR: I am bad :(');
  expect(lib.errorListener(configuration)({code: 'ERR_BUFFER_OUT_OF_BOUNDS'})).toBe('ERR_BUFFER_OUT_OF_BOUNDS');
  expect(loggerConfiguration.getLog()).toBe('ERROR: ERR_BUFFER_OUT_OF_BOUNDS');
  expect(lib.errorListener(configuration)({code: 'EADDRINUSE'})).toBe('Port 3000 is already in use. Server cannot start.');
  expect(loggerConfiguration.getLog()).toBe('ERROR: Port 3000 is already in use. Server cannot start.');
});

test('respondToError responds using ResponseHook to errors rejected during request processing.', () => {
  lib.respondToError(responseHook)(configuration)(501);
  expect(loggerConfiguration.getLog()).toBe('ERROR: Server request API processing failed with status: 501.');
  expect(head).toEqual({
    "headers": {
      "content-length": 15, "content-type": "text/plain"
    },
    "status": 501
  });
  expect(end).toBe('Not Implemented');
  lib.respondToError(responseHook)(configuration)('I am inevitable!');
  expect(loggerConfiguration.getLog()).toBe('ERROR: Server request processing failed with error: \'I am inevitable!\'.');
  expect(head).toEqual({
    "headers": {
      "content-length": 21, "content-type": "text/plain"
    },
    "status": 500
  });
  expect(end).toBe('Internal Server Error');
});

test('respondWithApiError triggers AsyncEffect of apiError for input status and logs potential error.', () => {
  lib.respondWithApiError(configuration)(responseHook)(501);
  expect(head).toEqual({
    "headers": {
      "content-length": 15, "content-type": "text/plain"
    },
    "status": 501
  });
  expect(end).toBe('Not Implemented');
});

test('requestListener uses configuration to resolve request from requestHook by sending response using responseHook.', () => {
  lib.requestListener(configuration)(requestHook, responseHook);
  expect(head).toEqual({
    "headers": {
      "content-length": 15, "content-type": "text/plain"
    },
    "status": 200
  });
  expect(end).toBe('get path result');
});