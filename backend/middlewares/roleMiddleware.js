module.exports = (roles) => {
  return (req, res, next) => {
    // Log detailed information about the request
    console.log('Role Middleware Request Details:', {
      requiredRoles: roles,
      userInfo: req.user ? {
        id: req.user._id,
        name: req.user.name,
        role: req.user.role
      } : 'No user found in request',
      requestHeaders: req.headers,
      requestMethod: req.method,
      requestPath: req.path
    });

    // Check if user exists
    if (!req.user) {
      console.error('Role Check Failed: No user found in request');
      return res.status(403).json({ 
        success: false, 
        message: 'Authentication required: No user found',
        requiredRoles: roles
      });
    }

    // Normalize roles to lowercase for case-insensitive comparison
    const normalizedUserRole = (req.user.role || '').toLowerCase();
    const normalizedRequiredRoles = roles.map(role => role.toLowerCase());

    console.log('Role Comparison:', {
      userRole: normalizedUserRole,
      requiredRoles: normalizedRequiredRoles,
      roleMatch: normalizedRequiredRoles.includes(normalizedUserRole)
    });

    // Check if user's role matches any of the required roles
    if (!normalizedRequiredRoles.includes(normalizedUserRole)) {
      console.warn('Role Access Denied', {
        userRole: normalizedUserRole,
        requiredRoles: normalizedRequiredRoles
      });

      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: You do not have access to this resource',
        userRole: normalizedUserRole,
        requiredRoles: normalizedRequiredRoles
      });
    }

    next();
  };
};