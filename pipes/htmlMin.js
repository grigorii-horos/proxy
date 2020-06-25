import minifier from 'html-minifier';
import replaceAll from 'string.prototype.replaceall';
/**
 * @param response
 */
export async function pipeHtmlMin(response) {
  if (
    response?.header['Content-Type']?.startsWith('text/html')
  ) {
    let bodyString = response.body.toString();
    const lines = (bodyString.match(/\n/g) || '').length + 1;

    if (bodyString.length / lines > 240) {
      return response;
    }

    // bodyString = bodyString.toString();
    bodyString = replaceAll(bodyString, '<img', '<img loading="lazy"');
    bodyString = replaceAll(bodyString, '<iframe', '<iframe loading="lazy"');

    const newBody = minifier.minify(bodyString, {
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
      body: (newBody),
      header: {
        ...response.header,
        'Content-Type': 'text/html;charset=utf-8',
      },
    };
  }

  return response;
}
