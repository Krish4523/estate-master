from django.urls import path
from appointments import views

urlpatterns = [
    path("create/", views.create_appointment, name="book-appointment"),
    path("list/", views.get_appointments, name="get-appointments"),
    path(
        "update/<int:appointment_id>",
        views.update_appointment,
        name="update-appointment",
    ),
    path(
        "delete/<int:appointment_id>",
        views.delete_appointment,
        name="delete-appointment",
    ),
]
