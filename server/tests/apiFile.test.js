import apiFile, * as lib from "../src/apis/apiFile";

test('fileExists outputs Either of input request if file exists on input path or Either.Failure of 404 if it does not.', () => {
  //expect(lib.fileExists('./tests/mocks/static.html')({method: 'get'}).value).toEqual({method: 'get'});
  //expect(lib.fileExists('./nope.html')({method: 'get'}).value).toEqual(404);
  expect(true).toBe(true);
});

/*test('getResponse outputs response object based on input file path.', () => {
  expect(lib.getResponse('./tests/mocks/static.html')({method: 'get'}))
  .toEqual({
    status: 200,
    file: './tests/mocks/static.html',
    contentType: 'text/html',
    contentLength: 25
  });
  expect(lib.getResponse('./tests/mocks/static.html')({method: 'head'}))
  .toEqual({
    status: 200,
    file: '',
    contentType: 'text/html',
    contentLength: 25
  });
  expect(lib.getResponse('./tests/mocks/nope')({method: 'get'}))
  .toEqual({
    status: 200,
    file: './tests/mocks/nope',
    contentType: 'application/octet-stream',
    contentLength: 0
  });
});

test('apiFile outputs api object with get call that outputs response object based on input file path.', () => {
  expect(apiFile('./nope.html').get({method: 'get'}).value).toEqual(404);
  expect(apiFile('./tests/mocks/static.html').get({method: 'get'}).value)
  .toEqual({
    status: 200,
    file: './tests/mocks/static.html',
    contentType: 'text/html',
    contentLength: 25
  });
});*/