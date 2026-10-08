import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Eye,
  Plus
} from 'lucide-react';
import { DashboardStats, Order } from '../../types';
import { adminService } from '../../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleStatusChange = async (orderId: string | number, newStatus: string) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      // Refresh stats
      const fresh = await adminService.getDashboardStats();
      setStats(fresh);
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-cocoa-600">Gathering store statistics...</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cocoa-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-950">
            Store Overview & Analytics
          </h1>
          <p className="text-xs text-cocoa-500 mt-0.5">
            Real-time business performance for Cocoa Bliss
          </p>
        </div>
        <Link
          to="/admin/products"
          className="px-4 py-2.5 bg-cocoa-950 hover:bg-caramel-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus size={14} />
          <span>Add Chocolate</span>
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebdccd] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cocoa-500 font-medium">Total Sales</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-cocoa-950">
            ₹{stats.total_sales.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">Excludes cancelled orders</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebdccd] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cocoa-500 font-medium">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-cocoa-50 text-cocoa-900 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-cocoa-950">
            {stats.total_orders}
          </div>
          <p className="text-[11px] text-cocoa-500">{stats.completed_orders} Completed &bull; {stats.pending_orders} In-progress</p>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebdccd] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cocoa-500 font-medium">Low Stock Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-cocoa-950">
            {stats.low_stock_products}
          </div>
          <Link to="/admin/products" className="text-[11px] text-amber-700 hover:underline font-semibold block">
            Review stock quantities &rarr;
          </Link>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebdccd] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cocoa-500 font-medium">Registered Customers</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-cocoa-950">
            {stats.total_customers}
          </div>
          <Link to="/admin/customers" className="text-[11px] text-blue-700 hover:underline font-semibold block">
            View customer database &rarr;
          </Link>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-[#ebdccd] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-cocoa-100">
          <div>
            <h3 className="font-serif font-bold text-lg text-cocoa-950">
              Recent Customer Orders
            </h3>
            <p className="text-xs text-cocoa-500">Live order status lifecycle updater</p>
          </div>
          <Link to="/admin/orders" className="text-xs font-bold text-caramel-700 hover:underline">
            View All Orders &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-cocoa-200 bg-cocoa-50/50 text-cocoa-900">
                <th className="py-3 px-3 font-bold">Order #</th>
                <th className="py-3 px-3 font-bold">Customer</th>
                <th className="py-3 px-3 font-bold">Amount</th>
                <th className="py-3 px-3 font-bold">Payment</th>
                <th className="py-3 px-3 font-bold">Current Status</th>
                <th className="py-3 px-3 font-bold">Update Status</th>
                <th className="py-3 px-3 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa-100">
              {stats.recent_orders.map((order) => (
                <tr key={order.id} className="hover:bg-cocoa-50/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-cocoa-950">
                    {order.order_number}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-cocoa-900">{order.customer_name}</p>
                    <p className="text-[10px] text-cocoa-500">{order.customer_phone}</p>
                  </td>
                  <td className="py-3 px-3 font-bold text-cocoa-950">
                    ₹{order.total_amount}
                  </td>
                  <td className="py-3 px-3">
                    <span className="capitalize text-cocoa-800 font-medium">
                      {order.payment_method_display || order.payment_method}
                    </span>
                    <span className={`block text-[10px] capitalize font-bold ${order.payment_status === 'completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cocoa-100 text-cocoa-900">
                      {order.order_status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={order.order_status}
                      onChange={(e) => handleStatusChange(order.order_number, e.target.value)}
                      className="px-2 py-1 bg-white border border-cocoa-300 rounded-lg text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950 cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Link
                      to={`/orders/${order.order_number}`}
                      className="p-1.5 inline-block text-cocoa-600 hover:text-cocoa-950 bg-cocoa-50 rounded-lg border border-cocoa-200"
                      title="View Invoice & Details"
                    >
                      <Eye size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
