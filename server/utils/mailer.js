const nodemailer = require('nodemailer');

// Gmail SMTP transport authenticated with an App Password
const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

// Sender is always "MatruCare AI" <matrucareai@gmail.com>; no personal names.
const from = () => `"${process.env.EMAIL_FROM_NAME || 'MatruCare AI'}" <${process.env.EMAIL_USER}>`;

const escapeHtml = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// OTP email (valid 10 minutes)
const sendOtpEmail = async (to, otp) => {
  await createTransporter().sendMail({
    from: from(),
    to,
    subject: 'Your MatruCare AI verification code',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#7c3aed">MatruCare AI</h2>
        <p>Use the code below to verify your email address:</p>
        <p style="font-size:32px;letter-spacing:8px;font-weight:bold">${otp}</p>
        <p>This code expires in 10 minutes. If you did not request it, ignore this email.</p>
      </div>`,
  });
};

// Hackathon registration confirmation email
const sendConfirmationEmail = async (to, entry) => {
  const rows = (entry.members || [])
    .map((m) => `<li>${escapeHtml(m.name)} (${escapeHtml(m.email)})</li>`)
    .join('');
  await createTransporter().sendMail({
    from: from(),
    to,
    subject: 'Hackathon registration confirmed - MatruCare AI',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto">
        <h2 style="color:#7c3aed">MatruCare AI Hackathon</h2>
        <p>Hi ${escapeHtml(entry.fullName)}, your registration is confirmed.</p>
        <table cellpadding="6" style="border-collapse:collapse">
          <tr><td><b>Event</b></td><td>MatruCare AI Hackathon</td></tr>
          <tr><td><b>Domain</b></td><td>${escapeHtml(entry.domain)}</td></tr>
          <tr><td><b>Project</b></td><td>${escapeHtml(entry.projectName)}</td></tr>
          <tr><td><b>Team size</b></td><td>${entry.teamSize}</td></tr>
        </table>
        ${rows ? `<p><b>Team members</b></p><ul>${rows}</ul>` : '<p>You are registered as a solo participant.</p>'}
        <p>Good luck!<br/>MatruCare AI</p>
      </div>`,
  });
};

module.exports = { sendOtpEmail, sendConfirmationEmail };
