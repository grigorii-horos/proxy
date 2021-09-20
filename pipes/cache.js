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
    response?.header['content-type']
    && alwaysCache.some((mime) => response?.header['content-type'].startsWith(mime))
  ) {
    return {
      ...response,
      header: {
        ...response.header,
        'cache-control': 'public, immutable, max-age=31536000',
        expires: 'Sun, 03 Mar 2052 11:42:45 GMT',
      },
    };
  }

  return response;
}
