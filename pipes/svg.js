import { execa } from "execa";
import fs from "node:fs";
import { promisify } from "node:util";

import { temporaryFile } from "tempy";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlinkFile = promisify(fs.unlink);

const svgCleanerArguments = [
  "--remove-gradient-attributes=true",
  "--apply-transform-to-paths=true",
  "--coordinates-precision=5",
  "--properties-precision=5",
  "--transforms-precision=7",
  "--paths-coordinates-precision=7",
  "--multipass",
  "--quiet",
];

/**
 * @param {{ body: any; header: { [x: string]: string; }; }} response
 * @param {any} request
 */
export async function pipeSvg(response, request) {
  let newBody = await response.body;

  if (
    response?.header["content-type"]?.startsWith("image/svg+xml") &&
    newBody.length > 128
  ) {
    try {
      const fileToWrite = temporaryFile({ extension: "svg" });
      const fileConverted = temporaryFile({ extension: "svg" });

      await writeFile(fileToWrite, newBody);

      await execa("svgcleaner", [
        fileToWrite,
        ...svgCleanerArguments,
        fileConverted,
      ]);

      newBody = await readFile(fileConverted);

      unlinkFile(fileToWrite);
      unlinkFile(fileConverted);

      return {
        ...response,
        body: newBody,
      };
    } catch {
      return response;
    }
  }

  return response;
}
