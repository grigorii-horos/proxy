import anyproxy from 'anyproxy';
import crypto from 'crypto';
import fs from 'fs';
import mkdirp from 'mkdirp'

import { promisify } from 'util';

import lowercaseKeys from 'lowercase-keys';
import { Worker } from 'worker_threads';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import blockUrls from './blockUrls.js';

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url)); // eslint-disable-line no-underscore-dangle,max-len

const fsExistsAsync = promisify(fs.exists);

const readFile = promisify(fs.readFile);

const options = {
  rule: {
    summary: 'a rule to hack response',
    async beforeSendRequest(requestDetail) {
      if (
        blockUrls.some((url) => requestDetail.requestOptions.hostname.startsWith(url))
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

      const hashFile = crypto
        .createHash('sha1')
        .update(requestDetail.url)
        .digest('hex');
      const cacheFile = `/tmp/.cache/${hashFile}`;
      if (await fsExistsAsync(cacheFile)) {
        const headers = lowercaseKeys(requestDetail.header || {});

        const headersMeta = JSON.parse(
          (await readFile(`${cacheFile}.json`)).toString(),
        );

        if (
          headers['if-none-match']
          && `"${hashFile}"` === headers['if-none-match']
        ) {
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
            header: headersMeta,
            body: await readFile(cacheFile),
          },
        };
      }

      return requestDetail;
    },

    async beforeSendResponse(requestDetail, responseDetail) {
      // console.log((requestDetail), '----');
      return new Promise((resolve, reject) => {
        const w = new Worker(`${__dirname}/worker.js`, {
          workerData: {
            request: {
              requestOptions: requestDetail.requestOptions,
              protocol: requestDetail.protocol,
              url: requestDetail.url,
              requestData: requestDetail.requestData,
            },
            response: {
              statusCode: responseDetail.response.statusCode,
              header: responseDetail.response.header,
              body: responseDetail.response.body,
            },
          },
        });

        w.on('message', (response) => {
          let newResponse = response;
          newResponse = {
            ...newResponse,
            body: Buffer.from(newResponse.body),
          };

          resolve({
            response: {
              ...newResponse,
            },
          });
        });
      });
    },
  },
  webInterface: {
    enable: true,
    webPort: 8002,
  },
  port: 8001,
  throttle: 0,
  forceProxyHttps: true,
  wsIntercept: true,
  silent: true,
  dangerouslyIgnoreUnauthorized: true,

  // silent: true,
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


const fn =async ()=>{

mkdirp('/tmp/.cache')

}

fn()
