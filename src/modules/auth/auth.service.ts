import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/requests/register-user.dto';
import { LoginDto } from './dto/requests/login.dto';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // ✅ Method validateUser cho LocalStrategy
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { email } });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(dto: RegisterUserDto) {
    // ✅ Kiểm tra email đã tồn tại
    const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // ✅ Mã hoá mật khẩu
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // ✅ Tạo user mới
    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role === 'admin' ? UserRole.ADMIN : UserRole.USER,
    });

    // ✅ Lưu user vào DB
    const savedUser = await this.userRepo.save(user);

    // ✅ Tạo JWT token - THÊM NAME
    const payload = { 
      sub: savedUser.id, 
      email: savedUser.email, 
      role: savedUser.role,
      name: savedUser.name // ✅ THÊM NAME VÀO PAYLOAD
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: { 
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt
      },
      accessToken,
    };
  }

  async login(dto: LoginDto) {
    console.log('🔧 [Backend AuthService] Login attempt for:', dto.email);
    
    // ✅ Tìm user theo email
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    console.log('🔧 [Backend AuthService] User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('❌ [Backend AuthService] User not found');
      throw new UnauthorizedException('Invalid email or password');
    }

    // ✅ Kiểm tra mật khẩu
    console.log('🔧 [Backend AuthService] Checking password...');
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    console.log('🔧 [Backend AuthService] Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ [Backend AuthService] Invalid password');
      throw new UnauthorizedException('Invalid email or password');
    }

    // ✅ Tạo JWT token - THÊM NAME
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role,
      name: user.name // ✅ THÊM NAME VÀO PAYLOAD
    };
    const accessToken = this.jwtService.sign(payload);

    console.log('✅ [Backend AuthService] Login successful, token created');

    return {
      user: { 
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      accessToken,
    };
  }

  // ✅ Method getProfile
  async getProfile(userId: number) {
    const user = await this.userRepo.findOne({ 
      where: { id: userId },
      select: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt']
    });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    return user;
  }
}