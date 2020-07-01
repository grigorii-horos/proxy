import sharp from 'sharp';
import tempWrite from 'temp-write';
import execa from 'execa';
import { promisify } from 'util';
import fs from 'fs';

const readFile = promisify(fs.readFile);

const imageMimeTypes = [
  'image/png',
  'image/gif',
];

var args = [
   '-filter',
   'Triangle',
   '-define',
   'filter:support=2',
   '-unsharp','0.25x0.25+8+0.065',
   '-dither','None',
   '-posterize','136',
   '-interlace','none',
  '-colorspace', 'sRGB',
   '-define','webp:image-hint=photo,method=6,thread-level=8',
  '-strip',
  '-auto-orient',
        '-quality', '82',


];

/**
 * @param response
 * @param request
 */
export async function pipeLosslessImage(response, request) {
  if (
    imageMimeTypes.includes(response?.header['content-type'])
  ) {

    const filePath = await tempWrite(await response.body, 'img');

      await execa('convert', [filePath, ...args, `${filePath}.webp`]);

      const newBody = await readFile(`${filePath}.webp`);

    return {
      ...response,
      body: newBody,
      header: {
        ...response.header,
        'content-type': 'image/webp', // response.header['content-type'],
      },
    };
  }

  return response;
}
