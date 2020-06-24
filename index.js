import anyproxy from "anyproxy";

import { pipeBrotli } from "./pipes/brotli.js";
import { pipeHeadersClean } from "./pipes/headersClean.js";
import { pipeJpegImage } from "./pipes/jpegImage.js";
import { pipeHtmlMin } from "./pipes/htmlMin.js";
import { pipePngImage } from "./pipes/pngImage.js";
import { pipeCache } from "./pipes/cache.js";

const options = {
  port: 8001,
  rule: {
    summary: "a rule to hack response",
    async beforeSendResponse(requestDetail, responseDetail) {
      let newResponse = responseDetail.response;

      newResponse = await pipeHeadersClean(newResponse);

      newResponse = await pipeJpegImage(newResponse);
      newResponse = await pipePngImage(newResponse);

      newResponse = await pipeHtmlMin(newResponse);

      newResponse = await pipeBrotli(newResponse);
      newResponse = await pipeCache(newResponse);

      return { response: newResponse };
    },
  },
  webInterface: {
    enable: true,
    webPort: 8002,
  },
  throttle: 0,
  forceProxyHttps: true,
  wsIntercept: false,
  silent: false,
};
const proxyServer = new anyproxy.ProxyServer(options);

proxyServer.on("ready", () => {
  /* */
});
proxyServer.on("error", (e) => {
  /* */
});
proxyServer.start();
