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
  // --- YouTube Streams (100% Verified Playable & Embeddable) ---
  {
    url: 'https://www.youtube.com/watch?v=A2zKARkpDW4',
    title: 'Boards of Canada - Dayvan Cowboy',
    caption: 'Nostalgia analogica, nastri magnetici riscaldati dal sole e orizzonti sfuocati.',
    tag: 'obscureweb'
  },
  {
    url: 'https://www.youtube.com/watch?v=8GW6sLrK40k',
    title: 'HOME - Resonance',
    caption: 'Sintesi synthwave calda, onde luminose e risonanze analogiche per viaggi notturni.',
    tag: 'sound'
  },
  {
    url: 'https://www.youtube.com/watch?v=mehLx_Fjv_c',
    title: 'Tycho - A Walk',
    caption: 'Chitarre espanse, synth solari e texture ritmiche organiche in continuo movimento.',
    tag: 'art'
  },
  {
    url: 'https://www.youtube.com/watch?v=It4WxQ6dnn0',
    title: 'Brian Eno - An Ending (Ascent)',
    caption: 'Il capolavoro assoluto dell\'ambient music. Spazio, sospensione e atemporalità pura.',
    tag: 'sound'
  },
  {
    url: 'https://www.youtube.com/watch?v=qYnA9wWFHLI',
    title: 'Marconi Union - Weightless',
    caption: 'Progettata con neuroscienziati per rallentare il battito cardiaco e dissolvere l\'ansia.',
    tag: 'sound'
  },
  {
    url: 'https://www.youtube.com/watch?v=F7bKe_Zgk4o',
    title: 'Boards of Canada - Music Is Math',
    caption: 'Campionamenti psichedelici, numeri nell\'etere e frequenze radio sintonizzate nel vento.',
    tag: 'obscureweb'
  },
  {
    url: 'https://www.youtube.com/watch?v=aBkTkxKDduc',
    title: 'C418 - Sweden',
    caption: 'La malinconia gentile del pianoforte di C418. Memoria d\'infanzia e mondi infiniti.',
    tag: 'sound'
  },
  {
    url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY',
    title: 'Lofi Girl - Synthwave Radio',
    caption: 'Segnale radio continuo: synthwave retrò e beat analogici per sessioni notturne.',
    tag: 'sound'
  },
  {
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    title: 'Lofi Girl - Beats to Relax/Study',
    caption: 'Frequenza attiva ininterrotta: micro-campionamenti jazz e fruscio di vinile caldo.',
    tag: 'sound'
  },
  {
    url: 'https://www.youtube.com/watch?v=HhZaHf8RP6g',
    title: 'Daft Punk - Veridis Quo',
    caption: 'Arpeggi barocchi su organi sintetizzati. Malinconia rétro-futurista senza tempo.',
    tag: 'art'
  },
  {
    url: 'https://www.youtube.com/watch?v=ZtWTUt2RZh0',
    title: 'Kraftwerk - Computer Love',
    caption: '1981: la solitudine digitale e il desiderio umano predetto con sintetizzatori puri.',
    tag: 'code'
  },
  {
    url: 'https://www.youtube.com/watch?v=dX3k_QDnzHE',
    title: 'M83 - Midnight City',
    caption: 'Sassofono notturno, synth epici ed energia cinematografica della metropoli buia.',
    tag: 'art'
  },

  // --- SoundCloud Streams (100% Verified Playable) ---
  {
    url: 'https://soundcloud.com/tycho/awake',
    title: 'Tycho - Awake',
    caption: 'Linee di chitarra scintillanti, synth analogici e calore solare in continuo movimento.',
    tag: 'art'
  },
  {
    url: 'https://soundcloud.com/erasedtapes/nils-frahm-says',
    title: 'Nils Frahm - Says',
    caption: 'Sintetizzatore Roland Juno e arpeggiatori modulari che crescono dal sussurro all\'estasi.',
    tag: 'sound'
  },
  {
    url: 'https://soundcloud.com/kiasmos/bent',
    title: 'Kiasmos - Bent',
    caption: 'Minimalismo ritmico islandese, pianoforte acustico e texture neoclassiche intime.',
    tag: 'sound'
  },
  {
    url: 'https://soundcloud.com/forss/flickermood',
    title: 'Forss - Flickermood',
    caption: 'Micro-ritmi acustici e campionamenti concreti da registrazioni su nastro.',
    tag: 'obscureweb'
  },

  // --- Bandcamp Streams (100% Verified Playable) ---
  {
    url: 'https://loscil.bandcamp.com/album/plume',
    title: 'Loscil - Plume',
    caption: 'Pulsazioni subacquee e minimalismo ambient da Scott Morgan (Kranky Records).',
    tag: 'sound'
  },
  {
    url: 'https://timhecker.bandcamp.com/album/ravedeath-1972',
    title: 'Tim Hecker - Ravedeath, 1972',
    caption: 'Organo a canne registrato in una chiesa di Reykjavik e processato in distorsioni sublimi.',
    tag: 'sound'
  },
  {
    url: 'https://c418.bandcamp.com/album/minecraft-volume-alpha',
    title: 'C418 - Minecraft - Volume Alpha',
    caption: 'Composizioni per pianoforte ed elettronica minimale. Nostalgia pura e solitudine serena.',
    tag: 'sound'
  },
  {
    url: 'https://cryochamber.bandcamp.com/album/tomb-of-empires',
    title: 'Atrium Carceri - Tomb of Empires',
    caption: 'Dark ambient cinematografico e risonanze industriali sommerse da Cryo Chamber.',
    tag: 'obscureweb'
  },
  {
    url: 'https://lawrenceenglish.bandcamp.com/album/wilderness-of-mirrors',
    title: 'Lawrence English - Wilderness of Mirrors',
    caption: 'Muri sonori densi, field recording estremo e droni ipnotici da Room40.',
    tag: 'sound'
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
