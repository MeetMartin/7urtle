import {isEqual} from "@7urtle/lambda";

const onFunction = (event, fn) => isEqual(event)('end') ? fn() : null;

const requestHook = {
  url: '/path',
  method: 'GET',
  data: undefined,
  on: onFunction
};

export const requestHook404 = {
  url: '/404',
  method: 'POST',
  data: undefined,
  on: onFunction
};

export const requestHookError = {
  url: '/',
  method: 'POST',
  data: undefined,
  on: onFunction
};

export const requestHookException = {
  url: '/',
  method: 'PATCH',
  data: undefined,
  on: onFunction
};

export const requestHookPost = {
  url: '/',
  method: 'POST',
  data: 'first=tort&second=oise',
  on: (event, fn) =>
    isEqual(event)('end') ? fn() :
      isEqual(event)('data') ? fn('first=tort&second=oise') : null
};

export default requestHook;