from ..models import Channel

class ChannelRepository:
    @staticmethod
    def get_channel_by_id(channel_id):
        """
        Retrieves a Channel instance by its ID.
        """
        try:
            return Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return None

    @staticmethod
    def create_channel(name, description, owner):
        """
        Creates a new channel with the given name, description, and owner.
        """
        channel = Channel(name=name, description=description, owner=owner)
        channel.save()
        return channel