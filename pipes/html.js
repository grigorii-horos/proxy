import replaceAll from 'string.prototype.replaceall';

/**
 * @param response
 * @param request
 */
export async function pipeHtml(response, request) {
  if (
    response?.header['content-type']?.startsWith('text/html')
  ) {
    let bodyString = await response.body.toString();
    const lines = (bodyString.match(/\n/g) || '').length + 1;

    if (bodyString.length / lines > 240) {
      return response;
    }

    bodyString = replaceAll(bodyString, '<img', '<img loading="lazy"');
    bodyString = replaceAll(bodyString, '<iframe', '<iframe loading="lazy"');

    return {
      ...response,
      body: bodyString,
    };
  }

  return response;
}