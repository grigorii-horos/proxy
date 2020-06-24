import { promisify } from "util";
import zlib from "zlib";

const brotliCompress = promisify(zlib.brotliCompress);

export function compress(data) {
  return brotliCompress(data, {
    params: {
      [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
    },
  });
}
