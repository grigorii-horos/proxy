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
    imageMimeTypes.includes(response?.header['content-type'])
  ) {

    const newBody =  imageFn(response.body);


  
    return {
      ...response,
      body:  newBody ,
      header: {
        ...response.header,
        'content-type': 'image/webp' // response.header['content-type'],
      },
    };
  
  }

  return response;
}
