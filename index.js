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

const fsExistsAsync = promisify(fs.exists);

const readFile = promisify(fs.readFile);

const options = {
  port: 8001,
  rule: {
    summary: 'a rule to hack response',
    async beforeSendRequest(requestDetail) {
      if (blockUrls.filter((url) => requestDetail.url.startsWith(`https://${url}`)).length || blockUrls.filter((url) => requestDetail.url.startsWith(`http://${url}`)).length) {
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

      const cacheFile = `/home/grisa/.caa/${xxhash.hash(
        Buffer.from(requestDetail.url),
        0xCAFEBABE,
      )}`;

      if (await fsExistsAsync(cacheFile)) {
        console.log('Get file from cache ');
        const [contentType, contentEncoding] = (await readFile(`${cacheFile}.meta`)).toString().split('\n');

        return {
          response: {
            statusCode: 200,
            header: {
              'Content-Type': contentType,
              'Content-Encoding': contentEncoding,
              'Cache-Control': 'public, immutable, max-age=31536000',
              Expires: 'Sun, 03 Mar 2052 11:42:45 GMT',
            },
            body: await readFile(cacheFile),
          },
        };
      }

      // console.log('Download file ');

      return requestDetail;
    },

    async beforeSendResponse(requestDetail, responseDetail) {
      let newResponse = responseDetail.response;
      // console.log(' ------------- ');
      // console.log('Request Url', requestDetail.url);
      // console.log('Request Header', requestDetail.requestOptions.headers);
      // console.log('Response Header', Object.keys(newResponse));
      // console.log(' ------------- ');

      newResponse = await pipeHeadersClean(newResponse, requestDetail);
      newResponse = await pipeImage(newResponse, requestDetail);
      newResponse = await pipeLosslessImage(newResponse, requestDetail);

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
