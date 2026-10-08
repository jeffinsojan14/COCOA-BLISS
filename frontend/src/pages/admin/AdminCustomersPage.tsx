import React, { useEffect, useState } from 'react';
import {
  Search,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Check,
  X,
  Crown,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { AdminCustomer, AdminStaffRequest } from '../../types';
import { adminService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminCustomersPage: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin = !!user && (user.email?.toLowerCase() === 'admin@cocoabliss.com' || user.is_superuser);

  const [activeTab, setActiveTab] = useState<'customers' | 'admin-requests'>('customers');
  
  // Customers State
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [search, setSearch] = useState('');

  // Admin Requests State
  const [adminRequests, setAdminRequests] = useState<AdminStaffRequest[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const data = await adminService.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const fetchAdminRequests = async () => {
    if (!isSuperAdmin) return;
    try {
      setLoadingRequests(true);
      const res = await adminService.getAdminRequests();
      setAdminRequests(res.requests);
      setPendingCount(res.pending_count);
    } catch (err) {
      console.error('Failed to load admin requests', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    if (isSuperAdmin) {
      fetchAdminRequests();
    }
  }, [isSuperAdmin]);

  const handleAction = async (userId: number, action: 'approve' | 'reject') => {
    try {
      setActionLoadingId(userId);
      setStatusMessage(null);
      const res = await adminService.handleAdminRequest(userId, action);
      setStatusMessage({ type: 'success', text: res.message });
      await fetchAdminRequests();
      await fetchCustomers();
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to update administrator request.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-cocoa-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-950">
            User & Access Management
          </h1>
          <p className="text-xs text-cocoa-500 mt-0.5">
            Manage customer directories, track purchase totals, and review administrator registration requests
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-cocoa-100/80 p-1 rounded-2xl border border-cocoa-200/60 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'customers'
                ? 'bg-white text-cocoa-950 shadow-xs'
                : 'text-cocoa-700 hover:text-cocoa-950'
            }`}
          >
            Customers Directory ({customers.length})
          </button>
          
          <button
            onClick={() => {
              setActiveTab('admin-requests');
              if (isSuperAdmin) fetchAdminRequests();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'admin-requests'
                ? 'bg-[#1e0d06] text-white shadow-xs'
                : 'text-cocoa-700 hover:text-cocoa-950'
            }`}
          >
            <ShieldCheck size={14} className={activeTab === 'admin-requests' ? 'text-caramel-400' : 'text-cocoa-600'} />
            <span>Admin Approvals</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-cocoa-950 animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Status Feedback Toast */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-medium flex items-center justify-between shadow-xs transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-red-50 border border-red-200 text-red-900'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="opacity-70 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      {/* TAB 1: CUSTOMERS DIRECTORY */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#ebdccd]">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, phone..."
                className="w-full pl-9 pr-4 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950"
              />
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-3xl border border-[#ebdccd] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-cocoa-200 bg-cocoa-50/50 text-cocoa-900">
                    <th className="py-3 px-4 font-bold">Customer Name</th>
                    <th className="py-3 px-3 font-bold">Contact Details</th>
                    <th className="py-3 px-3 font-bold">Delivery Address</th>
                    <th className="py-3 px-3 font-bold">Orders Placed</th>
                    <th className="py-3 px-3 font-bold">Total Spent</th>
                    <th className="py-3 px-4 font-bold">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cocoa-100">
                  {loadingCustomers ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-cocoa-500">
                        Loading customer database...
                      </td>
                    </tr>
                  ) : filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-cocoa-500">
                        No customers found.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-cocoa-50/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-cocoa-950">
                          {cust.full_name}
                        </td>
                        <td className="py-3 px-3 space-y-0.5">
                          <div className="flex items-center gap-1.5 text-cocoa-800">
                            <Mail size={12} className="text-cocoa-400" />
                            <span>{cust.email}</span>
                          </div>
                          {cust.phone && (
                            <div className="flex items-center gap-1.5 text-cocoa-600">
                              <Phone size={12} className="text-cocoa-400" />
                              <span>{cust.phone}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-cocoa-600 max-w-xs">
                          {cust.address ? `${cust.address}, ${cust.city} ${cust.postal_code}` : 'No address saved yet'}
                        </td>
                        <td className="py-3 px-3 text-cocoa-800 font-semibold">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cocoa-100 rounded-md">
                            <ShoppingBag size={11} className="text-cocoa-700" />
                            {cust.orders_count} orders
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-caramel-800">
                          ₹{cust.total_spent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-cocoa-500">
                          {new Date(cust.date_joined).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADMIN ACCESS REQUESTS & APPROVALS */}
      {activeTab === 'admin-requests' && (
        <div className="space-y-6">
          
          {/* Security Alert Banner */}
          {!isSuperAdmin ? (
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <ShieldAlert size={18} className="text-amber-600" />
                <span>Super Administrator Privilege Required</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Only the designated Super Admin (<span className="font-semibold text-amber-950">admin@cocoabliss.com</span>) has the authority to accept, promote, or reject new Administrator accounts.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-[#1e0d06] to-[#2d140a] text-white p-6 rounded-3xl border border-caramel-600/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Crown className="text-amber-400" size={18} />
                    <span className="font-bold text-sm text-white">Super Admin Control Panel</span>
                  </div>
                  <p className="text-xs text-cocoa-200">
                    Logged in as <strong className="text-white">admin@cocoabliss.com</strong>. You hold sole authority to grant administrator privileges to registered users.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 bg-white/10 rounded-xl text-xs font-semibold text-caramel-300 border border-white/10">
                    {pendingCount} Pending Request{pendingCount !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={fetchAdminRequests}
                    className="px-4 py-1.5 bg-caramel-500 hover:bg-caramel-400 text-cocoa-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {/* Requests Table */}
              <div className="bg-white rounded-3xl border border-[#ebdccd] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-cocoa-200 bg-cocoa-50/50 text-cocoa-900">
                        <th className="py-3.5 px-4 font-bold">Applicant Details</th>
                        <th className="py-3.5 px-3 font-bold">Email</th>
                        <th className="py-3.5 px-3 font-bold">Phone</th>
                        <th className="py-3.5 px-3 font-bold">Status</th>
                        <th className="py-3.5 px-3 font-bold">Requested On</th>
                        <th className="py-3.5 px-4 font-bold text-right">Super Admin Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cocoa-100">
                      {loadingRequests ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-cocoa-500">
                            Loading administrator requests...
                          </td>
                        </tr>
                      ) : adminRequests.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-cocoa-500 space-y-2">
                            <ShieldCheck size={32} className="mx-auto text-cocoa-300" />
                            <p className="font-medium text-cocoa-700">No admin access requests found.</p>
                            <p className="text-[11px] text-cocoa-400">When users select "Administrator" during registration, their approval requests will appear here.</p>
                          </td>
                        </tr>
                      ) : (
                        adminRequests.map((req) => {
                          const isPending = req.admin_status === 'pending';
                          const isApproved = req.admin_status === 'approved';
                          const isRejected = req.admin_status === 'rejected';

                          return (
                            <tr key={req.id} className="hover:bg-cocoa-50/40 transition-colors">
                              <td className="py-3.5 px-4">
                                <span className="font-bold text-cocoa-950 block">{req.full_name}</span>
                                <span className="text-[10px] text-cocoa-500 uppercase tracking-wider font-semibold">
                                  Current Role: {req.role}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 text-cocoa-800 font-mono text-[11px]">
                                {req.email}
                              </td>
                              <td className="py-3.5 px-3 text-cocoa-600">
                                {req.phone || 'N/A'}
                              </td>
                              <td className="py-3.5 px-3">
                                {isPending && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-bold text-[10px] uppercase tracking-wider">
                                    <Clock size={11} className="text-amber-600" /> Pending Review
                                  </span>
                                )}
                                {isApproved && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold text-[10px] uppercase tracking-wider">
                                    <Check size={11} className="text-emerald-600" /> Approved Admin
                                  </span>
                                )}
                                {isRejected && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-full font-bold text-[10px] uppercase tracking-wider">
                                    <X size={11} className="text-gray-500" /> Rejected (Customer)
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-3 text-cocoa-500">
                                {new Date(req.date_joined).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {isPending && (
                                    <>
                                      <button
                                        onClick={() => handleAction(req.id, 'approve')}
                                        disabled={actionLoadingId === req.id}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                                      >
                                        <Check size={12} />
                                        <span>Approve Admin</span>
                                      </button>
                                      <button
                                        onClick={() => handleAction(req.id, 'reject')}
                                        disabled={actionLoadingId === req.id}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold text-[11px] transition-colors disabled:opacity-50 cursor-pointer"
                                      >
                                        <X size={12} />
                                        <span>Reject</span>
                                      </button>
                                    </>
                                  )}

                                  {isApproved && (
                                    <button
                                      onClick={() => handleAction(req.id, 'reject')}
                                      disabled={actionLoadingId === req.id}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded-lg text-[10px] font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                      Revoke Admin
                                    </button>
                                  )}

                                  {isRejected && (
                                    <button
                                      onClick={() => handleAction(req.id, 'approve')}
                                      disabled={actionLoadingId === req.id}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 rounded-lg text-[10px] font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                      Re-Approve
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>
      )}

    </div>
  );
};
