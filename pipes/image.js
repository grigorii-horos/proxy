import sharp from 'sharp';
import tempWrite from 'temp-write';
import execa from 'execa';
import { promisify } from 'util';
import fs from 'fs';

const readFile = promisify(fs.readFile);

const imageMimeTypes = [
  'image/jpeg',
  'image/webp',
];

const arguments_ = [
  // '-filter',  'Triangle',
  // '-define',  'filter:support=2',
  // '-unsharp', '0.25x0.25+8+0.065',
  // '-dither', 'None',
  // '-posterize', '136',
  // '-interlace', 'none',
  '-colorspace', 'sRGB',
  '-define', 'webp:image-hint=photo,partition-limit=90,method=4,thread-level=8',
  '-strip',
  '-auto-orient',
  '-quality', '60',
];

/**
 * @param response
 * @param request
 */
export async function pipeImage(response, request) {
  let newBody = await response.body;

  if (
    imageMimeTypes.includes(response?.header['content-type'])
    && newBody.length > 128
  ) {
    try {
      const filePath = await tempWrite(newBody, 'img');

      if (newBody.length > 1024 * 1024 * 1024) {
        await execa('convert', [filePath, '-resize', '50%', ...arguments_, `${filePath}.webp`]);
      }else{
        await execa('convert', [filePath, ...arguments_, `${filePath}.webp`]);
      }
      newBody = await readFile(`${filePath}.webp`);

      return {
        ...response,
        body: newBody,
        header: {
          ...response.header,
          'content-type': 'image/webp', // response.header['content-type'],
        },
      };
    } catch (error) {
      console.log('-----', error);
      return response;
    }
  }

  return response;
}
