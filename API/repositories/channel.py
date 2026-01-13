from ..models import Channel

class ChannelRepository:
    @staticmethod
    def get_channel_by_id(channel_id):
        try:
            return Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return None

    @staticmethod
    def create_channel(name, description, owner):
        channel = Channel(name=name, description=description, owner=owner)
        channel.save()
        return channel

    @staticmethod
    def get_channels_by_server(server_id):
        """
        Retrieves all channels for a given server ID.
        """
        return Channel.objects.filter(server_id=server_id)
