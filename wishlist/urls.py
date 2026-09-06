from django.urls import path
from .views import WishlistView, ToggleWishlistView, RemoveWishlistItemView, MoveToCartView

urlpatterns = [
    path('wishlist/', WishlistView.as_view(), name='wishlist-detail'),
    path('wishlist/toggle/', ToggleWishlistView.as_view(), name='wishlist-toggle'),
    path('wishlist/items/<int:pk>/remove/', RemoveWishlistItemView.as_view(), name='wishlist-remove'),
    path('wishlist/items/<int:pk>/move-to-cart/', MoveToCartView.as_view(), name='wishlist-move-to-cart'),
]
