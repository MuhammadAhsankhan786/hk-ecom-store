import React from 'react';
import { useAdmin } from '../context/AdminContext';
import DataTable, { type Column } from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import type { AdminUser, UserRole } from '../types/admin';
import { Plus, Check } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { adminUsers, updateAdminUserRole, setCurrentTab, setSelectedEntityId } = useAdmin();

  const handleInvite = () => {
    setSelectedEntityId(null);
    setCurrentTab('create-admin-user');
  };

  const columns: Column<AdminUser>[] = [
    {
      key: 'name',
      header: 'Admin User',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs border border-[#D4AF37]">
            {u.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-bold text-[#111111]">{u.name}</p>
            <p className="text-[10px] text-[#6B6B6B]">{u.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      render: (u) => <Badge variant="gold">{u.role}</Badge>
    },
    { key: 'lastLogin', header: 'Last Login' },
    {
      key: 'status',
      header: 'Status',
      render: (u) => <Badge variant={u.status === 'Active' ? 'success' : 'gray'}>{u.status}</Badge>
    },
    {
      key: 'actions',
      header: 'Role Assignment',
      className: 'text-right',
      render: (u) => (
        <select
          value={u.role}
          onChange={e => updateAdminUserRole(u.id, e.target.value as UserRole)}
          className="text-xs px-2 py-1 border border-[#E8E5DE] rounded-md bg-[#F8F7F3] font-bold"
        >
          <option value="Super Admin">Super Admin</option>
          <option value="Store Manager">Store Manager</option>
          <option value="Inventory Manager">Inventory Manager</option>
          <option value="Order Manager">Order Manager</option>
          <option value="Content Manager">Content Manager</option>
        </select>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111111]">Admin Staff & Team Directory</h2>
          <p className="text-xs text-[#6B6B6B]">Manage authorized HK Fabric staff accounts and role privileges</p>
        </div>
        <Button variant="gold" onClick={handleInvite} icon={<Plus className="w-4 h-4" />}>
          Invite Team Member Form
        </Button>
      </div>

      <DataTable data={adminUsers} columns={columns} searchPlaceholder="Search admin staff..." />
    </div>
  );
};

// ROLES & PERMISSIONS MATRIX PAGE
export const RolesPermissionsPage: React.FC = () => {
  const { rolesMatrix } = useAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#111111]">Role-Based Access Control (RBAC) Matrix</h2>
        <p className="text-xs text-[#6B6B6B]">Granular module permissions per administrative role</p>
      </div>

      <div className="bg-white border border-[#E8E5DE] rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse hk-table">
          <thead>
            <tr>
              <th className="px-4 py-3.5">Role</th>
              <th className="px-4 py-3.5">Products</th>
              <th className="px-4 py-3.5">Orders</th>
              <th className="px-4 py-3.5">Inventory</th>
              <th className="px-4 py-3.5">Customers</th>
              <th className="px-4 py-3.5">Content</th>
              <th className="px-4 py-3.5">Reports</th>
              <th className="px-4 py-3.5">Settings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E5DE] text-xs">
            {rolesMatrix.map(rm => (
              <tr key={rm.role} className="hover:bg-[#F8F7F3]">
                <td className="px-4 py-3.5 font-bold text-[#111111]">
                  <p>{rm.role}</p>
                  <p className="text-[10px] text-[#6B6B6B] font-normal">{rm.description}</p>
                </td>
                {Object.entries(rm.permissions).map(([key, val]) => (
                  <td key={key} className="px-4 py-3.5">
                    {val ? (
                      <span className="p-1 bg-emerald-50 text-emerald-700 rounded-full inline-block">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
