const keepHeaders = ([
  'access-control-allow-', // *
  'age',
  'allow',
  'authorization',
  'cache-control',
  'content-', // *
  'date',
  'delta-base',
  'etag',
  'expires',
  'im',
  'last-modified',
  'link',
  'location',
  'pragma',
  'proxy-authenticate',
  'public',
  'retry-after',
  'set-cookie',
  'strict-transport-security',
  'tk',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'warning',
  'www-authenticate',
  // 'accept-patch',
  // 'accept-ranges',
  // 'alt-svc',
  // 'connection',
  // 'public-key-pins',
  // 'server',
  // 'vary',
  // 'via',
]);

/**
 * @param response
 */
export async function pipeHeadersClean(response) {
  if (response.header && response.header['access-control-allow-headers'] === '*') {
    return response;
  }

  const headers = Object.fromEntries(Object.entries(response.header)
    .filter(([key]) => ([...keepHeaders, ...allowHeaders]
      .filter((keepHeader) => {
        if (key.startsWith(keepHeader)) {
          return true;
        }
        return false;
      }).length > 0
    )));

  return { ...response, header: headers };
}
