from django.shortcuts import render

def vue_index(request):
    return render(request, 'index.html')  # ✅ 確保載入 Vue 的 index.html