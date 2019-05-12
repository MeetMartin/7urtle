import ResponseEffect, * as lib from '../src/ResponseEffect';
import responseHook, {end, head, responseHookError} from './mocks/responseHook';

const response = {
  status: 404,
  contentType: 'text/plain',
  content: 'Not Found'
};

test('getHeaders creates headers object out of response object.', () => {
  expect(lib.getHeaders(response)).toEqual({'content-type': 'text/plain', 'content-length': 9});
  const response2 = {
    contentType: 'application/json',
    content: 'Fail'
  };
  expect(lib.getHeaders(response2)).toEqual({'content-type': 'application/json', 'content-length': 4});
});

test('getHeaders uses text/plain content type if content-type is not specified.', () => {
  const response = {
    content: 'Success'
  };
  expect(lib.getHeaders(response)).toEqual({'content-type': 'text/plain', 'content-length': 7});
});

test('sendHead triggers responseHook.writeHead side effect and outputs Right(responseHook) on success.', () => {
  const result = lib.sendHead(response)(responseHook);
  expect(result.isRight()).toEqual(true);
  expect(result.value).toEqual(responseHook);
  expect(head).toEqual({status: 404, headers: {'content-type': 'text/plain', 'content-length': 9}});
});

test('sendHead triggers responseHook.writeHead side effect and outputs Left(string) on fail.', () => {
  const result = lib.sendHead(response)(responseHookError);
  expect(result.isLeft()).toEqual(true);
  expect(result.value).toEqual('I failed :(');
});

test('sendHead uses 200 as response status if no status is specified in the input response object.', () => {
  const response = {
    contentType: 'text/plain',
    content: 'Not Found'
  };
  const result = lib.sendHead(response)(responseHook);
  expect(result.isRight()).toEqual(true);
  expect(result.value).toEqual(responseHook);
  expect(head).toEqual({status: 200, headers: {'content-type': 'text/plain', 'content-length': 9}});
});

test('sendContent triggers responseHook.end side effect and outputs Right(responseHook) on success.', () => {
  const result = lib.sendContent(response)(responseHook);
  expect(result.isRight()).toEqual(true);
  expect(result.value).toEqual(responseHook);
  expect(end).toEqual('Not Found');
});

test('sendContent triggers responseHook.end side effect and outputs Left(string) on fail.', () => {
  const result = lib.sendContent(response)(responseHookError);
  expect(result.isLeft()).toEqual(true);
  expect(result.value).toEqual('I failed :(');
});

test('ResponseEffect outputs SyncEffect which can trigger side effects responseHook.writeHead and responseHook.end outputting Right(responseHook) on success.', () => {
  const result = ResponseEffect(responseHook)(response).trigger();
  expect(result.isRight()).toEqual(true);
  expect(result.value).toEqual(responseHook);
  expect(head).toEqual({status: 404, headers: {'content-type': 'text/plain', 'content-length': 9}});
  expect(end).toEqual('Not Found');
});

test('ResponseEffect outputs SyncEffect which can trigger side effects responseHook.writeHead and responseHook.end outputting Left(error) on fail.', () => {
  const result = ResponseEffect(responseHookError)(response).trigger();
  expect(result.isLeft()).toEqual(true);
  expect(result.value).toEqual('I failed :(');
  expect(head).toEqual({});
  expect(end).toEqual('');
});