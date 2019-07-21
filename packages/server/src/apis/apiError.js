import {Either} from '@7urtle/lambda';

const any = request => Either.Right({
  status: 500,
  contentType: 'text/plain',
  content: 'Internal Server Error'
});

export default {any};