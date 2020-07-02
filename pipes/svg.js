import execa from 'execa';
import fs from 'fs';
import { promisify } from 'util';

import tempy from 'tempy';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlinkFile = promisify(fs.unlink);

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
      const fileToWrite = tempy.file({ extension: 'svg' });
      const fileConverted = tempy.file({ extension: 'svg' });

      await writeFile(fileToWrite, newBody);
      console.log(fileToWrite, fileConverted);

      console.log(await execa('svgcleaner', [fileToWrite, fileConverted]));

      newBody = await readFile(fileConverted);

      unlinkFile(fileToWrite);
      unlinkFile(fileConverted);

      return {
        ...response,
        body: newBody,
      };
    } catch (error) {
      return response;
    }
  }

  return response;
}
