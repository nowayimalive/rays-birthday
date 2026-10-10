import { CharacterId, InteractableObject, MapId, SaveState } from './types';
import { MAPS, MapDefinition } from './mapData';

// ============================================================================
// 1. DEDICATED TWILIGHT-NIGHT TRAIN SCENE FOR TITLE MENU
// ============================================================================
export function renderSunsetTrainTitleScene(
  ctx: CanvasRenderingContext2D,
  tick: number
): void {
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  // Deep Twilight-Night Sky Gradient (Senja-Malam inspired by Faultbox & dusk train art)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 360);
  skyGrad.addColorStop(0, '#0a0c1c');
  skyGrad.addColorStop(0.28, '#181838');
  skyGrad.addColorStop(0.55, '#35214a');
  skyGrad.addColorStop(0.78, '#7a3352');
  skyGrad.addColorStop(0.92, '#c95c48');
  skyGrad.addColorStop(1, '#f29e52');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 640, 360);

  // Dense twinkling starfield & 4-point pixel stars in the upper twilight sky
  for (let i = 0; i < 55; i++) {
    const sx = (i * 79 + 17) % 640;
    const sy = (i * 31 + 11) % 165;
    const phase = (Math.floor(tick / 14) + i) % 4;
    if (i % 7 === 0) {
      // Glowing 4-point star (like Faultbox sky!)
      ctx.fillStyle = phase === 0 ? '#ffffff' : '#ffdf85';
      ctx.fillRect(sx, sy - 3, 2, 8);
      ctx.fillRect(sx - 3, sy, 8, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(sx, sy, 2, 2);
    } else {
      const sz = phase === 0 ? 2 : 1;
      ctx.fillStyle = i % 3 === 0 ? '#ffdf85' : i % 5 === 0 ? '#8cebff' : '#ffffff';
      ctx.fillRect(sx, sy, sz, sz);
    }
  }

  // Crescent Moon & warm dusk horizon glow
  ctx.fillStyle = 'rgba(255, 224, 140, 0.14)';
  ctx.fillRect(468, 42, 54, 54);
  ctx.fillStyle = '#fff3bd';
  ctx.fillRect(484, 56, 22, 22);
  ctx.fillStyle = '#181838';
  ctx.fillRect(492, 54, 18, 18);

  // Soft Dusk Horizon Sun Glow sinking behind distant mountain ridge
  ctx.fillStyle = 'rgba(245, 140, 80, 0.22)';
  ctx.fillRect(380, 155, 160, 80);
  ctx.fillStyle = 'rgba(255, 210, 120, 0.35)';
  ctx.fillRect(420, 175, 80, 50);

  // Layered Pixel Clouds tinted with twilight violet & rose-gold
  const drawCloud = (cx: number, cy: number, w: number) => {
    const x = (((cx - Math.floor(tick * 0.12)) % 740) + 740) % 740 - 70;
    ctx.fillStyle = '#2d1e42';
    ctx.fillRect(x, cy, w, 12);
    ctx.fillRect(x + 10, cy - 6, w - 20, 6);
    ctx.fillStyle = '#853c59';
    ctx.fillRect(x + 4, cy + 7, w - 8, 3);
    ctx.fillStyle = '#e67e55';
    ctx.fillRect(x + 8, cy + 10, w - 16, 2);
  };
  drawCloud(70, 82, 84);
  drawCloud(250, 62, 98);
  drawCloud(460, 96, 74);
  drawCloud(590, 70, 86);

  // Distant Mountain Silhouette & Twilight Forest Ridge
  ctx.fillStyle = '#16152b';
  ctx.fillRect(0, 212, 640, 85);
  for (let hx = 0; hx < 640; hx += 70) {
    ctx.fillRect(hx, 192 + (hx % 22), 82, 30);
  }

  // Layered Night-Teal & Indigo Pine Trees (inspired by Faultbox foliage)
  for (let tx = -12; tx < 660; tx += 34) {
    const h = 44 + (tx % 3) * 10;
    const ty = 250 - h;
    ctx.fillStyle = '#0e1324';
    ctx.fillRect(tx + 13, ty + h - 12, 8, 16);
    ctx.fillStyle = tx % 68 === 0 ? '#192a3d' : '#131d30';
    ctx.fillRect(tx + 2, ty + 18, 30, 14);
    ctx.fillRect(tx + 6, ty + 9, 22, 12);
    ctx.fillRect(tx + 10, ty, 14, 11);
    // Subtle teal moonlit highlight on tree tips
    ctx.fillStyle = '#264459';
    ctx.fillRect(tx + 10, ty, 6, 3);
  }

  // Vintage Pixel Train resting at the Twilight Station
  const trainX = 44;
  const trainY = 198;

  // Steam puffs rising into the starry dusk sky
  for (let s = 0; s < 5; s++) {
    const puffAge = (tick + s * 22) % 110;
    const px = trainX + 305 - Math.floor(puffAge * 0.45);
    const py = trainY - 12 - Math.floor(puffAge * 0.35);
    const pSize = Math.max(4, 14 - Math.floor(puffAge / 10));
    ctx.fillStyle = 'rgba(235, 210, 225, 0.35)';
    ctx.fillRect(px, py, pSize, pSize);
  }

  // Passenger Carriages with warm golden glowing windows
  for (let c = 0; c < 2; c++) {
    const cx = trainX + c * 142;
    ctx.fillStyle = '#1a2238';
    ctx.fillRect(cx - 2, trainY, 134, 10);
    ctx.fillStyle = '#324266';
    ctx.fillRect(cx + 2, trainY + 2, 126, 4);
    ctx.fillStyle = '#222e4a';
    ctx.fillRect(cx, trainY + 10, 130, 56);
    ctx.fillStyle = '#732435';
    ctx.fillRect(cx, trainY + 42, 130, 10);
    ctx.fillStyle = '#f5b942';
    ctx.fillRect(cx, trainY + 40, 130, 2);

    for (let w = 0; w < 3; w++) {
      const wx = cx + 14 + w * 38;
      // Warm window light spill
      ctx.fillStyle = 'rgba(255, 215, 115, 0.15)';
      ctx.fillRect(wx - 4, trainY + 14, 32, 34);
      ctx.fillStyle = '#121829';
      ctx.fillRect(wx - 2, trainY + 16, 28, 22);
      ctx.fillStyle = '#ffdf85';
      ctx.fillRect(wx, trainY + 18, 24, 18);
      ctx.fillStyle = '#fff7d6';
      ctx.fillRect(wx + 2, trainY + 20, 8, 14);
    }
    ctx.fillStyle = '#0f131f';
    ctx.fillRect(cx + 16, trainY + 64, 18, 10);
    ctx.fillRect(cx + 94, trainY + 64, 18, 10);
  }

  // Twilight Cobblestone Platform
  ctx.fillStyle = '#1e1c30';
  ctx.fillRect(0, 272, 640, 88);
  ctx.fillStyle = '#383352';
  ctx.fillRect(0, 272, 640, 8);
  for (let px = 0; px < 640; px += 28) {
    ctx.fillStyle = '#292640';
    ctx.fillRect(px + 2, 284, 22, 10);
    ctx.fillRect(px + 12, 298, 22, 10);
  }

  // Wrought-Iron Street Lanterns casting golden pools of light
  for (const lx of [360, 540]) {
    ctx.fillStyle = 'rgba(255, 195, 85, 0.16)';
    ctx.fillRect(lx - 34, 268, 74, 24);
    ctx.fillStyle = '#181c2b';
    ctx.fillRect(lx, 195, 6, 78);
    ctx.fillRect(lx - 6, 195, 18, 4);
    ctx.fillStyle = 'rgba(255, 200, 90, 0.25)';
    ctx.fillRect(lx - 26, 172, 58, 58);
    ctx.fillStyle = '#ffdf85';
    ctx.fillRect(lx - 5, 182, 16, 14);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(lx - 1, 185, 8, 8);
  }

  // Wooden Station Bench
  ctx.fillStyle = '#52341e';
  ctx.fillRect(425, 252, 62, 20);
  ctx.fillStyle = '#7a4e2d';
  ctx.fillRect(425, 254, 62, 6);

  // Raynio & Mallow on the Twilight Platform
  drawRaynioSprite(ctx, 385, 240, 'knight', 'right', false, false, tick, 0);
  drawMallowCompanion(ctx, 445, 232, tick, false);

  // Bioluminescent Fireflies & Drifting Starlight Motes
  for (let p = 0; p < 24; p++) {
    const fx = (((p * 73 + Math.floor(tick * 0.4)) % 640) + 640) % 640;
    const fy = (((p * 47 + Math.floor(Math.sin(tick * 0.04 + p) * 14)) % 340) + 340) % 340;
    ctx.fillStyle = p % 3 === 0 ? '#6be6ff' : p % 2 === 0 ? '#ffdf85' : '#ff9eb5';
    ctx.fillRect(fx, fy, 3, 3);
  }

  ctx.restore();
}

// ============================================================================
// 2. TWILIGHT-NIGHT TREES, LANTERNS, DOORS & PROPS (FAULTBOX & MACHI STYLE)
// ============================================================================
function drawTwilightTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  variant: 'night_teal' | 'dusk_autumn' | 'pine' | 'snow_pine',
  tick = 0
): void {
  ctx.save();
  // Soft night ground shadow
  ctx.fillStyle = 'rgba(6, 8, 18, 0.45)';
  ctx.fillRect(x + 4, y + 40, 40, 12);

  // Tree trunk with dark bark shading
  ctx.fillStyle = '#362218';
  ctx.fillRect(x + 18, y + 26, 12, 20);
  ctx.fillStyle = '#523424';
  ctx.fillRect(x + 20, y + 26, 5, 18);

  if (variant === 'pine' || variant === 'snow_pine') {
    // Layered dark indigo-teal evergreen pine (inspired by Faultbox & winter night)
    ctx.fillStyle = '#102230';
    ctx.fillRect(x + 2, y + 22, 44, 13);
    ctx.fillRect(x + 6, y + 12, 36, 12);
    ctx.fillRect(x + 12, y + 2, 24, 12);
    ctx.fillStyle = variant === 'snow_pine' ? '#365475' : '#1b3b4b';
    ctx.fillRect(x + 6, y + 20, 36, 8);
    ctx.fillRect(x + 10, y + 10, 28, 8);
    ctx.fillRect(x + 14, y + 2, 20, 6);
    // Moonlit snow or cyan leaf tips
    ctx.fillStyle = variant === 'snow_pine' ? '#9bb5d6' : '#2e6370';
    ctx.fillRect(x + 14, y + 2, 16, 3);
    ctx.fillRect(x + 10, y + 10, 10, 3);
    ctx.fillRect(x + 26, y + 20, 12, 3);
  } else {
    // Lush layered pixel canopy (Faultbox deep night-teal or glowing dusk-amber)
    const shadow = variant === 'dusk_autumn' ? '#4a1e2b' : '#0f2433';
    const mid = variant === 'dusk_autumn' ? '#85353f' : '#1b3f4f';
    const highlight = variant === 'dusk_autumn' ? '#c96249' : '#2b646e';
    const rim = variant === 'dusk_autumn' ? '#f5a25d' : '#438f8c';

    ctx.fillStyle = shadow;
    ctx.fillRect(x + 2, y + 8, 44, 28);
    ctx.fillRect(x + 6, y + 3, 36, 32);
    ctx.fillStyle = mid;
    ctx.fillRect(x + 5, y + 6, 38, 22);
    ctx.fillStyle = highlight;
    ctx.fillRect(x + 8, y + 5, 30, 14);
    ctx.fillStyle = rim;
    ctx.fillRect(x + 12, y + 3, 20, 6);
    // Tiny glowing firefly or berry cluster in canopy
    if ((x + y) % 3 === 0) {
      const glow = Math.floor(tick / 16) % 2 === 0;
      ctx.fillStyle = glow ? '#ffdf85' : '#6be6ff';
      ctx.fillRect(x + 14, y + 14, 3, 3);
      ctx.fillRect(x + 28, y + 19, 3, 3);
    }
  }
  ctx.restore();
}

function drawStreetLantern(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  tick: number
): void {
  ctx.save();
  const flicker = Math.sin(tick * 0.08 + x) * 2;
  // Warm golden light pool on the ground around the lamppost
  ctx.fillStyle = 'rgba(255, 198, 90, 0.14)';
  ctx.fillRect(x - 28, y + 22, 62, 24);
  ctx.fillStyle = 'rgba(255, 215, 120, 0.22)';
  ctx.fillRect(x - 16, y + 26, 38, 16);

  // Wrought-iron post
  ctx.fillStyle = '#141826';
  ctx.fillRect(x, y - 24, 5, 58);
  ctx.fillRect(x - 3, y + 28, 11, 6);
  ctx.fillRect(x - 5, y - 24, 15, 3);

  // Glowing lantern halo
  ctx.fillStyle = 'rgba(255, 205, 95, 0.22)';
  ctx.fillRect(x - 18 - flicker * 0.5, y - 42, 42 + flicker, 36);
  // Lantern glass housing
  ctx.fillStyle = '#ffcf5c';
  ctx.fillRect(x - 4, y - 34, 13, 12);
  ctx.fillStyle = '#fff7cc';
  ctx.fillRect(x - 1, y - 31, 7, 7);
  ctx.fillStyle = '#141826';
  ctx.fillRect(x - 5, y - 36, 15, 3);
  ctx.restore();
}

function drawCrateAndBarrel(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  // Shadow
  ctx.fillStyle = 'rgba(6, 8, 18, 0.4)';
  ctx.fillRect(x - 2, y + 14, 42, 6);
  // Wooden Crate
  ctx.fillStyle = '#4a2c18';
  ctx.fillRect(x, y, 18, 18);
  ctx.fillStyle = '#754829';
  ctx.fillRect(x + 2, y + 2, 14, 14);
  ctx.fillStyle = '#361f10';
  ctx.fillRect(x + 2, y + 8, 14, 2);
  // Wooden Barrel
  ctx.fillStyle = '#3d2414';
  ctx.fillRect(x + 20, y + 2, 16, 16);
  ctx.fillStyle = '#633c22';
  ctx.fillRect(x + 22, y + 3, 12, 14);
  ctx.fillStyle = '#3a4359';
  ctx.fillRect(x + 20, y + 5, 16, 2);
  ctx.fillRect(x + 20, y + 13, 16, 2);
}

// Renders an unmistakable, glowing Door or Portal for every interior/exterior entrance & exit
function drawVisibleDoorway(
  ctx: CanvasRenderingContext2D,
  item: InteractableObject,
  isInteriorExit: boolean,
  isLockedByRoots: boolean,
  tick: number
): void {
  ctx.save();
  const pulse = Math.floor(Math.sin(tick * 0.12) * 2.5);

  if (isInteriorExit) {
    const dx = item.x;
    const dy = item.y;
    const dw = item.w;
    const dh = item.h;

    // Warm golden moonlight/lantern glow spilling through the exit doorway
    ctx.fillStyle = 'rgba(245, 185, 66, 0.24)';
    ctx.fillRect(dx - 16, dy - 20, dw + 32, dh + 24);

    // Ornate Crimson & Gold Welcome Mat in front of the exit door
    ctx.fillStyle = '#6e1d2f';
    ctx.fillRect(dx + 6, dy - 14, dw - 12, 16);
    ctx.strokeStyle = '#f5b942';
    ctx.strokeRect(dx + 6, dy - 14, dw - 12, 16);

    // Heavy Timber Door Frame & Threshold
    ctx.fillStyle = '#2b1810';
    ctx.fillRect(dx, dy, dw, dh);
    ctx.fillStyle = '#5c3620';
    ctx.fillRect(dx + 4, dy + 4, dw - 8, dh - 8);
    ctx.fillStyle = '#754629';
    ctx.fillRect(dx + 10, dy + 8, dw / 2 - 14, dh - 14);
    ctx.fillRect(dx + dw / 2 + 4, dy + 8, dw / 2 - 14, dh - 14);
    // Golden door handles
    ctx.fillStyle = '#f5b942';
    ctx.fillRect(dx + dw / 2 - 6, dy + 20, 4, 4);
    ctx.fillRect(dx + dw / 2 + 2, dy + 20, 4, 4);

    // Clean Fantasy RPG "EXIT ▼" badge
    ctx.fillStyle = 'rgba(14, 16, 30, 0.92)';
    ctx.fillRect(dx + dw / 2 - 34, dy - 30 + pulse, 68, 14);
    ctx.strokeStyle = '#f5b942';
    ctx.strokeRect(dx + dw / 2 - 34, dy - 30 + pulse, 68, 14);
    ctx.fillStyle = '#ffdf85';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('EXIT DOOR ▼', dx + dw / 2, dy - 20 + pulse);
  } else if (item.actionType === 'chapter_transition') {
    const gx = item.x;
    const gy = item.y;
    const gw = item.w;
    const gh = item.h;

    // Warm portal glow
    ctx.fillStyle = 'rgba(255, 205, 95, 0.18)';
    ctx.fillRect(gx - 12, gy - 8, gw + 24, gh + 16);

    // Stone & Timber Archway
    ctx.fillStyle = '#282d42';
    ctx.fillRect(gx, gy, gw, gh);
    ctx.fillStyle = '#472c1b';
    ctx.fillRect(gx + 6, gy + 8, gw - 12, gh - 8);

    // Warm Lit Doorway Inside Arch
    ctx.fillStyle = '#ffdf85';
    ctx.fillRect(gx + 14, gy + 16, gw - 28, gh - 16);
    ctx.fillStyle = '#85502e';
    ctx.fillRect(gx + 16, gy + 18, (gw - 32) / 2, gh - 20);
    ctx.fillRect(gx + gw / 2 + 2, gy + 18, (gw - 32) / 2 - 2, gh - 20);
    ctx.fillStyle = '#f5b942';
    ctx.fillRect(gx + gw / 2 - 6, gy + gh / 2 + 4, 4, 4);
    ctx.fillRect(gx + gw / 2 + 3, gy + gh / 2 + 4, 4, 4);

    // Twin Arch Lanterns
    ctx.fillStyle = '#ffdf85';
    ctx.fillRect(gx - 6, gy + 18, 10, 12);
    ctx.fillRect(gx + gw - 4, gy + 18, 10, 12);

    // Floating Fantasy Gate Badge
    ctx.fillStyle = 'rgba(14, 16, 30, 0.92)';
    ctx.fillRect(gx + gw / 2 - 36, gy - 18 + pulse, 72, 14);
    ctx.strokeStyle = '#38d996';
    ctx.strokeRect(gx + gw / 2 - 36, gy - 18 + pulse, 72, 14);
    ctx.fillStyle = '#75f5be';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NEXT AREA ➔', gx + gw / 2, gy - 8 + pulse);
  } else if (item.actionType === 'door' && !isLockedByRoots) {
    const cx = item.x + item.w / 2;
    const cy = item.y;
    ctx.fillStyle = 'rgba(14, 16, 30, 0.9)';
    ctx.fillRect(cx - 26, cy + 16 + pulse, 52, 13);
    ctx.strokeStyle = '#f5b942';
    ctx.strokeRect(cx - 26, cy + 16 + pulse, 52, 13);
    ctx.fillStyle = '#ffdf85';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('▲ ENTER', cx, cy + 25 + pulse);
  }

  ctx.restore();
}

// ============================================================================
// 3. ULTRA-DETAILED INTERIOR RENDERER (INSPIRED BY MACHI BAKERY DIORAMA!)
// ============================================================================
function renderDetailedInterior(
  ctx: CanvasRenderingContext2D,
  mapId: MapId,
  map: MapDefinition,
  saveState: SaveState,
  tick: number
): void {
  const W = map.width;
  const H = map.height;

  // Outer void background (dark night blue-violet)
  ctx.fillStyle = '#090b16';
  ctx.fillRect(0, 0, W, H);

  // 1. Exterior Timber Wall Frame & Corner Pillars (like Machi Bakery cutaway frame)
  ctx.fillStyle = '#261710';
  ctx.fillRect(16, 12, W - 32, H - 24);
  ctx.fillStyle = '#42281b';
  ctx.fillRect(22, 18, W - 44, H - 36);

  // 2. Back Wall (Top 74px) with Wainscoting, Wallpaper & Timber Beams
  const wallColor =
    mapId === 'observatory'
      ? '#1b2240'
      : mapId === 'arcade'
      ? '#2b1e3d'
      : mapId === 'library'
      ? '#3d2722'
      : mapId === 'flower_shop'
      ? '#213b38'
      : '#523628';
  ctx.fillStyle = wallColor;
  ctx.fillRect(28, 22, W - 56, 62);

  // Lower wood wainscoting on the back wall
  ctx.fillStyle = '#331e14';
  ctx.fillRect(28, 62, W - 56, 22);
  ctx.fillStyle = '#6e472b';
  ctx.fillRect(28, 60, W - 56, 3);

  // Vertical timber wall studs along back wall
  ctx.fillStyle = '#2b1911';
  for (let sx = 28; sx < W - 28; sx += 110) {
    ctx.fillRect(sx, 22, 8, 62);
  }

  // 3. Hardwood Plank Floor with Rich Wood Grain & Alternating Plank Seams
  const floorBase =
    mapId === 'observatory'
      ? '#1f263d'
      : mapId === 'arcade'
      ? '#241b35'
      : '#5e3c24';
  const floorAlt =
    mapId === 'observatory'
      ? '#28314f'
      : mapId === 'arcade'
      ? '#2f2445'
      : '#6e472c';
  const floorLine =
    mapId === 'observatory'
      ? '#141929'
      : mapId === 'arcade'
      ? '#191226'
      : '#422918';

  ctx.fillStyle = floorBase;
  ctx.fillRect(28, 84, W - 56, H - 106);

  for (let py = 84; py < H - 24; py += 16) {
    ctx.fillStyle = (py / 16) % 2 === 0 ? floorBase : floorAlt;
    ctx.fillRect(28, py, W - 56, 15);
    ctx.fillStyle = floorLine;
    ctx.fillRect(28, py + 15, W - 56, 1);
    // Plank vertical joints
    for (let px = 48 + ((py * 3) % 60); px < W - 40; px += 76) {
      ctx.fillRect(px, py, 2, 15);
    }
  }

  // 4. Starry Night Windows on Back Wall + Diagonal Shafts of Moonlight/Lamplight!
  const windowPositions =
    W > 680 ? [120, 330, 540] : [115, 445];
  for (const wx of windowPositions) {
    // Window timber frame
    ctx.fillStyle = '#24140e';
    ctx.fillRect(wx - 3, 25, 66, 36);
    // Starry indigo night sky outside the window
    ctx.fillStyle = '#0e1329';
    ctx.fillRect(wx, 28, 60, 30);
    // Twinkling stars visible through the panes
    ctx.fillStyle = '#ffdf85';
    ctx.fillRect(wx + 10, 34, 2, 2);
    ctx.fillRect(wx + 42, 38, 3, 3);
    ctx.fillStyle = '#6be6ff';
    ctx.fillRect(wx + 24, 46, 2, 2);
    // Window muntins (crossbars)
    ctx.fillStyle = '#472b1c';
    ctx.fillRect(wx + 29, 28, 3, 30);
    ctx.fillRect(wx, 42, 60, 3);
    // Warm golden sill glow
    ctx.fillStyle = '#ffcf5c';
    ctx.fillRect(wx - 2, 58, 64, 3);

    // Diagonal light beam slanting across the hardwood floor (just like Machi Bakery reference!)
    ctx.fillStyle = 'rgba(255, 215, 130, 0.09)';
    for (let step = 0; step < 6; step++) {
      ctx.fillRect(wx + step * 8, 84 + step * 18, 64 + step * 4, 18);
    }
  }

  // 5. Framed Pixel Paintings, Wall Shelves & Hanging Potted Plants on Back Wall
  const drawWallFrame = (fx: number, fy: number, artColor: string) => {
    ctx.fillStyle = '#2b1911';
    ctx.fillRect(fx, fy, 28, 22);
    ctx.fillStyle = '#d99b38';
    ctx.fillRect(fx + 2, fy + 2, 24, 18);
    ctx.fillStyle = artColor;
    ctx.fillRect(fx + 4, fy + 4, 20, 14);
    ctx.fillStyle = '#ffdf85';
    ctx.fillRect(fx + 10, fy + 8, 6, 4);
  };
  drawWallFrame(60, 30, '#243b59');
  drawWallFrame(W - 92, 30, '#59283b');

  // 6. Ornate Woven Center Carpet & Entrance Runner
  const rugX = 130;
  const rugY = 128;
  const rugW = W - 260;
  const rugH = H - 220;

  const rugMain =
    mapId === 'observatory'
      ? '#26335e'
      : mapId === 'flower_shop'
      ? '#24524a'
      : mapId === 'library'
      ? '#5e2233'
      : '#752938';
  const rugBorder = '#f5b942';

  // Carpet runner leading to the bottom EXIT door
  ctx.fillStyle = rugMain;
  ctx.fillRect(W / 2 - 36, rugY + rugH, 72, H - (rugY + rugH) - 28);
  ctx.strokeStyle = rugBorder;
  ctx.strokeRect(W / 2 - 34, rugY + rugH, 68, H - (rugY + rugH) - 30);

  // Main center woven rug
  ctx.fillStyle = 'rgba(10, 8, 16, 0.3)';
  ctx.fillRect(rugX + 4, rugY + 4, rugW, rugH);
  ctx.fillStyle = rugMain;
  ctx.fillRect(rugX, rugY, rugW, rugH);
  ctx.strokeStyle = rugBorder;
  ctx.strokeRect(rugX + 4, rugY + 4, rugW - 8, rugH - 8);
  ctx.strokeStyle = '#ffdf85';
  ctx.strokeRect(rugX + 10, rugY + 10, rugW - 20, rugH - 20);
  // Rug fringes on left & right edges
  ctx.fillStyle = '#e8d0a3';
  for (let fy = rugY + 4; fy < rugY + rugH - 4; fy += 6) {
    ctx.fillRect(rugX - 4, fy, 4, 3);
    ctx.fillRect(rugX + rugW, fy, 4, 3);
  }

  // 7. Potted Monstera / Fern Plants in Corners (like Machi Bakery!)
  const drawPottedPlant = (px: number, py: number) => {
    // Terracotta pot
    ctx.fillStyle = '#9e472b';
    ctx.fillRect(px + 6, py + 16, 18, 14);
    ctx.fillStyle = '#bd5b3a';
    ctx.fillRect(px + 4, py + 13, 22, 5);
    // Lush dark & bright green leaves
    ctx.fillStyle = '#1b4738';
    ctx.fillRect(px + 2, py + 2, 26, 13);
    ctx.fillStyle = '#2d7554';
    ctx.fillRect(px + 5, py - 2, 20, 12);
    ctx.fillStyle = '#4eb87a';
    ctx.fillRect(px + 8, py, 6, 5);
    ctx.fillRect(px + 17, py + 3, 6, 5);
  };
  drawPottedPlant(40, 90);
  drawPottedPlant(W - 72, 90);
  drawPottedPlant(40, H - 72);
  drawPottedPlant(W - 72, H - 72);

  // 8. Room-Specific Detailed Furnishings & Props
  if (mapId === 'town_hall') {
    // Velvet Curtain on top-left (hiding Mayor Cat's Desk Bell!)
    ctx.fillStyle = '#751b2d';
    ctx.fillRect(72, 24, 52, 62);
    ctx.fillStyle = '#9e2840';
    for (let cx = 76; cx < 120; cx += 10) {
      ctx.fillRect(cx, 26, 6, 58);
    }
    ctx.fillStyle = '#f5b942';
    ctx.fillRect(70, 22, 56, 4);

    // Grandfather Clock on top-right
    ctx.fillStyle = '#3b2214';
    ctx.fillRect(515, 26, 32, 60);
    ctx.fillStyle = '#ffdf85';
    ctx.fillRect(522, 32, 18, 18);
    ctx.fillStyle = '#181a26';
    ctx.fillRect(530, 35, 2, 7);
    ctx.fillRect(530, 40, 5, 2);
    ctx.fillStyle = '#f5b942';
    ctx.fillRect(528, 56, 6, 16);
  } else if (mapId === 'bakery') {
    // Glowing Brick Hearth Oven on the left with crackling fire!
    ctx.fillStyle = '#6e3226';
    ctx.fillRect(56, 178, 112, 74);
    ctx.fillStyle = '#8c4335';
    for (let bx = 62; bx < 160; bx += 22) {
      ctx.fillRect(bx, 184, 18, 10);
      ctx.fillRect(bx + 6, 198, 18, 10);
    }
    // Glowing oven mouth
    ctx.fillStyle = '#1f1210';
    ctx.fillRect(82, 212, 60, 34);
    ctx.fillStyle = Math.floor(tick / 8) % 2 === 0 ? '#ff7b29' : '#ff9e3b';
    ctx.fillRect(90, 220, 44, 22);
    ctx.fillStyle = '#fff099';
    ctx.fillRect(100, 228, 24, 12);
    // Warm hearth glow on the bakery floor
    ctx.fillStyle = 'rgba(255, 150, 60, 0.18)';
    ctx.fillRect(60, 250, 104, 34);

    // Flour sacks & bread baskets near back wall
    ctx.fillStyle = '#e8d8b8';
    ctx.fillRect(195, 66, 22, 20);
    ctx.fillRect(220, 68, 20, 18);
  } else if (mapId === 'sleepy_inn') {
    // Crackling Stone Fireplace on the left wall
    ctx.fillStyle = '#4a4e5e';
    ctx.fillRect(46, 130, 44, 72);
    ctx.fillStyle = '#ff7b29';
    ctx.fillRect(56, 165, 26, 30);
    ctx.fillStyle = '#ffdf85';
    ctx.fillRect(62, 175, 14, 18);
    ctx.fillStyle = 'rgba(255, 160, 65, 0.16)';
    ctx.fillRect(46, 200, 90, 45);
  } else if (mapId === 'flower_shop') {
    // Glowing Night-Bloom planter beds along left and right walls
    for (let fy = 115; fy < 265; fy += 32) {
      ctx.fillStyle = '#3b2416';
      ctx.fillRect(36, fy, 24, 24);
      ctx.fillRect(W - 60, fy, 24, 24);
      ctx.fillStyle = '#1f5242';
      ctx.fillRect(38, fy + 2, 20, 20);
      ctx.fillRect(W - 58, fy + 2, 20, 20);
      ctx.fillStyle = fy % 64 === 0 ? '#6be6ff' : '#ff7aa8';
      ctx.fillRect(44, fy + 6, 8, 8);
      ctx.fillRect(W - 52, fy + 6, 8, 8);
    }
  } else if (mapId === 'observatory') {
    // Starry Constellation Circle inlaid in the center of the Observatory floor
    ctx.strokeStyle = 'rgba(107, 230, 255, 0.35)';
    ctx.strokeRect(230, 160, 260, 170);
    ctx.strokeStyle = 'rgba(245, 185, 66, 0.45)';
    ctx.strokeRect(250, 175, 220, 140);
    // 4 Glowing Constellation Pillars around the Altar
    const lit = Boolean(saveState.flags['observatory_puzzle_solved']);
    for (const [px, py] of [
      [255, 185],
      [445, 185],
      [255, 290],
      [445, 290],
    ]) {
      ctx.fillStyle = '#384266';
      ctx.fillRect(px, py, 20, 28);
      ctx.fillStyle = lit ? '#6be6ff' : '#f5b942';
      ctx.fillRect(px + 4, py - 6, 12, 12);
      if (lit) {
        ctx.fillStyle = 'rgba(107, 230, 255, 0.25)';
        ctx.fillRect(px - 8, py - 16, 36, 32);
      }
    }
  }

  // 9. Warm Hanging Ceiling Pendant Lamps casting soft golden light pools
  for (const lx of [185, W - 185]) {
    ctx.fillStyle = 'rgba(255, 205, 100, 0.12)';
    ctx.fillRect(lx - 38, 120, 76, 65);
    ctx.fillStyle = '#1f1612';
    ctx.fillRect(lx - 1, 18, 3, 22);
    ctx.fillStyle = '#d99b38';
    ctx.fillRect(lx - 10, 38, 20, 6);
    ctx.fillStyle = '#fff2b3';
    ctx.fillRect(lx - 6, 44, 12, 6);
  }
}

export function drawRaynioSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  outfit: 'blue_shirt' | 'knight',
  facing: 'left' | 'right',
  isMoving: boolean,
  isJumping: boolean,
  tick: number,
  transformProgress = 0
): void {
  ctx.save();
  const px = 2;
  const bob = isMoving && !isJumping ? Math.floor(Math.sin(tick * 0.32) * 2) : 0;
  const legOffset = isMoving ? Math.floor(Math.sin(tick * 0.35) * 3) : 0;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(x + 4, y + 33, 18, 4);

  const drawPixel = (gx: number, gy: number, w: number, h: number, color: string) => {
    const rx = facing === 'left' ? 12 - gx - w : gx;
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x + rx * px), Math.floor(y + gy * px + bob), w * px, h * px);
  };

  if (outfit === 'knight') {
    const capeWave = isMoving || isJumping ? 1 : 0;
    drawPixel(1 - capeWave, 9, 3, 7, '#9e2b3b');
    drawPixel(2 - capeWave, 10, 3, 6, '#bd3749');
  }

  ctx.fillStyle = outfit === 'knight' ? '#4e586e' : '#283044';
  ctx.fillRect(Math.floor(x + 6), Math.floor(y + 28 + (isJumping ? -2 : legOffset)), 4, 6);
  ctx.fillRect(Math.floor(x + 14), Math.floor(y + 28 + (isJumping ? -1 : -legOffset)), 4, 6);

  if (outfit === 'knight') {
    drawPixel(3, 9, 6, 5, '#b8c7db');
    drawPixel(4, 10, 4, 4, '#dce6f2');
    drawPixel(2, 8, 2, 2, '#f0f5fa');
    drawPixel(8, 8, 2, 2, '#f0f5fa');
    drawPixel(5, 10, 2, 3, '#3b5dc9');
    drawPixel(5, 11, 2, 1, '#f5b942');
  } else {
    drawPixel(3, 9, 6, 5, '#3b7ce0');
    drawPixel(4, 9, 4, 1, '#f5eedc');
  }

  // Travel bag
  drawPixel(3, 9, 4, 4, '#7a4e2d');
  drawPixel(2, 12, 3, 3, '#96613b');
  drawPixel(3, 13, 1, 1, '#f5b942');

  // Light fair skin tone face
  drawPixel(3, 3, 6, 6, '#ffe4d4');
  drawPixel(3, 8, 6, 1, '#f2d3c2');

  // Eyes
  drawPixel(5, 5, 1, 2, '#181a26');
  drawPixel(8, 5, 1, 2, '#181a26');

  // Thick curly/messy black hair with fringe
  drawPixel(2, 1, 8, 3, '#14161f');
  drawPixel(3, 0, 6, 2, '#1f2230');
  drawPixel(2, 3, 2, 4, '#14161f');
  drawPixel(4, 3, 2, 2, '#14161f');
  drawPixel(7, 3, 2, 2, '#14161f');
  drawPixel(9, 2, 2, 3, '#14161f');

  if (transformProgress > 0) {
    for (let i = 0; i < 8; i++) {
      const angle = tick * 0.15 + (i * Math.PI) / 4;
      const sx = x + 12 + Math.cos(angle) * 18;
      const sy = y + 18 + Math.sin(angle) * 18;
      ctx.fillStyle = i % 2 === 0 ? '#f5b942' : '#6be6ff';
      ctx.fillRect(Math.floor(sx), Math.floor(sy), 4, 4);
    }
  }

  ctx.restore();
}

export function drawMallowCompanion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  tick: number,
  sleeping = false
): void {
  ctx.save();
  const floatY = sleeping ? 4 : Math.sin(tick * 0.09) * 4;
  const mx = Math.floor(x);
  const my = Math.floor(y + floatY);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(mx + 4, Math.floor(y + 24), 14, 3);

  ctx.fillStyle = '#7f8699';
  ctx.fillRect(mx + 3, my + 2, 16, 16);
  ctx.fillStyle = '#f7f9fc';
  ctx.fillRect(mx + 4, my + 3, 14, 14);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(mx + 6, my + 4, 10, 10);
  ctx.fillRect(mx + 4, my + 17, 3, 2);
  ctx.fillRect(mx + 9, my + 17, 4, 3);
  ctx.fillRect(mx + 15, my + 17, 3, 2);

  ctx.fillStyle = '#ff8da6';
  ctx.fillRect(mx + 14, my + 3, 3, 3);
  ctx.fillRect(mx + 5, my + 10, 2, 2);
  ctx.fillRect(mx + 15, my + 10, 2, 2);

  ctx.fillStyle = '#1f2233';
  if (sleeping) {
    ctx.fillRect(mx + 7, my + 9, 3, 1);
    ctx.fillRect(mx + 12, my + 9, 3, 1);
    if (Math.floor(tick / 25) % 2 === 0) {
      ctx.fillStyle = '#6be6ff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('zZ', mx + 16, my - 2);
    }
  } else {
    ctx.fillRect(mx + 8, my + 8, 2, 3);
    ctx.fillRect(mx + 13, my + 8, 2, 3);
  }
  ctx.restore();
}

export function drawNpcSprite(
  ctx: CanvasRenderingContext2D,
  character: CharacterId,
  x: number,
  y: number,
  tick: number,
  flags: Record<string, boolean>
): void {
  ctx.save();
  const bx = Math.floor(x + 12);
  const by = Math.floor(y + 10 + Math.sin(tick * 0.06 + x) * 1.5);

  if (character === 'mallow') {
    drawMallowCompanion(ctx, bx, by, tick, !flags['talked_mallow_station'] && x === 520);
    ctx.restore();
    return;
  }

  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(bx + 2, by + 28, 20, 4);

  if (character === 'mayor_cat') {
    ctx.fillStyle = '#1e1b29';
    ctx.fillRect(bx + 5, by - 4, 14, 6);
    ctx.fillRect(bx + 3, by + 1, 18, 2);
    ctx.fillStyle = '#f5b942';
    ctx.fillRect(bx + 5, by, 14, 1);
    ctx.fillStyle = '#e87e2e';
    ctx.fillRect(bx + 3, by + 2, 4, 4);
    ctx.fillRect(bx + 17, by + 2, 4, 4);
    ctx.fillRect(bx + 4, by + 3, 16, 11);
    ctx.fillStyle = '#fff1d6';
    ctx.fillRect(bx + 7, by + 9, 10, 5);
    ctx.fillStyle = '#181a26';
    ctx.fillRect(bx + 7, by + 6, 2, 2);
    ctx.fillRect(bx + 15, by + 6, 2, 2);
    ctx.fillStyle = '#6e1d35';
    ctx.fillRect(bx + 4, by + 14, 16, 14);
    ctx.fillStyle = '#f5b942';
    ctx.fillRect(bx + 11, by + 15, 2, 9);
  } else if (character === 'keeper_hooded' || character === 'keeper_unhooded') {
    const unhooded = flags['observatory_puzzle_solved'] || character === 'keeper_unhooded';
    ctx.fillStyle = '#1b1f29';
    ctx.fillRect(bx + 3, by + 12, 18, 17);
    ctx.fillStyle = '#252b38';
    ctx.fillRect(bx + 5, by + 13, 14, 15);
    ctx.fillStyle = '#6be6ff';
    ctx.fillRect(bx + 11, by + 15, 3, 3);
    if (!unhooded) {
      ctx.fillStyle = '#232836';
      ctx.fillRect(bx + 4, by + 1, 16, 12);
      ctx.fillStyle = '#0c0e14';
      ctx.fillRect(bx + 6, by + 4, 12, 9);
      ctx.fillStyle = '#33f2ff';
      ctx.fillRect(bx + 8, by + 7, 2, 2);
      ctx.fillRect(bx + 14, by + 7, 2, 2);
    } else {
      ctx.fillStyle = '#ebd7cc';
      ctx.fillRect(bx + 5, by + 3, 14, 10);
      ctx.fillStyle = '#a66868';
      ctx.fillRect(bx + 7, by + 5, 2, 6);
      ctx.fillStyle = '#12151f';
      ctx.fillRect(bx + 4, by, 16, 5);
      ctx.fillStyle = '#33f2ff';
      ctx.fillRect(bx + 8, by + 7, 2, 2);
      ctx.fillRect(bx + 14, by + 7, 2, 2);
    }
  } else if (character === 'allan') {
    ctx.fillStyle = '#2b3554';
    ctx.fillRect(bx + 4, by + 13, 16, 15);
    ctx.fillStyle = '#f5eedc';
    ctx.fillRect(bx + 9, by + 13, 6, 12);
    ctx.fillStyle = '#f7dccb';
    ctx.fillRect(bx + 5, by + 3, 14, 10);
    ctx.fillStyle = '#171922';
    ctx.fillRect(bx + 4, by, 16, 5);
    ctx.fillRect(bx + 4, by + 3, 3, 5);
    ctx.fillRect(bx + 17, by + 3, 3, 5);
    ctx.fillStyle = '#181a26';
    ctx.fillRect(bx + 8, by + 7, 2, 2);
    ctx.fillRect(bx + 14, by + 7, 2, 2);
  } else if (character === 'postie') {
    ctx.fillStyle = '#2b5eb8';
    ctx.fillRect(bx + 4, by + 3, 16, 22);
    ctx.fillStyle = '#3973d9';
    ctx.fillRect(bx + 6, by + 5, 12, 18);
    ctx.fillStyle = '#f5b942';
    ctx.fillRect(bx + 10, by + 3, 4, 2);
    ctx.fillStyle = '#122240';
    ctx.fillRect(bx + 7, by + 12, 10, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx + 7, by + 8, 2, 2);
    ctx.fillRect(bx + 15, by + 8, 2, 2);
  } else if (character === 'pigeon') {
    ctx.fillStyle = '#7b8499';
    ctx.fillRect(bx + 6, by + 14, 12, 10);
    ctx.fillStyle = '#565e73';
    ctx.fillRect(bx + 8, by + 10, 8, 6);
    ctx.fillStyle = '#f5b942';
    ctx.fillRect(bx + 15, by + 12, 5, 4);
  } else if (character === 'bread') {
    ctx.fillStyle = '#c9833e';
    ctx.fillRect(bx + 4, by + 14, 16, 11);
    ctx.fillStyle = '#e6a35c';
    ctx.fillRect(bx + 6, by + 16, 12, 7);
    ctx.fillStyle = '#181a26';
    ctx.fillRect(bx + 8, by + 18, 2, 2);
    ctx.fillRect(bx + 14, by + 18, 2, 2);
  } else {
    const coatColors: Record<string, string> = {
      rosa: '#2e6b54',
      bram: '#f5eedc',
      tock: '#8c5e2b',
      librarian: '#43386b',
      innkeeper: '#7a3b32',
    };
    ctx.fillStyle = coatColors[character] || '#4a5568';
    ctx.fillRect(bx + 4, by + 13, 16, 15);
    ctx.fillStyle = '#f2d6c4';
    ctx.fillRect(bx + 5, by + 3, 14, 10);
    ctx.fillStyle = character === 'bram' ? '#ffffff' : '#4a3228';
    ctx.fillRect(bx + 4, by, 16, 5);
    ctx.fillStyle = '#181a26';
    ctx.fillRect(bx + 8, by + 7, 2, 2);
    ctx.fillRect(bx + 14, by + 7, 2, 2);
  }

  ctx.restore();
}

export function drawCollectibleCrystal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: 'fragment' | 'star' | 'coin',
  tick: number
): void {
  ctx.save();
  const hover = Math.sin(tick * 0.1 + x) * 3;
  const cx = Math.floor(x);
  const cy = Math.floor(y + hover);

  if (type === 'fragment') {
    ctx.fillStyle = 'rgba(107, 230, 255, 0.25)';
    ctx.fillRect(cx + 8, cy + 8, 34, 34);
    ctx.fillStyle = '#f5b942';
    ctx.fillRect(cx + 16, cy + 12, 18, 26);
    ctx.fillStyle = '#6be6ff';
    ctx.fillRect(cx + 19, cy + 15, 12, 20);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx + 22, cy + 18, 6, 10);
  } else if (type === 'star') {
    ctx.fillStyle = 'rgba(245, 185, 66, 0.28)';
    ctx.fillRect(cx + 6, cy + 6, 30, 30);
    ctx.fillStyle = '#f5b942';
    ctx.fillRect(cx + 14, cy + 10, 14, 22);
    ctx.fillRect(cx + 10, cy + 14, 22, 14);
    ctx.fillStyle = '#fff5cc';
    ctx.fillRect(cx + 17, cy + 17, 8, 8);
  } else {
    ctx.fillStyle = '#f5b942';
    ctx.fillRect(cx - 5, cy - 5, 12, 12);
    ctx.fillStyle = '#fff3b8';
    ctx.fillRect(cx - 3, cy - 3, 6, 6);
  }

  ctx.restore();
}

export function drawOvergrownRoots(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  shrinkProgress = 0
): void {
  if (shrinkProgress >= 1) return;
  ctx.save();
  const scale = 1 - shrinkProgress;
  const rw = Math.floor(w * scale);
  const rh = Math.floor(h * scale);
  const rx = Math.floor(x + (w - rw) / 2);
  const ry = Math.floor(y + (h - rh) / 2);

  ctx.fillStyle = '#2d1929';
  ctx.fillRect(rx - 8, ry - 6, rw + 16, rh + 10);
  ctx.fillStyle = '#4c2b47';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(rx - 6 + i * 12, ry - 10 + (i % 2) * 4, 8, rh + 14);
  }
  ctx.fillStyle = '#ff5277';
  ctx.fillRect(rx + 4, ry + 6, 5, 5);
  ctx.fillRect(rx + rw - 10, ry + 10, 5, 5);
  ctx.fillRect(rx + Math.floor(rw / 2), ry + 2, 5, 5);
  ctx.restore();
}

// ============================================================================
// 4. MAIN WORLD MAP RENDERER (ALL MAPS IN SENJA-MALAM / TWILIGHT-NIGHT!)
// ============================================================================
export function renderWorldMap(
  ctx: CanvasRenderingContext2D,
  mapId: MapId,
  camX: number,
  camY: number,
  saveState: SaveState,
  tick: number,
  activeInteractableId: string | null,
  rootUnlockAnim: { buildingId: string | null; progress: number },
  transformProgress: number,
  playerFacing: 'left' | 'right',
  playerMoving: boolean,
  playerJumping: boolean
): void {
  const map = MAPS[mapId];
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  const isOutdoorSideScroll =
    mapId === 'station' ||
    mapId === 'garden' ||
    mapId === 'mountain' ||
    mapId === 'secret_garden';

  // 1. Sky / Base Ground Layer (ALL TWILIGHT-NIGHT / SENJA-MALAM)
  if (mapId === 'station') {
    const grad = ctx.createLinearGradient(0, 0, 0, 360);
    grad.addColorStop(0, '#0c0e22');
    grad.addColorStop(0.38, '#231b42');
    grad.addColorStop(0.72, '#6e2d4e');
    grad.addColorStop(0.92, '#c95b48');
    grad.addColorStop(1, '#f09c54');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 360);
  } else if (mapId === 'garden') {
    const bloomLevel = Math.min(
      1,
      saveState.coins.length / 8 + (saveState.flags['fragment_1'] ? 0.5 : 0)
    );
    const grad = ctx.createLinearGradient(0, 0, 0, 360);
    grad.addColorStop(0, '#0a0f24');
    grad.addColorStop(0.45, bloomLevel > 0.5 ? '#1c254a' : '#141b36');
    grad.addColorStop(0.82, bloomLevel > 0.5 ? '#3b2d54' : '#26213d');
    grad.addColorStop(1, bloomLevel > 0.5 ? '#1e424a' : '#152e38');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 360);
  } else if (mapId === 'mountain' || mapId === 'secret_garden') {
    const grad = ctx.createLinearGradient(0, 0, 0, 360);
    grad.addColorStop(0, '#070917');
    grad.addColorStop(0.5, '#131b38');
    grad.addColorStop(0.85, '#29254d');
    grad.addColorStop(1, '#4a2e56');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 360);
  } else if (mapId === 'winter') {
    // Deep Moonlit Winter Night Ground (NOT daytime white!)
    ctx.fillStyle = '#18243d';
    ctx.fillRect(0, 0, 640, 360);
  } else if (mapId === 'town') {
    // Deep Twilight-Night Emerald/Teal Turf (Directly inspired by Faultbox night forest!)
    ctx.fillStyle = '#132433';
    ctx.fillRect(0, 0, 640, 360);
  } else {
    ctx.fillStyle = '#090b16';
    ctx.fillRect(0, 0, 640, 360);
  }

  // Starfield & Crescent Moon for side-scrolling dusk/night maps
  if (isOutdoorSideScroll) {
    for (let i = 0; i < 50; i++) {
      const sx = (((i * 97 - Math.floor(camX * 0.15)) % 640) + 640) % 640;
      const sy = (i * 41) % 185;
      const phase = (Math.floor(tick / 15) + i) % 3;
      if (i % 8 === 0) {
        ctx.fillStyle = '#ffdf85';
        ctx.fillRect(sx, sy - 2, 2, 6);
        ctx.fillRect(sx - 2, sy, 6, 2);
      } else {
        ctx.fillStyle = i % 4 === 0 ? '#6be6ff' : '#ffffff';
        ctx.fillRect(sx, sy, phase === 0 ? 2 : 1, phase === 0 ? 2 : 1);
      }
    }
    // Glowing Crescent Moon in upper sky
    const moonX = 520 - Math.floor(camX * 0.04);
    ctx.fillStyle = 'rgba(255, 230, 150, 0.14)';
    ctx.fillRect(moonX - 10, 26, 44, 44);
    ctx.fillStyle = '#fff3bd';
    ctx.fillRect(moonX, 36, 22, 22);
    ctx.fillStyle = '#141833';
    ctx.fillRect(moonX + 8, 34, 18, 18);
  }

  ctx.translate(-Math.floor(camX), -Math.floor(camY));

  // 2. Side-Scrolling Twilight Backgrounds & Details
  if (mapId === 'station') {
    for (let tx = 0; tx < 1280; tx += 44) {
      drawTwilightTree(ctx, tx, 245, tx % 88 === 0 ? 'pine' : 'dusk_autumn', tick);
    }
    // Railway tracks
    ctx.fillStyle = '#1e192b';
    ctx.fillRect(0, 294, 1280, 8);
    // Vintage Train on left side of platform
    ctx.fillStyle = '#1c263b';
    ctx.fillRect(20, 175, 290, 120);
    ctx.fillStyle = '#293857';
    ctx.fillRect(30, 185, 270, 95);
    ctx.fillStyle = '#732435';
    ctx.fillRect(20, 246, 290, 12);
    ctx.fillStyle = '#f5b942';
    ctx.fillRect(20, 244, 290, 2);
    for (let wx = 45; wx < 260; wx += 55) {
      ctx.fillStyle = 'rgba(255, 215, 115, 0.18)';
      ctx.fillRect(wx - 4, 196, 44, 42);
      ctx.fillStyle = '#ffdf85';
      ctx.fillRect(wx, 200, 36, 34);
      ctx.fillStyle = '#fff7d6';
      ctx.fillRect(wx + 4, 204, 12, 26);
    }
    // Warm station lanterns
    for (let lx = 360; lx < 1150; lx += 220) {
      drawStreetLantern(ctx, lx, 266, tick);
    }
    // Wooden bench & Official Town Guide sign
    ctx.fillStyle = '#4a2e1b';
    ctx.fillRect(435, 235, 6, 65);
    ctx.fillStyle = '#c9a675';
    ctx.fillRect(410, 218, 58, 22);
    ctx.fillStyle = '#5c3820';
    ctx.fillRect(505, 278, 65, 22);
    // Wooden Letter Stand with glowing envelope
    ctx.fillStyle = '#5c3a24';
    ctx.fillRect(838, 262, 18, 38);
    ctx.fillStyle = '#855434';
    ctx.fillRect(832, 254, 30, 10);
    ctx.fillStyle = '#fff5d6';
    ctx.fillRect(836, 246, 22, 12);
    ctx.fillStyle = '#e04f5f';
    ctx.fillRect(845, 250, 4, 4);
  }

  if (mapId === 'garden') {
    // Distant twilight stream at bottom with reflected stars (like Faultbox!)
    ctx.fillStyle = '#0d1930';
    ctx.fillRect(0, 325, 2700, 35);
    for (let gx = 30; gx < 2650; gx += 88) {
      drawTwilightTree(
        ctx,
        gx,
        245,
        gx % 264 === 0 ? 'dusk_autumn' : gx % 176 === 0 ? 'pine' : 'night_teal',
        tick
      );
      if ( gx % 352 === 0) {
        drawStreetLantern(ctx, gx + 48, 266, tick);
      }
      if (saveState.coins.length > gx % 6) {
        ctx.fillStyle = gx % 176 === 0 ? '#ff7aa8' : '#6be6ff';
        ctx.fillRect(gx + 52, 290, 8, 8);
        ctx.fillStyle = '#fff5cc';
        ctx.fillRect(gx + 54, 292, 4, 4);
        ctx.fillStyle = '#2d6659';
        ctx.fillRect(gx + 54, 298, 4, 6);
      }
    }
  }

  if (mapId === 'mountain') {
    for (let mx = 140; mx < 2100; mx += 240) {
      drawTwilightTree(ctx, mx - 50, 236, 'snow_pine', tick);
      drawStreetLantern(ctx, mx + 10, 256, tick);
    }
    // Grand Observatory Dome at the summit
    ctx.fillStyle = '#222942';
    ctx.fillRect(2060, 110, 190, 180);
    ctx.fillStyle = '#38446b';
    ctx.fillRect(2080, 75, 150, 45);
    ctx.fillStyle = '#ffdf85';
    ctx.fillRect(2125, 135, 60, 40);
  }

  if (mapId === 'secret_garden') {
    // Starlit mirror pond along the bottom
    ctx.fillStyle = '#0e1b36';
    ctx.fillRect(0, 315, 900, 45);
    for (let fx = 36; fx < 860; fx += 44) {
      if (fx % 132 === 0) drawTwilightTree(ctx, fx - 20, 245, 'night_teal', tick);
      ctx.fillStyle = fx % 88 === 0 ? '#6be6ff' : '#ff8da6';
      ctx.fillRect(fx, 288, 8, 8);
      ctx.fillStyle = '#265c4b';
      ctx.fillRect(fx + 2, 296, 4, 6);
    }
    drawStreetLantern(ctx, 390, 266, tick);
    drawStreetLantern(ctx, 525, 266, tick);
    ctx.fillStyle = '#5c3a24';
    ctx.fillRect(425, 274, 80, 26);
  }

  // 3. Side-Scrolling Platforms (Twilight Stone, Moss & Starlit Clouds)
  if (map.platforms) {
    for (const p of map.platforms) {
      if (p.type === 'hazard') {
        // Starlit night river hazard (Faultbox style!)
        ctx.fillStyle = '#0f1e38';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = '#3882b8';
        for (let hx = p.x + 6; hx < p.x + p.w - 12; hx += 22) {
          ctx.fillRect(hx + ((tick >> 2) % 8), p.y + 4, 12, 2);
          // Reflected stars in the water
          ctx.fillStyle = '#ffdf85';
          ctx.fillRect(hx + 8, p.y + 11, 2, 2);
          ctx.fillStyle = '#3882b8';
        }
      } else if (p.type === 'moss') {
        ctx.fillStyle = '#291d2b';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = '#1b474d';
        ctx.fillRect(p.x, p.y, p.w, 9);
        ctx.fillStyle = '#327373';
        for (let mx = p.x + 8; mx < p.x + p.w - 12; mx += 24) {
          ctx.fillRect(mx, p.y, 12, 4);
        }
      } else if (p.type === 'wood') {
        ctx.fillStyle = '#472c1b';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = '#754a2e';
        ctx.fillRect(p.x, p.y, p.w, 6);
      } else if (p.type === 'cloud') {
        ctx.fillStyle = '#2d3359';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = '#6b7eb8';
        ctx.fillRect(p.x, p.y, p.w, 6);
      } else {
        ctx.fillStyle = '#28253b';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = '#454063';
        ctx.fillRect(p.x, p.y, p.w, 7);
      }
    }
  }

  // 4. Top-Down Environments: TWILIGHT TOWN, MOONLIT WINTER & DETAILED INTERIORS
  if (mapId === 'town') {
    // Rich Twilight-Night Grass Patches & Bioluminescent Blades (Faultbox palette!)
    ctx.fillStyle = '#132433';
    ctx.fillRect(0, 0, map.width, map.height);

    for (let gx = 56; gx < 1540; gx += 60) {
      for (let gy = 56; gy < 1160; gy += 60) {
        ctx.fillStyle = (gx + gy) % 120 === 0 ? '#193142' : '#0f1d2b';
        ctx.fillRect(gx, gy, 30, 18);
        // Teal & cyan night-grass blades
        ctx.fillStyle = '#285261';
        ctx.fillRect(gx + 6, gy + 4, 3, 6);
        ctx.fillRect(gx + 14, gy + 6, 3, 5);
        // Glowing twilight wildflowers (gold & cyan like Faultbox!)
        if ((gx * gy) % 180 === 0) {
          ctx.fillStyle = (gx + gy) % 240 === 0 ? '#ffdf85' : '#6be6ff';
          ctx.fillRect(gx + 22, gy + 12, 4, 4);
          ctx.fillStyle = '#1f474d';
          ctx.fillRect(gx + 23, gy + 16, 2, 3);
        }
      }
    }

    // Starlit Night River across the southern edge (Reflecting the starry sky like Faultbox!)
    ctx.fillStyle = '#0b1326';
    ctx.fillRect(48, 1082, 1504, 70);
    ctx.fillStyle = '#132242';
    ctx.fillRect(48, 1090, 1504, 54);
    for (let wx = 70; wx < 1510; wx += 55) {
      // Shimmering cyan water ripples
      ctx.fillStyle = '#3b82b8';
      ctx.fillRect(wx + ((tick >> 3) % 10), 1104 + (wx % 18), 16, 2);
      // Reflected stars floating in the dark water!
      ctx.fillStyle = wx % 110 === 0 ? '#ffdf85' : '#ffffff';
      ctx.fillRect(wx + 24, 1118 - (wx % 14), 2, 2);
      // Twilight reeds/cattails along river bank
      ctx.fillStyle = '#1b4047';
      ctx.fillRect(wx + 12, 1072, 3, 16);
      ctx.fillStyle = '#4a2c1d';
      ctx.fillRect(wx + 11, 1069, 5, 6);
    }

    // Lantern-Lit Wooden Bridges & Stepping Stones across the Starlit River
    for (const brX of [210, 760, 1100]) {
      ctx.fillStyle = '#3d2416';
      ctx.fillRect(brX, 1076, 76, 82);
      ctx.fillStyle = '#6e4427';
      for (let py = 1080; py < 1154; py += 10) {
        ctx.fillRect(brX + 4, py, 68, 7);
      }
      // Bridge lanterns
      ctx.fillStyle = '#ffdf85';
      ctx.fillRect(brX + 2, 1080, 6, 6);
      ctx.fillRect(brX + 68, 1080, 6, 6);
    }

    // Moonlit Rocky Cliff Terraces along northern edge
    ctx.fillStyle = '#23253b';
    ctx.fillRect(50, 50, 570, 32);
    ctx.fillRect(980, 50, 560, 32);
    ctx.fillStyle = '#353957';
    for (let cx = 60; cx < 590; cx += 24) {
      ctx.fillRect(cx, 54, 16, 24);
      ctx.fillRect(cx + 930, 54, 16, 24);
    }

    // Twilight Cobblestone & Slate Paths with warm lantern highlights
    const drawTwilightCobbleRoad = (rx: number, ry: number, rw: number, rh: number) => {
      ctx.fillStyle = '#1f1e30';
      ctx.fillRect(rx - 4, ry - 4, rw + 8, rh + 8);
      ctx.fillStyle = '#2d2b42';
      ctx.fillRect(rx, ry, rw, rh);
      // Individual cobblestone tiles
      for (let px = rx + 8; px < rx + rw - 16; px += 26) {
        for (let py = ry + 6; py < ry + rh - 10; py += 18) {
          ctx.fillStyle = (px + py) % 52 === 0 ? '#3d3a57' : '#35324d';
          ctx.fillRect(px + ((py % 12) - 4), py, 16, 10);
        }
      }
    };

    drawTwilightCobbleRoad(580, 390, 440, 360); // Central Town Square Plaza
    drawTwilightCobbleRoad(740, 240, 120, 620); // North-South Main Road
    drawTwilightCobbleRoad(180, 445, 1220, 85); // West-East Main Road
    drawTwilightCobbleRoad(180, 960, 1240, 80); // South Avenue
    drawTwilightCobbleRoad(215, 670, 60, 150);  // Path to Little Tailor
    drawTwilightCobbleRoad(1310, 670, 60, 150); // Path to Moonbean Café

    // Decorative Twilight Trees around Town Lawns
    const treeSpots: [number, number, 'night_teal' | 'dusk_autumn' | 'pine'][] = [
      [430, 150, 'pine'],
      [510, 210, 'dusk_autumn'],
      [1030, 160, 'pine'],
      [1110, 220, 'night_teal'],
      [420, 560, 'night_teal'],
      [1100, 560, 'dusk_autumn'],
      [90, 720, 'pine'],
      [1470, 720, 'pine'],
      [440, 360, 'night_teal'],
      [1110, 360, 'pine'],
    ];
    for (const [tx, ty, tv] of treeSpots) {
      drawTwilightTree(ctx, tx, ty, tv, tick);
    }

    // Wrought-Iron Street Lanterns illuminating Town Square & avenues
    const lanternSpots: [number, number][] = [
      [610, 415],
      [985, 415],
      [610, 710],
      [985, 710],
      [725, 290],
      [870, 290],
      [390, 440],
      [1180, 440],
      [390, 955],
      [690, 955],
      [965, 955],
      [1265, 955],
    ];
    for (const [lx, ly] of lanternSpots) {
      drawStreetLantern(ctx, lx, ly, tick);
    }

    // If Rosa's flower quest is completed, glowing Night-Blooms illuminate Town Square!
    if (saveState.flags['completed_rosa_quest']) {
      for (let fx = 600; fx < 1000; fx += 28) {
        ctx.fillStyle = 'rgba(107, 230, 255, 0.16)';
        ctx.fillRect(fx - 4, 398, 18, 18);
        ctx.fillRect(fx - 4, 726, 18, 18);
        ctx.fillStyle = fx % 56 === 0 ? '#6be6ff' : '#ff7aa8';
        ctx.fillRect(fx, 402, 10, 10);
        ctx.fillRect(fx, 730, 10, 10);
        ctx.fillStyle = '#fff5cc';
        ctx.fillRect(fx + 3, 405, 4, 4);
        ctx.fillRect(fx + 3, 733, 4, 4);
      }
    }
  } else if (mapId === 'winter') {
    // Deep Moonlit Winter Night Village
    ctx.fillStyle = '#152038';
    ctx.fillRect(0, 0, map.width, map.height);
    // Moonlit snow drifts
    for (let sx = 60; sx < 1020; sx += 90) {
      for (let sy = 70; sy < 680; sy += 85) {
        ctx.fillStyle = (sx + sy) % 180 === 0 ? '#1e2e4f' : '#24375c';
        ctx.fillRect(sx, sy, 48, 22);
      }
    }
    // Snowy footprints leading toward the Winter Cabin
    ctx.fillStyle = '#0e1629';
    for (let s = 0; s < 18; s++) {
      ctx.fillRect(160 + s * 32, 580 - s * 12, 8, 5);
      ctx.fillRect(172 + s * 32, 588 - s * 12, 8, 5);
    }
    // Snow-dusted night pines & warm lanterns
    for (let px = 80; px < 980; px += 150) {
      drawTwilightTree(ctx, px, 85, 'snow_pine', tick);
      drawTwilightTree(ctx, px, 635, 'snow_pine', tick);
    }
    drawStreetLantern(ctx, 225, 535, tick);
    drawStreetLantern(ctx, 455, 295, tick);
    drawStreetLantern(ctx, 845, 345, tick);
  } else if (map.mode === 'topdown') {
    // Render Ultra-Detailed Interior Diorama (Machi Bakery style!)
    renderDetailedInterior(ctx, mapId, map, saveState, tick);
  }

  // 5. Obstacles, Twilight Buildings, and Detailed Interior Furniture
  if (map.obstacles) {
    for (const obs of map.obstacles) {
      if (obs.renderType === 'building' || obs.renderType === 'cabin') {
        // Deep night drop shadow
        ctx.fillStyle = 'rgba(5, 7, 16, 0.55)';
        ctx.fillRect(obs.x - 6, obs.y + obs.h - 4, obs.w + 18, 16);

        // Chimney with gentle twilight smoke
        ctx.fillStyle = '#383047';
        ctx.fillRect(obs.x + obs.w - 48, obs.y - 14, 24, 26);
        ctx.fillStyle = '#241e30';
        ctx.fillRect(obs.x + obs.w - 50, obs.y - 16, 28, 5);
        const smokeY = ((tick >> 2) + obs.x) % 24;
        ctx.fillStyle = 'rgba(210, 200, 230, 0.22)';
        ctx.fillRect(obs.x + obs.w - 40, obs.y - 24 - smokeY, 10, 10);

        // Twilight-tinted Timber & Plaster Wall Facade
        ctx.fillStyle = obs.color || '#c9c2db';
        ctx.fillRect(obs.x, obs.y + 42, obs.w, obs.h - 42);
        // Subtle evening shadow across upper wall under roof eaves
        ctx.fillStyle = 'rgba(18, 16, 38, 0.28)';
        ctx.fillRect(obs.x, obs.y + 42, obs.w, 14);

        // Stone Foundation Trim along bottom of wall
        ctx.fillStyle = '#3d4159';
        ctx.fillRect(obs.x, obs.y + obs.h - 24, obs.w, 24);
        ctx.fillStyle = '#525875';
        for (let sx = obs.x + 6; sx < obs.x + obs.w - 12; sx += 20) {
          ctx.fillRect(sx, obs.y + obs.h - 18, 14, 10);
        }

        // Dark Timber Corner Pillars & Crossbeams
        ctx.fillStyle = '#3b2416';
        ctx.fillRect(obs.x, obs.y + 42, 10, obs.h - 42);
        ctx.fillRect(obs.x + obs.w - 10, obs.y + 42, 10, obs.h - 42);
        ctx.fillRect(obs.x, obs.y + obs.h - 26, obs.w, 4);

        // Shingled Pitched Roof in Rich Twilight Slate/Indigo/Plum
        ctx.fillStyle = obs.roofColor || '#2c3863';
        ctx.fillRect(obs.x - 8, obs.y, obs.w + 16, 52);
        ctx.fillStyle = 'rgba(8, 10, 24, 0.32)';
        for (let ry = obs.y + 10; ry < obs.y + 48; ry += 10) {
          ctx.fillRect(obs.x - 6, ry, obs.w + 12, 2);
        }
        // Roof ridge highlight
        ctx.fillStyle = 'rgba(180, 205, 255, 0.18)';
        ctx.fillRect(obs.x - 6, obs.y, obs.w + 12, 4);

        // Night-Ivy vine detail on roof edge
        ctx.fillStyle = '#1b474d';
        ctx.fillRect(obs.x + 14, obs.y + 44, 38, 8);
        ctx.fillRect(obs.x + 22, obs.y + 52, 20, 5);

        // Warm Glowing Golden Windows casting light pools on the ground!
        for (const wx of [obs.x + 26, obs.x + obs.w - 66]) {
          const wy = obs.y + 68;
          // Warm window glow halo
          ctx.fillStyle = 'rgba(255, 205, 95, 0.2)';
          ctx.fillRect(wx - 10, wy - 6, 58, 48);
          // Warm light spill on the grass/ground below the window
          ctx.fillStyle = 'rgba(255, 200, 90, 0.14)';
          ctx.fillRect(wx - 6, obs.y + obs.h + 2, 50, 18);

          // Wooden shutters
          ctx.fillStyle = '#4a2d1b';
          ctx.fillRect(wx - 8, wy, 8, 34);
          ctx.fillRect(wx + 38, wy, 8, 34);
          // Window frame & glowing amber panes
          ctx.fillStyle = '#29180e';
          ctx.fillRect(wx, wy, 38, 34);
          ctx.fillStyle = '#ffcf5c';
          ctx.fillRect(wx + 3, wy + 3, 14, 12);
          ctx.fillRect(wx + 21, wy + 3, 14, 12);
          ctx.fillRect(wx + 3, wy + 19, 14, 12);
          ctx.fillRect(wx + 21, wy + 19, 14, 12);
          ctx.fillStyle = '#fff5cc';
          ctx.fillRect(wx + 5, wy + 5, 6, 6);
          ctx.fillRect(wx + 23, wy + 5, 6, 6);
          // Window flowerbox
          ctx.fillStyle = '#52321e';
          ctx.fillRect(wx - 2, wy + 34, 42, 6);
          ctx.fillStyle = '#6be6ff';
          ctx.fillRect(wx + 6, wy + 31, 5, 4);
          ctx.fillRect(wx + 24, wy + 31, 5, 4);
        }

        // If Winter Cabin and Keeper hasn't stepped out yet, show Keeper's silhouette behind window
        if (obs.renderType === 'cabin' && !saveState.flags['fragment_4']) {
          ctx.fillStyle = '#121622';
          ctx.fillRect(obs.x + 34, obs.y + 74, 22, 26);
          ctx.fillStyle = '#33f2ff';
          ctx.fillRect(obs.x + 39, obs.y + 81, 3, 3);
          ctx.fillRect(obs.x + 47, obs.y + 81, 3, 3);
        }

        // VISIBLE WOODEN FRONT DOOR WITH WARM PORCH LANTERN & STONE THRESHOLD
        const doorX = obs.x + Math.floor(obs.w / 2) - 24;
        const doorY = obs.y + obs.h - 56;
        // Warm doorway light pool on ground
        ctx.fillStyle = 'rgba(255, 200, 90, 0.22)';
        ctx.fillRect(doorX - 12, obs.y + obs.h - 2, 72, 22);
        // Stone doorstep
        ctx.fillStyle = '#6e758c';
        ctx.fillRect(doorX - 6, obs.y + obs.h - 6, 60, 10);
        // Wooden doorframe & door planks
        ctx.fillStyle = '#29180e';
        ctx.fillRect(doorX, doorY, 48, 54);
        ctx.fillStyle = '#6e4224';
        ctx.fillRect(doorX + 4, doorY + 4, 40, 48);
        ctx.fillStyle = '#4a2b16';
        ctx.fillRect(doorX + 23, doorY + 4, 2, 48);
        // Glowing transom window at top of door
        ctx.fillStyle = '#ffdf85';
        ctx.fillRect(doorX + 8, doorY + 8, 32, 8);
        // Bright gold doorknob
        ctx.fillStyle = '#f5b942';
        ctx.fillRect(doorX + 34, doorY + 28, 5, 5);

        // Decorative Crates & Barrels beside building
        drawCrateAndBarrel(ctx, obs.x + obs.w + 6, obs.y + obs.h - 24);

        // Building Name Signboard
        if (obs.label) {
          ctx.fillStyle = '#121526';
          ctx.fillRect(obs.x + 22, obs.y + 16, obs.w - 44, 20);
          ctx.strokeStyle = '#f5b942';
          ctx.strokeRect(obs.x + 22, obs.y + 16, obs.w - 44, 20);
          ctx.fillStyle = '#ffdf85';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(obs.label, obs.x + obs.w / 2, obs.y + 30);
        }

        // OVERGROWN ROOT LOCKING MECHANIC
        if (obs.buildingId) {
          const isUnlocked = saveState.unlockedBuildings.includes(obs.buildingId);
          if (!isUnlocked) {
            drawOvergrownRoots(ctx, doorX, doorY, 48, 54, 0);
          } else if (
            rootUnlockAnim.buildingId === obs.buildingId &&
            rootUnlockAnim.progress < 1
          ) {
            drawOvergrownRoots(ctx, doorX, doorY, 48, 54, rootUnlockAnim.progress);
          }
        }
      } else if (obs.renderType === 'fountain') {
        // Starlit Town Square Fountain
        ctx.fillStyle = 'rgba(107, 230, 255, 0.15)';
        ctx.fillRect(obs.x - 14, obs.y - 14, obs.w + 28, obs.h + 28);
        ctx.fillStyle = '#4a526e';
        ctx.fillRect(obs.x - 4, obs.y - 4, obs.w + 8, obs.h + 8);
        ctx.fillStyle = '#32384f';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.fillStyle = '#193b66';
        ctx.fillRect(obs.x + 10, obs.y + 10, obs.w - 20, obs.h - 20);
        ctx.fillStyle = '#6be6ff';
        const splash = (Math.floor(tick / 12) % 2) * 4;
        ctx.fillRect(obs.x + obs.w / 2 - 12, obs.y + obs.h / 2 - 12 - splash, 24, 24);
        ctx.fillStyle = '#ffdf85';
        ctx.fillRect(obs.x + 24, obs.y + 24, 3, 3);
        ctx.fillRect(obs.x + obs.w - 30, obs.y + obs.h - 28, 3, 3);
      } else if (obs.renderType === 'well') {
        // Moonlit Frozen Well
        ctx.fillStyle = '#38425e';
        ctx.fillRect(obs.x, obs.y + 20, obs.w, obs.h - 20);
        ctx.fillStyle = '#14223d';
        ctx.fillRect(obs.x + 12, obs.y + 28, obs.w - 24, obs.h - 36);
        ctx.fillStyle = '#6be6ff';
        ctx.fillRect(obs.x + 26, obs.y + 38, 18, 12);
        // Wooden well roof
        ctx.fillStyle = '#472c1b';
        ctx.fillRect(obs.x + 6, obs.y, 8, obs.h - 10);
        ctx.fillRect(obs.x + obs.w - 14, obs.y, 8, obs.h - 10);
        ctx.fillStyle = '#36496e';
        ctx.fillRect(obs.x - 4, obs.y - 6, obs.w + 8, 18);
      } else if (obs.renderType === 'arcade_machine') {
        // Detailed Vintage Clockwork Arcade Cabinet
        ctx.fillStyle = 'rgba(6, 8, 18, 0.45)';
        ctx.fillRect(obs.x - 3, obs.y + obs.h - 4, obs.w + 6, 10);
        ctx.fillStyle = '#261a3b';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.strokeStyle = '#d99b38';
        ctx.strokeRect(obs.x + 2, obs.y + 2, obs.w - 4, obs.h - 4);
        // Glowing CRT screen
        const broken = obs.label === 'OUT OF ORDER';
        ctx.fillStyle = broken ? '#1c1626' : '#122b47';
        ctx.fillRect(obs.x + 10, obs.y + 12, obs.w - 20, 30);
        ctx.fillStyle = broken ? '#ff5277' : '#33f2ff';
        ctx.fillRect(obs.x + 14, obs.y + 16, obs.w - 28, broken ? 4 : 22);
        // Joystick & arcade buttons
        ctx.fillStyle = '#ff5277';
        ctx.fillRect(obs.x + 22, obs.y + 46, 5, 5);
        ctx.fillStyle = '#f5b942';
        ctx.fillRect(obs.x + 34, obs.y + 46, 5, 5);
        ctx.fillStyle = '#38d996';
        ctx.fillRect(obs.x + 44, obs.y + 46, 5, 5);
        if (obs.label) {
          ctx.fillStyle = '#ffdf85';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(obs.label, obs.x + obs.w / 2, obs.y + obs.h - 8);
        }
      } else if (obs.renderType === 'telescope') {
        // Grand Brass Celestial Telescope
        ctx.fillStyle = '#28304d';
        ctx.fillRect(obs.x + 20, obs.y + 20, obs.w - 40, obs.h - 20);
        ctx.fillStyle = '#d99b38';
        ctx.fillRect(obs.x + 52, obs.y - 28, 56, 98);
        ctx.fillStyle = '#ffdf85';
        ctx.fillRect(obs.x + 60, obs.y - 24, 16, 90);
        ctx.fillStyle = '#6be6ff';
        ctx.fillRect(obs.x + 62, obs.y - 22, 36, 18);
      } else if (obs.renderType === 'tree' || obs.renderType === 'pine') {
        // Dense Twilight Forest Border
        ctx.fillStyle = '#0d1926';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        for (let tx = obs.x; tx < obs.x + obs.w - 32; tx += 36) {
          ctx.fillStyle = obs.renderType === 'pine' ? '#1e324f' : '#183642';
          ctx.fillRect(tx + 4, obs.y + 6, 26, 26);
          ctx.fillStyle = obs.renderType === 'pine' ? '#6b8cb8' : '#295866';
          ctx.fillRect(tx + 8, obs.y + 8, 14, 10);
        }
      } else if (obs.renderType === 'bookshelf') {
        // Detailed Mahogany Bookshelf packed with colorful pixel book spines!
        if (obs.y === 0) continue; // Top wall already rendered by renderDetailedInterior
        ctx.fillStyle = 'rgba(8, 6, 14, 0.45)';
        ctx.fillRect(obs.x - 2, obs.y + obs.h - 2, obs.w + 4, 8);
        ctx.fillStyle = '#381f14';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.fillStyle = '#593320';
        ctx.fillRect(obs.x + 4, obs.y + 4, obs.w - 8, obs.h - 8);
        // 2 rows of colorful books
        const bookColors = ['#c94a4a', '#4a8cc9', '#4ac978', '#e6b845', '#9e5cc9', '#d97a38'];
        for (const rowY of [obs.y + 8, obs.y + 28]) {
          ctx.fillStyle = '#29150d';
          ctx.fillRect(obs.x + 6, rowY, obs.w - 12, 14);
          for (let bx = obs.x + 8; bx < obs.x + obs.w - 14; bx += 8) {
            ctx.fillStyle = bookColors[(bx + rowY) % bookColors.length];
            ctx.fillRect(bx, rowY + 2, 6, 12);
          }
        }
        if (obs.label) {
          ctx.fillStyle = '#ffdf85';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(obs.label, obs.x + obs.w / 2, obs.y + obs.h - 4);
        }
      } else {
        // Detailed Interior Counters & Tables with props on top (Machi Bakery style!)
        if (obs.y === 0) continue; // Top wall already rendered by renderDetailedInterior
        ctx.fillStyle = 'rgba(8, 6, 14, 0.42)';
        ctx.fillRect(obs.x - 3, obs.y + obs.h - 3, obs.w + 6, 9);
        // Dark wood base
        ctx.fillStyle = '#3b2215';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        // Warm polished wood tabletop
        ctx.fillStyle = '#6e4328';
        ctx.fillRect(obs.x + 3, obs.y + 3, obs.w - 6, obs.h - 12);
        ctx.fillStyle = '#8a5636';
        ctx.fillRect(obs.x + 5, obs.y + 5, obs.w - 10, 6);

        // Decorative props on tables/counters (books, pastries, candles, cups, scrolls)
        ctx.fillStyle = '#fff2cc';
        ctx.fillRect(obs.x + 14, obs.y + 12, 12, 9);
        ctx.fillStyle = '#e05a47';
        ctx.fillRect(obs.x + 18, obs.y + 14, 4, 4);

        ctx.fillStyle = '#ffdf85';
        ctx.fillRect(obs.x + obs.w - 24, obs.y + 10, 8, 10);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(obs.x + obs.w - 21, obs.y + 7, 2, 4);

        if (obs.label) {
          ctx.fillStyle = 'rgba(18, 14, 24, 0.82)';
          ctx.fillRect(obs.x + 8, obs.y + obs.h / 2 - 6, obs.w - 16, 13);
          ctx.fillStyle = '#ffdf85';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(obs.label, obs.x + obs.w / 2, obs.y + obs.h / 2 + 3);
        }
      }
    }
  }

  // 6. Collectible Star Coins
  if (map.coins) {
    for (const c of map.coins) {
      if (!saveState.coins.includes(c.id)) {
        drawCollectibleCrystal(ctx, c.x, c.y, 'coin', tick);
      }
    }
  }

  // 7. Interactables, VISIBLE DOORS, NPCs, Memory Fragments & Secret Stars
  for (const item of map.interactables) {
    if (item.hideIfFlag && saveState.flags[item.hideIfFlag]) continue;
    if (item.requiredFlag && !saveState.flags[item.requiredFlag]) continue;
    if (
      item.actionType === 'collect_fragment' &&
      item.fragmentId &&
      saveState.fragments.includes(item.fragmentId)
    ) {
      continue;
    }
    if (
      item.actionType === 'collect_star' &&
      item.starId &&
      saveState.stars.includes(item.starId)
    ) {
      continue;
    }

    if (item.actionType === 'door' || item.actionType === 'chapter_transition') {
      const isInteriorExit = mapId !== 'town' && item.actionType === 'door';
      const isLockedByRoots = Boolean(
        item.buildingId && !saveState.unlockedBuildings.includes(item.buildingId)
      );
      drawVisibleDoorway(ctx, item, isInteriorExit, isLockedByRoots, tick);
    }

    if (item.npcCharacter) {
      drawNpcSprite(ctx, item.npcCharacter, item.x, item.y, tick, saveState.flags);
    } else if (item.actionType === 'collect_fragment') {
      drawCollectibleCrystal(ctx, item.x, item.y, 'fragment', tick);
    } else if (item.actionType === 'collect_star') {
      drawCollectibleCrystal(ctx, item.x, item.y, 'star', tick);
    } else if (item.actionType !== 'door' && item.actionType !== 'chapter_transition') {
      const pulse = (Math.floor(tick / 15) % 2) * 2;
      ctx.fillStyle = 'rgba(245, 185, 66, 0.25)';
      ctx.fillRect(item.x + item.w / 2 - 8, item.y + 8 - pulse, 16, 16);
      ctx.fillStyle = '#ffdf85';
      ctx.fillRect(item.x + item.w / 2 - 4, item.y + 12 - pulse, 8, 8);
    }

    // Floating "[E]" badge above active interactable
    if (activeInteractableId === item.id) {
      ctx.fillStyle = '#0e1121';
      ctx.fillRect(item.x + item.w / 2 - 16, item.y - 22, 32, 16);
      ctx.strokeStyle = '#f5b942';
      ctx.strokeRect(item.x + item.w / 2 - 16, item.y - 22, 32, 16);
      ctx.fillStyle = '#ffdf85';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[E]', item.x + item.w / 2, item.y - 11);
    }
  }

  // 8. Mallow Companion following Raynio
  if (saveState.flags['talked_mallow_station']) {
    const mallowX = playerFacing === 'right' ? saveState.playerX - 28 : saveState.playerX + 30;
    const mallowY = saveState.playerY - 6;
    drawMallowCompanion(ctx, mallowX, mallowY, tick, false);
  }

  // 9. Playable Protagonist: Raynio (with soft lantern light aura in night maps)
  ctx.fillStyle = 'rgba(255, 215, 130, 0.08)';
  ctx.fillRect(saveState.playerX - 18, saveState.playerY - 10, 60, 56);
  drawRaynioSprite(
    ctx,
    saveState.playerX,
    saveState.playerY,
    saveState.outfit,
    playerFacing,
    playerMoving,
    playerJumping,
    tick,
    transformProgress
  );

  // 10. Foreground Snow / Firefly Particles
  ctx.resetTransform();
  if (mapId === 'winter') {
    ctx.fillStyle = 'rgba(220, 235, 255, 0.78)';
    for (let s = 0; s < 35; s++) {
      const sx = (((s * 67 + tick * 0.8) % 640) + 640) % 640;
      const sy = (((s * 53 + tick * 1.4) % 360) + 360) % 360;
      ctx.fillRect(Math.floor(sx), Math.floor(sy), 3, 3);
    }
  } else {
    for (let p = 0; p < 18; p++) {
      const px = (((p * 89 + Math.sin(tick * 0.02 + p) * 20) % 640) + 640) % 640;
      const py = (((p * 61 - tick * 0.3) % 360) + 360) % 360;
      ctx.fillStyle = p % 2 === 0 ? 'rgba(255, 220, 120, 0.5)' : 'rgba(107, 230, 255, 0.45)';
      ctx.fillRect(Math.floor(px), Math.floor(syOrPy(py)), 2, 2);
    }
  }

  ctx.restore();
}

function syOrPy(v: number): number {
  return v;
}
