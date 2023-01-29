import anyproxy from 'anyproxy';
import crypto from 'node:crypto';
import fs from 'node:fs';
import mkdirp from 'mkdirp';

import { promisify } from 'node:util';

import lowercaseKeys from 'lowercase-keys';
// import { Worker } from 'node:worker_threads';
// import { dirname } from 'node:path';
// import { fileURLToPath } from 'node:url';
import blockUrls from './block-urls.js';
import startWorker from './start-worker.js';

const fsExistsAsync = promisify(fs.exists);

const readFile = promisify(fs.readFile);

const defaultConfig = await readFile('./config.default.json', 'utf8');
const userConfig = await readFile('./config.json', 'utf8');

const config = { ...JSON.parse(defaultConfig), ...JSON.parse(userConfig) };

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

        console.log(`Return from cache ${requestDetail.url} - ${cacheFile}`);

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
      return new Promise((resolve, reject) => {
        const worker = startWorker(requestDetail, responseDetail.response, config);

        worker.on('message', (response) => {
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

        worker.on('error', (response) => {
          resolve({
            response: {
              error: 'error',
            },
          });
        });
      });
    },
  },
  webInterface: {
    enable: true,
    webPort: 10001,
  },
  port: 10000,
  throttle: 0,
  forceProxyHttps: true,
  wsIntercept: false,
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

mkdirp('/tmp/.cache');
