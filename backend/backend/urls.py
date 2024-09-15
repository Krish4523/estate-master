from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from properties.views import get_agents, find_agent_by_id
from accounts.views import get_user_profile, update_user_profile

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/agents/", get_agents, name="get-agents"),
    path("api/agents/<int:agent_id>", find_agent_by_id, name="find-agent-by-id"),
    path("api/profile/<int:user_id>", get_user_profile, name="get-user-profile"),
    path(
        "api/profile/edit/<int:user_id>",
        update_user_profile,
        name="update-user-profile",
    ),
    path("api/property/", include("properties.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
