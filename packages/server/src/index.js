import Server from "./Server";
import api404 from "./apis/api404";
import apiError from "./apis/apiError";
import apiFile from './apis/apiFile';

const defaultConfiguration = {
  port: process.env.port || 3000,
  routes: [],
  404: api404,
  error: apiError
};

const start = configuration =>
  Server({
    ...defaultConfiguration,
    ...configuration
  })
  .trigger();

export default {start};

export {
  apiFile
};