from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.db.models import Count, Sum, Q
from .models import User
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    ProfileUpdateSerializer
)

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "message": "Account created successfully!",
                "token": token.key,
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "message": "Logged in successfully!",
                "token": token.key,
                "user": UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # Delete token if exists
            Token.objects.filter(user=request.user).delete()
        except Exception:
            pass
        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = ProfileUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Profile updated successfully!",
                "user": UserSerializer(request.user).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        return self.put(request)

class AdminCustomerListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not is_super_admin(request.user) and not ((request.user.role == 'admin' or request.user.is_staff) and request.user.admin_status == 'approved'):
            return Response({"error": "Admin access required."}, status=status.HTTP_403_FORBIDDEN)

        customers = User.objects.filter(role='customer').annotate(
            orders_count=Count('orders'),
            total_spent=Sum('orders__total_amount')
        ).order_by('-date_joined')

        data = []
        for c in customers:
            data.append({
                "id": c.id,
                "email": c.email,
                "full_name": c.full_name or c.username,
                "phone": c.phone or "N/A",
                "address": c.address or "N/A",
                "city": c.city or "",
                "state": c.state or "",
                "postal_code": c.postal_code or "",
                "role": c.role,
                "admin_status": c.admin_status,
                "date_joined": c.date_joined,
                "orders_count": c.orders_count or 0,
                "total_spent": float(c.total_spent or 0.0),
            })

        return Response(data)

def is_super_admin(user):
    return user.is_authenticated and (user.email.lower() == 'admin@cocoabliss.com' or user.is_superuser)

class AdminRequestsListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not is_super_admin(request.user):
            return Response(
                {"error": "Only the Super Admin (admin@cocoabliss.com) has permission to manage administrator requests."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Retrieve all accounts that requested admin or are staff/admin
        requests_qs = User.objects.filter(
            Q(admin_status__in=['pending', 'approved', 'rejected']) | Q(role='admin')
        ).exclude(email__iexact='admin@cocoabliss.com').order_by('-date_joined')

        data = []
        for u in requests_qs:
            data.append({
                "id": u.id,
                "email": u.email,
                "full_name": u.full_name or u.username,
                "phone": u.phone or "N/A",
                "role": u.role,
                "admin_status": u.admin_status,
                "is_staff": u.is_staff,
                "date_joined": u.date_joined
            })

        pending_count = User.objects.filter(admin_status='pending').count()
        return Response({
            "requests": data,
            "pending_count": pending_count
        })

class AdminRequestActionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, user_id):
        from notifications.models import Notification

        if not is_super_admin(request.user):
            return Response(
                {"error": "Only the Super Admin (admin@cocoabliss.com) has privilege to accept or reject administrator accounts."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if target_user.email.lower() == 'admin@cocoabliss.com':
            return Response({"error": "Cannot alter primary Super Admin account."}, status=status.HTTP_400_BAD_REQUEST)

        action = request.data.get('action')
        if action == 'approve':
            target_user.role = 'admin'
            target_user.admin_status = 'approved'
            target_user.is_staff = True
            target_user.save()

            Notification.objects.create(
                user=target_user,
                title="Admin Privileges Approved! 🎉",
                message="Congratulations! Your request for Administrator privileges has been accepted by the Super Admin. You now have full access to the Cocoa Bliss Admin Dashboard.",
                link="/admin"
            )
            return Response({
                "message": f"Successfully approved {target_user.full_name or target_user.email} as an Administrator!",
                "user": UserSerializer(target_user).data
            })
        elif action == 'reject':
            target_user.role = 'customer'
            target_user.admin_status = 'rejected'
            target_user.is_staff = False
            target_user.save()

            Notification.objects.create(
                user=target_user,
                title="Admin Request Update ℹ️",
                message="Your request for administrator privileges was not approved by the Super Admin. You may continue to explore and shop as a customer.",
                link="/"
            )
            return Response({
                "message": f"Admin request for {target_user.full_name or target_user.email} was rejected.",
                "user": UserSerializer(target_user).data
            })
        else:
            return Response({"error": "Invalid action. Allowed: 'approve', 'reject'"}, status=status.HTTP_400_BAD_REQUEST)
