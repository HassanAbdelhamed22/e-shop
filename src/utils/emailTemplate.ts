export const getForgotPasswordTemplate = (
  userName: string,
  resetCode: string,
): string => {
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

export const getOrderReceiptTemplate = (order: any): string => {
  const amountPaid = order.totalOrderPrice.toFixed(2);
  const datePaid = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const paymentMethod = order.paymentMethodType === "cash" ? "Cash" : "Card";

  const itemsHtml = order.cartItems
    .map((item: any) => {
      const productTitle = item.product?.title || "Product";
      const quantity = item.quantity;
      const itemPrice = (item.price * quantity).toFixed(2);
      return `
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 18px; width: 100%;">
          <tr>
            <td width="54" valign="top" style="width: 54px; text-align: left;">
              <table border="0" cellpadding="0" cellspacing="0" style="width: 44px; height: 44px; background-color: #f1f5f9; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
                <tr>
                  <td valign="middle" align="center" style="font-size: 20px; line-height: 1; text-align: center; vertical-align: middle;">
                    📦
                  </td>
                </tr>
              </table>
            </td>
            <td valign="middle" style="padding-left: 12px; text-align: left;">
              <div style="font-weight: 600; color: #1e293b; font-size: 14px; margin-bottom: 2px; line-height: 1.4;">${productTitle}</div>
              <div style="font-size: 12px; color: #64748b; font-weight: 500;">Qty: ${quantity}</div>
            </td>
            <td valign="middle" align="right" style="font-weight: 600; color: #1e293b; font-size: 14px; text-align: right;">
              E£${itemPrice}
            </td>
          </tr>
        </table>
      `;
    })
    .join("");

  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receipt from E-Shop</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #1e293b; -webkit-font-smoothing: antialiased;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 30px 10px;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03), 0 1px 2px rgba(15, 23, 42, 0.06); border: 1px solid #e2e8f0;">
            <!-- Header Banner -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 35px 20px;">
                <div style="width: 56px; height: 56px; background-color: rgba(255, 255, 255, 0.08); border-radius: 12px; display: inline-block; text-align: center; line-height: 56px;">
                  <span style="font-size: 26px; vertical-align: middle;">🛒</span>
                </div>
                <h1 style="margin: 15px 0 0 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">E-Shop Receipt</h1>
                <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px; font-weight: 500;">Receipt #${order._id.toString().slice(-8).toUpperCase()}</p>
              </td>
            </tr>
            
            <!-- Body Content -->
            <tr>
              <td style="padding: 30px 25px;">
                <!-- Info Section -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px;">
                  <tr>
                    <td width="33.33%" align="center" style="border-right: 1px solid #f1f5f9; padding: 5px 0; text-align: center;">
                      <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 4px; letter-spacing: 0.5px;">Amount Paid</div>
                      <div style="font-size: 15px; font-weight: 700; color: #0f172a;">E£${amountPaid}</div>
                    </td>
                    <td width="33.33%" align="center" style="border-right: 1px solid #f1f5f9; padding: 5px 0; text-align: center;">
                      <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 4px; letter-spacing: 0.5px;">Date Paid</div>
                      <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${datePaid}</div>
                    </td>
                    <td width="33.33%" align="center" style="padding: 5px 0; text-align: center;">
                      <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 4px; letter-spacing: 0.5px;">Method</div>
                      <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${paymentMethod}</div>
                    </td>
                  </tr>
                </table>
                
                <!-- Summary Label -->
                <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 12px; letter-spacing: 0.5px;">Order Summary</div>
                
                <!-- Items list container -->
                <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #f1f5f9; margin-bottom: 25px;">
                  <!-- Loop items -->
                  ${itemsHtml}
                  
                  <!-- Divider -->
                  <div style="border-top: 1px dashed #e2e8f0; margin: 15px 0 10px 0;"></div>
                  
                  <!-- Total charged table -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="font-size: 15px; font-weight: 700; color: #0f172a; text-align: left;">
                        Amount charged
                      </td>
                      <td align="right" style="font-size: 15px; font-weight: 700; color: #0f172a; text-align: right;">
                        E£${amountPaid}
                      </td>
                    </tr>
                  </table>
                </div>
                
                <!-- Help text / Footer -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center;">
                  <tr>
                    <td align="center" style="font-size: 13px; color: #64748b; line-height: 1.5;">
                      If you have any questions or issues with this order, please feel free to reach out to us at <a href="mailto:hassanabdelhamed09@gmail.com" style="color: #4f46e5; text-decoration: none; font-weight: 600;">hassanabdelhamed09@gmail.com</a>.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Bottom brand logo / footer info -->
            <tr>
              <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9;">
                <p style="margin: 0; font-size: 12px; color: #94a3b8; font-weight: 500;">
                  Thank you for shopping at E-Shop!
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
