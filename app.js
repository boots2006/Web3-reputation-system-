import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔥 CONNECTION SUPABASE
const supabase = createClient(
  "https://ykqxpfcseuybgawbonyb.supabase.co",
  "sb_publishable_nY9p1a2Wqw7Dv-ChfamsHw_wMyL_97E"
);

// TEST CONNEXION
console.log("Supabase connecté !");
