"use client";

import React, { useState, useEffect } from "react";

import { AGENCY_PROFILE, PRICING_SERVICES, buildInvoiceData } from "@/lib/billingAndServices.js";
import { generateWhatsAppPitch, formatPhoneNumber } from "@/lib/pitchGenerator.js";

export default function ProspectRadarDashboard() {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);
  const [deployingId, setDeployingId] = useState(null);

  // Filtres de recherche
  const [city, setCity] = useState("Marrakech");
  const [category, setCategory] = useState("all");
  const [minRating, setMinRating] = useState(4.7);
  const [statusFilter, setStatusFilter] = useState("all");
  const [tableSearch, setTableSearch] = useState("");
  const [tableCategoryFilter, setTableCategoryFilter] = useState("all");

  // Modales
  const [previewProspect, setPreviewProspect] = useState(null);
  const [previewDevice, setPreviewDevice] = useState("desktop"); // 'desktop' | 'mobile'
  const [pitchProspect, setPitchProspect] = useState(null);
  const [pitchMarket, setPitchMarket] = useState("morocco"); // 'morocco' | 'france'
  const [pitchChannel, setPitchChannel] = useState("whatsapp"); // 'whatsapp' | 'email'
  const [customPitchPhone, setCustomPitchPhone] = useState("");
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pricingCurrency, setPricingCurrency] = useState("MAD"); // 'MAD' | 'EUR'
  const [revisionProspect, setRevisionProspect] = useState(null);
  const [revisionPrompt, setRevisionPrompt] = useState("");
  const [modifying, setModifying] = useState(false);
  const [notification, setNotification] = useState(null);

  // Modale Facturation & Devis Officiel (Cabinet Hassan Tiguidda)
  const [invoiceProspect, setInvoiceProspect] = useState(null);
  const [invoiceDocType, setInvoiceDocType] = useState("invoice"); // 'invoice' | 'estimate'
  const [invoiceServiceId, setInvoiceServiceId] = useState("vitrine_starter");
  const [invoiceMarket, setInvoiceMarket] = useState("morocco"); // 'morocco' | 'france'

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

  // Ouvrir la modale d'outreach (WhatsApp / Cold Email B2B)
  const handleOpenPitch = (prospect) => {
    const isFrench =
      prospect.country?.toLowerCase().includes("france") ||
      ["paris", "nice", "lyon", "bordeaux", "marseille", "lille"].some((c) =>
        (prospect.city || "").toLowerCase().includes(c)
      );
    const m = isFrench ? "france" : "morocco";
    setPitchMarket(m);
    setPitchChannel(isFrench ? "email" : "whatsapp");
    const num = formatPhoneNumber(prospect.phone, isFrench ? "France" : prospect.city);
    setCustomPitchPhone(num);
    setPitchProspect(prospect);
  };

  // Ouvrir la modale de facturation ou devis officiel
  const handleOpenInvoice = (prospect, docType = "invoice") => {
    const isFrench =
      prospect.country?.toLowerCase().includes("france") ||
      ["paris", "nice", "lyon", "bordeaux", "marseille", "lille"].some((c) =>
        (prospect.city || "").toLowerCase().includes(c)
      );
    setInvoiceMarket(isFrench ? "france" : "morocco");
    setInvoiceDocType(docType);
    setInvoiceServiceId("vitrine_starter");
    setInvoiceProspect(prospect);
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

        // Déclenchement automatique de la facture dès qu'un client dit "OK" / est converti
        if (newStatus === "converted") {
          const target = prospects.find((p) => p.id === id);
          if (target) {
            handleOpenInvoice(target, "invoice");
          }
        }
      }
    } catch (e) {
      showNotification("Erreur de mise à jour", "error");
    }
  };

  // Filtrage des prospects affichés
  const filteredProspects = prospects.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (tableCategoryFilter !== "all" && (p.category || "").toLowerCase() !== tableCategoryFilter.toLowerCase()) return false;
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      const matchName = (p.name || "").toLowerCase().includes(q);
      const matchCity = (p.city || "").toLowerCase().includes(q);
      const matchCat = (p.category || "").toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchCat) return false;
    }
    return true;
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
              <option value="Marrakech">Marrakech (Maroc)</option>
              <option value="Casablanca">Casablanca (Maroc)</option>
              <option value="Rabat">Rabat (Maroc)</option>
              <option value="Essaouira">Essaouira (Maroc)</option>
              <option value="Tanger">Tanger (Maroc)</option>
              <option value="Agadir">Agadir (Maroc)</option>
              <option value="Paris">Paris (France)</option>
              <option value="Nice">Nice (France)</option>
              <option value="Lyon">Lyon (France)</option>
              <option value="Bordeaux">Bordeaux (France)</option>
              <option value="Marseille">Marseille (France)</option>
            </select>
          </div>

          <div style={{ minWidth: 200, flex: "1 1 220px" }}>
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
              <option value="all">🌐 Tous les métiers (Recherche globale)</option>
              <option value="Restaurant">Restaurant / Bistro</option>
              <option value="Riad">Riad & Maison d'hôtes</option>
              <option value="Salon de beauté">Salon de beauté / Spa / Hammam</option>
              <option value="Artisan">Artisan / Maroquinerie / Céramique</option>
              <option value="Dentiste">Dentiste / Cabinet Médical</option>
              <option value="Café">Café & Brunch</option>
              <option value="Hôtel">Hôtel & Hébergement</option>
              <option value="Commerce">Commerce & Boutique</option>
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

      {/* FILTER TABS & QUICK SEARCH */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, flex: "1 1 500px" }}>
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
                whiteSpace: "nowrap",
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

        {/* Quick Search & Filter in Table */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="🔍 Filtrer nom, ville..."
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: 8,
              color: "#fff",
              padding: "7px 12px",
              fontSize: 13,
              outline: "none",
              width: 170,
            }}
          />
          <select
            value={tableCategoryFilter}
            onChange={(e) => setTableCategoryFilter(e.target.value)}
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: 8,
              color: "#fff",
              padding: "7px 12px",
              fontSize: 13,
              outline: "none",
            }}
          >
            <option value="all">Tous les métiers</option>
            <option value="Riad">Riad</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Salon de beauté">Salon / Spa</option>
            <option value="Artisan">Artisan</option>
            <option value="Dentiste">Dentiste</option>
            <option value="Café">Café</option>
          </select>
        </div>
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

                          {/* Bouton Pitch Outreach (WhatsApp / Email) */}
                          <button
                            onClick={() => handleOpenPitch(p)}
                            title="Ouvrir l'outreach direct (WhatsApp 1-clic ou Cold Email B2B France)"
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
                            <span>💬 Pitch Outreach</span>
                          </button>

                          {/* Bouton Créer Facture / Devis */}
                          <button
                            onClick={() => handleOpenInvoice(p, p.status === "converted" ? "invoice" : "estimate")}
                            title="Générer une Facture ou un Devis officiel Cabinet Hassan Tiguidda"
                            style={{
                              background: p.status === "converted" ? "linear-gradient(135deg, #10b981, #059669)" : "#1e293b",
                              color: p.status === "converted" ? "#fff" : "#cbd5e1",
                              border: p.status === "converted" ? "1px solid #10b981" : "1px solid #334155",
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
                            <span>📄 {p.status === "converted" ? "Facture" : "Devis"}</span>
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

      {/* MODALE MULTI-CANAL D'OUTREACH (WHATSAPP 1-CLIC DIRECT & COLD EMAIL FRANCE) */}
      {pitchProspect && (() => {
        const pitchData = generateWhatsAppPitch(
          pitchProspect,
          pitchProspect.preview_url || `/v/${pitchProspect.site_slug || pitchProspect.id}`,
          pitchMarket
        );

        const currentPhone = customPitchPhone || pitchData.waNumber;
        const encodedMsg = encodeURIComponent(pitchData.rawMessage);
        const directWaAppUrl = currentPhone ? `whatsapp://send?phone=${currentPhone}&text=${encodedMsg}` : null;
        const directWaApiUrl = currentPhone ? `https://api.whatsapp.com/send?phone=${currentPhone}&text=${encodedMsg}` : null;
        const directWaWebUrl = currentPhone ? `https://web.whatsapp.com/send?phone=${currentPhone}&text=${encodedMsg}` : null;

        const handleDirectWhatsApp = (url) => {
          if (!currentPhone) {
            showNotification("Veuillez renseigner le numéro de téléphone", "error");
            return;
          }
          window.open(url, "_blank");
          handleUpdateStatus(pitchProspect.id, "pitched");
          showNotification("🚀 WhatsApp ouvert avec le message pré-rempli !");
        };

        const handleDirectEmail = () => {
          window.location.href = pitchData.mailtoUrl;
          handleUpdateStatus(pitchProspect.id, "pitched");
          showNotification("✉️ Application Email ouverte avec l'objet et corps pré-remplis !");
        };

        return (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.85)",
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
                borderRadius: 20,
                width: "100%",
                maxWidth: 680,
                padding: 26,
                boxShadow: "0 25px 50px rgba(0,0,0,0.7)",
                maxHeight: "92vh",
                overflowY: "auto",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 18 }}>🚀</span>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#fff" }}>
                      Campagne d'Outreach Personnalisée
                    </h3>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
                    Établissement : <strong style={{ color: "#fff" }}>{pitchProspect.name}</strong> • {pitchProspect.city} ({pitchProspect.rating}★)
                  </p>
                </div>
                <button
                  onClick={() => setPitchProspect(null)}
                  style={{
                    background: "#1e293b",
                    color: "#fff",
                    border: "none",
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Toggles : Marché & Canal */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                {/* Switcher Marché */}
                <div style={{ background: "#1e293b", padding: 4, borderRadius: 12, display: "flex", gap: 4 }}>
                  <button
                    onClick={() => {
                      setPitchMarket("morocco");
                      const num = formatPhoneNumber(pitchProspect.phone, "Maroc");
                      setCustomPitchPhone(num);
                    }}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "none",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: pitchMarket === "morocco" ? "#0f172a" : "transparent",
                      color: pitchMarket === "morocco" ? "#f59e0b" : "#94a3b8",
                      boxShadow: pitchMarket === "morocco" ? "0 2px 8px rgba(0,0,0,0.4)" : "none",
                    }}
                  >
                    🇲🇦 Marché Maroc (MAD)
                  </button>
                  <button
                    onClick={() => {
                      setPitchMarket("france");
                      setPitchChannel("email");
                      const num = formatPhoneNumber(pitchProspect.phone, "France");
                      setCustomPitchPhone(num);
                    }}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "none",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: pitchMarket === "france" ? "#0f172a" : "transparent",
                      color: pitchMarket === "france" ? "#38bdf8" : "#94a3b8",
                      boxShadow: pitchMarket === "france" ? "0 2px 8px rgba(0,0,0,0.4)" : "none",
                    }}
                  >
                    🇫🇷 Marché France (EUR €)
                  </button>
                </div>

                {/* Switcher Canal */}
                <div style={{ background: "#1e293b", padding: 4, borderRadius: 12, display: "flex", gap: 4 }}>
                  <button
                    onClick={() => setPitchChannel("whatsapp")}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "none",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: pitchChannel === "whatsapp" ? "#065f46" : "transparent",
                      color: pitchChannel === "whatsapp" ? "#34d399" : "#94a3b8",
                    }}
                  >
                    💬 WhatsApp 1-Clic
                  </button>
                  <button
                    onClick={() => setPitchChannel("email")}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "none",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: pitchChannel === "email" ? "#1e3a8a" : "transparent",
                      color: pitchChannel === "email" ? "#60a5fa" : "#94a3b8",
                    }}
                  >
                    ✉️ Cold Email B2B
                  </button>
                </div>
              </div>

              {/* Mode WHATSAPP */}
              {pitchChannel === "whatsapp" && (
                <div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
                      Numéro WhatsApp cible (format international auto : {pitchMarket === "france" ? "+33..." : "+212..."}) :
                    </label>
                    <input
                      type="text"
                      value={currentPhone}
                      onChange={(e) => setCustomPitchPhone(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="Ex: 212632155430 ou 33612345678"
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
                    />
                  </div>

                  <div
                    style={{
                      background: "#0b141a",
                      border: "1px solid #1f2c34",
                      borderRadius: 14,
                      padding: 16,
                      fontSize: 13,
                      lineHeight: "1.6",
                      color: "#e9edef",
                      whiteSpace: "pre-wrap",
                      fontFamily: "system-ui, sans-serif",
                      maxHeight: 220,
                      overflowY: "auto",
                      marginBottom: 20,
                    }}
                  >
                    {pitchData.rawMessage}
                  </div>

                  {/* Actions 1-Clic WhatsApp Direct */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(pitchData.rawMessage);
                        showNotification("Message copié !");
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
                      📋 Copier
                    </button>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button
                        onClick={() => handleDirectWhatsApp(directWaWebUrl)}
                        style={{
                          background: "#1e293b",
                          color: "#38bdf8",
                          border: "1px solid #0284c7",
                          padding: "10px 14px",
                          borderRadius: 10,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        💻 WhatsApp Web
                      </button>

                      {/* LE BOUTON CLÉ : TRANSFERT DIRECT SANS COPIER COLLER */}
                      <button
                        onClick={() => handleDirectWhatsApp(directWaApiUrl || directWaAppUrl)}
                        style={{
                          background: "linear-gradient(135deg, #10b981, #059669)",
                          color: "#000",
                          border: "none",
                          padding: "11px 20px",
                          borderRadius: 10,
                          fontSize: 14,
                          fontWeight: 800,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          boxShadow: "0 4px 15px rgba(16, 185, 129, 0.35)",
                        }}
                      >
                        <span>🚀 Ouvrir directement dans WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode COLD EMAIL B2B (MARCHÉ FRANCE) */}
              {pitchChannel === "email" && (
                <div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
                      Objet de l'Email :
                    </label>
                    <div
                      style={{
                        background: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: 8,
                        padding: "8px 12px",
                        color: "#38bdf8",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {pitchData.emailSubject}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#0b141a",
                      border: "1px solid #1f2c34",
                      borderRadius: 14,
                      padding: 16,
                      fontSize: 13,
                      lineHeight: "1.6",
                      color: "#e9edef",
                      whiteSpace: "pre-wrap",
                      fontFamily: "system-ui, sans-serif",
                      maxHeight: 220,
                      overflowY: "auto",
                      marginBottom: 20,
                    }}
                  >
                    {pitchData.emailBody}
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${pitchData.emailSubject}\n\n${pitchData.emailBody}`);
                        showNotification("Email copié dans le presse-papier !");
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
                      📋 Copier l'Email
                    </button>

                    <button
                      onClick={handleDirectEmail}
                      style={{
                        background: "linear-gradient(135deg, #38bdf8, #0284c7)",
                        color: "#000",
                        border: "none",
                        padding: "11px 22px",
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        boxShadow: "0 4px 15px rgba(56, 189, 248, 0.35)",
                      }}
                    >
                      <span>✉️ Ouvrir dans mon application Email (Gmail / Outlook)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* MODALE DE FACTURATION & DEVIS OFFICIEL (CABINET HASSAN TIGUIDDA) */}
      {invoiceProspect && (() => {
        const inv = buildInvoiceData({
          prospect: invoiceProspect,
          serviceId: invoiceServiceId,
          docType: invoiceDocType,
          market: invoiceMarket,
        });

        const handleSendInvoiceWhatsApp = () => {
          const phone = formatPhoneNumber(invoiceProspect.phone, invoiceMarket === "france" ? "France" : invoiceProspect.city);
          const msg = `Bonjour l'équipe de *${invoiceProspect.name}*,\n\nVoici les détails de votre document officiel (*${inv.docType === "invoice" ? "Facture" : "Devis"} ${inv.docNumber}*) pour la prestation : *${inv.service.title}* (${inv.totalNet}).\n\n🏦 *Coordonnées bancaires pour le règlement :*\n- Prestataire : ${inv.agency.agencyName}\n- Statut : ${inv.agency.legalStatus} (ICE: ${inv.agency.ice})\n- Banque : ${inv.agency.bankName}\n- RIB : *${inv.agency.rib}*\n- Code SWIFT / BIC : ${inv.agency.swiftBic}\n- Réf virement : ${inv.docNumber}\n\n${inv.vatNotice}\n\nRestant à votre entière disposition,\nBien cordialement,\nHassan Tiguidda`;
          const encoded = encodeURIComponent(msg);
          const url = phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}` : `https://wa.me/?text=${encoded}`;
          window.open(url, "_blank");
          showNotification("WhatsApp ouvert avec la facture et les coordonnées bancaires !");
        };

        return (
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
                maxWidth: 820,
                maxHeight: "94vh",
                overflowY: "auto",
                padding: 26,
                boxShadow: "0 25px 50px rgba(0,0,0,0.8)",
              }}
            >
              {/* Header Contrôles */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#fff" }}>
                    Générateur de Facture & Devis Officiel
                  </h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#94a3b8" }}>
                    Établi pour : <strong style={{ color: "#fff" }}>{invoiceProspect.name}</strong> • Conforme Droit Commercial & Fiscal
                  </p>
                </div>
                <button
                  onClick={() => setInvoiceProspect(null)}
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

              {/* Barre de Configuration du Document */}
              <div
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: 14,
                  padding: 14,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                {/* Type de Document */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => setInvoiceDocType("invoice")}
                    style={{
                      background: invoiceDocType === "invoice" ? "#10b981" : "#0f172a",
                      color: invoiceDocType === "invoice" ? "#000" : "#cbd5e1",
                      border: "none",
                      padding: "7px 14px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    📄 Facture Officielle
                  </button>
                  <button
                    onClick={() => setInvoiceDocType("estimate")}
                    style={{
                      background: invoiceDocType === "estimate" ? "#38bdf8" : "#0f172a",
                      color: invoiceDocType === "estimate" ? "#000" : "#cbd5e1",
                      border: "none",
                      padding: "7px 14px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    📋 Devis d'Offre
                  </button>
                </div>

                {/* Marché & Devise */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => setInvoiceMarket("morocco")}
                    style={{
                      background: invoiceMarket === "morocco" ? "#f59e0b" : "#0f172a",
                      color: invoiceMarket === "morocco" ? "#000" : "#cbd5e1",
                      border: "none",
                      padding: "7px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    🇲🇦 MAD (Maroc)
                  </button>
                  <button
                    onClick={() => setInvoiceMarket("france")}
                    style={{
                      background: invoiceMarket === "france" ? "#38bdf8" : "#0f172a",
                      color: invoiceMarket === "france" ? "#000" : "#cbd5e1",
                      border: "none",
                      padding: "7px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    🇫🇷 EUR € (France)
                  </button>
                </div>

                {/* Pack Choisi */}
                <div>
                  <select
                    value={invoiceServiceId}
                    onChange={(e) => setInvoiceServiceId(e.target.value)}
                    style={{
                      background: "#0f172a",
                      border: "1px solid #475569",
                      borderRadius: 8,
                      color: "#fff",
                      padding: "7px 12px",
                      fontSize: 13,
                      fontWeight: 600,
                      outline: "none",
                    }}
                  >
                    {PRICING_SERVICES.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.title} ({invoiceMarket === "france" ? `${srv.priceEUR} €` : `${srv.priceMAD} MAD`})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DOCUMENT IMPRIMABLE STYLE PAPIER BLANC JURIDIQUE */}
              <div
                id="printable-invoice"
                style={{
                  background: "#ffffff",
                  color: "#0f172a",
                  borderRadius: 12,
                  padding: "36px 40px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  fontFamily: "'Segoe UI', Roboto, sans-serif",
                }}
              >
                {/* En-tête Facture */}
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #e2e8f0", paddingBottom: 20, marginBottom: 24 }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em" }}>
                      {inv.agency.agencyName}
                    </h2>
                    <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
                      Statut : {inv.agency.legalStatus} • ICE : <strong>{inv.agency.ice}</strong>
                    </div>
                    <div style={{ fontSize: 12, color: "#475569" }}>{inv.agency.address}</div>
                    <div style={{ fontSize: 12, color: "#475569" }}>
                      Tél : {inv.agency.phone} • Email : {inv.agency.email}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        display: "inline-block",
                        background: inv.docType === "invoice" ? "#065f46" : "#0369a1",
                        color: "#fff",
                        padding: "5px 14px",
                        borderRadius: 6,
                        fontWeight: 800,
                        fontSize: 13,
                        marginBottom: 6,
                      }}
                    >
                      {inv.docType === "invoice" ? "FACTURE OFFICIELLE" : "DEVIS D'OFFRE"}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>N° {inv.docNumber}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Date : {inv.dateStr}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Échéance : {inv.dueDate}</div>
                  </div>
                </div>

                {/* Client Facturé */}
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: 14, marginBottom: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#64748b", marginBottom: 4 }}>
                    Facturé à (Client) :
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{inv.client.name}</div>
                  <div style={{ fontSize: 13, color: "#334155" }}>{inv.client.address}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    Contact : {inv.client.contact} • Tél : {inv.client.phone || "Non renseigné"}
                  </div>
                </div>

                {/* Tableau des Prestations */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24, fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#f1f5f9", borderBottom: "2px solid #cbd5e1", textAlign: "left" }}>
                      <th style={{ padding: "10px 14px", color: "#334155" }}>Désignation de la prestation</th>
                      <th style={{ padding: "10px 14px", textAlign: "center", color: "#334155", width: 60 }}>Qté</th>
                      <th style={{ padding: "10px 14px", textAlign: "right", color: "#334155", width: 140 }}>Total HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "14px" }}>
                        <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 14 }}>{inv.service.title}</div>
                        <div style={{ fontSize: 12, color: "#64748b", margin: "4px 0" }}>{inv.service.subtitle}</div>
                        <ul style={{ margin: "6px 0 0 16px", padding: 0, fontSize: 11, color: "#475569" }}>
                          {inv.service.features.slice(0, 4).map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </td>
                      <td style={{ padding: "14px", textAlign: "center", verticalAlign: "top", fontWeight: 700 }}>1</td>
                      <td style={{ padding: "14px", textAlign: "right", verticalAlign: "top", fontWeight: 800, fontSize: 15 }}>
                        {inv.subtotal}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Totaux & Mentions Légales */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
                  <div style={{ maxWidth: 400, fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>
                    <strong>Mention Fiscale :</strong> {inv.vatNotice}
                    <div style={{ marginTop: 4 }}>
                      Règlement à réception par virement bancaire ou chèque à l'ordre de « <strong>{inv.agency.orderOf}</strong> ».
                    </div>
                  </div>

                  <div style={{ minWidth: 220, textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
                      <span style={{ color: "#64748b" }}>Total Hors Taxes :</span>
                      <strong style={{ color: "#0f172a" }}>{inv.subtotal}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
                      <span style={{ color: "#64748b" }}>TVA (0%) :</span>
                      <span>{inv.tax}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 0 0 0",
                        marginTop: 6,
                        borderTop: "2px solid #0f172a",
                        fontSize: 17,
                        fontWeight: 900,
                        color: "#0f172a",
                      }}
                    >
                      <span>Net à Payer :</span>
                      <span style={{ color: "#059669" }}>{inv.totalNet}</span>
                    </div>
                  </div>
                </div>

                {/* Coordonnées Bancaires (RIB) */}
                <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 8, padding: "14px 18px", fontSize: 12 }}>
                  <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
                    COORDONNÉES BANCAIRES POUR VIREMENT :
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 12px", color: "#334155" }}>
                    <span>Banque :</span> <strong>{inv.agency.bankName}</strong>
                    <span>Titulaire :</span> <strong>{inv.agency.orderOf}</strong>
                    <span>RIB (24 chiffres) :</span> <strong style={{ letterSpacing: "0.05em", color: "#0f172a" }}>{inv.agency.rib}</strong>
                    <span>Code SWIFT / BIC :</span> <strong>{inv.agency.swiftBic}</strong>
                    <span>Libellé virement :</span> <strong>Réf {inv.docNumber}</strong>
                  </div>
                </div>
              </div>

              {/* Boutons d'Action Facture */}
              <div style={{ display: "flex", gap: 12, justifyContent: "space-between", alignItems: "center", marginTop: 22, flexWrap: "wrap" }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`Banque : ${inv.agency.bankName}\nTitulaire : ${inv.agency.orderOf}\nRIB : ${inv.agency.rib}\nSWIFT : ${inv.agency.swiftBic}\nICE : ${inv.agency.ice}`);
                    showNotification("Coordonnées RIB copiées dans le presse-papier !");
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
                  📋 Copier Coordonnées RIB
                </button>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={() => window.print()}
                    style={{
                      background: "#334155",
                      color: "#fff",
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>🖨️ Imprimer / Sauvegarder PDF</span>
                  </button>

                  <button
                    onClick={handleSendInvoiceWhatsApp}
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "#000",
                      border: "none",
                      padding: "11px 22px",
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      boxShadow: "0 4px 15px rgba(16, 185, 129, 0.35)",
                    }}
                  >
                    <span>💬 Envoyer Facture & RIB sur WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
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

              {/* Devise Toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ background: "#1e293b", padding: 4, borderRadius: 10, display: "flex", gap: 4 }}>
                  <button
                    onClick={() => setPricingCurrency("MAD")}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: "none",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: pricingCurrency === "MAD" ? "#f59e0b" : "transparent",
                      color: pricingCurrency === "MAD" ? "#000" : "#94a3b8",
                    }}
                  >
                    🇲🇦 MAD (Maroc)
                  </button>
                  <button
                    onClick={() => setPricingCurrency("EUR")}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: "none",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: pricingCurrency === "EUR" ? "#38bdf8" : "transparent",
                      color: pricingCurrency === "EUR" ? "#000" : "#94a3b8",
                    }}
                  >
                    🇫🇷 EUR € (France)
                  </button>
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
            </div>

            {/* Grille des Offres */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 24 }}>
              {PRICING_SERVICES.map((plan) => {
                const isEUR = pricingCurrency === "EUR";
                const displayPrice = isEUR ? plan.priceEUR : plan.priceMAD;
                const displayCurrency = isEUR ? "€" : "MAD";
                const displayPeriod = isEUR ? plan.periodEUR : plan.periodMAD;
                const displayCta = isEUR ? plan.whatsappCtaEUR : plan.whatsappCtaMAD;

                return (
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
                        <span style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{displayPrice}</span>
                        <span style={{ fontSize: 14, color: "#cbd5e1" }}> {displayCurrency}</span>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{displayPeriod}</div>
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
                      href={`${AGENCY_PROFILE.whatsappUrl}?text=${encodeURIComponent(displayCta)}`}
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
                );
              })}
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
