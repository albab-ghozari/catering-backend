import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LOCK_PATH = path.join(__dirname, ".superadmin.lock");

async function main() {
  // 🔒 CEK LOCK FILE
  if (fs.existsSync(LOCK_PATH)) {
    console.error("❌ Super admin sudah dibuat (script terkunci)");
    process.exit(1);
  }

  // 🔍 CEK DI DATABASE
  const count = await prisma.users.count({
    where: { role: "superadmin" },
  });

  if (count > 0) {
    console.error("❌ Super admin sudah ada di database");
    process.exit(1);
  }

  const { SUPERADMIN_NAME, SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD } = process.env;

  if (!SUPERADMIN_NAME || !SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD) {
    console.error("❌ ENV super admin belum lengkap");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(SUPERADMIN_PASSWORD, 10);

  await prisma.users.create({
    data: {
      name: SUPERADMIN_NAME,
      email: SUPERADMIN_EMAIL,
      password: hashedPassword,
      role: "superadmin",
    },
  });

  // 🔐 KUNCI SCRIPT
  fs.writeFileSync(LOCK_PATH, "LOCKED");

  console.log("✅ Super admin berhasil dibuat & script dikunci");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
