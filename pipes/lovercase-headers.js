import lowercaseKeys from 'lowercase-keys';

/**
 * @param response
 */
export async function pipeLovercaseHeader(response) {
  const headers = lowercaseKeys(response.header || {});

  return {
    ...response,
    header: headers,
  };
}
