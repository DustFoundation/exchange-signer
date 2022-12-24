import type { AxiosRequestConfig } from 'axios';
import { createHmac } from 'node:crypto';

export function signRequest(
  config: AxiosRequestConfig,
  data: { key: string; secret: string },
): AxiosRequestConfig {
  const now = Date.now();
  const nonce = now - 1000;

  const sha256String = createHmac('sha256', data.secret)
    .update(
      `${config.url}${now}${data.key}${
        config.data
          ? JSON.stringify(config.data)
          : config.params && Object.keys(config.params).length
          ? `${Object.keys(config.params)
              .sort()
              .reduce((a, b) => a + b + config.params[b], '')}`
          : ''
      }${nonce}`,
    )
    .digest('hex');

  config['data'] = {
    id: now,
    method: config.url,
    params: config.params,
    api_key: data.key,
    sig: sha256String,
    nonce,
  };

  return config;
}
