const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

const protectSuperadmin = async (req, res, next) => {
  if (!req.user || 
      (req.user.role !== 'superadmin' && req.user.role !== 'SUPERADMIN') || 
      req.user.email?.toLowerCase() !== 'superadmin@gmail.com') {
    return res.status(403).json({
      message: 'Access Denied: Authorized Superadmin only'
    });
  }
  next();
};

const restrictToCompany = (req, res, next) => {
  // Superadmin has access to all companies
  if (req.user && 
      (req.user.role === 'superadmin' || req.user.role === 'SUPERADMIN') && 
      req.user.email?.toLowerCase() === 'superadmin@gmail.com') {
    return next();
  }

  const requestedCompanyId = req.params.companyId || req.params.company_id || req.query.companyId || req.query.company_id || req.body.companyId || req.body.company_id;

  if (!requestedCompanyId) {
    return next();
  }

  const userCompanyId = req.user.companyId || req.user.company_id;

  if (userCompanyId !== requestedCompanyId) {
    return res.status(403).json({
      message: 'Unauthorized Company Access'
    });
  }

  next();
};

module.exports = { protect, authorize, protectSuperadmin, restrictToCompany };
