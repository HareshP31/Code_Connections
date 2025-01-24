import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

console.log("Supabase URL:", URL);
console.log("Supabase API Key:", API_KEY);


export const supabase = createClient(URL, API_KEY);
