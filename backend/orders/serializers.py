from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name_snapshot',
            'product_image_snapshot', 'product_weight_snapshot',
            'unit_price', 'quantity', 'subtotal'
        ]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_order_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer_name', 'customer_email', 'customer_phone',
            'shipping_address', 'city', 'state', 'postal_code', 'country',
            'subtotal', 'delivery_charge', 'total_amount',
            'payment_method', 'payment_method_display',
            'payment_status', 'order_status', 'status_display',
            'notes', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'order_number', 'subtotal', 'delivery_charge', 'total_amount',
            'created_at', 'updated_at'
        ]

class CreateOrderSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=150)
    customer_email = serializers.EmailField()
    customer_phone = serializers.CharField(max_length=20)
    shipping_address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    postal_code = serializers.CharField(max_length=20)
    payment_method = serializers.ChoiceField(choices=Order.PAYMENT_METHOD_CHOICES, default='cod')
    notes = serializers.CharField(required=False, allow_blank=True)
