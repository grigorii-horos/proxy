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
  'image/gif',
]);

const imagemagickArguments = (quality) => [
  '-colorspace',
  ' sRGB',
  '-strip',
  '+dither',
  '-auto-orient',
  '-interlace',
  'Plane',
  '-gaussian-blur',
  '0.01',
  '-quality',
  '15',
  '-interlace',
  'plane',

  '-define',
  'webp:image-hint=photo,lossless=false,partition-limit=90,method=5,thread-level=1',
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
    let quality = '20';
    try {
      const oldSize = newBody.length;

      if (newBody.length > 1000 * 100) {
        quality = '15';
      } else if (newBody.length > 1000 * 1000) {
        quality = '10';
      } else if (newBody.length > 1000 * 1000 * 10) {
        quality = '5';
      }

      const fileToWrite = temporaryFile({ extension: 'img' });
      const fileConverted = temporaryFile({ extension: 'webp' });

      await writeFile(fileToWrite, newBody);

      await execa('convert', [
        `${fileToWrite}[0]`,
        ...imagemagickArguments(quality),
        fileConverted,
      ]);

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
    } catch (error) {
      console.log(error);
      return response;
    }
  }

  return response;
}
