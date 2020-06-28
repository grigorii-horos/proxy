import { parentPort } from 'worker_threads';

import charset from 'charset';
import iconv from 'iconv-lite';

parentPort.once('message', async ([data, charsetData]) => {
  const bodyString = iconv.decode(data, charsetData);

  parentPort.postMessage({
  // @ts-ignore
    data: bodyString,
  });
  process.exit(0);
});
