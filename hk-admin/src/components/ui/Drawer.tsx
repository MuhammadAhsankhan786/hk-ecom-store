import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  side?: 'left' | 'right';
  width?: 'md' | 'lg' | 'xl';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  width = 'md'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    md: 'w-80 sm:w-96',
    lg: 'w-96 sm:w-[28rem]',
    xl: 'w-full sm:w-[32rem]'
  };

  const sideClasses = side === 'left' ? 'left-0' : 'right-0';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className={`fixed inset-y-0 ${sideClasses} flex max-w-full z-10`}>
        <div className={`bg-white shadow-2xl border-l border-[#E8E5DE] ${widthClasses[width]} flex flex-col h-full overflow-hidden`}>
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E5DE] bg-[#F8F7F3]">
            <h3 className="text-base font-bold text-[#111111]">{title}</h3>
            <button
              onClick={onClose}
              className="text-[#6B6B6B] hover:text-[#111111] p-1 rounded-lg hover:bg-[#E8E5DE] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
