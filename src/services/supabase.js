import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABSE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient(url, apiKey);

export async function getCountries() {
    const {data} = await supabase.from("countries").select();
    return data;
}