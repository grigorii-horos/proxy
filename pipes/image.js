import sharp from 'sharp';
import prettyBytes from 'pretty-bytes';

import { imageFn } from '../utils/image.js';

const imageMimeTypes = [
  'image/jpeg',
  'image/webp',
];

/**
 * @param response
 * @param request
 */
export async function pipeImage(response, request) {
  if (
    imageMimeTypes.includes(response?.header['Content-Type'])
  ) {
    // try {
    const oldSize = response.body.length;

    const newBody = await imageFn(response.body);

    const newSize = newBody.length;

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
      body: newSize < oldSize ? newBody : response.body,
      header: {
        ...response.header,
        'Content-Type': newSize < oldSize ? 'image/webp' : response.header['Content-Type'],
      },
    };
    // } catch (error) {
    //   return response;
    // }
  }

  return response;
}
