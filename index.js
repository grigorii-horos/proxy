import anyproxy from 'anyproxy';
import xxhash from 'xxhash';
import fs from 'fs';

import { promisify } from 'util';

import { pipeBrotli } from './pipes/brotli.js';
import { pipeHeadersClean } from './pipes/headersClean.js';
import { pipeImage } from './pipes/image.js';
import { pipeHtmlMin } from './pipes/htmlMin.js';
import { pipeLosslessImage } from './pipes/losslessImage.js';
import { pipeCache } from './pipes/cache.js';

const fsExistsAsync = promisify(fs.exists);

const readFile = promisify(fs.readFile);

const options = {
  port: 8001,
  rule: {
    summary: 'a rule to hack response',
    async beforeSendRequest(requestDetail) {
      const cacheFile = `/home/grisa/.caa/${xxhash.hash(Buffer.from(requestDetail.url), 0xCAFEBABE)}`;

      if (await fsExistsAsync(cacheFile)) {
        console.log('Get file from cache !!!!');
        return {
          response: {
            statusCode: 200,
            header: {
              'Content-Type': (await readFile(`${cacheFile}.mime`))
                .toString()
                .replace(/\n/gm, ''),
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

      newResponse = await pipeHtmlMin(newResponse, requestDetail);

      newResponse = await pipeBrotli(newResponse, requestDetail);
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
  silent: false,
};
const proxyServer = new anyproxy.ProxyServer(options);

proxyServer.on('ready', () => {
  /* */
});
proxyServer.on('error', (e) => {
  /* */
});
proxyServer.start();
