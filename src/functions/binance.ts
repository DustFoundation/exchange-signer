import type { AxiosRequestConfig } from 'axios';
import { createHmac } from 'node:crypto';

export function signRequestBINANCE(
  config: AxiosRequestConfig,
  data: { key: string; secret: string },
): AxiosRequestConfig {
  config.headers!['X-MBX-APIKEY'] = data.key;
  config.params.signature = createHmac('sha256', data.secret)
    .update(new URLSearchParams({ ...config.params }).toString())
    .digest('hex');

  return config;
}
