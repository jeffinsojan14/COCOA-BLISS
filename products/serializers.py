from rest_framework import serializers
from .models import Category, Product, Review

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def get_user_name(self, obj):
        return obj.user.full_name or obj.user.username

class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()
    display_image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'image_url', 'display_image', 'is_active', 'products_count', 'created_at']
        read_only_fields = ['id', 'slug', 'created_at']

    def get_products_count(self, obj):
        return obj.products.filter(is_available=True).count()

    def get_display_image(self, obj):
        return obj.get_image()

class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    display_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_name', 'category_slug',
            'name', 'slug', 'short_description', 'price', 'original_price',
            'weight', 'image', 'image_url', 'display_image',
            'stock_quantity', 'is_available', 'is_bestseller', 'is_featured',
            'rating', 'review_count'
        ]

    def get_display_image(self, obj):
        return obj.get_image()

class ProductDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    display_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_name', 'category_slug',
            'name', 'slug', 'short_description', 'description',
            'ingredients', 'price', 'original_price', 'weight',
            'image', 'image_url', 'display_image', 'stock_quantity',
            'is_available', 'is_bestseller', 'is_featured',
            'rating', 'review_count', 'reviews', 'created_at', 'updated_at'
        ]

    def get_display_image(self, obj):
        return obj.get_image()

class ProductAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        extra_kwargs = {
            'image': {'required': False, 'allow_null': True},
            'image_url': {'required': False, 'allow_null': True, 'allow_blank': True}
        }
