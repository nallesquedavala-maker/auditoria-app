import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: 'Blindaje Financiero',
            },
            unit_amount: 9900, // 99 MXN (Stripe usa centavos)
          },
          quantity: 1,
        },
      ],
      success_url: 'https://auditoria-app-iota.vercel.app/?success=true',
     cancel_url: 'https://auditoria-app-iota.vercel.app/?cancel=true',
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creando sesión' });
  }
}