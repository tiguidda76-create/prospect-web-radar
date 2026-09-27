/**
 * Générateur de messages d'approche multi-canaux (WhatsApp & Email B2B)
 * Supporte le Marché Maroc (MAD) et le Marché France (EUR €)
 * Adapté de l'architecture radar-backend
 */

export function formatPhoneNumber(phone, cityOrCountry = "Maroc") {
  if (!phone) return "";
  const cleaned = phone.replace(/[^0-9+]/g, "");
  if (!cleaned) return "";

  if (cleaned.startsWith("+")) {
    return cleaned.replace("+", "");
  }
  if (cleaned.startsWith("00")) {
    return cleaned.substring(2);
  }

  const isFrench =
    typeof cityOrCountry === "string" &&
    (cityOrCountry.toLowerCase().includes("france") ||
      cityOrCountry.toLowerCase().includes("paris") ||
      cityOrCountry.toLowerCase().includes("nice") ||
      cityOrCountry.toLowerCase().includes("lyon") ||
      cityOrCountry.toLowerCase().includes("bordeaux") ||
      cityOrCountry.toLowerCase().includes("marseille") ||
      cityOrCountry.toLowerCase().includes("lille"));

  if (cleaned.startsWith("0")) {
    const withoutZero = cleaned.substring(1);
    return isFrench ? `33${withoutZero}` : `212${withoutZero}`;
  }

  if (cleaned.startsWith("33") || cleaned.startsWith("212")) {
    return cleaned;
  }

  return isFrench ? `33${cleaned}` : `212${cleaned}`;
}

export function generateWhatsAppPitch(prospect, previewUrl, forceMarket = null) {
  const {
    name,
    city = "Marrakech",
    country = "Maroc",
    rating = 4.9,
    review_count = 85,
    top_reviews = [],
    phone = "",
  } = prospect;

  const isFrench =
    forceMarket === "france" ||
    (!forceMarket &&
      (country?.toLowerCase().includes("france") ||
        ["paris", "nice", "lyon", "bordeaux", "marseille", "lille"].some((c) =>
          city.toLowerCase().includes(c)
        )));

  const topQuote = top_reviews[0]?.text
    ? `« ${top_reviews[0].text.slice(0, 90)}... »`
    : "la qualité de votre service et votre accueil";

  const slug =
    prospect.site_slug ||
    `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${city.toLowerCase()}`;
  const publicBase =
    process.env.NEXT_PUBLIC_SITE_URL || "https://radar-vitrines.vercel.app";

  let cleanPreviewUrl = previewUrl || `${publicBase}/v/${slug}`;
  if (cleanPreviewUrl.startsWith("/")) {
    cleanPreviewUrl = `${publicBase}${cleanPreviewUrl}`;
  } else if (cleanPreviewUrl.includes("localhost")) {
    cleanPreviewUrl = cleanPreviewUrl.replace(/http:\/\/localhost:[0-9]+/, publicBase);
  }

  // --- MESSAGE WHATSAPP ---
  let message = "";
  if (isFrench) {
    message = `Bonjour l'équipe de *${name}* 👋

Félicitations pour votre excellente note de *${rating}⭐* sur Google Maps (${review_count} avis clients) ! Vos clients saluent particulièrement ${topQuote}.

En découvrant votre établissement à ${city}, nous avons remarqué que vous n'avez pas encore de site officiel dédié. De nombreux clients de quartier ou de passage hésitent ou cherchent vos coordonnées directes.

Pour vous aider, nous avons conçu *sans frais* un aperçu interactif de votre futur site officiel vitrine :
👉 ${cleanPreviewUrl}

✨ Vos avis Google y sont déjà synchronisés, vos horaires et votre contact direct sont intégrés en 1 clic.

Qu'en pensez-vous ?
Bien cordialement,
L'équipe Radar Vitrine`;
  } else {
    message = `Bonjour l'équipe de *${name}* 👋

Félicitations pour votre note remarquable de *${rating}⭐* sur Google Maps (${review_count} avis clients vérifiés) ! Vos clients adorent votre accueil, notamment pour ${topQuote}.

En consultant votre fiche à ${city}, nous avons remarqué que vous n'avez pas encore de site internet officiel. De nombreux touristes et clients hésitent ou ne trouvent pas votre contact direct.

Pour vous aider, nous avons préparé *gratuitement* un aperçu interactif de votre futur site officiel :
👉 ${cleanPreviewUrl}

✨ Vos avis Google y sont déjà synchronisés et vos clients peuvent réserver directement en 1 clic sur WhatsApp.

Dites-nous ce que vous en pensez !
Bien cordialement,
L'équipe Radar Vitrine`;
  }

  // --- OUTREACH COLD EMAIL B2B (Particulièrement efficace pour le marché français) ---
  const emailSubject = `Site officiel & valorisation de vos ${review_count} avis Google — ${name} 📍`;
  const emailBody = `Bonjour,

Félicitations pour votre note de ${rating}⭐ sur Google Maps (${review_count} avis vérifiés) à ${city}. Vos clients recommandent chaleureusement votre établissement, notamment pour ${topQuote}.

En consultant votre fiche Google, nous avons remarqué qu'aucun site internet officiel n'y est associé. Cela prive votre établissement de nombreuses réservations directes de clients qui préfèrent consulter un site avant de se déplacer.

Pour vous permettre de visualiser le potentiel, notre studio a développé gratuitement une maquette interactive dédiée à votre établissement :
👉 ${cleanPreviewUrl}

Ce site intègre d'ores et déjà :
- La synchronisation de vos meilleurs avis Google Maps
- Vos coordonnées, carte d'accès et boutons de contact direct
- Une expérience ultra-rapide optimisée sur smartphone (0 frais d'hébergement)

Seriez-vous ouvert à ce que nous vous transférions la propriété de ce site ?

Restant à votre entière disposition,

Bien cordialement,
Hassan Tiguidda
Cabinet Hassan Tiguidda — Radar Vitrine
WhatsApp / Tél : +212 6 32 15 54 30
Email : tiguidda76@gmail.com`;

  const waNumber = formatPhoneNumber(phone, isFrench ? "France" : city);
  const encodedMessage = encodeURIComponent(message);
  const encodedEmailSubject = encodeURIComponent(emailSubject);
  const encodedEmailBody = encodeURIComponent(emailBody);

  // URLs WhatsApp multi-plateformes
  const waAppUrl = waNumber
    ? `whatsapp://send?phone=${waNumber}&text=${encodedMessage}`
    : null;
  const waApiUrl = waNumber
    ? `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodedMessage}`
    : null;
  const waWebUrl = waNumber
    ? `https://web.whatsapp.com/send?phone=${waNumber}&text=${encodedMessage}`
    : null;
  const waClickUrl = waNumber
    ? `https://wa.me/${waNumber}?text=${encodedMessage}`
    : null;

  // URL Mailto pour ouverture immédiate dans Gmail/Outlook
  const mailtoUrl = `mailto:${prospect.email || ""}?subject=${encodedEmailSubject}&body=${encodedEmailBody}`;

  return {
    isFrench,
    market: isFrench ? "france" : "morocco",
    rawMessage: message,
    encodedMessage,
    waNumber,
    waAppUrl,
    waApiUrl,
    waWebUrl,
    waClickUrl,
    emailSubject,
    emailBody,
    mailtoUrl,
  };
}
