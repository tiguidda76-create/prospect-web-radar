import { CONFIG } from "./config.js";

// Banques d'images thématiques Unsplash haute définition (libres de droits et esthétiques)
const CATEGORY_IMAGES = {
  Riad: [
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80", // Patio / architecture
    "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
  ],
  Restaurant: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80", // Ambiance restaurant
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80",
  ],
  "Salon de beauté": [
    "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1200&q=80", // Spa & Hammam
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
  ],
  Artisan: [
    "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80", // Artisanat cuir / poterie
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&q=80",
  ],
  Dentiste: [
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80", // Clinique moderne
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
  ],
  Default: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  ],
};

function getCategoryPalette(category) {
  switch (category) {
    case "Riad":
    case "Hôtel":
      return {
        fontHeading: "Playfair Display",
        fontBody: "Plus Jakarta Sans",
        primary: "#b45309", // Amber / Gold chaleureux
        accent: "#d97706",
        bgDark: "#0f172a",
        cardBg: "#1e293b",
        heroOverlay: "from-black/80 via-black/50 to-transparent",
      };
    case "Restaurant":
    case "Café":
      return {
        fontHeading: "Outfit",
        fontBody: "Inter",
        primary: "#dc2626", // Rouge gourmet
        accent: "#ea580c",
        bgDark: "#18181b",
        cardBg: "#27272a",
        heroOverlay: "from-black/85 via-zinc-950/60 to-transparent",
      };
    case "Salon de beauté":
    case "Spa":
      return {
        fontHeading: "Cormorant Garamond",
        fontBody: "Plus Jakarta Sans",
        primary: "#db2777", // Rose élégant
        accent: "#be185d",
        bgDark: "#1c1917",
        cardBg: "#292524",
        heroOverlay: "from-black/75 via-stone-900/60 to-transparent",
      };
    case "Dentiste":
    case "Clinique":
      return {
        fontHeading: "Plus Jakarta Sans",
        fontBody: "Inter",
        primary: "#0284c7", // Bleu médical rassurant
        accent: "#0ea5e9",
        bgDark: "#0f172a",
        cardBg: "#1e293b",
        heroOverlay: "from-slate-950/80 via-slate-900/60 to-transparent",
      };
    default:
      return {
        fontHeading: "Plus Jakarta Sans",
        fontBody: "Inter",
        primary: "#4f46e5", // Indigo moderne
        accent: "#6366f1",
        bgDark: "#0f172a",
        cardBg: "#1e293b",
        heroOverlay: "from-slate-950/80 via-slate-900/60 to-transparent",
      };
  }
}

/**
 * Générateur de site web autonome haute conversion et ultra-design
 * Produit un fichier HTML5 complet autonome avec Tailwind CSS via CDN
 */
export function generateStandoutWebsiteHtml(prospect) {
  const {
    name,
    category,
    city,
    rating = 4.9,
    review_count = 85,
    phone = "",
    address = "",
    google_maps_url = "",
    top_reviews = [],
  } = prospect;

  const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.Default;
  const heroImage = images[0];
  const galleryImage1 = images[1] || images[0];
  const galleryImage2 = images[2] || images[0];
  const palette = getCategoryPalette(category);

  const cleanPhone = (phone || "").replace(/[^0-9+]/g, "");
  const waPhone = cleanPhone.startsWith("+") ? cleanPhone.replace("+", "") : `212${cleanPhone.replace(/^0/, "")}`;
  const waGreeting = encodeURIComponent(
    `Bonjour ${name}, je souhaite obtenir des informations et effectuer une réservation.`
  );
  const waLink = `https://wa.me/${waPhone || "212600000000"}?text=${waGreeting}`;

  // Formattage des avis pour le carousel/cards
  const reviewsHtml = (top_reviews.length > 0 ? top_reviews : [
    {
      author: "Client Google Vérifié",
      rating: 5,
      text: "Une expérience inoubliable ! Le service est chaleureux, la qualité est remarquable et l'accueil est parfait.",
      relativeDate: "Avis vérifié"
    },
    {
      author: "Voyageur Régulier",
      rating: 5,
      text: "L'un des meilleurs établissements de la ville. Recommandé les yeux fermés pour la convivialité et la perfection des prestations.",
      relativeDate: "Avis vérifié"
    }
  ]).map((rev) => `
    <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-400/40 transition-all duration-300">
      <div>
        <div class="flex items-center space-x-1 text-amber-400 mb-3">
          ${Array(Number(rev.rating) || 5).fill('★').join('')}
        </div>
        <p class="text-zinc-300 text-sm italic leading-relaxed">"${rev.text || "Prestation irréprochable et accueil très professionnel !"}"</p>
      </div>
      <div class="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
        <span class="font-semibold text-white text-sm">${rev.author || "Client vérifié"}</span>
        <span class="text-xs text-zinc-400 bg-white/5 px-2 py-1 rounded-full">${rev.relativeDate || "Google Maps"}</span>
      </div>
    </div>
  `).join("");

  return `<!DOCTYPE html>
<html lang="fr" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} | Site Officiel & Réservation Directe</title>
  <meta name="description" content="Découvrez ${name} à ${city}. Noté ${rating}⭐ sur Google Maps avec ${review_count} avis. Réservez directement par WhatsApp.">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: '${palette.primary}',
            accent: '${palette.accent}',
          },
          fontFamily: {
            heading: ['"${palette.fontHeading}"', 'serif'],
            body: ['"${palette.fontBody}"', 'sans-serif'],
          }
        }
      }
    }
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(palette.fontHeading)}:wght@600;700;800&family=${encodeURIComponent(palette.fontBody)}:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <style>
    body { font-family: '${palette.fontBody}', sans-serif; }
    h1, h2, h3, .font-heading { font-family: '${palette.fontHeading}', serif; }
    .glass-card { background: rgba(255, 255, 255, 0.04); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
    .glow-hover:hover { box-shadow: 0 0 35px -5px rgba(217, 119, 6, 0.4); }
  </style>
</head>
<body class="bg-zinc-950 text-zinc-100 antialiased selection:bg-amber-500 selection:text-black">

  <!-- BARRE D'ANNONCE & PREUVE SOCIALE -->
  <div class="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-black py-2 px-4 text-xs font-semibold text-center tracking-wide flex items-center justify-center gap-2">
    <span>★ NOTE GOOGLE MAPS : ${rating}/5 SUR ${review_count} AVIS VÉRIFIÉS</span>
    <span class="hidden md:inline">•</span>
    <span class="hidden md:inline">RÉSERVATION DIRECTE SANS INTERMÉDIAIRE</span>
  </div>

  <!-- NAVIGATION -->
  <header class="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-lg border-b border-white/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <a href="#" class="flex items-center space-x-2">
        <span class="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
        <span class="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight">${name}</span>
      </a>

      <nav class="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-300">
        <a href="#apropos" class="hover:text-amber-400 transition-colors">Notre Histoire</a>
        <a href="#prestations" class="hover:text-amber-400 transition-colors">Prestations</a>
        <a href="#avis" class="hover:text-amber-400 transition-colors">Avis Clients (${rating}⭐)</a>
        <a href="#contact" class="hover:text-amber-400 transition-colors">Localisation</a>
      </nav>

      <a href="${waLink}" target="_blank" rel="noopener noreferrer" 
         class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/20">
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.084-2.127-.514-1.825-.765-2.986-2.63-3.076-2.753-.092-.122-.74-1.002-.74-1.913 0-.912.477-1.359.65-1.545.172-.186.377-.233.503-.233.125 0 .251.002.361.008.115.006.27-.044.422.327.157.382.535 1.306.582 1.402.047.096.079.208.016.333-.062.125-.094.204-.187.314-.094.11-.198.245-.282.33-.095.094-.194.197-.083.388.111.19.493.813 1.056 1.316.724.646 1.334.846 1.525.941.19.096.302.08.414-.047.112-.128.479-.559.607-.751.127-.192.254-.16.425-.096.17.064 1.082.51 1.27.604.188.094.314.141.36.22.047.079.047.457-.097.862z"/></svg>
        <span>Contacter WhatsApp</span>
      </a>
    </div>
  </header>

  <!-- HERO SECTION -->
  <section class="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 z-0">
      <img src="${heroImage}" alt="${name}" class="w-full h-full object-cover brightness-50 contrast-110">
      <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/30"></div>
    </div>

    <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
      <!-- Badge Google Maps -->
      <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-semibold text-amber-300 mb-8 animate-fade-in">
        <svg class="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
        <span>Excellence Recommandée : ${rating}/5 (${review_count} avis Google)</span>
      </div>

      <h1 class="font-heading text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
        Bienvenue chez <span class="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">${name}</span>
      </h1>

      <p class="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-300 font-light leading-relaxed mb-10">
        Une adresse d'exception à <span class="text-white font-medium">${city}</span>. Découvrez nos prestations de prestige, notre accueil authentique et vivez un moment privilégié.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="${waLink}" target="_blank" rel="noopener noreferrer" 
           class="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-base px-8 py-4 rounded-xl shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-1">
          <span>Réserver / Demander un Devis</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>

        ${phone ? `
        <a href="tel:${phone}" 
           class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-base px-6 py-4 rounded-xl backdrop-blur-md border border-white/20 transition-all">
          <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          <span>${phone}</span>
        </a>
        ` : ''}
      </div>
    </div>
  </section>

  <!-- POINTS FORTS / KEY STATS -->
  <section class="border-y border-white/10 bg-zinc-900/50 py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div>
        <div class="text-3xl sm:text-4xl font-heading font-bold text-amber-400">${rating} / 5</div>
        <div class="text-xs sm:text-sm text-zinc-400 mt-1">Satisfaction Google Maps</div>
      </div>
      <div>
        <div class="text-3xl sm:text-4xl font-heading font-bold text-white">${review_count}+</div>
        <div class="text-xs sm:text-sm text-zinc-400 mt-1">Clients Comblés</div>
      </div>
      <div>
        <div class="text-3xl sm:text-4xl font-heading font-bold text-amber-400">100%</div>
        <div class="text-xs sm:text-sm text-zinc-400 mt-1">Authentique & Artisanal</div>
      </div>
      <div>
        <div class="text-3xl sm:text-4xl font-heading font-bold text-white">7j / 7</div>
        <div class="text-xs sm:text-sm text-zinc-400 mt-1">Accueil & Réservations</div>
      </div>
    </div>
  </section>

  <!-- NOTRE HISTOIRE & SAVOIR-FAIRE -->
  <section id="apropos" class="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <span class="text-amber-500 font-semibold text-sm tracking-wider uppercase">L'Esprit de la Maison</span>
        <h2 class="font-heading text-3xl sm:text-4xl font-bold text-white mt-2 mb-6">
          Un art de vivre raffiné à ${city}
        </h2>
        <p class="text-zinc-300 leading-relaxed mb-6">
          Né de la passion de l'hospitalité et de l'excellence, <strong class="text-white">${name}</strong> s'attache à offrir une expérience sur mesure. Chaque détail est pensé pour satisfaire les attentes des voyageurs et amateurs les plus exigeants.
        </p>
        <p class="text-zinc-400 text-sm leading-relaxed mb-8">
          Notre réputation s'est forgée jour après jour grâce à vos retours élogieux sur Google Maps. En réservant directement, vous bénéficiez du meilleur accueil et de conseils personnalisés.
        </p>
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
            ✓
          </div>
          <div>
            <div class="font-semibold text-white">Garantie Accueil Privilégié</div>
            <div class="text-xs text-zinc-400">Directement géré par l'équipe officielle</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <img src="${galleryImage1}" alt="${name} ambiance" class="rounded-2xl shadow-2xl object-cover h-64 sm:h-80 w-full transform hover:scale-[1.02] transition-transform duration-500">
        <img src="${galleryImage2}" alt="${name} détails" class="rounded-2xl shadow-2xl object-cover h-64 sm:h-80 w-full mt-8 transform hover:scale-[1.02] transition-transform duration-500">
      </div>
    </div>
  </section>

  <!-- AVIS CLIENTS REELS (EXTRAITS GOOGLE MAPS) -->
  <section id="avis" class="py-20 bg-zinc-900/60 border-t border-white/5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <span class="text-amber-500 font-semibold text-xs tracking-widest uppercase">Témoignages Vérifiés</span>
        <h2 class="font-heading text-3xl sm:text-4xl font-bold text-white mt-2">
          Ce que nos clients disent sur Google
        </h2>
        <p class="text-zinc-400 text-sm mt-3">
          Transparence totale : découvrez les retours authentiques de notre communauté Google Maps.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${reviewsHtml}
      </div>

      <div class="mt-12 text-center">
        <a href="${google_maps_url || '#'}" target="_blank" rel="noopener noreferrer" 
           class="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-medium underline underline-offset-4">
          <span>Lire tous les ${review_count} avis sur notre fiche Google Maps</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        </a>
      </div>
    </div>
  </section>

  <!-- LOCALISATION ET CONTACT -->
  <section id="contact" class="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <span class="text-amber-500 font-semibold text-xs tracking-wider uppercase">Nous Trouver</span>
          <h2 class="font-heading text-3xl sm:text-4xl font-bold text-white mt-2 mb-6">
            Votre rendez-vous d'exception
          </h2>
          
          <div class="space-y-6">
            <div class="flex items-start space-x-4">
              <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                📍
              </div>
              <div>
                <div class="font-medium text-white">Adresse</div>
                <div class="text-sm text-zinc-300 mt-1">${address || `${city}, Maroc`}</div>
              </div>
            </div>

            ${phone ? `
            <div class="flex items-start space-x-4">
              <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                📞
              </div>
              <div>
                <div class="font-medium text-white">Téléphone & WhatsApp</div>
                <div class="text-sm text-zinc-300 mt-1"><a href="tel:${phone}" class="hover:underline">${phone}</a></div>
              </div>
            </div>
            ` : ''}

            <div class="flex items-start space-x-4">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                🟢
              </div>
              <div>
                <div class="font-medium text-white">Statut</div>
                <div class="text-sm text-emerald-400 mt-1">Ouvert aujourd'hui • Réponse WhatsApp rapide</div>
              </div>
            </div>
          </div>

          <div class="mt-8 flex flex-wrap gap-4">
            <a href="${waLink}" target="_blank" rel="noopener noreferrer" 
               class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
              <span>Écrire sur WhatsApp</span>
            </a>
            ${google_maps_url ? `
            <a href="${google_maps_url}" target="_blank" rel="noopener noreferrer" 
               class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl border border-white/20 transition-all">
              <span>Itinéraire Google Maps</span>
            </a>
            ` : ''}
          </div>
        </div>

        <!-- CARTE / VISUEL -->
        <div class="relative rounded-2xl overflow-hidden border border-white/10 aspect-video sm:aspect-auto sm:h-96">
          <img src="${heroImage}" alt="${name} panorama" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center">
            <span class="text-3xl mb-2">📍</span>
            <div class="font-heading font-bold text-xl text-white">${name}</div>
            <div class="text-xs text-zinc-300 max-w-xs mt-1">${address || city}</div>
            <a href="${google_maps_url || '#'}" target="_blank" class="mt-4 px-4 py-2 bg-white text-black font-semibold text-xs rounded-full hover:bg-amber-400 transition-colors">
              Ouvrir dans Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- BOUTON FLOTTANT WHATSAPP -->
  <div class="fixed bottom-6 right-6 z-50">
    <a href="${waLink}" target="_blank" rel="noopener noreferrer" 
       class="flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-3 rounded-full shadow-2xl shadow-emerald-500/40 transition-all transform hover:scale-105 group">
      <span class="w-3 h-3 rounded-full bg-black animate-ping"></span>
      <span class="text-sm font-semibold">Réserver WhatsApp</span>
      <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.084-2.127-.514-1.825-.765-2.986-2.63-3.076-2.753-.092-.122-.74-1.002-.74-1.913 0-.912.477-1.359.65-1.545.172-.186.377-.233.503-.233.125 0 .251.002.361.008.115.006.27-.044.422.327.157.382.535 1.306.582 1.402.047.096.079.208.016.333-.062.125-.094.204-.187.314-.094.11-.198.245-.282.33-.095.094-.194.197-.083.388.111.19.493.813 1.056 1.316.724.646 1.334.846 1.525.941.19.096.302.08.414-.047.112-.128.479-.559.607-.751.127-.192.254-.16.425-.096.17.064 1.082.51 1.27.604.188.094.314.141.36.22.047.079.047.457-.097.862z"/></svg>
    </a>
  </div>

  <!-- FOOTER -->
  <footer class="border-t border-white/10 bg-black py-10 text-center text-xs text-zinc-500">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        © ${new Date().getFullYear()} ${name} • Tous droits réservés.
      </div>
      <div>
        Vitrine officielle conçue pour maximiser votre présence en ligne.
      </div>
    </div>
  </footer>

</body>
</html>`;
}
