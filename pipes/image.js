import sharp from 'sharp';

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
    let image = sharp(await response.body);

    const metadata = await image.metadata();

    if (metadata.width > 1500) {
      image = image.resize(Math.round(metadata.width / 1.5));
    } else if (metadata.width > 2500) {
      image = image.resize(Math.round(metadata.width / 2));
    }

    const newBody = image
      .toFormat('webp', {
        lossless: false,
        quality: 60,
        reductionEffort: 5,
      })
      .toBuffer();

    return {
      ...response,
      body: newBody,
      header: {
        ...response.header,
        'content-type': 'image/webp', // response.header['content-type'],
      },
    };
  }

  return response;
}
