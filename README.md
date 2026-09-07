# 📻 onepick — State over History

> **Uno stato, non un archivio.**  
> Sostituisce la cronologia infinita e i profili-museo con un'unica frequenza culturale attiva.  
> Protocollo P2P decentralizzato su rete Zen.

Live demo: [https://onepick-gamma.vercel.app](https://onepick-gamma.vercel.app)  
Relay P2P: `delay.scobrudot.dev/zen`

---

## ✦ Filosofia

I social network tradizionali trasformano gli utenti in curatori di archivi passati e alimentano loop dopaminergici infiniti con metriche di vanità. **onepick** propone l'opposto:

1. **State over History**: Non esiste archivio pubblico. Ogni trasmissione sovrascrive permanentemente quella precedente: chi si sintonizza sul tuo nodo vede e ascolta solo ciò che ti ossessiona **ora**.
2. **Attrito Positivo (Positive Friction)**: Prima di poter trasmettere la tua frequenza devi ascoltare la rete. Lo slot si sblocca solo dopo aver salvato un pick nel tuo Cassetto Privato o inviato un cenno silenzioso.
3. **Cenno Silenzioso (~)**: Nessun like pubblico né contatore di vanità visibile agli altri. Un semplice cenno discreto e privato all'autore.
4. **Cassetto Privato Locale**: Il tuo archivio personale resta esclusivamente nel tuo browser (`localStorage`), con possibilità di esportazione in formato JSON o Markdown.

---

## ✦ Caratteristiche Principali

### 🎛️ Sintonizzatore Radio Analogico (88.00 – 108.00 MHz)
* Scala FM a scorrimento interattivo con lancetta rossa e tacche di frequenza.
* Sintonizzazione fine per singoli incrementi o a salto casuale (`[ a caso ⚄ ]`).
* Generatore di fruscio bianco e disturbi analogici via **Web Audio API** sintetizzati al cambio stazione.
* Filtro tematico rapido per tag (`#sound`, `#read`, `#obscureweb`, `#art`, `#code`).

### 🎵 Player Audio Multiformato Integrato
Riconoscimento e streaming diretto in-page per:
* **YouTube**: player integrato senza cookie di tracciamento (`youtube-nocookie.com`).
* **SoundCloud**: widget nativo con autoplay e tracciamento audio.
* **Bandcamp**: player embedded con palette adattiva chiaro/scuro.
* **TuneCamp / Subsonic Federation**: risoluzione dei metadati decentralizzati e streaming nativo HTML5.
* **Internet Archive (`archive.org`)**: player embedded per l'enorme archivio di registrazioni storiche 78rpm, netlabels aperte e trasmissioni audio.
* **Audius**: streaming decentralizzato Web3 via protocollo Audius con player compatto in-page.
* **Mixcloud**: streaming per DJ mix, sessioni ambient e programmi radiofonici.
* **Spotify**: widget per brani e playlist.
* **Stream diretti MP3 / Audio**: riproduzione continua con equalizzatore analogico animato.

> **Regola Tag `#sound`**: Se il nodo trasmette con affinità `#sound`, l'input accetta *esclusivamente* tracce riproducibili dai provider sopra elencati. Per gli altri tag culturali (`#read`, `#obscureweb`, `#art`, `#code`) il ricevitore è aperto a qualsiasi URL web valido.

### ⛶ Modalità Canvas (Focus View)
* Centra a pieno schermo unicamente il box sintonizzatore della radio, nascondendo header, sezione trasmettitore e footer.
* Sfondo zen minimalista a trama di punti discreta.
* Controlli di attivazione rapida:
  * Pulsante `[ ⛶ canvas ]` nell'header e nel sintonizzatore.
  * Barra flottante fissa `[ ✕ esci dal canvas (Esc) ]`.
  * Scorciatoie da tastiera: <kbd>Esc</kbd> per uscire, <kbd>C</kbd> per alternare la vista.

### 🤖 Autopopolamento Autonomo & Background Bot (Timer 5 min)
Per garantire che la radio non sia mai silenziosa ("cold start" al lancio), è integrato un motore di seeding con **10 trasmettitori deterministici** alimentati da un'architettura modulare a **Provider Dinamici** (`ProviderRegistry`).

Ogni stazione ha un **provider di firma** (quello che ne definisce il carattere) ma pesca da un **pool di più sorgenti** (`providers` in `SEED_BOTS`): la rotazione alterna tra reti diverse invece di ripetere sempre lo stesso feed.
* **`@radio-obscura`** (FM 105.04 MHz) — Frequenze dimenticate e registrazioni d'archivio (`#obscureweb` • Pool: Internet Archive + Open Web RSS + YouTube).
* **`@sound-transit`** (FM 95.17 MHz) — Flussi radio continui, drone, downtempo e ambient (`#sound` • Pool: SomaFM + Radio Browser + Audius).
* **`@ambient-zero`** (FM 96.88 MHz) — Sintesi modulare generativa e quiete presente (`#art` • Pool: YouTube Live Feeds + Open Web RSS + Internet Archive).
* **`@tunecamp-relay`** (FM 104.74 MHz) — Musica indipendente dal network federato (`#sound` • Pool: TuneCamp Federation + Bandcamp + Audius).
* **`@retro-cyber`** (FM 93.42 MHz) — Demoscene MOD tracker, chiptune e keygen music (`#code` • Pool: Internet Archive + YouTube + Open Web RSS).
* **`@tape-echo`** (FM 97.87 MHz) — Approfondimenti editoriali, recensioni e guide d'ascolto (`#read` • Pool: Bandcamp + Open Web RSS + Internet Archive).
* **`@archive-echo`** (FM 107.08 MHz) — Archivi radiofonici storici e letture liriche (`#read` • Pool: Internet Archive + Open Web RSS + YouTube).
* **`@mystic-whispers`** (FM 96.98 MHz) — Album indipendenti in evidenza e perle sommerse (`#sound` • Pool: Bandcamp + TuneCamp + Audius).
* **`@neon-drift`** (FM 97.23 MHz) — Synthwave e sonorità retro-futuristiche (`#sound` • Pool: Audius + YouTube + Mixcloud).
* **`@void-pulse`** (FM 94.66 MHz) — DJ set ipnotici, cloudcast long-form e soundscape ambient (`#sound` • Pool: Mixcloud + SomaFM + Radio Browser).

#### Provider Dinamici Supportati (100% Live, Zero Tracce Hardcodate)
1. **TuneCamp Federation**: Interroga in tempo reale tutte le istanze del network federato TuneCamp (SudoRecords, SubTerra Label, FDA Labs e nodi scoperti dinamicamente via gossip `/api/community/peers` e `/api/community/sites`) aggregando ed alternando a rotazione le release indipendenti.
2. **Internet Archive Search API**: Pool di query multiple per ogni tag (`#read`, `#sound`, `#obscureweb`, `#code`, `#art`) — LibriVox, poesia, radiodrammi, shortwave, numbers station, demoscene, chiptune, SID, musique concrète, netlabels, 78rpm — con ordinamento e pagina estratti a caso ad ogni refresh.
3. **Audius Web3**: Combina trending globale, trending per genere (16 generi: ambient, techno, house, drum & bass, experimental, lo-fi, jazz…), underground e classifica mensile, ruotando su più nodi Discovery aperti.
4. **YouTube Live Feeds**: Roster di **44 canali** su tutti i tag (live session e label per `#sound`: Boiler Room, COLORS, NPR Music, Audiotree, La Blogothèque, Ninja Tune, Warp, Stones Throw, Dekmantel, The Lot Radio…; sintesi e arte per `#art`: State Azure, Hainbach, Look Mum No Computer, mylarmelodies, Tate, MoMA; `#code`: Computerphile, The Coding Train, Sebastian Lague, suckerpinch; `#read`: Nerdwriter1, Royal Institution, Gresham College, Aeon Video; `#obscureweb`: LEMMiNO, Fredrik Knudsen, Internet Historian, Ahoy). Ogni refresh campiona **4 canali** e interlaccia i feed RSS XML pubblici, senza alcuna API key. I canali possono essere elencati con l'handle `@nome`: l'ID viene risolto al volo e messo in cache, e le voci non risolvibili vengono semplicemente saltate.
5. **Bandcamp Network**: Risolve in tempo reale gli album audio riproducibili (`https://*.bandcamp.com/album/*`) per `#sound` — ora su una finestra di 12 articoli, 6 dei quali visitati a caso, fino a 3 album ciascuno — e le guide di ascolto/articoli per `#read`.
6. **Mixcloud Live Cloudcasts**: 22 tag musicali (ambient, dub, jazz, krautrock, IDM, library music, field recordings, balearic…) di cui 3 campionati ad ogni refresh, alternando selezioni `popular` e `latest`.
7. **SomaFM Internet Radio Streams**: 46+ canali radiofonici indipendenti senza pubblicità con stream diretti 128kbps MP3 (Drone Zone, Groove Salad, Deep Space One, DEF CON Radio) e riproduzione con visualizer analogico nativo.
8. **Radio Browser Live Stations**: Catalogo community di decine di migliaia di stazioni radio mondiali (22 tag: ambient, jazz, classical, dub, krautrock, trip hop, shoegaze…). Vengono tenuti solo gli stream `https` direttamente riproducibili in-page (niente HLS/playlist, niente mixed content).
9. **Open Web RSS Sources**: **26 feed** per i tag non-audio — `#read` (Aeon, Longreads, The Marginalian, Literary Hub, The Quietus, Open Culture, Public Domain Review, Internet Archive Blog), `#obscureweb` (Waxy, kottke.org, MetaFilter, Tedium, 404 Media, Low-tech Magazine), `#art` (Hyperallergic, Colossal, CreativeApplications, Rhizome, Artnet, Dezeen), `#code` (Hackaday, Lobsters, Hacker News, Phoronix, Rust Blog, Simon Willison). Parser RSS 2.0 + Atom, 3 feed campionati per refresh.

> Gli slot `#sound` restano sempre riproducibili: un link editoriale (RSS, articolo) non viene mai pubblicato su una frequenza `#sound`, nemmeno come fallback.

Il meccanismo opera in due modalità:
1. **Nel Browser (Serverless Zero-Config)** — *è la modalità principale: non serve alcun server o VPS, sono i visitatori a tenere vivo l'etere*:
   * All'ingresso in pagina il seeder aspetta che la mesh consegni le stazioni già in onda (grace period), poi confronta il roster dei bot con quanto trovato.
   * **Stazioni mancanti** → vengono seminate tutte (cold start dell'etere).
   * **Stazioni stantie** (ultimo pick più vecchio di 5 minuti) → ne vengono ruotate fino a 2 per visita, dalla più vecchia, con broadcast scaglionati.
   * La freschezza si legge dal timestamp della stazione **sulla mesh**, quindi due visitatori contemporanei non si sovrascrivono a vicenda: chi trova la stazione già aggiornata la salta. In più un lock `localStorage` evita doppioni tra le tab dello stesso browser.
   * Finché la tab resta aperta, un timer a 5 minuti ruota **la stazione più stantia** (non a turno cieco), e una tab tornata in primo piano recupera subito i giri persi (`visibilitychange`).
   * **Rotazione Manuale su Richiesta**: Pulsante dedicato `[ ⟳ Nuova Traccia ]` nella scheda radio o scorciatoia da tastiera <kbd>R</kbd> per richiedere istantaneamente un nuovo brano live dal provider e sintonizzarlo subito in onda.
   * Diagnostica da console: `window.onepickSeeder.surveyStations()` mostra quali stazioni risultano mancanti o stantie, `window.onepickSeeder.performRotation()` forza un giro.
2. **Script CLI Standalone (`bot.js`)** — *opzionale*, utile se vuoi che la radio ruoti anche a traffico zero:
   * Eseguibile 24/7 su VPS o terminale locale:
     ```bash
     npm run bot         # Rotazione continua ogni 5 minuti
     npm run bot:once    # Singola trasmissione ed uscita
     npm run bot:seed    # Popola immediatamente tutte e 10 le stazioni
     npm run bot:check   # Audit sorgenti: canali YouTube, feed RSS e pick per stazione (non trasmette)
     ```
   * `npm run bot:check` (`node bot.js --check-sources`) è il modo più rapido per verificare le sorgenti dopo aver aggiunto un canale o un feed: stampa quali handle YouTube si risolvono, quali feed rispondono e cosa sceglierebbe adesso ogni stazione.

### 🛡️ Moderazione Decentralizzata & Community Jamming
* **Silenziamento Locale**: nasconde istantaneamente qualsiasi frequenza dal tuo ricevitore personale.
* **Community Jamming**: segnalazioni crittografiche irradiate sulla rete Zen. Quando i nodi concordano su una segnalazione, l'etere simula un disturbo radio oscurando il contenuto preventivamente.

### 🌐 Bilinguismo Completo (IT / EN)
* Alternanza dinamica della lingua tramite il pulsante `[ EN ]` / `[ IT ]`.
* Guida interattiva e tutorial passo-passo in 5 step per i nuovi visitatori.

---

## ✦ Architettura Tecnica

```
onepick/
├── index.html       # Struttura semantica, modali e controlli radio
├── style.css        # Design system terminal-zen, canvas mode e temi light/dark
├── app.js           # Core engine, logica di sintesi audio, i18n e routing Zen P2P
├── seeder.js        # Modulo autonomo di seeding e catalogo tracce (YouTube, SC, BC)
├── bot.js           # CLI daemon headless per rotazione continua 5 min
├── zen.min.js       # Runtime client decentralizzato Zen / GunDB P2P
├── crypto.wasm      # Primitiva crittografica ad alte prestazioni
├── pen.wasm         # Firma e verifica crittografica WASM
└── package.json     # Script npm per bot e testing
```

### Derivazione Crittografica Deterministica
Le chiavi crittografiche delle stazioni sono derivate direttamente nel client tramite **Web Cryptography API**:
* Algoritmo: **PBKDF2 SHA-256** con 100.000 iterazioni.
* Salt univoco: `onepick:zen:station:<username>`.
* Nessuna credenziale o password inviata a server esterni: l'identità appartiene solo all'utente.

---

## ✦ Avvio Locale & Sviluppo

Non sono richieste dipendenze pesanti o bundler. Qualsiasi server HTTP statico è sufficiente:

```bash
# Avvio rapido con Python
python -m http.server 3000

# Oppure con Node
npx serve .
```

Apri `http://localhost:3000` nel browser.

Per avviare il bot di autopopolamento in locale:
```bash
npm run bot
```

Per aggiungere sorgenti basta estendere gli array in `seeder.js` (`YOUTUBE_CHANNELS`, `RSS_SOURCES`, `RADIO_BROWSER_TAGS`, `TUNECAMP_DEFAULT_INSTANCES`) o il pool `providers` di una stazione in `SEED_BOTS`, poi verificare con:
```bash
npm run bot:check
```

---

## ✦ Autore & Licenza

Un progetto creato da **[scobru](https://github.com/scobru)**  
Sito web: [https://scobrudot.dev](https://scobrudot.dev)  
Repository: [https://github.com/scobru/onepick](https://github.com/scobru/onepick)  
✦ *Endorsed by [TuneCamp](https://tunecamp.org) — Stessa filosofia: musica decentralizzata, etere aperto e ascolto non algoritmico.*

Rilasciato sotto licenza MIT.
