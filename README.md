# 📻 onepick — State over History

> **Uno stato, non un archivio.**  
> Una radio: ogni nodo trasmette un'unica frequenza musicale attiva.  
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
* Filtro rapido per genere (`#ambient`, `#electronic`, `#dj`, `#live`, `#lofi`, `#radio`, `#experimental`).

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

> **Regola unica: solo audio.** onepick è una radio, non un aggregatore di link: ogni trasmissione — bot o umana — deve essere una traccia riproducibile da uno dei provider sopra elencati. Il tag non è un tema ma il **genere** della frequenza: `#ambient`, `#electronic`, `#dj`, `#live`, `#lofi`, `#radio`, `#experimental`.

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
* **`@radio-obscura`** (FM 105.04 MHz) — Frequenze dimenticate, shortwave, tape loop e detriti analogici (`#experimental` • Pool: Internet Archive + YouTube + Bandcamp).
* **`@sound-transit`** (FM 95.17 MHz) — Flussi radio continui, drone e ambient profondo (`#radio` • Pool: SomaFM + Radio Browser + Audius).
* **`@ambient-zero`** (FM 96.88 MHz) — Sintesi modulare generativa e quiete presente (`#ambient` • Pool: YouTube + Internet Archive + Audius).
* **`@tunecamp-relay`** (FM 104.74 MHz) — Musica indipendente dal network federato (`#electronic` • Pool: TuneCamp Federation + Bandcamp + Audius).
* **`@retro-cyber`** (FM 93.42 MHz) — Demoscene MOD tracker, chiptune e keygen music (`#experimental` • Pool: Internet Archive + YouTube + Audius).
* **`@tape-echo`** (FM 97.87 MHz) — Sessioni dal vivo, take-away show e stanze registrate col riverbero dentro (`#live` • Pool: YouTube + Bandcamp + Internet Archive).
* **`@archive-echo`** (FM 107.08 MHz) — Trasmissioni radiofoniche storiche, 78rpm e voci dall'era delle onde corte (`#radio` • Pool: Internet Archive + Radio Browser + SomaFM).
* **`@mystic-whispers`** (FM 96.98 MHz) — Beat polverosi, loop jazzati e perle sommerse per le ore lunghe (`#lofi` • Pool: Bandcamp + YouTube + Audius).
* **`@neon-drift`** (FM 97.23 MHz) — Synthwave e sonorità retro-futuristiche (`#electronic` • Pool: Audius + YouTube + Mixcloud).
* **`@void-pulse`** (FM 94.66 MHz) — DJ set ipnotici, registrazioni da club e mix long-form (`#dj` • Pool: Mixcloud + YouTube + Radio Browser).

#### Provider Dinamici Supportati (100% Live, Zero Tracce Hardcodate)
Ogni provider viene interrogato **per genere**: l'affinità della stazione diventa la query, e le tracce tornano etichettate con il genere corrispondente.

1. **TuneCamp Federation**: Interroga in tempo reale tutte le istanze del network federato TuneCamp (SudoRecords, SubTerra Label, FDA Labs e nodi scoperti dinamicamente via gossip `/api/community/peers` e `/api/community/sites`) aggregando ed alternando a rotazione le release indipendenti.
2. **Internet Archive Search API**: Pool di query per ogni genere — netlabels ambient e drone, techno e IDM, dj mix, l'archivio dei concerti dal vivo `etree`, beat tape e jazz strumentale, oldtimeradio e 78rpm shellac, demoscene/chiptune/tracker/musique concrète — con ordinamento e pagina estratti a caso ad ogni refresh.
3. **Audius Web3**: Trending globale, per genere, underground e mensile su più nodi Discovery aperti; i generi Audius interrogati dipendono dall'affinità della stazione.
4. **YouTube Live Feeds**: Roster di **24 canali musicali** su tutti i generi — `#live` (KEXP, COLORS, NPR Music, Audiotree, La Blogothèque, Sofar, Mahogany), `#dj` (Cercle, Boiler Room, Dekmantel), `#electronic` (HateLab, Ninja Tune, Warp), `#lofi` (Lofi Girl, Chillhop, Stones Throw), `#radio` (NTS, The Lot Radio), `#ambient` (State Azure, mylarmelodies, Sonic State), `#experimental` (Hainbach, Look Mum No Computer, Andrew Huang). Ogni refresh campiona 4 canali e interlaccia i feed RSS XML pubblici, senza API key. I canali possono essere elencati con l'handle `@nome`: l'ID viene risolto al volo e messo in cache, e le voci non risolvibili vengono saltate.
5. **Bandcamp Network**: Risolve in tempo reale gli album audio riproducibili (`https://*.bandcamp.com/album/*`) su una finestra di 12 articoli di Bandcamp Daily, 6 dei quali visitati a caso, fino a 3 album ciascuno.
6. **Mixcloud Live Cloudcasts**: Tag musicali mappati sui generi FM (ambient/drone, techno/house/IDM, disco/balearic, jazz/soul/funk, lo-fi, krautrock/field recordings), 3 campionati ad ogni refresh alternando `popular` e `latest`.
7. **SomaFM Internet Radio Streams**: 46+ canali radiofonici indipendenti senza pubblicità con stream diretti 128kbps MP3 (Drone Zone, Groove Salad, Deep Space One, DEF CON Radio), classificati per genere dal loro stesso metadato.
8. **Radio Browser Live Stations**: Catalogo community di decine di migliaia di stazioni radio mondiali, interrogato con i tag corrispondenti al genere richiesto. Vengono tenuti solo gli stream `https` direttamente riproducibili in-page (niente HLS/playlist, niente mixed content).

> **Solo audio, sempre.** Nessuna traccia entra in onda se non è riproducibile in pagina: il registry scarta qualsiasi URL non-audio prima del broadcast, per i bot come per gli utenti.

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
     npm run bot:check   # Audit sorgenti: canali YouTube e pick per stazione (non trasmette)
     ```
   * `npm run bot:check` (`node bot.js --check-sources`) è il modo più rapido per verificare le sorgenti dopo aver aggiunto un canale: stampa quali handle YouTube si risolvono e cosa sceglierebbe adesso ogni stazione.

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

Per aggiungere sorgenti basta estendere le strutture in `seeder.js` (`YOUTUBE_CHANNELS`, `RADIO_BROWSER_TAGS`, `TUNECAMP_DEFAULT_INSTANCES`) o il pool `providers` di una stazione in `SEED_BOTS`, poi verificare con:
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
