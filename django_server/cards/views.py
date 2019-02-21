from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from .models import Tag, Card
import json

def index(request):
    return HttpResponse("Index of cards app")

def card(request, card_id):
    card = Card.objects.get(pk=card_id)
    return JsonResponse(
        {
            'id': str(card.id),
            'card_front': card.get_front(),
            'card_back': card.get_back(),
            'tag_count': card.get_tag_count(),
            'tags': [str(x.id) for x in card.tags.all()]
        },
        safe=False
    )

def tag(request, tag_id):
    tag = Tag.objects.get(pk=tag_id)
    return JsonResponse(
        {
            'id': str(tag.id),
            'tag_name': tag.get_name(),
            'success_rate': tag.get_success(),
            'card_count': tag.get_card_count(),
            'cards': [str(x.id) for x in tag.cards.all()]
        },
        safe=False
    )

def cards(request):
    cards_list = Card.objects.all()
    content = []
    for card in cards_list:
        content.append(
            {
                'id': str(card.id),
                'card_front': card.get_front(),
                'card_back': card.get_back()
            }
        )
    return JsonResponse(content, safe=False)

def tags(request):
    tags_list = Tag.objects.all()
    content = []
    for tag in tags_list:
        content.append(
            {
                'id': str(tag.id),
                'tag_name': tag.get_name()
            }
        )
    return JsonResponse(content, safe=False)

def add_tag(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if data["type"] == "new":
            tag = Tag(tag_name=data["tag_name"])
            tag.save()
        elif data["type"] == "update":
            tag = Tag.objects.get(pk=data["id"])
            tag.set_name(data["tag_name"])
            tag.save()
        elif data["type"] == "test":
            tag = Tag.objects.get(pk=data["id"])
            tag.set_success(data["success_rate"])
            tag.save()
        return HttpResponse("loaded")
    else:
        return HttpResponse("nothing")

def add_card(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if data['type'] == 'new':
            card = Card(card_front=data['card_front'], card_back=data['card_back'], tag_count=data['tag_count'])
            card.save()
            for tag in data['tags']:
                t = Tag.objects.get(pk=tag)
                card.tags.add(t)
                t.add_card()
                t.save()
            card.save()
        return HttpResponse("loaded")
    else:
        return HttpResponse("nothing")