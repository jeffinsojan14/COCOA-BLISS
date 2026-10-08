import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import { adminService, productService } from '../../services/api';
import { Product, Category } from '../../types';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    short_description: '',
    description: '',
    ingredients: 'Cocoa Butter, Cocoa Solids, Whole Milk Powder, Sugar, Natural Vanilla Flavor',
    price: '',
    original_price: '',
    weight: '150g',
    stock_quantity: '30',
    image_url: '',
    is_available: true,
    is_bestseller: false,
    is_featured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [prodData, catData] = await Promise.all([
        adminService.getProducts(),
        productService.getCategories(),
      ]);
      setProducts(prodData);
      setCategories(catData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      category: categories[0]?.id.toString() || '',
      name: '',
      short_description: '',
      description: '',
      ingredients: 'Cocoa Butter, Cocoa Solids, Whole Milk Powder, Sugar, Natural Vanilla Flavor',
      price: '',
      original_price: '',
      weight: '150g',
      stock_quantity: '30',
      image_url: '',
      is_available: true,
      is_bestseller: false,
      is_featured: false,
    });
    setModalOpen(true);
  };

  const handleEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      category: prod.category.toString(),
      name: prod.name,
      short_description: prod.short_description || '',
      description: prod.description || '',
      ingredients: prod.ingredients || '',
      price: prod.price.toString(),
      original_price: prod.original_price ? prod.original_price.toString() : '',
      weight: prod.weight,
      stock_quantity: prod.stock_quantity.toString(),
      image_url: prod.image_url || '',
      is_available: prod.is_available,
      is_bestseller: prod.is_bestseller,
      is_featured: prod.is_featured,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete '${name}'? This action cannot be undone.`)) {
      try {
        await adminService.deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch {
        alert('Failed to delete product.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null && v !== '') {
        data.append(k, String(v));
      }
    });

    try {
      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, data);
      } else {
        await adminService.createProduct(data);
      }
      setModalOpen(false);
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || p.category.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cocoa-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-950">Chocolate Products & Stock</h1>
          <p className="text-xs text-cocoa-500 mt-0.5">Manage recipes, descriptions, prices, and available batches</p>
        </div>
        <button
          onClick={handleAddNew}
          className="px-4 py-2.5 bg-cocoa-950 hover:bg-caramel-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus size={14} />
          <span>Add New Chocolate</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#ebdccd]">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chocolate name..."
            className="w-full pl-9 pr-4 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-white border border-cocoa-200 rounded-xl text-xs font-medium text-cocoa-900 focus:outline-none focus:border-cocoa-950 w-full sm:w-auto"
          >
            <option value="">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id.toString()}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#ebdccd] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-cocoa-200 bg-cocoa-50/50 text-cocoa-900">
                <th className="py-3 px-4 font-bold">Product</th>
                <th className="py-3 px-3 font-bold">Category</th>
                <th className="py-3 px-3 font-bold">Price</th>
                <th className="py-3 px-3 font-bold">Weight</th>
                <th className="py-3 px-3 font-bold">Stock</th>
                <th className="py-3 px-3 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-cocoa-500">
                    Loading chocolates...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-cocoa-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-cocoa-50/40 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={p.display_image || p.image_url || '/placeholder-chocolate.jpg'}
                        alt={p.name}
                        className="w-11 h-11 rounded-lg object-cover bg-cocoa-50 border border-cocoa-100 shrink-0"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.endsWith('/placeholder-chocolate.jpg')) {
                            target.src = '/placeholder-chocolate.jpg';
                          }
                        }}
                      />
                      <div>
                        <span className="font-bold text-cocoa-950 block">{p.name}</span>
                        {p.is_bestseller && (
                          <span className="text-[9px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
                            BESTSELLER
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-cocoa-700 font-medium">{p.category_name}</td>
                    <td className="py-3 px-3 font-bold text-cocoa-950">₹{p.price}</td>
                    <td className="py-3 px-3 text-cocoa-600">{p.weight}</td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${p.stock_quantity <= 10 ? 'text-amber-700' : 'text-cocoa-900'}`}>
                        {p.stock_quantity}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {p.stock_quantity === 0 ? (
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-[10px] font-bold uppercase">
                          Out of Stock
                        </span>
                      ) : p.stock_quantity <= 10 ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold uppercase">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold uppercase">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-1.5 text-cocoa-700 hover:text-cocoa-950 hover:bg-cocoa-100 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-cocoa-100 pb-3">
              <h3 className="font-serif font-bold text-xl text-cocoa-950">
                {editingProduct ? 'Edit Chocolate Recipe' : 'Add New Handcrafted Chocolate'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-cocoa-400 hover:text-cocoa-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-cocoa-900 block">Chocolate Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Pistachio Truffle Bar"
                    className="w-full px-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl focus:outline-none focus:border-cocoa-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-cocoa-900 block">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl focus:outline-none focus:border-cocoa-950"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-cocoa-900 block">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="399.00"
                    className="w-full px-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl focus:outline-none focus:border-cocoa-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-cocoa-900 block">Original / Strikethrough Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    placeholder="449.00"
                    className="w-full px-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl focus:outline-none focus:border-cocoa-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-cocoa-900 block">Pack Weight / Quantity *</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    required
                    placeholder="e.g. 150g (8 Pcs)"
                    className="w-full px-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl focus:outline-none focus:border-cocoa-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-cocoa-900 block">Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    required
                    min="0"
                    className="w-full px-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl focus:outline-none focus:border-cocoa-950"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-cocoa-900 block">Image URL *</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl focus:outline-none focus:border-cocoa-950"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-cocoa-900 block">Short Tagline Description *</label>
                  <input
                    type="text"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    required
                    placeholder="Velvety roasted hazelnut truffles dusted with Dutch cocoa"
                    className="w-full px-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl focus:outline-none focus:border-cocoa-950"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-cocoa-900 block">Full Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed artisanal craft story..."
                    className="w-full px-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl focus:outline-none focus:border-cocoa-950"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-cocoa-900 block">Ingredients</label>
                  <input
                    type="text"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    className="w-full px-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl focus:outline-none focus:border-cocoa-950"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 pt-2 border-t border-cocoa-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_bestseller}
                    onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked })}
                    className="rounded"
                  />
                  <span>Mark as Best Seller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded"
                  />
                  <span>Feature on Homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="rounded"
                  />
                  <span>Is Available for Purchase</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-cocoa-800 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-cocoa-950 hover:bg-caramel-600 text-white rounded-xl font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Chocolate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
