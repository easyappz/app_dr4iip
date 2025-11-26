from django.urls import path
from api.views import (
    HelloView,
    RegisterView,
    LoginView,
    MeView,
    ProfileUpdateView,
    MessageListCreateView,
)

urlpatterns = [
    path("hello/", HelloView.as_view(), name="hello"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/me/", MeView.as_view(), name="me"),
    path("auth/profile/", ProfileUpdateView.as_view(), name="profile-update"),
    path("messages/", MessageListCreateView.as_view(), name="messages"),
]
