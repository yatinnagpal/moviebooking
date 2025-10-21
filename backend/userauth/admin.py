from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, PasswordResetToken

class UserAdmin(BaseUserAdmin):
    # Fields to display in the admin list view
    list_display = ('username', 'email', 'phone_number', 'is_staff', 'is_active', 'created_at', 'updated_at')
    # Fields to filter by in the admin interface
    list_filter = ('is_staff', 'is_active', 'created_at')
    # Fields to search in the admin interface
    search_fields = ('username', 'email', 'phone_number')
    # Fields to display in the admin detail view
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
    # Fields to display in the admin list view
    list_display = ('user', 'token', 'created_at', 'expires_at', 'is_valid')
    # Fields to filter by
    list_filter = ('created_at', 'expires_at')
    # Fields to search
    search_fields = ('user__username', 'user__email', 'token')
    # Fields to display in the detail view
    fields = ('user', 'token', 'created_at', 'expires_at')
    # Make fields read-only
    readonly_fields = ('created_at', 'expires_at', 'token')
    # Order by creation date (newest first)
    ordering = ('-created_at',)

    def is_valid(self, obj):
        return obj.is_valid()
    is_valid.boolean = True
    is_valid.short_description = 'Valid'

# Register models with admin
admin.site.register(User, UserAdmin)
admin.site.register(PasswordResetToken, PasswordResetTokenAdmin)