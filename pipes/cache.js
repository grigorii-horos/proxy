import cacheControl from '@tusbar/cache-control';

const alwaysCache = [
  'application/javascript',
  'application/json',
  'application/ld+json',
  'application/pdf',
  'audio/aac',
  'audio/webm',
  'font/otf',
  'font/ttf',
  'font/woff2',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/vnd.microsoft.icon',
  'image/webp',
  'text/javascript',
  'text/css',
  'text/plain',
  'video/webm',
];

/**
 * @param response
 */
export async function pipeCache(response) {
  if (
    response?.header['Content-Type']
    && alwaysCache.includes(response?.header['Content-Type'].split(';')[0])
  ) {
    const opt = cacheControl.parse(response?.header['Cache-Control']);

    delete response?.header.Expires;

    return {
      ...response,
      header: {
        ...response.header,
        'Cache-Control': 'public, immutable, max-age=31536000',
      },
    };
  }

  return response;
}
