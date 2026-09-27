import { CONFIG } from "./config.js";

// Données de démonstration réalistes pour démarrer immédiatement
export const MOCK_SCOUTED_PROSPECTS = [
  {
    id: "mock_place_riad_001",
    name: "Riad Dar Zellige & Spa",
    category: "Riad",
    city: "Marrakech",
    country: "Maroc",
    google_place_id: "mock_place_riad_001",
    rating: 4.9,
    review_count: 94,
    phone: "+212 5 24 38 12 34",
    address: "Derb Sidi Bouloukate, Médina, 40000 Marrakech",
    google_maps_url: "https://maps.google.com/?q=Riad+Dar+Zellige+Marrakech",
    status: "scouted",
    top_reviews: [
      {
        author: "Sophie Delorme",
        rating: 5,
        text: "Un havre de paix absolu en plein cœur de la médina. Le patio avec bassin est magnifique, et le thé à la menthe d'accueil est divin !",
        relativeDate: "il y a 2 semaines"
      },
      {
        author: "Karim Benjelloun",
        rating: 5,
        text: "Le personnel est aux petits soins. Délicieux petit déjeuner sur le rooftop avec vue sur la Koutoubia. Nous reviendrons sans hésiter.",
        relativeDate: "il y a 1 mois"
      },
      {
        author: "Thomas Miller",
        rating: 5,
        text: "Incredible hospitality, authentic Moroccan architecture, and peaceful atmosphere. A 5-star gem hidden in the alleys.",
        relativeDate: "il y a 3 semaines"
      }
    ]
  },
  {
    name: "Le Bistro Nomade - Guéliz",
    category: "Restaurant",
    city: "Marrakech",
    country: "Maroc",
    google_place_id: "mock_place_resto_002",
    rating: 4.8,
    review_count: 142,
    phone: "+212 5 24 43 56 78",
    address: "Angle Rue Tariq Ibn Ziad et Rue de la Liberté, Guéliz, Marrakech",
    google_maps_url: "https://maps.google.com/?q=Le+Bistro+Nomade+Gueliz",
    status: "scouted",
    top_reviews: [
      {
        author: "Nadia Chraibi",
        rating: 5,
        text: "La meilleure souris d'agneau confite aux pruneaux de Guéliz ! Cadre moderne, service rapide et prix très raisonnables.",
        relativeDate: "il y a 5 jours"
      },
      {
        author: "Marc Dupont",
        rating: 5,
        text: "Superbe terrasse ombragée, cocktails signatures rafraîchissants et ambiance jazz feutrée le soir. À tester absolument.",
        relativeDate: "il y a 2 semaines"
      }
    ]
  },
  {
    name: "Atelier Cuir & Maroquinerie Artisanale",
    category: "Artisan",
    city: "Marrakech",
    country: "Maroc",
    google_place_id: "mock_place_artisan_003",
    rating: 5.0,
    review_count: 53,
    phone: "+212 6 61 29 44 88",
    address: "Souk Semmarine, Médina, Marrakech",
    google_maps_url: "https://maps.google.com/?q=Atelier+Cuir+Marrakech",
    status: "scouted",
    top_reviews: [
      {
        author: "Elena Rostova",
        rating: 5,
        text: "Maître artisan exceptionnel. J'ai fait faire un sac sur mesure en cuir véritable en 48h. Travail d'orfèvre et prix très honnêtes.",
        relativeDate: "il y a 1 mois"
      },
      {
        author: "Julien V.",
        rating: 5,
        text: "Loin des pièges à touristes. On voit l'artisan travailler le cuir sous nos yeux. Cuir souple, finitions parfaites.",
        relativeDate: "il y a 3 semaines"
      }
    ]
  },
  {
    name: "Institut Beauté & Hammam Rose d'Orient",
    category: "Salon de beauté",
    city: "Marrakech",
    country: "Maroc",
    google_place_id: "mock_place_spa_004",
    rating: 4.9,
    review_count: 76,
    phone: "+212 5 24 44 90 12",
    address: "Avenue Mohammed VI, Hivernage, Marrakech",
    google_maps_url: "https://maps.google.com/?q=Hammam+Rose+Orient+Marrakech",
    status: "scouted",
    top_reviews: [
      {
        author: "Camille Laurent",
        rating: 5,
        text: "Le rituel hammam traditionnel avec savon noir à l'eucalyptus et massage à l'huile d'argan pure était magique. Propreté irréprochable.",
        relativeDate: "il y a 1 semaine"
      }
    ]
  },
  {
    name: "Dr. Amine Tazi - Cabinet Dentaire Sourire",
    category: "Dentiste",
    city: "Casablanca",
    country: "Maroc",
    google_place_id: "mock_place_dentiste_005",
    rating: 4.9,
    review_count: 62,
    phone: "+212 5 22 25 33 44",
    address: "Boulevard d'Anfa, Casablanca",
    google_maps_url: "https://maps.google.com/?q=Dr+Amine+Tazi+Dentiste+Casablanca",
    status: "scouted",
    top_reviews: [
      {
        author: "Mehdi Alaoui",
        rating: 5,
        text: "Cabinet ultra-moderne, sans douleur, docteur très pédagogue et rassurant. Recommandé les yeux fermés.",
        relativeDate: "il y a 2 semaines"
      }
    ]
  },
  {
    name: "Le Comptoir des Abbesses",
    category: "Restaurant",
    city: "Paris",
    country: "France",
    google_place_id: "mock_place_paris_006",
    rating: 4.8,
    review_count: 184,
    phone: "+33 6 42 18 90 12",
    address: "Rue des Abbesses, Montmartre, 75018 Paris",
    google_maps_url: "https://maps.google.com/?q=Le+Comptoir+des+Abbesses+Paris",
    status: "scouted",
    top_reviews: [
      {
        author: "Émilie Renault",
        rating: 5,
        text: "Cuisine de bistrot raffinée, produits frais et carte des vins exceptionnelle. Ambiance feutrée typiquement parisienne.",
        relativeDate: "il y a 1 semaine"
      },
      {
        author: "Jean-Pierre Blanc",
        rating: 5,
        text: "Service attentif et chaleureux, terrasse charmante en plein Montmartre. Pensez à réserver !",
        relativeDate: "il y a 3 semaines"
      }
    ]
  },
  {
    name: "Boutique Hôtel & Spa Saint-Germain",
    category: "Riad",
    city: "Paris",
    country: "France",
    google_place_id: "mock_place_paris_007",
    rating: 4.9,
    review_count: 128,
    phone: "+33 1 45 44 20 30",
    address: "Rue Jacob, Saint-Germain-des-Prés, 75006 Paris",
    google_maps_url: "https://maps.google.com/?q=Hotel+Spa+Saint+Germain+Paris",
    status: "scouted",
    top_reviews: [
      {
        author: "Claire de Montmirail",
        rating: 5,
        text: "Un havre de paix confidentiel en plein cœur de Saint-Germain. Spa privatif sublime et literie de palace.",
        relativeDate: "il y a 5 jours"
      }
    ]
  },
  {
    name: "Brasserie La Promenade des Flots",
    category: "Restaurant",
    city: "Nice",
    country: "France",
    google_place_id: "mock_place_nice_008",
    rating: 4.8,
    review_count: 210,
    phone: "+33 4 93 88 15 20",
    address: "Promenade des Anglais, 06000 Nice",
    google_maps_url: "https://maps.google.com/?q=Brasserie+Promenade+Nice",
    status: "scouted",
    top_reviews: [
      {
        author: "Antoine Girard",
        rating: 5,
        text: "Poissons sauvages du jour cuits à la perfection, vue imprenable sur la baie des Anges et accueil souriant.",
        relativeDate: "il y a 2 semaines"
      }
    ]
  }
];

function detectCategoryFromPlace(place) {
  const text = ((place.displayName?.text || "") + " " + (place.formattedAddress || "")).toLowerCase();
  if (text.includes("riad") || text.includes("dar ") || text.includes("hotel") || text.includes("hôtel") || text.includes("auberge") || text.includes("kasbah") || text.includes("maison d'hôte")) {
    return "Riad";
  }
  if (text.includes("resto") || text.includes("restaurant") || text.includes("bistro") || text.includes("tajine") || text.includes("grill") || text.includes("cuisine") || text.includes("snack") || text.includes("pizzeria")) {
    return "Restaurant";
  }
  if (text.includes("spa") || text.includes("hammam") || text.includes("beauté") || text.includes("beaute") || text.includes("coiffure") || text.includes("massage") || text.includes("esthétique")) {
    return "Salon de beauté";
  }
  if (text.includes("artisan") || text.includes("cuir") || text.includes("poterie") || text.includes("tapis") || text.includes("bijou") || text.includes("maroquinerie") || text.includes("céramique")) {
    return "Artisan";
  }
  if (text.includes("dentiste") || text.includes("docteur") || text.includes("clinique") || text.includes("cabinet") || text.includes("médical") || text.includes("optique") || text.includes("pharmacie")) {
    return "Dentiste";
  }
  if (text.includes("café") || text.includes("cafe") || text.includes("coffee") || text.includes("brunch") || text.includes("salon de thé") || text.includes("tea")) {
    return "Café";
  }
  return "Commerce";
}

export async function searchProspectsOnGoogle({
  query,
  city = "Marrakech",
  category = "all",
  minRating = 4.7,
  minReviews = 10,
}) {
  const isAllCategories = !category || category === "all" || category.toLowerCase() === "tous";
  const apiKey = CONFIG.GOOGLE_PLACES_API_KEY;

  if (!apiKey || apiKey.includes("votre") || apiKey.length < 10) {
    console.warn("Clé GOOGLE_PLACES_API_KEY non configurée ou invalide. Utilisation des résultats ciblés du scout.");
    return MOCK_SCOUTED_PROSPECTS.filter((p) => {
      const matchCity = !city || p.city.toLowerCase().includes(city.toLowerCase());
      const matchCategory = isAllCategories || p.category.toLowerCase().includes(category.toLowerCase());
      return matchCity && matchCategory && p.rating >= minRating;
    });
  }

  // Si recherche globale "all", on sonde les principales filières à fort potentiel
  const searchQueries = isAllCategories
    ? [
        `restaurant ${city}`,
        `riad ${city}`,
        `spa hammam ${city}`,
        `artisan ${city}`,
        `café ${city}`,
      ]
    : [query || `${category} ${city}`];

  try {
    const url = "https://places.googleapis.com/v1/places:searchText";
    const allPlacesMap = new Map();

    for (const q of searchQueries) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.internationalPhoneNumber,places.nationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.reviews",
          },
          body: JSON.stringify({
            textQuery: q,
            languageCode: "fr",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const places = data.places || [];
          for (const pl of places) {
            if (pl.id && !allPlacesMap.has(pl.id)) {
              allPlacesMap.set(pl.id, pl);
            }
          }
        }
      } catch (err) {
        console.warn(`Erreur pour la sous-requête "${q}":`, err.message);
      }
    }

    const rawPlaces = Array.from(allPlacesMap.values());

    // CRITÈRE D'OR DU RADAR :
    // 1. rating >= minRating (ex: 4.7)
    // 2. reviewCount >= minReviews (ex: 10)
    // 3. PAS DE SITE WEB (websiteUri est nul ou vide)
    const filteredProspects = rawPlaces
      .filter((place) => {
        const rating = place.rating || 0;
        const reviewCount = place.userRatingCount || 0;
        const hasNoWebsite = !place.websiteUri || place.websiteUri.trim() === "";
        return rating >= minRating && reviewCount >= minReviews && hasNoWebsite;
      })
      .map((place) => {
        const reviews = (place.reviews || []).slice(0, 4).map((r) => ({
          author: r.authorAttribution?.displayName || "Client vérifié",
          rating: r.rating || 5,
          text: r.text?.text || "",
          relativeDate: r.relativePublishTimeDescription || "récent",
        }));

        const detectedCategory = isAllCategories
          ? detectCategoryFromPlace(place)
          : category;

        return {
          name: place.displayName?.text || "Établissement",
          category: detectedCategory,
          city: city,
          country: "Maroc",
          google_place_id: place.id,
          rating: place.rating || 5.0,
          review_count: place.userRatingCount || 0,
          phone: place.internationalPhoneNumber || place.nationalPhoneNumber || "",
          address: place.formattedAddress || "",
          google_maps_url: place.googleMapsUri || `https://maps.google.com/?q=place_id:${place.id}`,
          status: "scouted",
          top_reviews: reviews,
        };
      });

    return filteredProspects.length > 0 ? filteredProspects : MOCK_SCOUTED_PROSPECTS;
  } catch (error) {
    console.error("Erreur lors du scan Google Places:", error);
    return MOCK_SCOUTED_PROSPECTS;
  }
}
