import { createClient } from "@supabase/supabase-js";


const supabaseUrl = "https://durpcnqgnjhzyenmqmgo.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1cnBjbnFnbmpoenllbm1xbWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjI5NDYsImV4cCI6MjA3MTA5ODk0Nn0._Jno5wGF0NVMVR5Gk4vD7_0uia_mABf_yc95B2tDPCE";


export const supabase = createClient(supabaseUrl, supabaseAnonKey);
