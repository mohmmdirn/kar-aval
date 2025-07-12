// Configuration file for API keys and sensitive data
// Replace these with your actual values

const requiredEnvVars = [
  'FIREBASE_API_KEY',
  'ZARINPAL_MERCHANT_ID'
];

// Validate required environment variables
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0 && process.env.NODE_ENV === 'production') {
  console.error('Missing required environment variables:', missingVars);
  process.exit(1);
}

module.exports = {
  // Firebase Configuration
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || 'YOUR_FIREBASE_API_KEY_HERE',
  
  // Payment Gateway Configuration
  ZARINPAL_MERCHANT_ID: process.env.ZARINPAL_MERCHANT_ID || 'YOUR_ZARINPAL_MERCHANT_ID_HERE',
  CALLBACK_URL: process.env.CALLBACK_URL || 'https://yourdomain.com/verify-payment.php',
  
  // Server Configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Security Configuration
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-key',
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret-key',
  
  // Database Configuration (if needed in future)
  DATABASE_URL: process.env.DATABASE_URL || null,
  
  // Email Configuration (if needed in future)
  SMTP_HOST: process.env.SMTP_HOST || null,
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER || null,
  SMTP_PASS: process.env.SMTP_PASS || null,
  
  // Validation
  validateConfig() {
    if (this.FIREBASE_API_KEY === 'YOUR_FIREBASE_API_KEY_HERE') {
      console.warn('⚠️  Warning: Using default Firebase API key. Please set FIREBASE_API_KEY environment variable.');
    }
    
    if (this.ZARINPAL_MERCHANT_ID === 'YOUR_ZARINPAL_MERCHANT_ID_HERE') {
      console.warn('⚠️  Warning: Using default ZarinPal merchant ID. Please set ZARINPAL_MERCHANT_ID environment variable.');
    }
    
    return true;
  }
}; 