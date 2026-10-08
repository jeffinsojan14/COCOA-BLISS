from django.urls import path
from .views import CartView, AddToCartView, UpdateCartItemView, RemoveCartItemView, ClearCartView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart-detail'),
    path('cart/items/', AddToCartView.as_view(), name='cart-add'),
    path('cart/items/<int:pk>/', UpdateCartItemView.as_view(), name='cart-update'),
    path('cart/items/<int:pk>/remove/', RemoveCartItemView.as_view(), name='cart-remove'),
    path('cart/clear/', ClearCartView.as_view(), name='cart-clear'),
]
