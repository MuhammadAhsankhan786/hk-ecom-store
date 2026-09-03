export function renderOrderConfirmationTemplate(data: {
  customerName: string;
  orderNumber: string;
  totalAmount: number;
  shippingAddress: string;
  city: string;
  items: Array<{ productName: string; variantSize: string; variantColor: string; quantity: number; unitPrice: number }>;
}): string {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #E8E5DE; color: #111111; font-size: 14px;">
        <strong>${item.productName}</strong><br/>
        <span style="font-size: 12px; color: #6B6B6B;">${item.variantSize} · ${item.variantColor} · Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #E8E5DE; color: #111111; font-size: 14px; text-align: right; font-weight: 600;">
        Rs. ${(item.unitPrice * item.quantity).toLocaleString()}
      </td>
    </tr>
  `,
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Order Confirmation — HK Fabric</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #F8F7F3; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F7F3; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E8E5DE; border-radius: 4px; overflow: hidden;">
            <!-- Header -->
            <tr>
              <td style="background-color: #111111; padding: 24px; text-align: center;">
                <h1 style="color: #FFFFFF; font-family: Georgia, serif; font-size: 24px; margin: 0; letter-spacing: 1px;">HK Fabric</h1>
                <span style="color: #D4AF37; font-size: 10px; text-transform: uppercase; tracking: 3px; display: block; margin-top: 4px;">Home Textiles</span>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding: 32px;">
                <p style="color: #D4AF37; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 8px 0;">Order Confirmed</p>
                <h2 style="color: #111111; font-family: Georgia, serif; font-size: 22px; margin: 0 0 16px 0;">Thank you, ${data.customerName}!</h2>
                <p style="color: #6B6B6B; font-size: 14px; line-height: 1.5; margin: 0 0 24px 0;">
                  We have received your order <strong>${data.orderNumber}</strong>. Our team is now preparing your items for delivery.
                </p>

                <!-- Order Summary Table -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                  <thead>
                    <tr>
                      <th align="left" style="padding-bottom: 8px; border-bottom: 2px solid #111111; font-size: 11px; text-transform: uppercase; color: #111111;">Item</th>
                      <th align="right" style="padding-bottom: 8px; border-bottom: 2px solid #111111; font-size: 11px; text-transform: uppercase; color: #111111;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F7F3; padding: 16px; margin-bottom: 24px;">
                  <tr>
                    <td style="color: #6B6B6B; font-size: 14px;"><strong>Shipping Address:</strong><br/>${data.shippingAddress}, ${data.city}</td>
                    <td align="right" style="color: #111111; font-size: 16px; font-weight: bold;">Grand Total:<br/><span style="color: #D4AF37;">Rs. ${data.totalAmount.toLocaleString()}</span></td>
                  </tr>
                </table>

                <p style="color: #6B6B6B; font-size: 12px; text-align: center; margin: 0;">
                  Need help? Contact our customer support at <a href="mailto:support@hkfabric.pk" style="color: #D4AF37; text-decoration: none;">support@hkfabric.pk</a>
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color: #F8F7F3; padding: 16px; text-align: center; font-size: 11px; color: #6B6B6B; border-top: 1px solid #E8E5DE;">
                © 2026 HK Fabric Retail Store. All rights reserved.
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
