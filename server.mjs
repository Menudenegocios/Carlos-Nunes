
import express from 'express';
import stripePackage from 'stripe';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Webhook endpoint needs raw body
app.post('/api/webhooks/stripe', bodyParser.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleSubscriptionCreated(session);
      break;
    case 'invoice.paid':
      const invoice = event.data.object;
      await handleInvoicePaid(invoice);
      break;
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      await handleSubscriptionDeleted(subscription);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.json({received: true});
});

// JSON parsing for other routes
app.use(express.json());

// Create Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  const { planId, billingCycle } = req.body;
  const authHeader = req.headers.authorization;
  
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) return res.status(401).json({ error: 'Invalid token' });

  try {
    // Get profile to check for stripe_customer_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            metadata: { supabase_user_id: user.id }
        });
        customerId = customer.id;
        
        await supabase
            .from('profiles')
            .update({ stripe_customer_id: customerId })
            .eq('user_id', user.id);
    }

    let planName = 'Plano Básico';
    let planId_technical = 'basic';
    
    // Check for Pro Plan
    const proPriceIds = [
      process.env.STRIPE_PRICE_PRO_MONTHLY, 
      process.env.VITE_STRIPE_PRICE_PRO_MONTHLY,
      process.env.STRIPE_PRICE_PRO_YEARLY,
      process.env.VITE_STRIPE_PRICE_PRO_YEARLY
    ].filter(id => !!id);

    // Check for Full Plan
    const fullPriceIds = [
      process.env.STRIPE_PRICE_FULL_MONTHLY,
      process.env.VITE_STRIPE_PRICE_FULL_MONTHLY,
      process.env.STRIPE_PRICE_FULL_YEARLY,
      process.env.VITE_STRIPE_PRICE_FULL_YEARLY
    ].filter(id => !!id);

    if (proPriceIds.includes(planId)) {
      planName = 'Plano Pro';
      planId_technical = 'pro';
    } else if (fullPriceIds.includes(planId)) {
      planName = 'Plano FULL';
      planId_technical = 'full';
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: planId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/plans`,
      metadata: {
        user_id: user.id,
        plan_name: planName,
        plan_id: planId_technical
      }
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Helper functions to update Supabase
async function handleSubscriptionCreated(session) {
    const { user_id, plan_id } = session.metadata;
    const stripe_subscription_id = session.subscription;
    const stripe_customer_id = session.customer;

    // Get subscription details from stripe
    const subscription = await stripe.subscriptions.retrieve(stripe_subscription_id);

    await supabase.from('subscriptions').upsert({
        user_id,
        stripe_customer_id,
        stripe_subscription_id,
        plan: plan_id,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
    });

    await supabase.from('profiles').update({ plan: plan_id }).eq('user_id', user_id);
}

async function handleInvoicePaid(invoice) {
    if (!invoice.subscription) return;
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    
    await supabase.from('subscriptions')
        .update({ 
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
        })
        .eq('stripe_subscription_id', invoice.subscription);
}

async function handleSubscriptionDeleted(subscription) {
    await supabase.from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', subscription.id);
        
    // Optionally update profile to free plan
}

// Serve static files from production build
app.use(express.static(path.join(__dirname, 'dist')));

app.get(/.*/, (req, res) => {
  // Se a requisição for para um asset que não existe, retorna 404 real para evitar erro de MIME
  if (req.path.startsWith('/assets/')) {
    return res.status(404).send('Asset not found');
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
