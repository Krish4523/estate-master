from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from .serializers import PropertySerializer
from .models import Property


@api_view(['GET'])
def property_list_view(request):
    properties = Property.objects.all()
    serializer = PropertySerializer(properties, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def save_property_view(request):
    print(request.data)
    # Check if a property with the same title already exists
    if Property.objects.filter(title=request.data.get("title")).exists():
        print("Property Already Exist")
        return JsonResponse({"message": "unsuccessful"}, status=400)

    # Serialize the incoming data
    serializer = PropertySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        print("Property Saved")
        return Response({"message": "successful"})

    # Return errors if the data is invalid
    return Response(serializer.errors, status=400)
