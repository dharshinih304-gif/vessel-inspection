const { Report, Vessel, User } = require('../models');

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res) => {
  const { vesselId, title, inspectionDate, description, attachments } = req.body;

  try {
    const report = await Report.create({
      vesselId,
      title,
      inspectionDate,
      description, 
      attachments,
      createdBy: req.user.id
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        { model: Vessel, as: 'vessel', attributes: [['vesselName', 'name'], 'imoNumber'] },
        { model: User, as: 'creator', attributes: ['name'] }
      ]
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id, {
      include: [
        { model: Vessel, as: 'vessel', attributes: [['vesselName', 'name'], 'imoNumber'] },
        { model: User, as: 'creator', attributes: ['name'] }
      ]
    });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve report
// @route   PUT /api/reports/:id/approve
// @access  Private/Admin
exports.approveReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await report.update({
      status: 'APPROVED',
      approvedBy: req.user.id
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await report.destroy();
    res.json({ message: 'Report removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
