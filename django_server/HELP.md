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