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
    if Property.objects.filter(title=request.data.get("title")).exists():
        print("Property Already Exist")
        return JsonResponse({"message": "unsuccessful"}, status=400)

    serializer = PropertySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        print("Property Saved")
        return Response({"message": "successful"})

    return Response(serializer.errors, status=400)
