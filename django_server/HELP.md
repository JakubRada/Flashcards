How to use django shell
=======================

- Create tag
    - t = Tag(tag_name='name_of_the_tag')
    - t.save()
- Create card
    - c = Card(card_front='front_page_of_the_card', card_back='back_page_of_the_card')
    - c.save()
- Connect a card with a tag
    - c.tags.add(t)
    - c.save()
- Remove a card from a tag
    - c.tags.remove(t)
    - c.save()
- Get cards from one tag
    - t = Tag.objects.get(tag_name='name_of_the_tag') / Tag.objects.get(pk=primary_key_of_tag)
    - c = Card.objects.filter(tags=t)
    - ------
    - t.cards.all()
- Get a variable from an object
    - t = Tag.objects.get(pk=1)
    - t.get_name() / get_success() / get_card_count()
    - c = Card.objects.get(pk=1)
    - c.get_back() / get_front()
- How to change a variable in an object
    - t = Tag.objects.get(pk=1)
    - t.add_card() / set_success(new_success) / set_name(new_name)
    - c = Card.objects.get(pk=1)
    - c.set_front(new_front) / set_back(new)