from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.auth_token:
            request.user.auth_token.delete()
        return Response({"detail": "Successfully logged out."})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token-auth/', obtain_auth_token, name='api_token_auth'),
    path('api/logout/', LogoutView.as_view(), name='api_logout'),
    path('api/', include('core.urls')),
]
