import { SaveState, BuildingId } from './types';

const SAVE_KEY = 'little_thing_we_left_behind_save_v1';

export function createDefaultSaveState(): SaveState {
  return {
    version: 1,
    hasStarted: false,
    chapter: 'prologue',
    mapId: 'station',
    playerX: 110,
    playerY: 260,
    lastOutdoorX: 780,
    lastOutdoorY: 560,
    outfit: 'blue_shirt',
    fragments: [],
    stars: [],
    coins: [],
    // At the start of Chapter 2, only Town Hall is unlocked initially.
    unlockedBuildings: ['town_hall'],
    flags: {},
    arcadeSymbols: [0, 0, 0, 0],
    observatoryLights: [false, false, false, false],
    settings: {
      masterVolume: 0.8,
      musicVolume: 0.7,
      sfxVolume: 0.85,
      musicMuted: false,
      reducedFlashing: false,
    },
    lastSavedAt: Date.now(),
  };
}

export function loadSaveState(): SaveState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return createDefaultSaveState();
    const parsed = JSON.parse(raw) as Partial<SaveState>;
    const def = createDefaultSaveState();
    return {
      ...def,
      ...parsed,
      fragments: Array.isArray(parsed.fragments) ? parsed.fragments : def.fragments,
      stars: Array.isArray(parsed.stars) ? parsed.stars : def.stars,
      coins: Array.isArray(parsed.coins) ? parsed.coins : def.coins,
      unlockedBuildings: Array.isArray(parsed.unlockedBuildings)
        ? (parsed.unlockedBuildings as BuildingId[])
        : def.unlockedBuildings,
      flags: parsed.flags && typeof parsed.flags === 'object' ? parsed.flags : def.flags,
      arcadeSymbols: Array.isArray(parsed.arcadeSymbols) && parsed.arcadeSymbols.length === 4
        ? (parsed.arcadeSymbols as [number, number, number, number])
        : def.arcadeSymbols,
      observatoryLights:
        Array.isArray(parsed.observatoryLights) && parsed.observatoryLights.length === 4
          ? (parsed.observatoryLights as [boolean, boolean, boolean, boolean])
          : def.observatoryLights,
      settings: {
        ...def.settings,
        ...(parsed.settings || {}),
      },
    };
  } catch {
    return createDefaultSaveState();
  }
}

export function saveGameState(state: SaveState): SaveState {
  const updated: SaveState = {
    ...state,
    hasStarted: true,
    lastSavedAt: Date.now(),
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota issues in strict private contexts
  }
  return updated;
}

export function clearSaveState(): SaveState {
  const fresh = createDefaultSaveState();
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // Ignore
  }
  return fresh;
}

export function hasSavedGame(): boolean {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as Partial<SaveState>;
    return Boolean(parsed && parsed.hasStarted);
  } catch {
    return false;
  }
}
