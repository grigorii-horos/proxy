import minifier from "html-minifier";

export async function pipeHtmlMin(response) {
  if (response?.header["Content-Type"]?.startsWith("text/html")) {
    const bodyString = response.body.toString();
    const lines = (bodyString.match(/\n/g) || "").length + 1;

    if (bodyString.length / lines > 160) {
      return response;
    }

    const newBody = minifier.minify(bodyString, {
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
