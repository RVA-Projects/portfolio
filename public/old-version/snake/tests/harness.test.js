// Smoke tests del harness.
// 1. Contrato C-0 (docs/contracts.md): los módulos DOM-free de producción
//    son ES válidos, importables por Node y no referencian APIs del
//    navegador. main.js y ui.js quedan fuera (tocan el DOM): los cubre
//    `npm run check` y la validación manual en navegador.
// 2. Contrato C-3: los diccionarios i18n contienen TODAS las claves
//    mínimas definidas en docs/contracts.md, en ambos idiomas.
// 3. Contrato C-4: storage.js devuelve una lista limpia sin navegador.

import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import * as i18n from '../i18n.js';
import { listScores } from '../storage.js';

// La cadena lógica + soporte DOM-free. Se amplía al crecer el proyecto.
const DOM_FREE_MODULES = ['logic.js', 'board.js', 'snake.js', 'food.js', 'utils.js', 'config.js', 'i18n.js'];
// storage.js accede a localStorage SOLO dentro de métodos (C-4): el fichero
// puede mencionarlo, pero window/document nunca.
const STORAGE_MODULE = 'storage.js';

// Claves mínimas del contrato C-3 (si se añade una clave nueva a la UI,
// se añade aquí y a AMBOS diccionarios).
const REQUIRED_I18N_KEYS = [
  'title', 'playerName', 'btnName', 'btnRanking', 'btnFullscreen',
  'btnLanguage', 'btnPause', 'overlayStart', 'overlayGameOver',
  'overlayEnterToPlay', 'overlayVictory', 'overlayPause', 'rankTitle',
  'rankEmpty', 'nameInputPlaceholder', 'btnSaveName', 'btnCloseOverlay',
  'defaultPlayerName',
];

describe('Contrato C-0: módulos ES importables sin efectos secundarios', () => {
  for (const file of [...DOM_FREE_MODULES, STORAGE_MODULE]) {
    it(`${file} es un módulo ES válido e importable`, async () => {
      await import(`../${file}`);
    });
  }
});

describe('Invariantes del contrato C-0', () => {
  for (const file of DOM_FREE_MODULES) {
    it(`${file} no usa window ni document (DOM-free, R38)`, () => {
      const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
      assert.doesNotMatch(source, /\b(window|document)\b/);
    });
  }

  it(`${STORAGE_MODULE} no usa window ni document (localStorage solo por interfaz, C-4)`, () => {
    const source = readFileSync(new URL(`../${STORAGE_MODULE}`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /\b(window|document)\b/);
  });

  it(`${STORAGE_MODULE}: listScores() devuelve lista limpia sin navegador`, () => {
    assert.deepEqual(listScores(), []);
  });
});

describe('Contrato C-3: diccionarios i18n completos', () => {
  for (const lang of i18n.LANGUAGES) {
    for (const key of REQUIRED_I18N_KEYS) {
      it(`clave "${key}" definida y no vacía en "${lang}"`, () => {
        const text = i18n.get(lang, key);
        assert.notStrictEqual(text, key, 'la clave no debe devolverse a sí misma');
        assert.match(text, /\S/, 'el texto no debe estar vacío');
      });
    }
  }
  it('idioma por defecto es español (R31)', () => {
    assert.equal(i18n.DEFAULT_LANGUAGE, 'es');
  });
});
