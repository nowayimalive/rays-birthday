import React, { useState } from 'react';
import { MapId, SaveState } from './types';
import { MEMORY_FRAGMENTS, QUEST_LIST, SECRET_STARS } from './collectibles';
import { soundEngine } from './audio';

export const QuestJournalModal: React.FC<{
  saveState: SaveState;
  onClose: () => void;
  onFastTravel: (mapId: MapId, x: number, y: number) => void;
}> = ({ saveState, onClose, onFastTravel }) => {
  const [tab, setTab] = useState<'quests' | 'fragments' | 'stars' | 'map'>('quests');

  const switchTab = (next: 'quests' | 'fragments' | 'stars' | 'map') => {
    soundEngine.playSfx('uiSelect');
    setTab(next);
  };

  const townBuildings = [
    { id: 'town_hall', name: 'Town Hall (North)', unlocked: saveState.unlockedBuildings.includes('town_hall') },
    { id: 'sleepy_inn', name: 'The Sleepy Inn (Southwest)', unlocked: saveState.unlockedBuildings.includes('sleepy_inn') },
    { id: 'library', name: 'Town Library (Southwest)', unlocked: saveState.unlockedBuildings.includes('library') },
    { id: 'flower_shop', name: 'Rosa’s Flower Shop (West)', unlocked: saveState.unlockedBuildings.includes('flower_shop') },
    { id: 'bakery', name: 'Bram’s Bakery (East)', unlocked: saveState.unlockedBuildings.includes('bakery') },
    { id: 'post_office', name: 'Postie’s Post Office (South)', unlocked: saveState.unlockedBuildings.includes('post_office') },
    { id: 'arcade', name: 'Clockwork Arcade (Southeast)', unlocked: saveState.unlockedBuildings.includes('arcade') },
    { id: 'little_tailor', name: 'The Little Tailor (West)', unlocked: false },
    { id: 'moonbean_cafe', name: 'Moonbean Café (East)', unlocked: false },
    { id: 'old_bell_tower', name: 'Old Bell Tower (Southeast)', unlocked: false },
  ];

  const creatorName = saveState.flags['allan_reveal_complete'] ? 'Allan' : '[???]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="rpg-panel flex max-h-[88vh] w-full max-w-2xl flex-col rounded-xl p-5 text-[#f5eedc]">
        <div className="flex items-center justify-between border-b border-[#4c436e] pb-3">
          <div>
            <h2 className="font-pixel text-sm text-[#f5b942]">RAYNIO’S TRAVEL JOURNAL</h2>
            <p className="text-xs text-[#b8b2cc]">
              Fragments: {saveState.fragments.length}/6 · Secret Stars: {saveState.stars.length}/6 · Coins: {saveState.coins.length}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[#584b7a] bg-[#1b2038] px-3 py-1.5 text-xs font-semibold hover:border-[#f5b942] whitespace-nowrap shrink-0"
          >
            Close [Esc]
          </button>
        </div>

        {/* Segmented Control Tabs */}
        <div className="mt-3 flex flex-wrap gap-1.5 rounded-lg bg-[#121526] p-1">
          <button
            type="button"
            onClick={() => switchTab('quests')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap shrink-0 ${
              tab === 'quests'
                ? 'bg-[#f5b942] text-[#0d0f1a]'
                : 'text-[#b8b2cc] hover:text-[#f5eedc]'
            }`}
          >
            Quests & Errands
          </button>
          <button
            type="button"
            onClick={() => switchTab('fragments')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap shrink-0 ${
              tab === 'fragments'
                ? 'bg-[#f5b942] text-[#0d0f1a]'
                : 'text-[#b8b2cc] hover:text-[#f5eedc]'
            }`}
          >
            Memory Fragments ({saveState.fragments.length}/6)
          </button>
          <button
            type="button"
            onClick={() => switchTab('stars')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap shrink-0 ${
              tab === 'stars'
                ? 'bg-[#f5b942] text-[#0d0f1a]'
                : 'text-[#b8b2cc] hover:text-[#f5eedc]'
            }`}
          >
            Secret Stars ({saveState.stars.length}/6)
          </button>
          <button
            type="button"
            onClick={() => switchTab('map')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap shrink-0 ${
              tab === 'map'
                ? 'bg-[#f5b942] text-[#0d0f1a]'
                : 'text-[#b8b2cc] hover:text-[#f5eedc]'
            }`}
          >
            Town Map & Checkpoints
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
          {tab === 'quests' &&
            QUEST_LIST.map((q) => {
              const isDone = Boolean(saveState.flags[q.completedFlag]);
              return (
                <div
                  key={q.id}
                  className="rounded-lg border border-[#3e3659] bg-[#14182b] p-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#f5eedc]">
                      {q.title}
                    </span>
                    <span className="text-xs text-[#b8b2cc]">
                      {q.chapter} · {isDone ? 'Completed' : q.isMain ? 'Main Story' : 'Odd Job'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#b8b2cc]">{q.description}</p>
                  <div className="mt-2.5 space-y-1">
                    {q.steps.map((st) => {
                      const stepDone =
                        st.flag.startsWith('fragment_')
                          ? saveState.fragments.includes(Number(st.flag.split('_')[1]))
                          : Boolean(saveState.flags[st.flag]);
                      return (
                        <div
                          key={st.flag}
                          className={`text-xs ${
                            stepDone ? 'text-[#38d996] line-through' : 'text-[#ffdf8c]'
                          }`}
                        >
                          {stepDone ? '[x] ' : '[ ] '}
                          {st.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          {tab === 'fragments' &&
            MEMORY_FRAGMENTS.map((frag) => {
              const collected = saveState.fragments.includes(frag.id);
              return (
                <div
                  key={frag.id}
                  className="rounded-lg border border-[#3e3659] bg-[#14182b] p-3.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-xs text-[#6be6ff]">
                      FRAGMENT #{frag.id}: {collected ? frag.title : '???'}
                    </span>
                    <span className="text-xs text-[#b8b2cc]">{frag.chapter}</span>
                  </div>
                  {collected ? (
                    <>
                      <p className="mt-2 text-sm font-semibold text-[#ffdf8c]">
                        “{frag.message}”
                      </p>
                      <p className="mt-1 text-xs text-[#b8b2cc]">{frag.description}</p>
                    </>
                  ) : (
                    <p className="mt-2 text-xs italic text-[#8a82a6]">
                      Not yet discovered. Continue exploring {frag.chapter}.
                    </p>
                  )}
                </div>
              );
            })}

          {tab === 'stars' &&
            SECRET_STARS.map((star) => {
              const found = saveState.stars.includes(star.id);
              return (
                <div
                  key={star.id}
                  className="rounded-lg border border-[#3e3659] bg-[#14182b] p-3.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-xs text-[#f5b942]">
                      SECRET STAR #{star.id}: {found ? star.name : 'Hidden Star'}
                    </span>
                    <span className="text-xs text-[#b8b2cc]">
                      {found ? 'Collected ★' : 'Uncollected'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#b8b2cc]">
                    {star.chapter} — {star.locationHint}
                  </p>
                </div>
              );
            })}

          {tab === 'map' && (
            <div className="space-y-4">
              <div className="rounded-lg border border-[#3e3659] bg-[#14182b] p-3.5">
                <h3 className="text-xs font-bold text-[#f5b942]">
                  SOMEWHERE TOWN — BUILDING ROOT-LOCK DIRECTORY
                </h3>
                <p className="mt-1 text-xs text-[#b8b2cc]">
                  Buildings wrapped in overgrown roots are sealed until {creatorName} grants access through story progression.
                </p>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {townBuildings.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between rounded border border-[#2f2847] bg-[#101322] px-3 py-2 text-xs"
                    >
                      <span>{b.name}</span>
                      <span
                        className={`font-mono-num font-semibold ${
                          b.unlocked ? 'text-[#38d996]' : 'text-[#d94b78]'
                        }`}
                      >
                        {b.unlocked ? 'Open' : `Locked by ${creatorName}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-[#3e3659] bg-[#14182b] p-3.5">
                <h3 className="text-xs font-bold text-[#6be6ff]">
                  CHAPTER CHECKPOINT FAST TRAVEL
                </h3>
                <p className="mt-1 text-xs text-[#b8b2cc]">
                  Revisit any chapter you have unlocked to explore optional paths or collect missed Secret Stars.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onFastTravel('station', 220, 260)}
                    className="rounded border border-[#584b7a] bg-[#1b2038] px-3 py-1.5 text-xs font-semibold hover:border-[#f5b942] whitespace-nowrap shrink-0"
                  >
                    Prologue: Train Station
                  </button>
                  {saveState.flags['entered_garden'] && (
                    <button
                      type="button"
                      onClick={() => onFastTravel('garden', 110, 250)}
                      className="rounded border border-[#584b7a] bg-[#1b2038] px-3 py-1.5 text-xs font-semibold hover:border-[#f5b942] whitespace-nowrap shrink-0"
                    >
                      Ch.1: Overgrown Garden
                    </button>
                  )}
                  {saveState.flags['entered_town'] && (
                    <button
                      type="button"
                      onClick={() => onFastTravel('town', 780, 640)}
                      className="rounded border border-[#584b7a] bg-[#1b2038] px-3 py-1.5 text-xs font-semibold hover:border-[#f5b942] whitespace-nowrap shrink-0"
                    >
                      Ch.2: Town of Odd Jobs
                    </button>
                  )}
                  {saveState.unlockedBuildings.includes('arcade') && (
                    <button
                      type="button"
                      onClick={() => onFastTravel('arcade', 360, 400)}
                      className="rounded border border-[#584b7a] bg-[#1b2038] px-3 py-1.5 text-xs font-semibold hover:border-[#f5b942] whitespace-nowrap shrink-0"
                    >
                      Ch.3: Clockwork Arcade
                    </button>
                  )}
                  {saveState.flags['fragment_3'] && (
                    <button
                      type="button"
                      onClick={() => onFastTravel('winter', 140, 600)}
                      className="rounded border border-[#584b7a] bg-[#1b2038] px-3 py-1.5 text-xs font-semibold hover:border-[#f5b942] whitespace-nowrap shrink-0"
                    >
                      Ch.4: Quiet Side of Winter
                    </button>
                  )}
                  {saveState.flags['fragment_5'] && (
                    <button
                      type="button"
                      onClick={() => onFastTravel('mountain', 100, 250)}
                      className="rounded border border-[#584b7a] bg-[#1b2038] px-3 py-1.5 text-xs font-semibold hover:border-[#f5b942] whitespace-nowrap shrink-0"
                    >
                      Ch.5: Mountain Climb
                    </button>
                  )}
                  {saveState.flags['reached_observatory'] && (
                    <button
                      type="button"
                      onClick={() => onFastTravel('observatory', 345, 400)}
                      className="rounded border border-[#584b7a] bg-[#1b2038] px-3 py-1.5 text-xs font-semibold hover:border-[#f5b942] whitespace-nowrap shrink-0"
                    >
                      Ch.5: Observatory Dome
                    </button>
                  )}
                  {saveState.stars.length >= 6 && (
                    <button
                      type="button"
                      onClick={() => onFastTravel('secret_garden', 140, 250)}
                      className="rounded border border-[#f5b942] bg-[#2a233d] px-3 py-1.5 text-xs font-bold text-[#f5b942] whitespace-nowrap shrink-0"
                    >
                      ★ Secret Starlit Garden
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const PauseSettingsModal: React.FC<{
  saveState: SaveState;
  onUpdateSettings: (next: SaveState['settings']) => void;
  onManualSave: () => void;
  onResume: () => void;
  onReturnTitle: () => void;
  onDownloadStandalone: () => void;
}> = ({
  saveState,
  onUpdateSettings,
  onManualSave,
  onResume,
  onReturnTitle,
  onDownloadStandalone,
}) => {
  const [savedToast, setSavedToast] = useState(false);
  const { settings } = saveState;

  const handleSaveClick = () => {
    soundEngine.playSfx('uiConfirm');
    onManualSave();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="rpg-panel w-full max-w-md rounded-xl p-5 text-[#f5eedc]">
        <div className="flex items-center justify-between border-b border-[#4c436e] pb-3">
          <h2 className="font-pixel text-sm text-[#f5b942]">GAME PAUSED & SETTINGS</h2>
          <button
            type="button"
            onClick={onResume}
            className="rounded bg-[#f5b942] px-3.5 py-1.5 text-xs font-bold text-[#0d0f1a] hover:bg-[#ffcf66] whitespace-nowrap shrink-0"
          >
            Resume
          </button>
        </div>

        <div className="my-4 space-y-3.5">
          {/* Audio Controls */}
          <div>
            <div className="flex justify-between text-xs">
              <span>Master Volume</span>
              <span className="font-mono-num">{Math.round(settings.masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.masterVolume}
              onChange={(e) =>
                onUpdateSettings({ ...settings, masterVolume: parseFloat(e.target.value) })
              }
              className="mt-1 w-full accent-[#f5b942]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs">
              <span>Procedural Music Volume</span>
              <span className="font-mono-num">{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.musicVolume}
              onChange={(e) =>
                onUpdateSettings({ ...settings, musicVolume: parseFloat(e.target.value) })
              }
              className="mt-1 w-full accent-[#f5b942]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs">
              <span>Sound Effects Volume</span>
              <span className="font-mono-num">{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.sfxVolume}
              onChange={(e) =>
                onUpdateSettings({ ...settings, sfxVolume: parseFloat(e.target.value) })
              }
              className="mt-1 w-full accent-[#f5b942]"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs">Background Music</span>
            <button
              type="button"
              onClick={() =>
                onUpdateSettings({ ...settings, musicMuted: !settings.musicMuted })
              }
              className="rounded border border-[#584b7a] bg-[#1b2038] px-3 py-1 text-xs font-semibold hover:border-[#f5b942] whitespace-nowrap shrink-0"
            >
              {settings.musicMuted ? 'Muted (Off)' : 'Playing (On)'}
            </button>
          </div>

          {/* Controls Reference */}
          <div className="rounded border border-[#3e3659] bg-[#14182b] p-3 text-xs text-[#b8b2cc]">
            <div className="font-bold text-[#f5eedc]">Controls Reference</div>
            <div className="mt-1">• Move: WASD or Arrow Keys (or Touch D-Pad)</div>
            <div>• Jump (Platforming Chapters): Space or Up/W</div>
            <div>• Interact / Advance Dialogue: E or Enter</div>
            <div>• Journal & Map: J · Pause Menu: Esc</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#4c436e] pt-3">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleSaveClick}
              className="flex-1 rounded border border-[#38d996] bg-[#132b24] px-3 py-2 text-xs font-bold text-[#a8f5d4] hover:bg-[#193b31] whitespace-nowrap shrink-0"
            >
              {savedToast ? 'Checkpoint Saved!' : 'Save Checkpoint'}
            </button>
            <button
              type="button"
              onClick={onDownloadStandalone}
              className="rounded border border-[#584b7a] bg-[#1b2038] px-3 py-2 text-xs font-semibold text-[#6be6ff] hover:border-[#f5b942] whitespace-nowrap shrink-0"
            >
              Export HTML Build
            </button>
          </div>
          <button
            type="button"
            onClick={onReturnTitle}
            className="w-full rounded border border-[#584b7a] bg-[#1b2038] px-3 py-2 text-xs font-semibold text-[#f5eedc] hover:border-[#f5b942] whitespace-nowrap shrink-0"
          >
            Save & Return to Title Screen
          </button>
        </div>
      </div>
    </div>
  );
};
