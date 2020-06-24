import sharp from "sharp";

export async function pipePngImage(response) {
  if (response?.header["Content-Type"] === "image/png") {
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
          alphaQuality: 10,
          quality: 40,
          reductionEffort: 2,
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
        "Content-Type": newSize < oldSize ? "image/webp" : "image/png",
      },
    };
  }
  return response;
}
