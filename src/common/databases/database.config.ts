import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'mysql',
    host: configService.get<string>('DB_HOST') || '127.0.0.1',
    port: parseInt(configService.get<string>('DB_PORT') || '3306', 10),
    username: configService.get<string>('DB_USER') || 'root',
    password: configService.get<string>('DB_PASS') || undefined,
    database: configService.get<string>('DB_NAME') || 'sms_demo',
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: false,
  };
};
