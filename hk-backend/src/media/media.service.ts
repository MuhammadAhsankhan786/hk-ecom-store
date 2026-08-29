import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class MediaService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME') || 'dhpqigvzj',
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY') || '896479657425435',
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET') || 'loy9PoDasQGKUBHjOvIujfgT0MY',
    });
  }

  /**
   * Multer File Upload Handler - Stream buffer directly to Cloudinary CDN
   */
  async uploadImageWithMulter(file: Express.Multer.File, folder = 'products'): Promise<UploadApiResponse> {
    if (!file || !file.buffer) {
      throw new BadRequestException('Please provide a valid image file');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
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
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET') || 'loy9PoDasQGKUBHjOvIujfgT0MY';
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY') || '896479657425435';
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME') || 'dhpqigvzj';

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
