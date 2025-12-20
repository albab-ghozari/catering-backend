import { Router } from "express";
import verifyToken  from "../middleware/verifyToken";
import verifySuperAdmin from "../middleware/verifySuperAdmin";
import { promoteToAdmin } from "../controllers/adminController";

const router = Router();

router.put(
  "/promote/:userId",
  verifyToken,
  verifySuperAdmin,
  promoteToAdmin
);

export default router;
