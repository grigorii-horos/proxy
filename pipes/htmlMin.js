import minifier from 'html-minifier';

/**
 * @param response
 */
export async function pipeHtmlMin(response) {
  if (
    response?.header['Content-Type']?.startsWith('text/html')
  ) {
    const bodyString = response.body.toString();
    const lines = (bodyString.match(/\n/g) || '').length + 1;

    if (bodyString.length / lines > 240) {
      return response;
    }

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
