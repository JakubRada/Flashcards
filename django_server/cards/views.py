from django.shortcuts import render
from django.http import HttpResponse
from .models import Tag, Card

def index(request):
    tags_list = Tag.objects.all()
    context = {
        'tags_list': tags_list,
    }
    return render(request, 'cards/index.html', context)

def tags(request, tag_id):
    tag = Tag.objects.get(pk=tag_id)
    cards_list = tag.cards.all()
    context = {
        'cards_list': cards_list,
    }
    return render(request, 'cards/tags.html', context)
