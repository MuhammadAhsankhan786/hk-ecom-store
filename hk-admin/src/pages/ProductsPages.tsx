import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import DataTable, { type Column } from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ImageUploader from '../components/ui/ImageUploader';
import { ConfirmationDialog } from '../components/ui/StatusTimeline';
import type { Product, ImageMetadata } from '../types/admin';
import { Plus, Eye, Edit, Copy, Trash2, ArrowLeft, CheckCircle, Star } from 'lucide-react';

// 1. PRODUCTS LIST VIEW
export const ProductsListPage: React.FC = () => {
  const {
    products, setCurrentTab, setSelectedEntityId, deleteProduct,
    updateProduct, addProduct
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('all');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredProducts = products.filter(p => {
    if (activeTab === 'active') return p.status === 'Active';
    if (activeTab === 'draft') return p.status === 'Draft';
    if (activeTab === 'low-stock') return p.stock <= p.lowStockThreshold;
    if (activeTab === 'featured') return p.isFeatured;
    return true;
  });

  const columns: Column<Product>[] = [
    {
      key: 'image',
      header: 'Product',
      render: (p) => (
        <div className="flex items-center gap-3">
          <img
            src={p.images && p.images[0]?.url ? p.images[0].url : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect width="60" height="60" fill="%23F8F7F3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="9" fill="%236B6B6B">No Image</text></svg>'}
            alt={p.name}
            className="w-12 h-12 rounded-lg object-cover border border-[#E8E5DE]"
          />
          <div>
            <p className="font-bold text-[#111111] hover:text-[#D4AF37] cursor-pointer" onClick={() => { setSelectedEntityId(p.id); setCurrentTab('product-details'); }}>
              {p.name}
            </p>
            <p className="text-[10px] text-[#6B6B6B]">SKU: <span className="font-mono">{p.sku}</span></p>
          </div>
        </div>
      )
    },
    { key: 'category', header: 'Category', sortable: true },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (p) => (
        <div>
          <p className="font-bold text-[#111111]">PKR {p.price.toLocaleString()}</p>
          {p.salePrice && (
            <p className="text-[10px] text-[#D4AF37] font-semibold">Sale: PKR {p.salePrice.toLocaleString()}</p>
          )}
        </div>
      )
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      render: (p) => (
        <Badge variant={p.stock <= p.lowStockThreshold ? 'danger' : 'success'}>
          {p.stock} units
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => (
        <Badge variant={p.status === 'Active' ? 'gold' : 'gray'}>
          {p.status}
        </Badge>
      )
    },
    {
      key: 'isFeatured',
      header: 'Featured',
      render: (p) => (
        <button
          onClick={() => updateProduct(p.id, { isFeatured: !p.isFeatured })}
          className={`p-1.5 rounded-md cursor-pointer transition-colors ${p.isFeatured ? 'text-[#D4AF37]' : 'text-gray-300 hover:text-gray-500'}`}
        >
          <Star className={`w-4 h-4 ${p.isFeatured ? 'fill-current' : ''}`} />
        </button>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => { setSelectedEntityId(p.id); setCurrentTab('product-details'); }}
            className="p-1.5 text-[#6B6B6B] hover:text-[#111111] hover:bg-[#E8E5DE] rounded-md transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setSelectedEntityId(p.id); setCurrentTab('edit-product'); }}
            className="p-1.5 text-[#6B6B6B] hover:text-[#D4AF37] hover:bg-[#FDF9EC] rounded-md transition-colors cursor-pointer"
            title="Edit Product"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const dup = { ...p, name: `${p.name} (Copy)`, sku: `${p.sku}-COPY` };
              delete (dup as any).id;
              delete (dup as any).createdAt;
              delete (dup as any).updatedAt;
              addProduct(dup);
            }}
            className="p-1.5 text-[#6B6B6B] hover:text-[#111111] hover:bg-[#E8E5DE] rounded-md transition-colors cursor-pointer"
            title="Duplicate Product"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTargetId(p.id)}
            className="p-1.5 text-[#6B6B6B] hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#111111]">Product Catalog</h2>
          <p className="text-xs text-[#6B6B6B]">Manage bedding, sheets, duvets, and accessories</p>
        </div>
        <Button
          variant="gold"
          onClick={() => setCurrentTab('create-product')}
          icon={<Plus className="w-4 h-4" />}
        >
          Add New Product
        </Button>
      </div>

      <DataTable
        data={filteredProducts}
        columns={columns}
        searchPlaceholder="Search products by title, SKU..."
        searchField={(p) => `${p.name} ${p.sku} ${p.category}`}
        filterTabs={[
          { id: 'all', label: 'All Products', count: products.length },
          { id: 'active', label: 'Active', count: products.filter(p => p.status === 'Active').length },
          { id: 'low-stock', label: 'Low Stock', count: products.filter(p => p.stock <= p.lowStockThreshold).length },
          { id: 'featured', label: 'Featured', count: products.filter(p => p.isFeatured).length }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ConfirmationDialog
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) deleteProduct(deleteTargetId);
        }}
        title="Delete Product"
        message="Are you sure you want to delete this product from the catalog? This action cannot be undone."
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
};

// 2. CREATE / EDIT PRODUCT FORM VIEW
export const ProductFormPage: React.FC<{ isEdit?: boolean }> = ({ isEdit = false }) => {
  const {
    products, categories, collections, addProduct, updateProduct,
    setCurrentTab, selectedEntityId
  } = useAdmin();

  const existing = isEdit ? products.find(p => p.id === selectedEntityId) : null;

  const [name, setName] = useState(existing?.name || '');
  const [slug, setSlug] = useState(existing?.slug || '');
  // Use categoryId (UUID) as the key sent to backend
  const [categoryId, setCategoryId] = useState(
    (existing as any)?.categoryId || categories[0]?.id || ''
  );
  const [collection, setCollection] = useState(existing?.collection || collections[0]?.name || 'Wedding Collection');
  const [price, setPrice] = useState(existing?.price || 15000);
  const [salePrice, setSalePrice] = useState<number | undefined>(existing?.salePrice);
  const [costPrice, setCostPrice] = useState<number | undefined>(existing?.costPrice);
  const [stock, setStock] = useState(existing?.stock || 10);
  const [lowStockThreshold, setLowStockThreshold] = useState(existing?.lowStockThreshold || 5);
  const [material, setMaterial] = useState(existing?.material || '100% Egyptian Cotton');
  const [fabric, setFabric] = useState(existing?.fabric || '600 Thread Count');
  const [shortDescription, setShortDescription] = useState(existing?.shortDescription || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [status, setStatus] = useState<'Active' | 'Draft'>(existing?.status === 'Archived' ? 'Draft' : (existing?.status || 'Active'));
  const [images, setImages] = useState<ImageMetadata[]>(existing?.images || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    // Resolve human-readable category name for display
    const selectedCategory = categories.find(c => c.id === categoryId);

    const payload: any = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: existing?.sku || `HK-${name.substring(0, 5).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      category: selectedCategory?.name || 'Bedding Sets',
      categoryId,  // UUID sent to backend
      collection,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      costPrice: costPrice ? Number(costPrice) : undefined,
      stock: Number(stock),
      reservedStock: existing?.reservedStock || 0,
      lowStockThreshold: Number(lowStockThreshold),
      status,
      isFeatured: existing?.isFeatured || false,
      size: ['King', 'Queen'],
      color: ['Maroon', 'White'],
      material,
      pattern: 'Embroidered',
      fabric,
      shortDescription,
      description,
      images,
    };

    try {
      if (isEdit && existing) {
        await updateProduct(existing.id, payload);
      } else {
        await addProduct(payload);
      }
      setCurrentTab('products');
    } catch {
      // Error toast is shown by AdminContext; stay on form so user can retry
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setCurrentTab('products')} icon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
          <h2 className="text-xl font-bold text-[#111111]">
            {isEdit ? `Edit Product: ${existing?.sku}` : 'Create New Product'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setCurrentTab('products')}>
            Cancel
          </Button>
          <Button variant="gold" type="submit" icon={<CheckCircle className="w-4 h-4" />}>
            {isEdit ? 'Save Changes' : 'Publish Product'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Basic Information</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (!isEdit) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }}
                  className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3] focus:bg-white"
                  placeholder="e.g. Royal Velvet Bridal Bedding Set (Gold Edition)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
                {/* SKU field is now hidden and auto-generated based on title */}
                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Short Description</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={e => setShortDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
                  placeholder="Summary for product card view..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Full Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
                  placeholder="Detailed specifications, included pieces, care instructions..."
                />
              </div>
            </div>
          </div>

          {/* Pricing & Cost */}
          <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Pricing Configuration (PKR)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Regular Price *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3] font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Sale Price</label>
                <input
                  type="number"
                  value={salePrice || ''}
                  onChange={e => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3] text-[#D4AF37] font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Cost Price (COGS)</label>
                <input
                  type="number"
                  value={costPrice || ''}
                  onChange={e => setCostPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3] text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Cloudinary Image Manager */}
          <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Product Gallery (Cloudinary)</h3>
            <ImageUploader images={images} onChange={setImages} />
          </div>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Status & Categorization */}
          <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Status & Category</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Publishing Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
                >
                  <option value="Active">Active (Published)</option>
                  <option value="Draft">Draft (Hidden)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Main Category</label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
                >
                  {categories.length === 0 && (
                    <option value="">No categories — add one first</option>
                  )}
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Collection</label>
                <select
                  value={collection}
                  onChange={e => setCollection(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
                >
                  {collections.map(col => (
                    <option key={col.id} value={col.name}>{col.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Inventory Settings */}
          <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Inventory Rules</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Current Stock Quantity *</label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={e => setStock(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Low Stock Warning Threshold</label>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={e => setLowStockThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
                />
              </div>
            </div>
          </div>

          {/* Fabric Attributes */}
          <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Fabric Attributes</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Material Composition</label>
                <input
                  type="text"
                  value={material}
                  onChange={e => setMaterial(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Fabric Weave / Thread Count</label>
                <input
                  type="text"
                  value={fabric}
                  onChange={e => setFabric(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E8E5DE] rounded-lg bg-[#F8F7F3]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

// 3. PRODUCT DETAILS VIEW
export const ProductDetailsPage: React.FC = () => {
  const { products, selectedEntityId, setCurrentTab } = useAdmin();
  const product = products.find(p => p.id === selectedEntityId) || products[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setCurrentTab('products')} icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Products
          </Button>
          <h2 className="text-xl font-bold text-[#111111]">Product Details: {product.sku}</h2>
        </div>
        <Button variant="gold" size="sm" onClick={() => setCurrentTab('edit-product')} icon={<Edit className="w-4 h-4" />}>
          Edit Product
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#111111]">{product.name}</h3>
                <p className="text-xs text-[#6B6B6B]">Category: {product.category} | Collection: {product.collection}</p>
              </div>
              <Badge variant={product.status === 'Active' ? 'gold' : 'gray'}>
                {product.status}
              </Badge>
            </div>

            <div className="p-4 bg-[#F8F7F3] rounded-xl border border-[#E8E5DE] grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[10px] font-bold text-[#6B6B6B] uppercase">Regular Price</p>
                <p className="text-base font-bold text-[#111111]">PKR {product.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#6B6B6B] uppercase">Stock Available</p>
                <p className="text-base font-bold text-emerald-600">{product.stock} Units</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#6B6B6B] uppercase">Low Threshold</p>
                <p className="text-base font-bold text-amber-600">{product.lowStockThreshold} Units</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Product Description</h4>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* Images Gallery */}
          <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Cloudinary Image Gallery</h4>
            <div className="grid grid-cols-3 gap-3">
              {product.images.map(img => (
                <div key={img.id} className="relative rounded-lg overflow-hidden border border-[#E8E5DE] h-32 bg-[#F8F7F3]">
                  <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                  {img.isPrimary && (
                    <span className="absolute top-1 left-1 bg-[#D4AF37] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specifications Sidebar */}
        <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-xs space-y-4">
          <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Specifications</h4>
          <div className="divide-y divide-[#E8E5DE] text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-[#6B6B6B]">Material</span>
              <span className="font-bold text-[#111111]">{product.material}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-[#6B6B6B]">Fabric Weave</span>
              <span className="font-bold text-[#111111]">{product.fabric}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-[#6B6B6B]">Pattern</span>
              <span className="font-bold text-[#111111]">{product.pattern}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-[#6B6B6B]">Created Date</span>
              <span className="font-bold text-[#111111]">{product.createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
