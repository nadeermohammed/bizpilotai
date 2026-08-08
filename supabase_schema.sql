-- BizPilot AI SaaS Database Schema Initialization
-- Copy and paste this script into your Supabase project's SQL Editor (https://supabase.com)

-- 1. INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.invoices (
    id text PRIMARY KEY,
    invoice_number text,
    client_name text NOT NULL,
    client_email text,
    client_address text,
    invoice_date text,
    gst_rate numeric DEFAULT 18,
    items jsonb DEFAULT '[]'::jsonb,
    subtotal numeric DEFAULT 0,
    gst_amount numeric DEFAULT 0,
    total numeric DEFAULT 0,
    created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- 2. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS public.expenses (
    id text PRIMARY KEY,
    "desc" text NOT NULL,
    amount numeric NOT NULL DEFAULT 0,
    category text NOT NULL,
    created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- 3. QUOTATIONS TABLE
CREATE TABLE IF NOT EXISTS public.quotations (
    id text PRIMARY KEY,
    client_name text NOT NULL,
    client_company text,
    project_name text NOT NULL,
    quote_validity text DEFAULT '30 Days',
    timeline text DEFAULT '4 Weeks',
    deliverables jsonb DEFAULT '[]'::jsonb,
    total_cost numeric DEFAULT 0,
    created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- 4. RESUMES TABLE
CREATE TABLE IF NOT EXISTS public.resumes (
    id text PRIMARY KEY,
    personal jsonb DEFAULT '{}'::jsonb,
    skills text,
    experience jsonb DEFAULT '[]'::jsonb,
    education jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Row Level Security Configuration
-- For ease of testing in development, you can disable RLS. Alternatively, enable public insert/read policies below:

ALTER TABLE public.invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes DISABLE ROW LEVEL SECURITY;

-- If you want to enable Row Level Security, uncomment the lines below to allow open anonymous access:
-- ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public access to invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);
-- ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public access to expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);
-- ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public access to quotations" ON public.quotations FOR ALL USING (true) WITH CHECK (true);
-- ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public access to resumes" ON public.resumes FOR ALL USING (true) WITH CHECK (true);
