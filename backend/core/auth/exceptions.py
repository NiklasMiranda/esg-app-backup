class AuthorizationDenied(Exception):
    pass

class TenantAccessDenied(AuthorizationDenied):
    pass