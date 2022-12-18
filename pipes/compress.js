import { promisify } from 'node:util';
import zlib from 'node:zlib';

const brotliCompress = promisify(zlib.brotliCompress);
const gzCompress = promisify(zlib.gzip);

const compressMimeTypes = {
  text: [
    'application/',
    'text/',
  ],
  generic: [
    // 'image/',
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
    ].some((mime) => response?.header['content-type']?.startsWith(mime))
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
          .some((mime) => response?.header['content-type']?.startsWith(mime))
      ) {
        mode = zlib.constants.BROTLI_MODE_TEXT;
      } else if (
        compressMimeTypes.font
          .some((mime) => response?.header['content-type']?.startsWith(mime))
      ) {
        mode = zlib.constants.BROTLI_MODE_FONT;
      }

      return {
        ...response,
        // @ts-ignore
        body: brotliCompress(newData, {
          chunkSize: 32 * 1_024,
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
    } catch (ex) {
      console.log('*************');
      console.log(ex);
      console.log('*************');
      return response;
    }
  }
  delete response.header['content-encoding'];

  return response;
}
