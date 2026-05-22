const User = require('./User');
const Vessel = require('./Vessel');
const Report = require('./Report');
const Company = require('./Company');

// User - Company
Company.hasMany(User, { foreignKey: 'companyId', as: 'users' });
User.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// Vessel - Company
Company.hasMany(Vessel, { foreignKey: 'companyId', as: 'vessels' });
Vessel.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// Report - Company
Company.hasMany(Report, { foreignKey: 'companyId', as: 'reports' });
Report.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// User - Vessel (Created By)
User.hasMany(Vessel, { foreignKey: 'createdBy', as: 'vessels' });
Vessel.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Vessel - Report
Vessel.hasMany(Report, { foreignKey: 'vesselId', as: 'reports' });
Report.belongsTo(Vessel, { foreignKey: 'vesselId', as: 'vessel' });

// User - Report (Created By)
User.hasMany(Report, { foreignKey: 'createdBy', as: 'createdReports' });
Report.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// User - Report (Approved By)
User.hasMany(Report, { foreignKey: 'approvedBy', as: 'approvedReports' });
Report.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });

module.exports = {
  User,
  Vessel,
  Report,
  Company
};
