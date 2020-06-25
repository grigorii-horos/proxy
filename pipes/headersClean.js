/**
 * @param response
 */
export async function pipeHeadersClean(response) {
  delete response?.header.Date;
  delete response?.header.NEL;
  delete response?.header.P3P;
  delete response?.header.Server;
  delete response?.header.Age;
  delete response?.header['Cf-Bgj'];
  delete response?.header['CF-Cache-Status'];
  delete response?.header['Cf-Polished'];
  delete response?.header['CF-RAY'];
  delete response?.header['cf-request-id'];
  delete response?.header['Content-Length'];
  delete response?.header.Date;
  delete response?.header.Date;
  delete response?.header['Expect-CT'];
  delete response?.header['Public-Key-Pins'];
  delete response?.header['Report-To'];
  delete response?.header['Strict-Transport-Security'];
  delete response?.header['Transfer-Encoding'];
  delete response?.header.Vary;
  delete response?.header['x-anyproxy-origin-connection'];
  delete response?.header['x-anyproxy-origin-connection'];
  delete response?.header['x-anyproxy-origin-content-encoding'];
  delete response?.header['x-anyproxy-origin-content-length'];
  delete response?.header['X-Cache'];
  delete response?.header['X-CF-Worker'];
  delete response?.header['X-Frame-Options'];
  delete response?.header['X-GitHub-Request-Id'];
  delete response?.header['X-Powered-By'];
  delete response?.header['X-Proxy-Cache-Status'];
  delete response?.header['X-Proxy-Cache'];
  delete response?.header['X-Proxy-Upstream'];
  delete response?.header['X-Xss-Protection'];
  delete response?.header['X-Xss-Pwnage'];
  delete response?.header.Pragma;
  delete response?.header['Last-Modified'];
  // delete response?.header['ETag'];

  return response;
}
