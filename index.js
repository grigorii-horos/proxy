import anyproxy from 'anyproxy';
import crypto from 'crypto';
import fs from 'fs';

import { promisify } from 'util';

import lowercaseKeys from 'lowercase-keys';
import { pipeCompress } from './pipes/compress.js';
import { pipeHeadersClean } from './pipes/headersClean.js';
import { pipeImage } from './pipes/image.js';
import { pipeHtmlMin } from './pipes/htmlMin.js';
import { pipeLosslessImage } from './pipes/losslessImage.js';
import { pipeCache } from './pipes/cache.js';
import blockUrls from './blockUrls.js';
import { pipeSaveToCache } from './pipes/saveToCache.js';
import { pipeSvg } from './pipes/svg.js';
import { pipeLovercaseHeader } from './pipes/lovercaseHeaders.js';

const fsExistsAsync = promisify(fs.exists);

const readFile = promisify(fs.readFile);

const options = {
  port: 8001,
  rule: {
    summary: 'a rule to hack response',
    async beforeSendRequest(requestDetail) {
      if (
        blockUrls.filter((url) => requestDetail.requestOptions.hostname.startsWith(url)).length > 0
      ) {
        return {
          response: {
            statusCode: 404,
            header: {
              'content-type': 'text/plain',
            },
            body: 'Not Found',
          },
        };
      }

      if (requestDetail.requestOptions.method !== 'GET') {
        return requestDetail;
      }

      const headers = lowercaseKeys(requestDetail.header || {});

      const hashFile = crypto.createHash('sha1').update(requestDetail.url).digest('hex');

      const cacheFile = `/home/grisa/.caa/${hashFile}`;

      if (await fsExistsAsync(cacheFile)) {
        const [contentType, contentEncoding] = (await readFile(`${cacheFile}.meta`)).toString().split('\n');
        console.log('File in cache', cacheFile);

        if (headers['if-none-match'] && `"${hashFile}"` === headers['if-none-match']) {
          console.log('ETag detect');
          return {
            response: {
              statusCode: 304,
              body: '',
            },
          };
        }

        return {
          response: {
            statusCode: 200,
            header: {
              'content-type': contentType,
              'content-encoding': contentEncoding,
              'cache-control': 'public, immutable, max-age=31536000',
              expires: 'Sun, 03 Mar 2052 11:42:45 GMT',
              etag: `"${hashFile}"`,
            },
            body: await readFile(cacheFile),
          },
        };
      }

      return requestDetail;
    },

    async beforeSendResponse(requestDetail, responseDetail) {
      let newResponse = responseDetail.response;

      newResponse = await pipeLovercaseHeader(newResponse, requestDetail);
      newResponse = await pipeHeadersClean(newResponse, requestDetail);
      newResponse = await pipeImage(newResponse, requestDetail);
      newResponse = await pipeLosslessImage(newResponse, requestDetail);

      newResponse = await pipeSvg(newResponse, requestDetail);
      newResponse = await pipeHtmlMin(newResponse, requestDetail);

      newResponse = await pipeCompress(newResponse, requestDetail);
      newResponse = await pipeSaveToCache(newResponse, requestDetail);
      newResponse = await pipeCache(newResponse, requestDetail);

      return { response: newResponse };
    },
  },
  webInterface: {
    enable: true,
    webPort: 8002,
  },
  throttle: 0,
  forceProxyHttps: true,
  wsIntercept: false,
  silent: true,
};
const proxyServer = new anyproxy.ProxyServer(options);

proxyServer.on('ready', () => {
  /* */
});
proxyServer.on('error', (e) => {
  console.log(e);
  /* */
});
proxyServer.start();
