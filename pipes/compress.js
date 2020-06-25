import { compress } from '../utils/compres.js';

const compressMimeTypes = [
  'application/javascript',
  'application/json',
  'application/ld+json',
  'text/',
  'image/',
];

/**
 * @param response
 * @param request
 */
export async function pipeCompress(response, request) {
  if (
    compressMimeTypes.filter((mime) => response?.header['Content-Type']?.startsWith(mime)).length > 0
  ) {
    const [encoding, compressedBody] = await Promise.all(
      compress(response.body, request.protocol),
    );

    return {
      ...response,
      body: compressedBody,
      header: {
        ...response.header,
        'Content-Encoding': encoding,
      },
    };
  }
  return response;
}
