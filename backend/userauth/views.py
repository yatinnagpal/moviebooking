from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.permissions import IsAuthenticated
from .serializers import UserRegisterSerializer, UserLoginSerializer, ForgotPasswordSerializer, ResetPasswordSerializer
from .models import PasswordResetToken
from django.contrib.auth import get_user_model
from django.core.mail import send_mail, BadHeaderError
from django.conf import settings
from django.db import IntegrityError
import uuid
import re
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator





User = get_user_model()

class RegisterView(APIView):
    def validate_password_strength(self, password):
        # Regex: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
        return re.match(pattern, password)

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)

        try:
            if serializer.is_valid():
                password = serializer.validated_data.get('password')
                if not self.validate_password_strength(password):
                    return Response(
                        {'error': 'Password must include uppercase, lowercase, number, and special character, and be at least 8 characters long.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                user = serializer.save()

                return Response({
                    'message': 'User registered successfully!',
                    'user': {
                        'username': user.username,
                        'email': user.email,
                        'phone_number': user.phone_number,
                        'is_admin': user.is_admin
                    }
                }, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except IntegrityError:
            return Response({'error': 'Username or email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'An unexpected error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        try:
            if serializer.is_valid():
                username = serializer.validated_data.get('username')
                password = serializer.validated_data.get('password')

                # Check if user exists
                try:
                    user_obj = User.objects.get(username=username)
                except User.DoesNotExist:
                    return Response({'error': 'Username not found.'}, status=status.HTTP_404_NOT_FOUND)

                # Authenticate user
                user = authenticate(username=username, password=password)
                if user is None:
                    return Response({'error': 'Incorrect password.'}, status=status.HTTP_401_UNAUTHORIZED)

                # Check if user is active
                if not user.is_active:
                    return Response({'error': 'User account is inactive.'}, status=status.HTTP_403_FORBIDDEN)

                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)

                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': {
                        'username': user.username,
                        'email': user.email,
                        'phone_number': getattr(user, 'phone_number', None),
                        'is_admin': user.is_staff or user.is_superuser
                    }
                }, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': f'An unexpected error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
    

class ForgotPasswordView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'error': 'No user found with this email.'}, status=status.HTTP_404_NOT_FOUND)

            # Generate token and uid
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"

            # Send reset email
            try:
                send_mail(
                    subject="Password Reset Request",
                    message=f"Hi {user.username},\n\nClick the link to reset your password:\n{reset_link}\n\nIf you did not request this, please ignore this email.",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )
            except BadHeaderError:
                return Response({'error': 'Invalid header found.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                return Response({'error': f'Error sending email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({'message': 'Password reset link sent to your email.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    def post(self, request, uidb64, token):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            try:
                uid = urlsafe_base64_decode(uidb64).decode()
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                return Response({'error': 'Invalid reset link.'}, status=status.HTTP_400_BAD_REQUEST)

            # Verify the token
            if not default_token_generator.check_token(user, token):
                return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)

            # Set new password
            user.set_password(serializer.validated_data['password'])
            user.save()

            return Response({'message': 'Password reset successfully.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')

            if not refresh_token:
                return Response({'error': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the token so it can't be used again

            return Response({'message': 'Logout successful.'}, status=status.HTTP_205_RESET_CONTENT)

        except TokenError:
            return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'An unexpected error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)