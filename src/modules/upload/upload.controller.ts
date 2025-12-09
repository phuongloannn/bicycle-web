import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Logger,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { UploadService } from './upload.service';
import type { Request } from 'express';

@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  @Post('product-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    this.logger.log('=== 🎯 BACKEND UPLOAD DEBUG ===');
    
    // 🔥 LOG TẤT CẢ HEADERS
    this.logger.log('📥 ALL REQUEST HEADERS:');
    Object.keys(req.headers).forEach(key => {
      this.logger.log(`  ${key}: ${req.headers[key]}`);
    });

    // 🔥 LOG REQUEST CHI TIẾT
    this.logger.log('📥 REQUEST DETAILS:');
    this.logger.log(`  Method: ${req.method}`);
    this.logger.log(`  URL: ${req.url}`);
    this.logger.log(`  Content-Type: ${req.headers['content-type']}`);
    this.logger.log(`  Content-Length: ${req.headers['content-length']}`);
    this.logger.log(`  Origin: ${req.headers['origin']}`);

    if (!file) {
      this.logger.error('❌ NO FILE OBJECT RECEIVED');
      this.logger.error('Possible issues:');
      this.logger.error('  1. Field name not "image"');
      this.logger.error('  2. CORS blocking multipart/form-data');
      this.logger.error('  3. File size too large');
      this.logger.error('  4. Multer config issue');
      
      // 🔥 THỬ LOG REQUEST BODY
      this.logger.log('📥 Request body type:', typeof req.body);
      this.logger.log('📥 Request body keys:', Object.keys(req.body || {}));
      
      throw new BadRequestException('No file received - check field name and CORS');
    }

    this.logger.log('✅ FILE RECEIVED SUCCESSFULLY!');
    this.logger.log('📁 File details:', {
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      fieldname: file.fieldname,
      filename: file.filename
    });

    const appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    const result = {
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      path: `/uploads/products/${file.filename}`,
      url: `${appUrl}/uploads/products/${file.filename}`,
    };

    this.logger.log('🎉 UPLOAD SUCCESS:', result);
    
    return result;
  }

  // 🔥 THÊM ENDPOINT MỚI CHO ACCESSORIES - ĐÃ SỬA
  @Post('accessory-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadAccessoryImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    this.logger.log('=== 🎯 ACCESSORY IMAGE UPLOAD ===');
    
    // Debug log
    this.logger.log('📥 Accessory upload request received');
    this.logger.log(`  Content-Type: ${req.headers['content-type']}`);
    this.logger.log(`  Origin: ${req.headers['origin']}`);

    if (!file) {
      this.logger.error('❌ NO FILE RECEIVED FOR ACCESSORY');
      throw new BadRequestException('No file received for accessory');
    }

    this.logger.log('✅ ACCESSORY FILE RECEIVED:', {
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      filename: file.filename // 🔥 THÊM FILENAME THỰC TẾ
    });

    // 🔥 QUAN TRỌNG: Dùng file.filename thực tế từ multer
    const appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    const result = {
      filename: file.filename, // 🔥 DÙNG FILENAME THỰC TẾ
      originalName: file.originalname,
      size: file.size,
      url: `${appUrl}/uploads/products/${file.filename}`, // 🔥 DÙNG FILENAME THỰC TẾ
    };

    this.logger.log('🎉 ACCESSORY UPLOAD SUCCESS:', result);
    
    return result;
  }
}