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
  delete response?.header['cf-bgj'];
  delete response?.header['cf-cache-status'];
  delete response?.header['cf-polished'];
  delete response?.header['cf-ray'];
  delete response?.header['cf-request-id'];
  delete response?.header['content-length'];
  delete response?.header['expect-ct'];
  delete response?.header['last-modified'];
  delete response?.header['public-key-pins'];
  delete response?.header['report-to'];
  delete response?.header['transfer-encoding'];
  delete response?.header['x-anyproxy-origin-connection'];
  delete response?.header['x-anyproxy-origin-connection'];
  delete response?.header['x-anyproxy-origin-content-encoding'];
  delete response?.header['x-anyproxy-origin-content-length'];
  delete response?.header['x-cache'];
  delete response?.header['x-cf-worker'];
  delete response?.header['x-frame-options'];
  delete response?.header['x-github-request-id'];
  delete response?.header['x-powered-by'];
  delete response?.header['x-proxy-cache-status'];
  delete response?.header['x-proxy-cache'];
  delete response?.header['x-proxy-upstream'];
  delete response?.header['x-xss-protection'];
  delete response?.header['x-xss-pwnage'];

  return response;
}
