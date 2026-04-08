const Notice = require('../models/Notice,js');

// @desc    Create notice
// @route   POST /api/notices
// @access  Private (Admin/Warden)
const createNotice = async (req, res) => {
  try {
    const notice = await Notice.create({
      ...req.body,
      author: req.user._id,
      authorName: req.user.name
    });
    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public/Private
const getNotices = async (req, res) => {
  try {
    const { category, important } = req.query;
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (important === 'true') query.isImportant = true;
    
    const notices = await Notice.find(query)
      .sort({ isImportant: -1, createdAt: -1 })
      .populate('author', 'name');
    
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single notice
// @route   GET /api/notices/:id
// @access  Public/Private
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate('author', 'name email');
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private (Admin/Warden)
const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json(notice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private (Admin only)
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    await notice.deleteOne();
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice
};