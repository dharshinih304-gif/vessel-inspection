const express = require('express');
const {
  createReport,
  getReports,
  getReportById,
  approveReport,
  deleteReport
} = require('../controllers/ReportController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, createReport)
  .get(protect, getReports);

router.route('/:id')
  .get(protect, getReportById)
  .delete(protect, authorize('ADMIN'), deleteReport);

router.put('/:id/approve', protect, authorize('ADMIN'), approveReport);

module.exports = router;
