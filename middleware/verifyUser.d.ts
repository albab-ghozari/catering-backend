import { Request, Response, NextFunction } from 'express';

interface JwtPayload {
  id: number;
  role: string;
  // Tambahkan properti lain dari token jika perlu
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const verifyUser = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'user') {
    res.status(403).json({ message: 'Akses hanya untuk user biasa' });
    return;
  }
  next();
};

export default verifyUser;
