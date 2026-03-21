// worm.js — BASIC interpreter engine for WORM.BAS
// Runs in both browser and Node.js (with node-canvas)

// ============================================================
// Z-100 Font ROM — authentic 8x9 pixel bitmaps, ASCII 32-126
// From mdblack/Zenith-Z-100 emulator (video.c)
// ============================================================
export const Z100_FONT_RAW = [
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00, // 32 (space)
0x00,0x08,0x08,0x08,0x08,0x08,0x00,0x08,0x00, // 33 !
0x00,0x14,0x14,0x14,0x00,0x00,0x00,0x00,0x00, // 34 "
0x00,0x14,0x14,0x3e,0x14,0x3e,0x14,0x14,0x00, // 35 #
0x00,0x08,0x1e,0x28,0x1c,0x0a,0x3c,0x08,0x00, // 36 $
0x00,0x30,0x32,0x04,0x08,0x10,0x26,0x06,0x00, // 37 %
0x00,0x08,0x14,0x14,0x18,0x2a,0x24,0x1a,0x00, // 38 &
0x00,0x0c,0x08,0x10,0x00,0x00,0x00,0x00,0x00, // 39 '
0x00,0x04,0x08,0x10,0x10,0x10,0x08,0x04,0x00, // 40 (
0x00,0x10,0x08,0x04,0x04,0x04,0x08,0x10,0x00, // 41 )
0x00,0x00,0x08,0x2a,0x1c,0x2a,0x08,0x00,0x00, // 42 *
0x00,0x00,0x08,0x08,0x3e,0x08,0x08,0x00,0x00, // 43 +
0x00,0x00,0x00,0x00,0x00,0x18,0x18,0x08,0x10, // 44 ,
0x00,0x00,0x00,0x00,0x3e,0x00,0x00,0x00,0x00, // 45 -
0x00,0x00,0x00,0x00,0x00,0x00,0x18,0x18,0x00, // 46 .
0x00,0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x00, // 47 /
0x00,0x1c,0x22,0x26,0x2a,0x32,0x22,0x1c,0x00, // 48 0
0x00,0x08,0x18,0x08,0x08,0x08,0x08,0x1c,0x00, // 49 1
0x00,0x1c,0x22,0x02,0x04,0x08,0x10,0x3e,0x00, // 50 2
0x00,0x3e,0x04,0x08,0x04,0x02,0x22,0x1c,0x00, // 51 3
0x00,0x04,0x0c,0x14,0x24,0x3e,0x04,0x04,0x00, // 52 4
0x00,0x3e,0x20,0x3c,0x02,0x02,0x22,0x1c,0x00, // 53 5
0x00,0x0c,0x10,0x20,0x3c,0x22,0x22,0x1c,0x00, // 54 6
0x00,0x3e,0x02,0x04,0x08,0x10,0x10,0x10,0x00, // 55 7
0x00,0x1c,0x22,0x22,0x1c,0x22,0x22,0x1c,0x00, // 56 8
0x00,0x1c,0x22,0x22,0x1e,0x02,0x04,0x18,0x00, // 57 9
0x00,0x00,0x18,0x18,0x00,0x18,0x18,0x00,0x00, // 58 :
0x00,0x00,0x18,0x18,0x00,0x18,0x18,0x08,0x10, // 59 ;
0x00,0x02,0x04,0x08,0x10,0x08,0x04,0x02,0x00, // 60 <
0x00,0x00,0x00,0x3e,0x00,0x3e,0x00,0x00,0x00, // 61 =
0x00,0x20,0x10,0x08,0x04,0x08,0x10,0x20,0x00, // 62 >
0x00,0x1c,0x22,0x02,0x04,0x08,0x00,0x08,0x00, // 63 ?
0x00,0x0c,0x12,0x26,0x2a,0x2e,0x20,0x1e,0x00, // 64 @
0x00,0x1c,0x22,0x22,0x3e,0x22,0x22,0x22,0x00, // 65 A
0x00,0x3c,0x22,0x22,0x3c,0x22,0x22,0x3c,0x00, // 66 B
0x00,0x1c,0x22,0x20,0x20,0x20,0x22,0x1c,0x00, // 67 C
0x00,0x38,0x24,0x22,0x22,0x22,0x24,0x38,0x00, // 68 D
0x00,0x3e,0x20,0x20,0x3c,0x20,0x20,0x3e,0x00, // 69 E
0x00,0x3e,0x20,0x20,0x3c,0x20,0x20,0x20,0x00, // 70 F
0x00,0x1c,0x22,0x20,0x26,0x22,0x22,0x1e,0x00, // 71 G
0x00,0x22,0x22,0x22,0x3e,0x22,0x22,0x22,0x00, // 72 H
0x00,0x1c,0x08,0x08,0x08,0x08,0x08,0x1c,0x00, // 73 I
0x00,0x0e,0x04,0x04,0x04,0x04,0x24,0x18,0x00, // 74 J
0x00,0x22,0x24,0x28,0x30,0x28,0x24,0x22,0x00, // 75 K
0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x3e,0x00, // 76 L
0x00,0x22,0x36,0x2a,0x2a,0x22,0x22,0x22,0x00, // 77 M
0x00,0x22,0x22,0x32,0x2a,0x26,0x22,0x22,0x00, // 78 N
0x00,0x1c,0x22,0x22,0x22,0x22,0x22,0x1c,0x00, // 79 O
0x00,0x3c,0x22,0x22,0x3c,0x20,0x20,0x20,0x00, // 80 P
0x00,0x1c,0x22,0x22,0x22,0x2a,0x24,0x1a,0x00, // 81 Q
0x00,0x3c,0x22,0x22,0x3c,0x28,0x24,0x22,0x00, // 82 R
0x00,0x1c,0x22,0x20,0x1c,0x02,0x22,0x1c,0x00, // 83 S
0x00,0x3e,0x08,0x08,0x08,0x08,0x08,0x08,0x00, // 84 T
0x00,0x22,0x22,0x22,0x22,0x22,0x22,0x1c,0x00, // 85 U
0x00,0x22,0x22,0x22,0x14,0x14,0x08,0x08,0x00, // 86 V
0x00,0x22,0x22,0x22,0x2a,0x2a,0x2a,0x14,0x00, // 87 W
0x00,0x22,0x22,0x14,0x08,0x14,0x22,0x22,0x00, // 88 X
0x00,0x22,0x22,0x14,0x08,0x08,0x08,0x08,0x00, // 89 Y
0x00,0x3e,0x02,0x04,0x08,0x10,0x20,0x3e,0x00, // 90 Z
0x00,0x0e,0x08,0x08,0x08,0x08,0x08,0x0e,0x00, // 91 [
0x00,0x40,0x20,0x10,0x08,0x04,0x02,0x01,0x00, // 92 backslash
0x00,0x38,0x08,0x08,0x08,0x08,0x08,0x38,0x00, // 93 ]
0x00,0x08,0x14,0x22,0x00,0x00,0x00,0x00,0x00, // 94 ^
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x7f,0x00, // 95 _
0x00,0x18,0x08,0x04,0x00,0x00,0x00,0x00,0x00, // 96 `
0x00,0x00,0x00,0x1c,0x02,0x1e,0x22,0x1e,0x00, // 97 a
0x00,0x20,0x20,0x3c,0x22,0x22,0x22,0x3c,0x00, // 98 b
0x00,0x00,0x00,0x1c,0x22,0x20,0x20,0x1c,0x00, // 99 c
0x00,0x02,0x02,0x1e,0x22,0x22,0x22,0x1e,0x00, // 100 d
0x00,0x00,0x00,0x1c,0x22,0x3e,0x20,0x1c,0x00, // 101 e
0x00,0x0c,0x12,0x10,0x38,0x10,0x10,0x10,0x00, // 102 f
0x00,0x00,0x00,0x1e,0x24,0x38,0x1c,0x22,0x1c, // 103 g
0x00,0x20,0x20,0x3c,0x22,0x22,0x22,0x22,0x00, // 104 h
0x00,0x08,0x00,0x18,0x08,0x08,0x08,0x1c,0x00, // 105 i
0x00,0x02,0x00,0x02,0x02,0x02,0x02,0x22,0x1c, // 106 j
0x00,0x20,0x20,0x24,0x28,0x34,0x22,0x22,0x00, // 107 k
0x00,0x18,0x08,0x08,0x08,0x08,0x08,0x1c,0x00, // 108 l
0x00,0x00,0x00,0x34,0x2a,0x2a,0x2a,0x2a,0x00, // 109 m
0x00,0x00,0x00,0x3c,0x22,0x22,0x22,0x22,0x00, // 110 n
0x00,0x00,0x00,0x1c,0x22,0x22,0x22,0x1c,0x00, // 111 o
0x00,0x00,0x00,0x3c,0x22,0x22,0x3c,0x20,0x20, // 112 p
0x00,0x00,0x00,0x1e,0x22,0x22,0x1e,0x02,0x02, // 113 q
0x00,0x00,0x00,0x2c,0x32,0x20,0x20,0x20,0x00, // 114 r
0x00,0x00,0x00,0x1c,0x20,0x1c,0x02,0x1c,0x00, // 115 s
0x00,0x10,0x10,0x38,0x10,0x10,0x12,0x0c,0x00, // 116 t
0x00,0x00,0x00,0x22,0x22,0x22,0x26,0x1a,0x00, // 117 u
0x00,0x00,0x00,0x22,0x22,0x22,0x14,0x08,0x00, // 118 v
0x00,0x00,0x00,0x22,0x22,0x2a,0x2a,0x14,0x00, // 119 w
0x00,0x00,0x00,0x22,0x14,0x08,0x14,0x22,0x00, // 120 x
0x00,0x00,0x00,0x22,0x22,0x22,0x1e,0x02,0x1c, // 121 y
0x00,0x00,0x00,0x3e,0x04,0x08,0x10,0x3e,0x00, // 122 z
0x00,0x0c,0x10,0x10,0x20,0x10,0x10,0x0c,0x00, // 123 {
0x00,0x08,0x08,0x08,0x00,0x08,0x08,0x08,0x00, // 124 |
0x00,0x18,0x04,0x04,0x02,0x04,0x04,0x18,0x00, // 125 }
0x00,0x30,0x49,0x06,0x00,0x00,0x00,0x00,0x00, // 126 ~
];

// ============================================================
// Worm sprite bitmaps — from DATA statements (lines 20000-20140)
// 14 characters (a-n), 9 bytes each
// ============================================================
export const WORM_SPRITES = [
// a: straight vertical
0x5E,0x6E,0x7E,0x5E,0x6E,0x7E,0x5E,0x6E,0x7E,
// b: straight horizontal
0x00,0x00,0x00,0xBB,0xEF,0xFF,0x00,0x00,0x00,
// c: curve bottom/right
0x00,0x00,0x00,0x0B,0x3F,0x7F,0x5F,0x6E,0x7E,
// d: curve bottom/left
0x00,0x00,0x00,0xB0,0xEC,0xFE,0xDE,0x6E,0x7E,
// e: curve top/right
0x5E,0x6E,0x7F,0x7B,0x3F,0x0F,0x00,0x00,0x00,
// f: curve top/left
0x5E,0x6E,0xFE,0xBE,0xFC,0xF0,0x00,0x00,0x00,
// g: head from top (moving down)
0x5E,0x6E,0x7E,0x76,0xF9,0x89,0xF9,0x78,0x00,
// h: head from bottom (moving up)
0x00,0x78,0xF9,0x89,0xF9,0x76,0x7E,0x6E,0x7E,
// i: head from left (moving right)
0x00,0x00,0xFC,0xE7,0x7F,0x80,0xFC,0x00,0x00,
// j: head from right (moving left)
0x00,0x00,0x3F,0xE7,0xFE,0x01,0x3F,0x00,0x00,
// k: tail to bottom
0x10,0x10,0x18,0x18,0x38,0x38,0x3C,0x3C,0x7C,
// l: tail to top
0x3E,0x3C,0x3C,0x1C,0x1C,0x18,0x18,0x08,0x08,
// m: tail to left
0x00,0x00,0x00,0x07,0xFF,0x01,0x00,0x00,0x00,
// n: tail to right
0x00,0x00,0x00,0xC0,0x7F,0x80,0x00,0x00,0x00,
];

// ============================================================
// Screen — 80x25 character grid rendered on canvas
// ============================================================
export const COLS = 80, ROWS = 25, CHAR_W = 8, CHAR_H = 9, SCALE = 3;

export class Screen {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    canvas.width = COLS * CHAR_W * SCALE;
    canvas.height = ROWS * CHAR_H * SCALE;
    // Browser CSS handles display sizing; headless doesn't need it
    this.cells = [];
    for (let r = 0; r < ROWS; r++) {
      this.cells[r] = new Uint8Array(COLS);
    }
    this.curRow = 0;
    this.curCol = 0;
    this.charROM = new Array(256);
    this.origCharROM = new Array(256);
    for (let i = 0; i < 256; i++) {
      this.charROM[i] = new Uint8Array(9);
      this.origCharROM[i] = new Uint8Array(9);
    }
    for (let i = 32; i <= 126; i++) {
      const off = (i - 32) * 9;
      for (let j = 0; j < 9; j++) {
        this.charROM[i][j] = Z100_FONT_RAW[off + j];
        this.origCharROM[i][j] = Z100_FONT_RAW[off + j];
      }
    }
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.audioCtx = null;
  }

  loadCustomChars() {
    for (let i = 0; i < 14; i++) {
      const code = 97 + i;
      for (let j = 0; j < 9; j++) {
        this.charROM[code][j] = WORM_SPRITES[i * 9 + j];
      }
    }
  }

  restoreChars() {
    for (let i = 0; i < 256; i++) {
      for (let j = 0; j < 9; j++) {
        this.charROM[i][j] = this.origCharROM[i][j];
      }
    }
  }

  drawChar(row, col, charCode) {
    const x = col * CHAR_W * SCALE;
    const y = row * CHAR_H * SCALE;
    const glyph = this.charROM[charCode] || this.charROM[32];
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(x, y, CHAR_W * SCALE, CHAR_H * SCALE);
    this.ctx.fillStyle = '#33ff33';
    for (let py = 0; py < 9; py++) {
      const row_byte = glyph[py];
      for (let px = 0; px < 8; px++) {
        if ((row_byte >> (7 - px)) & 1) {
          this.ctx.fillRect(x + px * SCALE, y + py * SCALE, SCALE, SCALE);
        }
      }
    }
  }

  locate(row, col) {
    if (row !== undefined && row !== null) this.curRow = row - 1;
    if (col !== undefined && col !== null) this.curCol = col - 1;
  }

  printChar(ch) {
    const code = typeof ch === 'number' ? ch : ch.charCodeAt(0);
    if (code === 10 || code === 13) {
      this.curRow++;
      this.curCol = 0;
      this._scrollIfNeeded();
      return;
    }
    if (this.curCol >= COLS) {
      this.curCol = 0;
      this.curRow++;
      this._scrollIfNeeded();
    }
    this.cells[this.curRow][this.curCol] = code;
    this.drawChar(this.curRow, this.curCol, code);
    this.curCol++;
  }

  printStr(str) {
    for (let i = 0; i < str.length; i++) {
      this.printChar(str[i]);
    }
  }

  printNewline() {
    this.curRow++;
    this.curCol = 0;
    this._scrollIfNeeded();
  }

  _scrollIfNeeded() {
    if (this.curRow >= ROWS) {
      for (let r = 0; r < ROWS - 1; r++) {
        this.cells[r].set(this.cells[r + 1]);
      }
      this.cells[ROWS - 1].fill(32);
      this.curRow = ROWS - 1;
      this._redrawAll();
    }
  }

  _redrawAll() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const code = this.cells[r][c];
        if (code && code !== 32) {
          this.drawChar(r, c, code);
        }
      }
    }
  }

  cls() {
    for (let r = 0; r < ROWS; r++) this.cells[r].fill(0);
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.curRow = 0;
    this.curCol = 0;
  }

  screen(row, col) {
    const r = row - 1, c = col - 1;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return 0;
    return this.cells[r][c] || 32;
  }

  beep() {
    try {
      if (typeof AudioContext === 'undefined') return;
      if (!this.audioCtx) this.audioCtx = new AudioContext();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.15;
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.15);
    } catch(e) {}
  }

  // Get text content of a row (for debugging)
  getRowText(row) {
    let s = '';
    for (let c = 0; c < COLS; c++) {
      const code = this.cells[row][c];
      s += (code >= 32 && code <= 126) ? String.fromCharCode(code) : ' ';
    }
    return s;
  }

  // Dump entire screen as text (for debugging)
  dumpText() {
    const lines = [];
    for (let r = 0; r < ROWS; r++) {
      lines.push(this.getRowText(r));
    }
    return lines.join('\n');
  }
}

// ============================================================
// BASIC Tokenizer
// ============================================================
const KEYWORDS = new Set([
  'PRINT','LOCATE','IF','THEN','ELSE','GOTO','GOSUB','RETURN',
  'FOR','TO','NEXT','STEP','DIM','LET','CLS','BEEP','END','RUN',
  'ON','ERROR','RESUME','OPEN','CLOSE','INPUT','DEF','SEG',
  'PEEK','POKE','DATA','READ','RESTORE','NOT','AND','OR',
  'DEFINT','STRING$',
]);
const FUNCTIONS = new Set([
  'RND','INT','ASC','CHR$','STRING$','SCREEN','INKEY$','INPUT$',
  'CSRLIN','POS','LEFT$','RIGHT$','MID$','LEN','ABS','VAL','STR$',
]);

export function tokenize(line) {
  const tokens = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === ' ' || line[i] === '\t') { i++; continue; }
    // Comment — ' starts a comment to end of line (REM equivalent)
    if (line[i] === "'") break;
    if (line[i] === '"') {
      let s = '';
      i++;
      while (i < line.length && line[i] !== '"') {
        if (line[i] === '"' && line[i+1] === '"') { s += '"'; i += 2; }
        else { s += line[i]; i++; }
      }
      if (i < line.length) i++;
      tokens.push({type: 'STRING', value: s});
      continue;
    }
    if (line[i] === '&' && (line[i+1] === 'H' || line[i+1] === 'h')) {
      let hex = '';
      i += 2;
      while (i < line.length && /[0-9A-Fa-f]/.test(line[i])) { hex += line[i]; i++; }
      tokens.push({type: 'NUMBER', value: parseInt(hex, 16)});
      continue;
    }
    if (/[0-9]/.test(line[i]) || (line[i] === '.' && i+1 < line.length && /[0-9]/.test(line[i+1]))) {
      let num = '';
      while (i < line.length && /[0-9.]/.test(line[i])) { num += line[i]; i++; }
      if (i < line.length && line[i] === '!') { i++; }
      tokens.push({type: 'NUMBER', value: parseFloat(num)});
      continue;
    }
    if (line[i] === '<' && line[i+1] === '>') { tokens.push({type: 'OP', value: '<>'}); i+=2; continue; }
    if (line[i] === '<' && line[i+1] === '=') { tokens.push({type: 'OP', value: '<='}); i+=2; continue; }
    if (line[i] === '>' && line[i+1] === '=') { tokens.push({type: 'OP', value: '>='}); i+=2; continue; }
    if (line[i] === ':') { tokens.push({type: 'COLON'}); i++; continue; }
    if ('+-*/\\=<>(),;#'.includes(line[i])) {
      tokens.push({type: 'OP', value: line[i]}); i++; continue;
    }
    if (/[A-Za-z]/.test(line[i])) {
      let word = '';
      while (i < line.length && /[A-Za-z0-9.]/.test(line[i])) { word += line[i]; i++; }
      if (i < line.length && (line[i] === '$' || line[i] === '!' || line[i] === '%')) {
        word += line[i]; i++;
      }
      const upper = word.toUpperCase();
      if (KEYWORDS.has(upper) || FUNCTIONS.has(upper)) {
        tokens.push({type: 'KEYWORD', value: upper});
      } else {
        tokens.push({type: 'IDENT', value: word});
      }
      continue;
    }
    i++;
  }
  return tokens;
}

// ============================================================
// BASIC Parser
// ============================================================
export function parseSource(source) {
  const lines = new Map();
  const rawLines = source.split('\n');
  const dataValues = [];
  for (const raw of rawLines) {
    let match = raw.match(/^\s*(\d+)\s+(.*)$/);
    if (!match) match = raw.match(/^\s*(\d+)$/); // line number only (e.g. blank DATA line)
    if (!match) continue;
    const lineNum = parseInt(match[1]);
    const code = match[2];
    const dm = code.match(/DATA\s+(.+)/i);
    if (dm) {
      const vals = dm[1].split(',').map(v => {
        v = v.trim();
        if (v.startsWith('&H') || v.startsWith('&h')) return parseInt(v.substring(2), 16);
        if (v.startsWith('"') && v.endsWith('"')) return v.slice(1, -1);
        return isNaN(Number(v)) ? v : Number(v);
      });
      dataValues.push(...vals);
    }
    const tokens = tokenize(code);
    lines.set(lineNum, tokens);
  }
  return { lines, dataValues };
}

// ============================================================
// Expression Evaluator
// ============================================================
class ExprParser {
  constructor(tokens, pos, interp) {
    this.tokens = tokens;
    this.pos = pos;
    this.interp = interp;
  }
  peek() { return this.pos < this.tokens.length ? this.tokens[this.pos] : null; }
  next() { return this.tokens[this.pos++]; }
  expect(type, value) {
    const t = this.next();
    if (!t || t.type !== type || (value !== undefined && t.value !== value))
      throw new Error(`Expected ${type} ${value||''} but got ${t ? t.type + ' ' + t.value : 'EOF'}`);
    return t;
  }

  parseExpr() { return this.parseOr(); }

  parseOr() {
    let left = this.parseAnd();
    while (this.peek() && this.peek().type === 'KEYWORD' && this.peek().value === 'OR') {
      this.next();
      const right = this.parseAnd();
      left = (left | right) ? -1 : 0;
    }
    return left;
  }

  parseAnd() {
    let left = this.parseNot();
    while (this.peek() && this.peek().type === 'KEYWORD' && this.peek().value === 'AND') {
      this.next();
      const right = this.parseNot();
      left = (left & right);
    }
    return left;
  }

  parseNot() {
    if (this.peek() && this.peek().type === 'KEYWORD' && this.peek().value === 'NOT') {
      this.next();
      const val = this.parseComparison();
      return val ? 0 : -1;
    }
    return this.parseComparison();
  }

  parseComparison() {
    let left = this.parseAddSub();
    while (this.peek() && this.peek().type === 'OP' && ['=','<>','<','>','<=','>='].includes(this.peek().value)) {
      const op = this.next().value;
      const right = this.parseAddSub();
      switch(op) {
        case '=': left = (left === right) ? -1 : 0; break;
        case '<>': left = (left !== right) ? -1 : 0; break;
        case '<': left = (left < right) ? -1 : 0; break;
        case '>': left = (left > right) ? -1 : 0; break;
        case '<=': left = (left <= right) ? -1 : 0; break;
        case '>=': left = (left >= right) ? -1 : 0; break;
      }
    }
    return left;
  }

  parseAddSub() {
    let left = this.parseMulDiv();
    while (this.peek() && this.peek().type === 'OP' && (this.peek().value === '+' || this.peek().value === '-')) {
      const op = this.next().value;
      const right = this.parseMulDiv();
      if (op === '+') {
        if (typeof left === 'string' || typeof right === 'string') left = String(left) + String(right);
        else left = left + right;
      } else {
        left = left - right;
      }
    }
    return left;
  }

  parseMulDiv() {
    let left = this.parseUnary();
    while (this.peek() && this.peek().type === 'OP' && (this.peek().value === '*' || this.peek().value === '/' || this.peek().value === '\\')) {
      const op = this.next().value;
      const right = this.parseUnary();
      if (op === '*') left = left * right;
      else if (op === '/') left = right !== 0 ? left / right : 0;
      else left = Math.floor(left / right);
    }
    return left;
  }

  parseUnary() {
    if (this.peek() && this.peek().type === 'OP' && this.peek().value === '-') {
      this.next(); return -this.parsePrimary();
    }
    if (this.peek() && this.peek().type === 'OP' && this.peek().value === '+') {
      this.next(); return this.parsePrimary();
    }
    return this.parsePrimary();
  }

  parsePrimary() {
    const t = this.peek();
    if (!t) throw new Error('Unexpected end of expression');
    if (t.type === 'NUMBER') { this.next(); return t.value; }
    if (t.type === 'STRING') { this.next(); return t.value; }
    if (t.type === 'OP' && t.value === '(') {
      this.next();
      const val = this.parseExpr();
      if (this.peek() && this.peek().type === 'OP' && this.peek().value === ')') this.next();
      return val;
    }
    if (t.type === 'KEYWORD') {
      const fn = t.value;
      switch(fn) {
        case 'RND': {
          this.next();
          if (this.peek() && this.peek().type === 'OP' && this.peek().value === '(') {
            this.next(); this.parseExpr();
            if (this.peek() && this.peek().type === 'OP' && this.peek().value === ')') this.next();
          }
          return Math.random();
        }
        case 'INT': {
          this.next(); this.expect('OP', '(');
          const v = this.parseExpr(); this.expect('OP', ')');
          return Math.floor(v);
        }
        case 'ASC': {
          this.next(); this.expect('OP', '(');
          const s = this.parseExpr(); this.expect('OP', ')');
          return typeof s === 'string' ? s.charCodeAt(0) : 0;
        }
        case 'CHR$': {
          this.next(); this.expect('OP', '(');
          const n = this.parseExpr(); this.expect('OP', ')');
          return String.fromCharCode(n);
        }
        case 'STRING$': {
          this.next(); this.expect('OP', '(');
          const count = this.parseExpr(); this.expect('OP', ',');
          const ch = this.parseExpr(); this.expect('OP', ')');
          const c = typeof ch === 'string' ? ch[0] : String.fromCharCode(ch);
          return c.repeat(Math.max(0, count));
        }
        case 'SCREEN': {
          this.next(); this.expect('OP', '(');
          const r = this.parseExpr(); this.expect('OP', ',');
          const c = this.parseExpr(); this.expect('OP', ')');
          return this.interp.screen.screen(r, c);
        }
        case 'INKEY$': {
          this.next();
          return this.interp.readKey();
        }
        case 'INPUT$': {
          this.next(); this.expect('OP', '(');
          const n = this.parseExpr(); this.expect('OP', ')');
          this.interp._waitForInput = n;
          return '';
        }
        case 'CSRLIN': {
          this.next();
          return this.interp.screen.curRow + 1;
        }
        case 'POS': {
          this.next(); this.expect('OP', '(');
          this.parseExpr(); this.expect('OP', ')');
          return this.interp.screen.curCol + 1;
        }
        case 'LEN': {
          this.next(); this.expect('OP', '(');
          const s = this.parseExpr(); this.expect('OP', ')');
          return typeof s === 'string' ? s.length : 0;
        }
        case 'LEFT$': {
          this.next(); this.expect('OP', '(');
          const s = String(this.parseExpr()); this.expect('OP', ',');
          const n = this.parseExpr(); this.expect('OP', ')');
          return s.substring(0, n);
        }
        case 'RIGHT$': {
          this.next(); this.expect('OP', '(');
          const s = String(this.parseExpr()); this.expect('OP', ',');
          const n = this.parseExpr(); this.expect('OP', ')');
          return s.substring(s.length - n);
        }
        case 'MID$': {
          this.next(); this.expect('OP', '(');
          const s = String(this.parseExpr()); this.expect('OP', ',');
          const start = this.parseExpr();
          let len = s.length;
          if (this.peek() && this.peek().type === 'OP' && this.peek().value === ',') {
            this.next(); len = this.parseExpr();
          }
          this.expect('OP', ')');
          return s.substring(start - 1, start - 1 + len);
        }
        case 'ABS': {
          this.next(); this.expect('OP', '(');
          const v = this.parseExpr(); this.expect('OP', ')');
          return Math.abs(v);
        }
        case 'VAL': {
          this.next(); this.expect('OP', '(');
          const s = this.parseExpr(); this.expect('OP', ')');
          return parseFloat(s) || 0;
        }
        case 'STR$': {
          this.next(); this.expect('OP', '(');
          const v = this.parseExpr(); this.expect('OP', ')');
          return String(v);
        }
        case 'PEEK': {
          this.next(); this.expect('OP', '(');
          const addr = this.parseExpr(); this.expect('OP', ')');
          return this.interp.peek(addr);
        }
        case 'NOT': {
          this.next();
          const val = this.parsePrimary();
          return val ? 0 : -1;
        }
      }
    }
    if (t.type === 'IDENT') {
      const name = t.value;
      this.next();
      if (this.peek() && this.peek().type === 'OP' && this.peek().value === '(') {
        this.next();
        const indices = [this.parseExpr()];
        while (this.peek() && this.peek().type === 'OP' && this.peek().value === ',') {
          this.next();
          indices.push(this.parseExpr());
        }
        if (this.peek() && this.peek().type === 'OP' && this.peek().value === ')') this.next();
        return this.interp.getArray(name, indices);
      }
      return this.interp.getVar(name);
    }
    throw new Error(`Unexpected token: ${t.type} ${t.value}`);
  }
}

// ============================================================
// BASIC Interpreter
// ============================================================
export class Interpreter {
  constructor(screen, source) {
    this.screen = screen;
    this._originalSource = source;
    const parsed = parseSource(source);
    this.lineMap = parsed.lines;
    this.dataValues = parsed.dataValues;
    this.lineNumbers = [...this.lineMap.keys()].sort((a,b) => a - b);
    this.vars = {};
    this.arrays = {};
    this.gosubStack = [];
    this.forStack = [];
    this.dataPointer = 0;
    this.keyBuffer = [];
    this.running = false;
    this.pcIndex = 0;
    this.stmtOffset = 0;
    this._waitForInput = 0;
    this._inputResolve = null;
    this.errorHandler = 0;
    this.resumeLine = 0;
    this.fileChannels = {};
    this.defSegBase = 0;
    this._customCharsLoaded = false;
    this._delayMs = 5;
    this._stepBudget = 500;
    // localStorage shim for headless
    this._storage = (typeof localStorage !== 'undefined') ? localStorage : {};
    // Debug hooks
    this.onStep = null;    // function(lineNum, stmtOffset) — called before each line
    this.onError = null;   // function(lineNum, error) — called on errors
    this.breakpoints = new Set(); // set of BASIC line numbers to break on
    this._breakHit = false;
  }

  // Inject a keypress (called externally by browser or test harness)
  injectKey(ch) {
    this.keyBuffer.push(ch);
    if (this._inputResolve) {
      this._inputResolve();
      this._inputResolve = null;
    }
  }

  // Map browser key event to BASIC character
  static keyEventToChar(e) {
    switch(e.key) {
      case 'ArrowLeft':  return String.fromCharCode(29);
      case 'ArrowRight': return String.fromCharCode(28);
      case 'ArrowUp':    return String.fromCharCode(30);
      case 'ArrowDown':  return String.fromCharCode(31);
      case 'Enter':      return String.fromCharCode(13);
      case 'Backspace':  return String.fromCharCode(8);
      default:
        if (e.key.length === 1) return e.key;
        return null;
    }
  }

  getVar(name) {
    const key = name.toUpperCase();
    if (key in this.vars) return this.vars[key];
    return key.endsWith('$') ? '' : 0;
  }

  setVar(name, value) {
    const key = name.toUpperCase();
    if (!key.endsWith('$') && !key.endsWith('!') && typeof value === 'number') {
      value = Math.trunc(value);
    }
    this.vars[key] = value;
  }

  getArray(name, indices) {
    const key = name.toUpperCase();
    const arr = this.arrays[key];
    if (!arr) return key.endsWith('$') ? '' : 0;
    if (indices.length === 1) return arr[indices[0]] ?? (key.endsWith('$') ? '' : 0);
    if (indices.length === 2) {
      const row = arr[indices[0]];
      return row ? (row[indices[1]] ?? (key.endsWith('$') ? '' : 0)) : (key.endsWith('$') ? '' : 0);
    }
    return 0;
  }

  setArray(name, indices, value) {
    const key = name.toUpperCase();
    if (!this.arrays[key]) this.arrays[key] = {};
    if (indices.length === 1) {
      this.arrays[key][indices[0]] = value;
    } else if (indices.length === 2) {
      if (!this.arrays[key][indices[0]]) this.arrays[key][indices[0]] = {};
      this.arrays[key][indices[0]][indices[1]] = value;
    }
  }

  dimArray(name, dims) {
    const key = name.toUpperCase();
    this.arrays[key] = {};
  }

  readKey() {
    return this.keyBuffer.length > 0 ? this.keyBuffer.shift() : '';
  }

  peek(addr) { return 0; }

  findLineIndex(lineNum) {
    const idx = this.lineNumbers.indexOf(lineNum);
    if (idx === -1) throw new Error(`Line ${lineNum} not found`);
    return idx;
  }

  // Get current BASIC line number
  currentLine() {
    if (this.pcIndex < this.lineNumbers.length) return this.lineNumbers[this.pcIndex];
    return -1;
  }

  // --- Async run (browser) ---
  run() {
    this.running = true;
    this.pcIndex = 0;
    this.stmtOffset = 0;
    this._runLoop();
  }

  _runLoop() {
    if (!this.running) return;
    let budget = this._stepBudget;
    try {
      while (budget-- > 0 && this.running) {
        if (this.pcIndex >= this.lineNumbers.length) {
          this.running = false;
          return;
        }
        const lineNum = this.lineNumbers[this.pcIndex];

        // Breakpoint check
        if (this.breakpoints.has(lineNum) && this.stmtOffset === 0) {
          this._breakHit = true;
          return; // pause — caller must resume
        }

        // Debug step hook
        if (this.onStep) this.onStep(lineNum, this.stmtOffset);

        if (this._waitForInput > 0) {
          if (this.keyBuffer.length >= this._waitForInput) {
            let result = '';
            for (let i = 0; i < this._waitForInput; i++) result += this.keyBuffer.shift();
            this._waitForInput = 0;
            // Complete the pending assignment with the collected input
            if (this._pendingAssign) {
              const pa = this._pendingAssign;
              this._pendingAssign = null;
              if (pa.isArray) {
                this.setArray(pa.name, pa.indices, result);
              } else {
                this.setVar(pa.name, result);
              }
            }
            // Advance past the statement that was waiting
            this.stmtOffset++;
            const stmts = this._splitStatements(this.lineMap.get(lineNum));
            if (this.stmtOffset >= stmts.length) {
              this.pcIndex++;
              this.stmtOffset = 0;
            }
            continue;
          } else {
            this._scheduleWait();
            return;
          }
        }

        const result = this._executeLine(lineNum, this.lineMap.get(lineNum));
        if (result === 'YIELD') {
          setTimeout(() => this._runLoop(), this._delayMs);
          return;
        }
        if (result === 'WAIT_INPUT') {
          this._scheduleWait();
          return;
        }
        if (result === 'RESTART') {
          this.vars = {};
          this.arrays = {};
          this.gosubStack = [];
          this.forStack = [];
          this.dataPointer = 0;
          this.keyBuffer = [];
          this.pcIndex = 0;
          this.stmtOffset = 0;
          this.errorHandler = 0;
          this.fileChannels = {};
          this._customCharsLoaded = false;
          this.screen.restoreChars();
          setTimeout(() => this._runLoop(), 0);
          return;
        }
      }
    } catch(e) {
      if (this.errorHandler > 0) {
        this.resumeLine = this.lineNumbers[this.pcIndex];
        this.pcIndex = this.findLineIndex(this.errorHandler);
        this.stmtOffset = 0;
      } else {
        const lineNum = this.lineNumbers[this.pcIndex];
        if (this.onError) this.onError(lineNum, e);
        console.error(`BASIC Error at line ${lineNum}:`, e.message);
        this.running = false;
        return;
      }
    }
    if (this.running) {
      setTimeout(() => this._runLoop(), 0);
    }
  }

  _scheduleWait() {
    const check = () => {
      if (this.keyBuffer.length >= (this._waitForInput || 1)) {
        // Don't consume input here — let _runLoop's _waitForInput handler do it
        // so it can also complete the pending assignment and advance stmtOffset
        this._runLoop();
      } else {
        this._inputResolve = () => {
          clearTimeout(tid);
          setTimeout(check, 0);
        };
        var tid = setTimeout(check, 50);
      }
    };
    check();
  }

  // --- Synchronous step (headless/debug) ---
  // Execute exactly n BASIC lines. Returns 'ok', 'ended', 'waiting', 'breakpoint', or 'error'
  runSteps(n) {
    for (let i = 0; i < n; i++) {
      if (!this.running) return 'ended';
      if (this.pcIndex >= this.lineNumbers.length) { this.running = false; return 'ended'; }

      const lineNum = this.lineNumbers[this.pcIndex];

      if (this.breakpoints.has(lineNum) && this.stmtOffset === 0 && !this._breakHit) {
        this._breakHit = true;
        return 'breakpoint';
      }
      this._breakHit = false;

      if (this.onStep) this.onStep(lineNum, this.stmtOffset);

      if (this._waitForInput > 0) {
        if (this.keyBuffer.length >= this._waitForInput) {
          let result = '';
          for (let j = 0; j < this._waitForInput; j++) result += this.keyBuffer.shift();
          this._waitForInput = 0;
          if (this._pendingAssign) {
            const pa = this._pendingAssign;
            this._pendingAssign = null;
            if (pa.isArray) {
              this.setArray(pa.name, pa.indices, result);
            } else {
              this.setVar(pa.name, result);
            }
          }
          this.stmtOffset++;
          const stmts = this._splitStatements(this.lineMap.get(lineNum));
          if (this.stmtOffset >= stmts.length) {
            this.pcIndex++;
            this.stmtOffset = 0;
          }
          continue;
        } else {
          return 'waiting';
        }
      }

      try {
        const result = this._executeLine(lineNum, this.lineMap.get(lineNum));
        if (result === 'WAIT_INPUT') return 'waiting';
        if (result === 'RESTART') {
          this.vars = {};
          this.arrays = {};
          this.gosubStack = [];
          this.forStack = [];
          this.dataPointer = 0;
          this.keyBuffer = [];
          this.pcIndex = 0;
          this.stmtOffset = 0;
          this.errorHandler = 0;
          this.fileChannels = {};
          this._customCharsLoaded = false;
          this.screen.restoreChars();
          continue;
        }
      } catch(e) {
        if (this.errorHandler > 0) {
          this.resumeLine = this.lineNumbers[this.pcIndex];
          this.pcIndex = this.findLineIndex(this.errorHandler);
          this.stmtOffset = 0;
        } else {
          if (this.onError) this.onError(lineNum, e);
          this.running = false;
          return 'error';
        }
      }
    }
    return this.running ? 'ok' : 'ended';
  }

  // --- Line execution ---

  _executeLine(lineNum, tokens) {
    if (tokens.length === 0) { this.pcIndex++; this.stmtOffset = 0; return; }

    // Handle special lines: DEF SEG / PEEK / POKE for character ROM
    if (lineNum >= 11000 && lineNum <= 11040) {
      const result = this._handleCharROMInit(lineNum);
      this.pcIndex++;
      this.stmtOffset = 0;
      return result;
    }
    if (lineNum >= 12000 && lineNum <= 12040) {
      const result = this._handleCharROMRestore(lineNum);
      this.pcIndex++;
      this.stmtOffset = 0;
      return result;
    }

    // Special case: line 4000 is the game's input/delay loop
    // FOR J=1 TO S: I$=INKEY$: IF I$<>""THEN 4500 ELSE NEXT: RETURN
    // Convert to a real timed yield instead of a hot loop
    if (lineNum === 4000) {
      return this._handleDelayLoop();
    }

    const stmts = this._splitStatements(tokens);

    while (this.stmtOffset < stmts.length) {
      const stmt = stmts[this.stmtOffset];
      if (stmt.length === 0) { this.stmtOffset++; continue; }
      const result = this._executeStatement(stmt, lineNum, stmts);
      if (result === 'YIELD' || result === 'WAIT_INPUT' || result === 'RESTART') return result;
      if (result === 'JUMPED') return;
      this.stmtOffset++;
    }
    this.pcIndex++;
    this.stmtOffset = 0;
  }

  _splitStatements(tokens) {
    const stmts = [[]];
    let inIfBody = false;
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (t.type === 'KEYWORD' && (t.value === 'THEN' || t.value === 'ELSE')) {
        inIfBody = true;
        stmts[stmts.length - 1].push(t);
      } else if (t.type === 'COLON' && !inIfBody) {
        stmts.push([]);
      } else {
        stmts[stmts.length - 1].push(t);
      }
    }
    return stmts;
  }

  _executeStatement(tokens, lineNum, allStmts) {
    if (tokens.length === 0) return;
    const first = tokens[0];

    if (first.type === 'IDENT' && first.value === "'") return;
    if (first.type === 'STRING' && tokens.length === 1) return;

    if (first.type === 'KEYWORD') {
      switch(first.value) {
        case 'PRINT': return this._execPrint(tokens, lineNum);
        case 'LOCATE': return this._execLocate(tokens);
        case 'CLS': this.screen.cls(); return;
        case 'BEEP': this.screen.beep(); return;
        case 'GOTO': return this._execGoto(tokens);
        case 'GOSUB': return this._execGosub(tokens, lineNum);
        case 'RETURN': return this._execReturn();
        case 'FOR': return this._execFor(tokens, lineNum);
        case 'NEXT': return this._execNext(tokens);
        case 'IF': return this._execIf(tokens, lineNum, allStmts);
        case 'ON': return this._execOn(tokens, lineNum);
        case 'DIM': return this._execDim(tokens);
        case 'DEF': return;
        case 'DEFINT': return;
        case 'DATA': return;
        case 'READ': return this._execRead(tokens);
        case 'RESTORE': this.dataPointer = 0; return;
        case 'POKE': return;
        case 'OPEN': return this._execOpen(tokens);
        case 'CLOSE': return this._execClose(tokens);
        case 'INPUT': return this._execInput(tokens, lineNum);
        case 'END': this.running = false; return;
        case 'RUN': return 'RESTART';
        case 'RESUME': return this._execResume(tokens);
        case 'STRING$': break;
      }
    }

    if (first.type === 'IDENT') {
      return this._execAssignment(tokens);
    }

    if (first.type === 'KEYWORD' && first.value === 'LET') {
      return this._execAssignment(tokens.slice(1));
    }
  }

  _execPrint(tokens, lineNum) {
    if (tokens[1] && tokens[1].type === 'OP' && tokens[1].value === '#') {
      return this._execPrintFile(tokens);
    }
    const ep = new ExprParser(tokens, 1, this);
    let output = '';
    let suppressNewline = false;
    while (ep.pos < ep.tokens.length) {
      const t = ep.peek();
      if (!t) break;
      if (t.type === 'OP' && t.value === ';') {
        ep.next(); suppressNewline = true; continue;
      }
      if (t.type === 'OP' && t.value === ',') {
        ep.next();
        const col = this.screen.curCol;
        const nextTab = (Math.floor(col / 14) + 1) * 14;
        output += ' '.repeat(Math.max(1, nextTab - col));
        suppressNewline = true; continue;
      }
      suppressNewline = false;
      try {
        const val = ep.parseExpr();
        if (typeof val === 'number') {
          output += (val >= 0 ? ' ' : '') + val + ' ';
        } else {
          output += val;
        }
      } catch(e) { break; }
    }
    this.screen.printStr(output);
    if (!suppressNewline) this.screen.printNewline();
  }

  _execLocate(tokens) {
    const ep = new ExprParser(tokens, 1, this);
    let row = null, col = null;
    if (ep.peek() && ep.peek().type === 'OP' && ep.peek().value === ',') {
      ep.next(); col = ep.parseExpr();
    } else {
      row = ep.parseExpr();
      if (ep.peek() && ep.peek().type === 'OP' && ep.peek().value === ',') {
        ep.next();
        if (ep.peek() && ep.peek().type !== 'OP') {
          col = ep.parseExpr();
        }
      }
    }
    this.screen.locate(row, col);
  }

  _execGoto(tokens) {
    const target = tokens[1].value;
    this.pcIndex = this.findLineIndex(target);
    this.stmtOffset = 0;
    return 'JUMPED';
  }

  _execGosub(tokens, lineNum) {
    const ep = new ExprParser(tokens, 1, this);
    const target = ep.parseExpr();
    this.gosubStack.push({ pcIndex: this.pcIndex, stmtOffset: this.stmtOffset + 1 });
    this.pcIndex = this.findLineIndex(target);
    this.stmtOffset = 0;
    return 'JUMPED';
  }

  _execReturn() {
    if (this.gosubStack.length === 0) throw new Error('RETURN without GOSUB');
    const ret = this.gosubStack.pop();
    this.pcIndex = ret.pcIndex;
    this.stmtOffset = ret.stmtOffset;
    // If GOSUB was inside a THEN body, execute remaining statements
    if (ret.thenContinuation) {
      const cont = ret.thenContinuation;
      for (const stmt of cont.stmts) {
        if (stmt.length === 0) continue;
        const result = this._executeStatement(stmt, cont.lineNum, cont.stmts);
        if (result === 'JUMPED' || result === 'YIELD' || result === 'WAIT_INPUT' || result === 'RESTART') return result;
      }
    }
    const lineNum = this.lineNumbers[this.pcIndex];
    const tokens = this.lineMap.get(lineNum);
    const stmts = this._splitStatements(tokens);
    if (this.stmtOffset >= stmts.length) {
      this.pcIndex++;
      this.stmtOffset = 0;
    }
    return 'JUMPED';
  }

  _execFor(tokens, lineNum) {
    const varName = tokens[1].value;
    const ep = new ExprParser(tokens, 3, this);
    const start = ep.parseExpr();
    ep.expect('KEYWORD', 'TO');
    const end = ep.parseExpr();
    let step = 1;
    if (ep.peek() && ep.peek().type === 'KEYWORD' && ep.peek().value === 'STEP') {
      ep.next(); step = ep.parseExpr();
    }
    this.setVar(varName, start);
    this.forStack.push({
      varName: varName.toUpperCase(),
      limit: end, step: step,
      pcIndex: this.pcIndex, stmtOffset: this.stmtOffset + 1,
      lineNum: lineNum
    });
  }

  _execNext(tokens) {
    const varName = tokens.length > 1 ? tokens[1].value.toUpperCase() : null;
    let forIdx = this.forStack.length - 1;
    if (varName) {
      while (forIdx >= 0 && this.forStack[forIdx].varName !== varName) forIdx--;
    }
    if (forIdx < 0) throw new Error(`NEXT without FOR${varName ? ' ' + varName : ''}`);
    const forInfo = this.forStack[forIdx];
    let current = this.getVar(forInfo.varName);
    current += forInfo.step;
    this.setVar(forInfo.varName, current);
    const done = forInfo.step > 0 ? current > forInfo.limit : current < forInfo.limit;
    if (done) {
      this.forStack.splice(forIdx, 1);
    } else {
      this.pcIndex = forInfo.pcIndex;
      this.stmtOffset = forInfo.stmtOffset;
      const lineTokens = this.lineMap.get(this.lineNumbers[this.pcIndex]);
      const stmts = this._splitStatements(lineTokens);
      if (this.stmtOffset >= stmts.length) {
        this.pcIndex++;
        this.stmtOffset = 0;
      }
      return 'JUMPED';
    }
  }

  _execIf(tokens, lineNum, allStmts) {
    const ep = new ExprParser(tokens, 1, this);
    const condition = ep.parseExpr();
    let thenPos = ep.pos;
    while (thenPos < tokens.length && !(tokens[thenPos].type === 'KEYWORD' && tokens[thenPos].value === 'THEN')) thenPos++;
    if (thenPos >= tokens.length) return;
    thenPos++;
    let elsePos = -1;
    let depth = 0;
    for (let i = thenPos; i < tokens.length; i++) {
      if (tokens[i].type === 'KEYWORD' && tokens[i].value === 'IF') depth++;
      if (tokens[i].type === 'KEYWORD' && tokens[i].value === 'ELSE') {
        if (depth === 0) { elsePos = i; break; }
        depth--;
      }
    }
    if (condition) {
      const thenTokens = elsePos >= 0 ? tokens.slice(thenPos, elsePos) : tokens.slice(thenPos);
      return this._executeThenElse(thenTokens, lineNum);
    } else {
      if (elsePos >= 0) {
        const elseTokens = tokens.slice(elsePos + 1);
        return this._executeThenElse(elseTokens, lineNum);
      }
    }
  }

  _executeThenElse(tokens, lineNum) {
    if (tokens.length === 0) return;
    if (tokens.length === 1 && tokens[0].type === 'NUMBER') {
      this.pcIndex = this.findLineIndex(tokens[0].value);
      this.stmtOffset = 0;
      return 'JUMPED';
    }
    const stmts = [[]];
    for (const t of tokens) {
      if (t.type === 'COLON') stmts.push([]);
      else stmts[stmts.length - 1].push(t);
    }
    for (let si = 0; si < stmts.length; si++) {
      const stmt = stmts[si];
      if (stmt.length === 0) continue;
      // Special handling: GOSUB inside THEN body needs to save remaining
      // statements so they execute after RETURN
      if (stmt[0].type === 'KEYWORD' && stmt[0].value === 'GOSUB') {
        const remaining = stmts.slice(si + 1);
        const ep = new ExprParser(stmt, 1, this);
        const target = ep.parseExpr();
        this.gosubStack.push({
          pcIndex: this.pcIndex,
          stmtOffset: this.stmtOffset,
          thenContinuation: remaining.length > 0 ? { stmts: remaining, lineNum } : null
        });
        this.pcIndex = this.findLineIndex(target);
        this.stmtOffset = 0;
        return 'JUMPED';
      }
      const result = this._executeStatement(stmt, lineNum, stmts);
      if (result === 'JUMPED' || result === 'YIELD' || result === 'WAIT_INPUT' || result === 'RESTART') return result;
    }
  }

  _execOn(tokens, lineNum) {
    if (tokens[1] && tokens[1].type === 'KEYWORD' && tokens[1].value === 'ERROR') {
      const ep = new ExprParser(tokens, 3, this);
      const target = ep.parseExpr();
      this.errorHandler = target;
      return;
    }
    const ep = new ExprParser(tokens, 1, this);
    const val = ep.parseExpr();
    if (ep.peek() && ep.peek().type === 'KEYWORD' && ep.peek().value === 'GOTO') {
      ep.next();
      const targets = [];
      targets.push(ep.parseExpr());
      while (ep.peek() && ep.peek().type === 'OP' && ep.peek().value === ',') {
        ep.next();
        targets.push(ep.parseExpr());
      }
      const idx = Math.trunc(val) - 1;
      if (idx >= 0 && idx < targets.length) {
        this.pcIndex = this.findLineIndex(targets[idx]);
        this.stmtOffset = 0;
        return 'JUMPED';
      }
    }
  }

  _execDim(tokens) {
    let i = 1;
    while (i < tokens.length) {
      if (tokens[i].type === 'IDENT') {
        const name = tokens[i].value;
        i++;
        if (tokens[i] && tokens[i].type === 'OP' && tokens[i].value === '(') {
          i++;
          const dims = [];
          while (i < tokens.length && !(tokens[i].type === 'OP' && tokens[i].value === ')')) {
            if (tokens[i].type === 'OP' && tokens[i].value === ',') { i++; continue; }
            const ep = new ExprParser(tokens, i, this);
            dims.push(ep.parseExpr());
            i = ep.pos;
          }
          if (tokens[i] && tokens[i].value === ')') i++;
          this.dimArray(name, dims);
        }
      }
      if (tokens[i] && tokens[i].type === 'OP' && tokens[i].value === ',') i++;
      else i++;
    }
  }

  _execRead(tokens) {
    let i = 1;
    while (i < tokens.length) {
      if (tokens[i].type === 'IDENT') {
        const name = tokens[i].value;
        const val = this.dataValues[this.dataPointer++];
        this.setVar(name, val !== undefined ? val : 0);
      }
      i++;
      if (tokens[i] && tokens[i].type === 'OP' && tokens[i].value === ',') i++;
    }
  }

  _execResume(tokens) {
    if (tokens.length > 1 && tokens[1].type === 'NUMBER') {
      this.pcIndex = this.findLineIndex(tokens[1].value);
    } else if (this.resumeLine) {
      this.pcIndex = this.findLineIndex(this.resumeLine);
    }
    this.stmtOffset = 0;
    this.errorHandler = 0;
    return 'JUMPED';
  }

  _execAssignment(tokens) {
    if (tokens.length === 0) return;
    const name = tokens[0].value;
    if (tokens[1] && tokens[1].type === 'OP' && tokens[1].value === '(') {
      const ep = new ExprParser(tokens, 2, this);
      const indices = [ep.parseExpr()];
      while (ep.peek() && ep.peek().type === 'OP' && ep.peek().value === ',') {
        ep.next();
        indices.push(ep.parseExpr());
      }
      ep.expect('OP', ')');
      ep.expect('OP', '=');
      let val = ep.parseExpr();
      if (this._waitForInput > 0) {
        this._pendingAssign = { name, indices, isArray: true };
        return 'WAIT_INPUT';
      }
      if (this._inputResult !== undefined) {
        val = this._inputResult;
        this._inputResult = undefined;
      }
      this.setArray(name, indices, val);
      return;
    }
    const eqIdx = tokens.findIndex(t => t.type === 'OP' && t.value === '=');
    if (eqIdx < 0) return;
    const ep = new ExprParser(tokens, eqIdx + 1, this);
    let val = ep.parseExpr();
    if (this._waitForInput > 0) {
      this._pendingAssign = { name, isArray: false };
      return 'WAIT_INPUT';
    }
    if (this._inputResult !== undefined) {
      val = this._inputResult;
      this._inputResult = undefined;
    }
    this.setVar(name, val);
  }

  // --- File I/O (localStorage or shim) ---

  _storageGet(key) {
    if (this._storage.getItem) return this._storage.getItem(key);
    return this._storage[key] ?? null;
  }

  _storageSet(key, value) {
    if (this._storage.setItem) this._storage.setItem(key, value);
    else this._storage[key] = value;
  }

  _execOpen(tokens) {
    const ep = new ExprParser(tokens, 1, this);
    const mode = ep.parseExpr();
    ep.expect('OP', ',');
    if (ep.peek() && ep.peek().type === 'OP' && ep.peek().value === '#') ep.next();
    const channel = ep.parseExpr();
    ep.expect('OP', ',');
    const filename = ep.parseExpr();
    const key = 'WORM_' + filename;
    if (mode.toUpperCase() === 'I') {
      const data = this._storageGet(key);
      if (data === null) throw new Error('File not found: ' + filename);
      this.fileChannels[channel] = { mode: 'I', data: data, pos: 0 };
    } else {
      this.fileChannels[channel] = { mode: 'O', data: '', filename: key };
    }
  }

  _execClose(tokens) {
    for (const ch in this.fileChannels) {
      this._flushChannel(ch);
    }
    this.fileChannels = {};
  }

  _flushChannel(ch) {
    const fc = this.fileChannels[ch];
    if (fc && fc.mode === 'O') {
      this._storageSet(fc.filename, fc.data);
    }
  }

  _execPrintFile(tokens) {
    const ep = new ExprParser(tokens, 2, this);
    const channel = ep.parseExpr();
    ep.expect('OP', ',');
    const vals = [];
    while (ep.pos < ep.tokens.length) {
      vals.push(ep.parseExpr());
      if (ep.peek() && ep.peek().type === 'OP' && ep.peek().value === ',') ep.next();
      else break;
    }
    const fc = this.fileChannels[channel];
    if (fc && fc.mode === 'O') {
      fc.data += vals.join(',') + '\n';
    }
  }

  _execInput(tokens, lineNum) {
    if (tokens[1] && tokens[1].type === 'OP' && tokens[1].value === '#') {
      return this._execInputFile(tokens);
    }
  }

  _execInputFile(tokens) {
    const ep = new ExprParser(tokens, 2, this);
    const channel = ep.parseExpr();
    const fc = this.fileChannels[channel];
    if (!fc || fc.mode !== 'I') throw new Error('Channel not open for input');
    ep.expect('OP', ',');
    while (ep.pos < ep.tokens.length) {
      const t = ep.peek();
      if (!t || (t.type === 'OP' && t.value === ',')) { ep.next(); continue; }
      if (t.type !== 'IDENT') { ep.next(); continue; }
      const name = t.value;
      ep.next();
      let indices = null;
      if (ep.peek() && ep.peek().type === 'OP' && ep.peek().value === '(') {
        ep.next();
        indices = [ep.parseExpr()];
        while (ep.peek() && ep.peek().type === 'OP' && ep.peek().value === ',') {
          ep.next();
          indices.push(ep.parseExpr());
        }
        if (ep.peek() && ep.peek().type === 'OP' && ep.peek().value === ')') ep.next();
      }
      let val = this._readFileValue(fc);
      const isString = name.toUpperCase().endsWith('$');
      val = isString ? String(val) : (Number(val) || 0);
      if (indices) {
        this.setArray(name, indices, val);
      } else {
        this.setVar(name, val);
      }
      if (ep.peek() && ep.peek().type === 'OP' && ep.peek().value === ',') ep.next();
    }
  }

  _readFileValue(fc) {
    const data = fc.data;
    let val = '';
    while (fc.pos < data.length && (data[fc.pos] === '\n' || data[fc.pos] === '\r' || data[fc.pos] === ' ')) fc.pos++;
    if (fc.pos >= data.length) return '';
    while (fc.pos < data.length && data[fc.pos] !== ',' && data[fc.pos] !== '\n' && data[fc.pos] !== '\r') {
      val += data[fc.pos];
      fc.pos++;
    }
    if (fc.pos < data.length && data[fc.pos] === ',') fc.pos++;
    return val.trim();
  }

  // --- Character ROM special handling ---

  _handleCharROMInit(lineNum) {
    if (lineNum === 11040) {
      this.screen.loadCustomChars();
      this._customCharsLoaded = true;
    }
  }

  _handleCharROMRestore(lineNum) {
    if (lineNum === 12040) {
      this.screen.restoreChars();
    }
  }

  // Line 4000: game input/delay loop
  // Original: OD=ND:FOR J=1 TO S: I$=INKEY$: IF I$<>""THEN 4500 ELSE NEXT: RETURN
  // We set OD=ND, check for buffered input, then either:
  //   - if key available: jump to 4500 (direction handling)
  //   - if no key: yield for S*2ms then RETURN (continue game loop)
  _handleDelayLoop() {
    // Execute "OD=ND" (first statement before the FOR)
    this.setVar('OD', this.getVar('ND'));

    // Check for input
    const key = this.readKey();
    if (key) {
      // Key pressed — set I$ and jump to 4500 (key handler)
      this.setVar('I$', key);
      this.pcIndex = this.findLineIndex(4500);
      this.stmtOffset = 0;
      return 'JUMPED';
    }

    // No key — yield for a delay proportional to S, then RETURN
    const s = this.getVar('S') || 50;
    this._delayMs = Math.max(30, s * 6); // S=50 → 300ms, S=30 → 180ms, S=1 → 30ms
    // RETURN to caller
    if (this.gosubStack.length > 0) {
      const ret = this.gosubStack.pop();
      this.pcIndex = ret.pcIndex;
      this.stmtOffset = ret.stmtOffset;
      const stmts = this._splitStatements(this.lineMap.get(this.lineNumbers[this.pcIndex]));
      if (this.stmtOffset >= stmts.length) {
        this.pcIndex++;
        this.stmtOffset = 0;
      }
    } else {
      this.pcIndex++;
      this.stmtOffset = 0;
    }
    return 'YIELD';
  }
}

// ============================================================
// WORM.BAS source (embedded)
// ============================================================
export const WORM_SOURCE = `1 '            The Game of Worm
2 '
3 ' Based on Unix WORM.  Implemented on z-100 by Jan Wolter.
4 ' Set up score file by doing a RUN 10000 before playing.
5 '
6 ' HC()=Head Characters. TC()=Tail Characters.  S=Speed.  Z=Maximum Length.
7 ' E=Flag to allow eating Self.  AP=Probability of Ant  BC(,)=Body Characters.
8 ' AR,AC=Location of Ant.  WR(),WC()=Location of Worm
9 ' SC(),SN$()=Record score and name  SF$=Score file name.
10 DEFINT A-Z
11 Z=1800:SF$="WORM.DAT"
12 DIM WC(Z),WR(Z),WD(Z),SC(5),SN$(5),OC(126)
15 GOSUB 9000:GOSUB 8000: GOSUB 11000
50 A=0: M=1: GOSUB 6000: GOSUB 5000: GOSUB 7000
100 NR=WR(H)+DR:NC=WC(H)+DC:D=SCREEN(NR,NC)
130 LOCATE WR(H),WC(H):PRINT BC$(OD,ND);:LOCATE WR(T),WC(T):PRINT" ";:LOCATE NR,NC:PRINT HC$(ND);
140 WD(H)=ND:H=H+1: IF H>Z THEN H=0
150 T=T+1: IF T>Z THEN T=0
155 IF L>1 THEN LOCATE WR(T),WC(T):PRINT TC$(WD(T));
160 WC(H)=NC:WR(H)=NR
170 IF D=42 THEN A=0:D=INT(8*RND)+9:GOTO 3000
180 IF D<58 AND D>48 THEN D=D-48: GOTO 3000
190 IF (D>32 AND D<107) OR D=124 THEN 2000
290 GOSUB 4000:IF A=0 THEN 100
300 ON INT(RND*4+1) GOTO 310,320,330,340
310 BR = AR-1:BC=AC: GOTO 350
320 BR = AR+1:BC=AC: GOTO 350
330 BC = AC-1:BR=AR: GOTO 350
340 BC = AC+1:BR=AR
350 IF SCREEN(BR,BC)<>32 THEN 100 ELSE LOCATE AR,AC: PRINT" ";:LOCATE BR,BC:PRINT"*";:AR=BR:AC=BC:GOTO 100
1000 FR=INT(RND*23)+2:FC=INT(RND*78)+2:IF SCREEN(FR,FC)<>32 THEN 1000
1005 IF RND<AP! THEN A=1: AR=FR: AC=FC:LOCATE AR,AC:PRINT"*";: RETURN
1010 LOCATE FR,FC:PRINT CHR$( INT(RND*9)+49);:RETURN
2000 IF (NOT E)OR(D=45)OR(D=124)THEN BEEP:GOSUB 7000:IF MX>SC(RC) THEN 8500 ELSE 2500
2005 IF L<3 THEN 290
2010 MR=WR(T):MC=WC(T):L=L-1:T=T+1:IF T>Z THEN T=0
2020 IF ((MR<>NR)OR(MC<>NC))AND(L>2) THEN LOCATE MR,MC:PRINT" ";:GOTO 2010
2030 GOSUB 7000:GOTO 290
2500 FOR I=1 TO 100: I$=INKEY$: NEXT: IF INKEY$<>"" THEN 2500
2510 GOSUB 12000:GOSUB 3500
2520 LOCATE 12,32:PRINT"Want to play again";
2530 LOCATE 13,37:PRINT"(Y/N)?";
2540 I$=INPUT$(1):IF I$="N" OR I$="n" THEN CLS:END
2550 IF I$="y" OR I$="Y" THEN RUN ELSE BEEP: GOTO 2540
3000 L=L+D: FOR J=1 TO D: T=T-1: IF T<0 THEN T=Z
3010 WR(T)=1:WC(T)=18:WD(T)=5:NEXT:GOSUB 7000:GOSUB 1000: GOTO 290
3500 LOCATE 11,25:PRINT"+-----------------------------+";
3510 LOCATE 12,25:PRINT"|                             |";
3520 LOCATE 13,25:PRINT"|                             |";
3530 LOCATE 14,25:PRINT"+-----------------------------+";
3540 RETURN
4000 OD=ND:FOR J= 1 TO S: I$=INKEY$: IF I$<>""THEN 4500 ELSE NEXT: RETURN
4500 D=ASC(I$): IF D<32 THEN 4550 ELSE IF D<96 THEN 4590
4510 IF I$="h" THEN DR=0:DC=-1:ND=3:RETURN
4520 IF I$="k" THEN DR=-1:DC=0:ND=1:RETURN
4530 IF I$="j" THEN DR=1:DC=0:ND=2:RETURN
4540 IF I$="l" THEN DR=0:DC=1:ND=4:RETURN
4545 RETURN
4550 IF D=29 THEN DR=0:DC=-1:ND=3:RETURN
4560 IF D=28 THEN DR=0:DC=1:ND=4:RETURN
4570 IF D=30 THEN DR=-1:DC=0:ND=1:RETURN
4580 IF D=31 THEN DR=1:DC=0:ND=2:RETURN
4585 RETURN
4590 IF I$="4" THEN DR=0:DC=-1:ND=3:RETURN
4600 IF I$="8" THEN DR=-1:DC=0:ND=1:RETURN
4610 IF I$="2" THEN DR=1:DC=0:ND=2:RETURN
4620 IF I$="6" THEN DR=0:DC=1:ND=4:RETURN
4630 RETURN
5000 T=0:L=6:MX=L:H=T+L-1:ND=4:OD=4
5010 FOR I=T TO H:WR(I)=12:WC(I)=6+I:WD(I)=ND:NEXT
5020 LOCATE 12,6:PRINT TC$(ND);STRING$(L-2,BC$(ND,ND));HC$(ND);
5022 GOSUB 1000: GOSUB 7000
5025 I$=INKEY$
5030 I$=INKEY$:IF I$="" THEN I=RND: GOTO 5030: ELSE 4500
6000 CLS:PRINT:PRINT "+";STRING$(78,"-");"+";:LOCATE 25,1:PRINT "+";STRING$(78,"-");"+";
6010 FOR I=3 TO 24:LOCATE I,1:PRINT"|";:LOCATE,80:PRINT"|";:NEXT
6020 LOCATE 1,1:PRINT"THE GAME OF WORM";
6030 RETURN
7000 IF L>MX THEN MX=L
7010 LOCATE 1,30:PRINT"SCORE =";L;:IF E THEN PRINT"      MAX = ";MX;
7020 PRINT"   REC =";SC(RC);"   ";SN$(RC);"  ";
7030 RETURN
8000 GOSUB 10000:FOR I=1 TO 5: INPUT #1,SC(I),SN$(I):NEXT:CLOSE:RETURN
8500 SC(RC)=MX:GOSUB 12000:GOSUB 3500:LOCATE 12,29:PRINT"You've Set a new Record!":LOCATE 13,28:PRINT"Enter your initials: ";: GOSUB 9500: SN$(RC)=N$
8510 SC(RC)=MX: OPEN "O",1,SF$: FOR I=1 TO 5 :PRINT #1,SC(I),SN$(I):NEXT:CLOSE:GOTO 2500
9000 CLS: PRINT"The Game of Worm"
9001 PRINT "Select the Version You Want to Play:":PRINT
9002 PRINT"       (0) Print Help":PRINT "       (1) Original Worm"
9003 PRINT"       (2) Improved Worm":PRINT "       (3) At the Ant Farm"
9004 PRINT"       (4) SuperWorm":PRINT "       (5) SuperWorm At the Ant Farm"
9005 I$=INKEY$
9010 I$=INKEY$:IF I$="" THEN I=RND:GOTO 9010
9020 IF I$="1" THEN E=0: AP!=0!: S=50: RC=1: RETURN
9030 IF I$="2" THEN E=-1: AP!=.1: S=30: RC=2: RETURN
9040 IF I$="3" THEN E=-1: AP!=1!: S=40: RC=3: RETURN
9050 IF I$="4" THEN E=-1: AP!=.03: S=1: RC=4: RETURN
9060 IF I$="5" THEN E=-1: AP!=1!: S=1: RC=5: RETURN
9066 IF I$="0" THEN GOSUB 30000: GOTO 9000
9070 BEEP: GOTO 9010
9500 R=CSRLIN:C=POS(0):N=0:PRINT"....";:N$(1)=".":N$(2)=" ":N$(3)=" ":N$(4)=" "
9510 I$=INKEY$: IF I$=""THEN 9510
9520 IF ASC(I$)=8 THEN IF N=0 THEN 9510 ELSE N=N-1:C=C-1:GOTO 9510
9530 IF N=4 OR ASC(I$)=13 THEN N$=N$(0)+N$(1)+N$(2):RETURN
9540 IF I$<" " OR I$>"z" THEN 9510
9550 C=C+1:N=N+1:IF I$>="a" AND I$<="z" THEN I$=CHR$(ASC(I$)-32)
9560 LOCATE R,C-1:PRINT I$;:N$(N-1)=I$:GOTO 9510
9999 ' set up a new score file, with all previous scores zeroed.
10000 ON ERROR GOTO 10005: OPEN"I",1,SF$
10002 ON ERROR GOTO 0: RETURN
10005 FOR I=1 TO 5:SN$(I)="...":SC(I)=0:NEXT
10010 CLOSE:OPEN "O",1,SF$: FOR I=1 TO 5 :PRINT #1,SC(I),SN$(I):NEXT
10020 CLOSE:OPEN"I",1,SF$:RESUME 10002
11000 DEF SEG = 0 : DEF SEG = PEEK(&H3FF)*256 + PEEK(&H3FE)
11010 FO = PEEK(&H70)*256 + PEEK(&H6F): FS = PEEK(&H72)*256 + PEEK(&H71)
11030 RESTORE: DEF SEG = FS : P = FO + 9*&H41
11040 FOR I= 1 TO 126:OC(I)=PEEK(P):READ Q: POKE P,Q: P=P+1: NEXT
11060 DIM BC$(4,4),HC$(4),TC$(5)
11070 BC$(1,1)="a": BC$(1,2)="a": BC$(1,3)="d": BC$(1,4)="c"
11080 BC$(2,1)="a": BC$(2,2)="a": BC$(2,3)="f": BC$(2,4)="e"
11090 BC$(3,1)="e": BC$(3,2)="c": BC$(3,3)="b": BC$(3,4)="b"
11100 BC$(4,1)="f": BC$(4,2)="d": BC$(4,3)="b": BC$(4,4)="b"
11110 HC$(1)="h": HC$(2)="g": HC$(3)="j": HC$(4)="i"
11120 TC$(1)="l": TC$(2)="k": TC$(3)="n": TC$(4)="m": TC$(5)=" "
11130 RETURN
12000 DEF SEG = 0 : DEF SEG = PEEK(&H3FF)*256 + PEEK(&H3FE)
12010 FO = PEEK(&H70)*256 + PEEK(&H6F): FS = PEEK(&H72)*256 + PEEK(&H71)
12030 DEF SEG = FS : P = FO + 9*&H41
12040 FOR I= 1 TO 126:POKE P,OC(I): P=P+1: NEXT
12050 RETURN
20000 ' straight ( vertical, horizontal)
20010 DATA &H5E,&H6E,&H7E,&H5E,&H6E,&H7E,&H5E,&H6E,&H7E
20020 DATA &H00,&H00,&H00,&HBB,&HEF,&HFF,&H00,&H00,&H00
20025 ' curves (bottom/right, bottom/left, top/right, top/left)
20030 DATA &H00,&H00,&H00,&H0B,&H3F,&H7F,&H5F,&H6E,&H7E
20040 DATA &H00,&H00,&H00,&HB0,&HEC,&HFE,&HDE,&H6E,&H7E
20050 DATA &H5E,&H6E,&H7F,&H7B,&H3F,&H0F,&H00,&H00,&H00
20060 DATA &H5E,&H6E,&HFE,&HBE,&HFC,&HF0,&H00,&H00,&H00
20065 ' heads (from top, bottom, left, right)
20070 DATA &H5E,&H6E,&H7E,&H76,&HF9,&H89,&HF9,&H78,&H00
20080 DATA &H00,&H78,&HF9,&H89,&HF9,&H76,&H7E,&H6E,&H7E
20090 DATA &H00,&H00,&HFC,&HE7,&H7F,&H80,&HFC,&H00,&H00
20100 DATA &H00,&H00,&H3F,&HE7,&HFE,&H01,&H3F,&H00,&H00
20105 ' tails (to bottom, top, left, right)
20110 DATA &H10,&H10,&H18,&H18,&H38,&H38,&H3C,&H3C,&H7C
20120 DATA &H3E,&H3C,&H3C,&H1C,&H1C,&H18,&H18,&H08,&H08
20130 DATA &H00,&H00,&H00,&H07,&HFF,&H01,&H00,&H00,&H00
20140 DATA &H00,&H00,&H00,&HC0,&H7F,&H80,&H00,&H00,&H00
30000 CLS:PRINT"   The object of the game of worm is to guide the worm to eat as much food"
30010 PRINT"as possible.  Food appears either in the form of numeric digits (1 to 9)"
30020 PRINT"or as ants (*).  Besides adding to your score, eating food makes you grow"
30030 PRINT"longer.  It is fatal to run into the electric fence surrounding the field"
30040 PRINT"and biting your tail has disasterous side affects.  You steer with any"
30050 PRINT"of the following sets of direction keys:"
30060 PRINT
30065 PRINT"             direction     arrow keys    keypad   unix-keys"
30066 PRINT"           ---------------------------------------------------"
30070 PRINT"                left:      left-arrow       4       h"
30080 PRINT"               right:      right-arrow      6       l"
30090 PRINT"                  up:       up-arrow        8       k"
30100 PRINT"                down:      down-arrow       2       j"
30110 PRINT
30120 PRINT"A few things to be careful of:"
30125 PRINT
30130 PRINT"  *  Don't use the CTRL-C key to exit.  This leaves the character set messed"
30140 PRINT"     up.  If you do hit break, type GOSUB 12000 immediately (in caps), or"
30150 PRINT"     reset the computer."
30155 PRINT
30160 PRINT"  *  Worm creates a score file on the logged disk.  The filename can"
30170 PRINT"     be set in line 11.  If you have a hard disk, you will want to change"
30180 PRINT"     it to "F:WORM.SCR"."
30190 LOCATE 25,25:PRINT"< Hit any key to continue >":I$=INPUT$(1)
30200 RETURN
30300 END`;
