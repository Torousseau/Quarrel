from django.db import models
from django.contrib.auth.models import User


# ==========================
# USER PROFILE
# ==========================
class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )

    bio = models.TextField(blank=True, null=True)
    tag = models.CharField(
        max_length=50,
        unique=True,
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.user.username} profile"


# ==========================
# SERVER
# ==========================
class Server(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='owned_servers'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ==========================
# SERVER MEMBERS
# ==========================
class ServerUser(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='server_memberships'
    )
    server = models.ForeignKey(
        Server,
        on_delete=models.CASCADE,
        related_name='members'
    )

    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'server')

    def __str__(self):
        return f"{self.user.username} in {self.server.name}"

    @classmethod
    def get_servers_by_user(cls, user_id):
        return cls.objects.filter(user_id=user_id).select_related('server')


# ==========================
# CHANNEL
# ==========================
class Channel(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    server = models.ForeignKey(
        Server,
        on_delete=models.CASCADE,
        related_name='channels',
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.server.name} | #{self.name}"


# ==========================
# MESSAGE
# ==========================
class Message(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_modified = models.BooleanField(default=False)

    channel = models.ForeignKey(
        Channel,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='messages'
    )

    def __str__(self):
        return f"{self.user.username}: {self.content[:30]}"
