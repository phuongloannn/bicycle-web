import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard'; // ✅ Sửa đường dẫn
import { RolesGuard } from '../../modules/auth/guards/roles.guard'; // ✅ Sửa đường dẫn
import { Roles } from './roles.decorator';
export function Auth(...roles: string[]) {
  return applyDecorators(
    Roles(...roles), // attaches required roles
    UseGuards(JwtAuthGuard, RolesGuard), // applies both guards
  );
}