import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { adminService } from '../../services/api';
import { Category } from '../../types';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', image_url: '', is_active: true });
    setModalOpen(true);
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description,
      image_url: cat.image_url || '',
      is_active: cat.is_active,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete category '${name}'?`)) {
      try {
        await adminService.deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } catch (err: any) {
        alert(err.response?.data?.error || 'Failed to delete category.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await adminService.updateCategory(editingCategory.id, formData);
      } else {
        await adminService.createCategory(formData);
      }
      setModalOpen(false);
      await fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cocoa-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-950">Chocolate Categories</h1>
          <p className="text-xs text-cocoa-500 mt-0.5">
            Organize chocolates by style, cocoa percentage, and gift assortments
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="px-4 py-2.5 bg-cocoa-950 hover:bg-caramel-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus size={14} />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#ebdccd] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-cocoa-200 bg-cocoa-50/50 text-cocoa-900">
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-3 font-bold">Description</th>
                <th className="py-3 px-3 font-bold">Active Products</th>
                <th className="py-3 px-3 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-cocoa-500">
                    Loading categories...
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-cocoa-50/40 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={cat.display_image || cat.image_url || '/placeholder-chocolate.jpg'}
                        alt={cat.name}
                        className="w-10 h-10 rounded-lg object-cover bg-cocoa-50 border border-cocoa-100 shrink-0"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.endsWith('/placeholder-chocolate.jpg')) {
                            target.src = '/placeholder-chocolate.jpg';
                          }
                        }}
                      />
                      <div>
                        <span className="font-bold text-cocoa-950 block">{cat.name}</span>
                        <span className="text-[10px] text-cocoa-400">/{cat.slug}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-cocoa-600 max-w-sm">{cat.description}</td>
                    <td className="py-3 px-3 font-bold text-cocoa-900">{cat.products_count} Chocolates</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cat.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {cat.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-1.5 text-cocoa-700 hover:text-cocoa-950 hover:bg-cocoa-100 rounded-lg transition-colors"
                        title="Edit Category"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Category"
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-cocoa-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-cocoa-950">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-cocoa-400 hover:text-cocoa-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-cocoa-900 block">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Nut Chocolates"
                  className="w-full px-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl focus:outline-none focus:border-cocoa-950"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-cocoa-900 block">Description *</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Summary of this chocolate style..."
                  className="w-full px-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl focus:outline-none focus:border-cocoa-950"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-cocoa-900 block">Cover Image URL *</label>
                <div className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://images.unsplash.com/... or https://cdn.pixabay.com/..."
                      className="w-full px-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl focus:outline-none focus:border-cocoa-950"
                    />
                    <p className="text-[11px] text-cocoa-500 mt-1">
                      Direct image link. Right-click the image online and click <strong>"Copy Image Address"</strong>.
                    </p>
                    {formData.image_url.includes('/search/') && (
                      <p className="text-[11px] text-amber-700 font-medium mt-1 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                        ⚠️ This link is a search results page, not a direct image file. Please copy the image's address directly.
                      </p>
                    )}
                  </div>
                  {formData.image_url && (
                    <div className="w-16 h-16 rounded-xl border border-cocoa-200 overflow-hidden shrink-0 bg-cocoa-50 flex flex-col items-center justify-center">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/placeholder-chocolate.jpg';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded"
                  />
                  <span className="font-medium text-cocoa-900">Active and visible in store</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-cocoa-800 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-cocoa-950 hover:bg-caramel-600 text-white rounded-xl font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
