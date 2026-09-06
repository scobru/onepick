#!/usr/bin/env node

/**
 * onepick — Background Autopopulate Bot Service
 *
 * Runs autonomously to keep the onepick Zen P2P radio alive with 3 bot accounts
 * rotating and publishing curated YouTube, SoundCloud, Bandcamp, Internet Archive, Audius, Mixcloud, and TuneCamp tracks every 15 minutes.
 *
 * Usage:
 *   node bot.js                 # Runs 24/7 with 15 min timer
 *   node bot.js --once          # Seeds the 3 accounts once and exits
 *   node bot.js --interval 5    # Custom interval in minutes (e.g. 5 minutes)
 */

import ZEN from './zen.min.js';
import {
  SEED_BOTS,
  SEED_TRACKS,
  broadcastSeedSlot,
  deriveBotPair,
  getFrequencyForPub,
  verifyMediaUrlAvailable
} from './seeder.js';

const RELAY_URL = 'https://delay.scobrudot.dev/zen';

// Parse command line arguments
const args = process.argv.slice(2);
const isOnce = args.includes('--once');
const isSeedAll = args.includes('--seed-all');
const intervalArgIndex = args.indexOf('--interval');
const intervalMinutes = intervalArgIndex !== -1 && args[intervalArgIndex + 1]
  ? parseFloat(args[intervalArgIndex + 1])
  : 15;
const INTERVAL_MS = Math.max(1, intervalMinutes) * 60 * 1000;

console.log('='.repeat(64));
console.log('  onepick / Zen P2P Autonomous Radio Seeder Bot');
console.log('='.repeat(64));
console.log(`[+] Relay:    ${RELAY_URL}`);
console.log(`[+] Interval: ${intervalMinutes} minutes (${INTERVAL_MS / 1000}s)`);
console.log(`[+] Mode:     ${isOnce ? 'Single Run (--once)' : 'Continuous Background Rotation'}`);

// Initialize Zen instance in Node.js
const zen = new ZEN({
  peers: [RELAY_URL],
  localStorage: false,
  radisk: false
});

let rotationIdx = 0;
let usedTrackIndices = new Set();

async function getNextTrack() {
  if (usedTrackIndices.size >= SEED_TRACKS.length) {
    usedTrackIndices.clear();
  }
  const availableIndices = SEED_TRACKS
    .map((_, i) => i)
    .filter(i => !usedTrackIndices.has(i));

  while (availableIndices.length > 0) {
    const rIdx = Math.floor(Math.random() * availableIndices.length);
    const chosenIndex = availableIndices[rIdx];
    const track = SEED_TRACKS[chosenIndex];
    usedTrackIndices.add(chosenIndex);
    availableIndices.splice(rIdx, 1);

    const isAvailable = await verifyMediaUrlAvailable(track.url);
    if (isAvailable) {
      return track;
    } else {
      console.warn(`[!] Skipping dead/inaccessible seed track (404): "${track.title}" (${track.url})`);
    }
  }

  return SEED_TRACKS[0];
}

async function logBotIdentities() {
  console.log('\n[*] Deriving deterministic bot identities:');
  for (const bot of SEED_BOTS) {
    const pair = await deriveBotPair(bot.username, bot.passphrase, ZEN);
    const freq = getFrequencyForPub(pair.pub);
    console.log(`    📻 @${bot.username.padEnd(16)} -> FM ${freq.toFixed(2)} MHz  (pub: ${pair.pub.slice(0, 12)}...)`);
  }
  console.log('');
}

async function broadcastOne() {
  const bot = SEED_BOTS[rotationIdx % SEED_BOTS.length];
  rotationIdx++;
  const track = await getNextTrack();
  const timeStr = new Date().toLocaleTimeString();

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

async function seedAllBots() {
  console.log('[*] Seeding all 3 transmitter accounts immediately with verified tracks...');
  for (let i = 0; i < SEED_BOTS.length; i++) {
    const bot = SEED_BOTS[i];
    const track = await getNextTrack();
    const timeStr = new Date().toLocaleTimeString();
    console.log(`[${timeStr}] Seeding @${bot.username} -> ${track.title}`);
    try {
      const res = await broadcastSeedSlot(zen, bot, track, ZEN);
      console.log(`    ✓ FM ${res.freq.toFixed(2)} MHz online`);
      await new Promise(r => setTimeout(r, 1200));
    } catch (e) {
      console.error(`    ✕ Error: ${e.message}`);
    }
  }
  console.log('[*] All 3 stations are now on air on the Zen mesh!\n');
}

async function main() {
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
