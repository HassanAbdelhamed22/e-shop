export const getForgotPasswordTemplate = (userName: string, resetCode: string): string => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f9fc; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #eef2f6;">
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 35px 20px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">E-Shop</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px; color: #374151;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #111827;">Hello ${userName},</h2>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                We received a request to reset your password for your E-Shop account. Use the verification code below to complete your reset:
              </p>
              
              <!-- Code Box -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <div style="background-color: #f3f4f6; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 18px; display: inline-block; min-width: 200px; text-align: center;">
                      <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: bold; color: #4f46e5; letter-spacing: 6px; padding-left: 6px;">${resetCode}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 1.5; color: #ef4444; font-weight: 500;">
                ⚠️ Note: This code is highly confidential and will expire in 10 minutes.
              </p>
              
              <div style="margin: 30px 0 10px 0; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                  If you didn't request a password reset, you can safely ignore this email. Your password will remain secure.
                </p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #f1f5f9;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af;">
                This is an automated email. Please do not reply directly to this message.
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                &copy; 2026 E-Shop Inc. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
