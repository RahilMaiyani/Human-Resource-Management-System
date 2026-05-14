import mongoose from "mongoose";

const payslipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: String, required: true }, // e.g., "May"
  year: { type: Number, required: true },  // e.g., 2026
  
  earnings: {
    basicPay: Number,
    specialAllowance: Number
  },
  deductions: {
    lossOfPay: Number,
    professionalTax: { type: Number, default: 200 }
  },
  
  netPay: { type: Number, required: true },
  isSent: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Payslip", payslipSchema);