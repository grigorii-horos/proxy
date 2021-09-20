import execa from 'execa';
import { promisify } from 'node:util';
import fs from 'node:fs';

import tempy from 'tempy';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlinkFile = promisify(fs.unlink);

const imageMimeTypes = new Set([
  'image/png',
  'image/gif',
]);

const imagemagickArguments = [
  '-colors', '512',
  '-define', 'webp:image-hint=picture,alpha-compression=1,alpha-filtering=2,alpha-quality=40,auto-filter=true,lossless=false,method=5,thread-level=4',
  '-strip',
  '-auto-orient',
  '-quality', '50',
];

/**
 * @param response
 * @param request
 */
export async function pipeLosslessImage(response, request) {
  let newBody = await response.body;

  if (
    imageMimeTypes.has(response?.header['content-type'])
    && newBody.length > 128
  ) {
    try {
      const oldSize = newBody.length;

      const fileToWrite = tempy.file({ extension: 'img' });
      const fileConverted = tempy.file({ extension: 'webp' });

      await writeFile(fileToWrite, newBody);

      await execa('convert', [fileToWrite, ...imagemagickArguments, fileConverted]);

      newBody = await readFile(fileConverted);
      unlinkFile(fileToWrite);
      unlinkFile(fileConverted);

      if (oldSize < newBody.length) {
        throw new Error('Converted file is bigger than original');
      }

      return {
        ...response,
        body: newBody,
        header: {
          ...response.header,
          'content-type': 'image/webp',
        },
      };
    } catch {
      return response;
    }
  }

  return response;
}
