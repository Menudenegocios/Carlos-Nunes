import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignUp() {
  console.log("Starting signup test...");
  try {
    const { data, error } = await supabase.auth.signUp({
      email: `test_node_${Date.now()}@example.com`,
      password: 'password123',
    });
    
    console.log("Signup returned.");
    if (error) {
      console.error("Error:", error.message);
    } else {
      console.log("Success:", !!data.user);
    }
  } catch(e) {
    console.error("Exception:", e);
  }
}

testSignUp();
