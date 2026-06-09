import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uzqegwgichtyzyyeuuem.supabase.co";
const supabaseKey = "sb_publishable_kAJJn1RzVg-pRNoLbRoT5Q_YkTho62D";

export const supabase = createClient(supabaseUrl, supabaseKey);