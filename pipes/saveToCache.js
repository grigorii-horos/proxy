import fs from 'fs';
import { promisify } from 'util';
import crypto from 'crypto';

const writeFile = promisify(fs.writeFile);
const fsRename = promisify(fs.rename);

const cacheMimeTypes = [
  'text/javascript',
  'application/javascript',
  'application/x-javascript',
  'text/css',
  'image/',
  'font/',
];

/**
 * @param response
 * @param request
 */
export async function pipeSaveToCache(response, request) {
  const newBody = await response.body;
  if (
    response?.statusCode === 200
    && cacheMimeTypes.filter((mime) => response?.header['content-type']?.startsWith(mime)).length > 0
    && request.requestOptions.method === 'GET'
    && newBody.length > 16
  ) {
    const hashFile = crypto.createHash('sha1').update(request.url).digest('hex');

    const headers = response.header;
    delete headers.etag;
    delete headers['set-cookie'];

    // const ff = {
    //   'content-type': response.header['content-type'],
    //   'content-encoding': response.header['content-encoding'],
    //   'access-control-allow-origin': response.header['access-control-allow-origin'],
    //   'cache-control': response.header['cache-control'],
    //   etag: response.header.etag,
    //   'access-control-allow-methods': response.header['access-control-allow-methods'],
    // };

    const cacheFile = `/tmp/.cache/${hashFile}`;

    const writeFS = async (file) => {
      const writeBody = writeFile(`${file}.tmp`, newBody);
      const writeMeta = writeFile(
        `${file}.json`,
        JSON.stringify(headers),
      );
      await Promise.all([writeBody, writeMeta]);
      await fsRename(`${file}.tmp`, file);
    };

    writeFS(cacheFile);

    return {
      ...response,
      header: {
        ...response.header,
        etag: `"${hashFile}"`,
      },
    };
  }

  return response;
}
