import { parentPort } from 'worker_threads';
import { promisify } from 'util';
import zlib from 'zlib';

const brotliCompress = promisify(zlib.brotliCompress);

parentPort.once('message', async (data) => {
  parentPort.postMessage({
  // @ts-ignore
    data: await brotliCompress(data, {
      chunkSize: 32 * 1024,
      params: {
        [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
        [zlib.constants.BROTLI_PARAM_QUALITY]: 1,
        // @ts-ignore
        [zlib.constants.BROTLI_PARAM_SIZE_HINT]: data.length,
      },
    }),
  });
  process.exit(0);
});
