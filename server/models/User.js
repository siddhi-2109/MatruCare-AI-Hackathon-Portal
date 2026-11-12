const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, minlength: 3 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // bcrypt hash only
    isVerified: { type: Boolean, default: false },
    // OTP is stored hashed; cleared after first successful use
    otpHash: { type: String, default: null },
    otpExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
