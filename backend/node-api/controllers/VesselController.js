const { Vessel, User } = require('../models');

// @desc    Create new vessel
// @route   POST /api/vessels
// @access  Private
exports.createVessel = async (req, res) => {
  const { vesselName, vesselType, imoNumber } = req.body;

  try {
    const vessel = await Vessel.create({
      vesselName,
      vesselType,
      imoNumber,
      createdBy: req.user.id
    });

    res.status(201).json(vessel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all vessels
// @route   GET /api/vessels
// @access  Private
exports.getVessels = async (req, res) => {
  try {
    const vessels = await Vessel.findAll({
      attributes: [
        'id',
        ['vesselName', 'name'],
        ['vesselType', 'type'],
        'imoNumber',
        'status',
        'flag',
        'createdBy',
        'createdAt',
        'updatedAt'
      ],
      include: [{ model: User, as: 'creator', attributes: ['name', 'email'] }]
    });
    res.json(vessels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single vessel
// @route   GET /api/vessels/:id
// @access  Private
exports.getVesselById = async (req, res) => {
  try {
    const vessel = await Vessel.findByPk(req.params.id, {
      attributes: [
        'id',
        ['vesselName', 'name'],
        ['vesselType', 'type'],
        'imoNumber',
        'status',
        'flag',
        'createdBy',
        'createdAt',
        'updatedAt'
      ],
      include: [{ model: User, as: 'creator', attributes: ['name', 'email'] }]
    });

    if (!vessel) {
      return res.status(404).json({ message: 'Vessel not found' });
    }

    res.json(vessel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update vessel
// @route   PUT /api/vessels/:id
// @access  Private
exports.updateVessel = async (req, res) => {
  try {
    const vessel = await Vessel.findByPk(req.params.id);

    if (!vessel) {
      return res.status(404).json({ message: 'Vessel not found' });
    }

    // Check ownership or admin
    if (vessel.createdBy !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await vessel.update(req.body);
    res.json(vessel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete vessel
// @route   DELETE /api/vessels/:id
// @access  Private/Admin
exports.deleteVessel = async (req, res) => {
  try {
    const vessel = await Vessel.findByPk(req.params.id);

    if (!vessel) {
      return res.status(404).json({ message: 'Vessel not found' });
    }

    await vessel.destroy();
    res.json({ message: 'Vessel removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
