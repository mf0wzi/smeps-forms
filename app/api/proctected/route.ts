import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/lib/supabase/server";  // Import server-side supabase client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabaseClient = await createClient();  // Create server-side Supabase client
  
  try {
    const { data: claims, error } = await supabaseClient.auth.getClaims();

    if (error) {
      return res.status(401).json({ error: "Unauthorized" });  // If no user, return unauthorized
    }

    return res.status(200).json({ message: "Protected content", claims });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}