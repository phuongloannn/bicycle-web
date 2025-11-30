import { Injectable } from '@nestjs/common';
import { unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  deleteFile(filename: string): boolean {
    try {
      const filePath = join(process.cwd(), 'uploads', 'products', filename);
      unlinkSync(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
}