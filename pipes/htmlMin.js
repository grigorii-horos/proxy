import minifier from "html-minifier";

export async function pipeHtmlMin(response) {
  if (response?.header["Content-Type"]?.startsWith("text/html")) {
    const newBody = minifier.minify(response.body.toString(), {
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeComments: true,
      removeCommentsFromCDATA: true,
      removeCDATASectionsFromCDATA: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      continueOnParseError: true,
      decodeEntities: true,
      keepClosingSlash: false,
      minifyCSS: true,
      minifyJS: true,
      sortAttributes: true,
      sortClassName: true,
    });
    return {
      ...response,
      body: newBody,
    };
  }

  return response;
}
