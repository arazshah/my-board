from rest_framework import status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from rest_framework.decorators import permission_classes, action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import User
from django.db.models import Q
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser


class RegisterView(APIView):
    """View for user registration"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "user": UserSerializer(user).data,
                "message": "User created successfully"
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class LoginView(APIView):
    """View for user login"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            user = authenticate(request, username=email, password=password)

            if user is not None:
                login(request, user)
                return Response({
                    "user": UserSerializer(user).data,
                    "message": "Login successful"
                })
            else:
                return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """View for user logout"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"})


class UserDetailView(APIView):
    """View for retrieving and updating user details"""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        # Add debugging
        print(f"User authenticated: {request.user.is_authenticated}")
        print(
            f"User: {request.user.username if request.user.is_authenticated else 'Anonymous'}")

        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."},
                            status=status.HTTP_401_UNAUTHORIZED)

        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(
            request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for managing users"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        # Optionally filter users based on query parameters
        queryset = super().get_queryset()
        role = self.request.query_params.get('role')
        status_param = self.request.query_params.get('status')
        search = self.request.query_params.get('search')

        if role:
            queryset = queryset.filter(role=role)
        if status_param:
            queryset = queryset.filter(status=status_param)
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )
        return queryset

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user details"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def bulk_delete(self, request):
        """Delete multiple users at once"""
        ids = request.data.get('ids', [])
        if not ids:
            return Response({"error": "No user IDs provided"}, status=status.HTTP_400_BAD_REQUEST)

        User.objects.filter(id__in=ids).delete()
        return Response({"message": f"Deleted {len(ids)} users"})


class NotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch notifications for the user
        notifications = [
            {"message": "John commented on your post.",
                "timestamp": "2023-03-13T08:00:00Z"},
            {"message": "Sarah liked your comment.",
                "timestamp": "2023-03-12T10:00:00Z"},
            {"message": "New user followed you.",
                "timestamp": "2023-03-11T15:30:00Z"},
        ]
        return Response(notifications)
