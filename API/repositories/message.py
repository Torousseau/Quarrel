from ..models import Message
from django.utils import timezone

class MessageRepository:

    @staticmethod
    def get_messages_by_channel(channel_id):
        """
        Retrieves all messages for a given channel.
        """
        return Message.objects.filter(channel_id=channel_id)

    @staticmethod
    def get_message_by_id(message_id):
        """
        Retrieves a message by its ID.
        """
        return Message.objects.get(id=message_id)

    @staticmethod
    def create_message(channel, user, content):
        """
        Creates a new message in the specified channel.
        """
        message = Message(channel=channel, user=user, content=content, created_at=timezone.now())
        message.save()
        return message

    @staticmethod
    def delete_message(message_id):
        """
        Deletes a message by its ID.
        """
        Message.objects.filter(id=message_id).delete()