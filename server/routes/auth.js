
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { createOtp } = require('../utils/otp');
const { sendOtpEmail } = require('../utils/mailer');

const router = express.Router();

// Correct email validation
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==========================================
// POST /api/auth/signup
// ==========================================

router.post('/signup', async (req, res) => {
  const start = Date.now();

  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Validate full name
    if (
      typeof fullName !== 'string' ||
      fullName.trim().length < 3
    ) {
      return res.status(400).json({
        message: 'Full name must be at least 3 characters'
      });
    }

    // Validate email
    if (
      typeof email !== 'string' ||
      !emailRe.test(email.trim())
    ) {
      return res.status(400).json({
        message: 'Enter a valid email'
      });
    }

    // Validate password
    if (
      typeof password !== 'string' ||
      password.length < 6
    ) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing user
    const dbStart = Date.now();

    const existing = await User.findOne({
      email: normalizedEmail
    });

    console.log(
      `Signup user lookup: ${Date.now() - dbStart}ms`
    );

    if (existing && existing.isVerified) {
      return res.status(409).json({
        message: 'Email already registered. Please log in.'
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Generate OTP
    const { otp, otpHash, otpExpires } = await createOtp();

    // Create or update unverified account
    const user = existing || new User({
      email: normalizedEmail
    });

    user.fullName = fullName.trim();
    user.password = hashed;
    user.otpHash = otpHash;
    user.otpExpires = otpExpires;

    const saveStart = Date.now();

    await user.save();

    console.log(
      `Signup database save: ${Date.now() - saveStart}ms`
    );

    // Send OTP email
    try {
      const emailStart = Date.now();

      await sendOtpEmail(user.email, otp);

      console.log(
        `Signup email operation: ${Date.now() - emailStart}ms`
      );

    } catch (emailError) {
      console.error(
        'Signup OTP delivery failed:',
        emailError.message
      );

      return res.status(503).json({
        message: 'Account created, but OTP email could not be sent. Please try Resend OTP.'
      });
    }

    console.log(
      `Total signup time: ${Date.now() - start}ms`
    );

    return res.status(201).json({
      message: 'OTP sent to your email',
      email: user.email
    });

  } catch (err) {
    console.error('Signup error:', err.message);

    return res.status(500).json({
      message: 'Signup failed. Please try again.'
    });
  }
});

// ==========================================
// POST /api/auth/resend-otp
// ==========================================

router.post('/resend-otp', async (req, res) => {
  try {
    const email = (req.body.email || '')
      .toLowerCase()
      .trim();

    if (!emailRe.test(email)) {
      return res.status(400).json({
        message: 'Enter a valid email'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: 'Account already verified'
      });
    }

    const { otp, otpHash, otpExpires } = await createOtp();

    user.otpHash = otpHash;
    user.otpExpires = otpExpires;

    await user.save();

    try {
      await sendOtpEmail(user.email, otp);
    } catch (emailError) {
      console.error('Resend OTP email failed:', emailError.message);

      return res.status(503).json({
        message: 'Could not send OTP. Please try again.'
      });
    }

    return res.json({
      message: 'A new OTP has been sent'
    });

  } catch (err) {
    console.error('Resend OTP error:', err.message);

    return res.status(500).json({
      message: 'Could not resend OTP'
    });
  }
});

// ==========================================
// POST /api/auth/verify-otp
// ==========================================

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const normalizedEmail = (email || '')
      .toLowerCase()
      .trim();

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: 'Account already verified'
      });
    }

    if (!user.otpHash || !user.otpExpires) {
      return res.status(400).json({
        message: 'No active OTP. Please resend.'
      });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({
        message: 'OTP expired. Please resend.'
      });
    }

    const ok = await bcrypt.compare(
      String(otp || ''),
      user.otpHash
    );

    if (!ok) {
      return res.status(400).json({
        message: 'Invalid OTP'
      });
    }

    user.isVerified = true;
    user.otpHash = null;
    user.otpExpires = null;

    await user.save();

    return res.json({
      message: 'Email verified. You can now log in.'
    });

  } catch (err) {
    console.error('Verify OTP error:', err.message);

    return res.status(500).json({
      message: 'Verification failed'
    });
  }
});

// ==========================================
// POST /api/auth/login
// ==========================================

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = (email || '')
      .toLowerCase()
      .trim();

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (
      !user ||
      !(await bcrypt.compare(password || '', user.password))
    ) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Email not verified',
        needsVerification: true,
        email: user.email
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Login error:', err.message);

    return res.status(500).json({
      message: 'Login failed'
    });
  }
});

module.exports = router;
