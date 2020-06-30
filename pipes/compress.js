import { promisify } from 'util';
import zlib from 'zlib';

const brotliCompress = promisify(zlib.brotliCompress);
const gzCompress = promisify(zlib.gzip);

const compressMimeTypes = [
  'application/javascript',
  'application/json',
  'application/ld+json',
  'text/',
  'image/',
];

/**
 * @param response
 * @param request
 */
export async function pipeCompress(response, request) {
  if (
    compressMimeTypes.filter((mime) => response?.header['content-type']?.startsWith(mime)).length > 0
  ) {
    //

    const newData = response.body;

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
  }

  return response;
}
