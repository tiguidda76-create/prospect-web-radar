export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Radar Vitrine — Prospection Venues 5★ & Sites IA 0€",
  description: "Détection des établissements 5 étoiles sans site web sur Google Maps et génération instantanée de vitrines officielles.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <style>{`
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            background: #090d16;
            color: #f1f5f9;
            min-height: 100vh;
            -webkit-font-smoothing: antialiased;
          }
          .font-display {
            font-family: 'Outfit', sans-serif;
          }
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #090d16;
          }
          ::-webkit-scrollbar-thumb {
            background: #1e293b;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #334155;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
