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
    imageMimeTypes.includes(response?.header['content-type'])
  ) {

    const newBody =  imageFn(response.body);



    

    return {
      ...response,
      body:  newBody,//: response.body,
      header: {
        ...response.header,
        'content-type':  'image/webp' //: response.header['content-type'],
      },
    };
  }

  return response;
}
