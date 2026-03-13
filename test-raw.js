const SUPABASE_URL = "https://hfvfetwhurrhexvawody.supabase.co";
const SUPABASE_KEY = "sb_publishable_8e-0o7GXlI9xftMW2s2Wdg_7e7os09G";

async function testRawSignup() {
  const email = `raw_test_${Date.now()}@example.com`;
  console.log(`Testing raw signup for ${email}...`);
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
        controller.abort();
    }, 15000);

    const startTime = Date.now();

    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        email: email,
        password: "password123",
        data: { name: "Raw Test User" }
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);
    
    console.log(`Time taken: ${Date.now() - startTime}ms`);
    console.log(`Status code: ${response.status}`);
    
    const text = await response.text();
    console.log(`Response text: ${text}`);

  } catch (err) {
    if (err.name === 'AbortError') {
      console.error("The fetch request timed out after 15 seconds. Supabase Auth is literally hanging.");
    } else {
      console.error("Fetch error:", err);
    }
  }
}

testRawSignup();
