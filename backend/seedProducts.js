const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const products = [
  // =========================
  // MOBILES
  // =========================
  {
    name: "Samsung Galaxy M15 5G",
    description: "5G smartphone with powerful battery and bright display.",
    price: 14999,
    discount: 12,
    category: "Mobiles",
    brand: "Samsung",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.4,
    stock: 30
  },
  {
    name: "Redmi Note 14 5G",
    description: "Feature-packed 5G smartphone with high quality camera.",
    price: 17999,
    discount: 10,
    category: "Mobiles",
    brand: "Redmi",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.3,
    stock: 25
  },
  {
    name: "Realme Narzo 70 5G",
    description: "Fast performance smartphone with smooth display.",
    price: 13999,
    discount: 15,
    category: "Mobiles",
    brand: "Realme",
    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.2,
    stock: 22
  },
  {
    name: "Motorola G85 5G",
    description: "Stylish 5G smartphone with excellent performance.",
    price: 18999,
    discount: 8,
    category: "Mobiles",
    brand: "Motorola",
    images: [
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.4,
    stock: 18
  },
  {
    name: "POCO X6 5G",
    description: "Performance-focused smartphone for gaming and entertainment.",
    price: 19999,
    discount: 14,
    category: "Mobiles",
    brand: "POCO",
    images: [
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.5,
    stock: 20
  },

  // =========================
  // FASHION
  // =========================
  {
    name: "Men's Premium Cotton T-Shirt",
    description: "Comfortable regular fit cotton t-shirt.",
    price: 799,
    discount: 35,
    category: "Fashion",
    brand: "Roadster",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.3,
    stock: 50
  },
  {
    name: "Men's Slim Fit Jeans",
    description: "Classic slim fit denim jeans for everyday wear.",
    price: 1499,
    discount: 30,
    category: "Fashion",
    brand: "Levis",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.4,
    stock: 35
  },
  {
    name: "Casual Running Sneakers",
    description: "Lightweight sneakers suitable for daily use.",
    price: 1299,
    discount: 25,
    category: "Fashion",
    brand: "Puma",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.5,
    stock: 40
  },
  {
    name: "Classic Hooded Sweatshirt",
    description: "Warm and stylish hoodie for casual outings.",
    price: 1199,
    discount: 20,
    category: "Fashion",
    brand: "HRX",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.2,
    stock: 28
  },
  {
    name: "Women's Printed Kurti",
    description: "Comfortable printed kurti with modern design.",
    price: 999,
    discount: 30,
    category: "Fashion",
    brand: "Libas",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.4,
    stock: 32
  },

  // =========================
  // ELECTRONICS
  // =========================
  {
    name: "Sony Wireless Headphones",
    description: "Wireless headphones with immersive sound quality.",
    price: 2999,
    discount: 25,
    category: "Electronics",
    brand: "Sony",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.5,
    stock: 25
  },
  {
    name: "Boat Bluetooth Speaker",
    description: "Portable Bluetooth speaker with powerful bass.",
    price: 1999,
    discount: 10,
    category: "Electronics",
    brand: "Boat",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.2,
    stock: 15
  },
  {
    name: "JBL Wireless Earbuds",
    description: "True wireless earbuds with clear sound and deep bass.",
    price: 2499,
    discount: 20,
    category: "Electronics",
    brand: "JBL",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.4,
    stock: 30
  },
  {
    name: "Noise Smart Watch",
    description: "Smartwatch with fitness tracking and notifications.",
    price: 2499,
    discount: 35,
    category: "Electronics",
    brand: "Noise",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.3,
    stock: 35
  },
  {
    name: "Bluetooth Mechanical Keyboard",
    description: "Wireless mechanical keyboard for work and gaming.",
    price: 2999,
    discount: 18,
    category: "Electronics",
    brand: "Redragon",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.5,
    stock: 20
  },

  // =========================
  // HOME
  // =========================
  {
    name: "Premium Cotton Bedsheet",
    description: "Soft printed cotton bedsheet for bedroom.",
    price: 899,
    discount: 30,
    category: "Home",
    brand: "Wakefit",
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.3,
    stock: 40
  },
  {
    name: "Modern Table Lamp",
    description: "Elegant table lamp for bedroom and study room.",
    price: 699,
    discount: 20,
    category: "Home",
    brand: "Philips",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.2,
    stock: 25
  },
  {
    name: "Modern Wall Clock",
    description: "Stylish wall clock for living room decoration.",
    price: 599,
    discount: 25,
    category: "Home",
    brand: "Ajanta",
    images: [
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.1,
    stock: 30
  },
  {
    name: "Decorative Cushion Set",
    description: "Set of attractive cushions for sofa and bed.",
    price: 799,
    discount: 28,
    category: "Home",
    brand: "Home Centre",
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.3,
    stock: 22
  },
  {
    name: "Large Storage Organizer Box",
    description: "Durable storage box for home organization.",
    price: 499,
    discount: 15,
    category: "Home",
    brand: "Milton",
    images: [
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.0,
    stock: 45
  },

  // =========================
  // APPLIANCES
  // =========================
  {
    name: "43 Inch Smart LED TV",
    description: "Full HD smart LED television with streaming apps.",
    price: 29999,
    discount: 22,
    category: "Appliances",
    brand: "Samsung",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.5,
    stock: 12
  },
  {
    name: "750W Mixer Grinder",
    description: "Powerful mixer grinder for everyday kitchen use.",
    price: 2499,
    discount: 18,
    category: "Appliances",
    brand: "Bajaj",
    images: [
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.2,
    stock: 20
  },
  {
    name: "Ceiling Fan",
    description: "Energy efficient high speed ceiling fan.",
    price: 2299,
    discount: 15,
    category: "Appliances",
    brand: "Orient",
    images: [
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.1,
    stock: 18
  },
  {
    name: "Electric Steam Iron",
    description: "Fast heating steam iron with ceramic soleplate.",
    price: 999,
    discount: 25,
    category: "Appliances",
    brand: "Philips",
    images: [
      "https://images.unsplash.com/photo-1484712401471-05c7215830eb?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.3,
    stock: 30
  },
  {
    name: "Portable Room Heater",
    description: "Compact room heater for comfortable winters.",
    price: 1799,
    discount: 20,
    category: "Appliances",
    brand: "Usha",
    images: [
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.0,
    stock: 16
  },

  // =========================
  // BEAUTY
  // =========================
  {
    name: "Vitamin C Face Wash",
    description: "Refreshing face wash suitable for daily skincare.",
    price: 399,
    discount: 20,
    category: "Beauty",
    brand: "Garnier",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.3,
    stock: 50
  },
  {
    name: "Nourishing Shampoo",
    description: "Gentle shampoo for clean and healthy looking hair.",
    price: 499,
    discount: 15,
    category: "Beauty",
    brand: "L'Oreal",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.2,
    stock: 45
  },
  {
    name: "Hydrating Face Moisturizer",
    description: "Lightweight moisturizer for daily skincare.",
    price: 599,
    discount: 25,
    category: "Beauty",
    brand: "Nivea",
    images: [
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.4,
    stock: 40
  },
  {
    name: "Long Lasting Perfume",
    description: "Fresh and elegant fragrance for everyday use.",
    price: 899,
    discount: 30,
    category: "Beauty",
    brand: "Wild Stone",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.3,
    stock: 35
  },
  {
    name: "Hair Serum",
    description: "Smoothening hair serum for shiny looking hair.",
    price: 449,
    discount: 18,
    category: "Beauty",
    brand: "Streax",
    images: [
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.1,
    stock: 40
  },

  // =========================
  // GROCERY
  // =========================
  {
    name: "Premium Basmati Rice 5kg",
    description: "Long grain premium basmati rice.",
    price: 699,
    discount: 10,
    category: "Grocery",
    brand: "India Gate",
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.5,
    stock: 50
  },
  {
    name: "Whole Wheat Atta 5kg",
    description: "High quality whole wheat flour for everyday meals.",
    price: 299,
    discount: 8,
    category: "Grocery",
    brand: "Aashirvaad",
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.4,
    stock: 60
  },
  {
    name: "Refined Cooking Oil 1L",
    description: "Light and versatile cooking oil.",
    price: 149,
    discount: 5,
    category: "Grocery",
    brand: "Fortune",
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.2,
    stock: 80
  },
  {
    name: "Chocolate Cream Biscuits",
    description: "Crunchy biscuits with delicious cream filling.",
    price: 120,
    discount: 10,
    category: "Grocery",
    brand: "Oreo",
    images: [
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.5,
    stock: 100
  },
  {
    name: "Premium Tea 500g",
    description: "Refreshing tea blend for a perfect cup of tea.",
    price: 299,
    discount: 12,
    category: "Grocery",
    brand: "Tata",
    images: [
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.4,
    stock: 70
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    let added = 0;
    let updated = 0;

    for (const productData of products) {
      const existingProduct = await Product.findOne({
        name: productData.name
      });

      if (existingProduct) {
        await Product.findByIdAndUpdate(
          existingProduct._id,
          productData,
          {
            new: true,
            runValidators: true
          }
        );

        updated++;
      } else {
        await Product.create(productData);
        added++;
      }
    }

    console.log("");
    console.log("================================");
    console.log("PRODUCT SEEDING COMPLETED");
    console.log("================================");
    console.log(`Products added: ${added}`);
    console.log(`Products updated: ${updated}`);
    console.log(`Total seed products: ${products.length}`);
    console.log("================================");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Product seeding failed:");
    console.error(error.message);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedProducts();