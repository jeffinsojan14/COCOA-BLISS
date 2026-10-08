import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Filter, CheckCircle2, Clock, Truck, ChefHat, XCircle } from 'lucide-react';
import { Order } from '../../types';
import { adminService } from '../../services/api';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminService.getOrders({
        status: statusFilter || undefined,
        search: search || undefined,
      });
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId: string | number, newStatus: string) => {
    try {
      const res = await adminService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.order_number === res.order.order_number ? res.order : o))
      );
    } catch {
      alert('Failed to update order status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-cocoa-200 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-950">
          Customer Orders Management
        </h1>
        <p className="text-xs text-cocoa-500 mt-0.5">
          Process, track, and update preparation and shipping statuses
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#ebdccd] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, phone..."
            className="w-full pl-9 pr-4 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-cocoa-500 whitespace-nowrap">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-cocoa-200 rounded-xl text-xs font-medium text-cocoa-900 focus:outline-none focus:border-cocoa-950 w-full sm:w-auto"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#ebdccd] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-cocoa-200 bg-cocoa-50/50 text-cocoa-900">
                <th className="py-3 px-4 font-bold">Order # & Date</th>
                <th className="py-3 px-3 font-bold">Customer Info</th>
                <th className="py-3 px-3 font-bold">Items</th>
                <th className="py-3 px-3 font-bold">Total</th>
                <th className="py-3 px-3 font-bold">Payment</th>
                <th className="py-3 px-3 font-bold">Current Status</th>
                <th className="py-3 px-3 font-bold">Lifecycle Action</th>
                <th className="py-3 px-4 font-bold text-center">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-cocoa-500">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-cocoa-500">No orders found matching criteria.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-cocoa-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-cocoa-950 block">#{o.order_number}</span>
                      <span className="text-[10px] text-cocoa-500">{new Date(o.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-cocoa-900">{o.customer_name}</p>
                      <p className="text-[10px] text-cocoa-500">{o.customer_phone}</p>
                      <p className="text-[10px] text-cocoa-500 truncate max-w-xs">{o.shipping_address}, {o.city}</p>
                    </td>
                    <td className="py-3 px-3 text-cocoa-700">
                      {o.items?.length || 0} Products
                    </td>
                    <td className="py-3 px-3 font-bold text-cocoa-950">
                      ₹{o.total_amount}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-cocoa-800 capitalize">{o.payment_method_display}</span>
                      <span className={`block text-[10px] capitalize font-bold ${o.payment_status === 'completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {o.payment_status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cocoa-100 text-cocoa-900">
                        {o.order_status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={o.order_status}
                        onChange={(e) => handleStatusChange(o.order_number, e.target.value)}
                        className="px-2.5 py-1 bg-white border border-cocoa-300 rounded-lg text-xs font-semibold text-cocoa-950 focus:outline-none focus:border-cocoa-950 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        to={`/orders/${o.order_number}`}
                        className="p-1.5 inline-block text-cocoa-700 hover:text-cocoa-950 bg-cocoa-50 rounded-lg border border-cocoa-200"
                        title="View Order Details & Print Invoice"
                      >
                        <Eye size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
