export type ChapterId =
  | 'prologue'
  | 'chapter1'
  | 'chapter2'
  | 'chapter3'
  | 'chapter4'
  | 'chapter5'
  | 'ending'
  | 'secret_garden';

export type MapId =
  | 'station'          // Prologue: The Wrong Station (side-scrolling)
  | 'garden'           // Chapter 1: The Overgrown Garden (side-scrolling platformer)
  | 'town'             // Chapter 2: Town of Odd Jobs (top-down RPG hub)
  | 'town_hall'        // Interior: Town Hall
  | 'sleepy_inn'       // Interior: The Sleepy Inn
  | 'library'          // Interior: Town Library
  | 'flower_shop'      // Interior: Rosa's Flower Shop
  | 'bakery'           // Interior: Bram's Bakery
  | 'post_office'      // Interior: Postie's Post Office
  | 'arcade'           // Chapter 3: The Clockwork Arcade (interior/top-down puzzle & mini-game)
  | 'winter'           // Chapter 4: The Quiet Side of Winter (top-down snowy village & cabin)
  | 'mountain'         // Chapter 5A: Path to the Observatory (side-scrolling climb)
  | 'observatory'      // Chapter 5B: The Observatory Dome (interior puzzle & final reveal)
  | 'secret_garden';   // Optional Secret Ending: Starlit Garden

export type MovementMode = 'sidescroll' | 'topdown';

export type CharacterId =
  | 'raynio'
  | 'raynio_blue'
  | 'mallow'
  | 'mayor_cat'
  | 'keeper_hooded'
  | 'keeper_unhooded'
  | 'allan'
  | 'postie'
  | 'rosa'
  | 'bram'
  | 'tock'
  | 'librarian'
  | 'innkeeper'
  | 'pigeon'
  | 'bread'
  | 'system';

export type Expression =
  | 'neutral'
  | 'happy'
  | 'confused'
  | 'surprised'
  | 'embarrassed'
  | 'annoyed'
  | 'sad'
  | 'thoughtful';

export interface DialogueLine {
  speaker: CharacterId;
  speakerName: string;
  expression: Expression;
  text: string;
  onShowFlag?: string;
  soundCue?: string;
}

export interface DialogueChoice {
  label: string;
  nextDialogueId: string;
  setFlag?: string;
}

export interface DialogueSequence {
  id: string;
  lines: DialogueLine[];
  choices?: DialogueChoice[];
  onCompleteFlag?: string;
  onCompleteAction?: string;
}

export interface MemoryFragmentInfo {
  id: number;
  title: string;
  chapter: string;
  message: string;
  description: string;
}

export interface SecretStarInfo {
  id: number;
  name: string;
  locationHint: string;
  chapter: string;
}

export interface QuestInfo {
  id: string;
  title: string;
  giver: string;
  chapter: string;
  description: string;
  steps: {
    flag: string;
    label: string;
  }[];
  completedFlag: string;
  isMain: boolean;
}

export type BuildingId =
  | 'town_hall'
  | 'sleepy_inn'
  | 'library'
  | 'flower_shop'
  | 'bakery'
  | 'post_office'
  | 'oddities_shop'
  | 'arcade'
  | 'little_tailor'
  | 'moonbean_cafe'
  | 'residents_house_1'
  | 'residents_house_2'
  | 'old_bell_tower';

export interface PlatformRect {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'ground' | 'wood' | 'stone' | 'moss' | 'cloud' | 'hazard';
}

export interface ObstacleRect {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  renderType?:
    | 'building'
    | 'fountain'
    | 'tree'
    | 'pine'
    | 'fence'
    | 'bench'
    | 'table'
    | 'bookshelf'
    | 'counter'
    | 'arcade_machine'
    | 'cabin'
    | 'well'
    | 'rock'
    | 'bush_wall'
    | 'telescope';
  buildingId?: BuildingId;
  color?: string;
  roofColor?: string;
}

export interface InteractableObject {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  promptLabel: string; // e.g., "Talk to Mallow", "Read Letter", "Enter Town Hall", "Inspect Roots"
  actionType:
    | 'dialogue'
    | 'door'
    | 'collect_fragment'
    | 'collect_star'
    | 'puzzle_arcade'
    | 'minigame_arcade'
    | 'puzzle_observatory'
    | 'read_letter'
    | 'view_picture'
    | 'chapter_transition'
    | 'pickup_item';
  targetId?: string;
  buildingId?: BuildingId;
  fragmentId?: number;
  starId?: number;
  requiredFlag?: string;
  hideIfFlag?: string;
  npcCharacter?: CharacterId;
  facing?: 'left' | 'right' | 'down';
}

export interface CoinPickup {
  id: string;
  x: number;
  y: number;
}

export interface SaveState {
  version: number;
  hasStarted: boolean;
  chapter: ChapterId;
  mapId: MapId;
  playerX: number;
  playerY: number;
  lastOutdoorX: number;
  lastOutdoorY: number;
  outfit: 'blue_shirt' | 'knight';
  fragments: number[]; // 1..6
  stars: number[];     // 1..6
  coins: string[];     // collected coin IDs
  unlockedBuildings: BuildingId[];
  flags: Record<string, boolean>;
  arcadeSymbols: [number, number, number, number]; // indices 0..3 for Star, Moon, Sun, Envelope
  observatoryLights: [boolean, boolean, boolean, boolean];
  settings: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    musicMuted: boolean;
    reducedFlashing: boolean;
  };
  lastSavedAt: number;
}
