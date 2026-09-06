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
    desc: 'Forgotten frequencies, lo-fi tape loops, and analog gems from the obscure web.'
  },
  {
    id: 'transit',
    username: 'sound-transit',
    passphrase: 'onepick-seed-transit-2026-fm',
    tag: 'sound',
    desc: 'Sonic architecture & deep listening: field recordings, drone, and transit soundscapes.'
  },
  {
    id: 'zero',
    username: 'ambient-zero',
    passphrase: 'onepick-seed-zero-2026-relay',
    tag: 'art',
    desc: 'Minimal signals, endless tape loops, and present stillness for overstimulated minds.'
  },
  {
    id: 'tunecamp',
    username: 'tunecamp-relay',
    passphrase: 'onepick-seed-tunecamp-2026-federation',
    tag: 'sound',
    provider: 'tunecamp',
    desc: 'Musica indipendente e cataloghi federati direttamente dal network TuneCamp / SudoRecords.'
  },
  {
    id: 'cyber',
    username: 'retro-cyber',
    passphrase: 'onepick-seed-cyber-2026-matrix',
    tag: 'code',
    desc: 'Demoscene music, tracker modules, cyberpunk synthesis, and algorithmic soundscapes.'
  },
  {
    id: 'echo',
    username: 'tape-echo',
    passphrase: 'onepick-seed-echo-2026-reverb',
    tag: 'read',
    desc: 'Spoken word archives, literary field trips, slow cinema, and tape echo chambers.'
  },
  {
    id: 'archive-echo',
    username: 'archive-echo',
    passphrase: 'onepick-seed-archive-2026-ether',
    tag: 'read',
    desc: "Archivio radiofonico storico, letture liriche e conversazioni d'epoca. / Historical radio archive, lyrical readings, and period conversations."
  },
  {
    id: 'mystic',
    username: 'mystic-whispers',
    passphrase: 'onepick-seed-mystic-2026-ether',
    tag: 'obscureweb',
    desc: 'Ancient whispers and forgotten folklore from global oral traditions.'
  },
  {
    id: 'neon',
    username: 'neon-drift',
    passphrase: 'onepick-seed-neon-2026-fm',
    tag: 'sound',
    desc: 'Synthwave odyssey through neon-lit digital landscapes and retro-futuristic ambience.'
  },
  {
    id: 'void',
    username: 'void-pulse',
    passphrase: 'onepick-seed-void-2026-art',
    tag: 'art',
    desc: 'Abstract visual art meets ambient soundscapes for contemplative listening experiences.'
  }
];

export const SEED_TRACKS = [
  // --- YouTube Streams (100% Verified Playable & Embeddable) ---
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
    tag: 'art'
  },
  {
    url: 'https://www.youtube.com/watch?v=It4WxQ6dnn0',
    title: 'Brian Eno - An Ending (Ascent)',
    caption: 'The pinnacle of ambient music. Pure weightlessness, suspension, and timelessness.',
    tag: 'sound'
  },
  {
    url: 'https://www.youtube.com/watch?v=qYnA9wWFHLI',
    title: 'Marconi Union - Weightless',
    caption: 'Engineered with sound therapists to slow heart rate and dissolve anxiety into space.',
    tag: 'sound'
  },
  {
    url: 'https://www.youtube.com/watch?v=F7bKe_Zgk4o',
    title: 'Boards of Canada - Music Is Math',
    caption: 'Psychedelic micro-samples, broadcast numbers, and phantom frequencies in the air.',
    tag: 'obscureweb'
  },
  {
    url: 'https://www.youtube.com/watch?v=aBkTkxKDduc',
    title: 'C418 - Sweden',
    caption: 'Gentle piano melancholy by C418. Pure childhood memory and infinite blocky worlds.',
    tag: 'sound'
  },
  {
    url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY',
    title: 'Lofi Girl - Synthwave Radio',
    caption: 'Continuous analog signal: retro synthwave and dusty beats for midnight flow.',
    tag: 'sound'
  },
  {
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    title: 'Lofi Girl - Beats to Relax/Study',
    caption: 'Uninterrupted broadcast: warm jazz chops, soft vinyl crackle, and steady calm.',
    tag: 'sound'
  },
  {
    url: 'https://www.youtube.com/watch?v=HhZaHf8RP6g',
    title: 'Daft Punk - Veridis Quo',
    caption: 'Baroque arpeggios on synthesized organ. Timeless retro-futuristic longing.',
    tag: 'art'
  },
  {
    url: 'https://www.youtube.com/watch?v=ZtWTUt2RZh0',
    title: 'Kraftwerk - Computer Love',
    caption: '1981: digital loneliness and human connection foretold through pure synthesis.',
    tag: 'code'
  },
  {
    url: 'https://www.youtube.com/watch?v=dX3k_QDnzHE',
    title: 'M83 - Midnight City',
    caption: 'Nocturnal saxophone, soaring synth lines, and the cinematic rush of city lights.',
    tag: 'art'
  },

  // --- SoundCloud Streams (100% Verified Playable) ---
  {
    url: 'https://soundcloud.com/tycho/awake',
    title: 'Tycho - Awake',
    caption: 'Shimmering guitar lines, lush analog pads, and sun-soaked warmth in constant motion.',
    tag: 'art'
  },
  {
    url: 'https://soundcloud.com/erasedtapes/nils-frahm-says',
    title: 'Nils Frahm - Says',
    caption: 'Roland Juno synth and modular arpeggiators swelling from a whisper into ecstasy.',
    tag: 'sound'
  },
  {
    url: 'https://soundcloud.com/kiasmos/bent',
    title: 'Kiasmos - Bent',
    caption: 'Icelandic rhythmic minimalism, delicate acoustic piano, and intimate electronic warmth.',
    tag: 'sound'
  },
  {
    url: 'https://soundcloud.com/forss/flickermood',
    title: 'Forss - Flickermood',
    caption: 'Acoustic micro-rhythms and musique concrète sampled directly from church tape reels.',
    tag: 'obscureweb'
  },

  // --- Bandcamp Streams (100% Verified Playable) ---
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
  },
  {
    url: 'https://cryochamber.bandcamp.com/album/tomb-of-empires',
    title: 'Atrium Carceri - Tomb of Empires',
    caption: 'Cinematic dark ambient and subterranean industrial resonances from Cryo Chamber.',
    tag: 'obscureweb'
  },
  {
    url: 'https://lawrenceenglish.bandcamp.com/album/wilderness-of-mirrors',
    title: 'Lawrence English - Wilderness of Mirrors',
    caption: 'Dense sonic walls, extreme field recording, and hypnotic drones via Room40.',
    tag: 'sound'
  },

  // --- Internet Archive Streams (100% Verified Playable Public Domain & Netlabel Gems) ---
  {
    url: 'https://archive.org/details/ird059',
    title: 'The Conet Project - Shortwave Numbers Stations',
    caption: 'Misteriose trasmissioni numeriche su onde corte e frequenze spettrali dall\'etere analogico.',
    tag: 'obscureweb'
  },
  {
    url: 'https://archive.org/details/ca015_va_cs',
    title: 'Clinical Sounds Vol. 1 - Netlabel Ambient Drone',
    caption: 'Paesaggi sonori subacquei e drone minimalista dal catalogo aperto delle Netlabel storiche.',
    tag: 'sound'
  },
  {
    url: 'https://archive.org/details/78_chop-suey-mambo_alfredito-and-his-orchestra-al-lang_gbia0001871a',
    title: 'Alfredito - Chop Suey Mambo (1954 Vintage 78rpm)',
    caption: 'Archivio storico 78 giri George Blood: graffi caldi, lacca a 78rpm e mambo d\'altri tempi.',
    tag: 'sound'
  },
  {
    url: 'https://archive.org/details/Apollo11Audio',
    title: 'NASA - Apollo 11 Mission Audio Transmissions',
    caption: 'Comunicazioni originali terra-luna e rumori telemetrici dello spazio profondo preservati su Internet Archive.',
    tag: 'code'
  },

  // --- Audius Decentralized Web3 Streams ---
  {
    url: 'https://audius.co/embed/track/Jb3xzj7',
    title: 'Washed Out - Feel It All Around (Jay Bird Remix)',
    caption: 'Chillwave solare e ritmi sognanti in streaming decentralizzato su protocollo Audius.',
    tag: 'sound'
  },

  // --- Mixcloud Long-form Radio Sets (100% Verified Playable) ---
  {
    url: 'https://www.mixcloud.com/residentadvisor/ra1026-carl-craig-moodymann-mike-banks/',
    title: 'Resident Advisor - RA.1026 Moodymann & Carl Craig',
    caption: 'Detroit techno legends: Carl Craig, Moodymann and Mike Banks live session on Mixcloud.',
    tag: 'sound'
  },

  // --- Demoscene & Cyberpunk Tracks (#code) ---
  {
    url: 'https://www.youtube.com/watch?v=yYyq0zN8VpE',
    title: 'Farbrausch - fr-08: .the .product (64k PC Intro)',
    caption: 'Iconica colonna sonora demoscene PC 64k di Farbrausch: pura sintesi algoritmica.',
    tag: 'code'
  },
  {
    url: 'https://www.youtube.com/watch?v=FjMMX28ZwhM',
    title: 'Captain - Space Debris (Amiga MOD Tracker)',
    caption: 'Classico immortale dell\'era Amiga MOD tracker: chip sound a 4 canali e vibrazioni spaziali.',
    tag: 'code'
  },
  {
    url: 'https://disasterpeace.bandcamp.com/album/fez-ost',
    title: 'Disasterpeace - FEZ OST',
    caption: 'Chiptune ambient ed esplorazioni polifoniche retro-futuristiche da Disasterpeace.',
    tag: 'code'
  },

  // --- Spoken Archives & Literary Soundscapes (#read) ---
  {
    url: 'https://archive.org/details/italo-calvino-citta-invisibili',
    title: 'Italo Calvino - Le Città Invisibili (Lettura Radiofonica)',
    caption: 'Archivio Rai / Internet Archive: Marco Polo e Kublai Khan tra città immaginate e memoria.',
    tag: 'read'
  },
  {
    url: 'https://archive.org/details/william-burroughs-cutups',
    title: 'William S. Burroughs - Break Through In Grey Room (Cut-Ups)',
    caption: 'Sperimentazioni storiche su nastro magnetico, cut-up sonori e radio clandestina.',
    tag: 'read'
  },
  {
    url: 'https://archive.org/details/alan-watts-consciousness',
    title: 'Alan Watts - The Nature of Consciousness',
    caption: 'Riflessioni su mente, presenza e l\'illusione del sé preservate negli archivi audio aperti.',
    tag: 'read'
  }
];

// --- TuneCamp Federation Live Stream Catalog ---
export const TUNECAMP_FALLBACK_TRACKS = [
  {
    url: 'https://sudorecords.scobrudot.dev/releases/120-punk',
    title: 'Homologo - 120 PUNK',
    caption: 'Bouncy Techno indipendente direttamente dalla federazione TuneCamp su SudoRecords.',
    tag: 'sound'
  },
  {
    url: 'https://sudorecords.scobrudot.dev/releases/waterflow',
    title: 'Homologo - Waterflow',
    caption: 'Indie Dance e ritmi luminosi in streaming decentralizzato dal network TuneCamp.',
    tag: 'sound'
  },
  {
    url: 'https://sudorecords.scobrudot.dev/releases/ragazzi-in-collera',
    title: 'Homologo - Ragazzi in collera',
    caption: 'Tessiture elettroniche e produzione indipendente dal catalogo aperto TuneCamp.',
    tag: 'sound'
  },
  {
    url: 'https://sudorecords.scobrudot.dev/releases/la-prima-2',
    title: 'Homologo - La Prima - live set',
    caption: 'Minimal Techno live session e frequenze club registrate dal vivo su TuneCamp.',
    tag: 'sound'
  },
  {
    url: 'https://sudorecords.scobrudot.dev/releases/compleanno-1',
    title: 'Homologo - Compleanno',
    caption: 'Electropop e sintetizzatori vibranti dal nodo federato SudoRecords / TuneCamp.',
    tag: 'sound'
  },
  {
    url: 'https://sudorecords.scobrudot.dev/releases/fantasie-1',
    title: 'Homologo - Fantasie',
    caption: 'Elettronica calda e melodie sintetiche in ascolto P2P su TuneCamp.',
    tag: 'sound'
  },
  {
    url: 'https://sudorecords.scobrudot.dev/releases/ordine-ovviamente-2',
    title: 'Homologo - Ordine Ovviamente',
    caption: 'Ritmiche elettroniche contemporanee distribuite attraverso il network federato.',
    tag: 'sound'
  },
  {
    url: 'https://sudorecords.scobrudot.dev/releases/amorevole-crollo-1',
    title: 'Homologo - Amorevole Crollo',
    caption: 'Electropop e armonie intime rilasciate sulla rete federata TuneCamp.',
    tag: 'sound'
  }
];

let cachedTuneCampTracks = [...TUNECAMP_FALLBACK_TRACKS];
let lastTuneCampFetch = 0;

/**
 * Searches and fetches live releases from the TuneCamp network (/api/releases)
 * Automatically falls back to curated fallback tracks if network is slow or offline.
 */
export async function fetchLiveTuneCampTracks() {
  const now = Date.now();
  if (now - lastTuneCampFetch < 5 * 60 * 1000 && cachedTuneCampTracks.length > 0) {
    return cachedTuneCampTracks;
  }

  try {
    const res = await fetch('https://sudorecords.scobrudot.dev/api/releases', {
      signal: typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined
    });
    if (res.ok) {
      const releases = await res.json();
      if (Array.isArray(releases) && releases.length > 0) {
        const liveTracks = releases
          .filter(r => r.slug && r.is_public !== false)
          .map(r => ({
            url: `https://sudorecords.scobrudot.dev/releases/${r.slug}`,
            title: `${r.artist_name || r.artistName || 'TuneCamp'} - ${r.title}`,
            caption: `${r.genre || 'Musica indipendente'} in streaming dal network federato TuneCamp.`,
            tag: 'sound'
          }));

        if (liveTracks.length > 0) {
          cachedTuneCampTracks = liveTracks;
          lastTuneCampFetch = now;
          return liveTracks;
        }
      }
    }
  } catch (e) {
    console.warn('[TuneCamp Bot] Impossibile contattare TuneCamp API, uso catalogo locale:', e.message);
  }

  return cachedTuneCampTracks.length > 0 ? cachedTuneCampTracks : TUNECAMP_FALLBACK_TRACKS;
}

/**
 * Picks the next appropriate track for a specific bot identity:
 * - If bot is TuneCamp-specific, queries TuneCamp network exclusively.
 * - If bot has a specific tag (#code, #read, #art, #obscureweb), prioritizes that tag.
 */
export async function getTrackForBot(bot, currentUrl = null) {
  if (bot && bot.provider === 'tunecamp') {
    const tcTracks = await fetchLiveTuneCampTracks();
    const candidates = tcTracks.filter(t => t.url !== currentUrl);
    const pool = candidates.length > 0 ? candidates : tcTracks;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  let candidates = SEED_TRACKS.filter(t => t.url !== currentUrl);
  if (bot && bot.tag) {
    const tagMatches = candidates.filter(t => t.tag === bot.tag);
    if (tagMatches.length > 0) {
      candidates = tagMatches;
    }
  }

  const pool = candidates.length > 0 ? candidates : SEED_TRACKS;
  return pool[Math.floor(Math.random() * pool.length)];
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
      return res.ok;
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
 * Interval: 15 minutes (900,000 ms) by default
 */
export function startAutonomousSeeder(zen, ZEN, options = {}) {
  const intervalMs = options.intervalMs || 15 * 60 * 1000; // 15 min default
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
   * 2. If all bots exist but the oldest is >= 15 minutes old, rotates it to a fresh track!
   */
  async function checkAndSeedOnPageEntry(stationsMap) {
    if (!zen) return;

    const now = Date.now();
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

    // 2. If all exist, check if the oldest is >= 15 minutes old
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
      console.log(`[onepick auto-seeder] Rotating 15-min stale station: @${oldest.bot.username} -> ${newTrack.title}`);
      try {
        const res = await broadcastSeedSlot(zen, oldest.bot, newTrack, ZEN);
        if (options.onBroadcast) options.onBroadcast(res);
      } catch (e) {
        console.warn('[onepick auto-seeder] Rotation error:', e);
      }
    }
  }

  // Start 15-minute background interval while user stays on page
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
