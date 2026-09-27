async function createRootIndex() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER || 'tiguidda76-create';
  const repo = process.env.GITHUB_REPO_NAME || 'prospect-sites';
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/index.html`;

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio Vitrines & Démos | WebRadar AI</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-zinc-950 text-white min-h-screen p-6 sm:p-12 flex flex-col items-center justify-center font-sans">
  <div class="max-w-3xl w-full text-center">
    <div class="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
      ✦ WebRadar AI Showcase Engine (Hébergement 0€)
    </div>
    <h1 class="text-3xl sm:text-5xl font-black mb-4 tracking-tight">Vitrines Officielles Générées</h1>
    <p class="text-zinc-400 text-sm sm:text-base mb-10 max-w-xl mx-auto">
      Sélection des maquettes interactives créées pour les établissements 5★ sans site web repérés sur Google Maps.
    </p>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
      <a href="sites/riad-dar-zellige-spa-marrakech/" class="block p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-amber-400 transition-all hover:scale-[1.02]">
        <div class="text-amber-400 font-bold text-xs uppercase tracking-wider">Riad • Médina Marrakech</div>
        <div class="text-xl font-bold mt-1 text-white">Riad Dar Zellige & Spa</div>
        <div class="text-xs text-zinc-400 mt-2">Note Google : ★ 4.9 (94 avis vérifiés)</div>
      </a>

      <a href="sites/le-bistro-nomade-gueliz-marrakech/" class="block p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-red-400 transition-all hover:scale-[1.02]">
        <div class="text-red-400 font-bold text-xs uppercase tracking-wider">Restaurant • Guéliz Marrakech</div>
        <div class="text-xl font-bold mt-1 text-white">Le Bistro Nomade</div>
        <div class="text-xs text-zinc-400 mt-2">Note Google : ★ 4.8 (142 avis vérifiés)</div>
      </a>

      <a href="sites/atelier-cuir-maroquinerie-artisanale-marrakech/" class="block p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-emerald-400 transition-all hover:scale-[1.02]">
        <div class="text-emerald-400 font-bold text-xs uppercase tracking-wider">Artisanat • Médina Marrakech</div>
        <div class="text-xl font-bold mt-1 text-white">Atelier Cuir & Maroquinerie</div>
        <div class="text-xs text-zinc-400 mt-2">Note Google : ★ 5.0 (53 avis vérifiés)</div>
      </a>

      <a href="sites/institut-beaute-hammam-rose-d-orient-marrakech/" class="block p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-pink-400 transition-all hover:scale-[1.02]">
        <div class="text-pink-400 font-bold text-xs uppercase tracking-wider">Hammam & Spa • Hivernage</div>
        <div class="text-xl font-bold mt-1 text-white">Institut Beauté Rose d'Orient</div>
        <div class="text-xs text-zinc-400 mt-2">Note Google : ★ 4.9 (76 avis vérifiés)</div>
      </a>
    </div>

    <div class="mt-12 text-xs text-zinc-500">
      Propulsé par WebRadar AI • Hébergement gratuit GitHub Pages
    </div>
  </div>
</body>
</html>`;

  let sha = null;
  const getRes = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'NodeJS' }
  });
  if (getRes.ok) {
    const existing = await getRes.json();
    sha = existing.sha;
  }

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'NodeJS'
    },
    body: JSON.stringify({
      message: 'feat: add root showcase portal',
      content: Buffer.from(html).toString('base64'),
      ...(sha ? { sha } : {})
    })
  });
  console.log('Root index created:', putRes.status);
}

createRootIndex().catch(console.error);
