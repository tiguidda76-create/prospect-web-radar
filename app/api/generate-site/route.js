import { NextResponse } from "next/server";
import { generateStandoutWebsiteHtml } from "@/lib/aiSiteDesigner";
import { generateWhatsAppPitch } from "@/lib/pitchGenerator";
import { updateProspectInDb } from "@/lib/supabase";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(request) {
  try {
    const prospect = await request.json();

    if (!prospect || !prospect.name) {
      return NextResponse.json(
        { success: false, error: "Prospect invalide" },
        { status: 400 }
      );
    }

    const slug = prospect.site_slug || `${slugify(prospect.name)}-${slugify(prospect.city || "maroc")}`;
    
    // 1. Génération du site web complet autonome
    const siteHtml = generateStandoutWebsiteHtml(prospect);

    // 2. URL de prévisualisation immédiate
    const previewUrl = prospect.preview_url || `/api/preview/${prospect.id || slug}`;

    // 3. Génération du pitch WhatsApp percutant
    const pitch = generateWhatsAppPitch(prospect, previewUrl);

    // 4. Mise à jour dans la base
    const updates = {
      site_slug: slug,
      site_html: siteHtml,
      preview_url: previewUrl,
      pitch_message: pitch.rawMessage,
      status: "site_generated",
    };

    const updated = await updateProspectInDb(prospect.id, updates);

    return NextResponse.json({
      success: true,
      prospect: updated || { ...prospect, ...updates },
      previewUrl,
      pitch,
    });
  } catch (error) {
    console.error("API Generate Site Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
