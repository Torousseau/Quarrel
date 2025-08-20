from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    id = models.AutoField(primary_key=True)

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)

    tag = models.CharField(max_length=50, unique=True, blank=True, null=True)


class Channel(models.Model):
    id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='channels')

    def __str__(self):
        return self.name


class ChannelUser(models.Model):
    id = models.AutoField(primary_key=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='channel_memberships')
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name='members')

    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'channel')

    def __str__(self):
        return f"{self.user.username} in {self.channel.name}"

    @classmethod
    def get_channels_by_user(cls, user_id):
        return cls.objects.filter(user_id=user_id).select_related('channel')


class Message(models.Model):
    id = models.AutoField(primary_key=True)

    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_modified = models.BooleanField(default=False)

    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')

    def __str__(self):
        return self.content

