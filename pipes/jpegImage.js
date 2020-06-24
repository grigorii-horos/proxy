import sharp from "sharp";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import xxhash from "xxhash";

const writeFile = promisify(fs.writeFile);

export async function pipeJpegImage(response, request) {
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

    const cacheFile =
      "/home/grisa/.caa/" + xxhash.hash(Buffer.from(request.url), 0xcafebabe);
    await writeFile(cacheFile, newSize < oldSize ? newBody : response.body);
    await writeFile(
      cacheFile + ".mime",
      newSize < oldSize ? "image/webp" : "image/jpeg"
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
