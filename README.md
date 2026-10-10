# THE LITTLE THING WE LEFT BEHIND
### A Complete, Playable Pixel-Art RPG Adventure Created by Allan for Raynio

> *“Some things don't need to be brought back to still mean something.”*

---

## 1. Overview & Features

**THE LITTLE THING WE LEFT BEHIND** is a self-contained browser pixel-art RPG adventure built with HTML5 Canvas, TypeScript/React, CSS3, LocalStorage persistence, and a multi-voice procedural Web Audio API soundtrack and sound effects synthesizer.

### Implemented Systems
- **Dual Movement Modes**:
  - **Side-Scrolling Platformer** (`Prologue: The Wrong Station`, `Chapter 1: The Overgrown Garden`, `Chapter 5A: Path to the Observatory`, and `Secret Starlit Garden`) with gravity, jumping, platform landing, collectible Star Coins, and forgiving checkpoint recovery.
  - **Top-Down Free-Roaming RPG** (`Chapter 2: Town of Odd Jobs` + 6 Enterable Interiors, `Chapter 3: The Clockwork Arcade`, `Chapter 4: The Quiet Side of Winter`, and `Chapter 5B: The Observatory Dome`) with 4-directional movement, obstacle collision, and smooth camera tracking.
- **Overgrown-Root Building Lock Mechanic**:
  - Locked town buildings display gnarled thorny roots across their entrances (`"I'm sorry, Ray. [???] hasn't granted access to this place yet."`).
  - As story milestones are reached, the roots animate and retract with a musical chime.
- **Detailed Pixel-Art Character Portraits & Walking Sprites**:
  - **Raynio**: Thick messy curly black hair with forehead fringe, light skin tone, carrying his travel bag, starting in a blue travel shirt and magically transforming into a fantasy knight outfit upon stepping off the train.
  - **Mallow**: Floating white ghost companion with gray outline, pink accent, and recurring jokes (grudge against pigeons, zero municipal budget, sleeping on benches, and Raynio completing 87% of his unpaid work).
  - **Mayor Cat**: Orange cat in a burgundy suit, golden tie, and top hat who accidentally blurts out `"Welcome back, by the way!"`
  - **The Keeper**: Mysterious guardian of the world's leftover memories (hooded in Chapter 4, lowering his hood at the Observatory to reveal a scarred face, messy dark hair, and glowing cyan eyes — strictly distinct from Allan).
  - **Allan**: The human creator of the world (messy black hair, warm human dark eyes, no facial scars), revealed only after collecting the 6th Memory Fragment.
  - **Supporting Town NPCs & Playable Odd Jobs**: Postie (`"FRAGILE: EGO INSIDE"` delivery), Rosa (Runaway Night-Bloom flowers that visibly bloom the Town Square flowerbeds), Bram (Unionizing runaway sourdough loaves, including one hiding in Mayor Cat's spare hat), Tock the Clockmaker, Town Librarian, and Innkeeper Martha.
- **Functional Mini-Game & Puzzles**:
  - **Gear Runner Arcade Cabinet Mini-Game**: Dodge moving electric sparks and collect 3 Power Batteries.
  - **4-Symbol Brass Vault Puzzle**: Align the four dials in chronological order from the 4 Brass Plaques (`SUN -> MOON -> STAR -> ENVELOPE`).
  - **Observatory Constellation & Unfinished Picture Assembly**: Ignite the 4 points of light and assemble all 6 Memory Fragments.
- **6 Collectible Memory Fragments & 6 Optional Secret Stars**:
  - Collecting all 6 Secret Stars unlocks the optional **Secret Starlit Garden** ending.
- **Main Ending & Final Birthday Present**:
  - Multi-page birthday letter from Allan to Raynio ending with `"Enough emotional damage. Go on. Open it."`
  - Celebratory final present screen with `"TAP TO OPEN YOUR PRESENT"` linking directly to `https://t.me/ILoveYouForever_Raynio` (with visible fallback link).

---

## 2. How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server on port 3000
npm run dev

# 3. Build for production
npm run build
```

You can also click **Export HTML Build** inside the in-game Pause/Settings menu (`[Esc]`) at any time to download a standalone portable HTML keepsake file (`THE_LITTLE_THING_WE_LEFT_BEHIND_Keepsake.html`).

---

## 3. Controls

### Keyboard Controls
- **Move**: `W` `A` `S` `D` or `Arrow Keys`
- **Jump (Platforming Chapters)**: `Space`, `W`, or `Up Arrow`
- **Interact / Talk / Advance Dialogue**: `E` or `Enter` (or `Space` during dialogue)
- **Open Travel Journal & Town Map**: `J`
- **Pause & Audio Settings Menu**: `Escape`

### Mobile / Touch Controls
- **Touch D-Pad** (`◀` `▲` `▼` `▶`) in the bottom-left bar.
- **Jump** and **Interact** buttons in the bottom-right bar.
- Tap the floating contextual prompt or dialogue box directly to interact and advance text.

---

## 4. Secret Star Locations Guide (All 6 Stars)
1. **Secret Star #1 (Canopy Whisper Star)**: Chapter 1 (`The Overgrown Garden`) — Jump up the optional floating cloud ledges in the middle of the garden.
2. **Secret Star #2 (Missing Page Star)**: Chapter 2 (`Town Library Interior`) — Tucked in the upper-right archive aisle inside the Town Library.
3. **Secret Star #3 (Out-of-Order Cabinet Star)**: Chapter 3 (`The Clockwork Arcade`) — Hidden behind the broken arcade machine in the northeast corner.
4. **Secret Star #4 (Frost-Pine Trail Star)**: Chapter 4 (`The Quiet Side of Winter`) — Along the snowy pine trail in the northeast corner behind the frost trees.
5. **Secret Star #5 (Windward Ridge Star)**: Chapter 5 (`Path to the Observatory`) — High optional cloud ledge above Mallow's midpoint stop.
6. **Secret Star #6 (Astrolabe Balcony Star)**: Chapter 5 (`The Observatory Dome`) — Upper-right alcove inside the Observatory Dome.
