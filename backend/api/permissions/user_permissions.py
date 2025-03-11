from rest_framework import permissions

class IsSelfOrReadOnly(permissions.BasePermission):
    """
    允許用戶查看所有用戶，但只能修改自己的資料
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True  # 允許 GET, HEAD, OPTIONS
        return obj == request.user  # 只有自己能編輯自己的資料