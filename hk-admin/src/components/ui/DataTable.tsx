import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Inbox } from 'lucide-react';
import Button from './Button';
import { useDebounce } from '../../hooks/useDebounce';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchField?: (item: T) => string;
  filterTabs?: { id: string; label: string; count?: number }[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  actions?: React.ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  emptySubtitle?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchField,
  filterTabs,
  activeTab,
  onTabChange,
  actions,
  isLoading = false,
  emptyMessage = 'No records found',
  emptySubtitle = 'Try adjusting your filters or search terms.'
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms Debounce to prevent lag during rapid typing

  const [sortColumnKey, setSortColumnKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Search filtering using debounced query
  const filteredData = data.filter(item => {
    if (!debouncedSearchTerm) return true;
    if (searchField) {
      return searchField(item).toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    }
    return JSON.stringify(item).toLowerCase().includes(debouncedSearchTerm.toLowerCase());
  });

  // Sorting
  const sortedData = [...filteredData].sort((a: any, b: any) => {
    if (!sortColumnKey) return 0;
    const valA = a[sortColumnKey];
    const valB = b[sortColumnKey];

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: string) => {
    if (sortColumnKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumnKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="bg-white border border-[#E8E5DE] rounded-xl shadow-xs overflow-hidden">
      {/* Top Header Controls */}
      <div className="p-4 border-b border-[#E8E5DE] space-y-4">
        {/* Filter Tabs if present */}
        {filterTabs && filterTabs.length > 0 && (
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-[#E8E5DE] -mx-4 px-4">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  if (onTabChange) onTabChange(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F8F7F3]'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full ${
                    activeTab === tab.id ? 'bg-[#D4AF37] text-black font-bold' : 'bg-[#E8E5DE] text-[#6B6B6B]'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Search Bar & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8F7F3] border border-[#E8E5DE] rounded-lg text-[#111111] focus:bg-white transition-colors"
            />
          </div>

          {actions && <div className="flex items-center gap-2 w-full sm:w-auto justify-end">{actions}</div>}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse hk-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} className={`px-4 py-3.5 ${col.className || ''}`}>
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1 font-semibold hover:text-[#111111] cursor-pointer"
                    >
                      <span>{col.header}</span>
                      <ArrowUpDown className="w-3 h-3 text-[#6B6B6B]" />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E8E5DE] text-xs text-[#111111]">
            {isLoading ? (
              // Loading Skeleton State
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 bg-[#F8F7F3] rounded-full border border-[#E8E5DE]">
                      <Inbox className="w-8 h-8 text-[#6B6B6B]" />
                    </div>
                    <p className="text-sm font-bold text-[#111111]">{emptyMessage}</p>
                    <p className="text-xs text-[#6B6B6B] max-w-sm">{emptySubtitle}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map(item => (
                <tr key={item.id} className="transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className={`px-4 py-3.5 ${col.className || ''}`}>
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && sortedData.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E8E5DE] bg-[#F8F7F3] text-xs text-[#6B6B6B]">
          <div>
            Showing <span className="font-semibold text-[#111111]">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-semibold text-[#111111]">
              {Math.min(currentPage * itemsPerPage, sortedData.length)}
            </span>{' '}
            of <span className="font-semibold text-[#111111]">{sortedData.length}</span> results
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              icon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Prev
            </Button>
            <span className="font-semibold text-[#111111]">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              icon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
