// i18n.js — Textos de la interfaz ES/EN (contrato C-3, ADR-009).
// Ningún texto de UI vive incrustado en los módulos de presentación (R31).
// Idioma por defecto: español. DOM-free (importable en Node, C-0).
// El idioma activo vive en la memoria de la sesión (no se persiste).

export const LANGUAGES = ['es', 'en'];
export const DEFAULT_LANGUAGE = 'es';

const DICTIONARIES = {
  es: {
    title: 'Snake',
    playerName: 'Nombre del jugador',
    btnName: 'Introducir nombre',
    btnRanking: 'Ver ranking',
    btnFullscreen: 'Pantalla completa',
    btnLanguage: 'Cambiar idioma',
    btnPause: 'Play / Pausa',
    btnMusic: 'Música',
    btnSfx: 'Efectos',
    audioOn: 'sí',
    audioOff: 'no',
    overlayStart: 'Pulsa una dirección (WASD o flechas) para empezar',
    dpadUp: 'Arriba',
    dpadDown: 'Abajo',
    dpadLeft: 'Izquierda',
    dpadRight: 'Derecha',
    overlayGameOver: 'GAME OVER',
    overlayEnterToPlay: 'Pulsa Enter para volver a jugar',
    overlayVictory: '¡Victoria!',
    overlayPause: 'Pausa',
    rankTitle: 'Ranking',
    rankEmpty: 'Sin partidas registradas todavía.',
    nameInputPlaceholder: 'Escribe tu nombre…',
    btnSaveName: 'Guardar',
    btnCloseOverlay: 'Cerrar',
    defaultPlayerName: 'Jugador',
  },
  en: {
    title: 'Snake',
    playerName: 'Player name',
    btnName: 'Enter name',
    btnRanking: 'View ranking',
    btnFullscreen: 'Fullscreen',
    btnLanguage: 'Change language',
    btnPause: 'Play / Pause',
    btnMusic: 'Music',
    btnSfx: 'Sound FX',
    audioOn: 'on',
    audioOff: 'off',
    overlayStart: 'Press a direction (WASD or arrows) to start',
    dpadUp: 'Up',
    dpadDown: 'Down',
    dpadLeft: 'Left',
    dpadRight: 'Right',
    overlayGameOver: 'GAME OVER',
    overlayEnterToPlay: 'Press Enter to play again',
    overlayVictory: 'Victory!',
    overlayPause: 'Paused',
    rankTitle: 'Ranking',
    rankEmpty: 'No games recorded yet.',
    nameInputPlaceholder: 'Type your name…',
    btnSaveName: 'Save',
    btnCloseOverlay: 'Close',
    defaultPlayerName: 'Player',
  },
};

let activeLanguage = DEFAULT_LANGUAGE;

export function setLanguage(lang) {
  if (typeof lang !== 'string' || !DICTIONARIES[lang]) {
    console.error(`[i18n] Idioma no soportado: "${lang}". Se mantiene "${activeLanguage}".`);
    return activeLanguage;
  }
  activeLanguage = lang;
  return activeLanguage;
}

export function getActiveLanguage() {
  return activeLanguage;
}

export function get(lang, key) {
  const dictionary = DICTIONARIES[lang];
  if (!dictionary || !(key in dictionary)) {
    console.error(`[i18n] Clave "${key}" no definida para "${lang}".`);
    return key;
  }
  return dictionary[key];
}

export function t(key) {
  return get(activeLanguage, key);
}
