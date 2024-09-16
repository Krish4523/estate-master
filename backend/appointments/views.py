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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def get_appointments(request):
    try:
        user = request.user
        if hasattr(user, "agent_profile"):
            agent = user.agent_profile  # Access the agent profile
            appointments = Appointment.objects.filter(
                property__in=agent.active_listings.all()
            ).order_by("-date")
        elif hasattr(user, "customer_profile"):
            customer = user.customer_profile
            appointments = Appointment.objects.filter(customer=customer).order_by(
                "-date"
            )
        else:
            return Response(
                {"error": "User is neither a customer nor an agent."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": f"An error occurred: {e}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def update_appointment(request, appointment_id):
    try:
        # Get the logged-in customer
        customer = Customer.objects.filter(user=request.user).first()

        if not customer:
            return Response(
                {"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND
            )

        appointment = Appointment.objects.get(pk=appointment_id)
        if appointment.customer != customer:
            return Response(
                {"error": "You are not authorized to update this appointment"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Appointment.DoesNotExist:
        return Response(
            {"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def delete_appointment(request, appointment_id):
    try:
        appointment = Appointment.objects.get(pk=appointment_id)
        # if appointment.customer.user != request.user:
        #     return Response(
        #         {"error": "You are not authorized to delete this appointment"},
        #         status=status.HTTP_403_FORBIDDEN,
        #     )
        appointment.delete()
        return Response(
            {"message": "Appointment deleted successfully"}, status=status.HTTP_200_OK
        )
    except Appointment.DoesNotExist:
        return Response(
            {"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND
        )
