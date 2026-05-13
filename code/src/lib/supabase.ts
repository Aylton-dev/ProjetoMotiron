import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lkuowspwqkcjlfsywjmk.supabase.co/rest/v1/";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrdW93c3B3cWtjamxmc3l3am1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MTM0MDcsImV4cCI6MjA5NDE4OTQwN30.QxwPSB8GybzRWEcmVz68mio1-gvXf0ZIL1lAvaLFruo";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);