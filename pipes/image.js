import { execa } from 'execa';
import { promisify } from 'node:util';
import fs from 'node:fs';

import { temporaryFile } from 'tempy';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlinkFile = promisify(fs.unlink);

const imageMimeTypes = new Set([
  'image/jpeg',
  'image/webp',
  'image/x-icon',
]);

const imagemagickArguments = [
  '-strip',
  '+dither',
  '-auto-orient',
  '-interlace', 'Plane',
  '-gaussian-blur', '0.01',
  '-quality', '20',
  '-define', 'webp:image-hint=photo,lossless=false,partition-limit=90,method=5,thread-level=1',
];

/**
 * @param response
 * @param request
 */
export async function pipeImage(response, request) {
  let newBody = await response.body;

  if (
    imageMimeTypes.has(response?.header['content-type'])
    && newBody.length > 128
  ) {
    try {
      const oldSize = newBody.length;

      const fileToWrite = temporaryFile({ extension: 'img' });
      const fileConverted = temporaryFile({ extension: 'webp' });

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
