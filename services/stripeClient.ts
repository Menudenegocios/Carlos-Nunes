import { loadStripe } from '@stripe/stripe-js';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';

export const getStripe = () => {
  if (!stripePublicKey) {
    console.error('Stripe Public Key is missing! Please set VITE_STRIPE_PUBLIC_KEY in your environment variables.');
    return null;
  }
  return loadStripe(stripePublicKey);
};
