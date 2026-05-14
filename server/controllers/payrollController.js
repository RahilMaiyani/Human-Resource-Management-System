import User from "../models/User.js";
import Payslip from "../models/Payslip.js";
import Leave from "../models/Leave.js";
import { encryptData, decryptData } from "../utils/crypto.js"; 
import { sendEmail } from "../utils/sendEmail.js";
import { buildEmailTemplate } from "../utils/emailTemplate.js";
import PDFDocument from "pdfkit";

const generatePDFBuffer = (user, payslip, rawAccount) => {
  return new Promise((resolve) => {
    // PASSWORD LOGIC: Strip spaces, lowercase, pad short names with 'x'
    const cleanName = user.name.replace(/\s+/g, '').toLowerCase().padEnd(4, 'x');
    const namePart = cleanName.substring(0, 4);
    const accPart = rawAccount.slice(-4);
    const userPassword = `${namePart}${accPart}`;

    const doc = new PDFDocument({
      userPassword,
      ownerPassword: process.env.ADMIN_PDF_PASSWORD || "admin-master-key",
      permissions: { printing: 'highres', modifying: false },
      size: 'A4',
      margin: 50
    });

    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    
    // 1. Top Header Bar
    doc.rect(0, 0, 600, 100).fill('#f8fafc');
    doc.fillColor('#4f46e5').font('Helvetica-Bold').fontSize(24).text('OfficeLink', 50, 35);
    doc.fillColor('#64748b').font('Helvetica').fontSize(10).text('SECURE SALARY STATEMENT', 50, 65);
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(14).text(`${payslip.month} ${payslip.year}`, 350, 45, { align: 'right', width: 200 });

    doc.moveDown(4);

    // 2. Employee Details Box
    doc.rect(50, 120, 495, 70).fill('#ffffff').stroke('#e2e8f0');
    doc.fillColor('#64748b').font('Helvetica-Bold').fontSize(9);
    doc.text('EMPLOYEE NAME', 70, 135).text('DEPARTMENT', 250, 135).text('BANK ACCOUNT', 400, 135);
    
    doc.fillColor('#0f172a').font('Helvetica').fontSize(11);
    doc.text(user.name, 70, 155).text(user.department || 'Corporate', 250, 155).text(`•••• •••• ${accPart}`, 400, 155);

    // 3. The Table Header
    let y = 220;
    doc.rect(50, y, 495, 30).fill('#4f46e5');
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10);
    doc.text('DESCRIPTION', 70, y + 10);
    doc.text('EARNINGS', 300, y + 10, { width: 100, align: 'right' });
    doc.text('DEDUCTIONS', 430, y + 10, { width: 100, align: 'right' });

    // 4. Table Rows (Earnings & Deductions)
    y += 40;
    doc.fillColor('#0f172a').font('Helvetica').fontSize(11);
    
    // Row 1: Basic
    doc.text('Basic Pay', 70, y);
    doc.text(`₹ ${payslip.earnings.basicPay.toLocaleString('en-IN')}`, 300, y, { width: 100, align: 'right' });
    doc.text('-', 430, y, { width: 100, align: 'right' });
    
    // Row 2: Special
    y += 25;
    doc.text('Special Allowance', 70, y);
    doc.text(`₹ ${payslip.earnings.specialAllowance.toLocaleString('en-IN')}`, 300, y, { width: 100, align: 'right' });
    doc.text('-', 430, y, { width: 100, align: 'right' });

    // Row 3: LOP (Deduction)
    y += 25;
    doc.fillColor('#e11d48');
    doc.text('Loss of Pay (Leave)', 70, y);
    doc.text('-', 300, y, { width: 100, align: 'right' });
    doc.text(`₹ ${payslip.deductions.lossOfPay.toLocaleString('en-IN')}`, 430, y, { width: 100, align: 'right' });

    // Row 4: Professional Tax
    y += 25;
    doc.text('Professional Tax', 70, y);
    doc.text('-', 300, y, { width: 100, align: 'right' });
    doc.text(`₹ ${payslip.deductions.professionalTax.toLocaleString('en-IN')}`, 430, y, { width: 100, align: 'right' });

    // Line Divider
    y += 30;
    doc.moveTo(50, y).lineTo(545, y).lineWidth(1).stroke('#e2e8f0');

    // 5. Total Block
    y += 15;
    doc.rect(350, y, 195, 40).fill('#f0fdf4').stroke('#dcfce7');
    doc.fillColor('#166534').font('Helvetica-Bold').fontSize(12);
    doc.text('NET PAY:', 370, y + 14);
    doc.fontSize(14).text(`₹ ${payslip.netPay.toLocaleString('en-IN')}`, 400, y + 13, { width: 125, align: 'right' });

    // 6. Footer Note
    doc.fillColor('#94a3b8').font('Helvetica').fontSize(9);
    doc.text('This is a computer-generated document and requires no signature.', 50, 750, { align: 'center', width: 495 });

    doc.end();
  });
};

// 1. Get Status (Smart Trigger for Admin)
export const getPayrollStatus = async (req, res) => {
  try {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const targetMonthName = lastMonth.toLocaleString('default', { month: 'long' });
    
    const existingRun = await Payslip.findOne({ month: targetMonthName, year: lastMonth.getFullYear() });

    res.status(200).json({
      targetMonth: targetMonthName,
      targetYear: lastMonth.getFullYear(),
      status: existingRun ? "COMPLETED" : "PENDING",
      actionRequired: !existingRun && today.getDate() >= 1 
    });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching payroll status" });
  }
};


// 2. Setup Salary & Encrypt Bank Details
export const setupEmployeePayroll = async (req, res) => {
  try {
    const { basicPay, specialAllowance, accountNumber, ifscCode, bankName } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.salaryDetails = { basicPay, specialAllowance };
    
    if (accountNumber) {
      user.bankDetails = {
        accountNumber: encryptData(accountNumber),
        ifscCode,
        bankName
      };
    }

    await user.save();
    res.status(200).json({ msg: "Payroll setup successful" });
  } catch (error) {
    res.status(500).json({ msg: "Error setting up payroll" });
  }
};


// 3. Employee View
export const getMyPayslips = async (req, res) => {
  try {
    const payslips = await Payslip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(payslips);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching payslips" });
  }
};

export const generateMonthlyPayroll = async (req, res) => {
  try {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const targetMonth = lastMonth.toLocaleString('default', { month: 'long' });
    const targetYear = lastMonth.getFullYear();

    const targetMonthStart = new Date(targetYear, lastMonth.getMonth(), 1);
    const targetMonthEnd = new Date(targetYear, lastMonth.getMonth() + 1, 0, 23, 59, 59);

    const alreadyRun = await Payslip.findOne({ month: targetMonth, year: targetYear });
    if (alreadyRun) {
      return res.status(400).json({ msg: "Payroll already generated for this month", month: targetMonth, year: targetYear });
    }

    const employees = await User.find({ "salaryDetails.basicPay": { $gt: 0 } }).select('+bankDetails.accountNumber');
    
    let processedCount = 0;
    let failedEmails = 0;

    for (const emp of employees) {
      // 1. Calculate Mathematics
      const basic = emp.salaryDetails.basicPay;
      const special = emp.salaryDetails.specialAllowance;
      const totalGross = basic + special;

      const totalDays = new Date(targetYear, lastMonth.getMonth() + 1, 0).getDate();
      const dailyRate = totalGross / parseInt(totalDays);
      
      // Fetch Approved Unpaid Leaves overlapping with this specific month
      const unpaidLeaves = await Leave.find({
        userId: emp._id, 
        status: "approved",
        type: "unpaid", 
        fromDate: { $lte: targetMonthEnd },
        toDate: { $gte: targetMonthStart }
      });
    //   console.log(`Employee: ${emp.name} | Unpaid Leaves This Month: ${unpaidLeaves.length}, ${unpaidLeaves}`);

      let unpaidDaysThisMonth = 0;

      // Calculate the exact number of unpaid days falling WITHIN the target month
      unpaidLeaves.forEach(leave => {
        const start = leave.fromDate < targetMonthStart ? targetMonthStart : leave.fromDate;
        const end = leave.toDate > targetMonthEnd ? targetMonthEnd : leave.toDate;
        
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
        
        unpaidDaysThisMonth += diffDays;
      });

      const lopDeduction = Math.round(unpaidDaysThisMonth * dailyRate);
      
      const pTax = 200;
      const netPay = totalGross - lopDeduction - pTax;

      // 2. Create the Database Record
      const newPayslip = await Payslip.create({
        userId: emp._id,
        month: targetMonth,
        year: targetYear,
        earnings: { basicPay: basic, specialAllowance: special },
        deductions: { lossOfPay: lopDeduction, professionalTax: pTax },
        netPay
      });

      processedCount++;

      // 3. ISOLATED BLOCK: PDF & Email Generation
      // If this fails for one user, it won't break the whole company's payroll.
      if (emp.bankDetails?.accountNumber && emp.email) {
        try {
          const rawAccount = decryptData(emp.bankDetails.accountNumber);
          const pdfBuffer = await generatePDFBuffer(emp, newPayslip, rawAccount);

          const namePart = emp.name.replace(/\s+/g, '').toLowerCase().padEnd(4, 'x').substring(0, 4);
          const accPart = rawAccount.slice(-4);
          
          const emailHtml = buildEmailTemplate({
            title: "Salary Statement Generated",
            color: "#4f46e5", // OfficeLink Indigo
            message: `
              <p style="margin-bottom:24px;">Hello <b>${emp.name}</b>,</p>
              
              <p style="margin-bottom:24px;">Your corporate salary statement for <b>${targetMonth} ${targetYear}</b> has been generated and is attached to this email.</p>
              
              <div style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:24px; margin-bottom:24px;">
                <h3 style="margin-top:0; color:#1e293b; font-size:14px; text-transform:uppercase; letter-spacing:0.05em;">Security Notice</h3>
                <p style="margin-bottom:12px; color:#475569; font-size:14px;">This document is password protected. To open it, use the following format:</p>
                
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:16px;">
                  <tr>
                    <td style="padding-bottom:8px; font-size:12px; color:#64748b; font-weight:700;">FORMAT</td>
                    <td style="padding-bottom:8px; font-size:13px; color:#1e293b; font-weight:600; text-align:right;">First 4 of Name + Last 4 of Account</td>
                  </tr>
                  <tr>
                    <td style="font-size:12px; color:#64748b; font-weight:700;">YOUR PASSWORD</td>
                    <td style="font-size:14px; color:#4f46e5; font-weight:800; text-align:right; font-family:monospace;">${namePart}${accPart}</td>
                  </tr>
                </table>
              </div>
              
              <p style="font-size:13px; color:#94a3b8; text-align:center;">
                Please do not share this password with anyone.
              </p>
            `
          });

          await sendEmail({
            to: emp.email,
            subject: `OfficeLink Payslip - ${targetMonth} ${targetYear}`,
            html: emailHtml,
            attachments: [{
              filename: `Payslip_${targetMonth}_${targetYear}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf'
            }]
          });

          newPayslip.isSent = true;
          await newPayslip.save();
        } catch (innerError) {
          console.error(`Failed to generate PDF/Email for ${emp.name}:`, innerError.message);
          failedEmails++;
        }
      }
    }
    // 4. Admin Summary Dispatch
    const adminEmail = req.user?.email || process.env.EMAIL_USER;
    // console.log(req.user?.email);
    
    if (adminEmail) {
      const summaryHtml = buildEmailTemplate({
        title: "Payroll Execution Summary",
        color: "#166534", // Success Green
        message: `
          <p style="margin-bottom:24px;">Hello Administrator,</p>
          
          <p style="margin-bottom:32px;">The automated payroll engine has completed its cycle.</p>

          <div style="text-align:center; margin-bottom:32px;">
            <span style="background-color:#166534; color:#ffffff; padding:10px 24px; border-radius:50px; font-weight:800; font-size:13px; text-transform:uppercase; letter-spacing:0.05em;">
              EXECUTION SUCCESSFUL
            </span>
          </div>
          
          <div style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:24px; margin-bottom:24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom:12px; font-size:12px; color:#64748b; font-weight:700; text-transform:uppercase;">Pay Period</td>
                <td style="padding-bottom:12px; font-size:14px; color:#1e293b; font-weight:600; text-align:right;">${targetMonth} ${targetYear}</td>
              </tr>
              <tr>
                <td style="padding-bottom:12px; font-size:12px; color:#64748b; font-weight:700; text-transform:uppercase;">Processed Securely</td>
                <td style="padding-bottom:12px; font-size:14px; color:#1e293b; font-weight:600; text-align:right;">${processedCount} Employees</td>
              </tr>
              <tr>
                <td style="font-size:12px; color:#64748b; font-weight:700; text-transform:uppercase;">Email Failures</td>
                <td style="font-size:14px; color:${failedEmails > 0 ? '#e11d48' : '#10b981'}; font-weight:600; text-align:right;">${failedEmails}</td>
              </tr>
            </table>
          </div>
          
          <p style="font-size:13px; color:#94a3b8; text-align:center;">
            View full detailed reports in the OfficeLink Admin Dashboard.
          </p>
        `
      });

      await sendEmail({
        to: adminEmail,
        subject: `Payroll Summary - ${targetMonth} ${targetYear}`,
        html: summaryHtml
      });
    }

    res.status(200).json({ 
      msg: "Payroll generated successfully", 
      processed: processedCount,
      emailFailures: failedEmails
    });

  } catch (error) {
    console.error("\n CRITICAL PAYROLL GENERATION ERROR:");
    console.error(error);
    res.status(500).json({ msg: "Critical error during payroll generation" });
  }
};

// GET /api/payroll/download/:id
export const downloadPayslipPDF = async (req, res) => {
  try {
    const payslip = await Payslip.findById(req.params.id);
    if (!payslip) return res.status(404).json({ msg: "Payslip not found" });

    // Security check: Only the owner or an admin can download it
    if (payslip.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: "Not authorized to download this document" });
    }

    const emp = await User.findById(payslip.userId).select('+bankDetails.accountNumber');
    if (!emp || !emp.bankDetails?.accountNumber) {
       return res.status(400).json({ msg: "Incomplete bank details. Cannot generate secure PDF." });
    }

    // Generate PDF in memory
    const rawAccount = decryptData(emp.bankDetails.accountNumber);
    const pdfBuffer = await generatePDFBuffer(emp, payslip, rawAccount);

    // Tell the browser this is a downloadable PDF file
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Payslip_${payslip.month}_${payslip.year}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.end(pdfBuffer);
  } catch (error) {
    console.error("PDF Download Error:", error);
    res.status(500).json({ msg: "Critical error during PDF generation" });
  }
};


// ==========================================
// TEMPORARY MIGRATION SCRIPT
// ==========================================

export const seedMissingPayrollData = async (req, res) => {
  try {
    // Fetch all users to check their status
    const users = await User.find({}).select('+bankDetails.accountNumber');
    let updatedCount = 0;

    const banks = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'];

    for (const user of users) {
      // If the user does NOT have a basicPay setup, generate it.
      if (!user.salaryDetails?.basicPay || user.salaryDetails.basicPay === 0) {
        
        // 1. Generate Random Salary (Basic: 30k-80k, Special: 5k-20k)
        const randomBasic = Math.floor(Math.random() * (80000 - 30000 + 1)) + 30000;
        const randomSpecial = Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000;

        // 2. Generate Fake Bank Details
        const randomBank = banks[Math.floor(Math.random() * banks.length)];
        const rawAccount = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10 digits
        const randomIfsc = `${randomBank.substring(0, 4).toUpperCase()}000${Math.floor(1000 + Math.random() * 9000)}`;

        // 3. Assign and Encrypt
        user.salaryDetails = { 
          basicPay: randomBasic, 
          specialAllowance: randomSpecial 
        };
        
        user.bankDetails = {
          accountNumber: encryptData(rawAccount),
          ifscCode: randomIfsc,
          bankName: randomBank
        };

        await user.save();
        updatedCount++;
      }
    }

    res.status(200).json({ 
      msg: "Database migration complete.", 
      usersUpdated: updatedCount 
    });

  } catch (error) {
    console.error("Migration Error:", error);
    res.status(500).json({ msg: "Critical error during data seeding." });
  }
};