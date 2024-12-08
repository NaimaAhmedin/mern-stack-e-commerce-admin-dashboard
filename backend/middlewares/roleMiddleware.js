module.exports = (roles) => {
    return (req, res, next) => {
      // Assuming user roles are saved in req.user after authentication (e.g., from a JWT or session)
      const userRole = req.user.role;
  
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden: You do not have access' });
      }
  
      next();
    };
  };
  