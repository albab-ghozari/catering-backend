import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    // tambahkan properti lain jika ada, seperti name, role, dll
  };
}

export const payOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await prisma.orders.findUnique({
      where: { id: Number(orderId) }
    });

    if (!order || order.userId !== userId) {
      res.status(404).json({ message: 'Pesanan tidak ditemukan' });
      return;
    }

    if (order.status !== 'pending') {
      res.status(400).json({ message: 'Pesanan sudah dibayar atau diproses' });
      return;
    }

    // Simulasi proses pembayaran sukses
    const updatedOrder = await prisma.orders.update({
      where: { id: Number(orderId) },
      data: { status: 'paid' }
    });

    res.json({ message: 'Pembayaran berhasil', order: updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal melakukan pembayaran' });
  }
};
