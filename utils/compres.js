import { promisify } from "util";
import zlib from "zlib";

const brotliCompress = promisify(zlib.brotliCompress);
const gzCompress = promisify(zlib.gzip);

/**
 * @param data
 */
export function compress(data, protocol) {
  if (protocol === "http") {
    return [
      "gzip",
      // @ts-ignore
      gzCompress(data, {
        level: 6,
      }),
    ];
  }

  return [
    "br",
    // @ts-ignore
    brotliCompress(data, {
      chunkSize: 32 * 1024,
      params: {
        [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
        [zlib.constants.BROTLI_PARAM_QUALITY]: 1,
        // @ts-ignore
        [zlib.constants.BROTLI_PARAM_SIZE_HINT]: data.length,
      },
    }),
  ];
}
