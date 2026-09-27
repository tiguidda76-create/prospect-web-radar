/**
 * Générateur de messages d'approche (Pitch "Show, Don't Tell")
 * Met en valeur la note Google Maps et offre le lien direct de la maquette
 */
export function generateWhatsAppPitch(prospect, previewUrl) {
  const {
    name,
    city = "Marrakech",
    rating = 4.9,
    review_count = 85,
    top_reviews = [],
    phone = "",
  } = prospect;

  const topQuote = top_reviews[0]?.text
    ? `« ${top_reviews[0].text.slice(0, 80)}... »`
    : "la qualité de votre accueil";

  const slug = prospect.site_slug || `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${city.toLowerCase()}`;
  const publicBase = process.env.NEXT_PUBLIC_SITE_URL || "https://radar-vitrines.vercel.app";
  
  let cleanPreviewUrl = previewUrl || `${publicBase}/v/${slug}`;
  if (cleanPreviewUrl.startsWith("/")) {
    cleanPreviewUrl = `${publicBase}${cleanPreviewUrl}`;
  } else if (cleanPreviewUrl.includes("localhost")) {
    cleanPreviewUrl = cleanPreviewUrl.replace(/http:\/\/localhost:[0-9]+/, publicBase);
  }

  const message = `Bonjour l'équipe de *${name}* 👋

Félicitations pour votre note remarquable de *${rating}⭐* sur Google Maps (${review_count} avis clients vérifiés) ! Vos clients adorent votre accueil, notamment pour ${topQuote}.

En consultant votre fiche à ${city}, nous avons remarqué que vous n'avez pas encore de site internet officiel. De nombreux touristes et clients hésitent ou ne trouvent pas votre contact direct.

Pour vous aider, nous avons préparé *gratuitement* un aperçu interactif de votre futur site officiel :
👉 ${cleanPreviewUrl}

✨ Vos avis Google y sont déjà synchronisés et vos clients peuvent réserver directement en 1 clic sur WhatsApp.

Dites-nous ce que vous en pensez !
Bien cordialement,
L'équipe Radar Vitrine`;

  const cleanPhone = (phone || "").replace(/[^0-9+]/g, "");
  let waNumber = cleanPhone.startsWith("+") ? cleanPhone.replace("+", "") : `212${cleanPhone.replace(/^0/, "")}`;
  if (!waNumber || waNumber === "212") waNumber = "";

  const encodedMessage = encodeURIComponent(message);
  const waClickUrl = waNumber ? `https://wa.me/${waNumber}?text=${encodedMessage}` : null;

  return {
    rawMessage: message,
    encodedMessage,
    waNumber,
    waClickUrl,
  };
}
