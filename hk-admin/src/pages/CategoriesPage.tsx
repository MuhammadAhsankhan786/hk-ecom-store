import React from 'react';
import { useAdmin } from '../context/AdminContext';
import DataTable, { type Column } from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import type { Category, Collection } from '../types/admin';
import { Plus, Edit, Trash2 } from 'lucide-react';

// CATEGORIES MANAGEMENT PAGE
export const CategoriesPage: React.FC = () => {
  const { categories, setCurrentTab, setSelectedEntityId, deleteCategory } = useAdmin();

  const handleCreate = () => {
    setSelectedEntityId(null);
    setCurrentTab('create-category');
  };

  const handleEdit = (id: string) => {
    setSelectedEntityId(id);
    setCurrentTab('edit-category');
  };

  const columns: Column<Category>[] = [
    {
      key: 'name',
      header: 'Category Name',
      render: (c) => (
        <div className="flex items-center gap-3">
          <img src={c.image || 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&h=600&fit=crop&auto=format'} alt={c.name} className="w-10 h-10 rounded-lg object-cover border border-[#E8E5DE]" />
          <div>
            <p className="font-bold text-[#111111]">{c.name}</p>
            <p className="text-[10px] text-[#6B6B6B]">Slug: /{c.slug}</p>
          </div>
        </div>
      )
    },
    { key: 'productsCount', header: 'Products Count', sortable: true, render: (c) => `${c.productsCount} Items` },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <Badge variant={c.status === 'Active' ? 'gold' : 'gray'}>{c.status}</Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(c.id)} icon={<Edit className="w-3.5 h-3.5" />}>
            Edit Form
          </Button>
          <Button variant="ghost" size="sm" onClick={() => deleteCategory(c.id)} icon={<Trash2 className="w-3.5 h-3.5 text-rose-600" />}>
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111111]">Category Management</h2>
          <p className="text-xs text-[#6B6B6B]">Organize products into parent and child categories</p>
        </div>
        <Button variant="gold" onClick={handleCreate} icon={<Plus className="w-4 h-4" />}>
          Add Category Form
        </Button>
      </div>

      <DataTable data={categories} columns={columns} searchPlaceholder="Search categories..." />
    </div>
  );
};

// COLLECTIONS MANAGEMENT PAGE
export const CollectionsPage: React.FC = () => {
  const { collections, setCurrentTab, setSelectedEntityId, deleteCollection } = useAdmin();

  const handleCreate = () => {
    setSelectedEntityId(null);
    setCurrentTab('create-collection');
  };

  const handleEdit = (id: string) => {
    setSelectedEntityId(id);
    setCurrentTab('edit-collection');
  };

  const columns: Column<Collection>[] = [
    {
      key: 'name',
      header: 'Collection Name',
      render: (col) => (
        <div className="flex items-center gap-3">
          <img src={col.image || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop&auto=format'} alt={col.name} className="w-10 h-10 rounded-lg object-cover border border-[#E8E5DE]" />
          <div>
            <p className="font-bold text-[#111111]">{col.name}</p>
            <p className="text-[10px] text-[#6B6B6B] truncate max-w-xs">{col.description}</p>
          </div>
        </div>
      )
    },
    { key: 'productsCount', header: 'Products Count', render: (col) => `${col.productsCount} Products` },
    {
      key: 'status',
      header: 'Status',
      render: (col) => <Badge variant={col.status === 'Active' ? 'gold' : 'gray'}>{col.status}</Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (col) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(col.id)} icon={<Edit className="w-3.5 h-3.5" />}>
            Edit Form
          </Button>
          <Button variant="ghost" size="sm" onClick={() => deleteCollection(col.id)} icon={<Trash2 className="w-3.5 h-3.5 text-rose-600" />}>
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111111]">Collections Management</h2>
          <p className="text-xs text-[#6B6B6B]">Featured seasonal collections (Summer, Winter, Wedding, Best Sellers)</p>
        </div>
        <Button variant="gold" onClick={handleCreate} icon={<Plus className="w-4 h-4" />}>
          Add Collection Form
        </Button>
      </div>

      <DataTable data={collections} columns={columns} searchPlaceholder="Search collections..." />
    </div>
  );
};
