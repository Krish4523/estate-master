from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import JsonResponse
from accounts.models import User
from accounts.serializers import AgentSerializer
from .serializers import PropertySerializer
from .models import Property, PropertyImage
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def property_list_view(request):
    properties = Property.objects.all()
    serializer = PropertySerializer(properties, many=True)
    return Response(serializer.data)


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# @authentication_classes([TokenAuthentication])
# def save_property_view(request):
#     print(request.data)
#     if Property.objects.filter(title=request.data.get("title")).exists():
#         print("Property Already Exist")
#         return JsonResponse({"message": "unsuccessful"}, status=400)

#     serializer = PropertySerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         print("Property Saved")
#         return Response({"message": "successful"})

#     return Response(serializer.errors, status=400)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def save_property_view(request):
    # Check if the property already exists
    if Property.objects.filter(title=request.data.get("title")).exists():
        return JsonResponse({"message": "Property already exists"}, status=400)

    # Deserialize and validate property data (excluding images)
    property_data = request.data.copy()
    property_data.pop("images[]", None)  # Exclude images from data passed to serializer

    serializer = PropertySerializer(data=property_data)
    
    if serializer.is_valid():
        property_instance = serializer.save()

        # Handle the image files in the request.FILES
        images = request.FILES.getlist("images[]")
        if images:
            for image in images[:4]:  # Limit to 4 images
                PropertyImage.objects.create(property=property_instance, image=image)

        return Response({"message": "Property saved successfully"}, status=200)
    print(serializer.errors)
    return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def get_agents(request):
    if request.user.is_authenticated:
        print("hii")
        agents = User.objects.filter(role="agent")
        serializer = AgentSerializer(agents, many=True)
        print(serializer.data)
        return Response(serializer.data)
    else:
        print("error")
        return Response({"message": "unsuccessful"}, status=400)
