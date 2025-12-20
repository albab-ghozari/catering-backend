import { Router } from "express";
import verifyToken  from "../middleware/verifyToken";
import verifyAdmin from "../middleware/verifyAdmin";
import { promoteToAdmin } from "../controllers/adminController";

const router = Router();

router.put(
  "/promote/:userId",
  verifyToken,
  verifyAdmin,
  promoteToAdmin
);

export default router;
