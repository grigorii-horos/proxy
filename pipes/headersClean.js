const keepHeaders = ([
  // 'accept-patch',
  // 'accept-ranges',
  'access-control-allow-',
  'age',
  'allow',
  // 'alt-svc',
  'authorization',
  'cache-control',
  // 'connection',
  'content-',
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
  // 'public-key-pins',
  'public',
  'retry-after',
  'server',
  'set-cookie',
  'strict-transport-security',
  'tk',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'vary',
  'via',
  'warning',
  'www-authenticate',
]);

/**
 * @param response
 */
export function pipeHeadersClean(response) {
  let allowHeaders = [];
  if (response.header && response.header['access-control-allow-headers'] === '*') {
    return response;
  }

  if (response.header && response.header['access-control-allow-headers']) {
    allowHeaders = response.header['access-control-allow-headers'].split(' ').join('').split(',');
  }

  const headers = Object.fromEntries(Object.entries(response.header)
    .filter(([key, value]) => ([...keepHeaders, ...allowHeaders]
      .filter((keepHeader) => {
        if (key.startsWith(keepHeader)) {
          return true;
        }
        return false;
      }).length > 0
    )));

  return { ...response, header: headers };
}
