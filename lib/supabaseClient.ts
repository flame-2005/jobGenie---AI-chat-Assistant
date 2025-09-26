// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://qzlpurmgzixbnbwwzzdw.supabase.co",
  " eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bHB1cm1neml4Ym5id3d6emR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODAxODcsImV4cCI6MjA3NDQ1NjE4N30.fYtBqHe2s8GDRWtmLNVF7Lppf2HOuJaAhKZFWmsyGbw"
);
