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
    const lines = ((await bodyString).toString().match(/\n/g) || '').length + 1;

    if (bodyString.length / lines > 240) {
      return response;
    }

    bodyString = minHtmlFn(bodyString);

    return {
      ...response,
      newBody: bodyString,
    };
  }

  return response;
}
