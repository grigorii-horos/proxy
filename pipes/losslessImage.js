import tempWrite from 'temp-write';
import execa from 'execa';
import { promisify } from 'util';
import fs from 'fs';

import tempy from 'tempy';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlinkFile = promisify(fs.unlink);

const imageMimeTypes = [
  'image/png',
  'image/gif',
];

const imagemagickArguments = [
  // '-filter',  'Triangle',
  // '-define',  'filter:support=2',
  // '-unsharp', '0.25x0.25+8+0.065',
  // '-dither', 'None',
  // '-posterize', '136',
  // '-interlace', 'none',
  '-colorspace', 'sRGB',
  '-define', 'webp:image-hint=picture,method=5,thread-level=8',
  '-strip',
  '-auto-orient',
  '-quality', '70',
];

/**
 * @param response
 * @param request
 */
export async function pipeLosslessImage(response, request) {
  let newBody = await response.body;

  if (
    imageMimeTypes.includes(response?.header['content-type'])
    && newBody.length > 128
  ) {
    try {
      const oldSize = newBody.length;

      const fileToWrite = tempy.file({ extension: 'img' });
      const fileConverted = tempy.file({ extension: 'webm' });

      await writeFile(fileToWrite, newBody);

      if (newBody.length > 1024 * 1024) {
        await execa('convert', [fileToWrite, '-resize', '75%', ...imagemagickArguments, fileConverted]);
      } else {
        await execa('convert', [fileToWrite, ...imagemagickArguments, fileConverted]);
      }
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
          'content-type': 'image/webp', // response.header['content-type'],
        },
      };
    } catch (error) {
      return response;
    }
  }

  return response;
}
