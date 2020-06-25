import fs from 'fs';
import { promisify } from 'util';
import xxhash from 'xxhash';

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
  if (response?.statusCode === 200
    && cacheMimeTypes.filter((mime) => response?.header['Content-Type']?.startsWith(mime)).length > 0) {
    const cacheFile = `/home/grisa/.caa/${xxhash.hash(Buffer.from(request.url), 0xCAFEBABE)}`;

    const writeBody = writeFile(`${cacheFile}.tmp`, response.body);
    const writeMeta = writeFile(
      `${cacheFile}.meta`,
      `${
        response.header['Content-Type']
      }\n${
        response.header['Content-Encoding']
      }`,
    );

    await Promise.all([writeBody, writeMeta]);

    await fsRename(`${cacheFile}.tmp`, cacheFile);
  }

  return response;
}
