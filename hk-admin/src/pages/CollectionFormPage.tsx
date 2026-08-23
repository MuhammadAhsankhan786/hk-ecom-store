import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import Button from '../components/ui/Button';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';

export const CollectionFormPage: React.FC<{ isEdit?: boolean }> = ({ isEdit = false }) => {
  const { setCurrentTab, collections, addCollection, updateCollection, selectedEntityId } = useAdmin();

  const existingCollection = isEdit ? collections.find(c => c.id === selectedEntityId) : undefined;

  const [name, setName] = useState(existingCollection?.name || '');
  const [description, setDescription] = useState(existingCollection?.description || '');
  const [image, setImage] = useState(existingCollection?.image || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop&auto=format');
  const [status, setStatus] = useState<'Active' | 'Inactive'>(existingCollection?.status || 'Active');
  const [sortOrder, setSortOrder] = useState(existingCollection?.sortOrder || 1);
  const [seoTitle, setSeoTitle] = useState(existingCollection?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(existingCollection?.seoDescription || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && selectedEntityId) {
      updateCollection(selectedEntityId, {
        name, description, image, status, sortOrder, seoTitle, seoDescription
      });
    } else {
      addCollection({
        name, description, image, status, sortOrder, seoTitle, seoDescription
      });
    }
    setCurrentTab('collections');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('collections')}
            className="p-2 bg-white border border-[#E8E5DE] rounded-xl text-[#111111] hover:bg-[#F8F7F3] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#111111]">
              {isEdit ? 'Edit Collection' : 'Create Special Collection'}
            </h1>
            <p className="text-xs text-[#6B6B6B]">Featured seasonal collections (e.g. Wedding, Summer, Best Sellers)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setCurrentTab('collections')}>
            Cancel
          </Button>
          <Button variant="gold" size="sm" onClick={handleSubmit} icon={<Save className="w-3.5 h-3.5" />}>
            {isEdit ? 'Save Changes' : 'Publish Collection'}
          </Button>
        </div>
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E8E5DE] pb-2">
              Collection Details
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#111111] mb-1">Collection Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Wedding Collection, Summer Breeze 2026"
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the aesthetic and theme of this featured collection..."
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-medium"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E8E5DE] pb-2">
              SEO Tagging
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#111111] mb-1">SEO Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={e => setSeoTitle(e.target.value)}
                  placeholder="Bridal Wedding Collection | HK Fabric"
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">SEO Meta Description</label>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={e => setSeoDescription(e.target.value)}
                  placeholder="Royal velvet bridal bed sets with gold embellishments."
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E8E5DE] pb-2">
              Status & Position
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#111111] mb-1">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as 'Active' | 'Inactive')}
                  className="w-full px-3 py-2.5 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-bold"
                >
                  <option value="Active">Active (Featured on Homepage)</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">Sort Order</label>
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

          <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E8E5DE] pb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
              <span>Banner Image</span>
            </h3>

            <div className="space-y-3 text-xs">
              <input
                type="text"
                value={image}
                onChange={e => setImage(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F7F3] border border-[#E8E5DE] rounded-xl text-xs font-medium"
              />
              <div className="relative w-full h-40 rounded-xl overflow-hidden bg-[#F8F7F3] border border-[#E8E5DE]">
                <img src={image} alt="Collection Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CollectionFormPage;
