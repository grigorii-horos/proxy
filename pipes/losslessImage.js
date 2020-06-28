import prettyBytes from 'pretty-bytes';

import { imageFn } from '../utils/losslessImage.js';

const imageMimeTypes = [
  'image/png',
  'image/gif',
];

/**
 * @param response
 * @param request
 */
export async function pipeLosslessImage(response, request) {
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
