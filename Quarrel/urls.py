from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from API.views import (
    LoginView,
    RegisterView,
    GetUserProfileView,
    GetUsersInChannelView,
    GetChannelsOfUserView,
    GetServersOfUserView,
    GetMessagesByChannelView,
    CreateMessageView,
    CreateServerView,
    CreateChannelView,
    GetChannelsOfServerView,
    AddUserToServerView,
    DeleteMessageView,
    DeleteChannelView,
    DeleteServerView,
    LogoutView,
    GetUsersView,
    UpdateUserProfileView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path("api/login/", LoginView.as_view(), name="login"),
    path("api/register/", RegisterView.as_view(), name="register"),
    path("api/logout/", LogoutView.as_view(), name="logout"),


    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path("api/users/", GetUsersView.as_view(), name="get_users"),
    path("api/user/profile/<int:user_id>/", GetUserProfileView.as_view(), name="get_user_profile"),
    path("api/user/<int:user_id>/servers/", GetServersOfUserView.as_view(), name="get_servers_of_user"),
    path("api/user/<int:user_id>/channels/", GetChannelsOfUserView.as_view(), name="get_channels_of_user"),
    path("api/user/profile/update/", UpdateUserProfileView.as_view(), name="update_user_profile"),

    path("api/server/create/", CreateServerView.as_view(), name="create_server"),
    path("api/server/<int:server_id>/channels/", GetChannelsOfServerView.as_view(), name="get_channels_of_server"),
    path("api/server/add_user/", AddUserToServerView.as_view(), name="add_user_to_server"),
    path("api/server/<int:server_id>/delete/", DeleteServerView.as_view(), name="delete_server"),

    path("api/channel/<int:channel_id>/users/", GetUsersInChannelView.as_view(), name="get_users_in_channel"),
    path("api/channel/<int:channel_id>/messages/", GetMessagesByChannelView.as_view(), name="get_messages_by_channel"),
    path("api/channel/create/", CreateChannelView.as_view(), name="create_channel"),
    path("api/channel/<int:channel_id>/delete/", DeleteChannelView.as_view(), name="delete_channel"),

    path("api/message/create/", CreateMessageView.as_view(), name="create_message"),
    path("api/message/<int:message_id>/delete/", DeleteMessageView.as_view(), name="delete_message"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
