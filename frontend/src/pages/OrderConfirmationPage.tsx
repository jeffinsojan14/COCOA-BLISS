import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, ArrowRight, Printer, ShoppingBag } from 'lucide-react';
import { Order } from '../types';
import { orderService } from '../services/api';
import { PrintableInvoice } from '../components/orders/PrintableInvoice';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c58b35', '#2d140a', '#e6a853', '#781b1b']
      });
    } catch {
      // ignore
    }

    const fetchOrder = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await orderService.getOrderDetail(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order confirmation', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs text-cocoa-600">Finalizing your sweet order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-cocoa-950">Order Not Found</h2>
        <p className="text-xs text-cocoa-600">Could not retrieve confirmation details.</p>
        <Link to="/orders" className="inline-block px-6 py-2 bg-cocoa-950 text-white rounded-full text-xs">
          View All Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      
      {/* Celebration Header */}
      <div className="text-center space-y-3 bg-white p-8 rounded-3xl border border-[#ebdccd] shadow-xs">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={36} />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-caramel-600 block">
          Order Placed Successfully! 🤎
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cocoa-950 tracking-tight">
          Thank You For Your Order!
        </h1>
        <p className="text-xs sm:text-sm text-cocoa-600 max-w-lg mx-auto leading-relaxed">
          We have received your order <span className="font-bold text-cocoa-950">#{order.order_number}</span> and are preparing your homemade chocolates with love and care.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={`/orders/${order.order_number}`}
            className="px-6 py-2.5 bg-cocoa-950 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-caramel-600 transition-colors flex items-center gap-1.5"
          >
            <Package size={14} />
            <span>Track Order</span>
          </Link>
          <button
            onClick={() => setShowInvoice(!showInvoice)}
            className="px-6 py-2.5 bg-white border border-cocoa-300 text-cocoa-900 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-cocoa-50 transition-colors flex items-center gap-1.5"
          >
            <Printer size={14} />
            <span>{showInvoice ? 'Hide Invoice' : 'View / Print Invoice'}</span>
          </button>
          <Link
            to="/shop"
            className="px-6 py-2.5 bg-caramel-100 text-cocoa-950 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-caramel-200 transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag size={14} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>

      {/* Invoice Toggle View */}
      {showInvoice && (
        <div className="animate-in fade-in duration-300">
          <PrintableInvoice order={order} />
        </div>
      )}

      {/* Quick Summary Card */}
      <div className="bg-white rounded-3xl border border-[#ebdccd] p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="font-serif font-bold text-lg text-cocoa-950 border-b border-cocoa-100 pb-3">
          Order Overview
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-cocoa-500 font-medium block">Order Number:</span>
            <span className="font-bold text-cocoa-950 text-sm">{order.order_number}</span>
          </div>
          <div>
            <span className="text-cocoa-500 font-medium block">Date:</span>
            <span className="font-bold text-cocoa-950 text-sm">
              {new Date(order.created_at).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-cocoa-500 font-medium block">Status:</span>
            <span className="font-bold text-emerald-700 capitalize text-sm">{order.order_status}</span>
          </div>
        </div>

        {/* Shipping details */}
        <div className="bg-cocoa-50/50 p-4 rounded-xl text-xs space-y-1">
          <span className="font-bold text-cocoa-900 block uppercase tracking-wider text-[10px]">
            Delivering To:
          </span>
          <p className="font-bold text-cocoa-950">{order.customer_name} ({order.customer_phone})</p>
          <p className="text-cocoa-700">{order.shipping_address}, {order.city}, {order.state} - {order.postal_code}</p>
        </div>

        {/* Ordered items preview */}
        <div className="divide-y divide-cocoa-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-3">
                {item.product_image_snapshot && (
                  <img
                    src={item.product_image_snapshot}
                    alt={item.product_name_snapshot}
                    className="w-12 h-12 rounded-lg object-cover bg-cocoa-50"
                  />
                )}
                <div>
                  <p className="font-bold text-cocoa-950">{item.product_name_snapshot}</p>
                  <p className="text-cocoa-500 text-[11px]">{item.product_weight_snapshot}</p>
                  <p className="text-cocoa-600">Qty: {item.quantity} &times; ₹{item.unit_price}</p>
                </div>
              </div>
              <span className="font-bold text-cocoa-950">₹{item.subtotal}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-cocoa-100 pt-4 flex justify-between items-center text-sm font-bold text-cocoa-950">
          <span>Grand Total Paid / Due:</span>
          <span className="text-caramel-700 font-serif text-xl">₹{order.total_amount}</span>
        </div>
      </div>

    </div>
  );
};
