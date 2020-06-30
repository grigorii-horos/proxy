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
    console.log('+++++++');
    const hashFile = crypto.createHash('sha1').update(request.url).digest('hex');

    const cacheFile = `/home/grisa/.caa/${hashFile}`;

    const writeFS = async (cacheFile) => {
      const writeBody = writeFile(`${cacheFile}.tmp`, newBody);
      const writeMeta = writeFile(
        `${cacheFile}.meta`,
        `${
          response.header['content-type']
        }\n${
          response.header['content-encoding']
        }`,
      );
      await Promise.all([writeBody, writeMeta]);
      await fsRename(`${cacheFile}.tmp`, cacheFile);
      console.log(11111);
    };

    await writeFS(cacheFile);

    console.log('Save to cache', cacheFile);
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
