import Razorpay from 'razorpay'
import nodemailer from 'nodemailer'

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'})
  const { amount } = req.body
  if(!amount) return res.status(400).json({error:'amount required'})

  try {
    const rz = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || ''
    })
    const order = await rz.orders.create({
      amount,
      currency: 'INR',
      receipt: 'rcpt_' + Math.random().toString(36).slice(2,9)
    })

    // Optional email notification
    try {
      if(process.env.SMTP_HOST && process.env.NOTIFY_EMAIL){
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: false,
          auth: process.env.SMTP_USER ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          } : undefined
        })
        await transporter.sendMail({
          from: process.env.FROM_EMAIL || process.env.SMTP_USER || 'orders@no-reply.local',
          to: process.env.NOTIFY_EMAIL,
          subject: `New order created: ${order.id}`,
          html: `<p>Order <b>${order.id}</b> created for <b>₹${(amount/100).toFixed(2)}</b></p>`
        })
      }
    } catch(e){ console.error('Email error:', e) }

    return res.status(200).json(order)
  } catch (e){
    console.error(e)
    return res.status(500).json({error:'order_creation_failed', details: e.message})
  }
}
