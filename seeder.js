/**
 * onepick — Autonomous Seed Engine & Background Bot
 * Autopopulates the decentralized Zen P2P radio with curated cultural transmissions
 * across YouTube, SoundCloud, and Bandcamp rotating every 15 minutes.
 */

export const SALT_PREFIX = 'onepick:zen:station:';

export const SEED_BOTS = [
  {
    id: 'obscura',
    username: 'radio-obscura',
    passphrase: 'onepick-seed-obscura-2026-ether',
    tag: 'obscureweb',
    desc: 'Frequenze dimenticate, lo-fi tape loops e gemme analogiche del web sommerso.'
  },
  {
    id: 'transit',
    username: 'sound-transit',
    passphrase: 'onepick-seed-transit-2026-fm',
    tag: 'sound',
    desc: 'Architettura sonora e ascolto profondo: field recordings, drone e suoni in transito.'
  },
  {
    id: 'zero',
    username: 'ambient-zero',
    passphrase: 'onepick-seed-zero-2026-relay',
    tag: 'art',
    desc: 'Segnali minimi, nastri a ciclo continuo e quiete presente per menti iperstimolate.'
  }
];

export const SEED_TRACKS = [
  // --- YouTube Streams ---
  {
    url: 'https://www.youtube.com/watch?v=5abamR64Rwg',
    title: 'Hiroshi Yoshimura - Green (1986)',
    caption: "Campane d'acqua e sintetizzatori minimi da Tokyo, 1986. Pura chiarezza sonora.",
    tag: 'sound'
  },
  {
    url: 'https://www.youtube.com/watch?v=FjHGZj2IjBk',
    title: 'Aphex Twin - #3 Rhubarb',
    caption: 'Texture fluttuanti e riverberi lenti. Uno stato presente di assoluta quiete.',
    tag: 'sound'
  },
  {
    url: 'https://www.youtube.com/watch?v=4M8a2Qj3cLE',
    title: 'Brian Eno - 1/1 (Music for Airports)',
    caption: "La genesi dell'ambient music. Frammenti di pianoforte a ciclo discontinuo e respiro acustico.",
    tag: 'sound'
  },
  {
    url: 'https://www.youtube.com/watch?v=gXkwx5pWn80',
    title: 'Boards of Canada - Dayvan Cowboy',
    caption: 'Nostalgia analogica, nastri magnetici riscaldati dal sole e orizzonti sfuocati.',
    tag: 'obscureweb'
  },
  {
    url: 'https://www.youtube.com/watch?v=Xw5AiRVqoFQ',
    title: 'Stars of the Lid - A Meaningful Moment',
    caption: "Architetture di droni sinfonici e archi che si dissolvono all'infinito nel vuoto.",
    tag: 'sound'
  },
  {
    url: 'https://www.youtube.com/watch?v=q6k5KkFq_E0',
    title: 'Steve Roach - Structures from Silence',
    caption: 'Spazio profondo e risonanze analogiche registrate nel silenzio notturno del deserto.',
    tag: 'sound'
  },
  {
    url: 'https://www.youtube.com/watch?v=DReKGJtE3lU',
    title: 'William Basinski - The Disintegration Loops',
    caption: "L'entropia del nastro che si sbriciola testina dopo testina. Memoria e dissolvenza.",
    tag: 'art'
  },
  {
    url: 'https://www.youtube.com/watch?v=kYpyBvG0o58',
    title: 'Chihei Hatakeyama - Mirror',
    caption: 'Chitarre espanse in onde lente, riverbero continuo e luce filtrata dagli alberi.',
    tag: 'sound'
  },

  // --- SoundCloud Streams ---
  {
    url: 'https://soundcloud.com/chillhopdotcom/sleeping-cat-purr',
    title: 'Chillhop - Sleeping Cat (Furry Dreams)',
    caption: 'Lo-fi beats e vibrazioni feline per le sessioni notturne a schermo spento.',
    tag: 'sound'
  },
  {
    url: 'https://soundcloud.com/tycho/awake',
    title: 'Tycho - Awake',
    caption: 'Linee di chitarra scintillanti, synth analogici e calore solare in continuo movimento.',
    tag: 'art'
  },
  {
    url: 'https://soundcloud.com/erasedtapes/nils-frahm-says',
    title: 'Nils Frahm - Says',
    caption: "Sintetizzatore Roland Juno e arpeggiatori modulari che crescono dal sussurro all'estasi.",
    tag: 'sound'
  },
  {
    url: 'https://soundcloud.com/kiasmos/bent',
    title: 'Kiasmos - Bent',
    caption: 'Minimalismo ritmico islandese, pianoforte acustico e texture elettroniche intime.',
    tag: 'sound'
  },

  // --- Bandcamp Streams ---
  {
    url: 'https://cryochamber.bandcamp.com/track/dead-melodies-whispers-of-the-forgotten',
    title: 'Dead Melodies - Whispers of the Forgotten',
    caption: 'Dark ambient cinematografico e risonanze oscure da Cryo Chamber. Archeologia sonora.',
    tag: 'obscureweb'
  },
  {
    url: 'https://chiheihatakeyama.bandcamp.com/track/white-rain',
    title: 'Chihei Hatakeyama - White Rain',
    caption: "Pioggia bianca e chitarre processate in loop infiniti. Quiete per l'etere.",
    tag: 'sound'
  },
  {
    url: 'https://sundrenched.bandcamp.com/track/sun-faded',
    title: 'Sundrenched - Sun Faded',
    caption: 'Nastri a cassetta ritrovati, microtoni e frequenze fantasma sepolte negli anni.',
    tag: 'obscureweb'
  }
];

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

    // Pick random track
    const track = SEED_TRACKS[Math.floor(Math.random() * SEED_TRACKS.length)];

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

  // Helper to pick a track, preferably different from currentUrl
  function pickTrack(currentUrl) {
    const candidates = SEED_TRACKS.filter(t => t.url !== currentUrl);
    const pool = candidates.length > 0 ? candidates : SEED_TRACKS;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /**
   * Called on page load:
   * 1. Seeds any missing bot stations immediately.
   * 2. If all 3 exist but the oldest is >= 15 minutes old, rotates it to a fresh track!
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
        const track = pickTrack();
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

    // 2. If all 3 exist, check if the oldest is >= 15 minutes old
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

      const newTrack = pickTrack(oldest.station?.url);
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
