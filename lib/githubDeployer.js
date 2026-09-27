import { CONFIG } from "./config.js";

/**
 * Déploie le fichier index.html d'un prospect vers un dépôt GitHub Pages
 * Coût : 0€ (Hébergement GitHub Pages illimité et gratuit)
 */
export async function deployToGitHubPages({ slug, htmlContent, commitMessage }) {
  const token = CONFIG.GITHUB_TOKEN;
  const owner = CONFIG.GITHUB_REPO_OWNER;
  const repo = CONFIG.GITHUB_REPO_NAME || "prospect-sites";

  // Si le token n'est pas configuré, on simule le déploiement pour la démo
  if (!token || !owner) {
    console.warn("GITHUB_TOKEN ou GITHUB_REPO_OWNER manquant dans .env.local. Mode preview local actif.");
    return {
      success: true,
      mode: "local_preview",
      liveUrl: `/api/preview/${slug}`,
      slug,
      path: `sites/${slug}/index.html`,
      message: "Prévisualisation locale active. Configurez GITHUB_TOKEN dans .env.local pour le déploiement GitHub Pages réel.",
    };
  }

  const filePath = `sites/${slug}/index.html`;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  try {
    // 1. Vérifier si le fichier existe déjà pour récupérer le sha
    let sha = null;
    const checkRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (checkRes.ok) {
      const existing = await checkRes.json();
      sha = existing.sha;
    }

    // 2. Encoder le contenu en Base64
    const contentBase64 = Buffer.from(htmlContent).toString("base64");

    // 3. Créer ou mettre à jour le fichier
    const putRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage || `feat: deploy showcase website for ${slug}`,
        content: contentBase64,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!putRes.ok) {
      const err = await putRes.text();
      throw new Error(`GitHub API Error (${putRes.status}): ${err}`);
    }

    const liveUrl = `https://${owner}.github.io/${repo}/sites/${slug}/`;

    return {
      success: true,
      mode: "github_pages",
      liveUrl,
      slug,
      path: filePath,
    };
  } catch (error) {
    console.error("Erreur de déploiement GitHub Pages:", error);
    return {
      success: false,
      error: error.message,
      liveUrl: `/api/preview/${slug}`,
    };
  }
}
