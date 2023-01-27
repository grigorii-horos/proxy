import prettysize from 'prettysize';
import { parentPort, workerData } from 'node:worker_threads';
import { pipeCache } from './pipes/cache.js';
import { pipeCharset } from './pipes/charset.js';
import { pipeCompress } from './pipes/compress.js';
import { pipeHeadersClean } from './pipes/headers-clean.js';
import { pipeHtml } from './pipes/html.js';
import { pipeImage } from './pipes/image.js';
import { pipeLosslessImage } from './pipes/lossless-image.js';
import { pipeLowercaseHeader } from './pipes/lowercase-headers.js';
import { pipeSaveToCache } from './pipes/save-to-cache.js';
import { pipeSvg } from './pipes/svg.js';

import defaultConfig from './config.default.json' assert { type: "json" };
import userConfig from './config.json' assert { type: "json" };

const config = { ...defaultConfig, ...userConfig };

(async () => {
  const { request, response } = workerData;
  let newResponse = response;
  const start = new Date();

  const oldSize = newResponse.body.length;

  newResponse = {
    ...newResponse,
    body: Buffer.from(newResponse.body),
  };

  newResponse = await pipeLowercaseHeader(newResponse, request, config);
  newResponse = await pipeHeadersClean(newResponse, request, config);

  newResponse = await pipeCharset(newResponse, request, config);

  newResponse = await pipeHtml(newResponse, request, config);

  newResponse = await pipeImage(newResponse, request, config);
  newResponse = await pipeLosslessImage(newResponse, request, config);
  newResponse = await pipeSvg(newResponse, request, config);

  newResponse = await pipeCompress(newResponse, request, config);
  newResponse = await pipeCache(newResponse, request, config);
  newResponse = await pipeSaveToCache(newResponse, request, config);

  newResponse = {
    ...newResponse,
    body: await newResponse.body,
  };
  const end = Date.now() - start;
  const newSize = newResponse.body.length;
  console.log(
    request.url,
    `Execution time - ${end}ms  Compression - ${prettysize(
      oldSize,
      true,
      true,
      0,
    )}/${prettysize(newSize, true, true, 0)}`,
    `${Math.floor(newSize / (oldSize / 100))}%`,
  );

  parentPort.postMessage(newResponse);
})();
