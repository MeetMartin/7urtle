import createLogger from "@7urtle/logger";
import loggerConfiguration from "./loggerConfiguration";
import apiError from "../../src/apis/apiError";
import {AsyncEffect} from "@7urtle/lambda";

const apiRoot = {
  post: () => AsyncEffect.of((reject, _) => reject(501)),
  patch: () => AsyncEffect.of((_, resolve) => throw Error('I am a sad tortoise :(')),
  any: request =>
    AsyncEffect.of((_, resolve) => resolve({
      ...request,
      status: 200,
      contentType: 'text/plain',
      content: 'any root result'
    }))
};

const apiPath = {
  get: request =>
    AsyncEffect.of((_, resolve) => resolve({
      ...request,
      status: 200,
      contentType: 'text/plain',
      content: 'get path result'
    })),
  any: request =>
    AsyncEffect.of((_, resolve) => resolve({
      ...request,
      status: 200,
      contentType: 'text/plain',
      content: 'any path result'
    }))
};

const apiStar = {
  any: request =>
    AsyncEffect.of((_, resolve) => resolve({
      ...request,
      status: 200,
      contentType: 'text/plain',
      content: 'I am a star'
    }))
};

const apiPost = {
  post: request =>
    AsyncEffect.of((_, resolve) => resolve({
      ...request,
      status: 200,
      contentType: 'application/json',
      content: JSON.stringify(request.data)
    }))
};

const apiFile = path => ({
  any: request =>
    AsyncEffect.of((_, resolve) => resolve({
      ...request,
      status: 200,
      file: path,
      contentType: 'text/htnl',
      contentLength: 25
    }))
});

const configuration = {
  options: {
    port: 3000
  },
  logger: createLogger(loggerConfiguration),
  apiError: apiError,
  routes: [
    {
      path: '/',
      api: apiRoot
    },
    {
      path: '/path',
      api: apiPath
    },
    {
      path: '/star/*',
      api: apiStar
    },
    {
      path: '/post',
      api: apiPost
    },
    {
      path: '/file.html',
      api: apiFile('./tests/mocks/static.html')
    }
  ],
};

const configurationWithListeners = {
  listeners: {
    request: (request, response) => response.end('Turtles are awesome!'),
    error: () => 'error',
    listening: () => 'listening'
  },
  ...configuration
};

const request = {configuration: configuration};
const response = {
  configuration: configuration,
  status: 404,
  contentType: 'text/plain',
  content: 'Not Found'
};

export {
  configuration,
  configurationWithListeners,
  request,
  response
};