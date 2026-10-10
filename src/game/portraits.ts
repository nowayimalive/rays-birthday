import { CharacterId, Expression } from './types';

// Detailed Pixel-Art Portrait Renderer (renders crisp 24x24 pixel-art grid scaled cleanly to canvas)
export function drawCharacterPortrait(
  ctx: CanvasRenderingContext2D,
  character: CharacterId,
  expression: Expression,
  size = 96
): void {
  const grid = 24;
  const px = Math.floor(size / grid);
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  const fill = (x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * px, y * px, w * px, h * px);
  };

  // Portrait background based on character mood
  const bgMap: Record<CharacterId, [string, string]> = {
    raynio: ['#1b233b', '#273459'],
    raynio_blue: ['#1b283b', '#243c5a'],
    mallow: ['#221d3a', '#312952'],
    mayor_cat: ['#331c24', '#4d2834'],
    keeper_hooded: ['#111622', '#1b2638'],
    keeper_unhooded: ['#142030', '#1e344d'],
    allan: ['#251f38', '#3b3054'],
    postie: ['#1a2942', '#263e63'],
    rosa: ['#1c3026', '#294738'],
    bram: ['#362519', '#4f3624'],
    tock: ['#2d2419', '#453726'],
    librarian: ['#1f1c38', '#2e2952'],
    innkeeper: ['#33201d', '#4a2e29'],
    pigeon: ['#242834', '#373d4f'],
    bread: ['#362819', '#523c24'],
    system: ['#181b2c', '#252a42'],
  };

  const [bg1, bg2] = bgMap[character] || ['#181b2c', '#252a42'];
  fill(0, 0, 24, 24, bg1);
  fill(2, 2, 20, 20, bg2);

  // Subtle corner frame pixels
  fill(1, 1, 22, 1, '#4c436e');
  fill(1, 22, 22, 1, '#4c436e');
  fill(1, 1, 1, 22, '#4c436e');
  fill(22, 1, 1, 22, '#4c436e');

  // Helper to draw standard human/character eyes & mouth based on expression
  const drawExpressionFace = (
    eyeY: number,
    mouthY: number,
    eyeColor: string,
    skinShadow: string,
    blushColor = '#f08ca2'
  ) => {
    // Eyebrows
    if (expression === 'angry' as Expression || expression === 'annoyed') {
      fill(8, eyeY - 2, 3, 1, '#181820');
      fill(13, eyeY - 2, 3, 1, '#181820');
    } else if (expression === 'surprised') {
      fill(8, eyeY - 3, 3, 1, '#181820');
      fill(13, eyeY - 3, 3, 1, '#181820');
    } else if (expression === 'sad' || expression === 'embarrassed') {
      fill(8, eyeY - 3, 2, 1, '#181820');
      fill(10, eyeY - 2, 1, 1, '#181820');
      fill(13, eyeY - 2, 1, 1, '#181820');
      fill(14, eyeY - 3, 2, 1, '#181820');
    } else if (expression === 'confused') {
      fill(8, eyeY - 3, 3, 1, '#181820');
      fill(13, eyeY - 2, 3, 1, '#181820');
    } else {
      fill(8, eyeY - 2, 3, 1, '#181820');
      fill(13, eyeY - 2, 3, 1, '#181820');
    }

    // Eyes
    if (expression === 'happy') {
      // Happy curved arches
      fill(8, eyeY, 1, 1, eyeColor);
      fill(9, eyeY - 1, 1, 1, eyeColor);
      fill(10, eyeY, 1, 1, eyeColor);
      fill(13, eyeY, 1, 1, eyeColor);
      fill(14, eyeY - 1, 1, 1, eyeColor);
      fill(15, eyeY, 1, 1, eyeColor);
    } else if (expression === 'annoyed') {
      // Half-lidded
      fill(8, eyeY, 3, 1, '#ffffff');
      fill(9, eyeY, 2, 1, eyeColor);
      fill(13, eyeY, 3, 1, '#ffffff');
      fill(14, eyeY, 2, 1, eyeColor);
    } else {
      // Full expressive pixel eyes with white highlight
      fill(8, eyeY - 1, 2, 2, eyeColor);
      fill(8, eyeY - 1, 1, 1, '#ffffff');
      fill(14, eyeY - 1, 2, 2, eyeColor);
      fill(14, eyeY - 1, 1, 1, '#ffffff');
    }

    // Blush
    if (expression === 'embarrassed' || expression === 'happy') {
      fill(7, eyeY + 1, 2, 1, blushColor);
      fill(15, eyeY + 1, 2, 1, blushColor);
    }

    // Nose shadow
    fill(11, eyeY + 1, 2, 1, skinShadow);

    // Mouth
    if (expression === 'happy') {
      fill(10, mouthY, 4, 1, '#b85d68');
      fill(9, mouthY - 1, 1, 1, '#b85d68');
      fill(14, mouthY - 1, 1, 1, '#b85d68');
    } else if (expression === 'surprised') {
      fill(11, mouthY - 1, 2, 2, '#9e4752');
    } else if (expression === 'sad') {
      fill(10, mouthY - 1, 4, 1, '#b85d68');
      fill(9, mouthY, 1, 1, '#b85d68');
      fill(14, mouthY, 1, 1, '#b85d68');
    } else if (expression === 'confused' || expression === 'thoughtful') {
      fill(10, mouthY, 3, 1, '#b85d68');
      fill(13, mouthY - 1, 1, 1, '#b85d68');
    } else if (expression === 'embarrassed') {
      fill(10, mouthY, 1, 1, '#b85d68');
      fill(11, mouthY - 1, 1, 1, '#b85d68');
      fill(12, mouthY, 1, 1, '#b85d68');
      fill(13, mouthY - 1, 1, 1, '#b85d68');
    } else {
      // Neutral gentle smile/line
      fill(10, mouthY, 4, 1, '#b85d68');
    }
  };

  if (character === 'raynio' || character === 'raynio_blue') {
    const isKnight = character === 'raynio';
    // Outfit torso
    if (isKnight) {
      // Red/crimson knight cape behind shoulders
      fill(4, 17, 16, 6, '#9e2b3b');
      // Silver-steel armor chestplate & pauldrons
      fill(5, 18, 14, 5, '#99a9bf');
      fill(6, 19, 12, 4, '#c7d4e6');
      fill(4, 17, 4, 3, '#dce6f2'); // Left pauldron
      fill(16, 17, 4, 3, '#dce6f2'); // Right pauldron
      fill(10, 19, 4, 4, '#3b5dc9'); // Cobalt crest tunic center
      fill(11, 20, 2, 2, '#f5b942'); // Gold star emblem
      // Travel bag strap across chest
      fill(7, 18, 2, 5, '#7a4e2d');
      fill(9, 20, 2, 3, '#7a4e2d');
    } else {
      // Cozy blue shirt + brown travel bag strap
      fill(5, 18, 14, 5, '#2d63b8');
      fill(7, 18, 10, 5, '#3b7ce0');
      fill(10, 18, 4, 2, '#f5eedc'); // Collar
      fill(7, 18, 2, 5, '#7a4e2d');  // Travel bag strap
    }

    // Neck & Light skin tone face (strictly light fair/peach skin tone, not tan)
    fill(10, 16, 4, 3, '#f2d3c2');
    fill(7, 7, 10, 9, '#ffe4d4');
    fill(6, 10, 1, 3, '#ffe4d4'); // Left ear
    fill(17, 10, 1, 3, '#ffe4d4'); // Right ear
    fill(8, 15, 8, 1, '#f2d3c2'); // Chin contour

    // Thick curly/messy black hair with fringe falling across forehead
    fill(6, 3, 12, 4, '#14161f');
    fill(5, 4, 14, 4, '#1c1f2b');
    fill(4, 6, 3, 5, '#14161f');  // Left curly locks
    fill(17, 6, 3, 5, '#14161f'); // Right curly locks
    fill(5, 2, 3, 2, '#1c1f2b');  // Messy top curl left
    fill(10, 2, 4, 2, '#272b3b'); // Hair highlight cluster
    fill(16, 3, 3, 2, '#1c1f2b'); // Messy curl right
    // Signature fringe locks falling across the forehead
    fill(7, 7, 2, 3, '#14161f');
    fill(10, 7, 3, 2, '#1c1f2b');
    fill(11, 9, 1, 1, '#14161f');
    fill(14, 7, 3, 3, '#14161f');

    drawExpressionFace(11, 14, '#1b1d29', '#eabfa8');
  } else if (character === 'mallow') {
    // Mallow: Small rounded white ghost, gray outline, small expressive eyes, tiny pink accent
    fill(7, 5, 10, 1, '#7f8699'); // Top outline
    fill(6, 6, 12, 12, '#7f8699'); // Outer gray silhouette
    fill(7, 6, 10, 11, '#f7f9fc'); // Soft white body
    fill(8, 7, 8, 9, '#ffffff');   // Bright inner core
    // Wavy ghost tail at bottom
    fill(6, 18, 3, 2, '#f7f9fc');
    fill(10, 18, 4, 3, '#f7f9fc');
    fill(15, 18, 3, 2, '#f7f9fc');
    // Tiny pink bow/blush accent on head & cheeks
    fill(15, 6, 2, 2, '#ff8da6');
    fill(7, 12, 2, 1, '#ffa6b8');
    fill(15, 12, 2, 1, '#ffa6b8');

    // Expressive ghost eyes
    if (expression === 'annoyed') {
      fill(8, 10, 3, 1, '#1f2233');
      fill(13, 10, 3, 1, '#1f2233');
    } else if (expression === 'happy') {
      fill(9, 10, 2, 1, '#1f2233');
      fill(13, 10, 2, 1, '#1f2233');
      fill(11, 12, 2, 2, '#ff8da6');
    } else if (expression === 'surprised') {
      fill(9, 9, 2, 2, '#1f2233');
      fill(13, 9, 2, 2, '#1f2233');
      fill(11, 12, 2, 2, '#1f2233');
    } else {
      fill(9, 10, 2, 2, '#1f2233');
      fill(13, 10, 2, 2, '#1f2233');
      fill(11, 13, 2, 1, '#7f8699');
    }
  } else if (character === 'mayor_cat') {
    // Mayor Cat: Orange cat, cream muzzle, burgundy formal suit, golden tie, top hat
    // Top Hat
    fill(8, 2, 8, 4, '#1e1b29');
    fill(6, 6, 12, 1, '#1e1b29');
    fill(8, 5, 8, 1, '#f5b942'); // Gold hatband
    // Orange cat ears sticking out
    fill(5, 5, 3, 3, '#e87e2e');
    fill(16, 5, 3, 3, '#e87e2e');
    fill(6, 6, 1, 2, '#f7b086');
    fill(17, 6, 1, 2, '#f7b086');
    // Orange cat head
    fill(6, 7, 12, 9, '#e87e2e');
    fill(7, 8, 10, 7, '#f5923e');
    // Cream-colored muzzle
    fill(8, 12, 8, 4, '#fff1d6');
    fill(11, 12, 2, 1, '#d96b79'); // Pink nose
    // Whiskers
    fill(4, 12, 2, 1, '#fff1d6');
    fill(4, 14, 2, 1, '#fff1d6');
    fill(18, 12, 2, 1, '#fff1d6');
    fill(18, 14, 2, 1, '#fff1d6');
    // Eyes
    if (expression === 'surprised' || expression === 'embarrassed') {
      fill(8, 9, 2, 2, '#1f2e1b');
      fill(14, 9, 2, 2, '#1f2e1b');
      fill(11, 14, 2, 2, '#8c2d3c');
    } else {
      fill(8, 10, 2, 2, '#1f2e1b');
      fill(14, 10, 2, 2, '#1f2e1b');
      fill(10, 14, 4, 1, '#8c533e');
    }
    // Burgundy formal suit & golden tie
    fill(5, 16, 14, 7, '#6e1d35');
    fill(9, 16, 6, 4, '#f5eedc'); // Crisp shirt
    fill(11, 17, 2, 5, '#f5b942'); // Golden tie
  } else if (character === 'keeper_hooded') {
    // The Keeper (Hooded): Dark charcoal cloak, deep shadow, cyan glowing eyes, star clasp
    fill(4, 16, 16, 7, '#1b1f29');
    fill(5, 3, 14, 14, '#232836'); // Outer hood
    fill(7, 6, 10, 10, '#0b0e14'); // Deep shadow inside hood
    // Hint of messy black hair strands under hood
    fill(8, 6, 2, 2, '#141722');
    fill(13, 6, 3, 2, '#141722');
    // Glowing cyan/turquoise eyes
    fill(8, 10, 3, 2, '#33f2ff');
    fill(9, 10, 1, 1, '#ffffff');
    fill(13, 10, 3, 2, '#33f2ff');
    fill(14, 10, 1, 1, '#ffffff');
    // Small silver/cyan star ornament on cloak
    fill(11, 18, 2, 2, '#6be6ff');
  } else if (character === 'keeper_unhooded') {
    // The Keeper (Unhooded at Observatory): Messy black hair, cyan glowing eyes, facial scars
    fill(4, 17, 16, 6, '#1b1f29'); // Dark cloak shoulders
    fill(11, 19, 2, 2, '#6be6ff'); // Star ornament
    // Face
    fill(10, 15, 4, 3, '#d9c4b8');
    fill(7, 7, 10, 9, '#ebd7cc');
    // Distinct facial scars (across left eye/cheek and nose bridge)
    fill(8, 8, 1, 6, '#a66868');
    fill(9, 12, 4, 1, '#a66868');
    // Messy black hair
    fill(6, 3, 12, 4, '#12151f');
    fill(5, 5, 3, 6, '#12151f');
    fill(16, 5, 3, 6, '#12151f');
    fill(8, 7, 3, 2, '#12151f');
    fill(13, 7, 3, 2, '#12151f');
    // Glowing cyan/turquoise eyes
    fill(8, 10, 2, 2, '#33f2ff');
    fill(14, 10, 2, 2, '#33f2ff');
    fill(10, 14, 4, 1, '#8c6d68');
  } else if (character === 'allan') {
    // Allan: Human creator of the world. Messy black hair, warm human black eyes, NO facial scars, warm approachable expression
    fill(5, 17, 14, 6, '#2b3554'); // Warm indigo/charcoal jacket
    fill(9, 17, 6, 6, '#f5eedc');  // Soft cream inner shirt
    // Neck & warm human face (zero scars)
    fill(10, 15, 4, 3, '#ebcbb7');
    fill(7, 7, 10, 9, '#f7dccb');
    fill(6, 10, 1, 3, '#f7dccb');
    fill(17, 10, 1, 3, '#f7dccb');
    // Messy black hair
    fill(6, 3, 12, 4, '#171922');
    fill(5, 4, 14, 3, '#222533');
    fill(5, 6, 2, 4, '#171922');
    fill(17, 6, 2, 4, '#171922');
    fill(8, 7, 3, 2, '#171922');
    fill(13, 7, 3, 2, '#171922');
    // Human black eyes with warm catchlight + gentle smile
    drawExpressionFace(11, 14, '#171922', '#deb8a0');
  } else if (character === 'postie') {
    // Postie: Walking mailbox with mail slot, visor cap, mailbag
    fill(6, 5, 12, 16, '#2b5eb8');
    fill(7, 6, 10, 14, '#3973d9');
    fill(6, 4, 13, 2, '#1d3f7a'); // Visor cap
    fill(11, 4, 2, 1, '#f5b942'); // Gold post badge
    // Mail slot mouth
    fill(8, 14, 8, 2, '#122240');
    fill(9, 14, 6, 1, '#f5eedc'); // Envelopes peeking out
    // Expressive eyes above slot
    fill(8, 10, 2, 2, '#ffffff');
    fill(9, 10, 1, 2, '#122240');
    fill(14, 10, 2, 2, '#ffffff');
    fill(15, 10, 1, 2, '#122240');
    // Mailbag strap
    fill(6, 17, 12, 2, '#9e582b');
  } else if (character === 'rosa') {
    // Rosa: Flower keeper with sage apron and floral hairpin
    fill(5, 17, 14, 6, '#488258');
    fill(8, 18, 8, 5, '#e8dcc4'); // Apron
    fill(7, 7, 10, 9, '#f7d8c4');
    fill(5, 3, 14, 5, '#6e3b2b'); // Warm chestnut hair
    fill(5, 7, 2, 8, '#6e3b2b');
    fill(17, 7, 2, 8, '#6e3b2b');
    fill(16, 5, 3, 3, '#ff7a9e'); // Pink blossom in hair
    drawExpressionFace(11, 14, '#2b4d35', '#deb8a0');
  } else if (character === 'bram') {
    // Bram: Baker with white chef toque and hearty moustache
    fill(7, 2, 10, 5, '#ffffff'); // Chef hat
    fill(6, 6, 12, 2, '#e6e9f0');
    fill(5, 17, 14, 6, '#f5eedc'); // Baker coat
    fill(10, 17, 4, 3, '#c94a3b'); // Neckerchief
    fill(7, 8, 10, 9, '#f2cab1');
    fill(8, 10, 2, 2, '#2b211b');
    fill(14, 10, 2, 2, '#2b211b');
    fill(8, 13, 8, 2, '#7a4928'); // Hearty moustache
  } else if (character === 'tock') {
    // Tock: Clockmaker with brass monocle & gears
    fill(5, 17, 14, 6, '#4a3525');
    fill(9, 17, 6, 6, '#d99b38'); // Brass waistcoat
    fill(7, 7, 10, 9, '#f0d2be');
    fill(6, 4, 12, 4, '#8c92a3'); // Silver-gray hair
    fill(8, 10, 2, 2, '#222633');
    // Brass monocle on right eye
    fill(13, 9, 4, 4, '#f5b942');
    fill(14, 10, 2, 2, '#6be6ff');
    fill(10, 14, 4, 1, '#9e6b58');
  } else if (character === 'librarian') {
    // Town Librarian: Quiet scholar with spectacles and indigo shawl
    fill(5, 17, 14, 6, '#362f59');
    fill(7, 7, 10, 9, '#f2d9c9');
    fill(6, 3, 12, 5, '#2b2438');
    fill(9, 1, 6, 2, '#2b2438'); // Hair bun
    // Spectacles
    fill(7, 9, 4, 3, '#d9a74a');
    fill(13, 9, 4, 3, '#d9a74a');
    fill(11, 10, 2, 1, '#d9a74a');
    fill(8, 10, 2, 1, '#1f2233');
    fill(14, 10, 2, 1, '#1f2233');
    fill(10, 14, 4, 1, '#b86875');
  } else {
    // Generic / Innkeeper / System Star Icon
    fill(7, 7, 10, 9, '#f2d6c4');
    fill(5, 17, 14, 6, '#6e3d2e');
    fill(6, 4, 12, 4, '#593628');
    drawExpressionFace(11, 14, '#222533', '#deb8a0');
  }

  ctx.restore();
}
