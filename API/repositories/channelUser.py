from ..models import ChannelUser

class ChannelUserRepository:

    @staticmethod
    def get_channel_user_by_id(channel_user_id):
        """
        Retrieves a ChannelUser instance by its ID.
        """
        try:
            return ChannelUser.objects.get(id=channel_user_id)
        except ChannelUser.DoesNotExist:
            return None

    @staticmethod
    def get_users_by_channel(channel_id):
        """
        Retrieves all User instances for a given channel.
        """
        return ChannelUser.objects.filter(channel_id=channel_id).select_related('user')

    @staticmethod
    def get_channels_by_user(user_id):
        """
        Retrieves all Channel instances for a given user.
        """
        return ChannelUser.objects.filter(user_id=user_id).select_related('channel')