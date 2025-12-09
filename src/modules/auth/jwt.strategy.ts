// auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '516b508ace08b91b46ed9b88b9ef0361', // make sure this matches your jwtService config
    });
    console.log('>>> JwtStrategy initialized with secret:', configService.get<string>('JWT_SECRET'));

  }

  async validate(payload: any) {
    // This will be available as request.user
    console.log('Jwt payload:', payload);
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
