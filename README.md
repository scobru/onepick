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

### 🤖 Autopopolamento Autonomo & Background Bot (Timer 15 min)
Per garantire che la radio non sia mai silenziosa ("cold start" al lancio), è integrato un motore di seeding con **10 trasmettitori deterministici** alimentati da un'architettura modulare a **Provider Dinamici** (`ProviderRegistry`):
* **`@radio-obscura`** (FM 105.04 MHz) — Frequenze dimenticate e registrazioni d'archivio (`#obscureweb` • Provider: Internet Archive).
* **`@sound-transit`** (FM 95.17 MHz) — Flussi radio continui, drone, downtempo e ambient (`#sound` • Provider: SomaFM Internet Radio).
* **`@ambient-zero`** (FM 96.88 MHz) — Sintesi modulare generativa e quiete presente (`#art` • Provider: YouTube Live Feeds).
* **`@tunecamp-relay`** (FM 104.74 MHz) — Musica indipendente dal network federato (`#sound` • Provider: TuneCamp Federation).
* **`@retro-cyber`** (FM 93.42 MHz) — Demoscene MOD tracker, chiptune e keygen music (`#code` • Provider: Internet Archive).
* **`@tape-echo`** (FM 97.87 MHz) — Approfondimenti editoriali, recensioni e guide d'ascolto (`#read` • Provider: Bandcamp Network).
* **`@archive-echo`** (FM 107.08 MHz) — Archivi radiofonici storici e letture liriche (`#read` • Provider: Internet Archive).
* **`@mystic-whispers`** (FM 96.98 MHz) — Album indipendenti in evidenza e perle sommerse (`#sound` • Provider: Bandcamp Network).
* **`@neon-drift`** (FM 97.23 MHz) — Synthwave e sonorità retro-futuristiche (`#sound` • Provider: Audius Web3).
* **`@void-pulse`** (FM 94.66 MHz) — DJ set ipnotici, cloudcast long-form e soundscape ambient (`#sound` • Provider: Mixcloud Live Cloudcasts).

#### Provider Dinamici Supportati
1. **TuneCamp Federation**: Interroga in tempo reale le release dell'istanza federata (`/api/releases`) con fallback locale.
2. **Internet Archive Search API**: Ricerca e seleziona tracce audio, nastri storici e demoscene tracker in base al tag (`#read`, `#sound`, `#obscureweb`, `#code`).
3. **Audius Web3**: Recupera i flussi musicali trending ed elettronici direttamente dai nodi aperti Audius Discovery.
4. **YouTube Live Feeds**: Interroga i feed RSS XML aperti di canali iconici (State Azure per sintesi modulare, Lofi Girl, Cercle per live set panoramici, KEXP) senza alcuna API key.
5. **Bandcamp Network**: Risolve in tempo reale gli album audio riproducibili (`https://*.bandcamp.com/album/*`) per `#sound` e le guide di ascolto/articoli per `#read`.
6. **Mixcloud Live Cloudcasts**: Interroga in tempo reale le selezioni popolari di DJ set e cloudcast long-form (ambient, chillout, downtempo, techno) con widget player dedicato.
7. **SomaFM Internet Radio Streams**: 46+ canali radiofonici indipendenti senza pubblicità con stream diretti 128kbps MP3 (Drone Zone, Groove Salad, Deep Space One, DEF CON Radio) e riproduzione con visualizer analogico nativo.
8. **Curated Ether**: Pool unificato di riserva per operatività offline resiliente.

Il meccanismo opera in due modalità:
1. **Nel Browser (Serverless Zero-Config)**:
   * All'apertura della pagina, controlla se l'etere è vuoto o se l'ultima stazione ha più di 15 minuti.
   * In caso positivo, irradia automaticamente un nuovo brano interrogando il provider della stazione.
   * Un timer a 15 minuti mantiene viva la rotazione durante la sessione (con lock `localStorage` contro duplicati tra tab).
2. **Script CLI Standalone (`bot.js`)**:
   * Eseguibile 24/7 su VPS o terminale locale:
     ```bash
     npm run bot         # Rotazione continua ogni 15 minuti
     npm run bot:once    # Singola trasmissione ed uscita
     npm run bot:seed    # Popola immediatamente tutte e 10 le stazioni
     ```

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
├── bot.js           # CLI daemon headless per rotazione continua 15 min
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

---

## ✦ Autore & Licenza

Un progetto creato da **[scobru](https://github.com/scobru)**  
Sito web: [https://scobrudot.dev](https://scobrudot.dev)  
Repository: [https://github.com/scobru/onepick](https://github.com/scobru/onepick)  
✦ *Endorsed by [TuneCamp](https://tunecamp.org) — Stessa filosofia: musica decentralizzata, etere aperto e ascolto non algoritmico.*

Rilasciato sotto licenza MIT.
