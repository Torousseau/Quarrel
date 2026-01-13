from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, Token

from API.models import UserProfile, ServerUser, Server, Channel, Message
from API.repositories.channel import ChannelRepository
from API.repositories.message import MessageRepository
from API.repositories.user import UserRepository

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Invalid credentials"}, status=401)
        if not user.is_active:
            return Response({"error": "User is inactive"}, status=403)

        refresh = RefreshToken.for_user(user)
        profile = getattr(user, 'profile', None)
        servers = ServerUser.get_servers_by_user(user.id)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "bio": profile.bio if profile else "",
                "tag": profile.tag if profile else "",
            },
            "servers": [
                {
                    "id": su.server.id,
                    "name": su.server.name
                } for su in servers
            ]
        }, status=200)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print(request.user)
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({"error": "Refresh token required"}, status=400)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=205)
        except TokenError:
            return Response({"error": "Invalid token"}, status=400)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
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

        refresh = RefreshToken.for_user(user)
        profile = UserProfile.objects.filter(user=user).first()
        servers = ServerUser.get_servers_by_user(user.id)

        if user:
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "bio": profile.bio if profile else "",
                    "tag": profile.tag if profile else "",
                },
                "servers": [
                    {
                        "id": su.server.id,
                        "name": su.server.name
                    } for su in servers
                ]
            }, status=200)
        return Response({"error": "User registration failed"}, status=400)

class GetUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        user = UserRepository.get_user_by_id(user_id)
        if not user:
            return Response({"error": "User not found"}, status=404)

        profile = getattr(user, 'profile', None)
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "bio": profile.bio if profile else "",
            "tag": profile.tag if profile else ""
        }, status=200)

class GetServersOfUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        servers = ServerUser.get_servers_by_user(user_id)
        if not servers:
            return Response({"error": "No servers found for this user"}, status=404)

        data = [{"id": su.server.id, "name": su.server.name} for su in servers]
        return Response(data, status=200)

class GetUsersInChannelView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, channel_id):
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return Response({"error": "Channel not found"}, status=404)

        server_users = ServerUser.objects.filter(server=channel.server)
        user_data = [{"id": su.user.id, "username": su.user.username} for su in server_users]

        return Response(user_data, status=200)

class GetChannelsOfUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        servers = ServerUser.get_servers_by_user(user_id)
        channels = Channel.objects.filter(server__in=[su.server for su in servers])

        if not channels:
            return Response({"error": "No channels found for this user"}, status=404)

        channel_data = [{"id": c.id, "name": c.name, "server": c.server.name} for c in channels]
        return Response(channel_data, status=200)

class GetMessagesByChannelView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, channel_id):
        messages = MessageRepository.get_messages_by_channel(channel_id)
        if not messages:
            return Response({"error": "No messages found in this channel"}, status=404)

        message_data = [
            {
                "id": m.id,
                "content": m.content,
                "created_at": m.created_at,
                "from": m.user.username
            } for m in messages
        ]
        return Response(message_data, status=200)

class CreateMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
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

class CreateServerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        name = request.data.get('name')
        description = request.data.get('description', '')

        if not name:
            return Response({"error": "Server name is required"}, status=400)

        server = Server.objects.create(
            name=name,
            description=description,
            owner=request.user
        )

        ServerUser.objects.create(user=request.user, server=server)

        return Response(
            {"message": "Server created successfully", "id": server.id},
            status=201
        )

class CreateChannelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        name = request.data.get('name')
        server_id = request.data.get('server_id')
        description = request.data.get('description', '')

        if not name or not server_id:
            return Response({"error": "Channel name and server ID are required"}, status=400)

        try:
            server = Server.objects.get(id=server_id)
        except Server.DoesNotExist:
            return Response({"error": "Server not found"}, status=404)

        channel = Channel.objects.create(name=name, description=description, server=server)

        return Response({"message": "Channel created successfully", "id": channel.id}, status=201)
