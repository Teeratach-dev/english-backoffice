import dbConnect from "./src/lib/db";
import User from "./src/models/User";
import { hashPassword } from "./src/lib/auth";

async function seed() {
  try {
    await dbConnect();

    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env");
    }
    const name = "Super Admin";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Super Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await hashPassword(password);

    await User.create({
      email,
      password: hashedPassword,
      name,
      role: "superadmin",
    });

    console.log("Super Admin created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
