/* eslint-disable unicorn/prevent-abbreviations */
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';

const __dirname = dirname(fileURLToPath(import.meta.url)); // eslint-disable-line no-underscore-dangle,max-len

const startWorker = (request, response) => new Worker(`${__dirname}/worker.js`, {
  workerData: {
    request: {
      requestOptions: request.requestOptions,
      protocol: request.protocol,
      url: request.url,
      requestData: request.requestData,
    },
    response: {
      statusCode: response.statusCode,
      header: response.header,
      body: response.body,
    },
  },
});

export default startWorker;
