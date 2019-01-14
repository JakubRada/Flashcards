from django.db import models

class Tag(models.Model):
    tag_name = models.CharField(
        'tag name',
        max_length=100,
    )
    previous_success_rate = models.IntegerField(
        'previous success rate',
        default=0,
    )
    card_count = models.IntegerField(
        'number of cards',
        default=0,
    )
    def get_name(self):
        return self.tag_name
    def get_success(self):
        return self.previous_success_rate
    def get_card_count(self):
        return self.card_count

class Card(models.Model):
    card_front = models.CharField(
        'front side',
        max_length=200,
    )
    card_back = models.CharField(
        'back side',
        max_length=200,
    )
    tags = models.ManyToManyField(
        Tag,
        related_name='cards',
        related_query_name='card',
    )
    def get_back(self):
        return self.card_back
    def get_front(self):
        return self.card_front
