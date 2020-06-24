import { compress, compressGz } from '../utils/compres.js';

/**
 * @param response
 * @param request
 */
export async function pipeCompress(response, request) {
  if (request.protocol === 'http') {
    const newBody = await compressGz((response.body));

    return {
      ...response,
      body: newBody,
      header: {
        ...response.header,
        'Content-Encoding': 'gzip',
      },
    };
  }

  if (response?.header['Content-Type']?.startsWith('text/html')) {
    const newBody = await compress((response.body));

    return {
      ...response,
      body: newBody,
      header: {
        ...response.header,
        'Content-Encoding': 'br',
      },
    };
  }
  return response;
}
