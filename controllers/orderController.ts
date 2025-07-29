import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface OrderItemInput {
  menuId: number;
  quantity: number;
}

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

// CREATE ORDER
export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { items, eventDate, notes }: { items: OrderItemInput[]; eventDate: string; notes?: string } = req.body;
    const userId = req.user?.id;

    if (!eventDate || !Array.isArray(items) || items.length === 0 || !userId) {
      res.status(400).json({ message: "Data tidak lengkap" });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const event = new Date(eventDate);
    event.setHours(0, 0, 0, 0);

    if (event < today) {
      res.status(400).json({ message: "Tanggal tidak boleh di masa lalu" });
      return;
    }

    let totalPrice = 0;
    const orderItems: Prisma.OrderItemsCreateManyOrdersInput[] = [];

    for (const item of items) {
      const menu = await prisma.menus.findUnique({ where: { id: item.menuId } });

      if (!menu) {
        res.status(404).json({ message: "Menu tidak ditemukan: " + item.menuId });
        return;
      }

      const subTotal = menu.price * item.quantity;
      totalPrice += subTotal;

      orderItems.push({
        menuId: item.menuId,
        quantity: item.quantity,
        subTotal,
      });
    }

    const now = new Date();
    const order = await prisma.orders.create({
      data: {
        userId,
        eventDate: new Date(eventDate),
        notes,
        totalPrice,
        createdAt: now,
        updatedAt: now,
        OrderItems: {
          create: orderItems,
        },
      },
    });

    res.status(201).json({ message: "Pesanan berhasil dibuat", orderId: order.id });
  } catch (err: any) {
    console.error("Order Error:", err);
    res.status(500).json({ message: "Gagal membuat pesanan", error: err.message });
  }
};

// GET My Orders
export const getMyOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Tidak terautentikasi" });
      return;
    }

    const orders = await prisma.orders.findMany({
      where: { userId },
      include: {
        OrderItems: {
          include: {
            Menus: {
              select: { name: true, price: true, imageUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Gagal mengambil pesanan:", error);
    res.status(500).json({ message: "Gagal mengambil pesanan" });
  }
};

// GET All Orders (Admin)
export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await prisma.orders.findMany({
      include: {
        Users: {
          select: { id: true, name: true, email: true },
        },
        OrderItems: {
          include: {
            Menus: {
              select: { name: true, price: true, imageUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Gagal mengambil semua order:", error);
    res.status(500).json({ message: "Gagal mengambil semua order" });
  }
};
