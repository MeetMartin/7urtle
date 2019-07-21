import RequestEffect, * as lib from '../src/RequestEffect';
import requestHook, {requestHookPost} from './mocks/requestHook';

test('getRequestObject extracts request data from input requestHook and outputs request object.', () => {
  expect(lib.getRequestObject(requestHook)).toEqual({
    path: '/path',
    method: 'get',
    data: undefined
  });
  expect(lib.getRequestObject(requestHookPost)).toEqual({
    path: '/',
    method: 'post',
    data: {first: "tort", second: "oise"}
  });
});

test('RequestEffect(object).trigger(d -> e, f -> g) for GET requestHook returns correct request object.', done => {
  RequestEffect(requestHook).trigger(error => error, result => {
    expect(result).toEqual({"data": undefined, "method": "get", "path": "/path"});
    done();
  });
});

test('RequestEffect(object).trigger(d -> e, f -> g) for POST requestHook returns correct request object including data.', done => {
  requestHookPost.data = undefined;
  RequestEffect(requestHookPost).trigger(error => error, result => {
    expect(result).toEqual({"data": {"first": "tort", "second": "oise"}, "method": "post", "path": "/"});
    done();
  });
});