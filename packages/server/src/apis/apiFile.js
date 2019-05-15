import {Either, isEqual} from '@7urtle/lambda';
import fs from 'fs';
import mimeTypes from 'mime-types';

/**
 * fileExists :: string -> object -> Either
 *
 * fileExists outputs Either of input request if file exists on input path or Either.Left of 404 if it does not.
 */
const fileExists = path => request => fs.existsSync(path) ? Either.Right(request) : Either.Left(404);


/**
 * getResponse :: string -> object -> object
 *
 * getResponse outputs response object based on input file path.
 */
const getResponse = path => request => ({
  status: 200,
  file: isEqual('get')(request.method) ? path : '',
  contentType: mimeTypes.lookup(path) || 'application/octet-stream',
  contentLength: fs.statSync(path).size
});

/**
 * apiFile :: string -> object
 *
 * apiFile outputs api object with get call that outputs response object based on input file path.
 */
const apiFile = path => ({
  get: request => Either
  .of(request)
  .flatMap(fileExists(path))
  .map(getResponse(path))
});

export default apiFile;

export {
  fileExists,
  getResponse
};