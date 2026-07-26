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
      const imageUrl = item.product?.imageCover
        ? `${process.env.BASE_URL}/products/${item.product.imageCover}`
        : "https://via.placeholder.com/150";

      return `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; font-size: 14px;">
          <div style="display: flex; align-items: center;">
            <img src="${imageUrl}" alt="${productTitle}" style="width: 50px; height: 50px; border-radius: 6px; object-fit: cover; margin-right: 12px; border: 1px solid #e2e8f0;" />
            <div>
              <div style="font-weight: 600; color: #0f172a;">${productTitle}</div>
              <div style="font-size: 13px; color: #64748b;">Qty: ${quantity}</div>
            </div>
          </div>
          <span style="font-weight: 600; color: #0f172a;">E£${itemPrice}</span>
        </div>
      `;
    })
    .join("");

  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Receipt from E-Shop</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #1e293b;">
    <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); overflow: hidden; border: 1px solid #e2e8f0;">
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); padding: 30px 20px; text-align: center;">
        <div style="width: 60px; height: 60px; background: #ffffff; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <span style="font-size: 28px; line-height: 1;">🛒</span>
        </div>
      </div>
      
      <!-- Content -->
      <div style="padding: 30px;">
        <h1 style="font-size: 24px; font-weight: 700; text-align: center; margin-top: 10px; margin-bottom: 5px; color: #0f172a;">Receipt from E-Shop</h1>
        <p style="text-align: center; font-size: 14px; color: #64748b; margin-bottom: 30px; margin-top: 0;">Receipt #${order._id.toString().slice(-8).toUpperCase()}</p>
        
        <!-- Info Grid -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px;">
          <tr>
            <td style="width: 33.33%; text-align: center; border-right: 1px solid #e2e8f0; padding: 10px 0;">
              <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 5px; letter-spacing: 0.5px;">Amount Paid</div>
              <div style="font-size: 15px; font-weight: 600; color: #0f172a;">E£${amountPaid}</div>
            </td>
            <td style="width: 33.33%; text-align: center; border-right: 1px solid #e2e8f0; padding: 10px 0;">
              <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 5px; letter-spacing: 0.5px;">Date Paid</div>
              <div style="font-size: 15px; font-weight: 600; color: #0f172a;">${datePaid}</div>
            </td>
            <td style="width: 33.33%; text-align: center; padding: 10px 0;">
              <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 5px; letter-spacing: 0.5px;">Payment Method</div>
              <div style="font-size: 15px; font-weight: 600; color: #0f172a;">${paymentMethod}</div>
            </td>
          </tr>
        </table>

        <!-- Summary -->
        <div style="font-size: 12px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 15px; letter-spacing: 0.5px;">Summary</div>
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 30px; border: 1px solid #f1f5f9;">
          ${itemsHtml}
          <div style="border-top: 1px solid #e2e8f0; margin: 15px 0;"></div>
          <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: 700; color: #0f172a;">
            <span>Amount charged</span>
            <span>E£${amountPaid}</span>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 25px;">
          If you have any questions, contact us at <a href="mailto:progahmedelsayed@gmail.com" style="color: #1e3a8a; text-decoration: none; font-weight: 600;">progahmedelsayed@gmail.com</a>.
        </div>
      </div>
    </div>
  </body>
  </html>`;
};
