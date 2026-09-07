# Graph Report - onepick  (2026-09-07)

## Corpus Check
- 7 files · ~26,172 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 406 nodes · 947 edges · 20 communities (13 shown, 7 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 106 edges (avg confidence: 0.53)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8dbe51ed`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_app.js|app.js]]
- [[_COMMUNITY_zen.min.js|zen.min.js]]
- [[_COMMUNITY_t|t]]
- [[_COMMUNITY_bot.js|bot.js]]
- [[_COMMUNITY_✦ Caratteristiche Principali|✦ Caratteristiche Principali]]
- [[_COMMUNITY_seeder.js|seeder.js]]
- [[_COMMUNITY_BaseProvider|BaseProvider]]
- [[_COMMUNITY_package.json|package.json]]
- [[_COMMUNITY_togglePowerRadio|togglePowerRadio]]
- [[_COMMUNITY_ProviderRegistry|ProviderRegistry]]
- [[_COMMUNITY_setupAuthUI|setupAuthUI]]
- [[_COMMUNITY_hasSentNod|hasSentNod]]
- [[_COMMUNITY_AudiusProvider|AudiusProvider]]
- [[_COMMUNITY_MixcloudProvider|MixcloudProvider]]
- [[_COMMUNITY_TuneCampProvider|TuneCampProvider]]
- [[_COMMUNITY_ArchiveOrgProvider|ArchiveOrgProvider]]
- [[_COMMUNITY_initTheme|initTheme]]
- [[_COMMUNITY_BandcampDailyProvider|BandcampDailyProvider]]
- [[_COMMUNITY_playJammingStatic|playJammingStatic]]

## God Nodes (most connected - your core abstractions)
1. `t()` - 37 edges
2. `t` - 37 edges
3. `o()` - 32 edges
4. `A()` - 24 edges
5. `e()` - 23 edges
6. `f()` - 22 edges
7. `l()` - 22 edges
8. `showToast()` - 21 edges
9. `g()` - 21 edges
10. `initApp()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `playTuningStatic()` --indirect_call--> `e()`  [INFERRED]
  app.js → zen.min.js
- `playJammingStatic()` --indirect_call--> `e()`  [INFERRED]
  app.js → zen.min.js
- `resolveAudiusTrackId()` --indirect_call--> `e()`  [INFERRED]
  app.js → zen.min.js
- `resolveTuneCampMetadata()` --indirect_call--> `e()`  [INFERRED]
  app.js → zen.min.js
- `initTransmitterForm()` --indirect_call--> `e()`  [INFERRED]
  app.js → zen.min.js

## Import Cycles
- None detected.

## Communities (20 total, 7 thin omitted)

### Community 0 - "app.js"
Cohesion: 0.01
Nodes (144): audiusTrackCache, authAlert, authCancelBtn, authControls, authForm, authModal, authorBadge, authorSigilDisplay (+136 more)

### Community 1 - "zen.min.js"
Cohesion: 0.12
Nodes (42): _(), A(), B(), b62Decode(), b62Encode(), c(), compactPoint(), concat() (+34 more)

### Community 2 - "t"
Cohesion: 0.07
Nodes (81): checkFrictionStatus(), checkInitialPeerParam(), closeTutorialModal(), detectMedia(), escapeHtml(), extractCleanMediaUrl(), extractDomain(), formatTimeAgo() (+73 more)

### Community 3 - "bot.js"
Cohesion: 0.26
Nodes (14): args, broadcastOne(), getNextTrack(), intervalArgIndex, isOnce, isSeedAll, logBotIdentities(), main() (+6 more)

### Community 4 - "✦ Caratteristiche Principali"
Cohesion: 0.13
Nodes (14): ✦ Architettura Tecnica, 🤖 Autopopolamento Autonomo & Background Bot (Timer 5 min), ✦ Autore & Licenza, ✦ Avvio Locale & Sviluppo, 🌐 Bilinguismo Completo (IT / EN), ✦ Caratteristiche Principali, Derivazione Crittografica Deterministica, ✦ Filosofia (+6 more)

### Community 5 - "seeder.js"
Cohesion: 0.15
Nodes (14): ARCHIVEORG_FALLBACK_TRACKS, AUDIUS_FALLBACK_TRACKS, BANDCAMP_FALLBACK_TRACKS, botPairsCache, MIXCLOUD_FALLBACK_TRACKS, rotateBotStation(), SEED_BOTS, SEED_TRACKS (+6 more)

### Community 7 - "package.json"
Cohesion: 0.17
Nodes (11): author, description, keywords, license, name, scripts, bot, bot:once (+3 more)

### Community 8 - "togglePowerRadio"
Cohesion: 0.67
Nodes (3): renderStationMedia(), resolveAudiusTrackId(), resolveTuneCampMetadata()

### Community 9 - "ProviderRegistry"
Cohesion: 0.22
Nodes (3): BaseProvider, fetchLiveTuneCampTracks(), SomaFMProvider

### Community 10 - "setupAuthUI"
Cohesion: 0.67
Nodes (3): derivePair(), setupAuthUI(), zen

### Community 11 - "hasSentNod"
Cohesion: 0.67
Nodes (3): getSentNods(), hasSentNod(), recordSentNod()

### Community 14 - "MixcloudProvider"
Cohesion: 0.20
Nodes (4): BandcampProvider, fetchWithCORSProxy(), MixcloudProvider, YouTubeFeedProvider

## Knowledge Gaps
- **180 isolated node(s):** `stationsMap`, `mutedStations`, `stationReportsMap`, `jammedOverrides`, `powerToggleBtn` (+175 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `r()` connect `zen.min.js` to `app.js`, `bot.js`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `t` connect `zen.min.js` to `setupAuthUI`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `ProviderRegistry` connect `BaseProvider` to `bot.js`, `seeder.js`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `t` (e.g. with `f()` and `g()`) actually correct?**
  _`t` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `o()` (e.g. with `_()` and `A()`) actually correct?**
  _`o()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 10 inferred relationships involving `A()` (e.g. with `c()` and `d()`) actually correct?**
  _`A()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 17 inferred relationships involving `e()` (e.g. with `initTransmitterForm()` and `loginWithPair()`) actually correct?**
  _`e()` has 17 INFERRED edges - model-reasoned connections that need verification._