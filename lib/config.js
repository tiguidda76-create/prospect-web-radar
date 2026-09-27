// Configuration partagée
export const CONFIG = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || "",
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || "",
  GITHUB_REPO_OWNER: process.env.GITHUB_REPO_OWNER || "",
  GITHUB_REPO_NAME: process.env.GITHUB_REPO_NAME || "prospect-sites",
};
