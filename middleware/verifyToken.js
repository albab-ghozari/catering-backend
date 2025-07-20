// middleware/verifyToken.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token
  if (!token) return res.status(401).json({ message: "Akses ditolak, token tidak ada" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // simpan payload token di req.user
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token tidak valid" });
  }
};
