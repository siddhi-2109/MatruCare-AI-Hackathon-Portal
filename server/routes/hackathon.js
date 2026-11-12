const express = require('express');
const HackathonEntry = require('../models/HackathonEntry');
const auth = require('../middleware/auth');
const { sendConfirmationEmail } = require('../utils/mailer');

const router = express.Router();
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRe = /^https?:\/\/\S+\.\S+/i;

// Server-side validation mirroring the client form rules
const validate = (b) => {
  if (!/^[A-Za-z ]{3,}$/.test((b.fullName || '').trim())) return 'Full name: min 3 letters, letters only';
  if (!emailRe.test(b.email || '')) return 'Valid email is required';
  if (!/^[6-9]\d{9}$/.test(String(b.mobile || ''))) return 'Enter a valid 10-digit Indian mobile number';
  for (const f of ['college', 'course', 'branch', 'year', 'domain']) if (!b[f]) return `${f} is required`;
  if (!b.projectName || b.projectName.trim().length < 5) return 'Project name must be at least 5 characters';
  if (!urlRe.test(b.pptLink || '')) return 'A valid PPT link is required';
  if (!urlRe.test(b.prototypeLink || '')) return 'A valid prototype link is required';
  if (b.demoLink && !urlRe.test(b.demoLink)) return 'Demo video link must be a valid URL';
  const size = Number(b.teamSize);
  if (!Number.isInteger(size) || size < 1 || size > 5) return 'Team size must be between 1 and 5';
  const members = b.members || [];
  if (members.length !== (size === 1 ? 0 : size)) return 'Member details do not match team size';
  for (const m of members) {
    if (!m.name || m.name.trim().length < 2) return 'Each member needs a name';
    if (!emailRe.test(m.email || '')) return 'Each member needs a valid email';
  }
  return null;
};

// POST /api/hackathon/register
router.post('/register', auth, async (req, res) => {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ message: error });
    if (await HackathonEntry.findOne({ user: req.user._id })) {
      return res.status(409).json({ message: 'You have already registered for this hackathon' });
    }
    const b = req.body;
    const entry = await HackathonEntry.create({
      user: req.user._id,
      fullName: b.fullName.trim(),
      email: b.email.toLowerCase().trim(),
      mobile: String(b.mobile),
      college: b.college,
      course: b.course,
      branch: b.branch,
      year: b.year,
      domain: b.domain,
      projectName: b.projectName.trim(),
      pptLink: b.pptLink,
      prototypeLink: b.prototypeLink,
      demoLink: b.demoLink || '',
      teamSize: Number(b.teamSize),
      members: (b.members || []).map((m) => ({ name: m.name.trim(), email: m.email.toLowerCase().trim() })),
    });

    // Email failure should not undo a successful registration
    let emailSent = true;
    try {
      await sendConfirmationEmail(entry.email, entry);
    } catch (mailErr) {
      emailSent = false;
      console.error('confirmation email error:', mailErr.message);
    }
    res.status(201).json({ message: 'Registration successful', emailSent, entry });
  } catch (err) {
    console.error('register error:', err.message);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// GET /api/hackathon/my-entry
router.get('/my-entry', auth, async (req, res) => {
  const entry = await HackathonEntry.findOne({ user: req.user._id });
  res.json({ entry }); // entry is null when not registered
});

// DELETE /api/hackathon/:id - owner can delete their own registration
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await HackathonEntry.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ message: 'Registration not found' });
    res.json({ message: 'Registration deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid registration id' });
  }
});

module.exports = router;
