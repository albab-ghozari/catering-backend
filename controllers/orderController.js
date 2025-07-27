const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { items, eventDate, notes } = req.body;
    const userId = req.user.id;

    if (!eventDate || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const event = new Date(eventDate);
    event.setHours(0, 0, 0, 0);

    if (event < today) {
      return res.status(400).json({ message: "Tanggal tidak boleh di masa lalu" });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const menu = await prisma.menu.findUnique({ where: { id: item.menuId } });

      if (!menu) {
        return res.status(404).json({ message: "Menu tidak ditemukan: " + item.menuId });
      }

      const subTotal = menu.price * item.quantity;
      totalPrice += subTotal;

      orderItems.push({
        menuId: item.menuId,
        quantity: item.quantity,
        subTotal,
      });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        eventDate: new Date(eventDate),
        notes,
        totalPrice,
        items: {
          create: orderItems
        }
      }
    });

    res.status(201).json({ message: "Pesanan berhasil dibuat", orderId: order.id });
  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).json({ message: "Gagal membuat pesanan", error: err.message });
  }
};

// GET My Orders
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            menu: {
              select: { name: true, price: true, imageUrl: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Gagal mengambil pesanan:", error);
    res.status(500).json({ message: "Gagal mengambil pesanan" });
  }
};

// GET All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        items: {
          include: {
            menu: {
              select: { name: true, price: true, imageUrl: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Gagal mengambil semua order:", error);
    res.status(500).json({ message: "Gagal mengambil semua order" });
  }
};
