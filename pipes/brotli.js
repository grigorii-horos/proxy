import { compress } from '../utils/compres.js';

/**
 * @param response
 */
export async function pipeBrotli(response) {
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
