from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from properties.views import get_agents

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include("accounts.urls")),
    path('api/agents/', get_agents, name='get_agents'),
    path('api/property/', include("properties.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
