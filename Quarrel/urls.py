"""
URL configuration for Quarrel project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from API.views import LoginView, LogoutView, RegisterView, GetUserProfileView, GetUserInChannelView, \
    GetChannelFromUserView, GetMessagesByChannelView, CreateMessage

urlpatterns = [
    path('admin/', admin.site.urls),

    path("api/login", LoginView.as_view(), name="login"),
    path("api/logout", LogoutView.as_view(), name="logout"),
    path("api/register", RegisterView.as_view(), name="register"),

    path("api/user/profile/<int:user_id>", GetUserProfileView.as_view(), name="get_user_profile"),
    path("api/channel/<int:channel_id>/users", GetUserInChannelView.as_view(), name="get_users_in_channel"),
    path("api/user/<int:user_id>/channels", GetChannelFromUserView.as_view(), name="get_channels_from_user"),
    path("api/channel/<int:channel_id>/messages", GetMessagesByChannelView.as_view(), name="get_messages_by_channel"),
    path("api/message/create", CreateMessage.as_view(), name="create_message"),

]
