import charset from 'charset';
import iconv from 'iconv-lite';

import { charsetFn } from '../utils/charset.js';

const convertCharsetMimes = [
  'text/html',
  'text/javascript',
  'text/css',
];
/**
 * @param response
 * @param request
 */
export async function pipeCharset(response, request) {
  if (
    convertCharsetMimes.filter((mime) => response?.header['content-type']?.startsWith(mime)).length > 0
  ) {
    let bodyString = response.body;

    const charsetDetect = charset(response?.header['content-type']);
    if (charsetDetect && charsetDetect !== 'utf-8') {
      bodyString = await charsetFn(bodyString, charsetDetect);
    }

    return {
      ...response,
      body: bodyString,
      header: {
        ...response.header,
        'content-type': `${response.header['content-type'].split(';')[0]};charset=utf-8`,
      },
    };
  }

  return response;
}
