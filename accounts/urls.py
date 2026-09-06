from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    MeView,
    AdminCustomerListView,
    AdminRequestsListView,
    AdminRequestActionView
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('admin/customers/', AdminCustomerListView.as_view(), name='admin-customers'),
    path('admin/staff-requests/', AdminRequestsListView.as_view(), name='admin-requests'),
    path('admin/staff-requests/<int:user_id>/action/', AdminRequestActionView.as_view(), name='admin-request-action'),
]
