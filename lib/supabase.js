import { createClient } from "@supabase/supabase-js";
import { CONFIG } from "./config.js";

let supabaseClient = null;

export function getSupabase() {
  if (supabaseClient) return supabaseClient;

  const url = CONFIG.SUPABASE_URL;
  const key = CONFIG.SUPABASE_SERVICE_ROLE_KEY || CONFIG.SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("Supabase credentials non configurées dans .env.local");
    return null;
  }

  supabaseClient = createClient(url, key, {
    auth: { persistSession: false },
  });

  return supabaseClient;
}

// Mémoire et persistance fichier locale
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "prospects.json");

function readLocalProspects() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Erreur lecture data/prospects.json:", e.message);
  }
  return [];
}

function writeLocalProspects(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.warn("Erreur écriture data/prospects.json:", e.message);
  }
}

let inMemoryProspects = readLocalProspects();

export async function fetchProspectsFromDb() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("prospect_venues")
        .select("*")
        .order("rating", { ascending: false });

      if (!error && data && data.length > 0) {
        writeLocalProspects(data);
        return data;
      }
    } catch (e) {
      // repli transparent sur la base locale
    }
  }
  if (inMemoryProspects.length === 0) {
    const { MOCK_SCOUTED_PROSPECTS } = await import("./googlePlacesScout");
    inMemoryProspects = MOCK_SCOUTED_PROSPECTS;
    writeLocalProspects(inMemoryProspects);
  }
  return inMemoryProspects;
}

export async function saveProspectsToDb(prospects) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("prospect_venues")
        .upsert(prospects, { onConflict: "google_place_id" })
        .select();

      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn("Erreur upsert Supabase, sauvegarde en mémoire locale:", e.message);
    }
  }

  // Fallback in-memory & fichier local
  for (const p of prospects) {
    const idx = inMemoryProspects.findIndex(
      (item) => item.google_place_id === p.google_place_id || item.id === p.id
    );
    if (idx >= 0) {
      inMemoryProspects[idx] = { ...inMemoryProspects[idx], ...p, updated_at: new Date().toISOString() };
    } else {
      inMemoryProspects.push({
        ...p,
        id: p.id || `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }
  writeLocalProspects(inMemoryProspects);
  return inMemoryProspects;
}

export async function updateProspectInDb(id, updates) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("prospect_venues")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn("Erreur update Supabase:", e.message);
    }
  }

  const idx = inMemoryProspects.findIndex((p) => p.id === id || p.google_place_id === id);
  if (idx >= 0) {
    inMemoryProspects[idx] = {
      ...inMemoryProspects[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    writeLocalProspects(inMemoryProspects);
    return inMemoryProspects[idx];
  }
  return null;
}
