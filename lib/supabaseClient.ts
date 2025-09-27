import { createClient } from "@supabase/supabase-js";

let supabaseUrl;
let supabaseAnonKey;

if(process.env.NEXT_PUBLIC_MODE === "WEBAPP"){
 supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
 supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}
else{

    supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
   supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

if (!supabaseUrl) throw new Error("supabaseUrl is required");
if (!supabaseAnonKey) throw new Error("supabaseAnonKey is required");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
