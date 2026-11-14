
const nodemailer = require('nodemailer');

// ==========================================
// GMAIL SMTP TRANSPORTER
// Create only ONE transporter and reuse it.
// ==========================================

const transporter = nodemailer.createTransport({
  service: 'gmail',

  pool: true,
  maxConnections: 2,
  maxMessages: 100,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },

  connectionTimeout: 15000,
  greetingTimeout: 10000,
  socketTimeout: 20000
});

// ==========================================
// EMAIL SENDER
// ==========================================

const from = () =>
  `"${process.env.EMAIL_FROM_NAME || 'MatruCare AI'}" <${process.env.EMAIL_USER}>`;

// ==========================================
// HTML ESCAPING
// ==========================================

const escapeHtml = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));

// ==========================================
// SEND OTP EMAIL
// OTP validity: 10 minutes
// ==========================================

const sendOtpEmail = async (to, otp) => {
  const start = Date.now();

  try {
    const info = await transporter.sendMail({
      from: from(),
      to,

      subject: 'Your MatruCare AI verification code',

      text: `Your MatruCare AI verification code is ${otp}. This code expires in 10 minutes.`,

      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:20px">
          <h2 style="color:#7c3aed">MatruCare AI</h2>

          <p>Use the code below to verify your email address:</p>

          <div style="font-size:32px;letter-spacing:8px;font-weight:bold;color:#7c3aed;padding:15px 0">
            ${otp}
          </div>

          <p>This code expires in 10 minutes.</p>

          <p>If you did not request this email, please ignore it.</p>

          <hr/>

          <p style="color:#888;font-size:12px">
            MatruCare AI Hackathon Portal
          </p>
        </div>
      `
    });

    console.log(
      `OTP email accepted by SMTP in ${Date.now() - start}ms. Message ID: ${info.messageId}`
    );

    return info;

  } catch (error) {
    console.error('OTP email failed:', error.message);
    console.error('SMTP error code:', error.code);

    throw error;
  }
};

// ==========================================
// HACKATHON CONFIRMATION EMAIL
// ==========================================

const sendConfirmationEmail = async (to, entry) => {
  const rows = (entry.members || [])
    .map((m) =>
      `<li>${escapeHtml(m.name)} (${escapeHtml(m.email)})</li>`
    )
    .join('');

  const info = await transporter.sendMail({
    from: from(),
    to,

    subject: 'Hackathon registration confirmed - MatruCare AI',

    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:20px">

        <h2 style="color:#7c3aed">MatruCare AI Hackathon</h2>

        <p>Hi ${escapeHtml(entry.fullName)}, your registration is confirmed.</p>

        <table cellpadding="6" style="border-collapse:collapse">
          <tr>
            <td><b>Event</b></td>
            <td>MatruCare AI Hackathon</td>
          </tr>

          <tr>
            <td><b>Domain</b></td>
            <td>${escapeHtml(entry.domain)}</td>
          </tr>

          <tr>
            <td><b>Project</b></td>
            <td>${escapeHtml(entry.projectName)}</td>
          </tr>

          <tr>
            <td><b>Team size</b></td>
            <td>${entry.teamSize}</td>
          </tr>
        </table>

        ${
          rows
            ? `<p><b>Team members</b></p><ul>${rows}</ul>`
            : '<p>You are registered as a solo participant.</p>'
        }

        <p>Good luck!</p>
        <p>MatruCare AI</p>

      </div>
    `
  });

  console.log('Confirmation email sent:', info.messageId);

  return info;
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  sendOtpEmail,
  sendConfirmationEmail
};
