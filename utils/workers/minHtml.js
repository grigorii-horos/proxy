import { parentPort } from 'worker_threads';

import minifier from 'html-minifier';
import replaceAll from 'string.prototype.replaceall';

parentPort.once('message', async (data) => {
  let bodyString = replaceAll(data, '<img', '<img loading="lazy"');
  bodyString = replaceAll(bodyString, '<iframe', '<iframe loading="lazy"');

  // bodyString = minifier.minify(bodyString, {
  //   collapseBooleanAttributes: true,
  //   collapseWhitespace: true,
  //   conservativeCollapse: true,
  //   continueOnParseError: true,
  //   decodeEntities: true,
  //   keepClosingSlash: false,
  //   minifyCSS: true,
  //   minifyJS: true,
  //   removeAttributeQuotes: true,
  //   removeComments: true,
  //   removeEmptyAttributes: true,
  //   sortAttributes: false,
  //   sortClassName: false,
  // });

  parentPort.postMessage({
  // @ts-ignore
    data: bodyString,
  });
  process.exit(0);
});
