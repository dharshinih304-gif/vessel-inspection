const { User, Vessel, Report } = require('../models');
const sequelize = require('../config/database');
const fs = require('fs');
const path = require('path');

const seedData = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced (force: true)');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@sellamsoft.com',
      password: 'adminpassword',
      role: 'ADMIN'
    });

    // Create Superintendent
    const supt = await User.create({
      name: 'Superintendent John',
      email: 'supt@sellamsoft.com',
      password: 'suptpassword',
      role: 'SUPERINTENDENT'
    });

    console.log('Users created');

    // Create Vessels
    const vessels = await Vessel.bulkCreate([
      { vesselName: 'Ever Given', vesselType: 'Container Ship', imoNumber: '9811000', createdBy: supt.id },
      { vesselName: 'Titanic II', vesselType: 'Passenger Ship', imoNumber: '9922001', createdBy: supt.id },
      { vesselName: 'Ocean Explorer', vesselType: 'Research Vessel', imoNumber: '9123456', createdBy: admin.id }
    ]);

    console.log('Vessels created');

    // Read inspection fields from JSON (if available)
    let reportsData = [];
    const jsonPath = path.join(__dirname, '../../components/data/inspectionFields.json');
    
    if (fs.existsSync(jsonPath)) {
      const rawData = fs.readFileSync(jsonPath, 'utf8');
      const fields = JSON.parse(rawData);
      
      // Create reports based on these fields (example mapping)
      reportsData = fields.slice(0, 51).map((field, index) => ({
        vesselId: vessels[index % vessels.length].id,
        title: `Inspection: ${field.CERTIFICATE || 'General Certificate'}`,
        inspectionDate: new Date(),
        status: index % 3 === 0 ? 'APPROVED' : 'PENDING',
        description: `Requirement S.NO: ${field['S.NO']}. Comments: ${field.COMMENTS || 'None'}`,
        createdBy: supt.id
      }));
    } else {
      // Fallback dummy data
      for (let i = 1; i <= 51; i++) {
        reportsData.push({
          vesselId: vessels[i % vessels.length].id,
          title: `Inspection Report #${i}`,
          inspectionDate: new Date(),
          status: i % 2 === 0 ? 'APPROVED' : 'PENDING',
          description: `Detailed description for report #${i}`,
          createdBy: supt.id
        });
      }
    }

    await Report.bulkCreate(reportsData);
    console.log('51 Reports seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
