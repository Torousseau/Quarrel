from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from API.models import ChannelUser
from API.repositories.channel import ChannelRepository
from API.repositories.message import MessageRepository
from API.repositories.user import UserRepository

from API.models import UserProfile


class LoginView(APIView):
    """
    Handles user login.
    """

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=401)

        if not user.is_active:
            return Response({"error": "User is inactive"}, status=403)

        token, _ = Token.objects.get_or_create(user=user)

        profile = UserProfile.objects.filter(user=user).first()
        channels = ChannelUser.get_channels_by_user(user.id)

        return Response({
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "bio": profile.bio if profile else "",
                "tag": profile.tag if profile else "",
            },
            "channels": [
                {
                    "id": channel.id,
                    "name": channel.name
                } for channel in channels
            ]
        }, status=200)


class LogoutView(APIView):
    """
    Handles user logout.
    """

    def post(self, request):
        """
        Handle user logout.
        """
        request.user.auth_token.delete()
        return Response({"message": "Logged out successfully"}, status=200)


class RegisterView(APIView):
    """
    Handles user registration.
    """

    def post(self, request):
        """
        Handle user registration.
        """
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response({"error": "All fields are required"}, status=400)

        if UserRepository.get_user_by_username(username):
            return Response({"error": "Username already exists"}, status=400)
        if UserRepository.get_user_by_email(email):
            return Response({"error": "Email already exists"}, status=400)

        user = UserRepository.create_user(username=username, email=email, password=password)

        if user:
            return Response({"message": "User registered successfully"}, status=201)
        return Response({"error": "User registration failed"}, status=400)


class GetUserInChannelView(APIView):
    """
    Retrieves all users in a specific channel.
    """

    def get(self, request, channel_id):
        """
        Get all users in a channel.
        """
        users = ChannelUser.get_users_by_channel(channel_id)
        if not users:
            return Response({"error": "No users found in this channel"}, status=404)

        user_data = [{"id": user.id, "username": user.username} for user in users]
        return Response(user_data, status=200)


class GetChannelFromUserView(APIView):
    """
    Retrieves all channels a specific user is part of.
    """

    def get(self, request, user_id):
        """
        Get all channels for a user.
        """
        channels = ChannelUser.get_channels_by_user(user_id)
        if not channels:
            return Response({"error": "No channels found for this user"}, status=404)

        channel_data = [{"id": channel.id, "name": channel.name} for channel in channels]
        return Response(channel_data, status=200)


class GetUserProfileView(APIView):
    """
    Retrieves the profile of a user.
    """

    def get(self, request, user_id):
        user = UserRepository.get_user_by_id(user_id)
        if not user:
            return Response({"error": "User not found"}, status=404)

        profile = UserProfile.objects.filter(user=user).first()

        profile_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "bio": profile.bio if profile else "",
            "tag": profile.tag if profile else ""
        }

        return Response(profile_data, status=200)


class GetMessagesByChannelView(APIView):
    """
    Retrieves all messages in a specific channel.
    """

    def get(self, request, channel_id):
        """
        Get all messages in a channel.
        """
        messages = MessageRepository.get_messages_by_channel(channel_id)
        if not messages:
            return Response({"error": "No messages found in this channel"}, status=404)

        message_data = [
            {
                "id": message.id,
                 "content": message.content,
                 "created_at": message.created_at,
                 "from": message.user
             } for message in messages
        ]
        return Response(message_data, status=200)

class CreateMessage(APIView):
    """
    Creates a new message in a specific channel.
    """

    def post(self, request):
        """
        Create a new message in a channel.
        """
        content = request.data.get('content')
        channel_id = request.data.get('channel_id')
        user = request.user

        if not content:
            return Response({"error": "Content cannot be empty"}, status=400)

        channel = ChannelRepository.get_channel_by_id(channel_id)
        if not channel:
            return Response({"error": "Channel not found"}, status=404)

        message = MessageRepository.create_message(channel=channel, user=user, content=content)
        return Response({"message": "Message created successfully", "id": message.id}, status=201)