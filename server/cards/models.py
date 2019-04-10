from django.db import models

# definition of Tag model (template for all tags in database)
class Tag(models.Model):
    # variable to store name of the tag - list of chars, max length 100 characters
    tag_name = models.CharField(
        'tag name',
        max_length=100,
        unique=True,
    )
    # variable to store success rate of the last test of a tag - integer, default is 0 (after initialization of a card)
    previous_success_rate = models.IntegerField(
        'previous success rate',
        default=0,
    )
    # variable to store number of cards which belong to a tag - integer, default is 0 (after initialization of a card)
    card_count = models.IntegerField(
        'number of cards',
        default=0,
    )
    # methods to modify variables of a tag - it is better than access them directly
    def add_card(self):
        self.card_count += 1
    def remove_card(self):
        self.card_count -= 1
    def set_success(self, new_success):
        self.previous_success_rate = new_success
    def set_name(self, new_name):
        self.tag_name = new_name
    # methods that return values of variables of a tag
    def get_name(self):
        return self.tag_name
    def get_success(self):
        return self.previous_success_rate
    def get_card_count(self):
        return self.card_count

# definition of Card mode (template for all cards in database)
class Card(models.Model):
    # variable to store text displayed on front side of a card - list of chars, max length 200 characters
    card_front = models.CharField(
        'front side',
        max_length=200,
    )
    # variable to store text displayed on back side of a card - list of chars, max length 200 characters
    card_back = models.CharField(
        'back side',
        max_length=200,
    )
    # variable to store all tags which are connected to a card - relationship field, works both ways from card and from tag, but is being defined solo in one of them
    tags = models.ManyToManyField(
        Tag,
        related_name='cards',
        related_query_name='card',
    )
    # variable to store number of tags than are connected to a card - integer, default is 0 (after initialization of a card)
    tag_count = models.IntegerField(
        'number of tags',
        default=0,
    )
    # methods to modify variables of a card - it is better than access them directly
    def set_front(self, new_front):
        self.card_front = new_front
    def set_back(self, new_back):
        self.card_back = new_back
    def set_tag_count(self, new_tag_count):
        self.tag_count = new_tag_count
    def remove_tag(self):
        self.tag_count -= 1
    def add_tag(self):
        self.tag_count += 1
    # methods that return values of variables of a card
    def get_back(self):
        return self.card_back
    def get_front(self):
        return self.card_front
    def get_tag_count(self):
        return self.tag_count
