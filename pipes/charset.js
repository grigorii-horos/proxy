import charset from 'charset';
import iconv from 'iconv-lite';

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
    let charsetDetect = charset(response?.header['content-type']);

    if (
    response?.header['content-type'] === 'text/html'
    ) {
      console.log('---',Array.from(response.body.toString().matchAll(/<meta.*content=["'].*charset=([\w-]*)["']/gim), m => m[0]);
)
      const match = response.body.toString().match(/<meta.*content=["'].*charset=([\w-]*)["']/gim)[1];
      if (match) {
        charsetDetect = match;
      }
    }

    let bodyString;
    if (charsetDetect && charsetDetect !== 'utf-8') {
      bodyString = (iconv.decode(response.body, charsetDetect));
    } else {
      bodyString = (response.body);
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
