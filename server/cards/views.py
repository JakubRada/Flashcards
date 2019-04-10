from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from .models import Tag, Card
import json

# what to show when accessing index of the server
def index(request):
    # shows only simple string - user does not see it, its only to see whether the server is running
    return HttpResponse("Index of cards app")

# receives id of a card and shows all information about the card
def card(request, card_id):
    # finds the card in a database and saves its object
    card = Card.objects.get(pk=card_id)
    # returns its values in form of JSON - easier to handle in user interface app than http response
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

# receives id of a tag and shows all information about the tag
def tag(request, tag_id):
    # finds the tag in the database
    tag = Tag.objects.get(pk=tag_id)
    # returns its values in form of JSON - easier to handle in user interface app than http response
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

# when request is received it show all cards in simplified format
def cards(request):
    # lists all cards of a database
    cards_list = Card.objects.all()
    content = []
    # for each card creates simplified JSON (only id and front + back) and adds it to a list
    for card in cards_list:
        content.append(
            {
                'id': str(card.id),
                'card_front': card.get_front(),
                'card_back': card.get_back()
            }
        )
    # returns list of JSON objects
    return JsonResponse(content, safe=False)

# when request is received it show all tags in simplified format
def tags(request):
    # lists all tags of a database
    tags_list = Tag.objects.all()
    content = []
    # for each card creates simplified JSON (only id and name) and adds it to a list
    for tag in tags_list:
        content.append(
            {
                'id': str(tag.id),
                'tag_name': tag.get_name()
            }
        )
    # returns list of JSON objects
    return JsonResponse(content, safe=False)

# receives POST request with JSON object and processes it
def add_tag(request):
    if request.method == 'POST':
        # loads data from request to JSON object (request contains more information)
        data = json.loads(request.body)
        # by the "type" value decides if new tag should be created, name or success rate updated or whole tag deleted
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
        elif data["type"] == "delete":
            tag = Tag.objects.get(pk=data['id'])
            # before deleting the tag it is better to destroy all connections with cards - it should work without it but this is safer
            try:
                tag_cards = tag.cards.all()
                for card in tag_cards:
                    card.remove_tag()
                    card.tags.remove(tag)
                    card.save()
            except:
                print("no cards here")
            tag.delete()
        return HttpResponse("loaded")
    else:
        # what is shown when request is not POST - debugging
        return HttpResponse("nothing")

# receives POST request with JSON object and processes it
def add_card(request):
    if request.method == 'POST':
        # load data from request to JSON object (request contains more information)
        data = json.loads(request.body)
        # by the "type" value decides if new card should be created, its values updated of whole card deleted
        if data['type'] == 'new':
            # creates card
            card = Card(card_front=data['card_front'], card_back=data['card_back'], tag_count=data['tag_count'])
            card.save()
            # by the last value of JSON connects cards with specified tags
            for tag in data['tags']:
                t = Tag.objects.get(pk=tag)
                card.tags.add(t)
                t.add_card()
                t.save()
            card.save()
        elif data['type'] == 'update':
            card = Card.objects.get(pk=data['id'])
            # updates card values
            card.set_front(data['card_front'])
            card.set_back(data['card_back'])
            card.set_tag_count(len(data['tags']))
            # connects of disconnects cards with specified tags
            pre_tags = card.tags.all()
            for tag in Tag.objects.all():
                # if tag was removed from the card
                if (tag in pre_tags) and (str(tag.id) not in data['tags']):
                    card.tags.remove(tag)
                    tag.remove_card()
                    tag.save()
                # if tag was added to the card
                elif (tag not in pre_tags) and (str(tag.id) in data['tags']):
                    card.tags.add(tag)
                    tag.add_card()
                    tag.save()
            card.save()
        elif data['type'] == 'delete':
            card = Card.objects.get(pk=data['id'])
            # before deleting the card it is better to destroy all connections with tags - safer
            try:
                tags = card.tags.all()
                for tag in tags:
                    card.tags.remove(tag)
                    tag.remove_card()
                    tag.save()
            except:
                print("no tags here")
            card.delete()
        return HttpResponse("loaded")
    else:
        # what is shown when request is not POST - debugging
        return HttpResponse("nothing")

# handles special POST request that controls import of cards from file
def import_all(request):
    if request.method == 'POST':
        # loads data from incoming JSON and divides it to tags and cards
        data = json.loads(request.body)
        tags = data['tags']
        cards = data['cards']
        tag_ids = {}
        # creates tags first and saves their allocated ids
        for i in range(len(tags)):
            tag = tags[i]
            # if tag exists it's not created
            try:
                t = Tag.objects.get(tag_name=tag['tag_name'])
                print("not saving tag")
            except:
                t = Tag(tag_name=tag['tag_name'], previous_success_rate=tag['success_rate'])
                t.save()
            tag_ids[i + 1] = t.id
        for i in range(len(cards)):
            card = cards[i]
            # if card exists it's not created
            try:
                c = Card.objects.get(card_front=card['card_front'], card_back=card['card_back'])
                print("not saving card")
            except:
                c = Card(card_front=card['card_front'], card_back=card['card_back'], tag_count=card['tag_count'])
                c.save()
                # connects card with created tags using their new allocated ids
                for i in range(c.tag_count):
                    t = Tag.objects.get(pk=tag_ids[card['tags'][i]])
                    t.add_card()
                    t.save()
                    c.tags.add(t)
                    c.save()
        return HttpResponse("loaded")
    else:
        # what to show when request is not POST - debugging
        return HttpResponse("nothing")