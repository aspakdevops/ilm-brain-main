require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

// Log startup information
console.log('\n=== Learning Platform Backend ===');
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Base URL: ${BASE_URL}`);
console.log('================================\n');

// Start server without database for now
console.log('🚀 Starting server without database connection...');
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running at: ${BASE_URL}`);
  console.log(`📝 Main Page: ${BASE_URL}/`);
  console.log(`📖 Learning Page: ${BASE_URL}/learning\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('\n❌ Unhandled Promise Rejection:', error.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('\n❌ Uncaught Exception:', error.message);
  process.exit(1);
}); 