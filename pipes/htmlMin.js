import charset from 'charset';
import iconv from 'iconv-lite';

import { minHtmlFn } from '../utils/minHtml.js';

/**
 * @param response
 * @param request
 */
export async function pipeHtmlMin(response, request) {
  if (
    response?.header['content-type']?.startsWith('text/html')
  ) {
    let bodyString = response.body;
    const lines = (bodyString.toString().match(/\n/g) || '').length + 1;

    const charsetDetect = charset(response?.header['content-type']);
    if (charsetDetect && charsetDetect !== 'utf-8') {
      bodyString = iconv.decode(Buffer.from(bodyString), charsetDetect);
    }

    if (bodyString.length / lines > 240) {
      return response;
    }

    bodyString = minHtmlFn(bodyString);

    return {
      ...response,
      body: bodyString,
      header: {
        ...response.header,
        'content-type': 'text/html;charset=utf-8',
      },
    };
  }

  return response;
}
