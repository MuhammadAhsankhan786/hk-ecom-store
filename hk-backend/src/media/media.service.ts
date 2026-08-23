import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class MediaService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME') || 'hk_fabric_cloud',
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY') || 'key',
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET') || 'secret',
    });
  }

  generateUploadSignature(folder = 'products') {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET') || 'secret';
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY') || 'key';
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME') || 'hk_fabric_cloud';

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
