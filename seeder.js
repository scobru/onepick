/**
 * onepick — Autonomous Seed Engine & Background Bot
 * Autopopulates the decentralized Zen P2P radio with curated cultural transmissions
 * across YouTube, SoundCloud, Bandcamp, Internet Archive, Audius, Mixcloud, and TuneCamp rotating every 15 minutes.
 */

export const SALT_PREFIX = 'onepick:zen:station:';

/**
 * The seven FM affinities of the dial. Everything on onepick is listenable:
 * these are musical genres, not topics.
 */
export const FM_GENRES = ['ambient', 'electronic', 'dj', 'live', 'lofi', 'radio', 'experimental', 'classical'];

const GENRE_KEYWORDS = [
  ['classical', /classical|symphon|orchestra|chamber|opera|baroque|romantic|contemporary classical|early music|sonata|concerto|piano|violin|cello|quartet|choir|choral|avant-garde classical/i],
  ['experimental', /demoscene|chiptune|tracker|keygen|8-bit|musique concr|noise|avant|shortwave|numbers station|field recording|tape loop|sound art|drone metal|industrial|glitch|78 ?rpm/i],
  ['ambient', /ambient|drone|atmospher|meditat|new age|soundscape|space music|modular|generative|slow|calm/i],
  ['lofi', /lo-?fi|chillhop|chill ?beats|study beats|jazzhop|boom bap|beat tape/i],
  ['dj', /\bdj\b|dj set|mixtape|cloudcast|mix show|b2b|club night|boiler room|residency/i],
  ['live', /live session|live set|live at|concert|acoustic|unplugged|take away show|tiny desk|in session|festival/i],
  ['radio', /radio (?:show|station|program|hour)|internet radio|shortwave|broadcast|live stream|\bfm\b/i],
  ['electronic', /electronic|techno|house|electro|idm|synth|edm|trance|dubstep|drum ?& ?bass|drum and bass|breakbeat|minimal|dub\b|bass music|garage|jungle/i]
];

/**
 * Maps free-form provider metadata (genre strings, tags, titles) onto one of the
 * FM affinities. Falls back to the affinity the caller asked for.
 */
export function resolveGenre(text, fallback = 'electronic') {
  const haystack = String(text || '');
  if (haystack) {
    for (const [genre, pattern] of GENRE_KEYWORDS) {
      if (pattern.test(haystack)) return genre;
    }
  }
  return FM_GENRES.includes(fallback) ? fallback : 'electronic';
}

/**
 * Deterministic transmitter identities.
 * `tag` is the station's musical affinity, `provider` its signature source (kept
 * for display and backwards compatibility), and `providers` the wider pool the
 * bot rotates across, so every station has several networks to choose from.
 */
export const SEED_BOTS = [
  {
    id: 'obscura',
    username: 'radio-obscura',
    passphrase: 'onepick-seed-obscura-2026-ether',
    tag: 'experimental',
    provider: 'archiveorg',
    providers: ['archiveorg', 'youtube', 'bandcamp'],
    desc: 'Forgotten frequencies, shortwave ghosts, tape loops, and analog debris.'
  },
  {
    id: 'transit',
    username: 'sound-transit',
    passphrase: 'onepick-seed-transit-2026-fm',
    tag: 'radio',
    provider: 'somafm',
    providers: ['somafm', 'radiobrowser', 'audius'],
    desc: 'Continuous radio streams, drone, deep ambient, and transit soundscapes via SomaFM.'
  },
  {
    id: 'zero',
    username: 'ambient-zero',
    passphrase: 'onepick-seed-zero-2026-relay',
    tag: 'ambient',
    provider: 'youtube',
    providers: ['youtube', 'archiveorg', 'audius'],
    desc: 'Modular synthesis, endless tape loops, and present stillness for overstimulated minds.'
  },
  {
    id: 'tunecamp',
    username: 'tunecamp-relay',
    passphrase: 'onepick-seed-tunecamp-2026-federation',
    tag: 'electronic',
    provider: 'tunecamp',
    providers: ['tunecamp', 'bandcamp', 'audius'],
    desc: 'Independent music and federated releases streaming across all TuneCamp network instances (SudoRecords, SubTerra Label & federated nodes).'
  },
  {
    id: 'cyber',
    username: 'retro-cyber',
    passphrase: 'onepick-seed-cyber-2026-matrix',
    tag: 'experimental',
    provider: 'archiveorg',
    providers: ['archiveorg', 'youtube', 'audius'],
    desc: 'Demoscene music, tracker modules, keygen synthesis, and algorithmic soundscapes.'
  },
  {
    id: 'echo',
    username: 'tape-echo',
    passphrase: 'onepick-seed-echo-2026-reverb',
    tag: 'live',
    provider: 'youtube',
    providers: ['youtube', 'bandcamp', 'archiveorg'],
    desc: 'Live sessions, take-away shows, and rooms recorded with the reverb left in.'
  },
  {
    id: 'archive-echo',
    username: 'archive-echo',
    passphrase: 'onepick-seed-archive-2026-ether',
    tag: 'radio',
    provider: 'archiveorg',
    providers: ['archiveorg', 'radiobrowser', 'somafm'],
    desc: 'Historic radio broadcasts, 78rpm shellac, and voices from the shortwave era.'
  },
  {
    id: 'mystic',
    username: 'mystic-whispers',
    passphrase: 'onepick-seed-mystic-2026-ether',
    tag: 'lofi',
    provider: 'bandcamp',
    providers: ['bandcamp', 'youtube', 'audius'],
    desc: 'Dusty beats, jazzy loops, and hidden gems for the long hours.'
  },
  {
    id: 'neon',
    username: 'neon-drift',
    passphrase: 'onepick-seed-neon-2026-fm',
    tag: 'electronic',
    provider: 'audius',
    providers: ['audius', 'youtube', 'mixcloud'],
    desc: 'Synthwave odyssey through neon-lit digital landscapes and retro-futuristic ambience.'
  },
  {
    id: 'void',
    username: 'void-pulse',
    passphrase: 'onepick-seed-void-2026-art',
    tag: 'dj',
    provider: 'mixcloud',
    providers: ['mixcloud', 'youtube', 'radiobrowser'],
    desc: 'Hypnotic DJ sets, club recordings, and long-form mixes.'
  },
  {
    id: 'concert-hall',
    username: 'concert-hall',
    passphrase: 'onepick-seed-concert-2026-ether',
    tag: 'classical',
    provider: 'archiveorg',
    providers: ['archiveorg', 'youtube', 'audius'],
    desc: 'Grand symphonies, chamber music, and historic performances from concert halls worldwide.'
  },
  {
    id: 'early-music',
    username: 'early-music',
    passphrase: 'onepick-seed-early-2026-fm',
    tag: 'classical',
    provider: 'youtube',
    providers: ['youtube', 'archiveorg', 'bandcamp'],
    desc: 'Baroque, Renaissance, and early music on period instruments — HIP and authentic performances.'
  }
];

// --- TuneCamp Federation Live Stream Catalog ---
export const TUNECAMP_DEFAULT_INSTANCES = [
  'https://sudorecords.scobrudot.dev',
  'https://tunecamp.subterralabel.com',
  'https://tunecamp.fdalabs.net'
];

// --- Dynamic-Only Network: Zero Hardcoded Tracks ---
export const TUNECAMP_FALLBACK_TRACKS = [];
export const ARCHIVEORG_FALLBACK_TRACKS = [];
export const AUDIUS_FALLBACK_TRACKS = [];
export const YOUTUBE_FALLBACK_TRACKS = [];
export const BANDCAMP_FALLBACK_TRACKS = [];
export const MIXCLOUD_FALLBACK_TRACKS = [];
export const SOMAFM_FALLBACK_TRACKS = [];
export const SEED_TRACKS = [];

/**
 * Universal helper for fetching external resources in both Node and Browser.
 * In browser: uses /api/proxy (Vercel Serverless) with edge-caching first,
 * then falls back to direct fetch, and finally public CORS proxies.
 */
export async function fetchWithCORSProxy(url, { signal, asJson = false, headers = null } = {}) {
  const fetchOpts = headers ? { signal, headers } : { signal };

  // 1. Node.js environment (bot CLI service) -> direct fetch
  if (typeof window === 'undefined') {
    const res = await fetch(url, fetchOpts);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return asJson ? await res.json() : await res.text();
  }

  // 2. Browser on web server (Vercel): try our local /api/proxy endpoint
  if (window.location && window.location.protocol && window.location.protocol.startsWith('http')) {
    try {
      const vercelProxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
      const res = await fetch(vercelProxyUrl, { signal });
      if (res.ok) {
        return asJson ? await res.json() : await res.text();
      }
    } catch (e) {}
  }

  // 3. Direct browser fetch (for CORS-enabled APIs like SomaFM, Archive.org, Mixcloud)
  try {
    const directRes = await fetch(url, fetchOpts);
    if (directRes.ok) {
      return asJson ? await directRes.json() : await directRes.text();
    }
  } catch (e) {}

  // 4. Fallback public proxy
  try {
    const pUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const res = await fetch(pUrl, { signal });
    if (res.ok) {
      return asJson ? await res.json() : await res.text();
    }
  } catch (e) {}

  throw new Error(`Impossibile recuperare dati da ${url}`);
}

/**
 * Returns a new shuffled copy of the given list (Fisher-Yates).
 */
export function shuffleList(list) {
  const out = Array.isArray(list) ? list.slice() : [];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Picks up to `count` distinct entries at random from a list.
 */
export function sampleList(list, count) {
  return shuffleList(list).slice(0, Math.max(0, count));
}

/**
 * Interleaves several buckets of tracks so rotation alternates fairly across sources.
 */
export function interleaveBuckets(buckets) {
  const valid = (buckets || []).filter(b => Array.isArray(b) && b.length > 0);
  if (valid.length === 0) return [];
  const out = [];
  const maxLen = Math.max(...valid.map(b => b.length));
  for (let i = 0; i < maxLen; i++) {
    for (const bucket of valid) {
      if (i < bucket.length) out.push(bucket[i]);
    }
  }
  return out;
}

/**
 * Decodes the handful of XML entities that show up in RSS/Atom payloads.
 */
export function decodeXmlEntities(text) {
  if (!text) return '';
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

/**
 * Removes duplicate tracks sharing the same URL, keeping the first occurrence.
 */
export function dedupeTracks(tracks) {
  const seen = new Set();
  const out = [];
  for (const t of tracks || []) {
    if (!t || !t.url || seen.has(t.url)) continue;
    seen.add(t.url);
    out.push(t);
  }
  return out;
}

/**
 * Mirrors the direct-stream detection used by the in-page player (app.js detectMedia).
 * Keeps radio streams published by the bots actually playable in the browser.
 */
export function isDirectAudioStreamUrl(url) {
  if (!url || typeof url !== 'string') return false;
  if (!/^https:\/\//i.test(url)) return false; // mixed content is blocked on the https app
  if (/\.(m3u8|m3u|pls|asx|xspf)(\?.*)?$/i.test(url)) return false; // not playable by <audio>
  return /(?:https?:\/\/)?(?:[a-z0-9\-_]+\.)?somafm\.com/i.test(url)
    || /\.(mp3|ogg|wav|m4a|aac|flac)(\?.*)?$/i.test(url)
    || /-(?:128|64|32|256|320)?-?(?:mp3|aac|ogg)(\?.*)?$/i.test(url)
    || url.includes('/stream')
    || url.includes('/live')
    || url.includes('/icecast')
    || url.includes('/shoutcast')
    || /(?::(?:8000|8443|8080)\/)/.test(url);
}

/**
 * True when the URL is playable in-page, i.e. accepted by the #sound tag rules.
 */
export function isPlayableAudioUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const embeddable = [
    /youtube\.com\/watch\?v=|youtu\.be\//i,
    /soundcloud\.com\//i,
    /bandcamp\.com/i,
    /archive\.org\/(?:details|embed)\//i,
    /audius\.co\//i,
    /mixcloud\.com\//i,
    /spotify\.com\/(?:embed\/)?(?:track|album|playlist|episode|show)\//i,
    /\/(?:releases?|albums?|tracks?|share)\/[^\/?#]+/i // TuneCamp federated nodes
  ];
  if (embeddable.some(re => re.test(url))) return true;
  return isDirectAudioStreamUrl(url);
}

/**
 * Base Abstract Provider class
 */
export class BaseProvider {
  constructor({ id, name, ttlMs = 5 * 60 * 1000 }) {
    this.id = id;
    this.name = name;
    this.ttlMs = ttlMs;
    this.cachedTracks = [];
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
        ? AbortSignal.timeout(8000)
        : undefined;
      const liveTracks = await this.fetchLiveTracks({ ...context, signal: timeoutSignal });
      if (Array.isArray(liveTracks) && liveTracks.length > 0) {
        this.cachedTracks = liveTracks;
        this.lastFetch = now;
        return liveTracks;
      }
    } catch (e) {
      console.warn(`[Provider: ${this.name}] Errore recupero tracce live:`, e.message || e);
    }

    return this.cachedTracks;
  }

  async getRandomTrack({ currentUrl = null, tag = null, bot = null, filter = null } = {}) {
    const all = await this.getTracks({ tag, bot });
    let pool = typeof filter === 'function' ? all.filter(t => filter(t)) : all;
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
      ttlMs: 5 * 60 * 1000
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
            tag: resolveGenre(`${r.genre || ''} ${r.title || ''}`, 'electronic'),
            source: `TuneCamp ${hostname}`,
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
      ttlMs: 15 * 60 * 1000
    });
  }

  /**
   * Query pools per FM affinity. One is drawn at random on every refresh so the
   * archive rotation keeps digging into different shelves.
   */
  queriesForTag(tag) {
    const pools = {
      ambient: [
        'mediatype:(audio) AND (subject:(ambient) OR subject:(drone))',
        'mediatype:(audio) AND collection:(netlabels) AND subject:(ambient)',
        'mediatype:(audio) AND (subject:(generative) OR subject:(modular synth))'
      ],
      electronic: [
        'mediatype:(audio) AND collection:(netlabels) AND (subject:(electronic) OR subject:(techno))',
        'mediatype:(audio) AND (subject:(idm) OR subject:(house) OR subject:(dub techno))',
        'mediatype:(audio) AND (subject:(breakbeat) OR subject:(drum and bass) OR subject:(electro))'
      ],
      dj: [
        'mediatype:(audio) AND (subject:(dj mix) OR subject:(dj set) OR subject:(mixtape))',
        'mediatype:(audio) AND (subject:(mix) AND subject:(electronic))',
        'mediatype:(audio) AND collection:(netlabels) AND subject:(mix)'
      ],
      live: [
        'collection:(etree)',
        'collection:(etree) AND subject:(soundboard)',
        'mediatype:(audio) AND (subject:(live concert) OR subject:(live session))'
      ],
      lofi: [
        'mediatype:(audio) AND (subject:(lo-fi) OR subject:(beat tape) OR subject:(instrumental hip hop))',
        'mediatype:(audio) AND collection:(netlabels) AND (subject:(hip hop) OR subject:(downtempo))',
        'mediatype:(audio) AND (subject:(jazz) AND subject:(instrumental))'
      ],
      radio: [
        'mediatype:(audio) AND (collection:(oldtimeradio) OR collection:(radioprograms))',
        'mediatype:(audio) AND collection:(georgeblood)',
        'mediatype:(audio) AND (collection:(shortwave) OR subject:(pirate radio))'
      ],
      experimental: [
        'mediatype:(audio) AND (subject:(demoscene) OR subject:(chiptune) OR subject:(tracker))',
        'mediatype:(audio) AND (subject:(keygen) OR subject:(amiga) OR subject:(sid))',
        'mediatype:(audio) AND (subject:(musique concrete) OR subject:(noise) OR subject:(sound art))',
        'mediatype:(audio) AND (collection:(shortwave) OR subject:(field recording))'
      ]
    };
    return pools[tag] || pools.electronic;
  }

  async fetchLiveTracks({ tag, signal } = {}) {
    const queries = this.queriesForTag(tag);
    const query = queries[Math.floor(Math.random() * queries.length)];
    const sorts = ['downloads desc', 'week desc', 'publicdate desc', 'avg_rating desc'];
    const sort = sorts[Math.floor(Math.random() * sorts.length)];
    const page = 1 + Math.floor(Math.random() * 3);

    const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier,title,creator,description,year&sort[]=${encodeURIComponent(sort)}&rows=50&page=${page}&output=json`;
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
          const author = Array.isArray(d.creator) ? d.creator.join(', ') : (d.creator || 'Internet Archive');
          return {
            url: `https://archive.org/details/${d.identifier}`,
            title: `${author} - ${d.title}`,
            caption: desc || 'Open recording preserved on Internet Archive.',
            tag: resolveGenre(`${d.title} ${desc}`, tag || 'experimental'),
            source: 'Internet Archive'
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
      ttlMs: 10 * 60 * 1000
    });
    this.hosts = [
      'https://discoveryprovider.audius.co',
      'https://discoveryprovider2.audius.co',
      'https://discoveryprovider3.audius.co'
    ];
    // Audius genres reachable from each FM affinity
    this.genresByTag = {
      ambient: ['Ambient', 'Downtempo', 'Experimental'],
      electronic: ['Electronic', 'Techno', 'House', 'Deep House', 'Progressive House', 'Drum & Bass', 'Trance', 'Dubstep'],
      dj: ['Techno', 'House', 'Deep House', 'Disco'],
      live: ['Jazz', 'Folk', 'Rock', 'Acoustic', 'World'],
      lofi: ['Lo-Fi', 'Hip-Hop/Rap', 'Downtempo', 'Jazz'],
      radio: ['Electronic', 'Ambient', 'Downtempo'],
      experimental: ['Experimental', 'Ambient', 'Electronic']
    };
  }

  genreFor(tag) {
    const pool = this.genresByTag[tag] || this.genresByTag.electronic;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  host() {
    return this.hosts[Math.floor(Math.random() * this.hosts.length)];
  }

  /**
   * Builds a couple of different endpoints per refresh (global trending,
   * genre-scoped trending, underground) so the pool is never the same top 25.
   */
  buildEndpoints(tag) {
    const genre = this.genreFor(tag);
    const endpoints = [
      `${this.host()}/v1/tracks/trending?app_name=onepick&limit=30`,
      `${this.host()}/v1/tracks/trending?app_name=onepick&limit=30&genre=${encodeURIComponent(genre)}`,
      `${this.host()}/v1/tracks/trending/underground?app_name=onepick&limit=30`,
      `${this.host()}/v1/tracks/trending?app_name=onepick&limit=30&time=month`
    ];
    return sampleList(endpoints, 2);
  }

  mapTracks(items, tag) {
    if (!Array.isArray(items)) return [];
    return items
      .filter(t => t && t.id && t.title && t.is_streamable !== false)
      .map(t => {
        const artist = t.user?.name || t.user?.handle || 'Audius Artist';
        const genre = t.genre || 'Electronic';
        return {
          url: `https://audius.co/embed/track/${t.id}`,
          title: `${artist} - ${t.title}`,
          caption: `${genre} streaming decentralized via Audius protocol.`,
          tag: resolveGenre(genre, tag || 'electronic'),
          source: 'Audius'
        };
      });
  }

  async fetchLiveTracks({ tag, signal } = {}) {
    const endpoints = this.buildEndpoints(tag);
    const results = await Promise.allSettled(
      endpoints.map(async (url) => {
        const res = await fetch(url, { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        return this.mapTracks(body?.data, tag);
      })
    );

    const buckets = results
      .filter(r => r.status === 'fulfilled' && r.value.length > 0)
      .map(r => r.value);

    return dedupeTracks(interleaveBuckets(buckets));
  }
}


/**
 * Curated YouTube source roster — music only, grouped by FM affinity.
 * Each entry carries either a stable `id` (UC... channel id, used as-is) or a
 * `handle` (@name) that is resolved to a channel id on demand and cached.
 * Channels that cannot be resolved are skipped silently, so the roster can grow
 * without risking a dead rotation. Run `node bot.js --check-sources` to audit it.
 */
export const YOUTUBE_CHANNELS = [
  // --- #live: sessions recorded in one take ---
  { id: 'UC3I2GFN_F8WudD_2jUZbojA', handle: 'kexp', name: 'KEXP', tag: 'live', desc: 'Live studio sessions and independent music discoveries' },
  { handle: 'COLORSxSTUDIOS', name: 'COLORS', tag: 'live', desc: 'Minimal monochrome stages for emerging global artists' },
  { handle: 'nprmusic', name: 'NPR Music', tag: 'live', desc: 'Tiny Desk concerts and intimate acoustic performances' },
  { handle: 'audiotree', name: 'Audiotree', tag: 'live', desc: 'Independent live sessions recorded in Chicago' },
  { handle: 'LaBlogotheque', name: 'La Blogothèque', tag: 'live', desc: 'Take Away Shows filmed in streets, kitchens and staircases' },
  { handle: 'sofarsounds', name: 'Sofar Sounds', tag: 'live', desc: 'Living-room concerts from unexpected cities' },
  { handle: 'MahoganySessions', name: 'Mahogany', tag: 'live', desc: 'Stripped-back sessions and songwriter portraits' },

  // --- #dj: sets, clubs, long mixes ---
  { id: 'UCCycRfTS7V9WOFfWfkNVCSg', handle: 'Cercle', name: 'Cercle', tag: 'dj', desc: 'Unique live electronic performances in scenic locations' },
  { handle: 'boilerroom', name: 'Boiler Room', tag: 'dj', desc: 'Underground club sets recorded in rooms around the world' },
  { handle: 'dekmantel', name: 'Dekmantel', tag: 'dj', desc: 'Festival recordings and deep club selections' },

  // --- #electronic ---
  { id: 'UC6qQOTx9LuKMC5p2dbjmSRg', handle: 'HateLab', name: 'HateLab', tag: 'electronic', desc: 'Deep minimal techno and hypnotic resonances' },
  { handle: 'NinjaTune', name: 'Ninja Tune', tag: 'electronic', desc: 'Label transmissions across electronica, jazz and bass' },
  { handle: 'WarpRecords', name: 'Warp Records', tag: 'electronic', desc: 'Experimental electronic catalogue and audiovisual works' },

  // --- #lofi ---
  { id: 'UCSJ4gkVC6NrvII8umztf0Ow', handle: 'LofiGirl', name: 'Lofi Girl', tag: 'lofi', desc: 'Lo-fi ambient beats and peaceful frequencies' },
  { handle: 'ChillhopMusic', name: 'Chillhop Music', tag: 'lofi', desc: 'Jazzy instrumental beats for slow hours' },
  { handle: 'stonesthrow', name: 'Stones Throw', tag: 'lofi', desc: 'Beat tapes, soul excavations and left-field hip hop' },

  // --- #radio: continuous shows ---
  { handle: 'NTSRadio', name: 'NTS Radio', tag: 'radio', desc: 'Wide-spectrum radio shows and archival selections' },
  { handle: 'TheLotRadio', name: 'The Lot Radio', tag: 'radio', desc: 'Continuous DJ shows from a shipping container in Brooklyn' },

  // --- #ambient: modular synthesis and stillness ---
  { id: 'UCGSSFkUjSBpDzA1aD4yq1zw', handle: 'StateAzure', name: 'State Azure', tag: 'ambient', desc: 'Generative modular synthesis and analog soundscapes' },
  { handle: 'mylarmelodies', name: 'mylarmelodies', tag: 'ambient', desc: 'Modular patches and eurorack storytelling' },
  { handle: 'sonicstate', name: 'Sonic State', tag: 'ambient', desc: 'Synthesizer explorations and studio field reports' },

  // --- #experimental: instruments that should not exist ---
  { handle: 'Hainbach', name: 'Hainbach', tag: 'experimental', desc: 'Test equipment turned into instruments and tape experiments' },
  { handle: 'LOOKMUMNOCOMPUTER', name: 'Look Mum No Computer', tag: 'experimental', desc: 'Homebrew synths, sound sculptures and joyful noise' },
  { handle: 'andrewhuang', name: 'Andrew Huang', tag: 'experimental', desc: 'Sound design experiments and improbable instruments' }
];

const YT_CHANNEL_ID_RE = /^UC[A-Za-z0-9_-]{22}$/;
const YT_ID_CACHE_KEY = 'onepick_yt_channel_ids';

// handle -> channel id ('' means "resolution failed", so we stop retrying it)
const youtubeIdCache = new Map();
let youtubeIdCacheLoaded = false;

function loadYouTubeIdCache() {
  if (youtubeIdCacheLoaded) return;
  youtubeIdCacheLoaded = true;
  if (typeof localStorage === 'undefined') return;
  try {
    const raw = JSON.parse(localStorage.getItem(YT_ID_CACHE_KEY) || '{}');
    for (const [handle, id] of Object.entries(raw)) {
      if (typeof id === 'string') youtubeIdCache.set(handle, id);
    }
  } catch (e) {}
}

function persistYouTubeIdCache() {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(YT_ID_CACHE_KEY, JSON.stringify(Object.fromEntries(youtubeIdCache)));
  } catch (e) {}
}

/**
 * Resolves a channel entry to a YouTube channel id.
 * Entries with a hardcoded id resolve instantly; handle-only entries are looked
 * up once by scraping the public channel page (no API key), then cached.
 */
export async function resolveYouTubeChannelId(channel, { signal } = {}) {
  if (!channel) return null;
  if (channel.id && YT_CHANNEL_ID_RE.test(channel.id)) return channel.id;

  const handle = (channel.handle || '').replace(/^@/, '').trim();
  if (!handle) return null;

  loadYouTubeIdCache();
  if (youtubeIdCache.has(handle)) {
    return youtubeIdCache.get(handle) || null;
  }

  let html = '';
  try {
    html = await fetchWithCORSProxy(`https://www.youtube.com/@${handle}`, { signal, asJson: false });
  } catch (e) {
    return null; // transient network issue: do not poison the cache
  }

  const match = html.match(/"(?:externalId|channelId)"\s*:\s*"(UC[A-Za-z0-9_-]{22})"/)
    || html.match(/channel_id=(UC[A-Za-z0-9_-]{22})/);
  const resolved = match ? match[1] : '';
  youtubeIdCache.set(handle, resolved);
  persistYouTubeIdCache();

  if (!resolved) {
    console.warn(`[YouTubeFeedProvider] Canale non risolvibile: @${handle} (saltato)`);
  }
  return resolved || null;
}

/**
 * YouTube Live RSS Feed Provider (Zero API Key, Public Channels)
 * Every refresh samples several channels from the roster and interleaves their
 * feeds, so consecutive rotations rarely come from the same place.
 */
export class YouTubeFeedProvider extends BaseProvider {
  constructor({ channelsPerFetch = 4 } = {}) {
    super({
      id: 'youtube',
      name: 'YouTube Dynamic Feeds',
      ttlMs: 20 * 60 * 1000
    });
    this.channelsPerFetch = channelsPerFetch;
  }

  channelsForTag(tag) {
    if (!tag) return YOUTUBE_CHANNELS;
    const filtered = YOUTUBE_CHANNELS.filter(c => c.tag === tag);
    return filtered.length > 0 ? filtered : YOUTUBE_CHANNELS;
  }

  parseFeed(xml, channel) {
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
        const author = authorMatch ? authorMatch[1] : channel.name;
        tracks.push({
          url: `https://www.youtube.com/watch?v=${vid}`,
          title: `${author} - ${rawTitle}`,
          caption: `${channel.desc} via live YouTube feed.`,
          tag: channel.tag || 'electronic',
          source: channel.name
        });
      }
    }
    return tracks;
  }

  async fetchChannelTracks(channel, { signal } = {}) {
    const channelId = await resolveYouTubeChannelId(channel, { signal });
    if (!channelId) return [];
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    let xml = '';
    try {
      xml = await fetchWithCORSProxy(feedUrl, { signal, asJson: false });
    } catch (e) {
      return [];
    }
    return this.parseFeed(xml, channel);
  }

  async fetchLiveTracks({ tag, signal } = {}) {
    const pool = this.channelsForTag(tag);
    const chosen = sampleList(pool, Math.min(this.channelsPerFetch, pool.length));

    const results = await Promise.allSettled(
      chosen.map(channel => this.fetchChannelTracks(channel, { signal }))
    );

    const buckets = results
      .filter(r => r.status === 'fulfilled' && Array.isArray(r.value) && r.value.length > 0)
      .map(r => r.value);

    return dedupeTracks(interleaveBuckets(buckets));
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
      ttlMs: 30 * 60 * 1000
    });
    this.articleWindow = 12;      // how many feed items are considered
    this.articlesPerFetch = 6;    // how many of them are actually crawled
    this.albumsPerArticle = 3;    // playable albums extracted per article
  }

  async fetchLiveTracks({ tag, signal } = {}) {
    const feedUrl = 'https://daily.bandcamp.com/feed';
    let xml = '';
    try {
      xml = await fetchWithCORSProxy(feedUrl, { signal, asJson: false });
    } catch (e) {
      return [];
    }

    const items = xml.split('<item>');

    // Crawl the latest articles and extract real playable Bandcamp album links.
    // Sampling a wider window of articles (and several albums each) keeps the pool varied.
    const articleUrls = [];
    for (let i = 1; i < Math.min(items.length, this.articleWindow + 1); i++) {
      const linkMatch = items[i].match(/<link>(https:\/\/daily\.bandcamp\.com\/[^\/]+\/[^<]+)<\/link>/);
      if (linkMatch && linkMatch[1]) {
        articleUrls.push(linkMatch[1].trim());
      }
    }

    const albumPromises = sampleList(articleUrls, this.articlesPerFetch).map(async (artUrl) => {
      try {
        const artHtml = await fetchWithCORSProxy(artUrl, { signal, asJson: false });
        if (!artHtml) return [];

        const albumLinks = [...new Set(
          [...artHtml.matchAll(/https:\/\/[a-zA-Z0-9_\-]+\.bandcamp\.com\/album\/[a-zA-Z0-9_\-]+/g)].map(m => m[0])
        )];
        if (albumLinks.length === 0) return [];

        const title = artHtml.match(/<meta property="og:title" content="([^"]+)"/)?.[1] || '';
        const desc = artHtml.match(/<meta property="og:description" content="([^"]+)"/)?.[1] || '';
        const cleanTitle = decodeXmlEntities(title);
        const cleanDesc = decodeXmlEntities(desc).replace(/<[^>]*>?/gm, '').slice(0, 120);

        return albumLinks.slice(0, this.albumsPerArticle).map(url => ({
          url,
          title: cleanTitle || 'Bandcamp Featured Release',
          caption: cleanDesc || 'Independent album streaming from Bandcamp.',
          tag: resolveGenre(`${cleanTitle} ${cleanDesc}`, tag || 'electronic'),
          source: 'Bandcamp Daily'
        }));
      } catch (e) {}
      return [];
    });

    return dedupeTracks((await Promise.all(albumPromises)).flat());
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
      ttlMs: 30 * 60 * 1000
    });
    // Mixcloud tags reachable from each FM affinity
    this.tagsByGenre = {
      ambient: ['ambient', 'drone', 'chillout', 'downtempo', 'soundtrack'],
      electronic: ['electronic', 'techno', 'house', 'minimal', 'idm', 'breakbeat', 'dub'],
      dj: ['house', 'techno', 'disco', 'balearic', 'afrobeat', 'breakbeat'],
      live: ['jazz', 'soul', 'funk', 'afrobeat', 'psychedelic'],
      lofi: ['lo-fi', 'hip-hop', 'jazz', 'chillout', 'downtempo'],
      radio: ['ambient', 'chillout', 'electronic', 'soundtrack'],
      experimental: ['experimental', 'krautrock', 'psychedelic', 'library-music', 'field-recordings', 'drone']
    };
  }

  tagsFor(genre) {
    return this.tagsByGenre[genre] || this.tagsByGenre.dj;
  }

  async fetchTagTracks(tag, order, genre, { signal } = {}) {
    const url = `https://api.mixcloud.com/tag/${tag}/${order}/?limit=25`;
    let data = null;
    try {
      data = await fetchWithCORSProxy(url, { signal, asJson: true });
    } catch (e) {
      return [];
    }

    const items = data?.data;
    if (!Array.isArray(items)) return [];

    return items
      .filter(item => item.url && item.name && !item.is_exclusive)
      .map(item => {
        const user = item.user?.name || item.user?.username || 'Mixcloud DJ';
        const cleanName = item.name.replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim();
        return {
          url: item.url,
          title: `${user} - ${cleanName}`,
          caption: `DJ set & long-form cloudcast streaming on Mixcloud (#${tag}).`,
          tag: genre,
          source: `Mixcloud #${tag}`
        };
      });
  }

  async fetchLiveTracks({ tag, signal } = {}) {
    const genre = FM_GENRES.includes(tag) ? tag : 'dj';
    const selectedTags = sampleList(this.tagsFor(genre), 3);
    const orders = ['popular', 'latest'];

    const results = await Promise.allSettled(
      selectedTags.map(mcTag => this.fetchTagTracks(
        mcTag,
        orders[Math.floor(Math.random() * orders.length)],
        genre,
        { signal }
      ))
    );

    const buckets = results
      .filter(r => r.status === 'fulfilled' && r.value.length > 0)
      .map(r => r.value);

    return dedupeTracks(interleaveBuckets(buckets));
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
      ttlMs: 60 * 60 * 1000
    });
  }

  async fetchLiveTracks({ signal } = {}) {
    const url = 'https://somafm.com/channels.json';
    let data = null;
    try {
      data = await fetchWithCORSProxy(url, { signal, asJson: true });
    } catch (e) {
      return [];
    }

    const channels = data?.channels;
    if (Array.isArray(channels) && channels.length > 0) {
      return channels
        .filter(c => c.id && c.title)
        .map(c => {
          let desc = (c.description || '').trim();
          if (desc.length > 120) desc = desc.slice(0, 117) + '...';
          const genre = (c.genre || '').replace(/\|/g, ', ');
          return {
            url: `https://ice1.somafm.com/${c.id}-128-mp3`,
            title: `SomaFM: ${c.title}`,
            caption: desc || `Independent commercial-free continuous radio stream from SomaFM${genre ? ` (${genre})` : ''}.`,
            tag: resolveGenre(genre, 'radio'),
            source: 'SomaFM'
          };
        });
    }
    return [];
  }
}

/**
 * Radio Browser Provider — community catalogue of ~50k live radio stations.
 * Only https direct streams that the in-page player can actually decode are kept.
 */
export const RADIO_BROWSER_MIRRORS = [
  'https://de1.api.radio-browser.info',
  'https://nl1.api.radio-browser.info',
  'https://at1.api.radio-browser.info'
];

export const RADIO_BROWSER_TAGS = {
  ambient: ['ambient', 'drone', 'chillout', 'meditation', 'new age'],
  electronic: ['electronic', 'techno', 'house', 'dance', 'trance', 'dub'],
  dj: ['dance', 'club', 'house', 'techno', 'disco'],
  live: ['jazz', 'blues', 'folk', 'acoustic', 'indie'],
  lofi: ['lofi', 'chillhop', 'hip hop', 'chillout', 'downtempo'],
  radio: ['eclectic', 'alternative', 'indie', 'classical', 'world music'],
  experimental: ['experimental', 'avantgarde', 'psychedelic', 'noise', 'krautrock']
};

export class RadioBrowserProvider extends BaseProvider {
  constructor() {
    super({
      id: 'radiobrowser',
      name: 'Radio Browser Live Stations',
      ttlMs: 45 * 60 * 1000
    });
  }

  mirror() {
    return RADIO_BROWSER_MIRRORS[Math.floor(Math.random() * RADIO_BROWSER_MIRRORS.length)];
  }

  async fetchTagStations(tag, genre, { signal } = {}) {
    const url = `${this.mirror()}/json/stations/search?limit=80&hidebroken=true&order=clickcount&reverse=true&codec=MP3&tag=${encodeURIComponent(tag)}`;
    let stations = null;
    try {
      stations = await fetchWithCORSProxy(url, {
        signal,
        asJson: true,
        headers: { 'User-Agent': 'onepick/1.0 (+https://onepick-gamma.vercel.app)' }
      });
    } catch (e) {
      return [];
    }

    if (!Array.isArray(stations)) return [];

    return stations
      .map(st => {
        const streamUrl = (st.url_resolved || st.url || '').trim();
        const name = (st.name || '').replace(/\s+/g, ' ').trim();
        if (!streamUrl || !name) return null;
        const place = [st.country, st.state].filter(Boolean).join(' · ');
        const stationTags = (st.tags || '').split(',').filter(Boolean).slice(0, 3).join(', ');
        return {
          url: streamUrl,
          title: `Radio: ${name}`,
          caption: `Live ${stationTags || tag} radio stream${place ? ` from ${place}` : ''}.`,
          tag: genre,
          source: `Radio Browser #${tag}`
        };
      })
      .filter(t => t && isDirectAudioStreamUrl(t.url));
  }

  async fetchLiveTracks({ tag, signal } = {}) {
    const genre = FM_GENRES.includes(tag) ? tag : 'radio';
    const selected = sampleList(RADIO_BROWSER_TAGS[genre] || RADIO_BROWSER_TAGS.radio, 3);
    const results = await Promise.allSettled(
      selected.map(rbTag => this.fetchTagStations(rbTag, genre, { signal }))
    );

    const buckets = results
      .filter(r => r.status === 'fulfilled' && r.value.length > 0)
      .map(r => r.value);

    return dedupeTracks(interleaveBuckets(buckets));
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

  listProviderIds() {
    return Array.from(this.providers.keys());
  }

  /**
   * The provider pool a station rotates across: its signature provider first,
   * then any extra networks declared on the bot (`providers`).
   */
  resolveBotProviderIds(bot) {
    const ids = [];
    if (bot?.provider) ids.push(bot.provider);
    for (const id of bot?.providers || []) {
      if (!ids.includes(id)) ids.push(id);
    }
    return ids.filter(id => this.has(id));
  }

  /**
   * onepick is a radio: every slot must be playable in-page, whatever the affinity.
   */
  acceptsTrack(bot, track) {
    if (!track || !track.url) return false;
    return isPlayableAudioUrl(track.url);
  }

  async getTrackForBot(bot, currentUrl = null) {
    const filter = (t) => this.acceptsTrack(bot, t);

    // 1. Primary: roam the station's own provider pool. The signature provider
    //    keeps a head start, but the bot regularly reaches for its other sources.
    const poolIds = this.resolveBotProviderIds(bot);
    const orderedIds = poolIds.length > 1 && Math.random() < 0.5
      ? [poolIds[0], ...shuffleList(poolIds.slice(1))]
      : shuffleList(poolIds);

    for (const id of orderedIds) {
      const provider = this.get(id);
      if (!provider) continue;
      const track = await provider.getRandomTrack({ currentUrl, tag: bot?.tag, bot, filter });
      if (track && track.url) return track;
    }

    // 2. Secondary: query every other dynamic provider matching the bot's tag
    const shuffled = shuffleList(
      Array.from(this.providers.values()).filter(p => !poolIds.includes(p.id))
    );

    for (const provider of shuffled) {
      const track = await provider.getRandomTrack({ currentUrl, tag: bot?.tag, bot, filter });
      if (track && track.url) return track;
    }

    // 3. Final fallback: any live dynamic provider without tag constraints
    for (const provider of shuffled) {
      const track = await provider.getRandomTrack({ currentUrl, filter });
      if (track && track.url) return track;
    }

    return null;
  }
}

// Global default provider registry instance (pure dynamic live networks only)
export const providerRegistry = new ProviderRegistry();
providerRegistry.register(new TuneCampProvider());
providerRegistry.register(new ArchiveOrgProvider());
providerRegistry.register(new AudiusProvider());
providerRegistry.register(new YouTubeFeedProvider());
providerRegistry.register(new BandcampDailyProvider());
providerRegistry.register(new MixcloudProvider());
providerRegistry.register(new SomaFMProvider());
providerRegistry.register(new RadioBrowserProvider());

/**
 * Searches and fetches live releases from the TuneCamp network (/api/releases)
 * Automatically falls back to curated fallback tracks if network is slow or offline.
 * Maintained for backward compatibility.
 */
export async function fetchLiveTuneCampTracks() {
  const provider = providerRegistry.get('tunecamp');
  return provider ? await provider.getTracks() : [];
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
    tag: track.tag || bot.tag || 'radio',
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
  const intervalMs = options.intervalMs || 5 * 60 * 1000;        // rotation cadence while a tab is open
  const staleMs = options.staleMs || intervalMs;                 // a station older than this is up for rotation
  const maxPerVisit = options.maxRotationsPerVisit || 2;         // stale stations refreshed by a single visit
  const syncGraceMs = options.syncGraceMs || 12000;              // wait for the mesh before calling a station missing
  const getStations = typeof options.getStations === 'function' ? options.getStations : () => null;
  const LOCK_KEY = 'onepick_seeder_last_ts';

  let isRunning = true;
  let intervalHandle = null;
  let rotationIndex = 0;
  let inFlight = false; // one seeding pass at a time in this tab

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const jitter = (baseMs) => baseMs + Math.floor(Math.random() * baseMs);

  function readLock() {
    if (typeof localStorage === 'undefined') return 0;
    try {
      return parseInt(localStorage.getItem(LOCK_KEY) || '0', 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function writeLock(ts) {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(LOCK_KEY, String(ts));
    } catch (e) {}
  }

  /** Cross-tab guard: true when this tab is allowed to start a seeding pass. */
  function acquireLock(cooldownMs) {
    const ts = Date.now();
    if (ts - readLock() < cooldownMs) return false;
    writeLock(ts);
    return true;
  }

  /**
   * Splits the bot roster into stations missing from the ether and stations gone stale,
   * reading the live station map the page keeps in sync with the mesh.
   */
  function surveyStations(stationsMap) {
    const known = new Map(); // username -> { bot, station, ts }
    if (stationsMap) {
      for (const station of stationsMap.values()) {
        if (!station || !station.author) continue;
        const bot = SEED_BOTS.find(b => b.username === station.author);
        if (!bot) continue;
        const prev = known.get(bot.username);
        const ts = station.ts || 0;
        if (!prev || ts > prev.ts) known.set(bot.username, { bot, station, ts });
      }
    }
    const now = Date.now();
    return {
      known,
      missing: SEED_BOTS.filter(b => !known.has(b.username)),
      stale: Array.from(known.values())
        .filter(entry => now - entry.ts >= staleMs)
        .sort((a, b) => a.ts - b.ts)
    };
  }

  /** False when another visitor refreshed this station while we were working. */
  function stillNeedsRotation(username) {
    const map = getStations();
    if (!map) return true;
    const entry = surveyStations(map).known.get(username);
    if (!entry) return true;
    return Date.now() - entry.ts >= staleMs;
  }

  /**
   * The mesh needs a moment to deliver the stations that are already on air.
   * Without this wait a fresh visitor would consider every station missing and
   * overwrite the whole ether on arrival.
   */
  async function waitForMeshSync(stationsMap) {
    const map = stationsMap || getStations();
    if (!map) return map;
    const deadline = Date.now() + syncGraceMs;
    while (isRunning && Date.now() < deadline && surveyStations(map).known.size === 0) {
      await sleep(1000);
    }
    return map;
  }

  async function broadcastFor(bot, currentUrl = null) {
    const track = await getTrackForBot(bot, currentUrl);
    if (!track || !track.url) return null;
    try {
      const res = await broadcastSeedSlot(zen, bot, track, ZEN);
      writeLock(Date.now());
      if (options.onBroadcast) options.onBroadcast(res);
      return res;
    } catch (e) {
      console.warn('[onepick seeder] Errore broadcast slot:', e);
      return null;
    }
  }

  /**
   * Runs when someone lands on the page (and whenever a tab returns to the foreground).
   * Visitors are what keep the ether alive with no server: missing stations are seeded,
   * then the stalest ones are rotated a couple at a time.
   */
  async function checkAndSeedOnPageEntry(stationsMap) {
    if (!zen || !isRunning || inFlight) return;
    inFlight = true;
    try {
      const map = await waitForMeshSync(stationsMap);
      const { missing, stale } = surveyStations(map);
      if (missing.length === 0 && stale.length === 0) return;

      // Cross-tab cooldown. A cold ether (missing stations) is always worth the work.
      const cooldownMs = missing.length > 0 ? 15000 : Math.min(60000, intervalMs);
      if (!acquireLock(cooldownMs)) return;

      const queue = [
        ...missing.map(bot => ({ bot, currentUrl: null })),
        ...stale.slice(0, maxPerVisit).map(entry => ({ bot: entry.bot, currentUrl: entry.station?.url || null }))
      ];

      for (const item of queue) {
        if (!isRunning) break;
        if (!stillNeedsRotation(item.bot.username)) continue;
        const res = await broadcastFor(item.bot, item.currentUrl);
        if (res) {
          console.log(`[onepick auto-seeder] @${item.bot.username} -> ${res.track.title}`);
        }
        await sleep(jitter(700)); // stagger writes so concurrent visitors do not collide
      }
    } catch (e) {
      console.warn('[onepick auto-seeder] Errore seeding di ingresso:', e);
    } finally {
      inFlight = false;
    }
  }

  /** Timer tick while the tab stays open: refresh whichever station is stalest. */
  async function performRotation() {
    if (!isRunning || !zen || inFlight) return null;
    if (!acquireLock(Math.max(intervalMs - 5000, 30000))) return null;

    inFlight = true;
    try {
      const map = getStations();
      const { missing, stale } = surveyStations(map);

      let bot = missing[0] || null;
      let currentUrl = null;
      if (!bot && stale.length > 0) {
        bot = stale[0].bot;
        currentUrl = stale[0].station?.url || null;
      }
      if (!bot && !map) {
        // No view on the ether (e.g. headless use): fall back to plain round-robin
        bot = SEED_BOTS[rotationIndex++ % SEED_BOTS.length];
      }
      if (!bot) return null;

      return await broadcastFor(bot, currentUrl);
    } finally {
      inFlight = false;
    }
  }

  // Rotation while the tab is open
  intervalHandle = setInterval(() => {
    performRotation();
  }, intervalMs);

  // A backgrounded tab misses its timers: catch up as soon as it is visible again
  let onVisibilityChange = null;
  if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndSeedOnPageEntry(getStations());
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
  }

  return {
    checkAndSeedOnPageEntry,
    performRotation,
    surveyStations: () => surveyStations(getStations()),
    rotateStation: (botIdentifier, currentUrl) => rotateBotStation(zen, ZEN, botIdentifier, currentUrl),
    stop: () => {
      isRunning = false;
      if (intervalHandle) clearInterval(intervalHandle);
      if (onVisibilityChange && typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibilityChange);
      }
    }
  };
}

/**
 * Manually or programmatically triggers an immediate dynamic rotation for a bot station.
 * Fetches a fresh live track from its dynamic provider and broadcasts it to Zen mesh.
 */
export async function rotateBotStation(zen, ZEN, botIdentifier, currentUrl = null) {
  if (!zen) throw new Error('Zen client non inizializzato');

  let targetBot = null;
  if (typeof botIdentifier === 'string') {
    targetBot = SEED_BOTS.find(b => b.username === botIdentifier || b.id === botIdentifier);
    if (!targetBot) {
      for (const b of SEED_BOTS) {
        const p = await deriveBotPair(b.username, b.passphrase, ZEN);
        if (p.pub === botIdentifier) {
          targetBot = b;
          break;
        }
      }
    }
  } else if (botIdentifier && botIdentifier.username) {
    targetBot = botIdentifier;
  }

  if (!targetBot) {
    targetBot = SEED_BOTS[Math.floor(Math.random() * SEED_BOTS.length)];
  }

  const newTrack = await getTrackForBot(targetBot, currentUrl);
  if (!newTrack || !newTrack.url) {
    throw new Error(`Nessuna traccia live disponibile al momento per @${targetBot.username}`);
  }

  const res = await broadcastSeedSlot(zen, targetBot, newTrack, ZEN);
  return res;
}
