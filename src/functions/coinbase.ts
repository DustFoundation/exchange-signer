import type { AxiosRequestConfig } from 'axios';
import { createHmac } from 'node:crypto';

export function signRequestCOINBASE(
  config: AxiosRequestConfig,
  data: { key: string; secret: string },
): AxiosRequestConfig {
  const now = Math.trunc(Date.now() / 1000);

  config.headers!['CB-ACCESS-TIMESTAMP'] = now;
  config.headers!['CB-ACCESS-KEY'] = data.key;
  config.headers!['CB-ACCESS-SIGN'] = createHmac('sha256', data.secret)
    .update(
      `${now}${config.method!.toUpperCase()}${config.url}${
        config.data
          ? JSON.stringify(config.data)
          : config.params && Object.keys(config.params).length
          ? `?${new URLSearchParams(config.params).toString()}`
          : ''
      }`,
    )
    .digest('hex');

  return config;
}
