from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from drf_spectacular.utils import extend_schema

from api.models import Member, Message
from api.serializers import (
    MemberSerializer,
    MemberRegisterSerializer,
    MemberLoginSerializer,
    MemberUpdateSerializer,
    MessageSerializer,
)
from api.authentication import TokenAuthentication


class HelloView(APIView):
    """
    A simple API endpoint that returns a greeting message.
    """

    @extend_schema(
        responses={200: MessageSerializer}, description="Get a hello world message"
    )
    def get(self, request):
        data = {"message": "Hello!", "timestamp": timezone.now()}
        serializer = MessageSerializer(data)
        return Response(serializer.data)


class RegisterView(APIView):
    """
    Register a new user account.
    """

    def post(self, request):
        serializer = MemberRegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            member = serializer.save()
            response_serializer = MemberSerializer(member)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(
            {"error": "Validation error", "detail": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginView(APIView):
    """
    Authenticate user and return access token.
    """

    def post(self, request):
        serializer = MemberLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            member = serializer.validated_data['member']
            token = member.generate_token()
            member.save()
            
            member_serializer = MemberSerializer(member)
            return Response(
                {"token": token, "user": member_serializer.data},
                status=status.HTTP_200_OK
            )
        
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )


class MeView(APIView):
    """
    Get current authenticated user information.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = MemberSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProfileUpdateView(APIView):
    """
    Update authenticated user's profile.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = MemberUpdateSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        
        if serializer.is_valid():
            member = serializer.save()
            response_serializer = MemberSerializer(member)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        
        return Response(
            {"error": "Validation error", "detail": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )


class MessageListCreateView(APIView):
    """
    List all messages or create a new message.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        limit = int(request.query_params.get('limit', 100))
        offset = int(request.query_params.get('offset', 0))
        
        messages = Message.objects.all().order_by('created_at')
        total_count = messages.count()
        
        messages = messages[offset:offset + limit]
        serializer = MessageSerializer(messages, many=True)
        
        return Response(
            {"count": total_count, "results": serializer.data},
            status=status.HTTP_200_OK
        )

    def post(self, request):
        serializer = MessageSerializer(data=request.data)
        
        if serializer.is_valid():
            message = serializer.save(author=request.user)
            response_serializer = MessageSerializer(message)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(
            {"error": "Validation error", "detail": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
