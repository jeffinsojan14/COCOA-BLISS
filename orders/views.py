from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from django.db.models import Sum, Count, Q
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer
from cart.models import Cart
from products.models import Product
from notifications.models import Notification
from accounts.models import User

def check_admin(user):
    if not user or not user.is_authenticated:
        return False
    if user.email and user.email.lower() == 'admin@cocoabliss.com':
        return True
    if user.is_superuser:
        return True
    return (user.role == 'admin' or user.is_staff) and user.admin_status == 'approved'

class OrderListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Get customer's cart
        cart = Cart.objects.filter(user=request.user).first()
        if not cart or not cart.items.exists():
            return Response({"error": "Your cart is empty. Please add chocolates to checkout."}, status=status.HTTP_400_BAD_REQUEST)

        cart_items = cart.items.select_related('product').all()

        with transaction.atomic():
            # Validate stock availability for each item
            for item in cart_items:
                product = item.product
                if not product.is_available or product.stock_quantity < item.quantity:
                    return Response({
                        "error": f"Sorry! '{product.name}' only has {product.stock_quantity} in stock. Please adjust your cart quantity."
                    }, status=status.HTTP_400_BAD_REQUEST)

            subtotal = cart.subtotal
            delivery_charge = cart.delivery_charge
            total_amount = cart.final_total

            payment_method = serializer.validated_data['payment_method']
            # If online/upi or card, mock payment as completed, cod is pending
            payment_status = 'completed' if payment_method in ['upi', 'card'] else 'pending'

            # Create Order
            order = Order.objects.create(
                user=request.user,
                customer_name=serializer.validated_data['customer_name'],
                customer_email=serializer.validated_data['customer_email'],
                customer_phone=serializer.validated_data['customer_phone'],
                shipping_address=serializer.validated_data['shipping_address'],
                city=serializer.validated_data['city'],
                state=serializer.validated_data['state'],
                postal_code=serializer.validated_data['postal_code'],
                subtotal=subtotal,
                delivery_charge=delivery_charge,
                total_amount=total_amount,
                payment_method=payment_method,
                payment_status=payment_status,
                order_status='pending',
                notes=serializer.validated_data.get('notes', '')
            )

            # Create Order Items and adjust stock
            for item in cart_items:
                product = item.product
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    product_name_snapshot=product.name,
                    product_image_snapshot=product.get_image(),
                    product_weight_snapshot=product.weight,
                    unit_price=product.price,
                    quantity=item.quantity,
                    subtotal=item.subtotal
                )
                # Decrement stock
                product.stock_quantity = max(0, product.stock_quantity - item.quantity)
                if product.stock_quantity == 0:
                    product.is_available = False
                product.save()

            # Clear user cart
            cart.items.all().delete()

            # Create notification for user
            Notification.objects.create(
                user=request.user,
                title="Order Placed Successfully! 🍫",
                message=f"Thank you for your order #{order.order_number}. We are preparing your homemade chocolates with love!",
                link=f"/orders/{order.order_number}"
            )

            # Update customer default address on user model if empty
            user = request.user
            user_updated = False
            if not user.phone and order.customer_phone:
                user.phone = order.customer_phone
                user_updated = True
            if not user.address and order.shipping_address:
                user.address = order.shipping_address
                user.city = order.city
                user.state = order.state
                user.postal_code = order.postal_code
                user_updated = True
            if user_updated:
                user.save()

        return Response({
            "message": "Order placed successfully!",
            "order": OrderSerializer(order).data
        }, status=status.HTTP_201_CREATED)

class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            if str(pk).isdigit():
                order = Order.objects.get(id=pk)
            else:
                order = Order.objects.get(order_number=pk)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        # Allow customer to view their own order or admin to view any order
        if order.user != request.user and not check_admin(request.user):
            return Response({"error": "Access denied."}, status=status.HTTP_403_FORBIDDEN)

        serializer = OrderSerializer(order)
        return Response(serializer.data)

class OrderCancelView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            if str(pk).isdigit():
                order = Order.objects.get(id=pk)
            else:
                order = Order.objects.get(order_number=pk)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        if order.user != request.user and not check_admin(request.user):
            return Response({"error": "Access denied."}, status=status.HTTP_403_FORBIDDEN)

        if order.order_status in ['shipped', 'delivered', 'cancelled']:
            return Response({
                "error": f"Order #{order.order_number} cannot be cancelled because it is already {order.order_status}."
            }, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            order.order_status = 'cancelled'
            order.save()

            # Restore inventory stock
            for item in order.items.all():
                if item.product:
                    item.product.stock_quantity += item.quantity
                    item.product.is_available = True
                    item.product.save()

            Notification.objects.create(
                user=order.user,
                title=f"Order #{order.order_number} Cancelled",
                message="Your order has been cancelled.",
                link=f"/orders/{order.order_number}"
            )

        return Response({
            "message": "Order cancelled successfully.",
            "order": OrderSerializer(order).data
        })

# ----------------- ADMIN ORDER & DASHBOARD VIEWS -----------------

class AdminOrderListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not check_admin(request.user):
            return Response({"error": "Admin privileges required."}, status=status.HTTP_403_FORBIDDEN)

        queryset = Order.objects.all().order_by('-created_at')

        # Status filter
        status_filter = request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(order_status=status_filter)

        # Search filter
        search_query = request.query_params.get('search', '').strip()
        if search_query:
            queryset = queryset.filter(
                Q(order_number__icontains=search_query) |
                Q(customer_name__icontains=search_query) |
                Q(customer_email__icontains=search_query) |
                Q(customer_phone__icontains=search_query)
            )

        serializer = OrderSerializer(queryset, many=True)
        return Response(serializer.data)

class AdminOrderStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        if not check_admin(request.user):
            return Response({"error": "Admin privileges required."}, status=status.HTTP_403_FORBIDDEN)

        try:
            if str(pk).isdigit():
                order = Order.objects.get(id=pk)
            else:
                order = Order.objects.get(order_number=pk)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('order_status')
        if not new_status or new_status not in dict(Order.STATUS_CHOICES):
            return Response({"error": f"Invalid status '{new_status}'."}, status=status.HTTP_400_BAD_REQUEST)

        order.order_status = new_status
        if new_status == 'delivered':
            order.payment_status = 'completed'
        order.save()

        # Notify customer
        status_titles = {
            'confirmed': 'Order Confirmed! 🎉',
            'preparing': 'We are Handcrafting Your Chocolates! 🍫',
            'shipped': 'Your Chocolates Are On The Way! 🚚',
            'delivered': 'Delivered! Enjoy Your Cocoa Bliss! 🤎',
            'cancelled': 'Order Cancelled',
        }
        title = status_titles.get(new_status, f"Order Status: {new_status.title()}")
        Notification.objects.create(
            user=order.user,
            title=title,
            message=f"Order #{order.order_number} status has been updated to '{new_status.title()}'.",
            link=f"/orders/{order.order_number}"
        )

        return Response({
            "message": f"Order status updated to {new_status}.",
            "order": OrderSerializer(order).data
        })

class AdminDashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not check_admin(request.user):
            return Response({"error": "Admin privileges required."}, status=status.HTTP_403_FORBIDDEN)

        total_orders = Order.objects.count()
        sales_agg = Order.objects.exclude(order_status='cancelled').aggregate(total=Sum('total_amount'))
        total_sales = float(sales_agg['total'] or 0.0)

        pending_orders = Order.objects.filter(order_status__in=['pending', 'confirmed', 'preparing']).count()
        completed_orders = Order.objects.filter(order_status='delivered').count()

        total_products = Product.objects.count()
        low_stock_products = Product.objects.filter(stock_quantity__lte=10).count()
        total_customers = User.objects.filter(role='customer').count()

        recent_orders = Order.objects.all().order_by('-created_at')[:6]
        recent_serializer = OrderSerializer(recent_orders, many=True)

        return Response({
            "total_sales": total_sales,
            "total_orders": total_orders,
            "pending_orders": pending_orders,
            "completed_orders": completed_orders,
            "total_products": total_products,
            "low_stock_products": low_stock_products,
            "total_customers": total_customers,
            "recent_orders": recent_serializer.data
        })
