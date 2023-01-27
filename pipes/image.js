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

const imagemagickArguments = (quality = '30', config = {}) => {
  let parameterArguments = [
    '-strip',
    '-auto-orient',
    '-quality',
    `${quality}`,
  ];

  parameterArguments = config.eink
    ? [...parameterArguments, '-grayscale', 'Rec709luminance', '-colorspace', 'gray', '-unsharp', '0x2+2+0']
    : [...parameterArguments, '-colorspace', 'sRGB', '-unsharp', '0x2+1+0', '-gaussian-blur', '0.01'];

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
    let quality = config.eink ? '30' : '20';
    try {
      const oldSize = newBody.length;

      if (newBody.length > 1000 * 100) {
        quality = config.eink ? '25' : '15';
      } else if (newBody.length > 1000 * 1000) {
        quality = config.eink ? '20' : '10';
      } else if (newBody.length > 1000 * 1000 * 10) {
        quality = config.eink ? '15' : '5';
      }

      const fileToWrite = temporaryFile({ extension: 'img' });
      const fileConverted = temporaryFile({ extension: 'webp' });

      await writeFile(fileToWrite, newBody);

      await execa('convert', [
        `${fileToWrite}[0]`,
        ...imagemagickArguments(quality, config),
        fileConverted,
      ]);

      newBody = await readFile(fileConverted);
      unlinkFile(fileToWrite);
      unlinkFile(fileConverted);

      if (oldSize < newBody.length) {
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
