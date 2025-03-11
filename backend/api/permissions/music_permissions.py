from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    允許所有人讀取，但只有管理員能新增、修改、刪除
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True  # 允許 GET, HEAD, OPTIONS
        return request.user and request.user.is_staff  # 只有管理員能修改