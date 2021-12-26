import { createClient } from "@supabase/supabase-js";
import Vue from "vue";
const supabaseUrl = "https://dtyitkcldrdnhwwcqdzt.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxOTQ0NDY2OCwiZXhwIjoxOTM1MDIwNjY4fQ._-ThIFzoL9ELCR6lmuV3yUg69eYT15RtEkZ5KHWeuag";
const supabase = createClient(supabaseUrl, supabaseKey);

Vue.prototype.$supabase = supabase;

export default supabase;
