import { Body, Controller, Get, Post, UploadedFile, UseInterceptors, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Express } from 'express';
import { WasteService } from './waste.service';

const uploadDir = process.env.UPLOAD_DIR || './uploads';

@Controller('waste')
export class WasteController {
  constructor(private wasteService: WasteService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: uploadDir,
      filename(req, file, cb) {
        const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
        const fileExt = extname(file.originalname);
        cb(null, `${name}${fileExt}`);
      }
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  async create(@UploadedFile() file: Express.Multer.File | undefined, @Body() body: any) {
    // Accept either JSON body (no file) or multipart/form-data (with file)
    const payload: any = {
      userId: body.userId,
      location: body.location || body.loc || 'unknown',
      description: body.description,
      wasteType: body.wasteType || body.type || 'unknown',
      estimatedWeight: body.estimatedWeight ? parseFloat(body.estimatedWeight) : undefined,
    };
    if (file) {
      payload.photoUrl = `${uploadDir.replace(/^\.\//, '')}/${file.filename}`;
    }
    return this.wasteService.create(payload);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: uploadDir,
      filename(req, file, cb) {
        const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
        const fileExt = extname(file.originalname);
        cb(null, `${name}${fileExt}`);
      }
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  async upload(@UploadedFile() file: Express.Multer.File | undefined, @Body() body: any) {
    const logger = new Logger(WasteController.name);
    try {
      const payload: any = {
        userId: body.userId,
        location: body.location || body.loc || 'unknown',
        description: body.description,
        wasteType: body.wasteType || body.type || 'unknown',
        estimatedWeight: body.estimatedWeight ? parseFloat(body.estimatedWeight) : undefined,
      };
      if (file) {
        payload.photoUrl = `${uploadDir.replace(/^\.\//, '')}/${file.filename}`;
      }
      const created = await this.wasteService.create(payload);
      return created;
    } catch (e) {
      logger.error('upload failed', e as any);
      throw e;
    }
  }

  @Get()
  async findAll() {
    return this.wasteService.findAll();
  }
}
