from django.db import models

class Tag(models.Model):
    tag_name = models.CharField(
        'tag name',
        max_length=100,
        unique=True,
    )
    previous_success_rate = models.IntegerField(
        'previous success rate',
        default=0,
    )
    card_count = models.IntegerField(
        'number of cards',
        default=0,
    )
    def add_card(self):
        self.card_count += 1
    def remove_card(self):
        self.card_count -= 1
    def set_success(self, new_success):
        self.previous_success_rate = new_success
    def set_name(self, new_name):
        self.tag_name = new_name
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
    tag_count = models.IntegerField(
        'number of tags',
        default=0,
    )
    def set_front(self, new_front):
        self.card_front = new_front
    def set_back(self, new_back):
        self.card_back = new_back
    def set_tag_count(self, new_tag_count):
        self.tag_count = new_tag_count
    def get_back(self):
        return self.card_back
    def get_front(self):
        return self.card_front
    def get_tag_count(self):
        return self.tag_count
