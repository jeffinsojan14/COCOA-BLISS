from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Wishlist, WishlistItem
from .serializers import WishlistSerializer
from products.models import Product
from cart.models import Cart, CartItem

def get_or_create_user_wishlist(user):
    wishlist, _ = Wishlist.objects.get_or_create(user=user)
    return wishlist

class WishlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wishlist = get_or_create_user_wishlist(request.user)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data)

class ToggleWishlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({"error": "Product ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        wishlist = get_or_create_user_wishlist(request.user)
        item = WishlistItem.objects.filter(wishlist=wishlist, product=product).first()

        if item:
            item.delete()
            is_in_wishlist = False
            message = f"Removed '{product.name}' from your wishlist."
        else:
            WishlistItem.objects.create(wishlist=wishlist, product=product)
            is_in_wishlist = True
            message = f"Saved '{product.name}' to your wishlist! 🤎"

        serializer = WishlistSerializer(wishlist)
        return Response({
            "message": message,
            "is_in_wishlist": is_in_wishlist,
            "wishlist": serializer.data
        })

class RemoveWishlistItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        wishlist = get_or_create_user_wishlist(request.user)
        try:
            item = WishlistItem.objects.get(id=pk, wishlist=wishlist)
            item.delete()
            return Response({
                "message": "Item removed from wishlist.",
                "wishlist": WishlistSerializer(wishlist).data
            })
        except WishlistItem.DoesNotExist:
            return Response({"error": "Item not found in wishlist."}, status=status.HTTP_404_NOT_FOUND)

class MoveToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        wishlist = get_or_create_user_wishlist(request.user)
        try:
            item = WishlistItem.objects.get(id=pk, wishlist=wishlist)
        except WishlistItem.DoesNotExist:
            return Response({"error": "Item not found in wishlist."}, status=status.HTTP_404_NOT_FOUND)

        product = item.product
        if not product.is_available or product.stock_quantity <= 0:
            return Response({"error": f"'{product.name}' is out of stock."}, status=status.HTTP_400_BAD_REQUEST)

        # Add to cart
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            if cart_item.quantity + 1 > product.stock_quantity:
                return Response({"error": f"Only {product.stock_quantity} available."}, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity += 1
            cart_item.save()

        # Remove from wishlist
        item.delete()

        return Response({
            "message": f"Moved '{product.name}' to your shopping cart!",
            "wishlist": WishlistSerializer(wishlist).data
        })
