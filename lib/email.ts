interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  type: string
  items: { name: string; quantity: number; unitPriceCents: number }[]
  totalCents: number
  deliveryAddress?: string
  deliveryCity?: string
  specialInstructions?: string
}

function formatCurrency(cents: number) {
  return `£${(cents / 100).toFixed(2)}`
}

// Send email via Resend API
async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey === 're_placeholder') {
    console.log(`[Email skipped - no API key] To: ${to}, Subject: ${subject}`)
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'orders@japaneseyama-sushi.com',
      to,
      subject,
      html,
    }),
  })

  if (!res.ok) {
    console.error('Email send failed:', await res.text())
  }
}

// Email to RESTAURANT when new order arrives
export async function sendNewOrderNotification(order: OrderEmailData) {
  const itemsHtml = order.items
    .map(i => `<tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatCurrency(i.unitPriceCents * i.quantity)}</td>
    </tr>`)
    .join('')

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#C62828;padding:20px;text-align:center">
        <h1 style="color:white;margin:0">🍣 New Order!</h1>
        <p style="color:#ffcdd2;margin:5px 0">${order.orderNumber}</p>
      </div>
      <div style="padding:24px;background:#fff">
        <h2 style="color:#1A1A1A">Order Details</h2>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Phone:</strong> ${order.customerPhone}</p>
        <p><strong>Email:</strong> ${order.customerEmail}</p>
        <p><strong>Type:</strong> ${order.type === 'PICKUP' ? '🏃 PICKUP' : '🚗 DELIVERY'}</p>
        ${order.deliveryAddress ? `<p><strong>Delivery to:</strong> ${order.deliveryAddress}, ${order.deliveryCity}</p>` : ''}
        ${order.specialInstructions ? `<p><strong>Notes:</strong> ${order.specialInstructions}</p>` : ''}

        <table style="width:100%;border-collapse:collapse;margin-top:16px">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="padding:8px;text-align:left">Item</th>
              <th style="padding:8px;text-align:center">Qty</th>
              <th style="padding:8px;text-align:right">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div style="text-align:right;margin-top:16px;font-size:20px;font-weight:bold;color:#C62828">
          Total: ${formatCurrency(order.totalCents)}
        </div>

        <div style="margin-top:24px;padding:16px;background:#fff3e0;border-radius:8px;text-align:center">
          <p style="margin:0;color:#e65100">⚡ Log in to your admin dashboard to update the order status</p>
        </div>
      </div>
    </div>
  `

  await sendEmail(
    process.env.RESTAURANT_EMAIL || 'danima.sherpa644@gmail.com',
    `🍣 New Order ${order.orderNumber} — ${order.type} — ${formatCurrency(order.totalCents)}`,
    html
  )
}

// Email to CUSTOMER confirming their order
export async function sendOrderConfirmationToCustomer(order: OrderEmailData) {
  const itemsHtml = order.items
    .map(i => `<tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${i.name} x${i.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatCurrency(i.unitPriceCents * i.quantity)}</td>
    </tr>`)
    .join('')

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#1A1A1A;padding:20px;text-align:center">
        <h1 style="color:white;margin:0">🍣 Japanese Yama Sushi</h1>
      </div>
      <div style="padding:24px;background:#FAF7F2;text-align:center">
        <h2 style="color:#C62828">Order Confirmed! ✅</h2>
        <p style="font-size:32px;font-weight:bold;color:#1A1A1A">${order.orderNumber}</p>
        <p style="color:#666">Save this order number for your records</p>
      </div>
      <div style="padding:24px;background:#fff">
        <p>Hi <strong>${order.customerName}</strong>,</p>
        <p>We've received your order and we're preparing it now! Estimated time: <strong>25-35 minutes</strong>.</p>

        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr>
              <td style="padding:12px;font-weight:bold;font-size:18px;color:#C62828">Total</td>
              <td style="padding:12px;font-weight:bold;font-size:18px;color:#C62828;text-align:right">${formatCurrency(order.totalCents)}</td>
            </tr>
          </tfoot>
        </table>

        <p style="background:#f5f5f5;padding:12px;border-radius:8px">
          📍 <strong>6 Trinity St, London, SE1 1DB</strong><br/>
          📞 Call us if you have questions
        </p>
        <p style="color:#999;font-size:12px;text-align:center">Japanese Yama Sushi — Freshly Made Every Day</p>
      </div>
    </div>
  `

  await sendEmail(order.customerEmail, `Order Confirmed — ${order.orderNumber}`, html)
}

// Email to CUSTOMER when order is READY for pickup
export async function sendOrderReadyNotification(order: {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
}) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#1A1A1A;padding:20px;text-align:center">
        <h1 style="color:white;margin:0">🍣 Japanese Yama Sushi</h1>
      </div>
      <div style="padding:32px;background:#FAF7F2;text-align:center">
        <p style="font-size:48px;margin:0">🎉</p>
        <h2 style="color:#2e7d32;margin:12px 0">Your Order is Ready!</h2>
        <p style="font-size:28px;font-weight:bold;color:#1A1A1A;letter-spacing:2px">${order.orderNumber}</p>
        <p style="color:#666">Please come collect your order — it's freshly prepared and waiting for you!</p>
      </div>
      <div style="padding:24px;background:#fff;text-align:center">
        <p style="background:#e8f5e9;padding:16px;border-radius:8px;margin:0">
          📍 <strong>6 Trinity St, London, SE1 1DB</strong><br/>
          📞 If you have any questions, please call us
        </p>
        <p style="color:#999;font-size:12px;margin-top:16px">Japanese Yama Sushi — Freshly Made Every Day</p>
      </div>
    </div>
  `

  await sendEmail(
    order.customerEmail,
    `✅ Your Order ${order.orderNumber} is Ready for Pickup!`,
    html
  )
}

// Email to CUSTOMER confirming reservation
export async function sendReservationConfirmation(data: {
  guestName: string
  guestEmail: string
  confirmationCode: string
  reservationDate: Date
  timeSlot: string
  partySize: number
}) {
  const dateStr = new Date(data.reservationDate).toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#1A1A1A;padding:20px;text-align:center">
        <h1 style="color:white;margin:0">🍣 Japanese Yama Sushi</h1>
      </div>
      <div style="padding:24px;background:#FAF7F2;text-align:center">
        <h2 style="color:#C62828">Reservation Confirmed! ✅</h2>
        <p style="font-size:36px;font-weight:bold;letter-spacing:6px;color:#1A1A1A">${data.confirmationCode}</p>
      </div>
      <div style="padding:24px;background:#fff">
        <p>Hi <strong>${data.guestName}</strong>, we look forward to seeing you!</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;color:#666">📅 Date</td><td style="padding:8px;font-weight:bold">${dateStr}</td></tr>
          <tr><td style="padding:8px;color:#666">🕐 Time</td><td style="padding:8px;font-weight:bold">${data.timeSlot}</td></tr>
          <tr><td style="padding:8px;color:#666">👥 Guests</td><td style="padding:8px;font-weight:bold">${data.partySize} people</td></tr>
          <tr><td style="padding:8px;color:#666">📍 Address</td><td style="padding:8px;font-weight:bold">6 Trinity St, London SE1 1DB</td></tr>
        </table>
        <p style="color:#666;font-size:13px;margin-top:16px">
          To cancel or modify, please call us with your confirmation code: <strong>${data.confirmationCode}</strong>
        </p>
      </div>
    </div>
  `

  await sendEmail(data.guestEmail, `Reservation Confirmed — ${data.confirmationCode} — ${dateStr}`, html)
}
