import minifier from 'html-minifier';
import replaceAll from 'string.prototype.replaceall';
import charset from 'charset';

import iconv from 'iconv-lite';

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

    bodyString = replaceAll(bodyString, '<img', '<img loading="lazy"');
    bodyString = replaceAll(bodyString, '<iframe', '<iframe loading="lazy"');

    bodyString = minifier.minify(bodyString, {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      continueOnParseError: true,
      decodeEntities: true,
      keepClosingSlash: false,
      minifyCSS: true,
      minifyJS: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeEmptyAttributes: true,
      sortAttributes: false,
      sortClassName: false,
    });

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
