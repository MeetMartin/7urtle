export let head = {};
export let end = '';

const responseHook = {
  writeHead(status, headers) {
    head = {
      status: status,
      headers: headers
    };
  },
  end(content) {
    end = content;
  },
  on() {},
  once() {},
  emit() {},
  write() {}
};

export const responseHookError = {
  writeHead() {
    head = {};
    end = '';
    throw Error('I failed :(');
  },
  end() {
    end = '';
    throw Error('I failed :(');
  }
};

export default responseHook;