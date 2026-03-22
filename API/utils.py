import random
import string
from .models import UserProfile

def generate_tag():
    length = random.choice([3, 4])
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choices(characters, k=length))


def generate_unique_tag():
    while True:
        tag = generate_tag()
        if not UserProfile.objects.filter(tag=tag).exists():
            return tag
