from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('tags/', views.tags, name='tags'),
    path('tags/<int:tag_id>/', views.tag, name='tag'),
    path('cards/', views.cards, name='cards'),
    path('cards/<int:card_id>/', views.card, name='card'),
    path('add_tag/', views.add_tag, name='add_tag'),
    path('add_card/', views.add_card, name='add_card'),
    path('import/', views.import_all, name='import'),
]