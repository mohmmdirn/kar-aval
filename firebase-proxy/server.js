const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const helmet = require('helmet');
const config = require('../config');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const API_KEY = config.FIREBASE_API_KEY;

// Input validation middleware
const validateLoginInput = (req, res, next) => {
  const { email, password, isSignUp } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'ایمیل و رمز عبور الزامی است' });
  }
  
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'نوع داده نامعتبر' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'رمز عبور باید حداقل ۶ کاراکتر باشد' });
  }
  
  if (typeof isSignUp !== 'boolean') {
    req.body.isSignUp = false;
  }
  
  next();
};

app.post('/login', validateLoginInput, async (req, res) => {
  const { email, password, isSignUp } = req.body;

  const url = isSignUp
    ? `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`
    : `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Kar-Aval-Firebase-Proxy/1.0'
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
        returnSecureToken: true
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firebase Error:', data);
      const errorMessage = data.error?.message || 'خطا در احراز هویت';
      return res.status(400).json({ error: errorMessage });
    }

    res.json({ 
      token: data.idToken, 
      email: data.email,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn
    });
  } catch (error) {
    console.error('Error in /login:', error);
    res.status(500).json({ error: 'خطا در سرور واسط' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Firebase Proxy Error:', err);
  res.status(500).json({ error: 'خطای داخلی سرور' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'صفحه مورد نظر یافت نشد' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Firebase Proxy سرور روی http://localhost:${PORT} اجرا شد`);
  console.log(`محیط: ${process.env.NODE_ENV || 'development'}`);
});
