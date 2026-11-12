const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createOtp } = require('../utils/otp');
const { sendOtpEmail } = require('../utils/mailer');

const router = express.Router();
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/signup - create unverified user and email an OTP
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;
    if (!fullName || fullName.trim().length < 3) return res.status(400).json({ message: 'Full name must be at least 3 characters' });
    if (!emailRe.test(email || '')) return res.status(400).json({ message: 'Enter a valid email' });
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing && existing.isVerified) return res.status(409).json({ message: 'Email already registered. Please log in.' });

    const hashed = await bcrypt.hash(password, 10);
    const { otp, otpHash, otpExpires } = await createOtp();

    // Re-signup of an unverified account just refreshes its details and OTP
    const user = existing || new User({ email: normalizedEmail });
    user.fullName = fullName.trim();
    user.password = hashed;
    user.otpHash = otpHash;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOtpEmail(user.email, otp);
    res.status(201).json({ message: 'OTP sent to your email', email: user.email });
  } catch (err) {
    console.error('signup error:', err.message);
    res.status(500).json({ message: 'Signup failed. Could not send OTP email.' });
  }
});

// POST /api/auth/resend-otp - issue a fresh OTP for an unverified account
router.post('/resend-otp', async (req, res) => {
  try {
    const user = await User.findOne({ email: (req.body.email || '').toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'Account not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Account already verified' });

    const { otp, otpHash, otpExpires } = await createOtp();
    user.otpHash = otpHash;
    user.otpExpires = otpExpires;
    await user.save();
    await sendOtpEmail(user.email, otp);
    res.json({ message: 'A new OTP has been sent' });
  } catch (err) {
    console.error('resend-otp error:', err.message);
    res.status(500).json({ message: 'Could not resend OTP' });
  }
});

// POST /api/auth/verify-otp - verify code, mark verified, invalidate OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'Account not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Account already verified' });
    if (!user.otpHash || !user.otpExpires) return res.status(400).json({ message: 'No active OTP. Please resend.' });
    if (user.otpExpires < new Date()) return res.status(400).json({ message: 'OTP expired. Please resend.' });

    const ok = await bcrypt.compare(String(otp || ''), user.otpHash);
    if (!ok) return res.status(400).json({ message: 'Invalid OTP' });

    user.isVerified = true;
    user.otpHash = null; // single use
    user.otpExpires = null;
    await user.save();
    res.json({ message: 'Email verified. You can now log in.' });
  } catch (err) {
    console.error('verify-otp error:', err.message);
    res.status(500).json({ message: 'Verification failed' });
  }
});

// POST /api/auth/login - bcrypt compare, issue JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Email not verified', needsVerification: true, email: user.email });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email } });
  } catch (err) {
    console.error('login error:', err.message);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
