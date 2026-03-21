# WORM.BAS Browser Port — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Port the 1980s Zenith Z-100 BASIC game WORM.BAS to the browser by building a minimal BASIC interpreter in JavaScript that runs the original source, with a canvas-based character grid display using the authentic Z-100 font.

**Architecture:** Single HTML file (`index.html`) with embedded JS. Three layers: (1) a BASIC tokenizer/parser that reads the original WORM.BAS source into an AST, (2) a line-stepping interpreter with variable state, GOSUB stack, FOR/NEXT stack, and expression evaluator, (3) a canvas-based 80x25 character grid renderer using the authentic Z-100 8x9 pixel font. The Z-100 character ROM reprogramming (DEF SEG/PEEK/POKE) is handled by overwriting entries in the font bitmap table. File I/O maps to localStorage.

**Tech Stack:** Vanilla HTML/CSS/JS, Canvas API. No build tools, no dependencies.

---

## Task 1: Canvas Character Grid + Z-100 Font Renderer

**Files:**
- Create: `index.html`

**Step 1: Create the HTML shell with canvas**

Create `index.html` with:
- A `<canvas>` element sized for 80x25 character cells at 8x9 pixels, scaled 3x (so 1920x675 CSS pixels, adjust to fit)
- Black background, green phosphor text (`#33ff33`)
- The Z-100 font data as a `Uint8Array` (95 chars, ASCII 32-126, 9 bytes each)
- A `Screen` class with:
  - `charROM[128]` — array of 9-byte arrays, initialized from Z-100 font for indices 32-126
  - `cells[25][80]` — stores character code at each position
  - `drawChar(row, col, charCode)` — renders 8x9 bitmap from charROM, scaled
  - `locate(row, col)` — set cursor position (1-based, matching BASIC)
  - `printStr(str)` — write string at cursor, advance cursor
  - `cls()` — clear screen
  - `screen(row, col)` — return character code at position (implements BASIC's SCREEN function)
  - `beep()` — play a short tone via Web Audio API

**Step 2: Test the font renderer manually**

Add a temporary test at the bottom of the script that:
- Calls `cls()`
- Prints "THE GAME OF WORM" at row 1, col 1
- Prints the border: `+` followed by 78 `-` followed by `+` at row 2
- Prints all printable ASCII chars in a row
- Open in browser and verify the Z-100 font renders correctly with green-on-black CRT look

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: canvas character grid with authentic Z-100 font renderer"
```

---

## Task 2: Custom Worm Sprite Loading

**Files:**
- Modify: `index.html`

**Step 1: Parse the DATA statements**

Add the worm sprite bitmaps from WORM.BAS lines 20000-20140 as a JS array. These are 14 characters × 9 bytes each = 126 bytes. The characters map to ASCII 97-110 (letters a through n):

| Index | ASCII | Letter | Purpose |
|-------|-------|--------|---------|
| 0 | 97 | a | Straight vertical |
| 1 | 98 | b | Straight horizontal |
| 2 | 99 | c | Curve bottom/right |
| 3 | 100 | d | Curve bottom/left |
| 4 | 101 | e | Curve top/right |
| 5 | 102 | f | Curve top/left |
| 6 | 103 | g | Head from top |
| 7 | 104 | h | Head from bottom |
| 8 | 105 | i | Head from left |
| 9 | 106 | j | Head from right |
| 10 | 107 | k | Tail to bottom |
| 11 | 108 | l | Tail to top |
| 12 | 109 | m | Tail to left |
| 13 | 110 | n | Tail to right |

**Step 2: Implement loadCustomChars()**

Add a function `loadCustomChars()` that overwrites `charROM[97]` through `charROM[110]` with the worm sprite data. This replaces the Z-100's DEF SEG/PEEK/POKE sequence.

**Step 3: Test visually**

Update the test code to:
- Call `loadCustomChars()`
- Print characters a-n in a row to show all worm sprites
- Verify they look like worm segments (curves, heads, tails) in the browser

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: load custom worm sprite bitmaps into character ROM"
```

---

## Task 3: BASIC Tokenizer

**Files:**
- Modify: `index.html`

**Step 1: Write the tokenizer**

Add a `Tokenizer` class that takes a line of BASIC and produces tokens. Token types needed:

- `NUMBER` — integer or float literal (including hex `&H...`)
- `STRING` — quoted string literal
- `KEYWORD` — BASIC keywords (PRINT, LOCATE, IF, THEN, ELSE, GOTO, GOSUB, RETURN, FOR, TO, NEXT, STEP, DIM, LET, CLS, BEEP, END, RUN, ON, ERROR, RESUME, OPEN, CLOSE, INPUT, DEF, SEG, PEEK, POKE, DATA, READ, RESTORE, NOT, AND, OR)
- `FUNCTION` — built-in functions (RND, INT, ASC, CHR$, STRING$, SCREEN, INKEY$, INPUT$, CSRLIN, POS, LEFT$, RIGHT$, MID$, LEN, ABS, VAL, STR$)
- `IDENT` — variable names (with optional type suffix: `$` for string, `!` for single, `%` for integer)
- `OP` — operators: `+`, `-`, `*`, `/`, `\`, `=`, `<`, `>`, `<>`, `<=`, `>=`, `(`, `)`, `,`, `;`, `:`
- `EOL` — end of line

Key quirk: BASIC uses `:` to separate multiple statements on one line. The parser handles that at the statement level.

**Step 2: Write the line parser**

Add a `Parser` class that:
- Takes the full WORM.BAS source text
- Splits into lines, extracts line numbers (note: the file has both physical line numbers and BASIC line numbers like `→1`, `→2`, etc.)
- Parses the actual BASIC line number from each line (after the `→`)
- Builds a `Map<lineNumber, statements>` ordered by line number
- Each statement is a simple AST node: `{type: "PRINT", args: [...]}`, `{type: "GOTO", target: 100}`, etc.

**Step 3: Test by parsing WORM.BAS**

Load WORM.BAS (embedded as a template literal or fetched), parse it, and `console.log` the resulting AST. Verify in browser console that all 173 lines parse without errors.

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: BASIC tokenizer and line parser"
```

---

## Task 4: Expression Evaluator

**Files:**
- Modify: `index.html`

**Step 1: Write the expression evaluator**

Add an `evaluate(expr, env)` function using recursive descent with standard precedence:

1. `OR`
2. `AND`
3. `NOT` (unary)
4. Comparison: `=`, `<>`, `<`, `>`, `<=`, `>=`
5. Addition: `+`, `-`
6. Multiplication: `*`, `/`, `\` (integer division)
7. Unary: `-`, `+`
8. Primary: numbers, strings, variables, function calls, parenthesized expressions

The environment (`env`) holds all BASIC variables. Variable types:
- Names ending in `$` are strings
- Names ending in `!` are floats
- Everything else is integer (due to `DEFINT A-Z`)

Implement built-in functions:
- `RND` — `Math.random()` (BASIC's RND ignores its argument mostly)
- `INT(x)` — `Math.floor(x)`
- `ASC(s)` — `s.charCodeAt(0)`
- `CHR$(n)` — `String.fromCharCode(n)`
- `STRING$(n, s)` — repeat character `n` times (s can be string or char code)
- `SCREEN(r, c)` — read char code from screen grid
- `INKEY$` — pop from keyboard buffer or return ""
- `INPUT$(n)` — block until n keypresses collected
- `CSRLIN` — current cursor row
- `POS(0)` — current cursor column
- `LEFT$(s,n)`, `RIGHT$(s,n)`, `MID$(s,n,m)` — string slicing
- `LEN(s)` — string length
- `ABS(n)`, `VAL(s)`, `STR$(n)` — conversions

**Step 2: Test with sample expressions**

Add console tests:
- `INT(8*RND)+9` should return 9-16
- `ASC("A")` should return 65
- `CHR$(65)` should return "A"
- `STRING$(5, "-")` should return "-----"

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: BASIC expression evaluator with built-in functions"
```

---

## Task 5: Core Interpreter — Statements + Control Flow

**Files:**
- Modify: `index.html`

**Step 1: Write the interpreter core**

Add an `Interpreter` class with:

**State:**
- `pc` — current line number
- `lines` — ordered map of line numbers to statement lists
- `env` — variable environment (object)
- `gosubStack` — return addresses for GOSUB/RETURN
- `forStack` — FOR loop state: `{varName, limit, step, returnLine, stmtIndex}`
- `dataPointer` — current position in DATA statements
- `dataValues` — all DATA values collected from source
- `keyBuffer` — array of keypresses from keyboard events
- `running` — boolean
- `waitingForKey` — flag for INPUT$(1) blocking

**Statement handlers:**
- `PRINT` — evaluate args, call screen.printStr(), handle `;` (no newline) and `,` (tab)
- `LOCATE` — call screen.locate(row, col)
- `CLS` — call screen.cls()
- `BEEP` — call screen.beep()
- `GOTO n` — set pc to n
- `GOSUB n` / `RETURN` — push/pop gosubStack
- `FOR var = start TO end [STEP s]` / `NEXT` — push/pop forStack
- `IF cond THEN ... [ELSE ...]` — evaluate condition, branch. THEN can be followed by a line number (implicit GOTO) or inline statements
- `ON expr GOTO n1,n2,...` — computed goto
- `DIM` — allocate arrays in env
- `LET` / assignment — `var = expr` or `var(index) = expr`
- `DEF SEG` / `PEEK` / `POKE` — special-cased: the init sequence at lines 11000-11050 loads custom chars. Detect this pattern and call `loadCustomChars()`. The restore sequence at 12000 calls `restoreChars()`.
- `OPEN` / `CLOSE` / `PRINT #` / `INPUT #` — localStorage-backed file I/O
- `ON ERROR GOTO` — set error handler line
- `DATA` — skip (already collected at parse time)
- `READ` — read next value from dataValues
- `RESTORE` — reset dataPointer to 0
- `END` — stop execution
- `RUN` — restart from beginning
- `DEFINT` — no-op (we handle types by suffix)

**Step 2: Implement the main loop**

The interpreter runs via `setTimeout` to yield to the browser:

```javascript
step() {
    // Execute statements at current line
    // Advance pc to next line number
    // Handle INKEY$ speed delay: the game's FOR J=1 TO S loop (line 4000)
    //   becomes a real delay of S milliseconds
    // Schedule next step via setTimeout
}
```

Key async points:
- `INKEY$` — non-blocking keyboard check (return "" or buffered key)
- `INPUT$(1)` — blocking wait for keypress (pause interpreter, resume on keydown)
- Speed delay loops — detect `FOR J=1 TO S` patterns in the input handler (line 4000) and convert to setTimeout delays

**Step 3: Wire up keyboard input**

Add a `keydown` event listener that:
- Maps arrow keys to the Z-100 codes used in lines 4550-4580 (ASCII 28-31)
- Pushes regular keypresses to keyBuffer
- Handles special keys (Enter = 13, Backspace = 8)

**Step 4: Test by running the game**

Remove the manual test code. Load WORM.BAS, parse it, and run the interpreter. The game should show the version selection menu (lines 9000-9070). Pressing 1-5 should start the game. Debug any parse or runtime errors.

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: BASIC interpreter core with control flow and keyboard input"
```

---

## Task 6: File I/O via localStorage

**Files:**
- Modify: `index.html`

**Step 1: Implement file operations**

Add a `FileSystem` class:
- `open(mode, channel, filename)` — mode "I" for input, "O" for output. Read from / prepare to write to `localStorage["WORM_" + filename]`
- `printToFile(channel, ...values)` — append values to output buffer
- `inputFromFile(channel, ...varNames)` — read values from input buffer, parse as number or string
- `close(channel)` — if output mode, flush buffer to localStorage

**Step 2: Handle ON ERROR GOTO for missing score file**

The game uses ON ERROR GOTO 10005 (line 10000) to handle the case where WORM.DAT doesn't exist. When `open("I", ...)` fails because the localStorage key doesn't exist, jump to the error handler line.

**Step 3: Test the score flow**

Play the game, die, verify the "Want to play again" prompt appears. If you set a high score, verify it prompts for initials and persists to localStorage.

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: file I/O via localStorage for high score persistence"
```

---

## Task 7: Polish and Finishing Touches

**Files:**
- Modify: `index.html`

**Step 1: CRT visual effects**

Add subtle CSS/canvas effects for authenticity:
- Scanline overlay (semi-transparent horizontal lines every other pixel row)
- Slight green phosphor glow (CSS `text-shadow` or canvas shadow on the whole canvas)
- Dark border around the "monitor" area

**Step 2: Handle edge cases**

- `RUN` statement (line 2550) should restart the game completely
- The initials entry routine (lines 9500-9560) needs careful cursor handling
- `RESUME` statement (line 10020) — jump back after error
- Ensure `STRING$(L-2, BC$(ND,ND))` works (STRING$ with a string arg uses first char)

**Step 3: Add instructions overlay**

Add a small "Click to start" or "Press any key" overlay before the game starts, since the browser needs a user interaction before it can capture keyboard input.

**Step 4: Final testing**

Test all 5 game modes:
1. Original Worm (no self-eating, no ants, slow)
2. Improved Worm (self-eating, rare ants, medium)
3. At the Ant Farm (self-eating, all ants, medium-slow)
4. SuperWorm (self-eating, rare ants, fast)
5. SuperWorm At the Ant Farm (self-eating, all ants, fast)

Verify: borders render, worm moves with all control schemes (arrows/hjkl/2468), food appears, score updates, collision kills, high scores save.

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: CRT effects, edge cases, and final polish"
```

---

## Notes

**WORM.BAS line number mapping:** The file has two numbering systems — physical file lines (1-173) and BASIC line numbers (1-30300). The BASIC line numbers are what appears after the `→` on each line. The interpreter uses BASIC line numbers for GOTO/GOSUB.

**The DEF SEG/PEEK/POKE pattern:** Lines 11000-11050 read the Z-100's character generator ROM address from low memory, then POKE 126 bytes of custom character data starting at the font table offset for character `A` (0x41). We don't need to emulate the memory addressing — we just detect that the interpreter is executing these lines and call our `loadCustomChars()` function instead. Similarly, lines 12000-12050 restore the original characters.

**Speed calibration:** The original game's speed is controlled by the `S` variable (1 to 50). In the `FOR J=1 TO S` delay loop (line 4000), each iteration would have taken roughly 1ms on the Z-100's 4.77MHz 8088. So `S=50` ≈ 50ms delay, `S=1` ≈ 1ms (very fast). We should experiment to find the right `setTimeout` delay multiplier that feels authentic.

**The `SCREEN(r,c)` function** is critical — the game uses it to detect collisions by reading what character is at the position the worm is about to move into. Our `cells[][]` grid handles this naturally.
