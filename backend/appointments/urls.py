from django.urls import path
from appointments import views

urlpatterns = [
    path("create/", views.create_appointment, name="book-appointment"),
]
