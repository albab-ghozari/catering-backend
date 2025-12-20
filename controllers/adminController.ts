import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const promoteToAdmin = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.users.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "User sudah admin" });
    }

    await prisma.users.update({
      where: { id: Number(userId) },
      data: { role: "admin" },
    });

    res.json({ message: "User berhasil dijadikan admin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
