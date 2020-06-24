'use strict';

var port = 8081;

var Proxy = require('http-mitm-proxy');
var proxy = Proxy();

var Iconv = require('iconv').Iconv;


var charset = require('charset');

proxy.onError(function(ctx, err, errorKind) {
  // ctx may be null
  var url = (ctx && ctx.clientToProxyRequest) ? ctx.clientToProxyRequest.url : '';
  console.error(errorKind + ' on ' + url + ':', err);
});

proxy.use(Proxy.gunzip);





proxy.onRequest(function(ctx, callback) {
  var chunks = [];
  ctx.onResponseData(function(ctx, chunk, callback) {
    chunks.push(chunk);
    return callback(null, null); // don't write chunks to client response
  });
 
 
  ctx.onResponseEnd(function (ctx, callback) {
    var body = Buffer.concat(chunks);
   
    if (ctx.serverToProxyResponse.headers['content-type'] && ctx.serverToProxyResponse.headers['content-type'].indexOf('text/html') === 0) {

      const charSet = charset(ctx.serverToProxyResponse.headers['content-type'])
      console.log('------+++',charSet,ctx.serverToProxyResponse.headers['content-type'])
      if (charSet) {
        
        var iconv = new Iconv(charSet, 'UTF-8');
        console.log('----', body, '\n', iconv.convert(body))

        body = iconv.convert(body)
        // ctx.serverToProxyResponse.headers['content-type']='text/html'
      }
      // body = body.toString().replace(/Lucky/g, 'Sexy');
    }

    delete ctx.serverToProxyResponse.headers['content-type']
    //  ctx.proxyToClientResponse._header["cache-control"] = "no-cache";
    console.log(ctx.proxyToClientResponse.getHeaders())

    // ctx.proxyToClientResponse.setHeader();
    ctx.proxyToClientResponse.write(body);

    return callback();
  });
 
 
  callback();
});

proxy.listen({ port: port });
console.log('listening on ' + port);