import anyproxy from "anyproxy";
import mimeTypes from "mime-types";
import xxhash from "xxhash";
import fs from "fs";
import path from "path";

import { promisify } from "util";
import zlib from "zlib";

const fsExistsAsync = promisify(fs.exists);

const readFile = promisify(fs.readFile);

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
    async beforeSendRequest(requestDetail) {
      const cacheFile =
        "/home/grisa/.caa/" +
        xxhash.hash(Buffer.from(requestDetail.url), 0xcafebabe);

      if (await fsExistsAsync(cacheFile)) {
        console.log("Get file from cache !!!!");
        return {
          response: {
            statusCode: 200,
            header: {
              "Content-Type": (await readFile(cacheFile + ".mime"))
                .toString()
                .replace(/(\r\n|\n|\r)/gm, ""),
            },
            body: await readFile(cacheFile),
          },
        };
      }
      return requestDetail;
    },

    async beforeSendResponse(requestDetail, responseDetail) {
      let newResponse = responseDetail.response;

      newResponse = await pipeHeadersClean(newResponse, requestDetail);

      newResponse = await pipeJpegImage(newResponse, requestDetail);
      newResponse = await pipePngImage(newResponse, requestDetail);

      newResponse = await pipeHtmlMin(newResponse, requestDetail);

      newResponse = await pipeBrotli(newResponse, requestDetail);
      newResponse = await pipeCache(newResponse, requestDetail);

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
