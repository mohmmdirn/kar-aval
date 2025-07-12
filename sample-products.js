// نمونه محصولات برای نمایش قابلیت‌های جدید
// این فایل را در کنسول مرورگر اجرا کنید تا محصولات نمونه اضافه شوند

const sampleProducts = [
  {
    id: 1,
    name: "لپ‌تاپ اپل مک‌بوک پرو",
    price: 85000000,
    discount: 15,
    stock: 5,
    rating: 4.8,
    category: "الکترونیک",
    image: "https://via.placeholder.com/300x200/007AFF/FFFFFF?text=MacBook+Pro",
    description: "لپ‌تاپ حرفه‌ای اپل با پردازنده M2 و 16 گیگابایت رم",
    isNew: true,
    isPopular: true
  },
  {
    id: 2,
    name: "گوشی سامسونگ گلکسی S24",
    price: 45000000,
    discount: 10,
    stock: 12,
    rating: 4.6,
    category: "الکترونیک",
    image: "https://via.placeholder.com/300x200/1428A0/FFFFFF?text=Galaxy+S24",
    description: "گوشی هوشمند سامسونگ با دوربین 200 مگاپیکسل",
    isNew: true,
    isPopular: false
  },
  {
    id: 3,
    name: "کتاب رمان صد سال تنهایی",
    price: 850000,
    discount: 0,
    stock: 25,
    rating: 4.9,
    category: "کتاب",
    image: "https://via.placeholder.com/300x200/8B4513/FFFFFF?text=کتاب+رمان",
    description: "رمان مشهور گابریل گارسیا مارکز",
    isNew: false,
    isPopular: true
  },
  {
    id: 4,
    name: "کفش ورزشی نایک",
    price: 2800000,
    discount: 20,
    stock: 8,
    rating: 4.4,
    category: "ورزشی",
    image: "https://via.placeholder.com/300x200/FF6B35/FFFFFF?text=Nike+Shoes",
    description: "کفش ورزشی نایک برای دویدن و تمرین",
    isNew: false,
    isPopular: true
  },
  {
    id: 5,
    name: "ساعت هوشمند اپل واچ",
    price: 18000000,
    discount: 5,
    stock: 3,
    rating: 4.7,
    category: "الکترونیک",
    image: "https://via.placeholder.com/300x200/000000/FFFFFF?text=Apple+Watch",
    description: "ساعت هوشمند اپل با قابلیت‌های سلامتی",
    isNew: true,
    isPopular: false
  },
  {
    id: 6,
    name: "پنل خورشیدی خانگی",
    price: 35000000,
    discount: 0,
    stock: 0,
    rating: 4.5,
    category: "خانگی",
    image: "https://via.placeholder.com/300x200/FFD700/000000?text=Solar+Panel",
    description: "پنل خورشیدی برای تولید انرژی پاک",
    isNew: false,
    isPopular: false
  },
  {
    id: 7,
    name: "هدفون سونی WH-1000XM4",
    price: 12000000,
    discount: 12,
    stock: 15,
    rating: 4.8,
    category: "الکترونیک",
    image: "https://via.placeholder.com/300x200/000000/FFFFFF?text=Sony+Headphones",
    description: "هدفون بی‌سیم با نویز کنسلینگ",
    isNew: false,
    isPopular: true
  },
  {
    id: 8,
    name: "کتاب آشپزی ایرانی",
    price: 650000,
    discount: 8,
    stock: 30,
    rating: 4.3,
    category: "کتاب",
    image: "https://via.placeholder.com/300x200/FF4500/FFFFFF?text=کتاب+آشپزی",
    description: "مجموعه کامل دستورات آشپزی ایرانی",
    isNew: false,
    isPopular: false
  }
];

// تابع برای اضافه کردن محصولات نمونه
function addSampleProducts() {
  const existingProducts = JSON.parse(localStorage.getItem('products')) || [];
  
  // بررسی اینکه آیا محصولات نمونه قبلاً اضافه شده‌اند
  if (existingProducts.length > 0) {
    const hasSampleProducts = existingProducts.some(product => 
      sampleProducts.some(sample => sample.name === product.name)
    );
    
    if (hasSampleProducts) {
      alert('محصولات نمونه قبلاً اضافه شده‌اند!');
      return;
    }
  }
  
  // اضافه کردن محصولات نمونه
  const allProducts = [...existingProducts, ...sampleProducts];
  localStorage.setItem('products', JSON.stringify(allProducts));
  
  alert(`${sampleProducts.length} محصول نمونه با موفقیت اضافه شد!`);
  
  // بروزرسانی صفحه اگر در پنل ادمین هستیم
  if (window.location.pathname.includes('admin.html')) {
    location.reload();
  }
}

// تابع برای پاک کردن تمام محصولات
function clearAllProducts() {
  if (confirm('آیا از حذف تمام محصولات اطمینان دارید؟')) {
    localStorage.removeItem('products');
    alert('تمام محصولات حذف شدند!');
    
    if (window.location.pathname.includes('admin.html')) {
      location.reload();
    }
  }
}

// تابع برای نمایش اطلاعات محصولات
function showProductsInfo() {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  
  console.log('=== اطلاعات محصولات ===');
  console.log(`تعداد کل محصولات: ${products.length}`);
  
  const categories = {};
  const withDiscount = products.filter(p => p.discount > 0).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const newProducts = products.filter(p => p.isNew).length;
  const popularProducts = products.filter(p => p.isPopular).length;
  
  products.forEach(product => {
    if (categories[product.category]) {
      categories[product.category]++;
    } else {
      categories[product.category] = 1;
    }
  });
  
  console.log(`محصولات با تخفیف: ${withDiscount}`);
  console.log(`محصولات ناموجود: ${outOfStock}`);
  console.log(`محصولات جدید: ${newProducts}`);
  console.log(`محصولات محبوب: ${popularProducts}`);
  console.log('دسته‌بندی‌ها:', categories);
  
  return {
    total: products.length,
    withDiscount,
    outOfStock,
    newProducts,
    popularProducts,
    categories
  };
}

// اضافه کردن توابع به window برای دسترسی از کنسول
window.addSampleProducts = addSampleProducts;
window.clearAllProducts = clearAllProducts;
window.showProductsInfo = showProductsInfo;

console.log(`
=== راهنمای استفاده ===
برای اضافه کردن محصولات نمونه: addSampleProducts()
برای پاک کردن تمام محصولات: clearAllProducts()
برای نمایش اطلاعات محصولات: showProductsInfo()

محصولات نمونه شامل:
- محصولات با تخفیف
- محصولات جدید و محبوب
- محصولات ناموجود
- امتیازدهی
- دسته‌بندی‌های مختلف
`); 