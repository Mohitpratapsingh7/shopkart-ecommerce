const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log(
        "ADMIN_EMAIL and ADMIN_PASSWORD are required in .env"
      );
      process.exit(1);
    }

    if (adminPassword.length < 6) {
      console.log(
        "ADMIN_PASSWORD must be at least 6 characters"
      );
      process.exit(1);
    }

    const existingUser = await User.findOne({
      email: adminEmail.toLowerCase()
    });

    const hashedPassword = await bcrypt.hash(
      adminPassword,
      10
    );

    if (existingUser) {
      existingUser.password = hashedPassword;
      existingUser.role = "admin";

      await existingUser.save();

      console.log("Existing user converted to admin successfully.");
    } else {
      const adminUser = await User.create({
        name: "Admin",
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        role: "admin"
      });

      console.log(
        `Admin created successfully: ${adminUser.email}`
      );
    }

    await mongoose.connection.close();

    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin");
    console.error(error.message);

    await mongoose.connection.close();

    process.exit(1);
  }
};

createAdmin();