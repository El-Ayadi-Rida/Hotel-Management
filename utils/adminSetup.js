const { User } = require("../models");

// Function to create a default admin user if none exists
const createAdminIfNotExists = async () => {
  try {
    const existingAdmin = await User.findOne({ where: { role: "admin" } });

    if (!existingAdmin) {
      await User.create({
        username: "admin",
        email: "admin@hotel.com",
        password: 'admin123',
        role: "admin",
      });
      console.log("✅ Default Admin Created: admin@hotel.com / admin123");
    } else {
      console.log("✅ Admin already exists. No action needed.");
    }
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  }
};

module.exports = createAdminIfNotExists;
