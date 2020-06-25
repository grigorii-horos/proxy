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
    try {
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

      if (svg.data.length < 10) {
        return response;
      }

      return {
        ...response,
        body: svg.data,
      };
    } catch (error) {
      return response;
    }
  }

  return response;
}
