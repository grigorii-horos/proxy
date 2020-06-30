import { Worker,parentPort,workerData} from 'worker_threads'




      // newResponse = await pipeLovercaseHeader(newResponse, requestDetail);
      // newResponse = await pipeHeadersClean(newResponse, requestDetail);

      // newResponse = await pipeCharset(newResponse, requestDetail);

      // newResponse = await pipeHtmlMin(newResponse, requestDetail);

      // newResponse = await pipeImage(newResponse, requestDetail);
      // newResponse = await pipeLosslessImage(newResponse, requestDetail);
      // newResponse = await pipeSvg(newResponse, requestDetail);

      // newResponse = await pipeCompress(newResponse, requestDetail);
      // newResponse = await pipeSaveToCache(newResponse, requestDetail);
      // newResponse = await pipeCache(newResponse, requestDetail);

parentPort.postMessage({
  hello: Buffer.from('world'), binba: {
  boba:123
}})