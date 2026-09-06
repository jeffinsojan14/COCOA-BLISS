from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Cart, CartItem
from .serializers import CartSerializer
from products.models import Product

def get_or_create_user_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart

class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart = get_or_create_user_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        if not product_id:
            return Response({"error": "Product ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        if quantity <= 0:
            return Response({"error": "Quantity must be at least 1."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        if not product.is_available or product.stock_quantity <= 0:
            return Response({"error": f"'{product.name}' is currently out of stock."}, status=status.HTTP_400_BAD_REQUEST)

        cart = get_or_create_user_cart(request.user)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        new_qty = (cart_item.quantity + quantity) if not created else quantity

        if new_qty > product.stock_quantity:
            return Response({
                "error": f"Cannot add {quantity} more. Only {product.stock_quantity} available in stock."
            }, status=status.HTTP_400_BAD_REQUEST)

        cart_item.quantity = new_qty
        cart_item.save()

        serializer = CartSerializer(cart)
        return Response({
            "message": f"Added {product.name} to your cart!",
            "cart": serializer.data
        }, status=status.HTTP_200_OK)

class UpdateCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            cart = get_or_create_user_cart(request.user)
            cart_item = CartItem.objects.get(id=pk, cart=cart)
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        quantity = request.data.get('quantity')
        if quantity is None:
            return Response({"error": "Quantity is required."}, status=status.HTTP_400_BAD_REQUEST)

        quantity = int(quantity)
        if quantity <= 0:
            cart_item.delete()
            return Response({
                "message": "Item removed from cart.",
                "cart": CartSerializer(cart).data
            })

        if quantity > cart_item.product.stock_quantity:
            return Response({
                "error": f"Only {cart_item.product.stock_quantity} items available in stock."
            }, status=status.HTTP_400_BAD_REQUEST)

        cart_item.quantity = quantity
        cart_item.save()

        return Response({
            "message": "Cart updated.",
            "cart": CartSerializer(cart).data
        })

class RemoveCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            cart = get_or_create_user_cart(request.user)
            cart_item = CartItem.objects.get(id=pk, cart=cart)
            cart_item.delete()
            return Response({
                "message": "Item removed from cart.",
                "cart": CartSerializer(cart).data
            })
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

class ClearCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        cart = get_or_create_user_cart(request.user)
        cart.items.all().delete()
        return Response({
            "message": "Cart cleared.",
            "cart": CartSerializer(cart).data
        })
