# Instructions de Développement & Règles du Projet

## Règle Absolue d'Automatisation
- **Push automatique systématique** : Après TOUTE modification apportée au code, aux pages, aux composants ou aux scripts, l'agent doit AUTOMATIQUEMENT exécuter :
  1. La validation du build (`npm run build`).
  2. Le commit clair et concis (`git add . && git commit -m "..."`).
  3. Le push en ligne (`git -c credential.helper= push origin main`).
- Aucun secret, token ou clé API ne doit être commité en clair (toujours utiliser `.env.local` qui est ignoré par `.gitignore`).
