import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BuildingId,
  DialogueLine,
  DialogueSequence,
  InteractableObject,
  MapId,
  SaveState,
} from './game/types';
import {
  clearSaveState,
  hasSavedGame,
  loadSaveState,
  saveGameState,
} from './game/save';
import { soundEngine } from './game/audio';
import { MAPS } from './game/mapData';
import { DIALOGUES } from './game/dialogues';
import { QUEST_LIST } from './game/collectibles';
import { drawCharacterPortrait } from './game/portraits';
import {
  renderSunsetTrainTitleScene,
  renderWorldMap,
} from './game/sprites';
import {
  ArcadeMiniGameModal,
  ArcadeVaultModal,
  BirthdayPresentModal,
  LetterReaderModal,
  ObservatoryPuzzleModal,
  UnfinishedPictureModal,
} from './game/MiniGamesAndModals';
import {
  PauseSettingsModal,
  QuestJournalModal,
} from './game/JournalAndPauseModals';
import { downloadStandaloneGameHtml } from './game/exporter';

type ScreenState = 'title' | 'playing';
type ActiveModal =
  | null
  | 'journal'
  | 'pause'
  | 'prologue_letter'
  | 'final_letter'
  | 'arcade_minigame'
  | 'arcade_vault'
  | 'unfinished_picture'
  | 'observatory_puzzle'
  | 'birthday_present';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('title');
  const [saveState, setSaveState] = useState<SaveState>(() => loadSaveState());
  const [hasSave, setHasSave] = useState<boolean>(() => hasSavedGame());
  const [confirmNewGame, setConfirmNewGame] = useState(false);

  // Left-side Royal Parchment Quest Scroll state
  const [scrollUnrolled, setScrollUnrolled] = useState<boolean>(false);
  const [showSideQuestsInScroll, setShowSideQuestsInScroll] = useState<boolean>(false);

  // Active UI overlays
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [activeDialogue, setActiveDialogue] = useState<DialogueSequence | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);

  // Chapter transition banner & notifications
  const [transitionBanner, setTransitionBanner] = useState<string | null>(null);
  const [toastBanner, setToastBanner] = useState<string | null>(null);

  // Nearby interactable prompt
  const [nearbyInteractable, setNearbyInteractable] = useState<InteractableObject | null>(null);

  // Canvas & real-time physics refs
  const gameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const titleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const portraitCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const saveRef = useRef<SaveState>(saveState);
  saveRef.current = saveState;

  const keysRef = useRef<Record<string, boolean>>({});
  const physicsRef = useRef({
    vx: 0,
    vy: 0,
    onGround: false,
    coyoteFrames: 0,
    facing: 'right' as 'left' | 'right',
    isMoving: false,
    safeX: 110,
    safeY: 250,
    camX: 0,
    camY: 0,
    tick: 0,
    transformTimer: 0,
    rootAnim: { buildingId: null as string | null, progress: 1 },
  });

  const showToast = useCallback((msg: string) => {
    setToastBanner(msg);
    window.setTimeout(() => {
      setToastBanner((prev) => (prev === msg ? null : prev));
    }, 3400);
  }, []);

  // Sync sound engine settings
  useEffect(() => {
    soundEngine.updateSettings(saveState.settings);
  }, [saveState.settings]);

  // Step-by-step English RPG guide & compass badge so Raynio never gets confused
  const getStepByStepGuide = (
    st: SaveState
  ): { objective: string; howTo: string; directionBadge: string } => {
    // Handle Town Interiors
    if (st.mapId === 'town_hall') {
      if (!st.flags['met_mayor_cat']) {
        return {
          objective: 'Speak with Mayor Cat at the North Desk',
          howTo: 'Walk up to Mayor Cat’s desk and press [E]. The Exit Door is on the crimson rug at the bottom.',
          directionBadge: '▲ Mayor’s Desk',
        };
      }
      return {
        objective: 'Explore Town Hall or Exit to Somewhere Town',
        howTo: 'Help Mayor Cat with his side quest, search the left Velvet Curtain, or use the EXIT DOOR at the bottom.',
        directionBadge: '▼ Exit Door',
      };
    }
    if (st.mapId === 'sleepy_inn') {
      if (!st.flags['visited_sleepy_inn']) {
        return {
          objective: 'Speak with Innkeeper Martha at the Reception Desk',
          howTo: 'Walk up to the front desk and press [E]. Afterward, head out through the EXIT DOOR at the bottom.',
          directionBadge: '▲ Reception Desk',
        };
      }
      return {
        objective: 'Exit The Sleepy Inn & Visit the Town Library',
        howTo: 'Walk down the crimson carpet runner and press [E] at the EXIT DOOR.',
        directionBadge: '▼ Exit Door',
      };
    }
    if (st.mapId === 'library') {
      if (!st.flags['visited_library_lore']) {
        return {
          objective: 'Speak with the Town Librarian at the Reading Table',
          howTo: 'Approach the Librarian in the center and press [E]. Don’t miss Secret Star #2 in the top-right corner!',
          directionBadge: '▲ Librarian / ★ Top-Right',
        };
      }
      return {
        objective: 'Return to Town Square for Memory Fragment #2',
        howTo: 'Walk down to the EXIT DOOR at the bottom of the Library and press [E].',
        directionBadge: '▼ Exit Door',
      };
    }
    if (st.mapId === 'flower_shop' || st.mapId === 'bakery' || st.mapId === 'post_office') {
      return {
        objective: 'Chat with the Shopkeeper or Return to Town',
        howTo: 'Press [E] at the counter to start/complete an Odd Job, or walk to the EXIT DOOR at the bottom.',
        directionBadge: '▼ Exit Door',
      };
    }

    // Main Story Progression
    if (st.mapId === 'secret_garden') {
      return {
        objective: 'Rest Beneath the Stars in the Secret Starlit Garden',
        howTo: 'Press [E] by the wooden bench in the center, or step through the Right Portal to view the Finale Screen.',
        directionBadge: '➔ Right Portal',
      };
    }
    if (!st.flags['talked_mallow_station']) {
      return {
        objective: 'Wake Up Mallow on the Station Bench',
        howTo: 'Walk right (D / Right Arrow) to the bench beneath the "Official Town Guide" sign and press [E].',
        directionBadge: '➔ Walk Right',
      };
    }
    if (!st.flags['read_station_letter']) {
      return {
        objective: 'Read the Envelope on the Letter Stand',
        howTo: 'Walk a little further right past Mallow’s bench, approach the Letter Stand, and press [E].',
        directionBadge: '➔ Right of Mallow',
      };
    }
    if (!st.flags['entered_garden']) {
      return {
        objective: 'Enter the Overgrown Garden',
        howTo: 'Walk to the far right end of the station platform and press [E] at the Garden Gate.',
        directionBadge: '➔ Far Right Gate',
      };
    }
    if (!st.fragments.includes(1)) {
      return {
        objective: 'Cross the Twilight Garden & Claim Fragment #1',
        howTo: 'Move right and jump across the wooden ledges with [Space]. Claim the glowing star shard at the far right.',
        directionBadge: '➔ Jump Right',
      };
    }
    if (!st.flags['entered_town']) {
      return {
        objective: 'Pass Through the Town Gate to Somewhere Town',
        howTo: 'Walk to the Town Gate at the far right edge of the garden (just past Fragment #1) and press [E].',
        directionBadge: '➔ Far Right Gate',
      };
    }
    if (!st.flags['met_mayor_cat']) {
      return {
        objective: 'Meet Mayor Cat Outside Town Hall (North)',
        howTo: 'Follow the cobblestone road NORTH (Up) past the Town Fountain to TOWN HALL and press [E].',
        directionBadge: '▲ Go North',
      };
    }
    if (!st.flags['visited_sleepy_inn']) {
      return {
        objective: 'Check Into The Sleepy Inn (Southwest)',
        howTo: 'Walk to the Southwest (bottom-left) avenue of town, approach THE SLEEPY INN door, and press [E].',
        directionBadge: '↙ Southwest',
      };
    }
    if (!st.flags['visited_library_lore']) {
      return {
        objective: 'Visit the Town Library (Next to the Inn)',
        howTo: 'From The Sleepy Inn, walk just to the right to the TOWN LIBRARY entrance and press [E].',
        directionBadge: '➔ Next to Inn',
      };
    }
    if (!st.fragments.includes(2)) {
      return {
        objective: 'Claim Memory Fragment #2 at the Town Fountain',
        howTo: 'Head back to the center plaza (Town Square Fountain) and press [E] on the glowing crystal.',
        directionBadge: '▲ Center Plaza',
      };
    }
    if (!st.fragments.includes(3)) {
      if (st.mapId !== 'arcade') {
        return {
          objective: 'Enter the Clockwork Arcade (Southeast)',
          howTo: 'The roots sealing the CLOCKWORK ARCADE (bottom-right of town) have opened! Enter its door with [E].',
          directionBadge: '↘ Southeast',
        };
      }
      if (!st.flags['arcade_minigame_won']) {
        return {
          objective: 'Win 3 Power Batteries in "GEAR RUNNER"',
          howTo: 'Approach the top-left arcade cabinet ("GEAR RUNNER") and press [E] to collect 3 Power Batteries.',
          directionBadge: '◀ Top-Left Cabinet',
        };
      }
      if (!st.flags['arcade_puzzle_solved']) {
        return {
          objective: 'Unlock the 4-Symbol Star Vault (North Wall)',
          howTo: 'Inspect the Star Vault on the north wall with [E] and align: SUN -> MOON -> STAR -> ENVELOPE.',
          directionBadge: '▲ Center Vault',
        };
      }
      return {
        objective: 'Claim Memory Fragment #3 in the Arcade',
        howTo: 'Touch the glowing Memory Fragment #3 crystal in the center of the Arcade floor with [E].',
        directionBadge: '● Center Room',
      };
    }
    if (!st.flags['entered_winter']) {
      return {
        objective: 'Enter the East Door to the Winter Village (Ch. 4)',
        howTo: 'Inside the Clockwork Arcade, walk to the NEXT AREA door on the right wall and press [E].',
        directionBadge: '➔ East Door',
      };
    }
    if (!st.fragments.includes(4)) {
      return {
        objective: 'Claim Memory Fragment #4 Outside the Winter Cabin',
        howTo: 'Explore the clues in the moonlit snow, then collect Memory Fragment #4 in front of the cabin porch.',
        directionBadge: '▲ Cabin Porch',
      };
    }
    if (!st.fragments.includes(5)) {
      return {
        objective: 'Speak with The Keeper Beside the Cabin Porch',
        howTo: 'Approach the hooded figure (The Keeper) standing to the right of the Winter Cabin and press [E].',
        directionBadge: '➔ Right of Cabin',
      };
    }
    if (!st.flags['entered_mountain']) {
      return {
        objective: 'Pass Through the Mountain Gate to the Observatory',
        howTo: 'Walk to the Mountain Gate on the far right of the Winter Village and press [E] to begin the ascent.',
        directionBadge: '➔ Far Right Gate',
      };
    }
    if (!st.flags['reached_observatory']) {
      return {
        objective: 'Climb the Starlit Ridge to the Observatory Dome',
        howTo: 'Move right and jump [Space] across the stone ledges to reach the Grand Observatory doors at the summit.',
        directionBadge: '➔ Climb Right',
      };
    }
    if (!st.flags['observatory_puzzle_solved']) {
      return {
        objective: 'Ignite the 4 Constellation Lights at the Center Altar',
        howTo: 'Approach the Constellation Altar in the center of the Observatory, press [E], ignite all 4 lights, and Assemble.',
        directionBadge: '● Center Altar',
      };
    }
    if (!st.flags['allan_reveal_complete']) {
      return {
        objective: 'Speak with The Keeper & Allan in the Observatory',
        howTo: 'Approach The Keeper or Allan near the Celestial Telescope at the top and press [E].',
        directionBadge: '▲ Near Telescope',
      };
    }
    return {
      objective: 'Read Allan’s Final Letter at the Center Lectern',
      howTo: 'Inspect the Letter Lectern in the upper-center of the Observatory with [E] to read Allan’s letter.',
      directionBadge: '★ Center Lectern',
    };
  };

  // Start a dialogue sequence
  const startDialogue = useCallback((dialogueId: string) => {
    const st = saveRef.current;

    let resolvedId = dialogueId;
    if (dialogueId === 'mayor_cat_indoor_dynamic') {
      if (!st.flags['met_mayor_cat']) {
        resolvedId = 'mayor_cat_first_meeting';
      } else if (!st.flags['started_mayor_quest']) {
        resolvedId = 'mayor_cat_side_quest_start';
      } else if (
        st.flags['got_pigeon_stamp'] &&
        st.flags['found_mayor_bell'] &&
        st.flags['read_lunch_menu'] &&
        !st.flags['completed_mayor_quest']
      ) {
        resolvedId = 'mayor_cat_side_quest_complete';
      } else {
        resolvedId = 'mayor_cat_side_quest_start';
      }
    } else if (dialogueId === 'rosa_dynamic') {
      if (st.flags['found_flower_1'] && st.flags['found_flower_2']) {
        resolvedId = 'rosa_quest_complete';
      } else {
        resolvedId = 'rosa_quest_start';
      }
    } else if (dialogueId === 'bram_dynamic') {
      if (st.flags['caught_bread_1'] && st.flags['caught_bread_2']) {
        resolvedId = 'bram_quest_complete';
      } else {
        resolvedId = 'bram_quest_start';
      }
    } else if (dialogueId === 'postie_dynamic') {
      if (st.flags['delivered_ego_package']) {
        resolvedId = 'postie_quest_complete';
      } else {
        resolvedId = 'postie_quest_start';
      }
    } else if (dialogueId === 'keeper_observatory_dynamic') {
      if (st.flags['observatory_puzzle_solved']) {
        resolvedId = 'observatory_reveal_sequence';
      } else {
        resolvedId = 'keeper_before_puzzle';
      }
    }

    const seq = DIALOGUES[resolvedId];
    if (!seq) return;
    soundEngine.playSfx('uiSelect');
    if (seq.lines[0]?.soundCue) {
      soundEngine.playSfx(seq.lines[0].soundCue as any);
    }
    setActiveDialogue(seq);
    setDialogueIndex(0);
    setTypedLength(0);
  }, []);

  // Map / Chapter transition helper
  const transitionToMap = useCallback(
    (
      targetMapId: MapId,
      customX?: number,
      customY?: number,
      extraFlags?: Record<string, boolean>
    ) => {
      const targetMap = MAPS[targetMapId];
      if (!targetMap) return;

      soundEngine.playSfx('chapterTransition');
      soundEngine.playMusic(targetMap.music);
      setTransitionBanner(targetMap.title);
      window.setTimeout(() => setTransitionBanner(null), 2400);

      setSaveState((prev) => {
        const isLeavingOutdoorTown = prev.mapId === 'town' && targetMapId !== 'town';
        const isReturningToTown =
          prev.mapId !== 'town' && prev.mapId !== 'garden' && targetMapId === 'town';

        const spawnX =
          customX !== undefined
            ? customX
            : isReturningToTown
            ? prev.lastOutdoorX
            : targetMap.spawnX;
        const spawnY =
          customY !== undefined
            ? customY
            : isReturningToTown
            ? prev.lastOutdoorY
            : targetMap.spawnY;

        physicsRef.current.vx = 0;
        physicsRef.current.vy = 0;
        physicsRef.current.safeX = spawnX;
        physicsRef.current.safeY = spawnY;

        const nextChapter =
          targetMapId === 'garden'
            ? 'chapter1'
            : targetMapId === 'town'
            ? 'chapter2'
            : targetMapId === 'arcade'
            ? 'chapter3'
            : targetMapId === 'winter'
            ? 'chapter4'
            : targetMapId === 'mountain' || targetMapId === 'observatory'
            ? 'chapter5'
            : targetMapId === 'secret_garden'
            ? 'secret_garden'
            : prev.chapter;

        const updated: SaveState = {
          ...prev,
          chapter: nextChapter,
          mapId: targetMapId,
          playerX: spawnX,
          playerY: spawnY,
          lastOutdoorX: isLeavingOutdoorTown ? prev.playerX : prev.lastOutdoorX,
          lastOutdoorY: isLeavingOutdoorTown ? prev.playerY + 18 : prev.lastOutdoorY,
          flags: {
            ...prev.flags,
            ...(extraFlags || {}),
          },
        };
        return saveGameState(updated);
      });

      window.setTimeout(() => {
        const st = saveRef.current;
        if (targetMapId === 'garden' && !st.flags['garden_intro_done']) {
          startDialogue('garden_entry_chat');
        } else if (targetMapId === 'winter' && !st.flags['winter_intro_seen']) {
          startDialogue('winter_intro_dialogue');
        }
      }, 450);
    },
    [startDialogue]
  );

  // Advance or finish current dialogue
  const advanceDialogue = useCallback(() => {
    if (!activeDialogue) return;
    const currentLine: DialogueLine = activeDialogue.lines[dialogueIndex];
    if (!currentLine) return;

    if (typedLength < currentLine.text.length) {
      setTypedLength(currentLine.text.length);
      return;
    }

    const nextIdx = dialogueIndex + 1;
    if (nextIdx < activeDialogue.lines.length) {
      const nextLine = activeDialogue.lines[nextIdx];
      soundEngine.playSfx((nextLine.soundCue as any) || 'uiSelect');
      if (activeDialogue.id === 'prologue_arrival' && nextIdx === 1) {
        physicsRef.current.transformTimer = 90;
        setSaveState((prev) => saveGameState({ ...prev, outfit: 'knight' }));
      }
      setDialogueIndex(nextIdx);
      setTypedLength(0);
    } else {
      const completedSeq = activeDialogue;
      setActiveDialogue(null);
      setDialogueIndex(0);

      setSaveState((prev) => {
        const nextFlags = { ...prev.flags };
        if (completedSeq.onCompleteFlag) {
          nextFlags[completedSeq.onCompleteFlag] = true;
        }
        let nextUnlocked = [...prev.unlockedBuildings];
        let nextFragments = [...prev.fragments];

        if (completedSeq.onCompleteAction === 'unlock_town_phase_1') {
          const toAdd: BuildingId[] = [
            'sleepy_inn',
            'library',
            'flower_shop',
            'bakery',
            'post_office',
          ];
          for (const b of toAdd) {
            if (!nextUnlocked.includes(b)) nextUnlocked.push(b);
          }
          soundEngine.playSfx('rootShrink');
          physicsRef.current.rootAnim = { buildingId: 'sleepy_inn', progress: 0 };
          showToast('The overgrown roots sealing The Sleepy Inn, Library & Town Shops have vanished!');
        } else if (completedSeq.onCompleteAction === 'unlock_arcade') {
          if (!nextUnlocked.includes('arcade')) nextUnlocked.push('arcade');
          soundEngine.playSfx('rootShrink');
          physicsRef.current.rootAnim = { buildingId: 'arcade', progress: 0 };
          showToast('The thorny roots sealing the Clockwork Arcade (Southeast) have pulled back!');
        } else if (completedSeq.onCompleteAction === 'show_unfinished_picture') {
          if (!nextFragments.includes(5)) nextFragments.push(5);
          window.setTimeout(() => setActiveModal('unfinished_picture'), 200);
        } else if (completedSeq.onCompleteAction === 'open_final_letter') {
          if (!nextFragments.includes(6)) nextFragments.push(6);
          window.setTimeout(() => setActiveModal('final_letter'), 250);
        }

        return saveGameState({
          ...prev,
          flags: nextFlags,
          unlockedBuildings: nextUnlocked,
          fragments: nextFragments,
        });
      });
    }
  }, [activeDialogue, dialogueIndex, typedLength, showToast]);

  // Typewriter effect
  useEffect(() => {
    if (!activeDialogue) return;
    const line = activeDialogue.lines[dialogueIndex];
    if (!line) return;
    if (typedLength >= line.text.length) return;

    const timer = window.setTimeout(() => {
      setTypedLength((prev) => {
        if (prev % 3 === 0) soundEngine.playSfx('talkBlip');
        return prev + 1;
      });
    }, 15);
    return () => window.clearTimeout(timer);
  }, [activeDialogue, dialogueIndex, typedLength]);

  // Render portrait
  useEffect(() => {
    if (!activeDialogue || !portraitCanvasRef.current) return;
    const line = activeDialogue.lines[dialogueIndex];
    if (!line) return;
    const ctx = portraitCanvasRef.current.getContext('2d');
    if (!ctx) return;
    drawCharacterPortrait(ctx, line.speaker, line.expression, 96);
  }, [activeDialogue, dialogueIndex]);

  // Execute interaction
  const triggerInteraction = useCallback(() => {
    if (activeDialogue) {
      advanceDialogue();
      return;
    }
    if (activeModal) return;
    const item = nearbyInteractable;
    if (!item) return;

    const st = saveRef.current;

    switch (item.actionType) {
      case 'dialogue':
        if (item.targetId) startDialogue(item.targetId);
        break;

      case 'read_letter':
        soundEngine.playSfx('uiConfirm');
        if (item.targetId === 'prologue_letter') {
          setActiveModal('prologue_letter');
        } else if (item.targetId === 'open_present_screen') {
          setActiveModal('birthday_present');
        } else {
          setActiveModal('final_letter');
        }
        break;

      case 'view_picture':
        soundEngine.playSfx('uiConfirm');
        setActiveModal('unfinished_picture');
        break;

      case 'minigame_arcade':
        soundEngine.playSfx('uiConfirm');
        setActiveModal('arcade_minigame');
        break;

      case 'puzzle_arcade':
        soundEngine.playSfx('uiConfirm');
        setActiveModal('arcade_vault');
        break;

      case 'puzzle_observatory':
        soundEngine.playSfx('uiConfirm');
        setActiveModal('observatory_puzzle');
        break;

      case 'pickup_item':
        if (item.targetId) {
          soundEngine.playSfx('coin');
          setSaveState((prev) =>
            saveGameState({
              ...prev,
              flags: { ...prev.flags, [item.targetId!]: true },
            })
          );
          showToast('Coaxed the runaway Night-Bloom back into Rosa’s basket!');
        }
        break;

      case 'collect_star':
        if (item.starId && !st.stars.includes(item.starId)) {
          soundEngine.playSfx('star');
          const nextStars = [...st.stars, item.starId];
          setSaveState((prev) =>
            saveGameState({
              ...prev,
              stars: nextStars,
            })
          );
          showToast(`Secret Star #${item.starId} Discovered! ★ (${nextStars.length}/6)`);
        }
        break;

      case 'collect_fragment':
        if (item.fragmentId && !st.fragments.includes(item.fragmentId)) {
          soundEngine.playSfx('fragment');
          const nextFrags = [...st.fragments, item.fragmentId];
          setSaveState((prev) =>
            saveGameState({
              ...prev,
              fragments: nextFrags,
              flags: { ...prev.flags, [`fragment_${item.fragmentId}`]: true },
            })
          );
          if (item.targetId) {
            startDialogue(item.targetId);
          }
        }
        break;

      case 'door':
        if (item.buildingId && !st.unlockedBuildings.includes(item.buildingId)) {
          soundEngine.playSfx('land');
          startDialogue('locked_root_building');
        } else if (item.targetId) {
          transitionToMap(item.targetId as MapId);
        }
        break;

      case 'chapter_transition':
        if (item.targetId === 'garden') {
          if (!st.flags['talked_mallow_station'] || !st.flags['read_station_letter']) {
            startDialogue('station_gate_locked');
          } else {
            transitionToMap('garden', undefined, undefined, { entered_garden: true });
          }
        } else if (item.targetId === 'town') {
          if (!st.fragments.includes(1)) {
            showToast('Claim Memory Fragment #1: THE LITTLE STAR nearby first!');
          } else {
            transitionToMap('town', undefined, undefined, { entered_town: true });
          }
        } else if (item.targetId === 'winter') {
          transitionToMap('winter', undefined, undefined, { entered_winter: true });
        } else if (item.targetId === 'mountain') {
          transitionToMap('mountain', undefined, undefined, { entered_mountain: true });
        } else if (item.targetId === 'observatory') {
          transitionToMap('observatory', undefined, undefined, { reached_observatory: true });
        }
        break;
    }
  }, [
    activeDialogue,
    activeModal,
    nearbyInteractable,
    advanceDialogue,
    startDialogue,
    transitionToMap,
    showToast,
  ]);

  // Keyboard Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysRef.current[k] = true;

      if (screen !== 'playing') return;

      if (k === 'escape') {
        e.preventDefault();
        if (activeModal) {
          soundEngine.setPaused(false);
          setActiveModal(null);
        } else if (!activeDialogue) {
          soundEngine.playSfx('uiSelect');
          soundEngine.setPaused(true);
          setActiveModal('pause');
        }
        return;
      }

      if (k === 'j' && !activeDialogue) {
        e.preventDefault();
        soundEngine.playSfx('uiSelect');
        setActiveModal((prev) => (prev === 'journal' ? null : 'journal'));
        return;
      }

      if (k === 'q' && !activeDialogue && !activeModal) {
        e.preventDefault();
        soundEngine.playSfx('uiSelect');
        setScrollUnrolled((prev) => !prev);
        return;
      }

      if (k === 'e' || k === 'enter') {
        e.preventDefault();
        triggerInteraction();
        return;
      }

      if (k === ' ' && activeDialogue) {
        e.preventDefault();
        advanceDialogue();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysRef.current[k] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [screen, activeModal, activeDialogue, triggerInteraction, advanceDialogue]);

  // Title Screen Animation Loop
  useEffect(() => {
    if (screen !== 'title') return;
    let animId = 0;
    let tick = 0;
    const renderTitle = () => {
      tick++;
      const canvas = titleCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          renderSunsetTrainTitleScene(ctx, tick);
        }
      }
      animId = requestAnimationFrame(renderTitle);
    };
    animId = requestAnimationFrame(renderTitle);
    return () => cancelAnimationFrame(animId);
  }, [screen]);

  // Main Gameplay Physics & Rendering Loop
  useEffect(() => {
    if (screen !== 'playing') return;
    let animId = 0;

    const updateAndRender = () => {
      const st = saveRef.current;
      const map = MAPS[st.mapId];
      const phys = physicsRef.current;
      phys.tick += 1;

      if (phys.transformTimer > 0) {
        phys.transformTimer -= 1;
      }
      if (phys.rootAnim.progress < 1) {
        phys.rootAnim.progress = Math.min(1, phys.rootAnim.progress + 0.025);
      }

      const controlsFrozen = Boolean(activeDialogue || activeModal);

      if (!controlsFrozen) {
        const left = keysRef.current['arrowleft'] || keysRef.current['a'];
        const right = keysRef.current['arrowright'] || keysRef.current['d'];
        const up = keysRef.current['arrowup'] || keysRef.current['w'];
        const down = keysRef.current['arrowdown'] || keysRef.current['s'];
        const jump = keysRef.current[' '] || up;

        if (map.mode === 'sidescroll') {
          const speed = 2.8;
          phys.vx = left ? -speed : right ? speed : 0;
          if (left) phys.facing = 'left';
          if (right) phys.facing = 'right';
          phys.isMoving = Boolean(left || right);

          if (phys.onGround) {
            phys.coyoteFrames = 7;
          } else if (phys.coyoteFrames > 0) {
            phys.coyoteFrames -= 1;
          }

          if (jump && phys.coyoteFrames > 0) {
            phys.vy = -8.1;
            phys.onGround = false;
            phys.coyoteFrames = 0;
            soundEngine.playSfx('jump');
          }

          phys.vy = Math.min(8.5, phys.vy + 0.37);

          let nextX = Math.max(16, Math.min(map.width - 40, st.playerX + phys.vx));
          let nextY = st.playerY + phys.vy;
          let landed = false;

          if (map.platforms) {
            for (const p of map.platforms) {
              if (p.type === 'hazard') {
                if (
                  nextX + 20 > p.x &&
                  nextX + 4 < p.x + p.w &&
                  nextY + 34 >= p.y &&
                  nextY + 20 <= p.y + p.h
                ) {
                  soundEngine.playSfx('land');
                  nextX = phys.safeX;
                  nextY = phys.safeY;
                  phys.vy = 0;
                  showToast('Splashed into the starlit stream! Returned to the last safe ledge.');
                  break;
                }
                continue;
              }

              const withinX = nextX + 20 > p.x && nextX + 4 < p.x + p.w;
              const wasAbove = st.playerY + 34 <= p.y + 9;
              const isNowOn = nextY + 34 >= p.y && nextY + 34 <= p.y + 19;

              if (withinX && phys.vy >= 0 && (wasAbove || isNowOn)) {
                nextY = p.y - 34;
                phys.vy = 0;
                landed = true;
                if (p.type !== 'cloud') {
                  phys.safeX = nextX;
                  phys.safeY = nextY;
                }
                break;
              }
            }
          }

          if (nextY > map.height + 20) {
            nextX = phys.safeX;
            nextY = phys.safeY;
            phys.vy = 0;
          }

          phys.onGround = landed;
          st.playerX = nextX;
          st.playerY = nextY;

          if (
            st.mapId === 'station' &&
            !st.flags['prologue_transformed'] &&
            st.playerX > 180
          ) {
            startDialogue('prologue_arrival');
          }
        } else {
          // Top-down movement
          const speed = 2.75;
          let dx = (left ? -1 : 0) + (right ? 1 : 0);
          let dy = (up ? -1 : 0) + (down ? 1 : 0);
          if (dx !== 0 && dy !== 0) {
            dx *= 0.7071;
            dy *= 0.7071;
          }
          if (dx < 0) phys.facing = 'left';
          if (dx > 0) phys.facing = 'right';
          phys.isMoving = dx !== 0 || dy !== 0;

          const collidesObstacle = (tx: number, ty: number) => {
            if (tx < 36 || tx > map.width - 60 || ty < 42 || ty > map.height - 54) {
              return true;
            }
            if (!map.obstacles) return false;
            for (const o of map.obstacles) {
              if (
                tx + 20 > o.x &&
                tx + 4 < o.x + o.w &&
                ty + 33 > o.y &&
                ty + 16 < o.y + o.h
              ) {
                return true;
              }
            }
            return false;
          };

          const candX = st.playerX + dx * speed;
          if (!collidesObstacle(candX, st.playerY)) {
            st.playerX = candX;
          }
          const candY = st.playerY + dy * speed;
          if (!collidesObstacle(st.playerX, candY)) {
            st.playerY = candY;
          }
        }

        // Coin auto-pickup
        if (map.coins) {
          for (const c of map.coins) {
            if (!st.coins.includes(c.id)) {
              const dist = Math.hypot(st.playerX + 12 - c.x, st.playerY + 18 - c.y);
              if (dist < 28) {
                soundEngine.playSfx('coin');
                const updatedCoins = [...st.coins, c.id];
                st.coins = updatedCoins;
                setSaveState((prev) => saveGameState({ ...prev, coins: updatedCoins }));
              }
            }
          }
        }
      } else {
        phys.isMoving = false;
      }

      // Check closest interactable (generous 68px radius so counter NPCs & doors always trigger cleanly)
      let closest: InteractableObject | null = null;
      let bestDist = 68;
      for (const item of map.interactables) {
        if (item.hideIfFlag && st.flags[item.hideIfFlag]) continue;
        if (item.requiredFlag && !st.flags[item.requiredFlag]) continue;
        if (
          item.actionType === 'collect_fragment' &&
          item.fragmentId &&
          st.fragments.includes(item.fragmentId)
        ) {
          continue;
        }
        if (
          item.actionType === 'collect_star' &&
          item.starId &&
          st.stars.includes(item.starId)
        ) {
          continue;
        }

        // Measure distance from Raynio's center to closest point inside the interactable box
        const px = st.playerX + 12;
        const py = st.playerY + 18;
        const clampedX = Math.max(item.x, Math.min(px, item.x + item.w));
        const clampedY = Math.max(item.y, Math.min(py, item.y + item.h));
        const dist = Math.hypot(px - clampedX, py - clampedY);
        if (dist < bestDist) {
          bestDist = dist;
          closest = item;
        }
      }
      setNearbyInteractable((prev) => (prev?.id === closest?.id ? prev : closest));

      // Smooth Camera Follow
      const viewW = 640;
      const viewH = 360;
      const targetCamX = Math.max(
        0,
        Math.min(map.width - viewW, st.playerX - viewW / 2 + 12)
      );
      const targetCamY = Math.max(
        0,
        Math.min(map.height - viewH, st.playerY - viewH / 2 + 16)
      );
      phys.camX += (targetCamX - phys.camX) * 0.18;
      phys.camY += (targetCamY - phys.camY) * 0.18;

      const canvas = gameCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          renderWorldMap(
            ctx,
            st.mapId,
            phys.camX,
            phys.camY,
            st,
            phys.tick,
            closest?.id || null,
            phys.rootAnim,
            phys.transformTimer,
            phys.facing,
            phys.isMoving,
            !phys.onGround && map.mode === 'sidescroll'
          );
        }
      }

      animId = requestAnimationFrame(updateAndRender);
    };

    animId = requestAnimationFrame(updateAndRender);
    return () => cancelAnimationFrame(animId);
  }, [screen, activeDialogue, activeModal, showToast, startDialogue]);

  const handleStartNewGame = () => {
    soundEngine.init();
    soundEngine.playSfx('uiConfirm');
    const fresh = clearSaveState();
    fresh.hasStarted = true;
    saveGameState(fresh);
    setSaveState(fresh);
    setHasSave(true);
    setConfirmNewGame(false);
    setScreen('playing');
    soundEngine.playMusic(MAPS[fresh.mapId].music);
    setTransitionBanner(MAPS[fresh.mapId].title);
    window.setTimeout(() => setTransitionBanner(null), 2400);
  };

  const handleContinueGame = () => {
    soundEngine.init();
    soundEngine.playSfx('uiConfirm');
    const loaded = loadSaveState();
    setSaveState(loaded);
    setScreen('playing');
    soundEngine.playMusic(MAPS[loaded.mapId].music);
    setTransitionBanner(MAPS[loaded.mapId].title);
    window.setTimeout(() => setTransitionBanner(null), 2400);
  };

  const setTouchKey = (key: string, pressed: boolean) => {
    keysRef.current[key] = pressed;
  };

  const currentMap = MAPS[saveState.mapId];
  const guideInfo = getStepByStepGuide(saveState);

  const activeMainQuest =
    QUEST_LIST.find((q) => q.isMain && !saveState.flags[q.completedFlag]) ||
    QUEST_LIST[QUEST_LIST.length - 1];
  const sideQuests = QUEST_LIST.filter((q) => !q.isMain);

  // ============================================================================
  // RENDER 1: TWILIGHT-NIGHT TRAIN TITLE SCREEN
  // ============================================================================
  if (screen === 'title') {
    return (
      <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-[#0a0c1c] p-4 select-none">
        {/* Fullscreen Pixel-Art Twilight-Night Train Scene */}
        <canvas
          ref={titleCanvasRef}
          width={640}
          height={360}
          className="pixel-canvas absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b17]/90 via-[#161129]/45 to-[#090b17]/65" />

        {/* Center Title Card */}
        <div className="rpg-panel-gold relative z-10 flex w-full max-w-xl flex-col items-center rounded-2xl px-6 py-7 sm:px-10 sm:py-9 text-center backdrop-blur-xs">
          <div className="font-pixel text-[11px] tracking-widest text-[#ffdf85]">
            SOMEWHERE STATION · PLATFORM 0
          </div>

          <h1
            className="mt-2.5 font-pixel text-xl sm:text-3xl font-bold leading-snug tracking-wide text-[#f5b942] drop-shadow-[0_3px_0_rgba(13,15,26,0.95)]"
            style={{ textWrap: 'balance' }}
          >
            THE LITTLE THING WE LEFT BEHIND
          </h1>

          <p className="mt-2.5 font-display text-sm sm:text-base font-medium italic text-[#ffe8b3]">
            “A little world made especially for you”
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-7 flex w-full max-w-xs flex-col gap-3">
            {!confirmNewGame ? (
              <button
                type="button"
                onClick={() => {
                  soundEngine.init();
                  if (hasSave) {
                    soundEngine.playSfx('uiSelect');
                    setConfirmNewGame(true);
                  } else {
                    handleStartNewGame();
                  }
                }}
                className="w-full rounded-xl bg-[#f5b942] px-6 py-3.5 font-pixel text-sm font-bold text-[#0d0f1a] shadow-[0_4px_0_#9e6b1b] transition hover:translate-y-[-1px] hover:bg-[#ffcf66] active:translate-y-[1px] whitespace-nowrap shrink-0"
              >
                START GAME
              </button>
            ) : (
              <div className="rounded-xl border border-[#ff5277] bg-[#241324]/95 p-3.5 text-center">
                <p className="text-xs text-[#ffd1dc]">
                  Start a new adventure from the beginning and overwrite your current save?
                </p>
                <div className="mt-2.5 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleStartNewGame}
                    className="rounded-lg bg-[#ff5277] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#ff708f] whitespace-nowrap shrink-0"
                  >
                    Yes, Start New
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmNewGame(false)}
                    className="rounded-lg border border-[#584b7a] bg-[#1b2038] px-3.5 py-1.5 text-xs font-semibold text-[#f5eedc] whitespace-nowrap shrink-0"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {hasSave && (
              <button
                type="button"
                onClick={handleContinueGame}
                className="w-full rounded-xl border-2 border-[#f5b942] bg-[#1b2038]/95 px-5 py-2.5 font-pixel text-xs font-bold text-[#ffdf85] transition hover:bg-[#272e4f] whitespace-nowrap shrink-0"
              >
                CONTINUE ({saveState.fragments.length}/6 FRAGMENTS · {saveState.stars.length}/6 STARS)
              </button>
            )}

            <div className="mt-1 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  soundEngine.init();
                  soundEngine.playSfx('uiSelect');
                  setActiveModal('pause');
                }}
                className="flex-1 rounded-lg border border-[#584b7a] bg-[#16192b]/90 px-4 py-2 text-xs font-semibold text-[#f5eedc] hover:border-[#f5b942] whitespace-nowrap shrink-0"
              >
                Settings & Controls
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.init();
                  const nextMuted = !saveState.settings.musicMuted;
                  const updated = saveGameState({
                    ...saveState,
                    settings: { ...saveState.settings, musicMuted: nextMuted },
                  });
                  setSaveState(updated);
                  if (!nextMuted) soundEngine.playMusic('title');
                }}
                className="flex-1 rounded-lg border border-[#584b7a] bg-[#16192b]/90 px-4 py-2 text-xs font-semibold text-[#6be6ff] hover:border-[#f5b942] whitespace-nowrap shrink-0"
              >
                Music: {saveState.settings.musicMuted ? 'Off' : 'On'}
              </button>
            </div>
          </div>

          <div className="mt-5 border-t border-[#4c436e]/60 pt-3 text-[11px] text-[#c7c0de]">
            Move: WASD / Arrows · Jump: Space · Interact / Door: E / Enter · Quest Scroll: Q
          </div>
        </div>

        {activeModal === 'pause' && (
          <PauseSettingsModal
            saveState={saveState}
            onUpdateSettings={(nextSettings) => {
              const updated = saveGameState({ ...saveState, settings: nextSettings });
              setSaveState(updated);
            }}
            onManualSave={() => saveGameState(saveState)}
            onResume={() => setActiveModal(null)}
            onReturnTitle={() => setActiveModal(null)}
            onDownloadStandalone={() => downloadStandaloneGameHtml(saveState)}
          />
        )}
      </div>
    );
  }

  // ============================================================================
  // RENDER 2: SEAMLESS SINGLE FULL-SCREEN GAME SCREEN (ALL UI INTEGRATED INSIDE)
  // ============================================================================
  const currentLine = activeDialogue ? activeDialogue.lines[dialogueIndex] : null;

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-[#090b16] select-none">
      {/* 1. FULL-VIEWPORT PIXEL-ART GAME CANVAS */}
      <canvas
        ref={gameCanvasRef}
        width={640}
        height={360}
        className="pixel-canvas h-full w-full object-fill"
      />

      {/* 2. SEAMLESS IN-SCREEN TOP-LEFT LOCATION & OBJECTIVE CREST */}
      <div className="pointer-events-none absolute top-3 left-3 z-20 flex items-center gap-2">
        <div className="rounded-xl border border-[#f5b942]/70 bg-[#0d1021]/88 px-3.5 py-2 shadow-2xl backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#f5b942]" />
            <span className="font-pixel text-[10px] sm:text-xs text-[#ffdf85]">
              {currentMap.title}
            </span>
          </div>
          <div className="mt-0.5 text-[11px] font-medium text-[#d6d0e8]">
            Next: <span className="font-semibold text-[#6be6ff]">{guideInfo.objective}</span>
          </div>
        </div>
      </div>

      {/* 3. SEAMLESS IN-SCREEN TOP-RIGHT STATUS & MENU PILLS */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-[#4c436e]/90 bg-[#0d1021]/88 px-3.5 py-2 font-mono-num text-xs shadow-2xl backdrop-blur-xs">
          <span className="font-bold text-[#6be6ff]" title="Memory Fragments">
            ◆ {saveState.fragments.length}/6
          </span>
          <span className="text-[#584b7a]">|</span>
          <span className="font-bold text-[#f5b942]" title="Secret Stars">
            ★ {saveState.stars.length}/6
          </span>
          <span className="text-[#584b7a]">|</span>
          <span className="font-semibold text-[#e6dec8]" title="Star Coins">
            ● {saveState.coins.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSfx('uiSelect');
            setActiveModal('journal');
          }}
          className="rounded-xl border border-[#f5b942]/80 bg-[#14182e]/90 px-3.5 py-2 text-xs font-bold text-[#ffdf85] shadow-2xl backdrop-blur-xs transition hover:bg-[#1f2647] whitespace-nowrap shrink-0"
        >
          Map & Journal [J]
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playSfx('uiSelect');
            soundEngine.setPaused(true);
            setActiveModal('pause');
          }}
          className="rounded-xl border border-[#584b7a] bg-[#14182e]/90 px-3.5 py-2 text-xs font-bold text-[#f5eedc] shadow-2xl backdrop-blur-xs transition hover:border-[#f5b942] whitespace-nowrap shrink-0"
        >
          Menu [Esc]
        </button>
      </div>

      {/* 4. LEFT-SIDE DIEGETIC PARCHMENT QUEST SCROLL (ROYAL PARCHMENT) */}
      <div className="absolute top-20 left-3 z-30">
        {!scrollUnrolled ? (
          /* ROLLED-UP PARCHMENT SCROLL ICON BUTTON ON THE LEFT */
          <button
            type="button"
            onClick={() => {
              soundEngine.playSfx('uiSelect');
              setScrollUnrolled(true);
            }}
            className="group flex items-center gap-2.5 rounded-xl border-2 border-[#8a5632] bg-gradient-to-r from-[#2b1a10]/95 to-[#1b1429]/92 p-2 pr-3.5 text-left shadow-2xl transition hover:scale-105 hover:border-[#f5b942]"
            title="Open Royal Quest Scroll & Guide [Q]"
          >
            {/* Illustrated Rolled Parchment Scroll with Wooden Ends & Crimson Wax Seal */}
            <div className="relative flex h-12 w-9 flex-col items-center justify-between rounded-sm border border-[#5c361e] bg-gradient-to-r from-[#d9be8c] via-[#f5e7c6] to-[#c4a270] py-0.5 shadow-inner shrink-0">
              {/* Top wooden roller */}
              <div className="h-1.5 w-10 rounded-full bg-[#6e4224] border border-[#f5b942]/60" />
              {/* Ribbon & Crimson Wax Seal */}
              <div className="h-1.5 w-full bg-[#8f2436]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-[#ffdf85] bg-[#9e2b3b] text-[9px] font-bold text-[#ffdf85] shadow">
                ★
              </div>
              {/* Bottom wooden roller */}
              <div className="h-1.5 w-10 rounded-full bg-[#6e4224] border border-[#f5b942]/60" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-pixel text-[10px] text-[#f5b942]">
                  QUEST SCROLL
                </span>
                <span className="rounded bg-[#f5b942]/20 px-1.5 py-0.5 font-mono-num text-[9px] font-bold text-[#ffdf85]">
                  [Q]
                </span>
              </div>
              <div className="mt-0.5 max-w-[155px] truncate text-[11px] font-semibold text-[#f5eedc]">
                {guideInfo.directionBadge}
              </div>
              <div className="text-[10px] text-[#6be6ff] group-hover:underline">
                Click to unroll parchment ➔
              </div>
            </div>
          </button>
        ) : (
          /* UNROLLED PARCHMENT SCROLL */
          <aside className="w-72 sm:w-80 drop-shadow-[0_14px_28px_rgba(0,0,0,0.85)]">
            {/* Top Cylindrical Wooden Scroll Rod with Gold Finials */}
            <div className="mx-auto flex h-4 w-[98%] items-center justify-between rounded-full border border-[#3b2214] bg-gradient-to-b from-[#965d36] via-[#6e4224] to-[#3b2214] px-1.5 shadow-md">
              <div className="h-2.5 w-3 rounded-xs bg-[#f5b942] shadow" />
              <span className="font-pixel text-[8px] tracking-widest text-[#ffdf85]">
                ROYAL QUEST SCROLL
              </span>
              <div className="h-2.5 w-3 rounded-xs bg-[#f5b942] shadow" />
            </div>

            {/* Aged Parchment Paper Body */}
            <div className="flex max-h-[calc(100vh-185px)] flex-col border-x-4 border-[#9c7a4c] bg-gradient-to-b from-[#f5e7c6] via-[#edd8ad] to-[#e2c690] p-3.5 text-[#2b1a10]">
              {/* Parchment Header */}
              <div className="flex items-center justify-between border-b-2 border-[#b89462] pb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#9e2b3b] text-[10px] font-bold text-[#ffdf85] shadow">
                    ★
                  </span>
                  <span className="font-pixel text-[10px] font-bold text-[#4a2812]">
                    QUESTS & GUIDE
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playSfx('uiSelect');
                    setScrollUnrolled(false);
                  }}
                  className="rounded border border-[#8a6236] bg-[#d9be8c] px-2 py-0.5 text-[10px] font-bold text-[#3b2214] hover:bg-[#cfa96e] whitespace-nowrap shrink-0"
                >
                  Roll Up [Q]
                </button>
              </div>

              {/* Current Step-by-Step Guide Box on Parchment */}
              <div className="mt-2.5 rounded-lg border-2 border-[#9e2b3b]/60 bg-[#fff5dc]/85 p-2.5 shadow-inner">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-pixel text-[9px] text-[#9e2b3b]">
                    CURRENT GUIDE:
                  </span>
                  <span className="rounded bg-[#4a2812] px-1.5 py-0.5 font-mono-num text-[10px] font-bold text-[#ffdf85]">
                    {guideInfo.directionBadge}
                  </span>
                </div>
                <div className="mt-1 text-xs font-extrabold text-[#2b1a10]">
                  {guideInfo.objective}
                </div>
                <p className="mt-1 text-[11px] font-medium leading-snug text-[#4a301d]">
                  {guideInfo.howTo}
                </p>
              </div>

              {/* Scrollable Quest Steps Checklist */}
              <div className="mt-2.5 flex-1 space-y-2.5 overflow-y-auto pr-1">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wide text-[#5c3418]">
                    {activeMainQuest.title}
                  </div>
                  <div className="mt-1.5 space-y-1.5">
                    {activeMainQuest.steps.map((st) => {
                      const isDone = st.flag.startsWith('fragment_')
                        ? saveState.fragments.includes(Number(st.flag.split('_')[1]))
                        : Boolean(saveState.flags[st.flag]);
                      return (
                        <div
                          key={st.flag}
                          className={`flex items-start gap-2 rounded border px-2 py-1.5 text-[11px] leading-snug ${
                            isDone
                              ? 'border-[#8c9e7a] bg-[#dce8ce]/70 text-[#2d5930] line-through'
                              : 'border-[#bfa070] bg-[#faeed4]/85 font-semibold text-[#2b1a10]'
                          }`}
                        >
                          <span className="font-mono-num font-bold shrink-0">
                            {isDone ? '[✓]' : '[ ]'}
                          </span>
                          <span>{st.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Collapsible Town Odd Jobs (Side Quests) */}
                {saveState.flags['entered_town'] && (
                  <div className="border-t border-[#b89462] pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSideQuestsInScroll((p) => !p)}
                      className="flex w-full items-center justify-between text-left text-[11px] font-extrabold text-[#752635] hover:underline"
                    >
                      <span>Town Odd Jobs (Side Quests)</span>
                      <span>{showSideQuestsInScroll ? '▼' : '▶'}</span>
                    </button>

                    {showSideQuestsInScroll && (
                      <div className="mt-2 space-y-2">
                        {sideQuests.map((sq) => {
                          const sqDone = Boolean(saveState.flags[sq.completedFlag]);
                          return (
                            <div
                              key={sq.id}
                              className="rounded border border-[#bfa070] bg-[#faeed4]/75 p-2 text-[11px]"
                            >
                              <div className="font-bold text-[#4a2812]">
                                {sqDone ? '✓ ' : '• '}
                                {sq.title}
                              </div>
                              <div className="mt-1 space-y-1">
                                {sq.steps.map((step) => {
                                  const d = Boolean(saveState.flags[step.flag]);
                                  return (
                                    <div
                                      key={step.flag}
                                      className={
                                        d
                                          ? 'text-[#2d5930] line-through'
                                          : 'text-[#4a301d]'
                                      }
                                    >
                                      {d ? '[✓] ' : '[ ] '}
                                      {step.label}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Parchment Footer */}
              <div className="mt-2 flex items-center justify-between border-t border-[#b89462] pt-2 text-[10px] font-bold text-[#5c3418]">
                <span>Shortcut: [Q] Scroll</span>
                <button
                  type="button"
                  onClick={() => setActiveModal('journal')}
                  className="text-[#9e2b3b] hover:underline whitespace-nowrap shrink-0"
                >
                  Full Map & Lore ➔
                </button>
              </div>
            </div>

            {/* Bottom Cylindrical Wooden Scroll Rod with Gold Finials */}
            <div className="mx-auto flex h-4 w-[98%] items-center justify-between rounded-full border border-[#3b2214] bg-gradient-to-b from-[#965d36] via-[#6e4224] to-[#3b2214] px-1.5 shadow-md">
              <div className="h-2.5 w-3 rounded-xs bg-[#f5b942] shadow" />
              <div className="h-2.5 w-3 rounded-xs bg-[#f5b942] shadow" />
            </div>
          </aside>
        )}
      </div>

      {/* 5. CHAPTER TRANSITION & TOAST BANNERS (SEAMLESS IN-SCREEN) */}
      {transitionBanner && (
        <div className="pointer-events-none absolute top-14 left-1/2 z-20 -translate-x-1/2 rounded-xl border border-[#f5b942] bg-[#0e1122]/90 px-5 py-2 text-center shadow-2xl backdrop-blur-xs">
          <div className="font-pixel text-xs text-[#f5b942]">{transitionBanner}</div>
        </div>
      )}

      {toastBanner && (
        <div className="pointer-events-none absolute top-24 left-1/2 z-20 -translate-x-1/2 rounded-lg border border-[#6be6ff] bg-[#12162b]/95 px-4 py-1.5 text-xs font-semibold text-[#c4f2ff] shadow-xl">
          {toastBanner}
        </div>
      )}

      {/* 6. CONTEXTUAL INTERACTION PROMPT (FLOATING ABOVE BOTTOM CONTROLS) */}
      {nearbyInteractable && !activeDialogue && !activeModal && (
        <div className="absolute bottom-16 left-1/2 z-20 -translate-x-1/2">
          <button
            type="button"
            onClick={triggerInteraction}
            className="rpg-panel-gold flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-xs font-bold text-[#f5eedc] shadow-2xl transition hover:scale-105 whitespace-nowrap shrink-0"
          >
            <span className="rounded bg-[#f5b942] px-2 py-0.5 font-pixel text-[10px] text-[#0d0f1a]">
              PRESS E / CLICK
            </span>
            <span>{nearbyInteractable.promptLabel}</span>
          </button>
        </div>
      )}

      {/* 7. RPG DIALOGUE BOX OVERLAY (INSIDE GAME SCREEN) */}
      {activeDialogue && currentLine && (
        <div
          onClick={advanceDialogue}
          className="rpg-panel-gold absolute bottom-16 left-3 right-3 z-30 mx-auto flex max-w-3xl cursor-pointer items-center gap-4 rounded-xl p-3.5 sm:p-4 shadow-2xl"
        >
          <div className="shrink-0">
            <canvas
              ref={portraitCanvasRef}
              width={96}
              height={96}
              className="pixel-canvas h-16 w-16 sm:h-24 sm:w-24 rounded-lg border-2 border-[#584b7a] bg-[#141726]"
            />
          </div>

          <div className="flex flex-1 flex-col justify-between min-h-[72px] sm:min-h-[88px]">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-pixel text-xs sm:text-sm text-[#f5b942]">
                  {currentLine.speakerName}
                </span>
                <span className="font-mono-num text-[11px] text-[#9e96b8]">
                  {dialogueIndex + 1} / {activeDialogue.lines.length}
                </span>
              </div>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#f5eedc]">
                {currentLine.text.slice(0, typedLength)}
              </p>
            </div>

            <div className="mt-2 flex justify-end">
              <span className="font-pixel text-[10px] text-[#6be6ff]">
                {typedLength < currentLine.text.length
                  ? 'Press E / Space to Skip'
                  : 'Press E / Space / Click to Continue ▶'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 8. SEAMLESS IN-SCREEN DIRECTIONAL CONTROLS (BOTTOM-LEFT OVERLAY) */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5">
        <button
          type="button"
          onPointerDown={() => setTouchKey('arrowleft', true)}
          onPointerUp={() => setTouchKey('arrowleft', false)}
          onPointerLeave={() => setTouchKey('arrowleft', false)}
          className="flex h-10 w-11 items-center justify-center rounded-lg border border-[#584b7a]/90 bg-[#101426]/80 text-xs font-bold text-[#f5eedc] shadow-lg backdrop-blur-xs active:bg-[#f5b942] active:text-[#0d0f1a]"
        >
          ◀
        </button>
        {currentMap.mode === 'topdown' && (
          <>
            <button
              type="button"
              onPointerDown={() => setTouchKey('arrowup', true)}
              onPointerUp={() => setTouchKey('arrowup', false)}
              onPointerLeave={() => setTouchKey('arrowup', false)}
              className="flex h-10 w-11 items-center justify-center rounded-lg border border-[#584b7a]/90 bg-[#101426]/80 text-xs font-bold text-[#f5eedc] shadow-lg backdrop-blur-xs active:bg-[#f5b942] active:text-[#0d0f1a]"
            >
              ▲
            </button>
            <button
              type="button"
              onPointerDown={() => setTouchKey('arrowdown', true)}
              onPointerUp={() => setTouchKey('arrowdown', false)}
              onPointerLeave={() => setTouchKey('arrowdown', false)}
              className="flex h-10 w-11 items-center justify-center rounded-lg border border-[#584b7a]/90 bg-[#101426]/80 text-xs font-bold text-[#f5eedc] shadow-lg backdrop-blur-xs active:bg-[#f5b942] active:text-[#0d0f1a]"
            >
              ▼
            </button>
          </>
        )}
        <button
          type="button"
          onPointerDown={() => setTouchKey('arrowright', true)}
          onPointerUp={() => setTouchKey('arrowright', false)}
          onPointerLeave={() => setTouchKey('arrowright', false)}
          className="flex h-10 w-11 items-center justify-center rounded-lg border border-[#584b7a]/90 bg-[#101426]/80 text-xs font-bold text-[#f5eedc] shadow-lg backdrop-blur-xs active:bg-[#f5b942] active:text-[#0d0f1a]"
        >
          ▶
        </button>
      </div>

      {/* 9. SEAMLESS IN-SCREEN ACTION BUTTONS (BOTTOM-RIGHT OVERLAY) */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
        {currentMap.mode === 'sidescroll' && (
          <button
            type="button"
            onPointerDown={() => setTouchKey(' ', true)}
            onPointerUp={() => setTouchKey(' ', false)}
            onPointerLeave={() => setTouchKey(' ', false)}
            className="h-10 rounded-lg border border-[#6be6ff]/80 bg-[#102038]/85 px-4 text-xs font-bold text-[#6be6ff] shadow-lg backdrop-blur-xs active:bg-[#6be6ff] active:text-[#0d0f1a] whitespace-nowrap shrink-0"
          >
            Jump [Space]
          </button>
        )}
        <button
          type="button"
          onClick={triggerInteraction}
          className="h-10 rounded-lg border border-[#f5b942] bg-[#f5b942]/95 px-4 text-xs font-bold text-[#0d0f1a] shadow-lg backdrop-blur-xs active:bg-[#ffcf66] whitespace-nowrap shrink-0"
        >
          Interact [E]
        </button>
      </div>

      {/* 10. ACTIVE MODALS */}
      {activeModal === 'journal' && (
        <QuestJournalModal
          saveState={saveState}
          onClose={() => setActiveModal(null)}
          onFastTravel={(targetMap, x, y) => {
            setActiveModal(null);
            transitionToMap(targetMap, x, y);
          }}
        />
      )}

      {activeModal === 'pause' && (
        <PauseSettingsModal
          saveState={saveState}
          onUpdateSettings={(nextSettings) => {
            const updated = saveGameState({ ...saveState, settings: nextSettings });
            setSaveState(updated);
          }}
          onManualSave={() => saveGameState(saveState)}
          onResume={() => {
            soundEngine.setPaused(false);
            setActiveModal(null);
          }}
          onReturnTitle={() => {
            soundEngine.setPaused(false);
            soundEngine.playMusic('title');
            setActiveModal(null);
            setScreen('title');
          }}
          onDownloadStandalone={() => downloadStandaloneGameHtml(saveState)}
        />
      )}

      {activeModal === 'prologue_letter' && (
        <LetterReaderModal
          mode="prologue"
          onFinish={() => {
            setActiveModal(null);
            setSaveState((prev) =>
              saveGameState({
                ...prev,
                flags: { ...prev.flags, read_station_letter: true },
              })
            );
            showToast('The Garden Gate at the far right of the platform is now unlocked!');
          }}
        />
      )}

      {activeModal === 'final_letter' && (
        <LetterReaderModal
          mode="final"
          onFinish={() => {
            setActiveModal('birthday_present');
          }}
        />
      )}

      {activeModal === 'arcade_minigame' && (
        <ArcadeMiniGameModal
          alreadyWon={Boolean(saveState.flags['arcade_minigame_won'])}
          onWin={() => {
            setSaveState((prev) =>
              saveGameState({
                ...prev,
                flags: { ...prev.flags, arcade_minigame_won: true },
              })
            );
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'arcade_vault' && (
        <ArcadeVaultModal
          hasBatteries={Boolean(saveState.flags['arcade_minigame_won'])}
          initialDials={saveState.arcadeSymbols}
          isSolved={Boolean(saveState.flags['arcade_puzzle_solved'])}
          onUpdateDials={(dials, solved) => {
            setSaveState((prev) =>
              saveGameState({
                ...prev,
                arcadeSymbols: dials,
                flags: solved
                  ? { ...prev.flags, arcade_puzzle_solved: true }
                  : prev.flags,
              })
            );
          }}
          onOpenMiniGame={() => setActiveModal('arcade_minigame')}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'unfinished_picture' && (
        <UnfinishedPictureModal
          isComplete={Boolean(saveState.flags['observatory_puzzle_solved'])}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'observatory_puzzle' && (
        <ObservatoryPuzzleModal
          lights={saveState.observatoryLights}
          isSolved={Boolean(saveState.flags['observatory_puzzle_solved'])}
          onToggleLight={(idx) => {
            const nextLights: [boolean, boolean, boolean, boolean] = [
              ...saveState.observatoryLights,
            ] as [boolean, boolean, boolean, boolean];
            nextLights[idx] = !nextLights[idx];
            setSaveState((prev) =>
              saveGameState({ ...prev, observatoryLights: nextLights })
            );
          }}
          onCompleteAssembly={() => {
            setSaveState((prev) =>
              saveGameState({
                ...prev,
                flags: { ...prev.flags, observatory_puzzle_solved: true },
              })
            );
            setActiveModal(null);
            window.setTimeout(() => startDialogue('observatory_reveal_sequence'), 250);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'birthday_present' && (
        <BirthdayPresentModal
          starsCount={saveState.stars.length}
          onEnterSecretGarden={() => {
            setActiveModal(null);
            transitionToMap('secret_garden', 140, 250);
          }}
          onReturnToWorld={() => setActiveModal(null)}
          onPlayAgain={() => {
            setActiveModal(null);
            handleStartNewGame();
          }}
        />
      )}
    </div>
  );
}
