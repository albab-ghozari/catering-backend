// middleware/verifyUser.js
module.exports = function (req, res, next) {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Akses hanya untuk user biasa" });
  }
  next();
};
