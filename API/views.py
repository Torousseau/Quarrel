from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from API.models import UserProfile, ServerUser, Server, Channel
from API.repositories.channel import ChannelRepository
from API.repositories.message import MessageRepository
from API.repositories.user import UserRepository


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = authenticate(
            username=request.data.get('username'),
            password=request.data.get('password')
        )

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
                "avatar": profile.avatar.url if profile and profile.avatar else None,
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
        try:
            token = RefreshToken(request.data.get('refresh'))
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

        user = UserRepository.create_user(
            username=username,
            email=email,
            password=password
        )

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "bio": "",
                "tag": ""
            },
            "servers": []
        }, status=200)


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
            "tag": profile.tag if profile else "",
            "avatar": profile.avatar.url if profile and profile.avatar else None
        })


class UpdateUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)

        profile.bio = request.data.get('bio', profile.bio)
        profile.tag = request.data.get('tag', profile.tag)

        if 'avatar' in request.FILES:
            profile.avatar = request.FILES['avatar']

        profile.save()

        return Response({"message": "Profile updated successfully"})


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

        return Response({
            "id": server.id,
            "name": server.name,
            "invite_code": server.invite_code
        }, status=201)


class GetServersOfUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        server_users = ServerUser.objects.filter(user__id=user_id)

        return Response([
            {
                "id": su.server.id,
                "name": su.server.name,
                "description": su.server.description
            }
            for su in server_users
        ])


class JoinServerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        invite_code = request.data.get('invite_code')

        if not invite_code:
            return Response({"error": "Invite code is required"}, status=400)

        try:
            server = Server.objects.get(invite_code=invite_code)
        except Server.DoesNotExist:
            return Response({"error": "Invalid invite code"}, status=404)

        ServerUser.objects.get_or_create(
            user=request.user,
            server=server
        )

        return Response({
            "message": "Joined server successfully",
            "server": {
                "id": server.id,
                "name": server.name
            }
        })


class GetServersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        server_users = ServerUser.objects.filter(user=request.user)

        return Response([
            {
                "id": su.server.id,
                "name": su.server.name,
                "description": su.server.description,
                "invite_code": su.server.invite_code if su.server.owner == request.user else None
            }
            for su in server_users
        ])


class DeleteServerView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, server_id):
        try:
            server = Server.objects.get(id=server_id)
        except Server.DoesNotExist:
            return Response({"error": "Server not found"}, status=404)

        if server.owner != request.user:
            return Response({"error": "Permission denied"}, status=403)

        server.delete()
        return Response({"message": "Server deleted"})


class CreateChannelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        name = request.data.get('name')
        server_id = request.data.get('server_id')
        description = request.data.get('description', '')

        if not name or not server_id:
            return Response({"error": "Missing fields"}, status=400)

        try:
            server = Server.objects.get(id=server_id)
        except Server.DoesNotExist:
            return Response({"error": "Server not found"}, status=404)

        if server.owner != request.user:
            return Response({"error": "Permission denied"}, status=403)

        channel = Channel.objects.create(
            name=name,
            description=description,
            server=server
        )

        return Response({"id": channel.id}, status=201)


class GetChannelsOfServerView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, server_id):
        channels = ChannelRepository.get_channels_by_server(server_id)
        return Response([
            {"id": c.id, "name": c.name, "description": c.description}
            for c in channels
        ])


class DeleteChannelView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, channel_id):
        channel = ChannelRepository.get_channel_by_id(channel_id)
        if not channel:
            return Response({"error": "Channel not found"}, status=404)

        if channel.server.owner != request.user:
            return Response({"error": "Permission denied"}, status=403)

        channel.delete()
        return Response({"message": "Channel deleted"})


class GetMessagesByChannelView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, channel_id):
        messages = MessageRepository.get_messages_by_channel(channel_id)
        return Response([
            {
                "id": m.id,
                "content": m.content,
                "created_at": m.created_at,
                "from": m.user.id
            }
            for m in messages
        ])


class CreateMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        content = request.data.get('content')
        channel_id = request.data.get('channel_id')

        if not content:
            return Response({"error": "Content required"}, status=400)

        channel = ChannelRepository.get_channel_by_id(channel_id)
        if not channel:
            return Response({"error": "Channel not found"}, status=404)

        message = MessageRepository.create_message(
            channel=channel,
            user=request.user,
            content=content
        )

        return Response({"id": message.id}, status=201)


class DeleteMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, message_id):
        message = MessageRepository.get_message_by_id(message_id)
        if not message:
            return Response({"error": "Message not found"}, status=404)

        if message.user != request.user:
            return Response({"error": "Permission denied"}, status=403)

        MessageRepository.delete_message(message_id)
        return Response({"message": "Message deleted"})