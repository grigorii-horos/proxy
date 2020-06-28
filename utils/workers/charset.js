import { parentPort } from 'worker_threads';

import charset from 'charset';
import iconv from 'iconv-lite';

parentPort.once('message', async ([data, header]) => {
  const charsetDetect = charset(header);

  let bodyString;
  if (charsetDetect && charsetDetect !== 'utf-8') {
    bodyString = iconv.decode(data, charsetDetect);
  } else {
    bodyString = data;
  }

  parentPort.postMessage({
  // @ts-ignore
    data: bodyString,
  });
  process.exit(0);
});
