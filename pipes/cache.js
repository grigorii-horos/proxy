import cacheControl from '@tusbar/cache-control';

const alwaysCache = [
  'application/',
  'audio/',
  'video/',

  'font/',
  'image/',
  'text/javascript',
  'text/css',
  'text/plain',
];

/**
 * @param response
 */
export async function pipeCache(response) {
  if (
    response?.header['Content-Type']
    && alwaysCache.filter((mime) => response?.header['Content-Type'].startsWith(mime)).length
  ) {
    const opt = cacheControl.parse(response?.header['Cache-Control']);

    delete response?.header.Expires;

    return {
      ...response,
      header: {
        ...response.header,
        'Cache-Control': 'public, immutable, max-age=31536000',
        Expires: 'Sun, 03 Mar 2052 11:42:45 GMT',
      },
    };
  }

  return response;
}
