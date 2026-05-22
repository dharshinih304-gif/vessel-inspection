const express = require('express');
const router = express.Router();
const { createVessel, getVessels, getVesselById, updateVessel, deleteVessel } = require('../controllers/VesselController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, authorize('ADMIN', 'SUPERINTENDENT'), createVessel)
  .get(protect, getVessels);

router.route('/:id')
  .get(protect, getVesselById)
  .put(protect, authorize('ADMIN'), updateVessel)
  .delete(protect, authorize('ADMIN'), deleteVessel);

module.exports = router;
