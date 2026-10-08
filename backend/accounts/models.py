from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('admin', 'Administrator'),
    )

    ADMIN_STATUS_CHOICES = (
        ('none', 'None'),
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, default='India')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    admin_status = models.CharField(max_length=20, choices=ADMIN_STATUS_CHOICES, default='none')

    # Allow login using email
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        
        # Primary Super Admin: admin@cocoabliss.com
        if self.email and self.email.lower() == 'admin@cocoabliss.com':
            self.role = 'admin'
            self.admin_status = 'approved'
            self.is_staff = True
            self.is_superuser = True
        elif self.role == 'admin' and self.admin_status == 'approved':
            self.is_staff = True
        else:
            # If admin is pending or rejected or user is customer, revoke staff access
            if self.admin_status != 'approved':
                self.is_staff = False
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name or self.username} ({self.role} - {self.admin_status})"
