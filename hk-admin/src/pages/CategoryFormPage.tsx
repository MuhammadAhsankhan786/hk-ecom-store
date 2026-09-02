import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import Button from '../components/ui/Button';
import { ArrowLeft, Save, Image as ImageIcon, Search, Upload, Loader2 } from 'lucide-react';
import { uploadMediaToCloudinaryAPI } from '../services/api';

export const CategoryFormPage: React.FC<{ isEdit?: boolean }> = ({ isEdit = false }) => {
  const { setCurrentTab, categories, addCategory, updateCategory, selectedEntityId } = useAdmin();

  const existingCategory = isEdit ? categories.find(c => c.id === selectedEntityId) : undefined;

  const [name, setName] = useState(existingCategory?.name || '');
  const [slug, setSlug] = useState(existingCategory?.slug || '');
  const [description, setDescription] = useState(existingCategory?.description || '');
  const [image, setImage] = useState(existingCategory?.image || 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&h=600&fit=crop&auto=format');
  const [status, setStatus] = useState<'Active' | 'Inactive' | 'Draft' | 'Archived'>(existingCategory?.status || 'Active');
  const [sortOrder, setSortOrder] = useState(existingCategory?.sortOrder || 1);
  const [seoTitle, setSeoTitle] = useState(existingCategory?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(existingCategory?.seoDescription || '');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadMediaToCloudinaryAPI(file, 'categories');
      if (res && res.url) {
        setImage(res.url);
      }
    } catch (err: any) {
      alert(`Image upload failed: ${err.message || 'Error uploading file'}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
      setSeoTitle(`${val} | HK Fabric Pakistan`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && selectedEntityId) {
      updateCategory(selectedEntityId, {
        name, slug, description, image, status, sortOrder, seoTitle, seoDescription
      });
    } else {
      addCategory({
        name, slug, description, image, status, sortOrder, seoTitle, seoDescription
      });
    }
    setCurrentTab('categories');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('categories')}
            className="p-2 bg-white border border-[#E8E5DE] rounded-xl text-[#111111] hover:bg-[#F8F7F3] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#111111]">
              {isEdit ? 'Edit Category' : 'Create New Category'}
            </h1>
            <p className="text-xs text-[#6B6B6B]">Configure catalog category details, thumbnail & SEO settings</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button variant="secondary" size="sm" onClick={() => setCurrentTab('categories')}>
            Cancel
          </Button>
          <Button variant="gold" size="sm" onClick={handleSubmit} icon={<Save className="w-3.5 h-3.5" />}>
            {isEdit ? 'Save Changes' : 'Publish Category'}
          </Button>
        </div>
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Basic Info & SEO */}
        <div className="md:col-span-2 space-y-6">
          {/* General Information Card */}
          <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E8E5DE] pb-2">
              Category Details
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#111111] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="e.g. Bedsheets, Comforters, Cushions"
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="bedsheets"
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-mono text-[#6B6B6B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe what products belong in this category..."
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* SEO Preview Card */}
          <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E8E5DE] pb-2 flex items-center justify-between">
              <span>Search Engine Optimization (SEO)</span>
              <Search className="w-4 h-4 text-[#D4AF37]" />
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#111111] mb-1">Meta Title Tag</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={e => setSeoTitle(e.target.value)}
                  placeholder="Bedsheets & Bridal Bedding | HK Fabric Pakistan"
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={seoDescription}
                  onChange={e => setSeoDescription(e.target.value)}
                  placeholder="Buy luxury bridal velvet bed sets and cotton bedsheets online in Pakistan."
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-medium"
                />
              </div>

              {/* Google Search Snippet Card */}
              <div className="p-4 bg-[#F8F7F3] rounded-xl border border-[#E8E5DE] space-y-1">
                <p className="text-[11px] text-gray-500 font-mono">https://hkfabric.pk/categories/{slug || 'category'}</p>
                <p className="text-sm font-bold text-blue-700 hover:underline cursor-pointer">
                  {seoTitle || 'Category Title | HK Fabric'}
                </p>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {seoDescription || 'Browse our luxury collection of bedding and home textiles across Pakistan.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Image & Status */}
        <div className="space-y-6">
          {/* Status & Display Card */}
          <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E8E5DE] pb-2">
              Status & Sorting
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#111111] mb-1">Publishing Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-bold"
                >
                  <option value="Active">Active (Visible in Storefront)</option>
                  <option value="Inactive">Inactive (Hidden)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">Sort Order Position</label>
                <input
                  type="number"
                  min={1}
                  value={sortOrder}
                  onChange={e => setSortOrder(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Category Thumbnail Card */}
          <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E8E5DE] pb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
              <span>Category Image</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#111111] mb-1">Upload Poster Photo (Cloudinary CDN)</label>
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[#D4AF37]/60 rounded-xl cursor-pointer bg-[#FDFCF7] hover:bg-[#F8F7F3] transition-colors mb-2">
                  {uploadingImage ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading to Cloudinary CDN...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-2 pb-2 text-center px-3">
                      <Upload className="w-5 h-5 text-[#D4AF37] mb-1" />
                      <p className="text-[11px] font-bold text-[#111111]">Upload Poster Image File</p>
                      <p className="text-[9px] text-[#6B6B6B]">JPG, PNG, WEBP — automatically streams to Cloudinary CDN</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploadingImage} />
                </label>
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">Image CDN URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full px-3 py-2 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-medium"
                />
              </div>

              {/* Visual Thumbnail Preview */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#F8F7F3] border border-[#E8E5DE]">
                <img src={image || 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&h=600&fit=crop&auto=format'} alt="Category Preview" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 bg-[#111111]/80 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">
                  Store Preview
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryFormPage;
