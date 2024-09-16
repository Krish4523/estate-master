from django.urls import path
from .views import (
    property_list_view,
    save_property_view,
    find_property,
    verify_property,
    add_favorite,
    remove_favorite,
)

urlpatterns = [
    path("list/", property_list_view, name="property-list"),
    path("save/", save_property_view, name="save-property"),
    path("<int:property_id>/", find_property, name="find-property"),
    path("verify/<int:property_id>/", verify_property, name="verify-property"),
    path("add_favorite/<int:property_id>/", add_favorite, name="add-to-favorites"),
    path(
        "remove_favorite/<int:property_id>/",
        remove_favorite,
        name="remove-from-property",
    ),
]
