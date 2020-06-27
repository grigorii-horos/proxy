import { parentPort } from 'worker_threads';
import sharp from 'sharp';

parentPort.once('message', async (data) => {
  let image = sharp(Buffer.from(data));

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

  parentPort.postMessage({
  // @ts-ignore
    data: newBody,
  });
  process.exit(0);
});
