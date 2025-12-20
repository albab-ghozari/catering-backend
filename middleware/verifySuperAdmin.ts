import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./verifyToken"; // sesuaikan path

const verifySuperAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  // Pastikan token sudah diverifikasi
  if (!req.user) {
    res.status(401).json({ message: "Akses ditolak, belum login" });
    return;
  }

  // Cek role
  if (req.user.role !== "superadmin") {
    res
      .status(403)
      .json({ message: "Akses ditolak, hanya super admin" });
    return;
  }

  next();
};

export default verifySuperAdmin;
