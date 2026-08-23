import React from 'react';
import { useAdmin } from '../context/AdminContext';
import Button from '../components/ui/Button';
import { ShieldAlert, AlertTriangle, ArrowLeft } from 'lucide-react';

export const PermissionDeniedPage: React.FC = () => {
  const { setCurrentTab, currentUser } = useAdmin();

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-rose-200 max-w-lg mx-auto shadow-sm space-y-4 my-12">
      <div className="p-4 bg-rose-50 text-rose-600 rounded-full">
        <ShieldAlert className="w-10 h-10" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-[#111111]">Access Restricted</h2>
        <p className="text-xs text-[#6B6B6B] mt-1">
          Your current role (<span className="font-bold text-[#D4AF37]">{currentUser.role}</span>) does not have authorization to access this administrative module.
        </p>
      </div>
      <Button variant="primary" onClick={() => setCurrentTab('dashboard')} icon={<ArrowLeft className="w-4 h-4" />}>
        Return to Dashboard
      </Button>
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  const { setCurrentTab } = useAdmin();

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-[#E8E5DE] max-w-lg mx-auto shadow-sm space-y-4 my-12">
      <div className="p-4 bg-[#F8F7F3] text-[#6B6B6B] rounded-full">
        <AlertTriangle className="w-10 h-10 text-[#D4AF37]" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-[#111111]">404 — Page Not Found</h2>
        <p className="text-xs text-[#6B6B6B] mt-1">
          The requested admin page or resource ID does not exist in the HK Fabric system.
        </p>
      </div>
      <Button variant="gold" onClick={() => setCurrentTab('dashboard')} icon={<ArrowLeft className="w-4 h-4" />}>
        Back to Dashboard
      </Button>
    </div>
  );
};
