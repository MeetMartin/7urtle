import http from 'http';
import {AsyncEffect, isNumber, isUndefined, compose} from '@7urtle/lambda';

const addStatusContent = request =>
  isNumber(request.status)
    ? ({
      ...request,
      content: http.STATUS_CODES[request.status]
    })
    : request.configuration.logger.warn('HTTP status was not provided or it is not a number. 500 status used.')
    && ({
      ...request,
      status: 500,
      content: 'Internal Server Error'
    });

const undefinedContentTo500 = request =>
  isUndefined(request.content)
    ? request.configuration.logger.warn('Unknown HTTP status code number provided to apiError. 500 status used.')
    && ({
      ...request,
      status: 500,
      content: 'Internal Server Error'
    })
    : request;

const createApiEffect = request =>
  AsyncEffect.of(
    async (_, resolve) => resolve({
      ...request,
      contentType: 'text/plain'
    })
  );

const any = compose(createApiEffect, undefinedContentTo500, addStatusContent);

export default {any};