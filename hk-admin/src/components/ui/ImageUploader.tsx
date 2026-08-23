import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Star, Trash2, ArrowUp, ArrowDown, Edit2, Check } from 'lucide-react';
import type { ImageMetadata } from '../../types/admin';

interface ImageUploaderProps {
  images: ImageMetadata[];
  onChange: (images: ImageMetadata[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingAltId, setEditingAltId] = useState<string | null>(null);
  const [tempAltText, setTempAltText] = useState('');

  // Sample Cloudinary preview images for simulated upload
  const SAMPLE_UPLOADS = [
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
  ];

  const handleSimulatedUpload = (e?: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);

            // Add new image
            const randomUrl = SAMPLE_UPLOADS[Math.floor(Math.random() * SAMPLE_UPLOADS.length)];
            const file = e?.target?.files?.[0];
            const fileName = file ? file.name : `cloudinary_img_${Date.now().toString().slice(-4)}.jpg`;

            const newImg: ImageMetadata = {
              id: `img-${Date.now()}`,
              url: randomUrl,
              filename: fileName,
              altText: fileName.replace('.jpg', '').replace(/-/g, ' '),
              sortOrder: images.length + 1,
              isPrimary: images.length === 0
            };

            onChange([...images, newImg]);
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handleSetPrimary = (id: string) => {
    const updated = images.map(img => ({
      ...img,
      isPrimary: img.id === id
    }));
    onChange(updated);
  };

  const handleDelete = (id: string) => {
    const filtered = images.filter(img => img.id !== id);
    // If deleted primary image, assign first remaining as primary
    if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    onChange(filtered);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newImgs = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImgs.length) return;

    const temp = newImgs[index];
    newImgs[index] = newImgs[targetIndex];
    newImgs[targetIndex] = temp;

    // Update sortOrder
    newImgs.forEach((img, i) => {
      img.sortOrder = i + 1;
    });

    onChange(newImgs);
  };

  const handleSaveAlt = (id: string) => {
    const updated = images.map(img => img.id === id ? { ...img, altText: tempAltText } : img);
    onChange(updated);
    setEditingAltId(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Dropzone */}
      <div className="relative border-2 border-dashed border-[#E8E5DE] hover:border-[#D4AF37] rounded-xl p-6 bg-[#F8F7F3] text-center transition-all cursor-pointer group">
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleSimulatedUpload}
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 bg-white rounded-full border border-[#E8E5DE] group-hover:border-[#D4AF37] group-hover:bg-[#FDF9EC] transition-colors">
            <UploadCloud className="w-7 h-7 text-[#6B6B6B] group-hover:text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111111]">
              Click to upload or drag & drop high-res images
            </p>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Supports JPEG, PNG, WEBP up to 10MB (Cloudinary Auto-optimization Enabled)
            </p>
          </div>
        </div>
      </div>

      {/* Uploading Progress Bar */}
      {isUploading && (
        <div className="p-4 bg-white border border-[#E8E5DE] rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#111111]">
            <span className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#D4AF37] animate-pulse" />
              Processing Cloudinary Upload...
            </span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-[#E8E5DE] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#D4AF37] h-full transition-all duration-300 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Image Gallery Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">
              Uploaded Images ({images.length})
            </span>
            <span className="text-xs text-[#6B6B6B]">
              Star icon sets primary thumbnail
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {images.map((img, index) => (
              <div
                key={img.id}
                className={`relative flex items-center gap-3 p-3 bg-white rounded-xl border transition-all ${
                  img.isPrimary ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/30 shadow-xs' : 'border-[#E8E5DE]'
                }`}
              >
                {/* Thumbnail Image */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#F8F7F3] border border-[#E8E5DE] shrink-0">
                  <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                  {img.isPrimary && (
                    <span className="absolute top-0 left-0 right-0 bg-[#D4AF37] text-black text-[9px] font-bold text-center py-0.5 uppercase tracking-wider">
                      Primary
                    </span>
                  )}
                </div>

                {/* Details & Alt Edit */}
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-xs font-semibold text-[#111111] truncate">{img.filename}</p>
                  
                  {editingAltId === img.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={tempAltText}
                        onChange={(e) => setTempAltText(e.target.value)}
                        className="text-xs px-2 py-1 border border-[#E8E5DE] rounded-md w-full"
                        placeholder="Alt text..."
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveAlt(img.id)}
                        className="p-1 bg-[#111111] text-white rounded-md cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
                      <span className="truncate italic">Alt: "{img.altText || 'No alt text'}"</span>
                      <button
                        type="button"
                        onClick={() => { setEditingAltId(img.id); setTempAltText(img.altText); }}
                        className="text-[#6B6B6B] hover:text-[#111111] cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Reorder Up/Down */}
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-[#6B6B6B] hover:text-[#111111] disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === images.length - 1}
                    className="p-1 text-[#6B6B6B] hover:text-[#111111] disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Primary Toggle Star */}
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(img.id)}
                    className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                      img.isPrimary 
                        ? 'bg-[#FDF9EC] text-[#D4AF37]' 
                        : 'text-[#6B6B6B] hover:text-[#D4AF37] hover:bg-[#F8F7F3]'
                    }`}
                    title={img.isPrimary ? 'Primary Image' : 'Set as Primary'}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(img.id)}
                    className="p-1.5 text-[#6B6B6B] hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
