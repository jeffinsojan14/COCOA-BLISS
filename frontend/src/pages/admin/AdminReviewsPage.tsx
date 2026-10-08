import React, { useEffect, useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { adminService } from '../../services/api';
import { RatingStars } from '../../components/common/RatingStars';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await adminService.getReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this review?')) {
      try {
        await adminService.deleteReview(id);
        setReviews(reviews.filter((r) => r.id !== id));
      } catch {
        alert('Failed to remove review.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-cocoa-200 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-950">
          Reviews & Feedback Moderation
        </h1>
        <p className="text-xs text-cocoa-500 mt-0.5">
          Monitor customer experiences, feedback, and product ratings
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#ebdccd] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-cocoa-200 bg-cocoa-50/50 text-cocoa-900">
                <th className="py-3 px-4 font-bold">Product</th>
                <th className="py-3 px-3 font-bold">Customer</th>
                <th className="py-3 px-3 font-bold">Rating</th>
                <th className="py-3 px-3 font-bold">Review Comment</th>
                <th className="py-3 px-3 font-bold">Date</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-cocoa-500">Loading reviews...</td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-cocoa-500">No reviews found.</td>
                </tr>
              ) : (
                reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-cocoa-50/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-cocoa-950">
                      {rev.product_name}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-cocoa-900">{rev.user_name}</p>
                      <p className="text-[10px] text-cocoa-500">{rev.user_email}</p>
                    </td>
                    <td className="py-3 px-3">
                      <RatingStars rating={rev.rating} size={12} />
                    </td>
                    <td className="py-3 px-3 text-cocoa-700 max-w-md">
                      "{rev.comment}"
                    </td>
                    <td className="py-3 px-3 text-cocoa-500">
                      {new Date(rev.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Review"
                      >
                        <Trash2 size={14} />
                      </button>
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
