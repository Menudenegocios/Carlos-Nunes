# Supabase Setup

## 1. Environment Variables
Add these to your `.env` file in the root of the project:

```env
SUPABASE_URL=https://your-project-url.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## 2. SQL Schema (Database Setup)
Run these commands in the Supabase SQL Editor to create the necessary tables:

```sql
-- Create Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT UNIQUE NOT NULL,
  business_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  name TEXT,
  phone TEXT NOT NULL,
  source TEXT DEFAULT 'whatsapp',
  stage TEXT DEFAULT 'new',
  notes TEXT,
  created_at BIGINT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Schedule Items table
CREATE TABLE schedule_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  title TEXT,
  client TEXT,
  date TEXT,
  time TEXT,
  type TEXT DEFAULT 'servico',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create SWOT table
CREATE TABLE swot (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create SMART Goals table
CREATE TABLE smart_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Business Canva table
CREATE TABLE business_canva (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE swot ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_canva ENABLE ROW LEVEL SECURITY;

-- Create Policies (Example: Allow all for now, or restrict by user_id)
-- Note: In production, you should use auth.uid() if using Supabase Auth
CREATE POLICY "Allow public access" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow public access" ON leads FOR ALL USING (true);
CREATE POLICY "Allow public access" ON schedule_items FOR ALL USING (true);
CREATE POLICY "Allow public access" ON projects FOR ALL USING (true);
CREATE POLICY "Allow public access" ON swot FOR ALL USING (true);
CREATE POLICY "Allow public access" ON smart_goals FOR ALL USING (true);
CREATE POLICY "Allow public access" ON business_canva FOR ALL USING (true);
```

## 3. Frontend Usage Example (React)

```tsx
import { supabase } from '../services/supabaseClient';

// Fetching data
const fetchLeads = async () => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', 'your-user-id');
  
  if (error) console.error(error);
  else console.log(data);
};

// Inserting data
const addLead = async (newLead) => {
  const { data, error } = await supabase
    .from('leads')
    .insert([newLead]);
    
  if (error) console.error(error);
};
```
