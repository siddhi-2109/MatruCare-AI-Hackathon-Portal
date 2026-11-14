const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
  },
  { _id: false }
);

const hackathonEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobile: { type: String, required: true },
    college: { type: String, required: true },
    course: { type: String, required: true },
    branch: { type: String, required: true },
    year: { type: String, required: true },
    domain: { type: String, required: true },
    projectName: { type: String, required: true, trim: true },
    pptLink: { type: String, required: true },
    prototypeLink: { type: String, required: true },
    demoLink: { type: String, default: '' }, // optional
    teamSize: { type: Number, required: true, min: 1, max: 5 },
    members: { type: [memberSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HackathonEntry', hackathonEntrySchema);
