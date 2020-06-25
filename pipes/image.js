import sharp from 'sharp';
import prettyBytes from 'pretty-bytes';

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
    try {
      const oldSize = response.body.length;
      let image = sharp(response.body);

      const metadata = await image.metadata();

      if (metadata.width * metadata.height > 1000000) {
        image = image.resize(Math.round(metadata.width / 2));
      }

      const newBody = await image
        .toFormat('webp', {
          lossless: false,
          quality: 60,
          reductionEffort: 5,
        })
        .toBuffer();

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
    } catch (error) {
      return response;
    }
  }

  return response;
}
