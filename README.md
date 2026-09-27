# WebRadar AI — Prospecteur de Venues 5★ & Générateur Web 0€

Plateforme de prospection automatisée dédiée aux établissements très bien notés sur **Google Maps (note >= 4.7★ ou 5.0★)** mais qui n'ont **aucun site web officiel**.

Ce projet réplique l'architecture et l'organisation de votre **`radar-backend`** (Next.js 14 App Router, Supabase, Vercel, Google Places API).

---

## 🎯 La Stratégie de Conversion ("Show, Don't Tell")

Au lieu d'envoyer un message froid *"Bonjour je crée des sites web"*, le système prépare déjà le travail pour le client :

1. **Radar Google Maps** : Repère automatiquement les pépites locales (Riads, Restaurants, Salons, Artisans, Spas, Dentistes) avec 4.7 à 5.0★ et `websiteUri == null`.
2. **Agent Designer IA** : Génère un site vitrine autonome `index.html` haute conversion avec :
   - Badge officiel Google Reviews : `★ 4.9/5 sur 85 avis vérifiés`
   - Intégration des vrais avis clients élogieux de Google Maps
   - Bouton de réservation WhatsApp Sticky flottant
   - Palette de couleurs et typographies Google Fonts adaptées au secteur
   - Photos haute définition thématiques Unsplash
3. **Déploiement 100% Gratuit (0€ de frais)** :
   - Hébergé sans frais sur **GitHub Pages** (`https://username.github.io/prospect-sites/nom-du-lieu/`) ou prévisualisable directement dans le dashboard.
4. **Pitch WhatsApp 1-Clic** : Un message personnalisé avec le lien de démonstration prêt à envoyer en un clic via WhatsApp Web / Mobile.

---

## 🏗️ Architecture du Projet

```text
prospect-web-radar/
├── app/
│   ├── layout.js                     # Layout racine & typographies
│   ├── page.js                       # Dashboard de prospection & simulateur interactif
│   └── api/
│       ├── scout/route.js            # Radar de scan Google Places (Places New API)
│       ├── generate-site/route.js    # Agent IA Designer (génère index.html & pitch)
│       ├── deploy-site/route.js      # Déploiement GitHub Pages 0€ (REST API)
│       ├── preview/[id]/route.js     # Rendu direct du site généré dans l'iframe
│       └── prospects/route.js        # Récupération et mise à jour du statut
├── lib/
│   ├── config.js                     # Variables d'environnement & clés
│   ├── supabase.js                   # Client Supabase + mémoire de secours
│   ├── googlePlacesScout.js          # Moteur de recherche et de filtrage Google Maps
│   ├── aiSiteDesigner.js             # Moteur de génération de design autonome
│   ├── githubDeployer.js             # Client de déploiement automatique GitHub Pages
│   └── pitchGenerator.js             # Générateur de scripts d'approche WhatsApp
├── schema.sql                        # Schéma PostgreSQL pour Supabase
├── vercel.json                       # Config Vercel + Cron quotidien
└── .env.example                      # Modèle de variables d'environnement
```

---

## 💰 Le Modèle "0 Frais" (Free Tier)

| Brique | Service | Coût | Quota / Avantage |
|---|---|---|---|
| **Base de Données** | Supabase | **0€** | 500 Mo PostgreSQL (des milliers de prospects) |
| **Dashboard & API** | Vercel | **0€** | Hébergement Next.js gratuit avec SSL |
| **Données Google Maps** | Google Places API | **0€** | **$200 de crédits gratuits / mois** de Google Cloud |
| **Hébergement des Sites** | GitHub Pages | **0€** | Hébergement statique illimité et gratuit à vie |
| **IA Générative** | Gemini Flash / Groq | **0€** | Google AI Studio (1500 requêtes/jour gratuites) |

---

## 🚀 Démarrage Rapide

### 1. Lancer le projet localement
```bash
npm run dev
```
Rendez-vous sur [http://localhost:3005](http://localhost:3005).

### 2. Configurer Supabase
Dans votre console Supabase :
1. Allez dans **SQL Editor > New Query**.
2. Copiez-collez le contenu de `schema.sql`.
3. Cliquez sur **Run**.
