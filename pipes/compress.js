import { promisify } from 'util';
import zlib from 'zlib';

const brotliCompress = promisify(zlib.brotliCompress);
const gzCompress = promisify(zlib.gzip);

const compressMimeTypes = [
  'application/',
  'text/',
  'image/',
  'video/',
];

/**
 * @param response
 * @param request
 */
export async function pipeCompress(response, request) {
  if (
    compressMimeTypes.filter((mime) => response?.header['content-type']?.startsWith(mime)).length > 0
  ) {
    const newData = await response.body;

    if (request.protocol === 'http') {
      return {
        ...response,
        // @ts-ignore
        body: gzCompress(newData, {
          level: 6,
        }),
        header: {
          ...response.header,
          'content-encoding': 'gzip',
        },
      };
    }

    try {
      return {
        ...response,
        // @ts-ignore
        body: brotliCompress(newData, {
          chunkSize: 32 * 1024,
          params: {
            [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
            [zlib.constants.BROTLI_PARAM_QUALITY]: 1,
            // @ts-ignore
            [zlib.constants.BROTLI_PARAM_SIZE_HINT]: newData.length,
          },
        }),
        header: {
          ...response.header,
          'content-encoding': 'br',
        },
      };
    } catch (error) {
      console.log('*************');
      console.log(newData, {
        chunkSize: 32 * 1024,
        params: {
          [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
          [zlib.constants.BROTLI_PARAM_QUALITY]: 1,
          // @ts-ignore
          [zlib.constants.BROTLI_PARAM_SIZE_HINT]: newData.length,
        },
      });
      console.log(error);
      console.log('*************');
    }
  }

  return response;
}
