import tempWrite from 'temp-write';
import execa from 'execa';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

/**
 * @param response
 * @param request
 */
export async function pipeSvg(response, request) {
  if (
    response?.header['content-type']?.startsWith('image/svg+xml')
  ) {
    const filePath = await tempWrite(await response.body, 'img.svg');

    try {
      await execa('svgcleaner', [filePath, `${filePath}.tmp.svg`]);

      const newB = await readFile(`${filePath}.tmp.svg`);

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
