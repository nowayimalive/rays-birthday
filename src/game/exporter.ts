import { FINAL_ALLAN_LETTER_PAGES, MEMORY_FRAGMENTS, SECRET_STARS } from './collectibles';
import { SaveState } from './types';

// Generates a self-contained portable HTML keepsake & playable build archive of The Little Thing We Left Behind
export function downloadStandaloneGameHtml(saveState: SaveState): void {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>The Little Thing We Left Behind — Portable Keepsake Build</title>
<style>
  body {
    margin: 0;
    background: #0d0f1a;
    color: #f5eedc;
    font-family: system-ui, -apple-system, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
  }
  .card {
    max-width: 720px;
    width: 100%;
    background: #14182b;
    border: 2px solid #f5b942;
    border-radius: 12px;
    padding: 24px;
    box-sizing: border-box;
    box-shadow: 0 12px 32px rgba(0,0,0,0.6);
  }
  h1 { color: #f5b942; margin-top: 0; font-size: 24px; }
  h2 { color: #6be6ff; font-size: 16px; margin-top: 24px; }
  .fragment {
    background: #101322;
    border: 1px solid #483d66;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 10px;
  }
  .btn {
    display: inline-block;
    background: #f5b942;
    color: #0d0f1a;
    font-weight: 700;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 8px;
    margin-top: 16px;
  }
  .letter-box {
    background: #101322;
    border: 1px solid #584b7a;
    border-radius: 8px;
    padding: 18px;
    line-height: 1.65;
    margin-top: 12px;
  }
</style>
</head>
<body>
  <div class="card">
    <h1>THE LITTLE THING WE LEFT BEHIND</h1>
    <p><em>“Some things don't need to be brought back to still mean something.”</em></p>
    <p>Saved Progress Snapshot — Fragments: ${saveState.fragments.length}/6 · Secret Stars: ${saveState.stars.length}/6 · Coins: ${saveState.coins.length}</p>

    <h2>THE SIX MEMORY FRAGMENTS</h2>
    ${MEMORY_FRAGMENTS.map(
      (f) => `<div class="fragment">
        <strong>#${f.id} ${f.title}</strong> (${f.chapter})<br/>
        <span style="color:#ffdf8c">“${f.message}”</span>
      </div>`
    ).join('')}

    <h2>THE SIX SECRET STARS</h2>
    ${SECRET_STARS.map(
      (s) => `<div class="fragment">
        <strong>★ #${s.id} ${s.name}</strong> — ${s.chapter}<br/>
        <small>${s.locationHint}</small>
      </div>`
    ).join('')}

    <h2>ALLAN'S BIRTHDAY LETTER TO RAYNIO</h2>
    <div class="letter-box">
      ${FINAL_ALLAN_LETTER_PAGES.flat()
        .map((p) => `<p>${p}</p>`)
        .join('')}
    </div>

    <div style="text-align:center; margin-top: 24px;">
      <h3>THE END OF THE STORY — HAPPY BIRTHDAY, RAYNIO!</h3>
      <p style="color:#ffdf85; font-style:italic; font-weight:600;">“I’m so happy to be a part of your life. I’ll love you forever.”</p>
      <p style="font-size:12px; color:#ffdf8c; margin-top:12px;">Made with love, by Allan.</p>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'THE_LITTLE_THING_WE_LEFT_BEHIND_Keepsake.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
