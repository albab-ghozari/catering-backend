const { Menu } = require("../models")

exports.getAllMenu = async (req, res) => {
  try {
    const menu = await Menu.findAll();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addMenu = async (req, res) => {
  try {
    const { name, price, description, imageUrl } = req.body;
    const newMenu = await Menu.create({ name, price, description, imageUrl });
    res.status(201).json(newMenu);
  } catch (err) {
    console.error('Add menu error:', err);
    res.status(500).json({ message: 'Gagal menambah menu', error: err.message });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, imageUrl } = req.body;
    const menu = await Menu.findByPk(id);

    if (!menu) return res.status(404).json({ message: 'Menu tidak ditemukan' });

    menu.name = name;
    menu.price = price;
    menu.description = description;
    menu.imageUrl = imageUrl;

    await menu.save();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengupdate menu' });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findByPk(id);
    if (!menu) return res.status(404).json({ message: 'Menu tidak ditemukan' });

    await menu.destroy();
    res.json({ message: 'Menu berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus menu' });
  }
};
