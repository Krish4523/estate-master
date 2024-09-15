from django.urls import path
from .views import (
    property_list_view,
    save_property_view,
    find_property,
    verify_property,
)

urlpatterns = [
    path("list/", property_list_view, name="property-list"),
    path("save/", save_property_view, name="save-property"),
    path("<int:property_id>/", find_property, name="find-property"),
    path("verify/<int:property_id>/", verify_property, name="verify-property"),
]
