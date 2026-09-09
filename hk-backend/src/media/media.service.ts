import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class MediaService {
  constructor(private configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
    }
  }

  /**
   * Multer File Upload Handler - Stream buffer directly to Cloudinary CDN
   */
  async uploadImageWithMulter(file: Express.Multer.File, folder = 'products'): Promise<UploadApiResponse> {
    if (!file || !file.buffer) {
      throw new BadRequestException('Please provide a valid image file');
    }

    // 1. Strict MIME Type Validation
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type (${file.mimetype}). Allowed image types: JPEG, PNG, WEBP.`);
    }

    // 2. Strict File Size Validation (Max 5MB)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      throw new BadRequestException('File size exceeds maximum allowed limit of 5MB.');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            return reject(new BadRequestException(`Cloudinary Upload Failed: ${error?.message || 'Unknown error'}`));
          }
          resolve(result);
        },
      );

      const stream = Readable.from(file.buffer);
      stream.pipe(uploadStream);
    });
  }

  generateUploadSignature(folder = 'products') {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');

    if (!apiSecret || !apiKey || !cloudName) {
      throw new BadRequestException('Cloudinary API credentials are not configured on server.');
    }

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      apiSecret,
    );

    return {
      timestamp,
      folder,
      signature,
      apiKey,
      cloudName,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    };
  }

  async deleteImage(cloudinaryId: string) {
    try {
      const result = await cloudinary.uploader.destroy(cloudinaryId);
      return { success: true, result };
    } catch {
      return { success: false, message: 'Cloudinary credentials pending configuration' };
    }
  }
}
