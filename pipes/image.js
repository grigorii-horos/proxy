import sharp from 'sharp';
import fs from 'fs';
import { promisify } from 'util';
import xxhash from 'xxhash';
import prettyBytes from 'pretty-bytes';

const writeFile = promisify(fs.writeFile);

/**
 * @param response
 * @param request
 */
export async function pipeImage(response, request) {
  if (response?.header['Content-Type'] === 'image/jpeg') {
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
          quality: 1,
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
        parseInt(`${(100 * newSize) / oldSize}`, 10)}%`,
    );

    const cacheFile = `/home/grisa/.caa/${xxhash.hash(Buffer.from(request.url), 0xCAFEBABE)}`;
    await writeFile(cacheFile, newSize < oldSize ? newBody : response.body);
    await writeFile(
      `${cacheFile}.mime`,
      newSize < oldSize ? 'image/webp' : 'image/jpeg',
    );

    return {
      ...response,
      body: newSize < oldSize ? newBody : response.body,
      header: {
        ...response.header,
        'Content-Type': newSize < oldSize ? 'image/webp' : 'image/jpeg',
      },
    };
  }
  return response;
}
