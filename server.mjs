
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

    let planName = 'Plano Comunidade';
    let planId_technical = 'basic';
    
    // Price IDs for mapping names in metadata
    const basicoPriceIds = [
      process.env.STRIPE_PRICE_BASICO_MONTHLY, 
      process.env.VITE_STRIPE_PRICE_BASICO_MONTHLY,
      process.env.STRIPE_PRICE_BASICO_YEARLY,
      process.env.VITE_STRIPE_PRICE_BASICO_YEARLY,
      'price_1TBpx2F7zhqZwXmj7Vn1Gift'
    ].filter(id => !!id);

    const proPriceIds = [
      process.env.STRIPE_PRICE_PRO_MONTHLY, 
      process.env.VITE_STRIPE_PRICE_PRO_MONTHLY,
      process.env.STRIPE_PRICE_PRO_YEARLY,
      process.env.VITE_STRIPE_PRICE_PRO_YEARLY,
      'price_1TBpx5F7zhqZwXmj1cKWRqjd'
    ].filter(id => !!id);

    const fullPriceIds = [
      process.env.STRIPE_PRICE_FULL_MONTHLY,
      process.env.VITE_STRIPE_PRICE_FULL_MONTHLY,
      process.env.STRIPE_PRICE_FULL_YEARLY,
      process.env.VITE_STRIPE_PRICE_FULL_YEARLY,
      'price_1TBpx7F7zhqZwXmjQXqEq1Aq'
    ].filter(id => !!id);

    if (proPriceIds.includes(planId)) {
      planName = 'Plano Pro';
      planId_technical = 'pro';
    } else if (fullPriceIds.includes(planId)) {
      planName = 'Plano Full';
      planId_technical = 'full';
    } else {
      planName = 'Plano Básico';
      planId_technical = 'basic';
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

    // Define rewards based on plan
    let rewardPoints = 0;
    let rewardCash = 0;

    if (plan_id === 'basic') {
        rewardPoints = 100;
        rewardCash = 50;
    } else if (plan_id === 'pro') {
        rewardPoints = 300;
        rewardCash = 100;
    } else if (plan_id === 'full') {
        rewardPoints = 500;
        rewardCash = 200;
    }

    // Check for Founder Badge period (until March 31, 2026)
    const now = new Date();
    const deadline = new Date('2026-04-01'); // First second of April
    const getFounderBadge = now < deadline;

    // Update profile with Plan, Rewards and Badge
    const updateData = { 
        plan: plan_id,
        level: 'Nível Base' // All start at base level as requested
    };

    // Get current profile to add rewards
    const { data: profile } = await supabase
        .from('profiles')
        .select('points, menu_cash')
        .eq('user_id', user_id)
        .single();

    if (profile) {
        updateData.points = (profile.points || 0) + rewardPoints;
        updateData.menu_cash = (profile.menu_cash || 0) + rewardCash;
        if (getFounderBadge) {
            updateData.has_founder_badge = true;
        }
    }

    await supabase.from('profiles').update(updateData).eq('user_id', user_id);

    // --- REFERRAL REWARDS LOGIC ---
    try {
        // Get subscriber's profile to find the referrer
        const { data: subscriberProfile } = await supabase
            .from('profiles')
            .select('referrer_id')
            .eq('user_id', user_id)
            .single();

        if (subscriberProfile?.referrer_id) {
            const referrerId = subscriberProfile.referrer_id;
            
            // Get Referrer Profile
            const { data: referrer } = await supabase
                .from('profiles')
                .select('points, menu_cash, level, referrals_count')
                .eq('id', referrerId)
                .single();
            
            if (referrer) {
                // Points based on subscriber plan (Values matches gamificationConfig)
                let pointsAwarded = 0;
                if (plan_id === 'basic') pointsAwarded = 100;
                else if (plan_id === 'pro') pointsAwarded = 300;
                else if (plan_id === 'full') pointsAwarded = 500;
                
                // Menu Cash % based on referrer level
                const levelPercents = {
                    'nível base': 0,
                    'bronze': 0.05,
                    'prata': 0.10,
                    'ouro': 0.15,
                    'diamante': 0.20
                };
                
                const percent = levelPercents[referrer.level?.toLowerCase()] || 0;
                
                // Plan values (Campaign prices)
                const planValues = {
                    'basic': 249,
                    'pro': 599,
                    'full': 1497
                };
                
                const subsValue = planValues[plan_id] || 0;
                const cashAwarded = subsValue * percent;
                
                // Update Referrer Profile
                await supabase.from('profiles').update({
                    points: (referrer.points || 0) + pointsAwarded,
                    menu_cash: (referrer.menu_cash || 0) + cashAwarded,
                    referrals_count: (referrer.referrals_count || 0) + 1
                }).eq('id', referrerId);
                
                // Add entry to points_history
                await supabase.from('points_history').insert({
                    user_id: referrerId,
                    action: `Indicação Plano ${plan_id.toUpperCase()} (Bônus)`,
                    points: pointsAwarded,
                    category: 'indicacao',
                    date: new Date().toISOString()
                });
                
                console.log(`Referral reward applied: Referrer ${referrerId} awarded ${pointsAwarded} pts and M$ ${cashAwarded}`);
            }
        }
    } catch (refError) {
        console.error("Error processing referral rewards:", refError);
    }
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

// Admin: Update User (Password, Email, Profile)
app.post('/api/admin/update-user', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    const { data: { user: adminUser }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !adminUser) return res.status(401).json({ error: 'Invalid token' });

    // Check if requester is admin
    const { data: adminProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', adminUser.id)
        .single();

    if (adminProfile?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const { userId, business_name, email, password, plan, level, points, role, menu_cash, has_founder_badge } = req.body;

    try {
        const updateData = {};
        if (password) updateData.password = password;
        if (email) updateData.email = email;

        // 1. Update Auth if needed
        if (Object.keys(updateData).length > 0) {
            const { error: updateAuthError } = await supabase.auth.admin.updateUserById(userId, updateData);
            if (updateAuthError) throw updateAuthError;
        }

        // 2. Update Profile
        const { error: updateProfileError } = await supabase
            .from('profiles')
            .update({
                business_name,
                email,
                plan,
                level,
                points,
                role,
                menu_cash,
                has_founder_badge,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

        if (updateProfileError) throw updateProfileError;

        // 3. Update or Create Subscription Validity if plan is not pre-cadastro
        if (plan && plan !== 'pre-cadastro') {
            await supabase.from('subscriptions').upsert({
                user_id: userId,
                plan: plan,
                status: 'active',
                current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // Default 1 year from now
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
        }

        res.json({ success: true, message: 'User updated successfully' });
    } catch (err) {
        console.error("Admin update error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Delete User
app.delete('/api/admin/delete-user', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    const { data: { user: adminUser }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !adminUser) return res.status(401).json({ error: 'Invalid token' });

    // Check if requester is admin
    const { data: adminProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', adminUser.id)
        .single();

    if (adminProfile?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const userId = req.query.userId || req.body.userId;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        // Delete from Auth (this also deletes from public tables if there are CASCADE foreign keys, 
        // but it's safer to delete profile first depending on schema)
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
        if (deleteError) throw deleteError;

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        console.error("Admin delete error:", err);
        res.status(500).json({ error: err.message });
    }
});

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
