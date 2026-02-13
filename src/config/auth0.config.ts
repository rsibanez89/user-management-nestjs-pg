import { registerAs } from '@nestjs/config';

export interface Auth0Config {
  domain: string;
  audience: string;
}

export default registerAs(
  'auth0',
  (): Auth0Config => ({
    domain: process.env['AUTH0_DOMAIN'] ?? '',
    audience: process.env['AUTH0_AUDIENCE'] ?? '',
  }),
);
