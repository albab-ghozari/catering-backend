const db = require('../models');
const { Order } = db;

exports.payOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await Order.findByPk(orderId);
        if (!order || order.userId !== userId)
            return res.status(404).json({ message: 'Pesanan tidak ditemukan' });

        if (order.status !== 'pending')
            return res.status(400).json({ message: 'Pesanan sudah dibayar atau diproses' });

        // Simulasi proses pembayaran sukses
        order.status = 'paid';
        await order.save();

        res.json({ message: 'Pembayaran berhasil', order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal melakukan pembayaran' });
    }
};
