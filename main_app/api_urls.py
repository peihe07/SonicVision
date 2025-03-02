from django.urls import path
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({"message": "Welcome to Sonic Vision API!"})

urlpatterns = [
    path("", api_root, name="api-root"),  # 讓 `/api/` 有回應
]