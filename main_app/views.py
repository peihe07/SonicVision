from django.shortcuts import render
from django.http import JsonResponse

def index(request):
    return render(request, 'index.html')  # 確保這只用於 Vue 頁面

def search_tmdb(request):
    query = request.GET.get('query', '')
    return JsonResponse({"message": f"Searching for {query}"})