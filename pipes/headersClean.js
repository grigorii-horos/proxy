/**
 * @param response
 */
export async function pipeHeadersClean(response) {
  delete response?.header.age;
  delete response?.header.connection;
  delete response?.header.date;
  delete response?.header.display;
  delete response?.header.eagleid;
  delete response?.header.link;
  delete response?.header.nel;
  delete response?.header.network_info;
  delete response?.header.p3p;
  delete response?.header.pragma;
  delete response?.header.s_tag;
  delete response?.header.s_tid;
  delete response?.header.server;
  delete response?.header.tcn;
  delete response?.header.vary;
  delete response?.header.via;
  delete response?.header['accept-ranges'];
  delete response?.header['akamai-cache-status'];
  delete response?.header['ali-swift-global-savetime'];
  delete response?.header['alt-svc'];
  delete response?.header['cf-bgj'];
  delete response?.header['cf-cache-status'];
  delete response?.header['cf-polished'];
  delete response?.header['cf-ray'];
  delete response?.header['cf-request-id'];
  delete response?.header['content-length'];
  delete response?.header['content-location'];
  delete response?.header['content-md5'];
  delete response?.header['eagleeye-traceid'];
  delete response?.header['expect-ct'];
  delete response?.header['fastly-io-info'];
  delete response?.header['fastly-io-info'];
  delete response?.header['fastly-io-warning'];
  delete response?.header['fastly-stats'];
  delete response?.header['feature-policy'];
  delete response?.header['from-req-dns-type'];
  delete response?.header['keep-alive'];
  delete response?.header['last-modified'];
  delete response?.header['object-status'];
  delete response?.header['object-status'];
  delete response?.header['public-key-pins'];
  delete response?.header['report-to'];
  delete response?.header['request-context'];
  delete response?.header['request-context'];
  delete response?.header['s-rt'];
  delete response?.header['sepia-upstream'];
  delete response?.header['served-from'];
  delete response?.header['served-in-seconds'];
  delete response?.header['server-timing'];
  delete response?.header['source-age'];
  delete response?.header['timing-allow-origin'];
  delete response?.header['transfer-encoding'];
  delete response?.header['x-amz-cf-id'];
  delete response?.header['x-amz-cf-pop'];
  delete response?.header['x-amz-id-2'];
  delete response?.header['x-amz-request-id'];
  delete response?.header['x-anyproxy-origin-connection'];
  delete response?.header['x-anyproxy-origin-content-encoding'];
  delete response?.header['x-anyproxy-origin-content-length'];
  delete response?.header['x-application-context'];
  delete response?.header['x-aspnet-duration-ms'];
  delete response?.header['x-bucket-code'];
  delete response?.header['x-cache-hits'];
  delete response?.header['x-cache-status'];
  delete response?.header['x-cache'];
  delete response?.header['x-cf-worker'];
  delete response?.header['x-check-cacheable'];
  delete response?.header['x-check-cacheable'];
  delete response?.header['x-client-ip'];
  delete response?.header['x-content-security-policy'];
  delete response?.header['x-content-type-options'];
  delete response?.header['x-datacenter'];
  delete response?.header['x-dns-prefetch-control'];
  delete response?.header['x-envoy-upstream-service-time'];
  delete response?.header['x-envoy-upstream-service-time'];
  delete response?.header['x-ezoic-cdn'];
  delete response?.header['x-fastly-request-id'];
  delete response?.header['x-fb-config-version-elb-prod'];
  delete response?.header['x-fb-config-version-flb-prod'];
  delete response?.header['x-fb-config-version-olb-prod'];
  delete response?.header['x-fb-debug'];
  delete response?.header['x-flags'];
  delete response?.header['x-frame-options'];
  delete response?.header['x-frontend'];
  delete response?.header['x-gateway'];
  delete response?.header['x-github-request-id'];
  delete response?.header['x-haystack-needlechecksum'];
  delete response?.header['x-haystack-needlechecksum'];
  delete response?.header['x-http-count'];
  delete response?.header['x-http-duration-ms'];
  delete response?.header['x-hw'];
  delete response?.header['x-is-crawler'];
  delete response?.header['x-middleton-display'];
  delete response?.header['x-middleton-response'];
  delete response?.header['x-nc'];
  delete response?.header['x-oss-hash-crc64ecma'];
  delete response?.header['x-oss-meta-file-type'];
  delete response?.header['x-oss-meta-filename'];
  delete response?.header['x-oss-object-type'];
  delete response?.header['x-oss-request-id '];
  delete response?.header['x-oss-request-id'];
  delete response?.header['x-oss-server-time'];
  delete response?.header['x-oss-storage-class'];
  delete response?.header['x-page-view'];
  delete response?.header['x-powered-by'];
  delete response?.header['x-providence-cookie'];
  delete response?.header['x-proxy-cache-status'];
  delete response?.header['x-proxy-cache'];
  delete response?.header['x-proxy-upstream'];
  delete response?.header['x-redis-count'];
  delete response?.header['x-redis-duration-ms'];
  delete response?.header['x-request-guid'];
  delete response?.header['x-request-id'];
  delete response?.header['x-response-from'];
  delete response?.header['x-route-name'];
  delete response?.header['x-serial'];
  delete response?.header['x-served-by'];
  delete response?.header['x-source-scheme'];
  delete response?.header['x-sql-count'];
  delete response?.header['x-sql-duration-ms'];
  delete response?.header['x-swift-cachetime'];
  delete response?.header['x-swift-savetime'];
  delete response?.header['x-timer'];
  delete response?.header['x-ua-compatible'];
  delete response?.header['x-varnish-cache'];
  delete response?.header['x-varnish-cache'];
  delete response?.header['x-vimeo-dc'];
  delete response?.header['x-vimeo-dc'];
  delete response?.header['x-vserver'];
  delete response?.header['x-xss-protection'];
  delete response?.header['x-xss-pwnage'];
  delete response?.header['x-zone'];

  return response;
}
