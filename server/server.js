
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// ==========================================
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = (
  process.env.CLIENT_URL || 'http://localhost:5173'
)
  .split(',')
  .map(origin => origin.trim().replace(/\/+$/, ''));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header (e.g. Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS'
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ],

  optionsSuccessStatus: 204
};

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors(corsOptions));
app.use(express.json());

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'MatruCare AI Backend is running'
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use('/api/auth', require('./routes/auth'));

app.use('/api/user', require('./routes/user'));

app.use('/api/hackathon', require('./routes/hackathon'));

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'Origin not allowed by CORS'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log('================================');
      console.log('MatruCare AI Backend Started');
      console.log(`Port: ${PORT}`);
      console.log('Allowed Origins:', allowedOrigins);
      console.log('================================');
    });

  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
