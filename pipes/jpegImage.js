import sharp from "sharp";

export async function pipeJpegImage(response) {
  if (response?.header["Content-Type"] === "image/jpeg") {
    const oldSize = response.body.length;
    const image = sharp(response.body);

    const newBody = await image.metadata().then(function (metadata) {
      let img = image;
      if (metadata.width * metadata.height > 1000000) {
        img = img.resize(Math.round(metadata.width / 2));
      }

      return img
        .toFormat("webp", {
          lossless: false,
          quality: 30,
          reductionEffort: 1,
        })
        .toBuffer();
    });

    const newSize = newBody.length;

    console.log(
      "Compres Image: Old - " +
        oldSize +
        " New - " +
        newSize +
        " Compression - " +
        newSize / oldSize
    );
    return {
      ...response,
      body: newSize < oldSize ? newBody : response.body,
      header: {
        ...response.header,
        "Content-Type": newSize < oldSize ? "image/webp" : "image/jpeg",
      },
    };
  }
  return response;
}
