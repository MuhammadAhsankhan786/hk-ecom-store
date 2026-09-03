export function renderPaymentConfirmationTemplate(data: {
  customerName: string;
  orderNumber: string;
  transactionRef: string;
  provider: string;
  amount: number;
}): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Payment Receipt — HK Fabric</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #F8F7F3; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F7F3; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E8E5DE; border-radius: 4px; overflow: hidden;">
            <tr>
              <td style="background-color: #111111; padding: 24px; text-align: center;">
                <h1 style="color: #FFFFFF; font-family: Georgia, serif; font-size: 24px; margin: 0;">HK Fabric</h1>
                <span style="color: #D4AF37; font-size: 10px; text-transform: uppercase;">Payment Receipt</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px;">
                <p style="color: #1DB954; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 8px 0;">Payment Verified</p>
                <h2 style="color: #111111; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Payment Received for ${data.orderNumber}</h2>
                <p style="color: #6B6B6B; font-size: 14px; line-height: 1.5; margin: 0 0 24px 0;">
                  Dear ${data.customerName}, your payment of <strong>Rs. ${data.amount.toLocaleString()}</strong> has been verified server-side.
                </p>

                <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #F8F7F3; border-left: 4px solid #D4AF37; margin-bottom: 24px; font-size: 13px; color: #111111;">
                  <tr><td><strong>Order Number:</strong> ${data.orderNumber}</td></tr>
                  <tr><td><strong>Transaction Ref:</strong> ${data.transactionRef}</td></tr>
                  <tr><td><strong>Payment Gateway:</strong> ${data.provider}</td></tr>
                  <tr><td><strong>Amount Paid:</strong> Rs. ${data.amount.toLocaleString()}</td></tr>
                  <tr><td><strong>Status:</strong> COMPLETED & VERIFIED</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color: #F8F7F3; padding: 16px; text-align: center; font-size: 11px; color: #6B6B6B;">
                © 2026 HK Fabric Retail Store
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
