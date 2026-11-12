const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Cryptographically random 6-digit OTP
const generateOtp = () => String(crypto.randomInt(100000, 1000000));

// Returns { otp, otpHash, otpExpires } ready to store on the user
const createOtp = async () => {
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 8);
  return { otp, otpHash, otpExpires: new Date(Date.now() + OTP_TTL_MS) };
};

module.exports = { createOtp };
