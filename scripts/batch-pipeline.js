/**
 * Batch Pipeline Runner
 * Permet d'exécuter l'ensemble du tunnel directement en ligne de commande :
 * 1. Scan Google Maps (Filtre: 5★ sans site web)
 * 2. Génération automatique des sites par l'IA
 * 3. Génération des scripts et liens WhatsApp
 * 
 * Usage: node scripts/batch-pipeline.js --city="Marrakech" --category="Restaurant"
 */

const { searchProspectsOnGoogle } = require("../lib/googlePlacesScout");
const { generateStandoutWebsiteHtml } = require("../lib/aiSiteDesigner");
const { generateWhatsAppPitch } = require("../lib/pitchGenerator");
const { saveProspectsToDb, fetchProspectsFromDb, updateProspectInDb } = require("../lib/supabase");
const fs = require("fs");
const path = require("path");

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function runPipeline() {
  const args = process.argv.slice(2);
  const cityArg = args.find((a) => a.startsWith("--city="))?.split("=")[1] || "Marrakech";
  const categoryArg = args.find((a) => a.startsWith("--category="))?.split("=")[1] || "Restaurant";
  const minRating = 4.7;

  console.log(`\n🎯 1. Scan Google Maps pour [${categoryArg}] à [${cityArg}] (Note >= ${minRating}★ sans site web)...`);
  
  const prospects = await searchProspectsOnGoogle({
    city: cityArg,
    category: categoryArg,
    minRating,
    minReviews: 10,
  });

  console.log(`✅ ${prospects.length} établissements trouvés sans site web !`);

  // Sauvegarde dans la base locale / Supabase
  await saveProspectsToDb(prospects);

  // Dossier pour exporter les sites HTML
  const exportDir = path.join(process.cwd(), "exported-sites");
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  console.log("\n⚡ 2. Génération des sites haute conversion par l'Agent Designer...");
  const results = [];

  for (const prospect of prospects) {
    const slug = `${slugify(prospect.name)}-${slugify(prospect.city || "maroc")}`;
    const html = generateStandoutWebsiteHtml(prospect);
    
    // Sauvegarde du fichier HTML local
    const siteFolder = path.join(exportDir, slug);
    if (!fs.existsSync(siteFolder)) {
      fs.mkdirSync(siteFolder, { recursive: true });
    }
    fs.writeFileSync(path.join(siteFolder, "index.html"), html, "utf-8");

    const previewUrl = `/api/preview/${prospect.id || slug}`;
    const pitch = generateWhatsAppPitch(prospect, `http://localhost:3005${previewUrl}`);

    await updateProspectInDb(prospect.id, {
      site_slug: slug,
      site_html: html,
      preview_url: previewUrl,
      pitch_message: pitch.rawMessage,
      status: "site_generated",
    });

    results.push({
      name: prospect.name,
      rating: prospect.rating,
      reviews: prospect.review_count,
      phone: prospect.phone,
      previewUrl: `http://localhost:3005${previewUrl}`,
      waClickUrl: pitch.waClickUrl,
    });

    console.log(`  ✓ Site généré pour : ${prospect.name} (★ ${prospect.rating}) -> exported-sites/${slug}/index.html`);
  }

  console.log("\n💬 3. Récapitulatif des Prospects Prêts à Contacter :");
  console.table(
    results.map((r) => ({
      Établissement: r.name,
      Note: `${r.rating}★ (${r.reviews})`,
      Téléphone: r.phone || "Non renseigné",
      "Lien Démo": r.previewUrl,
    }))
  );

  console.log("\n✨ Tous les sites sont enregistrés dans ./exported-sites/ et disponibles sur http://localhost:3005 !");
}

runPipeline().catch(console.error);
