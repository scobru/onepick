import ZEN from './zen.min.js';
import { startAutonomousSeeder } from './seeder.js';

// --- Configuration & Constants ---
const RELAY_URL = 'https://delay.scobrudot.dev/zen';
const SALT_PREFIX = 'onepick:zen:station:';
const FREQ_MIN = 88.0;
const FREQ_MAX = 108.0;

// No mock entries: only live Zen P2P peers from the relay.

// --- App State ---
let zen = null;
let currentPair = null;
let currentUsername = null;
let stationsMap = new Map(); // pub -> station object
let activeStationPub = null;
let currentTagFilter = 'all';
let frictionUnlocked = false;
let myNodsCount = 0;
let isRadioOn = false;
let audioCtx = null;
let isCanvasMode = false;
let mutedStations = new Set();
let stationReportsMap = new Map(); // pub -> Map(reporterId -> report)
let jammedOverrides = new Set(); // set of pub where user dismissed warning
let currentLang = localStorage.getItem('onepick_lang') || (navigator.language && navigator.language.startsWith('it') ? 'it' : 'en');
let currentTutorialStep = 1;
const TOTAL_TUTORIAL_STEPS = 5;

// --- DOM References ---
const powerToggleBtn = document.getElementById('power-toggle');
const powerText = document.getElementById('power-text');
const powerIcon = document.getElementById('power-icon');
const canvasToggleBtn = document.getElementById('canvas-toggle');
const canvasBtnText = document.getElementById('canvas-btn-text');
const radioCanvasQuickBtn = document.getElementById('radio-canvas-quick-btn');
const canvasExitBar = document.getElementById('canvas-exit-bar');
const exitCanvasBtn = document.getElementById('exit-canvas-btn');
const radioEq = document.getElementById('radio-eq');
const mediaPlayerContainer = document.getElementById('media-player-container');

// Language & Tutorial references
const langToggleBtn = document.getElementById('lang-toggle');
const langText = document.getElementById('lang-text');
const tutorialTrigger = document.getElementById('tutorial-trigger');
const tutorialModal = document.getElementById('tutorial-modal');
const closeTutorialBtn = document.getElementById('close-tutorial-btn');
const tutorialStepBadge = document.getElementById('tutorial-step-badge');
const tutorialDots = document.getElementById('tutorial-dots');
const tutorialStepContent = document.getElementById('tutorial-step-content');
const tutorialDontShowCheckbox = document.getElementById('tutorial-dont-show-checkbox');
const tutorialPrevBtn = document.getElementById('tutorial-prev-btn');
const tutorialNextBtn = document.getElementById('tutorial-next-btn');
const tutorialNextText = document.getElementById('tutorial-next-text');

const themeToggleBtn = document.getElementById('theme-toggle');
const themeText = document.getElementById('theme-text');
const relayDot = document.getElementById('relay-dot');
const relayText = document.getElementById('relay-text');
const onlineStationsCount = document.getElementById('online-stations-count');
const toastEl = document.getElementById('toast');

// Tuner elements
const freqMhzEl = document.getElementById('freq-mhz');
const peerSigilDisplay = document.getElementById('peer-sigil-display');
const peerPubDisplay = document.getElementById('peer-pub-display');
const currentStationBadge = document.getElementById('current-station-badge');
const tunerScale = document.getElementById('tuner-scale');
const scaleTicks = document.getElementById('scale-ticks');
const tunerNeedle = document.getElementById('tuner-needle');
const tunePrevBtn = document.getElementById('tune-prev-btn');
const tuneRandomBtn = document.getElementById('tune-random-btn');
const tuneNextBtn = document.getElementById('tune-next-btn');
const tagChips = document.querySelectorAll('#tag-filter-container .tag-chip');

// Active Pick Card
const pickCard = document.getElementById('active-pick-card');
const pickSigilDisplay = document.getElementById('pick-sigil-display');
const pickOriginBadge = document.getElementById('pick-origin-badge');
const pickTagBadge = document.getElementById('pick-tag-badge');
const pickTimeBadge = document.getElementById('pick-time-badge');
const pickUrlLink = document.getElementById('pick-url-link');
const pickDomainPill = document.getElementById('pick-domain-pill');
const pickUrlText = document.getElementById('pick-url-text');
const pickCaptionText = document.getElementById('pick-caption-text');
const saveCassettoBtn = document.getElementById('save-cassetto-btn');
const silentNodBtn = document.getElementById('silent-nod-btn');
const shareFrequencyBtn = document.getElementById('share-frequency-btn');
const stationProfileBtn = document.getElementById('station-profile-btn');
const reportStationBtn = document.getElementById('report-station-btn');
const jammedSignalBanner = document.getElementById('jammed-signal-banner');
const overrideJammedBtn = document.getElementById('override-jammed-btn');

// Transmitter
const slotStatusBadge = document.getElementById('slot-status-badge');
const frictionBox = document.getElementById('friction-box');
const frictionIcon = document.getElementById('friction-icon');
const frictionText = document.getElementById('friction-text');
const transmitterPrompt = document.getElementById('transmitter-prompt');
const transmitterForm = document.getElementById('transmitter-form');
const pickUrlInput = document.getElementById('pick-url-input');
const pickCaptionInput = document.getElementById('pick-caption-input');
const charCounter = document.getElementById('char-counter');
const transmitBtn = document.getElementById('transmit-btn');
const nodsReceivedBadge = document.getElementById('nods-received-badge');
const pickPresetTagButtons = document.querySelectorAll('.radio-preset-tags .tag-chip');
const selectedPickTagInput = document.getElementById('selected-pick-tag');

// Auth
const loginTriggerBtn = document.getElementById('login-trigger');
const authControls = document.getElementById('auth-controls');
const authorSigilDisplay = document.getElementById('author-sigil-display');
const authorBadge = document.getElementById('author-badge');
const logoutBtn = document.getElementById('logout-btn');
const authModal = document.getElementById('auth-modal');
const closeAuthBtn = document.getElementById('close-auth-btn');
const authForm = document.getElementById('auth-form');
const authUser = document.getElementById('auth-username');
const authPass = document.getElementById('auth-password');
const authAlert = document.getElementById('auth-alert');
const quickGuestBtn = document.getElementById('quick-guest-btn');
const authCancelBtn = document.getElementById('auth-cancel-btn');

// Cassetto
const cassettoTrigger = document.getElementById('cassetto-trigger');
const cassettoCount = document.getElementById('cassetto-count');
const cassettoModal = document.getElementById('cassetto-modal');
const closeCassettoBtn = document.getElementById('close-cassetto-btn');
const cassettoItemsList = document.getElementById('cassetto-items-list');
const cassettoEmpty = document.getElementById('cassetto-empty');
const exportCassettoJsonBtn = document.getElementById('export-cassetto-json');
const exportCassettoMdBtn = document.getElementById('export-cassetto-md');
const clearCassettoBtn = document.getElementById('clear-cassetto-btn');
const toggleMutedStationsBtn = document.getElementById('toggle-muted-stations-btn');
const cassettoPicksTab = document.getElementById('cassetto-picks-tab');
const cassettoMutedTab = document.getElementById('cassetto-muted-tab');
const mutedStationsList = document.getElementById('muted-stations-list');
const mutedEmpty = document.getElementById('muted-empty');

// Station Profile Modal
const stationProfileModal = document.getElementById('station-profile-modal');
const closeProfileBtn = document.getElementById('close-profile-btn');
const profSigilLarge = document.getElementById('prof-sigil-large');
const profHeaderName = document.getElementById('prof-header-name');
const profHeaderFreq = document.getElementById('prof-header-freq');
const profFreqText = document.getElementById('prof-freq-text');
const profNameText = document.getElementById('prof-name-text');
const profPubkeyText = document.getElementById('prof-pubkey-text');
const profCopyPubBtn = document.getElementById('prof-copy-pub-btn');
const profTimeText = document.getElementById('prof-time-text');
const profPermalinkInput = document.getElementById('prof-permalink-input');
const profCopyLinkBtn = document.getElementById('prof-copy-link-btn');
const profMuteToggleBtn = document.getElementById('prof-mute-toggle-btn');
const profReportTriggerBtn = document.getElementById('prof-report-trigger-btn');

// Report Modal
const reportModal = document.getElementById('report-modal');
const closeReportBtn = document.getElementById('close-report-btn');
const executeLocalMuteBtn = document.getElementById('execute-local-mute-btn');
const executeCommunityReportBtn = document.getElementById('execute-community-report-btn');
const reportReasonSelect = document.getElementById('report-reason-select');

// --- Internationalization (i18n) & Translations ---

const TRANSLATIONS = {
  it: {
    // Header & Brand
    power_btn_on: 'ACCENDI RADIO',
    power_btn_off: 'SPEGNI RADIO',
    lang_btn_label: '[ EN ]',
    lang_btn_title: 'Passa a Inglese / Switch to English',
    nav_guide: '[ guida ? ]',
    nav_cassetto: '[ cassetto ',
    nav_login: '[ login ]',
    nav_logout: '[ logout ]',
    bio_text: 'Uno stato, non un archivio · singola frequenza attiva · attrito positivo · P2P su Zen',
    relay_connecting: 'in connessione',
    relay_online: 'online',
    online_stations_prefix: 'frequenze in onda: ',

    // Radio Tuner
    radio_section_title: '[ Sintonizzatore Radio ]',
    badge_tuned: 'sintonizzato',
    badge_own_frequency: 'la tua frequenza',
    peer_scanning: 'nodo: in scansione...',
    peer_label: 'nodo: ',
    tune_prev: '[ ◂ prec ]',
    tune_random: '[ a caso ⚄ ]',
    tune_next: '[ succ ▸ ]',
    tag_all: '[ tutti ]',
    pick_origin_default: 'TRASMETTITORE AUTENTICATO',
    pick_origin_own: 'LA TUA FREQUENZA',
    jammed_banner_text: '<strong>Segnale Disturbato:</strong> Questo nodo è stato segnalato dai peer della rete Zen come sospetto o fraudolento.',
    jammed_override_btn: '[ Sintonizza comunque ]',
    pick_loading: 'Caricamento frequenza...',
    pick_no_signal: '// Nessun segnale agganciato. Muovi la manopola della radio per sintonizzare una frequenza.',
    action_save_cassetto: '[ Salva nel Cassetto ]',
    action_saved_cassetto: '[ Salvato nel Cassetto ✓ ]',
    action_silent_nod: '[ Cenno Silenzioso ~ ]',
    action_nod_sent: '[ Cenno Inviato ~ ]',
    action_station_profile: '[ Scheda Stazione ☵ ]',
    action_copy_link: '[ Copia ]',

    // Transmitter
    transmitter_title: '[ Il Tuo Slot Unico ]',
    slot_inactive: 'inattivo',
    slot_active: 'in onda',
    friction_locked_text: '<strong>Attrito Positivo attivo:</strong> Per poter aggiornare il tuo pick della giornata, devi prima ascoltare la rete. Salva almeno un pick nel tuo cassetto o invia un cenno silenzioso a una frequenza.',
    friction_unlocked_text: '<strong>Attrito Positivo completato:</strong> Hai ascoltato la rete. Il tuo trasmettitore è sbloccato: irradia la tua frequenza.',
    transmitter_prompt: 'Autenticati con <strong>[ login ]</strong> per attivare la tua frequenza. Ogni trasmissione sovrascrive istantaneamente la precedente: chi visita il tuo nodo vede solo ciò che ti ossessiona ora.',
    label_pick_url: 'Un Link (URL web o musica: TuneCamp, Spotify, Bandcamp, SoundCloud, YouTube, MP3):',
    placeholder_pick_url: 'https://... (es. tunecamp, spotify, bandcamp, soundcloud, youtube o stream audio)',
    label_pick_caption: 'Una Riga (Cosa ti sta ossessionando adesso?):',
    placeholder_pick_caption: 'Una sola riflessione, sensazione o motivazione (rigidamente max 140 caratteri)...',
    char_counter_hint: 'Nessun commento nidificato, nessun thread infinito.',
    label_pick_affinity: 'Affinità minima (Tag):',
    transmit_btn_locked: '[ 🔒 Sblocca prima di trasmettere ]',
    transmit_btn_unlocked: '[ 🔓 Irradia Frequenza ]',
    transmit_btn_sending: '[ Irradiazione in corso... ]',
    state_warning_callout: '// <strong>State over History:</strong> questo invio cancellerà e sovrascriverà per sempre il tuo pick precedente. Nessun archivio pubblico verrà conservato.',

    // Cassetto Modal
    cassetto_title: '[ Il Tuo Cassetto Privato ]',
    cassetto_desc: 'Questo è il tuo archivio locale personale. I pick salvati rimangono solo in questo browser: nessun like pubblico, nessun contatore visibile agli altri.',
    btn_close: '[ chiudi ✕ ]',
    btn_export_json: '[ esporta JSON ]',
    btn_export_md: '[ esporta Markdown ]',
    btn_clear: '[ svuota ]',
    cassetto_empty: '// Il cassetto è vuoto.<br />Salva un pick ascoltato dalla radio per riporlo qui.',
    muted_desc: 'Frequenze che hai silenziato dal tuo ricevitore radio:',
    muted_empty: '// Nessuna stazione attualmente silenziata.',
    btn_restore: '[ ripristina ]',

    // Auth Modal
    auth_title: '[ Nodo Trasmettitore / Login ]',
    auth_desc: 'Le chiavi crittografiche del tuo nodo sono derivate deterministicamente (PBKDF2 SHA-256) sul tuo dispositivo. Nessun dato personale è inviato a server centrali.',
    auth_user_label: 'Nome Nodo / Alias:',
    auth_user_placeholder: 'es. scobru, radio-zero...',
    auth_pass_label: 'Passphrase Crittografica:',
    auth_pass_placeholder: 'Passphrase segreta...',
    btn_quick_guest: '[ genera chiave casuale ]',
    btn_cancel: '[ annulla ]',
    btn_activate_node: '[ attiva nodo ]',

    // Sigils
    sigil_own_title: 'Sigillo crittografico del tuo nodo',
    sigil_station_title: 'Sigillo crittografico della stazione',
    sigil_node_title: 'Sigillo crittografico del nodo',
    sigil_unique_title: 'Sigillo crittografico univoco della stazione',

    // Station Profile Modal
    profile_title: '[ Scheda Stazione · Live Frequency ]',
    profile_desc: 'Identità crittografica del nodo e frequenza attiva. <em>State over History:</em> non esiste archivio pubblico o profilo-museo, visualizzi solo l\'ossessione del momento.',
    profile_fm_freq: 'Frequenza FM:',
    profile_node_id: 'Identità Nodo:',
    profile_crypto_key: 'Chiave Crittografica:',
    profile_on_air_since: 'In onda da:',
    profile_permalink: 'Permalink Stazione:',
    btn_copy_pub: '[ copia chiave ]',
    btn_copy_link: '[ copia link ]',
    profile_btn_mute: '[ Silenzia questa Stazione ]',
    profile_btn_unmute: '[ Ripristina Stazione ]',
    profile_btn_report: '[ Segnala Link ⚠ ]',

    // Report Modal
    report_modal_title: '[ Segnala o Silenzia Frequenza ]',
    report_modal_desc: 'onepick è una rete P2P decentralizzata. La moderazione si basa su <strong>autonomia personale</strong> (silenziamento locale) e <strong>Community Jamming</strong> (segnalazione mesh condivisa).',
    report_local_title: '1. Silenziamento Locale (Solo per te)',
    report_local_desc: 'Il tuo ricevitore radio salterà automaticamente questa frequenza durante la rotazione. Puoi ripristinarla quando vuoi dal tuo Cassetto.',
    btn_execute_local_mute: '[ 🔇 Silenzia questa stazione sul mio browser ]',
    report_community_title: '2. Segnalazione alla Rete P2P (Community Jamming)',
    report_community_desc: 'Invia una segnalazione crittografica sulla rete Zen. Se una frequenza riceve segnalazioni concordanti, l\'etere simulerà un disturbo radio oscurando il contenuto preventivamente.',
    report_reason_label: 'Motivo della segnalazione:',
    opt_phishing: 'Phishing / Tentativo di truffa o furto credenziali',
    opt_malware: 'Malware / Download pericoloso o ingannevole',
    opt_spam: 'Spam / Bot o aggregatore automatico non umano',
    opt_abusive: 'Contenuto illegale o lesivo',
    btn_execute_community_report: '[ ⚠️ Irradia segnalazione sulla rete Zen ]',

    // Tutorial Modal
    tutorial_modal_title: '[ Guida Introduttiva · Come Funziona onepick ]',
    tutorial_dont_show: 'Non mostrare più all\'avvio',
    tutorial_btn_prev: '[ ◂ Precedente ]',
    tutorial_btn_next: '[ Successivo ▸ ]',
    tutorial_btn_finish: '[ Inizia ad ascoltare 🚀 ]',

    // Toasts & Messages
    toast_link_copied: 'Permalink stazione copiato negli appunti!',
    toast_pubkey_copied: 'Chiave crittografica copiata negli appunti!',
    toast_saved_cassetto: 'Pick salvato nel tuo cassetto privato!',
    toast_nod_sent: 'Cenno silenzioso inviato al trasmettitore!',
    toast_muted: 'Frequenza silenziata sul tuo browser.',
    toast_unmuted: 'Frequenza ripristinata nel ricevitore.',
    toast_community_reported: '⚠️ Segnalazione irradiata sulla rete Zen P2P!',
    toast_cassetto_cleared: 'Cassetto privato svuotato.',
    toast_jammed_override: 'Segnale sintonizzato a tuo rischio.',
    toast_logged_out: 'Disconnesso dal nodo.',
    toast_guest_ready: 'Identità casuale generata! Benvenuto.',
    toast_transmit_success: 'Frequenza irradiata con successo sulla rete Zen!',
    toast_node_active: 'Nodo attivo. Frequenza pronta.',
    nods_received_prefix: '~ ',
    nods_received_singular: 'cenno ricevuto',
    nods_received_plural: 'cenni ricevuti',
    nods_short_singular: 'cenno',
    nods_short_plural: 'cenni',

    // Canvas Mode
    canvas_btn: '[ ⛶ canvas ]',
    canvas_btn_exit: '[ ✕ esci ]',
    canvas_btn_title: 'Modalità Canvas: centra solo il box radio e nasconde il resto',
    canvas_exit: '[ ✕ esci dal canvas (Esc) ]',
    canvas_exit_title: 'Esci dalla modalità canvas (Esc)',
    canvas_label: 'canvas',
    toast_canvas_on: 'Modalità Canvas attiva (premi Esc per uscire)',
    toast_canvas_off: 'Modalità Canvas disattivata',

    // Footer
    footer_by: 'un progetto di',
    footer_website: 'sito'
  },
  en: {
    // Header & Brand
    power_btn_on: 'TURN ON RADIO',
    power_btn_off: 'TURN OFF RADIO',
    lang_btn_label: '[ IT ]',
    lang_btn_title: 'Switch to Italian / Passa a Italiano',
    nav_guide: '[ guide ? ]',
    nav_cassetto: '[ drawer ',
    nav_login: '[ login ]',
    nav_logout: '[ logout ]',
    bio_text: 'A state, not an archive · single active frequency · positive friction · P2P on Zen',
    relay_connecting: 'connecting',
    relay_online: 'online',
    online_stations_prefix: 'stations on air: ',

    // Radio Tuner
    radio_section_title: '[ Radio Tuner ]',
    badge_tuned: 'tuned',
    badge_own_frequency: 'your frequency',
    peer_scanning: 'node: scanning...',
    peer_label: 'node: ',
    tune_prev: '[ ◂ prev ]',
    tune_random: '[ random ⚄ ]',
    tune_next: '[ next ▸ ]',
    tag_all: '[ all ]',
    pick_origin_default: 'AUTHENTICATED TRANSMITTER',
    pick_origin_own: 'YOUR FREQUENCY',
    jammed_banner_text: '<strong>Jammed Signal:</strong> This node was reported by Zen network peers as suspicious or fraudulent.',
    jammed_override_btn: '[ Tune anyway ]',
    pick_loading: 'Loading frequency...',
    pick_no_signal: '// No signal locked. Adjust the radio tuner to pick up a frequency.',
    action_save_cassetto: '[ Save to Drawer ]',
    action_saved_cassetto: '[ Saved to Drawer ✓ ]',
    action_silent_nod: '[ Silent Nod ~ ]',
    action_nod_sent: '[ Nod Sent ~ ]',
    action_station_profile: '[ Station Specs ☵ ]',
    action_copy_link: '[ Copy ]',

    // Transmitter
    transmitter_title: '[ Your Single Slot ]',
    slot_inactive: 'inactive',
    slot_active: 'on air',
    friction_locked_text: '<strong>Positive Friction active:</strong> To update your pick of the day, you must first listen to the network. Save at least one pick to your drawer or send a silent nod to a station.',
    friction_unlocked_text: '<strong>Positive Friction completed:</strong> You listened to the network. Your transmitter is unlocked: broadcast your frequency.',
    transmitter_prompt: 'Authenticate via <strong>[ login ]</strong> to activate your frequency. Every transmission instantly overwrites the previous one: visitors see only what obsesses you now.',
    label_pick_url: 'A Link (Web URL or music: TuneCamp, Spotify, Bandcamp, SoundCloud, YouTube, MP3):',
    placeholder_pick_url: 'https://... (e.g. tunecamp, spotify, bandcamp, soundcloud, youtube or audio stream)',
    label_pick_caption: 'One Line (What is obsessing you right now?):',
    placeholder_pick_caption: 'A single reflection, sensation or motivation (strictly max 140 characters)...',
    char_counter_hint: 'No nested comments, no endless threads.',
    label_pick_affinity: 'Minimal affinity (Tag):',
    transmit_btn_locked: '[ 🔒 Unlock before broadcasting ]',
    transmit_btn_unlocked: '[ 🔓 Broadcast Frequency ]',
    transmit_btn_sending: '[ Broadcasting... ]',
    state_warning_callout: '// <strong>State over History:</strong> this submission will permanently erase and overwrite your previous pick. No public archive will be kept.',

    // Cassetto Modal
    cassetto_title: '[ Your Private Drawer ]',
    cassetto_desc: 'This is your personal local archive. Saved picks stay only in this browser: no public likes, no vanity counters visible to others.',
    btn_close: '[ close ✕ ]',
    btn_export_json: '[ export JSON ]',
    btn_export_md: '[ export Markdown ]',
    btn_clear: '[ clear ]',
    cassetto_empty: '// Your drawer is empty.<br />Save a pick heard on the radio to store it here.',
    muted_desc: 'Frequencies you have muted from your radio receiver:',
    muted_empty: '// No stations currently muted.',
    btn_restore: '[ restore ]',

    // Auth Modal
    auth_title: '[ Transmitter Node / Login ]',
    auth_desc: 'Cryptographic keys for your node are deterministically derived (PBKDF2 SHA-256) locally on your device. No personal data is sent to central servers.',
    auth_user_label: 'Node Name / Alias:',
    auth_user_placeholder: 'e.g. scobru, radio-zero...',
    auth_pass_label: 'Cryptographic Passphrase:',
    auth_pass_placeholder: 'Secret passphrase...',
    btn_quick_guest: '[ generate random key ]',
    btn_cancel: '[ cancel ]',
    btn_activate_node: '[ activate node ]',

    // Sigils
    sigil_own_title: 'Cryptographic sigil of your node',
    sigil_station_title: 'Cryptographic sigil of the station',
    sigil_node_title: 'Cryptographic sigil of the node',
    sigil_unique_title: 'Unique cryptographic sigil of the station',

    // Station Profile Modal
    profile_title: '[ Station Specs · Live Frequency ]',
    profile_desc: 'Node cryptographic identity and active frequency. <em>State over History:</em> there is no public archive or museum profile, you see only the current obsession.',
    profile_fm_freq: 'FM Frequency:',
    profile_node_id: 'Node Identity:',
    profile_crypto_key: 'Cryptographic Key:',
    profile_on_air_since: 'On air since:',
    profile_permalink: 'Station Permalink:',
    btn_copy_pub: '[ copy key ]',
    btn_copy_link: '[ copy link ]',
    profile_btn_mute: '[ Mute this Station ]',
    profile_btn_unmute: '[ Restore Station ]',
    profile_btn_report: '[ Report Link ⚠ ]',

    // Report Modal
    report_modal_title: '[ Report or Mute Frequency ]',
    report_modal_desc: 'onepick is a decentralized P2P network. Moderation is powered by <strong>personal autonomy</strong> (local mute) and <strong>Community Jamming</strong> (shared mesh report).',
    report_local_title: '1. Local Mute (Only for you)',
    report_local_desc: 'Your radio receiver will automatically skip this frequency during tuning. You can restore it anytime from your Drawer.',
    btn_execute_local_mute: '[ 🔇 Mute this station on my browser ]',
    report_community_title: '2. Mesh Network Report (Community Jamming)',
    report_community_desc: 'Radiate a cryptographic report on the Zen network. If a station accumulates concordant reports, the ether will simulate radio static and shield the content.',
    report_reason_label: 'Reason for report:',
    opt_phishing: 'Phishing / Attempted scam or credential theft',
    opt_malware: 'Malware / Dangerous or misleading download',
    opt_spam: 'Spam / Bot or automated non-human feed',
    opt_abusive: 'Illegal or abusive content',
    btn_execute_community_report: '[ ⚠️ Radiate report on Zen network ]',

    // Tutorial Modal
    tutorial_modal_title: '[ Introductory Guide · How onepick Works ]',
    tutorial_dont_show: 'Don\'t show again on startup',
    tutorial_btn_prev: '[ ◂ Previous ]',
    tutorial_btn_next: '[ Next ▸ ]',
    tutorial_btn_finish: '[ Start Tuning 🚀 ]',

    // Toasts & Messages
    toast_link_copied: 'Station frequency permalink copied to clipboard!',
    toast_pubkey_copied: 'Cryptographic key copied to clipboard!',
    toast_saved_cassetto: 'Pick saved to your private drawer!',
    toast_nod_sent: 'Silent nod sent to transmitter!',
    toast_muted: 'Frequency muted on your browser.',
    toast_unmuted: 'Frequency restored to receiver.',
    toast_community_reported: '⚠️ Report radiated on Zen P2P mesh network!',
    toast_cassetto_cleared: 'Private drawer cleared.',
    toast_jammed_override: 'Signal tuned at your own risk.',
    toast_logged_out: 'Disconnected from node.',
    toast_guest_ready: 'Random identity generated! Welcome.',
    toast_transmit_success: 'Frequency broadcast successfully to Zen network!',
    toast_node_active: 'Node active. Frequency ready.',
    nods_received_prefix: '~ ',
    nods_received_singular: 'nod received',
    nods_received_plural: 'nods received',
    nods_short_singular: 'nod',
    nods_short_plural: 'nods',

    // Canvas Mode
    canvas_btn: '[ ⛶ canvas ]',
    canvas_btn_exit: '[ ✕ exit ]',
    canvas_btn_title: 'Canvas Mode: center radio box only and hide everything else',
    canvas_exit: '[ ✕ exit canvas (Esc) ]',
    canvas_exit_title: 'Exit canvas mode (Esc)',
    canvas_label: 'canvas',
    toast_canvas_on: 'Canvas mode active (press Esc to exit)',
    toast_canvas_off: 'Canvas mode exited',

    // Footer
    footer_by: 'a project by',
    footer_website: 'website'
  }
};

const TUTORIAL_STEPS = [
  {
    step: 1,
    it: {
      badge: 'STEP 01 / 05',
      title: "Cos'è onepick: State over History",
      desc: "onepick è un ricevitore radio culturale decentralizzato. Sostituisce la cronologia infinita e i profili-museo dei social tradizionali con un'unica frequenza culturale attiva per ciascun nodo. Non c'è archivio pubblico né feed infinito: chi si sintonizza vede solo ciò che ti ossessiona ORA.",
      callout: "// Filosofia: Uno stato presente, non un archivio del passato."
    },
    en: {
      badge: 'STEP 01 / 05',
      title: "What is onepick: State over History",
      desc: "onepick is a decentralized cultural radio receiver. It replaces endless feeds and museum-like profiles with a single active frequency per node. Anyone tuning in sees only what obsesses and inspires you RIGHT NOW.",
      callout: "// Philosophy: Present state, not past history."
    }
  },
  {
    step: 2,
    it: {
      badge: 'STEP 02 / 05',
      title: "La Radio & L'Audio Integrato",
      desc: "Sintonizza le stazioni dei peer P2P ruotando la scala o con i tasti [ prec ], [ succ ] e [ a caso ]. Clicca su [ ACCENDI RADIO ] per sbloccare l'audio nel browser: la musica da TuneCamp, Spotify, Bandcamp, SoundCloud o YouTube partirà automaticamente in sottofondo con l'equalizzatore analogico.",
      callout: "// Sintonizzazione FM: 88.00 - 108.00 MHz · zero mock, solo peer P2P reali."
    },
    en: {
      badge: 'STEP 02 / 05',
      title: "The Radio & Integrated Audio",
      desc: "Tune into P2P peer stations using the FM scale or the [ prev ], [ next ] and [ random ] buttons. Click [ TURN ON RADIO ] to unlock browser audio: music from TuneCamp, Spotify, Bandcamp, SoundCloud or YouTube plays automatically with an analog equalizer.",
      callout: "// FM Tuning: 88.00 - 108.00 MHz · zero mocks, only live P2P peers."
    }
  },
  {
    step: 3,
    it: {
      badge: 'STEP 03 / 05',
      title: "Attrito Positivo (Positive Friction)",
      desc: "Per poter trasmettere devi prima ascoltare la rete: il trasmettitore si sblocca solo dopo aver salvato un pick nel tuo Cassetto Privato o aver inviato un Cenno Silenzioso (~) a una frequenza. Nessun like pubblico, nessun contatore visibile agli altri, nessuna vanità.",
      callout: "// Regola d'oro: Ascolta e rifletti prima di trasmettere."
    },
    en: {
      badge: 'STEP 03 / 05',
      title: "Positive Friction",
      desc: "To broadcast your frequency you must first listen to the network: your transmitter unlocks only after saving a pick to your Private Drawer or sending a Silent Nod (~) to a station. No public likes, no vanity metrics, no dopamine loops.",
      callout: "// Golden rule: Listen and absorb before broadcasting."
    }
  },
  {
    step: 4,
    it: {
      badge: 'STEP 04 / 05',
      title: "Il Tuo Slot Unico (1 Link, 1 Riga)",
      desc: "Accedi con [ login ] creando la tua identità crittografica locale. Hai a disposizione un solo slot: un link valido e una riflessione di massimo 140 caratteri. Ogni nuovo invio sovrascrive istantaneamente quello precedente per sempre.",
      callout: "// Trasparenza crittografica: Chiavi derivate localmente nel tuo browser con PBKDF2."
    },
    en: {
      badge: 'STEP 04 / 05',
      title: "Your Single Slot (1 Link, 1 Line)",
      desc: "Log in via [ login ] to generate your local cryptographic identity. You hold a single slot: a valid link and a single reflection capped at 140 characters. Every new transmission permanently overwrites the previous one forever.",
      callout: "// Cryptographic transparency: Deterministic local PBKDF2 key generation."
    }
  },
  {
    step: 5,
    it: {
      badge: 'STEP 05 / 05',
      title: "P2P Mesh & Moderazione Comunitaria",
      desc: "onepick opera direttamente su rete P2P Zen. Se trovi un link fraudolento o sospetto, puoi silenziarlo solo per te (Local Mute) o inviare una segnalazione (Community Jamming): i nodi segnalati verranno protetti con disturbo analogico preventivo.",
      callout: "// Autonomia decentralizzata: Sei sempre tu a scegliere il tuo etere."
    },
    en: {
      badge: 'STEP 05 / 05',
      title: "P2P Mesh & Community Jamming",
      desc: "onepick operates directly on the Zen P2P mesh. If you encounter a fraudulent or suspicious link, you can mute it locally (Local Mute) or radiate a Community Jamming report: flagged nodes will be shielded with analog static.",
      callout: "// Decentralized autonomy: You always choose what enters your receiver."
    }
  }
];

function t(key) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.it;
  return dict[key] !== undefined ? dict[key] : key;
}

function setLanguage(lang) {
  if (lang !== 'it' && lang !== 'en') lang = 'it';
  currentLang = lang;
  localStorage.setItem('onepick_lang', lang);
  document.documentElement.lang = lang;

  if (langText) {
    langText.textContent = lang === 'it' ? '[ EN ]' : '[ IT ]';
  }
  if (langToggleBtn) {
    langToggleBtn.title = t('lang_btn_title');
  }

  // Update all [data-i18n] elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val) {
      if (val.includes('<') && val.includes('>')) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    }
  });

  // Update all [data-i18n-title] elements
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const val = t(key);
    if (val) el.title = val;
  });

  // Update all [data-i18n-placeholder] elements
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = t(key);
    if (val) el.placeholder = val;
  });

  // Update power toggle button label
  if (powerText) {
    powerText.textContent = isRadioOn ? t('power_btn_off') : t('power_btn_on');
  }

  // Update canvas toggle button label
  if (canvasBtnText) {
    canvasBtnText.textContent = isCanvasMode ? t('canvas_btn_exit') : t('canvas_btn');
  }

  // Update cassetto badge
  updateCassettoBadge();

  // Update friction status
  updateFrictionUI();

  // Update online stations count
  updateStationsCounter();

  // Update relay status
  updateRelayStatus(isRelayConnected);

  // If station tuned, refresh dynamic badges
  if (activeStationPub) {
    const station = stationsMap.get(activeStationPub);
    if (station) {
      if (pickTimeBadge) pickTimeBadge.textContent = formatTimeAgo(station.ts);
      if (activeStationPub === (currentPair && currentPair.pub)) {
        if (pickOriginBadge) {
          const authorLabel = currentUsername || truncateKey(activeStationPub);
          const nodsText = myNodsCount > 0 ? ` · ~ ${myNodsCount} ${myNodsCount === 1 ? t('nods_short_singular') : t('nods_short_plural')}` : '';
          pickOriginBadge.textContent = `${t('pick_origin_own')} (${authorLabel})${nodsText}`;
        }
        if (currentStationBadge) {
          currentStationBadge.textContent = myNodsCount > 0 ? `${t('badge_own_frequency')} · ${myNodsCount} ${myNodsCount === 1 ? t('nods_short_singular') : t('nods_short_plural')}` : t('badge_own_frequency');
        }
      } else {
        if (currentStationBadge) currentStationBadge.textContent = t('slot_active');
      }
    }
  } else {
    renderEmptyRadioState();
  }

  // If tutorial is open, re-render step
  if (tutorialModal && !tutorialModal.classList.contains('hidden')) {
    renderTutorialStep(currentTutorialStep);
  }
}

// --- Tutorial & Onboarding Walkthrough ---

function renderTutorialStep(step) {
  if (step < 1) step = 1;
  if (step > TOTAL_TUTORIAL_STEPS) step = TOTAL_TUTORIAL_STEPS;
  currentTutorialStep = step;

  const data = TUTORIAL_STEPS[step - 1];
  const langData = data[currentLang] || data.it;

  if (tutorialStepBadge) {
    tutorialStepBadge.textContent = langData.badge;
  }

  if (tutorialDots) {
    const dots = tutorialDots.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      if (idx === step - 1) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  if (tutorialStepContent) {
    tutorialStepContent.innerHTML = `
      <h4 class="tutorial-step-title">${langData.title}</h4>
      <p class="tutorial-step-desc">${langData.desc}</p>
      <div class="tutorial-step-callout">${langData.callout}</div>
    `;
  }

  if (tutorialPrevBtn) {
    if (step === 1) {
      tutorialPrevBtn.classList.add('hidden');
    } else {
      tutorialPrevBtn.classList.remove('hidden');
    }
  }

  if (tutorialNextText) {
    if (step === TOTAL_TUTORIAL_STEPS) {
      tutorialNextText.textContent = t('tutorial_btn_finish');
    } else {
      tutorialNextText.textContent = t('tutorial_btn_next');
    }
  }
}

function openTutorialModal(step = 1) {
  renderTutorialStep(step);
  tutorialModal?.classList.remove('hidden');
}

function closeTutorialModal() {
  tutorialModal?.classList.add('hidden');
  if (tutorialDontShowCheckbox && tutorialDontShowCheckbox.checked) {
    localStorage.setItem('onepick_tutorial_seen', 'true');
  }
}

function nextTutorialStep() {
  if (currentTutorialStep < TOTAL_TUTORIAL_STEPS) {
    renderTutorialStep(currentTutorialStep + 1);
  } else {
    localStorage.setItem('onepick_tutorial_seen', 'true');
    closeTutorialModal();
    showToast(currentLang === 'it' ? 'Buon ascolto su onepick!' : 'Enjoy tuning into onepick!');
  }
}

function prevTutorialStep() {
  if (currentTutorialStep > 1) {
    renderTutorialStep(currentTutorialStep - 1);
  }
}

function setupLanguageAndTutorial() {
  langToggleBtn?.addEventListener('click', () => {
    const nextLang = currentLang === 'it' ? 'en' : 'it';
    setLanguage(nextLang);
    showToast(nextLang === 'en' ? 'Language switched to English' : 'Lingua impostata in Italiano');
  });

  tutorialTrigger?.addEventListener('click', () => {
    openTutorialModal(1);
  });

  closeTutorialBtn?.addEventListener('click', closeTutorialModal);
  tutorialPrevBtn?.addEventListener('click', prevTutorialStep);
  tutorialNextBtn?.addEventListener('click', nextTutorialStep);
}

// --- Helper Utilities ---

let isRelayConnected = false;

function showToast(message, duration = 3000) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, duration);
}

function truncateKey(pub) {
  if (!pub || pub.length < 12) return pub || '';
  return `~${pub.slice(0, 6)}...${pub.slice(-5)}`;
}

function extractDomain(urlString) {
  try {
    if (urlString.startsWith('spotify:')) return 'spotify';
    const url = new URL(urlString);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (host.includes('sudorecords')) return 'sudorecords · tunecamp';
    if (host.includes('tunecamp')) return 'tunecamp';
    if (host.includes('spotify.com')) return 'spotify';
    if (host.includes('bandcamp.com')) return 'bandcamp';
    if (host.includes('soundcloud.com')) return 'soundcloud';
    if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
    return host;
  } catch (e) {
    return 'link';
  }
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return currentLang === 'it' ? 'in onda' : 'on air';
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 2) return currentLang === 'it' ? 'adesso' : 'just now';
  if (minutes < 60) return currentLang === 'it' ? `in onda da ${minutes} min` : `on air for ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    if (currentLang === 'it') return `in onda da ${hours} ${hours === 1 ? 'ora' : 'ore'}`;
    return `on air for ${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  const days = Math.floor(hours / 24);
  if (currentLang === 'it') return `in onda da ${days} ${days === 1 ? 'giorno' : 'giorni'}`;
  return `on air for ${days} ${days === 1 ? 'day' : 'days'}`;
}

// --- Cryptographic Generative Identicon (Sigillo Radiofonico) ---

function hashString(str) {
  if (!str) return 0;
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function generateSigilSvg(pub, size = 22) {
  if (!pub) return '';
  const hash = hashString(pub);
  let rects = '';
  let activePixels = 0;

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 3; c++) {
      const bitIndex = r * 3 + c;
      const filled = ((hash >> bitIndex) & 1) === 1;
      if (filled) {
        rects += `<rect x="${c}" y="${r}" width="1" height="1" fill="currentColor" />`;
        if (c !== 2) {
          rects += `<rect x="${4 - c}" y="${r}" width="1" height="1" fill="currentColor" />`;
        }
        activePixels++;
      }
    }
  }

  // Ensure not completely blank
  if (activePixels === 0) {
    rects = `<rect x="2" y="2" width="1" height="1" fill="currentColor" /><rect x="1" y="1" width="1" height="1" fill="currentColor" /><rect x="3" y="1" width="1" height="1" fill="currentColor" /><rect x="1" y="3" width="1" height="1" fill="currentColor" /><rect x="3" y="3" width="1" height="1" fill="currentColor" />`;
  }

  return `<svg class="sigil-svg" viewBox="0 0 5 5" width="${size}" height="${size}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

// Compute deterministic frequency between 88.00 and 108.00 MHz for any public key (2,000 distinct channels)
function getFrequencyForPub(pub) {
  if (!pub) return 94.20;
  let hash = 0;
  for (let i = 0; i < pub.length; i++) {
    hash = (hash << 5) - hash + pub.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash);
  const steps = 2000; // 20.0 MHz range in 0.01 MHz increments
  const step = positive % steps;
  return Number((FREQ_MIN + step * 0.01).toFixed(2));
}

// --- Theme Management ---

function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const current = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(current, false);
}

function applyTheme(theme, save = true) {
  document.documentElement.setAttribute('data-theme', theme);
  if (save) {
    localStorage.setItem('theme', theme);
  }
  if (themeText) {
    themeText.textContent = theme === 'dark' ? '[ light ]' : '[ dark ]';
  }
}

themeToggleBtn?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark', true);
});

// --- Cryptographic Pair Derivation ---

async function derivePair(username, password) {
  const cleanUser = username.trim().toLowerCase();
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
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

  return await ZEN.pair(null, { seed });
}

// --- Positive Friction Management ---

function checkFrictionStatus() {
  const lastUnlock = localStorage.getItem('onepick_friction_unlocked_at');
  if (lastUnlock) {
    // Friction remains satisfied for current session / day
    const unlockedTs = parseInt(lastUnlock, 10);
    const dayMs = 24 * 60 * 60 * 1000;
    if (Date.now() - unlockedTs < dayMs) {
      frictionUnlocked = true;
    } else {
      frictionUnlocked = false;
      localStorage.removeItem('onepick_friction_unlocked_at');
    }
  } else {
    frictionUnlocked = false;
  }
  updateFrictionUI();
}

function satisfyPositiveFriction(reason = 'interaction') {
  frictionUnlocked = true;
  localStorage.setItem('onepick_friction_unlocked_at', Date.now().toString());
  updateFrictionUI();
  if (reason === 'save') {
    showToast('✓ Pick salvato nel cassetto. Attrito positivo superato: trasmettitore sbloccato!');
  } else if (reason === 'nod') {
    showToast('✓ Cenno silenzioso inviato. Attrito positivo superato: trasmettitore sbloccato!');
  }
}

function hasPeerStations() {
  const allStations = Array.from(stationsMap.keys());
  if (allStations.length === 0) return false;
  if (currentPair && allStations.length === 1 && allStations[0] === currentPair.pub) return false;
  return true;
}

function updateFrictionUI() {
  if (!frictionBox) return;

  if (!hasPeerStations()) {
    // Cold start: no other peers currently on the network
    frictionBox.className = 'friction-box unlocked';
    if (frictionIcon) frictionIcon.textContent = '🔓';
    if (frictionText) {
      frictionText.innerHTML = currentLang === 'it'
        ? '<strong>Rete libera:</strong> Nessun altro nodo è attualmente in onda sulla rete Zen. Sei la prima frequenza attiva! Lo slot è sbloccato per avviare la trasmissione.'
        : '<strong>Open network:</strong> No other node is currently on air on the Zen mesh. You are the first active frequency! Your slot is unlocked to start broadcasting.';
    }
    if (transmitBtn) {
      transmitBtn.disabled = false;
      transmitBtn.textContent = currentLang === 'it' ? '[ Trasmetti sul tuo Slot ]' : '[ Broadcast to your Slot ]';
      transmitBtn.title = currentLang === 'it' ? 'Pubblica il primo pick sulla rete' : 'Publish the first pick to the network';
    }
    return;
  }

  if (frictionUnlocked) {
    frictionBox.className = 'friction-box unlocked';
    if (frictionIcon) frictionIcon.textContent = '🔓';
    if (frictionText) {
      frictionText.innerHTML = t('friction_unlocked_text');
    }
    if (transmitBtn) {
      transmitBtn.disabled = false;
      transmitBtn.textContent = currentLang === 'it' ? '[ Trasmetti sul tuo Slot ]' : '[ Broadcast to your Slot ]';
      transmitBtn.title = currentLang === 'it' ? 'Pubblica o sovrascrivi il tuo slot attivo' : 'Publish or overwrite your active slot';
    }
  } else {
    frictionBox.className = 'friction-box locked';
    if (frictionIcon) frictionIcon.textContent = '🔒';
    if (frictionText) {
      frictionText.innerHTML = t('friction_locked_text');
    }
    if (transmitBtn) {
      transmitBtn.disabled = true;
      transmitBtn.textContent = t('transmit_btn_locked');
      transmitBtn.title = currentLang === 'it' ? 'Salva un pick nel cassetto o invia un cenno per sbloccare' : 'Save a pick to drawer or send a nod to unlock';
    }
  }
}

// --- Radio Tuner Scale & Navigation ---

function initTunerScale() {
  if (!scaleTicks) return;
  scaleTicks.innerHTML = '';
  const totalTicks = 41; // 0 to 40 increments of 0.5 MHz
  for (let i = 0; i < totalTicks; i++) {
    const tick = document.createElement('div');
    tick.className = i % 5 === 0 ? 'tick major' : 'tick';
    scaleTicks.appendChild(tick);
  }

  tunerScale?.addEventListener('click', (e) => {
    const rect = tunerScale.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetFreq = FREQ_MIN + ratio * (FREQ_MAX - FREQ_MIN);
    tuneToClosestFrequency(targetFreq);
  });
}

function updateNeedlePosition(freq) {
  if (!tunerNeedle) return;
  const ratio = (freq - FREQ_MIN) / (FREQ_MAX - FREQ_MIN);
  const clamped = Math.max(0.02, Math.min(0.98, ratio));
  tunerNeedle.style.left = `${(clamped * 100).toFixed(2)}%`;
}

function getFilteredStations() {
  const all = Array.from(stationsMap.values());
  const unmuted = all.filter(s => !mutedStations.has(s.pub) || s.pub === activeStationPub);
  if (currentTagFilter === 'all') return unmuted;
  return unmuted.filter(s => s.tag === currentTagFilter);
}

// --- Web Audio API Radio Synthesizer ---

function initAudioContext() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTuningStatic(duration = 0.22) {
  if (!isRadioOn) return;
  initAudioContext();
  if (!audioCtx) return;

  try {
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.exp(-i / (bufferSize * 0.7));
      const crackle = Math.random() > 0.96 ? (Math.random() * 2 - 1) * 1.5 : (Math.random() * 2 - 1) * 0.6;
      data[i] = crackle * decay;
    }

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1400 + Math.random() * 500;
    filter.Q.value = 2.2;

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noiseSource.start();
  } catch (e) {
    console.warn('Web Audio error:', e);
  }
}

function playJammingStatic(duration = 0.38) {
  if (!isRadioOn) return;
  initAudioContext();
  if (!audioCtx) return;

  try {
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      const buzz = Math.sin(2 * Math.PI * 130 * (i / sampleRate));
      data[i] = (white * 0.65 + buzz * 0.35) * 0.3;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1800;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    source.start();
  } catch (e) {
    console.warn('Jamming sound error:', e);
  }
}

// --- Media & Music Player Handling ---

function extractCleanMediaUrl(input) {
  if (!input) return '';
  const trimmed = input.trim();
  // Extract iframe src if user pasted an embed snippet
  const iframeSrcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (iframeSrcMatch && iframeSrcMatch[1]) {
    return iframeSrcMatch[1];
  }
  return trimmed;
}

function detectMedia(rawUrl) {
  if (!rawUrl) return { type: 'none' };
  const url = extractCleanMediaUrl(rawUrl);

  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      id: ytMatch[1],
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?enablejsapi=1`
    };
  }

  // SoundCloud
  if (url.includes('soundcloud.com/') || url.includes('w.soundcloud.com/player/')) {
    let scEmbedUrl = url;
    if (!url.includes('w.soundcloud.com/player/')) {
      scEmbedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23000000&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
    }
    return {
      type: 'soundcloud',
      embedUrl: scEmbedUrl,
      rawUrl: url
    };
  }

  // Bandcamp
  if (url.includes('bandcamp.com')) {
    let bcEmbedUrl = url;
    if (!url.includes('bandcamp.com/EmbeddedPlayer')) {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const bgCol = isDark ? '0d0e12' : 'ffffff';
      const linkCol = isDark ? '4ade80' : '000000';
      bcEmbedUrl = `https://bandcamp.com/EmbeddedPlayer/size=large/bgcol=${bgCol}/linkcol=${linkCol}/tracklist=false/artwork=small/transparent=true/url=${encodeURIComponent(url)}/`;
    }
    return {
      type: 'bandcamp',
      embedUrl: bcEmbedUrl,
      rawUrl: url
    };
  }

  // Spotify (tracks, albums, playlists, artists, episodes, podcasts)
  const spotifyMatch = url.match(/(?:spotify\.com\/(?:embed\/)?(?:[a-z]{2,4}-[a-z]{2,4}\/)?|spotify:)(track|album|playlist|artist|episode|show)[:\/]([a-zA-Z0-9]+)/i);
  if (spotifyMatch) {
    const itemType = spotifyMatch[1].toLowerCase();
    const itemId = spotifyMatch[2];
    return {
      type: 'spotify',
      itemType: itemType,
      id: itemId,
      embedUrl: `https://open.spotify.com/embed/${itemType}/${itemId}?utm_source=generator&theme=0`,
      rawUrl: url
    };
  }

  // TuneCamp (sudorecords.scobrudot.dev, tunecamp domains, or routes with /releases/, /albums/, /tracks/, /share/)
  const isTuneCampDomain = url.includes('sudorecords') || url.includes('tunecamp') || url.includes('scobrudot.dev');
  const tuneCampPathMatch = url.match(/(?:https?:\/\/[^\/]+)?\/(releases|albums|tracks|share)\/([^\/?#]+)/i);
  if ((isTuneCampDomain || tuneCampPathMatch) && !url.includes('github.com') && !url.includes('gitlab.com')) {
    try {
      const parsedUrl = new URL(url);
      const pathMatch = parsedUrl.pathname.match(/\/(releases|albums|tracks|share)\/([^\/?#]+)/i);
      if (pathMatch) {
        return {
          type: 'tunecamp',
          origin: parsedUrl.origin,
          kind: pathMatch[1].toLowerCase(),
          slug: pathMatch[2],
          rawUrl: url
        };
      }
    } catch (e) {}
  }

  // Direct Audio files / streams
  if (/\.(mp3|ogg|wav|m4a|aac|flac)(\?.*)?$/i.test(url) || url.includes('/stream') || url.includes('/live')) {
    return {
      type: 'audio',
      url: url
    };
  }

  return { type: 'link', url: url };
}

async function resolveTuneCampMetadata(media) {
  const origin = media.origin;
  const slug = media.slug;

  // 1. Try public federation search endpoint (/api/catalog/search?q=...)
  try {
    const searchRes = await fetch(`${origin}/api/catalog/search?q=${encodeURIComponent(slug)}`);
    if (searchRes.ok) {
      const data = await searchRes.json();
      const track = data.tracks && (data.tracks.find(t => 
        String(t.id) === slug || 
        (t.file_path && t.file_path.includes(slug)) || 
        (t.album_title && t.album_title.toLowerCase() === slug.toLowerCase())
      ) || data.tracks[0]);

      const album = data.albums && (data.albums.find(a => 
        String(a.id) === slug || (a.slug && a.slug.toLowerCase() === slug.toLowerCase())
      ) || data.albums[0]);

      if (track) {
        const coverRel = track.coverUrl || (album ? `/api/releases/${album.id}/cover` : '');
        return {
          title: track.title || (album && album.title) || slug,
          artist: track.artist_name || (album && album.artist_name) || 'TuneCamp',
          streamUrl: `${origin}/api/tracks/${track.id}/stream`,
          coverUrl: coverRel ? (coverRel.startsWith('http') ? coverRel : `${origin}${coverRel}`) : '',
          rawUrl: media.rawUrl,
          origin: origin
        };
      }
    }
  } catch (e) {
    console.warn('TuneCamp search fetch error:', e);
  }

  // 2. Direct release endpoint (/api/releases/:slug)
  try {
    const relRes = await fetch(`${origin}/api/releases/${encodeURIComponent(slug)}`);
    if (relRes.ok) {
      const rel = await relRes.json();
      const firstTrack = rel.tracks && rel.tracks[0];
      return {
        title: rel.title || slug,
        artist: (firstTrack && firstTrack.artist_name) || rel.artist_name || 'TuneCamp',
        streamUrl: firstTrack ? `${origin}/api/tracks/${firstTrack.id}/stream` : null,
        coverUrl: `${origin}/api/releases/${rel.id || slug}/cover`,
        rawUrl: media.rawUrl,
        origin: origin
      };
    }
  } catch (e) {
    console.warn('TuneCamp direct release fetch error:', e);
  }

  // 3. Fallback direct stream guess if track ID is numeric
  if (/^\d+$/.test(slug)) {
    return {
      title: 'TuneCamp Track #' + slug,
      artist: 'TuneCamp',
      streamUrl: `${origin}/api/tracks/${slug}/stream`,
      coverUrl: `${origin}/api/tracks/${slug}/cover`,
      rawUrl: media.rawUrl,
      origin: origin
    };
  }

  return null;
}

function renderStationMedia(station) {
  if (!mediaPlayerContainer) return;

  if (!station || !station.url) {
    mediaPlayerContainer.innerHTML = '';
    mediaPlayerContainer.classList.add('hidden');
    radioEq?.classList.add('hidden');
    return;
  }

  const media = detectMedia(station.url);

  if (media.type === 'link' || media.type === 'none') {
    // Non-audio link (article, text, obscure web)
    mediaPlayerContainer.innerHTML = '';
    mediaPlayerContainer.classList.add('hidden');
    radioEq?.classList.add('hidden');
    return;
  }

  // Media is audio / music: ALWAYS render the in-page player!
  mediaPlayerContainer.classList.remove('hidden');

  if (media.type === 'tunecamp') {
    mediaPlayerContainer.innerHTML = `
      <div class="tunecamp-player-card" id="tunecamp-card-loading">
        <div class="tunecamp-info" style="font-family: ui-monospace, SFMono-Regular, monospace; font-size: 0.85rem; color: var(--bio-color);">
          // Connessione nodo TuneCamp (${new URL(station.url).hostname})...
        </div>
      </div>
    `;

    resolveTuneCampMetadata(media).then(tcData => {
      if (activeStationPub !== station.pub) return;

      if (!tcData || !tcData.streamUrl) {
        mediaPlayerContainer.innerHTML = `
          <iframe
            style="border: 0; width: 100%; height: 260px; border-radius: 4px;"
            src="${station.url}"
            title="TuneCamp stream"
            allow="autoplay; encrypted-media"
          ></iframe>
        `;
        return;
      }

      const autoplayAttr = isRadioOn ? 'autoplay' : '';
      mediaPlayerContainer.innerHTML = `
        <div class="tunecamp-player-card">
          ${tcData.coverUrl ? `
            <div class="tunecamp-cover-wrapper">
              <img src="${tcData.coverUrl}" alt="${tcData.title}" class="tunecamp-cover" onerror="this.parentElement.style.display='none'" />
            </div>
          ` : ''}
          <div class="tunecamp-info">
            <div class="tunecamp-badge">[ TUNECAMP FEDERATION · ${new URL(tcData.origin).hostname} ]</div>
            <div class="tunecamp-title" title="${tcData.title}">${tcData.title}</div>
            <div class="tunecamp-artist">di <strong>${tcData.artist}</strong></div>
            <audio controls ${autoplayAttr} src="${tcData.streamUrl}" class="tunecamp-audio"></audio>
          </div>
        </div>
      `;

      if (isRadioOn) {
        radioEq?.classList.remove('hidden');
      }
    }).catch(err => {
      console.error('TuneCamp render error:', err);
    });
  } else if (media.type === 'spotify') {
    const height = (media.itemType === 'track' || media.itemType === 'episode') ? 152 : 352;
    mediaPlayerContainer.innerHTML = `
      <iframe
        style="border: 0; width: 100%; border-radius: 4px;"
        src="${media.embedUrl}"
        width="100%"
        height="${height}"
        frameborder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="onepick Spotify player"
      ></iframe>
    `;
  } else if (media.type === 'youtube') {
    const autoplayParam = isRadioOn ? '&autoplay=1' : '';
    mediaPlayerContainer.innerHTML = `
      <iframe
        width="100%"
        height="180"
        src="${media.embedUrl}${autoplayParam}"
        title="onepick audio stream"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    `;
  } else if (media.type === 'soundcloud') {
    const autoPlayParam = isRadioOn ? '&auto_play=true' : '&auto_play=false';
    const finalUrl = media.embedUrl.includes('auto_play=')
      ? media.embedUrl.replace(/auto_play=(true|false)/, isRadioOn ? 'auto_play=true' : 'auto_play=false')
      : `${media.embedUrl}${autoPlayParam}`;

    mediaPlayerContainer.innerHTML = `
      <iframe
        width="100%"
        height="166"
        scrolling="no"
        frameborder="no"
        allow="autoplay; encrypted-media"
        src="${finalUrl}"
      ></iframe>
    `;
  } else if (media.type === 'bandcamp') {
    mediaPlayerContainer.innerHTML = `
      <iframe
        style="border: 0; width: 100%; height: 120px;"
        src="${media.embedUrl}"
        seamless
        allow="autoplay"
      ></iframe>
    `;
  } else if (media.type === 'audio') {
    const autoplayAttr = isRadioOn ? 'autoplay' : '';
    mediaPlayerContainer.innerHTML = `
      <audio controls ${autoplayAttr} src="${media.url}" style="width: 100%; margin-top: 4px;"></audio>
    `;
  }

  // Visualizer indicator
  if (isRadioOn) {
    radioEq?.classList.remove('hidden');
  } else {
    radioEq?.classList.add('hidden');
  }
}

function togglePowerRadio() {
  isRadioOn = !isRadioOn;
  initAudioContext();

  if (powerToggleBtn) {
    if (isRadioOn) {
      powerToggleBtn.classList.add('active');
      if (powerIcon) powerIcon.textContent = '🔈';
      if (powerText) powerText.textContent = 'RADIO ACCESA';
      showToast('📻 Ricevitore acceso: autoplay continuo e fruscio sbloccati!');
      playTuningStatic(0.3);
    } else {
      powerToggleBtn.classList.remove('active');
      if (powerIcon) powerIcon.textContent = '⏻';
      if (powerText) powerText.textContent = 'ACCENDI RADIO';
      showToast('Autoplay radio disattivato (player in-page ancora utilizzabili).');
      radioEq?.classList.add('hidden');
    }
  }

  // Re-render media for active station
  if (activeStationPub && stationsMap.has(activeStationPub)) {
    renderStationMedia(stationsMap.get(activeStationPub));
  }
}

function renderEmptyRadioState() {
  activeStationPub = null;
  if (freqMhzEl) freqMhzEl.textContent = 'FM 88.00';
  if (peerSigilDisplay) {
    peerSigilDisplay.innerHTML = generateSigilSvg('etere', 18);
  }
  if (peerPubDisplay) {
    peerPubDisplay.textContent = currentLang === 'it' ? 'etere silenzioso / nessun nodo in onda' : 'silent ether / no nodes on air';
    peerPubDisplay.title = currentLang === 'it' ? 'In attesa di trasmissioni dalla rete Zen' : 'Awaiting transmissions from Zen network';
  }
  updateNeedlePosition(88.0);

  if (pickSigilDisplay) {
    pickSigilDisplay.innerHTML = generateSigilSvg('etere', 18);
  }
  if (pickOriginBadge) pickOriginBadge.textContent = currentLang === 'it' ? 'NESSUN SEGNALE' : 'NO SIGNAL';
  if (pickTagBadge) pickTagBadge.textContent = currentLang === 'it' ? '#etere' : '#ether';
  if (pickTimeBadge) pickTimeBadge.textContent = currentLang === 'it' ? 'in scansione...' : 'scanning...';
  if (pickUrlLink) {
    pickUrlLink.href = '#';
  }
  if (pickDomainPill) pickDomainPill.textContent = currentLang === 'it' ? '[ etere ]' : '[ ether ]';
  if (pickUrlText) pickUrlText.textContent = currentLang === 'it' ? 'Nessun pick attivo rilevato sulla rete Zen' : 'No active pick detected on Zen mesh';
  if (pickCaptionText) {
    pickCaptionText.textContent = currentLang === 'it'
      ? '// L\'etere è silenzioso. Nessun nodo sta trasmettendo su questo relay.\n// Autenticati con [ login ] per irradiare la prima frequenza attiva o sintonizzati tramite ?peer=<pub>.'
      : '// The airwaves are silent. No nodes are currently broadcasting on this relay.\n// Authenticate via [ login ] to broadcast the first active frequency or tune in via ?peer=<pub>.';
    pickCaptionText.classList.remove('user-caption');
  }

  if (saveCassettoBtn) {
    saveCassettoBtn.textContent = t('action_save_cassetto');
    saveCassettoBtn.disabled = true;
  }
  if (silentNodBtn) {
    silentNodBtn.textContent = t('action_silent_nod');
    silentNodBtn.disabled = true;
  }
  if (currentStationBadge) currentStationBadge.textContent = currentLang === 'it' ? 'in scansione' : 'scanning';
  if (mediaPlayerContainer) {
    mediaPlayerContainer.innerHTML = '';
    mediaPlayerContainer.classList.add('hidden');
  }
  radioEq?.classList.add('hidden');
}

function tuneToStation(pub) {
  const station = stationsMap.get(pub);
  if (!station) return;

  activeStationPub = pub;
  const freq = station.freq || getFrequencyForPub(pub);
  station.freq = freq;

  // Update tuner screen with 2 decimals
  if (freqMhzEl) freqMhzEl.textContent = `FM ${freq.toFixed(2)}`;
  if (peerSigilDisplay) {
    peerSigilDisplay.innerHTML = generateSigilSvg(pub, 18);
  }
  if (peerPubDisplay) {
    peerPubDisplay.textContent = `${t('peer_label')}${truncateKey(pub)}`;
    peerPubDisplay.title = `${currentLang === 'it' ? 'Chiave pubblica' : 'Public key'}: ${pub}`;
  }
  updateNeedlePosition(freq);

  // Check Community Jamming (reports from the mesh)
  const reports = stationReportsMap.get(pub);
  const reportCount = reports ? reports.size : 0;
  const isJammed = reportCount > 0 && !jammedOverrides.has(pub);

  if (isJammed) {
    jammedSignalBanner?.classList.remove('hidden');
    mediaPlayerContainer?.classList.add('jammed-obscured');
    playJammingStatic(0.38);
  } else {
    jammedSignalBanner?.classList.add('hidden');
    mediaPlayerContainer?.classList.remove('jammed-obscured');
    playTuningStatic(0.22);
  }

  renderStationMedia(station);

  // Update Pick Card
  if (pickSigilDisplay) {
    pickSigilDisplay.innerHTML = generateSigilSvg(pub, 18);
  }
  if (pickOriginBadge) {
    pickOriginBadge.textContent = station.author ? `${currentLang === 'it' ? 'NODO' : 'NODE'}: ${station.author}` : `${currentLang === 'it' ? 'TRASMETTITORE' : 'TRANSMITTER'}: ${truncateKey(pub)}`;
  }
  if (pickTagBadge) {
    pickTagBadge.textContent = `#${station.tag || 'sound'}`;
  }
  if (pickTimeBadge) {
    pickTimeBadge.textContent = formatTimeAgo(station.ts);
  }
  if (pickUrlLink) {
    pickUrlLink.href = station.url;
  }
  if (pickDomainPill) {
    pickDomainPill.textContent = `[ ${extractDomain(station.url)} ↗ ]`;
  }
  if (pickUrlText) {
    pickUrlText.textContent = station.url;
  }
  if (pickCaptionText) {
    if (station.caption && station.caption.trim()) {
      pickCaptionText.textContent = station.caption;
      pickCaptionText.classList.add('user-caption');
    } else {
      pickCaptionText.textContent = currentLang === 'it' ? '// Nessuna riflessione allegata.' : '// No reflection attached.';
      pickCaptionText.classList.remove('user-caption');
    }
  }

  // Update button states & enable
  if (saveCassettoBtn) {
    saveCassettoBtn.disabled = false;
    const isSaved = isPickInCassetto(station.url);
    saveCassettoBtn.textContent = isSaved ? t('action_saved_cassetto') : t('action_save_cassetto');
  }
  if (silentNodBtn) {
    const isOwnStation = currentPair && currentPair.pub === pub;
    const alreadySent = hasSentNod(pub);
    if (isOwnStation) {
      silentNodBtn.disabled = true;
      silentNodBtn.textContent = currentLang === 'it' ? '[ La Tua Stazione ]' : '[ Your Station ]';
    } else if (alreadySent) {
      silentNodBtn.disabled = true;
      silentNodBtn.textContent = t('action_nod_sent');
    } else {
      silentNodBtn.disabled = false;
      silentNodBtn.textContent = t('action_silent_nod');
    }
  }

  // Check if active station is own station
  if (currentPair && currentPair.pub === pub) {
    if (currentStationBadge) {
      currentStationBadge.textContent = myNodsCount > 0 ? `${t('badge_own_frequency')} · ${myNodsCount} ${myNodsCount === 1 ? t('nods_short_singular') : t('nods_short_plural')}` : t('badge_own_frequency');
    }
    if (pickOriginBadge) {
      const nodsText = myNodsCount > 0 ? ` · ~ ${myNodsCount} ${myNodsCount === 1 ? t('nods_short_singular') : t('nods_short_plural')}` : '';
      pickOriginBadge.textContent = `${t('pick_origin_own')} (${station.author || currentUsername || truncateKey(pub)})${nodsText}`;
    }
  } else {
    if (currentStationBadge) currentStationBadge.textContent = t('slot_active');
  }
}

function tuneToClosestFrequency(targetFreq) {
  const stations = getFilteredStations();
  if (stations.length === 0) {
    showToast('Nessun segnale attivo su questa banda.');
    return;
  }

  let closest = stations[0];
  let minDiff = Math.abs((closest.freq || getFrequencyForPub(closest.pub)) - targetFreq);

  for (const s of stations) {
    const f = s.freq || getFrequencyForPub(s.pub);
    const diff = Math.abs(f - targetFreq);
    if (diff < minDiff) {
      minDiff = diff;
      closest = s;
    }
  }

  tuneToStation(closest.pub);
}

function tuneStep(direction = 1) {
  const stations = getFilteredStations();
  if (stations.length === 0) {
    showToast('Nessun segnale attivo sulla rete.');
    return;
  }

  // Sort by frequency
  stations.sort((a, b) => (a.freq || getFrequencyForPub(a.pub)) - (b.freq || getFrequencyForPub(b.pub)));

  const currentIndex = stations.findIndex(s => s.pub === activeStationPub);
  let nextIndex = 0;
  if (currentIndex !== -1) {
    nextIndex = (currentIndex + direction + stations.length) % stations.length;
  }

  tuneToStation(stations[nextIndex].pub);
}

function tuneRandom() {
  const stations = getFilteredStations();
  if (stations.length === 0) {
    showToast('Nessun segnale attivo sulla rete.');
    return;
  }
  if (stations.length === 1) {
    tuneToStation(stations[0].pub);
    return;
  }
  let randomStation;
  do {
    const idx = Math.floor(Math.random() * stations.length);
    randomStation = stations[idx];
  } while (randomStation.pub === activeStationPub && stations.length > 1);

  tuneToStation(randomStation.pub);
}

// Tuner button events
tunePrevBtn?.addEventListener('click', () => tuneStep(-1));
tuneNextBtn?.addEventListener('click', () => tuneStep(1));
tuneRandomBtn?.addEventListener('click', () => tuneRandom());

// Tag filter chips
tagChips.forEach(chip => {
  chip.addEventListener('click', () => {
    tagChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentTagFilter = chip.getAttribute('data-tag') || 'all';

    const stations = getFilteredStations();
    if (stations.length > 0) {
      // If current station matches filter, stay; otherwise switch to first match
      const current = stationsMap.get(activeStationPub);
      if (!current || (currentTagFilter !== 'all' && current.tag !== currentTagFilter)) {
        tuneToStation(stations[0].pub);
      }
    } else {
      showToast(`Nessuna frequenza attiva trovata per #${currentTagFilter}`);
    }
  });
});

// --- Silent Nod Interaction ---

function getSentNods() {
  try {
    const raw = localStorage.getItem('onepick_sent_nods');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function hasSentNod(pub) {
  if (!pub) return false;
  const list = getSentNods();
  return list.includes(pub);
}

function recordSentNod(pub) {
  if (!pub) return;
  const list = getSentNods();
  if (!list.includes(pub)) {
    list.push(pub);
    localStorage.setItem('onepick_sent_nods', JSON.stringify(list));
  }
}

async function sendSilentNod(targetPub) {
  if (!targetPub) return;
  if (currentPair && currentPair.pub === targetPub) {
    showToast('Non puoi inviare un cenno alla tua stessa frequenza.');
    return;
  }

  if (hasSentNod(targetPub)) {
    showToast('Hai già inviato un cenno a questa frequenza.');
    return;
  }

  const nodId = currentPair ? currentPair.pub : 'anon_' + Math.random().toString(36).slice(2, 9);
  const nodData = {
    from: nodId,
    target: targetPub,
    ts: Date.now()
  };

  try {
    if (zen) {
      // Put to public nods inbox for this target station:
      zen.get('onepick:nods:' + targetPub).get(nodId).put(nodData);
    }
    recordSentNod(targetPub);
    if (silentNodBtn) {
      silentNodBtn.textContent = '[ Cenno Inviato ~ ]';
      silentNodBtn.disabled = true;
    }
    satisfyPositiveFriction('nod');
    showToast('✓ Cenno inviato privatamente all\'autore! (Invisibile al pubblico)');
  } catch (err) {
    console.error('Errore invio cenno:', err);
    recordSentNod(targetPub);
    satisfyPositiveFriction('nod');
  }
}

silentNodBtn?.addEventListener('click', () => {
  if (!activeStationPub) return;
  sendSilentNod(activeStationPub);
});

// --- Share Frequency Link ---

shareFrequencyBtn?.addEventListener('click', () => {
  if (!activeStationPub) return;
  const url = new URL(window.location.href);
  url.searchParams.set('peer', activeStationPub);
  navigator.clipboard.writeText(url.toString()).then(() => {
    showToast('Link frequenza copiato negli appunti!');
  }).catch(() => {
    prompt('Copia questo link:', url.toString());
  });
});

// --- Cassetto Privato (Local Storage) ---

function getCassettoItems() {
  try {
    const raw = localStorage.getItem('onepick_cassetto');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCassettoItems(items) {
  localStorage.setItem('onepick_cassetto', JSON.stringify(items));
  updateCassettoBadge();
}

function updateCassettoBadge() {
  const items = getCassettoItems();
  if (cassettoCount) {
    cassettoCount.textContent = `(${items.length})`;
  }
}

function isPickInCassetto(url) {
  const items = getCassettoItems();
  return items.some(it => it.url === url);
}

function toggleSaveCurrentPick() {
  const current = stationsMap.get(activeStationPub);
  if (!current) return;

  const items = getCassettoItems();
  const existingIndex = items.findIndex(it => it.url === current.url);

  if (existingIndex !== -1) {
    // Remove
    items.splice(existingIndex, 1);
    saveCassettoItems(items);
    if (saveCassettoBtn) saveCassettoBtn.textContent = '[ Salva nel Cassetto ]';
    showToast('Rimosso dal cassetto privato.');
  } else {
    // Add
    items.unshift({
      url: current.url,
      caption: current.caption,
      tag: current.tag,
      authorPub: current.pub,
      savedAt: Date.now()
    });
    saveCassettoItems(items);
    if (saveCassettoBtn) saveCassettoBtn.textContent = '[ Nel Cassetto ✓ ]';
    satisfyPositiveFriction('save');
  }
  renderCassettoModal();
}

saveCassettoBtn?.addEventListener('click', toggleSaveCurrentPick);

function renderCassettoModal() {
  const items = getCassettoItems();
  if (!cassettoItemsList || !cassettoEmpty) return;

  cassettoItemsList.innerHTML = '';
  if (items.length === 0) {
    cassettoEmpty.classList.remove('hidden');
    return;
  }
  cassettoEmpty.classList.add('hidden');

  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'cassetto-item';
    const sigilHtml = item.authorPub ? `<span class="item-sigil-prefix">${generateSigilSvg(item.authorPub, 16)}</span>` : '';
    li.innerHTML = `
      <div class="cassetto-item-header">
        <span class="cassetto-node-badge">${sigilHtml}#${item.tag || 'sound'} · ${truncateKey(item.authorPub)}</span>
        <span>${new Date(item.savedAt).toLocaleDateString()}</span>
      </div>
      <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="cassetto-item-link">
        ${item.url}
      </a>
      <div class="cassetto-item-caption">${item.caption || ''}</div>
      <div class="cassetto-item-actions">
        <button class="bracket-btn delete-cassetto-item" data-index="${index}" type="button">[ elimina ]</button>
      </div>
    `;
    cassettoItemsList.appendChild(li);
  });

  cassettoItemsList.querySelectorAll('.delete-cassetto-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'), 10);
      const currentItems = getCassettoItems();
      currentItems.splice(idx, 1);
      saveCassettoItems(currentItems);
      renderCassettoModal();
      if (activeStationPub) {
        const active = stationsMap.get(activeStationPub);
        if (active && saveCassettoBtn) {
          saveCassettoBtn.textContent = isPickInCassetto(active.url) ? '[ Nel Cassetto ✓ ]' : '[ Salva nel Cassetto ]';
        }
      }
    });
  });
}

cassettoTrigger?.addEventListener('click', () => {
  renderCassettoModal();
  cassettoModal?.classList.remove('hidden');
});

closeCassettoBtn?.addEventListener('click', () => {
  cassettoModal?.classList.add('hidden');
});

exportCassettoJsonBtn?.addEventListener('click', () => {
  const items = getCassettoItems();
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `onepick-cassetto-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
});

exportCassettoMdBtn?.addEventListener('click', () => {
  const items = getCassettoItems();
  let md = '# onepick / Cassetto Privato\n\nArchivio personale esportato da onepick.\n\n';
  items.forEach(it => {
    md += `### [${it.url}](${it.url})\n`;
    md += `*${it.caption || ''}*\n\n`;
    md += `- Tag: #${it.tag || 'sound'}\n`;
    md += `- Nodo: \`${it.authorPub || ''}\`\n`;
    md += `- Salvato il: ${new Date(it.savedAt).toISOString()}\n\n---\n\n`;
  });
  const blob = new Blob([md], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `onepick-cassetto-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
});

clearCassettoBtn?.addEventListener('click', () => {
  if (confirm('Vuoi davvero svuotare il tuo cassetto privato?')) {
    saveCassettoItems([]);
    renderCassettoModal();
    if (activeStationPub) {
      const active = stationsMap.get(activeStationPub);
      if (active && saveCassettoBtn) {
        saveCassettoBtn.textContent = '[ Salva nel Cassetto ]';
      }
    }
    showToast('Cassetto svuotato.');
  }
});

// --- Local Mute & Decentralized Moderation (Community Jamming) ---

function loadMutedStations() {
  try {
    const raw = localStorage.getItem('onepick_muted_stations');
    const arr = raw ? JSON.parse(raw) : [];
    mutedStations = new Set(arr);
  } catch (e) {
    mutedStations = new Set();
  }
  updateMutedCountBadge();
}

function saveMutedStations() {
  localStorage.setItem('onepick_muted_stations', JSON.stringify(Array.from(mutedStations)));
  updateMutedCountBadge();
}

function muteStation(pub) {
  if (!pub) return;
  mutedStations.add(pub);
  saveMutedStations();
  showToast('Frequenza silenziata dal tuo ricevitore.');
  if (activeStationPub === pub) {
    const available = getFilteredStations().filter(s => s.pub !== pub);
    if (available.length > 0) {
      tuneToStation(available[0].pub);
    } else {
      renderEmptyRadioState();
    }
  }
}

function unmuteStation(pub) {
  if (!pub) return;
  mutedStations.delete(pub);
  saveMutedStations();
  showToast('Frequenza ripristinata nel ricevitore.');
  renderMutedStationsTab();
}

function updateMutedCountBadge() {
  if (toggleMutedStationsBtn) {
    toggleMutedStationsBtn.textContent = `[ silenziate (${mutedStations.size}) ]`;
  }
}

let showingMutedTab = false;

function setupCassettoMutedTab() {
  toggleMutedStationsBtn?.addEventListener('click', () => {
    showingMutedTab = !showingMutedTab;
    if (showingMutedTab) {
      toggleMutedStationsBtn.textContent = `[ vedi pick (${getCassettoItems().length}) ]`;
      cassettoPicksTab?.classList.add('hidden');
      cassettoMutedTab?.classList.remove('hidden');
      renderMutedStationsTab();
    } else {
      toggleMutedStationsBtn.textContent = `[ silenziate (${mutedStations.size}) ]`;
      cassettoPicksTab?.classList.remove('hidden');
      cassettoMutedTab?.classList.add('hidden');
      renderCassettoModal();
    }
  });
}

function renderMutedStationsTab() {
  if (!mutedStationsList || !mutedEmpty) return;
  mutedStationsList.innerHTML = '';
  const list = Array.from(mutedStations);

  if (list.length === 0) {
    mutedEmpty.classList.remove('hidden');
    return;
  }
  mutedEmpty.classList.add('hidden');

  list.forEach(pub => {
    const s = stationsMap.get(pub);
    const freq = s ? (s.freq || getFrequencyForPub(pub)) : getFrequencyForPub(pub);
    const li = document.createElement('li');
    li.className = 'cassetto-item';
    const sigilHtml = `<span class="item-sigil-prefix">${generateSigilSvg(pub, 16)}</span>`;
    li.innerHTML = `
      <div class="cassetto-item-header">
        <span class="cassetto-node-badge">${sigilHtml}FM ${freq.toFixed(2)} MHz · ${truncateKey(pub)}</span>
        <span>${s && s.author ? s.author : 'nodo'}</span>
      </div>
      <div class="cassetto-item-caption">${s && s.caption ? s.caption : '// Frequenza silenziata.'}</div>
      <div class="cassetto-item-actions">
        <button class="bracket-btn btn-success unmute-station-btn" data-pub="${pub}" type="button">[ ripristina ]</button>
      </div>
    `;
    mutedStationsList.appendChild(li);
  });

  mutedStationsList.querySelectorAll('.unmute-station-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pub = e.target.getAttribute('data-pub');
      unmuteStation(pub);
    });
  });
}

async function sendCommunityReport(targetPub, reason) {
  if (!targetPub) return;
  const reporterId = currentPair ? currentPair.pub : 'rep_' + Math.random().toString(36).slice(2, 9);
  const reportPayload = {
    reporter: reporterId,
    reason: reason,
    ts: Date.now()
  };

  try {
    if (zen) {
      zen.get('onepick:reports:' + targetPub).get(reporterId).put(reportPayload);
    }
    showToast('⚠️ Segnalazione irradiata sulla rete Zen P2P!');
    muteStation(targetPub);
  } catch (err) {
    console.error('Errore invio report:', err);
    muteStation(targetPub);
  }
}

function subscribeToReports(pub) {
  if (!zen || !pub) return;
  if (!stationReportsMap.has(pub)) {
    stationReportsMap.set(pub, new Map());
  }
  zen.get('onepick:reports:' + pub).map().on((rep, repId) => {
    if (rep && rep.ts && repId) {
      const map = stationReportsMap.get(pub) || new Map();
      map.set(repId, rep);
      stationReportsMap.set(pub, map);

      if (activeStationPub === pub && !jammedOverrides.has(pub)) {
        jammedSignalBanner?.classList.remove('hidden');
        mediaPlayerContainer?.classList.add('jammed-obscured');
      }
    }
  });
}

// --- Station Profile Modal (Live Frequency Profile) ---

function openStationProfile(pub) {
  if (!pub) return;
  const station = stationsMap.get(pub);
  if (!station) return;

  const freq = station.freq || getFrequencyForPub(pub);
  const permalink = `${window.location.origin}${window.location.pathname}?peer=${pub}`;

  if (profSigilLarge) {
    profSigilLarge.innerHTML = generateSigilSvg(pub, 44);
  }
  if (profHeaderName) {
    profHeaderName.textContent = station.author || truncateKey(pub);
  }
  if (profHeaderFreq) {
    profHeaderFreq.textContent = `FM ${freq.toFixed(2)} MHz · ${station.author ? (currentLang === 'it' ? 'nodo attivo' : 'active node') : (currentLang === 'it' ? 'nodo trasmettitore' : 'transmitter node')}`;
  }

  if (profFreqText) profFreqText.textContent = `FM ${freq.toFixed(2)} MHz`;
  if (profNameText) profNameText.textContent = station.author || truncateKey(pub);
  if (profPubkeyText) {
    profPubkeyText.textContent = pub;
    profPubkeyText.title = pub;
  }
  if (profTimeText) profTimeText.textContent = formatTimeAgo(station.ts);
  if (profPermalinkInput) profPermalinkInput.value = permalink;

  if (profMuteToggleBtn) {
    const isMuted = mutedStations.has(pub);
    profMuteToggleBtn.textContent = isMuted ? '[ Ripristina Stazione ]' : '[ Silenzia questa Stazione ]';
    profMuteToggleBtn.className = isMuted ? 'bracket-btn btn-success' : 'bracket-btn btn-danger';
  }

  stationProfileModal?.classList.remove('hidden');
}

function setupProfileAndReportUI() {
  stationProfileBtn?.addEventListener('click', () => {
    if (activeStationPub) openStationProfile(activeStationPub);
  });

  pickOriginBadge?.addEventListener('click', () => {
    if (activeStationPub) openStationProfile(activeStationPub);
  });

  closeProfileBtn?.addEventListener('click', () => {
    stationProfileModal?.classList.add('hidden');
  });

  profCopyPubBtn?.addEventListener('click', () => {
    if (!activeStationPub) return;
    navigator.clipboard.writeText(activeStationPub).then(() => {
      showToast('Chiave crittografica copiata negli appunti!');
    }).catch(() => {
      prompt('Copia chiave pubblica:', activeStationPub);
    });
  });

  profCopyLinkBtn?.addEventListener('click', () => {
    if (profPermalinkInput) {
      navigator.clipboard.writeText(profPermalinkInput.value).then(() => {
        showToast('Permalink stazione copiato negli appunti!');
      }).catch(() => {
        prompt('Copia permalink:', profPermalinkInput.value);
      });
    }
  });

  profMuteToggleBtn?.addEventListener('click', () => {
    if (!activeStationPub) return;
    if (mutedStations.has(activeStationPub)) {
      unmuteStation(activeStationPub);
      stationProfileModal?.classList.add('hidden');
    } else {
      muteStation(activeStationPub);
      stationProfileModal?.classList.add('hidden');
    }
  });

  profReportTriggerBtn?.addEventListener('click', () => {
    stationProfileModal?.classList.add('hidden');
    reportModal?.classList.remove('hidden');
  });

  reportStationBtn?.addEventListener('click', () => {
    if (!activeStationPub) return;
    reportModal?.classList.remove('hidden');
  });

  closeReportBtn?.addEventListener('click', () => {
    reportModal?.classList.add('hidden');
  });

  executeLocalMuteBtn?.addEventListener('click', () => {
    if (!activeStationPub) return;
    muteStation(activeStationPub);
    reportModal?.classList.add('hidden');
  });

  executeCommunityReportBtn?.addEventListener('click', () => {
    if (!activeStationPub) return;
    const reason = reportReasonSelect?.value || 'phishing';
    sendCommunityReport(activeStationPub, reason);
    reportModal?.classList.add('hidden');
  });

  overrideJammedBtn?.addEventListener('click', () => {
    if (!activeStationPub) return;
    jammedOverrides.add(activeStationPub);
    jammedSignalBanner?.classList.add('hidden');
    mediaPlayerContainer?.classList.remove('jammed-obscured');
    showToast('Segnale sintonizzato a tuo rischio.');
  });
}

// --- Transmitter: Lo Slot Unico (State over History) ---

function initTransmitterForm() {
  // 140 character limit live countdown
  pickCaptionInput?.addEventListener('input', () => {
    const len = pickCaptionInput.value.length;
    if (charCounter) {
      charCounter.textContent = `${len} / 140`;
      charCounter.className = 'char-counter';
      if (len > 130) {
        charCounter.classList.add('danger');
      } else if (len > 110) {
        charCounter.classList.add('warning');
      }
    }
  });

  // Pick tag selectors
  pickPresetTagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      pickPresetTagButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.getAttribute('data-pick-tag') || 'sound';
      if (selectedPickTagInput) selectedPickTagInput.value = tag;
    });
  });

  // Form Submission -> Overwrite State
  transmitterForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentPair) {
      showToast('Autenticati prima con [ login ] per trasmettere.');
      return;
    }

    if (!frictionUnlocked && hasPeerStations()) {
      showToast('Attrito Positivo attivo: salva prima un pick o invia un cenno per sbloccare.');
      return;
    }

    const rawInput = pickUrlInput.value.trim();
    const url = extractCleanMediaUrl(rawInput);
    const caption = pickCaptionInput.value.trim();
    const tag = selectedPickTagInput.value.trim() || 'sound';

    if (!url) {
      showToast('Inserisci un URL valido.');
      return;
    }

    if (caption.length > 140) {
      showToast('Il testo supera rigidamente i 140 caratteri!');
      return;
    }

    const slotData = {
      url: url,
      caption: caption,
      tag: tag,
      author: currentUsername || truncateKey(currentPair.pub),
      ts: Date.now(),
      authorPub: currentPair.pub
    };

    try {
      transmitBtn.disabled = true;
      transmitBtn.textContent = '[ Trasmissione in corso... ]';

      // 1. Overwrite user's single slot in Zen graph (with timeout protection)
      await new Promise((resolve, reject) => {
        let finished = false;
        const timer = setTimeout(() => {
          if (!finished) {
            finished = true;
            resolve(slotData);
          }
        }, 1500);

        try {
          zen.get('~' + currentPair.pub).get('onepick').get('slot').put(
            slotData,
            ack => {
              if (finished) return;
              finished = true;
              clearTimeout(timer);
              if (ack && ack.err) reject(new Error(ack.err));
              else resolve(ack);
            },
            { authenticator: currentPair }
          );
        } catch (e) {
          clearTimeout(timer);
          reject(e);
        }
      });

      // 2. Announce pubkey to global frequencies directory
      zen.get('onepick:frequencies').get(currentPair.pub).put({
        pub: currentPair.pub,
        tag: tag,
        author: currentUsername || truncateKey(currentPair.pub),
        ts: Date.now()
      });

      // 3. Immediately reflect in local map & switch radio to own slot
      slotData.freq = getFrequencyForPub(currentPair.pub);
      stationsMap.set(currentPair.pub, slotData);
      tuneToStation(currentPair.pub);
      updateStationsCounter();

      if (slotStatusBadge) {
        slotStatusBadge.textContent = 'in onda';
        slotStatusBadge.className = 'status-badge auth-badge';
      }

      showToast('✓ Slot aggiornato con successo! Frequenza attiva in onda.');
      updateFrictionUI();
    } catch (err) {
      console.error('Errore durante la trasmissione:', err);
      showToast('Errore durante la pubblicazione sullo slot: ' + (err.message || 'Riprova'));
    } finally {
      transmitBtn.disabled = false;
      transmitBtn.textContent = '[ Trasmetti sul tuo Slot ]';
    }
  });
}

// --- Auth & Node Activation ---

function setupAuthUI() {
  loginTriggerBtn?.addEventListener('click', () => {
    authAlert?.classList.add('hidden');
    authModal?.classList.remove('hidden');
    authUser?.focus();
  });

  closeAuthBtn?.addEventListener('click', () => {
    authModal?.classList.add('hidden');
  });

  authCancelBtn?.addEventListener('click', () => {
    authModal?.classList.add('hidden');
  });

  logoutBtn?.addEventListener('click', () => {
    currentPair = null;
    currentUsername = null;
    myNodsCount = 0;
    sessionStorage.removeItem('onepick_user');
    sessionStorage.removeItem('onepick_pass');
    sessionStorage.removeItem('onepick_pair');

    if (authorSigilDisplay) {
      authorSigilDisplay.innerHTML = '';
      authorSigilDisplay.classList.add('hidden');
    }
    authControls?.classList.add('hidden');
    loginTriggerBtn?.classList.remove('hidden');
    transmitterForm?.classList.add('hidden');
    if (transmitterPrompt) {
      transmitterPrompt.innerHTML = 'Autenticati con <strong>[ login ]</strong> per attivare la tua frequenza. Ogni trasmissione sovrascrive istantaneamente la precedente: chi visita il tuo nodo vede solo ciò che ti ossessiona ora.';
    }
    if (slotStatusBadge) {
      slotStatusBadge.textContent = 'inattivo';
      slotStatusBadge.className = 'status-badge';
    }
    if (nodsReceivedBadge) nodsReceivedBadge.classList.add('hidden');
    showToast('Nodo disconnesso.');
  });

  // Deterministic login
  authForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = authUser.value.trim();
    const password = authPass.value;

    if (!username || !password) {
      if (authAlert) {
        authAlert.textContent = 'Inserisci nome nodo e passphrase.';
        authAlert.classList.remove('hidden');
      }
      return;
    }

    try {
      const submitBtn = document.getElementById('auth-submit-btn');
      if (submitBtn) submitBtn.textContent = '[ Derivazione chiavi... ]';

      const pair = await derivePair(username, password);
      loginWithPair(pair, username);
      authModal?.classList.add('hidden');
      authForm.reset();
    } catch (err) {
      console.error('Errore derivazione chiavi:', err);
      if (authAlert) {
        authAlert.textContent = 'Errore crittografico: ' + err.message;
        authAlert.classList.remove('hidden');
      }
    } finally {
      const submitBtn = document.getElementById('auth-submit-btn');
      if (submitBtn) submitBtn.textContent = '[ attiva nodo ]';
    }
  });

  // Quick random guest identity
  quickGuestBtn?.addEventListener('click', async () => {
    try {
      quickGuestBtn.textContent = '[ Generazione... ]';
      const pair = await ZEN.pair();
      const randomName = 'guest-' + Math.random().toString(36).slice(2, 6);
      loginWithPair(pair, randomName);
      authModal?.classList.add('hidden');
      showToast('✓ Nodo ospite generato e connesso con successo!');
    } catch (err) {
      console.error(err);
    } finally {
      quickGuestBtn.textContent = '[ genera chiave casuale ]';
    }
  });
}

function loginWithPair(pair, username) {
  currentPair = pair;
  currentUsername = username;

  // Update header auth badge & sigil
  if (authorSigilDisplay) {
    authorSigilDisplay.innerHTML = generateSigilSvg(pair.pub, 18);
    authorSigilDisplay.classList.remove('hidden');
  }
  if (authorBadge) {
    authorBadge.textContent = `${username} (${truncateKey(pair.pub)})`;
    authorBadge.title = `Chiave pubblica: ${pair.pub}`;
  }
  authControls?.classList.remove('hidden');
  loginTriggerBtn?.classList.add('hidden');

  // Activate transmitter section
  transmitterPrompt?.classList.add('hidden');
  transmitterForm?.classList.remove('hidden');

  // Subscribe to own slot in Zen to sync existing state
  zen.get('~' + pair.pub).get('onepick').get('slot').once((slot) => {
    if (slot && slot.url) {
      if (pickUrlInput) pickUrlInput.value = slot.url;
      if (pickCaptionInput) {
        pickCaptionInput.value = slot.caption || '';
        if (charCounter) charCounter.textContent = `${(slot.caption || '').length} / 140`;
      }
      if (slot.tag) {
        pickPresetTagButtons.forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-pick-tag') === slot.tag);
        });
        if (selectedPickTagInput) selectedPickTagInput.value = slot.tag;
      }
      if (slotStatusBadge) {
        slotStatusBadge.textContent = 'in onda';
        slotStatusBadge.className = 'status-badge auth-badge';
      }

      // Ensure station is in map
      slot.freq = getFrequencyForPub(pair.pub);
      stationsMap.set(pair.pub, slot);
    }
  });

  // Listen to silent nods received by this station from the public inbox
  const myReceivedNods = new Map();
  myNodsCount = 0;
  zen.get('onepick:nods:' + pair.pub).map().on((nod, nodId) => {
    if (nod && nod.ts && nodId) {
      myReceivedNods.set(nodId, nod);
      myNodsCount = myReceivedNods.size;

      if (nodsReceivedBadge) {
        nodsReceivedBadge.textContent = `~ ${myNodsCount} ${myNodsCount === 1 ? 'cenno ricevuto' : 'cenni ricevuti'}`;
        nodsReceivedBadge.classList.remove('hidden');
      }

      // If currently viewing own station in the receiver, update station badges immediately
      if (activeStationPub === pair.pub) {
        if (currentStationBadge) {
          currentStationBadge.textContent = `la tua frequenza · ${myNodsCount} cenni`;
        }
        if (pickOriginBadge) {
          const authorLabel = currentUsername || truncateKey(pair.pub);
          pickOriginBadge.textContent = `LA TUA FREQUENZA (${authorLabel}) · ~ ${myNodsCount} ${myNodsCount === 1 ? 'cenno' : 'cenni'}`;
        }
      }
    }
  });

  showToast(`Nodo ${username} attivo. Frequenza pronta.`);
}

// --- Zen Mesh P2P Engine & Peer Discovery ---

function initZen() {
  try {
    zen = new ZEN({
      peers: [RELAY_URL],
      localStorage: false,
      radisk: true,
      axe: true
    });

    window.zen = zen;

    updateRelayStatus(false);

    zen.on('hi', () => {
      updateRelayStatus(true);
    });

    setInterval(() => {
      try {
        const root = zen._graph && zen._graph._;
        const peers = (root && root.opt && root.opt.peers) || {};
        const isConnected = Object.values(peers).some(
          p => p && p.wire && (p.wire.readyState === 1 || p.wire.readyState === undefined)
        );
        updateRelayStatus(isConnected);
      } catch (e) {}
    }, 4000);

    // Initial state without mocks: wait for live Zen network transmissions
    renderEmptyRadioState();

    // Subscribe to Network Frequencies Directory
    subscribeToNetworkFrequencies();

    // Launch Autonomous Background Seeder (15-min rotation + cold-start ether population)
    setTimeout(() => {
      try {
        const seeder = startAutonomousSeeder(zen, ZEN, {
          intervalMs: 15 * 60 * 1000,
          onBroadcast: (res) => {
            if (res) {
              console.log(`[onepick seeder] Rotated @${res.bot} on FM ${res.freq.toFixed(2)}: ${res.track.title}`);
            }
          }
        });
        window.onepickSeeder = seeder;

        // Check network on page entry: auto-seed missing bots or rotate stale stations (>15 min)
        setTimeout(() => {
          seeder.checkAndSeedOnPageEntry(stationsMap);
        }, 3000);
      } catch (seedErr) {
        console.warn('Seeder init warning:', seedErr);
      }
    }, 1500);

  } catch (err) {
    console.error('Errore inizializzazione Zen:', err);
    updateRelayStatus(false);
  }
}

function updateRelayStatus(online) {
  isRelayConnected = !!online;
  if (relayDot) {
    if (online) {
      relayDot.classList.add('online');
    } else {
      relayDot.classList.remove('online');
    }
  }
  if (relayText) {
    relayText.textContent = online ? 'online' : 'in connessione';
  }
}

function subscribeToNetworkFrequencies() {
  // Listen for discovered stations
  zen.get('onepick:frequencies').map().on((freqNotice, pub) => {
    if (!freqNotice || !pub) return;

    // Listen to community reports for this peer
    subscribeToReports(pub);

    // Fetch the single active slot from that peer's userspace
    zen.get('~' + pub).get('onepick').get('slot').on((slot) => {
      if (slot && slot.url && !slot.deleted) {
        const stationObj = {
          pub: pub,
          author: slot.author || freqNotice.author || truncateKey(pub),
          url: slot.url,
          caption: slot.caption || '',
          tag: slot.tag || freqNotice.tag || 'sound',
          ts: slot.ts || freqNotice.ts || Date.now(),
          freq: getFrequencyForPub(pub)
        };
        stationsMap.set(pub, stationObj);
        updateStationsCounter();
        updateFrictionUI();

        // If this matches currently active station or no station is tuned, tune it
        if (activeStationPub === pub || !activeStationPub) {
          tuneToStation(pub);
        }
      }
    });
  });
}

function updateStationsCounter() {
  if (onlineStationsCount) {
    const count = stationsMap.size;
    onlineStationsCount.textContent = `frequenze in onda: ${count}`;
  }
}

// Check URL param ?peer=<pub> to tune directly
function checkInitialPeerParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const peerParam = urlParams.get('peer');
  if (peerParam) {
    subscribeToReports(peerParam);
    // If already in map, tune immediately
    if (stationsMap.has(peerParam)) {
      tuneToStation(peerParam);
      return;
    }

    // Otherwise fetch from Zen
    zen.get('~' + peerParam).get('onepick').get('slot').once((slot) => {
      if (slot && slot.url) {
        const station = {
          pub: peerParam,
          author: slot.author || truncateKey(peerParam),
          url: slot.url,
          caption: slot.caption || '',
          tag: slot.tag || 'sound',
          ts: slot.ts || Date.now(),
          freq: getFrequencyForPub(peerParam)
        };
        stationsMap.set(peerParam, station);
        tuneToStation(peerParam);
        updateStationsCounter();
        updateFrictionUI();
      } else {
        renderEmptyRadioState();
      }
    });
  } else {
    // Default to first station if available, otherwise empty state
    const stations = getFilteredStations();
    if (stations.length > 0) {
      tuneToStation(stations[0].pub);
    } else {
      renderEmptyRadioState();
    }
  }
}

// --- Canvas Mode (Radio Focus View) ---

function toggleCanvasMode(force) {
  const nextState = typeof force === 'boolean' ? force : !isCanvasMode;
  isCanvasMode = nextState;

  if (isCanvasMode) {
    document.body.classList.add('canvas-mode');
    canvasExitBar?.classList.remove('hidden');
    canvasToggleBtn?.classList.add('btn-active');
    radioCanvasQuickBtn?.classList.add('btn-active');
    if (canvasBtnText) canvasBtnText.textContent = t('canvas_btn_exit');
    showToast(t('toast_canvas_on'));
  } else {
    document.body.classList.remove('canvas-mode');
    canvasExitBar?.classList.add('hidden');
    canvasToggleBtn?.classList.remove('btn-active');
    radioCanvasQuickBtn?.classList.remove('btn-active');
    if (canvasBtnText) canvasBtnText.textContent = t('canvas_btn');
    showToast(t('toast_canvas_off'));
  }

  // Refresh needle position after layout reflow
  setTimeout(() => {
    if (activeStationPub && stationsMap.has(activeStationPub)) {
      const station = stationsMap.get(activeStationPub);
      if (station && station.freq) {
        updateNeedlePosition(station.freq);
      }
    }
  }, 100);
}

function setupCanvasMode() {
  canvasToggleBtn?.addEventListener('click', () => toggleCanvasMode());
  radioCanvasQuickBtn?.addEventListener('click', () => toggleCanvasMode());
  exitCanvasBtn?.addEventListener('click', () => toggleCanvasMode(false));

  // Keyboard shortcuts:
  // - Esc: exit canvas mode
  // - 'c' or 'C': toggle canvas mode when not editing inputs or modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (isCanvasMode) {
        toggleCanvasMode(false);
      }
      return;
    }

    if ((e.key === 'c' || e.key === 'C') && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const activeEl = document.activeElement;
      const tag = activeEl ? activeEl.tagName.toLowerCase() : '';
      const isInput = tag === 'input' || tag === 'textarea' || activeEl?.isContentEditable;
      const isModalOpen = document.querySelector('.modal-overlay:not(.hidden)');
      if (!isInput && !isModalOpen) {
        e.preventDefault();
        toggleCanvasMode();
      }
    }
  });
}

// --- App Initialization ---

function initApp() {
  initTheme();
  setupLanguageAndTutorial();
  setLanguage(currentLang);
  setupCanvasMode();
  initTunerScale();
  loadMutedStations();
  checkFrictionStatus();
  updateCassettoBadge();
  initTransmitterForm();
  setupAuthUI();
  setupProfileAndReportUI();
  setupCassettoMutedTab();
  initZen();

  // Power radio toggle listener
  powerToggleBtn?.addEventListener('click', togglePowerRadio);

  // Tune initial station after setup
  setTimeout(() => {
    checkInitialPeerParam();
    updateStationsCounter();

    // Check if tutorial should be shown automatically on first visit
    const tutorialSeen = localStorage.getItem('onepick_tutorial_seen');
    if (tutorialSeen !== 'true') {
      setTimeout(() => {
        openTutorialModal(1);
      }, 700);
    }
  }, 400);
}

// Boot
window.addEventListener('DOMContentLoaded', initApp);

