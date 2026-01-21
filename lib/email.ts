import { Resend } from 'resend';
import { Order } from './types';

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export async function sendOrderConfirmationEmail(order: Order): Promise<boolean> {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ${mins} minutes` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Nupur Bakery</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #d04333 0%, #ae3428 100%); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Nupur Bakery</h1>
          <p style="color: #fce8e5; margin: 10px 0 0 0;">Order Confirmation</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px;">
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
            Dear <strong>${order.customerName}</strong>,
          </p>
          <p style="color: #555; font-size: 15px; line-height: 1.6;">
            Thank you for your order! We're excited to create something special for you.
          </p>

          <!-- Order Details Box -->
          <div style="background-color: #fdf4f3; border-radius: 12px; padding: 20px; margin: 25px 0;">
            <h2 style="color: #d04333; font-size: 18px; margin: 0 0 15px 0;">Order Details</h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;">Order Number:</td>
                <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: bold; text-align: right;">${order.orderNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;">Order Date:</td>
                <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">${new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
            </table>
          </div>

          ${order.productName ? `
          <!-- Product Details -->
          <div style="border: 1px solid #eee; border-radius: 12px; padding: 20px; margin: 25px 0;">
            <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0;">Product</h2>

            <div style="display: flex; gap: 15px;">
              ${order.productImage ? `
              <div style="flex-shrink: 0;">
                <img src="${order.productImage}" alt="${order.productName}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
              </div>
              ` : ''}
              <div>
                <h3 style="color: #333; font-size: 16px; margin: 0 0 8px 0;">${order.productName}</h3>
                <p style="color: #d04333; font-size: 18px; font-weight: bold; margin: 0;">₹${order.productPrice?.toLocaleString()}</p>
              </div>
            </div>
          </div>
          ` : ''}

          <!-- Customization Details -->
          ${order.cakeMessage || order.flavor || order.weight || order.specialInstructions ? `
          <div style="border: 1px solid #eee; border-radius: 12px; padding: 20px; margin: 25px 0;">
            <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0;">Customization</h2>
            <table style="width: 100%; border-collapse: collapse;">
              ${order.cakeMessage ? `
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px; vertical-align: top;">Cake Message:</td>
                <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">"${order.cakeMessage}"</td>
              </tr>
              ` : ''}
              ${order.flavor ? `
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;">Flavor:</td>
                <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">${order.flavor}</td>
              </tr>
              ` : ''}
              ${order.weight ? `
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;">Weight/Size:</td>
                <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">${order.weight}</td>
              </tr>
              ` : ''}
              ${order.specialInstructions ? `
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px; vertical-align: top;">Special Instructions:</td>
                <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">${order.specialInstructions}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          ` : ''}

          <!-- Delivery Details -->
          <div style="border: 1px solid #eee; border-radius: 12px; padding: 20px; margin: 25px 0;">
            <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0;">${order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'} Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;">Date:</td>
                <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">${new Date(order.deliveryDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;">Time:</td>
                <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">${order.deliveryTime}</td>
              </tr>
              ${order.deliveryType === 'delivery' ? `
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px; vertical-align: top;">Address:</td>
                <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">${order.customerAddress}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <!-- Total -->
          <div style="background-color: #333; color: #fff; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
            <p style="margin: 0 0 5px 0; font-size: 14px; opacity: 0.8;">Estimated Total</p>
            <p style="margin: 0; font-size: 28px; font-weight: bold;">₹${order.totalPrice.toLocaleString()}</p>
            <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.7;">*Final price may vary based on customization</p>
          </div>

          <!-- Contact Info -->
          <div style="background-color: #f9f9f9; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
            <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">
              We will contact you shortly to confirm your order.
            </p>
            <p style="color: #333; font-size: 14px; margin: 0;">
              Questions? Contact us at<br>
              <a href="tel:+917879797978" style="color: #d04333; text-decoration: none; font-weight: bold;">+91 78797 97978</a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #333; padding: 25px; text-align: center;">
          <p style="color: #fff; font-size: 16px; font-weight: bold; margin: 0 0 5px 0;">Nupur Bakery</p>
          <p style="color: #aaa; font-size: 13px; margin: 0;">Bhopal, Madhya Pradesh</p>
          <p style="color: #aaa; font-size: 12px; margin: 15px 0 0 0;">
            <a href="https://nupurbakery.in" style="color: #d04333; text-decoration: none;">nupurbakery.in</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: 'Nupur Bakery <mail@nupurbakery.in>',
      to: order.customerEmail,
      subject: `Order Confirmation #${order.orderNumber} - Nupur Bakery`,
      html: emailHtml,
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export async function sendOwnerNotificationEmail(order: Order): Promise<boolean> {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order - Nupur Bakery</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px;">
        <h1 style="color: #d04333; margin: 0 0 20px 0;">New Order Received!</h1>

        <h2 style="color: #333; font-size: 16px;">Order #${order.orderNumber}</h2>

        <h3 style="color: #666; font-size: 14px; margin-top: 20px;">Customer Details:</h3>
        <ul style="color: #333; line-height: 1.8;">
          <li><strong>Name:</strong> ${order.customerName}</li>
          <li><strong>Email:</strong> ${order.customerEmail}</li>
          <li><strong>Phone:</strong> ${order.customerPhone}</li>
          <li><strong>Address:</strong> ${order.customerAddress}</li>
        </ul>

        ${order.productName ? `
        <h3 style="color: #666; font-size: 14px; margin-top: 20px;">Product:</h3>
        <ul style="color: #333; line-height: 1.8;">
          <li><strong>Product:</strong> ${order.productName}</li>
          <li><strong>Base Price:</strong> ₹${order.productPrice?.toLocaleString()}</li>
        </ul>
        ` : '<p style="color: #d04333;"><strong>General Order (No specific product selected)</strong></p>'}

        <h3 style="color: #666; font-size: 14px; margin-top: 20px;">Customization:</h3>
        <ul style="color: #333; line-height: 1.8;">
          ${order.cakeMessage ? `<li><strong>Cake Message:</strong> "${order.cakeMessage}"</li>` : ''}
          ${order.flavor ? `<li><strong>Flavor:</strong> ${order.flavor}</li>` : ''}
          ${order.weight ? `<li><strong>Weight/Size:</strong> ${order.weight}</li>` : ''}
          ${order.specialInstructions ? `<li><strong>Special Instructions:</strong> ${order.specialInstructions}</li>` : ''}
        </ul>

        <h3 style="color: #666; font-size: 14px; margin-top: 20px;">Delivery:</h3>
        <ul style="color: #333; line-height: 1.8;">
          <li><strong>Type:</strong> ${order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}</li>
          <li><strong>Date:</strong> ${new Date(order.deliveryDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
          <li><strong>Time:</strong> ${order.deliveryTime}</li>
        </ul>

        <div style="background-color: #d04333; color: #fff; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
          <strong>Estimated Total: ₹${order.totalPrice.toLocaleString()}</strong>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Send to owner's email - you can configure this
    const resend = getResendClient();
    await resend.emails.send({
      from: 'Nupur Bakery Orders <mail@nupurbakery.in>',
      to: 'mail@nupurbakery.in', // Owner's email
      subject: `New Order #${order.orderNumber} - ${order.customerName}`,
      html: emailHtml,
    });
    return true;
  } catch (error) {
    console.error('Failed to send owner notification:', error);
    return false;
  }
}
