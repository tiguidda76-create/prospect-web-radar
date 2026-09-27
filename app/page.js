"use client";

import React, { useState, useEffect } from "react";

import { AGENCY_PROFILE, PRICING_SERVICES } from "@/lib/billingAndServices.js";

export default function ProspectRadarDashboard() {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);
  const [deployingId, setDeployingId] = useState(null);

  // Filtres de recherche
  const [city, setCity] = useState("Marrakech");
  const [category, setCategory] = useState("Restaurant");
  const [minRating, setMinRating] = useState(4.7);
  const [statusFilter, setStatusFilter] = useState("all");

  // Modales
  const [previewProspect, setPreviewProspect] = useState(null);
  const [previewDevice, setPreviewDevice] = useState("desktop"); // 'desktop' | 'mobile'
  const [pitchProspect, setPitchProspect] = useState(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [revisionProspect, setRevisionProspect] = useState(null);
  const [revisionPrompt, setRevisionPrompt] = useState("");
  const [modifying, setModifying] = useState(false);
  const [notification, setNotification] = useState(null);

  // Charger les prospects
  useEffect(() => {
    loadProspects();
  }, []);

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadProspects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/prospects");
      const data = await res.json();
      if (data.success && data.prospects) {
        setProspects(data.prospects);
      }
    } catch (e) {
      console.error("Erreur chargement prospects:", e);
    } finally {
      setLoading(false);
    }
  };

  // Lancer le radar de scan Google Maps
  const handleLaunchScout = async () => {
    try {
      setScanning(true);
      const res = await fetch("/api/scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, category, minRating }),
      });
      const data = await res.json();
      if (data.success) {
        setProspects(data.prospects);
        showNotification(`${data.totalFound} établissements 5★ sans site web repérés !`);
      } else {
        showNotification("Erreur lors du scan : " + data.error, "error");
      }
    } catch (e) {
      showNotification("Erreur de connexion", "error");
    } finally {
      setScanning(false);
    }
  };

  // Générer le site IA pour un prospect
  const handleGenerateSite = async (prospect) => {
    try {
      setGeneratingId(prospect.id);
      const res = await fetch("/api/generate-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prospect),
      });
      const data = await res.json();
      if (data.success) {
        setProspects((prev) =>
          prev.map((p) => (p.id === prospect.id ? data.prospect : p))
        );
        showNotification(`Site IA généré avec succès pour ${prospect.name} !`);
      } else {
        showNotification("Erreur génération : " + data.error, "error");
      }
    } catch (e) {
      showNotification("Erreur de communication avec l'agent IA", "error");
    } finally {
      setGeneratingId(null);
    }
  };

  // Déployer sur GitHub Pages (0 frais)
  const handleDeploySite = async (prospect) => {
    try {
      setDeployingId(prospect.id);
      const res = await fetch("/api/deploy-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospect }),
      });
      const data = await res.json();
      if (data.success) {
        setProspects((prev) =>
          prev.map((p) => (p.id === prospect.id ? data.prospect : p))
        );
        showNotification(`Site déployé en ligne ! URL : ${data.liveUrl}`);
      } else {
        showNotification("Erreur déploiement : " + data.error, "error");
      }
    } catch (e) {
      showNotification("Erreur lors du déploiement", "error");
    } finally {
      setDeployingId(null);
    }
  };

  // Appliquer les modifications demandées par le client via l'IA
  const handleApplyRevision = async () => {
    if (!revisionProspect || !revisionPrompt.trim()) return;
    try {
      setModifying(true);
      const res = await fetch("/api/modify-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: revisionProspect.id,
          instruction: revisionPrompt,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProspects((prev) =>
          prev.map((p) => (p.id === revisionProspect.id ? data.prospect : p))
        );
        showNotification("Modifications appliquées au site avec succès !");
        setRevisionProspect(null);
        setRevisionPrompt("");
      } else {
        showNotification("Erreur lors de la modification : " + data.error, "error");
      }
    } catch (e) {
      showNotification("Erreur de communication avec l'agent IA", "error");
    } finally {
      setModifying(false);
    }
  };

  // Mettre à jour le statut (ex: marqué comme pitché / converti)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch("/api/prospects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, updates: { status: newStatus } }),
      });
      const data = await res.json();
      if (data.success) {
        setProspects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
        showNotification(`Statut mis à jour : ${newStatus}`);
      }
    } catch (e) {
      showNotification("Erreur de mise à jour", "error");
    }
  };

  // Filtrage des prospects affichés
  const filteredProspects = prospects.filter((p) => {
    if (statusFilter === "all") return true;
    return p.status === statusFilter;
  });

  // Calcul des métriques clés
  const stats = {
    total: prospects.length,
    generated: prospects.filter((p) => p.status !== "scouted").length,
    deployed: prospects.filter((p) => ["deployed", "pitched", "converted"].includes(p.status)).length,
    pitched: prospects.filter((p) => ["pitched", "converted"].includes(p.status)).length,
    converted: prospects.filter((p) => p.status === "converted").length,
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 20px" }}>
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: notification.type === "error" ? "#ef4444" : "#10b981",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: 9999,
            fontWeight: 600,
            fontSize: 14,
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>{notification.type === "error" ? "⚠️" : "✓"}</span>
          <span>{notification.msg}</span>
        </div>
      )}

      {/* HEADER */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          paddingBottom: 24,
          borderBottom: "1px solid #1e293b",
          marginBottom: 32,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 12px #10b981",
              }}
            ></span>
            <h1
              className="font-display"
              style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Radar <span style={{ color: "#f59e0b" }}>Vitrine</span>
            </h1>
            <span
              style={{
                background: "rgba(245, 158, 11, 0.15)",
                color: "#f59e0b",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                padding: "3px 10px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              0€ Frais
            </span>
          </div>
          <p style={{ margin: "6px 0 0 0", color: "#94a3b8", fontSize: 14 }}>
            Radar de prospection Google Maps (5★ sans site web) • Générateur IA • Déploiement instantané
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => setShowPricingModal(true)}
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff",
              border: "none",
              padding: "10px 16px",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
            }}
          >
            <span>💳</span> Tarifs & Services
          </button>
          <button
            onClick={loadProspects}
            style={{
              background: "#1e293b",
              color: "#cbd5e1",
              border: "1px solid #334155",
              padding: "10px 16px",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>🔄</span> Rafraîchir
          </button>
        </div>
      </header>

      {/* METRICS CARDS */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))",
            border: "1px solid #334155",
            borderRadius: 16,
            padding: "20px 22px",
          }}
        >
          <div style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>Prospects Détectés (5★)</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginTop: 6 }}>
            {stats.total}
          </div>
          <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4, fontWeight: 600 }}>
            ❌ 100% Sans site web
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))",
            border: "1px solid #334155",
            borderRadius: 16,
            padding: "20px 22px",
          }}
        >
          <div style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>Sites Web Générés</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#38bdf8", marginTop: 6 }}>
            {stats.generated}
          </div>
          <div style={{ fontSize: 12, color: "#38bdf8", marginTop: 4 }}>
            ⚡ Prêts à prévisualiser
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))",
            border: "1px solid #334155",
            borderRadius: 16,
            padding: "20px 22px",
          }}
        >
          <div style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>Déployés en Live (0€)</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#a855f7", marginTop: 6 }}>
            {stats.deployed}
          </div>
          <div style={{ fontSize: 12, color: "#a855f7", marginTop: 4 }}>
            🌐 GitHub Pages / Vercel
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))",
            border: "1px solid #334155",
            borderRadius: 16,
            padding: "20px 22px",
          }}
        >
          <div style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>Pitchs WhatsApp Envoyés</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#10b981", marginTop: 6 }}>
            {stats.pitched}
          </div>
          <div style={{ fontSize: 12, color: "#10b981", marginTop: 4 }}>
            💬 Taux conversion : {stats.pitched > 0 ? Math.round((stats.converted / stats.pitched) * 100) : 0}%
          </div>
        </div>
      </section>

      {/* SCAN CONTROLLER BAR */}
      <section
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 18,
          padding: "20px 24px",
          marginBottom: 32,
          display: "flex",
          flexWrap: "wrap",
          gap: 18,
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, flex: 1 }}>
          <div style={{ minWidth: 160, flex: "1 1 180px" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
              Ville Cible
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{
                width: "100%",
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: 10,
                color: "#fff",
                padding: "10px 14px",
                fontSize: 14,
                outline: "none",
              }}
            >
              <option value="Marrakech">Marrakech</option>
              <option value="Casablanca">Casablanca</option>
              <option value="Rabat">Rabat</option>
              <option value="Essaouira">Essaouira</option>
              <option value="Tanger">Tanger</option>
              <option value="Agadir">Agadir</option>
              <option value="Paris">Paris (France)</option>
              <option value="Nice">Nice (France)</option>
            </select>
          </div>

          <div style={{ minWidth: 180, flex: "1 1 200px" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
              Catégorie Métier
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "100%",
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: 10,
                color: "#fff",
                padding: "10px 14px",
                fontSize: 14,
                outline: "none",
              }}
            >
              <option value="Restaurant">Restaurant / Bistro</option>
              <option value="Riad">Riad & Maison d'hôtes</option>
              <option value="Salon de beauté">Salon de beauté / Spa / Hammam</option>
              <option value="Artisan">Artisan / Maroquinerie / Céramique</option>
              <option value="Dentiste">Dentiste / Cabinet Médical</option>
              <option value="Café">Café & Brunch</option>
            </select>
          </div>

          <div style={{ minWidth: 140, flex: "1 1 150px" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
              Note Google Minimale : <strong style={{ color: "#f59e0b" }}>{minRating}★</strong>
            </label>
            <input
              type="range"
              min="4.5"
              max="5.0"
              step="0.1"
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "#f59e0b", height: 6, marginTop: 10 }}
            />
          </div>
        </div>

        <button
          onClick={handleLaunchScout}
          disabled={scanning}
          style={{
            background: scanning
              ? "#475569"
              : "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#000",
            border: "none",
            borderRadius: 12,
            padding: "12px 24px",
            fontSize: 14,
            fontWeight: 700,
            cursor: scanning ? "not-allowed" : "pointer",
            boxShadow: scanning ? "none" : "0 4px 15px rgba(245, 158, 11, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s",
          }}
        >
          <span>{scanning ? "⏳ Scan en cours..." : "⚡ Lancer le Radar Google Maps"}</span>
        </button>
      </section>

      {/* FILTER TABS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, overflowX: "auto", paddingBottom: 6 }}>
        {[
          { key: "all", label: "Tous les prospects", count: stats.total },
          { key: "scouted", label: "À Traiter", count: prospects.filter((p) => p.status === "scouted").length },
          { key: "site_generated", label: "Sites Générés", count: prospects.filter((p) => p.status === "site_generated").length },
          { key: "deployed", label: "Déployés Live", count: stats.deployed },
          { key: "pitched", label: "Contactés", count: stats.pitched },
          { key: "converted", label: "Convertis 🎉", count: stats.converted },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            style={{
              background: statusFilter === tab.key ? "#1e293b" : "transparent",
              color: statusFilter === tab.key ? "#fff" : "#94a3b8",
              border: statusFilter === tab.key ? "1px solid #334155" : "1px solid transparent",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>{tab.label}</span>
            <span
              style={{
                background: statusFilter === tab.key ? "#334155" : "rgba(255,255,255,0.06)",
                padding: "2px 7px",
                borderRadius: 10,
                fontSize: 11,
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* PROSPECTS TABLE */}
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 18,
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#1e293b", color: "#94a3b8", fontSize: 12, textTransform: "uppercase" }}>
                <th style={{ padding: "14px 20px" }}>Établissement</th>
                <th style={{ padding: "14px 20px" }}>Note & Avis</th>
                <th style={{ padding: "14px 20px" }}>Site Web Actuel</th>
                <th style={{ padding: "14px 20px" }}>Statut Tunnel</th>
                <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions IA & Pitch</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
                    Chargement des prospects...
                  </td>
                </tr>
              ) : filteredProspects.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
                    Aucun établissement trouvé avec ces critères. Cliquez sur "⚡ Lancer le Radar Google Maps".
                  </td>
                </tr>
              ) : (
                filteredProspects.map((p) => {
                  const isGenerating = generatingId === p.id;
                  const isDeploying = deployingId === p.id;

                  return (
                    <tr
                      key={p.id || p.google_place_id}
                      style={{
                        borderBottom: "1px solid #1e293b",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#131d31")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* NOM & LOCALISATION */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2, display: "flex", gap: 8, alignItems: "center" }}>
                          <span>{p.category}</span>
                          <span>•</span>
                          <span>{p.city}</span>
                          {p.google_maps_url && (
                            <>
                              <span>•</span>
                              <a
                                href={p.google_maps_url}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "#38bdf8", textDecoration: "none" }}
                              >
                                Maps ↗
                              </a>
                            </>
                          )}
                        </div>
                      </td>

                      {/* NOTE & AVIS */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span
                            style={{
                              background: "rgba(245, 158, 11, 0.15)",
                              color: "#f59e0b",
                              padding: "4px 8px",
                              borderRadius: 6,
                              fontWeight: 700,
                              fontSize: 13,
                            }}
                          >
                            ★ {p.rating}
                          </span>
                          <span style={{ fontSize: 12, color: "#94a3b8" }}>({p.review_count} avis)</span>
                        </div>
                      </td>

                      {/* SITE WEB ACTUEL */}
                      <td style={{ padding: "16px 20px" }}>
                        <span
                          style={{
                            background: "rgba(239, 68, 68, 0.15)",
                            color: "#ef4444",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            padding: "4px 10px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          ❌ Aucun site web
                        </span>
                      </td>

                      {/* STATUT */}
                      <td style={{ padding: "16px 20px" }}>
                        <select
                          value={p.status || "scouted"}
                          onChange={(e) => handleUpdateStatus(p.id, e.target.value)}
                          style={{
                            background:
                              p.status === "converted"
                                ? "#065f46"
                                : p.status === "pitched"
                                ? "#1e3a8a"
                                : p.status === "deployed"
                                ? "#581c87"
                                : "#1e293b",
                            color: "#fff",
                            border: "1px solid #334155",
                            borderRadius: 8,
                            padding: "6px 10px",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            outline: "none",
                          }}
                        >
                          <option value="scouted">🔍 Repéré (Scouted)</option>
                          <option value="site_generated">⚡ Site Généré</option>
                          <option value="deployed">🚀 Déployé Live</option>
                          <option value="pitched">💬 Contacté (Pitched)</option>
                          <option value="converted">🎉 Converti (Client)</option>
                          <option value="archived">Archivé</option>
                        </select>
                      </td>

                      {/* ACTIONS */}
                      <td style={{ padding: "16px 20px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                          {/* Bouton Générer Site IA */}
                          <button
                            onClick={() => handleGenerateSite(p)}
                            disabled={isGenerating}
                            title="Générer le site web haute conversion avec l'agent IA"
                            style={{
                              background: isGenerating ? "#475569" : "#1e293b",
                              color: isGenerating ? "#94a3b8" : "#f59e0b",
                              border: "1px solid #334155",
                              padding: "7px 12px",
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: isGenerating ? "not-allowed" : "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <span>{isGenerating ? "⏳ Création..." : "⚡ Générer Site"}</span>
                          </button>

                          {/* Bouton Aperçu Live */}
                          {p.site_html && (
                            <button
                              onClick={() => setPreviewProspect(p)}
                              title="Prévisualiser le site interactif"
                              style={{
                                background: "#1e293b",
                                color: "#38bdf8",
                                border: "1px solid #334155",
                                padding: "7px 12px",
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <span>👁️ Aperçu</span>
                            </button>
                          )}

                          {/* Bouton Modifier avec l'IA (Demandes clients) */}
                          {p.site_html && (
                            <button
                              onClick={() => {
                                setRevisionProspect(p);
                                setRevisionPrompt("");
                              }}
                              title="Modifier le site selon la demande du client via l'Agent IA"
                              style={{
                                background: "#1e293b",
                                color: "#f59e0b",
                                border: "1px solid rgba(245, 158, 11, 0.4)",
                                padding: "7px 12px",
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <span>🪄 Modifier IA</span>
                            </button>
                          )}

                          {/* Bouton Déployer (GitHub Pages 0€) */}
                          {p.site_html && (
                            <button
                              onClick={() => handleDeploySite(p)}
                              disabled={isDeploying}
                              title="Déployer gratuitement sur GitHub Pages"
                              style={{
                                background: isDeploying ? "#475569" : "#1e293b",
                                color: isDeploying ? "#94a3b8" : "#a855f7",
                                border: "1px solid #334155",
                                padding: "7px 12px",
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: isDeploying ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <span>{isDeploying ? "⏳ Déploiement..." : "🚀 Déployer"}</span>
                            </button>
                          )}

                          {/* Bouton Pitch WhatsApp */}
                          <button
                            onClick={() => setPitchProspect(p)}
                            title="Ouvrir le script de prospection WhatsApp personnalisé"
                            style={{
                              background: "#065f46",
                              color: "#34d399",
                              border: "1px solid #059669",
                              padding: "7px 12px",
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <span>💬 Pitch WhatsApp</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALE DE PRÉVISUALISATION DU SITE (IFRAME DEVICE SIMULATOR) */}
      {previewProspect && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 9000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
          }}
        >
          {/* Header de la modale */}
          <div
            style={{
              width: "100%",
              maxWidth: 1200,
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "14px 14px 0 0",
              padding: "12px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>
                Aperçu Site : {previewProspect.name}
              </span>
              <span style={{ color: "#94a3b8", fontSize: 12 }}>
                ({previewProspect.category} • {previewProspect.city})
              </span>
            </div>

            {/* Device Toggles */}
            <div style={{ display: "flex", background: "#1e293b", padding: 4, borderRadius: 8, gap: 4 }}>
              <button
                onClick={() => setPreviewDevice("desktop")}
                style={{
                  background: previewDevice === "desktop" ? "#334155" : "transparent",
                  color: previewDevice === "desktop" ? "#fff" : "#94a3b8",
                  border: "none",
                  padding: "5px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                💻 Ordinateur
              </button>
              <button
                onClick={() => setPreviewDevice("mobile")}
                style={{
                  background: previewDevice === "mobile" ? "#334155" : "transparent",
                  color: previewDevice === "mobile" ? "#fff" : "#94a3b8",
                  border: "none",
                  padding: "5px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                📱 Mobile
              </button>
            </div>

            {/* Actions modale */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <a
                href={`/v/${previewProspect.site_slug || previewProspect.id}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#38bdf8",
                  fontSize: 12,
                  textDecoration: "none",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span>Ouvrir plein écran ↗</span>
              </a>
              <button
                onClick={() => setPreviewProspect(null)}
                style={{
                  background: "#1e293b",
                  color: "#fff",
                  border: "none",
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Corps de l'iframe */}
          <div
            style={{
              width: "100%",
              maxWidth: 1200,
              flex: 1,
              background: "#000",
              border: "1px solid #334155",
              borderTop: "none",
              borderRadius: "0 0 14px 14px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: previewDevice === "mobile" ? "390px" : "100%",
                height: "100%",
                transition: "width 0.3s ease",
                borderLeft: previewDevice === "mobile" ? "1px solid #334155" : "none",
                borderRight: previewDevice === "mobile" ? "1px solid #334155" : "none",
              }}
            >
              <iframe
                src={`/v/${previewProspect.site_slug || previewProspect.id}`}
                title="Aperçu Site Prospect"
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODALE DE PITCH WHATSAPP */}
      {pitchProspect && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(6px)",
            zIndex: 9000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 18,
              width: "100%",
              maxWidth: 620,
              padding: 24,
              boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff" }}>
                  Message d'Approche WhatsApp (Show, Don't Tell)
                </h3>
                <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#94a3b8" }}>
                  Prospect : <strong style={{ color: "#fff" }}>{pitchProspect.name}</strong> • Tél : {pitchProspect.phone || "Non renseigné"}
                </p>
              </div>
              <button
                onClick={() => setPitchProspect(null)}
                style={{
                  background: "#1e293b",
                  color: "#fff",
                  border: "none",
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Visualiseur de Message style WhatsApp */}
            <div
              style={{
                background: "#0b141a",
                border: "1px solid #1f2c34",
                borderRadius: 14,
                padding: 16,
                fontSize: 14,
                lineHeight: "1.6",
                color: "#e9edef",
                whiteSpace: "pre-wrap",
                fontFamily: "system-ui, sans-serif",
                maxHeight: 280,
                overflowY: "auto",
                marginBottom: 20,
              }}
              {(() => {
                const publicBase = "https://radar-vitrines.vercel.app";
                let text = pitchProspect.pitch_message || `Bonjour l'équipe de *${pitchProspect.name}* 👋\n\nFélicitations pour votre note remarquable de *${pitchProspect.rating}⭐* sur Google Maps (${pitchProspect.review_count} avis clients vérifiés) !\n\nEn consultant votre fiche à ${pitchProspect.city}, nous avons remarqué que vous n'avez pas encore de site officiel.\n\nNous vous avons préparé un aperçu interactif de votre futur site officiel :\n👉 ${publicBase}/v/${pitchProspect.site_slug || pitchProspect.id}\n\nVos avis Google et votre bouton WhatsApp y sont déjà intégrés. Dites-nous ce que vous en pensez !\nBien cordialement,\nL'équipe Radar Vitrine`;
                
                // Remplacement strict de localhost si présent
                return text.replace(/http:\/\/localhost:[0-9]+/g, publicBase);
              })()}
            </div>

            {/* Boutons d'Action */}
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button
                onClick={() => {
                  const text =
                    pitchProspect.pitch_message ||
                    `Bonjour l'équipe de ${pitchProspect.name}...`;
                  navigator.clipboard.writeText(text);
                  showNotification("Message copié dans le presse-papier !");
                }}
                style={{
                  background: "#1e293b",
                  color: "#cbd5e1",
                  border: "1px solid #334155",
                  padding: "10px 16px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                📋 Copier le texte
              </button>

              {/* Bouton WhatsApp Web */}
              {(() => {
                const phone = (pitchProspect.phone || "").replace(/[^0-9+]/g, "");
                const waNum = phone.startsWith("+")
                  ? phone.replace("+", "")
                  : `212${phone.replace(/^0/, "")}`;
                const encoded = encodeURIComponent(
                  pitchProspect.pitch_message ||
                    `Bonjour l'équipe de *${pitchProspect.name}* 👋...`
                );
                const waUrl = `https://wa.me/${waNum || ""}?text=${encoded}`;

                return (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      handleUpdateStatus(pitchProspect.id, "pitched");
                      setPitchProspect(null);
                    }}
                    style={{
                      background: "#10b981",
                      color: "#000",
                      padding: "10px 20px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>💬 Ouvrir sur WhatsApp & Marquer "Contacté"</span>
                  </a>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* MODALE DE RÉVISION IA (DEMANDES MODIFICATION DU CLIENT) */}
      {revisionProspect && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(6px)",
            zIndex: 9000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 18,
              width: "100%",
              maxWidth: 620,
              padding: 24,
              boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                  <span>🪄</span> Modifier le site avec l'Agent IA
                </h3>
                <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#94a3b8" }}>
                  Établissement : <strong style={{ color: "#fff" }}>{revisionProspect.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setRevisionProspect(null)}
                style={{
                  background: "#1e293b",
                  color: "#fff",
                  border: "none",
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.5, marginBottom: 12 }}>
              Collez simplement le message WhatsApp du client ou vos instructions. L'agent IA appliquera les modifications chirurgicalement dans le code HTML tout en préservant le design :
            </p>

            <textarea
              rows={4}
              value={revisionPrompt}
              onChange={(e) => setRevisionPrompt(e.target.value)}
              placeholder="Ex: Change le numéro de téléphone en +212 6 32 15 54 30, ajoute 'Terrasse panoramique sur l'Atlas' dans les points forts et remplace le prix du menu par 180 MAD."
              style={{
                width: "100%",
                background: "#0b141a",
                border: "1px solid #334155",
                borderRadius: 12,
                padding: "12px 14px",
                color: "#fff",
                fontSize: 14,
                fontFamily: "inherit",
                resize: "vertical",
                marginBottom: 20,
                outline: "none",
              }}
            />

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                onClick={() => setRevisionProspect(null)}
                style={{
                  background: "#1e293b",
                  color: "#94a3b8",
                  border: "1px solid #334155",
                  padding: "10px 16px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleApplyRevision}
                disabled={modifying || !revisionPrompt.trim()}
                style={{
                  background: modifying ? "#475569" : "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "#000",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: modifying || !revisionPrompt.trim() ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>{modifying ? "⏳ Modification en cours..." : "⚡ Appliquer les modifications"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE TARIFS & FACTURATION (SYNCHRONISÉ CABINET HASSAN TIGUIDDA) */}
      {showPricingModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 9000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 20,
              width: "100%",
              maxWidth: 960,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: 28,
              boxShadow: "0 25px 50px rgba(0,0,0,0.7)",
            }}
          >
            {/* Header Tarifs */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div style={{ display: "inline-block", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", padding: "4px 12px", borderRadius: 12, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                  CATALOGUE DES OFFRES & FACTURATION
                </div>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fff" }}>
                  Services & Grille Tarifaire Radar Vitrine
                </h2>
                <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#94a3b8" }}>
                  Édité par <strong style={{ color: "#fff" }}>{AGENCY_PROFILE.cabinet}</strong> • WhatsApp : <a href={AGENCY_PROFILE.whatsappUrl} target="_blank" rel="noreferrer" style={{ color: "#34d399", textDecoration: "none" }}>{AGENCY_PROFILE.phone}</a>
                </p>
              </div>
              <button
                onClick={() => setShowPricingModal(false)}
                style={{
                  background: "#1e293b",
                  color: "#fff",
                  border: "none",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                ✕
              </button>
            </div>

            {/* Grille des Offres */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 24 }}>
              {PRICING_SERVICES.map((plan) => (
                <div
                  key={plan.id}
                  style={{
                    background: plan.isPopular
                      ? "linear-gradient(180deg, rgba(16, 185, 129, 0.12), rgba(15, 23, 42, 0.95))"
                      : "#1e293b",
                    border: plan.isPopular ? "2px solid #10b981" : "1px solid #334155",
                    borderRadius: 16,
                    padding: 22,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                  }}
                >
                  {plan.badge && (
                    <div
                      style={{
                        position: "absolute",
                        top: -10,
                        right: 14,
                        background: plan.isPopular ? "#10b981" : "#f59e0b",
                        color: "#000",
                        padding: "2px 8px",
                        borderRadius: 10,
                        fontSize: 10,
                        fontWeight: 800,
                      }}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: 16, fontWeight: 700, color: "#fff" }}>
                      {plan.title}
                    </h4>
                    <p style={{ margin: "0 0 12px 0", fontSize: 12, color: "#94a3b8" }}>
                      {plan.subtitle}
                    </p>

                    <div style={{ marginBottom: 16 }}>
                      <span style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{plan.price}</span>
                      <span style={{ fontSize: 14, color: "#cbd5e1" }}> {plan.currency}</span>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{plan.period}</div>
                    </div>

                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0", fontSize: 12, color: "#cbd5e1", display: "flex", flexDirection: "column", gap: 8 }}>
                      {plan.features.map((feat, idx) => (
                        <li key={idx} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                          <span style={{ color: "#10b981", fontWeight: 700 }}>✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={`${AGENCY_PROFILE.whatsappUrl}?text=${encodeURIComponent(plan.whatsappCta)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "block",
                      textAlign: "center",
                      background: plan.isPopular ? "#10b981" : "#334155",
                      color: plan.isPopular ? "#000" : "#fff",
                      padding: "10px",
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 12,
                      textDecoration: "none",
                    }}
                  >
                    Activer via WhatsApp 💬
                  </a>
                </div>
              ))}
            </div>

            {/* Note sur les modifications clients */}
            <div style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.25)", borderRadius: 12, padding: "14px 18px", fontSize: 13, color: "#fcd34d" }}>
              <strong>💡 Gestion des modifications clients :</strong> Vous offrez 1 révision gratuite lors de la découverte de la maquette (pour déclencher la confiance). Ensuite, toute mise à jour continue (changement de carte, photos, horaires) est incluse dans la <strong>Formule Sérénité à 390 MAD/mois</strong> ou le <strong>Pack Combo à 1 290 MAD/mois</strong> !
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
