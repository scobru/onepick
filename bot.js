#!/usr/bin/env node

/**
 * onepick — Background Autopopulate Bot Service
 *
 * Runs autonomously to keep the onepick Zen P2P radio alive with 3 bot accounts
 * rotating and publishing curated YouTube, SoundCloud, Bandcamp, Internet Archive, Audius, Mixcloud, and TuneCamp tracks every 5 minutes.
 *
 * Usage:
 *   node bot.js                 # Runs 24/7 with 5 min timer
 *   node bot.js --once          # Seeds the 3 accounts once and exits
 *   node bot.js --interval 5    # Custom interval in minutes (e.g. 5 minutes)
 *   node bot.js --check-sources # Audits every source (YouTube roster, RSS feeds, providers) and exits
 */

import ZEN from './zen.min.js';
import {
  SEED_BOTS,
  RSS_SOURCES,
  YOUTUBE_CHANNELS,
  broadcastSeedSlot,
  deriveBotPair,
  getFrequencyForPub,
  getTrackForBot,
  resolveYouTubeChannelId,
  verifyMediaUrlAvailable,
  providerRegistry
} from './seeder.js';

const RELAY_URL = 'https://delay.scobrudot.dev/zen';

// Parse command line arguments
const args = process.argv.slice(2);
const isOnce = args.includes('--once');
const isSeedAll = args.includes('--seed-all');
const isCheckSources = args.includes('--check-sources');
const intervalArgIndex = args.indexOf('--interval');
const intervalMinutes = intervalArgIndex !== -1 && args[intervalArgIndex + 1]
  ? parseFloat(args[intervalArgIndex + 1])
  : 5;
const INTERVAL_MS = Math.max(1, intervalMinutes) * 60 * 1000;

console.log('='.repeat(64));
console.log(`  onepick / Zen P2P Autonomous Radio Seeder Bot (${SEED_BOTS.length} Channels)`);
console.log('='.repeat(64));
console.log(`[+] Relay:     ${RELAY_URL}`);
console.log(`[+] Interval:  ${intervalMinutes} minutes (${INTERVAL_MS / 1000}s)`);
console.log(`[+] Mode:      ${isOnce ? 'Single Run (--once)' : 'Continuous Background Rotation'}`);
console.log(`[+] Providers: ${providerRegistry.listProviders().map(p => p.id).join(', ')}`);

// Initialize Zen instance in Node.js
const zen = new ZEN({
  peers: [RELAY_URL],
  localStorage: false,
  radisk: false
});

let rotationIdx = 0;

async function getNextTrack(bot) {
  let track = await getTrackForBot(bot);

  if (track && track.url) {
    const isAvailable = await verifyMediaUrlAvailable(track.url);
    if (isAvailable) {
      return track;
    } else {
      console.warn(`[!] Skipping dead/inaccessible track (404): "${track.title}" (${track.url})`);
      track = await getTrackForBot(bot, track.url);
    }
  }

  return track || (await getTrackForBot(bot));
}

async function logBotIdentities() {
  console.log('\n[*] Deriving deterministic bot identities:');
  for (const bot of SEED_BOTS) {
    const pair = await deriveBotPair(bot.username, bot.passphrase, ZEN);
    const freq = getFrequencyForPub(pair.pub);
    const providerStr = bot.provider ? ` [provider: ${bot.provider}]` : '';
    console.log(`    📻 @${bot.username.padEnd(16)} -> FM ${freq.toFixed(2)} MHz #${bot.tag}${providerStr}  (pub: ${pair.pub.slice(0, 10)}...)`);
  }
  console.log('');
}

async function broadcastOne() {
  const bot = SEED_BOTS[rotationIdx % SEED_BOTS.length];
  rotationIdx++;
  const track = await getNextTrack(bot);
  const timeStr = new Date().toLocaleTimeString();

  if (!track || !track.url) {
    console.warn(`[${timeStr}] [SKIP] Nessuna traccia dinamica disponibile per @${bot.username}`);
    return;
  }

  console.log(`[${timeStr}] [TRANSMITTING] @${bot.username} broadcasting...`);
  console.log(`  - Title:   ${track.title}`);
  console.log(`  - URL:     ${track.url}`);
  console.log(`  - Tag:     #${track.tag}`);
  console.log(`  - Caption: "${track.caption}"`);

  try {
    const res = await broadcastSeedSlot(zen, bot, track, ZEN);
    if (res) {
      console.log(`[${timeStr}] [SUCCESS] FM ${res.freq.toFixed(2)} MHz in onda su Zen mesh!\n`);
    } else {
      console.warn(`[${timeStr}] [WARNING] Broadcast ack timeout (published locally to peer buffer)\n`);
    }
  } catch (err) {
    console.error(`[${timeStr}] [ERROR] Failed broadcasting slot:`, err.message);
  }
}

/**
 * Runs `fn` over `items` with a small concurrency cap, preserving input order.
 */
async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = new Array(Math.min(limit, items.length)).fill(null).map(async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

/**
 * Audits every configured source: which YouTube channels resolve, which RSS
 * feeds answer, and what each station would pick right now.
 * Handy after adding entries to the rosters — nothing is broadcast.
 */
async function checkSources() {
  let okCount = 0;
  let failCount = 0;

  console.log(`\n[*] YouTube roster (${YOUTUBE_CHANNELS.length} channels)`);
  const ytProvider = providerRegistry.get('youtube');
  const ytRows = await mapWithConcurrency(YOUTUBE_CHANNELS, 6, async (channel) => {
    const channelId = await resolveYouTubeChannelId(channel);
    if (!channelId) return { channel, status: 'unresolved' };
    const tracks = await ytProvider.fetchChannelTracks({ ...channel, id: channelId });
    return { channel, status: tracks.length > 0 ? 'ok' : 'empty', count: tracks.length, channelId };
  });
  for (const row of ytRows) {
    const label = `${row.channel.name} (@${row.channel.handle || row.channel.id})`.padEnd(46);
    if (row.status === 'ok') {
      okCount++;
      console.log(`    ✓ ${label} #${row.channel.tag.padEnd(10)} ${row.count} videos  [${row.channelId}]`);
    } else {
      failCount++;
      console.log(`    ✕ ${label} #${row.channel.tag.padEnd(10)} ${row.status === 'unresolved' ? 'channel id not resolvable' : 'empty feed'}`);
    }
  }

  console.log(`\n[*] RSS sources (${RSS_SOURCES.length} feeds)`);
  const rssProvider = providerRegistry.get('rssfeeds');
  const rssRows = await mapWithConcurrency(RSS_SOURCES, 6, async (source) => {
    const items = await rssProvider.fetchSource(source);
    return { source, count: items.length };
  });
  for (const row of rssRows) {
    const label = `${row.source.name}`.padEnd(30);
    if (row.count > 0) {
      okCount++;
      console.log(`    ✓ ${label} #${row.source.tag.padEnd(10)} ${row.count} items   ${row.source.url}`);
    } else {
      failCount++;
      console.log(`    ✕ ${label} #${row.source.tag.padEnd(10)} no items  ${row.source.url}`);
    }
  }

  console.log(`\n[*] Station picks (${SEED_BOTS.length} transmitters)`);
  for (const bot of SEED_BOTS) {
    const track = await getTrackForBot(bot);
    const pool = (bot.providers || [bot.provider]).join(', ');
    if (track && track.url) {
      okCount++;
      console.log(`    ✓ @${bot.username.padEnd(16)} #${bot.tag.padEnd(10)} [${pool}]`);
      console.log(`        ${track.title}`);
      console.log(`        ${track.url}`);
    } else {
      failCount++;
      console.log(`    ✕ @${bot.username.padEnd(16)} #${bot.tag.padEnd(10)} no track available  [${pool}]`);
    }
  }

  console.log(`\n[+] Sources reachable: ${okCount} · unreachable: ${failCount}\n`);
}

async function seedAllBots() {
  console.log(`[*] Seeding all ${SEED_BOTS.length} transmitter accounts immediately with verified tracks...`);
  for (let i = 0; i < SEED_BOTS.length; i++) {
    const bot = SEED_BOTS[i];
    const track = await getNextTrack(bot);
    const timeStr = new Date().toLocaleTimeString();
    if (!track || !track.url) {
      console.warn(`[${timeStr}] ✕ Nessuna traccia dinamica per @${bot.username}, salto.`);
      continue;
    }
    console.log(`[${timeStr}] Seeding @${bot.username} -> ${track.title}`);
    try {
      const res = await broadcastSeedSlot(zen, bot, track, ZEN);
      console.log(`    ✓ FM ${res.freq.toFixed(2)} MHz online`);
      await new Promise(r => setTimeout(r, 1200));
    } catch (e) {
      console.error(`    ✕ Error: ${e.message}`);
    }
  }
  console.log(`[*] All ${SEED_BOTS.length} stations are now on air on the Zen mesh!\n`);
}

async function main() {
  if (isCheckSources) {
    await checkSources();
    process.exit(0);
  }

  await logBotIdentities();

  // Wait 1.5s for WebSocket connection handshake
  await new Promise(r => setTimeout(r, 1500));

  if (isOnce) {
    if (isSeedAll) {
      await seedAllBots();
    } else {
      await broadcastOne();
    }
    console.log('[+] Done. Exiting.');
    process.exit(0);
  }

  // Initial populate: seed all 3 stations so the ether is full right away
  await seedAllBots();

  console.log(`[+] Background rotation active: next station in ${intervalMinutes} minutes.`);
  console.log('[+] Press Ctrl+C to terminate the bot.\n');

  setInterval(async () => {
    await broadcastOne();
    console.log(`[+] Next rotation in ${intervalMinutes} minutes...\n`);
  }, INTERVAL_MS);
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
