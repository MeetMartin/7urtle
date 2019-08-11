import createLogger from "@7urtle/logger";
import Server from "./Server";
import apiError from "./apis/apiError";
import apiFile from "./apis/apiFile";

const defaultConfiguration = {
  options: {
    port: process.env.port || 3000
  },
  logger: createLogger(),
  routes: [],
  apiError: apiError,
};

const start = configuration =>
  Server.create({
    ...defaultConfiguration,
    ...configuration
  });

export default {start};

export {apiFile};