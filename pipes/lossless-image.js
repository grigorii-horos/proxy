import { execa } from 'execa';
import { promisify } from 'node:util';
import fs from 'node:fs';

import { temporaryFile } from 'tempy';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlinkFile = promisify(fs.unlink);

const imageMimeTypes = new Set([
  'image/png',
  'image/gif',
  'image/x-icon',
]);

const imagemagickArguments = (quality = '30', config = {}) => {
  let parameterArguments = [
    '-strip',
    '+dither',
    '-auto-orient',
    '-quality',
    `${quality}`,
  ];

  parameterArguments = config.eink
    ? [...parameterArguments, '-grayscale', 'Rec709Luma', '-colorspace', 'gray', '-unsharp', '0x2+2+0']
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
export async function pipeLosslessImage(response, request, config) {
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

      await execa('convert', [
        fileToWrite,
        ...imagemagickArguments(config.eink ? '35' : '30', config),
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
    } catch {
      return response;
    }
  }

  return response;
}
