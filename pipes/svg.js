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
  let newBody = await response.body;

  if (
    response?.header['content-type']?.startsWith('image/svg+xml')
     && newBody.length > 128
  ) {
    try {
      const filePath = await tempWrite(newBody, 'img.svg');

     console.log('++++', await execa('svgcleaner', [filePath, `${filePath}.tmp.svg`]))

      newBody = await readFile(`${filePath}.tmp.svg`);

      return {
        ...response,
        body: newBody,
      };
    } catch (error) {
      console.log('-----', error);
      return response;
    }
  }

  return response;
}
