const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/user/me - logged-in user's profile
router.get('/me', auth, (req, res) => {
  const { _id, fullName, email, isVerified, createdAt } = req.user;
  res.json({ id: _id, fullName, email, isVerified, createdAt });
});

// PUT /api/user/update - update display name
router.put('/update', auth, async (req, res) => {
  try {
    const { fullName } = req.body;
    if (!fullName || fullName.trim().length < 3) return res.status(400).json({ message: 'Full name must be at least 3 characters' });
    req.user.fullName = fullName.trim();
    await req.user.save();
    res.json({ id: req.user._id, fullName: req.user.fullName, email: req.user.email });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

module.exports = router;
