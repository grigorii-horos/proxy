import fs from 'fs';
import { promisify } from 'util';
import xxhash from 'xxhash';

const writeFile = promisify(fs.writeFile);

const cacheMimeTypes = ['image/', 'text/plain', 'text/javascript', 'text/css', 'application/javascript'];
/**
 * @param response
 * @param request
 */
export async function pipeSaveToCache(response, request) {
  console.log('---', response?.header['Content-Type'], cacheMimeTypes.filter((mime) => response?.header['Content-Type']?.startsWith(mime)));
  if (response?.statusCode === 200 && cacheMimeTypes.filter((mime) => response?.header['Content-Type']?.startsWith(mime)).length) {
    const cacheFile = `/home/grisa/.caa/${xxhash.hash(Buffer.from(request.url), 0xCAFEBABE)}`;
    const writeBody = writeFile(cacheFile, response.body);
    const writeMeta = writeFile(
      `${cacheFile}.meta`,
      `${response.header['Content-Type']}\n${response.header['Content-Encoding']}`,
    );

      console.log('Save to disk))))  '+cacheFile)
    await Promise.all([writeBody, writeMeta]);
  }
  return response;
}
