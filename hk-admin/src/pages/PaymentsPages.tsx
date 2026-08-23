import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import DataTable, { type Column } from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Drawer from '../components/ui/Drawer';
import Button from '../components/ui/Button';
import type { Transaction } from '../types/admin';
import { Eye } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const { transactions } = useAdmin();
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const columns: Column<Transaction>[] = [
    {
      key: 'transactionId',
      header: 'Transaction ID',
      render: (t) => (
        <span className="font-mono font-bold text-[#111111]">{t.transactionId}</span>
      )
    },
    { key: 'orderId', header: 'Order ID', sortable: true },
    { key: 'customerName', header: 'Customer' },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (t) => <span className="font-bold text-[#111111]">PKR {t.amount.toLocaleString()}</span>
    },
    {
      key: 'provider',
      header: 'Provider',
      render: (t) => <Badge variant="gold">{t.provider}</Badge>
    },
    {
      key: 'status',
      header: 'Gateway Status',
      render: (t) => (
        <Badge variant={t.status === 'Successful' ? 'success' : 'danger'}>
          {t.status}
        </Badge>
      )
    },
    { key: 'createdAt', header: 'Timestamp' },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (t) => (
        <Button variant="outline" size="sm" onClick={() => setSelectedTxn(t)} icon={<Eye className="w-3.5 h-3.5" />}>
          Details
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#111111]">Easypaisa & Gateway Payment Logs</h2>
        <p className="text-xs text-[#6B6B6B]">Complete payment transaction audit trail & instant verification logs</p>
      </div>

      <DataTable data={transactions} columns={columns} searchPlaceholder="Search Txn ID, Order ID..." />

      {/* Transaction Details Drawer */}
      <Drawer
        isOpen={selectedTxn !== null}
        onClose={() => setSelectedTxn(null)}
        title="Easypaisa Payment Transaction Payload"
        width="lg"
      >
        {selectedTxn && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#FDF9EC] border border-[#F5E6B3] rounded-xl space-y-1">
              <p className="text-[10px] font-bold text-[#9E7C10] uppercase">Transaction Ref</p>
              <p className="text-base font-mono font-bold text-[#111111]">{selectedTxn.transactionId}</p>
              <p className="text-xs text-[#6B6B6B]">Order: {selectedTxn.orderId} • Amount: PKR {selectedTxn.amount.toLocaleString()}</p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-[#111111] uppercase tracking-wider">Gateway Response Payload</p>
              <pre className="p-4 bg-[#111111] text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                {selectedTxn.rawPayload || '{"status":"SUCCESS","gateway":"Easypaisa"}'}
              </pre>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
