import { parentPort, workerData } from 'worker_threads';

import { pipeCache } from './pipes/cache.js';
import { pipeCharset } from './pipes/charset.js';
import { pipeCompress } from './pipes/compress.js';
import { pipeHeadersClean } from './pipes/headersClean.js';
import { pipeHtml } from './pipes/html.js';
import { pipeImage } from './pipes/image.js';
import { pipeLosslessImage } from './pipes/losslessImage.js';
import { pipeLovercaseHeader } from './pipes/lovercaseHeaders.js';
import { pipeSaveToCache } from './pipes/saveToCache.js';
import { pipeSvg } from './pipes/svg.js';

(async () => {
  const { request, response } = workerData;
  let newResponse = response;

  newResponse = {
    ...newResponse,
    body: Buffer.from(newResponse.body),
  };

  newResponse = await pipeLovercaseHeader(newResponse, request);
  newResponse = await pipeHeadersClean(newResponse, request);

  newResponse = await pipeCharset(newResponse, request);

  newResponse = await pipeHtml(newResponse, request);

  newResponse = await pipeImage(newResponse, request);
  newResponse = await pipeLosslessImage(newResponse, request);
  newResponse = await pipeSvg(newResponse, request);

  newResponse = await pipeCompress(newResponse, request);
  newResponse = await pipeSaveToCache(newResponse, request);
  newResponse = await pipeCache(newResponse, request);

  newResponse = {
    ...newResponse,
    body: await newResponse.body,
  };

  parentPort.postMessage(newResponse);
})();
