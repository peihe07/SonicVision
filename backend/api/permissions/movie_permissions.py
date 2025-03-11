from rest_framework import permissions

class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    """
    允許所有人讀取，但只有已登入的用戶可以新增、修改、刪除
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True  # 允許 GET, HEAD, OPTIONS
        return request.user and request.user.is_authenticated  # 只有登入用戶能修改