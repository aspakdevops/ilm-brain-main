const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const routes = require('./routes');

// Initialize express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP for development
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 900000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve favicon
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/images/favicon.ico'));
});

// Set proper MIME types for static files
app.use('/css', (req, res, next) => {
  if (req.path.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }
  next();
}, express.static(path.join(__dirname, 'views/css')));

app.use('/js', (req, res, next) => {
  if (req.path.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
}, express.static(path.join(__dirname, 'views/js')));

// Serve other static files from the views directory
app.use('/images', express.static(path.join(__dirname, 'views/images')));
app.use('/fonts', express.static(path.join(__dirname, 'views/fonts')));
app.use('/pages', express.static(path.join(__dirname, 'views/pages')));
app.use('/sample_data', express.static(path.join(__dirname, 'sample_data')));

// Request logging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Main routes
app.get('/', (req, res) => {
  console.log('📝 Serving main page');
  res.sendFile(path.join(__dirname, 'views/pages/index.html'));
});

app.get('/topics', (req, res) => {
  console.log('📚 Serving topics page');
  res.sendFile(path.join(__dirname, 'views/pages/topics.html'));
});

app.get('/subtopics', (req, res) => {
  console.log('📋 Serving subtopics page');
  res.sendFile(path.join(__dirname, 'views/pages/subtopics.html'));
});

app.get('/learning/:topicId?', (req, res) => {
  console.log('📖 Serving learning page');
  res.sendFile(path.join(__dirname, 'views/pages/learning.html'));
});

// API routes
app.use('/api', routes);

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  console.log('❌ 404 Not Found:', req.url);
  res.redirect('/');
});

module.exports = app; 