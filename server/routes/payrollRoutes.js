import express from "express";
import { protect } from "../middleware/authMiddleware.js"; 
import { authorize } from "../middleware/roleMiddleware.js";
import { 
  getPayrollStatus, 
  setupEmployeePayroll, 
  getMyPayslips, 
  generateMonthlyPayroll,
  seedMissingPayrollData
} from "../controllers/payrollController.js";

const router = express.Router();

// Admin Routes
router.get("/status", protect, authorize("admin"), getPayrollStatus);
router.put("/setup/:id", protect, authorize("admin"), setupEmployeePayroll);
router.post("/generate", protect, authorize("admin"), generateMonthlyPayroll);

// Add this temporarily
// router.post("/seed-old-users", protect, authorize("admin"), seedMissingPayrollData);

// Employee Routes
router.get("/my-payslips", protect, getMyPayslips);

export default router;