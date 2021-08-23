import { env } from './.env';

export const environment = {
  version: env.npm_package_version,
  production: true,
};
