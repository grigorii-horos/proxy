import { Worker } from 'worker_threads';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));// eslint-disable-line no-underscore-dangle,max-len

/**
 * @param data
 * @param protocol
 */
export async function minHtmlFn(data) {
      const newData = await data

  return new Promise((resolve, reject) => {
    const worker = new Worker(`${__dirname}/workers/minHtml.js`);

    worker.on('message', (message) => resolve(message.data));
    worker.postMessage(newData);
  });
}
