const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vessel = sequelize.define('Vessel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  vesselName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'vessel_name'
  },
  vesselType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'vessel_type'
  },
  imoNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'imo_number'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'ACTIVE'
  },
  flag: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'created_by'
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'company_id'
  }
});

module.exports = Vessel;
