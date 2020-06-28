import Svgo from 'svgo';
import prettyBytes from 'pretty-bytes';
import tempWrite from 'temp-write';
import execa from 'execa';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

const svgo = new Svgo({

});

/**
 * @param response
 * @param request
 */
export async function pipeSvg(response, request) {
  if (
    response?.header['content-type']?.startsWith('image/svg+xml')
  ) {
    const oldSize = response.body.length;
    const filePath = await tempWrite(response.body, 'img.svg');

    try {
      await execa('svgcleaner', [filePath, `${filePath}.tmp.svg`]);

      const newB = await readFile(`${filePath}.tmp.svg`);

      const newSize = newB.length;
      console.log(
        `Compres Image: Old - ${
          prettyBytes(oldSize)
        } New - ${
          prettyBytes(newSize)
        } Compression - ${
          Math.floor((100 * newSize) / oldSize)
        }%`,
      );

      return {
        ...response,
        body: newB,
      };
    } catch (error) {
      return response;
    }
  }

  return response;
}
