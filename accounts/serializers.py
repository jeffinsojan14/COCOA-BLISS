from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'full_name', 'phone',
            'address', 'city', 'state', 'postal_code', 'country',
            'role', 'admin_status', 'is_staff', 'is_superuser', 'date_joined'
        ]
        read_only_fields = ['id', 'username', 'role', 'admin_status', 'is_staff', 'is_superuser', 'date_joined']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default='customer')

    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone', 'address', 'password', 'confirm_password', 'role']

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        email = attrs.get('email', '').strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": "A user with this email address already exists."})
        return attrs

    def create(self, validated_data):
        from notifications.models import Notification

        validated_data.pop('confirm_password')
        email = validated_data['email'].strip().lower()
        password = validated_data.pop('password')
        requested_role = validated_data.get('role', 'customer')

        if requested_role == 'admin':
            if email == 'admin@cocoabliss.com':
                role = 'admin'
                admin_status = 'approved'
                is_staff = True
            else:
                # Anyone else requesting admin starts with role='customer' and admin_status='pending'
                role = 'customer'
                admin_status = 'pending'
                is_staff = False
        else:
            role = 'customer'
            admin_status = 'none'
            is_staff = False
        
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            full_name=validated_data.get('full_name', ''),
            phone=validated_data.get('phone', ''),
            address=validated_data.get('address', ''),
            role=role,
            admin_status=admin_status,
            is_staff=is_staff
        )

        # If admin access was requested by a non-superadmin, notify the Super Admin
        if admin_status == 'pending':
            super_admin = User.objects.filter(email='admin@cocoabliss.com').first()
            if super_admin:
                Notification.objects.create(
                    user=super_admin,
                    title="New Admin Access Request 🛡️",
                    message=f"{user.full_name or user.username} ({user.email}) registered and requested Administrator privileges.",
                    link="/admin/customers"
                )
            Notification.objects.create(
                user=user,
                title="Admin Privileges Requested ⏳",
                message="Your request for Administrator privileges has been submitted to the Super Admin (admin@cocoabliss.com). You can browse as a customer while pending.",
                link="/"
            )

        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email', '').strip().lower()
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError("Must include both email and password.")

        try:
            user_obj = User.objects.get(email__iexact=email)
            user = authenticate(username=user_obj.email, password=password)
            if not user and user_obj.username != user_obj.email:
                user = authenticate(username=user_obj.username, password=password)
        except User.DoesNotExist:
            user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password. Please try again.")

        if not user.is_active:
            raise serializers.ValidationError("This account has been disabled.")

        attrs['user'] = user
        return attrs

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'phone', 'address', 'city', 'state', 'postal_code', 'country']
