from django.shortcuts import render
from django.http import JsonResponse

def vue_index(request):
    return render(request, 'index.html')  # ✅ 確保載入 Vue 的 index.html

def search_tmdb(request):
    return JsonResponse({"message": "API 正常運作", "results": []})