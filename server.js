const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json()); // برای خواندن JSON از درخواست‌ها

const API_KEY = 'AIzaSyCSzCeCL_9jT_y9qqJhu8D5pZNpAyi0x0Q';

app.post('/login', async (req, res) => {
  const { email, password, isSignUp } = req.body;

  const url = isSignUp
    ? `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`
    : `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firebase Error:', data);
      return res.status(400).json({ error: data.error.message });
    }

    res.json({ token: data.idToken, email: data.email });
  } catch (error) {
    console.error('Error in /login:', error);
    res.status(500).json({ error: 'خطا در سرور واسط' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`سرور واسط روی http://localhost:${PORT} اجرا شد`);
});
