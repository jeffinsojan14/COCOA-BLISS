from rest_framework import serializers
from .models import Wishlist, WishlistItem
from products.serializers import ProductListSerializer

class WishlistItemSerializer(serializers.ModelSerializer):
    product_details = ProductListSerializer(source='product', read_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'product_details', 'created_at']

class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'items', 'total_items']
