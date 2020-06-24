export async function pipeHeadersClean(response) {
  delete response?.header["x-anyproxy-origin-connection"];
  delete response?.header["x-anyproxy-origin-connection"];
  delete response?.header["x-anyproxy-origin-content-encoding"];
  delete response?.header["x-anyproxy-origin-content-length"];
  delete response?.header["Server"];
  delete response?.header["X-Proxy-Cache-Status"];
  delete response?.header["Vary"];

  return response;
}
