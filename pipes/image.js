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
]);

const imagemagickArguments = (quality = '30', resize = false, config = {}) => {
  let parameterArguments = [
    '-strip',
    '-auto-orient',
    '-quality',
    `${quality}`,
  ];

  parameterArguments = resize
    ? [...parameterArguments, '-resize', '50%']
    : parameterArguments;

  parameterArguments = config.eink
    ? [...parameterArguments, '-colorspace', 'Gray', '-unsharp', '0x1+3+0']
    : [...parameterArguments, '-colorspace', 'sRGB', '-unsharp', '0x1+1+0', '-gaussian-blur', '0.01'];

  parameterArguments = [...parameterArguments,
    '-define',
    'webp:image-hint=picture,alpha-compression=1,alpha-filtering=2,alpha-quality=20,auto-filter=true,lossless=false,method=5,thread-level=1',
  ];

  return parameterArguments;
};

/**
 * @param response
 * @param request
 * @param config
 */
export async function pipeImage(response, request, config) {
  let newBody = await response.body;

  if (
    imageMimeTypes.has(response?.header['content-type'])
    && newBody.length > 128
  ) {
    let quality = config.eink ? 30 : 25;
    let resize = false;
    try {
      const oldSize = newBody.length;

      if (newBody.length > 1000 * 1000 * 10) {
        quality /= 8;
        resize = true;
      } else if (newBody.length > 1000 * 1000 * 5) {
        quality /= 5;
        resize = true;
      } else if (newBody.length > 1000 * 1000) {
        quality /= 5;
      } else if (newBody.length > 1000 * 100 * 5) {
        quality /= 2.7;
      } else if (newBody.length > 1000 * 100) {
        quality /= 1.7;
      }

      const fileToWrite = temporaryFile({ extension: 'img' });
      const fileConverted = temporaryFile({ extension: 'webp' });

      await writeFile(fileToWrite, newBody);

      await execa('gm', ['convert',
        `${fileToWrite}[0]`,
        ...imagemagickArguments(quality, resize, config),
        fileConverted,
      ]);

      newBody = await readFile(fileConverted);
      unlinkFile(fileToWrite);
      unlinkFile(fileConverted);

      if (!config.eink && oldSize < newBody.length) {
        console.log('Converted file is bigger than original');

        return {
          ...response,
        };
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
