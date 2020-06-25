import fs from 'fs';
import { promisify } from 'util';
import xxhash from 'xxhash';

const writeFile = promisify(fs.writeFile);

/**
 * @param response
 * @param request
 */
export async function pipeSaveToCache(response, request) {
  if (response.statusCode === 200) {
    const cacheFile = `/home/grisa/.caa/${xxhash.hash(Buffer.from(request.url), 0xCAFEBABE)}`;
    await writeFile(cacheFile, response.body);
    await writeFile(
      `${cacheFile}.meta`,
      `${response.header['Content-Type']}\n${response.header['Content-Encoding']}`,
    );
    
  }
}
