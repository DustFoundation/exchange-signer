import type { AxiosRequestConfig } from 'axios';
import { createHmac } from 'node:crypto';

export function signRequest(
  config: AxiosRequestConfig,
  data: { key: string; secret: string; recvWindow?: number },
): AxiosRequestConfig {
  const now = Date.now();
  const recvWindow = data.recvWindow ?? 60_000;

  config.headers ??= {};
  config.headers!['X-BAPI-TIMESTAMP'] = now.toString();
  config.headers!['X-BAPI-RECV-WINDOW'] = recvWindow;
  config.headers!['X-BAPI-API-KEY'] = data.key;
  config.headers!['X-BAPI-SIGN-TYPE'] = '2';
  config.headers!['X-BAPI-SIGN'] = createHmac('sha256', data.secret)
    .update(
      `${now}${data.key}${recvWindow}${
        config.data
          ? JSON.stringify(config.data)
          : config.params && Object.keys(config.params).length
          ? new URLSearchParams(config.params).toString()
          : ''
      }`,
    )
    .digest('hex');

  return config;
}
