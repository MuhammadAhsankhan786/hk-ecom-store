import React from 'react';
import type { OrderTimelineEvent } from '../../types/admin';
import { CheckCircle2, Clock, Truck, Package, XCircle, RefreshCw } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

// Timeline Component
export const StatusTimeline: React.FC<{ timeline: OrderTimelineEvent[] }> = ({ timeline }) => {
  const getIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'Shipped': return <Truck className="w-4 h-4 text-sky-600" />;
      case 'Packed': return <Package className="w-4 h-4 text-indigo-600" />;
      case 'Processing': return <RefreshCw className="w-4 h-4 text-amber-600" />;
      case 'Paid': return <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />;
      case 'Cancelled': case 'Refunded': return <XCircle className="w-4 h-4 text-rose-600" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E5DE]">
      {timeline.map((item, idx) => (
        <div key={idx} className="relative flex items-start space-x-3">
          <div className="absolute -left-6 top-0.5 p-1 bg-white border border-[#E8E5DE] rounded-full shadow-2xs">
            {getIcon(item.status)}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#111111]">{item.status}</span>
              <span className="text-[10px] text-[#6B6B6B]">{item.timestamp}</span>
            </div>
            <p className="text-xs text-[#6B6B6B]">{item.note}</p>
            <p className="text-[10px] text-gray-400">Action by: {item.by}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Toast Component
export const Toast: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-xl border border-[#D4AF37]/40 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
      <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
      <span>{message}</span>
    </div>
  );
};

// Confirmation Dialog Component
interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isDanger?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  isDanger = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'gold'}
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-xs text-[#6B6B6B] leading-relaxed">{message}</p>
    </Modal>
  );
};
