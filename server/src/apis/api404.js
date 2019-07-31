import {Either} from '@7urtle/lambda';

const any = request => Either.Right({
  status: 404,
  contentType: 'text/plain',
  content: 'Not Found'
});

export default {any};