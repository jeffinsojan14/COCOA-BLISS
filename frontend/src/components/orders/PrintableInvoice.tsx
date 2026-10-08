import React from 'react';
import { Printer } from 'lucide-react';
import { Order } from '../../types';

interface PrintableInvoiceProps {
  order: Order;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ order }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-cocoa-200 shadow-sm p-6 sm:p-8">
      {/* Action header with print button */}
      <div className="flex items-center justify-between border-b border-cocoa-100 pb-4 mb-6 no-print">
        <h3 className="font-serif font-bold text-lg text-cocoa-950">Official Order Invoice</h3>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-cocoa-950 text-white rounded-lg text-xs font-semibold hover:bg-caramel-600 transition-colors shadow-xs"
        >
          <Printer size={14} />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Actual Printable Invoice Container */}
      <div id="printable-invoice" className="text-cocoa-950 font-sans">
        {/* Invoice Brand Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-cocoa-950 pb-6 mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-cocoa-950 tracking-tight">Cocoa Bliss</h1>
            <p className="text-xs uppercase tracking-widest text-caramel-600 font-semibold mt-0.5">
              Homemade Chocolates, Made with Love
            </p>
            <p className="text-xs text-cocoa-600 mt-1">12 Artisan Way, Indiranagar, Bengaluru, 560038</p>
            <p className="text-xs text-cocoa-600">support@cocoabliss.com | +91 98765 43210</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="inline-block px-3 py-1 bg-cocoa-100 text-cocoa-900 text-xs font-bold uppercase rounded-md tracking-wider">
              INVOICE
            </span>
            <p className="text-sm font-bold text-cocoa-950 mt-2">#{order.order_number}</p>
            <p className="text-xs text-cocoa-600">
              Date: {new Date(order.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-xs text-cocoa-600">Status: <span className="font-semibold capitalize text-emerald-700">{order.order_status}</span></p>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-cocoa-50/50 p-4 rounded-xl mb-6 text-xs">
          <div>
            <h4 className="font-bold text-cocoa-900 uppercase tracking-wider text-[11px] mb-2">Billed & Shipped To:</h4>
            <p className="font-bold text-sm text-cocoa-950">{order.customer_name}</p>
            <p className="text-cocoa-700 mt-0.5">{order.shipping_address}</p>
            <p className="text-cocoa-700">{order.city}, {order.state} - {order.postal_code}</p>
            <p className="text-cocoa-700 mt-1">Phone: {order.customer_phone}</p>
            <p className="text-cocoa-700">Email: {order.customer_email}</p>
          </div>
          <div>
            <h4 className="font-bold text-cocoa-900 uppercase tracking-wider text-[11px] mb-2">Payment Details:</h4>
            <p className="text-cocoa-800">
              <span className="font-semibold">Payment Method:</span> {order.payment_method_display || order.payment_method.toUpperCase()}
            </p>
            <p className="text-cocoa-800 mt-1">
              <span className="font-semibold">Payment Status:</span>{' '}
              <span className={`font-bold capitalize ${order.payment_status === 'completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {order.payment_status}
              </span>
            </p>
            {order.notes && (
              <p className="text-cocoa-600 mt-2 italic">
                <span className="font-semibold">Special Instructions:</span> "{order.notes}"
              </p>
            )}
          </div>
        </div>

        {/* Product Items Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-cocoa-200 bg-cocoa-100/60 text-cocoa-900">
                <th className="py-3 px-3 font-bold">Item Description</th>
                <th className="py-3 px-3 font-bold">Weight / Size</th>
                <th className="py-3 px-3 font-bold text-right">Price</th>
                <th className="py-3 px-3 font-bold text-center">Qty</th>
                <th className="py-3 px-3 font-bold text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa-100">
              {order.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-cocoa-50/40">
                  <td className="py-3 px-3 font-medium text-cocoa-950">
                    {item.product_name_snapshot}
                  </td>
                  <td className="py-3 px-3 text-cocoa-600">
                    {item.product_weight_snapshot || 'Standard'}
                  </td>
                  <td className="py-3 px-3 text-right text-cocoa-800">
                    ₹{item.unit_price}
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-cocoa-900">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-cocoa-950">
                    ₹{item.subtotal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex justify-end">
          <div className="w-full sm:w-64 space-y-2 text-xs border-t border-cocoa-200 pt-4">
            <div className="flex justify-between text-cocoa-700">
              <span>Subtotal:</span>
              <span className="font-semibold">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-cocoa-700">
              <span>Delivery Charge:</span>
              <span className="font-semibold">
                {Number(order.delivery_charge) === 0 ? 'FREE' : `₹${order.delivery_charge}`}
              </span>
            </div>
            <div className="border-t border-cocoa-300 pt-2 flex justify-between text-base font-bold text-cocoa-950">
              <span>Grand Total:</span>
              <span className="text-caramel-700">₹{order.total_amount}</span>
            </div>
          </div>
        </div>

        {/* Invoice Footer */}
        <div className="border-t border-cocoa-100 mt-8 pt-4 text-center text-[11px] text-cocoa-500">
          <p>Thank you for supporting homemade craftsmanship! All our chocolates are crafted fresh with premium ingredients.</p>
          <p className="mt-1">For queries or custom festive hampers, contact support@cocoabliss.com</p>
        </div>
      </div>
    </div>
  );
};
