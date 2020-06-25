import sharp from 'sharp';
import prettyBytes from 'pretty-bytes';

const losslessMimeTypes = [
  'image/png',
  'image/gif',
];

/**
 * @param response
 * @param request
 */
export async function pipeLosslessImage(response, request) {
  if (losslessMimeTypes.includes(response?.header['Content-Type'])) {
    try {
      const oldSize = response.body.length;
      const image = sharp(response.body);

      const newBody = await image.metadata().then((metadata) => {
        let img = image;
        if (metadata.width * metadata.height > 1000000) {
          img = img.resize(Math.round(metadata.width / 2));
        }

        return img
          .toFormat('webp', {
            lossless: false,
            alphaQuality: 50,
            quality: 70,
            reductionEffort: 5,
          })
          .toBuffer();
      });

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
        body: newSize < oldSize
          ? newBody
          : response.body,
        header: {
          ...response.header,
          'Content-Type': newSize < oldSize
            ? 'image/webp'
            : response.header['Content-Type'],
        },
      };
    } catch (error) {
      return response;
    }
  }
  return response;
}
