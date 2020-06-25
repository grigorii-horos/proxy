import Svgo from 'svgo';
import prettyBytes from 'pretty-bytes';

const svgo = new Svgo({

});

/**
 * @param response
 * @param request
 */
export async function pipeSvg(response, request) {
  if (
    response?.header['Content-Type']?.startsWith('image/svg+xml')
  ) {
    const oldSize = response.body.length;

    const svg = await svgo.optimize(response.body);
    const newSize = svg.data.length;

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
      body: svg.data,

    };
  }

  return response;
}
