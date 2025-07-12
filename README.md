# کار اول (Kar Aval) - فروشگاه آنلاین

یک فروشگاه آنلاین کامل با پنل مدیریت، سیستم پرداخت و رابط کاربری مدرن.

## 🚀 ویژگی‌ها

- **پنل مدیریت پیشرفته**: مدیریت محصولات، تصاویر اسلایدر و سفارشات
- **سیستم احراز هویت**: ورود و ثبت نام امن
- **سبد خرید هوشمند**: مدیریت محصولات و محاسبه خودکار قیمت
- **درگاه پرداخت**: اتصال به زرین‌پال
- **طراحی واکنش‌گرا**: سازگار با تمام دستگاه‌ها
- **امنیت بالا**: محافظت در برابر حملات رایج

## 📁 ساختار پروژه

```
kar-aval/
├── index.html                 # صفحه اصلی (redirect)
├── login.html                 # صفحه ورود/ثبت نام
├── kar-aval.html             # صفحه اصلی فروشگاه
├── admin.html                # پنل مدیریت
├── cart.html                 # سبد خرید
├── checkout.html             # صفحه پرداخت
├── profile.html              # پروفایل کاربر
├── 404.html                  # صفحه خطا
├── server.js                 # سرور اصلی
├── config.js                 # تنظیمات
├── package.json              # وابستگی‌های Node.js
├── firebase.json             # تنظیمات Firebase
├── firebase-proxy/           # سرور واسط Firebase
│   ├── server.js
│   ├── create-payment.php    # ایجاد تراکنش پرداخت
│   ├── verify-payment.php    # تایید پرداخت
│   └── package.json
└── assets/                   # فایل‌های استاتیک
    ├── images/
    └── css/
```

## 🛠️ نصب و راه‌اندازی

### پیش‌نیازها

- Node.js (نسخه ۱۴ یا بالاتر)
- PHP (نسخه ۷.۴ یا بالاتر)
- cURL extension برای PHP

### مراحل نصب

1. **کلون کردن پروژه**
   ```bash
   git clone https://github.com/your-username/kar-aval.git
   cd kar-aval
   ```

2. **نصب وابستگی‌های Node.js**
```bash
npm install
   cd firebase-proxy
   npm install
   cd ..
```

3. **تنظیم متغیرهای محیطی**

   فایل `.env` را در ریشه پروژه ایجاد کنید:
```env
   FIREBASE_API_KEY=your_firebase_api_key
   ZARINPAL_MERCHANT_ID=your_zarinpal_merchant_id
CALLBACK_URL=https://yourdomain.com/verify-payment.php
   NODE_ENV=development
```

4. **راه‌اندازی سرورها**

   در ترمینال اول:
```bash
npm start
```

   در ترمینال دوم:
   ```bash
   cd firebase-proxy
   npm start
   ```

5. **دسترسی به برنامه**
   - فروشگاه: http://localhost:3000
   - پنل مدیریت: http://localhost:3000/admin.html
   - سرور واسط: http://localhost:3001

## 🔧 تنظیمات

### Firebase
1. پروژه Firebase جدید ایجاد کنید
2. Authentication را فعال کنید
3. API Key را در متغیر محیطی `FIREBASE_API_KEY` قرار دهید

### زرین‌پال
1. حساب کاربری زرین‌پال ایجاد کنید
2. Merchant ID را در متغیر محیطی `ZARINPAL_MERCHANT_ID` قرار دهید
3. Callback URL را تنظیم کنید

## 👥 حساب‌های کاربری پیش‌فرض

### مدیر سیستم
- **ایمیل**: admin@karaval.com
- **رمز عبور**: admin123

### کاربر عادی
- **ایمیل**: user@karaval.com
- **رمز عبور**: user123

## 🔒 امنیت

- **احراز هویت**: سیستم ورود امن با Firebase
- **اعتبارسنجی ورودی**: بررسی تمام ورودی‌های کاربر
- **محافظت XSS**: فیلتر کردن محتوای خطرناک
- **HTTPS**: استفاده از پروتکل امن در تولید
- **Rate Limiting**: محدودیت درخواست‌ها

## 📱 ویژگی‌های موبایل

- طراحی واکنش‌گرا
- منوی همبرگری برای موبایل
- بهینه‌سازی برای صفحات لمسی
- عملکرد سریع در شبکه‌های کند

## 🛍️ ویژگی‌های فروشگاه

- **نمایش محصولات**: کارت‌های زیبا با انیمیشن
- **جستجو**: جستجوی زنده در محصولات
- **سبد خرید**: مدیریت آسان محصولات
- **پرداخت**: اتصال مستقیم به زرین‌پال
- **تاریخچه سفارشات**: مشاهده سفارشات قبلی

## 🎛️ ویژگی‌های پنل مدیریت

- **مدیریت محصولات**: افزودن، ویرایش و حذف
- **مدیریت تصاویر**: آپلود و مدیریت تصاویر اسلایدر
- **مشاهده سفارشات**: لیست تمام سفارشات
- **آمار فروش**: گزارش‌گیری از فروش

## 🚀 استقرار

### Heroku
```bash
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set FIREBASE_API_KEY=your_key
heroku config:set ZARINPAL_MERCHANT_ID=your_id
git push heroku main
```

### Vercel
```bash
npm install -g vercel
vercel
```

## 🐛 عیب‌یابی

### مشکلات رایج

1. **خطای اتصال به Firebase**
   - بررسی صحت API Key
   - اطمینان از فعال بودن Authentication

2. **خطای پرداخت**
   - بررسی صحت Merchant ID
   - اطمینان از صحت Callback URL

3. **خطای سرور**
   - بررسی لاگ‌های سرور
   - اطمینان از نصب تمام وابستگی‌ها

## 📝 مجوز

این پروژه تحت مجوز MIT منتشر شده است.

## 🤝 مشارکت

برای مشارکت در پروژه:

1. Fork کنید
2. Branch جدید ایجاد کنید (`git checkout -b feature/amazing-feature`)
3. تغییرات را commit کنید (`git commit -m 'Add amazing feature'`)
4. Push کنید (`git push origin feature/amazing-feature`)
5. Pull Request ایجاد کنید

## 📞 پشتیبانی

برای گزارش مشکلات یا درخواست ویژگی‌های جدید، لطفاً Issue ایجاد کنید.

---

**توسعه‌دهنده**: تیم کار اول  
**نسخه**: 1.0.0  
**آخرین بروزرسانی**: ۲۰۲۴

