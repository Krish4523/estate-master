from django.conf import settings
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.response import Response
from django.core.mail import send_mail
from .models import User, OTP, Customer, Agent
from .serializers import UserSerializer, CustomerSerializer, AgentSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.is_active = False  # Deactivate account until email confirmation
        user.save()

        # Generate and send OTP
        otp = OTP.objects.create(user=user)
        otp_code = otp.generate_otp()
        send_otp_email(user.email, otp_code)

        return Response(
            {
                "message": "Please confirm your email address by entering the OTP sent to your email."
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(
        {
            "error": "User with Email or Phone No. already exists",
            "details": serializer.errors,
        },
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get("email", "").strip().lower()
    phone = request.data.get("phone", "").strip()
    password = request.data.get("password", "")
    print(email, phone, password)

    user = None
    print(User.objects.filter(email=email))
    for u in User.objects.all():
        print(u.name, u.email, u.phone)
    try:
        if email:
            user = User.objects.get(email=email)
        elif phone:
            user = User.objects.get(phone=phone)
    except User.DoesNotExist:
        return Response({"error": "User not found!"}, status=status.HTTP_404_NOT_FOUND)

    if not user.check_password(password):
        return Response(
            {"error": "Incorrect password!"}, status=status.HTTP_401_UNAUTHORIZED
        )

    if user.is_active:
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "token": token.key,
                "user": UserSerializer(user).data,
                "message": "Login Successful",
            },
            status=status.HTTP_200_OK,
        )
    else:
        # Resend OTP since the user is not active
        otp = OTP.objects.get(user=user)
        otp_code = otp.generate_otp()
        send_otp_email(user.email, otp_code)
        return Response(
            {"message": "Account is inactive. A new OTP has been sent to your email."},
            status=status.HTTP_401_UNAUTHORIZED,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def get_user(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def logout(request):
    if request.user.is_authenticated:
        try:
            # Delete the user's token to log them out
            token = Token.objects.get(user=request.user)
            token.delete()

            response = Response(
                {"message": "Successfully logged out"}, status=status.HTTP_200_OK
            )
            response.delete_cookie(
                "token"
            )  # Optionally delete any related cookies if used
            return response
        except Token.DoesNotExist:
            return Response(
                {"error": "Token does not exist"}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    else:
        return Response(
            {"error": "User is not authenticated"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_otp(request):
    email = request.data.get("email", "").strip()
    otp_input = request.data.get("otp", "").strip()
    print(email, otp_input)
    try:
        user = User.objects.get(email=email)
        print(user, type(user))
        otp_obj = OTP.objects.filter(user=user).first()

        if otp_obj and otp_obj.is_valid() and otp_obj.otp == otp_input:
            user.is_active = True
            user.save()
            otp_obj.delete()
            # Generate and send token now that user is activated
            # token, _ = Token.objects.get_or_create(user=user)

            # Token.objects.filter(user=user).delete()
            token = Token.objects.create(user=user)
            return Response(
                {
                    "message": "OTP verified successfully. Your account is now active.",
                    "token": token.key,
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "Invalid or expired OTP."},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except User.DoesNotExist:
        return Response({"error": "User not found!"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
@permission_classes([AllowAny])
def resend_otp(request):
    email = request.data.get("email", "").strip()

    try:
        user = User.objects.get(email=email)
        if user.is_active:
            return Response(
                {"message": "This account is already verified."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        otp_obj, created = OTP.objects.get_or_create(user=user)
        if not created:
            otp = otp_obj.generate_otp()
        else:
            otp = otp_obj.otp

        send_otp_email(user.email, otp)
        return Response(
            {"message": "OTP has been resent to your email."}, status=status.HTTP_200_OK
        )
    except User.DoesNotExist:
        return Response({"error": "User not found!"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def get_user_profile(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        if request.user != user:
            return Response(
                {"error": "You are not authorized to view this profile."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if user.role == "customer":
            customer_profile = Customer.objects.get(user=user)
            serializer = CustomerSerializer(customer_profile)
        elif user.role == "agent":
            agent_profile = Agent.objects.get(user=user)
            serializer = AgentSerializer(agent_profile)
        else:
            return Response(
                {"error": "Invalid role!"}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found!"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def update_user_profile(request, user_id):
    try:
        user = User.objects.get(id=user_id)

        # Ensure the requesting user is the owner of the profile
        if request.user != user:
            return Response(
                {"error": "You are not authorized to update this profile."},
                status=status.HTTP_403_FORBIDDEN,
            )

        data = request.data.copy()
        if "avatar" in request.FILES:
            data["avatar"] = request.FILES["avatar"]

        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Profile updated successfully", "user": serializer.data},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except User.DoesNotExist:
        return Response({"error": "User not found!"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def change_password(request):
    try:
        user = request.user
        old_password = request.data.get("currentPassword")
        new_password = request.data.get("newPassword")

        if not user.check_password(old_password):
            return Response(
                {"error": "Old password is incorrect!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password updated successfully!"}, status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def send_otp_email(email, otp_code):
    subject = "Your OTP Code"
    message = f"Your OTP code is {otp_code}. It will expire in 10 minutes."
    send_mail(subject, message, settings.EMAIL_HOST_USER, [email])
