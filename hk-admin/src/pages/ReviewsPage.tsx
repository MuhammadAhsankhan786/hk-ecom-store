import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import DataTable, { type Column } from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import type { Review } from '../types/admin';
import { Star, Check, X, EyeOff } from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const { reviews, updateReviewStatus } = useAdmin();
  const [activeTab, setActiveTab] = useState('all');

  const filteredReviews = reviews.filter(r => {
    if (activeTab === 'pending') return r.status === 'Pending';
    if (activeTab === 'approved') return r.status === 'Approved';
    if (activeTab === 'rejected') return r.status === 'Rejected';
    return true;
  });

  const columns: Column<Review>[] = [
    {
      key: 'productName',
      header: 'Product',
      render: (r) => (
        <div>
          <p className="font-bold text-[#111111]">{r.productName}</p>
          <p className="text-[10px] text-[#6B6B6B]">{r.createdAt}</p>
        </div>
      )
    },
    {
      key: 'customerName',
      header: 'Customer',
      render: (r) => (
        <div>
          <p className="font-semibold text-[#111111]">{r.customerName}</p>
          {r.verifiedPurchase && (
            <Badge variant="gold" size="sm" className="mt-0.5">Verified Buyer</Badge>
          )}
        </div>
      )
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-0.5 text-[#D4AF37]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-current' : 'text-gray-300'}`}
            />
          ))}
        </div>
      )
    },
    {
      key: 'comment',
      header: 'Review Comment',
      render: (r) => (
        <p className="text-xs text-[#111111] italic max-w-md line-clamp-2">"{r.comment}"</p>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <Badge
          variant={
            r.status === 'Approved' ? 'success' :
            r.status === 'Pending' ? 'warning' : 'danger'
          }
        >
          {r.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Moderation Actions',
      className: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => updateReviewStatus(r.id, 'Approved')}
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md cursor-pointer"
            title="Approve Review"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateReviewStatus(r.id, 'Rejected')}
            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
            title="Reject Review"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateReviewStatus(r.id, 'Hidden')}
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer"
            title="Hide Review"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#111111]">Product Reviews Moderation</h2>
        <p className="text-xs text-[#6B6B6B]">Moderate verified customer reviews before display on customer store</p>
      </div>

      <DataTable
        data={filteredReviews}
        columns={columns}
        searchPlaceholder="Search reviews..."
        filterTabs={[
          { id: 'all', label: 'All Reviews', count: reviews.length },
          { id: 'pending', label: 'Pending', count: reviews.filter(r => r.status === 'Pending').length },
          { id: 'approved', label: 'Approved', count: reviews.filter(r => r.status === 'Approved').length }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};
