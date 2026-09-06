from django.urls import path
from .views import (
    OrderListCreateView,
    OrderDetailView,
    OrderCancelView,
    AdminOrderListView,
    AdminOrderStatusUpdateView,
    AdminDashboardStatsView
)

urlpatterns = [
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<str:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('orders/<str:pk>/cancel/', OrderCancelView.as_view(), name='order-cancel'),

    # Admin
    path('admin/orders/', AdminOrderListView.as_view(), name='admin-orders'),
    path('admin/orders/<str:pk>/status/', AdminOrderStatusUpdateView.as_view(), name='admin-order-status-update'),
    path('admin/dashboard/stats/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),
]
