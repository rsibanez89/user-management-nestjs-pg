import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { Auth0Config } from '../../config/auth0.config';

interface JwtPayload {
  sub: string;
  iss: string;
  aud: string | string[];
  iat: number;
  exp: number;
  scope?: string;
  permissions?: string[];
}

/**
 * Passport strategy that validates Auth0 JWTs using JWKS.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const auth0 = configService.getOrThrow<Auth0Config>('auth0');

    const options: StrategyOptionsWithoutRequest = {
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${auth0.domain}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: auth0.audience,
      issuer: `https://${auth0.domain}/`,
      algorithms: ['RS256'],
    };

    super(options);
  }

  /** Returns the validated payload, attached to `request.user`. */
  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
