import React from 'react';
import { Clock, CheckCircle2, ChefHat, Truck, PackageCheck, XCircle } from 'lucide-react';

interface OrderStatusTimelineProps {
  currentStatus: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  updatedAt?: string;
}

const steps = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: PackageCheck },
];

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({ currentStatus }) => {
  if (currentStatus === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-800">
        <XCircle className="text-red-600 shrink-0" size={24} />
        <div>
          <h4 className="font-bold text-sm">Order Cancelled</h4>
          <p className="text-xs text-red-600 mt-0.5">
            This order has been cancelled and any charged amount is being refunded.
          </p>
        </div>
      </div>
    );
  }

  const stepOrder = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered'];
  const currentIndex = stepOrder.indexOf(currentStatus);

  return (
    <div className="py-6 px-4 bg-cocoa-50/50 rounded-2xl border border-cocoa-100">
      <div className="relative flex items-center justify-between">
        {/* Progress connecting line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-cocoa-200 z-0">
          <div
            className="h-full bg-caramel-500 transition-all duration-500"
            style={{ width: `${(currentIndex / (stepOrder.length - 1)) * 100}%` }}
          />
        </div>

        {/* Step dots */}
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-xs ${
                  isCurrent
                    ? 'bg-cocoa-950 text-white ring-4 ring-caramel-400/40 scale-110'
                    : isDone
                    ? 'bg-caramel-500 text-white'
                    : 'bg-white text-cocoa-300 border-2 border-cocoa-200'
                }`}
              >
                <Icon size={18} />
              </div>
              <span
                className={`text-[11px] font-medium mt-2 text-center max-w-[70px] ${
                  isCurrent ? 'text-cocoa-950 font-bold' : isDone ? 'text-cocoa-800' : 'text-cocoa-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
