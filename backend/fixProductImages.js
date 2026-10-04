const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const fixImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    const samsungImage =
      "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?auto=format&fit=crop&w=800&q=80";

    const iphoneImage =
      "https://images.unsplash.com/photo-1535432427690-545ed8124869?auto=format&fit=crop&w=800&q=80";

    const samsung = await Product.findOneAndUpdate(
      {
        name: "Samsung Galaxy M15"
      },
      {
        $set: {
          images: [samsungImage]
        }
      },
      {
        new: true
      }
    );

    const iphone = await Product.findOneAndUpdate(
      {
        name: "iPhone 15"
      },
      {
        $set: {
          images: [iphoneImage]
        }
      },
      {
        new: true
      }
    );

    console.log("");

    if (samsung) {
      console.log("Samsung Galaxy M15 image updated.");
    } else {
      console.log("Samsung Galaxy M15 not found.");
    }

    if (iphone) {
      console.log("iPhone 15 image updated.");
    } else {
      console.log("iPhone 15 not found.");
    }

    console.log("");
    console.log("IMAGE FIX COMPLETED.");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Image fix failed:");
    console.error(error.message);

    await mongoose.connection.close();

    process.exit(1);
  }
};

fixImages();