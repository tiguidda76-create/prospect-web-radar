import { fetchProspectsFromDb } from "@/lib/supabase.js";
import { generateStandoutWebsiteHtml } from "@/lib/aiSiteDesigner.js";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { slug } = params;
  const prospects = await fetchProspectsFromDb();
  
  let prospect = prospects.find(
    (p) => p.site_slug === slug || p.id === slug || p.google_place_id === slug
  );

  if (!prospect) {
    const { MOCK_SCOUTED_PROSPECTS } = await import("@/lib/googlePlacesScout.js");
    prospect = MOCK_SCOUTED_PROSPECTS.find(
      (p) =>
        p.site_slug === slug ||
        p.id === slug ||
        p.google_place_id === slug ||
        p.name.toLowerCase().replace(/[^a-z0-9]/g, "-").includes(slug.toLowerCase().replace(/[^a-z0-9]/g, "-"))
    );
  }

  if (!prospect) {
    return new Response(
      `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:50px;background:#090d16;color:#fff;">
        <h2>Vitrine introuvable</h2>
        <p>Le site pour "${slug}" n'a pas encore été généré sur Radar Vitrine.</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 404 }
    );
  }

  const html = prospect.site_html || generateStandoutWebsiteHtml(prospect);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
