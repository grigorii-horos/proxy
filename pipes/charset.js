import charset from 'charset';

import { charsetFn } from '../utils/charset.js';

const convertCharsetMimes = [
  'text/',
  'application/javascript',
  'application/json',
];
/**
 * @param response
 * @param request
 */
export async function pipeCharset(response, request) {
  if (
    convertCharsetMimes.filter((mime) => response?.header['content-type']?.startsWith(mime)).length > 0
  ) {
    const bodyString = charsetFn(response.newBody, response?.header['content-type']);

    return {
      ...response,
      newBody: bodyString,
      header: {
        ...response.header,
        'content-type': `${response.header['content-type'].split(';')[0]};charset=utf-8`,
      },
    };
  }

  return response;
}
