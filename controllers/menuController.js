const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET semua menu
exports.getAllMenu = async (req, res) => {
  try {
    const menu = await prisma.menus.findMany();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST tambah menu
exports.addMenu = async (req, res) => {
  try {
    const { name, price, description, imageUrl } = req.body;

    const newMenu = await prisma.menus.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        imageUrl
      }
    });

    res.status(201).json(newMenu);
  } catch (err) {
    console.error('Add menu error:', err);
    res.status(500).json({ message: 'Gagal menambah menu', error: err.message });
  }
};

// PUT update menu
exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, imageUrl } = req.body;

    const existing = await prisma.menus.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) return res.status(404).json({ message: 'Menu tidak ditemukan' });

    const updatedMenu = await prisma.menus.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: parseFloat(price),
        description,
        imageUrl
      }
    });

    res.json(updatedMenu);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengupdate menu', error: err.message });
  }
};

// DELETE menu
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.menus.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) return res.status(404).json({ message: 'Menu tidak ditemukan' });

    await prisma.menus.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Menu berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus menu', error: err.message });
  }
};
