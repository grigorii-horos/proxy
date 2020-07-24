import replaceAll from 'string.prototype.replaceall';

/**
 * @param response
 * @param request
 */
export async function pipeHtml(response, request) {
  if (
    response?.header['content-type']?.startsWith('text/html')
  ) {
    let bodyString = (await response.body).toString();

    bodyString = replaceAll(bodyString, '<img', '<img loading="lazy"');
    bodyString = replaceAll(bodyString, '<iframe', '<iframe loading="lazy"');
    bodyString = replaceAll(bodyString, /(<(?:script|link).*)integrity=(:?'|")sha512-.*?(:?'|")/gm, '$1');

    return {
      ...response,
      header: response.header,
      body: bodyString,
    };
  }

  return response;
}
