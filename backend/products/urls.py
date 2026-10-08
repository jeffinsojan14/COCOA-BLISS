from django.urls import path
from .views import (
    CategoryListView,
    ProductListView,
    ProductDetailView,
    AddReviewView,
    AdminProductListCreateView,
    AdminProductDetailView,
    AdminCategoryListCreateView,
    AdminCategoryDetailView,
    AdminReviewListView
)

urlpatterns = [
    # Public
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/<int:pk>/reviews/', AddReviewView.as_view(), name='product-add-review'),

    # Admin
    path('admin/products/', AdminProductListCreateView.as_view(), name='admin-products'),
    path('admin/products/<int:pk>/', AdminProductDetailView.as_view(), name='admin-product-detail'),
    path('admin/categories/', AdminCategoryListCreateView.as_view(), name='admin-categories'),
    path('admin/categories/<int:pk>/', AdminCategoryDetailView.as_view(), name='admin-category-detail'),
    path('admin/reviews/', AdminReviewListView.as_view(), name='admin-reviews'),
    path('admin/reviews/<int:pk>/', AdminReviewListView.as_view(), name='admin-review-delete'),
]
