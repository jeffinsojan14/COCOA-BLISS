import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cocoa-950">
          Get in Touch With Us
        </h1>
        <p className="text-xs sm:text-sm text-cocoa-600 mt-2">
          Have a question about custom wedding hampers, corporate gifting, or batch availability? We’d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Information Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1e0d06] text-white p-8 rounded-3xl space-y-6 shadow-xl border border-caramel-600/30">
            <h3 className="font-serif text-2xl font-bold text-white">
              Cocoa Bliss Kitchen
            </h3>
            <p className="text-xs text-cocoa-200 leading-relaxed">
              We welcome custom festive orders and chocolate tasting appointments at our artisan studio.
            </p>

            <div className="space-y-4 text-xs pt-2">
              <div className="flex items-start gap-3">
                <MapPin className="text-caramel-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="font-bold block text-white">Artisan Studio & Store</span>
                  <span className="text-cocoa-300">12 Artisan Way, Indiranagar, Bengaluru, Karnataka, 560038</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="text-caramel-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="font-bold block text-white">Phone / WhatsApp</span>
                  <span className="text-cocoa-300">+91 98765 43210</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="text-caramel-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="font-bold block text-white">Email Address</span>
                  <span className="text-cocoa-300">support@cocoabliss.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="text-caramel-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="font-bold block text-white">Studio Hours</span>
                  <span className="text-cocoa-300">Mon - Sat: 9:00 AM – 8:00 PM</span>
                  <span className="text-cocoa-300 block">Sunday: 10:00 AM – 4:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-[#ebdccd] p-8 sm:p-10 shadow-xs space-y-6">
            <h3 className="font-serif font-bold text-xl text-cocoa-950">
              Send us a Message
            </h3>

            {submitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>Thank you! Your message has been received. Our chocolatier will reply within 24 hours.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-cocoa-900 block">Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Aditi Rao"
                    className="w-full px-3.5 py-2.5 bg-cocoa-50/50 border border-cocoa-200 rounded-xl focus:outline-none focus:border-cocoa-950"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-cocoa-900 block">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="aditi@example.com"
                    className="w-full px-3.5 py-2.5 bg-cocoa-50/50 border border-cocoa-200 rounded-xl focus:outline-none focus:border-cocoa-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-cocoa-900 block">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-3.5 py-2.5 bg-cocoa-50/50 border border-cocoa-200 rounded-xl focus:outline-none focus:border-cocoa-950"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-cocoa-900 block">Inquiry Type</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-cocoa-50/50 border border-cocoa-200 rounded-xl focus:outline-none focus:border-cocoa-950"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Custom Gift Box">Custom / Wedding Gifting</option>
                    <option value="Corporate Bulk Order">Corporate Bulk Orders</option>
                    <option value="Order Support">Existing Order Support</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-cocoa-900 block">Message *</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  placeholder="How can we make your chocolate celebration memorable?"
                  className="w-full px-3.5 py-2.5 bg-cocoa-50/50 border border-cocoa-200 rounded-xl focus:outline-none focus:border-cocoa-950"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-cocoa-950 hover:bg-caramel-600 text-white rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <span>Send Message</span>
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};
