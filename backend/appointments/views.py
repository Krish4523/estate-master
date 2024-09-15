from django.shortcuts import render
from .models import Appointment
from accounts.models import Customer
from .serializers import AppointmentSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework import status
from rest_framework.response import Response


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def create_appointment(request):
    try:
        if request.user.role != "customer":
            return Response(
                {"error": "Only customers can book appointments."},
                status=status.HTTP_403_FORBIDDEN,
            )
        customer = Customer.objects.filter(user=request.user).first()
        if not customer:
            return Response(
                {"error": "Customer profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = AppointmentSerializer(
            data={
                "customer": customer.pk,
                "property": request.data.get("property"),
                "date": request.data.get("date"),
                "description": request.data.get("description"),
            }
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Appointment booked successfully"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except KeyError as e:
        return Response(
            {"error": f"Missing field: {e}"}, status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"error": f"An unexpected error occurred: {e}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
