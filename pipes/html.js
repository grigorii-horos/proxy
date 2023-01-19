import axios from 'axios';
import replaceAll from 'string.prototype.replaceall';
import startWorker from '../start-worker.js';

/**
 * @param response
 * @param request
 */
export async function pipeHtml(response, request) {
  if (response?.header['content-type']?.startsWith('text/html')) {
    let bodyString = (await response.body).toString();

    bodyString = replaceAll(
      bodyString,
      /<(img|iframe)/gm,
      '<$1 loading="lazy"',
    );
    bodyString = replaceAll(
      bodyString,
      /(<(?:script|link).*)integrity=(:?'|")sha512-.*?(:?'|")/gm,
      '$1',
    );

    const regexp = /<img\s+[^>]*?src=("|')([^"']+)\1/g;
    const array = [...bodyString.matchAll(regexp)];
    if (response.statusCode >= 200 && response.statusCode <= 300) {
      const base = request.url;

      const images = array
        .map((img) => img[2].toLowerCase())
        .filter(
          (imgSource) => imgSource.endsWith('.png')
            || imgSource.endsWith('.jpg')
            || imgSource.endsWith('.jpeg')
            || imgSource.endsWith('.webp')
            || imgSource.endsWith('.gif')
            || imgSource.endsWith('.svg'),
        );

      images.map(async (image) => {
        const url = new URL(image, base);
        try {
          const responseImage = await axios(url.href, {
            headers: request.header,
            responseType: 'arraybuffer',
          });

          if (responseImage.status === 200) {
            try {
              startWorker(
                { ...request, url: url.href },
                {
                  ...response,

                  statusCode: responseImage.status,
                  header: responseImage.headers,
                  body: responseImage.data,
                },
              );
            } catch (error) {
              console.log(error);
            }
          }
        } catch {}
      });
    }

    return {
      ...response,
      header: response.header,
      body: bodyString,
    };
  }

  return response;
}
