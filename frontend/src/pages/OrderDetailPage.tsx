import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Printer,
  ChevronLeft,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
  CreditCard
} from 'lucide-react';
import { Order } from '../types';
import { orderService } from '../services/api';
import { OrderStatusTimeline } from '../components/orders/OrderStatusTimeline';
import { PrintableInvoice } from '../components/orders/PrintableInvoice';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showInvoice, setShowInvoice] = useState<boolean>(false);
  const [cancelling, setCancelling] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await orderService.getOrderDetail(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!order) return;
    const confirm = window.confirm(`Are you sure you want to cancel order #${order.order_number}?`);
    if (!confirm) return;

    try {
      setCancelling(true);
      const res = await orderService.cancelOrder(order.order_number);
      setOrder(res.order);
      alert('Your order has been cancelled successfully.');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs text-cocoa-600 font-medium">Tracking your chocolate box...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-cocoa-950">Order Not Found</h2>
        <Link to="/orders" className="inline-block px-6 py-2 bg-cocoa-950 text-white rounded-full text-xs">
          Return to Orders
        </Link>
      </div>
    );
  }

  const canCancel = ['pending', 'confirmed'].includes(order.order_status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Navigation & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cocoa-100 pb-4">
        <div className="flex items-center gap-2">
          <Link
            to="/orders"
            className="p-1.5 rounded-lg border border-cocoa-200 text-cocoa-700 hover:bg-cocoa-50 transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-cocoa-950 flex items-center gap-2">
              <span>Order #{order.order_number}</span>
            </h1>
            <p className="text-xs text-cocoa-500">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowInvoice(!showInvoice)}
            className="px-4 py-2 bg-white border border-cocoa-300 rounded-xl text-xs font-semibold text-cocoa-900 hover:bg-cocoa-50 transition-colors flex items-center gap-1.5"
          >
            <Printer size={14} />
            <span>{showInvoice ? 'Hide Invoice' : 'Printable Invoice'}</span>
          </button>

          {canCancel && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors flex items-center gap-1.5"
            >
              <XCircle size={14} />
              <span>{cancelling ? 'Cancelling...' : 'Cancel Order'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Invoice Modal/Toggle */}
      {showInvoice && (
        <div className="animate-in fade-in duration-300">
          <PrintableInvoice order={order} />
        </div>
      )}

      {/* 1. Live Order Status Timeline */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cocoa-900">
          Shipment Progress
        </h3>
        <OrderStatusTimeline currentStatus={order.order_status} updatedAt={order.updated_at} />
      </div>

      {/* 2. Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Delivery Address */}
        <div className="bg-white rounded-2xl border border-[#ebdccd] p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-cocoa-900 font-serif font-bold text-sm">
            <MapPin size={16} className="text-caramel-600" />
            <span>Delivery Destination</span>
          </div>
          <div className="text-xs text-cocoa-700 space-y-1">
            <p className="font-bold text-cocoa-950">{order.customer_name}</p>
            <p>{order.shipping_address}</p>
            <p>{order.city}, {order.state} - {order.postal_code}</p>
            <p className="pt-1 text-cocoa-600">Phone: {order.customer_phone}</p>
            <p className="text-cocoa-600">Email: {order.customer_email}</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl border border-[#ebdccd] p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-cocoa-900 font-serif font-bold text-sm">
            <CreditCard size={16} className="text-caramel-600" />
            <span>Payment & Status</span>
          </div>
          <div className="text-xs text-cocoa-700 space-y-1.5">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-semibold text-cocoa-950">{order.payment_method_display}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className={`font-bold capitalize ${order.payment_status === 'completed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {order.payment_status}
              </span>
            </div>
            {order.notes && (
              <div className="pt-2 border-t border-cocoa-100 text-cocoa-600 italic">
                Note: "{order.notes}"
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 3. Itemized Products */}
      <div className="bg-white rounded-2xl border border-[#ebdccd] p-6 shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-base text-cocoa-950 border-b border-cocoa-100 pb-3">
          Chocolates in this Order ({order.items.length})
        </h3>

        <div className="divide-y divide-cocoa-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-4 first:pt-0 flex items-center justify-between text-xs gap-4">
              <div className="flex items-center gap-3">
                {item.product_image_snapshot && (
                  <img
                    src={item.product_image_snapshot}
                    alt={item.product_name_snapshot}
                    className="w-14 h-14 rounded-xl object-cover bg-cocoa-50 border border-cocoa-100"
                  />
                )}
                <div>
                  <h4 className="font-bold text-sm text-cocoa-950">{item.product_name_snapshot}</h4>
                  <p className="text-cocoa-500 text-[11px]">{item.product_weight_snapshot}</p>
                  <p className="text-cocoa-700 mt-1">₹{item.unit_price} &times; {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-sm text-cocoa-950">₹{item.subtotal}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Breakdown */}
        <div className="border-t border-cocoa-100 pt-4 flex justify-end">
          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-cocoa-700">
              <span>Subtotal:</span>
              <span className="font-semibold text-cocoa-950">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-cocoa-700">
              <span>Delivery Charge:</span>
              <span className="font-semibold text-cocoa-950">
                {Number(order.delivery_charge) === 0 ? 'FREE' : `₹${order.delivery_charge}`}
              </span>
            </div>
            <div className="border-t border-cocoa-200 pt-2 flex justify-between text-base font-bold text-cocoa-950">
              <span>Grand Total:</span>
              <span className="text-caramel-700 font-serif">₹{order.total_amount}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
