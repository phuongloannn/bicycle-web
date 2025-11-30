import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule, // <---- enable passport
    JwtModule.register({
      secret: process.env.JWT_SECRET || '516b508ace08b91b46ed9b88b9ef0361',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], //register JwtStrategy
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
