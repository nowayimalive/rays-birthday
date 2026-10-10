import React, { useEffect, useRef, useState } from 'react';
import { soundEngine } from './audio';
import {
  FINAL_ALLAN_LETTER_PAGES,
  MEMORY_FRAGMENTS,
  PROLOGUE_LETTER_TEXT,
} from './collectibles';

// ============================================================================
// 1. PLAYABLE CLOCKWORK ARCADE MINI-GAME: "GEAR RUNNER"
// ============================================================================
export const ArcadeMiniGameModal: React.FC<{
  alreadyWon: boolean;
  onWin: () => void;
  onClose: () => void;
}> = ({ alreadyWon, onWin, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [batteries, setBatteries] = useState(0);
  const [status, setStatus] = useState<'playing' | 'hit' | 'won'>(alreadyWon ? 'won' : 'playing');

  const gameRef = useRef({
    px: 40,
    py: 110,
    vx: 0,
    vy: 0,
    batteriesCollected: 0,
    batteryPos: { x: 250, y: 70 },
    sparks: [
      { x: 130, y: 30, vy: 2.3 },
      { x: 205, y: 180, vy: -2.6 },
      { x: 280, y: 60, vy: 2.8 },
    ],
  });

  const resetMiniGame = () => {
    soundEngine.playSfx('uiConfirm');
    gameRef.current = {
      px: 40,
      py: 110,
      vx: 0,
      vy: 0,
      batteriesCollected: 0,
      batteryPos: { x: 260, y: 65 },
      sparks: [
        { x: 130, y: 30, vy: 2.3 },
        { x: 205, y: 180, vy: -2.6 },
        { x: 280, y: 60, vy: 2.8 },
      ],
    };
    setBatteries(0);
    setStatus('playing');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') gameRef.current.vx = -3.2;
      if (k === 'arrowright' || k === 'd') gameRef.current.vx = 3.2;
      if (k === 'arrowup' || k === 'w') gameRef.current.vy = -3.2;
      if (k === 'arrowdown' || k === 's') gameRef.current.vy = 3.2;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a' || k === 'arrowright' || k === 'd') gameRef.current.vx = 0;
      if (k === 'arrowup' || k === 'w' || k === 'arrowdown' || k === 's') gameRef.current.vy = 0;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let animId = 0;
    let tick = 0;
    const loop = () => {
      tick++;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = false;
          const st = gameRef.current;

          if (status === 'playing') {
            st.px = Math.max(16, Math.min(336, st.px + st.vx));
            st.py = Math.max(16, Math.min(196, st.py + st.vy));

            for (const sp of st.sparks) {
              sp.y += sp.vy;
              if (sp.y < 18 || sp.y > 195) sp.vy *= -1;
              if (Math.hypot(st.px - sp.x, st.py - sp.y) < 16) {
                soundEngine.playSfx('land');
                setStatus('hit');
              }
            }

            if (Math.hypot(st.px - st.batteryPos.x, st.py - st.batteryPos.y) < 20) {
              st.batteriesCollected += 1;
              setBatteries(st.batteriesCollected);
              soundEngine.playSfx('coin');
              if (st.batteriesCollected >= 3) {
                soundEngine.playSfx('puzzleSolve');
                setStatus('won');
                onWin();
              } else {
                const spots = [
                  { x: 95, y: 165 },
                  { x: 245, y: 155 },
                  { x: 310, y: 55 },
                ];
                st.batteryPos = spots[st.batteriesCollected % spots.length];
              }
            }
          }

          ctx.fillStyle = '#0d1324';
          ctx.fillRect(0, 0, 360, 220);

          ctx.fillStyle = '#182442';
          for (let gx = 0; gx < 360; gx += 24) ctx.fillRect(gx, 0, 1, 220);
          for (let gy = 0; gy < 220; gy += 24) ctx.fillRect(0, gy, 360, 1);

          const bx = Math.floor(st.batteryPos.x);
          const by = Math.floor(st.batteryPos.y + Math.sin(tick * 0.12) * 3);
          ctx.fillStyle = '#38d996';
          ctx.fillRect(bx - 8, by - 10, 16, 20);
          ctx.fillStyle = '#f5b942';
          ctx.fillRect(bx - 4, by - 13, 8, 3);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(bx - 4, by - 4, 8, 8);

          for (const sp of st.sparks) {
            ctx.fillStyle = '#ff5277';
            ctx.fillRect(Math.floor(sp.x - 8), Math.floor(sp.y - 8), 16, 16);
            ctx.fillStyle = '#ffdf8c';
            ctx.fillRect(Math.floor(sp.x - 4), Math.floor(sp.y - 4), 8, 8);
          }

          ctx.fillStyle = '#6be6ff';
          ctx.fillRect(Math.floor(st.px - 9), Math.floor(st.py - 9), 18, 18);
          ctx.fillStyle = '#101322';
          ctx.fillRect(Math.floor(st.px - 5), Math.floor(st.py - 4), 3, 3);
          ctx.fillRect(Math.floor(st.px + 2), Math.floor(st.py - 4), 3, 3);
        }
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [status, onWin]);

  const nudgePlayer = (dx: number, dy: number) => {
    if (status !== 'playing') return;
    gameRef.current.px = Math.max(16, Math.min(336, gameRef.current.px + dx));
    gameRef.current.py = Math.max(16, Math.min(196, gameRef.current.py + dy));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="rpg-panel-gold w-full max-w-lg rounded-xl p-5 text-[#f5eedc]">
        <div className="flex items-center justify-between border-b border-[#4c436e] pb-3">
          <div>
            <h3 className="font-pixel text-sm text-[#f5b942]">GEAR RUNNER — ARCADE CABINET</h3>
            <p className="text-xs text-[#b8b2cc]">
              Guide the blue spark-bot (WASD / Arrow keys / buttons below), dodge red static sparks, and collect 3 Power Batteries!
            </p>
          </div>
          <span className="font-mono-num text-sm font-bold text-[#38d996] shrink-0">
            Batteries: {status === 'won' ? 3 : batteries} / 3
          </span>
        </div>

        <div className="my-4 flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={360}
            height={220}
            className="pixel-canvas w-full max-w-[360px] rounded border-2 border-[#584b7a] bg-[#0d1324]"
          />

          {status === 'playing' && (
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => nudgePlayer(-24, 0)}
                className="rounded border border-[#584b7a] bg-[#1b2038] px-3.5 py-2 text-xs font-semibold hover:border-[#f5b942] whitespace-nowrap shrink-0"
              >
                ◀ Left
              </button>
              <button
                type="button"
                onClick={() => nudgePlayer(0, -24)}
                className="rounded border border-[#584b7a] bg-[#1b2038] px-3.5 py-2 text-xs font-semibold hover:border-[#f5b942] whitespace-nowrap shrink-0"
              >
                ▲ Up
              </button>
              <button
                type="button"
                onClick={() => nudgePlayer(0, 24)}
                className="rounded border border-[#584b7a] bg-[#1b2038] px-3.5 py-2 text-xs font-semibold hover:border-[#f5b942] whitespace-nowrap shrink-0"
              >
                ▼ Down
              </button>
              <button
                type="button"
                onClick={() => nudgePlayer(24, 0)}
                className="rounded border border-[#584b7a] bg-[#1b2038] px-3.5 py-2 text-xs font-semibold hover:border-[#f5b942] whitespace-nowrap shrink-0"
              >
                Right ▶
              </button>
            </div>
          )}

          {status === 'hit' && (
            <div className="mt-3 flex items-center justify-between gap-4 rounded border border-[#ff5277] bg-[#2b1422] px-4 py-2.5 w-full">
              <span className="text-xs text-[#ffd1dc]">Zapped by a static spark! Give it another try.</span>
              <button
                type="button"
                onClick={resetMiniGame}
                className="rounded bg-[#f5b942] px-3 py-1.5 text-xs font-bold text-[#0d0f1a] hover:bg-[#ffcf66] whitespace-nowrap shrink-0"
              >
                Retry Cabinet
              </button>
            </div>
          )}

          {status === 'won' && (
            <div className="mt-3 rounded border border-[#38d996] bg-[#132b24] px-4 py-2.5 text-center text-xs text-[#a8f5d4] w-full">
              All 3 Power Batteries collected! You can now unlock the 4-Symbol Star Vault on the north wall of the Arcade.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          {status !== 'playing' && (
            <button
              type="button"
              onClick={resetMiniGame}
              className="rounded border border-[#584b7a] bg-[#1b2038] px-4 py-2 text-xs font-semibold text-[#f5eedc] hover:border-[#f5b942] whitespace-nowrap shrink-0"
            >
              Play Again
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-[#f5b942] px-4 py-2 text-xs font-bold text-[#0d0f1a] hover:bg-[#ffcf66] whitespace-nowrap shrink-0"
          >
            Back to Arcade
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. CHAPTER 3: 4-SYMBOL STAR VAULT PUZZLE MODAL
// ============================================================================
const VAULT_SYMBOLS = [
  { id: 0, name: 'STAR', subtitle: '3. Guiding Star' },
  { id: 1, name: 'MOON', subtitle: '2. Silver Moon' },
  { id: 2, name: 'SUN', subtitle: '1. Morning Sun' },
  { id: 3, name: 'ENVELOPE', subtitle: '4. Sealed Letter' },
];

const CORRECT_SEQUENCE = [2, 1, 0, 3];

export const ArcadeVaultModal: React.FC<{
  hasBatteries: boolean;
  initialDials: [number, number, number, number];
  isSolved: boolean;
  onUpdateDials: (dials: [number, number, number, number], solved: boolean) => void;
  onOpenMiniGame: () => void;
  onClose: () => void;
}> = ({ hasBatteries, initialDials, isSolved, onUpdateDials, onOpenMiniGame, onClose }) => {
  const [dials, setDials] = useState<[number, number, number, number]>(initialDials);
  const [feedback, setFeedback] = useState<string>(
    isSolved
      ? 'Star Vault Unlocked! Memory Fragment #3 has appeared in the center of the Arcade.'
      : 'Click each dial to cycle the celestial symbols in chronological order: SUN -> MOON -> STAR -> ENVELOPE.'
  );

  const cycleDial = (index: number) => {
    if (isSolved) return;
    soundEngine.playSfx('uiSelect');
    const next: [number, number, number, number] = [...dials] as [number, number, number, number];
    next[index] = (next[index] + 1) % 4;
    setDials(next);
    onUpdateDials(next, false);
  };

  const checkSolution = () => {
    if (!hasBatteries) {
      soundEngine.playSfx('land');
      setFeedback('The Star Vault requires 3 Power Batteries from the "GEAR RUNNER" cabinet first!');
      return;
    }
    const match = dials.every((val, idx) => val === CORRECT_SEQUENCE[idx]);
    if (match) {
      soundEngine.playSfx('puzzleSolve');
      setFeedback('CLICK-CHIME! All four brass gears aligned! Memory Fragment #3 has appeared in the center of the room!');
      onUpdateDials(dials, true);
    } else {
      soundEngine.playSfx('land');
      setFeedback(
        'Not quite aligned yet! Hint from the Clue Plaques: Dial 1 = SUN, Dial 2 = MOON, Dial 3 = STAR, Dial 4 = ENVELOPE.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="rpg-panel-gold w-full max-w-lg rounded-xl p-5 text-[#f5eedc]">
        <div className="border-b border-[#4c436e] pb-3">
          <h3 className="font-pixel text-sm text-[#f5b942]">4-SYMBOL STAR VAULT</h3>
          <p className="mt-1 text-xs text-[#b8b2cc]">{feedback}</p>
        </div>

        {!hasBatteries && (
          <div className="mt-3 flex items-center justify-between gap-3 rounded border border-[#f5b942]/50 bg-[#261f33] px-3.5 py-2.5">
            <span className="text-xs text-[#ffdf8c]">
              Power Status: Offline (Requires 3 Batteries from the Gear Runner cabinet)
            </span>
            <button
              type="button"
              onClick={onOpenMiniGame}
              className="rounded bg-[#f5b942] px-3 py-1.5 text-xs font-bold text-[#0d0f1a] hover:bg-[#ffcf66] whitespace-nowrap shrink-0"
            >
              Play Gear Runner
            </button>
          </div>
        )}

        <div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {dials.map((val, idx) => {
            const sym = VAULT_SYMBOLS[val];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => cycleDial(idx)}
                className="flex flex-col items-center justify-center rounded-lg border-2 border-[#584b7a] bg-[#171b30] p-3 transition hover:border-[#f5b942]"
              >
                <span className="font-mono-num text-[11px] text-[#9e96b8]">DIAL {idx + 1}</span>
                <span className="my-2 font-pixel text-sm text-[#f5b942]">{sym.name}</span>
                <span className="text-[11px] text-[#6be6ff]">{sym.subtitle}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[#584b7a] bg-[#1b2038] px-4 py-2 text-xs font-semibold text-[#f5eedc] hover:border-[#f5b942] whitespace-nowrap shrink-0"
          >
            Close
          </button>
          {!isSolved && (
            <button
              type="button"
              onClick={checkSolution}
              className="rounded bg-[#f5b942] px-5 py-2 text-xs font-bold text-[#0d0f1a] hover:bg-[#ffcf66] whitespace-nowrap shrink-0"
            >
              Pull Vault Lever
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. MEMORY FRAGMENT #5: THE UNFINISHED PICTURE VIEWER
// ============================================================================
export const UnfinishedPictureModal: React.FC<{
  isComplete: boolean;
  onClose: () => void;
}> = ({ isComplete, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#0d1226';
    ctx.fillRect(0, 0, 320, 180);
    ctx.fillStyle = '#172242';
    ctx.fillRect(0, 60, 320, 80);

    for (let i = 0; i < 32; i++) {
      ctx.fillStyle = i % 3 === 0 ? '#f5b942' : '#ffffff';
      ctx.fillRect((i * 47) % 300 + 10, (i * 29) % 100 + 10, 3, 3);
    }

    if (!isComplete) {
      ctx.fillStyle = '#262136';
      ctx.fillRect(110, 18, 100, 56);
      ctx.strokeStyle = '#6be6ff';
      ctx.strokeRect(110, 18, 100, 56);
      ctx.fillStyle = '#9e96b8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[ UNFINISHED SKY ]', 160, 50);
    } else {
      ctx.fillStyle = '#f5b942';
      const pts = [
        [120, 48],
        [145, 30],
        [175, 34],
        [198, 52],
        [160, 62],
      ];
      pts.forEach(([x, y]) => {
        ctx.fillRect(x - 3, y - 3, 6, 6);
      });
    }

    ctx.fillStyle = '#141a2e';
    ctx.fillRect(0, 135, 320, 45);
    ctx.fillStyle = '#24304d';
    ctx.fillRect(60, 128, 200, 12);

    ctx.fillStyle = '#6be6ff';
    ctx.fillRect(136, 104, 12, 24);
    ctx.fillStyle = '#ffe4d4';
    ctx.fillRect(137, 94, 10, 10);
    ctx.fillStyle = '#14161f';
    ctx.fillRect(136, 91, 12, 5);

    ctx.fillStyle = '#f5b942';
    ctx.fillRect(172, 104, 12, 24);
    ctx.fillStyle = '#f7dccb';
    ctx.fillRect(173, 94, 10, 10);
    ctx.fillStyle = '#171922';
    ctx.fillRect(172, 91, 12, 5);
  }, [isComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="rpg-panel-gold w-full max-w-md rounded-xl p-5 text-[#f5eedc]">
        <h3 className="font-pixel text-sm text-[#f5b942]">
          {isComplete ? 'THE COMPLETED SKY' : 'MEMORY FRAGMENT #5: THE UNFINISHED PICTURE'}
        </h3>
        <p className="mt-1 text-xs text-[#b8b2cc]">
          {isComplete
            ? 'All six Memory Fragments now shine together, completing the constellation above the two small silhouettes.'
            : 'A pixel-art canvas of two small figures beneath the night sky. The center of the sky is left unfinished—yet its warmth is unmistakable. Head through the Mountain Gate on the far right toward the Observatory!'}
        </p>

        <div className="my-4 flex justify-center">
          <canvas
            ref={canvasRef}
            width={320}
            height={180}
            className="pixel-canvas w-full rounded border-2 border-[#584b7a]"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-[#f5b942] px-4 py-2 text-xs font-bold text-[#0d0f1a] hover:bg-[#ffcf66] whitespace-nowrap shrink-0"
          >
            Continue Journey
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. CHAPTER 5: OBSERVATORY CONSTELLATION & FRAGMENT ASSEMBLY PUZZLE
// ============================================================================
const BEACON_LABELS = [
  { name: 'Starlight I: Somewhere Station', motif: 'The warm dusk melody where your journey began on Platform 0' },
  { name: 'Starlight II: Overgrown Garden', motif: 'The glow of night-blooms opening along the forest trail' },
  { name: 'Starlight III: Somewhere Town & Arcade', motif: 'Golden streetlamps and the steady chime of clockwork gears' },
  { name: 'Starlight IV: Quiet Side of Winter', motif: 'Footprints lingering in the blue snow outside the cabin' },
];

export const ObservatoryPuzzleModal: React.FC<{
  lights: [boolean, boolean, boolean, boolean];
  isSolved: boolean;
  onToggleLight: (index: number) => void;
  onCompleteAssembly: () => void;
  onClose: () => void;
}> = ({ lights, isSolved, onToggleLight, onCompleteAssembly, onClose }) => {
  const allLit = lights.every(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="rpg-panel-gold w-full max-w-lg rounded-xl p-5 text-[#f5eedc]">
        <div className="border-b border-[#4c436e] pb-3">
          <h3 className="font-pixel text-sm text-[#f5b942]">
            OBSERVATORY DOME — CONSTELLATION ALTAR
          </h3>
          <p className="mt-1 text-xs text-[#b8b2cc]">
            Click each of the four Constellation Lights below to ignite them, then unite all six Memory Fragments.
          </p>
        </div>

        <div className="my-4 space-y-2.5">
          {BEACON_LABELS.map((b, idx) => {
            const active = lights[idx];
            return (
              <button
                key={b.name}
                type="button"
                onClick={() => {
                  soundEngine.playSfx(active ? 'uiSelect' : 'star');
                  onToggleLight(idx);
                }}
                className={`flex w-full items-center justify-between rounded border px-3.5 py-2.5 text-left transition ${
                  active
                    ? 'border-[#f5b942] bg-[#25203b] text-[#f5eedc]'
                    : 'border-[#483d66] bg-[#141729] text-[#9e96b8] hover:border-[#6be6ff]'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{b.name}</div>
                  <div className="text-[11px] text-[#b8b2cc]">{b.motif}</div>
                </div>
                <span className="font-mono-num text-xs font-bold text-[#f5b942] whitespace-nowrap shrink-0">
                  {active ? 'IGNITED ★' : 'IGNITE'}
                </span>
              </button>
            );
          })}
        </div>

        {allLit && !isSolved && (
          <div className="mb-4 rounded border border-[#6be6ff] bg-[#14243b] p-3 text-center">
            <p className="text-xs text-[#c4f2ff]">
              All 4 Constellation Lights are shining! Click below to unite the Memory Fragments into the night sky.
            </p>
            <button
              type="button"
              onClick={() => {
                soundEngine.playSfx('finalReveal');
                onCompleteAssembly();
              }}
              className="mt-2.5 rounded bg-[#f5b942] px-5 py-2 text-xs font-bold text-[#0d0f1a] hover:bg-[#ffcf66] whitespace-nowrap shrink-0"
            >
              Assemble Memory Fragments ★
            </button>
          </div>
        )}

        {isSolved && (
          <div className="mb-4 rounded border border-[#38d996] bg-[#132b24] p-3 text-center text-xs text-[#a8f5d4]">
            The constellation is complete! Speak with The Keeper and Allan inside the Observatory.
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[#584b7a] bg-[#1b2038] px-4 py-2 text-xs font-semibold text-[#f5eedc] hover:border-[#f5b942] whitespace-nowrap shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. PARCHMENT STATION LETTER & FINAL MULTI-PAGE BIRTHDAY LETTER
// ============================================================================
export const LetterReaderModal: React.FC<{
  mode: 'prologue' | 'final';
  onFinish: () => void;
}> = ({ mode, onFinish }) => {
  const [page, setPage] = useState(0);
  const pages = mode === 'prologue' ? [PROLOGUE_LETTER_TEXT] : FINAL_ALLAN_LETTER_PAGES;
  const currentParagraphs = pages[page] || pages[0];
  const isLastPage = page >= pages.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
      <div className="w-full max-w-xl">
        {/* Top Wooden Scroll Roller */}
        <div className="mx-auto flex h-4 w-[96%] items-center justify-between rounded-full border border-[#3b2214] bg-gradient-to-b from-[#8a5632] via-[#5c361e] to-[#361e10] px-2 shadow-lg">
          <div className="h-2.5 w-3 rounded-xs bg-[#f5b942]" />
          <div className="h-2.5 w-3 rounded-xs bg-[#f5b942]" />
        </div>

        {/* Unrolled Aged Parchment Body */}
        <div className="border-x-4 border-[#9c7a4c] bg-gradient-to-b from-[#f5e7c6] via-[#edd8ad] to-[#e2c690] p-6 text-[#2b1a10] shadow-2xl">
          <div className="flex items-center justify-between border-b-2 border-[#b89462] pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#9e2b3b] text-[10px] font-bold text-[#ffdf85] shadow">
                ★
              </span>
              <h3 className="font-pixel text-xs sm:text-sm text-[#4a2812]">
                {mode === 'prologue' ? 'STATION LETTER — PLATFORM 0' : 'A LETTER FOR RAYNIO'}
              </h3>
            </div>
            {pages.length > 1 && (
              <span className="font-mono-num text-xs font-bold text-[#6e4928]">
                Page {page + 1} / {pages.length}
              </span>
            )}
          </div>

          <div className="my-5 space-y-4 leading-relaxed">
            {currentParagraphs.map((para, idx) => (
              <p
                key={idx}
                className={`text-sm sm:text-base ${
                  idx === 0 || idx === currentParagraphs.length - 1
                    ? 'font-bold text-[#4a2410]'
                    : 'font-medium text-[#2e1c10]'
                }`}
              >
                {para}
              </p>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#c4a270] pt-4">
            {page > 0 ? (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playSfx('uiSelect');
                  setPage(page - 1);
                }}
                className="rounded-lg border border-[#7a5430] bg-[#d9be8c] px-4 py-2 text-xs font-bold text-[#2b1a10] hover:bg-[#cfa96e] whitespace-nowrap shrink-0"
              >
                ◀ Previous Page
              </button>
            ) : (
              <div />
            )}

            {!isLastPage ? (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playSfx('uiConfirm');
                  setPage(page + 1);
                }}
                className="rounded-lg bg-[#752635] px-5 py-2 text-xs font-bold text-[#fff3d6] shadow hover:bg-[#8f2f42] whitespace-nowrap shrink-0"
              >
                Next Page ▶
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playSfx('finalReveal');
                  onFinish();
                }}
                className="rounded-lg bg-[#752635] px-5 py-2 text-xs font-bold text-[#fff3d6] shadow hover:bg-[#8f2f42] whitespace-nowrap shrink-0"
              >
                {mode === 'prologue' ? 'Keep Letter & Continue ➔' : 'Finish Reading ➔'}
              </button>
            )}
          </div>
        </div>

        {/* Bottom Wooden Scroll Roller */}
        <div className="mx-auto flex h-4 w-[96%] items-center justify-between rounded-full border border-[#3b2214] bg-gradient-to-b from-[#8a5632] via-[#5c361e] to-[#361e10] px-2 shadow-lg">
          <div className="h-2.5 w-3 rounded-xs bg-[#f5b942]" />
          <div className="h-2.5 w-3 rounded-xs bg-[#f5b942]" />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 6. FINAL "THE END OF THE STORY" SCREEN (WARM KEEPSAKE FINALE)
// ============================================================================
export const BirthdayPresentModal: React.FC<{
  starsCount: number;
  onEnterSecretGarden: () => void;
  onPlayAgain: () => void;
  onReturnToWorld: () => void;
}> = ({ starsCount, onEnterSecretGarden, onPlayAgain, onReturnToWorld }) => {
  const sceneCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId = 0;
    let tick = 0;
    const renderFinaleScene = () => {
      tick++;
      const canvas = sceneCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = false;
          ctx.clearRect(0, 0, 240, 110);

          // Starlit Twilight Sky Backdrop
          const grad = ctx.createLinearGradient(0, 0, 0, 110);
          grad.addColorStop(0, '#0a0e24');
          grad.addColorStop(0.6, '#1f1d42');
          grad.addColorStop(1, '#4a294f');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 240, 110);

          // Twinkling stars & constellation heart/starlight above
          for (let i = 0; i < 24; i++) {
            const sx = (i * 37 + 11) % 230 + 5;
            const sy = (i * 19 + 7) % 68 + 6;
            const twinkle = (Math.floor(tick / 14) + i) % 3 === 0 ? 3 : 2;
            ctx.fillStyle = i % 3 === 0 ? '#ffdf85' : i % 4 === 0 ? '#6be6ff' : '#ffffff';
            ctx.fillRect(sx, sy, twinkle, twinkle);
          }

          // Crescent Moon
          ctx.fillStyle = '#fff3bd';
          ctx.fillRect(192, 16, 16, 16);
          ctx.fillStyle = '#141530';
          ctx.fillRect(198, 14, 14, 14);

          // Hilltop silhouette & warm glowing lantern
          ctx.fillStyle = '#132433';
          ctx.fillRect(0, 86, 240, 24);
          ctx.fillStyle = '#1e3847';
          ctx.fillRect(40, 82, 160, 8);

          // Warm lantern between Raynio & Allan
          ctx.fillStyle = 'rgba(255, 210, 110, 0.24)';
          ctx.fillRect(104, 56, 32, 32);
          ctx.fillStyle = '#ffdf85';
          ctx.fillRect(117, 72, 6, 10);

          // Raynio silhouette (left) & Allan silhouette (right) looking at the stars
          const bob = Math.floor(Math.sin(tick * 0.06) * 1);
          // Raynio
          ctx.fillStyle = '#9e2b3b';
          ctx.fillRect(92, 68 + bob, 12, 16);
          ctx.fillStyle = '#ffe4d4';
          ctx.fillRect(93, 59 + bob, 10, 9);
          ctx.fillStyle = '#14161f';
          ctx.fillRect(92, 56 + bob, 12, 5);

          // Allan
          ctx.fillStyle = '#2b3554';
          ctx.fillRect(136, 68 - bob, 12, 16);
          ctx.fillStyle = '#f7dccb';
          ctx.fillRect(137, 59 - bob, 10, 9);
          ctx.fillStyle = '#171922';
          ctx.fillRect(136, 56 - bob, 12, 5);
        }
      }
      animId = requestAnimationFrame(renderFinaleScene);
    };
    animId = requestAnimationFrame(renderFinaleScene);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#090b14]/95 p-4">
      <div className="rpg-panel-gold my-auto w-full max-w-xl rounded-2xl p-6 sm:p-7 text-center text-[#f5eedc] shadow-2xl">
        <div className="font-pixel text-[11px] tracking-widest text-[#6be6ff]">
          THE END OF THE STORY
        </div>

        <h2
          className="mt-2 font-pixel text-xl sm:text-2xl font-bold text-[#f5b942]"
          style={{ textWrap: 'balance' }}
        >
          HAPPY BIRTHDAY, RAYNIO!
        </h2>

        <div className="my-4 flex justify-center">
          <canvas
            ref={sceneCanvasRef}
            width={240}
            height={110}
            className="pixel-canvas w-full max-w-[320px] rounded-xl border-2 border-[#584b7a] shadow-lg"
          />
        </div>

        <p className="mx-auto max-w-md font-display text-base sm:text-lg font-semibold italic leading-relaxed text-[#ffdf85]">
          “I’m so happy to be a part of your life. I’ll love you forever.”
        </p>

        <p className="mx-auto mt-2.5 max-w-md text-xs sm:text-sm leading-relaxed text-[#e6dec8]">
          You’ve collected every memory and reached the very top of the Observatory. Thank you for walking through every corner of this little world, Raynio.
        </p>

        {/* All 6 Memory Fragments Recap */}
        <div className="mt-4 rounded-xl border border-[#3e3659] bg-[#131629]/90 p-3 text-left">
          <div className="mb-2 text-center font-pixel text-[10px] text-[#6be6ff]">
            COLLECTED MEMORY FRAGMENTS (6 / 6)
          </div>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {MEMORY_FRAGMENTS.map((f) => (
              <div
                key={f.id}
                className="rounded border border-[#2c2742] bg-[#191d36] px-2.5 py-1.5 text-[11px]"
              >
                <span className="font-bold text-[#f5b942]">#{f.id} {f.title}:</span>{' '}
                <span className="text-[#d6d0e8]">“{f.message}”</span>
              </div>
            ))}
          </div>
        </div>

        {/* Question Prompt to Revisit */}
        <div className="mt-5 rounded-xl border border-[#f5b942]/50 bg-[#1a1630] p-4">
          <p className="font-display text-sm sm:text-base font-semibold text-[#ffe8b3]">
            Do you want to visit the world Allan made specially for you one more time?
          </p>

          <div className="mt-3.5 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                soundEngine.playSfx('uiConfirm');
                onReturnToWorld();
              }}
              className="w-full sm:w-auto rounded-xl bg-[#f5b942] px-5 py-3 font-pixel text-xs font-bold text-[#0d0f1a] shadow-[0_3px_0_#9e6b1b] transition hover:bg-[#ffcf66] whitespace-nowrap shrink-0"
            >
              VISIT THIS WORLD ONE MORE TIME ➔
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playSfx('uiSelect');
                onPlayAgain();
              }}
              className="w-full sm:w-auto rounded-xl border border-[#584b7a] bg-[#1b2038] px-4 py-3 text-xs font-semibold text-[#f5eedc] transition hover:border-[#f5b942] whitespace-nowrap shrink-0"
            >
              Replay from Beginning
            </button>
          </div>
        </div>

        {/* Optional Secret Ending Unlock */}
        <div className="mt-3.5">
          {starsCount >= 6 ? (
            <button
              type="button"
              onClick={() => {
                soundEngine.playSfx('secret');
                onEnterSecretGarden();
              }}
              className="w-full rounded-xl border-2 border-[#6be6ff] bg-[#162840] px-4 py-2.5 font-pixel text-xs text-[#6be6ff] hover:bg-[#1e3654] whitespace-nowrap shrink-0"
            >
              ★ ENTER THE SECRET STARLIT GARDEN (6/6 STARS UNLOCKED!) ★
            </button>
          ) : (
            <div className="rounded-lg border border-[#383054] bg-[#141729] px-3 py-2 text-xs text-[#9e96b8]">
              Secret Stars Collected: {starsCount} / 6 — Find all 6 Secret Stars across the chapters to unlock the Secret Starlit Garden!
            </div>
          )}
        </div>

        {/* Footer Signature */}
        <div className="mt-4 border-t border-[#4c436e]/60 pt-3 text-center">
          <span className="font-display text-xs italic text-[#ffdf8c]">
            Made with love, by Allan
          </span>
        </div>
      </div>
    </div>
  );
};
