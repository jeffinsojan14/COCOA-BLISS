import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Eye, Calendar, Clock } from 'lucide-react';
import { Order } from '../types';
import { orderService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const OrderHistoryPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      try {
        setLoading(true);
        const data = await orderService.getOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs text-cocoa-600 font-medium">Retrieving your order history...</p>
      </div>
    );
  }

  // Empty state matching section 37
  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-cocoa-50 text-cocoa-400 flex items-center justify-center mx-auto shadow-inner">
          <Package size={36} />
        </div>
        <h2 className="font-serif text-3xl font-bold text-cocoa-950">
          No Orders Yet
        </h2>
        <p className="text-xs sm:text-sm text-cocoa-500 max-w-sm mx-auto">
          "You haven't placed any orders yet." Discover our freshly prepared homemade chocolates and place your first sweet order!
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-cocoa-950 hover:bg-caramel-600 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md"
        >
          <span>Shop Chocolates</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'preparing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'confirmed':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      <div className="border-b border-cocoa-100 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-950">
          My Chocolate Orders ({orders.length})
        </h1>
        <p className="text-xs text-cocoa-500 mt-0.5">
          View past shipments, status updates, and printable invoices
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl border border-[#ebdccd] p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            {/* Left: Order Info */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-cocoa-950 text-sm">
                  #{order.order_number}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getStatusColor(
                    order.order_status
                  )}`}
                >
                  {order.order_status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-cocoa-500">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <span>&bull;</span>
                <span>{order.items?.length || 0} Product(s)</span>
                <span>&bull;</span>
                <span className="capitalize">{order.payment_method_display || order.payment_method}</span>
              </div>

              {/* Items preview thumbnails */}
              <div className="flex items-center gap-2 pt-1">
                {order.items?.slice(0, 4).map((item, idx) => (
                  <div
                    key={idx}
                    className="w-9 h-9 rounded-lg overflow-hidden bg-cocoa-50 border border-cocoa-100"
                    title={item.product_name_snapshot}
                  >
                    {item.product_image_snapshot && (
                      <img
                        src={item.product_image_snapshot}
                        alt={item.product_name_snapshot}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
                {order.items?.length > 4 && (
                  <span className="text-[11px] text-cocoa-400 font-semibold pl-1">
                    +{order.items.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Right: Total and View Button */}
            <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-cocoa-100 gap-2">
              <div className="text-left md:text-right">
                <span className="text-[11px] text-cocoa-400 block">Total Amount</span>
                <span className="font-serif font-bold text-lg text-cocoa-950">
                  ₹{order.total_amount}
                </span>
              </div>

              <Link
                to={`/orders/${order.order_number}`}
                className="px-4 py-2 bg-cocoa-50 hover:bg-cocoa-950 hover:text-white text-cocoa-900 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-cocoa-200"
              >
                <Eye size={13} />
                <span>View & Track</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
