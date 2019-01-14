from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:tag_id>/', views.tags, name='tag'),
]