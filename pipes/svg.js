import { optimize } from 'svgo';

/**
 * @param {{ body: any; header: { [x: string]: string; }; }} response
 * @param {any} request
 */
export async function pipeSvg(response, request) {
  const newBody = await response.body;

  if (
    response?.header['content-type']?.startsWith('image/svg+xml')
    && newBody.length > 128
  ) {
    try {
      const result = optimize(newBody, {
        // optional but recommended field
        // path: 'path-to.svg',
        // all config fields are also available here
        multipass: true,

        plugins: [
          'removeDoctype',
          'removeXMLProcInst',
          'removeComments',
          'removeMetadata',
          'removeEditorsNSData',
          'cleanupAttrs',
          'mergeStyles',
          'minifyStyles',
          // 'cleanupIDs',
          'removeUselessDefs',
          'cleanupNumericValues',
          'convertColors',
          'removeUnknownsAndDefaults',
          'removeNonInheritableGroupAttrs',
          'removeUselessStrokeAndFill',
          'removeViewBox',
          'cleanupEnableBackground',
          'removeHiddenElems',
          'removeEmptyText',
          'convertShapeToPath',
          'convertEllipseToCircle',
          'moveElemsAttrsToGroup',
          'moveGroupAttrsToElems',
          'collapseGroups',
          'convertTransform',
          'removeEmptyAttrs',
          'removeEmptyContainers',
          'mergePaths',
          'removeUnusedNS',
          'sortDefsChildren',
          'removeTitle',
          'removeDesc',
          'convertStyleToAttrs',
          'sortAttrs',
          'reusePaths',
        ],

        js2svg: {
          indent: 2, // string with spaces or number of spaces. 4 by default
          pretty: false, // boolean, false by default
        },
      });

      if (!result.data) {
        return result;
      }

      return {
        ...response,
        body: result.data,
      };
    } catch {
      return response;
    }
  }

  return response;
}
