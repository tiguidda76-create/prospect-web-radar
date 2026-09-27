/**
 * Informations de Facturation, Contact & Catalogue de Services
 * Synchronisé avec Cabinet Hassan Tiguidda (Radar Réputation)
 * Supporte le double marché : Maroc (MAD) & France (EUR)
 */

export const AGENCY_PROFILE = {
  founder: "Hassan Tiguidda",
  agencyName: "AUTO-ENTREPRENEUR HASSAN TIGUIDDA",
  cabinet: "Cabinet Hassan Tiguidda — Marrakech",
  legalStatus: "Auto-Entrepreneur (Maroc)",
  ice: "1161674000043",
  address: "Les portes de Marrakech Zone 16 imm 118 app 03 Marrakech, Maroc",
  bankName: "Attijariwafa bank",
  rib: "007450001399370030009822",
  swiftBic: "BCMAMAMC",
  orderOf: "AUTO-ENTREPRENEUR HASSAN TIGUIDDA",
  vatNotice: "Montant en dirhams exonéré de la TVA (Art 91 - II - 1° du Code Général des Impôts)",
  vatNoticeEur: "TVA non applicable, art. 293 B du CGI ou exonération pour prestations de services internationales",
  city: "Marrakech, Maroc",
  phone: "+212 6 32 15 54 30",
  whatsappUrl: "https://wa.me/212632155430",
  email: "tiguidda76@gmail.com",
  officialWebsite: "https://radar-reputation-backend.vercel.app/agency",
};

export const PRICING_SERVICES = [
  {
    id: "vitrine_starter",
    title: "Pack Vitrine 5★ (Clé en Main)",
    subtitle: "Achat unique pour être propriétaire de son site officiel",
    badge: "0€ DE FRAIS D'ABONNEMENT",
    priceMAD: "1 490",
    priceEUR: "149",
    periodMAD: "MAD (paiement unique)",
    periodEUR: "€ (paiement unique)",
    features: [
      "Site web autonome haute conversion (Tailwind CSS)",
      "Badge officiel Google Maps 5★ synchronisé",
      "Bouton de réservation WhatsApp flottant",
      "Intégration des avis Google Maps réels",
      "Nom de domaine officiel (.ma, .com ou .fr) & SSL inclus 1 an",
      "Hébergement ultra-rapide 0 frais",
      "2 sessions de révisions gratuites incluses",
    ],
    whatsappCtaMAD: "Bonjour Hassan, je souhaite activer le Pack Vitrine 5★ (1 490 MAD en paiement unique) pour mon établissement.",
    whatsappCtaEUR: "Bonjour Hassan, je souhaite activer le Pack Vitrine 5★ (149 € en paiement unique) pour mon établissement.",
  },
  {
    id: "vitrine_monthly",
    title: "Formule Sérénité (Zéro Risque)",
    subtitle: "0 MAD / 0€ d'acompte • Mises à jour & modifications illimitées",
    badge: "LE PLUS FACILE À VENDRE",
    isPopular: true,
    priceMAD: "390",
    priceEUR: "39",
    periodMAD: "MAD / mois sans engagement",
    periodEUR: "€ / mois sans engagement",
    features: [
      "0 MAD / 0€ d'acompte à la mise en ligne (Démo déjà prête)",
      "Hébergement cloud haute performance inclus",
      "Modifications illimitées sur simple message WhatsApp",
      "Changement de menu, prix, horaires et photos sous 24h",
      "Maintenance technique & sécurité 7j/7",
      "Résiliation libre à tout moment sans préavis",
    ],
    whatsappCtaMAD: "Bonjour Hassan, je souhaite démarrer la Formule Sérénité à 390 MAD/mois sans engagement.",
    whatsappCtaEUR: "Bonjour Hassan, je souhaite démarrer la Formule Sérénité à 39 €/mois sans engagement.",
  },
  {
    id: "combo_radar",
    title: "Pack Combo : Vitrine + Radar Réputation",
    subtitle: "Site web officiel + Gestion 100% des avis Google Maps",
    badge: "MEILLEUR RETOUR SUR INVESTISSEMENT",
    priceMAD: "1 290",
    priceEUR: "149",
    periodMAD: "MAD / mois",
    periodEUR: "€ / mois",
    features: [
      "Tout le site web officiel Radar Vitrine",
      "Surveillance quotidienne 7j/7 des avis Google Maps",
      "Réponses diplomates rédigées par IA sous 2 à 4h",
      "Désamorçage des avis négatifs & contestation d'avis abusifs",
      "Rapport mensuel de réputation pour la direction",
      "Ligne directe WhatsApp dédiée avec Hassan",
    ],
    whatsappCtaMAD: "Bonjour Hassan, je souhaite souscrire au Pack Combo (Site Web + Gestion Avis Google) à 1 290 MAD/mois.",
    whatsappCtaEUR: "Bonjour Hassan, je souhaite souscrire au Pack Combo (Site Web + Gestion Avis Google) à 149 €/mois.",
  },
  {
    id: "domination_seo",
    title: "Pack Domination Google Maps & SEO",
    subtitle: "Site web + Réputation VIP + Top 3 Local Pack",
    badge: "HÔTELS, RIADS & RESTAURANTS HAUT DE GAMME",
    priceMAD: "2 290",
    priceEUR: "249",
    periodMAD: "MAD / mois",
    periodEUR: "€ / mois",
    features: [
      "Tout le Pack Combo Vitrine & Réputation",
      "Optimisation SEO Local pour viser le Top 3 Google Maps",
      "2 Google Posts optimisés par semaine (8/mois)",
      "Audit concurrentiel trimestriel approfondi",
      "Intégration QR Code Menu & Avis pour vos tables/chambres",
    ],
    whatsappCtaMAD: "Bonjour Hassan, je souhaite viser le Top 3 Google Maps avec le Pack Domination à 2 290 MAD/mois.",
    whatsappCtaEUR: "Bonjour Hassan, je souhaite viser le Top 3 Google Maps avec le Pack Domination à 249 €/mois.",
  },
];

export function buildInvoiceData({
  prospect,
  serviceId = "vitrine_starter",
  docType = "invoice", // 'invoice' | 'estimate'
  market = "morocco", // 'morocco' | 'france'
  customPrice = null,
}) {
  const service = PRICING_SERVICES.find((s) => s.id === serviceId) || PRICING_SERVICES[0];
  const isFrance = market === "france" || (prospect?.city && ["paris", "nice", "lyon", "bordeaux", "marseille"].includes(prospect.city.toLowerCase()));
  const currency = isFrance ? "EUR" : "MAD";
  const currencySymbol = isFrance ? "€" : "MAD";
  const price = customPrice || (isFrance ? service.priceEUR : service.priceMAD);
  const period = isFrance ? service.periodEUR : service.periodMAD;

  const docNumber = docType === "invoice"
    ? `FAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    : `DEV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const today = new Date();
  const dateStr = today.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const dueDate = new Date(Date.now() + 15 * 86400000).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

  return {
    docType,
    docNumber,
    dateStr,
    dueDate,
    market: isFrance ? "france" : "morocco",
    currency,
    currencySymbol,
    price,
    period,
    agency: AGENCY_PROFILE,
    client: {
      name: prospect?.name || "Client",
      address: prospect?.address || `${prospect?.city || "Marrakech"}`,
      city: prospect?.city || "Marrakech",
      phone: prospect?.phone || "",
      contact: prospect?.contact || "Direction / Gérant",
    },
    service: {
      title: service.title,
      subtitle: service.subtitle,
      features: service.features,
    },
    subtotal: `${price} ${currencySymbol}`,
    tax: isFrance ? "0.00 € (TVA non applicable)" : "0.00 MAD (Exonéré de TVA)",
    vatNotice: isFrance ? AGENCY_PROFILE.vatNoticeEur : AGENCY_PROFILE.vatNotice,
    totalNet: `${price} ${currencySymbol}`,
  };
}
