/**
 * @param response
 */
export async function pipeHeadersClean(response) {
  delete response?.header.age;
  delete response?.header.date;
  delete response?.header.nel;
  delete response?.header.p3p;
  delete response?.header.pragma;
  delete response?.header.server;
  delete response?.header.vary;
  // delete response?.header['access-control-allow-credentials'];
  // delete response?.header['access-control-allow-methods'];
  // delete response?.header['access-control-allow-origin'];
  // delete response?.header['access-control-expose-headers'];
  delete response?.header['cf-bgj'];
  delete response?.header['cf-cache-status'];
  delete response?.header['cf-polished'];
  delete response?.header['cf-ray'];
  delete response?.header['cf-request-id'];
  delete response?.header['content-length'];
  delete response?.header['expect-ct'];
  delete response?.header['feature-policy'];
  delete response?.header['last-modified'];
  delete response?.header['public-key-pins'];
  delete response?.header['report-to'];
  // delete response?.header['transfer-encoding'];
  delete response?.header['x-anyproxy-origin-connection'];
  delete response?.header['x-anyproxy-origin-connection'];
  delete response?.header['x-anyproxy-origin-content-encoding'];
  delete response?.header['x-anyproxy-origin-content-length'];
  delete response?.header['x-aspnet-duration-ms'];
  delete response?.header['x-cache-hits'];
  delete response?.header['x-cache'];
  delete response?.header['x-cf-worker'];
  delete response?.header['x-content-type-options'];
  delete response?.header['x-dns-prefetch-control'];
  delete response?.header['x-fb-debug'];
  delete response?.header['x-flags'];
  delete response?.header['x-frame-options'];
  delete response?.header['x-github-request-id'];
  delete response?.header['x-http-count'];
  delete response?.header['x-http-duration-ms'];
  delete response?.header['x-is-crawler'];
  delete response?.header['x-page-view'];
  delete response?.header['x-powered-by'];
  delete response?.header['x-providence-cookie'];
  delete response?.header['x-proxy-cache-status'];
  delete response?.header['x-proxy-cache'];
  delete response?.header['x-proxy-upstream'];
  delete response?.header['x-redis-count'];
  delete response?.header['x-redis-duration-ms'];
  delete response?.header['x-request-guid'];
  delete response?.header['x-route-name'];
  delete response?.header['x-served-by'];
  delete response?.header['x-sql-count'];
  delete response?.header['x-sql-duration-ms'];
  delete response?.header['x-timer'];
  delete response?.header['x-xss-protection'];
  delete response?.header['x-xss-pwnage'];
  delete response?.header['x-frontend'];

  return response;
}
