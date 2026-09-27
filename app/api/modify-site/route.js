import { NextResponse } from "next/server";
import { applyClientRevision } from "@/lib/siteModifier.js";
import { fetchProspectsFromDb, updateProspectInDb } from "@/lib/supabase.js";
import { deployToGitHubPages } from "@/lib/githubDeployer.js";

export async function POST(request) {
  try {
    const { id, instruction } = await request.json();

    if (!id || !instruction) {
      return NextResponse.json(
        { success: false, error: "id et instruction requis" },
        { status: 400 }
      );
    }

    const prospects = await fetchProspectsFromDb();
    const prospect = prospects.find((p) => p.id === id || p.site_slug === id);

    if (!prospect || !prospect.site_html) {
      return NextResponse.json(
        { success: false, error: "Prospect ou site initial introuvable" },
        { status: 404 }
      );
    }

    // 1. Appliquer les modifications via l'Agent IA
    const updatedHtml = await applyClientRevision({
      currentHtml: prospect.site_html,
      clientInstruction: instruction,
      venueName: prospect.name,
    });

    // 2. Mettre à jour la base
    const updates = {
      site_html: updatedHtml,
      updated_at: new Date().toISOString(),
    };

    const updated = await updateProspectInDb(prospect.id, updates);

    // 3. Si déjà déployé sur GitHub Pages, re-pousser automatiquement
    if (prospect.status === "deployed" || prospect.status === "pitched") {
      try {
        await deployToGitHubPages({
          slug: prospect.site_slug || `site-${prospect.id}`,
          htmlContent: updatedHtml,
          commitMessage: `chore(revision): client requested update - ${instruction.slice(0, 50)}`,
        });
      } catch (deployErr) {
        console.warn("Erreur auto-deploy revision GitHub:", deployErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Modifications appliquées avec succès !",
      prospect: updated || { ...prospect, ...updates },
    });
  } catch (error) {
    console.error("API Modify Site Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
