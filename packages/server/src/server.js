import http from 'http';
import {passThrough, SyncEffect} from '@7urtle/lambda';
import api404 from './apis/api404';

const defaultConfiguration = {
  port: process.env.port || 3000
};

const defaultRoutes = {
    routes: [],
    404: api404
};

const sendHead = status => headers => responseHook => passThrough(responseHook => responseHook.writeHead(status, headers))(responseHook);
const sendContent = content => responseHook => responseHook.end(content);

const getRequest = requestHook => ({
    path: requestHook.url,
    method: requestHook.method
});

const getResponse = request => api404.any(request).value;

const getHeaders = response => ({
  'content-type': response.contentType || 'text/plain'
});

const respond = responseHook => response =>
  SyncEffect
      .wrap(responseHook)
      .map(sendHead(response.status)(getHeaders(response)))
      .map(sendContent(response.content + '\n'))
      .trigger();

const processRequest = configuration => routes => (requestHook, responseHook) =>
  respond(responseHook)(getResponse(getRequest(requestHook)));

const requestProcessing = configuration => routes => Server => Server.on('request', processRequest(configuration)(routes));

const listen = port => Server => Server.listen(port);

const Server = SyncEffect.of(http.createServer);

const trigger = configuration => routes =>
  Server
    .map(requestProcessing(configuration)(routes))
    .map(listen(configuration.port))
    .trigger();

const start = configuration => routes =>
  trigger({
    ...defaultConfiguration,
    ...configuration
  })({
    ...defaultRoutes,
    ...routes
  });

export default {start};