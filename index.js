import anyproxy from 'anyproxy';
import xxhash from 'xxhash';
import fs from 'fs';

import { promisify } from 'util';

import { pipeCompress } from './pipes/compress.js';
import { pipeHeadersClean } from './pipes/headersClean.js';
import { pipeImage } from './pipes/image.js';
import { pipeHtmlMin } from './pipes/htmlMin.js';
import { pipeLosslessImage } from './pipes/losslessImage.js';
import { pipeCache } from './pipes/cache.js';
import blockUrls from './blockUrls.js';
import { pipeSaveToCache } from './pipes/saveToCache.js';
import { pipeSvg } from './pipes/svg.js';

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
              'Content-Type': 'text/plain',
            },
            body: 'Not Found',
          },
        };
      }

      if (requestDetail.requestOptions.method !== 'GET') {
        return requestDetail;
      }

      const hashFile = xxhash.hash(
        Buffer.from(requestDetail.url),
        0xCAFEBABE,
      );

      const cacheFile = `/home/grisa/.caa/${hashFile}`;

      if (await fsExistsAsync(cacheFile)) {
        const [contentType, contentEncoding] = (await readFile(`${cacheFile}.meta`)).toString().split('\n');
        console.log('File in cache', cacheFile);

        if (requestDetail && requestDetail.header && requestDetail.header['If-None-Match']) {
          console.log(requestDetail.header['If-None-Match']);
        }
        if (requestDetail.header && requestDetail.header['If-None-Match'] && `"${hashFile}"` === requestDetail?.header['If-None-Match']) {
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
              'Content-Type': contentType,
              'Content-Encoding': contentEncoding,
              'Cache-Control': 'public, immutable, max-age=31536000',
              Expires: 'Sun, 03 Mar 2052 11:42:45 GMT',
              ETag: `"${hashFile}"`,
            },
            body: await readFile(cacheFile),
          },
        };
      }

      return requestDetail;
    },

    async beforeSendResponse(requestDetail, responseDetail) {
      let newResponse = responseDetail.response;

      newResponse = await pipeHeadersClean(newResponse, requestDetail);
      newResponse = await pipeImage(newResponse, requestDetail);
      newResponse = await pipeLosslessImage(newResponse, requestDetail);

      // newResponse = await pipeSvg(newResponse, requestDetail);
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
  /* */
});
proxyServer.start();
