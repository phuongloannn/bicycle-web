import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { AccessoriesService } from './accessories.service';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';

@Controller('api/accessories')
export class AccessoriesController {
  constructor(private readonly accessoriesService: AccessoriesService) {}

  // GET ALL ACCESSORIES
  @Get()
  findAll() {
    return this.accessoriesService.findAll();
  }

  // 🔥 NEW: GET COMPATIBLE ACCESSORIES BY BIKE TYPE
  @Get('compatible/:bikeType')
  findCompatibleByBikeType(@Param('bikeType') bikeType: string) {
    return this.accessoriesService.findCompatibleByBikeTypeName(bikeType);
  }

  // 🔥 NEW: GET COMPATIBLE ACCESSORIES BY PRODUCT ID
  @Get('compatible-with-product/:productId')
  async findCompatibleByProductId(@Param('productId') productId: string) {
    return this.accessoriesService.findCompatibleByProductId(+productId);
  }

  // 🔥 NEW: GET COMPATIBLE ACCESSORIES BY BIKE TYPE ID (number)
  @Get('compatible/bike-type-id/:bikeTypeId')
  findCompatibleByBikeTypeId(@Param('bikeTypeId') bikeTypeId: string) {
    return this.accessoriesService.findCompatibleByBikeType(+bikeTypeId);
  }

  // 🔥 NEW: GET BIKE TYPES MAPPING
  @Get('bike-types/mapping')
  getBikeTypesMapping() {
    return this.accessoriesService.getBikeTypesMapping();
  }

  // 🔥 NEW: GET ALL PRODUCTS WITH COMPATIBLE ACCESSORIES
  @Get('products/compatibility')
  getProductsWithCompatibility() {
    return this.accessoriesService.getProductsWithCompatibility();
  }

  // SEARCH ACCESSORIES
  @Get('search')
  search(@Query('q') query: string) {
    return this.accessoriesService.search(query);
  }

  // GET BY ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accessoriesService.findOne(+id);
  }

  // CREATE ACCESSORY
  @Post()
  create(@Body() createAccessoryDto: CreateAccessoryDto) {
    return this.accessoriesService.create(createAccessoryDto);
  }

  // UPDATE ACCESSORY
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccessoryDto: UpdateAccessoryDto) {
    return this.accessoriesService.update(+id, updateAccessoryDto);
  }

  // DELETE ACCESSORY
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accessoriesService.remove(+id);
  }

  // 🔥 UPLOAD ACCESSORY IMAGE
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = './uploads/accessories';
        
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
          console.log('📁 Created accessories directory:', uploadDir);
        }
        
        console.log('💾 Saving accessory image to:', uploadDir);
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        try {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = path.extname(file.originalname);
          const filename = `accessory-${uniqueSuffix}${ext}`;
          console.log('📄 Accessory filename:', filename);
          cb(null, filename);
        } catch (error) {
          cb(new Error('Filename generation error'), '');
        }
      }
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Only image files are allowed!'), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    }
  }))
  async uploadAccessoryImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('🎯 UPLOAD ACCESSORY IMAGE - CONTROLLER CALLED');
    
    if (!file) {
      console.log('❌ NO FILE RECEIVED IN CONTROLLER');
      throw new BadRequestException('No file received');
    }

    console.log('✅ ACCESSORY FILE UPLOADED SUCCESS:', {
      originalName: file.originalname,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      path: file.path,
      destination: file.destination
    });

    const result = {
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: `http://localhost:3000/uploads/accessories/${file.filename}`,
    };

    console.log('🎉 ACCESSORY UPLOAD RESULT:', result);
    
    return result;
  }
}