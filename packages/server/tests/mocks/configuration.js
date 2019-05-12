import {Either} from "@7urtle/lambda";

const apiRoot = {
  post() {
    return Either.Left(500);
  },
  patch() {
    throw Error('I am an error :(');
  },
  any() {
    return Either.Right({
      status: 200,
      contentType: 'text/plain',
      content: 'any root result'
    });
  }
};

const apiPost = {};

const apiPath = {
  get() {
    return Either.Right({
      status: 200,
      contentType: 'text/plain',
      content: 'get path result'
    });
  },
  any() {
    return Either.Right({
      status: 200,
      contentType: 'text/plain',
      content: 'any path result'
    });
  }
};

const api404 = {
  any() {
    return Either.Right({
      status: 404,
      contentType: 'text/plain',
      content: 'Not Found'
    });
  }
};

const apiError = {
  any() {
    return Either.Right({
      status: 500,
      contentType: 'text/plain',
      content: 'Internal Server Error'
    });
  }
};

const configuration = {
  routes: [
    {
      path: '/',
      api: apiRoot
    },
    {
      path: '/path',
      api: apiPath
    },
    {
      path: '/post',
      api: apiPost
    }
  ],
  404: api404,
  error: apiError
};

export default configuration;