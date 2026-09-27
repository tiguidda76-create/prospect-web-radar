import { fetchProspectsFromDb } from "@/lib/supabase";
import { generateStandoutWebsiteHtml } from "@/lib/aiSiteDesigner";

export async function GET(request, { params }) {
  const { id } = params;
  const prospects = await fetchProspectsFromDb();
  let prospect = prospects.find(
    (p) => p.id === id || p.site_slug === id || p.google_place_id === id
  );

  // Si pas trouvé dans la base ou le cache, chercher dans les mocks
  if (!prospect) {
    const { MOCK_SCOUTED_PROSPECTS } = await import("@/lib/googlePlacesScout");
    prospect = MOCK_SCOUTED_PROSPECTS.find(
      (p) => p.id === id || p.google_place_id === id || p.name.toLowerCase().includes(id.toLowerCase())
    );
  }

  if (!prospect) {
    return new Response(
      `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:50px;background:#09090b;color:#fff;">
        <h2>Aperçu non disponible</h2>
        <p>Le site pour cet établissement n'a pas encore été généré.</p>
      </body></html>`,
      {
        headers: { "Content-Type": "text/html; charset=utf-8" },
        status: 404,
      }
    );
  }

  const html = prospect.site_html || generateStandoutWebsiteHtml(prospect);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
