from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from api.models import Member


class TokenAuthentication(BaseAuthentication):
    """
    Custom token-based authentication.
    Clients should authenticate by passing the token in the Authorization header.
    Example: Authorization: Bearer <token>
    """

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return None
        
        try:
            # Expected format: "Bearer <token>"
            parts = auth_header.split()
            
            if len(parts) != 2 or parts[0].lower() != 'bearer':
                raise AuthenticationFailed('Invalid authorization header format')
            
            token = parts[1]
            
            try:
                member = Member.objects.get(token=token)
            except Member.DoesNotExist:
                raise AuthenticationFailed('Invalid token')
            
            return (member, None)
            
        except Exception as e:
            if isinstance(e, AuthenticationFailed):
                raise
            raise AuthenticationFailed('Invalid authorization header')

    def authenticate_header(self, request):
        return 'Bearer'
