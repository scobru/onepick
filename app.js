import ZEN from './zen.min.js';
import { startAutonomousSeeder, rotateBotStation, SEED_BOTS } from './seeder.js';

// --- Configuration & Constants ---
const RELAY_URL = 'https://delay.scobrudot.dev/zen';
const SALT_PREFIX = 'onepick:zen:station:';
const FREQ_MIN = 88.0;
const FREQ_MAX = 108.0;
const MAX_STATION_AGE_MS = 24 * 60 * 60 * 1000; // 24 ore: stazioni peer inattive vengono nascoste dall'etere

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
let isRadioOn = true;
let audioCtx = null;
let isCanvasMode = true;
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
const tutorialLangBtn = document.getElementById('tutorial-lang-btn');
const tutorialLangText = document.getElementById('tutorial-lang-text');
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
const saveStationBtn = document.getElementById('save-station-btn');
const silentNodBtn = document.getElementById('silent-nod-btn');
const shareFrequencyBtn = document.getElementById('share-frequency-btn');
const stationProfileBtn = document.getElementById('station-profile-btn');
const reportStationBtn = document.getElementById('report-station-btn');
const rotateTrackBtn = document.getElementById('rotate-track-btn');
const rotateTrackText = document.getElementById('rotate-track-text');
const profRotateBtn = document.getElementById('prof-rotate-btn');
const profRotateText = document.getElementById('prof-rotate-text');
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
const compatibleProvidersPanel = document.getElementById('compatible-providers-panel');
const compatibleTitle = document.getElementById('compatible-title');
const urlValidationStatus = document.getElementById('url-validation-status');
const providerBadges = document.querySelectorAll('.provider-badge');
const nonSoundHint = document.getElementById('non-sound-hint');

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
const tabBtnPicks = document.getElementById('tab-btn-picks');
const tabBtnStations = document.getElementById('tab-btn-stations');
const tabBtnMuted = document.getElementById('tab-btn-muted');
const tabCountPicks = document.getElementById('tab-count-picks');
const tabCountStations = document.getElementById('tab-count-stations');
const tabCountMuted = document.getElementById('tab-count-muted');
const cassettoPicksTab = document.getElementById('cassetto-picks-tab');
const cassettoStationsTab = document.getElementById('cassetto-stations-tab');
const cassettoMutedTab = document.getElementById('cassetto-muted-tab');
const cassettoItemsList = document.getElementById('cassetto-items-list');
const cassettoEmpty = document.getElementById('cassetto-empty');
const cassettoStationsList = document.getElementById('cassetto-stations-list');
const cassettoStationsEmpty = document.getElementById('cassetto-stations-empty');
const exportCassettoJsonBtn = document.getElementById('export-cassetto-json');
const exportCassettoMdBtn = document.getElementById('export-cassetto-md');
const clearCassettoBtn = document.getElementById('clear-cassetto-btn');
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
const profSaveStationBtn = document.getElementById('prof-save-station-btn');
const profSaveStationText = document.getElementById('prof-save-station-text');
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
    // Meta
    meta_title: 'onepick / frequenza attiva',
    meta_desc: 'onepick — Uno stato, non un archivio. Sostituisce la cronologia infinita con una singola frequenza culturale attiva. Protocollo P2P decentralizzato su Zen.',

    // Header & Brand
    power_btn_on: 'ACCENDI RADIO',
    power_btn_off: 'SPEGNI RADIO',
    power_btn_title: 'Accendi / Spegni ricevitore sonoro (sblocca audio e fruscio)',
    lang_btn_label: 'EN',
    lang_btn_title: 'Passa a Inglese / Switch to English',
    theme_toggle_title: 'Alterna tema chiaro / scuro',
    tutorial_trigger_title: 'Guida e tutorial / Guide & tutorial',
    nav_guide: 'guida ?',
    nav_cassetto: 'cassetto ',
    cassetto_trigger_title: 'Apri il tuo cassetto privato di bookmark locali',
    nav_login: 'login',
    login_trigger_title: 'Accedi al tuo nodo trasmettitore',
    nav_logout: 'logout',
    logout_btn_title: 'Disconnetti nodo',
    bio_text: 'Uno stato, non un archivio · singola frequenza attiva · attrito positivo · P2P su Zen',
    relay_connecting: 'in connessione',
    relay_online: 'online',
    online_stations_prefix: 'frequenze in onda: ',

    // Radio Tuner
    radio_section_title: 'Sintonizzatore Radio',
    badge_tuned: 'sintonizzato',
    badge_own_frequency: 'la tua frequenza',
    badge_node_prefix: 'NODO',
    badge_transmitter_prefix: 'TRASMETTITORE',
    peer_scanning: 'nodo: in scansione...',
    peer_label: 'nodo: ',
    scale_title: 'Clicca o trascina per sintonizzare manualmente',
    tune_prev: '◂ prec',
    tune_prev_title: 'Frequenza precedente',
    tune_random: '⚄ a caso',
    tune_random_title: 'Sintonizza frequenza a caso',
    tune_next: 'succ ▸',
    tune_next_title: 'Frequenza successiva',
    tag_all: 'tutti',
    pick_origin_default: 'TRASMETTITORE AUTENTICATO',
    pick_origin_own: 'LA TUA FREQUENZA',
    pick_origin_badge_title: 'Clicca per visualizzare la scheda tecnica della stazione',
    jammed_banner_text: '<strong>Segnale Disturbato:</strong> Questo nodo è stato segnalato dai peer della rete Zen come sospetto o fraudolento.',
    jammed_override_btn: 'Sintonizza comunque',
    pick_loading: 'Caricamento frequenza...',
    pick_no_signal: '// Nessun segnale agganciato. Muovi la manopola della radio per sintonizzare una frequenza.',
    pick_no_reflection: '// Nessuna riflessione allegata.',
    action_save_cassetto: '★ Pick',
    action_saved_cassetto: '✓ Pick',
    tooltip_save_cassetto: 'Salva questo pick solo per te nel tuo cassetto privato locale',
    action_save_station: '📻 Stazione',
    action_saved_station: '✓ Stazione',
    tooltip_save_station: 'Salva questa stazione radio tra i tuoi preferiti nel cassetto',
    tooltip_saved_station: 'Rimuovi questa stazione dai tuoi preferiti',
    action_silent_nod: '~ Cenno',
    action_nod_sent: '~ Inviato',
    action_own_station: 'Tua Stazione',
    tooltip_silent_nod: 'Invia un cenno discreto e invisibile al trasmettitore',
    action_station_profile: 'ℹ Info',
    station_profile_title: 'Visualizza scheda tecnica, permalink e dettagli del nodo',
    action_copy_link: '⎘ Copia',
    copy_link_title: 'Copia link diretto a questa frequenza',
    report_btn_title: 'Segnala link sospetto/fraudolento o silenzia frequenza',
    action_rotate_track: '⟳ Nuova Traccia',
    action_rotate_bot: '⟳ Ruota Bot',
    action_rotating: '⟳ in arrivo...',
    tooltip_rotate_track: 'Richiedi una nuova traccia live per questo bot (Scorciatoia: R)',
    tooltip_rotate_bot: 'Ruota una stazione bot della rete su una nuova traccia live (Scorciatoia: R)',
    toast_bot_rotated: '✓ Nuova traccia live per @{bot}: "{title}"',
    toast_bot_rotate_error: 'Errore durante la rotazione dinamica: ',
    prof_btn_rotate_bot: '⟳ Ruota Brano Bot',

    // Transmitter
    transmitter_title: 'Il Tuo Slot Unico',
    slot_inactive: 'inattivo',
    slot_active: 'in onda',
    friction_locked_text: '<strong>Attrito Positivo attivo:</strong> Per poter aggiornare il tuo pick della giornata, devi prima ascoltare la rete. Salva almeno un pick o una stazione nel tuo cassetto o invia un cenno silenzioso a una frequenza.',
    friction_unlocked_text: '<strong>Attrito Positivo completato:</strong> Hai ascoltato la rete. Il tuo trasmettitore è sbloccato: irradia la tua frequenza.',
    friction_free_text: '<strong>Rete libera:</strong> Nessun altro nodo è attualmente in onda sulla rete Zen. Sei la prima frequenza attiva! Lo slot è sbloccato per avviare la trasmissione.',
    friction_free_btn_title: 'Pubblica il primo pick sulla rete',
    transmitter_prompt: 'Autenticati con <strong>login</strong> per attivare la tua frequenza. Ogni trasmissione sovrascrive istantaneamente la precedente: chi visita il tuo nodo vede solo ciò che ti ossessiona ora.',
    label_pick_url: 'Un Link (URL web o musica: YouTube, SoundCloud, Bandcamp, TuneCamp, Archive.org, MP3):',
    placeholder_pick_url: 'https://... (es. YouTube, SoundCloud, Bandcamp, TuneCamp, Internet Archive, MP3 o URL web)',
    compatible_audio_title: '🎵 Provider audio per #sound:',
    compatible_audio_title_all: '🌐 Destinazione URL:',
    non_sound_hint: '✦ Per i tag non-audio (#read, #obscureweb, #thought, #art, #code) puoi inserire qualsiasi link web valido.',
    status_detected_prefix: '✓ Rilevato: ',
    status_sound_invalid: '⚠ Provider audio non supportato per #sound',
    status_valid_web: '✓ Link web valido',
    label_pick_caption: 'Una Riga (Cosa ti sta ossessionando adesso?):',
    placeholder_pick_caption: 'Una sola riflessione, sensazione o motivazione (rigidamente max 140 caratteri)...',
    char_counter_hint: 'Nessun commento nidificato, nessun thread infinito.',
    label_pick_affinity: 'Affinità minima (Tag):',
    transmit_btn_locked: '🔒 Sblocca prima di trasmettere',
    transmit_btn_unlocked: '🔓 Irradia Frequenza',
    transmit_btn_sending: 'Irradiazione in corso...',
    transmit_btn_locked_title: 'Soddisfa l\'attrito positivo per sbloccare la trasmissione',
    transmit_btn_unlocked_title: 'Pubblica o sovrascrivi il tuo slot attivo',
    btn_broadcast_slot: 'Trasmetti sul tuo Slot',
    nods_received_title: 'Cenni silenziosi ricevuti dai tuoi ascoltatori',
    state_warning_callout: '// <strong>State over History:</strong> questo invio cancellerà e sovrascriverà per sempre il tuo pick precedente. Nessun archivio pubblico verrà conservato.',

    // Cassetto Modal
    cassetto_title: 'Il Tuo Cassetto Privato',
    cassetto_desc: 'Questo è il tuo archivio locale personale. I pick e le stazioni salvate rimangono solo in questo browser: nessun like pubblico, nessun contatore visibile agli altri.',
    btn_close: 'chiudi ✕',
    btn_export_json: 'esporta JSON',
    btn_export_md: 'esporta Markdown',
    btn_clear: 'svuota',
    btn_delete: 'elimina',
    btn_tune_station: '⏵ Sintonizza',
    tab_saved_picks: 'Pick',
    tab_saved_stations: 'Stazioni',
    tab_muted_stations: 'Silenziate',
    cassetto_empty: '// Il cassetto è vuoto.<br />Salva un pick ascoltato dalla radio per riporlo qui.',
    cassetto_stations_empty: '// Nessuna stazione preferita salvata.<br />Salva le tue frequenze preferite per risintonizzarle al volo.',
    muted_desc: 'Frequenze che hai silenziato dal tuo ricevitore radio:',
    muted_empty: '// Nessuna stazione attualmente silenziata.',
    muted_station_desc: '// Frequenza silenziata.',
    btn_restore: 'ripristina',
    station_on_air: 'in onda',
    station_offline: 'offline',
    prof_save_station: '★ Salva Stazione',
    prof_saved_station: '✓ Stazione Salvata',

    // Auth Modal
    auth_title: 'Nodo Trasmettitore / Login',
    auth_desc: 'Le chiavi crittografiche del tuo nodo sono derivate deterministicamente (PBKDF2 SHA-256) sul tuo dispositivo. Nessun dato personale è inviato a server centrali.',
    auth_user_label: 'Nome Nodo / Alias:',
    auth_user_placeholder: 'es. scobru, radio-zero...',
    auth_pass_label: 'Passphrase Crittografica:',
    auth_pass_placeholder: 'Passphrase segreta...',
    btn_quick_guest: 'genera chiave casuale',
    btn_quick_guest_title: 'Crea un\'identità temporanea generata sul momento',
    btn_generating: 'Generazione...',
    btn_deriving: 'Derivazione chiavi...',
    btn_cancel: 'annulla',
    btn_activate_node: 'attiva nodo',
    auth_alert_required: 'Inserisci nome nodo e passphrase.',
    auth_alert_crypto_err: 'Errore crittografico: ',

    // Sigils
    sigil_own_title: 'Sigillo crittografico del tuo nodo',
    sigil_station_title: 'Sigillo crittografico della stazione',
    sigil_node_title: 'Sigillo crittografico del nodo',
    sigil_unique_title: 'Sigillo crittografico univoco della stazione',

    // Station Profile Modal
    profile_title: 'Scheda Stazione · Live Frequency',
    profile_desc: 'Identità crittografica del nodo e frequenza attiva. <em>State over History:</em> non esiste archivio pubblico o profilo-museo, visualizzi solo l\'ossessione del momento.',
    profile_fm_freq: 'Frequenza FM:',
    profile_node_id: 'Identità Nodo:',
    profile_crypto_key: 'Chiave Crittografica:',
    profile_on_air_since: 'In onda da:',
    profile_permalink: 'Permalink Stazione:',
    btn_copy_pub: 'copia chiave',
    btn_copy_pub_title: 'Copia chiave pubblica completa',
    btn_copy_link: 'copia link',
    btn_copy_link_title: 'Copia permalink',
    profile_btn_mute: 'Silenzia questa Stazione',
    profile_btn_unmute: 'Ripristina Stazione',
    profile_btn_report: 'Segnala Link ⚠',
    prompt_copy_pubkey: 'Copia chiave pubblica:',
    prompt_copy_link: 'Copia permalink:',

    // Report Modal
    report_modal_title: 'Segnala o Silenzia Frequenza',
    report_modal_desc: 'onepick è una rete P2P decentralizzata. La moderazione si basa su <strong>autonomia personale</strong> (silenziamento locale) e <strong>Community Jamming</strong> (segnalazione mesh condivisa).',
    report_local_title: '1. Silenziamento Locale (Solo per te)',
    report_local_desc: 'Il tuo ricevitore radio salterà automaticamente questa frequenza durante la rotazione. Puoi ripristinarla quando vuoi dal tuo Cassetto.',
    btn_execute_local_mute: '🔇 Silenzia questa stazione sul mio browser',
    report_community_title: '2. Segnalazione alla Rete P2P (Community Jamming)',
    report_community_desc: 'Invia una segnalazione crittografica sulla rete Zen. Se una frequenza riceve segnalazioni concordanti, l\'etere simulerà un disturbo radio oscurando il contenuto preventivamente.',
    report_reason_label: 'Motivo della segnalazione:',
    opt_phishing: 'Phishing / Tentativo di truffa o furto credenziali',
    opt_malware: 'Malware / Download pericoloso o ingannevole',
    opt_spam: 'Spam / Bot o aggregatore automatico non umano',
    opt_abusive: 'Contenuto illegale o lesivo',
    btn_execute_community_report: '⚠️ Irradia segnalazione sulla rete Zen',

    // Tutorial Modal
    tutorial_modal_title: 'Guida Introduttiva · Come Funziona onepick',
    tutorial_dont_show: 'Non mostrare più all\'avvio',
    tutorial_btn_prev: '◂ Precedente',
    tutorial_btn_next: 'Successivo ▸',
    tutorial_btn_finish: 'Inizia ad ascoltare 🚀',

    // Toasts & Messages
    toast_link_copied: 'Permalink stazione copiato negli appunti!',
    toast_pubkey_copied: 'Chiave crittografica copiata negli appunti!',
    toast_saved_cassetto: 'Pick salvato nel tuo cassetto privato!',
    toast_cassetto_removed: 'Rimosso dal cassetto privato.',
    toast_station_saved: 'Stazione salvata nei preferiti del cassetto!',
    toast_station_removed: 'Stazione rimossa dai preferiti.',
    toast_tuned_station: 'Sintonizzato su {station}',
    toast_nod_sent: 'Cenno silenzioso inviato al trasmettitore!',
    toast_nod_sent_private: '✓ Cenno inviato privatamente all\'autore! (Invisibile al pubblico)',
    toast_cannot_nod_self: 'Non puoi inviare un cenno alla tua stessa frequenza.',
    toast_already_nodded: 'Hai già inviato un cenno per questo pick.',
    toast_muted: 'Frequenza silenziata sul tuo browser.',
    toast_unmuted: 'Frequenza ripristinata nel ricevitore.',
    toast_community_reported: '⚠️ Segnalazione irradiata sulla rete Zen P2P!',
    toast_cassetto_cleared: 'Cassetto privato svuotato.',
    toast_jammed_override: 'Segnale sintonizzato a tuo rischio.',
    toast_logged_out: 'Disconnesso dal nodo.',
    toast_guest_ready: 'Identità casuale generata! Benvenuto.',
    toast_transmit_success: '✓ Slot aggiornato con successo! Frequenza attiva in onda.',
    toast_slot_error: 'Errore durante la pubblicazione sullo slot: ',
    toast_radio_powered_on: '📻 Ricevitore acceso: autoplay continuo e fruscio sbloccati!',
    toast_radio_powered_off: 'Autoplay radio disattivato (player in-page ancora utilizzabili).',
    toast_friction_cleared_save: '✓ Pick salvato nel cassetto. Attrito positivo superato: trasmettitore sbloccato!',
    toast_friction_cleared_nod: '✓ Cenno silenzioso inviato. Attrito positivo superato: trasmettitore sbloccato!',
    toast_login_required: 'Autenticati prima con login per trasmettere.',
    toast_friction_required: 'Attrito Positivo attivo: salva prima un pick o invia un cenno per sbloccare.',
    toast_invalid_url: 'Inserisci un URL valido.',
    toast_sound_provider_required: 'Per il tag #sound devi inserire un link audio valido e riproducibile (YouTube, SoundCloud, Bandcamp, TuneCamp, Internet Archive, Audius, Mixcloud, Spotify, SomaFM o stream .mp3).',
    toast_char_limit: 'Il testo supera rigidamente i 140 caratteri!',
    toast_no_signal_band: 'Nessun segnale attivo su questa banda.',
    toast_no_signal_mesh: 'Nessun segnale attivo sulla rete.',
    toast_enjoy: 'Buon ascolto su onepick!',
    toast_lang_switched: 'Lingua impostata in Italiano',
    confirm_clear_cassetto: 'Vuoi davvero svuotare il tuo cassetto privato?',
    nods_received_prefix: '~ ',
    nods_received_singular: 'cenno ricevuto',
    nods_received_plural: 'cenni ricevuti',
    nods_short_singular: 'cenno',
    nods_short_plural: 'cenni',
    btn_view_picks: 'vedi pick ({n})',
    btn_muted_stations: 'silenziate ({n})',
    profile_node_active: 'nodo attivo',
    profile_node_transmitter: 'nodo trasmettitore',
    cassetto_node_label: 'nodo',
    toast_node_ready_prefix: 'Nodo ',
    toast_node_ready_suffix: ' attivo. Frequenza pronta.',
    auth_badge_pubkey_title: 'Chiave pubblica: ',

    // Canvas Mode
    canvas_btn: '⛶ canvas',
    canvas_btn_exit: '✕ esci',
    canvas_btn_title: 'Modalità Canvas: centra solo il box radio e nasconde il resto',
    canvas_exit: '✕ esci dal canvas (Esc)',
    canvas_exit_title: 'Esci dalla modalità canvas (Esc)',
    canvas_label: 'canvas',
    toast_canvas_on: 'Modalità Canvas attiva (premi Esc per uscire)',
    toast_canvas_off: 'Modalità Canvas disattivata',

    // Footer
    footer_by: 'un progetto di',
    footer_website: 'sito',
    footer_tc_philosophy: 'stessa filosofia: musica decentralizzata, etere aperto e ascolto non algoritmico'
  },
  en: {
    // Meta
    meta_title: 'onepick / active frequency',
    meta_desc: 'onepick — A state, not an archive. Replaces infinite feeds with a single active cultural frequency. Decentralized P2P protocol on Zen.',

    // Header & Brand
    power_btn_on: 'TURN ON RADIO',
    power_btn_off: 'TURN OFF RADIO',
    power_btn_title: 'Turn on / off sound receiver (unlocks audio and analog static)',
    lang_btn_label: 'IT',
    lang_btn_title: 'Switch to Italian / Passa a Italiano',
    theme_toggle_title: 'Toggle light / dark theme',
    tutorial_trigger_title: 'Guide & tutorial / Guida e tutorial',
    nav_guide: 'guide ?',
    nav_cassetto: 'drawer ',
    cassetto_trigger_title: 'Open your private local drawer',
    nav_login: 'login',
    login_trigger_title: 'Login to your transmitter node',
    nav_logout: 'logout',
    logout_btn_title: 'Disconnect node',
    bio_text: 'A state, not an archive · single active frequency · positive friction · P2P on Zen',
    relay_connecting: 'connecting',
    relay_online: 'online',
    online_stations_prefix: 'stations on air: ',

    // Radio Tuner
    radio_section_title: 'Radio Tuner',
    badge_tuned: 'tuned',
    badge_own_frequency: 'your frequency',
    badge_node_prefix: 'NODE',
    badge_transmitter_prefix: 'TRANSMITTER',
    peer_scanning: 'node: scanning...',
    peer_label: 'node: ',
    scale_title: 'Click or drag to tune manually',
    tune_prev: '◂ prev',
    tune_prev_title: 'Previous frequency',
    tune_random: '⚄ random',
    tune_random_title: 'Tune random frequency',
    tune_next: 'next ▸',
    tune_next_title: 'Next frequency',
    tag_all: 'all',
    pick_origin_default: 'AUTHENTICATED TRANSMITTER',
    pick_origin_own: 'YOUR FREQUENCY',
    pick_origin_badge_title: 'Click to view station specs',
    jammed_banner_text: '<strong>Jammed Signal:</strong> This node was reported by Zen network peers as suspicious or fraudulent.',
    jammed_override_btn: 'Tune anyway',
    pick_loading: 'Loading frequency...',
    pick_no_signal: '// No signal locked. Adjust the radio tuner to pick up a frequency.',
    pick_no_reflection: '// No reflection attached.',
    action_save_cassetto: '★ Pick',
    action_saved_cassetto: '✓ Pick',
    tooltip_save_cassetto: 'Save this pick for yourself in your private local drawer',
    action_save_station: '📻 Station',
    action_saved_station: '✓ Station',
    tooltip_save_station: 'Save this station to your favorites in drawer',
    tooltip_saved_station: 'Remove this station from favorites',
    action_silent_nod: '~ Nod',
    action_nod_sent: '~ Sent',
    action_own_station: 'Your Station',
    tooltip_silent_nod: 'Send a quiet, invisible nod to the transmitter',
    action_station_profile: 'ℹ Specs',
    station_profile_title: 'View station specs, permalink and node details',
    action_copy_link: '⎘ Copy',
    copy_link_title: 'Copy direct link to this frequency',
    report_btn_title: 'Report suspicious/fraudulent link or mute frequency',
    action_rotate_track: '⟳ New Track',
    action_rotate_bot: '⟳ Rotate Bot',
    action_rotating: '⟳ fetching...',
    tooltip_rotate_track: 'Request a new live track for this bot (Shortcut: R)',
    tooltip_rotate_bot: 'Rotate a network bot station to a new live track (Shortcut: R)',
    toast_bot_rotated: '✓ New live track for @{bot}: "{title}"',
    toast_bot_rotate_error: 'Error during dynamic rotation: ',
    prof_btn_rotate_bot: '⟳ Rotate Bot Track',

    // Transmitter
    transmitter_title: 'Your Single Slot',
    slot_inactive: 'inactive',
    slot_active: 'on air',
    friction_locked_text: '<strong>Positive Friction active:</strong> To update your pick of the day, you must first listen to the network. Save at least one pick or station to your drawer or send a silent nod to a station.',
    friction_unlocked_text: '<strong>Positive Friction completed:</strong> You listened to the network. Your transmitter is unlocked: broadcast your frequency.',
    friction_free_text: '<strong>Open network:</strong> No other node is currently on air on the Zen mesh. You are the first active frequency! Your slot is unlocked to start broadcasting.',
    friction_free_btn_title: 'Publish the first pick to the network',
    transmitter_prompt: 'Authenticate via <strong>login</strong> to activate your frequency. Every transmission instantly overwrites the previous one: visitors see only what obsesses you now.',
    label_pick_url: 'A Link (Web URL or music: YouTube, SoundCloud, Bandcamp, TuneCamp, Archive.org, MP3):',
    placeholder_pick_url: 'https://... (e.g. YouTube, SoundCloud, Bandcamp, TuneCamp, Internet Archive, MP3 or web URL)',
    compatible_audio_title: '🎵 Audio providers for #sound:',
    compatible_audio_title_all: '🌐 URL Destination:',
    non_sound_hint: '✦ For non-audio tags (#read, #obscureweb, #thought, #art, #code) you can enter any valid web link.',
    status_detected_prefix: '✓ Detected: ',
    status_sound_invalid: '⚠ Unsupported audio provider for #sound',
    status_valid_web: '✓ Valid web link',
    label_pick_caption: 'One Line (What is obsessing you right now?):',
    placeholder_pick_caption: 'A single reflection, sensation or motivation (strictly max 140 characters)...',
    char_counter_hint: 'No nested comments, no endless threads.',
    label_pick_affinity: 'Minimal affinity (Tag):',
    transmit_btn_locked: '🔒 Unlock before broadcasting',
    transmit_btn_unlocked: '🔓 Broadcast Frequency',
    transmit_btn_sending: 'Broadcasting...',
    transmit_btn_locked_title: 'Complete positive friction to unlock broadcasting',
    transmit_btn_unlocked_title: 'Publish or overwrite your active slot',
    btn_broadcast_slot: 'Broadcast to your Slot',
    nods_received_title: 'Silent nods received from your listeners',
    state_warning_callout: '// <strong>State over History:</strong> this submission will permanently erase and overwrite your previous pick. No public archive will be kept.',

    // Cassetto Modal
    cassetto_title: 'Your Private Drawer',
    cassetto_desc: 'This is your personal local archive. Saved picks and stations stay only in this browser: no public likes, no vanity counters visible to others.',
    btn_close: 'close ✕',
    btn_export_json: 'export JSON',
    btn_export_md: 'export Markdown',
    btn_clear: 'clear',
    btn_delete: 'delete',
    btn_tune_station: '⏵ Tune in',
    tab_saved_picks: 'Picks',
    tab_saved_stations: 'Stations',
    tab_muted_stations: 'Muted',
    cassetto_empty: '// Your drawer is empty.<br />Save a pick heard on the radio to store it here.',
    cassetto_stations_empty: '// No favorite stations saved.<br />Save your favorite stations to retune them quickly.',
    muted_desc: 'Frequencies you have muted from your radio receiver:',
    muted_empty: '// No stations currently muted.',
    muted_station_desc: '// Muted frequency.',
    btn_restore: 'restore',
    station_on_air: 'on air',
    station_offline: 'offline',
    prof_save_station: '★ Save Station',
    prof_saved_station: '✓ Station Saved',

    // Auth Modal
    auth_title: 'Transmitter Node / Login',
    auth_desc: 'Cryptographic keys for your node are deterministically derived (PBKDF2 SHA-256) locally on your device. No personal data is sent to central servers.',
    auth_user_label: 'Node Name / Alias:',
    auth_user_placeholder: 'e.g. scobru, radio-zero...',
    auth_pass_label: 'Cryptographic Passphrase:',
    auth_pass_placeholder: 'Secret passphrase...',
    btn_quick_guest: 'generate random key',
    btn_quick_guest_title: 'Generate a temporary random identity',
    btn_generating: 'Generating...',
    btn_deriving: 'Deriving keys...',
    btn_cancel: 'cancel',
    btn_activate_node: 'activate node',
    auth_alert_required: 'Please enter node alias and passphrase.',
    auth_alert_crypto_err: 'Cryptographic error: ',

    // Sigils
    sigil_own_title: 'Cryptographic sigil of your node',
    sigil_station_title: 'Cryptographic sigil of the station',
    sigil_node_title: 'Cryptographic sigil of the node',
    sigil_unique_title: 'Unique cryptographic sigil of the station',

    // Station Profile Modal
    profile_title: 'Station Specs · Live Frequency',
    profile_desc: 'Node cryptographic identity and active frequency. <em>State over History:</em> there is no public archive or museum profile, you see only the current obsession.',
    profile_fm_freq: 'FM Frequency:',
    profile_node_id: 'Node Identity:',
    profile_crypto_key: 'Cryptographic Key:',
    profile_on_air_since: 'On air since:',
    profile_permalink: 'Station Permalink:',
    btn_copy_pub: 'copy key',
    btn_copy_pub_title: 'Copy full public key',
    btn_copy_link: 'copy link',
    btn_copy_link_title: 'Copy permalink',
    profile_btn_mute: 'Mute this Station',
    profile_btn_unmute: 'Restore Station',
    profile_btn_report: 'Report Link ⚠',
    prompt_copy_pubkey: 'Copy public key:',
    prompt_copy_link: 'Copy permalink:',

    // Report Modal
    report_modal_title: 'Report or Mute Frequency',
    report_modal_desc: 'onepick is a decentralized P2P network. Moderation is powered by <strong>personal autonomy</strong> (local mute) and <strong>Community Jamming</strong> (shared mesh report).',
    report_local_title: '1. Local Mute (Only for you)',
    report_local_desc: 'Your radio receiver will automatically skip this frequency during tuning. You can restore it anytime from your Drawer.',
    btn_execute_local_mute: '🔇 Mute this station on my browser',
    report_community_title: '2. Mesh Network Report (Community Jamming)',
    report_community_desc: 'Radiate a cryptographic report on the Zen network. If a station accumulates concordant reports, the ether will simulate radio static and shield the content.',
    report_reason_label: 'Reason for report:',
    opt_phishing: 'Phishing / Attempted scam or credential theft',
    opt_malware: 'Malware / Dangerous or misleading download',
    opt_spam: 'Spam / Bot or automated non-human feed',
    opt_abusive: 'Illegal or abusive content',
    btn_execute_community_report: '⚠️ Radiate report on Zen network',

    // Tutorial Modal
    tutorial_modal_title: 'Introductory Guide · How onepick Works',
    tutorial_dont_show: 'Don\'t show again on startup',
    tutorial_btn_prev: '◂ Previous',
    tutorial_btn_next: 'Next ▸',
    tutorial_btn_finish: 'Start Tuning 🚀',

    // Toasts & Messages
    toast_link_copied: 'Station frequency permalink copied to clipboard!',
    toast_pubkey_copied: 'Cryptographic key copied to clipboard!',
    toast_saved_cassetto: 'Pick saved to your private drawer!',
    toast_cassetto_removed: 'Removed from private drawer.',
    toast_station_saved: 'Station saved to your drawer favorites!',
    toast_station_removed: 'Station removed from favorites.',
    toast_tuned_station: 'Tuned into {station}',
    toast_nod_sent: 'Silent nod sent to transmitter!',
    toast_nod_sent_private: '✓ Silent nod sent privately to the author! (Invisible to the public)',
    toast_cannot_nod_self: 'You cannot send a nod to your own frequency.',
    toast_already_nodded: 'You have already sent a nod for this pick.',
    toast_muted: 'Frequency muted on your browser.',
    toast_unmuted: 'Frequency restored to receiver.',
    toast_community_reported: '⚠️ Report radiated on Zen P2P mesh network!',
    toast_cassetto_cleared: 'Private drawer cleared.',
    toast_jammed_override: 'Signal tuned at your own risk.',
    toast_logged_out: 'Disconnected from node.',
    toast_guest_ready: 'Random identity generated! Welcome.',
    toast_transmit_success: '✓ Slot updated successfully! Active frequency on air.',
    toast_slot_error: 'Error broadcasting slot: ',
    toast_radio_powered_on: '📻 Receiver on: continuous playback and analog static unlocked!',
    toast_radio_powered_off: 'Radio autoplay disabled (in-page players still usable).',
    toast_friction_cleared_save: '✓ Pick saved to drawer. Positive friction passed: transmitter unlocked!',
    toast_friction_cleared_nod: '✓ Silent nod sent. Positive friction passed: transmitter unlocked!',
    toast_login_required: 'Authenticate first via login to broadcast.',
    toast_friction_required: 'Positive Friction active: save a pick or send a nod to unlock first.',
    toast_invalid_url: 'Please enter a valid URL.',
    toast_sound_provider_required: 'For the #sound tag, please provide a playable audio link from a supported provider (YouTube, SoundCloud, Bandcamp, TuneCamp, Internet Archive, Audius, Mixcloud, Spotify, SomaFM or .mp3 stream).',
    toast_char_limit: 'Text strictly exceeds 140 characters!',
    toast_no_signal_band: 'No active signal on this band.',
    toast_no_signal_mesh: 'No active signal on the network.',
    toast_enjoy: 'Enjoy tuning into onepick!',
    toast_lang_switched: 'Language switched to English',
    confirm_clear_cassetto: 'Do you really want to clear your private drawer?',
    nods_received_prefix: '~ ',
    nods_received_singular: 'nod received',
    nods_received_plural: 'nods received',
    nods_short_singular: 'nod',
    nods_short_plural: 'nods',
    btn_view_picks: 'view picks ({n})',
    btn_muted_stations: 'muted ({n})',
    profile_node_active: 'active node',
    profile_node_transmitter: 'transmitter node',
    cassetto_node_label: 'node',
    toast_node_ready_prefix: 'Node ',
    toast_node_ready_suffix: ' active. Frequency ready.',
    auth_badge_pubkey_title: 'Public key: ',

    // Canvas Mode
    canvas_btn: '⛶ canvas',
    canvas_btn_exit: '✕ exit',
    canvas_btn_title: 'Canvas Mode: center radio box only and hide everything else',
    canvas_exit: '✕ exit canvas (Esc)',
    canvas_exit_title: 'Exit canvas mode (Esc)',
    canvas_label: 'canvas',
    toast_canvas_on: 'Canvas mode active (press Esc to exit)',
    toast_canvas_off: 'Canvas mode exited',

    // Footer
    footer_by: 'a project by',
    footer_website: 'website',
    footer_tc_philosophy: 'shared philosophy: decentralized music, open ether & anti-algorithmic listening'
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
      desc: "Sintonizza le stazioni dei peer P2P ruotando la scala o con i tasti [ prec ], [ succ ] e [ a caso ]. Salva le stazioni preferite con [ 📻 Stazione ] per risintonizzarle al volo dal Cassetto. Clicca su [ ACCENDI RADIO ] per sbloccare l'audio nel browser con musica da Internet Archive, TuneCamp, Spotify, Bandcamp, SoundCloud o YouTube.",
      callout: "// Sintonizzazione FM: 88.00 - 108.00 MHz · salva stazioni e riascoltale quando vuoi."
    },
    en: {
      badge: 'STEP 02 / 05',
      title: "The Radio & Integrated Audio",
      desc: "Tune into live P2P peer stations using the FM dial or the [ prev ], [ next ] and [ random ] buttons. Bookmark favorite frequencies via [ 📻 Station ] to quickly retune them from your Drawer. Click [ TURN ON RADIO ] to unlock browser audio from Internet Archive, TuneCamp, Spotify, Bandcamp, SoundCloud or YouTube.",
      callout: "// FM Tuning: 88.00 - 108.00 MHz · bookmark stations and tune back anytime."
    }
  },
  {
    step: 3,
    it: {
      badge: 'STEP 03 / 05',
      title: "Attrito Positivo & Cassetto Privato",
      desc: "Per poter trasmettere devi prima ascoltare la rete: il trasmettitore si sblocca salvando un pick o una stazione nel tuo Cassetto Privato, oppure inviando un Cenno Silenzioso (~). Nel Cassetto puoi custodire sia singoli pick culturali sia intere stazioni radio preferite da risintonizzare in qualsiasi momento.",
      callout: "// Regola d'oro: Ascolta e rifletti prima di trasmettere · zero vanità, 100% rispetto."
    },
    en: {
      badge: 'STEP 03 / 05',
      title: "Positive Friction & Private Drawer",
      desc: "To broadcast your frequency you must first listen to the network: your transmitter unlocks after saving a pick or station to your Private Drawer, or sending a Silent Nod (~). Your Drawer stores both individual picks and favorite radio stations ready to be re-tuned at will.",
      callout: "// Golden rule: Listen and absorb before broadcasting · zero vanity, 100% respect."
    }
  },
  {
    step: 4,
    it: {
      badge: 'STEP 04 / 05',
      title: "Il Tuo Slot Unico (1 Link, 1 Riga)",
      desc: "Accedi con [ login ] creando la tua identità locale. Hai un solo slot: un link e max 140 caratteri. Se scegli il tag #sound, inserisci esclusivamente tracce audio da provider supportati (YouTube, SoundCloud, Bandcamp, TuneCamp, Internet Archive, Spotify o stream .mp3). Con gli altri tag (#read, #obscureweb, #art, #code) puoi condividere qualsiasi URL web.",
      callout: "// Trasparenza crittografica: Chiavi derivate localmente nel tuo browser con PBKDF2."
    },
    en: {
      badge: 'STEP 04 / 05',
      title: "Your Single Slot (1 Link, 1 Line)",
      desc: "Log in via [ login ] to create your local identity. You hold one slot: a link and max 140 characters. For the #sound tag, only playable audio providers are accepted (YouTube, SoundCloud, Bandcamp, TuneCamp, Internet Archive, Spotify, or .mp3 stream). For other tags (#read, #obscureweb, #art, #code), any valid web URL is allowed.",
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
    langText.textContent = lang === 'it' ? 'EN' : 'IT';
  }
  if (tutorialLangText) {
    tutorialLangText.textContent = lang === 'it' ? 'EN' : 'IT';
  }
  if (langToggleBtn) {
    langToggleBtn.title = t('lang_btn_title');
  }
  if (tutorialLangBtn) {
    tutorialLangBtn.title = t('lang_btn_title');
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

  // Update document title and meta description
  document.title = t('meta_title');
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', t('meta_desc'));

  // Update power toggle button label
  if (powerToggleBtn) {
    powerToggleBtn.classList.toggle('active', isRadioOn);
  }
  if (powerIcon) {
    powerIcon.textContent = isRadioOn ? '🔈' : '⏻';
  }
  if (powerText) {
    powerText.textContent = isRadioOn ? t('power_btn_off') : t('power_btn_on');
  }

  // Update canvas toggle button label
  if (canvasBtnText) {
    canvasBtnText.textContent = isCanvasMode ? t('canvas_btn_exit') : t('canvas_btn');
  }

  // Update cassetto badge
  updateCassettoBadge();

  // Update muted stations toggle button label
  updateMutedCountBadge();

  // Update friction status
  updateFrictionUI();

  // Update online stations count
  updateStationsCounter();

  // Update relay status
  updateRelayStatus(isRelayConnected);

  // Update auth controls & transmitter UI state
  if (currentPair) {
    if (authorBadge) {
      authorBadge.title = `${t('auth_badge_pubkey_title')}${currentPair.pub}`;
    }
    if (slotStatusBadge) {
      slotStatusBadge.textContent = t('slot_active');
    }
    if (nodsReceivedBadge) {
      nodsReceivedBadge.textContent = `${t('nods_received_prefix')}${myNodsCount} ${myNodsCount === 1 ? t('nods_received_singular') : t('nods_received_plural')}`;
    }
  } else {
    if (transmitterPrompt) {
      transmitterPrompt.innerHTML = t('transmitter_prompt');
    }
    if (slotStatusBadge) {
      slotStatusBadge.textContent = t('slot_inactive');
    }
  }

  // Update transmitter URL validation panel
  updateUrlValidationUI();

  // If station tuned, refresh dynamic station card UI
  if (activeStationPub && stationsMap.has(activeStationPub)) {
    refreshStationCardUI(stationsMap.get(activeStationPub));
  } else {
    renderEmptyRadioState();
  }

  // If profile modal is open, refresh it
  if (stationProfileModal && !stationProfileModal.classList.contains('hidden') && activeStationPub) {
    openStationProfile(activeStationPub);
  }

  // If cassetto modal is open, refresh it
  if (cassettoModal && !cassettoModal.classList.contains('hidden')) {
    if (showingMutedTab) {
      renderMutedStationsTab();
    } else {
      renderCassettoModal();
    }
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
  if (tutorialLangText) {
    tutorialLangText.textContent = currentLang === 'it' ? 'EN' : 'IT';
  }
  if (tutorialLangBtn) {
    tutorialLangBtn.title = t('lang_btn_title');
  }
  if (tutorialDontShowCheckbox) {
    tutorialDontShowCheckbox.checked = localStorage.getItem('onepick_tutorial_dont_show') === 'true';
  }
  tutorialModal?.classList.remove('hidden');
}

function closeTutorialModal() {
  tutorialModal?.classList.add('hidden');
  if (tutorialDontShowCheckbox && tutorialDontShowCheckbox.checked) {
    localStorage.setItem('onepick_tutorial_dont_show', 'true');
  } else {
    localStorage.removeItem('onepick_tutorial_dont_show');
  }
}

function nextTutorialStep() {
  if (currentTutorialStep < TOTAL_TUTORIAL_STEPS) {
    renderTutorialStep(currentTutorialStep + 1);
  } else {
    closeTutorialModal();
    showToast(t('toast_enjoy'));
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
    showToast(t('toast_lang_switched'));
  });

  tutorialLangBtn?.addEventListener('click', () => {
    const nextLang = currentLang === 'it' ? 'en' : 'it';
    setLanguage(nextLang);
    showToast(t('toast_lang_switched'));
  });

  tutorialTrigger?.addEventListener('click', () => {
    openTutorialModal(1);
  });

  tutorialDontShowCheckbox?.addEventListener('change', () => {
    if (tutorialDontShowCheckbox.checked) {
      localStorage.setItem('onepick_tutorial_dont_show', 'true');
    } else {
      localStorage.removeItem('onepick_tutorial_dont_show');
    }
  });

  tutorialModal?.addEventListener('click', (e) => {
    if (e.target === tutorialModal) {
      closeTutorialModal();
    }
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
    themeText.textContent = theme === 'dark' ? 'light' : 'dark';
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
    showToast(t('toast_friction_cleared_save'));
  } else if (reason === 'nod') {
    showToast(t('toast_friction_cleared_nod'));
  }
}

function hasPeerStations() {
  const activeStations = Array.from(stationsMap.values()).filter(s => isStationActive(s));
  if (activeStations.length === 0) return false;
  if (currentPair && activeStations.length === 1 && activeStations[0].pub === currentPair.pub) return false;
  return true;
}

function updateFrictionUI() {
  if (!frictionBox) return;

  if (!hasPeerStations()) {
    // Cold start: no other peers currently on the network
    frictionBox.className = 'friction-box unlocked';
    if (frictionIcon) frictionIcon.textContent = '🔓';
    if (frictionText) {
      frictionText.innerHTML = t('friction_free_text');
    }
    if (transmitBtn) {
      transmitBtn.disabled = false;
      transmitBtn.textContent = t('btn_broadcast_slot');
      transmitBtn.title = t('friction_free_btn_title');
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
      transmitBtn.textContent = t('btn_broadcast_slot');
      transmitBtn.title = t('transmit_btn_unlocked_title');
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
      transmitBtn.title = t('transmit_btn_locked_title');
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
  const active = all.filter(s => isStationActive(s));
  const unmuted = active.filter(s => !mutedStations.has(s.pub) || s.pub === activeStationPub);
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

let cachedTuningStaticBuffer = null;
let cachedJammingStaticBuffer = null;

function getTuningStaticBuffer() {
  if (!audioCtx) return null;
  if (cachedTuningStaticBuffer) return cachedTuningStaticBuffer;
  try {
    const sampleRate = audioCtx.sampleRate;
    const duration = 0.22;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.exp(-i / (bufferSize * 0.7));
      const crackle = Math.random() > 0.96 ? (Math.random() * 2 - 1) * 1.5 : (Math.random() * 2 - 1) * 0.6;
      data[i] = crackle * decay;
    }
    cachedTuningStaticBuffer = buffer;
    return buffer;
  } catch (e) {
    return null;
  }
}

function getJammingStaticBuffer() {
  if (!audioCtx) return null;
  if (cachedJammingStaticBuffer) return cachedJammingStaticBuffer;
  try {
    const sampleRate = audioCtx.sampleRate;
    const duration = 0.38;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      const buzz = Math.sin(2 * Math.PI * 130 * (i / sampleRate));
      data[i] = (white * 0.65 + buzz * 0.35) * 0.3;
    }
    cachedJammingStaticBuffer = buffer;
    return buffer;
  } catch (e) {
    return null;
  }
}

function playTuningStatic(duration = 0.22) {
  if (!isRadioOn) return;
  initAudioContext();
  if (!audioCtx) return;

  try {
    const buffer = getTuningStaticBuffer();
    if (!buffer) return;

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
    const buffer = getJammingStaticBuffer();
    if (!buffer) return;

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

  // TuneCamp (sudorecords.scobrudot.dev, tunecamp domains, or routes with /releases/, /albums/, /tracks/, /share/, /embed/)
  const isTuneCampDomain = url.includes('sudorecords') || url.includes('tunecamp') || url.includes('scobrudot.dev');
  const tuneCampPathMatch = url.match(/(?:https?:\/\/[^\/]+)?\/(?:embed\/(?:share\/)?)?(releases?|albums?|tracks?|share)\/([^\/?#]+)/i);
  if ((isTuneCampDomain || tuneCampPathMatch) && !url.includes('github.com') && !url.includes('gitlab.com')) {
    try {
      const parsedUrl = new URL(url);
      const pathMatch = parsedUrl.pathname.match(/\/(?:embed\/(?:share\/)?)?(releases?|albums?|tracks?|share)\/([^\/?#]+)/i);
      if (pathMatch) {
        const rawKind = pathMatch[1].toLowerCase().replace(/s$/, '');
        const slug = pathMatch[2];
        const isTrack = rawKind === 'track';
        return {
          type: 'tunecamp',
          origin: parsedUrl.origin,
          kind: rawKind,
          slug: slug,
          embedUrl: `${parsedUrl.origin}/embed/${isTrack ? 'track' : 'release'}/${slug}`,
          rawUrl: url
        };
      }
    } catch (e) {}
  }

  // Internet Archive (audio items, details, embed)
  const iaMatch = url.match(/(?:https?:\/\/)?(?:www\.)?archive\.org\/(?:details|embed)\/([a-zA-Z0-9_\-\.]+)/i);
  if (iaMatch && iaMatch[1]) {
    const iaId = iaMatch[1];
    return {
      type: 'archiveorg',
      id: iaId,
      embedUrl: `https://archive.org/embed/${iaId}`,
      rawUrl: url
    };
  }

  // Audius (embed or track link)
  const audiusEmbedMatch = url.match(/(?:https?:\/\/)?(?:www\.)?audius\.co\/embed\/track\/([a-zA-Z0-9]+)/i);
  if (audiusEmbedMatch && audiusEmbedMatch[1]) {
    return {
      type: 'audius',
      id: audiusEmbedMatch[1],
      embedUrl: `https://audius.co/embed/track/${audiusEmbedMatch[1]}?flavor=compact`,
      rawUrl: url
    };
  }
  const audiusTrackMatch = url.match(/(?:https?:\/\/)?(?:www\.)?audius\.co\/(?!trending|search|feed|audio|settings|legal|signup|login)([a-zA-Z0-9_\.]+)\/([a-zA-Z0-9_\-]+)/i);
  if (audiusTrackMatch && audiusTrackMatch[1] && audiusTrackMatch[2]) {
    return {
      type: 'audius',
      handle: audiusTrackMatch[1],
      slug: audiusTrackMatch[2],
      rawUrl: url
    };
  }

  // Mixcloud (user/show)
  const mixcloudMatch = url.match(/(?:https?:\/\/)?(?:www\.)?mixcloud\.com\/(?!categories|tag|developers|about|competitions)([a-zA-Z0-9_\-]+)\/([a-zA-Z0-9_\-]+)/i);
  if (mixcloudMatch && mixcloudMatch[1] && mixcloudMatch[2]) {
    const mcUser = mixcloudMatch[1];
    const mcSlug = mixcloudMatch[2];
    const canonicalShowUrl = `https://www.mixcloud.com/${mcUser}/${mcSlug}/`;
    return {
      type: 'mixcloud',
      user: mcUser,
      slug: mcSlug,
      embedUrl: `https://www.mixcloud.com/widget/iframe/?feed=${encodeURIComponent(canonicalShowUrl)}&hide_cover=1`,
      rawUrl: url
    };
  }

  // SomaFM & Direct Audio streams / files
  const isSomaFm = /(?:https?:\/\/)?(?:[a-z0-9\-_]+\.)?somafm\.com/i.test(url);
  const isAudioFileOrStream = isSomaFm
    || /\.(mp3|ogg|wav|m4a|aac|flac)(\?.*)?$/i.test(url)
    || /-(?:128|64|32|256|320)?-?(?:mp3|aac|ogg)(\?.*)?$/i.test(url)
    || url.includes('/stream')
    || url.includes('/live')
    || url.includes('/icecast')
    || url.includes('/shoutcast')
    || /(?::(?:8000|8443|8080)\/)/.test(url);

  if (isAudioFileOrStream) {
    return {
      type: 'audio',
      isSomaFm: isSomaFm,
      url: url
    };
  }

  return { type: 'link', url: url };
}

function isPlayableAudioMedia(media) {
  if (!media) return false;
  return ['youtube', 'soundcloud', 'bandcamp', 'tunecamp', 'archiveorg', 'audius', 'mixcloud', 'spotify', 'audio'].includes(media.type);
}

// Audius Track Resolution Cache & Resolver
const audiusTrackCache = new Map();

async function resolveAudiusTrackId(media) {
  if (!media) return null;
  if (media.id) return media.id;
  if (audiusTrackCache.has(media.rawUrl)) return audiusTrackCache.get(media.rawUrl);

  try {
    const res = await fetch(`https://discoveryprovider.audius.co/v1/resolve?url=${encodeURIComponent(media.rawUrl)}&app_name=onepick`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.data && data.data.id) {
        audiusTrackCache.set(media.rawUrl, data.data.id);
        return data.data.id;
      }
    }
  } catch (e) {
    console.warn('Audius resolve error:', e);
  }
  return null;
}

async function resolveTuneCampMetadata(media) {
  const origin = media.origin;
  const slug = media.slug;
  const cleanQuery = (slug || '').replace(/[-_]+/g, ' ').trim();

  // 1. Try public federation search endpoint (/api/catalog/search?q=...) with cleaned search term
  if (cleanQuery) {
    try {
      const searchRes = await fetch(`${origin}/api/catalog/search?q=${encodeURIComponent(cleanQuery)}`);
      if (searchRes.ok) {
        const data = await searchRes.json();
        const lowerQuery = cleanQuery.toLowerCase();
        const track = data.tracks && (data.tracks.find(t => 
          String(t.id) === slug || 
          (t.title && t.title.toLowerCase() === lowerQuery) ||
          (t.file_path && t.file_path.includes(slug)) || 
          (t.album_title && t.album_title.toLowerCase() === lowerQuery)
        ) || data.tracks[0]);

        const album = data.albums && (data.albums.find(a => 
          String(a.id) === slug || (a.slug && a.slug.toLowerCase() === slug.toLowerCase()) ||
          (a.title && a.title.toLowerCase() === lowerQuery)
        ) || data.albums[0]);

        if (track) {
          const coverRel = track.coverUrl || (album ? `/api/releases/${album.id}/cover` : (track.album_id ? `/api/albums/${track.album_id}/cover` : ''));
          return {
            title: track.title || (album && album.title) || cleanQuery,
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
  }

  // 2. Direct release endpoint (/api/releases/:slug)
  try {
    const relRes = await fetch(`${origin}/api/releases/${encodeURIComponent(slug)}`);
    if (relRes.ok) {
      const rel = await relRes.json();
      const firstTrack = rel.tracks && rel.tracks[0];
      if (firstTrack) {
        const trackId = firstTrack.id || firstTrack.track_id;
        return {
          title: rel.title || firstTrack.title || slug,
          artist: firstTrack.artist_name || rel.artist_name || 'TuneCamp',
          streamUrl: `${origin}/api/tracks/${trackId}/stream`,
          coverUrl: `${origin}/api/releases/${rel.id || slug}/cover`,
          rawUrl: media.rawUrl,
          origin: origin
        };
      }
    }
  } catch (e) {
    console.warn('TuneCamp direct release fetch error:', e);
  }

  // 3. Direct album endpoint (/api/albums/:slug)
  try {
    const albRes = await fetch(`${origin}/api/albums/${encodeURIComponent(slug)}`);
    if (albRes.ok) {
      const alb = await albRes.json();
      const firstTrack = alb.tracks && alb.tracks[0];
      if (firstTrack) {
        const trackId = firstTrack.id || firstTrack.track_id;
        return {
          title: alb.title || firstTrack.title || slug,
          artist: firstTrack.artist_name || alb.artist_name || 'TuneCamp',
          streamUrl: `${origin}/api/tracks/${trackId}/stream`,
          coverUrl: `${origin}/api/albums/${alb.id || slug}/cover`,
          rawUrl: media.rawUrl,
          origin: origin
        };
      }
    }
  } catch (e) {
    console.warn('TuneCamp direct album fetch error:', e);
  }

  // 4. Fallback direct stream guess if track ID is numeric
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
    // If user passed a dedicated embed URL, render the clean iframe directly.
    const isExplicitEmbed = new URL(station.url).pathname.startsWith('/embed/');
    if (isExplicitEmbed) {
      mediaPlayerContainer.innerHTML = `
        <iframe
          style="border: 0; width: 100%; height: 240px; border-radius: 8px;"
          src="${station.url}"
          title="TuneCamp stream"
          allow="autoplay; encrypted-media"
        ></iframe>
      `;
      return;
    }

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
        const embedTarget = media.embedUrl || (media.origin && media.slug ? `${media.origin}/embed/release/${media.slug}` : station.url);
        mediaPlayerContainer.innerHTML = `
          <iframe
            style="border: 0; width: 100%; height: 240px; border-radius: 8px;"
            src="${embedTarget}"
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
      const fallbackTarget = media.embedUrl || (media.origin && media.slug ? `${media.origin}/embed/release/${media.slug}` : station.url);
      mediaPlayerContainer.innerHTML = `
        <iframe
          style="border: 0; width: 100%; height: 240px; border-radius: 8px;"
          src="${fallbackTarget}"
          title="TuneCamp stream"
          allow="autoplay; encrypted-media"
        ></iframe>
      `;
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
      <div style="width: 100%;">
        <iframe
          style="border: 0; width: 100%; height: 120px; border-radius: 4px;"
          src="${media.embedUrl}"
          seamless
          allow="autoplay; encrypted-media"
          title="onepick Bandcamp player"
        ></iframe>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: var(--bio-color); opacity: 0.8; margin-top: 5px; padding: 0 4px; font-family: ui-monospace, SFMono-Regular, monospace;">
          <span title="Bandcamp requires 3rd-party cookies. If blocked by browser, click open.">🍪 <em>Cookie error? Allow 3rd-party cookies</em></span>
          <a href="${media.rawUrl || '#'}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color, #4ade80); text-decoration: underline; font-weight: 500;">[ Open on Bandcamp ↗ ]</a>
        </div>
      </div>
    `;
  } else if (media.type === 'archiveorg') {
    const autoplayParam = isRadioOn ? '?autoplay=1' : '';
    mediaPlayerContainer.innerHTML = `
      <iframe
        src="${media.embedUrl}${autoplayParam}"
        width="100%"
        height="160"
        frameborder="0"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        allowfullscreen
        title="onepick Internet Archive audio player"
        style="border: 0; width: 100%; border-radius: 4px;"
      ></iframe>
    `;
  } else if (media.type === 'audius') {
    if (media.id) {
      mediaPlayerContainer.innerHTML = `
        <iframe
          src="https://audius.co/embed/track/${media.id}?flavor=compact"
          width="100%"
          height="120"
          frameborder="0"
          scrolling="no"
          allow="encrypted-media"
          title="onepick Audius player"
          style="border: 0; width: 100%; border-radius: 4px;"
        ></iframe>
      `;
    } else {
      mediaPlayerContainer.innerHTML = `
        <div style="font-family: ui-monospace, SFMono-Regular, monospace; font-size: 0.82rem; color: var(--bio-color); padding: 8px;">
          // Connessione nodo Audius Web3...
        </div>
      `;
      resolveAudiusTrackId(media).then(trackId => {
        if (activeStationPub !== station.pub) return;
        if (trackId) {
          media.id = trackId;
          mediaPlayerContainer.innerHTML = `
            <iframe
              src="https://audius.co/embed/track/${trackId}?flavor=compact"
              width="100%"
              height="120"
              frameborder="0"
              scrolling="no"
              allow="encrypted-media"
              title="onepick Audius player"
              style="border: 0; width: 100%; border-radius: 4px;"
            ></iframe>
          `;
          if (isRadioOn) radioEq?.classList.remove('hidden');
        } else {
          mediaPlayerContainer.innerHTML = `
            <div style="font-family: ui-monospace, SFMono-Regular, monospace; font-size: 0.82rem; color: var(--bio-color); padding: 8px;">
              // Traccia Audius: <a href="${station.url}" target="_blank" rel="noopener noreferrer">${station.url}</a>
            </div>
          `;
        }
      });
    }
  } else if (media.type === 'mixcloud') {
    const autoplayParam = isRadioOn ? '&autoplay=1' : '';
    const openMixcloudText = currentLang === 'it' ? '[ Apri su Mixcloud ↗ ]' : '[ Open on Mixcloud ↗ ]';
    const mixcloudHint = currentLang === 'it'
      ? '🛡️ <em>Non carica? Mixcloud o il tuo browser/AdBlock richiede autorizzazione.</em>'
      : '🛡️ <em>Not loading? Mixcloud or browser/AdBlock requires authorization.</em>';

    mediaPlayerContainer.innerHTML = `
      <div class="mixcloud-player-wrapper" style="width: 100%;">
        <iframe
          width="100%"
          height="120"
          src="${media.embedUrl}${autoplayParam}"
          frameborder="0"
          allow="autoplay; encrypted-media; fullscreen; idle-detection; speaker-selection; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          title="onepick Mixcloud player"
          style="border: 0; width: 100%; border-radius: 4px; display: block;"
        ></iframe>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: var(--bio-color); opacity: 0.8; margin-top: 5px; padding: 0 4px; font-family: ui-monospace, SFMono-Regular, monospace;">
          <span title="Mixcloud embeds might be blocked by Cloudflare verification or ad-blockers">${mixcloudHint}</span>
          <a href="${media.rawUrl || '#'}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color, #4ade80); text-decoration: underline; font-weight: 500;">${openMixcloudText}</a>
        </div>
      </div>
    `;
  } else if (media.type === 'audio') {
    const autoplayAttr = isRadioOn ? 'autoplay' : '';
    const streamTitle = media.isSomaFm
      ? (currentLang === 'it' ? 'SomaFM Radio Live (.mp3 stream)' : 'SomaFM Live Radio (.mp3 stream)')
      : (currentLang === 'it' ? 'Flusso Audio Live (.mp3 stream)' : 'Live Audio Stream (.mp3 stream)');
    const streamLinkText = currentLang === 'it' ? '[ Stream Diretto ↗ ]' : '[ Direct Stream ↗ ]';

    mediaPlayerContainer.innerHTML = `
      <div class="audio-stream-player" style="width: 100%;">
        <audio controls ${autoplayAttr} preload="auto" src="${media.url}" style="width: 100%; margin-top: 4px; border-radius: 4px;"></audio>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: var(--bio-color); opacity: 0.8; margin-top: 5px; padding: 0 4px; font-family: ui-monospace, SFMono-Regular, monospace;">
          <span>📡 <em>${streamTitle}</em></span>
          <a href="${media.url}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color, #4ade80); text-decoration: underline; font-weight: 500;">${streamLinkText}</a>
        </div>
      </div>
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
      if (powerText) powerText.textContent = t('power_btn_off');
      showToast(t('toast_radio_powered_on'));
      playTuningStatic(0.3);
      const curFreq = activeStationPub && stationsMap.has(activeStationPub)
        ? (stationsMap.get(activeStationPub).freq || 88.0)
        : 88.0;
      triggerEtherPulse(curFreq, false);
    } else {
      powerToggleBtn.classList.remove('active');
      if (powerIcon) powerIcon.textContent = '⏻';
      if (powerText) powerText.textContent = t('power_btn_on');
      showToast(t('toast_radio_powered_off'));
      radioEq?.classList.add('hidden');
    }
  }

  // Re-render media for active station
  if (activeStationPub && stationsMap.has(activeStationPub)) {
    renderStationMedia(stationsMap.get(activeStationPub));
  }
}

function setupPowerRadio() {
  powerToggleBtn?.addEventListener('click', togglePowerRadio);

  if (isRadioOn) {
    powerToggleBtn?.classList.add('active');
    if (powerIcon) powerIcon.textContent = '🔈';
    if (powerText) powerText.textContent = t('power_btn_off');

    // Auto-unlock AudioContext on first user interaction for strict browser autoplay policies
    const unlockAudio = () => {
      if (isRadioOn) initAudioContext();
    };
    window.addEventListener('click', unlockAudio, { once: true, passive: true });
    window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
    window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
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
  if (pickDomainPill) pickDomainPill.textContent = currentLang === 'it' ? 'etere ↗' : 'ether ↗';
  if (pickUrlText) pickUrlText.textContent = currentLang === 'it' ? 'Nessun pick attivo rilevato sulla rete Zen' : 'No active pick detected on Zen mesh';
  if (pickCaptionText) {
    pickCaptionText.textContent = t('pick_no_signal');
    pickCaptionText.classList.remove('user-caption');
  }

  if (saveCassettoBtn) {
    saveCassettoBtn.textContent = t('action_save_cassetto');
    saveCassettoBtn.title = t('tooltip_save_cassetto');
    saveCassettoBtn.disabled = true;
  }
  if (saveStationBtn) {
    saveStationBtn.textContent = t('action_save_station');
    saveStationBtn.title = t('tooltip_save_station');
    saveStationBtn.disabled = true;
    saveStationBtn.classList.remove('btn-active');
  }
  if (silentNodBtn) {
    silentNodBtn.textContent = t('action_silent_nod');
    silentNodBtn.title = t('tooltip_silent_nod');
    silentNodBtn.disabled = true;
  }
  updateRotateTrackBtnUI();
  if (currentStationBadge) currentStationBadge.textContent = currentLang === 'it' ? 'in scansione' : 'scanning';
  if (mediaPlayerContainer) {
    mediaPlayerContainer.innerHTML = '';
    mediaPlayerContainer.classList.add('hidden');
  }
  radioEq?.classList.add('hidden');
}

function refreshStationCardUI(station) {
  if (!station) return;
  const pub = station.pub;
  const freq = station.freq || getFrequencyForPub(pub);

  if (freqMhzEl) freqMhzEl.textContent = `FM ${freq.toFixed(2)}`;
  if (peerSigilDisplay) {
    peerSigilDisplay.innerHTML = generateSigilSvg(pub, 18);
  }
  if (peerPubDisplay) {
    peerPubDisplay.textContent = `${t('peer_label')}${truncateKey(pub)}`;
    peerPubDisplay.title = `${currentLang === 'it' ? 'Chiave pubblica' : 'Public key'}: ${pub}`;
  }

  if (pickSigilDisplay) {
    pickSigilDisplay.innerHTML = generateSigilSvg(pub, 18);
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
    pickDomainPill.textContent = `${extractDomain(station.url)} ↗`;
  }
  if (pickUrlText) {
    pickUrlText.textContent = station.url;
  }
  if (pickCaptionText) {
    if (station.caption && station.caption.trim()) {
      pickCaptionText.textContent = station.caption;
      pickCaptionText.classList.add('user-caption');
    } else {
      pickCaptionText.textContent = t('pick_no_reflection');
      pickCaptionText.classList.remove('user-caption');
    }
  }

  if (saveCassettoBtn) {
    saveCassettoBtn.disabled = false;
    const isSaved = isPickInCassetto(station.url);
    saveCassettoBtn.textContent = isSaved ? t('action_saved_cassetto') : t('action_save_cassetto');
    saveCassettoBtn.title = t('tooltip_save_cassetto');
  }

  if (saveStationBtn) {
    saveStationBtn.disabled = false;
    const isStationFav = isStationSaved(station.pub);
    saveStationBtn.textContent = isStationFav ? t('action_saved_station') : t('action_save_station');
    saveStationBtn.title = isStationFav ? t('tooltip_saved_station') : t('tooltip_save_station');
    saveStationBtn.classList.toggle('btn-active', isStationFav);
  }

  if (silentNodBtn) {
    const isOwnStation = currentPair && currentPair.pub === pub;
    const alreadySent = hasSentNod(pub, station.url);
    if (isOwnStation) {
      silentNodBtn.disabled = true;
      silentNodBtn.textContent = t('action_own_station');
    } else if (alreadySent) {
      silentNodBtn.disabled = true;
      silentNodBtn.textContent = t('action_nod_sent');
    } else {
      silentNodBtn.disabled = false;
      silentNodBtn.textContent = t('action_silent_nod');
    }
    silentNodBtn.title = t('tooltip_silent_nod');
  }

  updateRotateTrackBtnUI();

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
    if (pickOriginBadge) {
      pickOriginBadge.textContent = station.author ? `${t('badge_node_prefix')}: ${station.author}` : `${t('badge_transmitter_prefix')}: ${truncateKey(pub)}`;
    }
  }
}

function tuneToStation(pub, isRandom = false) {
  const station = stationsMap.get(pub);
  if (!station) return;

  activeStationPub = pub;
  const freq = station.freq || getFrequencyForPub(pub);
  station.freq = freq;

  updateNeedlePosition(freq);
  triggerEtherPulse(freq, isRandom);

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
  refreshStationCardUI(station);
}

function tuneToClosestFrequency(targetFreq) {
  const stations = getFilteredStations();
  if (stations.length === 0) {
    showToast(t('toast_no_signal_band'));
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
    showToast(t('toast_no_signal_mesh'));
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
    showToast(t('toast_no_signal_mesh'));
    return;
  }
  if (stations.length === 1) {
    tuneToStation(stations[0].pub, true);
    return;
  }
  let randomStation;
  do {
    const idx = Math.floor(Math.random() * stations.length);
    randomStation = stations[idx];
  } while (randomStation.pub === activeStationPub && stations.length > 1);

  tuneToStation(randomStation.pub, true);
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
      showToast(currentLang === 'it' ? `Nessuna frequenza attiva trovata per #${currentTagFilter}` : `No active frequency found for #${currentTagFilter}`);
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

function getTrackHash(url) {
  if (!url) return 'generic';
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function hasSentNod(pub, trackUrl) {
  if (!pub) return false;
  const list = getSentNods();
  if (trackUrl) {
    return list.includes(`${pub}::${trackUrl}`);
  }
  return list.includes(pub);
}

function recordSentNod(pub, trackUrl) {
  if (!pub) return;
  const list = getSentNods();
  const key = trackUrl ? `${pub}::${trackUrl}` : pub;
  if (!list.includes(key)) {
    list.push(key);
    localStorage.setItem('onepick_sent_nods', JSON.stringify(list));
  }
}

async function sendSilentNod(targetPub) {
  if (!targetPub) return;
  if (currentPair && currentPair.pub === targetPub) {
    showToast(t('toast_cannot_nod_self'));
    return;
  }

  const station = stationsMap.get(targetPub);
  const trackUrl = station ? station.url : '';

  if (hasSentNod(targetPub, trackUrl)) {
    showToast(t('toast_already_nodded'));
    return;
  }

  const fromId = currentPair ? currentPair.pub : 'anon_' + Math.random().toString(36).slice(2, 9);
  const trackHash = getTrackHash(trackUrl);
  const nodId = `${fromId}_${trackHash}`;
  const nodData = {
    from: fromId,
    target: targetPub,
    url: trackUrl || '',
    ts: Date.now()
  };

  try {
    if (zen) {
      // Put to public nods inbox for this target station:
      zen.get('onepick:nods:' + targetPub).get(nodId).put(nodData);
    }
    recordSentNod(targetPub, trackUrl);
    if (silentNodBtn) {
      silentNodBtn.textContent = t('action_nod_sent');
      silentNodBtn.disabled = true;
    }
    satisfyPositiveFriction('nod');
    showToast(t('toast_nod_sent_private'));
  } catch (err) {
    console.error('Errore invio cenno:', err);
    recordSentNod(targetPub, trackUrl);
    satisfyPositiveFriction('nod');
  }
}

silentNodBtn?.addEventListener('click', () => {
  if (!activeStationPub) return;
  sendSilentNod(activeStationPub);
});

// --- Manual Dynamic Bot Rotation Interaction ---

let isRotatingBot = false;

function isBotStation(pub, author) {
  if (author && SEED_BOTS.some(b => b.username === author)) return true;
  if (!pub) return false;
  const station = stationsMap.get(pub);
  if (station && station.author && SEED_BOTS.some(b => b.username === station.author)) {
    return true;
  }
  return false;
}

function isStationActive(station) {
  if (!station) return false;
  // I bot non scadono mai: canali radio autonomi continui della rete
  if (isBotStation(station.pub, station.author)) return true;
  // La propria stazione è sempre visibile al trasmettitore locale
  if (currentPair && currentPair.pub === station.pub) return true;
  // Nascondi se la trasmissione risale a più di 24 ore fa
  const ts = Number(station.ts) || 0;
  return (Date.now() - ts) <= MAX_STATION_AGE_MS;
}

function isCurrentStationBot() {
  if (!activeStationPub) return null;
  const station = stationsMap.get(activeStationPub);
  if (!station) return null;
  return SEED_BOTS.find(b => b.username === station.author) || null;
}

function updateRotateTrackBtnUI() {
  if (!rotateTrackBtn) return;
  if (isRotatingBot) return;

  const bot = isCurrentStationBot();
  if (bot) {
    rotateTrackBtn.disabled = false;
    rotateTrackBtn.title = t('tooltip_rotate_track');
    if (rotateTrackText) {
      rotateTrackText.textContent = t('action_rotate_track');
    } else {
      rotateTrackBtn.textContent = t('action_rotate_track');
    }
  } else {
    rotateTrackBtn.disabled = false;
    rotateTrackBtn.title = t('tooltip_rotate_bot');
    if (rotateTrackText) {
      rotateTrackText.textContent = t('action_rotate_bot');
    } else {
      rotateTrackBtn.textContent = t('action_rotate_bot');
    }
  }
}

async function handleManualBotRotation() {
  if (isRotatingBot) return;
  isRotatingBot = true;

  if (rotateTrackBtn) {
    rotateTrackBtn.disabled = true;
    if (rotateTrackText) {
      rotateTrackText.textContent = t('action_rotating');
    } else {
      rotateTrackBtn.textContent = t('action_rotating');
    }
  }
  if (profRotateBtn) {
    profRotateBtn.disabled = true;
    if (profRotateText) {
      profRotateText.textContent = t('action_rotating');
    } else {
      profRotateBtn.textContent = t('action_rotating');
    }
  }

  try {
    const currentBot = isCurrentStationBot();
    const targetBot = currentBot || SEED_BOTS[Math.floor(Math.random() * SEED_BOTS.length)];
    const currentStation = stationsMap.get(activeStationPub);
    const currentUrl = (currentBot && currentStation) ? currentStation.url : null;

    showToast(currentLang === 'it' ? `⟳ Interrogazione provider live per @${targetBot.username}...` : `⟳ Querying live provider for @${targetBot.username}...`);

    const res = await rotateBotStation(zen, ZEN, targetBot, currentUrl);
    if (res && res.pair && res.slotData) {
      const stationObj = {
        pub: res.pair.pub,
        author: res.bot,
        url: res.slotData.url,
        caption: res.slotData.caption || '',
        tag: res.slotData.tag || 'sound',
        ts: res.slotData.ts,
        freq: res.freq
      };
      stationsMap.set(res.pair.pub, stationObj);
      updateStationsCounter();
      updateFrictionUI();

      tuneToStation(res.pair.pub);

      showToast(
        t('toast_bot_rotated')
          .replace('{bot}', res.bot)
          .replace('{title}', res.track?.title || res.slotData.caption || 'Nuova traccia')
      );
    }
  } catch (err) {
    console.error('Errore rotazione manuale bot:', err);
    showToast(t('toast_bot_rotate_error') + (err.message || 'Riprova'));
  } finally {
    isRotatingBot = false;
    updateRotateTrackBtnUI();
    if (profRotateBtn) {
      profRotateBtn.disabled = false;
      if (profRotateText) {
        profRotateText.textContent = t('prof_btn_rotate_bot');
      } else {
        profRotateBtn.textContent = t('prof_btn_rotate_bot');
      }
    }
  }
}

rotateTrackBtn?.addEventListener('click', handleManualBotRotation);
profRotateBtn?.addEventListener('click', () => {
  handleManualBotRotation();
  stationProfileModal?.classList.add('hidden');
});

// --- Share Frequency Link ---

shareFrequencyBtn?.addEventListener('click', () => {
  if (!activeStationPub) return;
  const url = new URL(window.location.href);
  url.searchParams.set('peer', activeStationPub);
  navigator.clipboard.writeText(url.toString()).then(() => {
    showToast(t('toast_link_copied'));
  }).catch(() => {
    prompt(t('prompt_copy_link'), url.toString());
  });
});

// --- Helper Escape HTML ---
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Cassetto Privato (Local Storage: Picks & Favorite Stations) ---

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

function isPickInCassetto(url) {
  if (!url) return false;
  const items = getCassettoItems();
  return items.some(it => it.url === url);
}

function getSavedStations() {
  try {
    const raw = localStorage.getItem('onepick_saved_stations');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveSavedStations(stations) {
  localStorage.setItem('onepick_saved_stations', JSON.stringify(stations));
  updateCassettoBadge();
}

function isStationSaved(pub) {
  if (!pub) return false;
  const stations = getSavedStations();
  return stations.some(s => s.pub === pub);
}

function updateCassettoBadge() {
  const picks = getCassettoItems();
  const stations = getSavedStations();
  const total = picks.length + stations.length;
  if (cassettoCount) {
    cassettoCount.textContent = `(${total})`;
  }
  if (tabCountPicks) tabCountPicks.textContent = `(${picks.length})`;
  if (tabCountStations) tabCountStations.textContent = `(${stations.length})`;
  if (tabCountMuted) tabCountMuted.textContent = `(${mutedStations ? mutedStations.size : 0})`;
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
    if (saveCassettoBtn) saveCassettoBtn.textContent = t('action_save_cassetto');
    showToast(t('toast_cassetto_removed'));
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
    if (saveCassettoBtn) saveCassettoBtn.textContent = t('action_saved_cassetto');
    satisfyPositiveFriction('save');
  }
  renderCassettoModal();
}

function toggleSaveStation(pub) {
  if (!pub) return;
  const stations = getSavedStations();
  const existingIndex = stations.findIndex(s => s.pub === pub);

  if (existingIndex !== -1) {
    stations.splice(existingIndex, 1);
    saveSavedStations(stations);
    showToast(t('toast_station_removed'));
  } else {
    const live = stationsMap.get(pub);
    const freq = live ? (live.freq || getFrequencyForPub(pub)) : getFrequencyForPub(pub);
    const author = live ? live.author : truncateKey(pub);
    const caption = live ? (live.caption || '') : '';
    const tag = live ? (live.tag || 'sound') : 'sound';
    const url = live ? (live.url || '') : '';

    stations.unshift({
      pub: pub,
      freq: freq,
      author: author,
      caption: caption,
      tag: tag,
      url: url,
      savedAt: Date.now()
    });
    saveSavedStations(stations);
    showToast(t('toast_station_saved'));
    satisfyPositiveFriction('save');
  }

  // Update button states
  if (activeStationPub === pub) {
    const isSaved = isStationSaved(pub);
    if (saveStationBtn) {
      saveStationBtn.textContent = isSaved ? t('action_saved_station') : t('action_save_station');
      saveStationBtn.title = isSaved ? t('tooltip_saved_station') : t('tooltip_save_station');
      saveStationBtn.classList.toggle('btn-active', isSaved);
    }
    if (profSaveStationBtn) {
      profSaveStationBtn.textContent = isSaved ? t('prof_saved_station') : t('prof_save_station');
      profSaveStationBtn.className = isSaved ? 'bracket-btn btn-active' : 'bracket-btn';
    }
  }

  renderCassettoModal();
}

saveCassettoBtn?.addEventListener('click', toggleSaveCurrentPick);
saveStationBtn?.addEventListener('click', () => {
  if (activeStationPub) {
    toggleSaveStation(activeStationPub);
  }
});

let activeCassettoTab = 'picks';

function switchCassettoTab(tab) {
  activeCassettoTab = tab;
  [tabBtnPicks, tabBtnStations, tabBtnMuted].forEach(b => b?.classList.remove('btn-active'));
  [cassettoPicksTab, cassettoStationsTab, cassettoMutedTab].forEach(t => t?.classList.add('hidden'));

  if (tab === 'picks') {
    tabBtnPicks?.classList.add('btn-active');
    cassettoPicksTab?.classList.remove('hidden');
    renderCassettoPicks();
  } else if (tab === 'stations') {
    tabBtnStations?.classList.add('btn-active');
    cassettoStationsTab?.classList.remove('hidden');
    renderCassettoStations();
  } else if (tab === 'muted') {
    tabBtnMuted?.classList.add('btn-active');
    cassettoMutedTab?.classList.remove('hidden');
    renderMutedStationsTab();
  }
}

function renderCassettoPicks() {
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
        <span class="cassetto-node-badge">${sigilHtml}#${escapeHtml(item.tag || 'sound')} · ${truncateKey(item.authorPub)}</span>
        <span>${new Date(item.savedAt).toLocaleDateString()}</span>
      </div>
      <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="cassetto-item-link">
        ${escapeHtml(item.url)}
      </a>
      <div class="cassetto-item-caption">${escapeHtml(item.caption || '')}</div>
      <div class="cassetto-item-actions">
        <button class="bracket-btn delete-cassetto-item" data-index="${index}" type="button">${t('btn_delete')}</button>
      </div>
    `;
    cassettoItemsList.appendChild(li);
  });

  cassettoItemsList.querySelectorAll('.delete-cassetto-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      const currentItems = getCassettoItems();
      currentItems.splice(idx, 1);
      saveCassettoItems(currentItems);
      renderCassettoPicks();
      if (activeStationPub) {
        const active = stationsMap.get(activeStationPub);
        if (active && saveCassettoBtn) {
          saveCassettoBtn.textContent = isPickInCassetto(active.url) ? t('action_saved_cassetto') : t('action_save_cassetto');
        }
      }
    });
  });
}

function renderCassettoStations() {
  if (!cassettoStationsList || !cassettoStationsEmpty) return;
  cassettoStationsList.innerHTML = '';
  const list = getSavedStations();

  if (list.length === 0) {
    cassettoStationsEmpty.classList.remove('hidden');
    return;
  }
  cassettoStationsEmpty.classList.add('hidden');

  list.forEach(st => {
    const pub = st.pub;
    const isOnline = stationsMap.has(pub) && isStationActive(stationsMap.get(pub));
    const liveStation = stationsMap.get(pub);
    const freq = st.freq || (liveStation ? liveStation.freq : getFrequencyForPub(pub));
    const author = (liveStation && liveStation.author) || st.author || truncateKey(pub);
    const caption = (liveStation && liveStation.caption) || st.caption || '';
    const tag = (liveStation && liveStation.tag) || st.tag || '';
    const url = (liveStation && liveStation.url) || st.url || '';

    const li = document.createElement('li');
    li.className = 'cassetto-item';
    const sigilHtml = `<span class="item-sigil-prefix">${generateSigilSvg(pub, 16)}</span>`;
    const statusHtml = isOnline 
      ? `<span class="status-badge" style="color: var(--success-color); border-color: var(--success-color); font-size: 0.74rem;">${t('station_on_air')}</span>`
      : `<span class="status-badge" style="color: var(--desc-color); border-color: var(--border-muted); font-size: 0.74rem;">${t('station_offline')}</span>`;

    li.innerHTML = `
      <div class="cassetto-item-header">
        <span class="cassetto-node-badge">${sigilHtml}FM ${freq.toFixed(2)} MHz · ${escapeHtml(author)}</span>
        <div style="display: flex; gap: 8px; align-items: center;">
          ${statusHtml}
          <span>${new Date(st.savedAt).toLocaleDateString()}</span>
        </div>
      </div>
      ${caption ? `<div class="cassetto-item-caption">${escapeHtml(caption)} ${tag ? `<span class="peer-tag-badge">#${escapeHtml(tag)}</span>` : ''}</div>` : ''}
      ${url ? `<a href="${url}" target="_blank" rel="noopener noreferrer" class="cassetto-item-link">${escapeHtml(url)}</a>` : ''}
      <div class="cassetto-item-actions">
        <button class="bracket-btn btn-success tune-saved-station-btn" data-pub="${pub}" type="button">${t('btn_tune_station')}</button>
        <button class="bracket-btn delete-saved-station-btn" data-pub="${pub}" type="button">${t('btn_delete')}</button>
      </div>
    `;
    cassettoStationsList.appendChild(li);
  });

  cassettoStationsList.querySelectorAll('.tune-saved-station-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pub = e.currentTarget.getAttribute('data-pub');
      tuneSavedStation(pub);
    });
  });

  cassettoStationsList.querySelectorAll('.delete-saved-station-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pub = e.currentTarget.getAttribute('data-pub');
      toggleSaveStation(pub);
    });
  });
}

function tuneSavedStation(pub) {
  if (!pub) return;
  const saved = getSavedStations().find(s => s.pub === pub);
  if (!stationsMap.has(pub) && saved) {
    stationsMap.set(pub, {
      pub: saved.pub,
      freq: saved.freq,
      author: saved.author,
      caption: saved.caption,
      tag: saved.tag,
      url: saved.url,
      ts: saved.savedAt
    });
  }
  tuneToStation(pub);
  cassettoModal?.classList.add('hidden');
  const target = stationsMap.get(pub);
  const freq = target ? (target.freq || getFrequencyForPub(pub)) : getFrequencyForPub(pub);
  showToast(t('toast_tuned_station').replace('{station}', `FM ${freq.toFixed(2)} MHz`));
}

function renderCassettoModal() {
  updateCassettoBadge();
  if (activeCassettoTab === 'picks') {
    renderCassettoPicks();
  } else if (activeCassettoTab === 'stations') {
    renderCassettoStations();
  } else if (activeCassettoTab === 'muted') {
    renderMutedStationsTab();
  }
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
  const savedStations = getSavedStations();
  const payload = {
    exportedAt: new Date().toISOString(),
    picks: items,
    stations: savedStations
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `onepick-cassetto-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
});

exportCassettoMdBtn?.addEventListener('click', () => {
  const items = getCassettoItems();
  const savedStations = getSavedStations();
  let md = currentLang === 'it'
    ? '# onepick / Cassetto Privato\n\nArchivio personale esportato da onepick.\n\n'
    : '# onepick / Private Drawer\n\nPersonal archive exported from onepick.\n\n';

  if (savedStations.length > 0) {
    md += currentLang === 'it' ? '## Stazioni Preferite\n\n' : '## Favorite Stations\n\n';
    savedStations.forEach(st => {
      md += `### FM ${st.freq ? st.freq.toFixed(2) : '--'} MHz · ${st.author || 'Anonimo'}\n`;
      md += `- PubKey: \`${st.pub}\`\n`;
      if (st.caption) md += `- ${currentLang === 'it' ? 'Riflessione' : 'Caption'}: *${st.caption}*\n`;
      if (st.tag) md += `- Tag: #${st.tag}\n`;
      if (st.url) md += `- URL: ${st.url}\n`;
      md += `\n---\n\n`;
    });
  }

  if (items.length > 0) {
    md += currentLang === 'it' ? '## Pick Salvati\n\n' : '## Saved Picks\n\n';
    items.forEach(it => {
      md += `### [${it.url}](${it.url})\n`;
      md += `*${it.caption || ''}*\n\n`;
      md += `- Tag: #${it.tag || 'sound'}\n`;
      md += `- ${currentLang === 'it' ? 'Nodo' : 'Node'}: \`${it.authorPub || ''}\`\n`;
      md += `- ${currentLang === 'it' ? 'Salvato il' : 'Saved on'}: ${new Date(it.savedAt).toISOString()}\n\n---\n\n`;
    });
  }

  const blob = new Blob([md], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `onepick-cassetto-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
});

clearCassettoBtn?.addEventListener('click', () => {
  if (confirm(t('confirm_clear_cassetto'))) {
    saveCassettoItems([]);
    saveSavedStations([]);
    renderCassettoModal();
    if (activeStationPub) {
      const active = stationsMap.get(activeStationPub);
      if (active && saveCassettoBtn) {
        saveCassettoBtn.textContent = t('action_save_cassetto');
      }
      if (saveStationBtn) {
        saveStationBtn.textContent = t('action_save_station');
        saveStationBtn.classList.remove('btn-active');
      }
    }
    showToast(t('toast_cassetto_cleared'));
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
  showToast(t('toast_muted'));
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
  showToast(t('toast_unmuted'));
  renderMutedStationsTab();
}

function updateMutedCountBadge() {
  updateCassettoBadge();
}

function setupCassettoTabs() {
  tabBtnPicks?.addEventListener('click', () => switchCassettoTab('picks'));
  tabBtnStations?.addEventListener('click', () => switchCassettoTab('stations'));
  tabBtnMuted?.addEventListener('click', () => switchCassettoTab('muted'));
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
        <span>${s && s.author ? s.author : t('cassetto_node_label')}</span>
      </div>
      <div class="cassetto-item-caption">${s && s.caption ? s.caption : t('muted_station_desc')}</div>
      <div class="cassetto-item-actions">
        <button class="bracket-btn btn-success unmute-station-btn" data-pub="${pub}" type="button">${t('btn_restore')}</button>
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
    showToast(t('toast_community_reported'));
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
    profHeaderFreq.textContent = `FM ${freq.toFixed(2)} MHz · ${station.author ? t('profile_node_active') : t('profile_node_transmitter')}`;
  }

  if (profFreqText) profFreqText.textContent = `FM ${freq.toFixed(2)} MHz`;
  if (profNameText) profNameText.textContent = station.author || truncateKey(pub);
  if (profPubkeyText) {
    profPubkeyText.textContent = pub;
    profPubkeyText.title = pub;
  }
  if (profTimeText) profTimeText.textContent = formatTimeAgo(station.ts);
  if (profPermalinkInput) profPermalinkInput.value = permalink;

  if (profSaveStationBtn) {
    const isSaved = isStationSaved(pub);
    profSaveStationBtn.textContent = isSaved ? t('prof_saved_station') : t('prof_save_station');
    profSaveStationBtn.className = isSaved ? 'bracket-btn btn-active' : 'bracket-btn';
  }

  if (profMuteToggleBtn) {
    const isMuted = mutedStations.has(pub);
    profMuteToggleBtn.textContent = isMuted ? t('profile_btn_unmute') : t('profile_btn_mute');
    profMuteToggleBtn.className = isMuted ? 'bracket-btn btn-success' : 'bracket-btn btn-danger';
  }

  if (profRotateBtn) {
    const isBot = SEED_BOTS.some(b => b.username === station.author);
    profRotateBtn.classList.toggle('hidden', !isBot);
    if (profRotateText) {
      profRotateText.textContent = t('prof_btn_rotate_bot');
    }
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

  profSaveStationBtn?.addEventListener('click', () => {
    if (activeStationPub) {
      toggleSaveStation(activeStationPub);
      openStationProfile(activeStationPub);
    }
  });

  profCopyPubBtn?.addEventListener('click', () => {
    if (!activeStationPub) return;
    navigator.clipboard.writeText(activeStationPub).then(() => {
      showToast(t('toast_pubkey_copied'));
    }).catch(() => {
      prompt(t('prompt_copy_pubkey'), activeStationPub);
    });
  });

  profCopyLinkBtn?.addEventListener('click', () => {
    if (profPermalinkInput) {
      navigator.clipboard.writeText(profPermalinkInput.value).then(() => {
        showToast(t('toast_link_copied'));
      }).catch(() => {
        prompt(t('prompt_copy_link'), profPermalinkInput.value);
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
    showToast(t('toast_jammed_override'));
  });
}

// --- Live URL Validation & Provider Detection ---

function updateUrlValidationUI() {
  if (!pickUrlInput) return;
  const rawInput = pickUrlInput.value.trim();
  const cleanUrl = extractCleanMediaUrl(rawInput);
  const currentTag = (selectedPickTagInput && selectedPickTagInput.value.trim()) || 'sound';
  const isSound = currentTag === 'sound';

  // Clear previous badge active states
  providerBadges?.forEach(b => b.classList.remove('detected'));

  if (nonSoundHint) {
    nonSoundHint.classList.toggle('hidden', isSound);
  }
  if (compatibleTitle) {
    compatibleTitle.textContent = isSound ? t('compatible_audio_title') : t('compatible_audio_title_all');
  }

  if (!cleanUrl) {
    if (urlValidationStatus) {
      urlValidationStatus.textContent = '';
      urlValidationStatus.className = 'url-validation-status';
    }
    return;
  }

  const media = detectMedia(cleanUrl);
  const isAudio = isPlayableAudioMedia(media);

  // Highlight matching badge if audio media
  if (isAudio) {
    providerBadges?.forEach(b => {
      if (b.getAttribute('data-provider') === media.type) {
        b.classList.add('detected');
      }
    });
  }

  if (urlValidationStatus) {
    const providerNames = {
      youtube: 'YouTube',
      soundcloud: 'SoundCloud',
      bandcamp: 'Bandcamp',
      tunecamp: 'TuneCamp',
      archiveorg: 'Internet Archive',
      audius: 'Audius',
      mixcloud: 'Mixcloud',
      spotify: 'Spotify',
      audio: 'Stream Audio / SomaFM'
    };

    if (isSound) {
      if (isAudio) {
        const displayName = providerNames[media.type] || media.type.toUpperCase();
        urlValidationStatus.textContent = `${t('status_detected_prefix')}${displayName}`;
        urlValidationStatus.className = 'url-validation-status valid';
      } else {
        urlValidationStatus.textContent = t('status_sound_invalid');
        urlValidationStatus.className = 'url-validation-status invalid';
      }
    } else {
      let isValidUrl = false;
      try {
        const u = new URL(cleanUrl);
        isValidUrl = u.protocol === 'http:' || u.protocol === 'https:';
      } catch (e) {
        isValidUrl = false;
      }

      if (isValidUrl) {
        if (isAudio) {
          const displayName = providerNames[media.type] || media.type.toUpperCase();
          urlValidationStatus.textContent = `${t('status_detected_prefix')}${displayName}`;
          urlValidationStatus.className = 'url-validation-status valid';
        } else {
          urlValidationStatus.textContent = t('status_valid_web');
          urlValidationStatus.className = 'url-validation-status valid';
        }
      } else {
        urlValidationStatus.textContent = t('toast_invalid_url');
        urlValidationStatus.className = 'url-validation-status invalid';
      }
    }
  }
}

// --- Transmitter: Lo Slot Unico (State over History) ---

function initTransmitterForm() {
  // Live URL validation & provider detection
  pickUrlInput?.addEventListener('input', () => {
    updateUrlValidationUI();
  });

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
      updateUrlValidationUI();
    });
  });

  // Form Submission -> Overwrite State
  transmitterForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentPair) {
      showToast(t('toast_login_required'));
      return;
    }

    if (!frictionUnlocked && hasPeerStations()) {
      showToast(t('toast_friction_required'));
      return;
    }

    const rawInput = pickUrlInput.value.trim();
    const url = extractCleanMediaUrl(rawInput);
    const caption = pickCaptionInput.value.trim();
    const tag = selectedPickTagInput.value.trim() || 'sound';

    if (!url) {
      showToast(t('toast_invalid_url'));
      pickUrlInput?.focus();
      return;
    }

    let isValidUrl = false;
    try {
      const u = new URL(url);
      isValidUrl = u.protocol === 'http:' || u.protocol === 'https:';
    } catch (e) {
      isValidUrl = false;
    }

    if (!isValidUrl) {
      showToast(t('toast_invalid_url'));
      pickUrlInput?.focus();
      return;
    }

    // RESTRICTION LOGIC:
    // If tag is 'sound', ONLY accept wrapped playable audio providers!
    if (tag === 'sound') {
      const media = detectMedia(url);
      if (!isPlayableAudioMedia(media)) {
        showToast(t('toast_sound_provider_required'));
        pickUrlInput?.focus();
        return;
      }
    }

    if (caption.length > 140) {
      showToast(t('toast_char_limit'));
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
      transmitBtn.textContent = t('transmit_btn_sending');

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
        slotStatusBadge.textContent = t('slot_active');
        slotStatusBadge.className = 'status-badge auth-badge';
      }

      showToast(t('toast_transmit_success'));
      updateFrictionUI();
    } catch (err) {
      console.error('Errore durante la trasmissione:', err);
      showToast(t('toast_slot_error') + (err.message || (currentLang === 'it' ? 'Riprova' : 'Try again')));
    } finally {
      transmitBtn.disabled = false;
      transmitBtn.textContent = t('btn_broadcast_slot');
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
    try {
      localStorage.removeItem('onepick_user');
      localStorage.removeItem('onepick_pair');
      sessionStorage.removeItem('onepick_user');
      sessionStorage.removeItem('onepick_pass');
      sessionStorage.removeItem('onepick_pair');
    } catch (e) {
      console.warn('Errore pulizia sessione auth:', e);
    }

    if (authorSigilDisplay) {
      authorSigilDisplay.innerHTML = '';
      authorSigilDisplay.classList.add('hidden');
    }
    authControls?.classList.add('hidden');
    loginTriggerBtn?.classList.remove('hidden');
    transmitterForm?.classList.add('hidden');
    if (transmitterPrompt) {
      transmitterPrompt.innerHTML = t('transmitter_prompt');
    }
    if (slotStatusBadge) {
      slotStatusBadge.textContent = t('slot_inactive');
      slotStatusBadge.className = 'status-badge';
    }
    if (nodsReceivedBadge) nodsReceivedBadge.classList.add('hidden');
    updateUrlValidationUI();
    showToast(t('toast_logged_out'));
  });

  // Deterministic login
  authForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = authUser.value.trim();
    const password = authPass.value;

    if (!username || !password) {
      if (authAlert) {
        authAlert.textContent = t('auth_alert_required');
        authAlert.classList.remove('hidden');
      }
      return;
    }

    try {
      const submitBtn = document.getElementById('auth-submit-btn');
      if (submitBtn) submitBtn.textContent = t('btn_deriving');

      const pair = await derivePair(username, password);
      loginWithPair(pair, username);
      authModal?.classList.add('hidden');
      authForm.reset();
    } catch (err) {
      console.error('Errore derivazione chiavi:', err);
      if (authAlert) {
        authAlert.textContent = t('auth_alert_crypto_err') + err.message;
        authAlert.classList.remove('hidden');
      }
    } finally {
      const submitBtn = document.getElementById('auth-submit-btn');
      if (submitBtn) submitBtn.textContent = t('btn_activate_node');
    }
  });

  // Quick random guest identity
  quickGuestBtn?.addEventListener('click', async () => {
    try {
      quickGuestBtn.textContent = t('btn_generating');
      const pair = await ZEN.pair();
      const randomName = 'guest-' + Math.random().toString(36).slice(2, 6);
      loginWithPair(pair, randomName);
      authModal?.classList.add('hidden');
      showToast(t('toast_guest_ready'));
    } catch (err) {
      console.error(err);
    } finally {
      quickGuestBtn.textContent = t('btn_quick_guest');
    }
  });
}

function loginWithPair(pair, username, isRestored = false) {
  currentPair = pair;
  currentUsername = username;

  // Persist session to localStorage so refresh keeps the user logged in
  try {
    localStorage.setItem('onepick_user', username);
    localStorage.setItem('onepick_pair', JSON.stringify(pair));
  } catch (e) {
    console.warn('[onepick] Impossibile salvare la sessione in localStorage:', e);
  }

  // Update header auth badge & sigil
  if (authorSigilDisplay) {
    authorSigilDisplay.innerHTML = generateSigilSvg(pair.pub, 18);
    authorSigilDisplay.classList.remove('hidden');
  }
  if (authorBadge) {
    authorBadge.textContent = `${username} (${truncateKey(pair.pub)})`;
    authorBadge.title = `${t('auth_badge_pubkey_title')}${pair.pub}`;
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
        slotStatusBadge.textContent = t('slot_active');
        slotStatusBadge.className = 'status-badge auth-badge';
      }

      // Ensure station is in map
      slot.freq = getFrequencyForPub(pair.pub);
      stationsMap.set(pair.pub, slot);
      updateUrlValidationUI();
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
        nodsReceivedBadge.textContent = `${t('nods_received_prefix')}${myNodsCount} ${myNodsCount === 1 ? t('nods_received_singular') : t('nods_received_plural')}`;
        nodsReceivedBadge.classList.remove('hidden');
      }

      // If currently viewing own station in the receiver, update station badges immediately
      if (activeStationPub === pair.pub) {
        if (currentStationBadge) {
          currentStationBadge.textContent = `${t('badge_own_frequency')} · ${myNodsCount} ${myNodsCount === 1 ? t('nods_short_singular') : t('nods_short_plural')}`;
        }
        if (pickOriginBadge) {
          const authorLabel = currentUsername || truncateKey(pair.pub);
          pickOriginBadge.textContent = `${t('pick_origin_own')} (${authorLabel}) · ${t('nods_received_prefix')}${myNodsCount} ${myNodsCount === 1 ? t('nods_short_singular') : t('nods_short_plural')}`;
        }
      }
    }
  });

  if (!isRestored) {
    showToast(`${t('toast_node_ready_prefix')}${username}${t('toast_node_ready_suffix')}`);
  }
}

function restoreStoredAuth() {
  try {
    const savedUser = localStorage.getItem('onepick_user');
    const savedPairRaw = localStorage.getItem('onepick_pair');
    if (savedUser && savedPairRaw) {
      const pair = JSON.parse(savedPairRaw);
      if (pair && pair.pub && pair.priv) {
        loginWithPair(pair, savedUser, true);
        console.log(`[onepick] Sessione ripristinata con successo per nodo @${savedUser} (${truncateKey(pair.pub)})`);
      }
    }
  } catch (err) {
    console.warn('[onepick] Errore ripristino sessione autenticata da localStorage:', err);
  }
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
          intervalMs: 5 * 60 * 1000,
          onBroadcast: (res) => {
            if (res) {
              console.log(`[onepick seeder] Rotated @${res.bot} on FM ${res.freq.toFixed(2)}: ${res.track.title}`);
            }
          }
        });
        window.onepickSeeder = seeder;

        // Check network on page entry: auto-seed missing bots or rotate stale stations (>5 min)
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
    relayText.textContent = online ? t('relay_online') : t('relay_connecting');
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
        const isBot = isBotStation(pub, slot.author || freqNotice.author);
        const isOwn = currentPair && currentPair.pub === pub;
        const slotAge = Date.now() - (slot.ts || freqNotice.ts || Date.now());

        // Nascondi stazioni inattive da più di 24 ore (escludendo i bot e la propria stazione)
        if (!isBot && !isOwn && slotAge > MAX_STATION_AGE_MS) {
          if (stationsMap.has(pub)) {
            stationsMap.delete(pub);
            updateStationsCounter();
            updateFrictionUI();
          }
          return;
        }

        const existing = stationsMap.get(pub);
        if (existing && existing.url === slot.url && existing.caption === slot.caption && existing.ts === slot.ts) {
          return;
        }

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
    const activeStations = Array.from(stationsMap.values()).filter(s => isStationActive(s));
    onlineStationsCount.textContent = `${t('online_stations_prefix')}${activeStations.length}`;
  }
}

// Pulizia periodica automatica ogni minuto per le stazioni che superano le 24h
function cleanupExpiredStations() {
  let changed = false;
  for (const [pub, station] of stationsMap.entries()) {
    if (!isStationActive(station)) {
      stationsMap.delete(pub);
      changed = true;
      if (activeStationPub === pub) {
        const activeStations = getFilteredStations();
        if (activeStations.length > 0) {
          tuneToStation(activeStations[0].pub);
        } else {
          renderEmptyRadioState();
        }
      }
    }
  }
  if (changed) {
    updateStationsCounter();
    updateFrictionUI();
  }
}
setInterval(cleanupExpiredStations, 60 * 1000);

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
        const isBot = isBotStation(peerParam, slot.author);
        const isOwn = currentPair && currentPair.pub === peerParam;
        const slotAge = Date.now() - (slot.ts || Date.now());
        if (!isBot && !isOwn && slotAge > MAX_STATION_AGE_MS) {
          showToast(currentLang === 'it' ? 'Questa frequenza è inattiva da più di 24 ore.' : 'This frequency has been inactive for more than 24 hours.');
          return;
        }
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

function toggleCanvasMode(force, silent = false) {
  const nextState = typeof force === 'boolean' ? force : !isCanvasMode;
  isCanvasMode = nextState;

  if (isCanvasMode) {
    document.body.classList.add('canvas-mode');
    canvasExitBar?.classList.remove('hidden');
    canvasToggleBtn?.classList.add('btn-active');
    radioCanvasQuickBtn?.classList.add('btn-active');
    if (canvasBtnText) canvasBtnText.textContent = t('canvas_btn_exit');
    if (!silent) showToast(t('toast_canvas_on'));
  } else {
    document.body.classList.remove('canvas-mode');
    canvasExitBar?.classList.add('hidden');
    canvasToggleBtn?.classList.remove('btn-active');
    radioCanvasQuickBtn?.classList.remove('btn-active');
    if (canvasBtnText) canvasBtnText.textContent = t('canvas_btn');
    if (!silent) showToast(t('toast_canvas_off'));
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

  // Initialize UI for default canvas mode
  if (isCanvasMode) {
    document.body.classList.add('canvas-mode');
    canvasExitBar?.classList.remove('hidden');
    canvasToggleBtn?.classList.add('btn-active');
    radioCanvasQuickBtn?.classList.add('btn-active');
    if (canvasBtnText) canvasBtnText.textContent = t('canvas_btn_exit');
  }

  // Keyboard shortcuts:
  // - Esc: exit canvas mode
  // - 'c' or 'C': toggle canvas mode when not editing inputs or modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (tutorialModal && !tutorialModal.classList.contains('hidden')) {
        closeTutorialModal();
        return;
      }
      const openModal = document.querySelector('.modal-overlay:not(.hidden)');
      if (openModal) {
        openModal.classList.add('hidden');
        return;
      }
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

    // 'r' or 'R': manual dynamic rotation of bot tracks
    if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const activeEl = document.activeElement;
      const tag = activeEl ? activeEl.tagName.toLowerCase() : '';
      const isInput = tag === 'input' || tag === 'textarea' || activeEl?.isContentEditable;
      const isModalOpen = document.querySelector('.modal-overlay:not(.hidden)');
      if (!isInput && !isModalOpen) {
        e.preventDefault();
        handleManualBotRotation();
      }
    }
  });
}

// --- Ultra-Lightweight Radio Ether Wave & FM Shockwave Background Visualizer ---

let etherCanvas = null;
let etherCtx = null;
let etherAnimFrameId = null;
let etherCurrentFreq = 88.0;
let etherTargetFreq = 88.0;
let etherPhase = 0;
let etherWarpEnergy = 0;
const etherRings = [];

function initEtherVisualizer() {
  etherCanvas = document.getElementById('radio-ether-canvas');
  if (!etherCanvas) return;
  etherCtx = etherCanvas.getContext('2d', { alpha: true });
  if (!etherCtx) return;

  function resizeCanvas() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Set 1:1 pixel ratio for background wave canvas (eliminates high-DPI fillrate lag)
    etherCanvas.width = w;
    etherCanvas.height = h;
    etherCtx.setTransform(1, 0, 0, 1, 0, 0);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let lastFrameTime = 0;
  const TARGET_FPS = 30;
  const FRAME_INTERVAL = 1000 / TARGET_FPS;

  function renderEtherFrame(now = performance.now()) {
    etherAnimFrameId = requestAnimationFrame(renderEtherFrame);

    if (document.hidden) return;

    // Check prefers-reduced-motion: freeze animation if user prefers minimal motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Throttle to 30 FPS to reduce GPU/CPU consumption by ~70%
    const elapsed = now - lastFrameTime;
    if (elapsed < FRAME_INTERVAL) return;
    lastFrameTime = now - (elapsed % FRAME_INTERVAL);

    const w = window.innerWidth;
    const h = window.innerHeight;
    etherCtx.clearRect(0, 0, w, h);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
      (!document.documentElement.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Smooth frequency interpolation towards active station
    etherCurrentFreq += (etherTargetFreq - etherCurrentFreq) * 0.08;
    const normFreq = Math.max(0, Math.min(1, (etherCurrentFreq - FREQ_MIN) / (FREQ_MAX - FREQ_MIN)));

    // Smooth warp decay
    etherWarpEnergy *= 0.93;
    if (etherWarpEnergy < 0.005) etherWarpEnergy = 0;

    etherPhase += 0.012 + (isRadioOn ? 0.012 : 0) + etherWarpEnergy * 0.035;

    // --- 1. Draw Expanding Electromagnetic Shockwave Rings ---
    for (let i = etherRings.length - 1; i >= 0; i--) {
      const ring = etherRings[i];
      if (ring.delay > 0) {
        ring.delay--;
        continue;
      }

      ring.r += ring.speed;
      const progress = ring.r / ring.maxR;
      ring.alpha = Math.max(0, 0.75 * (1 - progress));

      if (ring.r >= ring.maxR || ring.alpha <= 0.01) {
        etherRings.splice(i, 1);
        continue;
      }

      etherCtx.save();
      etherCtx.beginPath();
      etherCtx.arc(ring.cx, ring.cy, ring.r, 0, Math.PI * 2);

      const strokeColor = isDark
        ? (ring.isRandom ? `rgba(245, 158, 11, ${ring.alpha})` : `rgba(16, 185, 129, ${ring.alpha})`)
        : `rgba(15, 23, 42, ${ring.alpha * 0.35})`;

      etherCtx.strokeStyle = strokeColor;
      etherCtx.lineWidth = ring.isRandom ? 2.0 : 1.4;
      etherCtx.setLineDash(ring.dash);
      etherCtx.stroke();

      // Telemetry frequency text floating with leading ring
      if (ring.showText && ring.alpha > 0.25 && ring.r > 70 && ring.r < ring.maxR * 0.7) {
        etherCtx.font = '10px ui-monospace, monospace';
        etherCtx.fillStyle = isDark
          ? (ring.isRandom ? `rgba(245, 158, 11, ${ring.alpha * 0.9})` : `rgba(16, 185, 129, ${ring.alpha * 0.9})`)
          : `rgba(15, 23, 42, ${ring.alpha * 0.5})`;
        const tx = ring.cx + ring.r * 0.707 + 6;
        const ty = ring.cy - ring.r * 0.707 - 6;
        etherCtx.fillText(`${ring.freqText} · FM LOCK`, tx, ty);
      }

      etherCtx.restore();
    }

    // --- 2. Draw Radio Carrier Waves (Optimized 32px step, single/double stroke) ---
    const baseCenterY = h * 0.5;
    const waveAmp1 = 22 + (isRadioOn ? 16 : 0) + etherWarpEnergy * 24;
    const waveK1 = 0.003 + normFreq * 0.005;

    // Wave 1: Primary FM Carrier Wave (Amber/Slate)
    etherCtx.save();
    etherCtx.beginPath();
    for (let x = 0; x <= w + 32; x += 32) {
      const y = baseCenterY + Math.sin(x * waveK1 + etherPhase) * waveAmp1;
      if (x === 0) etherCtx.moveTo(x, y);
      else etherCtx.lineTo(x, y);
    }
    if (isDark && etherWarpEnergy > 0.1) {
      etherCtx.strokeStyle = `rgba(245, 158, 11, ${0.1 + (isRadioOn ? 0.08 : 0)})`;
      etherCtx.lineWidth = 4.0;
      etherCtx.stroke();
    }
    etherCtx.strokeStyle = isDark
      ? `rgba(245, 158, 11, ${0.45 + (isRadioOn ? 0.25 : 0)})`
      : `rgba(15, 23, 42, ${0.14 + (isRadioOn ? 0.08 : 0)})`;
    etherCtx.lineWidth = 1.6;
    etherCtx.stroke();
    etherCtx.restore();

    // Wave 2: Harmonic Resonance Wave (Emerald/Teal)
    const waveAmp2 = 14 + (isRadioOn ? 10 : 0) + etherWarpEnergy * 14;
    const waveK2 = waveK1 * 1.5;
    etherCtx.save();
    etherCtx.beginPath();
    for (let x = 0; x <= w + 32; x += 32) {
      const y = (baseCenterY + 28) + Math.sin(x * waveK2 - etherPhase * 1.3) * waveAmp2;
      if (x === 0) etherCtx.moveTo(x, y);
      else etherCtx.lineTo(x, y);
    }
    if (isDark && etherWarpEnergy > 0.1) {
      etherCtx.strokeStyle = `rgba(16, 185, 129, ${0.08 + (isRadioOn ? 0.06 : 0)})`;
      etherCtx.lineWidth = 3.0;
      etherCtx.stroke();
    }
    etherCtx.strokeStyle = isDark
      ? `rgba(16, 185, 129, ${0.32 + (isRadioOn ? 0.18 : 0)})`
      : `rgba(13, 148, 136, ${0.1 + (isRadioOn ? 0.06 : 0)})`;
    etherCtx.lineWidth = 1.3;
    etherCtx.stroke();
    etherCtx.restore();

    etherAnimFrameId = requestAnimationFrame(renderEtherFrame);
  }

  etherAnimFrameId = requestAnimationFrame(renderEtherFrame);
}

function triggerEtherPulse(freq = 88.0, isRandom = false) {
  etherTargetFreq = freq;
  etherWarpEnergy = isRandom ? 1.6 : 0.9;

  // Flash subtle hardware feedback on radio tuner card
  document.body.classList.add('ether-tuning-warp');
  setTimeout(() => document.body.classList.remove('ether-tuning-warp'), 300);

  // Compute tuner origin coordinates
  const tuner = document.querySelector('.radio-tuner');
  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  if (tuner) {
    const rect = tuner.getBoundingClientRect();
    cx = rect.left + rect.width / 2;
    cy = rect.top + rect.height / 2;
  }

  const maxR = Math.max(window.innerWidth, window.innerHeight) * 1.05;
  const numRings = isRandom ? 2 : 1;

  for (let i = 0; i < numRings; i++) {
    etherRings.push({
      cx: cx,
      cy: cy,
      r: 20 + i * 25,
      maxR: maxR,
      speed: isRandom ? 6.5 : 5.0,
      delay: i * 6,
      alpha: 0.85,
      freqText: `FM ${freq.toFixed(2)} MHz`,
      showText: i === 0,
      isRandom: isRandom,
      dash: [6, 6]
    });
  }
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
  setupCassettoTabs();
  initZen();
  restoreStoredAuth();
  initEtherVisualizer();

  // Power radio initialization & listener
  setupPowerRadio();

  // Always show the guide before everything else, unless user explicitly checked "Non mostrare più all'avvio"
  const dontShow = localStorage.getItem('onepick_tutorial_dont_show') === 'true';
  if (!dontShow) {
    openTutorialModal(1);
  }

  // Tune initial station after setup
  setTimeout(() => {
    checkInitialPeerParam();
    updateStationsCounter();
  }, 400);
}

// Boot
window.addEventListener('DOMContentLoaded', initApp);


