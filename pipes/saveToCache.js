import fs, { writeFileSync } from 'fs';
import { promisify } from 'util';
import crypto from 'crypto';

const writeFile = promisify(fs.writeFile);
const fsRename = promisify(fs.rename);

const cacheMimeTypes = [
  'image/',
  'text/plain',
  'text/javascript',
  'text/css',
  'application/javascript',
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
    && newBody.length > 128
  ) {
    const hashFile = crypto.createHash('sha1').update(request.url).digest('hex');

    const headers = {
      ...response.header,
      etag: `"${hashFile}"`,
    };

    const cacheFile = `/home/grisa/.caa/${hashFile}`;

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

    console.log('Save to cache', request.url);
    return {
      ...response,
      header: headers,
    };
  }

  return response;
}
