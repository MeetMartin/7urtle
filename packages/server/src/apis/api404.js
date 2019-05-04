import {Either} from '@7urtle/lambda';

const any = request => Either.Right({
  status: 404,
  contentType: 'text/plain', //res.writeHead(200, { 'Content-Type': 'text/plain' });
  content: 'Not Found'
});

export default {any};