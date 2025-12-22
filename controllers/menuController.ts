import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// GET semua menu
export const getAllMenu = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const menu = await prisma.menus.findMany();
    res.json(menu);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST tambah menu
export const addMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, description, imageUrl } = req.body;

    // 1️⃣ Validasi nama menu
    if (!name || name.trim() === "") {
      res.status(400).json({
        message: "Nama menu tidak boleh kosong",
      });
      return;
    }

    // 2️⃣ Validasi harga kosong
    if (price === undefined || price === null || price === "") {
      res.status(400).json({
        message: "Harga tidak boleh kosong",
      });
      return;
    }

    // 3️⃣ Validasi deskripsi
    if (!description || description.trim() === "") {
      res.status(400).json({
        message: "Deskripsi tidak boleh kosong",
      });
      return;
    }

    // 4️⃣ Validasi gambar
    if (!imageUrl || imageUrl.trim() === "") {
      res.status(400).json({
        message: "Gambar menu tidak boleh kosong",
      });
      return;
    }

    // 5️⃣ Validasi harga harus angka
    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      res.status(400).json({
        message: "Harga harus berupa angka",
      });
      return;
    }

    const newMenu = await prisma.menus.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        imageUrl,
      } as Prisma.MenusCreateInput,
    });

    res.status(201).json(newMenu);
  } catch (err: any) {
    console.error("Add menu error:", err);
    res
      .status(500)
      .json({ message: "Gagal menambah menu", error: err.message });
  }
};

// PUT update menu
export const updateMenu = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, price, description, imageUrl } = req.body;

    const existing = await prisma.menus.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      res.status(404).json({ message: "Menu tidak ditemukan" });
      return;
    }

    const updatedMenu = await prisma.menus.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: parseFloat(price),
        description,
        imageUrl,
      },
    });

    res.json(updatedMenu);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Gagal mengupdate menu", error: err.message });
  }
};

// DELETE menu
export const deleteMenu = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.menus.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      res.status(404).json({ message: "Menu tidak ditemukan" });
      return;
    }

    await prisma.menus.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Menu berhasil dihapus" });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Gagal menghapus menu", error: err.message });
  }
};
