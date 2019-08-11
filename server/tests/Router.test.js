import {AsyncEffect, identity} from "@7urtle/lambda";
import Router, * as lib from "../src/Router";
import {configuration, request} from "./mocks/configuration";

test('checkRoute outputs true if inputs path and route.path match.', () => {
  expect(lib.checkRoute('/path')(configuration.routes[1])).toEqual(true);
  expect(lib.checkRoute('/path')({path: '/paths'})).toEqual(false);
  expect(lib.checkRoute('/')({path: '/paths'})).toEqual(false);
});

test('checkRoute supports /* routes.', () => {
  expect(lib.checkRoute('/star/something')({path: '/star/*'})).toEqual(true);
});

test('MaybeRoute outputs Maybe of route found in input request or Maybe of Nothing if route is not found.', () => {
  const MaybeRouteJust = lib.MaybeRoute({
    ...request,
    path: '/path'
  });
  expect(MaybeRouteJust.isJust()).toBe(true);
  expect(MaybeRouteJust.value.api).toBeTruthy();
  expect(MaybeRouteJust.value.path).toBe('/path');

  const MaybeRouteNothing = lib.MaybeRoute({
    ...request,
    path: '/404'
  });
  expect(MaybeRouteNothing.isNothing()).toBe(true);

  const MaybeRouteStar = lib.MaybeRoute({
    ...request,
    path: '/star/something'
  });
  expect(MaybeRouteStar.isJust()).toBe(true);
  expect(MaybeRouteStar.value.api).toBeTruthy();
  expect(MaybeRouteStar.value.path).toBe('/star/*');
});

test('emptyContent maps AsyncEffect evaluating contentLength and making file and content values empty.', done => {
  const ApiEffect =
    AsyncEffect.of((_, resolve) => resolve({
      configuration: 'configuration',
      status: 200,
      file: 'file',
      content: 'content'
    }));
  lib.emptyContent(ApiEffect).trigger(identity, response => {
    expect(response).toEqual({
      configuration: 'configuration',
      contentLength: 7,
      status: 200,
      file: '',
      content: ''
    });
    done();
  });
});

test('getApiEffect outputs AsyncEffect with the response to a request based on a route.', done => {
  Router.getApiEffect({
    ...request,
    path: '/path',
    method: 'get'
  }).trigger(identity, response => {
    expect(response.content).toEqual('get path result');
    done();
  });
});

test('getApiEffect outputs AsyncEffect with the response to a request for root route.', done => {
  Router.getApiEffect({
    ...request,
    path: '/',
    method: 'get'
  }).trigger(identity, response => {
    expect(response.content).toEqual('any root result');
    done();
  });
});

test('getApiEffect if head is not api call it outputs AsyncEffect of api call for get with empty file and content result if get is defined.', done => {
  Router.getApiEffect({
    ...request,
    path: '/path',
    method: 'head'
  }).trigger(identity, response => {
    expect(response.status).toEqual(200);
    expect(response.content).toEqual('');
    expect(response.file).toEqual('');
    expect(response.contentLength).toEqual(15);
    done();
  });
});

test('getApiEffect if head is not api call it outputs AsyncEffect of api call for any with empty file and content result if get is not defined.', done => {
  Router.getApiEffect({
    ...request,
    path: '/star/something',
    method: 'head'
  }).trigger(identity, response => {
    expect(response.status).toEqual(200);
    expect(response.content).toEqual('');
    expect(response.file).toEqual('');
    expect(response.contentLength).toEqual(11);
    done();
  });
});

test('getApiEffect outputs AsyncEffect of api 404 error for head call if head, get and any are not found.', done => {
  Router.getApiEffect({
    ...request,
    path: '/post',
    method: 'head'
  }).trigger(identity, response => {
    expect(response.status).toEqual(404);
    expect(response.content).toEqual('');
    done();
  });
});

test('getApiEffect outputs AsyncEffect of api 404 error call if route is not found.', done => {
  Router.getApiEffect({
    ...request,
    path: '/404',
    method: 'get'
  }).trigger(identity, response => {
    expect(response.status).toEqual(404);
    expect(response.content).toEqual('Not Found');
    done();
  });
});

test('getApiEffect outputs AsyncEffect of api any call if requested method call is not found.', done => {
  Router.getApiEffect({
    ...request,
    path: '/path',
    method: 'post'
  }).trigger(identity, response => {
    expect(response.status).toEqual(200);
    expect(response.content).toEqual('any path result');
    done();
  });
});

test('getApiEffect outputs AsyncEffect of 404 api call if both requested method call and any call are not found.', done => {
  Router.getApiEffect({
    ...request,
    path: '/post',
    method: 'get'
  }).trigger(identity, response => {
    expect(response.status).toEqual(404);
    expect(response.content).toEqual('Not Found');
    done();
  });
});