import {AsyncEffect, isEqual} from '@7urtle/lambda';
import fs from "fs";
import mimeTypes from "mime-types";

/**
 * apiFile :: string -> object
 *
 * apiFile outputs api object with get call that outputs response object based on input file path.
 */
const apiFile = path => ({
  get: request =>
    AsyncEffect.of(
      async (reject, resolve) =>
        fs.existsSync(path)
          ? resolve({
            ...request,
            status: 200,
            file: isEqual('get')(request.method) ? path : '',
            contentType: mimeTypes.lookup(path) || 'application/octet-stream',
            contentLength: fs.statSync(path).size
          })
          : reject(404)
    )
});

export default apiFile;