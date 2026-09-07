/**
 * onepick — Autonomous Seed Engine & Background Bot
 * Autopopulates the decentralized Zen P2P radio with curated cultural transmissions
 * across YouTube, SoundCloud, Bandcamp, Internet Archive, Audius, Mixcloud, and TuneCamp rotating every 15 minutes.
 */

export const SALT_PREFIX = 'onepick:zen:station:';

export const SEED_BOTS = [
  {
    id: 'obscura',
    username: 'radio-obscura',
    passphrase: 'onepick-seed-obscura-2026-ether',
    tag: 'obscureweb',
    provider: 'archiveorg',
    desc: 'Forgotten frequencies, lo-fi tape loops, and analog gems from the obscure web.'
  },
  {
    id: 'transit',
    username: 'sound-transit',
    passphrase: 'onepick-seed-transit-2026-fm',
    tag: 'sound',
    provider: 'somafm',
    desc: 'Continuous radio streams, drone, deep ambient, and transit soundscapes via SomaFM.'
  },
  {
    id: 'zero',
    username: 'ambient-zero',
    passphrase: 'onepick-seed-zero-2026-relay',
    tag: 'art',
    provider: 'youtube',
    desc: 'Minimal signals, endless tape loops, and present stillness for overstimulated minds.'
  },
  {
    id: 'tunecamp',
    username: 'tunecamp-relay',
    passphrase: 'onepick-seed-tunecamp-2026-federation',
    tag: 'sound',
    provider: 'tunecamp',
    desc: 'Independent music and federated releases streaming across all TuneCamp network instances (SudoRecords, SubTerra Label & federated nodes).'
  },
  {
    id: 'cyber',
    username: 'retro-cyber',
    passphrase: 'onepick-seed-cyber-2026-matrix',
    tag: 'code',
    provider: 'archiveorg',
    desc: 'Demoscene music, tracker modules, keygen synthesis, and algorithmic soundscapes.'
  },
  {
    id: 'echo',
    username: 'tape-echo',
    passphrase: 'onepick-seed-echo-2026-reverb',
    tag: 'read',
    provider: 'bandcamp',
    desc: 'Spoken word archives, literary field trips, slow cinema, and tape echo chambers.'
  },
  {
    id: 'archive-echo',
    username: 'archive-echo',
    passphrase: 'onepick-seed-archive-2026-ether',
    tag: 'read',
    provider: 'archiveorg',
    desc: 'Historical radio archive, lyrical readings, and period conversations.'
  },
  {
    id: 'mystic',
    username: 'mystic-whispers',
    passphrase: 'onepick-seed-mystic-2026-ether',
    tag: 'sound',
    provider: 'bandcamp',
    desc: 'Independent releases, featured albums, and hidden sonic gems from Bandcamp.'
  },
  {
    id: 'neon',
    username: 'neon-drift',
    passphrase: 'onepick-seed-neon-2026-fm',
    tag: 'sound',
    provider: 'audius',
    desc: 'Synthwave odyssey through neon-lit digital landscapes and retro-futuristic ambience.'
  },
  {
    id: 'void',
    username: 'void-pulse',
    passphrase: 'onepick-seed-void-2026-art',
    tag: 'sound',
    provider: 'mixcloud',
    desc: 'Hypnotic DJ sets, ambient sessions, and long-form radio broadcasts on Mixcloud.'
  }
];

// --- TuneCamp Federation Live Stream Catalog ---
export const TUNECAMP_DEFAULT_INSTANCES = [
  'https://sudorecords.scobrudot.dev',
  'https://tunecamp.subterralabel.com',
  'https://tunecamp.fdalabs.net'
];

export const TUNECAMP_FALLBACK_TRACKS = [
  {
    url: 'https://sudorecords.scobrudot.dev/releases/120-punk',
    title: 'Homologo - 120 PUNK',
    caption: 'Independent bouncy techno directly from the TuneCamp federation on SudoRecords.',
    tag: 'sound'
  },
  {
    url: 'https://tunecamp.subterralabel.com/releases/la-guerra-delle-formiche',
    title: 'La Guerra delle Formiche - La Guerra delle Formiche',
    caption: 'Progressive, alt-rock, and indie rock from SubTerra Label on TuneCamp.',
    tag: 'sound'
  },
  {
    url: 'https://sudorecords.scobrudot.dev/releases/waterflow',
    title: 'Homologo - Waterflow',
    caption: 'Indie dance and luminous grooves streaming decentralized from the TuneCamp network.',
    tag: 'sound'
  },
  {
    url: 'https://tunecamp.subterralabel.com/releases/kali-yuga',
    title: 'Eva Milan - Kali Yuga',
    caption: 'Alternative Rock, Post-Punk, and grunge from SubTerra Label on the federated TuneCamp network.',
    tag: 'sound'
  },
  {
    url: 'https://sudorecords.scobrudot.dev/releases/ragazzi-in-collera',
    title: 'Homologo - Ragazzi in collera',
    caption: 'Electronic textures and independent productions from the open TuneCamp catalog.',
    tag: 'sound'
  },
  {
    url: 'https://tunecamp.subterralabel.com/releases/no-word-is-ever-enough',
    title: 'Humpty Dumpty & La Guerra delle Formiche - No Word Is Ever Enough',
    caption: 'Indie rock, slow core, and grunge copyleft music on TuneCamp.',
    tag: 'sound'
  },
  {
    url: 'https://sudorecords.scobrudot.dev/releases/la-prima-2',
    title: 'Homologo - La Prima - live set',
    caption: 'Minimal techno live session and club frequencies recorded live on TuneCamp.',
    tag: 'sound'
  },
  {
    url: 'https://tunecamp.subterralabel.com/releases/gibellina-song',
    title: 'Humpty Dumpty, La Guerra delle Formiche, Sumire - Gibellina Song',
    caption: 'Indie pop and experimental acoustics streaming from SubTerra Label on TuneCamp.',
    tag: 'sound'
  },
  {
    url: 'https://sudorecords.scobrudot.dev/releases/compleanno-1',
    title: 'Homologo - Compleanno',
    caption: 'Electropop and vibrant synthesizers from the SudoRecords / TuneCamp federated node.',
    tag: 'sound'
  },
  {
    url: 'https://sudorecords.scobrudot.dev/releases/fantasie-1',
    title: 'Homologo - Fantasie',
    caption: 'Warm electronics and synthetic melodies listening P2P on TuneCamp.',
    tag: 'sound'
  },
  {
    url: 'https://sudorecords.scobrudot.dev/releases/ordine-ovviamente-2',
    title: 'Homologo - Ordine Ovviamente',
    caption: 'Contemporary electronic rhythms distributed across the federated network.',
    tag: 'sound'
  },
  {
    url: 'https://sudorecords.scobrudot.dev/releases/amorevole-crollo-1',
    title: 'Homologo - Amorevole Crollo',
    caption: 'Electropop and intimate harmonies released on the TuneCamp federated network.',
    tag: 'sound'
  }
];

// --- Fallback Catalogs for Dynamic Providers ---
export const ARCHIVEORG_FALLBACK_TRACKS = [
  {
    url: 'https://archive.org/details/ird059',
    title: 'The Conet Project - Shortwave Numbers Stations',
    caption: 'Mysterious shortwave numbers station transmissions and spectral analog ether frequencies.',
    tag: 'obscureweb'
  },
  {
    url: 'https://archive.org/details/ca015_va_cs',
    title: 'Clinical Sounds Vol. 1 - Netlabel Ambient Drone',
    caption: 'Subaquatic soundscapes and minimalist drone from historic netlabel open archives.',
    tag: 'sound'
  },
  {
    url: 'https://archive.org/details/78_chop-suey-mambo_alfredito-and-his-orchestra-al-lang_gbia0001871a',
    title: 'Alfredito - Chop Suey Mambo (1954 Vintage 78rpm)',
    caption: 'George Blood 78rpm historical archive: warm surface noise, 78rpm shellac, and vintage mambo.',
    tag: 'sound'
  },
  {
    url: 'https://archive.org/details/Apollo11Audio',
    title: 'NASA - Apollo 11 Mission Audio Transmissions',
    caption: 'Original Earth-Moon communications and deep space telemetry preserved on Internet Archive.',
    tag: 'code'
  },
  {
    url: 'https://archive.org/details/italo-calvino-citta-invisibili',
    title: 'Italo Calvino - Le Città Invisibili (Lettura Radiofonica)',
    caption: 'Historical radio archive: Marco Polo and Kublai Khan navigating imagined cities and memory.',
    tag: 'read'
  },
  {
    url: 'https://archive.org/details/william-burroughs-cutups',
    title: 'William S. Burroughs - Break Through In Grey Room (Cut-Ups)',
    caption: 'Historical tape experiments, cut-up sounds, and clandestine radio broadcasts.',
    tag: 'read'
  },
  {
    url: 'https://archive.org/details/alan-watts-consciousness',
    title: 'Alan Watts - The Nature of Consciousness',
    caption: 'Reflections on mind, presence, and the illusion of self preserved in open audio archives.',
    tag: 'read'
  }
];

export const AUDIUS_FALLBACK_TRACKS = [
  {
    url: 'https://audius.co/embed/track/Jb3xzj7',
    title: 'Washed Out - Feel It All Around (Jay Bird Remix)',
    caption: 'Sunny chillwave and dreamy rhythms streaming decentralized on Audius protocol.',
    tag: 'sound'
  },
  {
    url: 'https://audius.co/embed/track/K37zL3N',
    title: 'deadmau5 - Pomegranate (Jay Robinson Remix)',
    caption: 'Rhythmic electro-house and driving basslines from the decentralized Audius network.',
    tag: 'sound'
  }
];

export const YOUTUBE_FALLBACK_TRACKS = [
  {
    url: 'https://www.youtube.com/watch?v=A2zKARkpDW4',
    title: 'Boards of Canada - Dayvan Cowboy',
    caption: 'Analog nostalgia, sun-drenched magnetic tapes, and blurred horizons.',
    tag: 'obscureweb'
  },
  {
    url: 'https://www.youtube.com/watch?v=8GW6sLrK40k',
    title: 'HOME - Resonance',
    caption: 'Warm synthwave pulses, luminous waves, and analog glow for late-night transit.',
    tag: 'sound'
  },
  {
    url: 'https://www.youtube.com/watch?v=mehLx_Fjv_c',
    title: 'Tycho - A Walk',
    caption: 'Drifting guitars, solar synthesizers, and organic rhythmic textures in perpetual motion.',
    tag: 'sound'
  },
  {
    url: 'https://www.youtube.com/watch?v=HhZaHf8RP6g',
    title: 'Daft Punk - Veridis Quo',
    caption: 'Baroque synthesis, melancholy vocoders, and timeless mechanical elegance.',
    tag: 'art'
  },
  {
    url: 'https://www.youtube.com/watch?v=aBkTkxKDduc',
    title: 'C418 - Sweden',
    caption: 'Gentle piano chords, ambient warmth, and boundless pixel horizons.',
    tag: 'sound'
  }
];

export const BANDCAMP_FALLBACK_TRACKS = [
  {
    url: 'https://loscil.bandcamp.com/album/plume',
    title: 'Loscil - Plume',
    caption: 'Subaquatic pulses and patient ambient minimalism by Scott Morgan (Kranky Records).',
    tag: 'sound'
  },
  {
    url: 'https://timhecker.bandcamp.com/album/ravedeath-1972',
    title: 'Tim Hecker - Ravedeath, 1972',
    caption: 'Pipe organ recorded in a Reykjavik church, processed into devastatingly sublime noise.',
    tag: 'sound'
  },
  {
    url: 'https://c418.bandcamp.com/album/minecraft-volume-alpha',
    title: 'C418 - Minecraft - Volume Alpha',
    caption: 'Minimalist piano and subtle electronics. Serene solitude and quiet wonder.',
    tag: 'sound'
  }
];

export const MIXCLOUD_FALLBACK_TRACKS = [
  {
    url: 'https://www.mixcloud.com/residentadvisor/ra1026-carl-craig-moodymann-mike-banks/',
    title: 'Resident Advisor - RA.1026 Moodymann & Carl Craig',
    caption: 'Detroit techno legends: Carl Craig, Moodymann and Mike Banks live session on Mixcloud.',
    tag: 'sound'
  }
];

export const SOMAFM_FALLBACK_TRACKS = [
  {
    url: 'https://ice1.somafm.com/dronezone-128-mp3',
    title: 'SomaFM - Drone Zone',
    caption: 'Atmospheric ambient space music and drone soundscapes.',
    tag: 'sound'
  },
  {
    url: 'https://ice1.somafm.com/groovesalad-128-mp3',
    title: 'SomaFM - Groove Salad',
    caption: 'A nicely chilled plate of ambient/downtempo beats and grooves.',
    tag: 'sound'
  }
];

// Unified emergency offline fallback pool
export const SEED_TRACKS = [
  ...TUNECAMP_FALLBACK_TRACKS,
  ...ARCHIVEORG_FALLBACK_TRACKS,
  ...AUDIUS_FALLBACK_TRACKS,
  ...YOUTUBE_FALLBACK_TRACKS,
  ...BANDCAMP_FALLBACK_TRACKS,
  ...MIXCLOUD_FALLBACK_TRACKS,
  ...SOMAFM_FALLBACK_TRACKS
];

/**
 * Base Abstract Provider class
 */
export class BaseProvider {
  constructor({ id, name, ttlMs = 5 * 60 * 1000, fallbackTracks = [] }) {
    this.id = id;
    this.name = name;
    this.ttlMs = ttlMs;
    this.fallbackTracks = fallbackTracks;
    this.cachedTracks = [...fallbackTracks];
    this.lastFetch = 0;
  }

  async fetchLiveTracks(context = {}) {
    throw new Error(`fetchLiveTracks() non implementato per il provider "${this.id}"`);
  }

  async getTracks(context = {}) {
    const now = Date.now();
    if (now - this.lastFetch < this.ttlMs && this.cachedTracks.length > 0) {
      return this.cachedTracks;
    }

    try {
      const timeoutSignal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout
        ? AbortSignal.timeout(5000)
        : undefined;
      const liveTracks = await this.fetchLiveTracks({ ...context, signal: timeoutSignal });
      if (Array.isArray(liveTracks) && liveTracks.length > 0) {
        this.cachedTracks = liveTracks;
        this.lastFetch = now;
        return liveTracks;
      }
    } catch (e) {
      console.warn(`[Provider: ${this.name}] Fallback a tracce locali:`, e.message || e);
    }

    return this.cachedTracks.length > 0 ? this.cachedTracks : this.fallbackTracks;
  }

  async getRandomTrack({ currentUrl = null, tag = null, bot = null } = {}) {
    const all = await this.getTracks({ tag, bot });
    let pool = all;
    if (tag) {
      const byTag = pool.filter(t => t.tag === tag);
      if (byTag.length > 0) pool = byTag;
    }
    const candidates = pool.filter(t => t.url !== currentUrl);
    const finalPool = candidates.length > 0 ? candidates : pool;
    if (!finalPool || finalPool.length === 0) return null;
    return finalPool[Math.floor(Math.random() * finalPool.length)];
  }
}

/**
 * TuneCamp Federation Provider
 * Queries the federated TuneCamp network across all known and dynamically discovered instances
 * (e.g. SudoRecords, SubTerra Label, FDA Labs, and any peer discovered via /api/community/peers or /api/community/sites).
 */
export class TuneCampProvider extends BaseProvider {
  constructor(customInstances = []) {
    super({
      id: 'tunecamp',
      name: 'TuneCamp Federation',
      ttlMs: 5 * 60 * 1000,
      fallbackTracks: TUNECAMP_FALLBACK_TRACKS
    });
    this.seedInstances = Array.from(new Set([
      ...TUNECAMP_DEFAULT_INSTANCES,
      ...customInstances
    ]));
  }

  /**
   * Dynamically discovers reachable peer instances from known seed nodes
   */
  async discoverPeers(signal) {
    const discoveredOrigins = new Set(this.seedInstances.map(s => s.replace(/\/$/, '')));

    await Promise.allSettled(
      this.seedInstances.map(async (seed) => {
        const base = seed.replace(/\/$/, '');
        // Check /api/community/peers
        try {
          const peerRes = await fetch(`${base}/api/community/peers`, { signal });
          if (peerRes.ok) {
            const peers = await peerRes.json();
            if (Array.isArray(peers)) {
              for (const p of peers) {
                if (typeof p === 'string' && p.startsWith('http')) {
                  discoveredOrigins.add(p.replace(/\/$/, ''));
                }
              }
            }
          }
        } catch (e) {}

        // Check /api/community/sites
        try {
          const sitesRes = await fetch(`${base}/api/community/sites`, { signal });
          if (sitesRes.ok) {
            const sites = await sitesRes.json();
            if (Array.isArray(sites)) {
              for (const s of sites) {
                if (s && typeof s.url === 'string' && s.url.startsWith('http')) {
                  discoveredOrigins.add(s.url.replace(/\/$/, ''));
                }
              }
            }
          }
        } catch (e) {}
      })
    );

    return Array.from(discoveredOrigins);
  }

  async fetchLiveTracks({ signal } = {}) {
    // 1. Discover all active federated instances
    let origins = this.seedInstances;
    try {
      origins = await this.discoverPeers(signal);
    } catch (e) {
      origins = this.seedInstances;
    }

    // 2. Query /api/releases across all instances concurrently
    const results = await Promise.allSettled(
      origins.map(async (origin) => {
        const normOrigin = origin.replace(/\/$/, '');
        const res = await fetch(`${normOrigin}/api/releases`, { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status} from ${normOrigin}`);
        const releases = await res.json();
        if (!Array.isArray(releases) || releases.length === 0) return [];

        let hostname = normOrigin;
        try { hostname = new URL(normOrigin).hostname; } catch (e) {}

        return releases
          .filter(r => r.slug && r.is_public !== false)
          .map(r => ({
            url: `${normOrigin}/releases/${r.slug}`,
            title: `${r.artist_name || r.artistName || 'TuneCamp'} - ${r.title}`,
            caption: `${r.genre || 'Independent music'} streaming from TuneCamp federated node (${hostname}).`,
            tag: 'sound',
            instance: hostname
          }));
      })
    );

    // 3. Group by instance
    const instanceBuckets = [];
    for (const res of results) {
      if (res.status === 'fulfilled' && Array.isArray(res.value) && res.value.length > 0) {
        instanceBuckets.push(res.value);
      }
    }

    if (instanceBuckets.length === 0) {
      return [];
    }

    // 4. Interleave tracks from all instances so rotation fairly alternates across nodes
    const interleaved = [];
    const maxLen = Math.max(...instanceBuckets.map(b => b.length));
    for (let i = 0; i < maxLen; i++) {
      for (const bucket of instanceBuckets) {
        if (i < bucket.length) {
          interleaved.push(bucket[i]);
        }
      }
    }

    return interleaved;
  }
}

/**
 * Internet Archive Dynamic Audio Provider
 */
export class ArchiveOrgProvider extends BaseProvider {
  constructor() {
    super({
      id: 'archiveorg',
      name: 'Internet Archive',
      ttlMs: 15 * 60 * 1000,
      fallbackTracks: ARCHIVEORG_FALLBACK_TRACKS
    });
  }

  async fetchLiveTracks({ tag, signal } = {}) {
    let query = 'mediatype:(audio) AND (collection:(netlabels) OR collection:(georgeblood))';
    if (tag === 'read') {
      query = 'mediatype:(audio) AND (collection:(audio_bookspoetry) OR collection:(librivoxaudio))';
    } else if (tag === 'obscureweb') {
      query = 'mediatype:(audio) AND (collection:(shortwave) OR subject:(shortwave) OR collection:(audio_music))';
    } else if (tag === 'code') {
      query = 'mediatype:(audio) AND (subject:(demoscene) OR subject:(chiptune) OR subject:(tracker) OR subject:(keygen) OR collection:(tucows))';
    }

    const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier,title,creator,description,year&sort[]=downloads+desc&rows=30&page=1&output=json`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const docs = data?.response?.docs;
    if (Array.isArray(docs) && docs.length > 0) {
      return docs
        .filter(d => d.identifier && d.title)
        .map(d => {
          let desc = (d.description || '').replace(/<[^>]*>?/gm, '').trim();
          if (desc.length > 120) desc = desc.slice(0, 117) + '...';
          const author = Array.isArray(d.creator) ? d.creator.join(', ') : (d.creator || (tag === 'code' ? 'Demoscene' : 'Internet Archive'));
          return {
            url: `https://archive.org/details/${d.identifier}`,
            title: `${author} - ${d.title}`,
            caption: desc || (tag === 'code' ? 'Demoscene music, tracker modules, and chiptunes preserved on Internet Archive.' : 'Open historical recording from Internet Archive.'),
            tag: tag || 'sound'
          };
        });
    }
    return [];
  }
}

/**
 * Audius Web3 Decentralized Audio Provider
 */
export class AudiusProvider extends BaseProvider {
  constructor() {
    super({
      id: 'audius',
      name: 'Audius Web3 Network',
      ttlMs: 10 * 60 * 1000,
      fallbackTracks: AUDIUS_FALLBACK_TRACKS
    });
  }

  async fetchLiveTracks({ signal } = {}) {
    const res = await fetch('https://discoveryprovider.audius.co/v1/tracks/trending?app_name=onepick&limit=25', { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    const items = body?.data;
    if (Array.isArray(items) && items.length > 0) {
      return items
        .filter(t => t.id && t.title)
        .map(t => {
          const artist = t.user?.name || t.user?.handle || 'Audius Artist';
          const genre = t.genre || 'Electronic';
          return {
            url: `https://audius.co/embed/track/${t.id}`,
            title: `${artist} - ${t.title}`,
            caption: `${genre} streaming decentralized via Audius protocol.`,
            tag: 'sound'
          };
        });
    }
    return [];
  }
}

/**
 * Curated Ether Provider (Static high-quality YouTube, SC, BC, Mixcloud)
 */
export class CuratedProvider extends BaseProvider {
  constructor() {
    super({
      id: 'curated',
      name: 'Curated Ether',
      ttlMs: Infinity,
      fallbackTracks: SEED_TRACKS
    });
  }

  async fetchLiveTracks() {
    return SEED_TRACKS;
  }
}

export const YOUTUBE_CHANNELS = [
  { id: 'UCGSSFkUjSBpDzA1aD4yq1zw', name: 'State Azure', tag: 'art', desc: 'Generative modular synthesis and analog soundscapes' },
  { id: 'UCSJ4gkVC6NrvII8umztf0Ow', name: 'Lofi Girl', tag: 'sound', desc: 'Lo-fi ambient beats and peaceful frequencies' },
  { id: 'UCCycRfTS7V9WOFfWfkNVCSg', name: 'Cercle', tag: 'sound', desc: 'Unique live electronic performances in scenic locations' },
  { id: 'UC3I2GFN_F8WudD_2jUZbojA', name: 'KEXP', tag: 'sound', desc: 'Live studio sessions and independent music discoveries' },
  { id: 'UC6qQOTx9LuKMC5p2dbjmSRg', name: 'HateLab', tag: 'sound', desc: 'Deep minimal techno and hypnotic resonances' }
];

/**
 * YouTube Live RSS Feed Provider (Zero API Key, Public Channels)
 */
export class YouTubeFeedProvider extends BaseProvider {
  constructor() {
    super({
      id: 'youtube',
      name: 'YouTube Dynamic Feeds',
      ttlMs: 20 * 60 * 1000,
      fallbackTracks: YOUTUBE_FALLBACK_TRACKS
    });
  }

  async fetchLiveTracks({ tag, signal } = {}) {
    let targetChannels = YOUTUBE_CHANNELS;
    if (tag) {
      const filtered = YOUTUBE_CHANNELS.filter(c => c.tag === tag);
      if (filtered.length > 0) targetChannels = filtered;
    }
    const chosenChannel = targetChannels[Math.floor(Math.random() * targetChannels.length)];
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${chosenChannel.id}`;
    let xml = '';

    if (typeof window === 'undefined') {
      const res = await fetch(feedUrl, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      xml = await res.text();
    } else {
      try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
        const res = await fetch(proxyUrl, { signal });
        if (res.ok) xml = await res.text();
      } catch (e) {}

      if (!xml) {
        const res = await fetch(feedUrl, { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        xml = await res.text();
      }
    }

    const entries = xml.split('<entry>');
    const tracks = [];
    for (let i = 1; i < entries.length; i++) {
      const chunk = entries[i];
      const idMatch = chunk.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = chunk.match(/<title>([^<]+)<\/title>/);
      const authorMatch = chunk.match(/<author>[\s\S]*?<name>([^<]+)<\/name>/);
      if (idMatch && titleMatch) {
        const vid = idMatch[1];
        const rawTitle = titleMatch[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
        if (rawTitle.toLowerCase().includes('#shorts')) continue;
        const author = authorMatch ? authorMatch[1] : chosenChannel.name;
        tracks.push({
          url: `https://www.youtube.com/watch?v=${vid}`,
          title: `${author} - ${rawTitle}`,
          caption: `${chosenChannel.desc} via live YouTube feed.`,
          tag: chosenChannel.tag || tag || 'sound'
        });
      }
    }

    return tracks;
  }
}

/**
 * Bandcamp Live Audio Releases & Editorial Provider
 */
export class BandcampProvider extends BaseProvider {
  constructor() {
    super({
      id: 'bandcamp',
      name: 'Bandcamp Network',
      ttlMs: 30 * 60 * 1000,
      fallbackTracks: BANDCAMP_FALLBACK_TRACKS
    });
    this.cachedAlbums = [];
    this.cachedArticles = [];
    this.lastAlbumFetch = 0;
    this.lastArticleFetch = 0;
  }

  async getTracks(context = {}) {
    const isRead = context.tag === 'read';
    const now = Date.now();
    const last = isRead ? this.lastArticleFetch : this.lastAlbumFetch;
    const cache = isRead ? this.cachedArticles : this.cachedAlbums;

    if (now - last < this.ttlMs && cache.length > 0) {
      return cache;
    }

    try {
      const timeoutSignal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout
        ? AbortSignal.timeout(6000)
        : undefined;
      const live = await this.fetchLiveTracks({ ...context, signal: timeoutSignal });
      if (Array.isArray(live) && live.length > 0) {
        if (isRead) {
          this.cachedArticles = live;
          this.lastArticleFetch = now;
        } else {
          this.cachedAlbums = live;
          this.lastAlbumFetch = now;
        }
        return live;
      }
    } catch (e) {
      console.warn('[BandcampProvider] Fallback a tracce locali:', e.message || e);
    }

    return cache.length > 0 ? cache : this.fallbackTracks;
  }

  async fetchLiveTracks({ tag, signal } = {}) {
    const feedUrl = 'https://daily.bandcamp.com/feed';
    let xml = '';

    if (typeof window === 'undefined') {
      const res = await fetch(feedUrl, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      xml = await res.text();
    } else {
      try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
        const res = await fetch(proxyUrl, { signal });
        if (res.ok) xml = await res.text();
      } catch (e) {}

      if (!xml) {
        const res = await fetch(feedUrl, { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        xml = await res.text();
      }
    }

    const items = xml.split('<item>');

    // If request is specifically for #read, return editorial article links
    if (tag === 'read') {
      const articles = [];
      for (let i = 1; i < items.length; i++) {
        const chunk = items[i];
        const titleMatch = chunk.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/);
        const linkMatch = chunk.match(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/);
        const descMatch = chunk.match(/<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/s);
        if (titleMatch && linkMatch) {
          let cleanDesc = descMatch ? descMatch[1].replace(/<[^>]*>?/gm, '').trim() : '';
          if (cleanDesc.length > 120) cleanDesc = cleanDesc.slice(0, 117) + '...';
          articles.push({
            url: linkMatch[1].trim(),
            title: `Bandcamp Daily: ${titleMatch[1].trim()}`,
            caption: cleanDesc || 'Musical deep-dive and review from Bandcamp Daily.',
            tag: 'read'
          });
        }
      }
      return articles;
    }

    // For #sound (audio player): crawl latest articles and extract real playable Bandcamp album links!
    const articleUrls = [];
    for (let i = 1; i < Math.min(items.length, 8); i++) {
      const linkMatch = items[i].match(/<link>(https:\/\/daily\.bandcamp\.com\/[^\/]+\/[^<]+)<\/link>/);
      if (linkMatch && linkMatch[1]) {
        articleUrls.push(linkMatch[1].trim());
      }
    }

    const albumPromises = articleUrls.map(async (artUrl) => {
      try {
        let artHtml = '';
        if (typeof window === 'undefined') {
          const res = await fetch(artUrl, { signal });
          if (res.ok) artHtml = await res.text();
        } else {
          try {
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(artUrl)}`;
            const res = await fetch(proxyUrl, { signal });
            if (res.ok) artHtml = await res.text();
          } catch (e) {}
          if (!artHtml) {
            const res = await fetch(artUrl, { signal });
            if (res.ok) artHtml = await res.text();
          }
        }

        if (!artHtml) return null;

        const albumLinks = [...artHtml.matchAll(/https:\/\/[a-zA-Z0-9_\-]+\.bandcamp\.com\/album\/[a-zA-Z0-9_\-]+/g)].map(m => m[0]);
        if (albumLinks.length > 0) {
          const title = artHtml.match(/<meta property="og:title" content="([^"]+)"/)?.[1] || '';
          const desc = artHtml.match(/<meta property="og:description" content="([^"]+)"/)?.[1] || '';
          const cleanTitle = title.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
          const cleanDesc = desc.replace(/<[^>]*>?/gm, '').replace(/&#39;/g, "'").slice(0, 120);
          return {
            url: albumLinks[0],
            title: cleanTitle || 'Bandcamp Featured Release',
            caption: cleanDesc || 'Independent album streaming from Bandcamp.',
            tag: 'sound'
          };
        }
      } catch (e) {}
      return null;
    });

    const resolvedAlbums = (await Promise.all(albumPromises)).filter(Boolean);
    if (resolvedAlbums.length > 0) {
      return resolvedAlbums;
    }

    return BANDCAMP_FALLBACK_TRACKS;
  }
}
export const BandcampDailyProvider = BandcampProvider;

/**
 * Mixcloud Live Dynamic DJ Sets & Shows Provider
 */
export class MixcloudProvider extends BaseProvider {
  constructor() {
    super({
      id: 'mixcloud',
      name: 'Mixcloud Live Cloudcasts',
      ttlMs: 30 * 60 * 1000,
      fallbackTracks: MIXCLOUD_FALLBACK_TRACKS
    });
  }

  async fetchLiveTracks({ tag, signal } = {}) {
    const tags = ['ambient', 'chillout', 'electronic', 'downtempo', 'deep-techno'];
    const selectedTag = tags[Math.floor(Math.random() * tags.length)];
    const url = `https://api.mixcloud.com/tag/${selectedTag}/popular/?limit=25`;

    let data = null;
    if (typeof window === 'undefined') {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } else {
      try {
        const res = await fetch(url, { signal });
        if (res.ok) data = await res.json();
      } catch (e) {}
      if (!data) {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl, { signal });
        if (res.ok) data = await res.json();
      }
    }

    const items = data?.data;
    if (Array.isArray(items) && items.length > 0) {
      return items
        .filter(item => item.url && item.name && !item.is_exclusive)
        .map(item => {
          const user = item.user?.name || item.user?.username || 'Mixcloud DJ';
          const cleanName = item.name.replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim();
          return {
            url: item.url,
            title: `${user} - ${cleanName}`,
            caption: `DJ set & long-form cloudcast streaming on Mixcloud (#${selectedTag}).`,
            tag: 'sound'
          };
        });
    }
    return [];
  }
}

/**
 * SomaFM Dynamic Internet Radio Streams Provider
 * 46+ free independent commercial-free listener-supported radio channels with direct 128kbps MP3 streams
 */
export class SomaFMProvider extends BaseProvider {
  constructor() {
    super({
      id: 'somafm',
      name: 'SomaFM Internet Radio',
      ttlMs: 60 * 60 * 1000,
      fallbackTracks: SOMAFM_FALLBACK_TRACKS
    });
  }

  async fetchLiveTracks({ signal } = {}) {
    const url = 'https://somafm.com/channels.json';
    let data = null;

    if (typeof window === 'undefined') {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } else {
      try {
        const res = await fetch(url, { signal });
        if (res.ok) data = await res.json();
      } catch (e) {}
      if (!data) {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl, { signal });
        if (res.ok) data = await res.json();
      }
    }

    const channels = data?.channels;
    if (Array.isArray(channels) && channels.length > 0) {
      return channels
        .filter(c => c.id && c.title)
        .map(c => {
          let desc = (c.description || '').trim();
          if (desc.length > 120) desc = desc.slice(0, 117) + '...';
          return {
            url: `https://ice1.somafm.com/${c.id}-128-mp3`,
            title: `SomaFM: ${c.title}`,
            caption: desc || 'Independent commercial-free continuous radio stream from SomaFM.',
            tag: 'sound'
          };
        });
    }
    return [];
  }
}

/**
 * Provider Registry to manage and resolve audio stream providers
 */
export class ProviderRegistry {
  constructor() {
    this.providers = new Map();
  }

  register(provider) {
    if (!provider || !provider.id) {
      throw new Error('Provider must have a valid id');
    }
    this.providers.set(provider.id, provider);
    return this;
  }

  get(id) {
    return this.providers.get(id) || null;
  }

  has(id) {
    return this.providers.has(id);
  }

  listProviders() {
    return Array.from(this.providers.values()).map(p => ({
      id: p.id,
      name: p.name,
      cachedCount: p.cachedTracks.length,
      lastFetch: p.lastFetch
    }));
  }

  async getTrackForBot(bot, currentUrl = null) {
    // 1. If bot has an explicit provider registered, query it first
    if (bot && bot.provider) {
      const provider = this.get(bot.provider);
      if (provider) {
        const track = await provider.getRandomTrack({ currentUrl, tag: bot.tag, bot });
        if (track) return track;
      }
    }

    // 2. Tag-based dynamic provider selection
    if (bot && bot.tag === 'read') {
      const archiveProvider = this.get('archiveorg');
      if (archiveProvider) {
        const track = await archiveProvider.getRandomTrack({ currentUrl, tag: 'read', bot });
        if (track) return track;
      }
    }

    // 3. Fallback to CuratedProvider
    const curated = this.get('curated');
    if (curated) {
      const track = await curated.getRandomTrack({ currentUrl, tag: bot?.tag, bot });
      if (track) return track;
    }

    // 4. Default global fallback
    return SEED_TRACKS[Math.floor(Math.random() * SEED_TRACKS.length)];
  }
}

// Global default provider registry instance
export const providerRegistry = new ProviderRegistry();
providerRegistry.register(new TuneCampProvider());
providerRegistry.register(new ArchiveOrgProvider());
providerRegistry.register(new AudiusProvider());
providerRegistry.register(new YouTubeFeedProvider());
providerRegistry.register(new BandcampDailyProvider());
providerRegistry.register(new MixcloudProvider());
providerRegistry.register(new SomaFMProvider());
providerRegistry.register(new CuratedProvider());

/**
 * Searches and fetches live releases from the TuneCamp network (/api/releases)
 * Automatically falls back to curated fallback tracks if network is slow or offline.
 * Maintained for backward compatibility.
 */
export async function fetchLiveTuneCampTracks() {
  const provider = providerRegistry.get('tunecamp');
  return provider ? await provider.getTracks() : TUNECAMP_FALLBACK_TRACKS;
}

/**
 * Picks the next appropriate track for a specific bot identity:
 * Uses the dynamic ProviderRegistry.
 */
export async function getTrackForBot(bot, currentUrl = null) {
  return await providerRegistry.getTrackForBot(bot, currentUrl);
}

// Cache of derived bot pairs to avoid repeated PBKDF2 computations
const botPairsCache = new Map();

/**
 * Deterministically derives a cryptographic keypair for a bot identity
 */
export async function deriveBotPair(username, passphrase, ZEN) {
  const cacheKey = `${username}:${passphrase}`;
  if (botPairsCache.has(cacheKey)) {
    return botPairsCache.get(cacheKey);
  }

  const cleanUser = username.trim().toLowerCase();
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(SALT_PREFIX + cleanUser),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  const seed = Array.from(new Uint8Array(bits))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const pair = await ZEN.pair(null, { seed });
  botPairsCache.set(cacheKey, pair);
  return pair;
}

/**
 * Computes frequency in MHz for a public key (88.00 - 108.00)
 */
export function getFrequencyForPub(pub) {
  let hash = 0;
  for (let i = 0; i < pub.length; i++) {
    hash = (hash << 5) - hash + pub.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash);
  const steps = 2000;
  const step = positive % steps;
  return Number((88.0 + step * 0.01).toFixed(2));
}

/**
 * Verifies that a media URL is actually live and accessible before broadcasting.
 * For Mixcloud: tests the official oembed API.
 * For other audio links: tests via lightweight HEAD request.
 */
export async function verifyMediaUrlAvailable(url) {
  if (!url) return false;
  try {
    if (url.includes('mixcloud.com')) {
      const oembedUrl = `https://app.mixcloud.com/oembed/?url=${encodeURIComponent(url)}&format=json`;
      const res = await fetch(oembedUrl);
      if (!res.ok) return false;
      const data = await res.json().catch(() => null);
      if (data && data.is_exclusive) return false;
      return true;
    }
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok || res.status === 405 || res.status === 403;
  } catch (e) {
    return true; // network fallback if offline
  }
}

/**
 * Broadcasts a single seed track to a bot's userspace on Zen
 */
export async function broadcastSeedSlot(zen, bot, track, ZEN) {
  if (!zen || !bot || !track) return null;

  const pair = await deriveBotPair(bot.username, bot.passphrase, ZEN);
  const now = Date.now();

  const slotData = {
    url: track.url,
    caption: track.caption,
    tag: track.tag || bot.tag || 'sound',
    author: bot.username,
    ts: now,
    authorPub: pair.pub,
    seed: true
  };

  // 1. Put into signed userspace
  await new Promise((resolve) => {
    const timer = setTimeout(() => resolve(slotData), 2000);
    try {
      zen.get('~' + pair.pub).get('onepick').get('slot').put(
        slotData,
        ack => {
          clearTimeout(timer);
          resolve(ack);
        },
        { authenticator: pair }
      );
    } catch (e) {
      clearTimeout(timer);
      resolve(slotData);
    }
  });

  // 2. Announce to public frequencies directory
  zen.get('onepick:frequencies').get(pair.pub).put({
    pub: pair.pub,
    tag: slotData.tag,
    author: bot.username,
    ts: now
  });

  return {
    bot: bot.username,
    pub: pair.pub,
    freq: getFrequencyForPub(pair.pub),
    track: track
  };
}

/**
 * Initializes autonomous seeding logic in browser or node
 * Interval: 5 minutes (300,000 ms) by default
 */
export function startAutonomousSeeder(zen, ZEN, options = {}) {
  const intervalMs = options.intervalMs || 5 * 60 * 1000; // 5 min default
  let rotationIndex = 0;
  let isRunning = true;
  let intervalHandle = null;

  async function performRotation() {
    if (!isRunning || !zen) return null;

    // Check multi-tab lock in browser (prevent duplicate blasts across tabs)
    if (typeof localStorage !== 'undefined') {
      const lastTs = parseInt(localStorage.getItem('onepick_seeder_last_ts') || '0', 10);
      const now = Date.now();
      if (now - lastTs < intervalMs - 5000) {
        // Another tab or run already seeded recently
        return null;
      }
      localStorage.setItem('onepick_seeder_last_ts', now.toString());
    }

    const bot = SEED_BOTS[rotationIndex % SEED_BOTS.length];
    rotationIndex++;

    // Pick track for this bot
    const track = await getTrackForBot(bot);

    try {
      const res = await broadcastSeedSlot(zen, bot, track, ZEN);
      if (options.onBroadcast) {
        options.onBroadcast(res);
      }
      return res;
    } catch (e) {
      console.warn('[Seeder] Error broadcasting seed slot:', e);
      return null;
    }
  }

  /**
   * Called on page load:
   * 1. Seeds any missing bot stations immediately.
   * 2. If all bots exist but the oldest is >= 5 minutes old, rotates it to a fresh track!
   */
  async function checkAndSeedOnPageEntry(stationsMap) {
    if (!zen) return;

    const now = Date.now();

    // Fast check: if another tab or seeder already ran recently, skip entirely
    if (typeof localStorage !== 'undefined') {
      const lastTs = parseInt(localStorage.getItem('onepick_seeder_last_ts') || '0', 10);
      if (now - lastTs < intervalMs - 10000) {
        return; // Don't freeze browser UI thread with crypto/API calls if already active
      }
    }

    // If stations are already live in the ether, do not block the browser on startup
    if (stationsMap && stationsMap.size >= 3) {
      return;
    }

    const existingBots = new Map(); // username -> station

    if (stationsMap) {
      for (const [pub, station] of stationsMap.entries()) {
        const found = SEED_BOTS.find(b => b.username === station.author);
        if (found) {
          existingBots.set(found.username, { bot: found, station, ts: station.ts || 0 });
        }
      }
    }

    // 1. Seed any missing bot transmitters
    let anyMissing = false;
    for (let i = 0; i < SEED_BOTS.length; i++) {
      const bot = SEED_BOTS[i];
      if (!existingBots.has(bot.username)) {
        anyMissing = true;
        const track = await getTrackForBot(bot);
        try {
          console.log(`[onepick auto-seeder] Populating missing station: @${bot.username} -> ${track.title}`);
          const res = await broadcastSeedSlot(zen, bot, track, ZEN);
          if (options.onBroadcast) options.onBroadcast(res);
          await new Promise(r => setTimeout(r, 600));
        } catch (e) {
          console.warn('[onepick auto-seeder] Seed error:', e);
        }
      }
    }

    if (anyMissing) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('onepick_seeder_last_ts', now.toString());
      }
      return;
    }

    // 2. If all exist, check if the oldest is >= 5 minutes old
    const botList = Array.from(existingBots.values());
    botList.sort((a, b) => a.ts - b.ts);
    const oldest = botList[0];

    if (oldest && (now - oldest.ts >= intervalMs)) {
      // Check multi-tab coordination
      if (typeof localStorage !== 'undefined') {
        const lastTs = parseInt(localStorage.getItem('onepick_seeder_last_ts') || '0', 10);
        if (now - lastTs < 60000) {
          return; // another tab already rotated less than a minute ago
        }
        localStorage.setItem('onepick_seeder_last_ts', now.toString());
      }

      const newTrack = await getTrackForBot(oldest.bot, oldest.station?.url);
      console.log(`[onepick auto-seeder] Rotating 5-min stale station: @${oldest.bot.username} -> ${newTrack.title}`);
      try {
        const res = await broadcastSeedSlot(zen, oldest.bot, newTrack, ZEN);
        if (options.onBroadcast) options.onBroadcast(res);
      } catch (e) {
        console.warn('[onepick auto-seeder] Rotation error:', e);
      }
    }
  }

  // Start 5-minute background interval while user stays on page
  intervalHandle = setInterval(() => {
    performRotation();
  }, intervalMs);

  return {
    checkAndSeedOnPageEntry,
    performRotation,
    stop: () => {
      isRunning = false;
      if (intervalHandle) clearInterval(intervalHandle);
    }
  };
}
