from django.urls import path
from accounts import views

urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", views.login_user, name="login"),
    path("user/", views.get_user, name="get_user"),
    path("logout/", views.logout, name="logout"),
    path("resend-otp/", views.resend_otp, name="resend_otp"),
    path("verify-otp/", views.verify_otp, name="verify_otp"),
    path("change-password/", views.change_password, name="change_password"),
]
