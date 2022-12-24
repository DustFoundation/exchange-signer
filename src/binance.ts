import type { AxiosRequestConfig } from 'axios';
import { createHmac } from 'node:crypto';

export function signRequest(
  config: AxiosRequestConfig,
  data: { key: string; secret: string },
): AxiosRequestConfig {
  config.headers ??= {};
  config.headers!['X-MBX-APIKEY'] = data.key;

  config.params = { ...config.params, timestamp: Date.now() };
  config.params.signature = createHmac('sha256', data.secret)
    .update(new URLSearchParams({ ...config.params }).toString())
    .digest('hex');

  return config;
}
