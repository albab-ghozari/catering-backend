const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.payOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) }
    });

    if (!order || order.userId !== userId) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Pesanan sudah dibayar atau diproses' });
    }

    // Simulasi proses pembayaran sukses
    const updatedOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status: 'paid' }
    });

    res.json({ message: 'Pembayaran berhasil', order: updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal melakukan pembayaran' });
  }
};
