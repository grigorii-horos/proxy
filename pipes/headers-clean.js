const keepHeaders = [
  "access-control-allow-", // *
  "age",
  "authorization",
  "cache-control",
  "content-", // *
  // 'date',
  "etag",
  "expires",
  // 'last-modified',
  "link",
  "location",
  "pragma",
  "referrer-policy",
  "set-cookie",
  "strict-transport-security",
  "transfer-encoding",
  "www-authenticate",
  // 'accept-patch',
  // 'accept-ranges',
  // 'allow',
  // 'alt-svc',
  // 'connection',
  // 'delta-base',
  // 'public-key-pins',
  // 'public',
  // 'retry-after',
  // 'server',
  // 'tk',
  // 'trailer',
  // 'upgrade',
  // 'vary',
  // 'via',
  // 'warning',
];

/**
 * @param response
 */
export async function pipeHeadersClean(response) {
  const headers = Object.fromEntries(
    Object.entries(response.header).filter(([key]) =>
      keepHeaders.some((keepHeader) => {
        if (key.startsWith(keepHeader)) {
          return true;
        }
        return false;
      })
    )
  );

  return { ...response, header: headers };
}
