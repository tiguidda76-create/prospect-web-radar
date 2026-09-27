-- ==============================================================================
-- PROSPECT WEB RADAR - Schéma PostgreSQL Supabase
-- À exécuter dans : Supabase > SQL Editor > New query
-- ==============================================================================

-- 1. Table des établissements détectés sur Google Maps sans site web
create table if not exists prospect_venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null, -- 'Restaurant', 'Riad', 'Hôtel', 'Salon de beauté', 'Dentiste', 'Café', 'Artisan', etc.
  city text not null default 'Marrakech',
  country text not null default 'Maroc',
  google_place_id text unique not null,
  rating numeric(2,1) not null default 4.8,
  review_count int default 0,
  phone text default '',
  address text default '',
  google_maps_url text default '',
  photos jsonb default '[]'::jsonb,
  top_reviews jsonb default '[]'::jsonb, -- 3-5 avis élogieux réels
  
  -- Tunnel de conversion
  status text not null default 'scouted' check (
    status in ('scouted', 'site_generated', 'deployed', 'pitched', 'converted', 'archived')
  ),
  
  -- Données du site web généré
  site_slug text unique,
  site_title text,
  site_html text, -- Code HTML5 / Tailwind complet autonome
  preview_url text, -- URL live GitHub Pages ou Vercel
  github_repo_path text, -- Chemin sur le dépôt GitHub (ex: sites/riad-al-baraka/index.html)
  
  -- Pitch et Prospection
  pitch_message text, -- Script WhatsApp personnalisé pré-rempli
  last_pitched_at timestamptz,
  notes text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Table des logs de scan et d'activité
create table if not exists scout_logs (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  city text not null,
  category text not null,
  total_found int default 0,
  prospects_saved int default 0,
  error_message text,
  created_at timestamptz default now()
);

-- 3. Table de suivi des interactions / outreach
create table if not exists outreach_logs (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid references prospect_venues(id) on delete cascade,
  channel text not null default 'whatsapp' check (channel in ('whatsapp', 'email', 'sms', 'call')),
  status text not null default 'sent',
  message_preview text,
  created_at timestamptz default now()
);

-- Index d'optimisation
create index if not exists idx_prospect_rating on prospect_venues(rating desc);
create index if not exists idx_prospect_status on prospect_venues(status);
create index if not exists idx_prospect_city on prospect_venues(city);
create index if not exists idx_prospect_category on prospect_venues(category);
