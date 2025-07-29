import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
    // Tambahkan properti lain jika diperlukan
  };
}

const verifyAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Akses hanya untuk admin' });
    return;
  }
  next();
};

export default verifyAdmin;
