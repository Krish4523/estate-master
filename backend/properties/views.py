from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import JsonResponse
from accounts.models import User, Agent, Customer
from accounts.serializers import AgentSerializer
from .serializers import PropertySerializer
from .models import Property, PropertyImage, NearbyPlace
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from django.shortcuts import get_object_or_404
from collections import defaultdict
from rest_framework import status


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def property_list_view(request):
    if request.user.role == "agent":
        properties = Property.objects.filter(agent=request.user)
    else:
        properties = Property.objects.filter(is_verified=True, is_sold=False)
    serializer = PropertySerializer(properties, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def save_property_view(request):
    if Property.objects.filter(title=request.data.get("title")).exists():
        return JsonResponse({"message": "Property already exists"}, status=400)

    property_data = request.data.copy()
    property_data.pop("images[]", None)

    nearby_places_data = defaultdict(dict)
    for key, value in property_data.items():
        if key.startswith("nearby_places"):
            # Extract the index and the actual field name
            index = key.split("[")[1].split("]")[0]
            field = key.split("[")[2].split("]")[0]
            nearby_places_data[index][field] = value
    nearby_places_list = [dict(item) for item in nearby_places_data.values()]

    for key in list(property_data.keys()):
        if key.startswith("nearby_places"):
            del property_data[key]

    serializer = PropertySerializer(data=property_data)
    print(property_data)
    print(nearby_places_list)
    if serializer.is_valid():
        property_instance = serializer.save()

        # Handle image uploads
        images = request.FILES.getlist("images[]")
        if images:
            for image in images[:4]:  # Limit to 4 images
                PropertyImage.objects.create(property=property_instance, image=image)

        # Handle nearby places if provided
        if nearby_places_list:
            for nearby_place in nearby_places_list:
                NearbyPlace.objects.create(
                    property=property_instance,
                    name=nearby_place["name"],  # Extract value from list
                    distance=nearby_place["distance"],  # Extract value from list
                    place_type=nearby_place["place_type"],  # Extract value from list
                )

        print(property_data["agent"])
        print(property_data["seller"])
        agent = get_object_or_404(Agent, user__id=property_data["agent"])
        agent.inquiry_listings.add(property_instance)
        agent.save()
        seller = get_object_or_404(Customer, user__id=property_data["agent"])
        seller.own_properties.add(property_instance)
        seller.save()

        return Response(
            {
                "message": "Property details submitted.\nIt will show in listings after verification."
            },
            status=200,
        )

    # If serializer is not valid, return errors
    print(serializer.errors)
    return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def find_property(request, property_id):
    property = Property.objects.filter(pk=property_id).first()
    if property:
        serializer = PropertySerializer(property)
        return Response(serializer.data)
    else:
        return JsonResponse({"message": "Property Not Found"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def get_agents(request):
    agents = Agent.objects.all()
    serializer = AgentSerializer(agents, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def find_agent_by_id(request, agent_id):
    try:
        user = User.objects.get(id=agent_id)
        agent = Agent.objects.get(user=user)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    except Agent.DoesNotExist:
        return Response(
            {"error": "Agent profile not found."}, status=status.HTTP_404_NOT_FOUND
        )

    serializer = AgentSerializer(agent)
    return Response(serializer.data, status=status.HTTP_200_OK)
