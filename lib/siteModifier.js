import { CONFIG } from "./config.js";

/**
 * Agent IA de révision : Modifie le code HTML d'un site selon la demande du client
 * Ex: "Change le téléphone en +212 6... et ajoute notre menu grillades"
 */
export async function applyClientRevision({ currentHtml, clientInstruction, venueName }) {
  const anthropicKey = CONFIG.ANTHROPIC_API_KEY;
  const geminiKey = CONFIG.GEMINI_API_KEY;

  const prompt = `Tu es un développeur et designer web expert.
Voici le code HTML complet actuel pour le site vitrine de "${venueName}".
Le client / propriétaire de l'établissement a demandé la modification suivante :
"""
${clientInstruction}
"""

Instructions strictes :
1. Applique fidèlement et proprement toutes les modifications demandées dans le code HTML.
2. Conserve tout le design moderne existant (Tailwind CSS, Google Fonts, badges, avis, responsive mobile).
3. Renvoie UNIQUEMENT le code HTML complet mis à jour, débutant par <!DOCTYPE html> et finissant par </html>.
4. Aucun blabla, aucun markdown de type \`\`\`html, juste le code HTML brut.

Code HTML actuel :
${currentHtml}`;

  // 1. Essai avec Claude (Anthropic) si disponible
  if (anthropicKey && !anthropicKey.includes("votre") && anthropicKey.startsWith("sk-ant")) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 8192,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text || "";
        const cleanHtml = text.replace(/^```html\s*/i, "").replace(/```\s*$/i, "").trim();
        if (cleanHtml.includes("<!DOCTYPE html>")) return cleanHtml;
      }
    } catch (e) {
      console.warn("Erreur Claude revision:", e.message);
    }
  }

  // 2. Repli avec Gemini 2.0 / 1.5 Flash (Gratuit)
  if (geminiKey && !geminiKey.includes("votre")) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const cleanHtml = text.replace(/^```html\s*/i, "").replace(/```\s*$/i, "").trim();
        if (cleanHtml.includes("<!DOCTYPE html>")) return cleanHtml;
      }
    } catch (e) {
      console.warn("Erreur Gemini revision:", e.message);
    }
  }

  // 3. Fallback intelligent si pas d'API : Remplacements textuels heuristiques
  let updated = currentHtml;
  
  // Remplacement de numéro de téléphone si détecté dans l'instruction
  const phoneMatch = clientInstruction.match(/(\+?[0-9\s]{8,15})/);
  if (phoneMatch) {
    const newPhone = phoneMatch[1].trim();
    updated = updated.replace(/tel:\+?[0-9\s]+/g, `tel:${newPhone}`);
  }

  return updated;
}
