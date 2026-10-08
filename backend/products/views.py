from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Category, Product, Review
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductAdminSerializer,
    ReviewSerializer
)

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ProductListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = Product.objects.all()

        # Search filter
        search_query = request.query_params.get('search', request.query_params.get('q', '')).strip()
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(short_description__icontains=search_query) |
                Q(ingredients__icontains=search_query) |
                Q(category__name__icontains=search_query)
            )

        # Category filter
        category = request.query_params.get('category', '').strip()
        if category:
            if category.isdigit():
                queryset = queryset.filter(category_id=category)
            else:
                queryset = queryset.filter(category__slug__iexact=category)

        # Price range filter
        min_price = request.query_params.get('min_price')
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                pass

        max_price = request.query_params.get('max_price')
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass

        # Availability / In stock
        in_stock = request.query_params.get('in_stock')
        if in_stock in ['true', '1', 'True']:
            queryset = queryset.filter(stock_quantity__gt=0, is_available=True)

        # Best sellers filter
        bestseller = request.query_params.get('bestseller')
        if bestseller in ['true', '1', 'True']:
            queryset = queryset.filter(is_bestseller=True)

        # Featured filter
        featured = request.query_params.get('featured')
        if featured in ['true', '1', 'True']:
            queryset = queryset.filter(is_featured=True)

        # Sorting
        sort = request.query_params.get('sort', 'featured')
        if sort == 'price_asc':
            queryset = queryset.order_by('price')
        elif sort == 'price_desc':
            queryset = queryset.order_by('-price')
        elif sort == 'rating':
            queryset = queryset.order_by('-rating', '-review_count')
        elif sort == 'newest':
            queryset = queryset.order_by('-created_at')
        else:
            # default featured / best seller first
            queryset = queryset.order_by('-is_bestseller', '-rating', '-created_at')

        serializer = ProductListSerializer(queryset, many=True)
        return Response(serializer.data)

class ProductDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            if str(pk).isdigit():
                product = Product.objects.get(pk=pk)
            else:
                product = Product.objects.get(slug=pk)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductDetailSerializer(product)
        # Also provide related products in the same category
        related = Product.objects.filter(category=product.category).exclude(id=product.id)[:4]
        related_serializer = ProductListSerializer(related, many=True)

        return Response({
            "product": serializer.data,
            "related_products": related_serializer.data
        })

class AddReviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        rating = request.data.get('rating')
        comment = request.data.get('comment', '').strip()

        if not rating or not (1 <= int(rating) <= 5):
            return Response({"error": "Please provide a rating between 1 and 5."}, status=status.HTTP_400_BAD_REQUEST)

        if not comment:
            return Response({"error": "Please write a review comment."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if already reviewed
        existing = Review.objects.filter(product=product, user=request.user).first()
        if existing:
            existing.rating = int(rating)
            existing.comment = comment
            existing.save()
            review = existing
            msg = "Review updated successfully!"
        else:
            review = Review.objects.create(
                product=product,
                user=request.user,
                rating=int(rating),
                comment=comment
            )
            msg = "Review submitted successfully!"

        return Response({
            "message": msg,
            "review": ReviewSerializer(review).data
        }, status=status.HTTP_201_CREATED)

# ----------------- ADMIN VIEWS -----------------

def check_admin(user):
    if not user or not user.is_authenticated:
        return False
    if user.email and user.email.lower() == 'admin@cocoabliss.com':
        return True
    if user.is_superuser:
        return True
    return (user.role == 'admin' or user.is_staff) and user.admin_status == 'approved'

class AdminProductListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not check_admin(request.user):
            return Response({"error": "Admin privileges required."}, status=status.HTTP_403_FORBIDDEN)
        products = Product.objects.all().order_by('-created_at')
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not check_admin(request.user):
            return Response({"error": "Admin privileges required."}, status=status.HTTP_403_FORBIDDEN)
        serializer = ProductAdminSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            return Response(ProductDetailSerializer(product).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminProductDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return None

    def put(self, request, pk):
        if not check_admin(request.user):
            return Response({"error": "Admin privileges required."}, status=status.HTTP_403_FORBIDDEN)
        product = self.get_object(pk)
        if not product:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductAdminSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(ProductDetailSerializer(product).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not check_admin(request.user):
            return Response({"error": "Admin privileges required."}, status=status.HTTP_403_FORBIDDEN)
        product = self.get_object(pk)
        if not product:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response({"message": "Product deleted successfully."})

class AdminCategoryListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not check_admin(request.user):
            return Response({"error": "Admin privileges required."}, status=status.HTTP_403_FORBIDDEN)
        categories = Category.objects.all()
        return Response(CategorySerializer(categories, many=True).data)

    def post(self, request):
        if not check_admin(request.user):
            return Response({"error": "Admin privileges required."}, status=status.HTTP_403_FORBIDDEN)
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            category = serializer.save()
            return Response(CategorySerializer(category).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminCategoryDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        if not check_admin(request.user):
            return Response({"error": "Admin privileges required."}, status=status.HTTP_403_FORBIDDEN)
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({"error": "Category not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(CategorySerializer(category).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not check_admin(request.user):
            return Response({"error": "Admin privileges required."}, status=status.HTTP_403_FORBIDDEN)
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({"error": "Category not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if products exist in category
        if category.products.exists():
            return Response({"error": f"Cannot delete category with {category.products.count()} linked products. Please reassign or delete products first."}, status=status.HTTP_400_BAD_REQUEST)

        category.delete()
        return Response({"message": "Category deleted successfully."})

class AdminReviewListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not check_admin(request.user):
            return Response({"error": "Admin privileges required."}, status=status.HTTP_403_FORBIDDEN)
        reviews = Review.objects.all().select_related('product', 'user').order_by('-created_at')
        data = []
        for r in reviews:
            data.append({
                "id": r.id,
                "product_id": r.product.id,
                "product_name": r.product.name,
                "user_name": r.user.full_name or r.user.username,
                "user_email": r.user.email,
                "rating": r.rating,
                "comment": r.comment,
                "created_at": r.created_at
            })
        return Response(data)

    def delete(self, request, pk):
        if not check_admin(request.user):
            return Response({"error": "Admin privileges required."}, status=status.HTTP_403_FORBIDDEN)
        try:
            review = Review.objects.get(pk=pk)
            review.delete()
            return Response({"message": "Review removed successfully."})
        except Review.DoesNotExist:
            return Response({"error": "Review not found."}, status=status.HTTP_404_NOT_FOUND)
