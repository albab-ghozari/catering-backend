//template .env
// DATABASE_URL=
// JWT_SECRET=

// SUPERADMIN_NAME=
// SUPERADMIN_EMAIL=
// SUPERADMIN_PASSWORD=

// EMAIL_USERNAME=
// EMAIL_PASSWORD=

// FRONTEND_URL=http://localhost:5173


//template script to create super admin
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    const email = process.env.SUPER_ADMIN_EMAIL!;
    const password = process.env.SUPER_ADMIN_PASSWORD!;
    const name = process.env.SUPER_ADMIN_NAME || "Super Admin";

    if (!email || !password) {
      console.error("❌ ENV super admin belum lengkap");
      process.exit(1);
    }

    // Cek apakah super admin sudah ada
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("❌ Super admin sudah dibuat");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create super admin
    await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("✅ Super admin berhasil dibuat");
  } catch (error) {
    console.error("❌ Gagal membuat super admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
