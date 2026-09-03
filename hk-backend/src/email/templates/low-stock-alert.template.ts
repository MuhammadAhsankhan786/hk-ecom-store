export function renderLowStockAlertTemplate(data: {
  productName: string;
  sku: string;
  currentStock: number;
  threshold: number;
}): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Low Stock Alert — HK Fabric Admin</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #F8F7F3; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F7F3; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E8E5DE; border-radius: 4px; overflow: hidden;">
            <tr>
              <td style="background-color: #991B1B; padding: 20px; text-align: center;">
                <h1 style="color: #FFFFFF; font-family: Georgia, serif; font-size: 20px; margin: 0;">HK Fabric Admin Alert</h1>
                <span style="color: #FCA5A5; font-size: 10px; text-transform: uppercase;">Inventory Warning</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px;">
                <p style="color: #991B1B; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 8px 0;">Low Inventory Action Required</p>
                <h2 style="color: #111111; font-family: Georgia, serif; font-size: 18px; margin: 0 0 16px 0;">Stock Low for "${data.productName}"</h2>
                <p style="color: #6B6B6B; font-size: 14px; line-height: 1.5; margin: 0 0 24px 0;">
                  Store Manager Notice: Stock for product <strong>${data.productName}</strong> (SKU: ${data.sku}) has reached or fallen below the configured low-stock threshold.
                </p>

                <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #FEF2F2; border-left: 4px solid #991B1B; font-size: 13px; color: #991B1B;">
                  <tr><td><strong>Product Name:</strong> ${data.productName}</td></tr>
                  <tr><td><strong>SKU Code:</strong> ${data.sku}</td></tr>
                  <tr><td><strong>Current Remaining Stock:</strong> <span style="font-size: 16px; font-weight: bold;">${data.currentStock} items</span></td></tr>
                  <tr><td><strong>Alert Threshold:</strong> ${data.threshold} items</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color: #F8F7F3; padding: 16px; text-align: center; font-size: 11px; color: #6B6B6B;">
                © 2026 HK Fabric Operations Management
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
