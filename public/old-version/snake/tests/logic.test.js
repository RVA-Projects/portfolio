// Pruebas del núcleo lógico (contrato C-1, R13-R27).
// Sin navegador: todo el comportamiento se valida en Node (R38).
// Se usan tableros pequeños para reproducir casos límite con exactitud;
// la geometría por defecto de config.js se cubre en el estado inicial.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  createInitialState,
  startInDirection,
  step,
  togglePause,
  spawnFood,
} from '../logic.js';
import { DIRS } from '../board.js';
import {
  SPEED_MIN, SPEED_MAX, SPEED_STEP, BOARD_COLS, BOARD_ROWS,
  MAX_FOODS_ON_BOARD,
} from '../config.js';

// rng determinista: elige SIEMPRE el primer elemento de la lista de libres.
const firstFreeRng = () => 0;

// Cercanía exacta con tolerancia de coma flotante (p. ej. 0.8 + 0.02·10).
const closeTo = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9);

// Estado 'running' base, con tablero pequeño y una comida lejos de la acción
// (enmienda F7: el estado lleva foods[]; el helper monta una sola).
function runningState({ cols = 6, rows = 6, body, dir = 'RIGHT', food, foods, pendingGrow = 0, score = 0 }) {
  const dirVec = DIRS[dir];
  return {
    cols,
    rows,
    snake: { body: body.map((c) => ({ ...c })), dir: { ...dirVec }, pendingGrow },
    foods: foods ? foods.map((f) => ({ ...f })) : (food ? [{ ...food }] : []),
    score,
    speedMult: SPEED_MIN + SPEED_STEP * score,
    status: 'running',
  };
}

describe('Contrato C-1: estado inicial y arranque (R19/R20/R25)', () => {
  it('createInitialState: listo en pausa, centrado, con alimento y velocidad inicial', () => {
    const state = createInitialState();
    assert.equal(state.status, 'ready');
    assert.equal(state.score, 0);
    assert.equal(state.speedMult, SPEED_MIN);
    assert.equal(state.snake.body.length, 3); // START_SNAKE_LENGTH
    assert.equal(state.foods.length, 1); // R16 enmendada: empieza con 1 comida
    const head = state.snake.body[0];
    // Serpiente centrada: dentro del tablero y lejos de los bordes.
    assert.ok(head.x > 0 && head.x < BOARD_COLS - 1);
    assert.ok(head.y > 0 && head.y < BOARD_ROWS - 1);
    // La comida no cae sobre la serpiente.
    assert.deepEqual(
      state.snake.body.filter((c) => c.x === state.foods[0].x && c.y === state.foods[0].y),
      [],
    );
  });

  it('createInitialState con rng inyectado coloca la comida en la primera celda libre', () => {
    const state = createInitialState({}, firstFreeRng);
    assert.deepEqual(state.foods, [{ x: 0, y: 0 }]); // primer libre fila a fila
  });

  it('startInDirection: ready → running, la serpiente mira en la tecla pulsada', () => {
    const state = createInitialState();
    const started = startInDirection(state, 'UP');
    assert.equal(started.status, 'running');
    const head = started.snake.body[0];
    assert.deepEqual(started.snake.dir, DIRS.UP);
    // Cuerpo reconstruido en contra de la dirección (debajo de la cabeza).
    assert.deepEqual(started.snake.body[1], { x: head.x, y: head.y + 1 });
    assert.deepEqual(started.snake.body[2], { x: head.x, y: head.y + 2 });
  });

  it('startInDirection solo actúa en ready', () => {
    const state = runningState({ body: [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }] });
    assert.equal(startInDirection(state, 'UP'), state); // mismo objeto, sin cambios
  });
});

describe('Contrato C-1: movimiento, wrap y pureza (R14/R23)', () => {
  it('un tick avanza la cabeza una celda y el estado original no se muta', () => {
    const state = runningState({
      body: [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }],
      food: { x: 0, y: 5 },
    });
    const before = JSON.parse(JSON.stringify(state));
    const { state: next, events } = step(state, null);
    assert.deepEqual(next.snake.body[0], { x: 4, y: 3 });
    assert.deepEqual(next.snake.body[2], { x: 2, y: 3 }); // la cola avanza también
    assert.deepEqual(events, []);
    assert.deepEqual(state, before); // purity: el de entrada queda intacto
  });

  it('wrap R23: la cabeza rebota por el lado opuesto sin morir', () => {
    // Cabeza al filo del borde derecho, cuerpo detrás; al avanzar reaparece a la izquierda.
    const state = runningState({ body: [{ x: 5, y: 2 }, { x: 4, y: 2 }, { x: 3, y: 2 }], food: { x: 0, y: 0 } });
    const { state: next, events } = step(state, null);
    assert.deepEqual(next.snake.body[0], { x: 0, y: 2 });
    assert.deepEqual(events, []);
  });

  it('cierra el ciclo alrededor de las 4 esquinas sin efectos raros', () => {
    const state = runningState({ body: [{ x: 5, y: 5 }, { x: 5, y: 4 }, { x: 5, y: 3 }], dir: 'DOWN', food: { x: 0, y: 0 } });
    const { state: next } = step(state, null);
    assert.deepEqual(next.snake.body[0], { x: 5, y: 0 });
  });
});

describe('Contrato C-1: colisiones (R24/R27) y direcciones (R15)', () => {
  it('R27: la celda que la cola libera en el mismo tick NO mata (el caso del anillo)', () => {
    // Cuerpo de 2 celdas envolviendo el borde derecho: cabeza en x=5, cola en x=0.
    // La cabeza entra en la celda (0,y) exactamente cuando la cola la libera.
    const state = runningState({ body: [{ x: 5, y: 2 }, { x: 0, y: 2 }], food: { x: 0, y: 0 } });
    const { state: next, events } = step(state, null);
    assert.deepEqual(next.snake.body[0], { x: 0, y: 2 });
    assert.equal(next.status, 'running');
    assert.deepEqual(events, []);
  });

  it('R27 también protege mientras crece: cola sin liberar este tick', () => {
    const state = runningState({
      body: [{ x: 3, y: 2 }, { x: 0, y: 2 }],
      food: { x: 0, y: 0 },
      pendingGrow: 1,
    });
    const { state: next } = step(state, null);
    assert.equal(next.status, 'running');
    assert.deepEqual(next.snake.body, [{ x: 4, y: 2 }, { x: 3, y: 2 }, { x: 0, y: 2 }]);
  });

  it('R24: la cabeza NO entra en una celda copada por el cuerpo → game over', () => {
    // Curva en U: la cabeza cae sobre la curva del cuerpo (la cola libera
    // otra celda); coexistencia de dos bloques en la misma celda.
    const state = runningState({
      body: [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
      dir: 'DOWN',
      food: { x: 5, y: 5 },
    });
    const { state: next, events } = step(state, null);
    assert.equal(next.status, 'over');
    assert.deepEqual(events, ['gameover']);
    // Congelada: el cuerpo no avanza al morir.
    assert.deepEqual(next.snake.body, state.snake.body);
  });

  it('una dirección inválida lanza Error de contrato', () => {
    const state = runningState({ body: [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }] });
    assert.throws(() => step(state, 'X'), /\[logic\] Dirección inválida/);
  });

  it('la inversión de 180° se ignora dentro del tick', () => {
    const state = runningState({
      body: [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }],
      dir: 'RIGHT',
      food: { x: 0, y: 0 },
    });
    const { state: next } = step(state, 'LEFT');
    assert.deepEqual(next.snake.body[0], { x: 4, y: 3 }); // sigue hacia la derecha
  });
});

describe('Contrato C-1: comida, crecimiento y velocidad (R16/R18/R25)', () => {
  it('comer: +1 score, +1 evento, crecimiento y velocidad +0.02', () => {
    const state = runningState({
      body: [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }],
      food: { x: 4, y: 3 },
    });
    const { state: next, events } = step(state, null);
    assert.deepEqual(events, ['food']);
    assert.equal(next.score, 1);
    assert.equal(next.speedMult, SPEED_MIN + SPEED_STEP);
    assert.equal(next.snake.body.length, 4); // crecido este mismo tick
    // Enmienda F7: el alimento comido se retira y NO se repone al instante
    // (el repone spawnFood con su ritmo desde main.js, C-2).
    assert.deepEqual(next.foods, []);
  });

  it('comer solo retira el alimento tocado: los demás sobreviven', () => {
    const state = runningState({
      body: [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }],
      foods: [{ x: 4, y: 3 }, { x: 0, y: 0 }],
    });
    const { state: next } = step(state, null);
    assert.deepEqual(next.foods, [{ x: 0, y: 0 }]);
  });

  it('la velocidad sube con el score y topa en SPEED_MAX (índice calculado, no literales)', () => {
    const atScore = (score) =>
      step(
        runningState({
          body: [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }],
          food: { x: 4, y: 3 },
          score,
        }),
        null,
      ).state.speedMult;
    // R25: cap cuando SPEED_MIN + SPEED_STEP·score alcanza SPEED_MAX.
    // Índice buscado con la misma aritmética del step (sin sorpresas de
    // coma flotante en el ceil). OJO: `atScore(n)` come EN el tick, así que
    // el score resultante es n+1.
    let capScore = 0;
    while (SPEED_MIN + SPEED_STEP * capScore < SPEED_MAX) capScore += 1;
    // Con score capScore−2, al comer llega a capScore−1: aún bajo el cap.
    closeTo(atScore(capScore - 2), SPEED_MIN + SPEED_STEP * (capScore - 1));
    assert.ok(atScore(capScore - 2) < SPEED_MAX);
    // Con score capScore−1, al comer toca el cap y se queda clavado ahí.
    assert.equal(atScore(capScore - 1), SPEED_MAX); // cap alcanzado
    assert.equal(atScore(capScore * 3), SPEED_MAX); // el cap se mantiene siempre
  });

  it('sin comida no cambia ni la puntuación ni la velocidad', () => {
    const state = runningState({
      body: [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }],
      food: { x: 0, y: 0 },
      score: 7,
    });
    const { state: next, events } = step(state, null);
    assert.deepEqual(events, []);
    assert.equal(next.score, 7);
    assert.equal(next.speedMult, state.speedMult);
  });
});

describe('Contrato C-1: victoria por tablero lleno (R22)', () => {
  const victoryState = () => {
    // 3×3 lleno menos la celda (1,1); la cabeza (1,0) mira hacia abajo.
    const body = [
      { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 },
      { x: 1, y: 2 }, { x: 0, y: 2 }, { x: 0, y: 1 }, { x: 0, y: 0 },
    ];
    return runningState({ cols: 3, rows: 3, body, dir: 'DOWN', food: { x: 1, y: 1 } });
  };

  it('comer la última celda libre → foods [] y victoria', () => {
    const { state: next, events } = step(victoryState(), null);
    assert.equal(next.status, 'victory');
    assert.deepEqual(next.foods, []); // enmienda F7: el comido se retira
    assert.deepEqual(events, ['food', 'victory']);
    assert.equal(next.snake.body.length, 9); // el tablero queda completo
  });

  it('victory: el estado ya no avanza con más ticks', () => {
    const { state: next } = step(victoryState(), null);
    const { state: same, events } = step(next, null);
    assert.equal(same, next);
    assert.deepEqual(events, []);
  });
});

describe('Contrato C-1: spawn progresivo de comida (enmienda F7, ADR-014)', () => {
  const baseBody = () => [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }];

  it('añade un alimento en celda libre (sin pisar serpiente ni otra comida)', () => {
    const state = runningState({
      body: baseBody(),
      foods: [{ x: 0, y: 5 }],
    });
    const before = JSON.parse(JSON.stringify(state));
    const { state: next, events } = spawnFood(state, firstFreeRng);
    assert.deepEqual(events, ['spawn']);
    assert.equal(next.foods.length, 2);
    // Con firstFreeRng la primera libre es (0,0) — libre de serpiente y comida.
    assert.deepEqual(next.foods[1], { x: 0, y: 0 });
    // Ninguna comida cae sobre la serpiente.
    for (const foodCell of next.foods) {
      assert.ok(next.snake.body.every((c) => !(c.x === foodCell.x && c.y === foodCell.y)));
    }
    assert.deepEqual(state, before); // pureza: el de entrada no se muta
  });

  it('respeta MAX_FOODS_ON_BOARD: al máximo es no-op idéntico', () => {
    const foods = Array.from({ length: MAX_FOODS_ON_BOARD }, (_, i) => ({ x: i, y: 0 }));
    const state = runningState({ body: baseBody(), foods });
    const { state: next, events } = spawnFood(state, firstFreeRng);
    assert.equal(next, state); // mismo objeto: no cambia nada
    assert.deepEqual(events, []);
  });

  it('fuera de running (ready/paused/over) es no-op idéntico', () => {
    const running = runningState({ body: baseBody() });
    const wrongStates = [
      createInitialState(), // status 'ready'
      togglePause(running), // status 'paused'
      { ...running, status: 'over' }, // partida finalizada
    ];
    for (const wrong of wrongStates) {
      const { state: next, events } = spawnFood(wrong, firstFreeRng);
      assert.equal(next, wrong);
      assert.deepEqual(events, []);
    }
  });

  it('sin celda libre (tablero lleno) es no-op: la victoria lo cubre en step', () => {
    const body = [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 },
      { x: 1, y: 1 },
    ];
    const state = runningState({ cols: 2, rows: 2, body });
    const { state: next, events } = spawnFood(state, firstFreeRng);
    assert.equal(next, state);
    assert.deepEqual(events, []);
  });
});

describe('Contrato C-1: pausa (R21)', () => {
  it('togglePause alterna solo running⇄paused', () => {
    let state = runningState({ body: [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }] });
    state = togglePause(state);
    assert.equal(state.status, 'paused');
    state = togglePause(state);
    assert.equal(state.status, 'running');
  });

  it('en ready/over/victory togglePause no cambia nada', () => {
    const ready = createInitialState();
    assert.equal(togglePause(ready), ready);
    const over = runningState({ body: [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }] });
    over.status = 'over';
    assert.equal(togglePause(over), over);
  });

  it('step en pausa es un no-op (identidad y sin eventos)', () => {
    let state = runningState({ body: [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }] });
    state = togglePause(state);
    const { state: same, events } = step(state, 'UP');
    assert.equal(same, state);
    assert.deepEqual(events, []);
  });
});
