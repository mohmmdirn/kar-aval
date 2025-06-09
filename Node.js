const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// دیتای محصولات نمونه (تو حافظه)
const products = [
  { id: 1, name: "کلاه", price: 250000, image: "کلاه.webp", description: "طراحی مدرن و سبک، مناسب تمام فصول." },
  { id: 2, name: "تیشرت", price: 250000, image: "تیشرت.webp", description: "تیشرتی راحت و خوش‌دوخت با رنگ‌بندی متنوع." },
  { id: 3, name: "شلوار", price: 250000, image: "شلوار.webp", description: "شلواری با کیفیت بالا و دوخت عالی." }
];

// سبد خرید (تو حافظه) - فقط برای دمو
let cart = [];

// API برای گرفتن لیست محصولات
app.get('/api/products', (req, res) => {
  res.json(products);
});

// API برای گرفتن سبد خرید
app.get('/api/cart', (req, res) => {
  res.json(cart);
});

// API برای اضافه کردن به سبد خرید
app.post('/api/cart', (req, res) => {
  const { productId } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: "محصول یافت نشد" });

  const cartItem = cart.find(item => item.product.id === productId);
  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ product, quantity: 1 });
  }
  res.json(cart);
});

// API برای حذف محصول از سبد خرید (اختیاری)
app.delete('/api/cart/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  cart = cart.filter(item => item.product.id !== productId);
  res.json(cart);
});

// سرور رو اجرا کن
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
