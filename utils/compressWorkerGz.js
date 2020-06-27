import { parentPort } from 'worker_threads';
import { promisify } from 'util';
import zlib from 'zlib';

const gzCompress = promisify(zlib.gzip);

parentPort.once('message', async (data) => {
  parentPort.postMessage({
  // @ts-ignore
    data: await gzCompress(data, {
      level: 6,
    }),
  });
  process.exit(0);
});
