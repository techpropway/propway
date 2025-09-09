import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'propway_login_5465', // replace with process.env.JWT_SECRET
    });
  }

  async validate(payload: any) {
    // whatever you return here will be available as req.user
    return { userId: payload.sub, email: payload.email };
  }
}
