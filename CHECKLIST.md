# 📋 CHECKLIST DE DÉPLOIEMENT & MISE EN SERVICE (0€)

Suivez ces étapes dans l'ordre pour rendre votre radar 100% opérationnel :

---

### Étape 1 : Initialisation Locale
- [x] Dépendances installées (`npm install`)
- [x] Fichier `.env.local` configuré avec vos clés Google Places et Supabase
- [ ] Lancer le serveur local avec `npm run dev` et ouvrir `http://localhost:3005`

---

### Étape 2 : Création des Tables Supabase (0€)
1. Ouvrez votre projet Supabase : [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Rendez-vous dans **SQL Editor** > **New query**.
3. Copiez le contenu de [`schema.sql`](./schema.sql).
4. Cliquez sur **Run** pour créer :
   - La table `prospect_venues`
   - La table `scout_logs`
   - La table `outreach_logs`
   - Les index de performance

---

### Étape 3 : Hébergement Gratuit des Sites sur GitHub Pages (0€)
Pour que vos sites soient accessibles en direct par vos clients via `https://username.github.io/prospect-sites/...` :
1. Créez un dépôt public sur GitHub nommé : `prospect-sites` (ou le nom de votre choix).
2. Allez dans **Settings** > **Pages** de votre dépôt GitHub :
   - Source : **Deploy from a branch**
   - Branch : `main` (ou `master`), folder : `/ (root)`
3. Créez un Token GitHub Personnel :
   - Allez sur [github.com/settings/tokens](https://github.com/settings/tokens) > **Generate new token (classic)**.
   - Cochez la permission : `repo`.
   - Copiez ce token dans `.env.local` :
     ```env
     GITHUB_TOKEN=ghp_votre_token
     GITHUB_REPO_OWNER=votre-pseudo-github
     GITHUB_REPO_NAME=prospect-sites
     ```

*(Note : Même sans token GitHub, le simulateur du Dashboard et la prévisualisation plein écran fonctionnent immédiatement grâce à la route `/api/preview/[id]` !)*

---

### Étape 4 : Déploiement du Dashboard sur Vercel (0€)
1. Poussez ce dossier `prospect-web-radar` sur votre compte GitHub.
2. Rendez-vous sur [vercel.com](https://vercel.com) > **Add New Project**.
3. Importez le dépôt et copiez les variables d'environnement de `.env.local`.
4. Cliquez sur **Deploy**. Votre dashboard sera en ligne avec son adresse HTTPS gratuite !
