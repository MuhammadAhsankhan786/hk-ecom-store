import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import Button from '../components/ui/Button';
import { Lock, Mail, CheckCircle } from 'lucide-react';
import type { UserRole } from '../types/admin';

export const LoginPage: React.FC = () => {
  const { setCurrentTab, setCurrentUser, adminUsers } = useAdmin();
  const [email, setEmail] = useState('ahsan@hkfabric.pk');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Super Admin');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = adminUsers.find(u => u.email === email) || {
      id: 'u-1',
      name: 'Ahsan Khan',
      email,
      role: selectedRole,
      status: 'Active' as const,
      lastLogin: 'Just now'
    };

    setCurrentUser({ ...matched, role: selectedRole });
    setCurrentTab('dashboard');
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-[#E8E5DE] p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-[#D4AF37] text-black font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md">
          HK
        </div>
        <h1 className="text-xl font-bold text-[#111111] uppercase tracking-wider">HK Fabric Admin</h1>
        <p className="text-xs text-[#6B6B6B]">Enterprise Retail Back-Office Portal</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-[#111111] mb-1">Admin Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-[#E8E5DE] rounded-xl bg-[#F8F7F3] text-xs font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-[#111111] mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-[#E8E5DE] rounded-xl bg-[#F8F7F3] text-xs font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-[#111111] mb-1">Select Active Role Simulation</label>
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value as UserRole)}
            className="w-full px-3 py-2.5 border border-[#E8E5DE] rounded-xl bg-[#F8F7F3] text-xs font-semibold"
          >
            <option value="Super Admin">Super Admin (Full Access)</option>
            <option value="Store Manager">Store Manager</option>
            <option value="Inventory Manager">Inventory Manager</option>
            <option value="Order Manager">Order Manager</option>
            <option value="Content Manager">Content Manager</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-1.5 text-[#6B6B6B] cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded-xs text-[#D4AF37]" />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => setCurrentTab('forgot-password')}
            className="text-[#D4AF37] font-semibold hover:underline cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        <Button variant="gold" type="submit" size="lg" className="w-full font-bold">
          Sign In to Admin Panel
        </Button>
      </form>

      <div className="p-3 bg-[#F8F7F3] rounded-xl border border-[#E8E5DE] text-[10px] text-center text-[#6B6B6B]">
        Secured with TLS 1.3 & Role-Based Access Control
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const { setCurrentTab } = useAdmin();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-[#E8E5DE] p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-lg font-bold text-[#111111]">Reset Admin Password</h1>
        <p className="text-xs text-[#6B6B6B]">Enter your authorized HK Fabric staff email</p>
      </div>

      {sent ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
          <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
          <p className="text-xs font-bold text-emerald-900">Recovery Link Dispatched!</p>
          <p className="text-[11px] text-emerald-700">Check your inbox at {email} for instructions.</p>
          <Button variant="secondary" size="sm" onClick={() => setCurrentTab('login')}>Return to Login</Button>
        </div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#111111] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ahsan@hkfabric.pk"
              className="w-full px-3 py-2 border border-[#E8E5DE] rounded-xl bg-[#F8F7F3]"
            />
          </div>

          <Button variant="gold" type="submit" size="lg" className="w-full font-bold">
            Send Recovery Email
          </Button>

          <div className="text-center pt-2">
            <button type="button" onClick={() => setCurrentTab('login')} className="text-xs text-[#6B6B6B] hover:text-[#111111] cursor-pointer">
              Back to Sign In
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
