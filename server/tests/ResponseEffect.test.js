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
    contentLength: 7
  };
  expect(lib.getHeaders(response2)).toEqual({'content-type': 'application/json', 'content-length': 7});
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

test('streamFile triggers read data stream side effect streaming response.file and outputs Right(responseHook) on success.', () => {
  const response = {
    file: './tests/mocks/static.html'
  };
  const result = lib.streamFile(response)(responseHook);
  expect(result.isRight()).toEqual(true);
  expect(result.value).toEqual(responseHook);
});

test('streamFile triggers read data stream side effect streaming response.file and outputs Left(string) on fail.', () => {
  const response = {
    file: './idontexist.html'
  };
  const result = lib.streamFile(response)(responseHook);
  expect(result.isLeft()).toEqual(true);
  expect(result.value).toEqual('File does not exist.');
});

test('sendOrStream outputs Either calling streamFile or sendContent depending on whether response.file is just.', () => {
  const result = lib.sendOrStream(response)(responseHook);
  expect(result.isRight()).toEqual(true);
  expect(result.value).toEqual(responseHook);
  expect(end).toEqual('Not Found');

  const response2 = {
    file: './idontexist.html'
  };
  const result2 = lib.sendOrStream(response2)(responseHook);
  expect(result2.isLeft()).toEqual(true);
  expect(result2.value).toEqual('File does not exist.');

  const response3 = {
    file: '',
    content: 'Not Found Again'
  };
  const result3 = lib.sendOrStream(response3)(responseHook);
  expect(result3.isRight()).toEqual(true);
  expect(result3.value).toEqual(responseHook);
  expect(end).toEqual('Not Found Again');
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