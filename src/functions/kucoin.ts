import type { AxiosRequestConfig } from 'axios';
import { createHmac } from 'node:crypto';

export function signRequestKUCOIN(
  config: AxiosRequestConfig,
  data: { key: string; secret: string; passphrase: string },
): AxiosRequestConfig {
  const now = Date.now();

  config.headers!['KC-API-TIMESTAMP'] = now.toString();
  config.headers!['KC-API-KEY-VERSION'] = '2';
  config.headers!['KC-API-KEY'] = data.key;
  config.headers!['KC-API-PASSPHRASE'] = createHmac('sha256', data.secret)
    .update(data.passphrase)
    .digest('base64');
  config.headers!['KC-API-SIGN'] = createHmac('sha256', data.secret)
    .update(
      `${now}${config.method!.toUpperCase()}${config.url}${
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
