import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient, Prisma } from "@prisma/client";
import nodemailer from "nodemailer";
import crypto from "crypto";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ message: "User tidak ditemukan" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ message: "Password salah" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Email sudah digunakan" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      } as Prisma.UsersUncheckedCreateInput,
    });

    res.status(201).json({
      message: "Registrasi berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

export const requestResetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  try {
    if (!email) {
      res.status(400).json({ message: "Email wajib diisi" });
      return;
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      // Jangan bocorkan apakah email ada atau tidak
      res.json({
        message: "Jika email terdaftar, link reset akan dikirim",
      });
      return;
    }

    // 1️⃣ Generate random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2️⃣ Hash token sebelum disimpan
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 3️⃣ Simpan ke database + expiry
    await prisma.users.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 jam
      },
    });

    // 4️⃣ Setup email transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // APP PASSWORD
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: "Reset Password",
      html: `
  <div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;padding:30px;">
    <div style="background:#ffffff;border-radius:8px;padding:30px;">
      
      <h2 style="color:#333;text-align:center;margin-bottom:10px;">
        Reset Password
      </h2>

      <p style="color:#555;font-size:14px;">
        Halo <strong>${user.name}</strong>,
      </p>

      <p style="color:#555;font-size:14px;line-height:1.6;">
        Kami menerima permintaan untuk mereset password akun Anda. 
        Silakan klik tombol di bawah ini untuk melanjutkan proses reset password.
      </p>

      <div style="text-align:center;margin:30px 0;">
        <a href="${resetLink}"
           style="
             background:#2563eb;
             color:#ffffff;
             padding:12px 24px;
             text-decoration:none;
             border-radius:6px;
             font-weight:bold;
             display:inline-block;
           ">
          Reset Password
        </a>
      </div>

      <p style="color:#555;font-size:13px;line-height:1.6;">
        Link ini berlaku selama <strong>1 jam</strong>.
        Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini.
      </p>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:25px 0;" />

      <p style="color:#888;font-size:12px;text-align:center;">
        Jika tombol tidak berfungsi, salin dan tempel link berikut ke browser Anda:
      </p>

      <p style="color:#2563eb;font-size:12px;text-align:center;word-break:break-all;">
        ${resetLink}
      </p>

    </div>

    <p style="color:#999;font-size:11px;text-align:center;margin-top:15px;">
      © ${new Date().getFullYear()} Your App. All rights reserved.
    </p>
  </div>
`,
    });

    res.json({
      message: "Jika email terdaftar, link reset akan dikirim",
    });
  } catch (error) {
    console.error("Request reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    // Extract email and newPassword from the request body
    const { email, newPassword } = req.body;

    // Find the user by email
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the newPassword
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await prisma.users.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
