/**
 * Informations de Facturation, Contact & Catalogue de Services
 * Synchronisé avec Cabinet Hassan Tiguidda (Radar Réputation)
 */

export const AGENCY_PROFILE = {
  founder: "Hassan Tiguidda",
  cabinet: "Cabinet Hassan Tiguidda — Marrakech",
  city: "Marrakech, Maroc",
  phone: "+212 6 32 15 54 30",
  whatsappUrl: "https://wa.me/212632155430",
  email: "contact@radar-reputation.com",
  officialWebsite: "https://radar-reputation-backend.vercel.app/agency",
};

export const PRICING_SERVICES = [
  {
    id: "vitrine_starter",
    title: "Pack Vitrine 5★ (Clé en Main)",
    subtitle: "Achat unique pour être propriétaire de son site officiel",
    badge: "0€ DE FRAIS D'ABONNEMENT",
    price: "1 490",
    currency: "MAD",
    period: "paiement unique (~149 €)",
    features: [
      "Site web autonome haute conversion (Tailwind CSS)",
      "Badge officiel Google Maps 5★ synchronisé",
      "Bouton de réservation WhatsApp flottant",
      "Intégration des avis Google Maps réels",
      "Nom de domaine officiel (.ma ou .com) & SSL inclus 1 an",
      "Hébergement ultra-rapide 0 frais",
      "2 sessions de révisions gratuites incluses",
    ],
    whatsappCta: "Bonjour Hassan, je souhaite activer le Pack Vitrine 5★ (1 490 MAD en paiement unique) pour mon établissement.",
  },
  {
    id: "vitrine_monthly",
    title: "Formule Sérénité (Zéro Risque)",
    subtitle: "0 MAD d'acompte • Mises à jour & modifications illimitées",
    badge: "LE PLUS FACILE À VENDRE",
    isPopular: true,
    price: "390",
    currency: "MAD",
    period: "/ mois sans engagement (~39 €)",
    features: [
      "0 MAD d'acompte à la mise en ligne (Démo déjà prête)",
      "Hébergement cloud haute performance inclus",
      "Modifications illimitées sur simple message WhatsApp",
      "Changement de menu, prix, horaires et photos sous 24h",
      "Maintenance technique & sécurité 7j/7",
      "Résiliation libre à tout moment sans préavis",
    ],
    whatsappCta: "Bonjour Hassan, je souhaite démarrer la Formule Sérénité à 390 MAD/mois sans engagement.",
  },
  {
    id: "combo_radar",
    title: "Pack Combo : Vitrine + Radar Réputation",
    subtitle: "Site web officiel + Gestion 100% des avis Google Maps",
    badge: "MEILLEUR RETOUR SUR INVESTISSEMENT",
    price: "1 290",
    currency: "MAD",
    period: "/ mois (~129 €)",
    features: [
      "Tout le site web officiel Radar Vitrine",
      "Surveillance quotidienne 7j/7 des avis Google Maps",
      "Réponses diplomates rédigées par IA sous 2 à 4h",
      "Désamorçage des avis négatifs & contestation d'avis abusifs",
      "Rapport mensuel de réputation pour la direction",
      "Ligne directe WhatsApp dédiée avec Hassan",
    ],
    whatsappCta: "Bonjour Hassan, je souhaite souscrire au Pack Combo (Site Web + Gestion Avis Google) à 1 290 MAD/mois.",
  },
  {
    id: "domination_seo",
    title: "Pack Domination Google Maps & SEO",
    subtitle: "Site web + Réputation VIP + Top 3 Local Pack Marrakech",
    badge: "HÔTELS & RESTAURANTS HAUT DE GAMME",
    price: "2 290",
    currency: "MAD",
    period: "/ mois (~229 €)",
    features: [
      "Tout le Pack Combo Vitrine & Réputation",
      "Optimisation SEO Local pour viser le Top 3 Google Maps",
      "2 Google Posts optimisés par semaine (8/mois)",
      "Audit concurrentiel trimestriel approfondi",
      "Intégration QR Code Menu & Avis pour vos tables/chambres",
    ],
    whatsappCta: "Bonjour Hassan, je souhaite viser le Top 3 Google Maps avec le Pack Domination à 2 290 MAD/mois.",
  },
];
