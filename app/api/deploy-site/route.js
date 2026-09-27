import { NextResponse } from "next/server";
import { deployToGitHubPages } from "@/lib/githubDeployer";
import { generateWhatsAppPitch } from "@/lib/pitchGenerator";
import { updateProspectInDb } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { prospect } = await request.json();

    if (!prospect || !prospect.site_html) {
      return NextResponse.json(
        { success: false, error: "Le site n'a pas encore été généré. Veuillez d'abord cliquer sur Générer." },
        { status: 400 }
      );
    }

    const slug = prospect.site_slug || `site-${prospect.id}`;
    
    // Déploiement GitHub Pages
    const deployResult = await deployToGitHubPages({
      slug,
      htmlContent: prospect.site_html,
      commitMessage: `feat(site): deploy official showcase for ${prospect.name}`,
    });

    const liveUrl = deployResult.liveUrl;

    // Regénérer le pitch avec le vrai lien live déployé
    const pitch = generateWhatsAppPitch(prospect, liveUrl);

    const updates = {
      preview_url: liveUrl,
      github_repo_path: deployResult.path || "",
      pitch_message: pitch.rawMessage,
      status: "deployed",
    };

    const updated = await updateProspectInDb(prospect.id, updates);

    return NextResponse.json({
      success: true,
      deployResult,
      liveUrl,
      pitch,
      prospect: updated || { ...prospect, ...updates },
    });
  } catch (error) {
    console.error("API Deploy Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
