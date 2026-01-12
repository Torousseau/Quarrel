from django.contrib import admin
from django.urls import path
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
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # ==========================
    # Auth / JWT
    # ==========================
    path("api/login/", LoginView.as_view(), name="login"),  # custom login view returns access + refresh + user info
    path("api/register/", RegisterView.as_view(), name="register"),

    # Optional: use standard JWT endpoints if needed
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # ==========================
    # User
    # ==========================
    path("api/user/profile/<int:user_id>/", GetUserProfileView.as_view(), name="get_user_profile"),
    path("api/user/<int:user_id>/servers/", GetServersOfUserView.as_view(), name="get_servers_of_user"),
    path("api/user/<int:user_id>/channels/", GetChannelsOfUserView.as_view(), name="get_channels_of_user"),

    # ==========================
    # Channel
    # ==========================
    path("api/channel/<int:channel_id>/users/", GetUsersInChannelView.as_view(), name="get_users_in_channel"),
    path("api/channel/<int:channel_id>/messages/", GetMessagesByChannelView.as_view(), name="get_messages_by_channel"),

    # ==========================
    # Message
    # ==========================
    path("api/message/create/", CreateMessageView.as_view(), name="create_message"),
]
