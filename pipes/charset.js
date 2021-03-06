import charset from 'charset';
import iconv from 'iconv-lite';
import jschardet from 'jschardet';

const convertCharsetMimes = [
  'text/',
  'application/javascript',
  'application/x-javascript',
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
    let charsetDetect = charset(response?.header['content-type']);

    if (
      response?.header['content-type']?.startsWith('text/html') && !response?.header['content-type'].includes(';charset=')
    ) {
      const match = [...response.body.toString().matchAll(/<meta.*content=["'].*charset=([\w-]+)/gim)].map((m) => m[1])[0];
      if (match) {
        charsetDetect = match;
      }
    }

    let bodyString;
    bodyString = charsetDetect && charsetDetect !== 'utf-8' ? (iconv.decode(response.body, charsetDetect)) : (response.body);

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
