import type { AxiosRequestConfig } from 'axios';
import { createHmac } from 'node:crypto';

export function signRequestOKX(
  config: AxiosRequestConfig,
  data: { key: string; secret: string; passhprase: string },
): AxiosRequestConfig {
  const isoTimestamp = new Date().toISOString();

  config.headers!['OK-ACCESS-TIMESTAMP'] = isoTimestamp;
  config.headers!['OK-ACCESS-KEY'] = data.key;
  config.headers!['OK-ACCESS-PASSPHRASE'] = data.passhprase;
  config.headers!['OK-ACCESS-SIGN'] = createHmac('sha256', data.secret)
    .update(
      `${isoTimestamp}${config.method!.toUpperCase()}${config.url}${
        config.data
          ? JSON.stringify(config.data)
          : config.params && Object.keys(config.params).length
          ? `?${new URLSearchParams(config.params).toString()}`
          : ''
      }`,
    )
    .digest('base64');

  return config;
}
