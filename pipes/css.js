/**
 * @param {{ body: any; header: { [x: string]: string; }; }} response
 * @param {any} request
 * @param config
 */
export async function pipeCss(response, request, config) {
  if (
    response?.header['content-type']?.startsWith('text/css')
  ) {
    return {
      ...response,
      body: config.eink ? `*{
-webkit-transition-property: none !important;transition-property: none !important;
-webkit-transform: none !important;transform: none !important;
-ms-animation: none !important;animation: none !important;
}

// span,blockquote,code,pre,dt,dd,details,summary,p,li,br,h1,h2,h3,h4,h5,h6{
//   color:#000000 !important; background-color:#ffffff !important; text-shadow:0.2px 0.2px !important;
// }

a[href]{
  color:#000000 !important; text-decoration: underline !important; background-color:#ffffff !important;
}

a:visited,a:active{
  color:#808080 !important; background-color:#ffffff !important;
}
      ${await response.body}` : response.body,
    };
  }

  return response;
}
