const db = require("../models");
const { Order, OrderItem, Menu } = db;

exports.createOrder = async (req, res) => {
  try {
    const { items, eventDate, notes } = req.body;
    const userId = req.user.id;

    if (!eventDate || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const menu = await Menu.findByPk(item.menuId);
      if (!menu)
        return res
          .status(404)
          .json({ message: "Menu tidak ditemukan: " + item.menuId });

      const subTotal = menu.price * item.quantity;
      totalPrice += subTotal;

      orderItems.push({
        menuId: item.menuId,
        quantity: item.quantity,
        subTotal,
      });
    }

    const order = await Order.create({ userId, eventDate, notes, totalPrice });

    for (const item of orderItems) {
      await OrderItem.create({ ...item, orderId: order.id });
    }

    res
      .status(201)
      .json({ message: "Pesanan berhasil dibuat", orderId: order.id });
  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).json({ message: "Gagal membuat pesanan" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Menu,
              attributes: ["name", "price", "imageUrl"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Gagal mengambil pesanan:", error);
    res.status(500).json({ message: "Gagal mengambil pesanan" });
  }
};
