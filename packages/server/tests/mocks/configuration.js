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

const apiPost = {
  post(request) {
    return Either.Right({
      status: 200,
      contentType: 'application/json',
      content: JSON.stringify(request.data)
    });
  }
};

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

const apiFile = path => ({
  any() {
    return Either.Right({
      status: 200,
      file: path,
      contentType: 'text/html',
      contentLength: 25
    });
  }
});

const apiStar = {
  any() {
    return Either.Right({
      status: 200,
      contentType: 'text/plain',
      content: 'I am a star'
    });
  }
};

const configuration = {
  port: 333,
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
    },
    {
      path: '/file',
      api: apiFile('./tests/mocks/static.html')
    },
    {
      path: '/star/*',
      api: apiStar
    }
  ],
  404: api404,
  error: apiError
};

export default configuration;