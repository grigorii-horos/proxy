import { promisify } from 'util';
import zlib from 'zlib';

const brotliCompress = promisify(zlib.brotliCompress);
const gzCompress = promisify(zlib.gzip);

const compressMimeTypes = {
  text: [
    'application/',
    'text/',
  ],
  generic: [
    'image/',
  ],
  font: [
    'font/',
  ],
};

/**
 * @param response
 * @param request
 */
export async function pipeCompress(response, request) {
  if (
    [
      ...compressMimeTypes.text,
      ...compressMimeTypes.generic,
      ...compressMimeTypes.font,
    ].filter((mime) => response?.header['content-type']?.startsWith(mime)).length > 0
  ) {
    const newData = await response.body;
    try {
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

      let mode = zlib.constants.BROTLI_MODE_GENERIC;
      if (
        compressMimeTypes.text
          .filter((mime) => response?.header['content-type']?.startsWith(mime)).length > 0
      ) {
        mode = zlib.constants.BROTLI_MODE_TEXT;
      } else if (
        compressMimeTypes.font
          .filter((mime) => response?.header['content-type']?.startsWith(mime)).length > 0
      ) {
        mode = zlib.constants.BROTLI_MODE_FONT;
      }

      return {
        ...response,
        // @ts-ignore
        body: brotliCompress(newData, {
          chunkSize: 32 * 1024,
          params: {
            [zlib.constants.BROTLI_PARAM_MODE]: mode,
            [zlib.constants.BROTLI_PARAM_QUALITY]: 6,
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
      console.log(error);
      console.log('*************');
      return response;
    }
  }

  return response;
}
