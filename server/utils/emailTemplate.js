export const buildEmailTemplate = ({
  title,
  message,
  color = "#4f46e5"
}) => {
  return `
    <div style="background:#f3f4f6;padding:30px 0;font-family:Inter,Arial,sans-serif;">
      
      <div style="max-width:620px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        
        <!-- HEADER -->
        <div style="background:${color};padding:22px;text-align:center;color:white;">
          <h2 style="margin:0;font-size:22px;font-weight:600;">
            ${title}
          </h2>
          <p style="margin:6px 0 0 0;font-size:13px;opacity:0.9;">
            HR Management System
          </p>
        </div>

        <!-- BODY -->
        <div style="padding:28px;color:#374151;line-height:1.6;">
          ${message}
        </div>

        <!-- FOOTER -->
        <div style="
          background:#f9fafb;
          padding:16px;
          text-align:center;
          font-size:12px;
          color:#9ca3af;
        ">
          © ${new Date().getFullYear()} OfficeLink • All rights reserved
        </div>

      </div>

    </div>
  `;
};