from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from properties.views import get_agents, find_agent_by_id

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/agents/", get_agents, name="get-agents"),
    path("api/agents/<int:agent_id>", find_agent_by_id, name="find-agent-by-id"),
    path("api/property/", include("properties.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
