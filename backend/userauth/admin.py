from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, PasswordResetToken

class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'phone_number', 'is_staff', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_staff', 'is_active', 'created_at')
    search_fields = ('username', 'email', 'phone_number')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'phone_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )
    # Fields for adding a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'phone_number', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )
    # Make created_at and updated_at read-only
    readonly_fields = ('created_at', 'updated_at')
    # Order users by username
    ordering = ('username',)

    def get_readonly_fields(self, request, obj=None):
        # Prevent editing passwords directly in admin
        readonly = super().get_readonly_fields(request, obj)
        if obj:  # Editing an existing user
            return readonly + ('password',)
        return readonly

class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'created_at', 'expires_at', 'is_valid')
    list_filter = ('created_at', 'expires_at')
    search_fields = ('user__username', 'user__email', 'token')
    fields = ('user', 'token', 'created_at', 'expires_at')
    readonly_fields = ('created_at', 'expires_at', 'token')
    ordering = ('-created_at',)

    def is_valid(self, obj):
        return obj.is_valid()
    is_valid.boolean = True
    is_valid.short_description = 'Valid'

# Register models with admin
admin.site.register(User, UserAdmin)
admin.site.register(PasswordResetToken, PasswordResetTokenAdmin)